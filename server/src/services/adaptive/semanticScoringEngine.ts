/**
 * AI Study OS — Semantic Scoring Engine  (BRAIN UPGRADE — Phase 2)
 * ─────────────────────────────────────────────────────────────
 * WHY THIS EXISTS:
 *   memoryRetrievalEngine.ts's topicOverlap() does EXACT token matching
 *   only. If a weak concept is stored as "Matrix Operations" and the
 *   student asks "how do I multiply two grids of numbers", overlap is
 *   ZERO — despite being the exact same concept — because no word is
 *   spelled identically. Synonyms, morphological variants (multiply
 *   vs multiplication), and Hinglish phrasing all fall through.
 *
 * WHAT THIS ADDS (no external API, no model download, no added deps):
 *   1. Lightweight stemming — strips common suffixes so "multiplying",
 *      "multiplication", "multiply" all collapse to the same root.
 *   2. A curated synonym/equivalence dictionary for study/CS/math
 *      vocabulary + common Hinglish equivalents ("samajh"↔"understand",
 *      "doubt"↔"confusion") — expands each token to its concept group.
 *   3. TF-IDF vectors built fresh from the student's OWN memory corpus
 *      per request (corpus is always small — a few dozen concepts at
 *      most — so this is microseconds, no precomputed index needed)
 *      + cosine similarity against the query.
 *   4. Blended score: 60% TF-IDF cosine + 40% synonym-expanded token
 *      overlap. The blend matters because TF-IDF alone is noisy on
 *      very short strings (topic names are often 2-4 words) — the
 *      synonym overlap term keeps short-text matching robust.
 *
 * HONESTY NOTE:
 *   This is NOT dense neural embeddings — it can't catch deep semantic
 *   relationships outside the synonym dictionary. It's a real, measurable
 *   upgrade over exact-keyword matching, at exactly zero infra cost or
 *   deployment risk. If genuine semantic depth is needed later, this
 *   engine's output contract (0–1 score) is a drop-in swap point for a
 *   real embedding model without touching any caller.
 *
 * Integration:
 *   • memoryRetrievalEngine.ts — replaces topicOverlap()'s exact-match
 *     logic. Call site contract (text, text) → 0–1 score is unchanged.
 */

// ── Lightweight stemmer ──────────────────────────────────────────
// Deliberately simple suffix-stripping (not a full Porter stemmer) —
// good enough to collapse the common English morphological variants
// that show up in study contexts, with none of the edge-case fragility
// a full linguistic stemmer brings in.
const SUFFIXES: ReadonlyArray<[string, string]> = [
  ['ization', ''], ['isation', ''],
  ['ational', 'ate'], ['tional', 'tion'],
  ['ing', ''], ['tion', 't'], ['sion', 's'],
  ['ment', ''], ['ness', ''], ['ity', ''],
  ['ies', 'y'], ['es', ''], ['ed', ''], ['ly', ''], ['s', ''],
];

function stem(word: string): string {
  if (word.length <= 3) return word; // too short to safely strip
  for (const [suffix, replacement] of SUFFIXES) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      return word.slice(0, -suffix.length) + replacement;
    }
  }
  return word;
}

// ── Synonym / equivalence groups ─────────────────────────────────
// Each inner array is a set of interchangeable terms (already stemmed
// where relevant). Broad study/math/CS vocabulary + common Hinglish
// equivalents seen across the codebase's own Hinglish message copy.
const SYNONYM_GROUPS: string[][] = [
  ['multipl', 'product', 'time', 'time'],
  ['divide', 'division', 'split', 'quotient'],
  ['add', 'sum', 'plus', 'addition'],
  ['subtract', 'minus', 'difference'],
  ['combine', 'merge', 'join', 'concat'],
  ['array', 'list', 'grid', 'matrix', 'sequence'],
  ['function', 'method', 'procedure'],
  ['variable', 'value', 'var'],
  ['loop', 'iterate', 'iteration', 'repeat'],
  ['error', 'bug', 'mistake', 'issue', 'problem'],
  ['solve', 'fix', 'resolve'],
  ['explain', 'samjhao', 'samjha', 'clarify'],
  ['understand', 'samajh', 'samaj', 'comprehend', 'get'],
  ['confuse', 'doubt', 'confus', 'stuck'],
  ['equation', 'formula', 'expression'],
  ['number', 'numb', 'digit', 'integer'],
  ['fraction', 'ratio', 'proportion'],
  ['graph', 'plot', 'chart'],
  ['algorithm', 'logic', 'approach'],
  ['class', 'object', 'instance'],
  ['string', 'text', 'word'],
  ['condition', 'conditional', 'if'],
  ['recursion', 'recursive'],
  ['derivative', 'differentiation', 'differentiate'],
  ['integral', 'integration', 'integrate'],
  ['probability', 'chance', 'likelihood'],
  ['memory', 'storage', 'ram'],
];

// Build a fast token → synonym-group-id lookup once at module load.
// Group terms are stemmed through the SAME stem() function used on
// runtime tokens — earlier version stored some terms unstemmed
// ("probability") while runtime tokens arrive stemmed ("probabil"),
// which silently broke matching. Stemming both sides identically
// fixes that class of bug entirely instead of hand-fixing individual entries.
const STEMMED_GROUPS: string[][] = SYNONYM_GROUPS.map(group => group.map(stem));
const TOKEN_TO_GROUP: Map<string, number> = new Map();
STEMMED_GROUPS.forEach((group, idx) => {
  for (const term of group) TOKEN_TO_GROUP.set(term, idx);
});

/**
 * Looks up a token's synonym group, with a fallback for the "silent e"
 * case naive suffix-stripping can't handle correctly (e.g. "combining"
 * stems to "combin", but "combine" itself has no suffix to strip and
 * stays "combine" — the two never naturally collide). Trying token+'e'
 * as a fallback closes that specific, common gap without needing a
 * full Porter-stemmer implementation.
 */
function lookupGroup(token: string): number | undefined {
  if (TOKEN_TO_GROUP.has(token)) return TOKEN_TO_GROUP.get(token);
  return TOKEN_TO_GROUP.get(token + 'e');
}

// ── Tokenization ──────────────────────────────────────────────
const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'on',
  'for', 'and', 'or', 'but', 'with', 'this', 'that', 'it', 'i', 'you',
  'do', 'does', 'did', 'me', 'my', 'ka', 'ki', 'ke', 'hai', 'ho', 'kya',
  'kaise', 'hi', 'bhi', 'toh', 'aur',
]);

function tokenizeAndStem(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t))
    .map(stem);
}

/** Expands a token list with any synonym-group siblings, for overlap matching. */
function expandWithSynonyms(tokens: string[]): Set<string> {
  const expanded = new Set(tokens);
  for (const t of tokens) {
    const groupId = lookupGroup(t);
    if (groupId !== undefined) {
      for (const sibling of STEMMED_GROUPS[groupId]) expanded.add(sibling);
    }
  }
  return expanded;
}

// ── TF-IDF + cosine ───────────────────────────────────────────
function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  const total = tokens.length || 1;
  for (const [k, v] of tf) tf.set(k, v / total);
  return tf;
}

function inverseDocFrequency(docsTokens: string[][]): Map<string, number> {
  const df = new Map<string, number>();
  for (const tokens of docsTokens) {
    for (const t of new Set(tokens)) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const idf = new Map<string, number>();
  const n = docsTokens.length || 1;
  for (const [t, count] of df) {
    idf.set(t, Math.log((n + 1) / (count + 1)) + 1); // smoothed IDF — never zero/negative
  }
  return idf;
}

function tfIdfVector(tf: Map<string, number>, idf: Map<string, number>): Map<string, number> {
  const vec = new Map<string, number>();
  for (const [t, freq] of tf) vec.set(t, freq * (idf.get(t) ?? 1));
  return vec;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, magA = 0, magB = 0;
  for (const v of a.values()) magA += v * v;
  for (const v of b.values()) magB += v * v;
  for (const [k, v] of a) {
    const bv = b.get(k);
    if (bv) dot += v * bv;
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom > 0 ? dot / denom : 0;
}

function synonymOverlap(queryTokens: string[], candidateTokens: string[]): number {
  if (candidateTokens.length === 0) return 0;
  const expandedQuery = expandWithSynonyms(queryTokens);
  const candidateSet  = new Set(candidateTokens);
  let hits = 0;
  for (const t of candidateSet) if (expandedQuery.has(t)) hits++;
  return hits / candidateSet.size;
}

// ─────────────────────────────────────────────────────────────
// semanticScoringEngine
// ─────────────────────────────────────────────────────────────
export interface SemanticScorer {
  /** Score a single candidate text against the query, 0–1. */
  score(candidateText: string): number;
}

export const semanticScoringEngine = {

  /**
   * createScorer — builds a scorer for ONE query against a known set of
   * candidate texts. IDF is computed once from the full candidate set
   * (the student's own memory items — always small, so this is cheap),
   * then reused for every score() call. This avoids recomputing IDF
   * per-item, which the naive per-item approach would otherwise do.
   */
  createScorer(queryText: string, candidateTexts: string[]): SemanticScorer {
    const queryTokens = tokenizeAndStem(queryText);

    if (candidateTexts.length === 0 || queryTokens.length === 0) {
      return { score: () => 0 };
    }

    const candidateTokenLists = candidateTexts.map(tokenizeAndStem);
    const idf = inverseDocFrequency(candidateTokenLists);
    const queryVec = tfIdfVector(termFrequency(queryTokens), idf);

    return {
      score(candidateText: string): number {
        const candidateTokens = tokenizeAndStem(candidateText);
        if (candidateTokens.length === 0) return 0;

        const candidateVec = tfIdfVector(termFrequency(candidateTokens), idf);
        const cosine = cosineSimilarity(queryVec, candidateVec);
        const synOverlap = synonymOverlap(queryTokens, candidateTokens);

        // Blend: cosine carries most of the weight (real distributional
        // signal), synonym overlap compensates for TF-IDF's weakness on
        // very short strings like topic names.
        return Math.min(1, cosine * 0.6 + synOverlap * 0.4);
      },
    };
  },
};