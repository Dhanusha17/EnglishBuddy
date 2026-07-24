import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parallel fetch for optimal performance
  const [
    totalUsers,
    activeUsers,
    pendingUsers,
    totalCourses,
    totalQuizzes,
    aiInteractions,
    leaderboard
  ] = await Promise.all([
    db.user.count({ where: { role: { name: "student" } } }),
    db.user.count({ where: { role: { name: "student" }, status: "ACTIVE" } }),
    db.user.count({ where: { role: { name: "student" }, status: "PENDING" } }),
    db.userCourseProgress.count({ where: { progressPct: 100 } }),
    db.quizAttempt.count(),
    db.aiUsageAnalytics.count(),
    db.profile.findMany({
      orderBy: { currentXp: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } }
    })
  ]);

  return NextResponse.json({
    totalUsers,
    activeUsers,
    pendingUsers,
    courseCompletionRate: totalUsers ? Math.round((totalCourses / totalUsers) * 100) : 0,
    totalQuizzes,
    aiInteractions,
    leaderboard: leaderboard.map(l => ({
      id: l.userId,
      name: l.user.name,
      email: l.user.email,
      xp: l.currentXp,
      streak: l.currentStreak,
      level: Math.floor(Math.sqrt((l.currentXp || 0) / 100)) + 1
    }))
  });
});
