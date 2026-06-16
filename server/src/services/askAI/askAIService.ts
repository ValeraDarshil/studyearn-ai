// // ─────────────────────────────────────────────────────────────
// // AskAI — askAIService.ts  (v15 — CENTRALIZED AI BRAIN CORE)
// //
// // ARCHITECTURE CHANGE (v14 → v15):
// //
// //   v14: aiBrainCore.process() was called in Step 0 but its output
// //        was advisory. buildResponsePlan() ran independently after it
// //        and could contradict Brain Core's strategy. Two decision
// //        systems ran in parallel with no clear authority.
// //
// //   v15: aiBrainCore.processRequest() is THE ONLY decision maker.
// //        - FinalDecision drives: strategy, tone, difficulty, model
// //        - buildResponsePlanFromDecision() converts it to ResponsePlan
// //          (execution format for prompt builders) — no independent logic
// //        - buildResponsePlan() only runs as a fallback if Brain Core fails
// //        - All scattered if/else strategy logic removed from this file
// //        - Feedback loop wired: afterResponse() calls Brain Core post-stream
// //
// // NEW CONTROL FLOW:
// //
// //   User Input
// //       ↓
// //   aiBrainCore.processRequest()   ← single decision authority
// //       ↓ FinalDecision
// //   buildResponsePlanFromDecision() ← execution conversion only
// //       ↓ ResponsePlan
// //   buildMasterPrompt()            ← prompt assembly only
// //       ↓ systemPrompt
// //   solveTextStreamWithContext()   ← AI generation
// //       ↓ response
// //   aiBrainCore.afterResponse()   ← feedback + memory update
// //
// // All v14 exports preserved. Backward compatible.
// // ─────────────────────────────────────────────────────────────

// import { addMessage } from './conversationMemoryEngine.js';

// import {
//   buildResponsePlan,
//   buildResponsePlanFromDecision,
//   type ResponsePlan,
//   detectIntent,
// } from './aiResponsePlanner.js';

// import {
//   buildDifficultyInstruction,
//   getResponseStyleNote,
//   detectSkillLevelFromMessage,
//   type SkillLevel,
// } from './difficultyAdapter.js';

// import {
//   buildTeachingInstruction,
//   buildFollowUpInstruction,
//   buildConfidenceBoost,
//   buildCorrectionInstruction,
// } from './mentorTeachingMode.js';

// import {
//   buildPersonalityBlock,
//   inferPersonality,
//   getPersonalityPostProcessNote,
// } from './aiPersonalityEngine.js';

// import {
//   routeToModel,
//   getModelNote,
//   recordQualityPenalty,
//   recordModelSuccess,
//   recordModelFailure,
//   type RouterContextSignals,
// } from './aiModelRouter.js';

// import {
//   validateResponse,
//   getQualityLabel,
//   type ValidationResult,
// } from './responseValidator.js';

// import {
//   buildEnhancedContext,
//   type EnhancedContext,
// } from './contextEnhancer.js';

// import { logger }            from '../../utils/logger.js';
// import { StudentProfile }    from '../../models/StudentProfile.model.js';

// // ── v15: AI Brain Core — single decision authority ────────────
// import { aiBrainCore, type FinalDecision }       from '../adaptive/aiBrainCore.js';
// import { modelPerformanceTracker }                from '../adaptive/modelPerformanceTracker.js';
// import { userStateInferenceEngine }               from '../adaptive/userStateInferenceEngine.js';

// // ─────────────────────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────────────────────
// export interface AskAIServiceInput {
//   userId:      string;
//   sessionId?:  string;
//   message:     string;
//   subjectMode: string;
//   stepByStep:  boolean;
//   history?:    { role: 'user' | 'assistant'; content: string }[];
//   persistentWeakTopics?: string[];
//   dbSessionSummary?:     string;
//   // v13: Gap #1+#2 — frontend live intelligence
//   smartMemoryContext?:      string;
//   comprehensionContext?:    string;
//   adaptiveHint?:            string;
//   // v14: Gap #3+#4
//   teachingContext?:         string;
//   personalizationContext?:  string;
//   // Adaptive brain fields
//   prevAiResponse?:      string | null;
//   prevStrategy?:        string | null;
//   masteryLevel?:        number;
//   currentState?:        string;
//   retryCount?:          number;
//   responseTimeMs?:      number;
// }

// export interface AskAIPromptPackage {
//   systemPrompt:  string;
//   history:       { role: 'user' | 'assistant'; content: string }[];
//   userMessage:   string;
//   modelConfig:   ReturnType<typeof routeToModel>;
//   plan:          ResponsePlan;
//   context:       EnhancedContext;
//   detectedTopic: string | null;
//   // v15: FinalDecision replaces brainOutput — single authority
//   finalDecision: FinalDecision | null;
//   // v14 backward-compat alias
//   brainOutput:   FinalDecision | null;
// }

// // ─────────────────────────────────────────────────────────────
// // buildMasterPrompt — Main export
// //
// // CONTROL FLOW (v15):
// //   1. aiBrainCore.processRequest()  → FinalDecision (authority)
// //   2. buildResponsePlanFromDecision() → ResponsePlan (execution format)
// //   3. routeToModel() using FinalDecision.modelDecision (no independent routing)
// //   4. Build system prompt using FinalDecision for all adaptive signals
// // ─────────────────────────────────────────────────────────────
// export async function buildMasterPrompt(
//   input: AskAIServiceInput,
// ): Promise<AskAIPromptPackage> {

//   const {
//     userId,
//     message,
//     subjectMode,
//     stepByStep,
//     persistentWeakTopics = [],
//     dbSessionSummary     = '',
//   } = input;

//   const sessionId        = input.sessionId    ?? 'unknown';
//   const currentState     = input.currentState ?? 'LEARNING';
//   const retryCount       = input.retryCount   ?? 0;
//   const currentTurnCount = input.history?.length ?? 0;

//   // ── STEP 1: Fetch context + mastery in parallel BEFORE brain call ──
//   // masteryLevel must be resolved from DB before aiBrainCore.processRequest()
//   // so Brain Core receives the real value, not the hardcoded 50 default.
//   const frontendIntel = {
//     smartMemoryContext:     input.smartMemoryContext,
//     comprehensionContext:   input.comprehensionContext,
//     adaptiveHint:           input.adaptiveHint,
//     teachingContext:        input.teachingContext,
//     personalizationContext: input.personalizationContext,
//   };

//   const [contextResult, masteryResult] = await Promise.allSettled([
//     buildEnhancedContext(userId, message, frontendIntel),
//     StudentProfile.findOne({ userId }).select('overallMasteryScore').lean(),
//   ]);

//   let context: EnhancedContext;
//   if (contextResult.status === 'fulfilled') {
//     context = contextResult.value;
//   } else {
//     const fallbackLevel = detectSkillLevelFromMessage(message);
//     context = {
//       skillLevel:     fallbackLevel,
//       weakTopics:     [],
//       strongTopics:   [],
//       currentGoal:    '',
//       learningState:  'unknown',
//       recentActivity: '',
//       sessionSummary: '',
//       contextBlock:   `Student Level: ${fallbackLevel.toUpperCase()}`,
//     };
//   }

//   if (masteryResult.status === 'rejected') {
//     logger.warn({ userId, err: (masteryResult.reason as any)?.message }, '[AskAIService] StudentProfile mastery fetch failed — using fallback');
//   }
//   const dbMastery =
//     masteryResult.status === 'fulfilled' && masteryResult.value?.overallMasteryScore != null
//       ? masteryResult.value.overallMasteryScore
//       : null;
//   const masteryLevel = input.masteryLevel ?? dbMastery ?? 50;

//   // ── STEP 2: AI Brain Core — SINGLE DECISION AUTHORITY ────────
//   // Brain now receives the real masteryLevel from DB.
//   //
//   let finalDecision: FinalDecision | null = null;
//   try {
//     finalDecision = await aiBrainCore.processRequest({
//       userId,
//       sessionId,
//       userMessage:     message,
//       prevAiResponse:  input.prevAiResponse ?? null,
//       prevStrategy:    (input.prevStrategy ?? null) as any,
//       topic:           detectTopic(message, subjectMode),
//       subject:         subjectMode,
//       turnCount:       currentTurnCount,
//       retryCount,
//       masteryLevel,
//       currentState,
//       responseTimeMs:  input.responseTimeMs,
//       frontendComprehension: parseComprehensionRate(input.comprehensionContext),
//       frontendCognitiveLoad: parseCognitiveLoad(input.personalizationContext),
//     });
//   } catch (err: any) {
//     logger.warn({ userId, err: err.message }, '[AskAIService v15] Brain Core failed — using legacy fallback');
//   }

//   const skillLevel: SkillLevel = context.skillLevel ?? detectSkillLevelFromMessage(message);

//   // ── STEP 3: Build ResponsePlan FROM FinalDecision (execution only) ──
//   //
//   // WHEN finalDecision is available: buildResponsePlanFromDecision()
//   //   — reads FinalDecision, makes zero new decisions
//   //
//   // WHEN finalDecision is null (Brain Core failed): buildResponsePlan()
//   //   — legacy fallback only, clearly logged
//   //
//   let plan: ResponsePlan;

//   if (finalDecision) {
//     // PRIMARY PATH: Brain Core authority
//     plan = buildResponsePlanFromDecision(message, finalDecision, currentTurnCount, stepByStep);
//   } else {
//     // FALLBACK PATH: Brain Core failed — legacy planner
//     const allWeakTopics = [
//       ...new Set([...persistentWeakTopics, ...context.weakTopics]),
//     ].slice(0, 10);

//     const inferred = userStateInferenceEngine.infer({
//       message, turnCount: currentTurnCount, retryCount,
//       responseTimeMs: input.responseTimeMs,
//     });

//     const compMatch  = input.comprehensionContext?.match(/(\d+)%/);
//     const reMatch    = input.comprehensionContext?.match(/(\d+) re-explained/);
//     const streakMatch = input.comprehensionContext?.match(/(\d+)-question understanding streak/);
//     const phaseMatch = input.teachingContext?.match(/TEACHING PHASE:\s*(\w+)/i);
//     const loadMatch  = input.personalizationContext?.match(/overloaded|high|low|normal/i);
//     const styleMatch = input.personalizationContext?.match(/beginner|real.?world|future/i);
//     const densityMatch = input.personalizationContext?.match(/brief|detailed/i);

//     plan = buildResponsePlan(message, skillLevel, allWeakTopics, currentTurnCount, {
//       comprehensionRate:  compMatch   ? parseInt(compMatch[1])   : (inferred.confusionScore > 0.5 ? 30 : undefined),
//       reexplainRate:      reMatch     ? parseInt(reMatch[1])     : (retryCount >= 2 ? 60 : undefined),
//       sessionStreak:      streakMatch ? parseInt(streakMatch[1]) : undefined,
//       topWeakTopics:      allWeakTopics.slice(0, 3),
//       teachingPhase:      phaseMatch  ? phaseMatch[1].toLowerCase() : undefined,
//       cognitiveLoad:      loadMatch   ? loadMatch[0].toLowerCase()  : inferred.cognitiveLoad,
//       learningStyle:      styleMatch  ? styleMatch[0].toLowerCase().replace('-', '_') : undefined,
//       responseDensity:    densityMatch ? densityMatch[0].toLowerCase() : undefined,
//     });
//     plan.turnCount = currentTurnCount;
//   }

//   // ── STEP 4: Model Config — Brain Core preference takes precedence ──
//   //
//   // When finalDecision is available: use its modelDecision (Brain Core chose this).
//   // routeToModel() is called for its return type shape, but modelId is overridden.
//   //
//   const routerSignals: RouterContextSignals = {
//     comprehensionRate: parseComprehensionRate(input.comprehensionContext),
//     cognitiveLoad:     parseCognitiveLoad(input.personalizationContext) as any,
//   };
//   let modelConfig = routeToModel(
//     plan.intent,
//     subjectMode,
//     skillLevel,
//     message.length,
//     'text',
//     routerSignals,
//   );

//   // Override with Brain Core's model decision when available
//   if (finalDecision?.modelDecision) {
//     modelConfig = {
//       ...modelConfig,
//       modelId:  finalDecision.modelDecision.modelId,
//       provider: finalDecision.modelDecision.provider ?? modelConfig.provider,
//     } as typeof modelConfig;
//   }

//   // ── STEP 5: Weak topics — merge all sources ────────────────
//   const brainWeakTopics  = finalDecision?.weakTopics   ?? [];
//   const brainStrongTopics = finalDecision?.strongTopics ?? [];
//   const allWeakTopics = [
//     ...new Set([...persistentWeakTopics, ...context.weakTopics, ...brainWeakTopics]),
//   ].slice(0, 10);

//   // ── STEP 6: Topic detection ────────────────────────────────
//   const detectedTopic = detectTopic(message, subjectMode);

//   // ── STEP 7: Personality (style-only — does not affect strategy) ──
//   const personality  = inferPersonality(message);
//   const isFirstTurn  = currentTurnCount === 0;

//   // ── STEP 8: Mood signals (for prompt tone — Brain Core is already aware) ──
//   const msgLower = message.toLowerCase();
//   const isUrgentMode   = /jaldi|fast|quick|exam|test kal|aaj exam|time nahi|hurry|asap/.test(msgLower)
//     || finalDecision?.tone === 'urgent';
//   const isConfusedMode = /samajh nahi|nahi samajh|confused|not getting|phir se|dubara/.test(msgLower)
//     || finalDecision?.inferredState.emotion === 'confused';
//   const isGeneral = /trend|news|world|latest|kya chal raha|general|current/.test(msgLower) && !detectedTopic;

//   const wantsQuick    = /quick|jaldi|short|brief|summary|tldr|tl;dr|concise|2 lines|ek line/.test(msgLower);
//   const wantsDetailed = /detail|explain properly|poora|complete|full|in depth|deeply|thoroughly/.test(msgLower);

//   // Difficulty level source: Brain Core first, context fallback
//   const effectiveDifficulty = finalDecision?.difficultyLevel ?? skillLevel;
//   const responseLengthNote = wantsQuick
//     ? '\nRESPONSE LENGTH: Student wants a QUICK answer. Max 4-5 lines. No headers, no long examples. Sharp and direct.'
//     : wantsDetailed
//     ? '\nRESPONSE LENGTH: Student wants a DETAILED explanation. Use full structure, multiple examples, comprehensive coverage.'
//     : plan.strategy === 'SHORT'
//     ? '\nRESPONSE LENGTH: Keep it short — 2-3 sentences unless a brief example is essential.'
//     : '';

//   // ── STEP 9: Build System Prompt ───────────────────────────────
//   //
//   // FinalDecision.systemPromptAddition is the primary adaptive signal.
//   // All other sections are structural/personality/subject-mode layers.
//   //
//   const sections: string[] = [

//     // A) IDENTITY
//     `You are AskAI — an intelligent academic companion. NOT a chatbot. NOT a search engine.\nYou are calm, sharp, and deeply aware of this student's learning journey.\nYou remember their past struggles. You notice their growth. You adapt to their mood.\nYour tone: warm and encouraging, never robotic. Like a brilliant senior who genuinely cares.`,

//     // B) CONTEXT BLOCK (data layer — from contextEnhancer)
//     context.contextBlock,

//     // B2) BRAIN CORE DECISION BLOCK (authoritative adaptive signal)
//     // This contains: strategy directive, tone, difficulty, memory, weak topics
//     // Everything Brain Core decided in one clean block.
//     finalDecision?.systemPromptAddition
//       ? `\n=== AI BRAIN CORE DIRECTIVES (follow these precisely) ===\n${finalDecision.systemPromptAddition}\n=== END DIRECTIVES ===`
//       : '',

//     // C) DB SESSION MEMORY (cross-session intelligence)
//     dbSessionSummary
//       ? `\n=== 🧠 STUDENT'S LEARNING MEMORY (cross-session intelligence) ===\n${dbSessionSummary}\n\nMEMORY SURPRISE RULES:\n- If today's question relates to a past struggle topic → naturally reference it.\n  Example: \"Last time you were working on recursion and base cases gave you trouble — this concept connects directly to that!\"\n- If student asks something you've covered before → acknowledge it warmly.\n  Example: \"You've actually asked about this before — let's build on what you already know 🎯\"\n- Keep memory references natural and brief — don't force them if irrelevant.\n- Once every 5-6 exchanges, show a GROWTH MIRROR observation:\n  E.g., \"I notice you're asking more conceptual questions now — your understanding is clearly deepening 📈\"`
//       : '',

//     // D) MOOD-BASED TONE SHIFT (supplements Brain Core tone directive)
//     isUrgentMode
//       ? `\n⚡ EXAM MODE DETECTED: Student needs info FAST.\n- Skip the intro fluff. Go straight to the key points.\n- Format: \"Fast track version 👇\" then 3 bullet points MAX.\n- End with: \"This is the exam-important part — don't forget this!\"`
//       : isConfusedMode
//       ? `\n💙 CONFUSION DETECTED: Student is struggling.\n- Don't start with theory. Start with the SIMPLEST daily-life example possible.\n- Say: \"Koi baat nahi — let's start fresh with something super simple 😊\"\n- Use everyday Indian analogies (chai, cricket, mobile recharge, etc.)\n- Be extra patient. Break it into the tiniest possible steps.`
//       : '',

//     // E) GENERAL TOPIC → LEARNING BRIDGE
//     isGeneral
//       ? `\n🌍 GENERAL QUESTION BRIDGE:\nWhen answering general/trending topics, always end with a personalized learning bridge:\nExample: \"Globally, AI, crypto, and climate tech are trending. Based on what you've been studying, [topic] is especially relevant to your future — want me to connect it to what you already know? 🎯\"\nMake it feel personal, not generic.`
//       : '',

//     // F) INSTRUCTION LAYER
//     '\n=== HOW TO RESPOND ===',
//     'Before answering, internally:',
//     '1. Check the student\'s mood signal (urgent/confused/motivated/general)',
//     '2. Check memory — have they struggled with this topic before?',
//     '3. Check if this is a repeat question — if so, reference the previous discussion',
//     '4. Decide response length (short prompt = concise answer, detail prompt = full answer)',
//     '5. Think step by step before giving the final answer',

//     // G) DIFFICULTY ADAPTER (uses Brain Core difficulty level)
//     '\n' + buildDifficultyInstruction(effectiveDifficulty as SkillLevel),
//     responseLengthNote,
//     getResponseStyleNote(effectiveDifficulty as SkillLevel, allWeakTopics.length > 0),
//     plan.useAnalogy
//       ? '\nANALOGY REQUIRED: Use a real-world analogy for this explanation. Student learns better with concrete examples from daily life.'
//       : '',
//     plan.emphasizeEncourage
//       ? '\nENCOURAGEMENT REQUIRED: Student is struggling. Start with a warm, encouraging opening before explaining. Make them feel capable.'
//       : '',
//     plan.keepShort
//       ? '\nRESPONSE LENGTH: Keep very concise — student prefers brief answers right now.'
//       : '',
//     plan.adaptationReason
//       ? `\n[AI-OS: strategy adapted because: ${plan.adaptationReason}]`
//       : '',

//     // H) TEACHING MODE (execution — reads plan.strategy from Brain Core)
//     buildTeachingInstruction(plan.strategy),

//     // I) FOLLOW-UP + CONFIDENCE + CORRECTION
//     buildFollowUpInstruction(plan.followUpQuestion, detectedTopic ?? undefined),
//     buildConfidenceBoost(plan.boostConfidence, isFirstTurn),
//     buildCorrectionInstruction(plan.correctGently),

//     // J) PERSONALITY POST-PROCESS (style layer — never overrides strategy)
//     getPersonalityPostProcessNote(personality, isFirstTurn, plan.correctGently),

//     // K) SUBJECT MODE
//     subjectMode === 'math'
//       ? '\nMATH: Show formula → substitution → every step → boxed final answer.'
//       : subjectMode === 'coding'
//       ? '\nCODING: Provide complete runnable code. Comment each section. Show expected output.'
//       : subjectMode === 'science'
//       ? '\nSCIENCE: State law/principle → formula with units → worked example.'
//       : '',

//     // L) MODEL NOTE
//     '\n' + getModelNote(modelConfig),

//     // M) MANDATORY RESPONSE STRUCTURE
//     plan.strategy !== 'QUIZ' && plan.strategy !== 'SHORT' && !isUrgentMode ? `

// === MANDATORY RESPONSE STRUCTURE (follow EVERY time) ===

// ${wantsDetailed || (!wantsQuick) ? `
// 1. 📖 EXPLANATION
//    - Start with the core concept in 1-2 simple sentences
//    - Match complexity to student's level (${effectiveDifficulty})
//    - Use a real-world analogy (preferably relatable to Indian students)

// 2. 💡 EXAMPLE
//    - Give exactly 1 concrete, memorable example
//    - For math/coding: show the complete worked solution step by step

// 3. ⚡ QUICK SUMMARY
//    - Exactly 2-3 lines summing up the key takeaway
//    - Something they can recall in an exam 1 week from now
// ` : ''}

// 4. 🔥 MICRO-LEARNING HOOK (NEVER skip)
//    - After your answer, add 1 sentence that sparks curiosity for the NEXT concept.
//    - Format: "**Bonus curiosity:** If you understood [topic], the next interesting thing to explore is [related concept] — it'll blow your mind! 🚀"
//    - Keep it SHORT — 1 sentence only. Make it irresistible.

// 5. ❓ AI-INITIATED QUESTION (NEVER skip)
//    - End with 1 smart question that drives the conversation forward.
//    - Format: "**Quick check:** [your question here]"

// ═══════════════════════════════════════════════════════
// ABSOLUTE RULES:
// - ALWAYS end with "**Quick check:**" — NO exceptions
// - Response to student's own answer:
//   ✓ Correct → "Nice! 🔥 You got it!" + show next micro-learning hook
//   ✗ Wrong   → "Almost! The key thing is..." (warm, build on what they got right)
//   ? Confused → "Koi baat nahi 😊 Let's try a completely different angle..."
//   ↩ Re-explain → Give same concept with NEW analogy, mention their learning pattern
// - For "**Samajh aaya 👍**" response: celebrate briefly, then offer next level
// - For "**Dubara samjhao**" response: pick a DIFFERENT approach, mention you noticed this topic is challenging
// ═══════════════════════════════════════════════════════
// ` : plan.strategy === 'QUIZ' ? '' :
//     '\nEven in short mode: end with ONE brief question to keep the conversation going. Format: "**Quick check:** [question]"',
//   ];

//   const systemPrompt = sections.filter(Boolean).join('\n');
//   const history = (input.history ?? []).slice(-20);

//   logger.info(
//     'AskAI v15 prompt | intent='   + plan.intent +
//     ' strategy='    + plan.strategy +
//     ' skill='       + effectiveDifficulty +
//     ' model='       + modelConfig.modelId +
//     ' history='     + history.length + 'msgs' +
//     ' weakDB='      + persistentWeakTopics.length +
//     ' turns='       + currentTurnCount +
//     ' adapted='     + (plan.adaptationReason ?? 'none') +
//     ' emotion='     + (finalDecision?.inferredState.emotion ?? 'none') +
//     ' brainCore='   + (finalDecision ? 'v2-authority' : 'fallback'),
//   );

//   return {
//     systemPrompt,
//     history,
//     userMessage:   message,
//     modelConfig,
//     plan,
//     context,
//     detectedTopic,
//     finalDecision,
//     brainOutput:   finalDecision,  // backward-compat alias
//   };
// }

// // ─────────────────────────────────────────────────────────────
// // validateAndLog (preserved from v14)
// // ─────────────────────────────────────────────────────────────
// export function validateAndLog(
//   aiResponse: string,
//   intent:     string,
//   userPrompt: string,
//   userId:     string,
// ): ValidationResult {
//   const result = validateResponse(aiResponse, intent, userPrompt);
//   const label  = getQualityLabel(result);

//   logger.info(
//     `AskAI response | quality=${label} score=${result.score} ` +
//     `length=${aiResponse.length} userId=${userId}`,
//   );

//   return result;
// }

// // ─────────────────────────────────────────────────────────────
// // Model tracking helpers — exported for controller use
// // ─────────────────────────────────────────────────────────────
// export function trackModelSuccess(modelId: string, latencyMs: number): void {
//   try {
//     recordModelSuccess(modelId, latencyMs);
//     modelPerformanceTracker.recordSuccess(modelId, latencyMs);
//   } catch {
//     // non-fatal
//   }
// }

// export function trackModelFailure(modelId: string, reason: string = 'unknown'): void {
//   try {
//     recordModelFailure(modelId);
//     modelPerformanceTracker.recordFailure(modelId, reason);
//   } catch {
//     // non-fatal
//   }
// }

// export function trackModelQualityIssue(modelId: string, severity: number = 1): void {
//   try {
//     recordQualityPenalty(modelId, severity);
//     modelPerformanceTracker.recordQualityIssue(modelId, severity);
//   } catch {
//     // non-fatal
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // Topic detection (preserved from v14)
// // ─────────────────────────────────────────────────────────────
// function detectTopic(message: string, subjectMode: string): string | null {
//   const lower = message.toLowerCase();
//   const TOPIC_MAP: Record<string, string[]> = {
//     'algebra':         ['algebra', 'equation', 'variable', 'polynomial'],
//     'calculus':        ['calculus', 'derivative', 'integral', 'differentiation'],
//     'physics':         ['force', 'motion', 'velocity', 'acceleration', 'newton'],
//     'chemistry':       ['atom', 'molecule', 'bond', 'reaction', 'element'],
//     'programming':     ['code', 'function', 'loop', 'array', 'variable', 'algorithm'],
//     'data structures': ['stack', 'queue', 'tree', 'graph', 'linked list', 'hash'],
//   };
//   for (const [topic, keywords] of Object.entries(TOPIC_MAP)) {
//     if (keywords.some(k => lower.includes(k))) return topic;
//   }
//   if (subjectMode !== 'auto' && subjectMode) return subjectMode;
//   return null;
// }

// // ─────────────────────────────────────────────────────────────
// // Parse frontend signal helpers (preserved from v14)
// // ─────────────────────────────────────────────────────────────
// function parseComprehensionRate(ctx?: string): number | undefined {
//   const match = ctx?.match(/(\d+)%/);
//   return match ? parseInt(match[1]) : undefined;
// }

// function parseCognitiveLoad(ctx?: string): string | undefined {
//   const match = ctx?.match(/overloaded|high|low|normal/i);
//   return match ? match[0].toLowerCase() : undefined;
// }

// // ─────────────────────────────────────────────────────────────
// // detectEmotionalState — re-exported for aiController.ts
// // Preserved exactly from v14
// // ─────────────────────────────────────────────────────────────
// export function detectEmotionalState(
//   userMessage: string,
//   turnCount:   number,
// ): 'correct' | 'confused' | 'frustrated' | 'motivated' | 'neutral' {
//   const msg = userMessage.toLowerCase().trim();

//   if (/\b(got it|makes sense|i understand|clear hai|samajh gaya|samajh gayi|oh i see|that makes sense|i get it|achha|accha|ohh|ahhh|right right|yes exactly|bilkul|haan samajh|ab samajh|got this)\b/.test(msg)) {
//     return 'correct';
//   }
//   if (/\b(don'?t understand|confused|not clear|samajh nahi|kya matlab|phir se|not getting|what do you mean|explain again|dubara|didn'?t get|unclear|ye kya hai|yeh kya|pata nahi|nahi pata|kuch nahi samajha)\b/.test(msg)) {
//     return 'confused';
//   }
//   if (/\b(why is this so|this is hard|too difficult|giving up|i can'?t|can'?t do this|impossible|ugh|argh|frustrat|bahut mushkil|nahi ho raha|nahi samajh|ye toh bahut|yaar kuch nahi|pakka nahi hoga)\b/.test(msg)) {
//     return 'frustrated';
//   }
//   if (/\b(amazing|awesome|great|love this|this is cool|interesting|wow|wah|mast|bahut accha|nice|let'?s go|let me try|i want to|and then|what about|tell me more|aur batao|aage batao|next)\b/.test(msg)) {
//     return 'motivated';
//   }
//   if (turnCount === 0) return 'neutral';
//   return 'neutral';
// }

// // ─────────────────────────────────────────────────────────────
// // afterResponse — re-exported for aiController.ts + askAIController.ts
// // Updates in-session RAM memory for contextEnhancer Layer 3.
// // v15: Also wires Brain Core afterResponse for teaching loop + memory update.
// // ─────────────────────────────────────────────────────────────
// export function afterResponse(
//   userId:      string,
//   userMessage: string,
//   aiResponse:  string,
//   topic?:      string | null,
// ): void {
//   try {
//     addMessage(userId, 'user',      userMessage, topic ?? undefined);
//     addMessage(userId, 'assistant', aiResponse,  topic ?? undefined);
//   } catch (e: any) {
//     logger.warn('afterResponse RAM update failed: ' + (e as any).message);
//   }
// }

// /**
//  * afterResponseWithBrain — enhanced afterResponse that also updates
//  * Brain Core's teaching loop and strategy scores.
//  *
//  * Call this instead of afterResponse() when you have a finalDecision available.
//  * Backward compatible — falls back to RAM-only update if params missing.
//  */
// export async function afterResponseWithBrain(
//   userId:        string,
//   sessionId:     string,
//   userMessage:   string,
//   aiResponse:    string,
//   topic:         string | null,
//   subject:       string,
//   turnCount:     number,
//   retryCount:    number,
//   finalDecision: FinalDecision | null,
//   outcome?:      { success: boolean; correctness?: number },
// ): Promise<void> {
//   // RAM memory update (always)
//   afterResponse(userId, userMessage, aiResponse, topic);

//   // Brain Core update (when finalDecision available)
//   if (finalDecision) {
//     try {
//       await aiBrainCore.afterResponse(
//         userId, sessionId, userMessage, aiResponse,
//         finalDecision, topic, subject, turnCount, retryCount, outcome,
//       );
//     } catch (err: any) {
//       logger.warn({ userId, err: err.message }, '[AskAIService v15] Brain Core afterResponse failed (non-fatal)');
//     }
//   }
// }

// ─────────────────────────────────────────────────────────────
// AskAI — askAIService.ts  (v15 — CENTRALIZED AI BRAIN CORE)
//
// ARCHITECTURE CHANGE (v14 → v15):
//
//   v14: aiBrainCore.process() was called in Step 0 but its output
//        was advisory. buildResponsePlan() ran independently after it
//        and could contradict Brain Core's strategy. Two decision
//        systems ran in parallel with no clear authority.
//
//   v15: aiBrainCore.processRequest() is THE ONLY decision maker.
//        - FinalDecision drives: strategy, tone, difficulty, model
//        - buildResponsePlanFromDecision() converts it to ResponsePlan
//          (execution format for prompt builders) — no independent logic
//        - buildResponsePlan() only runs as a fallback if Brain Core fails
//        - All scattered if/else strategy logic removed from this file
//        - Feedback loop wired: afterResponse() calls Brain Core post-stream
//
// NEW CONTROL FLOW:
//
//   User Input
//       ↓
//   aiBrainCore.processRequest()   ← single decision authority
//       ↓ FinalDecision
//   buildResponsePlanFromDecision() ← execution conversion only
//       ↓ ResponsePlan
//   buildMasterPrompt()            ← prompt assembly only
//       ↓ systemPrompt
//   solveTextStreamWithContext()   ← AI generation
//       ↓ response
//   aiBrainCore.afterResponse()   ← feedback + memory update
//
// All v14 exports preserved. Backward compatible.
// ─────────────────────────────────────────────────────────────

import { addMessage } from './conversationMemoryEngine.js';

import {
  buildResponsePlan,
  buildResponsePlanFromDecision,
  type ResponsePlan,
  detectIntent,
} from './aiResponsePlanner.js';

import {
  buildDifficultyInstruction,
  getResponseStyleNote,
  detectSkillLevelFromMessage,
  type SkillLevel,
} from './difficultyAdapter.js';

import {
  buildTeachingInstruction,
  buildFollowUpInstruction,
  buildConfidenceBoost,
  buildCorrectionInstruction,
} from './mentorTeachingMode.js';

import {
  buildPersonalityBlock,
  inferPersonality,
  getPersonalityPostProcessNote,
} from './aiPersonalityEngine.js';

import {
  routeToModel,
  getModelNote,
  recordQualityPenalty,
  recordModelSuccess,
  recordModelFailure,
  type RouterContextSignals,
} from './aiModelRouter.js';

import {
  validateResponse,
  getQualityLabel,
  type ValidationResult,
} from './responseValidator.js';

import {
  buildEnhancedContext,
  type EnhancedContext,
} from './contextEnhancer.js';

import { logger }            from '../../utils/logger.js';
import { StudentProfile }    from '../../models/StudentProfile.model.js';

// ── v15: AI Brain Core — single decision authority ────────────
import { aiBrainCore, type FinalDecision }       from '../adaptive/aiBrainCore.js';
import { modelPerformanceTracker }                from '../adaptive/modelPerformanceTracker.js';
import { userStateInferenceEngine }               from '../adaptive/userStateInferenceEngine.js';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface AskAIServiceInput {
  userId:      string;
  sessionId?:  string;
  message:     string;
  subjectMode: string;
  stepByStep:  boolean;
  history?:    { role: 'user' | 'assistant'; content: string }[];
  persistentWeakTopics?: string[];
  dbSessionSummary?:     string;
  // v13: Gap #1+#2 — frontend live intelligence
  smartMemoryContext?:      string;
  comprehensionContext?:    string;
  adaptiveHint?:            string;
  // v14: Gap #3+#4
  teachingContext?:         string;
  personalizationContext?:  string;
  // Adaptive brain fields
  prevAiResponse?:      string | null;
  prevStrategy?:        string | null;
  masteryLevel?:        number;
  currentState?:        string;
  retryCount?:          number;
  responseTimeMs?:      number;
}

export interface AskAIPromptPackage {
  systemPrompt:  string;
  history:       { role: 'user' | 'assistant'; content: string }[];
  userMessage:   string;
  modelConfig:   ReturnType<typeof routeToModel>;
  plan:          ResponsePlan;
  context:       EnhancedContext;
  detectedTopic: string | null;
  // v15: FinalDecision replaces brainOutput — single authority
  finalDecision: FinalDecision | null;
  // v14 backward-compat alias
  brainOutput:   FinalDecision | null;
}

// ─────────────────────────────────────────────────────────────
// buildMasterPrompt — Main export
//
// CONTROL FLOW (v15):
//   1. aiBrainCore.processRequest()  → FinalDecision (authority)
//   2. buildResponsePlanFromDecision() → ResponsePlan (execution format)
//   3. routeToModel() using FinalDecision.modelDecision (no independent routing)
//   4. Build system prompt using FinalDecision for all adaptive signals
// ─────────────────────────────────────────────────────────────
export async function buildMasterPrompt(
  input: AskAIServiceInput,
): Promise<AskAIPromptPackage> {

  const {
    userId,
    message,
    subjectMode,
    stepByStep,
    persistentWeakTopics = [],
    dbSessionSummary     = '',
  } = input;

  const sessionId        = input.sessionId    ?? 'unknown';
  const currentState     = input.currentState ?? 'LEARNING';
  const retryCount       = input.retryCount   ?? 0;
  const currentTurnCount = input.history?.length ?? 0;

  // ── STEP 1: Fetch context + mastery in parallel BEFORE brain call ──
  // masteryLevel must be resolved from DB before aiBrainCore.processRequest()
  // so Brain Core receives the real value, not the hardcoded 50 default.
  const frontendIntel = {
    smartMemoryContext:     input.smartMemoryContext,
    comprehensionContext:   input.comprehensionContext,
    adaptiveHint:           input.adaptiveHint,
    teachingContext:        input.teachingContext,
    personalizationContext: input.personalizationContext,
  };

  const [contextResult, masteryResult] = await Promise.allSettled([
    buildEnhancedContext(userId, message, frontendIntel),
    StudentProfile.findOne({ userId }).select('overallMasteryScore').lean(),
  ]);

  let context: EnhancedContext;
  if (contextResult.status === 'fulfilled') {
    context = contextResult.value;
  } else {
    const fallbackLevel = detectSkillLevelFromMessage(message);
    context = {
      skillLevel:     fallbackLevel,
      weakTopics:     [],
      strongTopics:   [],
      currentGoal:    '',
      learningState:  'unknown',
      recentActivity: '',
      sessionSummary: '',
      contextBlock:   `Student Level: ${fallbackLevel.toUpperCase()}`,
    };
  }

  if (masteryResult.status === 'rejected') {
    logger.warn({ userId, err: (masteryResult.reason as any)?.message }, '[AskAIService] StudentProfile mastery fetch failed — using fallback');
  }
  const dbMastery =
    masteryResult.status === 'fulfilled' && masteryResult.value?.overallMasteryScore != null
      ? masteryResult.value.overallMasteryScore
      : null;
  const masteryLevel = input.masteryLevel ?? dbMastery ?? 50;

  // ── STEP 2: AI Brain Core — SINGLE DECISION AUTHORITY ────────
  // Brain now receives the real masteryLevel from DB.
  //
  let finalDecision: FinalDecision | null = null;
  try {
    finalDecision = await aiBrainCore.processRequest({
      userId,
      sessionId,
      userMessage:     message,
      prevAiResponse:  input.prevAiResponse ?? null,
      prevStrategy:    (input.prevStrategy ?? null) as any,
      topic:           detectTopic(message, subjectMode),
      subject:         subjectMode,
      turnCount:       currentTurnCount,
      retryCount,
      masteryLevel,
      currentState,
      responseTimeMs:  input.responseTimeMs,
      frontendComprehension: parseComprehensionRate(input.comprehensionContext),
      frontendCognitiveLoad: parseCognitiveLoad(input.personalizationContext),
    });
  } catch (err: any) {
    logger.warn({ userId, err: err.message }, '[AskAIService v15] Brain Core failed — using legacy fallback');
  }

  const skillLevel: SkillLevel = context.skillLevel ?? detectSkillLevelFromMessage(message);

  // ── STEP 3: Build ResponsePlan FROM FinalDecision (execution only) ──
  //
  // WHEN finalDecision is available: buildResponsePlanFromDecision()
  //   — reads FinalDecision, makes zero new decisions
  //
  // WHEN finalDecision is null (Brain Core failed): buildResponsePlan()
  //   — legacy fallback only, clearly logged
  //
  let plan: ResponsePlan;

  if (finalDecision) {
    // PRIMARY PATH: Brain Core authority
    plan = buildResponsePlanFromDecision(message, finalDecision, currentTurnCount, stepByStep);
  } else {
    // FALLBACK PATH: Brain Core failed — legacy planner
    const allWeakTopics = [
      ...new Set([...persistentWeakTopics, ...context.weakTopics]),
    ].slice(0, 10);

    const inferred = userStateInferenceEngine.infer({
      message, turnCount: currentTurnCount, retryCount,
      responseTimeMs: input.responseTimeMs,
    });

    const compMatch  = input.comprehensionContext?.match(/(\d+)%/);
    const reMatch    = input.comprehensionContext?.match(/(\d+) re-explained/);
    const streakMatch = input.comprehensionContext?.match(/(\d+)-question understanding streak/);
    const phaseMatch = input.teachingContext?.match(/TEACHING PHASE:\s*(\w+)/i);
    const loadMatch  = input.personalizationContext?.match(/overloaded|high|low|normal/i);
    const styleMatch = input.personalizationContext?.match(/beginner|real.?world|future/i);
    const densityMatch = input.personalizationContext?.match(/brief|detailed/i);

    plan = buildResponsePlan(message, skillLevel, allWeakTopics, currentTurnCount, {
      comprehensionRate:  compMatch   ? parseInt(compMatch[1])   : (inferred.confusionScore > 0.5 ? 30 : undefined),
      reexplainRate:      reMatch     ? parseInt(reMatch[1])     : (retryCount >= 2 ? 60 : undefined),
      sessionStreak:      streakMatch ? parseInt(streakMatch[1]) : undefined,
      topWeakTopics:      allWeakTopics.slice(0, 3),
      teachingPhase:      phaseMatch  ? phaseMatch[1].toLowerCase() : undefined,
      cognitiveLoad:      loadMatch   ? loadMatch[0].toLowerCase()  : inferred.cognitiveLoad,
      learningStyle:      styleMatch  ? styleMatch[0].toLowerCase().replace('-', '_') : undefined,
      responseDensity:    densityMatch ? densityMatch[0].toLowerCase() : undefined,
    });
    plan.turnCount = currentTurnCount;
  }

  // ── STEP 4: Model Config — Brain Core preference takes precedence ──
  //
  // When finalDecision is available: use its modelDecision (Brain Core chose this).
  // routeToModel() is called for its return type shape, but modelId is overridden.
  //
  const routerSignals: RouterContextSignals = {
    comprehensionRate: parseComprehensionRate(input.comprehensionContext),
    cognitiveLoad:     parseCognitiveLoad(input.personalizationContext) as any,
  };
  let modelConfig = routeToModel(
    plan.intent,
    subjectMode,
    skillLevel,
    message.length,
    'text',
    routerSignals,
  );

  // Override with Brain Core's model decision when available
  if (finalDecision?.modelDecision) {
    modelConfig = {
      ...modelConfig,
      modelId:  finalDecision.modelDecision.modelId,
      provider: finalDecision.modelDecision.provider ?? modelConfig.provider,
    } as typeof modelConfig;
  }

  // ── STEP 5: Weak topics — merge all sources ────────────────
  const brainWeakTopics  = finalDecision?.weakTopics   ?? [];
  const brainStrongTopics = finalDecision?.strongTopics ?? [];
  const allWeakTopics = [
    ...new Set([...persistentWeakTopics, ...context.weakTopics, ...brainWeakTopics]),
  ].slice(0, 10);

  // ── STEP 6: Topic detection ────────────────────────────────
  const detectedTopic = detectTopic(message, subjectMode);

  // ── STEP 7: Personality (style-only — does not affect strategy) ──
  const personality  = inferPersonality(message);
  const isFirstTurn  = currentTurnCount === 0;

  // ── STEP 8: Mood signals (for prompt tone — Brain Core is already aware) ──
  const msgLower = message.toLowerCase();
  const isUrgentMode   = /jaldi|fast|quick|exam|test kal|aaj exam|time nahi|hurry|asap/.test(msgLower)
    || finalDecision?.tone === 'urgent';
  const isConfusedMode = /samajh nahi|nahi samajh|confused|not getting|phir se|dubara/.test(msgLower)
    || finalDecision?.inferredState.emotion === 'confused';
  const isGeneral = /trend|news|world|latest|kya chal raha|general|current/.test(msgLower) && !detectedTopic;

  const wantsQuick    = /quick|jaldi|short|brief|summary|tldr|tl;dr|concise|2 lines|ek line/.test(msgLower);
  const wantsDetailed = /detail|explain properly|poora|complete|full|in depth|deeply|thoroughly/.test(msgLower);

  // Difficulty level source: Brain Core first, context fallback
  const effectiveDifficulty = finalDecision?.difficultyLevel ?? skillLevel;
  const responseLengthNote = wantsQuick
    ? '\nRESPONSE LENGTH: Student wants a QUICK answer. Max 4-5 lines. No headers, no long examples. Sharp and direct.'
    : wantsDetailed
    ? '\nRESPONSE LENGTH: Student wants a DETAILED explanation. Use full structure, multiple examples, comprehensive coverage.'
    : plan.strategy === 'SHORT'
    ? '\nRESPONSE LENGTH: Keep it short — 2-3 sentences unless a brief example is essential.'
    : '';

  // ── STEP 9: Build System Prompt ───────────────────────────────
  //
  // FinalDecision.systemPromptAddition is the primary adaptive signal.
  // All other sections are structural/personality/subject-mode layers.
  //
  const sections: string[] = [

    // A) IDENTITY
    `You are AskAI — an intelligent academic companion. NOT a chatbot. NOT a search engine.\nYou are calm, sharp, and deeply aware of this student's learning journey.\nYou remember their past struggles. You notice their growth. You adapt to their mood.\nYour tone: warm and encouraging, never robotic. Like a brilliant senior who genuinely cares.`,

    // B) CONTEXT BLOCK (data layer — from contextEnhancer)
    context.contextBlock,

    // B2) BRAIN CORE DECISION BLOCK (authoritative adaptive signal)
    // This contains: strategy directive, tone, difficulty, memory, weak topics
    // Everything Brain Core decided in one clean block.
    finalDecision?.systemPromptAddition
      ? `\n=== AI BRAIN CORE DIRECTIVES (follow these precisely) ===\n${finalDecision.systemPromptAddition}\n=== END DIRECTIVES ===`
      : '',

    // C) DB SESSION MEMORY (cross-session intelligence)
    dbSessionSummary
      ? `\n=== 🧠 STUDENT'S LEARNING MEMORY (cross-session intelligence) ===\n${dbSessionSummary}\n\nMEMORY SURPRISE RULES:\n- If today's question relates to a past struggle topic → naturally reference it.\n  Example: \"Last time you were working on recursion and base cases gave you trouble — this concept connects directly to that!\"\n- If student asks something you've covered before → acknowledge it warmly.\n  Example: \"You've actually asked about this before — let's build on what you already know 🎯\"\n- Keep memory references natural and brief — don't force them if irrelevant.\n- Once every 5-6 exchanges, show a GROWTH MIRROR observation:\n  E.g., \"I notice you're asking more conceptual questions now — your understanding is clearly deepening 📈\"`
      : '',

    // D) MOOD-BASED TONE SHIFT (supplements Brain Core tone directive)
    isUrgentMode
      ? `\n⚡ EXAM MODE DETECTED: Student needs info FAST.\n- Skip the intro fluff. Go straight to the key points.\n- Format: \"Fast track version 👇\" then 3 bullet points MAX.\n- End with: \"This is the exam-important part — don't forget this!\"`
      : isConfusedMode
      ? `\n💙 CONFUSION DETECTED: Student is struggling.\n- Don't start with theory. Start with the SIMPLEST daily-life example possible.\n- Say: \"Koi baat nahi — let's start fresh with something super simple 😊\"\n- Use everyday Indian analogies (chai, cricket, mobile recharge, etc.)\n- Be extra patient. Break it into the tiniest possible steps.`
      : '',

    // E) GENERAL TOPIC → LEARNING BRIDGE
    isGeneral
      ? `\n🌍 GENERAL QUESTION BRIDGE:\nWhen answering general/trending topics, always end with a personalized learning bridge:\nExample: \"Globally, AI, crypto, and climate tech are trending. Based on what you've been studying, [topic] is especially relevant to your future — want me to connect it to what you already know? 🎯\"\nMake it feel personal, not generic.`
      : '',

    // F) INSTRUCTION LAYER
    '\n=== HOW TO RESPOND ===',
    'Before answering, internally:',
    '1. Check the student\'s mood signal (urgent/confused/motivated/general)',
    '2. Check memory — have they struggled with this topic before?',
    '3. Check if this is a repeat question — if so, reference the previous discussion',
    '4. Decide response length (short prompt = concise answer, detail prompt = full answer)',
    '5. Think step by step before giving the final answer',

    // G) DIFFICULTY ADAPTER (uses Brain Core difficulty level)
    '\n' + buildDifficultyInstruction(effectiveDifficulty as SkillLevel),
    responseLengthNote,
    getResponseStyleNote(effectiveDifficulty as SkillLevel, allWeakTopics.length > 0),
    plan.useAnalogy
      ? '\nANALOGY REQUIRED: Use a real-world analogy for this explanation. Student learns better with concrete examples from daily life.'
      : '',
    plan.emphasizeEncourage
      ? '\nENCOURAGEMENT REQUIRED: Student is struggling. Start with a warm, encouraging opening before explaining. Make them feel capable.'
      : '',
    plan.keepShort
      ? '\nRESPONSE LENGTH: Keep very concise — student prefers brief answers right now.'
      : '',
    plan.adaptationReason
      ? `\n[AI-OS: strategy adapted because: ${plan.adaptationReason}]`
      : '',

    // H) TEACHING MODE (execution — reads plan.strategy from Brain Core)
    buildTeachingInstruction(plan.strategy),

    // I) FOLLOW-UP + CONFIDENCE + CORRECTION
    buildFollowUpInstruction(plan.followUpQuestion, detectedTopic ?? undefined),
    buildConfidenceBoost(plan.boostConfidence, isFirstTurn),
    buildCorrectionInstruction(plan.correctGently),

    // J) PERSONALITY POST-PROCESS (style layer — never overrides strategy)
    getPersonalityPostProcessNote(personality, isFirstTurn, plan.correctGently),

    // K) SUBJECT MODE
    subjectMode === 'math'
      ? '\nMATH: Show formula → substitution → every step → boxed final answer.'
      : subjectMode === 'coding'
      ? '\nCODING: Provide complete runnable code. Comment each section. Show expected output.'
      : subjectMode === 'science'
      ? '\nSCIENCE: State law/principle → formula with units → worked example.'
      : '',

    // L) MODEL NOTE
    '\n' + getModelNote(modelConfig),

    // M) MANDATORY RESPONSE STRUCTURE
    plan.strategy !== 'QUIZ' && plan.strategy !== 'SHORT' && !isUrgentMode ? `

=== MANDATORY RESPONSE STRUCTURE (follow EVERY time) ===

CRITICAL FORMATTING RULE: Never write section label words like "EXPLANATION", "EXAMPLE", "QUICK SUMMARY" anywhere in your response. No emoji-label prefixes. Write naturally like Claude or ChatGPT — flowing, confident prose.

${wantsDetailed || (!wantsQuick) ? `
PART 1 — OPENING (most important):
   - Begin DIRECTLY with a bold, confident 1-sentence hook that nails the core concept.
   - Format the very first sentence in **bold** — make it punchy and clear.
   - Follow with 1-2 sentences of context/depth. No label, no prefix — just start.
   - Then give a relatable real-world analogy in a blockquote (use >) — preferably for Indian students.

PART 2 — EXAMPLE:
   - Give exactly 1 concrete, memorable example.
   - For math/coding: show the complete worked solution step by step.
   - Do NOT write "Example:" as a header — just flow into it naturally.

PART 3 — TAKEAWAY:
   - 2-3 lines of the key point they should remember for exams.
   - Do NOT write "Quick Summary:" — just write it as a natural closing thought.
` : ''}

PART 4 — MICRO-LEARNING HOOK (NEVER skip):
   - 1 sentence that sparks curiosity for the next concept.
   - Format: "**Bonus curiosity:** If you understood [topic], the next interesting thing to explore is [related concept] — [why it's exciting]! 🚀"

PART 5 — CLOSING QUESTION (NEVER skip):
   - End with exactly 1 smart question to keep the conversation going.
   - Format: "**Quick check:** [your question here]"

═══════════════════════════════════════════════════════
ABSOLUTE RULES:
- NEVER write labels like "EXPLANATION", "EXAMPLE", "QUICK SUMMARY" — not even as markdown headers
- ALWAYS start your first sentence in **bold**
- ALWAYS end with "**Quick check:**" — NO exceptions
- Response to student's own answer:
  ✓ Correct → "Nice! 🔥 You got it!" + show next micro-learning hook
  ✗ Wrong   → "Almost! The key thing is..." (warm, build on what they got right)
  ? Confused → "Koi baat nahi 😊 Let's try a completely different angle..."
  ↩ Re-explain → Give same concept with NEW analogy, mention their learning pattern
- For "**Samajh aaya 👍**" response: celebrate briefly, then offer next level
- For "**Dubara samjhao**" response: pick a DIFFERENT approach, mention you noticed this topic is challenging
═══════════════════════════════════════════════════════
` : plan.strategy === 'QUIZ' ? '' :
    '\nEven in short mode: end with ONE brief question to keep the conversation going. Format: "**Quick check:** [question]"',
  ];

  const systemPrompt = sections.filter(Boolean).join('\n');
  const history = (input.history ?? []).slice(-20);

  logger.info(
    'AskAI v15 prompt | intent='   + plan.intent +
    ' strategy='    + plan.strategy +
    ' skill='       + effectiveDifficulty +
    ' model='       + modelConfig.modelId +
    ' history='     + history.length + 'msgs' +
    ' weakDB='      + persistentWeakTopics.length +
    ' turns='       + currentTurnCount +
    ' adapted='     + (plan.adaptationReason ?? 'none') +
    ' emotion='     + (finalDecision?.inferredState.emotion ?? 'none') +
    ' brainCore='   + (finalDecision ? 'v2-authority' : 'fallback'),
  );

  return {
    systemPrompt,
    history,
    userMessage:   message,
    modelConfig,
    plan,
    context,
    detectedTopic,
    finalDecision,
    brainOutput:   finalDecision,  // backward-compat alias
  };
}

// ─────────────────────────────────────────────────────────────
// validateAndLog (preserved from v14)
// ─────────────────────────────────────────────────────────────
export function validateAndLog(
  aiResponse: string,
  intent:     string,
  userPrompt: string,
  userId:     string,
): ValidationResult {
  const result = validateResponse(aiResponse, intent, userPrompt);
  const label  = getQualityLabel(result);

  logger.info(
    `AskAI response | quality=${label} score=${result.score} ` +
    `length=${aiResponse.length} userId=${userId}`,
  );

  return result;
}

// ─────────────────────────────────────────────────────────────
// Model tracking helpers — exported for controller use
// ─────────────────────────────────────────────────────────────
export function trackModelSuccess(modelId: string, latencyMs: number): void {
  try {
    recordModelSuccess(modelId, latencyMs);
    modelPerformanceTracker.recordSuccess(modelId, latencyMs);
  } catch {
    // non-fatal
  }
}

export function trackModelFailure(modelId: string, reason: string = 'unknown'): void {
  try {
    recordModelFailure(modelId);
    modelPerformanceTracker.recordFailure(modelId, reason);
  } catch {
    // non-fatal
  }
}

export function trackModelQualityIssue(modelId: string, severity: number = 1): void {
  try {
    recordQualityPenalty(modelId, severity);
    modelPerformanceTracker.recordQualityIssue(modelId, severity);
  } catch {
    // non-fatal
  }
}

// ─────────────────────────────────────────────────────────────
// Topic detection (preserved from v14)
// ─────────────────────────────────────────────────────────────
function detectTopic(message: string, subjectMode: string): string | null {
  const lower = message.toLowerCase();
  const TOPIC_MAP: Record<string, string[]> = {
    'algebra':         ['algebra', 'equation', 'variable', 'polynomial'],
    'calculus':        ['calculus', 'derivative', 'integral', 'differentiation'],
    'physics':         ['force', 'motion', 'velocity', 'acceleration', 'newton'],
    'chemistry':       ['atom', 'molecule', 'bond', 'reaction', 'element'],
    'programming':     ['code', 'function', 'loop', 'array', 'variable', 'algorithm'],
    'data structures': ['stack', 'queue', 'tree', 'graph', 'linked list', 'hash'],
  };
  for (const [topic, keywords] of Object.entries(TOPIC_MAP)) {
    if (keywords.some(k => lower.includes(k))) return topic;
  }
  if (subjectMode !== 'auto' && subjectMode) return subjectMode;
  return null;
}

// ─────────────────────────────────────────────────────────────
// Parse frontend signal helpers (preserved from v14)
// ─────────────────────────────────────────────────────────────
function parseComprehensionRate(ctx?: string): number | undefined {
  const match = ctx?.match(/(\d+)%/);
  return match ? parseInt(match[1]) : undefined;
}

function parseCognitiveLoad(ctx?: string): string | undefined {
  const match = ctx?.match(/overloaded|high|low|normal/i);
  return match ? match[0].toLowerCase() : undefined;
}

// ─────────────────────────────────────────────────────────────
// detectEmotionalState — re-exported for aiController.ts
// Preserved exactly from v14
// ─────────────────────────────────────────────────────────────
export function detectEmotionalState(
  userMessage: string,
  turnCount:   number,
): 'correct' | 'confused' | 'frustrated' | 'motivated' | 'neutral' {
  const msg = userMessage.toLowerCase().trim();

  if (/\b(got it|makes sense|i understand|clear hai|samajh gaya|samajh gayi|oh i see|that makes sense|i get it|achha|accha|ohh|ahhh|right right|yes exactly|bilkul|haan samajh|ab samajh|got this)\b/.test(msg)) {
    return 'correct';
  }
  if (/\b(don'?t understand|confused|not clear|samajh nahi|kya matlab|phir se|not getting|what do you mean|explain again|dubara|didn'?t get|unclear|ye kya hai|yeh kya|pata nahi|nahi pata|kuch nahi samajha)\b/.test(msg)) {
    return 'confused';
  }
  if (/\b(why is this so|this is hard|too difficult|giving up|i can'?t|can'?t do this|impossible|ugh|argh|frustrat|bahut mushkil|nahi ho raha|nahi samajh|ye toh bahut|yaar kuch nahi|pakka nahi hoga)\b/.test(msg)) {
    return 'frustrated';
  }
  if (/\b(amazing|awesome|great|love this|this is cool|interesting|wow|wah|mast|bahut accha|nice|let'?s go|let me try|i want to|and then|what about|tell me more|aur batao|aage batao|next)\b/.test(msg)) {
    return 'motivated';
  }
  if (turnCount === 0) return 'neutral';
  return 'neutral';
}

// ─────────────────────────────────────────────────────────────
// afterResponse — re-exported for aiController.ts + askAIController.ts
// Updates in-session RAM memory for contextEnhancer Layer 3.
// v15: Also wires Brain Core afterResponse for teaching loop + memory update.
// ─────────────────────────────────────────────────────────────
export function afterResponse(
  userId:      string,
  userMessage: string,
  aiResponse:  string,
  topic?:      string | null,
): void {
  try {
    addMessage(userId, 'user',      userMessage, topic ?? undefined);
    addMessage(userId, 'assistant', aiResponse,  topic ?? undefined);
  } catch (e: any) {
    logger.warn('afterResponse RAM update failed: ' + (e as any).message);
  }
}

/**
 * afterResponseWithBrain — enhanced afterResponse that also updates
 * Brain Core's teaching loop and strategy scores.
 *
 * Call this instead of afterResponse() when you have a finalDecision available.
 * Backward compatible — falls back to RAM-only update if params missing.
 */
export async function afterResponseWithBrain(
  userId:        string,
  sessionId:     string,
  userMessage:   string,
  aiResponse:    string,
  topic:         string | null,
  subject:       string,
  turnCount:     number,
  retryCount:    number,
  finalDecision: FinalDecision | null,
  outcome?:      { success: boolean; correctness?: number },
): Promise<void> {
  // RAM memory update (always)
  afterResponse(userId, userMessage, aiResponse, topic);

  // Brain Core update (when finalDecision available)
  if (finalDecision) {
    try {
      await aiBrainCore.afterResponse(
        userId, sessionId, userMessage, aiResponse,
        finalDecision, topic, subject, turnCount, retryCount, outcome,
      );
    } catch (err: any) {
      logger.warn({ userId, err: err.message }, '[AskAIService v15] Brain Core afterResponse failed (non-fatal)');
    }
  }
}