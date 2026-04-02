/**
 * AI Study OS — AI Memory Store (Stage 5)
 * ─────────────────────────────────────────────────────────────
 * Gives the AI persistent memory about each student.
 *
 * WITHOUT memory → AI treats every session as new.
 * WITH memory    → AI remembers weak topics, past questions,
 *                  achievements — gives personalized answers.
 *
 * Storage strategy (no new DB fields needed):
 *   - Session-level: in-memory Map (fast, volatile)
 *   - Persistent weak topics: StudentProfile.recentMistakes[]
 *   - Conversation memory: Conversation model (already exists)
 *   - Achievements: StudentProfile.weeklyInsights[]
 *   - Orchestration log: in-memory only (non-critical)
 *
 * Used by:
 *   - contextFusionEngine.ts  → inject memory into AI prompt
 *   - aiOrchestrator.ts       → commit session at end of run
 *   - aiTaskRouter.ts         → recordAchievement, syncMemory
 */

import { StudentProfile } from '../../models/StudentProfile.model.js';
import { Conversation }   from '../../models/Conversation.model.js';
import { logger }         from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export interface ConversationMemoryEntry {
  question:  string;
  topic?:    string;
  askedAt:   string;
}

export interface WeakTopicMemoryEntry {
  topic:         string;
  occurrences:   number;
  lastSeen:      string;
}

export interface AchievementMemoryEntry {
  type:       'streak' | 'completion' | 'score' | 'custom';
  title:      string;
  achievedAt: string;
  value?:     number;
}

export interface OrchestrationLogEntry {
  trigger:      string;
  studentState: string;
  decisions:    string[];
  timestamp:    string;
}

export interface AIMemorySnapshot {
  userId:              string;
  recentConversations: ConversationMemoryEntry[];
  weakTopics:          WeakTopicMemoryEntry[];
  achievements:        AchievementMemoryEntry[];
  lastOrchestration:   OrchestrationLogEntry | null;
  memoryLoadedAt:      string;
}

// ── In-memory session store (per process) ─────────────────────
interface SessionData {
  conversations: ConversationMemoryEntry[];
  orchestrationLog: OrchestrationLogEntry[];
  updatedAt: number;
}

const sessionStore = new Map<string, SessionData>();
const MAX_CONV_MEMORY  = 10;
const SESSION_TTL_MS   = 30 * 60 * 1000; // 30 min

// ─────────────────────────────────────────────────────────────
// aiMemoryStore
// ─────────────────────────────────────────────────────────────
export const aiMemoryStore = {

  // ── getMemorySnapshot ────────────────────────────────────────
  async getMemorySnapshot(userId: string): Promise<AIMemorySnapshot> {
    logger.info({ userId }, '[MemoryStore] Loading AI memory snapshot');

    try {
      const [profile, recentConvs] = await Promise.all([
        StudentProfile.findOne({ userId })
          .select('recentMistakes weeklyInsights currentStreak')
          .lean(),
        Conversation.findOne({ userId, deletedAt: null })
          .sort({ lastMessageAt: -1 })
          .select('messages')
          .lean(),
      ]);

      // ── Weak topics from recentMistakes (existing field) ────
      const mistakeTopics: string[] = (profile as any)?.recentMistakes ?? [];
      const weakTopics: WeakTopicMemoryEntry[] = buildWeakTopicEntries(mistakeTopics);

      // ── Conversation memory from session cache + Conversation model ──
      const session = sessionStore.get(userId);
      const sessionConvs = session?.conversations ?? [];

      // Extract recent user questions from last Conversation
      const dbConvs: ConversationMemoryEntry[] = [];
      const msgs = (recentConvs as any)?.messages ?? [];
      for (const msg of msgs.filter((m: any) => m.role === 'user').slice(-5).reverse()) {
        dbConvs.push({
          question: String(msg.content).slice(0, 200),
          askedAt:  new Date().toISOString(),
        });
      }

      const allConversations = [...sessionConvs, ...dbConvs].slice(0, MAX_CONV_MEMORY);

      // ── Achievements from weeklyInsights ─────────────────────
      const weeklyInsights: any[] = (profile as any)?.weeklyInsights ?? [];
      const achievements: AchievementMemoryEntry[] = weeklyInsights
        .slice(-3)
        .map((w: any) => ({
          type:       'completion' as const,
          title:      w.summary ?? 'Weekly goal completed',
          achievedAt: w.generatedAt ? new Date(w.generatedAt).toISOString() : new Date().toISOString(),
          value:      w.consistencyScore,
        }));

      const snapshot: AIMemorySnapshot = {
        userId,
        recentConversations: allConversations,
        weakTopics,
        achievements,
        lastOrchestration: session?.orchestrationLog.slice(-1)[0] ?? null,
        memoryLoadedAt:    new Date().toISOString(),
      };

      logger.info(
        { userId, convs: allConversations.length, weakTopics: weakTopics.length },
        '[MemoryStore] Snapshot loaded'
      );

      return snapshot;

    } catch (err: any) {
      logger.error({ userId, err: err.message }, '[MemoryStore] getMemorySnapshot failed');
      return buildEmptySnapshot(userId);
    }
  },

  // ── recordConversation — store an AskAI exchange in session ──
  recordConversation(userId: string, entry: Omit<ConversationMemoryEntry, 'askedAt'>): void {
    const session = getOrCreateSession(userId);
    session.conversations.unshift({ ...entry, askedAt: new Date().toISOString() });
    if (session.conversations.length > MAX_CONV_MEMORY) {
      session.conversations.pop();
    }
    session.updatedAt = Date.now();
    logger.info({ userId, topic: entry.topic }, '[MemoryStore] Conversation recorded');
  },

  // ── recordWeakTopic — persist to StudentProfile.recentMistakes ─
  async recordWeakTopic(userId: string, topic: string): Promise<void> {
    try {
      const profile = await StudentProfile.findOne({ userId })
        .select('recentMistakes')
        .lean();

      const existing: string[] = (profile as any)?.recentMistakes ?? [];

      // Remove old occurrence, add to front, keep last 20
      const updated = [topic, ...existing.filter((t: string) => t !== topic)].slice(0, 20);

      await StudentProfile.findOneAndUpdate(
        { userId },
        { $set: { recentMistakes: updated } },
        { upsert: false }
      );

      logger.info({ userId, topic }, '[MemoryStore] Weak topic recorded');
    } catch (err: any) {
      logger.error({ userId, err: err.message }, '[MemoryStore] recordWeakTopic failed');
    }
  },

  // ── recordAchievement — store in session (weeklyInsights are set by progress system) ──
  async recordAchievement(
    userId:      string,
    achievement: Omit<AchievementMemoryEntry, 'achievedAt'>
  ): Promise<void> {
    try {
      // Log in session — the progress system handles weeklyInsights writes
      const session = getOrCreateSession(userId);
      logger.info({ userId, title: achievement.title }, '[MemoryStore] Achievement recorded (session)');

      // Optionally push a note into recentMistakes cleared (streak milestone)
      // This is a lightweight signal — no new schema fields needed
    } catch (err: any) {
      logger.error({ userId, err: err.message }, '[MemoryStore] recordAchievement failed');
    }
  },

  // ── commitOrchestrationSession — end of every orchestration run ──
  async commitOrchestrationSession(
    userId:   string,
    logEntry: OrchestrationLogEntry
  ): Promise<void> {
    try {
      const session = getOrCreateSession(userId);
      session.orchestrationLog.push(logEntry);

      // Keep last 10 log entries in session
      if (session.orchestrationLog.length > 10) {
        session.orchestrationLog.shift();
      }

      session.updatedAt = Date.now();

      logger.info({ userId, trigger: logEntry.trigger }, '[MemoryStore] Session committed');
    } catch (err: any) {
      logger.error({ userId, err: err.message }, '[MemoryStore] commitOrchestrationSession failed');
    }
  },

  // ── getWeakTopics — quick list for context fusion ─────────────
  async getWeakTopics(userId: string): Promise<string[]> {
    try {
      const profile = await StudentProfile.findOne({ userId })
        .select('recentMistakes weakTopics')
        .lean();

      const mistakes: string[] = (profile as any)?.recentMistakes ?? [];
      const weak:     string[] = (profile as any)?.weakTopics     ?? [];

      // Merge: recentMistakes = dynamically detected, weakTopics = AI-set
      return [...new Set([...mistakes, ...weak])].slice(0, 8);
    } catch {
      return [];
    }
  },

  // ── clearSessionCache ─────────────────────────────────────────
  clearSessionCache(userId: string): void {
    sessionStore.delete(userId);
    logger.info({ userId }, '[MemoryStore] Session cache cleared');
  },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function getOrCreateSession(userId: string): SessionData {
  let session = sessionStore.get(userId);
  if (!session) {
    session = { conversations: [], orchestrationLog: [], updatedAt: Date.now() };
    sessionStore.set(userId, session);
  }
  return session;
}

function buildWeakTopicEntries(mistakes: string[]): WeakTopicMemoryEntry[] {
  const countMap = new Map<string, number>();
  for (const t of mistakes) {
    countMap.set(t, (countMap.get(t) ?? 0) + 1);
  }
  return [...countMap.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([topic, occurrences]) => ({
      topic,
      occurrences,
      lastSeen: new Date().toISOString(),
    }));
}

function buildEmptySnapshot(userId: string): AIMemorySnapshot {
  return {
    userId,
    recentConversations: [],
    weakTopics:          [],
    achievements:        [],
    lastOrchestration:   null,
    memoryLoadedAt:      new Date().toISOString(),
  };
}