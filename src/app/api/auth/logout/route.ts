import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import { clearAuthCookies, getSession } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit-logger";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

  if (session) {
    await logAuditEvent({
      userId: session.sub,
      action: "LOGOUT",
      ipAddress,
    });
  }

  await clearAuthCookies();

  return NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );
});
