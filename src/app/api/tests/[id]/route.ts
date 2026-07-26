import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const test = await db.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            answers: true,
          }
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Don't send isCorrect to the client!
    const sanitizedTest = {
      ...test,
      questions: test.questions.map((q) => ({
        id: q.id,
        content: q.content,
        type: q.type,
        points: q.points,
        answers: q.answers.map((a) => ({
          id: a.id,
          content: a.content,
        })),
      })),
    };

    return NextResponse.json(sanitizedTest);
  }
);
