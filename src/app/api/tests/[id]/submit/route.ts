import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { awardXp } from "@/lib/gamification";
import { z } from "zod";

const submitSchema = z.object({
  attemptId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      optionId: z.string().optional(),
      textValue: z.string().optional(),
    })
  ),
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

    const test = await db.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: { answers: true },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const attempt = await db.testAttempt.findUnique({
      where: { id: parsed.attemptId },
    });

    if (!attempt || attempt.userId !== session.sub) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    if (attempt.completedAt) {
      return NextResponse.json({ error: "Test already submitted" }, { status: 400 });
    }

    // Evaluate answers
    let score = 0;
    for (const answer of parsed.answers) {
      const question = test.questions.find((q) => q.id === answer.questionId);
      if (!question) continue;

      if (question.type === "MULTIPLE_CHOICE" && answer.optionId) {
        const option = question.answers.find((a) => a.id === answer.optionId);
        if (option && option.isCorrect) {
          score += question.points;
        }
      }
      // Add logic for text/audio evaluation if needed later
    }

    const passed = score >= test.passScore;

    // Save attempt results
    const updatedAttempt = await db.testAttempt.update({
      where: { id: attempt.id },
      data: {
        score,
        passed,
        completedAt: new Date(),
      },
    });

    // Gamification
    let rewards = null;
    if (passed) {
      rewards = await awardXp(session.sub, 50, "Test Submit");
    }

    return NextResponse.json({
      message: "Test submitted",
      score,
      passed,
      rewards,
    });
  }
);
