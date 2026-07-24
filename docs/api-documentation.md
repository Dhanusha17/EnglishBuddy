# Complete API Reference Documentation

This document lists key REST API endpoints available in **EnglishBuddy**.

---

## 1. Authentication Endpoints (`/api/auth`)

- `POST /api/auth/login`: Authenticates user credentials. Tracks failed attempts; locks account for 15 minutes after 5 failures.
- `POST /api/auth/register`: Creates new student account with default profile & settings.
- `POST /api/auth/logout`: Revokes current refresh token and clears HTTP-only auth cookies.
- `POST /api/auth/refresh`: Rotates refresh token and issues new short-lived access token.
- `POST /api/auth/forgot-password`: Generates password reset token and dispatches reset email.
- `POST /api/auth/reset-password`: Validates token and updates user password.
- `POST /api/auth/verify-email`: Confirms email verification token.
- `GET /api/auth/sessions`: Lists active user sessions & devices.
- `DELETE /api/auth/sessions`: Revokes active sessions.

---

## 2. Media & Storage Endpoints (`/api/media`)

- `POST /api/media/upload`: Multipart upload endpoint with MIME validation, size checking, and storage provider upload.
- `GET /api/media/files/[id]`: Serves local buffer or redirects to presigned S3/Cloudinary URL.
- `DELETE /api/media/files/[id]`: Authorizes ownership and deletes file from storage and database.
- `PUT /api/media/files/[id]`: Replaces existing stored file.
- `GET /api/media/list`: Lists user uploaded files with category filtering & pagination.

---

## 3. Certificate Endpoints (`/api/certificates`)

- `POST /api/certificates/generate`: Generates PDF certificate with embedded QR code.
- `GET /api/certificates/[id]/download`: Direct PDF certificate download link.
- `GET /api/certificates/verify/[id]`: Public verification API returning certificate validity and details.

---

## 4. Subscription & Usage Endpoints (`/api/subscription`)

- `GET /api/subscription/plans`: Returns available subscription tiers and feature limits.
- `GET /api/subscription/status`: Returns user's active plan and today's usage statistics.
- `POST /api/subscription/upgrade`: Upgrades user plan tier.
- `POST /api/subscription/cancel`: Cancels active subscription at billing period end.

---

## 5. System & Health Endpoints

- `GET /api/health`: Health inspection endpoint verifying DB latency, memory usage, and uptime.
- `POST /api/users/me/export`: GDPR compliance user data export.
- `DELETE /api/users/me`: Permanent account deletion endpoint.
