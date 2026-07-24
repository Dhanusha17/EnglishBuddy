import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const pendingUsers = await db.user.findMany({
    where: { status: "PENDING" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      status: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ data: pendingUsers }, { status: 200 });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, action } = body; // action: "APPROVE" or "REJECT"

  if (!userId || !["APPROVE", "REJECT"].includes(action)) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
  const accountActive = action === "APPROVE";

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      status: newStatus,
      accountActive: accountActive,
    },
  });

  return NextResponse.json({ 
    message: `User successfully ${newStatus.toLowerCase()}`,
    user: { id: updatedUser.id, status: updatedUser.status }
  }, { status: 200 });
});
