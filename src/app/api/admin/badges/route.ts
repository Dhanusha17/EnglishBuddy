import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const badges = await db.badge.findMany({
      include: { user: { select: { name: true } }, achievement: true },
      orderBy: { earnedAt: 'desc' },
    });
    return NextResponse.json({ data: badges });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const badge = await db.badge.create({
      data: {
        userId: data.userId,
        achievementId: data.achievementId,
      },
    });
    return NextResponse.json(badge);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create badge" }, { status: 500 });
  }
}
