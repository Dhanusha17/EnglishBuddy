import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  const userId = session?.sub;

  const topUsers = await db.profile.findMany({
    orderBy: { currentXp: "desc" },
    take: 10,
    include: { user: { select: { name: true } } }
  });

  const entries = topUsers.map((p, index) => ({
    id: p.userId,
    name: p.user.name,
    score: p.currentXp,
    rank: index + 1,
    isCurrentUser: p.userId === userId
  }));

  return NextResponse.json(entries);
});
