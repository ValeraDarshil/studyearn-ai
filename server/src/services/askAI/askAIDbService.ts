// ─────────────────────────────────────────────────────────────
// AskAI — askAIDbService.ts  (v10 — DB Only, No RAM, No Cross-Chat Mix)
//
// ROOT CAUSE FIX:
//   v9 mein loadSessionHistory() userId se SAARI sessions ki
//   history merge karta tha. Iska matlab Newton chat mein
//   Photosynthesis ka context inject ho jaata tha.
//
// v10 SOLUTION:
//   - History SIRF frontend bhejta hai (screen pe jo messages
//     hain woh already correct chat ke hain)
//   - DB se SIRF persist karo aur weak topics lo
//   - loadSessionHistory() REMOVED — use nahi hoti ab
//   - RAM (conversationMemoryEngine) REMOVED from AI pipeline
// ─────────────────────────────────────────────────────────────

import { AskAISession, type IAskAIMessage } from '../../models/AskAISession.model.js';
import { logger } from '../../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// getOrCreateAskAISession
// convoId se linked session dhundho ya naya banao
// ─────────────────────────────────────────────────────────────
export async function getOrCreateAskAISession(
  userId:  string,
  convoId: string | null,
): Promise<string> {
  try {
    if (convoId) {
      const existing = await AskAISession.findOne({
        userId,
        linkedConvoId: convoId,
        deletedAt:     null,
      }).select('_id').lean();

      if (existing) return (existing._id as any).toString();

      const session = await AskAISession.create({
        userId,
        linkedConvoId:  convoId,
        title:          'New Chat',
        messages:       [],
        lastMessageAt:  new Date(),
        sessionStartAt: new Date(),
      });

      logger.info(`[AskAI DB] Session linked | convoId=${convoId.slice(-6)}`);
      return session._id.toString();
    }

    const session = await AskAISession.create({
      userId,
      linkedConvoId:  null,
      title:          'New Chat',
      messages:       [],
      lastMessageAt:  new Date(),
      sessionStartAt: new Date(),
    });

    return session._id.toString();

  } catch (err: any) {
    logger.error(`[AskAI DB] getOrCreateAskAISession failed: ${err.message}`);
    return '';
  }
}

// ─────────────────────────────────────────────────────────────
// persistUserMessage
// ─────────────────────────────────────────────────────────────
export async function persistUserMessage(
  sessionId:      string,
  userId:         string,
  content:        string,
  detectedTopic:  string | null,
  emotionalState: string,
  questionType:   'text' | 'image' | 'pdf',
): Promise<void> {
  if (!sessionId) return;

  try {
    const msg: IAskAIMessage = {
      role:           'user',
      content:        content.slice(0, 5000),
      detectedTopic,
      emotionalState,
      questionType,
      createdAt:      new Date(),
    };

    const statsUpdate: Record<string, any> = {
      $push: { messages: msg },
      $set:  { lastMessageAt: new Date() },
      $inc:  {
        turnCount: 1,
        ...(questionType === 'text' ? { textCount: 1 } : { imageCount: 1 }),
      },
    };

    if (detectedTopic) {
      statsUpdate.$addToSet = { detectedTopics: detectedTopic };
    }

    if (emotionalState === 'confused' || emotionalState === 'frustrated') {
      statsUpdate.$inc.confusionCount = 1;
      if (detectedTopic) {
        statsUpdate.$addToSet = { ...statsUpdate.$addToSet, weakTopics: detectedTopic };
      }
    }

    if (emotionalState === 'correct' || emotionalState === 'motivated') {
      statsUpdate.$inc.masteryCount = 1;
      if (detectedTopic) {
        statsUpdate.$addToSet = { ...statsUpdate.$addToSet, strongTopics: detectedTopic };
      }
    }

    await AskAISession.updateOne({ _id: sessionId, userId }, statsUpdate);

    await AskAISession.updateOne(
      { _id: sessionId, userId, title: 'New Chat' },
      { $set: { title: content.slice(0, 60) } },
    );

  } catch (err: any) {
    logger.warn(`[AskAI DB] persistUserMessage failed: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
// persistAIMessage
// ─────────────────────────────────────────────────────────────
export async function persistAIMessage(
  sessionId:     string,
  userId:        string,
  content:       string,
  intent:        string | null,
  strategy:      string | null,
  skillLevel:    string | null,
  modelUsed:     string | null,
  providerUsed:  string | null,
  questionType:  'text' | 'image' | 'pdf',
  pointsAwarded: number,
  responseMs:    number | null,
): Promise<void> {
  if (!sessionId || !content) return;

  try {
    const msg: IAskAIMessage = {
      role:          'assistant',
      content:       content.slice(0, 20000),
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
      },
    );
  } catch (err: any) {
    logger.warn(`[AskAI DB] persistAIMessage failed: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
// getWeakTopicsFromDB — cross-session stats only
// ─────────────────────────────────────────────────────────────
export async function getWeakTopicsFromDB(userId: string): Promise<string[]> {
  try {
    const sessions = await AskAISession.find({ userId, deletedAt: null })
      .sort({ lastMessageAt: -1 })
      .limit(10)
      .select('weakTopics')
      .lean();

    const allWeak = sessions.flatMap((s: any) => s.weakTopics || []);
    return [...new Set(allWeak)].slice(0, 10);

  } catch (err: any) {
    logger.warn(`[AskAI DB] getWeakTopicsFromDB failed: ${err.message}`);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// getSessionSummaryForPrompt — sirf stats, history nahi
// ─────────────────────────────────────────────────────────────
export async function getSessionSummaryForPrompt(userId: string): Promise<string> {
  try {
    const sessions = await AskAISession.find({ userId, deletedAt: null, turnCount: { $gt: 0 } })
      .sort({ lastMessageAt: -1 })
      .limit(5)
      .select('weakTopics strongTopics')
      .lean();

    if (!sessions.length) return '';

    const allWeak   = [...new Set(sessions.flatMap((s: any) => s.weakTopics   || []))].slice(0, 5);
    const allStrong = [...new Set(sessions.flatMap((s: any) => s.strongTopics || []))].slice(0, 5);
    const parts: string[] = [];

    if (allWeak.length)   parts.push(`Student previously struggled with: ${allWeak.join(', ')}`);
    if (allStrong.length) parts.push(`Student has mastered: ${allStrong.join(', ')}`);

    return parts.join('. ');

  } catch (err: any) {
    logger.warn(`[AskAI DB] getSessionSummaryForPrompt failed: ${err.message}`);
    return '';
  }
}