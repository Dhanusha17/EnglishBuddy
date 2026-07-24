import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import { getStorageProvider } from '@/services/storage/StorageFactory';
import { validateMediaUpload, verifyMagicBytes } from '@/validation/media';
import { audioService } from '@/services/audio/AudioService';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const category = (formData.get('category') as string) || 'profile-picture';

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded. Please select a file.' }, { status: 400 });
  }

  // 1. Validate permissions, category, MIME type and size limit
  const validation = validateMediaUpload(
    { filename: file.name, size: file.size, mimeType: file.type },
    category,
    session.role
  );

  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // 2. Convert File to Buffer & verify magic bytes
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!verifyMagicBytes(buffer, file.type)) {
    return NextResponse.json(
      { error: 'File content does not match reported extension/MIME type.' },
      { status: 400 }
    );
  }

  // 3. Process audio metadata if audio recording
  let duration: number | undefined = undefined;
  if (category === 'audio-recording' || file.type.startsWith('audio/')) {
    try {
      const audioMeta = await audioService.processAudioUpload(buffer, file.type);
      duration = audioMeta.duration;
    } catch (err) {
      console.warn('Audio metadata processing warning:', err);
    }
  }

  // 4. Upload via Storage Provider
  const storageProvider = getStorageProvider();
  const storageResult = await storageProvider.uploadFile(buffer, {
    filename: file.name,
    category,
    mimeType: file.type,
  });

  // 5. Create Database MediaFile Record
  const mediaRecord = await db.mediaFile.create({
    data: {
      userId: session.sub,
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      category,
      storageKey: storageResult.key,
      url: storageResult.url,
      duration: duration || null,
      metadata: JSON.stringify({
        provider: storageResult.provider,
        etag: storageResult.etag || null,
      }),
    },
  });

  return NextResponse.json(
    {
      message: 'File uploaded successfully',
      data: mediaRecord,
    },
    { status: 201 }
  );
});
