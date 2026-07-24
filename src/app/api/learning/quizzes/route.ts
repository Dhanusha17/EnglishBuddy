import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const lessonId = searchParams.get("lessonId");

  const quizzes = await db.quiz.findMany({
    where: {
      status: "PUBLISHED",
      ...(courseId && { courseId }),
      ...(lessonId && { lessonId }),
    },
    include: {
      _count: {
        select: { questions: true }
      },
      attempts: {
        where: { userId: session.sub },
        orderBy: { score: "desc" },
        take: 1
      }
    }
  });

  return NextResponse.json({ data: quizzes });
});
