export interface FileCategoryConfig {
  allowedMimeTypes: string[];
  maxSizeMB: number;
  adminOnly?: boolean;
}

export const MEDIA_CATEGORIES: Record<string, FileCategoryConfig> = {
  'profile-picture': {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSizeMB: 5,
  },
  'resume': {
    allowedMimeTypes: ['application/pdf'],
    maxSizeMB: 10,
  },
  'cover-letter': {
    allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSizeMB: 10,
  },
  'certificate': {
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeMB: 10,
  },
  'audio-recording': {
    allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/x-m4a', 'audio/m4a'],
    maxSizeMB: 25,
  },
  'reading-pdf': {
    allowedMimeTypes: ['application/pdf'],
    maxSizeMB: 15,
    adminOnly: true,
  },
  'worksheet': {
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    maxSizeMB: 20,
    adminOnly: true,
  },
  'lesson-image': {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    maxSizeMB: 10,
    adminOnly: true,
  },
};

export interface MediaValidationError {
  valid: boolean;
  error?: string;
}

/**
 * Validates file type, file size, and permissions for a given category.
 */
export function validateMediaUpload(
  file: { filename: string; size: number; mimeType: string },
  category: string,
  userRole?: string
): MediaValidationError {
  const config = MEDIA_CATEGORIES[category];
  if (!config) {
    return {
      valid: false,
      error: `Invalid category: '${category}'. Supported categories: ${Object.keys(MEDIA_CATEGORIES).join(', ')}`,
    };
  }

  // Permission check for admin-only categories
  if (config.adminOnly && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    return {
      valid: false,
      error: `Permission denied: Uploads for category '${category}' require Administrator rights.`,
    };
  }

  // MIME type validation
  if (!config.allowedMimeTypes.includes(file.mimeType.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid file format '${file.mimeType}' for category '${category}'. Allowed types: ${config.allowedMimeTypes.join(', ')}`,
    };
  }

  // File size validation
  const maxSizeBytes = config.maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of ${config.maxSizeMB} MB for category '${category}'.`,
    };
  }

  return { valid: true };
}

/**
 * Inspects initial magic bytes of buffer to verify actual file format matches claimed mime type.
 */
export function verifyMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return true; // Cannot verify very small buffers

  const hexHeader = buffer.slice(0, 4).toString('hex').toLowerCase();

  switch (mimeType.toLowerCase()) {
    case 'image/jpeg':
      return hexHeader.startsWith('ffd8ff');
    case 'image/png':
      return hexHeader === '89504e47';
    case 'image/gif':
      return hexHeader.startsWith('474946');
    case 'application/pdf':
      return buffer.slice(0, 4).toString('utf8') === '%PDF';
    case 'audio/ogg':
    case 'audio/webm':
      return hexHeader.startsWith('4f676753') || hexHeader.startsWith('1a45dfa3');
    default:
      return true; // Fallback to header header checking if unknown signature
  }
}
