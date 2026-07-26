import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { notifyUser } from "@/lib/notifications";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.sub;
  const { category, courseId } = await req.json();

  let eligible = false;
  let title = "";

  const user = await db.user.findUnique({ where: { id: userId }, include: { profile: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (category === "COURSE_COMPLETION" && courseId) {
    const courseProgress = await db.userCourseProgress.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { course: true }
    });
    
    if (courseProgress && courseProgress.progressPct === 100) {
      eligible = true;
      title = `Completed: \${courseProgress.course.title}`;
    }
  } else if (category === "AI_LEARNING") {
    const aiUsage = await db.aiUsageAnalytics.count({ where: { userId } });
    if (aiUsage >= 10) {
      eligible = true;
      title = "AI Learning Excellence";
    }
  } else if (category === "GAMIFICATION_MASTER") {
    if (user.profile && user.profile.currentXp >= 1000) {
      eligible = true;
      title = "Gamification Master";
    }
  } else if (category === "OVERALL_PROFICIENCY") {
    const quizzes = await db.quizAttempt.count({ where: { userId, score: { gte: 80 } } });
    if (quizzes >= 5) {
      eligible = true;
      title = "English Proficiency Excellence";
    }
  }

  if (!eligible) {
    return NextResponse.json({ error: "Eligibility conditions not met." }, { status: 400 });
  }

  // Check for duplicate
  const existing = await db.certificate.findFirst({
    where: { userId, category, title }
  });

  if (existing) {
    return NextResponse.json({ message: "Certificate already issued", certificate: existing });
  }

  const certificate = await db.certificate.create({
    data: {
      userId,
      title,
      category,
      issuedToName: user.name,
      verificationUrl: `\${process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://englishbuddy.app')}/verify`
    }
  });

  await notifyUser({
    userId: userId,
    type: 'CERTIFICATE_EARNED',
    title: `Certificate Earned: ${title}`,
    message: `Congratulations! You have been awarded the ${title} certificate.`,
    actionUrl: `/dashboard/certificates`,
    emailTemplate: 'CERTIFICATE_ISSUED',
    emailVariables: {
      certificateName: title
    }
  });

  return NextResponse.json({ message: "Certificate issued successfully", certificate });
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const certificates = await db.certificate.findMany({
    where: { userId: session.sub },
    orderBy: { issuedAt: "desc" }
  });

  return NextResponse.json(certificates);
});
