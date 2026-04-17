/**
 * AI Study OS — Adaptive Intelligence Module  (index)
 * ─────────────────────────────────────────────────────────────
 * Single import point for all 8 new adaptive systems.
 *
 * Usage:
 *   import { aiBrainCore, feedbackLoopEngine, ... } from '../adaptive/index.js';
 *
 * Files in this directory:
 *   strategyScoringEngine.ts    → GAP 1: adaptive strategy selection
 *   longTermMemoryEngine.ts     → GAP 2: persistent student memory
 *   memoryRetrievalEngine.ts    → GAP 2b: relevant-first memory retrieval
 *   userStateInferenceEngine.ts → GAP 3: server-side emotion/confusion detection
 *   feedbackLoopEngine.ts       → GAP 4: outcome detection + loop closure
 *   modelPerformanceTracker.ts  → GAP 5: persistent model routing stats
 *   teachingLoopEngine.ts       → GAP 6: iterative teach→check→retry loop
 *   aiBrainCore.ts              → GAP 7: central orchestrator brain
 *   metricsEngine.ts            → GAP 8: learning metrics + optimization
 */

export { strategyScoringEngine }                          from './strategyScoringEngine.js';
export type { TeachingStrategy, StrategyScore, ScoringContext } from './strategyScoringEngine.js';

export { longTermMemoryEngine }                           from './longTermMemoryEngine.js';
export type { LongTermMemory, MistakeRecord, ConceptStrength } from './longTermMemoryEngine.js';

export { memoryRetrievalEngine }                          from './memoryRetrievalEngine.js';
export type { RetrievalResult, RetrievedMemoryItem }      from './memoryRetrievalEngine.js';

export { userStateInferenceEngine }                       from './userStateInferenceEngine.js';
export type { InferredUserState, InferredEmotion, CognitiveLoad } from './userStateInferenceEngine.js';

export { feedbackLoopEngine, learningOutcomeTracker }     from './feedbackLoopEngine.js';
export type { FeedbackInput, FeedbackResult, OutcomeType } from './feedbackLoopEngine.js';

export { modelPerformanceTracker }                        from './modelPerformanceTracker.js';
export type { RoutingDecision, ComplexityTier }           from './modelPerformanceTracker.js';

export { teachingLoopEngine, answerEvaluator }            from './teachingLoopEngine.js';
export type { TeachingPhase, TeachingLoopState, LoopAdvanceResult } from './teachingLoopEngine.js';

export { aiBrainCore }                                    from './aiBrainCore.js';
export type { BrainInput, FinalDecision }                 from './aiBrainCore.js';

export { metricsEngine, optimizationEngine }              from './metricsEngine.js';
export type { LearningMetrics, OptimizationOutput }       from './metricsEngine.js';