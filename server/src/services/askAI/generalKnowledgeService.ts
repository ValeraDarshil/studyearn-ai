// ─────────────────────────────────────────────────────────────
// General Knowledge Service — generalKnowledgeService.ts
//
// FULLY FREE + UNLIMITED — uses Wikipedia REST API + DuckDuckGo
//
// Strategy:
//   1. Detect if question is "general knowledge" (no API needed)
//   2. Fetch from Wikipedia API (free, no key, unlimited)
//   3. Fetch image from Wikipedia (free, no key)
//   4. Return structured data for visual brain to render
//
// General Knowledge = factual questions about people, places,
// events, concepts that don't need AI to compute/reason
// ─────────────────────────────────────────────────────────────

import { logger } from '../../utils/logger.js';

export interface GeneralKnowledgeResult {
  isGeneral:   boolean;
  title:       string;
  summary:     string;
  imageUrl?:   string;
  imageCaption?: string;
  wikiUrl?:    string;
  type:        'person' | 'place' | 'concept' | 'event' | 'unknown';
  keyFacts:    string[];   // bullet facts extracted from wiki
}

// ─── Detection: Is this a general knowledge question? ────────
// Returns true for questions about famous people, places, events
// that Wikipedia can answer better than an AI API call.

const GK_PATTERNS = [
  // Who is / What is X
  /^who\s+is\s+/i,
  /^who\s+was\s+/i,
  /^what\s+is\s+(?!the\s+formula|the\s+equation|the\s+derivative|the\s+integral)/i,
  /^what\s+was\s+/i,
  // Capital / Country questions
  /^what\s+is\s+the\s+capital\s+of/i,
  /^capital\s+of\s+/i,
  // Tell me about X
  /^tell\s+me\s+about\s+/i,
  /^information\s+(about|on)\s+/i,
  // Define / explain — general terms
  /^define\s+/i,
  // Famous people patterns
  /\b(who\s+is|who\s+was|biography|founder|inventor|discover)\b.*\b(elon|tesla|gandhi|einstein|newton|darwin|napoleon|shakespeare|modi|trump|obama|bezos|gates|zuckerberg|musk|einstein|hawking|darwin)\b/i,
];

const GK_TOPIC_WORDS = [
  'president', 'prime minister', 'founder', 'ceo', 'director', 'chairman',
  'country', 'continent', 'ocean', 'river', 'mountain', 'city', 'capital',
  'history', 'war', 'revolution', 'independence', 'treaty',
  'planet', 'galaxy', 'solar system', 'universe',
  'company', 'organization', 'institution', 'university',
];

export function isGeneralKnowledgeQuestion(prompt: string): boolean {
  const lower = prompt.toLowerCase().trim();

  // Skip if it's a study/homework question
  if (/\b(solve|calculate|prove|derive|differentiate|integrate|code|program|algorithm|formula|equation|how\s+does.*work|explain.*science|explain.*physics|explain.*math|explain.*chemistry)\b/i.test(lower)) {
    return false;
  }

  // Check patterns
  if (GK_PATTERNS.some(p => p.test(prompt))) return true;

  // Check if it's a short factual question with topic words
  if (lower.length < 100 && GK_TOPIC_WORDS.some(w => lower.includes(w))) return true;

  return false;
}

// ─── Extract search term from question ───────────────────────
function extractSearchTerm(prompt: string): string {
  return prompt
    .replace(/^(who\s+is|who\s+was|what\s+is|what\s+was|tell\s+me\s+about|information\s+about|information\s+on|define|explain)\s+/i, '')
    .replace(/^(the\s+)?/i, '')
    .replace(/\?+$/, '')
    .trim();
}

// ─── Wikipedia REST API call ──────────────────────────────────
// Completely free, no API key, no rate limit for reasonable use
async function fetchWikipedia(searchTerm: string): Promise<{
  title:    string;
  extract:  string;
  imageUrl: string | null;
  wikiUrl:  string;
} | null> {
  try {
    // Step 1: Search for the page title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&srlimit=1&origin=*`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'StudyEarnAI/1.0 (educational app)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const pageTitle = searchData.query?.search?.[0]?.title;
    if (!pageTitle) return null;

    // Step 2: Fetch page summary + image
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const summaryRes = await fetch(summaryUrl, {
      headers: { 'User-Agent': 'StudyEarnAI/1.0 (educational app)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!summaryRes.ok) return null;
    const summaryData = await summaryRes.json();

    return {
      title:    summaryData.title || pageTitle,
      extract:  summaryData.extract || '',
      imageUrl: summaryData.thumbnail?.source || null,
      wikiUrl:  summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
    };
  } catch (e: any) {
    logger.debug(`[GK Service] Wikipedia fetch failed: ${e.message}`);
    return null;
  }
}

// ─── Classify topic type ─────────────────────────────────────
function classifyType(title: string, extract: string): 'person' | 'place' | 'concept' | 'event' | 'unknown' {
  const combined = (title + ' ' + extract).toLowerCase();
  if (/\b(born|died|ceo|president|minister|scientist|inventor|author|actor|politician|businessman|entrepreneur)\b/.test(combined)) return 'person';
  if (/\b(country|city|capital|river|mountain|ocean|continent|state|province|island|region)\b/.test(combined)) return 'place';
  if (/\b(war|battle|revolution|independence|event|treaty|conference|movement)\b/.test(combined)) return 'event';
  if (/\b(theory|concept|principle|law|system|process|phenomenon)\b/.test(combined)) return 'concept';
  return 'unknown';
}

// ─── Extract key facts from Wikipedia extract ─────────────────
function extractKeyFacts(extract: string, type: 'person' | 'place' | 'concept' | 'event' | 'unknown'): string[] {
  const sentences = extract
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.length > 30 && s.length < 200);

  // Return 3-4 most informative sentences
  return sentences.slice(0, 4);
}

// ─── Main function ───────────────────────────────────────────
export async function getGeneralKnowledge(prompt: string): Promise<GeneralKnowledgeResult> {
  const searchTerm = extractSearchTerm(prompt);
  logger.info(`[GK Service] Fetching: "${searchTerm}"`);

  const wiki = await fetchWikipedia(searchTerm);

  if (!wiki || !wiki.extract) {
    return {
      isGeneral: true,
      title:     searchTerm,
      summary:   '',
      type:      'unknown',
      keyFacts:  [],
    };
  }

  const type = classifyType(wiki.title, wiki.extract);
  const keyFacts = extractKeyFacts(wiki.extract, type);

  return {
    isGeneral:    true,
    title:        wiki.title,
    summary:      wiki.extract,
    imageUrl:     wiki.imageUrl || undefined,
    imageCaption: wiki.title,
    wikiUrl:      wiki.wikiUrl,
    type,
    keyFacts,
  };
}