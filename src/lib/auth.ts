import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";
import db from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-placeholder";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  sub: string; // User ID
  role: string;
  sessionId?: string;
}

export async function signToken(payload: TokenPayload, expiresIn: string): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookies(userId: string, role: string, userAgent?: string, ipAddress?: string) {
  const sessionId = crypto.randomUUID();
  const refreshTokenRaw = crypto.randomBytes(32).toString('hex');

  const accessToken = await signToken({ sub: userId, role, sessionId }, "15m");
  const refreshTokenJwt = await signToken({ sub: userId, role, sessionId }, "7d");

  // Store RefreshToken in DB
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.refreshToken.create({
    data: {
      userId,
      token: refreshTokenRaw,
      expiresAt,
      deviceInfo: userAgent || null,
      ipAddress: ipAddress || null,
    },
  });

  // Store UserSession in DB
  await db.userSession.create({
    data: {
      id: sessionId,
      userId,
      token: refreshTokenRaw,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  cookieStore.set("refresh_token", refreshTokenRaw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return { accessToken, refreshToken: refreshTokenRaw, sessionId };
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  const refreshTokenRaw = cookieStore.get("refresh_token")?.value;

  if (refreshTokenRaw) {
    // Revoke refresh token & session in DB
    try {
      await db.refreshToken.updateMany({
        where: { token: refreshTokenRaw },
        data: { isRevoked: true },
      });
      await db.userSession.updateMany({
        where: { token: refreshTokenRaw },
        data: { isRevoked: true },
      });
    } catch (e) {
      console.warn("Failed to revoke session on logout:", e);
    }
  }

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  return await verifyToken(token);
}

/**
 * Checks if account is locked due to repeated failed logins.
 */
export async function isAccountLocked(user: { lockoutUntil: Date | null }): Promise<boolean> {
  if (!user.lockoutUntil) return false;
  if (new Date() > new Date(user.lockoutUntil)) {
    return false;
  }
  return true;
}

/**
 * Increments failed login counter. Locks account for 15 mins after 5 failed attempts.
 */
export async function registerFailedLogin(userId: string, currentAttempts: number): Promise<{ locked: boolean; attemptsLeft: number }> {
  const newAttempts = currentAttempts + 1;
  let lockoutUntil: Date | null = null;
  let locked = false;

  if (newAttempts >= 5) {
    lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
    locked = true;
  }

  await db.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: newAttempts,
      lockoutUntil,
    },
  });

  return {
    locked,
    attemptsLeft: Math.max(0, 5 - newAttempts),
  };
}

/**
 * Resets failed login count on successful authentication.
 */
export async function resetFailedLogins(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: 0,
      lockoutUntil: null,
    },
  });
}
