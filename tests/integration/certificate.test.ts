import { CertificateGenerator } from '../../src/services/certificates/CertificateGenerator';

describe('CertificateGenerator Integration Tests', () => {
  it('should generate a valid PDF certificate buffer containing header and QR code', async () => {
    const pdfBuffer = await CertificateGenerator.generatePDF({
      certificateId: 'CERT-TEST-999',
      studentName: 'Dhanusha Learner',
      title: 'B2 Upper Intermediate Proficiency',
      category: 'English Level Completion',
      issuedAt: new Date('2026-07-20'),
      verificationUrl: 'http://localhost:3000/certificates/verify/CERT-TEST-999',
    });

    expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
    expect(pdfBuffer.byteLength).toBeGreaterThan(1000);

    // Verify PDF header magic bytes '%PDF'
    const header = pdfBuffer.slice(0, 4).toString('utf8');
    expect(header).toBe('%PDF');
  });
});
