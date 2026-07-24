import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "PUBLISHED";
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const skip = (page - 1) * limit;

  const courses = await db.course.findMany({
    where: {
      status,
    },
    include: {
      _count: {
        select: { lessons: true },
      },
      progress: {
        where: { userId: session.sub },
      },
    },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const total = await db.course.count({ where: { status } });

  return NextResponse.json({
    data: courses,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});
