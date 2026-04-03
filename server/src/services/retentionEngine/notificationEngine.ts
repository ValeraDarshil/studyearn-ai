/**
 * AI Study OS — Notification Engine (Stage 7 — Retention Engine)
 * ─────────────────────────────────────────────────────────────
 * Manages all retention-related notifications.
 *
 * Channels:
 *   - In-app notification (stored in DB, fetched by frontend)
 *   - Email (via Resend — basic HTML)
 *   - Push (future — placeholder)
 *
 * Notification Types:
 *   STREAK_ALERT        → streak at risk / broken
 *   COMEBACK            → user been away 48h+
 *   ACHIEVEMENT         → badge/milestone unlocked
 *   REMINDER            → daily study reminder
 *   AI_MENTOR_MESSAGE   → emotional AI message
 *
 * Smart Features:
 *   - Max 2 notifications/day (cooldown)
 *   - Personalized timing (behaviorAnalyzer active hours)
 *   - Emotional AI-style messages
 */

import { User }                from '../../models/User.model.js';
import { analyzeBehavior }     from '../aiMentor/behaviorAnalyzer.js';
import { logger }              from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type NotificationType =
  | 'STREAK_ALERT'
  | 'COMEBACK'
  | 'ACHIEVEMENT'
  | 'REMINDER'
  | 'AI_MENTOR_MESSAGE';

export type NotificationChannel = 'in_app' | 'email' | 'push';

export interface AppNotification {
  id:         string;
  userId:     string;
  type:       NotificationType;
  title:      string;
  message:    string;
  icon:       string;
  ctaText?:   string;
  ctaAction?: string;
  isRead:     boolean;
  createdAt:  string;
  expiresAt:  string;   // auto-dismiss after this
}

export interface NotificationDeliveryResult {
  userId:    string;
  type:      NotificationType;
  channels:  NotificationChannel[];
  success:   boolean;
  skipped:   boolean;
  skipReason?: string;
  notification?: AppNotification;
}

// Stored inside User doc as mixed field
interface NotificationRecord {
  notifications:    AppNotification[];
  sentToday:        number;
  lastSentDate:     string;
  lastSentAt:       string | null;
}

// ── Cooldown Check ─────────────────────────────────────────────

const MAX_NOTIF_PER_DAY = 2;

function getTodayKey(): string {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().split('T')[0];
}

async function checkCooldown(user: any): Promise<{ allowed: boolean; reason?: string }> {
  const rec: NotificationRecord | null = user.notificationRecord ?? null;

  if (!rec) return { allowed: true };

  const todayKey = getTodayKey();
  if (rec.lastSentDate !== todayKey) return { allowed: true }; // new day

  if (rec.sentToday >= MAX_NOTIF_PER_DAY) {
    return { allowed: false, reason: `Daily limit reached (${MAX_NOTIF_PER_DAY}/day)` };
  }

  return { allowed: true };
}

// ── Notification Templates ─────────────────────────────────────

function buildNotification(
  userId:   string,
  type:     NotificationType,
  payload:  {
    title:     string;
    message:   string;
    icon:      string;
    ctaText?:  string;
    ctaAction?: string;
  }
): AppNotification {
  const now      = new Date();
  const expires  = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return {
    id:         `${userId}_${type}_${now.getTime()}`,
    userId,
    type,
    title:      payload.title,
    message:    payload.message,
    icon:       payload.icon,
    ctaText:    payload.ctaText,
    ctaAction:  payload.ctaAction,
    isRead:     false,
    createdAt:  now.toISOString(),
    expiresAt:  expires.toISOString(),
  };
}

export function buildStreakAlertNotification(
  userId:  string,
  streak:  number,
  hoursLeft: number,
): AppNotification {
  const h = Math.floor(hoursLeft);
  return buildNotification(userId, 'STREAK_ALERT', {
    title:     '⚠️ Streak Alert',
    message:   `Your ${streak}-day streak will break in ${h} hour${h !== 1 ? 's' : ''}! Study now to save it.`,
    icon:      '🔥',
    ctaText:   'Save My Streak',
    ctaAction: 'streak_save',
  });
}

export function buildComebackNotification(
  userId:     string,
  userName:   string,
  daysMissed: number,
): AppNotification {
  return buildNotification(userId, 'COMEBACK', {
    title:     `Miss you, ${userName}! 👋`,
    message:   `${daysMissed} days without study. We made a quick 5-min plan for you!`,
    icon:      '🌟',
    ctaText:   'See My Plan',
    ctaAction: 'comeback',
  });
}

export function buildAchievementNotification(
  userId:      string,
  badgeName:   string,
  xpEarned:    number,
): AppNotification {
  return buildNotification(userId, 'ACHIEVEMENT', {
    title:     '🏆 Achievement Unlocked!',
    message:   `You earned the "${badgeName}" badge! +${xpEarned} XP`,
    icon:      '🏆',
    ctaText:   'View Achievement',
    ctaAction: 'achievements',
  });
}

export function buildReminderNotification(
  userId:  string,
  period:  'morning' | 'afternoon' | 'evening' | 'night',
): AppNotification {
  const greetings: Record<string, string> = {
    morning:   '☀️ Good morning! Time for your daily study!',
    afternoon: '📖 Afternoon study break — keep learning!',
    evening:   '🌙 Evening study time — stay consistent!',
    night:     '🦉 Night owl session? Let\'s learn something!',
  };
  return buildNotification(userId, 'REMINDER', {
    title:     'Daily Study Reminder',
    message:   greetings[period] ?? 'Time to study! Stay consistent.',
    icon:      '📚',
    ctaText:   'Start Studying',
    ctaAction: 'dashboard',
  });
}

export function buildAIMentorNotification(
  userId:     string,
  aiMessage:  string,
): AppNotification {
  return buildNotification(userId, 'AI_MENTOR_MESSAGE', {
    title:     'Your AI Mentor Says...',
    message:   aiMessage,
    icon:      '🤖',
    ctaText:   'Talk to Mentor',
    ctaAction: 'mentor',
  });
}

// ── Persistence ────────────────────────────────────────────────

async function saveNotification(user: any, notification: AppNotification): Promise<void> {
  const rec: NotificationRecord = user.notificationRecord ?? {
    notifications: [],
    sentToday:     0,
    lastSentDate:  '',
    lastSentAt:    null,
  };

  const todayKey = getTodayKey();

  // Reset daily counter if new day
  if (rec.lastSentDate !== todayKey) {
    rec.sentToday    = 0;
    rec.lastSentDate = todayKey;
  }

  // Keep max 20 notifications, remove expired
  const now    = new Date();
  const active = rec.notifications
    .filter(n => new Date(n.expiresAt) > now)
    .slice(-19); // keep last 19 + new one = max 20

  rec.notifications = [...active, notification];
  rec.sentToday    += 1;
  rec.lastSentAt    = now.toISOString();

  user.notificationRecord = rec;
  await user.save();
}

// ── Email (Basic — via Resend) ─────────────────────────────────

async function sendEmailNotification(
  email:       string,
  userName:    string,
  notif:       AppNotification,
): Promise<boolean> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return false;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#0f0f0f;color:#e5e7eb;padding:24px;">
  <div style="max-width:520px;margin:0 auto;background:#1a1a2e;border-radius:16px;padding:32px;">
    <div style="font-size:40px;text-align:center;margin-bottom:16px">${notif.icon}</div>
    <h2 style="color:#a78bfa;text-align:center;margin:0 0 12px">${notif.title}</h2>
    <p style="text-align:center;color:#c4b5fd;font-size:16px;line-height:1.6">${notif.message}</p>
    <div style="text-align:center;margin-top:24px">
      <a href="${process.env.FRONTEND_URL ?? 'https://studyearnai.tech'}"
         style="background:linear-gradient(135deg,#7c3aed,#4f46e5);color:white;
                padding:12px 28px;border-radius:8px;text-decoration:none;
                font-weight:600;font-size:15px">
        ${notif.ctaText ?? 'Open StudyEarn AI'}
      </a>
    </div>
    <p style="text-align:center;color:#6b7280;font-size:12px;margin-top:24px">
      StudyEarn AI — Your AI Study Companion
    </p>
  </div>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'StudyEarn AI <noreply@studyearnai.tech>',
        to:      email,
        subject: notif.title,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Main Send Function ─────────────────────────────────────────

export async function sendNotification(
  userId:       string,
  notification: AppNotification,
  channels:     NotificationChannel[] = ['in_app'],
): Promise<NotificationDeliveryResult> {
  try {
    const user = await User.findById(userId).select('name email notificationRecord');
    if (!user) throw new Error(`User ${userId} not found`);

    // Cooldown check
    const cooldown = await checkCooldown(user);
    if (!cooldown.allowed) {
      return {
        userId,
        type:       notification.type,
        channels,
        success:    false,
        skipped:    true,
        skipReason: cooldown.reason,
      };
    }

    // Save in-app notification
    await saveNotification(user, notification);

    // Send email if requested
    if (channels.includes('email') && (user as any).email) {
      await sendEmailNotification(
        (user as any).email,
        (user as any).name?.split(' ')[0] ?? 'there',
        notification,
      );
    }

    logger.info({ userId, type: notification.type, channels }, '[NotificationEngine] Sent');

    return {
      userId,
      type:         notification.type,
      channels,
      success:      true,
      skipped:      false,
      notification,
    };

  } catch (err) {
    logger.error({ userId, err }, '[NotificationEngine] sendNotification failed');
    return { userId, type: notification.type, channels, success: false, skipped: false };
  }
}

/**
 * getUnreadNotifications — Frontend polls this to show notification panel
 */
export async function getUnreadNotifications(userId: string): Promise<AppNotification[]> {
  try {
    const user = await User.findById(userId).select('notificationRecord').lean() as any;
    if (!user?.notificationRecord) return [];

    const now = new Date();
    return (user.notificationRecord.notifications as AppNotification[])
      .filter(n => !n.isRead && new Date(n.expiresAt) > now)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

/**
 * markNotificationsRead — Called when user opens notification panel
 */
export async function markNotificationsRead(userId: string, ids?: string[]): Promise<void> {
  try {
    const user = await User.findById(userId) as any;
    if (!user?.notificationRecord) return;

    user.notificationRecord.notifications = user.notificationRecord.notifications.map(
      (n: AppNotification) => ({
        ...n,
        isRead: ids ? ids.includes(n.id) ? true : n.isRead : true,
      })
    );

    await user.save();
  } catch (err) {
    logger.error({ userId, err }, '[NotificationEngine] markRead failed');
  }
}

/**
 * sendPersonalizedRetentionNotification — Uses behaviorAnalyzer for timing
 */
export async function sendPersonalizedRetentionNotification(
  userId:   string,
  type:     NotificationType,
  notif:    AppNotification,
): Promise<NotificationDeliveryResult> {
  try {
    const behavior = await analyzeBehavior(userId);

    // Only send if current hour matches user's preferred active hour (±2h window)
    const currentHour = new Date().getHours();
    const prefHour    = behavior.activeHours.preferredHour;
    const isGoodTime  = Math.abs(currentHour - prefHour) <= 2 || behavior.activeHours.confidence < 0.3;

    if (!isGoodTime) {
      return {
        userId,
        type,
        channels:   ['in_app'],
        success:    false,
        skipped:    true,
        skipReason: `Not user's preferred time (preferred: ${prefHour}h, now: ${currentHour}h)`,
      };
    }

    return sendNotification(userId, notif, ['in_app', 'email']);
  } catch (err) {
    logger.error({ userId, err }, '[NotificationEngine] personalized failed');
    return sendNotification(userId, notif, ['in_app']);
  }
}

export const notificationEngine = {
  sendNotification,
  getUnreadNotifications,
  markNotificationsRead,
  sendPersonalizedRetentionNotification,
  buildStreakAlertNotification,
  buildComebackNotification,
  buildAchievementNotification,
  buildReminderNotification,
  buildAIMentorNotification,
};