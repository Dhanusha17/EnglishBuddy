import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { SUBSCRIPTION_PLANS } from '@/services/subscription/SubscriptionService';

export const GET = withErrorHandler(async () => {
  return NextResponse.json({
    data: Object.values(SUBSCRIPTION_PLANS),
  });
});
