import { NextRequest, NextResponse } from "next/server";

const rateLimits = new Map<string, { count: number; timestamp: number }>();

export function rateLimit(req: NextRequest, limit: number = 10, windowMs: number = 60000) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
  const now = Date.now();

  const record = rateLimits.get(ip);

  if (!record || now - record.timestamp > windowMs) {
    rateLimits.set(ip, { count: 1, timestamp: now });
    return null; // Not rate limited
  }

  if (record.count >= limit) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  record.count += 1;
  return null;
}
