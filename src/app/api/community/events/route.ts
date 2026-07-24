import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const events = await db.event.findMany({
    orderBy: { date: 'asc' },
    include: { _count: { select: { registrations: true } } }
  });
  
  return NextResponse.json({ data: events }, { status: 200 });
});