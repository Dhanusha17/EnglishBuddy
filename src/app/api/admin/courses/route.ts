import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || "";
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const skip = (page - 1) * limit;

  const whereClause: any = {
    ...(status ? { status } : {}),
    ...(search ? { title: { contains: search } } : {}),
  };

  const courses = await db.course.findMany({
    where: whereClause,
    include: {
      _count: {
        select: { lessons: true },
      },
      creator: {
        select: { name: true, email: true }
      }
    },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const total = await db.course.count({ where: whereClause });

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

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, category, difficulty, thumbnail, duration, estimatedHours, prerequisites, learningOutcomes, tags, status } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const course = await db.course.create({
    data: {
      title,
      description,
      category,
      difficulty,
      thumbnail,
      duration,
      estimatedHours,
      prerequisites,
      learningOutcomes,
      tags,
      status: status || "DRAFT",
      createdById: session.sub,
    },
  });

  return NextResponse.json(course, { status: 201 });
});
