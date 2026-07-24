import db from '@/lib/db';
import { IPaymentProvider } from './IPaymentProvider';
import { MockPaymentProvider } from './MockPaymentProvider';

export interface PlanLimits {
  aiRequestsPerDay: number;
  storageMaxMB: number;
  dailyPracticeMax: number;
  dailyTestsMax: number;
  fileUploadMaxMB: number;
}

export interface SubscriptionPlanInfo {
  name: 'Free' | 'Premium' | 'Enterprise';
  priceMonthly: number;
  features: string[];
  limits: PlanLimits;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlanInfo> = {
  Free: {
    name: 'Free',
    priceMonthly: 0,
    features: [
      'Access to A1-B1 Lessons',
      '20 AI Tutor Conversations / day',
      '50 MB Cloud Media Storage',
      '3 Practice Sessions / day',
      'Standard Certificates',
    ],
    limits: {
      aiRequestsPerDay: 20,
      storageMaxMB: 50,
      dailyPracticeMax: 3,
      dailyTestsMax: 2,
      fileUploadMaxMB: 10,
    },
  },
  Premium: {
    name: 'Premium',
    priceMonthly: 19,
    features: [
      'Unlimited Access to All Lessons (A1 - C2)',
      'Unlimited AI Tutor & Speaking Practice',
      '5 GB Cloud Media Storage',
      'Unlimited Practice & Mock Interviews',
      'Priority Certificates with Dynamic QR Codes',
      'Downloadable Resume PDFs & Feedback',
    ],
    limits: {
      aiRequestsPerDay: 500,
      storageMaxMB: 5000,
      dailyPracticeMax: 100,
      dailyTestsMax: 50,
      fileUploadMaxMB: 25,
    },
  },
  Enterprise: {
    name: 'Enterprise',
    priceMonthly: 99,
    features: [
      'Custom Campus / Institutional Cohorts',
      'Dedicated Mentor Feedback & Live Group Clinics',
      '50 GB Cloud Media Storage',
      'Custom API Integrations & Admin Dashboard',
    ],
    limits: {
      aiRequestsPerDay: 5000,
      storageMaxMB: 50000,
      dailyPracticeMax: 1000,
      dailyTestsMax: 500,
      fileUploadMaxMB: 100,
    },
  },
};

export class SubscriptionService {
  private paymentProvider: IPaymentProvider;

  constructor(paymentProvider?: IPaymentProvider) {
    this.paymentProvider = paymentProvider || new MockPaymentProvider();
  }

  async getUserSubscription(userId: string) {
    let sub = await db.subscription.findUnique({
      where: { userId },
    });

    if (!sub) {
      sub = await db.subscription.create({
        data: {
          userId,
          planType: 'Free',
          status: 'ACTIVE',
          isActive: true,
        },
      });
    }

    const planInfo = SUBSCRIPTION_PLANS[sub.planType] || SUBSCRIPTION_PLANS.Free;
    return {
      subscription: sub,
      planInfo,
    };
  }

  async upgradeUserPlan(userId: string, targetPlan: 'Premium' | 'Enterprise') {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Update subscription in DB
    const updatedSub = await db.subscription.upsert({
      where: { userId },
      update: {
        planType: targetPlan,
        status: 'ACTIVE',
        isActive: true,
        currentPeriodStart: new Date(),
        currentPeriodEnd: nextBillingDate,
      },
      create: {
        userId,
        planType: targetPlan,
        status: 'ACTIVE',
        isActive: true,
        currentPeriodStart: new Date(),
        currentPeriodEnd: nextBillingDate,
      },
    });

    // Create billing invoice record
    const amountCents = SUBSCRIPTION_PLANS[targetPlan].priceMonthly * 100;
    await db.billingInvoice.create({
      data: {
        userId,
        subscriptionId: updatedSub.id,
        amount: amountCents,
        currency: 'USD',
        status: 'PAID',
      },
    });

    // Update User Role to premium_student if upgrading to Premium
    if (targetPlan === 'Premium') {
      const premRole = await db.role.findFirst({ where: { name: { in: ['premium_student', 'PREMIUM_STUDENT'] } } });
      if (premRole) {
        await db.user.update({
          where: { id: userId },
          data: { roleId: premRole.id },
        });
      }
    }

    return updatedSub;
  }

  async cancelUserSubscription(userId: string) {
    const sub = await db.subscription.findUnique({ where: { userId } });
    if (!sub) throw new Error('No active subscription found');

    return await db.subscription.update({
      where: { userId },
      data: {
        cancelAtPeriodEnd: true,
        status: 'CANCELLED',
      },
    });
  }
}

export const subscriptionService = new SubscriptionService();
