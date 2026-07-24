import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { IStorageProvider, StorageObject, StorageUploadOptions } from './IStorageProvider';

export class LocalStorageProvider implements IStorageProvider {
  private baseDir: string;
  private secretKey: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.join(process.cwd(), 'public', 'uploads');
    this.secretKey = process.env.JWT_SECRET || 'local-storage-secret-key';
  }

  private async ensureDir(dirPath: string): Promise<void> {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }

  private generateKey(filename: string, category: string): string {
    const sanitizeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const hash = crypto.randomBytes(6).toString('hex');
    const datePrefix = new Date().toISOString().slice(0, 7); // e.g. 2026-07
    return `${category}/${datePrefix}/${hash}-${sanitizeName}`;
  }

  async uploadFile(file: Buffer | Uint8Array, options: StorageUploadOptions): Promise<StorageObject> {
    const key = this.generateKey(options.filename, options.category);
    const fullPath = path.join(this.baseDir, key);
    const dirPath = path.dirname(fullPath);

    await this.ensureDir(dirPath);
    await fs.promises.writeFile(fullPath, file);

    const size = file.byteLength;
    const url = this.getFileUrl(key);

    return {
      key,
      url,
      size,
      mimeType: options.mimeType,
      provider: 'local',
      etag: crypto.createHash('md5').update(file).digest('hex'),
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.baseDir, key);
      await fs.promises.unlink(fullPath);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') return true;
      console.error('LocalStorageProvider delete error:', error);
      return false;
    }
  }

  async getSignedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(`${key}:${expires}`)
      .digest('hex');

    return `/api/media/files/${encodeURIComponent(key)}?expires=${expires}&signature=${signature}`;
  }

  async getFileBuffer(key: string): Promise<Buffer> {
    const fullPath = path.join(this.baseDir, key);
    return await fs.promises.readFile(fullPath);
  }

  getFileUrl(key: string): string {
    return `/uploads/${key}`;
  }

  verifySignedUrl(key: string, expiresStr: string, signature: string): boolean {
    const expires = parseInt(expiresStr, 10);
    if (isNaN(expires) || Date.now() / 1000 > expires) {
      return false;
    }
    const expectedSig = crypto
      .createHmac('sha256', this.secretKey)
      .update(`${key}:${expires}`)
      .digest('hex');
    
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  }
}
