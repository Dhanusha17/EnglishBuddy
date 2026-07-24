import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const problems = await db.codingProblem.findMany({
    orderBy: { createdAt: "desc" }
  });

  // Get user submissions to indicate if solved
  const submissions = await db.codingSubmission.findMany({
    where: { userId: session.sub, status: "ACCEPTED" },
    select: { problemId: true }
  });

  const solvedSet = new Set(submissions.map(s => s.problemId));

  const result = problems.map(p => ({
    ...p,
    isSolved: solvedSet.has(p.id)
  }));

  return NextResponse.json(result);
});
