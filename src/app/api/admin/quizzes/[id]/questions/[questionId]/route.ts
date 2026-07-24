import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const PATCH = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string, questionId: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { question, type, explanation, difficulty, marks, tags, options } = body;

  // Update question details
  const updatedQuestion = await db.quizQuestion.update({
    where: { id: params.questionId, quizId: params.id },
    data: {
      ...(question && { question }),
      ...(type && { type }),
      ...(explanation !== undefined && { explanation }),
      ...(difficulty && { difficulty }),
      ...(marks !== undefined && { marks }),
      ...(tags !== undefined && { tags }),
    },
  });

  // Handle options separately if provided
  if (options && Array.isArray(options)) {
    // Delete existing options
    await db.quizOption.deleteMany({
      where: { questionId: params.questionId }
    });
    
    // Create new options
    if (options.length > 0) {
      await db.quizOption.createMany({
        data: options.map(opt => ({
          questionId: params.questionId,
          text: opt.text,
          isCorrect: opt.isCorrect || false
        }))
      });
    }
  }

  const finalQuestion = await db.quizQuestion.findUnique({
    where: { id: params.questionId },
    include: { options: true }
  });

  return NextResponse.json(finalQuestion);
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string, questionId: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await db.quizQuestion.delete({
    where: { id: params.questionId, quizId: params.id },
  });

  return NextResponse.json({ message: "Question deleted successfully" });
});
