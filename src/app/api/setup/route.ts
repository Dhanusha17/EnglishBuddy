import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import bcrypt from "bcryptjs";

export const POST = withErrorHandler(async (req: NextRequest) => {
  // 1. Verify that NO admin currently exists
  const existingAdmin = await db.user.findFirst({
    where: {
      role: {
        name: "admin",
      },
    },
  });

  if (existingAdmin) {
    return NextResponse.json({ error: "Admin already exists. Setup disabled." }, { status: 403 });
  }

  // 2. Validate payload
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  // 3. Ensure "admin" role exists
  let adminRole = await db.role.findUnique({ where: { name: "admin" } });
  
  if (!adminRole) {
    adminRole = await db.role.create({
      data: { name: "admin" },
    });
  }

  // 4. Create the admin user
  const passwordHash = await bcrypt.hash(password, 10);
  const username = email.split('@')[0] + "_admin_" + Math.floor(Math.random() * 1000);

  const newAdmin = await db.user.create({
    data: {
      email,
      name: "System Administrator",
      username,
      passwordHash,
      roleId: adminRole.id,
      status: "APPROVED",
      accountActive: true,
      profile: {
        create: {
          englishLevel: "C2",
          avatarUrl: "/avatars/admin.png",
          bio: "First Admin",
        },
      },
      settings: {
        create: {
          theme: "system",
          emailNotifications: true,
        },
      },
    },
  });

  return NextResponse.json(
    { message: "First admin created successfully", user: { id: newAdmin.id, email: newAdmin.email } },
    { status: 201 }
  );
});
