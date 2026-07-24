import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { getSession, clearAuthCookies } from '@/lib/auth';
import db from '@/lib/db';
import { logAuditEvent } from '@/lib/audit-logger';

export const DELETE = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.sub;

  await logAuditEvent({
    userId,
    action: 'ACCOUNT_DELETED',
    ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1',
  });

  // Cascade delete user and associated records
  await db.user.delete({
    where: { id: userId },
  });

  await clearAuthCookies();

  return NextResponse.json({
    message: 'Your account and associated personal data have been permanently deleted.',
  });
});
