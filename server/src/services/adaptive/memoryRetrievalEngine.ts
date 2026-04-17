/**
 * AI Study OS — Memory Retrieval Engine  (GAP 2b FIX)
 * ─────────────────────────────────────────────────────────────
 * Instead of dumping ALL memory into the AI context (token waste),
 * this engine retrieves only the TOP-K most relevant memory items
 * based on the current query.
 *
 * Retrieval strategy:
 *   1. Keyword overlap between query and memory items
 *   2. Recency weighting (recent mistakes score higher)
 *   3. Frequency weighting (repeated mistakes score highest)
 *   4. State-based filtering (STUCK → weak only, ADVANCED → strong)
 *
 * No vector DB required — keyword scoring is sufficient for an
 * edu-app context. Vector DB can be swapped in later as an upgrade.
 *
 * Integration:
 *   • contextFusionEngine.ts  — replaces full memory dump
 *   • aiBrainCore.ts          — feeds into context before AskAI call
 */

import { longTermMemoryEngine, LongTermMemory, ConceptStrength, MistakeRecord } from './longTermMemoryEngine.js';
import { logger } from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export interface RetrievedMemoryItem {
  type:      'weak_concept' | 'strong_concept' | 'mistake' | 'milestone';
  topic:     string;
  subject?:  string;
  score:     number;       // relevance 0–1
  detail:    string;       // human-readable detail for prompt injection
}

export interface RetrievalQuery {
  userId:       string;
  queryText:    string;    // the student's current message
  currentState: string;   // STUCK | LEARNING | ADVANCED | etc.
  topK?:        number;   // default 5
}

export interface RetrievalResult {
  items:        RetrievedMemoryItem[];
  promptBlock:  string;   // formatted for AI system prompt
  retrievedAt:  string;
}

// ─────────────────────────────────────────────────────────────
// memoryRetrievalEngine
// ─────────────────────────────────────────────────────────────
export const memoryRetrievalEngine = {

  /**
   * retrieve — main entry point.
   * Returns top-K most relevant memory items for this query.
   */
  async retrieve(query: RetrievalQuery): Promise<RetrievalResult> {
    const { userId, queryText, currentState, topK = 5 } = query;

    logger.info({ userId, queryText: queryText.slice(0, 60), currentState }, '[MemoryRetrieval] Retrieving memory');

    const memory = await longTermMemoryEngine.getMemory(userId);
    const queryTokens = tokenize(queryText);

    const candidates: RetrievedMemoryItem[] = [
      ...scoreWeakConcepts(memory.weakConcepts, queryTokens, currentState),
      ...scoreStrongConcepts(memory.strongConcepts, queryTokens, currentState),
      ...scoreMistakes(memory.pastMistakes, queryTokens),
    ];

    // Sort by score descending, take topK
    candidates.sort((a, b) => b.score - a.score);
    const items = candidates.slice(0, topK);

    const promptBlock = buildPromptBlock(items, memory);

    logger.info(
      { userId, retrieved: items.length, top: items[0]?.topic ?? 'none' },
      '[MemoryRetrieval] Retrieved'
    );

    return {
      items,
      promptBlock,
      retrievedAt: new Date().toISOString(),
    };
  },

  /**
   * retrieveWeakTopics — quick helper used by Decision Engine.
   */
  async retrieveWeakTopics(userId: string, limit = 5): Promise<string[]> {
    try {
      const memory = await longTermMemoryEngine.getMemory(userId);
      return memory.weakConcepts
        .sort((a, b) => a.masteryScore - b.masteryScore)  // worst first
        .slice(0, limit)
        .map(c => c.concept);
    } catch {
      return [];
    }
  },
};

// ─────────────────────────────────────────────────────────────
// Scoring helpers
// ─────────────────────────────────────────────────────────────

function scoreWeakConcepts(
  concepts:    ConceptStrength[],
  queryTokens: Set<string>,
  state:       string
): RetrievedMemoryItem[] {
  return concepts.map(c => {
    const baseScore = state === 'STUCK' ? 0.60 : 0.30;
    const keywordBoost = topicOverlap(c.concept, queryTokens) * 0.40;
    const masteryPenalty = c.masteryScore / 200;  // weaker topics score higher
    const score = Math.min(1, baseScore + keywordBoost - masteryPenalty);

    return {
      type:    'weak_concept' as const,
      topic:   c.concept,
      subject: c.subject,
      score,
      detail: `${c.concept} (${c.subject}) — mastery: ${c.masteryScore}% [WEAK]`,
    };
  });
}

function scoreStrongConcepts(
  concepts:    ConceptStrength[],
  queryTokens: Set<string>,
  state:       string
): RetrievedMemoryItem[] {
  return concepts.map(c => {
    const baseScore = state === 'ADVANCED' ? 0.50 : 0.20;
    const keywordBoost = topicOverlap(c.concept, queryTokens) * 0.40;
    const score = Math.min(1, baseScore + keywordBoost);

    return {
      type:    'strong_concept' as const,
      topic:   c.concept,
      subject: c.subject,
      score,
      detail: `${c.concept} (${c.subject}) — mastery: ${c.masteryScore}% [STRONG]`,
    };
  });
}

function scoreMistakes(
  mistakes:    MistakeRecord[],
  queryTokens: Set<string>
): RetrievedMemoryItem[] {
  const now = Date.now();
  return mistakes.map(m => {
    const keywordBoost  = topicOverlap(m.topic, queryTokens) * 0.45;
    const frequencyBoost = Math.min(0.30, m.count * 0.05);
    const recencyScore  = recency(m.lastSeenAt, now);
    const score = Math.min(1, keywordBoost + frequencyBoost + recencyScore * 0.20);

    return {
      type:    'mistake' as const,
      topic:   m.topic,
      subject: m.subject,
      score,
      detail: `Repeated mistake in ${m.topic} (×${m.count}) — type: ${m.errorType}`,
    };
  });
}

// ─────────────────────────────────────────────────────────────
// Prompt block formatter
// ─────────────────────────────────────────────────────────────
function buildPromptBlock(items: RetrievedMemoryItem[], memory: LongTermMemory): string {
  if (items.length === 0) return '';

  const lines: string[] = ['[RELEVANT MEMORY]'];

  const weak     = items.filter(i => i.type === 'weak_concept');
  const strong   = items.filter(i => i.type === 'strong_concept');
  const mistakes = items.filter(i => i.type === 'mistake');

  if (weak.length > 0)
    lines.push(`Weak areas (watch for confusion): ${weak.map(i => i.topic).join(', ')}`);
  if (strong.length > 0)
    lines.push(`Already mastered (no need to over-explain): ${strong.map(i => i.topic).join(', ')}`);
  if (mistakes.length > 0)
    lines.push(`Repeated mistakes: ${mistakes.map(i => `${i.topic}(×${(memory.pastMistakes.find(m => m.topic === i.topic)?.count ?? 1)})`).join(', ')}`);

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────
function tokenize(text: string): Set<string> {
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2)
  );
}

function topicOverlap(topic: string, queryTokens: Set<string>): number {
  const topicTokens = tokenize(topic);
  let overlap = 0;
  for (const t of topicTokens) {
    if (queryTokens.has(t)) overlap++;
  }
  return topicTokens.size > 0 ? overlap / topicTokens.size : 0;
}

function recency(dateStr: string, now: number): number {
  try {
    const age = now - new Date(dateStr).getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    if (age < dayMs)       return 1.0;
    if (age < 7 * dayMs)   return 0.7;
    if (age < 30 * dayMs)  return 0.4;
    return 0.1;
  } catch {
    return 0.2;
  }
}