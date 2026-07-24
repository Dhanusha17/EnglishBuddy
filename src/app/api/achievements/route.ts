import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const achievements = await db.achievement.findMany({
    orderBy: { title: "asc" }
  });
  return NextResponse.json(achievements);
});
