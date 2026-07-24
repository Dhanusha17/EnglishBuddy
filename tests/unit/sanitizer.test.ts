import { sanitizeInput, sanitizeObject } from '../../src/lib/sanitizer';

describe('Sanitizer Unit Tests', () => {
  it('should strip HTML tags and escape XSS vectors', () => {
    const maliciousInput = '<script>alert("XSS")</script>Hello World';
    const clean = sanitizeInput(maliciousInput);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('Hello World');
  });

  it('should recursively sanitize object properties', () => {
    const payload = {
      name: '<b>John</b>',
      bio: '<img src=x onerror=alert(1)>Student',
      details: {
        comment: '<iframe src="malicious"></iframe>Great course',
      },
    };

    const cleanObj = sanitizeObject(payload);
    expect(cleanObj.name).not.toContain('<b>');
    expect(cleanObj.bio).not.toContain('<img');
    expect(cleanObj.details.comment).not.toContain('<iframe');
    expect(cleanObj.details.comment).toContain('Great course');
  });
});
