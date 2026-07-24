import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';
import { awardXp } from '@/lib/gamification';

const schema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().optional()
});

export const POST = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { score, feedback } = schema.parse(body);

  const attempt = await db.mockInterviewAttempt.create({
    data: {
      userId: session.sub,
      mockInterviewId: params.id,
      score,
      feedback
    }
  });

  // Award XP for completing an interview attempt
  await awardXp(session.sub, 40, "Completed Mock Interview");

  return NextResponse.json({ data: attempt, message: 'Interview attempt saved' }, { status: 201 });
});