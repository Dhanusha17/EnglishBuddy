# EnglishBuddy 🚀

> **English Language Mastery & Campus Placement Preparation Platform**

EnglishBuddy is a production-grade, full-stack web application designed to empower engineering students and career aspirants with English fluency, technical interview preparation, AI-powered speaking practice, automated certificate generation, and campus placement readiness.

---

## 🌟 Key Features

- **CEFR Learning Pathways**: Interactive A1 - C2 level modules, grammar drills, vocabulary builders, and real-time XP gamification.
- **AI Practice Suite**: Multimodal AI speaking coach, grammar correction, and mock HR/Technical interview simulators powered by Google Gemini.
- **Placement Preparation**: ATS-friendly resume builders, cover letter generators, company-specific preparation guides, and group discussion (GD) topics.
- **Media & Storage Layer**: Pluggable storage service supporting Local Storage, AWS S3, and Cloudinary with MIME validation and image optimization.
- **Dynamic PDF Certificates**: Vector PDF certificate generation with embedded QR code verification (`/certificates/verify/[id]`).
- **Enterprise Security & Auth**: JWT Refresh Token Rotation, Session & Device tracking, Account Lockout after 5 failed attempts, RBAC authorization, Rate Limiting, and Audit Logging.
- **Subscription Engine**: Tiered plan management (`Free`, `Premium`, `Enterprise`) enforcing daily AI requests, storage MB, practice sessions, and file upload quotas.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Standalone Output)
- **Frontend**: React 19, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, Recharts
- **Backend & Database**: Node.js, Prisma ORM, PostgreSQL, Redis (`ioredis`), Pino Logger
- **Security & Auth**: Jose JWT, Bcryptjs, Custom Security & RBAC Middleware
- **AI Engine**: `@google/genai` (Gemini Multimodal)
- **PDF & Media**: `pdf-lib`, `qrcode`, `@aws-sdk/client-s3`, `cloudinary`
- **Testing & Tooling**: Jest, `ts-jest`, ESLint, Docker, GitHub Actions CI/CD

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/example/englishbuddy-english.git
cd englishbuddy-english

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Generate Prisma Client & Push DB Schema
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Validation

```bash
# Run unit and integration tests
npm test

# Run TypeScript type check
npx tsc --noEmit

# Test production build
npm run build
```

---

## 📚 Documentation Directory

Detailed platform documentation is available in the [`docs/`](./docs) directory:

- [Deployment Guide](docs/deployment-guide.md)
- [Architecture Overview](docs/architecture-overview.md)
- [API Documentation](docs/api-documentation.md)
- [Security & Auth Guide](docs/security-and-auth-guide.md)
- [Subscription Architecture](docs/subscription-architecture.md)
- [User Guide](docs/user-guide.md)
- [Administrator Guide](docs/administrator-guide.md)
- [Developer Guide](docs/developer-guide.md)
- [Operations Manual](docs/operations-manual.md)
- [Changelog](docs/changelog.md)
- [Known Limitations](docs/known-limitations.md)
- [Future Roadmap](docs/future-roadmap.md)
