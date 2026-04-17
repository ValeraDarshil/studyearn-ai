/**
 * AI Study OS — User State Inference Engine  (GAP 3 FIX)
 * ─────────────────────────────────────────────────────────────
 * The Response Planner currently depends on comprehension and
 * learningStyle signals from the frontend. If missing → system
 * becomes dumb.
 *
 * This engine infers the student's internal state purely from
 * server-side signals so the system never "goes blind":
 *
 *   • Message text patterns  → confusion, frustration, mastery
 *   • Response time          → hesitation → confusion
 *   • Retry count            → persistence after failure
 *   • Session history        → repeated topic = stuck
 *   • Mistake count          → rolling error rate
 *
 * Output:
 *   InferredUserState — feeds into Response Planner + Decision Engine
 *   as a server-computed alternative to frontend signals.
 *
 * Integration:
 *   • aiResponsePlanner.ts   — use instead of frontend comprehension
 *   • aiDecisionEngine.ts    — override state when signals are strong
 *   • aiBrainCore.ts         — included in every AskAI pipeline run
 */

import { logger } from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type InferredEmotion =
  | 'confused'
  | 'frustrated'
  | 'motivated'
  | 'neutral'
  | 'curious'
  | 'overloaded';

export type CognitiveLoad = 'low' | 'normal' | 'high' | 'overloaded';

export interface MessageSignal {
  message:       string;
  turnCount:     number;       // messages so far this session
  retryCount:    number;       // consecutive re-ask attempts on same topic
  responseTimeMs?: number;     // time from last AI response to this user message
  lastTopic?:    string | null;
  currentTopic?: string | null;
}

export interface InferredUserState {
  emotion:           InferredEmotion;
  cognitiveLoad:     CognitiveLoad;
  confusionScore:    number;    // 0–1
  frustrationScore:  number;   // 0–1
  masterySignal:     boolean;  // true = student understood
  needsReexplain:    boolean;  // true = AI should switch strategy
  needsEncouragement: boolean;
  isRepeatingTopic:  boolean;  // stuck on same topic
  inferredFrom:      string[]; // which signals triggered this
}

// ─────────────────────────────────────────────────────────────
// Confusion patterns (Hindi + English — Indian student focused)
// ─────────────────────────────────────────────────────────────
const CONFUSION_PATTERNS: RegExp[] = [
  /\b(i don'?t understand|don'?t get|not getting|not clear|confused|confusing)\b/i,
  /\b(samajh nahi|samajh nahin|samajh aa nahi|nahi samjha|nahi samajha)\b/i,
  /\b(what do you mean|what does that mean|can you explain|explain again|once more)\b/i,
  /\b(huh|what\?|sorry\?|excuse me\?)\b/i,
  /\b(i'm lost|i am lost|totally lost|completely lost)\b/i,
  /\b(dubara|phir se|again|once more|re-?explain)\b/i,
  /\b(still confused|still not|still don'?t)\b/i,
  /\b(kya matlab|matlab kya|iska matlab)\b/i,
];

// ─────────────────────────────────────────────────────────────
// Frustration patterns
// ─────────────────────────────────────────────────────────────
const FRUSTRATION_PATTERNS: RegExp[] = [
  /\b(this is (so )?hard|too difficult|too hard|impossible)\b/i,
  /\b(i give up|giving up|can'?t do this|can'?t understand)\b/i,
  /\b(why is this so|why so hard|why so difficult)\b/i,
  /\b(bahut hard|bahut mushkil|nahi ho raha|nahi kar sakta)\b/i,
  /\b(ugh|argh|aaaargh|damn|god|wtf)\b/i,
  /\b(useless|stupid|hate this|this sucks)\b/i,
  /\b(never mind|forget it|leave it|chhoddo|rehne do)\b/i,
];

// ─────────────────────────────────────────────────────────────
// Mastery / understanding patterns
// ─────────────────────────────────────────────────────────────
const MASTERY_PATTERNS: RegExp[] = [
  /\b(i (now )?understand|got it|makes sense|i see|oh i see|ah)\b/i,
  /\b(samajh gaya|samajh gayi|ab samajh|clear ho gaya|clear hua)\b/i,
  /\b(thanks|thank you|perfect|excellent|great explanation)\b/i,
  /\b(that('?s| is) (clear|helpful|great|perfect|good))\b/i,
  /\b(ok so|so basically|in other words)\b/i,
];

// ─────────────────────────────────────────────────────────────
// userStateInferenceEngine
// ─────────────────────────────────────────────────────────────
export const userStateInferenceEngine = {

  /**
   * infer — main entry point.
   * Analyzes all available signals and returns InferredUserState.
   */
  infer(signal: MessageSignal): InferredUserState {
    const { message, turnCount, retryCount, responseTimeMs, lastTopic, currentTopic } = signal;
    const inferredFrom: string[] = [];
    let confusionScore   = 0;
    let frustrationScore = 0;
    let masterySignal    = false;

    // ── 1. Message text analysis ──────────────────────────────
    const confusionMatches = CONFUSION_PATTERNS.filter(p => p.test(message)).length;
    if (confusionMatches > 0) {
      confusionScore += Math.min(0.6, confusionMatches * 0.20);
      inferredFrom.push(`confusion_text(×${confusionMatches})`);
    }

    const frustrationMatches = FRUSTRATION_PATTERNS.filter(p => p.test(message)).length;
    if (frustrationMatches > 0) {
      frustrationScore += Math.min(0.7, frustrationMatches * 0.25);
      inferredFrom.push(`frustration_text(×${frustrationMatches})`);
    }

    const masteryMatches = MASTERY_PATTERNS.filter(p => p.test(message)).length;
    if (masteryMatches > 0) {
      masterySignal = true;
      inferredFrom.push('mastery_signal');
      // Mastery reduces confusion
      confusionScore = Math.max(0, confusionScore - 0.3);
    }

    // ── 2. Response time → hesitation = confusion ─────────────
    if (responseTimeMs !== undefined) {
      if (responseTimeMs > 60_000) {  // > 1 min
        confusionScore += 0.15;
        inferredFrom.push('slow_response(hesitation)');
      } else if (responseTimeMs > 120_000) {  // > 2 min
        confusionScore += 0.25;
        inferredFrom.push('very_slow_response(confusion)');
      }
    }

    // ── 3. Retry count → persistent confusion ─────────────────
    if (retryCount >= 2) {
      confusionScore += Math.min(0.30, retryCount * 0.10);
      inferredFrom.push(`retry_count(${retryCount})`);
    }
    if (retryCount >= 4) {
      frustrationScore += 0.20;
      inferredFrom.push('high_retry(frustration)');
    }

    // ── 4. Same topic repeated → stuck ────────────────────────
    const isRepeatingTopic = Boolean(lastTopic && currentTopic && lastTopic === currentTopic);
    if (isRepeatingTopic) {
      confusionScore += 0.10;
      inferredFrom.push('same_topic_repeated');
    }

    // ── 5. Very short message with question mark = confusion ──
    if (message.trim().length < 20 && message.includes('?')) {
      confusionScore += 0.10;
      inferredFrom.push('short_question');
    }

    // ── 6. All caps → frustration ────────────────────────────
    const upperRatio = (message.match(/[A-Z]/g)?.length ?? 0) / Math.max(1, message.length);
    if (upperRatio > 0.5 && message.length > 5) {
      frustrationScore += 0.15;
      inferredFrom.push('all_caps');
    }

    // ── Normalize ────────────────────────────────────────────
    confusionScore   = Math.min(1, confusionScore);
    frustrationScore = Math.min(1, frustrationScore);

    // ── Derive emotion ────────────────────────────────────────
    const emotion = deriveEmotion(confusionScore, frustrationScore, masterySignal);

    // ── Derive cognitive load ─────────────────────────────────
    const cognitiveLoad = deriveCognitiveLoad(confusionScore, turnCount, retryCount);

    const state: InferredUserState = {
      emotion,
      cognitiveLoad,
      confusionScore,
      frustrationScore,
      masterySignal,
      needsReexplain:     confusionScore > 0.5 || retryCount >= 2,
      needsEncouragement: frustrationScore > 0.4 || retryCount >= 3,
      isRepeatingTopic,
      inferredFrom,
    };

    logger.debug(
      { emotion, confusionScore: confusionScore.toFixed(2), frustrationScore: frustrationScore.toFixed(2) },
      '[UserStateInference] State inferred'
    );

    return state;
  },

  /**
   * mergeWithFrontendSignals — if frontend sends comprehension data,
   * merge it with server inference (frontend wins on direct signals,
   * server inference fills gaps).
   */
  mergeWithFrontendSignals(
    inferred:           InferredUserState,
    frontendComprehension?: number,  // 0–100
    frontendCognitiveLoad?: string
  ): InferredUserState {
    if (frontendComprehension !== undefined) {
      // Frontend signal overrides text-based confusion for comprehension
      const fcScore = 1 - (frontendComprehension / 100);
      inferred.confusionScore = Math.max(inferred.confusionScore, fcScore * 0.5);
    }
    if (frontendCognitiveLoad) {
      inferred.cognitiveLoad = frontendCognitiveLoad as CognitiveLoad;
    }
    return inferred;
  },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function deriveEmotion(
  confusion:   number,
  frustration: number,
  mastery:     boolean
): InferredEmotion {
  if (mastery && confusion < 0.3)             return 'motivated';
  if (frustration > 0.5)                      return 'frustrated';
  if (confusion > 0.6)                        return 'confused';
  if (confusion > 0.4 && frustration > 0.3)   return 'overloaded';
  if (confusion > 0.3)                        return 'curious';
  return 'neutral';
}

function deriveCognitiveLoad(
  confusion:  number,
  turnCount:  number,
  retryCount: number
): CognitiveLoad {
  const load = confusion + (retryCount * 0.1) + (turnCount > 20 ? 0.2 : 0);
  if (load > 0.8) return 'overloaded';
  if (load > 0.55) return 'high';
  if (load > 0.3) return 'normal';
  return 'low';
}