import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ code: string }> }) => {
  const code = (await params).code;
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const certificate = await db.certificate.findUnique({
    where: { certificateCode: code }
  });

  if (!certificate) return NextResponse.json({ error: "Not Found" }, { status: 404 });

  await db.certificate.delete({
    where: { certificateCode: code }
  });

  return NextResponse.json({ message: "Certificate revoked successfully" });
});
