import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");

  if (section === "forum" || section === "qa") {
    const posts = await db.communityPost.findMany({
      take: 10,
      include: { user: { select: { name: true } } }
    });
    return NextResponse.json(posts.map((p: any) => ({
      title: p.title,
      author: p.user.name,
      avatarInitials: p.user.name.substring(0, 2).toUpperCase(),
      timeAgo: "Recently",
      category: p.category || "General",
      contentPreview: p.content.substring(0, 100),
      upvotes: p.upvotes,
      replies: 0,
      isPinned: p.isPinned
    })));
  }

  if (section === "groups") {
    const groups = await db.studyGroup.findMany({ take: 10 });
    return NextResponse.json(groups.map((g: any) => ({
      title: g.name,
      description: g.description,
      category: "General",
      membersCount: g.maxMembers,
      weeklyGoal: "Practice English",
      colorClass: "bg-indigo-500"
    })));
  }

  if (section === "resources") {
    const resources = await db.resource.findMany({ take: 10 });
    return NextResponse.json(resources.map((r: any) => ({
      title: r.title,
      category: r.category,
      fileType: r.type,
      downloads: "0"
    })));
  }

  return NextResponse.json([]);
});
