import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const POST = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const test = await db.test.findUnique({
      where: { id },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const attempt = await db.testAttempt.create({
      data: {
        userId: session.sub,
        testId: id,
        startedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Test started",
      attemptId: attempt.id,
      timeLimit: test.timeLimit,
    });
  }
);
