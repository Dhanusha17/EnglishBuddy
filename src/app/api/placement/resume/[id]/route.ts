import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const resume = await db.resume.findUnique({
    where: { id, userId: session.sub },
    include: {
      versions: { orderBy: { createdAt: "desc" } },
      reviews: { orderBy: { reviewedAt: "desc" } }
    }
  });

  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(resume);
});

export const PATCH = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  
  const { title, content } = await req.json();

  const resume = await db.resume.update({
    where: { id, userId: session.sub },
    data: {
      title,
      versions: {
        create: {
          content: JSON.stringify(content || {})
        }
      }
    },
    include: { versions: { orderBy: { createdAt: "desc" }, take: 1 } }
  });

  return NextResponse.json(resume);
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  await db.resume.delete({
    where: { id, userId: session.sub }
  });

  return NextResponse.json({ success: true });
});
