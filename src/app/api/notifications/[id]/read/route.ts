import { NextResponse } from "next/server";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";

export const PATCH = withErrorHandler(async (req: Request, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Make sure notification belongs to user
  const notification = await db.notification.findUnique({
    where: { id: params.id },
  });

  if (!notification || notification.userId !== session.sub) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await db.notification.update({
    where: { id: params.id },
    data: { isRead: true },
  });

  return NextResponse.json(updated, { status: 200 });
});
