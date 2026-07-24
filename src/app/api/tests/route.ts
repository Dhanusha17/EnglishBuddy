import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // PLACEMENT, MOCK, LEVEL
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const skip = (page - 1) * limit;

  const where = type ? { type, status: "PUBLISHED" } : { status: "PUBLISHED" };

  const tests = await db.test.findMany({
    where,
    skip,
    take: limit,
    include: {
      _count: {
        select: { questions: true },
      },
      attempts: {
        where: { userId: session.sub },
        orderBy: { score: "desc" },
        take: 1, // Get best attempt
      },
    },
  });

  const total = await db.test.count({ where });

  return NextResponse.json({
    data: tests,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});
