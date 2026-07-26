import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const posts = await db.communityPost.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: posts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch community posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const adminUser = await db.user.findFirst(); // In a real app, get from session
    if (!adminUser) return NextResponse.json({ error: "No admin user found" }, { status: 400 });

    const post = await db.communityPost.create({
      data: {
        title: data.title || "New Announcement",
        content: data.content || "Empty content",
        category: data.category || "General",
        userId: adminUser.id
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
