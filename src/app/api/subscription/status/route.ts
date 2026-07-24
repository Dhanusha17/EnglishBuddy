import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { getSession } from '@/lib/auth';
import { subscriptionService } from '@/services/subscription/SubscriptionService';
import { UsageTracker } from '@/services/subscription/UsageTracker';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscriptionData = await subscriptionService.getUserSubscription(session.sub);
  const usageSummary = await UsageTracker.getUserUsageSummary(session.sub);

  return NextResponse.json({
    data: {
      subscription: subscriptionData.subscription,
      planInfo: subscriptionData.planInfo,
      usage: usageSummary.usage,
    },
  });
});
