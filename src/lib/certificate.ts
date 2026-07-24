import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

export interface CertificateData {
  certificateCode: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  category: string;
}

export async function generateCertificatePdf(data: CertificateData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 50,
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Draw Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#14b8a6');
      doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke('#0f766e');

      // Title
      doc.fontSize(45).fillColor('#0f766e').font('Helvetica-Bold').text('Certificate of Completion', {
        align: 'center',
      });
      doc.moveDown(1);

      // Subtitle
      doc.fontSize(20).fillColor('#374151').font('Helvetica').text('This is to certify that', {
        align: 'center',
      });
      doc.moveDown(1);

      // Name
      doc.fontSize(40).fillColor('#111827').font('Helvetica-Bold').text(data.studentName, {
        align: 'center',
      });
      doc.moveDown(1);

      // Description
      doc.fontSize(16).fillColor('#4b5563').font('Helvetica').text(`has successfully completed the requirements for`, {
        align: 'center',
      });
      doc.moveDown(0.5);
      
      doc.fontSize(24).fillColor('#0f766e').font('Helvetica-Bold').text(data.courseName, {
        align: 'center',
      });
      doc.moveDown(2);

      // Details
      doc.fontSize(12).fillColor('#6b7280').font('Helvetica').text(`Category: \${data.category}`, 50, doc.y);
      doc.text(`Date Issued: \${data.issueDate}`, 50, doc.y + 15);
      doc.text(`Certificate ID: \${data.certificateCode}`, 50, doc.y + 30);

      // Signature
      doc.fontSize(16).fillColor('#111827').font('Helvetica-Oblique').text('EnglishBuddy Admin', doc.page.width - 250, doc.y - 30);
      doc.moveTo(doc.page.width - 250, doc.y + 5).lineTo(doc.page.width - 50, doc.y + 5).stroke('#0f766e');
      doc.fontSize(12).fillColor('#6b7280').font('Helvetica').text('Platform Instructor', doc.page.width - 220, doc.y + 10);

      // QR Code
      const verificationUrl = `http://localhost:3000/verify?code=\${data.certificateCode}`;
      const qrImageBuffer = await QRCode.toBuffer(verificationUrl, { type: 'png', margin: 1 });
      doc.image(qrImageBuffer, (doc.page.width / 2) - 50, doc.page.height - 150, { width: 100 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
