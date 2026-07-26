import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const logs = await db.adminLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200, // Limit for admin view
    });
    return NextResponse.json({ data: logs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin logs" }, { status: 500 });
  }
}
