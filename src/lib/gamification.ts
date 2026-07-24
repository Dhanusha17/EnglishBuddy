import db from "@/lib/db";

// Helper to determine Level based on XP
export function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  if (xp < 2000) return 5;
  if (xp < 4000) return 6;
  if (xp < 8000) return 7;
  return Math.floor(Math.sqrt(xp / 100)) + 1; // Formula for higher levels
}

export function getNextLevelXp(level: number): number {
  if (level === 1) return 100;
  if (level === 2) return 250;
  if (level === 3) return 500;
  if (level === 4) return 1000;
  if (level === 5) return 2000;
  if (level === 6) return 4000;
  if (level === 7) return 8000;
  return Math.pow(level, 2) * 100;
}

export async function awardXp(userId: string, amount: number, reason: string) {
  // Prevent duplicate XP for same exact reason
  const existingTx = await db.xpTransaction.findFirst({
    where: { userId, reason }
  });

  // Only generic repeatable actions can be duplicated, but if reason is exact (e.g. "Completed Lesson 1"), block it.
  // We'll assume the caller formats reason like "COMPLETED_LESSON: uuid"
  if (existingTx && reason.includes(":")) {
    return null;
  }

  // Log transaction
  await db.xpTransaction.create({
    data: { userId, amount, reason }
  });

  // Update Profile
  const profile = await db.profile.update({
    where: { userId },
    data: { currentXp: { increment: amount } }
  });

  // Check achievements async
  await checkAchievements(userId, profile.currentXp);

  return profile.currentXp;
}

export async function updateStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if active today
  const activeToday = await db.dailyStreak.findUnique({
    where: { userId_date: { userId, date: today } }
  });

  if (activeToday) return; // Already logged today

  // Log today's activity
  await db.dailyStreak.create({
    data: { userId, date: today }
  });

  // Check if active yesterday
  const activeYesterday = await db.dailyStreak.findUnique({
    where: { userId_date: { userId, date: yesterday } }
  });

  const profile = await db.profile.findUnique({ where: { userId } });
  if (!profile) return;

  const newStreak = activeYesterday ? profile.currentStreak + 1 : 1;
  const newLongest = Math.max(profile.longestStreak, newStreak);

  await db.profile.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveAt: new Date()
    }
  });

  await checkAchievements(userId, profile.currentXp, newStreak);
}

export async function checkAchievements(userId: string, currentXp: number, currentStreak: number = 0) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { badges: true, profile: true }
  });
  if (!user) return;

  const earnedBadgeIds = user.badges.map(b => b.achievementId);
  const achievements = await db.achievement.findMany();

  const newBadges: string[] = [];

  for (const ach of achievements) {
    if (earnedBadgeIds.includes(ach.id)) continue;

    let earned = false;

    // Evaluate conditions based on ID/Title
    if (ach.id === "100-xp" && currentXp >= 100) earned = true;
    if (ach.id === "500-xp" && currentXp >= 500) earned = true;
    if (ach.id === "7-day-streak" && (currentStreak || user.profile?.currentStreak || 0) >= 7) earned = true;
    if (ach.id === "30-day-streak" && (currentStreak || user.profile?.currentStreak || 0) >= 30) earned = true;

    // AI/Lesson specifics
    if (ach.id === "first-lesson") {
      const lessons = await db.xpTransaction.count({ where: { userId, reason: { startsWith: "COMPLETED_LESSON:" } } });
      if (lessons >= 1) earned = true;
    }
    if (ach.id === "first-quiz") {
      const quizzes = await db.xpTransaction.count({ where: { userId, reason: { startsWith: "PASSED_QUIZ:" } } });
      if (quizzes >= 1) earned = true;
    }
    if (ach.id === "perfect-quiz") {
      const quizzes = await db.xpTransaction.count({ where: { userId, reason: { startsWith: "PERFECT_QUIZ:" } } });
      if (quizzes >= 1) earned = true;
    }
    if (ach.id === "ai-explorer") {
      const uses = await db.aiUsageAnalytics.groupBy({
        by: ['module'],
        where: { userId }
      });
      // Ensure they used at least 4 different modules
      if (uses.length >= 4) earned = true;
    }
    if (ach.id === "interview-master") {
      const greatInterviews = await db.aiInterviewAttempt.count({
        where: { userId, confidenceScore: { gte: 90 }, clarityScore: { gte: 90 } }
      });
      if (greatInterviews >= 1) earned = true;
    }

    if (earned) {
      newBadges.push(ach.id);
    }
  }

  // Insert new badges
  if (newBadges.length > 0) {
    await db.badge.createMany({
      data: newBadges.map(achId => ({
        userId,
        achievementId: achId
      }))
    });
  }
}
