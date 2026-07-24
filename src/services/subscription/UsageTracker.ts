import db from '@/lib/db';
import { subscriptionService, SUBSCRIPTION_PLANS } from './SubscriptionService';

export type MetricType = 'AI_REQUESTS' | 'STORAGE_BYTES' | 'DAILY_PRACTICE' | 'DAILY_TESTS' | 'FILE_UPLOADS';

export class UsageTracker {
  private static getTodayDateString(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  /**
   * Tracks usage for a user and checks if within plan limit.
   */
  static async checkAndRecordUsage(
    userId: string,
    metric: MetricType,
    incrementAmount: number = 1
  ): Promise<{ allowed: boolean; current: number; limit: number; remaining: number }> {
    const { planInfo } = await subscriptionService.getUserSubscription(userId);
    const today = UsageTracker.getTodayDateString();

    // Determine limit based on metric
    let limit = 100;
    switch (metric) {
      case 'AI_REQUESTS':
        limit = planInfo.limits.aiRequestsPerDay;
        break;
      case 'DAILY_PRACTICE':
        limit = planInfo.limits.dailyPracticeMax;
        break;
      case 'DAILY_TESTS':
        limit = planInfo.limits.dailyTestsMax;
        break;
      case 'STORAGE_BYTES':
        limit = planInfo.limits.storageMaxMB * 1024 * 1024;
        break;
      case 'FILE_UPLOADS':
        limit = planInfo.limits.fileUploadMaxMB * 1024 * 1024;
        break;
    }

    // Get current usage record for today
    const existing = await db.usageRecord.findUnique({
      where: {
        userId_metric_date: {
          userId,
          metric,
          date: today,
        },
      },
    });

    const currentCount = existing ? existing.count : 0;

    if (currentCount + incrementAmount > limit) {
      return {
        allowed: false,
        current: currentCount,
        limit,
        remaining: 0,
      };
    }

    // Record increment
    await db.usageRecord.upsert({
      where: {
        userId_metric_date: {
          userId,
          metric,
          date: today,
        },
      },
      update: {
        count: { increment: incrementAmount },
      },
      create: {
        userId,
        metric,
        date: today,
        count: incrementAmount,
      },
    });

    return {
      allowed: true,
      current: currentCount + incrementAmount,
      limit,
      remaining: Math.max(0, limit - (currentCount + incrementAmount)),
    };
  }

  /**
   * Gets today's current usage summary for all metrics.
   */
  static async getUserUsageSummary(userId: string) {
    const { planInfo } = await subscriptionService.getUserSubscription(userId);
    const today = UsageTracker.getTodayDateString();

    const records = await db.usageRecord.findMany({
      where: {
        userId,
        date: today,
      },
    });

    const getMetricCount = (m: MetricType) => records.find((r) => r.metric === m)?.count || 0;

    return {
      plan: planInfo.name,
      limits: planInfo.limits,
      usage: {
        aiRequests: {
          used: getMetricCount('AI_REQUESTS'),
          limit: planInfo.limits.aiRequestsPerDay,
        },
        dailyPractice: {
          used: getMetricCount('DAILY_PRACTICE'),
          limit: planInfo.limits.dailyPracticeMax,
        },
        dailyTests: {
          used: getMetricCount('DAILY_TESTS'),
          limit: planInfo.limits.dailyTestsMax,
        },
      },
    };
  }
}
