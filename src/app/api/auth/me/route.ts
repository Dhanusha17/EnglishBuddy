import { NextResponse } from "next/server";
import db from "@/lib/db";
import { withErrorHandler } from "@/utils/api-handler";
import { getSession } from "@/lib/auth";

export const GET = withErrorHandler(async () => {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.sub },
    include: {
      profile: true,
      settings: true,
      role: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Remove passwordHash from response
  const { passwordHash, ...userWithoutPassword } = user;

  return NextResponse.json(userWithoutPassword, { status: 200 });
});
