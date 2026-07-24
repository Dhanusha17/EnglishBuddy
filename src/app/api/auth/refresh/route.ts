import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { signToken, setAuthCookies } from "@/lib/auth";
import crypto from "crypto";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const refreshTokenRaw = req.cookies.get("refresh_token")?.value;

  if (!refreshTokenRaw) {
    return NextResponse.json({ error: "Refresh token missing" }, { status: 401 });
  }

  // Find non-revoked, non-expired refresh token in DB
  const storedToken = await db.refreshToken.findUnique({
    where: { token: refreshTokenRaw },
    include: { user: { include: { role: true } } },
  });

  if (!storedToken || storedToken.isRevoked || new Date() > new Date(storedToken.expiresAt)) {
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
  }

  // Rotate token: revoke old token
  await db.refreshToken.update({
    where: { id: storedToken.id },
    data: { isRevoked: true },
  });

  // Issue new access token and new refresh token
  const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined;
  const userAgent = req.headers.get("user-agent") || undefined;

  await setAuthCookies(
    storedToken.userId,
    storedToken.user.role?.name || "student",
    userAgent,
    ipAddress
  );

  return NextResponse.json(
    { message: "Token refreshed successfully" },
    { status: 200 }
  );
});
