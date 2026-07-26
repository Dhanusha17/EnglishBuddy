import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const tests = await db.test.findMany({
      include: { attempts: true }
    });
    return NextResponse.json({ data: tests });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const test = await db.test.create({
      data: {
        title: data.title || "New Test",
        type: data.type || "MOCK",
        timeLimit: data.timeLimit || 30,
        passScore: data.passScore || 60,
        status: data.status || "DRAFT"
      },
    });
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create test" }, { status: 500 });
  }
}
