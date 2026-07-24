import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";
import { ai, DEFAULT_MODEL, handleAiError } from "@/lib/gemini";
import { rateLimit } from "@/lib/rate-limit";
import { awardXp, updateStreak } from "@/lib/gamification";

const interviewSchema = z.object({
  type: z.enum(["HR", "TECHNICAL", "BEHAVIORAL"]),
  transcript: z.array(z.object({
    role: z.string(),
    content: z.string()
  })).min(1, "Transcript must have at least one message"),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rateLimitResponse = rateLimit(req, 5, 60000);
  if (rateLimitResponse) return rateLimitResponse;

  const body = await req.json();
  const { type, transcript } = interviewSchema.parse(body);

  try {
    const formattedTranscript = transcript.map(m => `${m.role}: ${m.content}`).join("\n");

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `You are an expert Interview Coach. Evaluate the following ${type} interview transcript.
Return pure JSON without markdown blocks.
JSON format:
{
  "confidenceScore": 85,
  "clarityScore": 90,
  "relevanceScore": 88,
  "overallFeedback": "A detailed paragraph explaining what went well and what to improve."
}

Transcript:
${formattedTranscript}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const aiText = response.text || "{}";
    const result = JSON.parse(aiText);

    // Save report
    await db.aiInterviewAttempt.create({
      data: {
        userId: session.sub,
        type: type,
        transcript: JSON.stringify(transcript),
        confidenceScore: result.confidenceScore || 0,
        clarityScore: result.clarityScore || 0,
        relevanceScore: result.relevanceScore || 0,
        overallFeedback: result.overallFeedback || "",
      }
    });

    await db.aiUsageAnalytics.create({
      data: { userId: session.sub, module: "INTERVIEW", tokensUsed: 0 }
    });

    await updateStreak(session.sub);
    await awardXp(session.sub, 40, "AI_INTERVIEW_" + Date.now());

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(handleAiError(err), { status: 503 });
  }
});