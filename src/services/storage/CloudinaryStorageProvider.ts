import { v2 as cloudinary } from 'cloudinary';
import { IStorageProvider, StorageObject, StorageUploadOptions } from './IStorageProvider';

export class CloudinaryStorageProvider implements IStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
      api_key: process.env.CLOUDINARY_API_KEY || '',
      api_secret: process.env.CLOUDINARY_API_SECRET || '',
      secure: true,
    });
  }

  private getResourceType(mimeType: string): 'image' | 'video' | 'raw' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('audio/') || mimeType.startsWith('video/')) return 'video';
    return 'raw';
  }

  async uploadFile(file: Buffer | Uint8Array, options: StorageUploadOptions): Promise<StorageObject> {
    const resourceType = this.getResourceType(options.mimeType);
    const folder = options.folder || `englishbuddy/${options.category}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: options.filename.replace(/\.[^/.]+$/, ''),
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload returned null result'));
          }

          resolve({
            key: result.public_id,
            url: result.secure_url,
            size: result.bytes || file.byteLength,
            mimeType: options.mimeType,
            provider: 'cloudinary',
            etag: result.etag,
          });
        }
      );

      uploadStream.end(file);
    });
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(key);
      return result.result === 'ok' || result.result === 'not found';
    } catch (error) {
      console.error('CloudinaryStorageProvider delete error:', error);
      return false;
    }
  }

  async getSignedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
    return cloudinary.url(key, {
      sign_url: true,
      expires_at: expires,
    });
  }

  async getFileBuffer(key: string): Promise<Buffer> {
    const url = this.getFileUrl(key);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Cloudinary resource key: ${key}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  getFileUrl(key: string): string {
    return cloudinary.url(key, { secure: true });
  }
}
