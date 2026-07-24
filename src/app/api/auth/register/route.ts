import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { setAuthCookies } from "@/lib/auth";
import { notifyUser } from "@/lib/notifications";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();
  const { name, email, password } = registerSchema.parse(body);

  // Check if user exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User with this email already exists" },
      { status: 409 }
    );
  }

  const isAdminEmail = email.toLowerCase() === "dhanusha.1608@gmail.com";
  const roleName = isAdminEmail ? "admin" : "student";
  
  let targetRole = await db.role.findUnique({
    where: { name: roleName },
  });

  if (!targetRole) {
    targetRole = await db.role.create({
      data: { name: roleName },
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const username = email.split("@")[0] + Math.floor(Math.random() * 1000);

  // Create user with default profile and settings
  const user = await db.user.create({
    data: {
      name,
      email,
      username,
      passwordHash,
      roleId: targetRole.id,
      profile: {
        create: {
          englishLevel: "A1",
        },
      },
      settings: {
        create: {
          theme: "system",
        },
      },
      status: isAdminEmail ? "APPROVED" : "PENDING",
      accountActive: isAdminEmail,
    },
    include: {
      role: true,
    },
  });

  // Welcome Notification
  await notifyUser({
    userId: user.id,
    type: 'REGISTRATION_SUBMITTED',
    title: 'Welcome to EnglishBuddy!',
    message: isAdminEmail 
      ? 'Your admin account has been created successfully.' 
      : 'Your registration request has been submitted successfully. Your account is waiting for administrator approval.',
    actionUrl: '/dashboard/profile',
    emailTemplate: 'WELCOME_EMAIL',
    emailVariables: { name: user.name }
  });

  if (isAdminEmail) {
    return NextResponse.json(
      { message: "Admin registration successful. You can now log in.", user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  }

  return NextResponse.json(
    { message: "Your registration request has been submitted successfully. Your account is waiting for administrator approval. You will receive access after approval.", user: { id: user.id, email: user.email, name: user.name } },
    { status: 201 }
  );
});
