# EnglishBuddy – Release Changelog

All notable changes across all development phases are documented below.

---

## [1.0.0] - 2026-07-20

### Phase 1: Core Foundation & UI Component Library
- Initialized Next.js 16 App Router application with TypeScript and Tailwind CSS.
- Implemented core layout, navigation headers, sidebar, and theme switching (Light/Dark mode).
- Built foundational UI component library using `@base-ui/react` and `class-variance-authority`.

### Phase 2: Frontend Dashboard & CEFR Learning Hub
- Created Student Dashboard, Course Module View, Practice Rooms, Placement Preparation Hub, and Community Forums.
- Added XP reward overlays, confetti celebrations (`canvas-confetti`), and progress meters.

### Phase 3: PostgreSQL Database & Backend API Layer
- Configured Prisma ORM with 35+ models covering Users, Profiles, Courses, Lessons, Tests, Certificates, Posts, and Audit Logs.
- Built RESTful API endpoints for authentication, course progress tracking, placement questions, and community posts.

### Phase 4: Gemini Multimodal AI Integration
- Integrated `@google/genai` with `PromptBuilder`, `GeminiProvider`, and `MockProvider`.
- Built AI Tutor Chat, Speaking Coach, Essay Corrector, and Mock Interview Generator.

### Phase 5: File Storage, Media Processing & Certificate Infrastructure
- Created abstract `IStorageProvider` supporting Local Storage, AWS S3, and Cloudinary.
- Built media upload validation (`src/validation/media.ts`) and magic byte verification.
- Implemented `CertificateGenerator.ts` using `pdf-lib` and `qrcode` for vector PDF certificates with QR code verification.

### Phase 6: Enterprise Security, Auth Hardening & Subscriptions
- Implemented JWT Refresh Token Rotation, Session & Device tracking, and Account Lockout (5 failed attempts locks for 15 mins).
- Added RBAC authorization (`STUDENT`, `PREMIUM_STUDENT`, `INSTRUCTOR`, `MODERATOR`, `ADMIN`, `SUPER_ADMIN`).
- Implemented Redis-backed Rate Limiter, Anti-CSRF checks, XSS Sanitization, and Content Security Policy (CSP).
- Created abstract Subscription Engine (`SubscriptionService`, `UsageTracker`) enforcing plan quotas (`Free`, `Premium`, `Enterprise`).
- Added abstract Email Infrastructure (`EmailService`) and Health Inspection endpoint (`/api/health`).

### Phase 7: Production Readiness, Testing, CI/CD & Deployment
- Implemented Jest automated unit and integration test suite (`tests/unit/*`, `tests/integration/*`).
- Added GitHub Actions CI workflow (`.github/workflows/ci.yml`), multi-stage `Dockerfile`, and `docker-compose.yml`.
- Configured dynamic `sitemap.ts`, `robots.ts`, Open Graph metadata, and JSON-LD structured data.
- Published complete documentation suite in `docs/`.
