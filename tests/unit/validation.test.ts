import { validateMediaUpload, verifyMagicBytes } from '../../src/validation/media';

describe('Media Validation & Security Unit Tests', () => {
  describe('validateMediaUpload', () => {
    it('should validate valid profile picture uploads', () => {
      const result = validateMediaUpload(
        { filename: 'avatar.png', size: 1024 * 1024, mimeType: 'image/png' },
        'profile-picture'
      );
      expect(result.valid).toBe(true);
    });

    it('should reject file sizes exceeding category limits', () => {
      const result = validateMediaUpload(
        { filename: 'huge_avatar.png', size: 10 * 1024 * 1024, mimeType: 'image/png' },
        'profile-picture' // max 5MB
      );
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum allowed limit');
    });

    it('should reject invalid MIME types', () => {
      const result = validateMediaUpload(
        { filename: 'script.exe', size: 500, mimeType: 'application/x-msdownload' },
        'profile-picture'
      );
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file format');
    });

    it('should enforce admin permission checks for restricted categories', () => {
      const resultStudent = validateMediaUpload(
        { filename: 'worksheet.pdf', size: 1024, mimeType: 'application/pdf' },
        'worksheet',
        'STUDENT'
      );
      expect(resultStudent.valid).toBe(false);
      expect(resultStudent.error).toContain('require Administrator rights');

      const resultAdmin = validateMediaUpload(
        { filename: 'worksheet.pdf', size: 1024, mimeType: 'application/pdf' },
        'worksheet',
        'ADMIN'
      );
      expect(resultAdmin.valid).toBe(true);
    });
  });

  describe('verifyMagicBytes', () => {
    it('should correctly identify PNG magic bytes', () => {
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      expect(verifyMagicBytes(pngBuffer, 'image/png')).toBe(true);
    });

    it('should correctly identify PDF magic bytes', () => {
      const pdfBuffer = Buffer.from('%PDF-1.4 header text');
      expect(verifyMagicBytes(pdfBuffer, 'application/pdf')).toBe(true);
    });

    it('should reject mismatched magic bytes', () => {
      const fakePng = Buffer.from('FAKE TEXT HEADER FOR FILE');
      expect(verifyMagicBytes(fakePng, 'image/png')).toBe(false);
    });
  });
});
