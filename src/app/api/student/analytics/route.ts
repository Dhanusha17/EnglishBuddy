import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { calculateLevel, getNextLevelXp } from "@/lib/gamification";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.sub;

  // Parallel fetch for optimal performance
  const [
    profile,
    badges,
    courses,
    lessons,
    quizzes,
    aiUsage,
    grammar,
    writing,
    interviews,
    dailyStreaks
  ] = await Promise.all([
    db.profile.findUnique({ where: { userId } }),
    db.badge.findMany({ where: { userId }, include: { achievement: true } }),
    db.userCourseProgress.findMany({ where: { userId, progressPct: 100 } }),
    db.userLessonProgress.findMany({ where: { userId, completed: true } }),
    db.quizAttempt.findMany({ where: { userId } }),
    db.aiUsageAnalytics.count({ where: { userId } }),
    db.grammarReport.findMany({ where: { userId } }),
    db.writingReport.findMany({ where: { userId } }),
    db.aiInterviewAttempt.findMany({ where: { userId } }),
    db.dailyStreak.findMany({ 
      where: { userId, date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      orderBy: { date: "asc" }
    })
  ]);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const currentXp = profile.currentXp || 0;
  const level = calculateLevel(currentXp);
  const nextLevelXp = getNextLevelXp(level);
  
  // Averages
  const avgQuiz = quizzes.length ? quizzes.reduce((acc, q) => acc + q.score, 0) / quizzes.length : 0;
  const avgGrammar = grammar.length ? grammar.reduce((acc, g) => acc + g.score, 0) / grammar.length : 0;
  
  // Writing is complex because it has 5 scores, we'll average them all
  const avgWriting = writing.length ? writing.reduce((acc, w) => 
    acc + ((w.grammarScore + w.vocabularyScore + w.clarityScore + w.structureScore + w.toneScore) / 5)
  , 0) / writing.length : 0;

  const avgInterview = interviews.length ? interviews.reduce((acc, i) => 
    acc + ((i.confidenceScore + i.clarityScore + i.relevanceScore) / 3)
  , 0) / interviews.length : 0;

  // Format Chart Data
  const chartData = [
    { name: "Mon", active: 0 },
    { name: "Tue", active: 0 },
    { name: "Wed", active: 0 },
    { name: "Thu", active: 0 },
    { name: "Fri", active: 0 },
    { name: "Sat", active: 0 },
    { name: "Sun", active: 0 },
  ];
  
  // Populate chart with real streak data
  dailyStreaks.forEach(s => {
    const day = s.date.getDay(); // 0 = Sun, 1 = Mon
    const mappedDay = day === 0 ? 6 : day - 1; // Map to 0-6 array
    if (chartData[mappedDay]) {
      chartData[mappedDay].active = 1;
    }
  });

  return NextResponse.json({
    level,
    currentXp,
    nextLevelXp,
    streak: profile.currentStreak || 0,
    coursesCompleted: courses.length,
    lessonsCompleted: lessons.length,
    quizzesCompleted: quizzes.length,
    avgQuizScore: Math.round(avgQuiz),
    avgGrammarScore: Math.round(avgGrammar),
    avgWritingScore: Math.round(avgWriting),
    avgInterviewScore: Math.round(avgInterview),
    aiUsageCount: aiUsage,
    achievements: badges.map(b => b.achievement),
    chartData
  });
});
