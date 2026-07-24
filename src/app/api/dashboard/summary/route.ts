import { NextResponse } from "next/server";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async () => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get user progress and some basic summary info for the dashboard
  const user = await db.user.findUnique({
    where: { id: session.sub },
    include: {
      profile: true,
      _count: {
        select: {
          testAttempts: true,
          aiConversations: true,
          practiceAttempts: true,
        },
      },
      dailyGoals: {
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      },
      xpTransactions: {
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      }
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Calculate XP per day for the last 7 days
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { name: days[d.getDay()], score: 0, dateStr: d.toDateString() };
  });

  user.xpTransactions.forEach(tx => {
    const txDate = new Date(tx.createdAt).toDateString();
    const dayData = chartData.find(d => d.dateStr === txDate);
    if (dayData) {
      dayData.score += tx.amount;
    }
  });

  const summary = {
    xp: user.profile?.currentXp || 0,
    streak: user.profile?.currentStreak || 0,
    level: user.profile?.englishLevel || "Beginner",
    placementReadiness: user.profile?.placementReadiness || 0,
    examsTaken: user._count.testAttempts,
    aiInteractions: user._count.aiConversations,
    completedLessons: [], // Can be updated if needed
    dailyMissions: user.dailyGoals || [],
    chartData: chartData.map(({ name, score }) => ({ name, score })),
  };

  return NextResponse.json(summary, { status: 200 });
});
