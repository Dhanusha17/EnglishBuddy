import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const problems = await db.codingProblem.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: true } } }
  });

  return NextResponse.json(problems);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, difficulty, category, testCases } = body;

  const problem = await db.codingProblem.create({
    data: {
      title,
      description,
      difficulty,
      category,
      testCases
    }
  });

  return NextResponse.json(problem, { status: 201 });
});
