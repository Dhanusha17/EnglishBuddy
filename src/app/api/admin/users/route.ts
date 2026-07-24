import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      createdAt: true,
      status: true,
      accountActive: true,
      role: {
        select: { name: true }
      },
      profile: {
        select: { currentXp: true }
      },
      loginHistories: {
        orderBy: { timestamp: 'desc' },
        take: 1,
        select: { timestamp: true }
      }
    }
  });
  
  return NextResponse.json({ data: users }, { status: 200 });
});