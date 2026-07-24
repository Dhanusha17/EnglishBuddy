import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { setAuthCookies, isAccountLocked, registerFailedLogin, resetFailedLogins } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit-logger";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { email, password } = loginSchema.parse(body);

  const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || undefined;

  const user = await db.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user || !user.passwordHash) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  if (user.status === "PENDING") {
    return NextResponse.json(
      { error: "Your account is waiting for administrator approval." },
      { status: 403 }
    );
  }

  if (user.status === "REJECTED") {
    return NextResponse.json(
      { error: "Your account has been rejected. Please contact the administrator." },
      { status: 403 }
    );
  }

  if (user.status === "SUSPENDED" || !user.accountActive) {
    return NextResponse.json(
      { error: "Your account has been suspended. Please contact the administrator." },
      { status: 403 }
    );
  }

  // 1. Account Lockout Check
  if (await isAccountLocked(user)) {
    await db.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        status: "LOCKED_OUT",
      },
    });
    
    await logAuditEvent({
      userId: user.id,
      action: "LOGIN_BLOCKED_LOCKOUT",
      ipAddress,
    });

    const lockoutMins = Math.ceil(
      (new Date(user.lockoutUntil!).getTime() - Date.now()) / (60 * 1000)
    );
    return NextResponse.json(
      { error: `Account temporarily locked due to repeated failed logins. Try again in ${lockoutMins} minutes.` },
      { status: 423 }
    );
  }

  // 2. Validate Password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    const { locked, attemptsLeft } = await registerFailedLogin(user.id, user.failedLoginAttempts);

    await db.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        status: "FAILED_PASSWORD",
      },
    });

    if (locked) {
      return NextResponse.json(
        { error: "Too many failed login attempts. Your account has been locked for 15 minutes." },
        { status: 423 }
      );
    }

    return NextResponse.json(
      { error: `Invalid email or password. ${attemptsLeft} attempt(s) remaining before lockout.` },
      { status: 401 }
    );
  }

  // 3. Successful Login: Reset lockout counter & create session
  await resetFailedLogins(user.id);
  await setAuthCookies(user.id, user.role?.name || "student", userAgent, ipAddress);

  await db.loginHistory.create({
    data: {
      userId: user.id,
      ipAddress,
      userAgent,
      status: "SUCCESS",
    },
  });

  await logAuditEvent({
    userId: user.id,
    action: "LOGIN_SUCCESS",
    ipAddress,
  });

  return NextResponse.json(
    {
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role?.name || "student",
      },
    },
    { status: 200 }
  );
});
