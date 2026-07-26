import db from "@/lib/db";
import { calculateLevel, getNextLevelXp } from "@/lib/gamification";

export async function getDashboardHeaderData(userId: string) {
  const profile = await db.profile.findUnique({ 
    where: { userId }, 
    select: { currentXp: true, currentStreak: true } 
  });
  
  const currentXp = profile?.currentXp || 0;
  const level = calculateLevel(currentXp);
  const nextLevelXp = getNextLevelXp(level);
  
  return {
    level,
    currentXp,
    nextLevelXp,
    streak: profile?.currentStreak || 0
  };
}

export async function getDashboardStatsData(userId: string) {
  const [lessons, quizzes, aiUsage] = await Promise.all([
    db.userLessonProgress.count({ where: { userId, completed: true } }),
    db.quizAttempt.findMany({ where: { userId }, select: { score: true } }),
    db.aiUsageAnalytics.count({ where: { userId } }),
  ]);

  const avgQuizScore = quizzes.length 
    ? Math.round(quizzes.reduce((acc, q) => acc + q.score, 0) / quizzes.length) 
    : 0;

  return {
    lessonsCompleted: lessons,
    quizzesCompleted: quizzes.length,
    avgQuizScore,
    aiUsageCount: aiUsage
  };
}

export async function getDashboardChartData(userId: string) {
  const dailyStreaks = await db.dailyStreak.findMany({ 
    where: { userId, date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    orderBy: { date: "asc" },
    select: { date: true }
  });

  const chartData = [
    { name: "Mon", active: 0 },
    { name: "Tue", active: 0 },
    { name: "Wed", active: 0 },
    { name: "Thu", active: 0 },
    { name: "Fri", active: 0 },
    { name: "Sat", active: 0 },
    { name: "Sun", active: 0 },
  ];
  
  dailyStreaks.forEach(s => {
    const day = s.date.getDay(); // 0 = Sun, 1 = Mon
    const mappedDay = day === 0 ? 6 : day - 1; // Map to 0-6 array
    if (chartData[mappedDay]) {
      chartData[mappedDay].active = 1;
    }
  });

  return chartData;
}

export async function getDashboardAchievementsData(userId: string) {
  const badges = await db.badge.findMany({ 
    where: { userId }, 
    include: { achievement: true } 
  });

  return badges.map(b => b.achievement);
}
