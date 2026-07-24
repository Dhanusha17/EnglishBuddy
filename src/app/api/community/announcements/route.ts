import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const announcements = await db.announcement.findMany({
    where: { isGlobal: true },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ data: announcements }, { status: 200 });
});