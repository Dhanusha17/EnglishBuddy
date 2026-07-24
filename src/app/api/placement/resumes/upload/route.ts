import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import { getStorageProvider } from '@/services/storage/StorageFactory';
import { validateMediaUpload, verifyMagicBytes } from '@/validation/media';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const title = (formData.get('title') as string) || file?.name || 'Uploaded Resume';

  if (!file) {
    return NextResponse.json({ error: 'No PDF resume file uploaded' }, { status: 400 });
  }

  const validation = validateMediaUpload(
    { filename: file.name, size: file.size, mimeType: file.type },
    'resume',
    session.role
  );

  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!verifyMagicBytes(buffer, file.type)) {
    return NextResponse.json({ error: 'Invalid PDF content' }, { status: 400 });
  }

  const storageProvider = getStorageProvider();
  const storageObject = await storageProvider.uploadFile(buffer, {
    filename: file.name,
    category: 'resume',
    mimeType: file.type,
  });

  // Track in MediaFile
  const mediaFile = await db.mediaFile.create({
    data: {
      userId: session.sub,
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      category: 'resume',
      storageKey: storageObject.key,
      url: storageObject.url,
    },
  });

  // Create Resume entry with initial version storing file URL & metadata
  const resume = await db.resume.create({
    data: {
      userId: session.sub,
      title,
      versions: {
        create: {
          content: JSON.stringify({
            fileUrl: storageObject.url,
            storageKey: storageObject.key,
            mediaFileId: mediaFile.id,
            filename: file.name,
            sizeBytes: file.size,
          }),
        },
      },
    },
    include: {
      versions: true,
    },
  });

  return NextResponse.json(
    {
      message: 'Resume PDF uploaded successfully',
      data: resume,
    },
    { status: 201 }
  );
});
