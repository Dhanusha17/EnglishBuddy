import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const problem = await db.codingProblem.findUnique({
    where: { id }
  });

  if (!problem) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(problem);
});
