# Subscription Architecture & Usage Enforcement

This document describes the subscription plans, quota tracking system, abstract payment gateway integration, and billing architecture for **EnglishBuddy**.

---

## 1. Plan Tiers & Limits

| Feature / Limit | Free | Premium ($19/mo) | Enterprise ($99/mo) |
| :--- | :--- | :--- | :--- |
| **Curriculum Access** | A1 - B1 Lessons | All Levels (A1 - C2) | Custom Cohorts & Analytics |
| **AI Conversations / day** | 20 requests | 500 requests | 5,000 requests |
| **Cloud Storage** | 50 MB | 5,000 MB (5 GB) | 50,000 MB (50 GB) |
| **Daily Practice Sessions** | 3 sessions | 100 sessions | 1,000 sessions |
| **Daily Mock Tests** | 2 tests | 50 tests | 500 tests |
| **Max File Upload Size** | 10 MB | 25 MB | 100 MB |
| **Certificates** | Standard | Dynamic QR Code Certificates | Branded Custom Certificates |

---

## 2. Abstract Payment Service

Payment processing is decoupled using the `IPaymentProvider` interface.

### Provider Factory
The platform defaults to `MockPaymentProvider` for offline development and testing. For live environments, configure `StripePaymentProvider`:

```ts
import { IPaymentProvider } from './IPaymentProvider';

export class StripePaymentProvider implements IPaymentProvider {
  // Production Stripe checkout session & webhook handler
}
```

---

## 3. Usage Tracking Engine (`UsageTracker`)

Daily usage limits are checked against the `UsageRecord` database table:

```ts
import { UsageTracker } from '@/services/subscription/UsageTracker';

// Enforce AI limit before processing request
const check = await UsageTracker.checkAndRecordUsage(userId, 'AI_REQUESTS');
if (!check.allowed) {
  throw new Error('Daily AI request limit reached for your plan tier. Please upgrade to Premium.');
}
```

### Endpoints
- `GET /api/subscription/plans`: List all plans and limits.
- `GET /api/subscription/status`: Returns user's active plan, renewal date, and today's usage stats.
- `POST /api/subscription/upgrade`: Upgrades user plan.
- `POST /api/subscription/cancel`: Schedules cancellation at billing period end.
