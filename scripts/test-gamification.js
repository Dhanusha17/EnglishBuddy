import { PrismaClient } from "@prisma/client";
import { awardXp, updateStreak } from "../src/lib/gamification.js";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Unit Testing Gamification Engine ---");
  
  const user = await prisma.user.findFirst({ where: { role: { name: "student" } } });
  if (!user) {
    console.error("No student user found.");
    return;
  }
  
  const userId = user.id;

  console.log(`Testing with user: \${user.email}`);
  
  await updateStreak(userId);
  console.log("✅ Streak updated.");

  await awardXp(userId, 50, "TEST_XP_1");
  await awardXp(userId, 50, "TEST_XP_2");
  console.log("✅ Awarded 100 XP.");

  const profile = await prisma.profile.findUnique({ where: { userId } });
  console.log(`Current XP: \${profile?.currentXp}`);
  
  if (profile?.currentXp >= 100) {
    console.log("✅ XP Gamification Passed!");
  } else {
    console.error("❌ XP Gamification Failed!");
  }

  const badges = await prisma.badge.findMany({ where: { userId }, include: { achievement: true } });
  console.log("Achievements:", badges.map(b => b.achievement.title).join(", "));
}

main().catch(console.error).finally(() => prisma.$disconnect());
