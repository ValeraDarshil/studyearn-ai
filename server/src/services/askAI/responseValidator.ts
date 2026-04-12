// ─────────────────────────────────────────────────────────────
// AskAI — responseValidator.ts  (v13 — Pedagogical Quality)
//
// ROUTE: server/src/services/askAI/responseValidator.ts
//
// GAP #8 FIX — Response Validator: surface checks → teaching quality
//
// What changed vs old version:
//   OLD: length + truncation + error signal = done
//        No idea if AI actually taught anything
//
//   NEW: 4 new quality dimensions added:
//     1. Pedagogical quality score — did AI actually explain,
//        give an example, and check understanding? Or just dump text?
//     2. Hallucination signal detection — patterns that indicate AI
//        may be making things up (contradictions, fake citations,
//        hedging phrases that signal uncertainty)
//     3. Teaching completeness — for TEACH/EXPLAIN intents, checks
//        if response has: explanation + example + summary/hook
//     4. Strategy compliance — checks if AI followed the strategy
//        the planner chose (STEP_BY_STEP should have numbered steps,
//        QUIZ should have a question, etc.)
//
// Output: ValidationResult now includes pedagogyScore (0-100)
//   which the model router uses to penalize low-quality models.
//
// Backward compatible — all new fields are additions, nothing removed.
// ─────────────────────────────────────────────────────────────

export interface ValidationResult {
  isValid:       boolean;
  issues:        string[];
  score:         number;       // 0-100: overall quality
  pedagogyScore: number;       // 0-100: teaching quality (v13 new)
  hallucination: boolean;      // v13: possible hallucination detected
  fallback?:     string;
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const MIN_LENGTH         = 30;
const MAX_LENGTH         = 8000;

const TRUNCATION_SIGNALS = ['...', '…', 'to be continued', '[truncated]', 'etc etc'];

const ERROR_SIGNALS = [
  'i cannot', "i can't", 'i am unable', 'as an ai, i',
  "i don't have access", 'i apologize, but',
  'error:', 'exception:', 'undefined',
];

// v13: Hallucination signal patterns
// These indicate the AI may be uncertain or fabricating
const HALLUCINATION_SIGNALS = [
  'i believe but am not sure',
  'i think, but please verify',
  'this might not be accurate',
  'i may be wrong about this',
  'as of my last update',           // stale knowledge signal
  'i cannot verify',
  'i am not certain',
  'please fact-check',
  '(citation needed)',
  '[source needed]',
];

// v13: Teaching quality positive signals
// These patterns indicate AI is actually teaching, not just answering
const PEDAGOGY_POSITIVE = [
  // Explanation signals
  /this means|in simple terms|think of it as|imagine|for example|for instance/i,
  /let me explain|here is how|here is why|the key concept/i,
  // Example signals
  /example:|e\.g\.|for instance|let us say|consider this|here is a sample/i,
  /\`\`\`|code:|output:|result:/i,   // code examples
  // Check/summary signals
  /quick check|does that make sense|try this|now you know|key takeaway/i,
  /in summary|to summarize|the main point|remember this/i,
  // Engagement signals
  /bonus curiosity|next level|want to explore|try it yourself/i,
];

// v13: Teaching completeness — for TEACH/EXPLAIN, we want all 3 parts
function checkTeachingCompleteness(response: string): {
  hasExplanation: boolean;
  hasExample:     boolean;
  hasSummaryOrHook: boolean;
} {
  const lower = response.toLowerCase();
  return {
    hasExplanation:   /let me explain|this means|here is how|think of it|imagine|kya hai|matlab/i.test(lower),
    hasExample:       /example|e\.g\.|for instance|consider|code|output|\`\`\`|jaise ki|maan lo/i.test(lower),
    hasSummaryOrHook: /summary|key point|remember|takeaway|next|explore|curiosity|quick check|\?\s*$/im.test(lower),
  };
}

// v13: Strategy compliance check
// Verifies AI followed the strategy the planner chose
function checkStrategyCompliance(response: string, intent: string): {
  compliant: boolean;
  issue:     string | null;
} {
  const lower = response.toLowerCase();

  if (intent === 'STEP_BY_STEP' || intent === 'SOLVE') {
    // Should have numbered steps
    const hasSteps = /\b(step\s*\d|1\.|2\.|3\.|\bfirst\b.*\bthen\b|\bfirstly\b)/i.test(response);
    if (!hasSteps) {
      return { compliant: false, issue: 'STEP_BY_STEP strategy but no numbered steps found' };
    }
  }

  if (intent === 'QUIZ') {
    // Should end with a question
    const hasQuestion = /\?/.test(response.slice(-200));
    if (!hasQuestion) {
      return { compliant: false, issue: 'QUIZ strategy but no question found at end' };
    }
  }

  if (intent === 'TEACH' || intent === 'EXPLAIN') {
    // Should have at least an explanation
    const hasExplanation = /means|is a|refers to|defined as|used for|works by/i.test(lower);
    if (!hasExplanation && response.length < 200) {
      return { compliant: false, issue: 'TEACH strategy but response too brief to contain explanation' };
    }
  }

  return { compliant: true, issue: null };
}

// ─────────────────────────────────────────────────────────────
// validateResponse — MAIN EXPORT (v13 enhanced)
// ─────────────────────────────────────────────────────────────
export function validateResponse(
  answer:     string,
  intent:     string,
  userPrompt: string,
): ValidationResult {
  const issues: string[] = [];
  let score        = 100;
  let pedagogyScore = 100;
  let hallucination = false;

  // ── Empty check ───────────────────────────────────────────
  if (!answer || typeof answer !== 'string') {
    return {
      isValid:       false,
      issues:        ['Empty or null response'],
      score:         0,
      pedagogyScore: 0,
      hallucination: false,
      fallback:      buildFallback(userPrompt),
    };
  }

  const trimmed   = answer.trim();
  const lower     = trimmed.toLowerCase();
  const wordCount = trimmed.split(/\s+/).length;

  // ── Length checks ─────────────────────────────────────────
  if (trimmed.length < MIN_LENGTH) {
    issues.push('Response too short');
    score -= 40;
    pedagogyScore -= 50;
  }

  if (trimmed.length > MAX_LENGTH) {
    issues.push('Response too long');
    score -= 10;
  }

  if (wordCount < 10) {
    issues.push('Too few words');
    score -= 30;
    pedagogyScore -= 30;
  }

  // ── Truncation check ──────────────────────────────────────
  if (TRUNCATION_SIGNALS.some(s => lower.endsWith(s) || lower.includes(s + ' '))) {
    issues.push('Response appears truncated');
    score -= 20;
    pedagogyScore -= 15;
  }

  // ── Error / refusal check ─────────────────────────────────
  if (ERROR_SIGNALS.some(s => lower.startsWith(s))) {
    issues.push('AI refused or errored');
    score -= 50;
    pedagogyScore -= 60;
  }

  // ── SOLVE intent: must have math content ──────────────────
  if (intent === 'SOLVE' && !/[\d=+\-*/^√∫∑]/.test(trimmed)) {
    issues.push('SOLVE intent but no mathematical content detected');
    score -= 15;
    pedagogyScore -= 20;
  }

  // ── v13: Hallucination signal detection ───────────────────
  const hallucinationHits = HALLUCINATION_SIGNALS.filter(s => lower.includes(s));
  if (hallucinationHits.length >= 2) {
    hallucination = true;
    issues.push(`Possible hallucination signals: ${hallucinationHits.slice(0, 2).join(', ')}`);
    score        -= 15;
    pedagogyScore -= 20;
  }

  // ── v13: Pedagogical quality scoring ─────────────────────
  // Count positive teaching signals
  const pedagogyHits = PEDAGOGY_POSITIVE.filter(p => p.test(trimmed)).length;
  const pedagogyBonus = Math.min(pedagogyHits * 8, 40);  // max +40 from pedagogy signals

  // Teaching completeness (for TEACH/EXPLAIN intents)
  if (intent === 'TEACH' || intent === 'EXPLAIN' || intent === 'CONCEPTUAL') {
    const completeness = checkTeachingCompleteness(trimmed);
    let completenessScore = 0;
    if (completeness.hasExplanation)    completenessScore += 15;
    if (completeness.hasExample)        completenessScore += 15;
    if (completeness.hasSummaryOrHook)  completenessScore += 10;

    if (!completeness.hasExplanation) {
      issues.push('TEACH intent: no clear explanation detected');
      pedagogyScore -= 20;
    }
    if (!completeness.hasExample && trimmed.length > 300) {
      issues.push('TEACH intent: no example found despite long response');
      pedagogyScore -= 10;
    }
    pedagogyScore = Math.min(100, pedagogyScore - 40 + completenessScore + pedagogyBonus);
  } else {
    // For non-teaching intents, pedagogy score is just based on signals
    pedagogyScore = Math.min(100, 60 + pedagogyBonus);
  }

  // ── v13: Strategy compliance check ───────────────────────
  const compliance = checkStrategyCompliance(trimmed, intent);
  if (!compliance.compliant && compliance.issue) {
    issues.push(compliance.issue);
    score        -= 10;
    pedagogyScore -= 15;
  }

  // ── Final score ───────────────────────────────────────────
  score         = Math.max(0, Math.min(100, score));
  pedagogyScore = Math.max(0, Math.min(100, pedagogyScore));

  const isValid = score >= 50 && trimmed.length >= MIN_LENGTH;

  return {
    isValid,
    issues,
    score,
    pedagogyScore,
    hallucination,
    ...(isValid ? {} : { fallback: buildFallback(userPrompt) }),
  };
}

// ─────────────────────────────────────────────────────────────
// truncateIfNeeded (unchanged)
// ─────────────────────────────────────────────────────────────
export function truncateIfNeeded(answer: string): string {
  if (answer.length <= MAX_LENGTH) return answer;
  return answer.slice(0, MAX_LENGTH) +
    '\n\n---\n*Response was very long and has been trimmed. Ask a follow-up for more detail.*';
}

// ─────────────────────────────────────────────────────────────
// buildFallback (unchanged)
// ─────────────────────────────────────────────────────────────
function buildFallback(userPrompt: string): string {
  const shortQ = userPrompt.slice(0, 60);
  return `I had trouble generating a complete answer for "${shortQ}". ` +
    `Please try rephrasing your question, or break it into smaller parts.`;
}

// ─────────────────────────────────────────────────────────────
// getQualityLabel — human-readable quality tier for logging
// ─────────────────────────────────────────────────────────────
export function getQualityLabel(result: ValidationResult): string {
  if (result.pedagogyScore >= 80) return 'excellent';
  if (result.pedagogyScore >= 60) return 'good';
  if (result.pedagogyScore >= 40) return 'adequate';
  return 'poor';
}