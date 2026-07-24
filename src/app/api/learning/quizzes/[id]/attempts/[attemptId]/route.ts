import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string, attemptId: string } }) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const attempt = await db.quizAttempt.findUnique({
    where: { 
      id: params.attemptId,
      quizId: params.id,
      userId: session.sub
    },
    include: {
      quiz: true,
      answers: {
        include: {
          question: {
            include: { options: true }
          }
        }
      }
    }
  });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  return NextResponse.json(attempt);
});
