import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";

export const GET = withErrorHandler(async (req: NextRequest) => {
  // We can fetch global announcements
  const announcements = await db.announcement.findMany({
    where: { isGlobal: true },
    orderBy: [
      { isPinned: "desc" },
      { createdAt: "desc" }
    ],
    take: 10
  });

  return NextResponse.json(announcements);
});
