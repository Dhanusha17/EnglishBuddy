import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  
  const posts = await db.communityPost.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, profile: { select: { avatarUrl: true } } } },
      _count: { select: { comments: true, likes: true } }
    }
  });
  
  return NextResponse.json({ data: posts }, { status: 200 });
});

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1)
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, content, category } = schema.parse(body);

  const post = await db.communityPost.create({
    data: {
      userId: session.sub,
      title,
      content,
      category
    }
  });

  return NextResponse.json({ data: post }, { status: 201 });
});