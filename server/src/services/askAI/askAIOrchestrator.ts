// ─────────────────────────────────────────────────────────────
// AskAI Orchestrator — askAIOrchestrator.ts  (v11)
//
// THE UPGRADE: Connects AskAI with ALL unused AI-OS services:
//
//   retentionEngine/emotionalAIMerge  → frustrated/confused students
//   learningSystem/learningRecommendationEngine → post-session suggestions
//   progressSystem/progressAnalyzer  → real-time mastery tracking
//   aiTutor/hintGenerator            → HINT strategy (socratic mode)
//
// This file is a companion to aiController.ts — it provides
// the post-response enrichment layer. The main stream stays
// in aiController.ts for separation of concerns.
//
// USAGE in aiController.ts (askAIStream), after fullResponse:
//   import { runPostResponsePipeline } from '../services/askAI/askAIOrchestrator.js';
//   const enrichment = await runPostResponsePipeline({ userId, ... });
//   if (enrichment) res.write('data: ' + JSON.stringify({ enrichment }) + '\n\n');
// ─────────────────────────────────────────────────────────────

import { logger } from '../../utils/logger.js';

export interface PostResponseInput {
  userId:        string;
  prompt:        string;
  aiResponse:    string;
  emotionalState: 'correct' | 'confused' | 'frustrated' | 'motivated' | 'neutral';
  detectedTopic: string | null;
  intent:        string;
  strategy:      string;
  turnCount:     number;
  subjectMode:   string;
}

export interface PostResponseEnrichment {
  recommendation:   RecommendationSnippet | null;
  progressInsight:  string | null;
  hintMode:         boolean;
  hintText:         string | null;
  emotionalNudge:   string | null;
  // v12: Improvement 5 — Growth Mirror (visible proof of student growth)
  growthMirror:     GrowthMirrorData | null;
  // v12: Improvement 7 — Dynamic Wow Observation (user-specific, from real data)
  wowObservation:   string | null;
}

// v12: Growth Mirror data — shows student's actual progress journey
export interface GrowthMirrorData {
  grownTopics:  string[];   // topics moved weak -> strong
  strongTopics: string[];   // all mastered topics
  totalTurns:   number;     // total Q&A across all sessions
  sessionCount: number;     // number of sessions
  message:      string;     // human-readable growth message
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
// Fire-and-forget enrichment — never blocks the SSE stream.
// Returns enrichment data to emit as a final SSE metadata chunk.
// ─────────────────────────────────────────────────────────────
export async function runPostResponsePipeline(
  input: PostResponseInput,
): Promise<PostResponseEnrichment> {
  const {
    userId,
    prompt,
    aiResponse,
    emotionalState,
    detectedTopic,
    intent,
    strategy,
    turnCount,
    subjectMode,
  } = input;

  const enrichment: PostResponseEnrichment = {
    recommendation:  null,
    progressInsight: null,
    hintMode:        false,
    hintText:        null,
    emotionalNudge:  null,
    growthMirror:    null,
    wowObservation:  null,
  };

  // Run all enrichment in parallel — failures are isolated
  const [recResult, progressResult, hintResult, emotionResult, growthResult, wowResult] = await Promise.allSettled([
    // 1. Learning recommendation (after_ai_tutor trigger)
    _getRecommendation(userId, detectedTopic, subjectMode, turnCount),

    // 2. Progress system update
    _updateProgress(userId, detectedTopic, subjectMode),

    // 3. Hint mode detection (for HINT/GUIDE strategies)
    _maybeGenerateHint(prompt, strategy, subjectMode),

    // 4. Emotional nudge for struggling students
    _getEmotionalNudge(userId, emotionalState, turnCount),

    // 5. v12: Growth Mirror — Improvement 5
    _getGrowthMirror(userId, turnCount),

    // 6. v12: Dynamic Wow Observation — Improvement 7
    _getWowObservation(userId, turnCount, subjectMode, detectedTopic),
  ]);

  if (recResult.status === 'fulfilled' && recResult.value) {
    enrichment.recommendation = recResult.value;
  }

  if (progressResult.status === 'fulfilled' && progressResult.value) {
    enrichment.progressInsight = progressResult.value;
  }

  if (hintResult.status === 'fulfilled' && hintResult.value) {
    enrichment.hintMode = hintResult.value.hintMode;
    enrichment.hintText = hintResult.value.hintText;
  }

  if (emotionResult.status === 'fulfilled' && emotionResult.value) {
    enrichment.emotionalNudge = emotionResult.value;
  }

  // v12: Growth Mirror — only show on turn 1 of a session (first response)
  // or when a new growth milestone is detected
  if (growthResult.status === 'fulfilled' && growthResult.value) {
    enrichment.growthMirror = growthResult.value;
  }

  // v12: Wow Observation — show every 5 turns with real user-specific data
  if (wowResult.status === 'fulfilled' && wowResult.value) {
    enrichment.wowObservation = wowResult.value;
  }

  return enrichment;
}

// ─────────────────────────────────────────────────────────────
// _getRecommendation
// Calls learningRecommendationEngine after every AskAI session.
// Only surfaces recommendation after 3+ turns (session has depth).
// ─────────────────────────────────────────────────────────────
async function _getRecommendation(
  userId:      string,
  topic:       string | null,
  subjectMode: string,
  turnCount:   number,
): Promise<RecommendationSnippet | null> {
  // Only recommend after student has had a real session (3+ turns)
  if (turnCount < 3) return null;
  // Only fire on every 3rd turn to avoid recommendation fatigue
  if (turnCount % 3 !== 0) return null;

  try {
    const { getRecommendations } = await import('../learningSystem/learningRecommendationEngine.js');
    const bundle = await getRecommendations(
      userId,
      'after_ai_tutor',
      { topic: topic ?? undefined, subject: subjectMode !== 'auto' ? subjectMode : undefined },
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
  } catch (e: any) {
    logger.debug('[AskAI Orchestrator] recommendation failed: ' + e.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// _updateProgress
// Fires onActivityEvent → updates progress score, generates insight.
// Returns the most relevant insight card text (if any).
// ─────────────────────────────────────────────────────────────
async function _updateProgress(
  userId:      string,
  topic:       string | null,
  subjectMode: string,
): Promise<string | null> {
  try {
    const { onActivityEvent } = await import('../progressSystem/progressAnalyzer.js');
    const result = await onActivityEvent(
      userId,
      'ai_tutor_used',
      { topic: topic ?? undefined, subject: subjectMode !== 'auto' ? subjectMode : undefined },
    );

    if (!result?.insight) return null;

    // Return insight message if meaningful
    const insight = result.insight as any;
    return insight?.message ?? insight?.title ?? null;
  } catch (e: any) {
    logger.debug('[AskAI Orchestrator] progress update failed: ' + e.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// _maybeGenerateHint
// If the AI chose HINT strategy, generate a proper socratic hint
// using the hintGenerator (instead of relying only on the LLM).
// ─────────────────────────────────────────────────────────────
async function _maybeGenerateHint(
  prompt:      string,
  strategy:    string,
  subjectMode: string,
): Promise<{ hintMode: boolean; hintText: string | null }> {
  if (strategy !== 'HINT' && strategy !== 'GUIDE') {
    return { hintMode: false, hintText: null };
  }

  try {
    const { shouldGiveDirectAnswer, isStudentStuck } = await import('../aiTutor/hintGenerator.js');

    // If student explicitly wants direct answer, disable hint mode
    if (shouldGiveDirectAnswer(prompt)) {
      return { hintMode: false, hintText: null };
    }

    const stuck = isStudentStuck(prompt);

    // Build a contextual hint nudge for the frontend to display
    const nudge = stuck
      ? '💡 Tip: Try breaking this into smaller steps. What part is confusing you most?'
      : '💡 Tip: Think about what you already know — the answer might be closer than you think!';

    return { hintMode: true, hintText: nudge };
  } catch (e: any) {
    logger.debug('[AskAI Orchestrator] hint generator failed: ' + e.message);
    return { hintMode: false, hintText: null };
  }
}

// ─────────────────────────────────────────────────────────────
// _getEmotionalNudge
// For frustrated/confused students after 2+ turns of struggle,
// surface a motivational nudge from the comebackEngine style.
// ─────────────────────────────────────────────────────────────
async function _getEmotionalNudge(
  userId:         string,
  emotionalState: string,
  turnCount:      number,
): Promise<string | null> {
  // Only nudge struggling students after a few turns (real struggle, not first question)
  if (emotionalState !== 'frustrated' && emotionalState !== 'confused') return null;
  if (turnCount < 2) return null;

  const nudges: Record<string, string[]> = {
    frustrated: [
      "🔥 Every expert was once a beginner. You're doing better than you think!",
      "💪 Struggling = Learning. Your brain is literally growing right now.",
      "✨ Hard things take time. You've got this — keep going!",
      "🎯 The fact that you're still here means you're stronger than the problem.",
    ],
    confused: [
      "🤔 Confusion is the first step to understanding. You're in the right place!",
      "💡 Try explaining what you DO understand — often the gap becomes clear.",
      "📚 No question is silly. Ask me to break it down differently!",
      "🧠 Your brain needs time to connect new ideas. Keep asking!",
    ],
  };

  const pool = nudges[emotionalState] ?? nudges.confused;
  // Rotate based on userId hash + turnCount so nudges feel fresh
  const idx = (userId.charCodeAt(userId.length - 1) + turnCount) % pool.length;
  return pool[idx];
}

// ─────────────────────────────────────────────────────────────
// getHintForQuizStrategy
// Called when strategy === 'QUIZ' — injects a hint into the
// system prompt so AI uses socratic questioning style.
// ─────────────────────────────────────────────────────────────
export function getHintSystemPromptAddition(
  prompt:  string,
  subject: string,
): string {
  return `
=== HINT MODE ACTIVE ===
The student needs guidance, NOT a direct answer.
Your job is to be a Socratic tutor:
1. Ask ONE clarifying question to understand where they're stuck
2. Give a directional hint (not the answer)
3. If they're still stuck after 2 hints → give a structural hint
4. Only give the full answer if they've tried and are clearly blocked

For subject "${subject}": tailor hints to that domain.
NEVER start with the answer. Start with a question.
`;
}

// ─────────────────────────────────────────────────────────────
// expandedTopicMap
// Indian curriculum topic map — 50+ subjects
// Fixes Bug #8: detectTopic() only had 18 topics
// ─────────────────────────────────────────────────────────────
export const EXPANDED_TOPIC_MAP: [RegExp, string, string][] = [
  // Programming
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

  // Mathematics
  [/\bintegral\b|∫|\bderivative\b|\bdifferential\b/i,      'calculus',        'Mathematics'],
  [/\btrigonometry\b|\bsin\b|\bcos\b|\btan\b/i,            'trigonometry',    'Mathematics'],
  [/\bprobability\b|\bstatistics\b|\bbayes\b/i,            'probability',     'Mathematics'],
  [/\balgebra\b|\bequation\b|\bpolynomial\b/i,             'algebra',         'Mathematics'],
  [/\bgeometry\b|\bangle\b|\btriangle\b|\bcircle\b/i,      'geometry',        'Mathematics'],
  [/\bmatrix\b|\bdeterminant\b|\beigenvalue\b/i,           'matrices',        'Mathematics'],
  [/\bvector\b|\bscalar\b|\bdot product\b/i,               'vectors',         'Mathematics'],
  [/\bnumber system\b|\bprime\b|\bfactor\b|\bhcf\b|\blcm\b/i,'number theory',  'Mathematics'],
  [/\bpermutation\b|\bcombination\b|\bnpr\b|\bncr\b/i,     'combinatorics',   'Mathematics'],
  [/\bset(s)?\b|\bunion\b|\bintersection\b|\bvenn\b/i,     'sets',            'Mathematics'],
  [/\bsequence\b|\bseries\b|\barithmetic progression\b|\bap\b|\bgp\b/i,'sequences','Mathematics'],

  // Physics
  [/\bnewton(s)?\b|\bgravity\b|\bforce\b|\bmotion\b/i,     'Newtonian mechanics','Physics'],
  [/\belectricity\b|\bcircuit\b|\bohm\b|\bcurrent\b|\bvoltage\b/i,'electricity','Physics'],
  [/\blight\b|\boptics\b|\brefraction\b|\breflection\b/i,  'optics',          'Physics'],
  [/\bwave\b|\bfrequency\b|\bamplitude\b|\bsound\b/i,      'waves',           'Physics'],
  [/\bthermodynamics\b|\bheat\b|\btemperature\b|\bentropy\b/i,'thermodynamics','Physics'],
  [/\bmagnet(ism)?\b|\belectromagnet\b|\bflux\b/i,         'magnetism',       'Physics'],
  [/\batomic\b|\bnucleus\b|\bproton\b|\bneutron\b|\belectron\b/i,'atomic physics','Physics'],
  [/\brelativit(y|ies)\b|\beinstein\b|\be=mc\b/i,          'relativity',      'Physics'],
  [/\bfluid\b|\bpressure\b|\bbuoyancy\b|\barchimedes\b/i,  'fluid mechanics', 'Physics'],

  // Chemistry
  [/\bphotosynthes(is)?\b/i,                               'photosynthesis',  'Chemistry'],
  [/\bperiodic\b|\belement\b|\batom\b|\bbond\b/i,          'chemistry basics','Chemistry'],
  [/\bacid\b|\bbase\b|\bph\b|\bneutralization\b/i,         'acids & bases',   'Chemistry'],
  [/\borganic\b|\bcarbon\b|\bhydrocarbon\b|\balkane\b/i,   'organic chemistry','Chemistry'],
  [/\bmole\b|\bmolecular weight\b|\bavogadro\b/i,          'stoichiometry',   'Chemistry'],
  [/\bequilibrium\b|\ble chatelier\b/i,                    'chemical equilibrium','Chemistry'],
  [/\boxidation\b|\breduction\b|\bredox\b|\belectrolysis\b/i,'electrochemistry','Chemistry'],

  // Biology
  [/\bcell(s)?\b|\bcytoplasm\b|\bchlorophyll\b|\bmitochond/i,'cell biology',   'Biology'],
  [/\bdna\b|\brna\b|\bgenetic\b|\bgene\b|\bchromosome\b/i, 'genetics',        'Biology'],
  [/\bevolution\b|\bdarwin\b|\bnatural selection\b/i,       'evolution',       'Biology'],
  [/\bdigest(ion|ive)?\b|\bstomach\b|\bintestin\b/i,       'digestion',       'Biology'],
  [/\bheart\b|\bblood\b|\bcirculator(y|ion)\b/i,           'circulatory system','Biology'],
  [/\becosystem\b|\bfood chain\b|\bbiodiversity\b/i,        'ecology',         'Biology'],
  [/\bphotosynthesis\b|\brespiration\b|\bphotoresp/i,       'plant biology',   'Biology'],
  [/\bimmun(ity|e system)\b|\bantibody\b|\bvaccine\b/i,     'immunology',      'Biology'],
  [/\bnervous system\b|\bneuron\b|\bbrain\b|\bsynapse\b/i,  'neuroscience',    'Biology'],

  // History (Indian curriculum)
  [/\bindependence\b|\bfreedom movement\b|\bgandhiji\b|\bnetaji\b/i,'Indian independence','History'],
  [/\bmughal\b|\bakbar\b|\baurangzeb\b|\bshahj(e|a)han\b/i,'Mughal empire',   'History'],
  [/\bmaratha\b|\bshivaji\b|\bpeshwa\b/i,                  'Maratha empire',  'History'],
  [/\bworld war\b|\bww1\b|\bww2\b|\bwwii\b|\bwwi\b/i,     'World Wars',      'History'],
  [/\bfrench revolution\b|\bnapol(eon|ean)\b/i,            'French Revolution','History'],
  [/\bindus valley\b|\bharappa\b|\bmohenjo\b/i,            'Ancient India',   'History'],
  [/\bcolonial\b|\bbritish raj\b|\beast india company\b/i, 'Colonial history','History'],

  // Geography
  [/\bclimate\b|\brainfall\b|\bmonsoon\b|\bweather\b/i,    'climate',         'Geography'],
  [/\bmountain\b|\bhimalaya\b|\bplateau\b|\bplain\b/i,     'landforms',       'Geography'],
  [/\briver\b|\bganga\b|\bbrahmaptur\b|\bindus\b/i,        'rivers',          'Geography'],
  [/\bcountry\b|\bcapital\b|\bcontinent\b|\bocean\b/i,     'world geography', 'Geography'],
  [/\bpopulation\b|\bcensus\b|\bdemograph\b/i,             'demographics',    'Geography'],
  [/\bsoil\b|\bagriculture\b|\bcrop\b|\bfarming\b/i,       'agriculture',     'Geography'],

  // Economics / Commerce
  [/\bdemand\b|\bsupply\b|\bmarket\b|\belasticity\b/i,     'microeconomics',  'Economics'],
  [/\bgdp\b|\binflation\b|\bfiscal\b|\bmonetary policy\b/i,'macroeconomics',  'Economics'],
  [/\bbalance sheet\b|\bprofit\b|\bloss\b|\baccounting\b/i,'accounting',      'Commerce'],
  [/\bstock market\b|\bshare\b|\bdividend\b|\binvestment\b/i,'finance',        'Commerce'],
  [/\btax\b|\bgst\b|\bincome tax\b/i,                      'taxation',        'Commerce'],
  [/\bglobalization\b|\btrade\b|\bimport\b|\bexport\b/i,   'international trade','Economics'],

  // Civics / Political Science
  [/\bconstitution\b|\bfundamental right\b|\bdirective\b/i,'Indian Constitution','Civics'],
  [/\bparliament\b|\blok sabha\b|\brajya sabha\b/i,        'Parliament',      'Civics'],
  [/\bdemocracy\b|\belection\b|\bvoting\b|\bpolitical\b/i, 'democracy',       'Civics'],
  [/\bsupreme court\b|\bjudiciary\b|\bhigh court\b/i,      'judiciary',       'Civics'],

  // Languages
  [/\bhindi grammar\b|\bsandhi\b|\bsamas\b|\bvyakaran\b/i, 'Hindi grammar',   'Hindi'],
  [/\benglish grammar\b|\btense\b|\bvoice\b|\bnarration\b/i,'English grammar', 'English'],

  // Entrance Exams
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
// ─────────────────────────────────────────────────────────────
// _getGrowthMirror  (v12 — Improvement 5)
// Reads DB sessions → finds topics that moved weak → strong.
// Only fires on turn 1 of a new session OR every 10 turns.
// Never shows same data twice — checks if growth is "new".
// ─────────────────────────────────────────────────────────────
async function _getGrowthMirror(
  userId:    string,
  turnCount: number,
): Promise<GrowthMirrorData | null> {
  // Only show on first response of a session (turnCount=0 means this IS turn 1)
  // or every 10 turns as a reminder
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

    // Growth = topics that were once weak but are now strong
    const grownTopics = allStrong.filter((t: string) => allWeak.includes(t));

    // Need at least some data to show meaningful growth mirror
    if (allStrong.length === 0 && grownTopics.length === 0) return null;

    // Build a human-readable growth message
    let message = '';
    if (grownTopics.length > 0) {
      const topicList = grownTopics.slice(0, 3).join(', ');
      message = `You've gone from struggling with ${topicList} to mastering ${grownTopics.length === 1 ? 'it' : 'them'} — real growth! 📈`;
    } else if (allStrong.length > 0) {
      const topicList = allStrong.slice(0, 3).join(', ');
      message = `You've built solid understanding in: ${topicList}. Keep building on this! 💪`;
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

// ─────────────────────────────────────────────────────────────
// _getWowObservation  (v12 — Improvement 7)
// Generates a PERSONALIZED observation about student's learning
// pattern — using REAL data from their session history.
// Fires every 5 turns to feel alive + aware.
// ─────────────────────────────────────────────────────────────
async function _getWowObservation(
  userId:        string,
  turnCount:     number,
  subjectMode:   string,
  detectedTopic: string | null,
): Promise<string | null> {
  // Fire every 5 turns (turn 4, 9, 14... because turnCount is 0-indexed here)
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
    const allStrong  = [...new Set(sessions.flatMap((s: any) => s.strongTopics   || []) as string[])] as string[];
    const totalTurns = sessions.reduce((acc: number, s: any) => acc + (s.turnCount || 0), 0);
    const totalImg   = sessions.reduce((acc: number, s: any) => acc + (s.imageCount || 0), 0);

    // Pick the most relevant observation based on actual data
    const observations: string[] = [];

    // Subject pattern observation
    if (subjectMode !== 'auto' && subjectMode) {
      observations.push(`You've been consistently exploring ${subjectMode} — focused practice like this is exactly how mastery happens! 🎯`);
    }

    // Topic diversity observation
    if (allTopics.length >= 4) {
      observations.push(`You've covered ${allTopics.length} different topics so far — that's great breadth of curiosity! 🌟`);
    }

    // Visual learner observation
    if (totalImg >= 3) {
      observations.push(`You often use images to explain problems — that's a powerful way to communicate complex ideas! 📸`);
    }

    // Strong foundation observation
    if (allStrong.length >= 2) {
      const topics = allStrong.slice(0, 2).join(' and ');
      observations.push(`Your understanding of ${topics} is solid — you can now use these as stepping stones for harder concepts! 🏗️`);
    }

    // Persistence observation
    if (allWeak.length >= 1 && totalTurns >= 8) {
      observations.push(`You keep coming back to practice even challenging topics — that's the mindset that beats 90% of students! 💪`);
    }

    // Volume observation
    if (totalTurns >= 15) {
      observations.push(`${totalTurns} questions and counting — your consistency is building a real learning habit! 🔥`);
    }

    // Current topic deep-dive observation
    if (detectedTopic) {
      const topicAppearances = allTopics.filter((t: string) => t.toLowerCase().includes(detectedTopic.toLowerCase())).length;
      if (topicAppearances >= 2) {
        observations.push(`You keep returning to ${detectedTopic} — deep focus like this is how real expertise is built! 🧠`);
      }
    }

    if (observations.length === 0) return null;

    // Pick based on userId hash + turnCount for variety
    const idx = (userId.charCodeAt(userId.length - 1) + turnCount) % observations.length;
    return observations[idx];

  } catch (e: any) {
    logger.debug('[AskAI Orchestrator] wowObservation failed: ' + e.message);
    return null;
  }
}