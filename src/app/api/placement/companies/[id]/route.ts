import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const company = await db.company.findUnique({
    where: { id: params.id },
    include: { preparations: true }
  });
  
  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }
  
  return NextResponse.json({ data: company }, { status: 200 });
});