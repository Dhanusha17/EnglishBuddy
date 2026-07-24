# Operations, Backup & Compliance Manual

This manual describes production deployment procedures, database backup strategies, monitoring endpoints, disaster recovery steps, and GDPR compliance rules for **EnglishBuddy**.

---

## 1. System Monitoring & Health Checks

The application exposes a real-time health inspection endpoint:

### Health Check Endpoint
- **GET** `/api/health`

**Response Example (HTTP 200 OK)**:
```json
{
  "status": "OK",
  "timestamp": "2026-07-20T16:30:00.000Z",
  "uptimeSeconds": 86400,
  "services": {
    "database": {
      "status": "healthy",
      "latencyMs": 4
    },
    "memory": {
      "rssMb": 128,
      "heapUsedMb": 64,
      "heapTotalMb": 96
    }
  },
  "responseTimeMs": 6
}
```

---

## 2. Backup & Disaster Recovery Strategy

### PostgreSQL Database Backup
1. **Automated Daily Backups**:
   Run `pg_dump` daily at 02:00 UTC and store compressed dump files in encrypted offsite storage (S3 / Cloudflare R2).
   ```bash
   pg_dump -U johndoe -h localhost -d mydb -F c -b -v -f "/backups/englishbuddy_$(date +%Y%m%d).dump"
   ```
2. **Point-In-Time Recovery (PITR)**:
   Enable Write-Ahead Logging (WAL) archiving on production PostgreSQL servers for sub-minute recovery.

3. **Restore Procedure**:
   ```bash
   pg_restore -U johndoe -h localhost -d mydb -v "/backups/englishbuddy_20260720.dump"
   ```

### Media Storage Backup
- Enable **S3 Versioning** and **Cross-Region Replication (CRR)** on media buckets.

---

## 3. Compliance & User Data Rights

### GDPR User Data Export
- **POST** `/api/users/me/export`
- Generates a downloadable JSON file containing all user profile data, test history, certificates, posts, and billing history.

### Right to be Forgotten (Account Deletion)
- **DELETE** `/api/users/me`
- Cascade deletes user profile, media references, attempts, and sessions, leaving an anonymized entry in `AuditLog` for security records.

---

## 4. Production Deployment Checklist

- [x] Environment variables populated (`DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`, `STORAGE_PROVIDER`, `GEMINI_API_KEY`).
- [x] Prisma migrations applied (`npx prisma db push` or `npx prisma migrate deploy`).
- [x] SSL/TLS active for HTTPS.
- [x] Production build validated (`npm run build`).
