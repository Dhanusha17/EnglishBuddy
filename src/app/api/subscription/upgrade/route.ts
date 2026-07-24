import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { getSession } from '@/lib/auth';
import { subscriptionService } from '@/services/subscription/SubscriptionService';
import { z } from 'zod';
import { logAuditEvent } from '@/lib/audit-logger';

const schema = z.object({
  planType: z.enum(['Premium', 'Enterprise']),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { planType } = schema.parse(body);

  const updatedSub = await subscriptionService.upgradeUserPlan(session.sub, planType);

  await logAuditEvent({
    userId: session.sub,
    action: 'SUBSCRIPTION_UPGRADED',
    details: { planType },
    ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1',
  });

  return NextResponse.json({
    message: `Subscription successfully upgraded to ${planType}`,
    data: updatedSub,
  });
});
