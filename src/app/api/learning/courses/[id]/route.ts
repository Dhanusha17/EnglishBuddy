import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const course = await db.course.findUnique({
      where: { id },
      include: {
        lessons: {
          where: { status: "PUBLISHED" },
          orderBy: { orderIndex: "asc" },
          include: {
            progress: {
              where: { userId: session.sub },
            },
          },
        },
        progress: {
          where: { userId: session.sub },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  }
);
