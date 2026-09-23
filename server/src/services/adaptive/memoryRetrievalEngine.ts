/**
 * AI Study OS — Memory Retrieval Engine  (GAP 2b FIX)
 * ─────────────────────────────────────────────────────────────
 * Instead of dumping ALL memory into the AI context (token waste),
 * this engine retrieves only the TOP-K most relevant memory items
 * based on the current query.
 *
 * Retrieval strategy:
 *   1. TF-IDF + synonym-aware semantic scoring between query and memory
 *      items (BRAIN UPGRADE — see semanticScoringEngine.ts; previously
 *      exact-keyword-only overlap, which missed synonyms/morphological
 *      variants/paraphrasing entirely)
 *   2. Recency weighting (recent mistakes score higher)
 *   3. Frequency weighting (repeated mistakes score highest)
 *   4. State-based filtering (STUCK → weak only, ADVANCED → strong)
 *
 * No external vector DB or embedding API required — TF-IDF is computed
 * fresh per-request from the student's own (small) memory corpus, so
 * this is always up to date with zero indexing infrastructure. A real
 * dense-embedding model remains a valid future upgrade — see
 * semanticScoringEngine.ts's own header for that tradeoff.
 *
 * Integration:
 *   • contextFusionEngine.ts  — replaces full memory dump
 *   • aiBrainCore.ts          — feeds into context before AskAI call
 */

import { longTermMemoryEngine, LongTermMemory, ConceptStrength, MistakeRecord } from './longTermMemoryEngine.js';
import { semanticScoringEngine, SemanticScorer } from './semanticScoringEngine.js';
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

    // BRAIN UPGRADE: build ONE semantic scorer from this student's own
    // memory corpus (all their concept/mistake topic strings), instead
    // of the old exact-keyword-only tokenize() overlap. IDF is computed
    // once here and reused across every candidate — cheap even though
    // it now does real TF-IDF + synonym-aware scoring per item.
    const candidateTexts = [
      ...memory.weakConcepts.map(c => c.concept),
      ...memory.strongConcepts.map(c => c.concept),
      ...memory.pastMistakes.map(m => m.topic),
    ];
    const scorer = semanticScoringEngine.createScorer(queryText, candidateTexts);

    const candidates: RetrievedMemoryItem[] = [
      ...scoreWeakConcepts(memory.weakConcepts, scorer, currentState),
      ...scoreStrongConcepts(memory.strongConcepts, scorer, currentState),
      ...scoreMistakes(memory.pastMistakes, scorer),
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
  concepts: ConceptStrength[],
  scorer:   SemanticScorer,
  state:    string
): RetrievedMemoryItem[] {
  return concepts.map(c => {
    const baseScore = state === 'STUCK' ? 0.60 : 0.30;
    const keywordBoost = scorer.score(c.concept) * 0.40;
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
  concepts: ConceptStrength[],
  scorer:   SemanticScorer,
  state:    string
): RetrievedMemoryItem[] {
  return concepts.map(c => {
    const baseScore = state === 'ADVANCED' ? 0.50 : 0.20;
    const keywordBoost = scorer.score(c.concept) * 0.40;
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
  mistakes: MistakeRecord[],
  scorer:   SemanticScorer
): RetrievedMemoryItem[] {
  const now = Date.now();
  return mistakes.map(m => {
    const keywordBoost   = scorer.score(m.topic) * 0.45;
    const frequencyBoost = Math.min(0.30, m.count * 0.05);
    const recencyScore   = recency(m.lastSeenAt, now);
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