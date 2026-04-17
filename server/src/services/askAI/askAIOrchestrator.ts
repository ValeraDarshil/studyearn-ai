// ─────────────────────────────────────────────────────────────
// AskAI Orchestrator — askAIOrchestrator.ts  (v12 — Adaptive Intelligence)
//
// GAP 3 FIX: userStateInferenceEngine — server-side emotion/confusion detection
//            No longer depends only on frontend signals
//
// GAP 4 FIX: feedbackLoopEngine — closes the learning loop after each reply
//            Outcome → strategy score update → long-term memory update
//
// GAP 6 FIX: teachingLoopEngine — iterative teach→check→retry cycle
//            Phase-aware strategy selection
//
// All original runPostResponsePipeline logic preserved.
// New engines run as additional parallel enrichment layers.
// ─────────────────────────────────────────────────────────────

import { logger } from '../../utils/logger.js';

// ── GAP 3+4+6 NEW imports ─────────────────────────────────────
import { userStateInferenceEngine } from '../adaptive/userStateInferenceEngine.js';
import { feedbackLoopEngine }       from '../adaptive/feedbackLoopEngine.js';
import { teachingLoopEngine }       from '../adaptive/teachingLoopEngine.js';
import { aiBrainCore }              from '../adaptive/aiBrainCore.js';
import type { TeachingStrategy }    from '../adaptive/strategyScoringEngine.js';

export interface PostResponseInput {
  userId:        string;
  sessionId?:    string;
  prompt:        string;
  aiResponse:    string;
  emotionalState: 'correct' | 'confused' | 'frustrated' | 'motivated' | 'neutral';
  detectedTopic: string | null;
  intent:        string;
  strategy:      string;
  turnCount:     number;
  subjectMode:   string;
  // GAP 3: new optional fields
  retryCount?:        number;
  responseTimeMs?:    number;
  prevAiResponse?:    string | null;
  masteryLevel?:      number;
  currentState?:      string;
}

export interface PostResponseEnrichment {
  recommendation:   RecommendationSnippet | null;
  progressInsight:  string | null;
  hintMode:         boolean;
  hintText:         string | null;
  emotionalNudge:   string | null;
  growthMirror:     GrowthMirrorData | null;
  wowObservation:   string | null;
  // GAP 3+4+6 additions
  inferredEmotion:  string | null;
  teachingPhase:    string | null;
  nextStrategy:     string | null;
  feedbackProcessed: boolean;
}

export interface GrowthMirrorData {
  grownTopics:  string[];
  strongTopics: string[];
  totalTurns:   number;
  sessionCount: number;
  message:      string;
}

interface RecommendationSnippet {
  title:   string;
  message: string;
  action:  string;
  icon:    string;
  xp:      number;
}

// ─────────────────────────────────────────────────────────────
// runPostResponsePipeline
// ─────────────────────────────────────────────────────────────
export async function runPostResponsePipeline(
  input: PostResponseInput,
): Promise<PostResponseEnrichment> {
  const {
    userId,
    sessionId      = '',
    prompt,
    aiResponse,
    emotionalState,
    detectedTopic,
    intent,
    strategy,
    turnCount,
    subjectMode,
    retryCount     = 0,
    responseTimeMs,
    prevAiResponse = null,
    masteryLevel   = 50,
    currentState   = 'LEARNING',
  } = input;

  const enrichment: PostResponseEnrichment = {
    recommendation:   null,
    progressInsight:  null,
    hintMode:         false,
    hintText:         null,
    emotionalNudge:   null,
    growthMirror:     null,
    wowObservation:   null,
    inferredEmotion:  null,
    teachingPhase:    null,
    nextStrategy:     null,
    feedbackProcessed: false,
  };

  // Run all enrichment in parallel — failures are isolated
  const [
    recResult,
    progressResult,
    hintResult,
    emotionResult,
    growthResult,
    wowResult,
    // GAP 3: server-side state inference
    inferenceResult,
    // GAP 4: feedback loop
    feedbackResult,
    // GAP 6: teaching loop advance
    teachingResult,
  ] = await Promise.allSettled([
    _getRecommendation(userId, detectedTopic, subjectMode, turnCount),
    _updateProgress(userId, detectedTopic, subjectMode),
    _getHint(userId, prompt, intent, strategy),
    _getEmotionalNudge(userId, emotionalState, turnCount),
    _getGrowthMirror(userId, turnCount),
    _getWowObservation(userId, turnCount, subjectMode, detectedTopic),
    // GAP 3: infer state from the student's PROMPT (their message)
    Promise.resolve(userStateInferenceEngine.infer({
      message:      prompt,
      turnCount,
      retryCount,
      responseTimeMs,
      lastTopic:    detectedTopic,
      currentTopic: detectedTopic,
    })),
    // GAP 4: process feedback — prompt is student's reply to previous AI response
    turnCount > 1 && prevAiResponse
      ? feedbackLoopEngine.processOutcome({
          userId, sessionId,
          userMessage:  prompt,
          aiResponse:   prevAiResponse,
          strategy:     strategy as TeachingStrategy,
          topic:        detectedTopic,
          subject:      subjectMode,
          turnCount, retryCount, responseTimeMs,
        })
      : Promise.resolve(null),
    // GAP 6: read teaching loop state (advance is handled exclusively
    // by aiBrainCore.afterResponse() via afterResponseWithBrain — calling
    // advance() here too was causing double-advance / phase skipping).
    teachingLoopEngine.getState(userId),
  ]);

  // ── Original fields ────────────────────────────────────────
  if (recResult.status === 'fulfilled')      enrichment.recommendation  = recResult.value;
  if (progressResult.status === 'fulfilled') enrichment.progressInsight = progressResult.value;
  if (emotionResult.status === 'fulfilled')  enrichment.emotionalNudge  = emotionResult.value;
  if (growthResult.status === 'fulfilled')   enrichment.growthMirror    = growthResult.value;
  if (wowResult.status === 'fulfilled')      enrichment.wowObservation  = wowResult.value;

  if (hintResult.status === 'fulfilled' && hintResult.value) {
    enrichment.hintMode = true;
    enrichment.hintText = hintResult.value;
  }

  // ── GAP 3: Inferred emotion ────────────────────────────────
  if (inferenceResult.status === 'fulfilled' && inferenceResult.value) {
    const inferred = inferenceResult.value;
    enrichment.inferredEmotion = inferred.emotion;

    // Override emotionalNudge with server-inferred state if stronger signal
    if (inferred.emotion === 'frustrated' && !enrichment.emotionalNudge) {
      enrichment.emotionalNudge = "I can see this is challenging. Let's take it step by step — you've got this! 💪";
    }
    if (inferred.emotion === 'confused' && !enrichment.emotionalNudge) {
      enrichment.emotionalNudge = "Let me try explaining this differently — sometimes a new angle makes all the difference! 🔄";
    }
  }

  // ── GAP 4: Feedback loop result ────────────────────────────
  if (feedbackResult.status === 'fulfilled' && feedbackResult.value) {
    enrichment.feedbackProcessed = feedbackResult.value.recorded;
  }

  // ── GAP 6: Teaching loop phase ─────────────────────────────
  if (teachingResult.status === 'fulfilled' && teachingResult.value) {
    const loopState = teachingResult.value;
    enrichment.teachingPhase = loopState.phase;
    enrichment.nextStrategy  = loopState.currentStrategy;
  }

  return enrichment;
}

// ─────────────────────────────────────────────────────────────
// Original helper functions (preserved exactly)
// ─────────────────────────────────────────────────────────────

async function _getRecommendation(
  userId:       string,
  detectedTopic: string | null,
  subjectMode:   string,
  turnCount:     number,
): Promise<RecommendationSnippet | null> {
  if (turnCount < 2) return null;
  try {
    const { getRecommendations } = await import('../learningSystem/learningRecommendationEngine.js');
    const bundle = await getRecommendations(
      userId,
      'after_ai_tutor',
      { topic: detectedTopic ?? undefined, subject: subjectMode !== 'auto' ? subjectMode : undefined },
    );

    if (!bundle?.primary) return null;

    const rec = bundle.primary;
    return {
      title:   rec.title,
      message: rec.message,
      action:  rec.action,
      icon:    rec.icon,
      xp:      rec.xpOpportunity,
    };
  } catch {
    return null;
  }
}

async function _updateProgress(
  userId:       string,
  detectedTopic: string | null,
  subjectMode:   string,
): Promise<string | null> {
  try {
    const { runProgressAnalysis } = await import('../progressSystem/progressAnalyzer.js');
    const result = await runProgressAnalysis(userId);
    if (!result) return null;
    const mastery = (result as any).overallMastery ?? 0;
    return mastery > 70
      ? `You're at ${mastery}% mastery — excellent work! 🌟`
      : mastery > 40
        ? `You're at ${mastery}% mastery — keep going! 💪`
        : null;
  } catch {
    return null;
  }
}

async function _getHint(
  userId:  string,
  prompt:  string,
  intent:  string,
  strategy: string,
): Promise<string | null> {
  if (strategy !== 'HINT' && strategy !== 'GUIDE') return null;
  try {
    const { shouldGiveDirectAnswer, isStudentStuck } = await import('../aiTutor/hintGenerator.js');
    if (shouldGiveDirectAnswer(prompt)) return null;
    const stuck = isStudentStuck(prompt);
    return stuck
      ? '💡 Tip: Try breaking this into smaller steps. What part is confusing you most?'
      : '💡 Tip: Think about what you already know — the answer might be closer than you think!';
  } catch {
    return null;
  }
}

async function _getEmotionalNudge(
  userId:         string,
  emotionalState: string,
  turnCount:      number,
): Promise<string | null> {
  if (emotionalState === 'neutral' || emotionalState === 'motivated') return null;
  if (turnCount < 2) return null;

  const nudges: Record<string, string[]> = {
    frustrated: [
      '🔥 Every expert was once a beginner. You\'re doing better than you think!',
      '💪 Struggling = Learning. Your brain is literally growing right now.',
      '✨ Hard things take time. You\'ve got this — keep going!',
      '🎯 The fact that you\'re still here means you\'re stronger than the problem.',
    ],
    confused: [
      '🤔 Confusion is the first step to understanding. You\'re in the right place!',
      '💡 Try explaining what you DO understand — often the gap becomes clear.',
      '📚 No question is silly. Ask me to break it down differently!',
      '🧠 Your brain needs time to connect new ideas. Keep asking!',
    ],
  };

  const pool = nudges[emotionalState] ?? nudges.confused;
  const idx = (userId.charCodeAt(userId.length - 1) + turnCount) % pool.length;
  return pool[idx];
}

async function _getGrowthMirror(
  userId:    string,
  turnCount: number,
): Promise<GrowthMirrorData | null> {
  if (turnCount !== 0 && turnCount % 10 !== 0) return null;

  try {
    const { AskAISession } = await import('../../models/AskAISession.model.js');
    const sessions = await AskAISession.find({ userId, deletedAt: null, turnCount: { $gt: 0 } })
      .sort({ lastMessageAt: -1 })
      .limit(10)
      .select('weakTopics strongTopics detectedTopics turnCount')
      .lean();

    if (!sessions.length) return null;

    const allWeak   = [...new Set(sessions.flatMap((s: any) => s.weakTopics   || []) as string[])] as string[];
    const allStrong = [...new Set(sessions.flatMap((s: any) => s.strongTopics || []) as string[])] as string[];
    const totalTurns = sessions.reduce((acc: number, s: any) => acc + (s.turnCount || 0), 0);
    const grownTopics = allStrong.filter((t: string) => allWeak.includes(t));

    if (allStrong.length === 0 && grownTopics.length === 0) return null;

    let message = '';
    if (grownTopics.length > 0) {
      message = `You've gone from struggling with ${grownTopics.slice(0, 3).join(', ')} to mastering ${grownTopics.length === 1 ? 'it' : 'them'} — real growth! 📈`;
    } else if (allStrong.length > 0) {
      message = `You've built solid understanding in: ${allStrong.slice(0, 3).join(', ')}. Keep building on this! 💪`;
    } else if (totalTurns >= 10) {
      message = `${totalTurns} questions answered across ${sessions.length} sessions — your consistency is paying off! 🔥`;
    }

    if (!message) return null;

    return {
      grownTopics,
      strongTopics: allStrong.slice(0, 5),
      totalTurns,
      sessionCount: sessions.length,
      message,
    };
  } catch (e: any) {
    logger.debug('[AskAI Orchestrator] growthMirror failed: ' + e.message);
    return null;
  }
}

async function _getWowObservation(
  userId:        string,
  turnCount:     number,
  subjectMode:   string,
  detectedTopic: string | null,
): Promise<string | null> {
  if ((turnCount + 1) % 5 !== 0) return null;

  try {
    const { AskAISession } = await import('../../models/AskAISession.model.js');
    const sessions = await AskAISession.find({ userId, deletedAt: null, turnCount: { $gt: 0 } })
      .sort({ lastMessageAt: -1 })
      .limit(5)
      .select('detectedTopics weakTopics strongTopics textCount imageCount turnCount')
      .lean();

    if (!sessions.length) return null;

    const allTopics  = [...new Set(sessions.flatMap((s: any) => s.detectedTopics || []) as string[])] as string[];
    const allWeak    = [...new Set(sessions.flatMap((s: any) => s.weakTopics     || []) as string[])] as string[];
    const allStrong  = [...new Set(sessions.flatMap((s: any) => s.strongTopics   || []) as string[])] as string[];;
    const totalTurns = sessions.reduce((acc: number, s: any) => acc + (s.turnCount || 0), 0);
    const totalImg   = sessions.reduce((acc: number, s: any) => acc + (s.imageCount || 0), 0);

    const observations: string[] = [];

    if (subjectMode !== 'auto' && subjectMode) {
      observations.push(`You've been consistently exploring ${subjectMode} — focused practice like this is exactly how mastery happens! 🎯`);
    }
    if (allTopics.length >= 4) {
      observations.push(`You've covered ${allTopics.length} different topics so far — that's great breadth of curiosity! 🌟`);
    }
    if (totalImg >= 3) {
      observations.push(`You often use images to explain problems — that's a powerful way to communicate complex ideas! 📸`);
    }
    if (allStrong.length >= 2) {
      observations.push(`Your understanding of ${allStrong.slice(0, 2).join(' and ')} is solid — use these as stepping stones! 🏗️`);
    }
    if (allWeak.length >= 1 && totalTurns >= 8) {
      observations.push(`You keep coming back to practice even challenging topics — that's the mindset that beats 90% of students! 💪`);
    }
    if (totalTurns >= 15) {
      observations.push(`${totalTurns} questions and counting — your consistency is building a real learning habit! 🔥`);
    }
    if (detectedTopic) {
      const appearances = allTopics.filter((t: string) => t.toLowerCase().includes(detectedTopic.toLowerCase())).length;
      if (appearances >= 2) {
        observations.push(`You keep returning to ${detectedTopic} — deep focus like this is how real expertise is built! 🧠`);
      }
    }

    if (observations.length === 0) return null;
    const idx = (userId.charCodeAt(userId.length - 1) + turnCount) % observations.length;
    return observations[idx];
  } catch (e: any) {
    logger.debug('[AskAI Orchestrator] wowObservation failed: ' + e.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// detectTopicExpanded — 80+ topics (exported for aiController.ts)
// Preserved exactly from original askAIOrchestrator.ts
// ─────────────────────────────────────────────────────────────
export const EXPANDED_TOPIC_MAP: [RegExp, string, string][] = [
  [/\bloop(s)?\b|\bfor loop\b|\bwhile loop\b/i,           'loops',           'Programming'],
  [/\brecursion\b|\brecursive\b/i,                         'recursion',       'Programming'],
  [/\barray(s)?\b|\blist(s)?\b/i,                          'arrays',          'Programming'],
  [/\bsort(ing)?\b|\bbubble sort\b|\bmerge sort\b/i,       'sorting',         'Programming'],
  [/\bpointer(s)?\b/i,                                     'pointers',        'Programming'],
  [/\bclass\b|\bobject\b|\boop\b|\binheritance\b/i,        'OOP',             'Programming'],
  [/\bfunction(s)?\b|\bclosure(s)?\b/i,                    'functions',       'Programming'],
  [/\bpython\b/i,                                          'Python',          'Programming'],
  [/\bjavascript\b|\bjs\b|\bnode\.?js\b/i,                 'JavaScript',      'Programming'],
  [/\breact\b|\bnext\.?js\b/i,                             'React',           'Programming'],
  [/\bsql\b|\bdatabase\b|\bmysql\b|\bpostgres\b/i,         'databases',       'Programming'],
  [/\bgit\b|\bversion control\b|\bgithub\b/i,              'git',             'Programming'],
  [/\bapi\b|\brest api\b|\bhttp\b|\bendpoint\b/i,          'APIs',            'Programming'],
  [/\bdata structure\b|\blinked list\b|\bstack\b|\bqueue\b/i,'data structures','Programming'],
  [/\balgorithm\b|\bcomplexity\b|\bbig o\b/i,              'algorithms',      'Programming'],
  [/\bintegral\b|∫|\bderivative\b|\bdifferential\b/i,      'calculus',        'Mathematics'],
  [/\btrigonometry\b|\bsin\b|\bcos\b|\btan\b/i,            'trigonometry',    'Mathematics'],
  [/\bprobability\b|\bstatistics\b|\bbayes\b/i,            'probability',     'Mathematics'],
  [/\balgebra\b|\bequation\b|\bpolynomial\b/i,             'algebra',         'Mathematics'],
  [/\bgeometry\b|\bangle\b|\btriangle\b|\bcircle\b/i,      'geometry',        'Mathematics'],
  [/\bmatrix\b|\bdeterminant\b|\beigenvalue\b/i,           'matrices',        'Mathematics'],
  [/\bvector\b|\bscalar\b|\bdot product\b/i,               'vectors',         'Mathematics'],
  [/\bnumber system\b|\bprime\b|\bfactor\b|\bhcf\b|\blcm\b/i,'number theory', 'Mathematics'],
  [/\bpermutation\b|\bcombination\b|\bnpr\b|\bncr\b/i,     'combinatorics',   'Mathematics'],
  [/\bset(s)?\b|\bunion\b|\bintersection\b|\bvenn\b/i,     'sets',            'Mathematics'],
  [/\bsequence\b|\bseries\b|\barithmetic progression\b|\bap\b|\bgp\b/i,'sequences','Mathematics'],
  [/\bnewton(s)?\b|\bgravity\b|\bforce\b|\bmotion\b/i,     'Newtonian mechanics','Physics'],
  [/\belectricity\b|\bcircuit\b|\bohm\b|\bcurrent\b|\bvoltage\b/i,'electricity','Physics'],
  [/\blight\b|\boptics\b|\brefraction\b|\breflection\b/i,  'optics',          'Physics'],
  [/\bwave\b|\bfrequency\b|\bamplitude\b|\bsound\b/i,      'waves',           'Physics'],
  [/\bthermodynamics\b|\bheat\b|\btemperature\b|\bentropy\b/i,'thermodynamics','Physics'],
  [/\bmagnet(ism)?\b|\belectromagnet\b|\bflux\b/i,         'magnetism',       'Physics'],
  [/\batomic\b|\bnucleus\b|\bproton\b|\bneutron\b|\belectron\b/i,'atomic physics','Physics'],
  [/\brelativit(y|ies)\b|\beinstein\b|\be=mc\b/i,          'relativity',      'Physics'],
  [/\bfluid\b|\bpressure\b|\bbuoyancy\b|\barchimedes\b/i,  'fluid mechanics', 'Physics'],
  [/\bphotosynthes(is)?\b/i,                               'photosynthesis',  'Chemistry'],
  [/\bperiodic\b|\belement\b|\batom\b|\bbond\b/i,          'chemistry basics','Chemistry'],
  [/\bacid\b|\bbase\b|\bph\b|\bneutralization\b/i,         'acids & bases',   'Chemistry'],
  [/\borganic\b|\bcarbon\b|\bhydrocarbon\b|\balkane\b/i,   'organic chemistry','Chemistry'],
  [/\bmole\b|\bmolecular weight\b|\bavogadro\b/i,          'stoichiometry',   'Chemistry'],
  [/\bequilibrium\b|\ble chatelier\b/i,                    'chemical equilibrium','Chemistry'],
  [/\boxidation\b|\breduction\b|\bredox\b|\belectrolysis\b/i,'electrochemistry','Chemistry'],
  [/\bcell(s)?\b|\bcytoplasm\b|\bchlorophyll\b|\bmitochond/i,'cell biology',   'Biology'],
  [/\bdna\b|\brna\b|\bgenetic\b|\bgene\b|\bchromosome\b/i, 'genetics',        'Biology'],
  [/\bevolution\b|\bdarwin\b|\bnatural selection\b/i,       'evolution',       'Biology'],
  [/\bdigest(ion|ive)?\b|\bstomach\b|\bintestin\b/i,       'digestion',       'Biology'],
  [/\bheart\b|\bblood\b|\bcirculator(y|ion)\b/i,           'circulatory system','Biology'],
  [/\becosystem\b|\bfood chain\b|\bbiodiversity\b/i,        'ecology',         'Biology'],
  [/\bimmun(ity|e system)\b|\bantibody\b|\bvaccine\b/i,     'immunology',      'Biology'],
  [/\bnervous system\b|\bneuron\b|\bbrain\b|\bsynapse\b/i,  'neuroscience',    'Biology'],
  [/\bindependence\b|\bfreedom movement\b|\bgandhiji\b|\bnetaji\b/i,'Indian independence','History'],
  [/\bmughal\b|\bakbar\b|\baurangzeb\b|\bshahj(e|a)han\b/i,'Mughal empire',   'History'],
  [/\bmaratha\b|\bshivaji\b|\bpeshwa\b/i,                  'Maratha empire',  'History'],
  [/\bworld war\b|\bww1\b|\bww2\b|\bwwii\b|\bwwi\b/i,     'World Wars',      'History'],
  [/\bfrench revolution\b|\bnapol(eon|ean)\b/i,            'French Revolution','History'],
  [/\bindus valley\b|\bharappa\b|\bmohenjo\b/i,            'Ancient India',   'History'],
  [/\bcolonial\b|\bbritish raj\b|\beast india company\b/i, 'Colonial history','History'],
  [/\bclimate\b|\brainfall\b|\bmonsoon\b|\bweather\b/i,    'climate',         'Geography'],
  [/\bmountain\b|\bhimalaya\b|\bplateau\b|\bplain\b/i,     'landforms',       'Geography'],
  [/\briver\b|\bganga\b|\bbrahmaptur\b|\bindus\b/i,        'rivers',          'Geography'],
  [/\bcountry\b|\bcapital\b|\bcontinent\b|\bocean\b/i,     'world geography', 'Geography'],
  [/\bpopulation\b|\bcensus\b|\bdemograph\b/i,             'demographics',    'Geography'],
  [/\bsoil\b|\bagriculture\b|\bcrop\b|\bfarming\b/i,       'agriculture',     'Geography'],
  [/\bdemand\b|\bsupply\b|\bmarket\b|\belasticity\b/i,     'microeconomics',  'Economics'],
  [/\bgdp\b|\binflation\b|\bfiscal\b|\bmonetary policy\b/i,'macroeconomics',  'Economics'],
  [/\bbalance sheet\b|\bprofit\b|\bloss\b|\baccounting\b/i,'accounting',      'Commerce'],
  [/\bstock market\b|\bshare\b|\bdividend\b|\binvestment\b/i,'finance',        'Commerce'],
  [/\btax\b|\bgst\b|\bincome tax\b/i,                      'taxation',        'Commerce'],
  [/\bglobalization\b|\btrade\b|\bimport\b|\bexport\b/i,   'international trade','Economics'],
  [/\bconstitution\b|\bfundamental right\b|\bdirective\b/i,'Indian Constitution','Civics'],
  [/\bparliament\b|\blok sabha\b|\brajya sabha\b/i,        'Parliament',      'Civics'],
  [/\bdemocracy\b|\belection\b|\bvoting\b|\bpolitical\b/i, 'democracy',       'Civics'],
  [/\bsupreme court\b|\bjudiciary\b|\bhigh court\b/i,      'judiciary',       'Civics'],
  [/\bhindi grammar\b|\bsandhi\b|\bsamas\b|\bvyakaran\b/i, 'Hindi grammar',   'Hindi'],
  [/\benglish grammar\b|\btense\b|\bvoice\b|\bnarration\b/i,'English grammar', 'English'],
  [/\bjee\b|\bneet\b|\bupsc\b|\bcat\b|\bgre\b|\bgmat\b/i,  'entrance exams',  'Exam Prep'],
];

export function detectTopicExpanded(
  message:     string,
  subjectMode: string,
): { topic: string | null; subject: string | null } {
  const lower = message.toLowerCase();
  for (const [pattern, topic, subject] of EXPANDED_TOPIC_MAP) {
    if (pattern.test(lower)) return { topic, subject };
  }
  if (subjectMode && subjectMode !== 'auto') {
    return { topic: subjectMode, subject: subjectMode };
  }
  return { topic: null, subject: null };
}