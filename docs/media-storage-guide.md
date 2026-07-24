# Media Storage, Audio Processing & Certificate Infrastructure Guide

This document describes the media architecture, abstract storage providers, upload APIs, audio speech-to-text integration, and dynamic PDF certificate generation for **EnglishBuddy**.

---

## 1. Storage Provider Architecture

The platform uses an abstract storage service (`IStorageProvider`) behind a central factory (`StorageFactory`), enabling seamless switching between development local storage, AWS S3, and Cloudinary.

### Environment Configuration

Configure `STORAGE_PROVIDER` in your `.env` file:

```env
# Storage Provider Selection: 'local', 's3', or 'cloudinary'
STORAGE_PROVIDER=local

# AWS S3 Configuration (Required if STORAGE_PROVIDER=s3)
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=englishbuddy-media
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_ENDPOINT=                       # Optional custom endpoint (e.g., MinIO/R2)
AWS_S3_CUSTOM_DOMAIN=                   # Optional CDN domain (e.g., https://cdn.example.com)

# Cloudinary Configuration (Required if STORAGE_PROVIDER=cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 2. File Upload Categories & Validation Rules

Uploads are restricted by category, MIME type, and file size:

| Category | Allowed MIME Types | Max Size | Permission Level |
| :--- | :--- | :--- | :--- |
| `profile-picture` | `image/jpeg`, `image/png`, `image/webp`, `image/gif` | 5 MB | Authenticated User |
| `resume` | `application/pdf` | 10 MB | Authenticated User |
| `cover-letter` | `application/pdf`, `application/msword`, `docx` | 10 MB | Authenticated User |
| `certificate` | `application/pdf`, `image/jpeg`, `image/png` | 10 MB | Authenticated User / System |
| `audio-recording` | `audio/mpeg`, `audio/mp3`, `audio/wav`, `audio/webm`, `audio/ogg`, `audio/m4a` | 25 MB | Authenticated User |
| `reading-pdf` | `application/pdf` | 15 MB | Admin Only |
| `worksheet` | `application/pdf`, `msword`, `docx`, `excel` | 20 MB | Admin Only |
| `lesson-image` | `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml` | 10 MB | Admin Only |

---

## 3. Media API Endpoints

### 3.1 Upload File
- **POST** `/api/media/upload`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: File binary
  - `category`: String (e.g. `profile-picture`, `resume`, `audio-recording`)

**Response (201 Created)**:
```json
{
  "message": "File uploaded successfully",
  "data": {
    "id": "c1f7b03e-...",
    "userId": "usr-123",
    "filename": "my_recording.webm",
    "mimeType": "audio/webm",
    "size": 1048576,
    "category": "audio-recording",
    "storageKey": "audio-recording/2026-07/a1b2-my_recording.webm",
    "url": "/uploads/audio-recording/2026-07/a1b2-my_recording.webm",
    "duration": 45
  }
}
```

### 3.2 List User Files
- **GET** `/api/media/list?category=resume&page=1&limit=20`

### 3.3 Get / Serve / Download File
- **GET** `/api/media/files/[id]` (Serves file or redirects to signed URL)

### 3.4 Replace File
- **PUT** `/api/media/files/[id]` (Multipart form with new `file`)

### 3.5 Delete File
- **DELETE** `/api/media/files/[id]`

### 3.6 Dedicated Profile Picture & Resume Endpoints
- **POST** `/api/users/profile/avatar`: Uploads and sets user's avatar image.
- **POST** `/api/placement/resumes/upload`: Uploads PDF resume and creates a Resume entry.

---

## 4. Audio Processing & Speech-to-Text

Speaking recordings uploaded under `audio-recording` category automatically calculate duration and size. Transcriptions can be requested via `audioService` powered by Gemini multimodal processing:

```ts
import { audioService } from '@/services/audio/AudioService';

// Transcribe audio buffer
const result = await audioService.transcribe(audioBuffer, 'audio/webm', 'Check pronunciation accuracy');
console.log('Transcription:', result.text);
```

---

## 5. Certificate Generation & Verification

PDF Certificates are generated server-side using vector graphics and embedded QR codes.

### Certificate Categories:
1. `Course Completion`
2. `English Level Completion`
3. `Practice Milestones`
4. `Placement Preparation`
5. `Special Achievements`

### Endpoints:
- **POST** `/api/certificates/generate`: Generates a PDF certificate and stores the record.
- **GET** `/api/certificates/[id]/download`: Direct PDF download link.
- **GET** `/api/certificates/verify/[id]`: Verification API.
- **UI Verification Page**: `/certificates/verify/[id]` (Publicly accessible page displaying verification status).
