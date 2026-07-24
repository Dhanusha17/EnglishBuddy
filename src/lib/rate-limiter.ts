import Redis from 'ioredis';

// In-memory fallback map if Redis URL is not configured
const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

let redisClient: Redis | null = null;
if (process.env.REDIS_URL && process.env.REDIS_URL !== 'redis://localhost:6379') {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });
    redisClient.on('error', (err) => console.warn('Redis rate-limiter connection warning:', err.message));
  } catch (e) {
    redisClient = null;
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Enforces rate limiting on a specific identifier (IP address, user ID, or endpoint key).
 * @param identifier Unique string identifying the requester
 * @param limit Maximum allowed requests per window
 * @param windowSeconds Duration of rate limit window in seconds
 */
export async function rateLimit(
  identifier: string,
  limit: number = 60,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const reset = now + windowSeconds;

  if (redisClient) {
    try {
      const current = await redisClient.incr(key);
      if (current === 1) {
        await redisClient.expire(key, windowSeconds);
      }
      const remaining = Math.max(0, limit - current);
      return {
        success: current <= limit,
        limit,
        remaining,
        reset,
      };
    } catch (e) {
      // Fall through to in-memory store on Redis error
    }
  }

  // In-Memory Fallback
  const entry = inMemoryStore.get(key);
  if (!entry || Date.now() > entry.resetTime) {
    inMemoryStore.set(key, {
      count: 1,
      resetTime: Date.now() + windowSeconds * 1000,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset,
    };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  return {
    success: entry.count <= limit,
    limit,
    remaining,
    reset,
  };
}
