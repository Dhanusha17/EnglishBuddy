export interface CustomerData {
  userId: string;
  email: string;
  name: string;
}

export interface CheckoutSessionOptions {
  userId: string;
  planType: 'Premium' | 'Enterprise';
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
}

export interface IPaymentProvider {
  createCustomer(data: CustomerData): Promise<string>;
  createCheckoutSession(options: CheckoutSessionOptions): Promise<CheckoutSessionResult>;
  cancelSubscription(subscriptionId: string): Promise<boolean>;
  getSubscriptionStatus(subscriptionId: string): Promise<string>;
}
