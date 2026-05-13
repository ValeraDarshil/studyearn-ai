/**
 * AI Study OS — Long-Term Memory Engine  (v2 — FIX: upsert:true for recordMistake + recordMilestone)
 * ─────────────────────────────────────────────────────────────
 * WHAT CHANGED (v1 → v2):
 *
 *   FIX A — recordMistake() used { upsert: false }.
 *     If a StudentProfile didn't exist yet (brand-new user), the
 *     findOneAndUpdate found no document and silently did nothing.
 *     Every mistake for new users was permanently dropped.
 *     Fixed: { upsert: true } + $setOnInsert seeds safe defaults so the
 *     profile is created on the first mistake write if needed.
 *
 *   FIX B — recordMilestone() used { upsert: false }.
 *     Same root cause — new users had no profile → $push silently dropped.
 *     Fixed: { upsert: true } + $setOnInsert defaults.
 *
 * Everything else (getMemory, buildMemoryPromptBlock, deriveBehaviorPattern,
 * all types) is unchanged from v1.
 * ─────────────────────────────────────────────────────────────
 */

import { StudentProfile } from '../../models/StudentProfile.model.js';
import { AskAISession }   from '../../models/AskAISession.model.js';
import { logger }         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export interface MistakeRecord {
  topic:       string;
  subject:     string;
  question:    string;
  errorType:   'conceptual' | 'calculation' | 'memory' | 'application' | 'unknown';
  count:       number;
  firstSeenAt: string;
  lastSeenAt:  string;
}

export interface ConceptStrength {
  concept:      string;
  subject:      string;
  strength:     'weak' | 'developing' | 'strong' | 'mastered';
  masteryScore: number;
  reviewCount:  number;
  lastSeenAt:   string;
}

export interface LearningMilestone {
  type:        'first_question' | 'streak' | 'mastery' | 'comeback' | 'subject_unlocked';
  description: string;
  achievedAt:  string;
  value?:      number;
}

export interface BehaviorPattern {
  avgSessionDurationMin:  number;
  preferredSubjects:      string[];
  peakHour:               number | null;
  avgQuestionsPerSession: number;
  confusionRate:          number;
  retryRate:              number;
  updatedAt:              string;
}

export interface LongTermMemory {
  userId:          string;
  weakConcepts:    ConceptStrength[];
  strongConcepts:  ConceptStrength[];
  pastMistakes:    MistakeRecord[];
  milestones:      LearningMilestone[];
  behaviorPattern: BehaviorPattern | null;
  totalQuestions:  number;
  totalSessions:   number;
  loadedAt:        string;
}

// ─────────────────────────────────────────────────────────────
// longTermMemoryEngine
// ─────────────────────────────────────────────────────────────
export const longTermMemoryEngine = {

  /**
   * getMemory — loads full long-term memory for a user.
   * Called by contextFusionEngine and aiDecisionEngine.
   */
  async getMemory(userId: string): Promise<LongTermMemory> {
    logger.info({ userId }, '[LTMemory] Loading long-term memory');

    try {
      const [profile, sessions] = await Promise.all([
        StudentProfile.findOne({ userId })
          .select('topicMastery recentMistakes weeklyInsights currentStreak dailyStudyLog aiLongTermMemory')
          .lean(),
        AskAISession.find({ userId, deletedAt: null })
          .sort({ lastMessageAt: -1 })
          .limit(10)
          .select('detectedTopics weakTopics strongTopics confusionCount masteryCount turnCount sessionStartAt')
          .lean(),
      ]);

      // ── Derive concept strengths from topicMastery ────────────
      const topicMastery: any[] = (profile as any)?.topicMastery ?? [];

      const weakConcepts: ConceptStrength[] = topicMastery
        .filter(t => t.isWeak)
        .map(t => ({
          concept:      t.topic,
          subject:      t.subject,
          strength:     (t.masteryLevel < 20 ? 'weak' : 'developing') as ConceptStrength['strength'],
          masteryScore: t.masteryLevel,
          reviewCount:  t.totalAttempts,
          lastSeenAt:   t.lastAttemptedAt?.toISOString?.() ?? new Date().toISOString(),
        }))
        .slice(0, 10);

      const strongConcepts: ConceptStrength[] = topicMastery
        .filter(t => t.isStrong)
        .map(t => ({
          concept:      t.topic,
          subject:      t.subject,
          strength:     (t.masteryLevel >= 95 ? 'mastered' : 'strong') as ConceptStrength['strength'],
          masteryScore: t.masteryLevel,
          reviewCount:  t.totalAttempts,
          lastSeenAt:   t.lastAttemptedAt?.toISOString?.() ?? new Date().toISOString(),
        }))
        .slice(0, 10);

      // ── Mistake records ────────────────────────────────────────
      const storedMemory           = (profile as any)?.aiLongTermMemory ?? {};
      const pastMistakes: MistakeRecord[]        = storedMemory.pastMistakes ?? [];
      const milestones:   LearningMilestone[]    = storedMemory.milestones   ?? [];

      // ── Behavior pattern from session stats ────────────────────
      const behaviorPattern = deriveBehaviorPattern(sessions, storedMemory);

      // ── Aggregated counts ──────────────────────────────────────
      const totalQuestions = sessions.reduce((s, sess: any) => s + (sess.turnCount ?? 0), 0);
      const totalSessions  = sessions.length;

      const memory: LongTermMemory = {
        userId,
        weakConcepts,
        strongConcepts,
        pastMistakes: pastMistakes.slice(0, 20),
        milestones:   milestones.slice(0, 10),
        behaviorPattern,
        totalQuestions,
        totalSessions,
        loadedAt: new Date().toISOString(),
      };

      logger.info(
        { userId, weak: weakConcepts.length, strong: strongConcepts.length, mistakes: pastMistakes.length },
        '[LTMemory] Memory loaded'
      );

      return memory;

    } catch (err: any) {
      logger.error({ userId, err: err.message }, '[LTMemory] getMemory failed');
      return buildEmptyMemory(userId);
    }
  },

  /**
   * recordMistake — persists a new mistake to the user's long-term record.
   * Called by feedbackLoopEngine when a wrong answer is detected.
   *
   * FIX A (v2): upsert:false → upsert:true so brand-new users who have no
   * StudentProfile yet get one created on their first mistake write,
   * instead of the data being silently dropped.
   */
  async recordMistake(
    userId:    string,
    topic:     string,
    subject:   string,
    question:  string,
    errorType: MistakeRecord['errorType'] = 'unknown'
  ): Promise<void> {
    try {
      // Load existing mistakes first (read-then-merge)
      const profile = await StudentProfile.findOne({ userId })
        .select('aiLongTermMemory')
        .lean();

      const stored             = (profile as any)?.aiLongTermMemory ?? {};
      const mistakes: MistakeRecord[] = stored.pastMistakes ?? [];

      // Upsert in-memory: same topic+errorType → increment count
      const existing = mistakes.find(m => m.topic === topic && m.errorType === errorType);
      const now      = new Date().toISOString();

      if (existing) {
        existing.count++;
        existing.lastSeenAt = now;
      } else {
        mistakes.unshift({
          topic,
          subject,
          question:    (question || '').slice(0, 200),
          errorType,
          count:       1,
          firstSeenAt: now,
          lastSeenAt:  now,
        });
      }

      const trimmed = mistakes.slice(0, 50);

      // FIX A: upsert:true + $setOnInsert so new users get a profile document created
      await StudentProfile.findOneAndUpdate(
        { userId },
        {
          $set: { 'aiLongTermMemory.pastMistakes': trimmed },
          $setOnInsert: {
            userId,
            aiStrategyStats:     {},
            topicMastery:        [],
            overallMasteryScore: 50,
            createdAt:           new Date(),
          },
        },
        { upsert: true }  // FIX A: was { upsert: false } — new users lost all mistake history
      );

      logger.info({ userId, topic, errorType }, '[LTMemory] Mistake recorded');
    } catch (err: any) {
      logger.error({ userId, err: err.message }, '[LTMemory] recordMistake failed');
    }
  },

  /**
   * recordMilestone — persists a learning achievement.
   *
   * FIX B (v2): upsert:false → upsert:true so brand-new users get a
   * StudentProfile created on their first milestone, instead of the
   * $push being silently dropped on a missing document.
   */
  async recordMilestone(
    userId:      string,
    type:        LearningMilestone['type'],
    description: string,
    value?:      number
  ): Promise<void> {
    try {
      const milestone: LearningMilestone = {
        type, description, value,
        achievedAt: new Date().toISOString(),
      };

      // FIX B: upsert:true + $setOnInsert so new users get a profile created
      await StudentProfile.findOneAndUpdate(
        { userId },
        {
          $push: {
            'aiLongTermMemory.milestones': {
              $each:     [milestone],
              $position: 0,
              $slice:    30,
            },
          },
          $setOnInsert: {
            userId,
            aiStrategyStats:     {},
            topicMastery:        [],
            overallMasteryScore: 50,
            createdAt:           new Date(),
          },
        },
        { upsert: true }  // FIX B: was { upsert: false } — new users lost all milestones
      );

      logger.info({ userId, type }, '[LTMemory] Milestone recorded');
    } catch (err: any) {
      logger.error({ userId, err: err.message }, '[LTMemory] recordMilestone failed');
    }
  },

  /**
   * buildMemoryPromptBlock — formats memory into AI system prompt text.
   * Used by contextFusionEngine.ts to inject into AskAI.
   */
  buildMemoryPromptBlock(memory: LongTermMemory): string {
    const lines: string[] = ['[STUDENT LONG-TERM MEMORY]'];

    if (memory.weakConcepts.length > 0) {
      lines.push(`Weak areas: ${memory.weakConcepts.map(c => `${c.concept}(${c.masteryScore}%)`).join(', ')}`);
    }
    if (memory.strongConcepts.length > 0) {
      lines.push(`Strong areas: ${memory.strongConcepts.map(c => c.concept).join(', ')}`);
    }
    if (memory.pastMistakes.length > 0) {
      const top3 = memory.pastMistakes.slice(0, 3);
      lines.push(`Repeated mistakes: ${top3.map(m => `${m.topic}(×${m.count})`).join(', ')}`);
    }
    if (memory.behaviorPattern) {
      const bp = memory.behaviorPattern;
      lines.push(`Learning style: ${bp.preferredSubjects.join(', ')} | confusion rate: ${Math.round(bp.confusionRate * 100)}%`);
    }
    lines.push(`Total sessions: ${memory.totalSessions} | Total questions: ${memory.totalQuestions}`);

    return lines.join('\n');
  },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function deriveBehaviorPattern(sessions: any[], storedMemory: any): BehaviorPattern | null {
  if (!sessions || sessions.length === 0) return storedMemory.behaviorPattern ?? null;

  const totalTurns     = sessions.reduce((s, sess) => s + (sess.turnCount     ?? 0), 0);
  const totalConfusion = sessions.reduce((s, sess) => s + (sess.confusionCount ?? 0), 0);
  const totalMastery   = sessions.reduce((s, sess) => s + (sess.masteryCount   ?? 0), 0);

  const avgQuestions  = sessions.length > 0 ? totalTurns / sessions.length : 0;
  const confusionRate = totalTurns  > 0 ? totalConfusion / totalTurns : 0;
  const retryRate     = totalMastery > 0 ? totalMastery  / (totalTurns || 1) : 0;

  const subjectCount: Record<string, number> = {};
  for (const sess of sessions) {
    for (const topic of (sess.detectedTopics ?? [])) {
      subjectCount[topic] = (subjectCount[topic] ?? 0) + 1;
    }
  }
  const preferredSubjects = Object.entries(subjectCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([s]) => s);

  return {
    avgSessionDurationMin:  0,
    preferredSubjects,
    peakHour:               null,
    avgQuestionsPerSession: Math.round(avgQuestions),
    confusionRate:          Math.min(1, confusionRate),
    retryRate:              Math.min(1, retryRate),
    updatedAt:              new Date().toISOString(),
  };
}

function buildEmptyMemory(userId: string): LongTermMemory {
  return {
    userId,
    weakConcepts:    [],
    strongConcepts:  [],
    pastMistakes:    [],
    milestones:      [],
    behaviorPattern: null,
    totalQuestions:  0,
    totalSessions:   0,
    loadedAt:        new Date().toISOString(),
  };
}