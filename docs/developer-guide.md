# Developer Handbook

Welcome to the **EnglishBuddy** codebase! This guide covers development conventions, adding new features, database schema management, and writing tests.

---

## 1. Project Structure

```
src/
├── app/                  # Next.js App Router (pages & API routes)
│   ├── admin/            # Admin Panel UI
│   ├── api/              # REST API Endpoints
│   ├── auth/             # Authentication Pages
│   ├── certificates/     # Certificate Verification UI
│   └── dashboard/        # Student Dashboard UI
├── components/           # Reusable UI & Feature Components
├── lib/                  # Auth, DB, AI, Logger, RBAC, Rate Limiter
├── services/             # Storage, Email, Audio, Subscription Services
├── store/                # Zustand State Store
├── types/                # TypeScript Interfaces
└── validation/           # Zod & Media Validation Schemas
tests/
├── unit/                 # Jest Unit Tests
└── integration/          # Integration Tests
```

---

## 2. Coding Guidelines & Rules

- **Strict TypeScript**: Avoid `any` types wherever possible. Ensure `npx tsc --noEmit` passes with 0 errors.
- **Next.js Rules**: Follow App Router conventions. Remember Next.js 15+ async `cookies()` and dynamic params (`params: Promise<{ id: string }>`).
- **Styling**: Use Vanilla CSS / Tailwind utilities without hardcoding generic inline hex colors. Use CSS tokens and Shadcn variables.
- **Error Handling**: Wrap API routes using `withErrorHandler` from `@/utils/api-handler`.

---

## 3. Database Schema Changes

When modifying `prisma/schema.prisma`:
```bash
# 1. Update schema.prisma
# 2. Generate Prisma Client
npx prisma generate

# 3. Push to development database
npx prisma db push
```

---

## 4. Running Unit & Integration Tests

```bash
npm test
```
