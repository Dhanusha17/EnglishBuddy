import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { logAuditEvent } from "@/lib/audit-logger";

const schema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { token, newPassword } = schema.parse(body);

  const user = await db.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired password reset token." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      failedLoginAttempts: 0,
      lockoutUntil: null,
    },
  });

  // Revoke active sessions for security
  await db.refreshToken.updateMany({
    where: { userId: user.id },
    data: { isRevoked: true },
  });

  await logAuditEvent({
    userId: user.id,
    action: "PASSWORD_RESET_SUCCESS",
    ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1",
  });

  return NextResponse.json(
    { message: "Password reset successful. You may now log in with your new password." },
    { status: 200 }
  );
});
