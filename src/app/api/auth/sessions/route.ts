import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await db.userSession.findMany({
    where: {
      userId: session.sub,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      lastActive: true,
      createdAt: true,
    },
    orderBy: { lastActive: "desc" },
  });

  return NextResponse.json({ data: sessions });
});

export const DELETE = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("id");

  if (sessionId) {
    // Revoke single session
    await db.userSession.updateMany({
      where: { id: sessionId, userId: session.sub },
      data: { isRevoked: true },
    });
  } else {
    // Revoke all other sessions for this user
    await db.userSession.updateMany({
      where: { userId: session.sub, id: { not: session.sessionId } },
      data: { isRevoked: true },
    });
  }

  return NextResponse.json({ message: "Session(s) revoked successfully." });
});
