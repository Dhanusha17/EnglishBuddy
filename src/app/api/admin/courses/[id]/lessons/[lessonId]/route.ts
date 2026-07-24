import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const PATCH = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string, lessonId: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { title, orderIndex, videoUrl, pdfNotes, textContent, vocabulary, grammarNotes, exercises, quiz, duration, xpReward, status } = body;

  const lesson = await db.lesson.update({
    where: { id: params.lessonId, courseId: params.id },
    data: {
      ...(title && { title }),
      ...(orderIndex !== undefined && { orderIndex }),
      ...(videoUrl !== undefined && { videoUrl }),
      ...(pdfNotes !== undefined && { pdfNotes }),
      ...(textContent !== undefined && { textContent }),
      ...(vocabulary !== undefined && { vocabulary }),
      ...(grammarNotes !== undefined && { grammarNotes }),
      ...(exercises !== undefined && { exercises }),
      ...(quiz !== undefined && { quiz }),
      ...(duration !== undefined && { duration }),
      ...(xpReward !== undefined && { xpReward }),
      ...(status && { status }),
    },
  });

  return NextResponse.json(lesson);
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string, lessonId: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await db.lesson.delete({
    where: { id: params.lessonId, courseId: params.id },
  });

  return NextResponse.json({ message: "Lesson deleted successfully" });
});
