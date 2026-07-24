import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';
import { z } from 'zod';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const category = searchParams.get('category');
  
  const resources = await db.resource.findMany({
    where: {
      ...(q ? { title: { contains: q } } : {}),
      ...(category ? { category } : {})
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ data: resources }, { status: 200 });
});