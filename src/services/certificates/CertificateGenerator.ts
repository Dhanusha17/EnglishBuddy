import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

export interface CertificateData {
  certificateId: string;
  studentName: string;
  title: string;
  category: 'Course Completion' | 'English Level Completion' | 'Practice Milestones' | 'Placement Preparation' | 'Special Achievements' | string;
  issuedAt: Date | string;
  verificationUrl?: string;
}

export class CertificateGenerator {
  /**
   * Generates a PDF certificate document with vector styling, text layout, and QR code verification image.
   */
  static async generatePDF(data: CertificateData): Promise<Buffer> {
    // Create landscape A4 size PDF document (841.89 x 595.28 points)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([841.89, 595.28]);
    const { width, height } = page.getSize();

    // Fonts
    const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontTimesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

    // Color Palette
    const primaryColor = rgb(0.12, 0.38, 0.67); // Deep Blue (#1F61A6)
    const goldColor = rgb(0.85, 0.65, 0.13);    // Elegant Gold (#D9A621)
    const darkTextColor = rgb(0.15, 0.18, 0.25); // Slate (#262E40)
    const mutedTextColor = rgb(0.4, 0.45, 0.52);  // Gray (#667385)

    // 1. Draw Outer Gold Border
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: goldColor,
      borderWidth: 3,
    });

    // 2. Draw Inner Primary Accent Border
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: primaryColor,
      borderWidth: 1.5,
    });

    // 3. Header Banner Text
    const headerTitle = "englishbuddy";
    const headerWidth = fontHelveticaBold.widthOfTextAtSize(headerTitle, 16);
    page.drawText(headerTitle, {
      x: (width - headerWidth) / 2,
      y: height - 70,
      size: 16,
      font: fontHelveticaBold,
      color: primaryColor,
    });

    const subHeader = "ENGLISH LANGUAGE MASTERY & PLACEMENT PLATFORM";
    const subHeaderWidth = fontHelvetica.widthOfTextAtSize(subHeader, 9);
    page.drawText(subHeader, {
      x: (width - subHeaderWidth) / 2,
      y: height - 88,
      size: 9,
      font: fontHelvetica,
      color: mutedTextColor,
    });

    // Decorative Line under header
    page.drawLine({
      start: { x: width / 2 - 120, y: height - 100 },
      end: { x: width / 2 + 120, y: height - 100 },
      thickness: 1,
      color: goldColor,
    });

    // 4. Main Certificate Title
    const certMainTitle = "CERTIFICATE OF ACHIEVEMENT";
    const certTitleWidth = fontHelveticaBold.widthOfTextAtSize(certMainTitle, 28);
    page.drawText(certMainTitle, {
      x: (width - certTitleWidth) / 2,
      y: height - 150,
      size: 28,
      font: fontHelveticaBold,
      color: primaryColor,
    });

    // Category Tag
    const categoryText = `THIS IS PROUDLY PRESENTED FOR: ${data.category.toUpperCase()}`;
    const catTextWidth = fontHelveticaBold.widthOfTextAtSize(categoryText, 11);
    page.drawText(categoryText, {
      x: (width - catTextWidth) / 2,
      y: height - 180,
      size: 11,
      font: fontHelveticaBold,
      color: goldColor,
    });

    // 5. "This is to certify that"
    const certifyText = "This is to certify that";
    const certifyWidth = fontTimesItalic.widthOfTextAtSize(certifyText, 18);
    page.drawText(certifyText, {
      x: (width - certifyWidth) / 2,
      y: height - 230,
      size: 18,
      font: fontTimesItalic,
      color: darkTextColor,
    });

    // 6. Student Name
    const studentName = data.studentName;
    const nameWidth = fontHelveticaBold.widthOfTextAtSize(studentName, 32);
    page.drawText(studentName, {
      x: (width - nameWidth) / 2,
      y: height - 280,
      size: 32,
      font: fontHelveticaBold,
      color: primaryColor,
    });

    // Line under student name
    page.drawLine({
      start: { x: (width - Math.max(nameWidth + 60, 300)) / 2, y: height - 295 },
      end: { x: (width + Math.max(nameWidth + 60, 300)) / 2, y: height - 295 },
      thickness: 1.5,
      color: primaryColor,
    });

    // 7. Achievement Title / Description
    const certDesc = `has successfully fulfilled all requirements and demonstrated exceptional performance in`;
    const descWidth = fontHelvetica.widthOfTextAtSize(certDesc, 13);
    page.drawText(certDesc, {
      x: (width - descWidth) / 2,
      y: height - 335,
      size: 13,
      font: fontHelvetica,
      color: darkTextColor,
    });

    const certTitle = data.title;
    const titleWidth = fontHelveticaBold.widthOfTextAtSize(certTitle, 22);
    page.drawText(certTitle, {
      x: (width - titleWidth) / 2,
      y: height - 370,
      size: 22,
      font: fontHelveticaBold,
      color: goldColor,
    });

    // 8. Issue Date & Certificate ID
    const formattedDate = typeof data.issuedAt === 'string' 
      ? data.issuedAt 
      : data.issuedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    page.drawText(`Date of Issuance: ${formattedDate}`, {
      x: 60,
      y: 90,
      size: 11,
      font: fontHelvetica,
      color: darkTextColor,
    });

    page.drawText(`Certificate ID: ${data.certificateId}`, {
      x: 60,
      y: 72,
      size: 10,
      font: fontHelvetica,
      color: mutedTextColor,
    });

    // 9. QR Code Verification Image
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://englishbuddy.app');
    const verifyUrl = data.verificationUrl || `${appBaseUrl}/certificates/verify/${data.certificateId}`;
    
    try {
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        margin: 1,
        width: 100,
        color: {
          dark: '#1F61A6',
          light: '#FFFFFF'
        }
      });
      const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
      const qrImage = await pdfDoc.embedPng(qrImageBytes);

      page.drawImage(qrImage, {
        x: width - 150,
        y: 60,
        width: 80,
        height: 80,
      });

      page.drawText('Scan to Verify', {
        x: width - 142,
        y: 45,
        size: 9,
        font: fontHelveticaBold,
        color: primaryColor,
      });
    } catch (qrErr) {
      console.error('Failed to embed QR code in certificate PDF:', qrErr);
    }

    // Serialize PDF to Buffer
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}
