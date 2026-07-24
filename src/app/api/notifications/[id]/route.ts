import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

// PATCH /api/notifications/[id]/read
export const PATCH = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notification = await db.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== session.sub) {
    return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
  }

  await db.notification.update({
    where: { id },
    data: { isRead: true }
  });

  return NextResponse.json({ message: "Notification marked as read." });
});

// DELETE /api/notifications/[id]
export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notification = await db.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== session.sub) {
    return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
  }

  await db.notification.delete({
    where: { id }
  });

  return NextResponse.json({ message: "Notification deleted." });
});
