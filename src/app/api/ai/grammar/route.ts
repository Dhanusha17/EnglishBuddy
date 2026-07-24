import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";
import { ai, DEFAULT_MODEL, handleAiError } from "@/lib/gemini";
import { rateLimit } from "@/lib/rate-limit";
import { awardXp, updateStreak } from "@/lib/gamification";

const grammarSchema = z.object({
  text: z.string().min(10, "Please provide at least a short sentence.").max(2000),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rateLimitResponse = rateLimit(req, 10, 60000);
  if (rateLimitResponse) return rateLimitResponse;

  const body = await req.json();
  const { text } = grammarSchema.parse(body);

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `You are an expert English grammar checker. Evaluate the following text and provide a structured JSON response.
Do NOT use markdown code blocks like \`\`\`json. Return pure JSON.
JSON format:
{
  "correctedText": "The fully corrected version of the text",
  "mistakes": [
    { "original": "wrong part", "correction": "correct part", "explanation": "Why it was wrong" }
  ],
  "explanation": "Overall explanation of the major mistakes or feedback on the writing.",
  "score": 85 // An integer out of 100 representing grammar correctness
}

Text to evaluate:
${text}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const aiText = response.text || "{}";
    const result = JSON.parse(aiText);

    // Save report
    await db.grammarReport.create({
      data: {
        userId: session.sub,
        originalText: text,
        correctedText: result.correctedText || "",
        mistakes: JSON.stringify(result.mistakes || []),
        explanation: result.explanation || "",
        score: result.score || 0,
      }
    });

    await db.aiUsageAnalytics.create({
      data: { userId: session.sub, module: "GRAMMAR", tokensUsed: 0 }
    });

    // Gamification Hooks
    await updateStreak(session.sub);
    await awardXp(session.sub, 10, "AI_GRAMMAR_" + Date.now());

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(handleAiError(err), { status: 503 });
  }
});