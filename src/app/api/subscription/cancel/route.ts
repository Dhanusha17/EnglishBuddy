import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { getSession } from '@/lib/auth';
import { subscriptionService } from '@/services/subscription/SubscriptionService';
import { logAuditEvent } from '@/lib/audit-logger';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cancelledSub = await subscriptionService.cancelUserSubscription(session.sub);

  await logAuditEvent({
    userId: session.sub,
    action: 'SUBSCRIPTION_CANCELLED',
    ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1',
  });

  return NextResponse.json({
    message: 'Subscription cancelled. Access will remain active until the end of current billing cycle.',
    data: cancelledSub,
  });
});
