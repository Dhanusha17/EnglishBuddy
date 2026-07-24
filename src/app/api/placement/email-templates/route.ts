import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const templates = await db.emailTemplate.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ data: templates }, { status: 200 });
});