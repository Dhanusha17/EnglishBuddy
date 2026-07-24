import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { awardXp } from "@/lib/gamification";

export const POST = withErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify lesson exists
    const lesson = await db.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Upsert UserLessonProgress
    const progress = await db.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.sub,
          lessonId: id,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: session.sub,
        lessonId: id,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Update UserCourseProgress
    const courseId = lesson.courseId;
    const totalLessons = await db.lesson.count({ where: { courseId, status: "PUBLISHED" } });
    const completedLessonsCount = await db.userLessonProgress.count({
      where: {
        userId: session.sub,
        lesson: { courseId, status: "PUBLISHED" },
        completed: true,
      },
    });

    const progressPct = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
    const isCourseCompleted = progressPct === 100;

    await db.userCourseProgress.upsert({
      where: {
        userId_courseId: {
          userId: session.sub,
          courseId,
        },
      },
      update: {
        progressPct,
        lastLessonId: id,
        ...(isCourseCompleted && { completedAt: new Date() }),
      },
      create: {
        userId: session.sub,
        courseId,
        progressPct,
        lastLessonId: id,
        ...(isCourseCompleted && { completedAt: new Date() }),
      },
    });

    // Trigger Gamification Engine
    const rewards = await awardXp(session.sub, 20, "Completed Lesson: " + id);

    return NextResponse.json({
      message: "Lesson completed",
      progress,
      rewards,
    });
  }
);
