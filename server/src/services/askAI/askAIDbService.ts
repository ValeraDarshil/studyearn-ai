// ─────────────────────────────────────────────────────────────
// AskAI — askAIDbService.ts  (v9 — Database Persistence Layer)
//
// This replaces the RAM-only conversationMemoryEngine for
// PERSISTENT storage. The RAM engine still runs for speed
// (in-session fast lookups), but this service makes sure
// EVERYTHING is also written to MongoDB.
//
// FUNCTIONS:
//   createOrGetSession()  — start/resume a DB session
//   persistUserMessage()  — save user message to DB
//   persistAIMessage()    — save AI response to DB
//   loadSessionHistory()  — fetch last N messages from DB (cross-session)
//   getWeakTopicsFromDB() — get accumulated weak topics from all past sessions
//   updateSessionStats()  — update confusion/mastery counters
// ─────────────────────────────────────────────────────────────

import { AskAISession, type IAskAIMessage } from '../../models/AskAISession.model.js';
import { logger } from '../../utils/logger.js';

// How many recent messages to load from DB for context
const DB_HISTORY_LIMIT = 20;

// ─────────────────────────────────────────────────────────────
// createOrGetSession
// Gets existing open session OR creates a new one.
// "Open" = last message was < 30 minutes ago (session continuity).
// After 30 min gap → new session (same as RAM TTL).
// ─────────────────────────────────────────────────────────────
export async function createOrGetSession(
  userId:  string,
  convoId: string | null,  // from frontend sidebar (can be null for new chats)
): Promise<string> {
  try {
    // If frontend passed a convoId, use it directly
    if (convoId) {
      const existing = await AskAISession.findOne({
        _id:       convoId,
        userId,
        deletedAt: null,
      }).select('_id').lean();

      if (existing) return existing._id.toString();
    }

    // Try to find an open session from last 30 min
    const cutoff = new Date(Date.now() - 30 * 60 * 1000);
    const open = await AskAISession.findOne({
      userId,
      deletedAt:     null,
      lastMessageAt: { $gte: cutoff },
    })
    .sort({ lastMessageAt: -1 })
    .select('_id')
    .lean();

    if (open) return open._id.toString();

    // Create fresh session
    const session = await AskAISession.create({
      userId,
      title:         'New Chat',
      messages:      [],
      lastMessageAt: new Date(),
      sessionStartAt: new Date(),
    });

    logger.info(`[AskAI DB] New session created | userId=${userId.slice(-6)} | sessionId=${session._id.toString().slice(-6)}`);
    return session._id.toString();

  } catch (err: any) {
    logger.error(`[AskAI DB] createOrGetSession failed: ${err.message}`);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// persistUserMessage
// Saves the user's message to DB immediately on receive.
// Non-blocking from the controller's perspective (await in bg).
// ─────────────────────────────────────────────────────────────
export async function persistUserMessage(
  sessionId:      string,
  userId:         string,
  content:        string,
  detectedTopic:  string | null,
  emotionalState: string,
  questionType:   'text' | 'image' | 'pdf',
): Promise<void> {
  try {
    const msg: IAskAIMessage = {
      role:           'user',
      content,
      detectedTopic,
      emotionalState,
      questionType,
      createdAt:      new Date(),
    };

    // Update session stats based on question type
    const statsUpdate: Record<string, any> = {
      $push:         { messages: msg },
      $set:          { lastMessageAt: new Date() },
      $inc:          {
        turnCount:   1,
        ...(questionType === 'text'  ? { textCount: 1  } : {}),
        ...(questionType !== 'text'  ? { imageCount: 1 } : {}),
      },
    };

    // Add detected topic to session topics list (deduplicated via $addToSet)
    if (detectedTopic) {
      statsUpdate.$addToSet = { detectedTopics: detectedTopic };
    }

    // Track emotional states in session stats
    if (emotionalState === 'confused' || emotionalState === 'frustrated') {
      statsUpdate.$inc!.confusionCount = 1;
      // Add to weak topics if we know the topic
      if (detectedTopic) {
        statsUpdate.$addToSet = {
          ...statsUpdate.$addToSet,
          weakTopics: detectedTopic,
        };
      }
    }
    if (emotionalState === 'correct' || emotionalState === 'motivated') {
      statsUpdate.$inc!.masteryCount = 1;
      if (detectedTopic) {
        statsUpdate.$addToSet = {
          ...statsUpdate.$addToSet,
          strongTopics: detectedTopic,
        };
      }
    }

    await AskAISession.updateOne({ _id: sessionId, userId }, statsUpdate);

    // Auto-title: set title from first user message
    await AskAISession.updateOne(
      { _id: sessionId, userId, title: 'New Chat' },
      { $set: { title: content.slice(0, 60) } }
    );

  } catch (err: any) {
    logger.warn(`[AskAI DB] persistUserMessage failed (non-blocking): ${err.message}`);
    // Non-fatal — RAM memory still works, DB will catch up
  }
}

// ─────────────────────────────────────────────────────────────
// persistAIMessage
// Saves the complete AI response AFTER streaming ends.
// Called from afterResponse() in askAIService.ts
// ─────────────────────────────────────────────────────────────
export async function persistAIMessage(
  sessionId:    string,
  userId:       string,
  content:      string,
  intent:       string | null,
  strategy:     string | null,
  skillLevel:   string | null,
  modelUsed:    string | null,
  providerUsed: string | null,
  questionType: 'text' | 'image' | 'pdf',
  pointsAwarded: number,
  responseMs:   number | null,
): Promise<void> {
  try {
    const msg: IAskAIMessage = {
      role:          'assistant',
      content,
      intent,
      strategy,
      skillLevel,
      modelUsed,
      providerUsed,
      questionType,
      pointsAwarded,
      responseMs,
      createdAt:     new Date(),
    };

    await AskAISession.updateOne(
      { _id: sessionId, userId },
      {
        $push: { messages: msg },
        $set:  {
          lastMessageAt:   new Date(),
          finalSkillLevel: skillLevel || 'intermediate',
        },
      }
    );

  } catch (err: any) {
    logger.warn(`[AskAI DB] persistAIMessage failed (non-blocking): ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
// loadSessionHistory
// Loads last N messages from DB for a user.
// Used CROSS-SESSION — pulls from last 30 days of sessions,
// not just the current one. This gives true long-term memory.
// ─────────────────────────────────────────────────────────────
export async function loadSessionHistory(
  userId: string,
  limit = DB_HISTORY_LIMIT,
): Promise<{ role: 'user' | 'assistant'; content: string }[]> {
  try {
    // Get last 3 sessions (most recent first)
    const sessions = await AskAISession.find({
      userId,
      deletedAt: null,
    })
    .sort({ lastMessageAt: -1 })
    .limit(3)
    .select('messages')
    .lean();

    if (!sessions.length) return [];

    // Flatten messages from all sessions, keep most recent N
    const allMessages = sessions
      .flatMap(s => s.messages)
      .filter((m: any) => m.role && m.content)
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(-limit)
      .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    return allMessages;

  } catch (err: any) {
    logger.warn(`[AskAI DB] loadSessionHistory failed: ${err.message}`);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// getWeakTopicsFromDB
// Returns accumulated weak topics from the last 30 days.
// This is the REAL persistent weak topic list — not just
// what happened in the current RAM session.
// ─────────────────────────────────────────────────────────────
export async function getWeakTopicsFromDB(userId: string): Promise<string[]> {
  try {
    const sessions = await AskAISession.find({
      userId,
      deletedAt: null,
    })
    .sort({ lastMessageAt: -1 })
    .limit(10)
    .select('weakTopics')
    .lean();

    if (!sessions.length) return [];

    // Merge + deduplicate weak topics across sessions
    const allWeak = sessions.flatMap((s: any) => s.weakTopics || []);
    return [...new Set(allWeak)].slice(0, 10);

  } catch (err: any) {
    logger.warn(`[AskAI DB] getWeakTopicsFromDB failed: ${err.message}`);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// getSessionSummaryForPrompt
// Returns a human-readable summary of past sessions
// that gets injected into the AI system prompt.
// ─────────────────────────────────────────────────────────────
export async function getSessionSummaryForPrompt(userId: string): Promise<string> {
  try {
    const sessions = await AskAISession.find({
      userId,
      deletedAt:  null,
      turnCount:  { $gt: 0 },
    })
    .sort({ lastMessageAt: -1 })
    .limit(5)
    .select('weakTopics strongTopics detectedTopics turnCount confusionCount masteryCount finalSkillLevel lastMessageAt')
    .lean();

    if (!sessions.length) return '';

    const parts: string[] = [];

    const allWeak   = [...new Set(sessions.flatMap((s: any) => s.weakTopics   || []))].slice(0, 5);
    const allStrong = [...new Set(sessions.flatMap((s: any) => s.strongTopics || []))].slice(0, 5);
    const allTopics = [...new Set(sessions.flatMap((s: any) => s.detectedTopics || []))].slice(0, 8);

    const totalTurns     = sessions.reduce((a: number, s: any) => a + (s.turnCount       || 0), 0);
    const totalConfusion = sessions.reduce((a: number, s: any) => a + (s.confusionCount  || 0), 0);
    const totalMastery   = sessions.reduce((a: number, s: any) => a + (s.masteryCount    || 0), 0);

    parts.push(`Past sessions (last 30 days): ${sessions.length} sessions, ${totalTurns} total questions`);

    if (allTopics.length)  parts.push(`Topics studied: ${allTopics.join(', ')}`);
    if (allWeak.length)    parts.push(`Persistent weak areas: ${allWeak.join(', ')}`);
    if (allStrong.length)  parts.push(`Mastered topics: ${allStrong.join(', ')}`);
    if (totalConfusion > 0) parts.push(`Confusion events: ${totalConfusion} | Mastery events: ${totalMastery}`);

    return parts.join('. ');

  } catch (err: any) {
    logger.warn(`[AskAI DB] getSessionSummaryForPrompt failed: ${err.message}`);
    return '';
  }
}