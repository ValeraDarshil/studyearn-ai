/**
 * AI Study OS — AI Brain Service (Central Hub)
 * ─────────────────────────────────────────────────────────────
 * The master orchestrator of the entire AI Brain system.
 *
 * This is the SINGLE entry point for anything "brain-related".
 * It wires together all sub-modules and exposes clean functions
 * that controllers and routes call directly.
 *
 * Internal Flow (for every student interaction):
 *
 *   1. getUserProfile   → studentProfileEngine.ts
 *   2. analyzeWeakTopics → topicAnalyzer.ts
 *   3. generatePlan     → learningEngine.ts
 *   4. buildContext     → contextBuilder.ts
 *   5. getInsights      → progressIntelligence.ts
 *   ↓
 *   6. Return unified BrainSnapshot to caller
 *
 * External consumers:
 *   - brainController.ts   (REST API — dashboard, setup, alerts)
 *   - contextTutorService.ts (AskAI — inject context into LLM prompt)
 *   - aiController.ts      (AI questions — pass brain context to tutor)
 *
 * Scalability:
 *   - All sub-calls run in parallel where possible (Promise.all)
 *   - No duplicate DB queries — each module is responsible for its own fetch
 *   - Context is built once per request, not per AI call
 *   - In-memory operations only (no redundant saves)
 */

import { buildStudentProfile, getCompactProfile, StudentIntelligenceProfile } from './studentProfileEngine.js';
import { analyzeTopics, getPriorityTopics, getTopicReport, TopicAnalysis }    from './topicAnalyzer.js';
import { buildAIContext, getContextSummary, AIContextPacket }                  from './contextBuilder.js';
import { generateDailyPlan, getNextAction, getWeaknessActions, DailyPlan }    from './learningEngine.js';
import { getProgressSnapshot, getLiveInsights, checkStreakMilestone, ProgressSnapshot } from './progressIntelligence.js';
import { logger } from '../../utils/logger.js';

// ── Re-exports (so callers only need one import) ───────────────
export type { StudentIntelligenceProfile } from './studentProfileEngine.js';
export type { TopicAnalysis, AnalyzedTopic }  from './topicAnalyzer.js';
export type { AIContextPacket }               from './contextBuilder.js';
export type { DailyPlan, LearningRecommendation } from './learningEngine.js';
export type { ProgressSnapshot, LiveInsight } from './progressIntelligence.js';

// ── Full Brain Snapshot ────────────────────────────────────────
export interface BrainSnapshot {
  profile:          StudentIntelligenceProfile;
  topicAnalysis:    TopicAnalysis | null;
  aiContext:        AIContextPacket | null;
  dailyPlan:        DailyPlan | null;
  progressSnapshot: ProgressSnapshot | null;
  streakMilestone:  string | null;
  generatedAt:      string;
}

// ─────────────────────────────────────────────────────────────
// getBrainSnapshot — full data for dashboard / heavy operations
// ─────────────────────────────────────────────────────────────
export async function getBrainSnapshot(userId: string): Promise<BrainSnapshot | null> {
  try {
    // Fetch profile first (others depend on it existing)
    const profile = await buildStudentProfile(userId);
    if (!profile) {
      logger.warn(`[AIBrain] getBrainSnapshot: No profile for ${userId}`);
      return null;
    }

    // Run everything else in parallel — maximum speed
    const [topicAnalysis, aiContext, dailyPlan, progressSnapshot] = await Promise.all([
      analyzeTopics(userId).catch(() => null),
      buildAIContext(userId).catch(() => null),
      generateDailyPlan(userId).catch(() => null),
      getProgressSnapshot(userId).catch(() => null),
    ]);

    const streakMilestone = checkStreakMilestone(profile.currentStreak);

    logger.info(`[AIBrain] Snapshot built for ${userId} — mastery:${profile.overallMastery}% streak:${profile.currentStreak}`);

    return {
      profile,
      topicAnalysis,
      aiContext,
      dailyPlan,
      progressSnapshot,
      streakMilestone,
      generatedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    logger.error(`[AIBrain] getBrainSnapshot: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getAITutorContext — optimized for AskAI (fast, non-blocking)
// Returns only what the AI tutor needs in the system prompt.
// ─────────────────────────────────────────────────────────────
export async function getAITutorContext(userId: string): Promise<{
  contextSummary:  string;
  weakTopics:      string[];
  learnerType:     string;
  tutorPersonality:string;
  preferredLang:   string;
  learningSpeed:   string;
  nextAction:      { title: string; subject: string; topic: string; reason: string } | null;
} | null> {
  try {
    const [compact, contextSummary, nextAction] = await Promise.all([
      getCompactProfile(userId).catch(() => null),
      getContextSummary(userId).catch(() => ''),
      getNextAction(userId).catch(() => null),
    ]);

    if (!compact) return null;

    return {
      contextSummary,
      weakTopics:       compact.weakTopics,
      learnerType:      compact.learningType,
      tutorPersonality: compact.tutorPersonality,
      preferredLang:    compact.learningType,
      learningSpeed:    compact.learningSpeed,
      nextAction,
    };
  } catch (err: any) {
    logger.error(`[AIBrain] getAITutorContext: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getStudentSummary — compact summary string for any AI call
// e.g. "School student, Class 10, weak: Algebra, Loops"
// ─────────────────────────────────────────────────────────────
export async function getStudentSummary(userId: string): Promise<string> {
  try {
    const [profile, topicReport] = await Promise.all([
      getCompactProfile(userId),
      getTopicReport(userId),
    ]);

    if (!profile) return 'New student — no profile yet.';

    const parts = [
      `${profile.learningType} learner`,
      profile.classLevel ? `(${profile.classLevel})` : null,
      `mastery: ${profile.overallMastery}%`,
      `streak: ${profile.currentStreak}d`,
      profile.weakTopics.length > 0 ? `weak: ${profile.weakTopics.slice(0, 2).join(', ')}` : null,
    ].filter(Boolean);

    return parts.join(' | ') + (topicReport ? `\n${topicReport}` : '');
  } catch (err: any) {
    logger.error(`[AIBrain] getStudentSummary: ${err.message}`);
    return '';
  }
}

// ─────────────────────────────────────────────────────────────
// getDailyPlan — daily recommendations (called by brain dashboard)
// ─────────────────────────────────────────────────────────────
export async function getDailyPlan(userId: string): Promise<DailyPlan | null> {
  return generateDailyPlan(userId).catch((err: any) => {
    logger.error(`[AIBrain] getDailyPlan: ${err.message}`);
    return null;
  });
}

// ─────────────────────────────────────────────────────────────
// getWeakTopicActions — what to do about weak topics right now
// ─────────────────────────────────────────────────────────────
export async function getWeakTopicActions(userId: string, limit = 3) {
  return getWeaknessActions(userId, limit).catch((err: any) => {
    logger.error(`[AIBrain] getWeakTopicActions: ${err.message}`);
    return [];
  });
}

// ─────────────────────────────────────────────────────────────
// getLiveProgressInsights — real-time insight messages
// (used in notification bell, dashboard header, AI chat context)
// ─────────────────────────────────────────────────────────────
export async function getLiveProgressInsights(userId: string): Promise<string[]> {
  return getLiveInsights(userId).catch((err: any) => {
    logger.error(`[AIBrain] getLiveInsights: ${err.message}`);
    return [];
  });
}

// ─────────────────────────────────────────────────────────────
// getTopicIntelligence — topic-level analysis for brain dashboard
// ─────────────────────────────────────────────────────────────
export async function getTopicIntelligence(userId: string): Promise<TopicAnalysis | null> {
  return analyzeTopics(userId).catch((err: any) => {
    logger.error(`[AIBrain] getTopicIntelligence: ${err.message}`);
    return null;
  });
}

// ─────────────────────────────────────────────────────────────
// getPriorityFocusTopics — top N topics that need attention
// ─────────────────────────────────────────────────────────────
export async function getPriorityFocusTopics(userId: string, limit = 3) {
  return getPriorityTopics(userId, limit).catch((err: any) => {
    logger.error(`[AIBrain] getPriorityFocusTopics: ${err.message}`);
    return [];
  });
}