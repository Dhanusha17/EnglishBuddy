import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const course = await db.course.findUnique({
    where: { id: params.id },
    include: {
      creator: { select: { name: true, email: true } }
    }
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
});

export const PATCH = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, category, difficulty, thumbnail, duration, estimatedHours, prerequisites, learningOutcomes, tags, status } = body;

  const course = await db.course.update({
    where: { id: params.id },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(difficulty !== undefined && { difficulty }),
      ...(thumbnail !== undefined && { thumbnail }),
      ...(duration !== undefined && { duration }),
      ...(estimatedHours !== undefined && { estimatedHours }),
      ...(prerequisites !== undefined && { prerequisites }),
      ...(learningOutcomes !== undefined && { learningOutcomes }),
      ...(tags !== undefined && { tags }),
      ...(status && { status }),
    },
  });

  return NextResponse.json(course);
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await db.course.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Course deleted successfully" });
});
