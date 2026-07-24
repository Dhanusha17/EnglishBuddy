import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quiz = await db.quiz.findUnique({
    where: { id: params.id, status: "PUBLISHED" },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          type: true,
          difficulty: true,
          marks: true,
          options: {
            select: { id: true, text: true } // Omit isCorrect for students!
          }
        }
      },
      attempts: {
        where: { userId: session.sub },
        orderBy: { startedAt: "desc" }
      }
    }
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  // If randomize is true, shuffle questions
  if (quiz.randomize && quiz.questions) {
    const questions = [...quiz.questions];
    questions.sort(() => Math.random() - 0.5);
    questions.forEach((q: any) => {
      if (q.options) {
        q.options.sort(() => Math.random() - 0.5);
      }
    });
    return NextResponse.json({ ...quiz, questions });
  }

  return NextResponse.json(quiz);
});
