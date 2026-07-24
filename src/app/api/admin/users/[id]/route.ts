import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";
import { notifyUser } from "@/lib/notifications";

const patchSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"]).optional(),
  role: z.enum(["student", "admin"]).optional(),
});

export const PATCH = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { status, role } = patchSchema.parse(body);

  const updateData: any = {};
  
  if (status) {
    updateData.status = status;
    updateData.accountActive = status === "ACTIVE";
    
    // If it's being approved
    if (status === "ACTIVE") {
      updateData.approvedById = session.sub;
      updateData.approvedAt = new Date();
    }
  }

  if (role) {
    const roleRecord = await db.role.findUnique({ where: { name: role } });
    if (roleRecord) {
      updateData.roleId = roleRecord.id;
    }
  }

  const user = await db.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      status: true,
      accountActive: true,
      role: { select: { name: true } }
    }
  });

  if (status) {
    let eventType: any = 'ACCOUNT_APPROVED';
    let title = 'Account Status Update';
    let message = 'Your account status has been updated.';

    if (status === 'ACTIVE') {
      eventType = 'ACCOUNT_APPROVED';
      title = 'Account Approved!';
      message = 'Your account has been approved. You can now access the platform.';
    } else if (status === 'REJECTED') {
      eventType = 'ACCOUNT_REJECTED';
      title = 'Account Rejected';
      message = 'Unfortunately, your registration request has been rejected.';
    } else if (status === 'SUSPENDED') {
      eventType = 'ACCOUNT_SUSPENDED';
      title = 'Account Suspended';
      message = 'Your account has been suspended due to policy violations.';
    }

    await notifyUser({
      userId: id,
      type: eventType,
      title,
      message,
      emailTemplate: 'ACCOUNT_STATUS_UPDATE',
      emailVariables: { status }
    });
  }

  return NextResponse.json({ message: "User updated successfully", user }, { status: 200 });
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  await db.user.delete({ where: { id } });

  return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
});
