import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";
import { ai, DEFAULT_MODEL, handleAiError } from "@/lib/gemini";
import { rateLimit } from "@/lib/rate-limit";

const chatSchema = z.object({
  message: z.string().min(1, "Message is required").max(1000),
  conversationId: z.string().uuid().optional(),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rateLimitResponse = rateLimit(req, 10, 60000); // 10 requests per minute
  if (rateLimitResponse) return rateLimitResponse;

  const body = await req.json();
  const { message, conversationId } = chatSchema.parse(body);

  let convoId = conversationId;

  // Create new conversation if none exists
  if (!convoId) {
    const convo = await db.aiConversation.create({
      data: {
        userId: session.sub,
        agentType: "TUTOR",
        title: message.substring(0, 50) + "...",
      },
    });
    convoId = convo.id;
  } else {
    // Validate ownership
    const convo = await db.aiConversation.findUnique({ where: { id: convoId } });
    if (!convo || convo.userId !== session.sub) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
  }

  // Fetch previous messages for context (last 10)
  const prevMessages = await db.aiMessage.findMany({
    where: { conversationId: convoId },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  const contents = prevMessages.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  // Add the new user message
  contents.push({ role: "user", parts: [{ text: message }] });

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents,
      config: {
        systemInstruction: "You are a helpful and encouraging English Buddy tutor. Answer programming, placement, and English questions in a friendly, clear, and concise way.",
      }
    });

    const aiText = response.text || "I'm sorry, I couldn't generate a response.";

    // Save user message
    await db.aiMessage.create({
      data: {
        conversationId: convoId,
        userId: session.sub,
        role: "user",
        content: message,
      },
    });

    // Save AI response
    await db.aiMessage.create({
      data: {
        conversationId: convoId,
        userId: session.sub,
        role: "model",
        content: aiText,
      },
    });

    // Track usage
    await db.aiUsageAnalytics.create({
      data: {
        userId: session.sub,
        module: "CHAT",
        tokensUsed: 0, // Not explicitly tracked in simple calls yet
      }
    });

    return NextResponse.json({ reply: aiText, conversationId: convoId });
  } catch (err) {
    return NextResponse.json(handleAiError(err), { status: 503 });
  }
});