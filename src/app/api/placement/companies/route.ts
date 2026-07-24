import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  
  const companies = await db.company.findMany({
    where: q ? { name: { contains: q } } : undefined,
    orderBy: { name: 'asc' },
    include: { _count: { select: { preparations: true } } }
  });
  
  return NextResponse.json({ data: companies }, { status: 200 });
});