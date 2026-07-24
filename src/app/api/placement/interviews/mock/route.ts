import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  
  const interviews = await db.mockInterview.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      attempts: session ? {
        where: { userId: session.sub },
        orderBy: { completedAt: 'desc' },
        take: 1
      } : false
    }
  });
  
  return NextResponse.json({ data: interviews }, { status: 200 });
});