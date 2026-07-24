import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const topics = await db.gDTopic.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ data: topics }, { status: 200 });
});