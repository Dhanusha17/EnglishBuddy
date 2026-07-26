import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const notifications = await db.notification.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit for admin view
    });
    return NextResponse.json({ data: notifications });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const notification = await db.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        category: data.category || "SYSTEM",
      },
    });
    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
