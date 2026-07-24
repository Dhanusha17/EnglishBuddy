import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { ai } from '@/lib/ai/AIService';
import { PromptBuilder } from '@/lib/ai/PromptBuilder';
import { RecommendationsResponse } from '@/lib/ai/ResponseFormatter';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();

  // Build profile context from DB or use sensible defaults
  let userProfile = {
    level: 'B1',
    weakSkills: [] as string[],
    completedLessons: 0,
    streak: 0,
  };

  if (session) {
    const profile = await db.profile.findUnique({
      where: { userId: session.sub },
      select: { englishLevel: true, currentStreak: true },
    });
    const lessonCount = await db.userLessonProgress.count({
      where: { userId: session.sub, completed: true },
    });

    userProfile = {
      level: profile?.englishLevel ?? 'B1',
      weakSkills: [],
      completedLessons: lessonCount,
      streak: profile?.currentStreak ?? 0,
    };
  }

  const prompt = PromptBuilder.buildRecommendationsPrompt(userProfile);

  const response = await ai.generateStructuredResponse<RecommendationsResponse>(
    prompt,
    undefined,
    { temperature: 0.6 }
  );

  return NextResponse.json({ data: response }, { status: 200 });
});