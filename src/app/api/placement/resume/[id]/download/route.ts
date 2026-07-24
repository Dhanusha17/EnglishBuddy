import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import PDFDocument from "pdfkit";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  
  const resume = await db.resume.findUnique({
    where: { id },
    include: { versions: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  if (!resume || resume.versions.length === 0) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  let resumeData;
  try {
    resumeData = JSON.parse(resume.versions[0].content);
  } catch (e) {
    return NextResponse.json({ error: "Invalid resume data format" }, { status: 500 });
  }


  // This is a simple trick to capture PDFKit output in memory
  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: any[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Build PDF Content
      doc.fontSize(24).font('Helvetica-Bold').text(resumeData.personalInfo?.name || "Your Name", { align: 'center' });
      doc.moveDown(0.2);
      
      const contactInfo = [
        resumeData.personalInfo?.email,
        resumeData.personalInfo?.phone,
        resumeData.personalInfo?.linkedin
      ].filter(Boolean).join(" | ");
      
      doc.fontSize(10).font('Helvetica').fillColor('blue').text(contactInfo, { align: 'center' }).fillColor('black');
      doc.moveDown(1.5);

      // Summary
      if (resumeData.personalInfo?.summary) {
        doc.fontSize(14).font('Helvetica-Bold').text('Professional Summary');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica').text(resumeData.personalInfo.summary);
        doc.moveDown(1);
      }

      // Experience
      if (resumeData.experience && resumeData.experience.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('Experience');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        
        resumeData.experience.forEach((exp: any) => {
          doc.fontSize(12).font('Helvetica-Bold').text(exp.title || "Title");
          doc.fontSize(11).font('Helvetica-Oblique').text(`\${exp.company || "Company"} | \${exp.duration || "Duration"}`);
          doc.fontSize(11).font('Helvetica').text(exp.description || "");
          doc.moveDown(0.5);
        });
        doc.moveDown(0.5);
      }

      // Education
      if (resumeData.education && resumeData.education.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('Education');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        
        resumeData.education.forEach((edu: any) => {
          doc.fontSize(12).font('Helvetica-Bold').text(edu.degree || "Degree");
          doc.fontSize(11).font('Helvetica-Oblique').text(`\${edu.institution || "Institution"} | \${edu.year || "Year"}`);
          if (edu.score) doc.fontSize(11).font('Helvetica').text(`Score: \${edu.score}`);
          doc.moveDown(0.5);
        });
        doc.moveDown(0.5);
      }

      // Skills
      if (resumeData.skills && resumeData.skills.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('Skills');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica').text(resumeData.skills.join(', '));
        doc.moveDown(1);
      }

      // Projects
      if (resumeData.projects && resumeData.projects.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('Projects');
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        
        resumeData.projects.forEach((proj: any) => {
          doc.fontSize(12).font('Helvetica-Bold').text(proj.title || "Project Title");
          doc.fontSize(11).font('Helvetica').text(proj.description || "");
          doc.moveDown(0.5);
        });
      }

      doc.end();
    } catch (e) {
      reject(e);
    }
  });

  return new NextResponse(pdfBuffer as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="\${resume.title.replace(/\s+/g, '_')}.pdf"`,
    },
  });
});
