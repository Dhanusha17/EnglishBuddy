import db from './db';
import { logger } from './logger';

export interface AuditLogOptions {
  userId?: string | null;
  action: string;
  details?: Record<string, unknown> | string;
  ipAddress?: string | null;
}

export async function logAuditEvent(options: AuditLogOptions): Promise<void> {
  try {
    const detailsStr = typeof options.details === 'object' 
      ? JSON.stringify(options.details) 
      : options.details || null;

    await db.auditLog.create({
      data: {
        userId: options.userId || null,
        action: options.action,
        details: detailsStr,
        ipAddress: options.ipAddress || null,
      },
    });

    logger.info(
      { userId: options.userId, action: options.action, ip: options.ipAddress },
      `Audit Log: ${options.action}`
    );
  } catch (error: any) {
    logger.error({ error: (error as Error).message, action: options.action }, 'Failed to record audit log');
  }
}
