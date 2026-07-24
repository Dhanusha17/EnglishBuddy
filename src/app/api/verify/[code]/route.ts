import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ code: string }> }) => {
  const code = (await params).code;

  if (!code) {
    return NextResponse.json({ error: "Certificate code is required." }, { status: 400 });
  }

  const certificate = await db.certificate.findUnique({
    where: { certificateCode: code },
    include: { user: { select: { name: true } } }
  });

  if (certificate) {
    // Log the verification attempt
    await db.verificationLog.create({
      data: {
        certificateCode: code,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown"
      }
    });

    return NextResponse.json({
      valid: true,
      studentName: certificate.issuedToName || certificate.user.name,
      course: certificate.title,
      category: certificate.category,
      issueDate: certificate.issuedAt
    });
  } else {
    // Also log invalid attempts if they are in the format of a UUID to track brute forcing?
    // Not strictly necessary, just return invalid.
    return NextResponse.json({ valid: false }, { status: 404 });
  }
});
