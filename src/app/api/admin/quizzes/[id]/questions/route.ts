import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const POST = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { question, type, explanation, difficulty, marks, tags, options } = body;

  if (!question || !type) {
    return NextResponse.json({ error: "Question and type are required" }, { status: 400 });
  }

  const quizQuestion = await db.quizQuestion.create({
    data: {
      quizId: params.id,
      question,
      type,
      explanation,
      difficulty: difficulty || "Medium",
      marks: marks || 1,
      tags,
      options: {
        create: options?.map((opt: any) => ({
          text: opt.text,
          isCorrect: opt.isCorrect || false
        })) || []
      }
    },
    include: {
      options: true
    }
  });

  return NextResponse.json(quizQuestion, { status: 201 });
});
