import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export const POST = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getSession();
  
  if (session) {
    await db.downloadHistory.create({
      data: {
        userId: session.sub,
        resourceId: params.id
      }
    });
  }

  await db.resource.update({
    where: { id: params.id },
    data: { downloads: { increment: 1 } }
  });

  return NextResponse.json({ message: 'Download tracked' }, { status: 200 });
});