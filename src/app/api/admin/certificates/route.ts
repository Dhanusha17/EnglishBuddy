import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const certificates = await db.certificate.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } }
    }
  });

  return NextResponse.json(certificates);
});
