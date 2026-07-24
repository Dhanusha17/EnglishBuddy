import { 
  S3Client, 
  PutObjectCommand, 
  DeleteObjectCommand, 
  GetObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl as s3GetSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { IStorageProvider, StorageObject, StorageUploadOptions } from './IStorageProvider';

export class S3StorageProvider implements IStorageProvider {
  private client: S3Client;
  private bucketName: string;
  private region: string;
  private customDomain?: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'englishbuddy-media';
    this.customDomain = process.env.AWS_S3_CUSTOM_DOMAIN;

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      endpoint: process.env.AWS_S3_ENDPOINT, // Optional (e.g. MinIO or Cloudflare R2)
    });
  }

  private generateKey(filename: string, category: string): string {
    const sanitizeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const hash = crypto.randomBytes(6).toString('hex');
    const datePrefix = new Date().toISOString().slice(0, 7);
    return `${category}/${datePrefix}/${hash}-${sanitizeName}`;
  }

  async uploadFile(file: Buffer | Uint8Array, options: StorageUploadOptions): Promise<StorageObject> {
    const key = this.generateKey(options.filename, options.category);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: options.mimeType,
      Metadata: options.metadata ? (Object.fromEntries(
        Object.entries(options.metadata).map(([k, v]) => [k, String(v)])
      ) as Record<string, string>) : undefined,
    });

    const response = await this.client.send(command);
    const url = this.getFileUrl(key);

    return {
      key,
      url,
      size: file.byteLength,
      mimeType: options.mimeType,
      provider: 's3',
      etag: response.ETag ? response.ETag.replace(/"/g, '') : undefined,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch (error) {
      console.error('S3StorageProvider delete error:', error);
      return false;
    }
  }

  async getSignedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return await s3GetSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  async getFileBuffer(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const response = await this.client.send(command);
    if (!response.Body) {
      throw new Error(`S3 Object body empty for key: ${key}`);
    }
    const byteArray = await response.Body.transformToByteArray();
    return Buffer.from(byteArray);
  }

  getFileUrl(key: string): string {
    if (this.customDomain) {
      return `${this.customDomain.replace(/\/$/, '')}/${key}`;
    }
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
