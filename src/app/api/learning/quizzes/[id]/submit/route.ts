import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const POST = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { answers, timeTaken } = body; // answers is an object mapping questionId -> answer (text or optionId)

  const quiz = await db.quiz.findUnique({
    where: { id: params.id, status: "PUBLISHED" },
    include: {
      questions: {
        include: { options: true }
      }
    }
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  let totalMarks = 0;
  let maxPossibleMarks = 0;
  
  const evaluatedAnswers = quiz.questions.map(q => {
    maxPossibleMarks += q.marks;
    const userAnswer = answers[q.id];
    let isCorrect = false;
    let marksAwarded = 0;

    if (userAnswer) {
      if (q.type === "MCQ" || q.type === "TRUE_FALSE") {
        const selectedOption = q.options.find(opt => opt.id === userAnswer);
        if (selectedOption?.isCorrect) {
          isCorrect = true;
          marksAwarded = q.marks;
        }
      } else if (q.type === "SHORT_ANSWER") {
        // Find the correct option, or compare directly if options aren't used for short answers
        // For our design, we can assume options hold the acceptable short answers where isCorrect is true
        const correctOptions = q.options.filter(opt => opt.isCorrect);
        if (correctOptions.length > 0) {
          isCorrect = correctOptions.some(opt => opt.text.trim().toLowerCase() === userAnswer.trim().toLowerCase());
        }
        if (isCorrect) marksAwarded = q.marks;
      }
    }
    
    totalMarks += marksAwarded;

    return {
      questionId: q.id,
      answerText: String(userAnswer || ""),
      isCorrect,
      marksAwarded
    };
  });

  const percentage = maxPossibleMarks > 0 ? Math.round((totalMarks / maxPossibleMarks) * 100) : 0;
  const passed = percentage >= quiz.passScore;

  const attempt = await db.quizAttempt.create({
    data: {
      quizId: quiz.id,
      userId: session.sub,
      score: totalMarks,
      percentage,
      passed,
      timeTaken: timeTaken || 0,
      completedAt: new Date(),
      answers: {
        create: evaluatedAnswers
      }
    }
  });

  return NextResponse.json({
    message: "Quiz submitted successfully",
    attemptId: attempt.id,
    score: totalMarks,
    percentage,
    passed
  }, { status: 201 });
});
