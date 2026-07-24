# Security, Authentication & Authorization Guide

This guide details the security architecture, authentication mechanisms, session controls, role-based access rules, rate limiting, and audit logging for **EnglishBuddy**.

---

## 1. Authentication Architecture

### JWT Tokens & Refresh Token Rotation
- **Short-Lived Access Token**: Signed via `jose` using HS256 with a 15-minute expiration window.
- **Refresh Token Rotation**: Issued as HTTP-only secure cookies (`refresh_token`). Saved in the `RefreshToken` database table. Each refresh request invalidates the previous refresh token and issues a new pair to prevent token replay attacks.
- **Session Management**: Each login records a `UserSession` entry. Users can view active devices and remotely revoke sessions via `DELETE /api/auth/sessions?id={sessionId}`.

### Account Lockout Protection
- After **5 consecutive failed password attempts**, the account is locked for **15 minutes** (`lockoutUntil`).
- Attempts are tracked per user ID and IP address in `LoginHistory`.

### Passwords & Security Tokens
- Password hashing is performed using **bcryptjs** (salt rounds: 10).
- Password Reset & Email Verification tokens are crypto-random hexadecimal strings set with explicit 60-minute expiration timestamps.

---

## 2. Authorization (Role-Based Access Control)

### Role Hierarchy
1. `STUDENT` (Base level access)
2. `PREMIUM_STUDENT` (Unlocks full curriculum & AI limits)
3. `INSTRUCTOR` (Can create lessons & modules)
4. `MODERATOR` (Can moderate community discussions)
5. `ADMIN` (Full administrative capabilities)
6. `SUPER_ADMIN` (System owner)

### Middleware Enforcement
Routes matching `/dashboard/:path*`, `/admin/:path*`, and `/api/:path*` are guarded by `src/middleware.ts`:
- Unauthenticated users trying to access `/dashboard` or `/admin` are redirected to `/auth/login`.
- Non-administrators attempting to access `/admin` or `/api/admin` receive an HTTP 403 Forbidden error.

---

## 3. Security Safeguards

### Rate Limiting (`src/lib/rate-limiter.ts`)
- Sliding window algorithm backed by **Redis** (`ioredis`) with an automatic in-memory fallback.
- Default limit: **150 requests/minute** for general APIs, **20 requests/minute** for sensitive authentication endpoints (`/api/auth/*`).

### CSRF & XSS Protection
- Cross-Site Request Forgery (CSRF) protection verifies `Origin` and `Host` headers on state-mutating requests (`POST`, `PUT`, `DELETE`).
- Input sanitization (`src/lib/sanitizer.ts`) strips malicious HTML tags and escapes dangerous XSS entities.

### HTTP Security Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (Production)
- `Content-Security-Policy`: Explicit script, style, image, font, and frame restriction policy.

### Audit Logging (`src/lib/audit-logger.ts`)
Critical security events (logins, password resets, account deletions, subscription upgrades) are recorded in the `AuditLog` table with IP addresses and metadata.
