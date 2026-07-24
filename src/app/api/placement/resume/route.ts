import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content } = await req.json();

  const resume = await db.resume.create({
    data: {
      userId: session.sub,
      title: title || "My Resume",
      versions: {
        create: {
          content: JSON.stringify(content || {})
        }
      }
    },
    include: { versions: true }
  });

  return NextResponse.json(resume, { status: 201 });
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resumes = await db.resume.findMany({
    where: { userId: session.sub },
    include: {
      versions: { orderBy: { createdAt: "desc" }, take: 1 },
      reviews: { orderBy: { reviewedAt: "desc" }, take: 1 }
    },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json(resumes);
});
