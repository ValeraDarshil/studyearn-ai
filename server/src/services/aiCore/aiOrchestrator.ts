/**
 * AI Study OS — AI Orchestrator (Stage 5 Core)
 * ─────────────────────────────────────────────────────────────
 * Central controller that coordinates all AI systems.
 *
 * Flow:
 *   User Login / Action
 *       ↓
 *   studentStateManager.getState()    → detect student state
 *       ↓
 *   aiDecisionEngine.analyze()         → what needs to run?
 *       ↓
 *   aiTaskRouter.execute()             → run only what's needed
 *       ↓
 *   contextFusionEngine.fuse()         → merge all AI context
 *       ↓
 *   aiMemoryStore.commitOrchestrationSession()
 *
 * External consumers:
 *   - auth.ts              → triggerPostLoginOrchestration()
 *   - aiController.ts      → getFusedContextForAI()
 *   - progressRoutes.ts    → runAIOrchestration({ trigger: 'lesson_complete' })
 */

import { studentStateManager, StudentStateData, StudentState } from './studentStateManager.js';
import { aiDecisionEngine, OrchestratorDecision }              from './aiDecisionEngine.js';
import { aiTaskRouter }                                        from './aiTaskRouter.js';
import { contextFusionEngine, FusedAIContext }                 from './contextFusionEngine.js';
import { aiMemoryStore }                                       from './aiMemoryStore.js';
import { logger }                                              from '../../utils/logger.js';

// ── Types ──────────────────────────────────────────────────────

export type OrchestrationTrigger =
  | 'login'
  | 'lesson_complete'
  | 'quiz_complete'
  | 'ask_ai'
  | 'progress_check'
  | 'daily_cron'
  | 'manual';

export interface OrchestrationOptions {
  trigger:         OrchestrationTrigger;
  forceFullRun?:   boolean;
  backgroundMode?: boolean;
  contextOnly?:    boolean;
}

export interface OrchestrationResult {
  success:       boolean;
  userId:        string;
  studentState:  StudentState;
  decisions:     OrchestratorDecision[];
  tasksExecuted: string[];
  fusedContext:  FusedAIContext | null;
  executionMs:   number;
  errors:        string[];
  triggeredAt:   string;
}

// ── In-memory cache (5 min TTL) ────────────────────────────────
//
// BUG FIX 5 (v18): Added size cap + TTL eviction.
// Previously: orchestrationCache had no size limit and no automatic eviction.
// Only invalidateOrchestrationCache(userId) deleted entries — almost never
// called. At 10k active users this grew to ~50MB and never shrank.
//
// Fixed:
//   (1) Cache reads now check TTL and delete stale entries immediately.
//   (2) ORCH_CACHE_MAX_SIZE (2000) cap with FIFO eviction when exceeded.
//       Size chosen so 2k users × ~5KB each = ~10MB max RAM.
const orchestrationCache = new Map<string, { ts: number; result: OrchestrationResult }>();
const CACHE_TTL_MS       = 5 * 60 * 1000;
const ORCH_CACHE_MAX_SIZE = 2_000;

function orchCacheGet(userId: string): OrchestrationResult | null {
  const entry = orchestrationCache.get(userId);
  if (!entry) return null;
  // TTL eviction on read
  if (Date.now() - entry.ts >= CACHE_TTL_MS) {
    orchestrationCache.delete(userId);
    return null;
  }
  return entry.result;
}

function orchCacheSet(userId: string, result: OrchestrationResult): void {
  orchestrationCache.set(userId, { ts: Date.now(), result });
  // Size cap — evict oldest 200 entries when limit hit (FIFO)
  if (orchestrationCache.size > ORCH_CACHE_MAX_SIZE) {
    let evicted = 0;
    for (const k of orchestrationCache.keys()) {
      orchestrationCache.delete(k);
      if (++evicted >= 200) break;
    }
    logger.info(`[Orchestrator] Cache evicted 200 entries | size=${orchestrationCache.size}`);
  }
}

// ─────────────────────────────────────────────────────────────
// runAIOrchestration — Main Entry Point
// ─────────────────────────────────────────────────────────────
export async function runAIOrchestration(
  userId:  string,
  options: OrchestrationOptions
): Promise<OrchestrationResult> {

  const startTime = Date.now();
  const errors: string[] = [];

  logger.info({ userId, trigger: options.trigger }, '[Orchestrator] Starting orchestration');

  // Cache check (skip for login + forceFullRun)
  if (!options.forceFullRun && !options.backgroundMode && options.trigger !== 'login') {
    const cached = orchCacheGet(userId);
    if (cached) {
      logger.info({ userId }, '[Orchestrator] Cache hit — returning cached result');
      return cached;
    }
  }

  // Step 1: Get student state
  let stateData: StudentStateData;
  try {
    stateData = await studentStateManager.getState(userId);
    logger.info({ userId, state: stateData.currentState }, '[Orchestrator] State detected');
  } catch (err: any) {
    logger.error({ userId, err: err.message }, '[Orchestrator] State detection failed');
    errors.push(`state_error: ${err.message}`);
    return buildFailedResult(userId, 'EXPLORING', errors, startTime);
  }

  // Step 2: Generate decisions
  let decisions: OrchestratorDecision[] = [];
  try {
    decisions = await aiDecisionEngine.analyze({
      stateData,
      trigger:      options.trigger,
      forceFullRun: options.forceFullRun ?? false,
      contextOnly:  options.contextOnly ?? false,
    });
    logger.info({ userId, count: decisions.length }, '[Orchestrator] Decisions generated');
  } catch (err: any) {
    logger.error({ userId, err: err.message }, '[Orchestrator] Decision engine failed');
    errors.push(`decision_error: ${err.message}`);
  }

  // Step 3: Execute tasks
  let tasksExecuted: string[] = [];
  try {
    if (options.backgroundMode) {
      aiTaskRouter.executeBackground(userId, decisions).catch((err: any) => {
        logger.error({ userId, err: err.message }, '[Orchestrator] Background tasks error');
      });
      tasksExecuted = decisions.map(d => `${d.action}:queued`);
    } else {
      tasksExecuted = await aiTaskRouter.execute(userId, decisions);
      logger.info({ userId, tasksExecuted }, '[Orchestrator] Tasks complete');
    }
  } catch (err: any) {
    logger.error({ userId, err: err.message }, '[Orchestrator] Task router failed');
    errors.push(`task_error: ${err.message}`);
  }

  // Step 4: Fuse context (always — critical for AskAI)
  let fusedContext: FusedAIContext | null = null;
  try {
    fusedContext = await contextFusionEngine.fuse(userId, stateData);
    logger.info({ userId }, '[Orchestrator] Context fusion complete');
  } catch (err: any) {
    logger.error({ userId, err: err.message }, '[Orchestrator] Context fusion failed');
    errors.push(`context_error: ${err.message}`);
  }

  // Step 5: Commit to memory
  try {
    await aiMemoryStore.commitOrchestrationSession(userId, {
      trigger:      options.trigger,
      studentState: stateData.currentState,
      decisions:    decisions.map(d => d.action),
      timestamp:    new Date().toISOString(),
    });
  } catch (err: any) {
    logger.warn({ userId, err: err.message }, '[Orchestrator] Memory commit failed (non-fatal)');
  }

  const result: OrchestrationResult = {
    success:       errors.length === 0,
    userId,
    studentState:  stateData.currentState,
    decisions,
    tasksExecuted,
    fusedContext,
    executionMs:   Date.now() - startTime,
    errors,
    triggeredAt:   new Date().toISOString(),
  };

  orchCacheSet(userId, result);

  logger.info(
    { userId, ms: result.executionMs, tasks: tasksExecuted.length, success: result.success },
    '[Orchestrator] Orchestration complete'
  );

  return result;
}

// ─────────────────────────────────────────────────────────────
// getFusedContextForAI — Lightweight helper for aiController
// ─────────────────────────────────────────────────────────────
export async function getFusedContextForAI(userId: string): Promise<FusedAIContext | null> {
  try {
    const cached = orchCacheGet(userId);
    if (cached && cached.fusedContext) {
      return cached.fusedContext;
    }
    const result = await runAIOrchestration(userId, { trigger: 'ask_ai', contextOnly: true });
    return result.fusedContext;
  } catch (err: any) {
    logger.error({ userId, err: err.message }, '[Orchestrator] getFusedContextForAI failed');
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// triggerPostLoginOrchestration — Non-blocking, call after login
// ─────────────────────────────────────────────────────────────
export function triggerPostLoginOrchestration(userId: string): void {
  logger.info({ userId }, '[Orchestrator] Post-login orchestration triggered (background)');
  runAIOrchestration(userId, {
    trigger:        'login',
    backgroundMode: true,
    forceFullRun:   true,
  }).catch((err: any) => {
    logger.error({ userId, err: err.message }, '[Orchestrator] Post-login failed silently');
  });
}

// ─────────────────────────────────────────────────────────────
// invalidateCache — Force fresh run on next call
// ─────────────────────────────────────────────────────────────
export function invalidateOrchestrationCache(userId: string): void {
  orchestrationCache.delete(userId);
}

// ── Internal ───────────────────────────────────────────────────
function buildFailedResult(
  userId:    string,
  state:     StudentState,
  errors:    string[],
  startTime: number
): OrchestrationResult {
  return {
    success: false, userId, studentState: state,
    decisions: [], tasksExecuted: [], fusedContext: null,
    executionMs: Date.now() - startTime, errors,
    triggeredAt: new Date().toISOString(),
  };
}