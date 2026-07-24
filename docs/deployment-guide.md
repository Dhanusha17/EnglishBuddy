# Production Deployment Guide

This guide covers setup, environment configuration, database migrations, containerized deployment, backups, and rollback procedures for **EnglishBuddy**.

---

## 1. Environment Variables Reference

Ensure all environment variables are set in your deployment environment (or `.env` file):

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | HTTP Listening port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/mydb?schema=public` |
| `JWT_SECRET` | Secret key for signing JWTs | `super-secret-production-jwt-key` |
| `REDIS_URL` | Redis connection URL for rate limiting | `redis://localhost:6379` |
| `GEMINI_API_KEY` | Google Gemini AI API key | `AQ.Ab8RN...` |
| `STORAGE_PROVIDER` | Media storage provider (`local`, `s3`, `cloudinary`) | `s3` |
| `AWS_REGION` | AWS S3 region (if S3) | `us-east-1` |
| `AWS_S3_BUCKET_NAME` | S3 Bucket name | `englishbuddy-media` |
| `AWS_ACCESS_KEY_ID` | AWS Access Key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key | `secret...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name (if Cloudinary) | `cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `secret` |
| `EMAIL_API_KEY` | Resend / SMTP Email API Key | `re_123456...` |
| `NEXT_PUBLIC_APP_URL` | Base public URL of application | `https://englishbuddy.example.com` |

---

## 2. Local Development & Staging

### Local Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup database schema & seed initial roles/courses
npx prisma db push
npm run seed  # or npx prisma db seed

# 3. Start development server
npm run dev
```

### Staging Build Validation
```bash
# Typecheck & Run test suite
npx tsc --noEmit
npm test

# Build production bundle
npm run build
npm start
```

---

## 3. Production Containerized Deployment (Docker)

Using `docker-compose` to run web application, PostgreSQL, and Redis:

```bash
# 1. Clone repository & configure environment
cp .env.example .env

# 2. Build & launch containers in background
docker-compose up -d --build

# 3. Apply database schema inside container
docker-compose exec web npx prisma db push

# 4. Verify service health
curl http://localhost:3000/api/health
```

---

## 4. Database Migrations & Seeding

### Migration Command
For production databases using Prisma migrations:
```bash
npx prisma db push --skip-generate
# OR for migration history tracking:
npx prisma migrate deploy
```

### Seeding Initial Data
```bash
npx tsx prisma/seed.ts
```

---

## 5. Rollback Procedure

If a deployment failure occurs:

1. **Application Code Rollback**:
   ```bash
   git checkout tags/v1.x-stable
   docker-compose up -d --build web
   ```

2. **Database Rollback**:
   Restore the last pre-deployment database dump:
   ```bash
   pg_restore -U johndoe -h localhost -d mydb -v "/backups/englishbuddy_predeploy.dump"
   ```

3. **Cache Purge**:
   Flush Redis rate limit keys:
   ```bash
   redis-cli flushdb
   ```
