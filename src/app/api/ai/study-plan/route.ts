import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";
import { ai, DEFAULT_MODEL, handleAiError } from "@/lib/gemini";
import { rateLimit } from "@/lib/rate-limit";
import { awardXp, updateStreak } from "@/lib/gamification";

const planSchema = z.object({
  currentLevel: z.string(),
  goal: z.string(),
  weakTopics: z.array(z.string()),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rateLimitResponse = rateLimit(req, 5, 60000);
  if (rateLimitResponse) return rateLimitResponse;

  const body = await req.json();
  const { currentLevel, goal, weakTopics } = planSchema.parse(body);

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `You are an expert Study Planner. Generate a 4-week personalized study plan.
Return pure JSON without markdown blocks.
JSON format:
{
  "planDetails": [
    {
      "week": 1,
      "focus": "Main focus of the week",
      "activities": ["Activity 1", "Activity 2"]
    }
  ]
}

User Info:
Current Level: ${currentLevel}
Goal: ${goal}
Weak Topics: ${weakTopics.join(", ")}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const aiText = response.text || "{}";
    const result = JSON.parse(aiText);

    // Save report
    await db.studyPlan.create({
      data: {
        userId: session.sub,
        currentLevel: currentLevel,
        goal: goal,
        weakTopics: JSON.stringify(weakTopics),
        planDetails: JSON.stringify(result.planDetails || []),
      }
    });

    await db.aiUsageAnalytics.create({
      data: { userId: session.sub, module: "STUDY_PLAN", tokensUsed: 0 }
    });

    await updateStreak(session.sub);
    await awardXp(session.sub, 15, "AI_STUDY_PLAN_" + Date.now());

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(handleAiError(err), { status: 503 });
  }
});
