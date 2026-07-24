import path from 'path';
import fs from 'fs';
import { LocalStorageProvider } from '../../src/services/storage/LocalStorageProvider';

describe('LocalStorageProvider Integration Tests', () => {
  const testDir = path.join(process.cwd(), 'public', 'uploads_test');
  const provider = new LocalStorageProvider(testDir);
  let uploadedKey = '';

  afterAll(async () => {
    try {
      await fs.promises.rm(testDir, { recursive: true, force: true });
    } catch (e) {
      // ignore cleanup errors
    }
  });

  it('should upload a file buffer and return a valid storage object', async () => {
    const content = Buffer.from('Test file content for storage integration test');
    const result = await provider.uploadFile(content, {
      filename: 'sample.txt',
      category: 'worksheet',
      mimeType: 'text/plain',
    });

    expect(result.key).toContain('worksheet/');
    expect(result.size).toBe(content.byteLength);
    expect(result.provider).toBe('local');

    uploadedKey = result.key;
  });

  it('should retrieve stored file buffer by key', async () => {
    expect(uploadedKey).not.toBe('');
    const buffer = await provider.getFileBuffer(uploadedKey);
    expect(buffer.toString()).toBe('Test file content for storage integration test');
  });

  it('should delete stored file by key', async () => {
    expect(uploadedKey).not.toBe('');
    const success = await provider.deleteFile(uploadedKey);
    expect(success).toBe(true);

    await expect(provider.getFileBuffer(uploadedKey)).rejects.toThrow();
  });
});
