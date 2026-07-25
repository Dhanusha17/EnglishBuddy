import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const timeRange = searchParams.get("timeRange") || "last30Days";

  let startDate = new Date();
  switch (timeRange) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "yesterday":
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "last7Days":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "last90Days":
      startDate.setDate(startDate.getDate() - 90);
      break;
    case "thisYear":
      startDate = new Date(startDate.getFullYear(), 0, 1);
      break;
    case "last30Days":
    default:
      startDate.setDate(startDate.getDate() - 30);
      break;
  }

  // Calculate previous period for trends
  const duration = new Date().getTime() - startDate.getTime();
  const prevStartDate = new Date(startDate.getTime() - duration);

  // Parallel fetch for current period
  const [
    totalUsers,
    activeUsers,
    pendingUsers,
    totalCoursesCompleted,
    totalQuizzes,
    aiInteractions,
    leaderboard,
    recentActivityLogs,
    certificatesGenerated,
    lessonsCompleted,
    prevTotalUsers,
    prevActiveUsers,
    prevTotalCoursesCompleted,
    prevAiInteractions
  ] = await Promise.all([
    // Current KPIs
    db.user.count({ where: { role: { name: "student" }, createdAt: { gte: startDate } } }),
    db.user.count({ where: { role: { name: "student" }, status: "ACTIVE", updatedAt: { gte: startDate } } }),
    db.user.count({ where: { role: { name: "student" }, status: "PENDING" } }),
    db.userCourseProgress.count({ where: { progressPct: 100, completedAt: { gte: startDate } } }),
    db.quizAttempt.count({ where: { startedAt: { gte: startDate } } }),
    db.aiUsageAnalytics.count({ where: { createdAt: { gte: startDate } } }),
    // Leaderboard
    db.profile.findMany({
      orderBy: { currentXp: "desc" },
      take: 10,
      include: { 
        user: { 
          select: { name: true, email: true, certificates: { select: { id: true } } } 
        } 
      }
    }),
    // Recent Activity (simulated by fetching latest created items across tables)
    db.quizAttempt.findMany({
      take: 5,
      orderBy: { startedAt: "desc" },
      include: { user: { select: { name: true } }, quiz: { select: { title: true } } }
    }),
    db.certificate.count({ where: { issuedAt: { gte: startDate } } }),
    db.userLessonProgress.count({ where: { completed: true, completedAt: { gte: startDate } } }),
    // Previous Period for Trends
    db.user.count({ where: { role: { name: "student" }, createdAt: { gte: prevStartDate, lt: startDate } } }),
    db.user.count({ where: { role: { name: "student" }, status: "ACTIVE", updatedAt: { gte: prevStartDate, lt: startDate } } }),
    db.userCourseProgress.count({ where: { progressPct: 100, completedAt: { gte: prevStartDate, lt: startDate } } }),
    db.aiUsageAnalytics.count({ where: { createdAt: { gte: prevStartDate, lt: startDate } } })
  ]);

  // Aggregate time-series for charts
  const weeklyUserGrowth = await generateTimeSeries(startDate, db.user, "createdAt");
  const aiUsageTrend = await generateTimeSeries(startDate, db.aiUsageAnalytics, "createdAt");
  const dailyActiveUsers = await generateTimeSeries(startDate, db.user, "createdAt"); 

  // Format Leaderboard
  const formattedLeaderboard = leaderboard.map(l => ({
    id: l.userId,
    name: l.user?.name || 'Unknown',
    email: l.user?.email || 'N/A',
    xp: l.currentXp,
    streak: l.currentStreak,
    level: Math.floor(Math.sqrt((l.currentXp || 0) / 100)) + 1,
    completedCourses: l.user?.certificates?.length || 0,
    lastActive: l.lastActiveAt
  }));

  // Format Recent Activity Feed
  const recentActivity = recentActivityLogs.map(log => ({
    type: "QUIZ_COMPLETED",
    description: `\${log.user?.name || 'A user'} \${log.passed ? 'passed' : 'attempted'} quiz "\${log.quiz?.title || 'Unknown'}" with \${log.percentage}%`,
    time: log.completedAt || log.startedAt,
    user: log.user?.name || 'Unknown'
  }));

  const allTimeUsers = await db.user.count({ where: { role: { name: "student" } } });
  const courseCompletionRate = allTimeUsers ? Math.round((totalCoursesCompleted / allTimeUsers) * 100) : 0;
  const prevCourseCompletionRate = allTimeUsers ? Math.round((prevTotalCoursesCompleted / allTimeUsers) * 100) : 0;

  return NextResponse.json({
    kpis: {
      totalUsers: { value: totalUsers, prev: prevTotalUsers },
      activeUsers: { value: activeUsers, prev: prevActiveUsers },
      courseCompletionRate: { value: courseCompletionRate, prev: prevCourseCompletionRate },
      aiInteractions: { value: aiInteractions, prev: prevAiInteractions }
    },
    charts: {
      weeklyUserGrowth,
      aiUsageTrend,
      dailyActiveUsers,
      quizPerformance: [
        { name: 'Vocabulary Quiz', avgScore: 85 },
        { name: 'Grammar Quiz', avgScore: 72 },
        { name: 'Listening Test', avgScore: 90 },
      ], // Mocked for simplicity in DB structure
      courseCompletion: [
        { name: 'Beginner English', completed: 120 },
        { name: 'Intermediate', completed: 85 },
        { name: 'Advanced', completed: 40 },
      ],
      xpDistribution: [
        { name: 'Level 1-5', count: 45 },
        { name: 'Level 6-10', count: 30 },
        { name: 'Level 11-15', count: 15 },
        { name: 'Level 16+', count: 10 },
      ]
    },
    leaderboard: formattedLeaderboard,
    engagementPanel: {
      activeStudentsToday: activeUsers, // Simplified
      newRegistrations: totalUsers,
      lessonsCompleted,
      quizzesPassed: Math.floor(totalQuizzes * 0.7), // Simulated pass rate
      aiRequests: aiInteractions,
      certificatesGenerated,
      avgQuizScore: 82, // Static mock for now
      weeklyStudyHours: 350
    },
    recentActivity
  });
});

async function generateTimeSeries(startDate: Date, model: any, dateField: string) {
  // Simplified grouping function (since Prisma doesn't easily group by day out-of-the-box for all DBs)
  // Fetching data and grouping in memory for demo
  const records = await model.findMany({
    where: { [dateField]: { gte: startDate } },
    select: { [dateField]: true }
  });

  const grouped: Record<string, number> = {};
  records.forEach((r: any) => {
    const dateStr = r[dateField].toISOString().split("T")[0];
    grouped[dateStr] = (grouped[dateStr] || 0) + 1;
  });

  return Object.keys(grouped).sort().map(key => ({
    name: new Date(key).toLocaleDateString('en-US', { weekday: 'short' }),
    count: grouped[key]
  }));
}
