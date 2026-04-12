// ─────────────────────────────────────────────────────────────
// AskAI — contextEnhancer.ts  (v13 — Smart Weighted Fusion)
//
// ROUTE: server/src/services/askAI/contextEnhancer.ts
//
// GAP #6 FIX — Context Enhancer: from flat text dump → weighted smart fusion
//
// What changed vs old version:
//   OLD: AI Brain + Progress + Activity → concatenated text block
//        No weighting, no conflict resolution, no priority logic
//        Model gets noisy context → ignores most of it
//
//   NEW: 5 major improvements:
//     1. Priority weighting — each context source gets a weight (0-1).
//        High-weight items are placed first and marked clearly.
//        Low-weight items are summarized or dropped.
//
//     2. Conflict resolution — when sources disagree (e.g. brain says
//        "beginner" but recent test results say "advanced"), uses a
//        simple consensus rule and logs the conflict.
//
//     3. v13 frontend intelligence injection — reads smartMemoryContext,
//        comprehensionContext, adaptiveHint, teachingContext, and
//        personalizationContext sent by frontend and merges them
//        with weight 0.9 (highest priority — most current data).
//
//     4. Compact output — context block is structured so the most
//        important signals come first. Model doesn't have to read
//        500 words to find the key insight.
//
//     5. Noise reduction — session memory is only included if it
//        contains genuinely useful content (>50 chars, not just
//        "no prior context"). Generic/empty data is dropped.
//
// Fully backward compatible — works without v13 fields too.
// ─────────────────────────────────────────────────────────────

import { getMemorySummary } from './conversationMemoryEngine.js';
import { logger }           from '../../utils/logger.js';

export type LearningState = 'struggling' | 'improving' | 'excelling' | 'unknown';

export interface EnhancedContext {
  skillLevel:     'beginner' | 'intermediate' | 'advanced';
  weakTopics:     string[];
  strongTopics:   string[];
  currentGoal:    string;
  learningState:  LearningState;
  recentActivity: string;
  sessionSummary: string;
  contextBlock:   string;
}

// ─────────────────────────────────────────────────────────────
// v13: Frontend intelligence — sent per-request from AskAI.tsx
// ─────────────────────────────────────────────────────────────
export interface FrontendIntelligence {
  smartMemoryContext?:      string;  // top-4 semantically relevant memories
  comprehensionContext?:    string;  // live session comprehension stats
  adaptiveHint?:            string;  // how AI should adjust strategy
  teachingContext?:         string;  // teaching cycle phase info
  personalizationContext?:  string;  // learning style + cognitive load
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function normaliseSkill(raw?: string): EnhancedContext['skillLevel'] {
  if (!raw) return 'intermediate';
  const s = raw.toLowerCase();
  if (s === 'beginner') return 'beginner';
  if (s === 'advanced') return 'advanced';
  return 'intermediate';
}

function normaliseState(raw?: string): LearningState {
  if (!raw) return 'unknown';
  const s = raw.toUpperCase();
  if (s === 'STUCK')     return 'struggling';
  if (s === 'IMPROVING') return 'improving';
  if (s === 'EXCELLING' || s === 'ACTIVE') return 'excelling';
  return 'unknown';
}

// Checks if a string is genuinely useful (not empty/boilerplate)
function isUseful(text?: string): boolean {
  if (!text || text.trim().length < 30) return false;
  const lower = text.toLowerCase();
  // Drop generic/empty signals
  if (lower.includes('no prior context') ||
      lower.includes('no memories') ||
      lower.includes('no weak topics') ||
      lower.includes('no data available')) return false;
  return true;
}

// Weight-tagged section builder
// Higher weight = shown first = model pays more attention
function weightedSection(
  label:   string,
  content: string,
  weight:  number,  // 0.0 - 1.0
): { label: string; content: string; weight: number } {
  return { label, content, weight };
}

// ─────────────────────────────────────────────────────────────
// main export: buildEnhancedContext
// v13: accepts optional frontend intelligence for fusion
// ─────────────────────────────────────────────────────────────
export async function buildEnhancedContext(
  userId:  string,
  message: string,
  // v13: optional frontend intelligence — highest priority if present
  frontendIntel?: FrontendIntelligence,
): Promise<EnhancedContext> {

  let skillLevel:    EnhancedContext['skillLevel'] = 'intermediate';
  let weakTopics:    string[]     = [];
  let strongTopics:  string[]     = [];
  const currentGoal    = '';
  let learningState: LearningState = 'unknown';
  let recentActivity = '';

  // ── Layer 1: Stage 5 Orchestrator ─────────────────────────
  // Weight: 0.7 — good long-term data but may be stale
  let orchestratorWeight = 0.7;
  if (userId) {
    try {
      const { getFusedContextForAI } = await import('../aiCore/aiOrchestrator.js');
      const fused = await getFusedContextForAI(userId);
      if (fused) {
        skillLevel    = normaliseSkill(fused.skillLevel);
        weakTopics    = (fused.weakTopics   ?? []).slice(0, 6);
        strongTopics  = (fused.strongTopics ?? []).slice(0, 6);
        learningState = normaliseState(fused.currentState);
        orchestratorWeight = 0.7;
      }
    } catch (e: any) {
      logger.warn('contextEnhancer: orchestrator failed — ' + (e?.message ?? e));
      orchestratorWeight = 0;
    }
  }

  // ── Layer 2: Tutor Context Manager ────────────────────────
  // Weight: 0.65 — session-specific but sometimes redundant with Layer 1
  if (userId) {
    try {
      const { buildTutorContext } = await import('../aiTutor/tutorContextManager.js');
      const tutorCtx = await buildTutorContext(userId, message, 'ask', undefined);
      if (tutorCtx) {
        // v13: Conflict resolution — only override if tutor disagrees AND
        // orchestrator weight is low (orchestrator failed/missing)
        if (tutorCtx.skillLevel && (skillLevel === 'intermediate' || orchestratorWeight < 0.5)) {
          const tutorSkill = normaliseSkill(tutorCtx.skillLevel);
          if (tutorSkill !== skillLevel) {
            logger.info(`[ContextEnhancer] Skill conflict: orchestrator=${skillLevel}, tutor=${tutorSkill} → using tutor`);
            skillLevel = tutorSkill;
          }
        }
        if (tutorCtx.learningMode) recentActivity = tutorCtx.learningMode;
        const tutorWeak: string[] = tutorCtx.weakTopics ?? tutorCtx.criticalTopics ?? [];
        for (const t of tutorWeak) {
          if (!weakTopics.includes(t)) weakTopics.push(t);
        }
      }
    } catch (e: any) {
      logger.warn('contextEnhancer: tutor context failed — ' + (e?.message ?? e));
    }
  }

  // ── Layer 3: In-session RAM memory ────────────────────────
  // Weight: 0.5 — useful but replaced by v13 smartMemoryContext if present
  const rawSessionMemory = userId ? getMemorySummary(userId) : '';
  // Only use RAM memory if no frontend smart memory provided
  const sessionSummary = (!frontendIntel?.smartMemoryContext && isUseful(rawSessionMemory))
    ? rawSessionMemory
    : '';

  // ── Layer 4: v13 Frontend Intelligence — HIGHEST PRIORITY ─
  // Weight: 0.9 — most current, computed from actual student behavior
  // These come directly from the student's live session in the browser.
  // They are MORE accurate than DB data because they reflect RIGHT NOW.
  const hasFrontendIntel = frontendIntel && (
    isUseful(frontendIntel.smartMemoryContext) ||
    isUseful(frontendIntel.comprehensionContext) ||
    isUseful(frontendIntel.adaptiveHint) ||
    isUseful(frontendIntel.teachingContext) ||
    isUseful(frontendIntel.personalizationContext)
  );

  // ── Build weighted sections ────────────────────────────────
  // Sections are sorted by weight DESC so most important info comes first.
  const sections: { label: string; content: string; weight: number }[] = [];

  // v13 frontend intel sections (weight 0.9 — highest)
  if (hasFrontendIntel) {
    if (isUseful(frontendIntel!.personalizationContext)) {
      sections.push(weightedSection(
        '🎯 LIVE PERSONALIZATION (highest priority — student behavior right now)',
        frontendIntel!.personalizationContext!,
        0.95,
      ));
    }
    if (isUseful(frontendIntel!.comprehensionContext)) {
      sections.push(weightedSection(
        '📊 LIVE COMPREHENSION (current session performance)',
        frontendIntel!.comprehensionContext!,
        0.9,
      ));
    }
    if (isUseful(frontendIntel!.adaptiveHint)) {
      sections.push(weightedSection(
        '⚙️ ADAPTIVE INSTRUCTION',
        frontendIntel!.adaptiveHint!,
        0.88,
      ));
    }
    if (isUseful(frontendIntel!.teachingContext)) {
      sections.push(weightedSection(
        '🔄 TEACHING CYCLE STATE',
        frontendIntel!.teachingContext!,
        0.85,
      ));
    }
    if (isUseful(frontendIntel!.smartMemoryContext)) {
      sections.push(weightedSection(
        '💾 RELEVANT PAST INTERACTIONS (semantically matched)',
        frontendIntel!.smartMemoryContext!,
        0.8,
      ));
    }
  }

  // DB/server context sections (weight 0.5–0.7)
  if (weakTopics.length > 0) {
    sections.push(weightedSection(
      '⚠️ KNOWN WEAK TOPICS',
      weakTopics.slice(0, 5).join(', '),
      0.7,
    ));
  }
  if (strongTopics.length > 0) {
    sections.push(weightedSection(
      '✅ STRONG TOPICS',
      strongTopics.slice(0, 4).join(', '),
      0.5,
    ));
  }
  if (learningState !== 'unknown') {
    sections.push(weightedSection(
      '📈 LEARNING STATE',
      learningState.toUpperCase(),
      0.6,
    ));
  }
  if (recentActivity) {
    sections.push(weightedSection(
      '🕐 RECENT ACTIVITY',
      recentActivity,
      0.45,
    ));
  }
  if (isUseful(sessionSummary)) {
    sections.push(weightedSection(
      '🧠 SESSION MEMORY',
      sessionSummary,
      0.5,
    ));
  }

  // ── Sort by weight DESC → most important info first ────────
  sections.sort((a, b) => b.weight - a.weight);

  // ── Build final compact context block ─────────────────────
  const blockLines: string[] = [
    '╔═══ STUDENT CONTEXT (weighted by importance) ═══════════╗',
    `  Skill Level : ${skillLevel.toUpperCase()}`,
  ];

  // Add sections (only high-weight ones get their own line, rest are inline)
  const highPriority = sections.filter(s => s.weight >= 0.8);
  const medPriority  = sections.filter(s => s.weight >= 0.5 && s.weight < 0.8);
  const lowPriority  = sections.filter(s => s.weight < 0.5);

  if (highPriority.length > 0) {
    blockLines.push('');
    blockLines.push('  ━━ HIGH PRIORITY (read carefully) ━━');
    for (const s of highPriority) {
      blockLines.push(`  ${s.label}:`);
      // Indent content lines
      for (const line of s.content.split('\n').filter(Boolean)) {
        blockLines.push(`    ${line}`);
      }
    }
  }

  if (medPriority.length > 0) {
    blockLines.push('');
    blockLines.push('  ━━ BACKGROUND CONTEXT ━━');
    for (const s of medPriority) {
      blockLines.push(`  ${s.label}: ${s.content.split('\n')[0]}`);
    }
  }

  if (lowPriority.length > 0) {
    const lowSummary = lowPriority
      .map(s => s.content.split('\n')[0].slice(0, 60))
      .join(' | ');
    if (lowSummary.trim()) {
      blockLines.push(`  Additional: ${lowSummary}`);
    }
  }

  blockLines.push('');
  blockLines.push('╚══════════════════════════════════════════════════════╝');
  blockLines.push('');

  // Key instruction — explicit priority guidance for the model
  const instructionLines = [
    'CONTEXT USAGE RULES:',
    '- HIGH PRIORITY sections above override everything else.',
    '- If LIVE PERSONALIZATION says student is overloaded → use simplest possible language.',
    '- If ADAPTIVE INSTRUCTION is present → follow it exactly.',
    '- If LIVE COMPREHENSION shows re-explain rate > 50% → use different approach.',
    '- Reference RELEVANT PAST INTERACTIONS naturally when relevant — never forced.',
    '- NEVER mention "context", "data", or "I can see that you..." to the student.',
    '- Adapt depth to skill level. Natural, not robotic.',
  ];

  blockLines.push(...instructionLines);

  return {
    skillLevel,
    weakTopics:     weakTopics.slice(0, 6),
    strongTopics:   strongTopics.slice(0, 6),
    currentGoal,
    learningState,
    recentActivity,
    sessionSummary,
    contextBlock:   blockLines.join('\n'),
  };
}