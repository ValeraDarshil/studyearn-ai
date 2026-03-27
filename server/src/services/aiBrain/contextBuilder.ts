/**
 * AI Study OS — Context Builder
 * ─────────────────────────────────────────────────────────────
 * Assembles the complete AI context packet.
 *
 * This is the "intelligence injection layer" between the AI Brain
 * and the AskAI (contextTutorService). It gathers:
 *   - Student profile (who is this person?)
 *   - Topic analysis (what are their weak spots?)
 *   - Activity state (how engaged are they today?)
 *   - Learning mode (school / coding / college / self)
 *   - Recent behaviour (what did they just do?)
 *
 * Output goes into the system prompt sent to the LLM.
 *
 * This is what makes answers PERSONALIZED rather than generic.
 *
 * Before AI Brain:
 *   "What is a loop?" → Generic answer
 *
 * After AI Brain + Context Builder:
 *   "What is a loop?" → "Since you struggled with loops (mastery 28%),
 *    let me walk through this very carefully with 3 examples..."
 */

import { buildStudentProfile, StudentIntelligenceProfile } from './studentProfileEngine.js';
import { analyzeTopics, getTopicReport, TopicAnalysis }   from './topicAnalyzer.js';
import { StudentProfile }                                    from '../../models/StudentProfile.model.js';
import { LearningPath }                                    from '../../models/LearningPath.model.js';
import { logger }                                          from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export interface AIContextPacket {
  // Core identity
  userId:          string;
  learnerType:     string;
  classLevel:      string | null;
  preferredLang:   'english' | 'hinglish';
  tutorPersonality:'simple' | 'normal' | 'advanced';

  // Learning intelligence
  weakTopics:      string[];
  criticalTopics:  string[];
  strongTopics:    string[];
  recentMistakes:  string[];
  topicReport:     string;     // one-line summary for system prompt

  // Activity state
  currentStreak:   number;
  activityScore:   number;
  overallMastery:  number;
  learningSpeed:   string;
  codingLevel:     string;

  // Active learning path context
  activePath: {
    title:          string;
    currentStep:    string | null;
    progressPct:    number;
    subject:        string;
  } | null;

  // Flags that alter AI behavior
  flags: {
    isStruggling:   boolean;   // mastery < 35%, or multiple critical topics
    isOnFire:       boolean;   // streak > 7, activity score > 70
    hasActivePath:  boolean;   // currently following a learning path
    isNewStudent:   boolean;   // profileAge < 7 days or no topics tracked
    needsMotivation:boolean;   // streak = 0 or activity tier = inactive/low
  };

  // System prompt injection string
  contextSummary:  string;     // compact, ready to inject into system prompt
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — buildAIContext
// ─────────────────────────────────────────────────────────────
export async function buildAIContext(userId: string): Promise<AIContextPacket | null> {
  try {
    // Run profile + topic analysis in parallel for speed
    const [profile, analysis, topicReportStr, activePath] = await Promise.all([
      buildStudentProfile(userId),
      analyzeTopics(userId),
      getTopicReport(userId),
      getActivePathContext(userId),
    ]);

    if (!profile) return null;

    // ── Build flags ───────────────────────────────────────
    const criticalTopics = analysis?.critical.map(t => t.topic) || [];
    const isStruggling   = profile.overallMastery < 35 || criticalTopics.length >= 2;
    const isOnFire       = profile.currentStreak > 7 && profile.activityScore > 70;
    const isNewStudent   = profile.profileAge < 7 || profile.overallMastery === 0;
    const needsMotivation = profile.currentStreak === 0 || profile.activityTier === 'inactive' || profile.activityTier === 'low';
    const hasActivePath  = activePath !== null;

    // ── Build context summary string for system prompt ───
    const contextSummary = buildContextSummary(profile, analysis, topicReportStr, isStruggling, isOnFire, isNewStudent);

    return {
      userId,
      learnerType:      profile.learningType,
      classLevel:       profile.classLevel,
      preferredLang:    profile.preferredLanguage,
      tutorPersonality: profile.tutorPersonality,
      weakTopics:       profile.weakTopics,
      criticalTopics,
      strongTopics:     profile.strongTopics,
      recentMistakes:   profile.recentMistakes,
      topicReport:      topicReportStr,
      currentStreak:    profile.currentStreak,
      activityScore:    profile.activityScore,
      overallMastery:   profile.overallMastery,
      learningSpeed:    profile.learningSpeed,
      codingLevel:      profile.codingLevel,
      activePath,
      flags: {
        isStruggling,
        isOnFire,
        hasActivePath,
        isNewStudent,
        needsMotivation,
      },
      contextSummary,
    };
  } catch (err: any) {
    logger.error(`[ContextBuilder] buildAIContext: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// getContextSummary — lightweight version (string only)
// For quick injection into existing AskAI prompts
// ─────────────────────────────────────────────────────────────
export async function getContextSummary(userId: string): Promise<string> {
  const ctx = await buildAIContext(userId).catch(() => null);
  return ctx?.contextSummary || '';
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
async function getActivePathContext(userId: string): Promise<AIContextPacket['activePath']> {
  try {
    const path = await LearningPath.findOne({ userId, status: 'active' })
      .select('title steps progressPercent subject')
      .sort({ createdAt: -1 })
      .lean() as any;

    if (!path) return null;

    const nextStep = path.steps?.find((s: any) => !s.isCompleted);

    return {
      title:       path.title,
      currentStep: nextStep?.title || null,
      progressPct: path.progressPercent || 0,
      subject:     path.subject || 'General',
    };
  } catch {
    return null;
  }
}

function buildContextSummary(
  profile: StudentIntelligenceProfile,
  analysis: TopicAnalysis | null,
  topicReport: string,
  isStruggling: boolean,
  isOnFire: boolean,
  isNewStudent: boolean,
): string {
  const lines: string[] = [];

  // Learner identity
  const identity = [
    `Learner: ${profile.learningType}`,
    profile.classLevel && `Level: ${profile.classLevel}`,
    `Coding: ${profile.codingLevel}`,
    `Speed: ${profile.learningSpeed}`,
  ].filter(Boolean).join(', ');
  lines.push(identity);

  // Mastery snapshot
  lines.push(`Overall mastery: ${profile.overallMastery}% | Streak: ${profile.currentStreak} days | Activity: ${profile.activityScore}/100`);

  // Topic intelligence
  if (!isNewStudent && topicReport) {
    lines.push(`Topics — ${topicReport}`);
  }

  // State flags
  const stateFlags: string[] = [];
  if (isStruggling)          stateFlags.push('STRUGGLING — extra patience needed, break into small steps');
  if (isOnFire)              stateFlags.push('ON A STREAK — student is motivated, can go deeper');
  if (isNewStudent)          stateFlags.push('NEW STUDENT — be welcoming and encouraging');
  if (profile.learningSpeed === 'slow') stateFlags.push('SLOW LEARNER — repeat key points, use more examples');
  if (profile.learningSpeed === 'fast') stateFlags.push('FAST LEARNER — be concise, add advanced details');

  if (stateFlags.length > 0) lines.push(`Adapt: ${stateFlags.join(' | ')}`);

  // Recent mistakes (extra attention)
  if (profile.recentMistakes.length > 0) {
    lines.push(`Common mistakes: ${profile.recentMistakes.slice(0, 3).join(', ')} — address these proactively if relevant`);
  }

  return lines.join('\n');
}