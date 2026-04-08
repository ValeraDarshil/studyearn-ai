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

    const allWeak = sessions.flatMap((s: any) => s.weakTopics || []) as string[];
    return [...new Set(allWeak)].slice(0, 10) as string[];

  } catch (err: any) {
    logger.warn(`[AskAI DB] getWeakTopicsFromDB failed: ${err.message}`);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// getSessionSummaryForPrompt — UPGRADED (v12)
// Returns rich memory context for Memory Surprise (Improvement 1)
// Now includes: specific past struggles, growth signals, last topic
// This enables the AI to say "Last time you struggled with base case
// in recursion — let's connect that to today's topic"
// ─────────────────────────────────────────────────────────────
export async function getSessionSummaryForPrompt(userId: string): Promise<string> {
  try {
    const sessions = await AskAISession.find({ userId, deletedAt: null, turnCount: { $gt: 0 } })
      .sort({ lastMessageAt: -1 })
      .limit(7)
      .select('weakTopics strongTopics detectedTopics title turnCount lastMessageAt messages')
      .lean();

    if (!sessions.length) return '';

    const allWeak      = [...new Set(sessions.flatMap((s: any) => s.weakTopics      || []) as string[])].slice(0, 5) as string[];
    const allStrong    = [...new Set(sessions.flatMap((s: any) => s.strongTopics    || []) as string[])].slice(0, 5) as string[];
    const allTopics    = [...new Set(sessions.flatMap((s: any) => s.detectedTopics  || []) as string[])].slice(0, 8) as string[];
    const totalTurns   = sessions.reduce((acc: number, s: any) => acc + (s.turnCount || 0), 0);

    // Last session's topic for "last time you asked about X" reference
    const lastSession       = sessions[0] as any;
    const lastTopic         = lastSession?.detectedTopics?.[lastSession.detectedTopics.length - 1] ?? null;
    const lastSessionTitle  = lastSession?.title && lastSession.title !== 'New Chat'
      ? lastSession.title.slice(0, 60)
      : null;

    // Growth detection: topics that moved from weak → strong
    const grownTopics = allStrong.filter((t: string) => allWeak.includes(t));
    // Currently still weak (not yet mastered)
    const stillWeakTopics = allWeak.filter((t: string) => !allStrong.includes(t));

    const parts: string[] = [];

    // Memory context block — used for Memory Surprise moments
    if (lastTopic) {
      parts.push(`MEMORY REFERENCE: Student's most recent topic was "${lastTopic}". If today's question relates to this, naturally reference it (e.g., "Last time you were working on ${lastTopic}...").`);
    }
    if (lastSessionTitle && lastSessionTitle !== lastTopic) {
      parts.push(`Last session title: "${lastSessionTitle}".`);
    }

    // Struggle history — enables specific callouts
    if (stillWeakTopics.length > 0) {
      parts.push(`Student HAS STRUGGLED with: ${stillWeakTopics.join(', ')}. If today's question relates — gently acknowledge it: "Since ${stillWeakTopics[0]} was tricky for you before, let's approach it differently this time."`);
    }

    // Growth moments — enables Growth Mirror (Improvement 5)
    if (grownTopics.length > 0) {
      parts.push(`Student HAS GROWN in: ${grownTopics.join(', ')} (previously struggled, now mastered). Celebrate this occasionally.`);
    }

    // Strong topics
    if (allStrong.length > 0 && grownTopics.length === 0) {
      parts.push(`Student has shown mastery in: ${allStrong.join(', ')}.`);
    }

    // Topics coverage — for wow moments (Improvement 7)
    if (totalTurns >= 5) {
      parts.push(`Student has engaged in ${totalTurns} total Q&A turns across ${sessions.length} sessions, covering: ${allTopics.slice(0, 6).join(', ')}. Occasionally (every 5-6 turns) reflect a WOW OBSERVATION about their learning pattern (e.g., "You tend to ask example-based questions — that's a great way to learn!")`);
    }

    return parts.join('\n');

  } catch (err: any) {
    logger.warn(`[AskAI DB] getSessionSummaryForPrompt failed: ${err.message}`);
    return '';
  }
}