/**
 * AI Study OS — AI Memory Engine
 * ─────────────────────────────────────────────────────────────
 * Gives the AI tutor a SHORT-TERM MEMORY of the student's
 * recent learning history so it feels like a real tutor.
 *
 * What it remembers:
 *   - Topics studied in the last 7 days
 *   - Last question asked (topic + subject)
 *   - Recent coding languages used
 *   - Last quiz performance
 *   - Consecutive correct / incorrect streak
 *
 * What it produces:
 *   - memoryContext string → injected into system prompt
 *   - continuationHint → "Last time we covered X, shall we continue?"
 *   - sessionSummary → what happened today so far
 *
 * Example output in prompt:
 *   "📖 MEMORY: Yesterday this student studied Loops and failed
 *    2 quiz questions on Arrays. Today they've asked 3 questions
 *    about Functions. Treat this as a continuation."
 *
 * Storage: derived from existing DB data (Conversation + StudentProfile)
 * No new DB writes — pure read + compute.
 */

import mongoose from 'mongoose';
import { Conversation }    from '../../models/Conversation.model.js';
import { StudentProfile }  from '../../models/StudentProfile.model.js';
import { logger }          from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────
export interface MemoryContext {
  recentTopics:       string[];    // topics from last 7 days
  lastStudiedTopic:   string | null;
  todayQuestionsCount:number;
  recentLanguages:    string[];    // coding languages used recently
  lastQuizScore:      number | null;
  consecutiveCorrect: number;
  consecutiveWrong:   number;
  sessionInsight:     string;      // human-readable summary
  continuationHint:   string | null; // "Last time we covered X..."
  memoryPromptBlock:  string;      // ready to inject into system prompt
}

// ── Coding language detector ──────────────────────────────────
const LANG_KEYWORDS: Record<string, string[]> = {
  Python:     ['python', 'print(', 'def ', 'import numpy', 'pandas', 'django', 'flask', '.py'],
  JavaScript: ['javascript', 'console.log', 'const ', 'let ', 'async', 'await', 'node', 'react', '.js'],
  Java:       ['java', 'public class', 'system.out', 'main(', '.java'],
  'C++':      ['c++', '#include', 'cout', 'cin', 'int main'],
  C:          [' printf(', ' scanf(', '#include <stdio', 'int main('],
  HTML:       ['html', '<div', '<p>', '<head>', '<body>', 'css'],
  SQL:        ['select ', 'from ', 'where ', 'join ', 'insert into', 'create table'],
};

function detectLanguages(text: string): string[] {
  const lower = text.toLowerCase();
  return Object.entries(LANG_KEYWORDS)
    .filter(([, kws]) => kws.some(kw => lower.includes(kw)))
    .map(([lang]) => lang);
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — buildMemoryContext
// ─────────────────────────────────────────────────────────────
export async function buildMemoryContext(userId: string): Promise<MemoryContext> {
  const empty: MemoryContext = {
    recentTopics: [], lastStudiedTopic: null, todayQuestionsCount: 0,
    recentLanguages: [], lastQuizScore: null, consecutiveCorrect: 0,
    consecutiveWrong: 0, sessionInsight: '', continuationHint: null,
    memoryPromptBlock: '',
  };

  try {
    const userObjId = new mongoose.Types.ObjectId(userId);

    // ── 1. Pull last 3 conversations (last 3 days) ─────────
    const recentConvos = await Conversation.find({
      userId:    userObjId,
      deletedAt: null,
      lastMessageAt: { $gte: new Date(Date.now() - 3 * 86400000) },
    })
      .sort({ lastMessageAt: -1 })
      .limit(3)
      .select('messages lastMessageAt')
      .lean();

    // ── 2. Pull profile for quiz data ──────────────────────
    const profile = await StudentProfile.findOne({ userId })
      .select('quizHistory dailyLogs topicMastery recentMistakes')
      .lean() as any;

    // ── 3. Extract recent user messages ────────────────────
    const allUserMessages: string[] = [];
    let todayQuestionsCount = 0;
    const todayStr = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];

    for (const convo of recentConvos) {
      for (const msg of (convo.messages || []) as any[]) {
        if (msg.role === 'user' && msg.content) {
          allUserMessages.push(msg.content);
          // Count today's questions
          const msgDate = new Date(convo.lastMessageAt).toISOString().split('T')[0];
          if (msgDate === todayStr) todayQuestionsCount++;
        }
      }
    }

    // ── 4. Detect languages from recent messages ──────────
    const langSet = new Set<string>();
    for (const msg of allUserMessages.slice(0, 10)) {
      detectLanguages(msg).forEach(l => langSet.add(l));
    }
    const recentLanguages = Array.from(langSet).slice(0, 3);

    // ── 5. Extract topics from topicMastery (recent 7 days) ─
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const recentTopics: string[] = (profile?.topicMastery || [])
      .filter((t: any) => t.lastAttemptedAt && new Date(t.lastAttemptedAt) > sevenDaysAgo)
      .sort((a: any, b: any) => new Date(b.lastAttemptedAt).getTime() - new Date(a.lastAttemptedAt).getTime())
      .slice(0, 6)
      .map((t: any) => t.topic);

    const lastStudiedTopic = recentTopics[0] || null;

    // ── 6. Quiz performance analysis ──────────────────────
    const recentQuizzes: any[] = (profile?.quizHistory || [])
      .slice(-5)
      .reverse();
    const lastQuizScore = recentQuizzes[0]?.score ?? null;

    // Consecutive correct/wrong streak
    let consecutiveCorrect = 0, consecutiveWrong = 0;
    for (const q of recentQuizzes) {
      if (q.score >= 60) { if (consecutiveWrong === 0) consecutiveCorrect++; else break; }
      else               { if (consecutiveCorrect === 0) consecutiveWrong++; else break; }
    }

    // ── 7. Session insight ────────────────────────────────
    const parts: string[] = [];
    if (todayQuestionsCount > 0) parts.push(`asked ${todayQuestionsCount} question${todayQuestionsCount > 1 ? 's' : ''} today`);
    if (lastStudiedTopic)        parts.push(`recently studied ${lastStudiedTopic}`);
    if (recentLanguages.length)  parts.push(`used ${recentLanguages.join(', ')}`);
    if (lastQuizScore !== null)  parts.push(`last quiz: ${lastQuizScore}%`);
    const sessionInsight = parts.length > 0 ? `Student has ${parts.join(', ')}.` : '';

    // ── 8. Continuation hint ──────────────────────────────
    let continuationHint: string | null = null;
    if (lastStudiedTopic && recentConvos.length > 0) {
      const lastConvoDate = new Date(recentConvos[0].lastMessageAt as Date);
      const hoursAgo = (Date.now() - lastConvoDate.getTime()) / 3600000;
      if (hoursAgo < 24) {
        continuationHint = `Last session covered ${lastStudiedTopic}. This may be a continuation.`;
      } else if (hoursAgo < 72) {
        continuationHint = `${lastStudiedTopic} was studied ${Math.round(hoursAgo)}h ago. Student may be returning to this topic.`;
      }
    }

    // ── 9. Build prompt block ─────────────────────────────
    const promptLines: string[] = [];
    if (recentTopics.length > 0)
      promptLines.push(`• Recent topics studied: ${recentTopics.slice(0, 4).join(', ')}`);
    if (recentLanguages.length > 0)
      promptLines.push(`• Coding languages used recently: ${recentLanguages.join(', ')}`);
    if (todayQuestionsCount > 0)
      promptLines.push(`• Questions asked today: ${todayQuestionsCount}`);
    if (lastQuizScore !== null)
      promptLines.push(`• Last quiz score: ${lastQuizScore}%`);
    if (consecutiveWrong >= 2)
      promptLines.push(`• ⚠️ Getting ${consecutiveWrong} wrong in a row — student may be struggling`);
    if (consecutiveCorrect >= 3)
      promptLines.push(`• ✅ ${consecutiveCorrect} correct in a row — student is on a roll`);
    if ((profile?.recentMistakes || []).length > 0)
      promptLines.push(`• Common mistakes: ${(profile.recentMistakes as string[]).slice(0, 3).join(', ')}`);
    if (continuationHint)
      promptLines.push(`• ${continuationHint}`);

    const memoryPromptBlock = promptLines.length > 0
      ? `📖 STUDENT MEMORY (use this to personalize):\n${promptLines.join('\n')}`
      : '';

    return {
      recentTopics, lastStudiedTopic, todayQuestionsCount,
      recentLanguages, lastQuizScore, consecutiveCorrect,
      consecutiveWrong, sessionInsight, continuationHint, memoryPromptBlock,
    };
  } catch (err: any) {
    logger.error(`[MemoryEngine] buildMemoryContext: ${err.message}`);
    return empty;
  }
}

// ─────────────────────────────────────────────────────────────
// getMemoryPromptBlock — lightweight string for prompt injection
// ─────────────────────────────────────────────────────────────
export async function getMemoryPromptBlock(userId: string): Promise<string> {
  const ctx = await buildMemoryContext(userId).catch(() => null);
  return ctx?.memoryPromptBlock || '';
}