import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/api-handler';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import { getStorageProvider } from '@/services/storage/StorageFactory';
import { validateMediaUpload, verifyMagicBytes } from '@/validation/media';
import { LocalStorageProvider } from '@/services/storage/LocalStorageProvider';

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // Search media file by ID or storage key
    const media = await db.mediaFile.findFirst({
      where: {
        OR: [{ id }, { storageKey: id }],
      },
    });

    if (!media) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const storageProvider = getStorageProvider();

    // If local storage provider, serve buffer with proper headers
    if (storageProvider instanceof LocalStorageProvider) {
      try {
        const buffer = await storageProvider.getFileBuffer(media.storageKey);
        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            'Content-Type': media.mimeType,
            'Content-Length': media.size.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } catch (err) {
        return NextResponse.json({ error: 'Failed to read local media file' }, { status: 500 });
      }
    }

    // For Cloud/S3 storage providers, generate signed URL and redirect
    const signedUrl = await storageProvider.getSignedUrl(media.storageKey, 3600);
    return NextResponse.redirect(signedUrl);
  }
);

export const DELETE = withErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const media = await db.mediaFile.findUnique({ where: { id } });

    if (!media) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 });
    }

    // Ownership or admin check
    if (media.userId !== session.sub && session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: You do not own this file' }, { status: 403 });
    }

    // Delete from storage provider
    const storageProvider = getStorageProvider();
    await storageProvider.deleteFile(media.storageKey);

    // Delete database record
    await db.mediaFile.delete({ where: { id } });

    return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
  }
);

export const PUT = withErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const media = await db.mediaFile.findUnique({ where: { id } });

    if (!media) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 });
    }

    if (media.userId !== session.sub && session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: You do not own this file' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No replacement file uploaded.' }, { status: 400 });
    }

    const validation = validateMediaUpload(
      { filename: file.name, size: file.size, mimeType: file.type },
      media.category,
      session.role
    );

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!verifyMagicBytes(buffer, file.type)) {
      return NextResponse.json({ error: 'Invalid file signatures' }, { status: 400 });
    }

    const storageProvider = getStorageProvider();
    // Delete old file from storage
    await storageProvider.deleteFile(media.storageKey);

    // Upload new file
    const newStorageObject = await storageProvider.uploadFile(buffer, {
      filename: file.name,
      category: media.category,
      mimeType: file.type,
    });

    // Update database record
    const updatedMedia = await db.mediaFile.update({
      where: { id },
      data: {
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        storageKey: newStorageObject.key,
        url: newStorageObject.url,
      },
    });

    return NextResponse.json({
      message: 'File replaced successfully',
      data: updatedMedia,
    });
  }
);
