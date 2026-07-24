import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const coverLetters = await db.coverLetter.findMany({
    where: { userId: session.sub },
    orderBy: { updatedAt: 'desc' }
  });
  
  return NextResponse.json({ data: coverLetters }, { status: 200 });
});

const schema = z.object({
  title: z.string().min(1),
  content: z.string()
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, content } = schema.parse(body);

  const coverLetter = await db.coverLetter.create({
    data: {
      userId: session.sub,
      title,
      content
    }
  });

  return NextResponse.json({ data: coverLetter }, { status: 201 });
});