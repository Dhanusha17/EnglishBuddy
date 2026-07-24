import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const quizzes = await db.quiz.findMany({
    where: {
      ...(status && { status }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { questions: true, attempts: true }
      }
    }
  });

  return NextResponse.json({ data: quizzes });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, courseId, lessonId, timeLimit, passScore, randomize, status } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const quiz = await db.quiz.create({
    data: {
      title,
      description,
      courseId,
      lessonId,
      timeLimit,
      passScore: passScore || 50,
      randomize: randomize || false,
      status: status || "DRAFT"
    },
  });

  return NextResponse.json(quiz, { status: 201 });
});
