import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";

export function withErrorHandler(handler: (...args: any[]) => Promise<any>) {
  return async (req: Request, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error: any) {
      if (error instanceof ZodError) {
        logger.warn({ error: error.issues }, "Validation error");
        return NextResponse.json(
          { error: "Validation failed", details: error.issues },
          { status: 400 }
        );
      }

      // If Prisma error (we don't want to expose DB details)
      if (error?.code && typeof error.code === 'string' && error.code.startsWith("P2")) {
        logger.warn({ error: error.message }, "Database error");
        return NextResponse.json(
          { error: "Database operation failed. Record might already exist." },
          { status: 409 }
        );
      }

      // Authentication/Authorization Errors
      if (error.name === "UnauthorizedError") {
        logger.warn({ error: error.message }, "Unauthorized access attempt");
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      logger.error({ error: error.message, stack: error.stack }, "Internal Server Error");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
