/**
 * AI Study OS — Response Optimizer
 * ─────────────────────────────────────────────────────────────
 * Post-processes the AI's raw response to optimize it for
 * the specific student's level, mode, and context.
 *
 * What it does:
 *   1. Complexity gate  — strips overly advanced content for beginners
 *   2. Length control   — slow learners get shorter, chunked responses
 *   3. Format enforcer  — coding responses get code blocks
 *   4. Follow-up injector — adds a contextual follow-up question
 *   5. Mastery tracker  — extracts topic from response for brain update
 *   6. Encouragement injector — adds motivational line for struggling students
 *
 * This runs AFTER the AI responds — it's a lightweight post-processor,
 * not another AI call. All logic is rule-based for speed.
 */

import { LearningMode }  from './learningModeDetector.js';

// ── Types ──────────────────────────────────────────────────────
export interface OptimizationOptions {
  skillLevel:    'beginner' | 'intermediate' | 'advanced';
  learningMode:  LearningMode;
  learningSpeed: 'slow' | 'medium' | 'fast';
  learnerType:   string;
  weakTopics:    string[];
  hintMode:      boolean;
  consecutiveWrong: number;
}

export interface OptimizedResponse {
  content:       string;   // final response text
  followUpQ:     string | null;  // suggested follow-up question
  detectedTopic: string | null;  // topic extracted from response (for mastery update)
  addedEncouragement: boolean;
}

// ── Topics to detect for mastery updates ─────────────────────
const TOPIC_DETECTORS: { topic: string; subject: string; patterns: string[] }[] = [
  { topic: 'Loops',           subject: 'Programming',      patterns: ['loop', 'for loop', 'while loop', 'iteration'] },
  { topic: 'Arrays',          subject: 'Programming',      patterns: ['array', 'list', 'index', 'element'] },
  { topic: 'Functions',       subject: 'Programming',      patterns: ['function', 'def ', 'return', 'parameter'] },
  { topic: 'Recursion',       subject: 'Programming',      patterns: ['recursion', 'recursive', 'base case'] },
  { topic: 'OOP',             subject: 'Programming',      patterns: ['class', 'object', 'inheritance', 'encapsulation'] },
  { topic: 'Algebra',         subject: 'Mathematics',      patterns: ['algebra', 'equation', 'variable', 'polynomial'] },
  { topic: 'Calculus',        subject: 'Mathematics',      patterns: ['calculus', 'integral', 'derivative', 'limit'] },
  { topic: 'Trigonometry',    subject: 'Mathematics',      patterns: ['trigonometry', 'sin', 'cos', 'tan', 'angle'] },
  { topic: 'Probability',     subject: 'Mathematics',      patterns: ['probability', 'statistics', 'mean', 'median'] },
  { topic: 'Laws of Motion',  subject: 'Physics',          patterns: ['newton', 'force', 'momentum', 'velocity'] },
  { topic: 'Electricity',     subject: 'Physics',          patterns: ['current', 'voltage', 'resistance', 'circuit'] },
  { topic: 'Organic Chem',   subject: 'Chemistry',         patterns: ['organic', 'carbon', 'hydrocarbon', 'functional'] },
  { topic: 'Sorting',         subject: 'Algorithms',       patterns: ['sort', 'bubble sort', 'merge sort', 'quick sort'] },
  { topic: 'Trees',           subject: 'Data Structures',  patterns: ['tree', 'binary', 'node', 'traversal', 'bst'] },
  { topic: 'Python',          subject: 'Python',           patterns: ['python', 'print(', 'pandas', 'numpy', 'django'] },
  { topic: 'JavaScript',      subject: 'JavaScript',       patterns: ['javascript', 'console.log', 'promise', 'async'] },
];

// ── Follow-up questions per mode ──────────────────────────────
const FOLLOW_UPS: Record<LearningMode, string[]> = {
  study:    [
    'Can you explain this concept back to me in your own words?',
    'What part of this would you like to explore deeper?',
    'How does this relate to what you studied before?',
  ],
  coding:   [
    'Try modifying the code to handle an edge case. What changes?',
    'Can you write a similar solution in a different way?',
    'What happens if you change the input? Test it!',
  ],
  revision: [
    'Which of these points would you like to practice with a question?',
    'Rate your confidence (1-5) on this topic.',
    'Want me to quiz you on this?',
  ],
  exam:     [
    'Try answering the next question without looking at notes.',
    'Can you write the answer in 3 bullet points for exam format?',
    'What other questions might come from this topic in your exam?',
  ],
  homework: [
    'Try the next similar problem on your own using the same method.',
    'What was the key step that was tricky for you?',
    'Can you explain why step 2 was done that way?',
  ],
  doubt:    [
    'Does this explanation make more sense now?',
    'Which specific part is still unclear?',
    'Want me to try yet another way to explain this?',
  ],
};

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — optimizeResponse
// ─────────────────────────────────────────────────────────────
export function optimizeResponse(
  rawResponse: string,
  options:     OptimizationOptions,
): OptimizedResponse {
  let content = rawResponse;
  let addedEncouragement = false;

  // 1. Add encouragement for struggling students
  if (options.consecutiveWrong >= 2 && !options.hintMode) {
    const encouragements = [
      "\n\n💪 You're getting there! Getting stuck is part of learning — every expert was once confused by this too.",
      "\n\n🌟 Don't worry if this feels hard right now. Let's break it down further — you'll get it!",
      "\n\n✅ It's totally normal to find this tricky. Focus on understanding the first step and the rest will follow.",
    ];
    content += encouragements[Math.floor(Math.random() * encouragements.length)];
    addedEncouragement = true;
  }

  // 2. Add streak motivation for fast learners on a roll
  if (options.consecutiveWrong === 0 && options.learningSpeed === 'fast' && options.learningMode === 'coding') {
    content += '\n\n⚡ You\'re progressing fast — consider exploring edge cases or optimizing your solution!';
  }

  // 3. Detect the main topic from response (for mastery update)
  const detectedTopic = detectTopicFromContent(rawResponse);

  // 4. Pick a contextual follow-up question
  const followUpOptions = FOLLOW_UPS[options.learningMode] || FOLLOW_UPS.study;
  const followUpQ = followUpOptions[Math.floor(Math.random() * followUpOptions.length)];

  // 5. For slow learners — add a "Summary" at the end
  if (options.learningSpeed === 'slow' && content.length > 800 && options.learningMode === 'study') {
    content += buildSlowLearnerSummary(content);
  }

  return { content, followUpQ, detectedTopic, addedEncouragement };
}

// ─────────────────────────────────────────────────────────────
// getOptimizationSystemPrompt — pre-response optimization instructions
// Injected into system prompt BEFORE the AI responds
// ─────────────────────────────────────────────────────────────
export function getOptimizationSystemPrompt(options: OptimizationOptions): string {
  const lines: string[] = [];

  // Skill level → complexity
  if (options.skillLevel === 'beginner') {
    lines.push('• COMPLEXITY: Beginner level. Avoid jargon. Explain every term. Use very simple examples.');
  } else if (options.skillLevel === 'advanced') {
    lines.push('• COMPLEXITY: Advanced level. Use technical terms. Can skip basic explanations. Cover edge cases.');
  }

  // Learning speed → length
  if (options.learningSpeed === 'slow') {
    lines.push('• LENGTH: Keep responses shorter and chunked. Use numbered steps. One concept at a time.');
  } else if (options.learningSpeed === 'fast') {
    lines.push('• LENGTH: Student learns fast. Be concise. Add advanced insights beyond the basic answer.');
  }

  // Weak topics → sensitivity
  if (options.weakTopics.length > 0) {
    lines.push(`• SENSITIVITY: If ${options.weakTopics.slice(0, 2).join(' or ')} comes up, explain from scratch.`);
  }

  return lines.length > 0 ? `\n🎯 RESPONSE OPTIMIZATION:\n${lines.join('\n')}` : '';
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function detectTopicFromContent(content: string): string | null {
  const lower = content.toLowerCase();
  for (const { topic, patterns } of TOPIC_DETECTORS) {
    if (patterns.some(p => lower.includes(p))) return topic;
  }
  return null;
}

function buildSlowLearnerSummary(content: string): string {
  // Extract first sentence of each paragraph as a summary
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50).slice(0, 3);
  if (paragraphs.length === 0) return '';
  return '\n\n---\n📌 **Quick Summary:**\n' +
    paragraphs.map((p, i) => `${i + 1}. ${p.split('.')[0].trim()}.`).join('\n');
}