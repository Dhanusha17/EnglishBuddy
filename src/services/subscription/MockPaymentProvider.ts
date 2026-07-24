import { IPaymentProvider, CustomerData, CheckoutSessionOptions, CheckoutSessionResult } from './IPaymentProvider';
import crypto from 'crypto';

export class MockPaymentProvider implements IPaymentProvider {
  async createCustomer(data: CustomerData): Promise<string> {
    return `cus_mock_${crypto.randomBytes(6).toString('hex')}`;
  }

  async createCheckoutSession(options: CheckoutSessionOptions): Promise<CheckoutSessionResult> {
    const sessionId = `cs_mock_${crypto.randomBytes(8).toString('hex')}`;
    const checkoutUrl = `${options.successUrl}?session_id=${sessionId}&plan=${options.planType}`;
    return {
      sessionId,
      checkoutUrl,
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    return true;
  }

  async getSubscriptionStatus(subscriptionId: string): Promise<string> {
    return 'active';
  }
}
