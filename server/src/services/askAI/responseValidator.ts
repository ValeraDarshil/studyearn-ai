// ─────────────────────────────────────────────────────────────
// AskAI — responseValidator.ts
// Quality control on AI responses before sending to client.
// Checks: length, completeness, truncation, and safety.
// ─────────────────────────────────────────────────────────────

export interface ValidationResult {
  isValid:   boolean;
  issues:    string[];
  score:     number;   // 0-100
  fallback?: string;   // if invalid, use this
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const MIN_LENGTH         = 30;    // chars — too short = likely a failure
const MAX_LENGTH         = 8000;  // chars — guard against runaway responses
const TRUNCATION_SIGNALS = ['...', '…', 'to be continued', '[truncated]', 'etc etc'];
const ERROR_SIGNALS      = [
  'i cannot', 'i can\'t', 'i am unable', 'as an ai, i',
  'i don\'t have access', 'i apologize, but',
  'error:', 'exception:', 'undefined',
];
const CLARITY_MIN_WORDS  = 10;

// ─────────────────────────────────────────────────────────────
// validateResponse
// ─────────────────────────────────────────────────────────────
export function validateResponse(
  answer:     string,
  intent:     string,
  userPrompt: string,
): ValidationResult {
  const issues: string[] = [];
  let score = 100;

  if (!answer || typeof answer !== 'string') {
    return {
      isValid: false,
      issues:  ['Empty or null response'],
      score:   0,
      fallback: buildFallback(userPrompt),
    };
  }

  const trimmed   = answer.trim();
  const wordCount = trimmed.split(/\s+/).length;

  // ── Length check ──────────────────────────────────────────
  if (trimmed.length < MIN_LENGTH) {
    issues.push('Response too short');
    score -= 40;
  }

  if (trimmed.length > MAX_LENGTH) {
    issues.push('Response too long — may need truncation');
    score -= 10;
  }

  // ── Clarity check ─────────────────────────────────────────
  if (wordCount < CLARITY_MIN_WORDS) {
    issues.push('Too few words — likely unclear');
    score -= 30;
  }

  // ── Truncation check ──────────────────────────────────────
  const lower = trimmed.toLowerCase();
  if (TRUNCATION_SIGNALS.some(s => lower.endsWith(s) || lower.includes(s + ' '))) {
    issues.push('Response appears truncated');
    score -= 20;
  }

  // ── AI refusal / error check ──────────────────────────────
  if (ERROR_SIGNALS.some(s => lower.startsWith(s))) {
    issues.push('AI appears to have refused or errored');
    score -= 50;
  }

  // ── Correctness signal (heuristic) ───────────────────────
  // If a SOLVE intent but no numbers/formulas in answer, flag it
  if (intent === 'SOLVE' && !/[\d=+\-*/^√∫∑]/.test(trimmed)) {
    issues.push('SOLVE intent but no mathematical content detected');
    score -= 15;
  }

  const isValid = score >= 50 && trimmed.length >= MIN_LENGTH;

  return {
    isValid,
    issues,
    score: Math.max(0, score),
    ...(isValid ? {} : { fallback: buildFallback(userPrompt) }),
  };
}

// ─────────────────────────────────────────────────────────────
// truncateIfNeeded  (soft truncation with notice)
// ─────────────────────────────────────────────────────────────
export function truncateIfNeeded(answer: string): string {
  if (answer.length <= MAX_LENGTH) return answer;
  return answer.slice(0, MAX_LENGTH) +
    '\n\n---\n*Response was very long and has been trimmed. Ask a follow-up for more detail.*';
}

// ─────────────────────────────────────────────────────────────
// buildFallback
// ─────────────────────────────────────────────────────────────
function buildFallback(userPrompt: string): string {
  const shortQ = userPrompt.slice(0, 60);
  return `I had trouble generating a complete answer for "${shortQ}". ` +
    `Please try rephrasing your question, or break it into smaller parts and I'll tackle each one.`;
}