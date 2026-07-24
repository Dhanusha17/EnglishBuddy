import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const lessons = await db.lesson.findMany({
    where: { courseId: params.id },
    orderBy: { orderIndex: "asc" },
  });

  return NextResponse.json(lessons);
});

export const POST = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { title, orderIndex, videoUrl, pdfNotes, textContent, vocabulary, grammarNotes, exercises, quiz, duration, xpReward, status } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const courseId = params.id;
  const courseExists = await db.course.findUnique({ where: { id: courseId } });
  if (!courseExists) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const lesson = await db.lesson.create({
    data: {
      courseId,
      title,
      orderIndex: orderIndex || 0,
      videoUrl,
      pdfNotes,
      textContent,
      vocabulary,
      grammarNotes,
      exercises,
      quiz,
      duration,
      xpReward: xpReward || 10,
      status: status || "DRAFT"
    },
  });

  return NextResponse.json(lesson, { status: 201 });
});
