import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/api-handler";
import db from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { token } = schema.parse(body);

  const user = await db.user.findFirst({
    where: {
      verificationToken: token,
      verificationExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired email verification token." },
      { status: 400 }
    );
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationExpires: null,
    },
  });

  return NextResponse.json(
    { message: "Email verified successfully." },
    { status: 200 }
  );
});
