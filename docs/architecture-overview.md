# System Architecture Overview

This document describes the high-level system architecture, component layers, data flows, and design patterns powering **EnglishBuddy**.

---

## 1. High-Level Component Diagram

```
+-------------------------------------------------------------------+
|                           CLIENT TIER                             |
|        Next.js App Router (React 19, TypeScript, Tailwind)        |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                        SECURITY & MIDDLEWARE                      |
|      CSRF Protection | Rate Limiter | RBAC | Security Headers     |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                          SERVICES TIER                            |
|  +-------------------+  +------------------+  +-----------------+  |
|  | StorageFactory    |  | SubscriptionSvc  |  | CertificateGen  |  |
|  | (S3/Cloudinary/   |  | (Mock/Stripe &   |  | (pdf-lib &      |  |
|  |  Local Provider)  |  |  UsageTracker)   |  |  QRCode)        |  |
|  +-------------------+  +------------------+  +-----------------+  |
|  +-------------------+  +------------------+                       |
|  | AIService         |  | EmailService     |                       |
|  | (Gemini Adapter)  |  | (Console/Resend) |                       |
|  +-------------------+  +------------------+                       |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                        DATA & STORAGE TIER                        |
|       PostgreSQL (Prisma ORM) | Redis | Media Storage / S3       |
+-------------------------------------------------------------------+
```

---

## 2. Layer Breakdown

### Client Tier
Built with Next.js 16 App Router using React 19 Server & Client Components, styled with Tailwind CSS and Shadcn UI primitives. State management is handled via Zustand stores (`useAppStore`).

### Middleware & Security Layer
Global Next.js middleware (`src/middleware.ts`) validates access tokens, enforces rate limits per IP using Redis, checks origin headers for CSRF protection, and sets strict Content Security Policy (CSP) headers.

### Abstract Service Layer
Follows the Dependency Injection pattern:
- `IStorageProvider`: Swappable storage implementations (`LocalStorageProvider`, `S3StorageProvider`, `CloudinaryStorageProvider`).
- `IPaymentProvider`: Swappable payment gateways (`MockPaymentProvider`, `StripePaymentProvider`).
- `IEmailProvider`: Swappable email engines (`ConsoleEmailProvider`, `SmtpEmailProvider`).
- `ISpeechToTextService`: Speech transcription adapter using `@google/genai`.

### Persistence Tier
- **PostgreSQL**: Managed relationally via Prisma ORM for User profiles, learning progress, test attempts, certificates, media metadata, and billing logs.
- **Redis**: In-memory caching for sliding window rate limiting.
