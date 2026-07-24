import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

// PATCH /api/notifications/read-all
export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.notification.updateMany({
    where: { userId: session.sub, isRead: false },
    data: { isRead: true }
  });

  return NextResponse.json({ message: "All notifications marked as read." });
});
