import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { z } from "zod";
import crypto from "crypto";
import { emailService } from "@/services/email/EmailService";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { email } = schema.parse(body);

  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://englishbuddy.app");
    const resetLink = `${appBaseUrl}/auth/reset-password?token=${resetToken}`;

    await emailService.sendPasswordResetEmail(user.email, user.name, resetLink);
  }

  // Always return success to prevent email enumeration attacks
  return NextResponse.json(
    { message: "If an account exists for that email, a password reset link has been sent." },
    { status: 200 }
  );
});
