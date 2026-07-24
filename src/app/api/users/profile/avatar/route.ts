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

  if (!file) {
    return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
  }

  const validation = validateMediaUpload(
    { filename: file.name, size: file.size, mimeType: file.type },
    'profile-picture',
    session.role
  );

  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!verifyMagicBytes(buffer, file.type)) {
    return NextResponse.json({ error: 'Invalid image content' }, { status: 400 });
  }

  const storageProvider = getStorageProvider();
  const storageObject = await storageProvider.uploadFile(buffer, {
    filename: file.name,
    category: 'profile-picture',
    mimeType: file.type,
  });

  // Save in MediaFile DB table
  await db.mediaFile.create({
    data: {
      userId: session.sub,
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      category: 'profile-picture',
      storageKey: storageObject.key,
      url: storageObject.url,
    },
  });

  // Update Profile avatarUrl
  const profile = await db.profile.upsert({
    where: { userId: session.sub },
    update: { avatarUrl: storageObject.url },
    create: {
      userId: session.sub,
      avatarUrl: storageObject.url,
    },
  });

  return NextResponse.json(
    {
      message: 'Profile picture updated successfully',
      avatarUrl: storageObject.url,
      profile,
    },
    { status: 200 }
  );
});
