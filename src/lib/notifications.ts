import db from "./db";

export type EventType = 
  | 'REGISTRATION_SUBMITTED'
  | 'ACCOUNT_APPROVED'
  | 'ACCOUNT_REJECTED'
  | 'ACCOUNT_SUSPENDED'
  | 'CERTIFICATE_EARNED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'LEVEL_UP'
  | 'ANNOUNCEMENT'
  | 'SECURITY_ALERT';

export interface NotificationPayload {
  userId: string;
  type: EventType;
  title: string;
  message: string;
  actionUrl?: string;
  category?: string;
  // For email rendering
  emailTemplate?: string;
  emailVariables?: Record<string, string>;
}

/**
 * Ensures user has a preference record, creates one if missing.
 */
async function getOrCreatePreferences(userId: string) {
  let prefs = await db.notificationPreference.findUnique({ where: { userId } });
  if (!prefs) {
    prefs = await db.notificationPreference.create({ data: { userId } });
  }
  return prefs;
}

/**
 * Main function to dispatch notifications to a user based on their preferences.
 */
export async function notifyUser(payload: NotificationPayload) {
  const prefs = await getOrCreatePreferences(payload.userId);
  const category = payload.category || payload.type;

  // 1. In-App Notification
  if (prefs.inAppNotifications) {
    await db.notification.create({
      data: {
        userId: payload.userId,
        title: payload.title,
        message: payload.message,
        actionUrl: payload.actionUrl,
        category: category
      }
    });
  }

  // 2. Email Queue (Simulation)
  if (prefs.emailNotifications && payload.emailTemplate) {
    const user = await db.user.findUnique({ where: { id: payload.userId }, select: { email: true } });
    if (user) {
      await db.emailQueue.create({
        data: {
          userId: payload.userId,
          subject: payload.title, // using title as subject for simplicity
          template: payload.emailTemplate,
          variables: JSON.stringify(payload.emailVariables || {}),
          status: 'SENT', // Auto-marking as sent for this mocked implementation
          sentAt: new Date(),
          attempts: 1
        }
      });
      // Simulate SMTP
      console.log(`[EMAIL DISPATCHED] To: \${user.email} | Subject: \${payload.title} | Template: \${payload.emailTemplate}`);
    }
  }
}

/**
 * Helper to dispatch global announcements
 */
export async function createAnnouncement(title: string, content: string, isPinned: boolean = false) {
  const announcement = await db.announcement.create({
    data: {
      title,
      content,
      isGlobal: true,
      isPinned
    }
  });

  // Notify all users in-app (that have in-app enabled)
  const usersToNotify = await db.notificationPreference.findMany({
    where: { inAppNotifications: true },
    select: { userId: true }
  });

  const notifications = usersToNotify.map(u => ({
    userId: u.userId,
    title: `📢 Announcement: \${title}`,
    message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
    category: 'ANNOUNCEMENT',
    actionUrl: '/dashboard/notifications'
  }));

  if (notifications.length > 0) {
    await db.notification.createMany({ data: notifications });
  }

  return announcement;
}
