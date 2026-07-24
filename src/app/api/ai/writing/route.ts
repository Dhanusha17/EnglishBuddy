import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";
import { ai, DEFAULT_MODEL, handleAiError } from "@/lib/gemini";
import { rateLimit } from "@/lib/rate-limit";
import { awardXp, updateStreak } from "@/lib/gamification";

const writingSchema = z.object({
  text: z.string().min(50, "Please provide a longer text (at least 50 chars) for writing evaluation.").max(5000),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rateLimitResponse = rateLimit(req, 5, 60000);
  if (rateLimitResponse) return rateLimitResponse;

  const body = await req.json();
  const { text } = writingSchema.parse(body);

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `You are an expert Writing Assistant and Evaluator. Review the following text and provide structured JSON feedback.
Do NOT use markdown code blocks like \`\`\`json. Return pure JSON.
JSON format:
{
  "grammarScore": 80,
  "vocabularyScore": 75,
  "clarityScore": 90,
  "structureScore": 85,
  "toneScore": 88,
  "suggestions": [
    "Use stronger verbs instead of 'is going'.",
    "Split the long sentence in the second paragraph."
  ]
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
    await db.writingReport.create({
      data: {
        userId: session.sub,
        originalText: text,
        grammarScore: result.grammarScore || 0,
        vocabularyScore: result.vocabularyScore || 0,
        clarityScore: result.clarityScore || 0,
        structureScore: result.structureScore || 0,
        toneScore: result.toneScore || 0,
        suggestions: JSON.stringify(result.suggestions || []),
      }
    });

    await db.aiUsageAnalytics.create({
      data: { userId: session.sub, module: "WRITING", tokensUsed: 0 }
    });

    await updateStreak(session.sub);
    await awardXp(session.sub, 25, "AI_WRITING_" + Date.now());

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(handleAiError(err), { status: 503 });
  }
});