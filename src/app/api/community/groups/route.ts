import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const groups = await db.studyGroup.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { members: true } } }
  });
  
  return NextResponse.json({ data: groups }, { status: 200 });
});

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1)
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, description, category } = schema.parse(body);

  const group = await db.studyGroup.create({
    data: {
      name,
      description,
      category,
      members: {
        create: { userId: session.sub } // Creator becomes a member automatically
      }
    }
  });

  return NextResponse.json({ data: group }, { status: 201 });
});