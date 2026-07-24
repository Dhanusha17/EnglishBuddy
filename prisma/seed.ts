import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Seed Roles
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      permissions: {
        connectOrCreate: [
          { where: { name: "ALL" }, create: { name: "ALL" } },
        ],
      },
    },
  });

  const studentRole = await prisma.role.upsert({
    where: { name: "student" },
    update: {},
    create: {
      name: "student",
      permissions: {
        connectOrCreate: [
          { where: { name: "READ_LESSONS" }, create: { name: "READ_LESSONS" } },
          { where: { name: "TAKE_TESTS" }, create: { name: "TAKE_TESTS" } },
        ],
      },
    },
  });

  // Seed Admin
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@englishbuddy.com" },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@englishbuddy.com",
      username: "sysadmin_v2",
      passwordHash: adminPassword,
      roleId: adminRole.id,
      accountActive: true,
      status: "APPROVED",
      profile: {
        create: {
          englishLevel: "C2",
          avatarUrl: "/avatars/admin.png",
          bio: "Platform Administrator",
        },
      },
      settings: {
        create: {
          theme: "system",
          emailNotifications: true,
        },
      },
    },
  });

  // Seed Student
  const studentPassword = await bcrypt.hash("Student@123", 10);
  const studentUser = await prisma.user.upsert({
    where: { email: "student@englishbuddy.com" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@englishbuddy.com",
      username: "demostudent_v2",
      passwordHash: studentPassword,
      roleId: studentRole.id,
      accountActive: true,
      status: "APPROVED",
      profile: {
        create: {
          englishLevel: "A1",
          avatarUrl: "/avatars/student.png",
          bio: "I am preparing for campus placements.",
          currentXp: 0,
          coins: 0,
          currentStreak: 0,
          longestStreak: 0,
          placementReadiness: 0,
        },
      },
      settings: {
        create: {
          theme: "light",
          emailNotifications: true,
        },
      },
      notifications: {
        create: [
          {
            title: "Welcome to EnglishBuddy!",
            message: "Start your first lesson today.",
            category: "SYSTEM",
          }
        ],
      },
    },
  });

  // Seed Achievements
  const achievements = [
    // Gamification
    { title: "100 XP", description: "Earned 100 total XP.", iconUrl: "/icons/100xp.png" },
    { title: "500 XP", description: "Earned 500 total XP.", iconUrl: "/icons/500xp.png" },
    { title: "1000 XP", description: "Earned 1000 total XP.", iconUrl: "/icons/1000xp.png" },
    { title: "7-Day Streak", description: "Studied for 7 consecutive days.", iconUrl: "/icons/streak-7.png" },
    { title: "30-Day Streak", description: "Studied for 30 consecutive days.", iconUrl: "/icons/streak-30.png" },
    { title: "365-Day Streak", description: "Studied for an entire year.", iconUrl: "/icons/streak-365.png" },
    
    // Learning
    { title: "First Lesson", description: "Completed your first lesson.", iconUrl: "/icons/first-lesson.png" },
    { title: "First Course", description: "Completed your first course.", iconUrl: "/icons/first-course.png" },
    { title: "Course Master", description: "Completed 5 courses.", iconUrl: "/icons/course-master.png" },
    
    // Quiz
    { title: "First Quiz", description: "Passed your first quiz.", iconUrl: "/icons/first-quiz.png" },
    { title: "Perfect Score", description: "Scored 100% on a quiz.", iconUrl: "/icons/perfect-quiz.png" },
    { title: "Quiz Champion", description: "Passed 10 quizzes.", iconUrl: "/icons/quiz-champion.png" },
    
    // AI
    { title: "AI Explorer", description: "Used all AI tools.", iconUrl: "/icons/ai-explorer.png" },
    { title: "Grammar Expert", description: "Used the Grammar checker 10 times.", iconUrl: "/icons/grammar-expert.png" },
    { title: "Vocabulary Master", description: "Looked up 20 words.", iconUrl: "/icons/vocab-master.png" },
    { title: "Writing Expert", description: "Scored 90+ on AI Writing.", iconUrl: "/icons/writing-expert.png" },
    { title: "Interview Champion", description: "Scored above 90 on an AI mock interview.", iconUrl: "/icons/interview-master.png" },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { id: ach.title.replace(/\s+/g, '-').toLowerCase() }, // We don't have unique title, so let's just createMany if we wipe the DB
      update: {},
      create: {
        id: ach.title.replace(/\s+/g, '-').toLowerCase(),
        title: ach.title,
        description: ach.description,
        iconUrl: ach.iconUrl
      }
    });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
