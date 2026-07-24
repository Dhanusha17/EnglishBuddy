import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { createAnnouncement } from "@/lib/notifications";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, content, isPinned } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content required" }, { status: 400 });
  }

  const announcement = await createAnnouncement(title, content, !!isPinned);

  return NextResponse.json({ message: "Announcement broadcasted successfully", data: announcement }, { status: 201 });
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const logs = await db.announcement.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(logs);
});
