// ─────────────────────────────────────────────────────────────
// AskAI — askAIService.ts  (v13 — Gap #5+#6: Adaptive Planner + Smart Context)
//
// NEW IN v12:
//   Imp 1: Memory Surprise — specific past topic references in system prompt
//   Imp 3: Micro-Learning Hook — curiosity engine after every answer
//   Imp 4: Mood-based tone shift — urgent/confused/general detection
//   Imp 5: Growth Mirror — AI reflects student's progress back to them
//   Imp 6: General → Learning Bridge — personalized topic connection
//   Imp 7: Wow Moments — observation about student's learning pattern
//   Imp 8: Identity — "calm, sharp, aware academic companion"
//   Imp 9: Adaptive response length — quick/detailed detection
//   Imp 10: AI-initiated questions — branching conversation ownership
//
// Bug #4 FIXED: turnCount passed correctly to buildResponsePlan
// Bug #3 FIXED: afterResponse RAM drift documented
// ─────────────────────────────────────────────────────────────

// v10: RAM memory engine kept only for in-session getMemorySummary
// conversationMemoryEngine.addMessage used by afterResponse (Layer 3 context)
import { addMessage } from './conversationMemoryEngine.js';

import {
  buildResponsePlan,
  type ResponsePlan,
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

import { logger } from '../../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface AskAIServiceInput {
  userId:      string;
  message:     string;
  subjectMode: string;
  stepByStep:  boolean;
  history?:    { role: 'user' | 'assistant'; content: string }[];
  // v9: persistent data from MongoDB
  persistentWeakTopics?: string[];
  dbSessionSummary?:     string;
  // v13: Gap #1+#2 — frontend live intelligence
  smartMemoryContext?:      string;
  comprehensionContext?:    string;
  adaptiveHint?:            string;
  // v14: Gap #3+#4
  teachingContext?:         string;
  personalizationContext?:  string;
}

export interface AskAIPromptPackage {
  systemPrompt:  string;
  history:       { role: 'user' | 'assistant'; content: string }[];
  userMessage:   string;
  modelConfig:   ReturnType<typeof routeToModel>;
  plan:          ResponsePlan;
  context:       EnhancedContext;
  detectedTopic: string | null;
}

// ─────────────────────────────────────────────────────────────
// buildMasterPrompt — Main export
// Builds the complete system prompt + all AI pipeline decisions
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

  // Step 1: Rich context from AI Brain (orchestrator + tutor)
  // v13: Pass frontend intelligence for weighted fusion (Gap #6)
  const frontendIntel = {
    smartMemoryContext:     input.smartMemoryContext,
    comprehensionContext:   input.comprehensionContext,
    adaptiveHint:           input.adaptiveHint,
    teachingContext:        input.teachingContext,
    personalizationContext: input.personalizationContext,
  };

  let context: EnhancedContext;
  try {
    context = await buildEnhancedContext(userId, message, frontendIntel);
  } catch {
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

  const skillLevel: SkillLevel = context.skillLevel ?? detectSkillLevelFromMessage(message);

  // Step 2: Merge ALL weak topic sources
  // Priority: DB persistent (30-day) > AI Brain orchestrator
  const allWeakTopics = [
    ...new Set([
      ...persistentWeakTopics,
      ...context.weakTopics,
    ]),
  ].slice(0, 10);

  // Step 3: Response Planning
  // Bug #4 FIX: pass correct turnCount directly — was passing 0 then overriding
  const currentTurnCount = input.history?.length ?? 0;
  // v13: Gap #5 — pass live intelligence to adaptive planner
  // Parse comprehension stats from frontend context string
  const compMatch    = input.comprehensionContext?.match(/(\d+)%/);
  const reMatch      = input.comprehensionContext?.match(/(\d+) re-explained/);
  const streakMatch  = input.comprehensionContext?.match(/(\d+)-question understanding streak/);
  const phaseMatch   = input.teachingContext?.match(/TEACHING PHASE:\s*(\w+)/i);
  const loadMatch    = input.personalizationContext?.match(/overloaded|high|low|normal/i);
  const styleMatch   = input.personalizationContext?.match(/beginner|real.?world|future/i);
  const densityMatch = input.personalizationContext?.match(/brief|detailed/i);

  const plannerIntel = (input.comprehensionContext || input.teachingContext || input.personalizationContext) ? {
    comprehensionRate:  compMatch    ? parseInt(compMatch[1])   : undefined,
    reexplainRate:      reMatch      ? parseInt(reMatch[1])     : undefined,
    sessionStreak:      streakMatch  ? parseInt(streakMatch[1]) : undefined,
    topWeakTopics:      allWeakTopics.slice(0, 3),
    teachingPhase:      phaseMatch   ? phaseMatch[1].toLowerCase() : undefined,
    cognitiveLoad:      loadMatch    ? loadMatch[0].toLowerCase()   : undefined,
    learningStyle:      styleMatch   ? styleMatch[0].toLowerCase().replace('-', '_') : undefined,
    responseDensity:    densityMatch ? densityMatch[0].toLowerCase() : undefined,
  } : undefined;

  const plan = buildResponsePlan(
    message,
    skillLevel,
    allWeakTopics,
    currentTurnCount,
    plannerIntel,   // v13: adaptive intelligence
  );
  plan.turnCount = currentTurnCount;

  if (stepByStep && plan.strategy !== 'QUIZ') {
    plan.strategy = 'STEP_BY_STEP';
  }

  // Step 4: Model Routing (v13: pass context signals for smart routing)
  const routerSignals: RouterContextSignals = plannerIntel ? {
    comprehensionRate: plannerIntel.comprehensionRate,
    cognitiveLoad:     plannerIntel.cognitiveLoad,
  } : {};
  const modelConfig = routeToModel(
    plan.intent,
    subjectMode,
    skillLevel,
    message.length,
    'text',
    routerSignals,
  );

  // Step 5: Topic Detection (base — aiController uses detectTopicExpanded on top)
  const detectedTopic = detectTopic(message, subjectMode);

  // Step 6: Personality
  const personality = inferPersonality(message);
  const isFirstTurn = currentTurnCount === 0;

  // ── Mood detection for tone adaptation (Improvement 4) ───────────────
  const msgLower = message.toLowerCase();
  const isUrgentMode   = /jaldi|fast|quick|exam|test kal|aaj exam|time nahi|hurry|asap/.test(msgLower);
  const isConfusedMode = /samajh nahi|nahi samajh|confused|not getting|what is even|phir se|dubara/.test(msgLower);
  const isGeneral      = /trend|news|world|latest|kya chal raha|general|current/.test(msgLower) && !detectedTopic;

  // ── Response length signal (Improvement 9) ────────────────────────────
  const wantsQuick   = /quick|jaldi|short|brief|summary|tldr|tl;dr|concise|2 lines|ek line/.test(msgLower);
  const wantsDetailed = /detail|explain properly|poora|complete|full|in depth|deeply|thoroughly/.test(msgLower);
  const responseLengthNote = wantsQuick
    ? '\nRESPONSE LENGTH: Student wants a QUICK answer. Max 4-5 lines. No headers, no long examples. Sharp and direct.'
    : wantsDetailed
    ? '\nRESPONSE LENGTH: Student wants a DETAILED explanation. Use full structure, multiple examples, comprehensive coverage.'
    : plan.strategy === 'SHORT'
    ? '\nRESPONSE LENGTH: Keep it short — 2-3 sentences unless a brief example is essential.'
    : '';

  // Step 7: Build Master System Prompt (v12 — All 10 Improvements)
  const sections: string[] = [

    // A) IDENTITY — calm + sharp + aware academic companion (Improvement 8)
    `You are AskAI — an intelligent academic companion. NOT a chatbot. NOT a search engine.
You are calm, sharp, and deeply aware of this student's learning journey.
You remember their past struggles. You notice their growth. You adapt to their mood.
Your tone: warm and encouraging, never robotic. Like a brilliant senior who genuinely cares.`,

    // B) CONTEXT BLOCK (AI Brain + Tutor data)
    context.contextBlock,

    // C) DB SESSION MEMORY — Memory Surprise moments (Improvement 1)
    dbSessionSummary
      ? `\n=== 🧠 STUDENT'S LEARNING MEMORY (cross-session intelligence) ===
${dbSessionSummary}

MEMORY SURPRISE RULES:
- If today's question relates to a past struggle topic → naturally reference it.
  Example: "Last time you were working on recursion and base cases gave you trouble — this concept connects directly to that!"
- If student asks something you've covered before → acknowledge it warmly.
  Example: "You've actually asked about this before — let's build on what you already know 🎯"
- Keep memory references natural and brief — don't force them if irrelevant.
- Once every 5-6 exchanges, show a GROWTH MIRROR observation (Improvement 5+7):
  E.g., "I notice you're asking more conceptual questions now — your understanding is clearly deepening 📈"
  E.g., "You've gone from asking 'what is X' to 'how does X work in real life' — that's significant growth!"
  E.g., "You tend to understand things faster with examples — I'll keep using that approach for you."`
      : '',

    // D) MOOD-BASED TONE SHIFT (Improvement 4)
    isUrgentMode
      ? `\n⚡ EXAM MODE DETECTED: Student needs info FAST.
- Skip the intro fluff. Go straight to the key points.
- Format: "Fast track version 👇" then 3 bullet points MAX.
- End with: "This is the exam-important part — don't forget this!"`
      : isConfusedMode
      ? `\n💙 CONFUSION DETECTED: Student is struggling.
- Don't start with theory. Start with the SIMPLEST daily-life example possible.
- Say: "Koi baat nahi — let's start fresh with something super simple 😊"
- Use everyday Indian analogies (chai, cricket, mobile recharge, etc.)
- Be extra patient. Break it into the tiniest possible steps.`
      : '',

    // E) GENERAL TOPIC → LEARNING BRIDGE (Improvement 6)
    isGeneral
      ? `\n🌍 GENERAL QUESTION BRIDGE:
When answering general/trending topics, always end with a personalized learning bridge:
Example: "Globally, AI, crypto, and climate tech are trending. Based on what you've been studying, [topic] is especially relevant to your future — want me to connect it to what you already know? 🎯"
Make it feel personal, not generic.`
      : '',

    // F) INSTRUCTION LAYER
    '\n=== HOW TO RESPOND ===',
    'Before answering, internally:',
    '1. Check the student\'s mood signal (urgent/confused/motivated/general)',
    '2. Check memory — have they struggled with this topic before?',
    '3. Check if this is a repeat question — if so, reference the previous discussion',
    '4. Decide response length (short prompt = concise answer, detail prompt = full answer)',
    '5. Think step by step before giving the final answer',

    // G) DIFFICULTY ADAPTER + v13 adaptive signals from planner
    '\n' + buildDifficultyInstruction(skillLevel),
    responseLengthNote,
    getResponseStyleNote(skillLevel, allWeakTopics.length > 0),
    // v13: Gap #5 — inject planner's adaptive decisions into prompt
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

    // H) TEACHING MODE
    buildTeachingInstruction(plan.strategy),

    // I) FOLLOW-UP + CONFIDENCE + CORRECTION
    buildFollowUpInstruction(plan.followUpQuestion, detectedTopic ?? undefined),
    buildConfidenceBoost(plan.boostConfidence, isFirstTurn),
    buildCorrectionInstruction(plan.correctGently),

    // J) PERSONALITY POST-PROCESS
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

    // M) MANDATORY RESPONSE STRUCTURE (Imp 3: Smart Follow-Up, Imp 10: AI asks questions)
    plan.strategy !== 'QUIZ' && plan.strategy !== 'SHORT' && !isUrgentMode ? `

=== MANDATORY RESPONSE STRUCTURE (follow EVERY time) ===

${wantsDetailed || (!wantsQuick) ? `
1. 📖 EXPLANATION
   - Start with the core concept in 1-2 simple sentences
   - Match complexity to student's level (${skillLevel})
   - Use a real-world analogy (preferably relatable to Indian students)

2. 💡 EXAMPLE
   - Give exactly 1 concrete, memorable example
   - For math/coding: show the complete worked solution step by step

3. ⚡ QUICK SUMMARY
   - Exactly 2-3 lines summing up the key takeaway
   - Something they can recall in an exam 1 week from now
` : ''}

4. 🔥 MICRO-LEARNING HOOK (Improvement 3 — NEVER skip)
   - After your answer, add 1 sentence that sparks curiosity for the NEXT concept.
   - Format: "**Bonus curiosity:** If you understood [topic], the next interesting thing to explore is [related concept] — it'll blow your mind! 🚀"
   - OR: "**Next level:** Once you get this, [next concept] becomes 10x easier to understand."
   - Keep it SHORT — 1 sentence only. Make it irresistible.

5. ❓ AI-INITIATED QUESTION (Improvement 10 — NEVER skip)
   - End with 1 smart question that drives the conversation forward.
   - This is NOT just a "did you understand" question. It should branch the learning.
   - Examples:
     * "Do you want me to show you this with a real exam problem, or would you prefer the theory side first?"
     * "Are you learning this for a specific exam, or just exploring? (That'll help me customize!)"
     * "Would you like to try solving one yourself, or should I show another example first?"
     * "Tumhara focus kya hai — concept clear karna hai ya exam ke liye shortcuts chahiye? 🎯"
   - Format: "**Quick check:** [your question here]"

═══════════════════════════════════════════════════════
ABSOLUTE RULES:
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
    // SHORT strategy or urgent mode — still needs a follow-up question
    '\nEven in short mode: end with ONE brief question to keep the conversation going. Format: "**Quick check:** [question]"',
  ];

  const systemPrompt = sections.filter(Boolean).join('\n');

  // Frontend history ONLY — already filtered for correct chat (v10 fix)
  const history = (input.history ?? []).slice(-20);

  logger.info(
    'AskAI v13 prompt | intent='  + plan.intent +
    ' strategy='  + plan.strategy +
    ' skill='     + skillLevel +
    ' model='     + modelConfig.modelId +
    ' history='   + history.length + 'msgs' +
    ' weakDB='    + persistentWeakTopics.length +
    ' turns='     + currentTurnCount +
    ' adapted='   + (plan.adaptationReason ?? 'none') +
    ' hasFrontendIntel=' + !!(input.comprehensionContext || input.teachingContext),
  );

  return { systemPrompt, history, userMessage: message, modelConfig, plan, context, detectedTopic };
}

// ─────────────────────────────────────────────────────────────
// validateAndLog
// ─────────────────────────────────────────────────────────────
export function validateAndLog(
  aiResponse: string,
  intent:     string,
  userPrompt: string,
  userId:     string,
): ValidationResult {
  const result = validateResponse(aiResponse, intent, userPrompt);

  if (!result.isValid) {
    logger.warn(
      `[AskAI] Response validation failed | userId=${userId.slice(-6)} ` +
      `intent=${intent} score=${result.score} issues=${result.issues.join(', ')}`,
    );
  } else if (result.issues.length > 0) {
    logger.info(
      `[AskAI] Response validation passed with warnings | userId=${userId.slice(-6)} ` +
      `score=${result.score} warnings=${result.issues.join(', ')}`,
    );
  }

  return result;
}

// ─────────────────────────────────────────────────────────────
// detectEmotionalState
// Detects user's current emotional state from their message.
// Supports English + Hinglish.
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
// afterResponse
// Bug #3 FIXED: RAM memory clarified.
// RAM (conversationMemoryEngine) is kept ONLY for in-session
// getMemorySummary used by contextEnhancer Layer 3.
// DB persistence (persistAIMessage) is in aiController.ts ONLY.
// ─────────────────────────────────────────────────────────────
export function afterResponse(
  userId:      string,
  userMessage: string,
  aiResponse:  string,
  topic?:      string | null,
): void {
  // RAM write: only for contextEnhancer.getMemorySummary (in-session context)
  // DB is the source of truth — this is supplementary, in-process only
  try {
    addMessage(userId, 'user',      userMessage, topic ?? undefined);
    addMessage(userId, 'assistant', aiResponse,  topic ?? undefined);
  } catch (e: any) {
    logger.warn('afterResponse RAM update failed: ' + e.message);
  }
  // NOTE: persistAIMessage() is called in aiController.ts — NOT here
}

// ─────────────────────────────────────────────────────────────
// detectTopic — base topic detection (18 topics)
// NOTE: aiController.ts uses detectTopicExpanded() (80+ topics)
// from askAIOrchestrator.ts on top of this. Keep both.
// ─────────────────────────────────────────────────────────────
export function detectTopic(message: string, subjectMode: string): string | null {
  const lower = message.toLowerCase();

  const TOPIC_MAP: [RegExp, string][] = [
    [/\bloop(s)?\b|\bfor loop\b|\bwhile loop\b/,          'loops'],
    [/\brecursion\b|\brecursive\b/,                        'recursion'],
    [/\barray(s)?\b|\blist(s)?\b/,                         'arrays'],
    [/\bsort(ing)?\b|\bbubble sort\b|\bmerge sort\b/,      'sorting'],
    [/\bpointer(s)?\b/,                                    'pointers'],
    [/\bclass\b|\bobject\b|\boop\b|\binheritance\b/,       'OOP'],
    [/\bfunction(s)?\b|\bclosure(s)?\b/,                   'functions'],
    [/\bintegral\b|∫|\bderivative\b|\bdifferential\b/,     'calculus'],
    [/\btrigonometry\b|\bsin\b|\bcos\b|\btan\b/,           'trigonometry'],
    [/\bprobability\b|\bstatistics\b/,                     'probability'],
    [/\bphotos(ynthesis)?\b/,                              'photosynthesis'],
    [/\bnewton(s)?\b|\bgravity\b|\bforce\b/,               'Newtonian mechanics'],
    [/\bchemistry\b|\belement\b|\bperiodic\b|\bbond\b/,    'chemistry'],
    [/\balgebra\b|\bequation\b|\bpolynomial\b/,            'algebra'],
    [/\bpython\b/,                                         'Python'],
    [/\bjavascript\b|\bjs\b|\bnode\.?js\b/,               'JavaScript'],
    [/\breact\b|\bnext\.?js\b/,                            'React'],
    [/\bsql\b|\bdatabase\b|\bmysql\b|\bpostgres\b/,        'databases'],
  ];

  for (const [pattern, topic] of TOPIC_MAP) {
    if (pattern.test(lower)) return topic;
  }

  if (subjectMode && subjectMode !== 'auto') return subjectMode;
  return null;
}