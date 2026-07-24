import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userData = await db.user.findUnique({
    where: { id: session.sub },
    include: {
      profile: true,
      settings: true,
      testAttempts: true,
      practiceAttempts: true,
      courseProgress: true,
      certificates: true,
      mediaFiles: true,
      posts: true,
      comments: true,
      billingInvoices: true,
    },
  });

  if (!userData) {
    return NextResponse.json({ error: 'User data not found' }, { status: 404 });
  }

  // Remove passwordHash before exporting
  const { passwordHash, ...exportableData } = userData;

  return new NextResponse(JSON.stringify(exportableData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="englishbuddy_user_data_${session.sub}.json"`,
    },
  });
});
