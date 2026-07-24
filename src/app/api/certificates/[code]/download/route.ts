import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { generateCertificatePdf, CertificateData } from "@/lib/certificate";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code;
  const session = await getSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const certificate = await db.certificate.findUnique({
    where: { certificateCode: code }
  });

  if (!certificate) return new NextResponse("Not Found", { status: 404 });
  if (certificate.userId !== session.sub && session.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const data: CertificateData = {
      certificateCode: certificate.certificateCode,
      studentName: certificate.issuedToName || "Student",
      courseName: certificate.title,
      issueDate: certificate.issuedAt.toLocaleDateString(),
      category: certificate.category
    };

    const pdfBuffer = await generateCertificatePdf(data);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-\${certificate.certificateCode}.pdf"`
      }
    });
  } catch (error) {
    console.error("PDF Gen Error:", error);
    return new NextResponse("Internal Server Error generating PDF", { status: 500 });
  }
}
