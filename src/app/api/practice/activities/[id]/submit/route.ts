import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { awardXp } from "@/lib/gamification";
import { z } from "zod";

const submitSchema = z.object({
  score: z.number().min(0).max(100),
  durationSec: z.number().min(1),
  content: z.string().optional(), // Audio transcript, essay, etc.
});

export const POST = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const parsed = submitSchema.parse(body);

    const activity = await db.practiceActivity.findUnique({
      where: { id },
    });

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    // AI scoring placeholder: Since AI is out of scope for Phase 2,
    // we use the provided score directly from the frontend payload or a simple algo.
    // In production, the backend would call the AI provider here.

    const attempt = await db.practiceAttempt.create({
      data: {
        userId: session.sub,
        activityId: id,
        score: parsed.score,
        durationSec: parsed.durationSec,
      },
    });

    // Update Skill Progress
    await db.userSkillProgress.upsert({
      where: {
        userId_skill: {
          userId: session.sub,
          skill: activity.type,
        },
      },
      update: {
        xp: { increment: activity.xpReward },
      },
      create: {
        userId: session.sub,
        skill: activity.type,
        xp: activity.xpReward,
      },
    });

    // Trigger Gamification Engine
    const rewards = await awardXp(session.sub, activity.xpReward, "Practice Activity Complete");

    return NextResponse.json({
      message: "Practice completed",
      attempt,
      rewards,
    });
  }
);
