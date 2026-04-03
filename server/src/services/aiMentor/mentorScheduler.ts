/**
 * AI Study OS — Mentor Scheduler (Stage 6)
 * ─────────────────────────────────────────────────────────────
 * Runs AI Mentor checks on a schedule for all active users.
 *
 * Jobs:
 *   Every 6 hours    → check all users with > 24h inactivity
 *   Daily at 8:00 AM → daily reminder pass
 *   Daily at 9:00 PM → streak-at-risk check (last-chance)
 *   Daily 23:55      → reset daily trigger counts
 *
 * Anti-overload:
 *   - Processes users in batches of 50
 *   - Concurrency limit: 5 at a time
 *   - Per-user rate limit enforced in aiMentorEngine
 *
 * Usage:
 *   import { mentorScheduler } from './mentorScheduler.js';
 *   mentorScheduler.start();  // call once at server boot
 */

import { StudentProfile } from '../../models/StudentProfile.model.js';
import { AIMentorSession } from '../../models/AIMentorSession.model.js';
import { aiMentorEngine }  from './aiMentorEngine.js';
import { logger }          from '../../utils/logger.js';

// ── Simple cron-like runner (no external dep required) ─────────
// Uses setInterval with UTC hour checks

type ScheduledJob = {
  name:        string;
  intervalMs:  number;
  lastRun:     Date | null;
  shouldRun:   (now: Date) => boolean;
  run:         () => Promise<void>;
};

// ── Batch processor ────────────────────────────────────────────

async function processUserBatch(
  userIds:      string[],
  trigger:      string,
  concurrency = 5,
): Promise<void> {
  const results = { success: 0, skipped: 0, errors: 0 };

  for (let i = 0; i < userIds.length; i += concurrency) {
    const batch = userIds.slice(i, i + concurrency);
    await Promise.allSettled(
      batch.map(async (uid) => {
        try {
          const result = await aiMentorEngine.runAIMentor(uid, { trigger: 'cron' });
          if (result.fired) results.success++;
          else results.skipped++;
        } catch {
          results.errors++;
        }
      })
    );
  }

  logger.info({ trigger, ...results }, '[MentorScheduler] Batch complete');
}

// ── Job: Inactive user check (every 6h) ───────────────────────

async function runInactiveCheck(): Promise<void> {
  logger.info('[MentorScheduler] Running inactive user check');

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago

  // Find users whose last activity was > 24h ago
  const profiles = await StudentProfile.find(
    { updatedAt: { $lt: cutoff } },
    { userId: 1 }
  )
    .limit(500)  // safety cap
    .lean();

  const userIds = profiles.map((p) => String(p.userId));
  logger.info({ count: userIds.length }, '[MentorScheduler] Inactive users found');

  await processUserBatch(userIds, 'inactive_check');
}

// ── Job: Daily morning reminder (8:00 AM IST = 2:30 AM UTC) ───

async function runDailyReminder(): Promise<void> {
  logger.info('[MentorScheduler] Running daily reminder');

  const profiles = await StudentProfile.find(
    {},
    { userId: 1 }
  )
    .limit(1000)
    .lean();

  const userIds = profiles.map((p) => String(p.userId));
  await processUserBatch(userIds, 'daily_reminder', 10);
}

// ── Job: Evening streak-at-risk check (9:00 PM IST = 3:30 PM UTC) ─

async function runStreakAtRiskCheck(): Promise<void> {
  logger.info('[MentorScheduler] Running streak-at-risk check');

  const today = new Date().toISOString().split('T')[0];

  // Users with active streaks who haven't studied today
  const profiles = await StudentProfile.find(
    {
      currentStreak: { $gte: 2 },
      lastStudyDate: { $ne: today },
    },
    { userId: 1 }
  )
    .limit(500)
    .lean();

  const userIds = profiles.map((p) => String(p.userId));
  logger.info({ count: userIds.length }, '[MentorScheduler] Streak-at-risk users');

  await processUserBatch(userIds, 'streak_check');
}

// ── Job: Reset daily trigger counts (11:55 PM IST daily) ──────

async function resetDailyTriggerCounts(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const result = await AIMentorSession.updateMany(
    { dailyResetDate: { $ne: today } },
    { $set: { dailyTriggerCount: 0, dailyResetDate: today } }
  );
  logger.info({ modified: result.modifiedCount }, '[MentorScheduler] Daily reset done');
}

// ── Scheduler state ────────────────────────────────────────────

let _started   = false;
let _intervals: NodeJS.Timeout[] = [];

// ── Public API ─────────────────────────────────────────────────

export function start(): void {
  if (_started) return;
  _started = true;

  logger.info('[MentorScheduler] Starting');

  // Every 6 hours — inactive check
  const inactiveInterval = setInterval(async () => {
    try { await runInactiveCheck(); }
    catch (err) { logger.error({ err }, '[MentorScheduler] Inactive check error'); }
  }, 6 * 60 * 60 * 1000);
  _intervals.push(inactiveInterval);

  // Every hour — check if it's time for morning/evening jobs
  const hourlyInterval = setInterval(async () => {
    const nowUTC  = new Date();
    const hourUTC = nowUTC.getUTCHours();
    const minUTC  = nowUTC.getUTCMinutes();

    // 2:30 UTC = 8:00 AM IST → daily reminder
    if (hourUTC === 2 && minUTC < 60) {
      try { await runDailyReminder(); }
      catch (err) { logger.error({ err }, '[MentorScheduler] Daily reminder error'); }
    }

    // 15:30 UTC = 9:00 PM IST → streak-at-risk
    if (hourUTC === 15 && minUTC < 60) {
      try { await runStreakAtRiskCheck(); }
      catch (err) { logger.error({ err }, '[MentorScheduler] Streak check error'); }
    }

    // 18:25 UTC = 11:55 PM IST → daily reset
    if (hourUTC === 18 && minUTC >= 25 && minUTC < 30) {
      try { await resetDailyTriggerCounts(); }
      catch (err) { logger.error({ err }, '[MentorScheduler] Reset error'); }
    }
  }, 60 * 1000); // check every minute
  _intervals.push(hourlyInterval);

  logger.info('[MentorScheduler] Scheduler started. Jobs: 6h inactive check, 8AM reminder, 9PM streak check');
}

export function stop(): void {
  for (const interval of _intervals) clearInterval(interval);
  _intervals = [];
  _started   = false;
  logger.info('[MentorScheduler] Stopped');
}

// ── Manual triggers (for testing / admin) ─────────────────────

export const manualJobs = {
  runInactiveCheck,
  runDailyReminder,
  runStreakAtRiskCheck,
  resetDailyTriggerCounts,
};

export const mentorScheduler = { start, stop, manualJobs };