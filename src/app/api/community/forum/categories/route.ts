import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const categories = await db.forumCategory.findMany({
    orderBy: { name: 'asc' }
  });
  
  return NextResponse.json({ data: categories }, { status: 200 });
});