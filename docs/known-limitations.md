# Known Technical Limitations & Mitigation Strategies

This document lists known constraints in **EnglishBuddy** and their operational mitigations.

---

## 1. Local Storage Mode
- **Constraint**: When `STORAGE_PROVIDER=local` is active, uploaded media files are saved to `public/uploads/` on the local disk. In multi-instance serverless deployments (e.g. Vercel), local disk writes are ephemeral.
- **Mitigation**: Switch to `STORAGE_PROVIDER=s3` or `STORAGE_PROVIDER=cloudinary` in production environments.

## 2. In-Memory Rate Limiting Fallback
- **Constraint**: If `REDIS_URL` is not provided or Redis is unreachable, rate limiting falls back to an in-memory `Map`. In multi-container environments, in-memory counters are isolated per process.
- **Mitigation**: Deploy a Redis instance (`redis://redis:6379`) in production to share rate limit state across all web instances.

## 3. WebRTC Audio Streaming vs Upload Transcriptions
- **Constraint**: Audio speaking recordings currently process via upload buffers sent to Gemini multimodal API rather than low-latency real-time WebRTC streams.
- **Mitigation**: `ISpeechToTextService` interface is pre-structured to allow swapping to streaming WebSockets in future releases.
