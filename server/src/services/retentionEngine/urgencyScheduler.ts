/**
 * AI Study OS — Urgency Scheduler (Stage 7 Advanced — Precise Timing)
 * ─────────────────────────────────────────────────────────────
 * PROBLEM SOLVED:
 *   urgencyEngine.checkUrgency() is accurate ✅
 *   BUT fires only when user opens app (request-driven) ❌
 *   → User with 20h inactivity never gets alerted unless they visit
 *
 * THIS FILE uses setInterval (same pattern as mentorScheduler.ts)
 * — no external cron dependency needed.
 *
 *   Every 30 min → scan users crossing 20h (AT_RISK)
 *   Every 15 min → scan users crossing 36h (CRITICAL)
 *   Every 1 hour → scan users crossing 48h (BROKEN)
 *   Daily 8 AM IST → morning digest for at-risk users
 *
 * INTEGRATION (already added in index.ts):
 *   const urgencyScheduler = new UrgencyScheduler();
 *   urgencyScheduler.start();  ← after connectDB()
 */

import { User }               from '../../models/User.model.js';
import { urgencyEngine }      from './urgencyEngine.js';
import { notificationEngine } from './notificationEngine.js';
import { logger }             from '../../utils/logger.js';
import { Server } from 'node:http';

// ── Thresholds: hours since lastActive ─────────────────────────
const URGENCY_THRESHOLDS = {
  AT_RISK:  20,
  CRITICAL: 36,
  BROKEN:   48,
} as const;

type UrgencyLevel = keyof typeof URGENCY_THRESHOLDS;

// ── Cooldowns: min hours between notifications per level ───────
const NOTIFY_COOLDOWN_HOURS: Record<UrgencyLevel, number> = {
  AT_RISK:  8,
  CRITICAL: 4,
  BROKEN:   24,
};

// ── Scan intervals ─────────────────────────────────────────────
const INTERVAL_MS = {
  AT_RISK:  30 * 60 * 1000,  // every 30 min
  CRITICAL: 15 * 60 * 1000,  // every 15 min
  BROKEN:   60 * 60 * 1000,  // every 1 hour
  DIGEST:   60 * 60 * 1000,  // check hourly if it's 8 AM IST
} as const;

// ─────────────────────────────────────────────────────────────
export class UrgencyScheduler {
  private _timers: NodeJS.Timeout[] = [];
  private _isRunning = false;

  /**
   * start() — Register all interval jobs.
   * Called once after DB connects in index.ts.
   */
  start(): void {
    if (this._isRunning) {
      logger.warn('[UrgencyScheduler] Already running — skipping duplicate start');
      return;
    }

    // ── Job 1: AT_RISK scan every 30 minutes ─────────────
    this._timers.push(
      setInterval(() => { this._scanBatch('AT_RISK').catch(() => {}); }, INTERVAL_MS.AT_RISK),
    );

    // ── Job 2: CRITICAL scan every 15 minutes ────────────
    this._timers.push(
      setInterval(() => { this._scanBatch('CRITICAL').catch(() => {}); }, INTERVAL_MS.CRITICAL),
    );

    // ── Job 3: BROKEN scan every hour ─────────────────────
    this._timers.push(
      setInterval(() => { this._scanBatch('BROKEN').catch(() => {}); }, INTERVAL_MS.BROKEN),
    );

    // ── Job 4: Daily digest — check every hour if 8 AM IST ──
    this._timers.push(
      setInterval(() => {
        const istHour = new Date(Date.now() + 5.5 * 3600_000).getUTCHours();
        if (istHour === 8) {
          this._sendDailyDigest().catch(() => {});
        }
      }, INTERVAL_MS.DIGEST),
    );

    this._isRunning = true;
    logger.info('[UrgencyScheduler] ✅ Started — 4 jobs (AT_RISK/CRITICAL/BROKEN/DailyDigest)');
  }

  stop(): void {
    this._timers.forEach((t) => clearInterval(t));
    this._timers    = [];
    this._isRunning = false;
    logger.info('[UrgencyScheduler] Stopped');
  }

  // ─── _scanBatch ──────────────────────────────────────────────
  private async _scanBatch(level: UrgencyLevel): Promise<void> {
    const minHours = URGENCY_THRESHOLDS[level];
    const maxHours = level === 'AT_RISK'
      ? URGENCY_THRESHOLDS.CRITICAL
      : level === 'CRITICAL'
        ? URGENCY_THRESHOLDS.BROKEN
        : 9999;

    const cutoffMin = new Date(Date.now() - minHours * 3600_000);
    const cutoffMax = new Date(Date.now() - maxHours * 3600_000);

    try {
      const users = await (User as any).find({
        lastActive: { $lte: cutoffMin, $gte: cutoffMax },
        streak:     { $gt: 0 },
      })
        .select('_id streak lastActive notificationRecord')
        .lean()
        .limit(500);

      if (users.length === 0) return;
      logger.info({ level, count: users.length }, `[UrgencyScheduler] Scanning ${level}`);

      const chunks = _chunkArray(users, 20);
      for (const chunk of chunks) {
        await Promise.allSettled(chunk.map((u: any) => this._processUser(u, level)));
      }
    } catch (err) {
      logger.error({ level, err }, '[UrgencyScheduler] _scanBatch failed');
    }
  }

  // ─── _processUser ────────────────────────────────────────────
  private async _processUser(user: any, level: UrgencyLevel): Promise<void> {
    const userId = user._id.toString();
    try {
      // Cooldown check — don't spam the same user at same level
      const cooldownHours = NOTIFY_COOLDOWN_HOURS[level];
      const lastUrgencyAt = user.notificationRecord?.lastUrgencyAt?.[level];
      if (lastUrgencyAt) {
        const hoursSince = (Date.now() - new Date(lastUrgencyAt).getTime()) / 3600_000;
        if (hoursSince < cooldownHours) return;
      }

      const report = await urgencyEngine.checkUrgency(userId);
      if (!report.shouldNotify) return;

      const notif = notificationEngine.buildStreakAlertNotification(
        userId,
        user.streak,
        report.hoursLeft ?? 0,
      );

      await notificationEngine.sendPersonalizedRetentionNotification(
        userId,
        'STREAK_ALERT',
        notif,
      );

      // Record cooldown timestamp
      await (User as any).updateOne(
        { _id: user._id },
        { $set: { [`notificationRecord.lastUrgencyAt.${level}`]: new Date().toISOString() } },
      );

      logger.info({ userId, level, hoursLeft: report.hoursLeft }, '[UrgencyScheduler] Sent');
    } catch (err) {
      logger.error({ userId, level, err }, '[UrgencyScheduler] _processUser failed');
    }
  }

  // ─── _sendDailyDigest ────────────────────────────────────────
  private async _sendDailyDigest(): Promise<void> {
    try {
      const cutoff = new Date(Date.now() - 18 * 3600_000);
      const users  = await (User as any).find({
        lastActive: { $lte: cutoff },
        streak:     { $gt: 3 },
      })
        .select('_id streak lastActive')
        .lean()
        .limit(1000);

      if (users.length === 0) return;
      logger.info({ count: users.length }, '[UrgencyScheduler] Daily digest');

      const userIds    = users.map((u: any) => u._id.toString());
      const urgentList = await urgencyEngine.getBatchUrgency(userIds);

      await Promise.allSettled(
        urgentList.map(async (report) => {
          if (report.level === 'none') return;
          const notif = notificationEngine.buildStreakAlertNotification(
            report.userId,
            report.streakStatus.currentStreak,
            report.hoursLeft,
          );
          return notificationEngine.sendNotification(report.userId, notif, ['in_app', 'email']);
        }),
      );
    } catch (err) {
      logger.error(err, '[UrgencyScheduler] _sendDailyDigest failed');
    }
  }
}

// ── Utility ────────────────────────────────────────────────────
function _chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}