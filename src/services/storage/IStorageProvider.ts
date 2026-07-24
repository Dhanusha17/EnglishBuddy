export interface StorageUploadOptions {
  filename: string;
  category: string; // e.g. profile-picture, resume, audio-recording, certificate, etc.
  mimeType: string;
  folder?: string;
  isPublic?: boolean;
  metadata?: Record<string, string | number | boolean>;
}

export interface StorageObject {
  key: string;
  url: string;
  size: number;
  mimeType: string;
  provider: 'local' | 's3' | 'cloudinary';
  etag?: string;
}

export interface IStorageProvider {
  /**
   * Uploads a file buffer or byte array to storage.
   */
  uploadFile(file: Buffer | Uint8Array, options: StorageUploadOptions): Promise<StorageObject>;

  /**
   * Deletes a file from storage by key.
   */
  deleteFile(key: string): Promise<boolean>;

  /**
   * Generates a signed URL or accessible URL for a given file key.
   */
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Retrieves a file buffer from storage by key.
   */
  getFileBuffer(key: string): Promise<Buffer>;

  /**
   * Gets the public or access URL of a stored file key.
   */
  getFileUrl(key: string): string;
}
