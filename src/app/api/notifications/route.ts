import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

// GET /api/notifications
// Retrieves notifications for the logged in user
export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await db.notification.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  const unreadCount = await db.notification.count({
    where: { userId: session.sub, isRead: false }
  });

  return NextResponse.json({ data: notifications, unreadCount });
});
