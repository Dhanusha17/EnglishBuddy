import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const quiz = await db.quiz.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        include: { options: true }
      }
    }
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  return NextResponse.json(quiz);
});

export const PATCH = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, courseId, lessonId, timeLimit, passScore, randomize, status } = body;

  const quiz = await db.quiz.update({
    where: { id: params.id },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(courseId !== undefined && { courseId }),
      ...(lessonId !== undefined && { lessonId }),
      ...(timeLimit !== undefined && { timeLimit }),
      ...(passScore !== undefined && { passScore }),
      ...(randomize !== undefined && { randomize }),
      ...(status && { status }),
    },
  });

  return NextResponse.json(quiz);
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await db.quiz.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Quiz deleted successfully" });
});
