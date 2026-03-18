/**
 * StudyEarn AI — CodeLearn Controller (TypeScript)
 * ─────────────────────────────────────────────────────────────
 * Routes handled:
 *   GET  /api/codelearn/progress/:language
 *   POST /api/codelearn/complete-section
 *   POST /api/codelearn/submit-quiz
 *   POST /api/codelearn/ai-hint
 *   POST /api/codelearn/ai-explain
 *   GET  /api/codelearn/certificate/:language
 *   POST /api/codelearn/run-code
 */

import crypto from 'crypto';
import { Request, Response } from 'express';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import { CodeProgress, CodeSubmission, CodeCertificate } from '../models/CodeLearn.model.js';
import { User } from '../models/User.model.js';
import { Activity } from '../models/Activity.model.js';
import { logger } from '../utils/logger.js';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── CONSTANTS ───────────────────────────────────────────────
const XP_SECTION_COMPLETE  = 20;
const XP_QUIZ_PERFECT      = 50;
const XP_QUIZ_PASS         = 30;
const XP_CODE_CORRECT      = 15;
const XP_HINT_PENALTY      = 5;
const QUIZ_PASS_THRESHOLD  = 70;
const TOTAL_WEEKS          = 12;

const LANG_NAMES: Record<string, string> = {
  python:     'Python Programming',
  c:          'C Programming',
  html:       'HTML Fundamentals',
  css:        'CSS Styling',
  javascript: 'JavaScript Development',
};

// ─── HELPERS ─────────────────────────────────────────────────

function getTodayIST(): string {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().split('T')[0];
}

function updateCodingStreak(progress: any): void {
  const today     = getTodayIST();
  const yesterday = new Date(Date.now() - 86_400_000);
  const yStr      = new Date(yesterday.getTime() + 5.5 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  if (progress.lastActiveDate === today) return;
  progress.currentStreak = progress.lastActiveDate === yStr
    ? progress.currentStreak + 1
    : 1;
  progress.lastActiveDate = today;
}

async function awardXPtoUser(
  userId: string,
  xp: number,
  action: string,
  detail: string,
): Promise<number> {
  try {
    const user = await User.findById(userId);
    if (!user) return 0;

    const isPremium =
      user.isPremium &&
      user.premiumExpiresAt &&
      new Date(user.premiumExpiresAt) > new Date();

    const finalXP = isPremium ? xp * 2 : xp;
    user.points  += finalXP;
    user.totalXP  = (user.totalXP || 0) + finalXP;
    await user.save();
    await Activity.create({ userId, action, details: detail, pointsEarned: finalXP });
    return finalXP;
  } catch (err: any) {
    logger.error({ err: err.message }, 'awardXPtoUser error');
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/codelearn/progress/:language
// ─────────────────────────────────────────────────────────────
export async function getProgress(req: Request, res: Response): Promise<Response> {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

  const language = req.params.language as string;
  if (!LANG_NAMES[language]) {
    return res.status(400).json({ success: false, message: 'Invalid language' });
  }

  try {
    let progress = await CodeProgress.findOne({ userId, language });

    if (!progress) {
      progress = await CodeProgress.create({
        userId, language,
        totalXP: 0, currentWeek: 1, currentSection: 1, sections: [],
      });
    }

    // Certificate: issue when all 48 sections (12 weeks × 4 sections) are completed
    // Count sections with quizScore >= 70 (actually passed)
    const passedSections = progress.sections.filter((s: any) => s.quizScore !== null && s.quizScore !== undefined && s.quizScore >= 70).length;
    const TOTAL_SECTIONS = 48; // 12 weeks × 4 sections
    if (!progress.certificateIssued && passedSections >= TOTAL_SECTIONS) {
      await issueCertificate(userId, language, progress.totalXP);
      progress.certificateIssued   = true;
      progress.certificateIssuedAt = new Date();
      await progress.save();
    }

    return res.json({
      success: true,
      progress: {
        language,
        languageName:      LANG_NAMES[language],
        totalXP:           progress.totalXP,
        currentStreak:     progress.currentStreak,
        currentWeek:       progress.currentWeek,
        currentSection:    progress.currentSection,
        sections:          progress.sections,
        certificateIssued: progress.certificateIssued,
        certificateIssuedAt: progress.certificateIssuedAt,
        startedAt:         progress.startedAt,
        percentComplete:   Math.min(
          100,
          Math.round(((progress.currentWeek - 1) / TOTAL_WEEKS) * 100),
        ),
      },
    });
  } catch (err: any) {
    logger.error({ err: err.message }, 'getProgress error');
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/codelearn/complete-section
// ─────────────────────────────────────────────────────────────
export async function completeSection(req: Request, res: Response): Promise<Response> {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

  const { language, weekNumber, sectionNumber, sectionId } = req.body;
  if (!language || !weekNumber || !sectionNumber || !sectionId) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    let progress = await CodeProgress.findOne({ userId, language });
    if (!progress) progress = await CodeProgress.create({ userId, language });

    const existing = progress.sections.find((s: any) => s.sectionId === sectionId);
    if (existing?.completed) {
      return res.json({ success: true, alreadyComplete: true, xpEarned: 0 });
    }

    if (existing) {
      existing.completed   = true;
      existing.completedAt = new Date();
      existing.xpEarned    = XP_SECTION_COMPLETE;
    } else {
      progress.sections.push({
        sectionId, weekNumber, sectionNumber,
        completed: true, xpEarned: XP_SECTION_COMPLETE, completedAt: new Date(),
      } as any);
    }

    progress.totalXP += XP_SECTION_COMPLETE;
    updateCodingStreak(progress);
    progress.lastUpdatedAt = new Date();
    await progress.save();

    const awarded = await awardXPtoUser(
      userId, XP_SECTION_COMPLETE, 'codelearn_section',
      `Completed ${LANG_NAMES[language]} — Week ${weekNumber} Section ${sectionNumber}`,
    );

    return res.json({
      success: true,
      xpEarned: awarded,
      totalXP: progress.totalXP,
      currentStreak: progress.currentStreak,
      message: `Section complete! +${awarded} XP 🔥`,
    });
  } catch (err: any) {
    logger.error({ err: err.message }, 'completeSection error');
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/codelearn/submit-quiz
// ─────────────────────────────────────────────────────────────
export async function submitQuiz(req: Request, res: Response): Promise<Response> {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

  const { language, weekNumber, sectionNumber, sectionId, score, totalQuestions } = req.body;
  if (!language || !sectionId || score === undefined || !totalQuestions) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const percentScore = Math.round((score / totalQuestions) * 100);
  const passed       = percentScore >= QUIZ_PASS_THRESHOLD;

  try {
    let progress = await CodeProgress.findOne({ userId, language });
    if (!progress) progress = await CodeProgress.create({ userId, language });

    let section: any = progress.sections.find((s: any) => s.sectionId === sectionId);
    if (!section) {
      progress.sections.push({
        sectionId, weekNumber, sectionNumber, completed: false, xpEarned: 0,
      } as any);
      section = progress.sections[progress.sections.length - 1];
    }

    section.quizAttempts = (section.quizAttempts || 0) + 1;

    let xpEarned = 0;
    const isFirstPass = !section.quizScore || section.quizScore < QUIZ_PASS_THRESHOLD;

    if (passed && isFirstPass) {
      xpEarned           = percentScore === 100 ? XP_QUIZ_PERFECT : XP_QUIZ_PASS;
      section.quizScore  = percentScore;
      section.completed  = true;
      section.completedAt = new Date();
      section.xpEarned   = (section.xpEarned || 0) + xpEarned;
      progress.totalXP  += xpEarned;

      // Advance current position tracking
      if (weekNumber >= progress.currentWeek) {
        if (sectionNumber >= progress.currentSection) {
          progress.currentSection = sectionNumber + 1;
        }
        // If section 4 of any week is passed, advance to next week
        if (sectionNumber >= 4) {
          progress.currentWeek = Math.max(progress.currentWeek, weekNumber + 1);
          progress.currentSection = 1;
        }
      }
    } else if (passed) {
      section.quizScore = Math.max(section.quizScore || 0, percentScore);
    }

    updateCodingStreak(progress);
    progress.lastUpdatedAt = new Date();
    await progress.save();

    let finalXP = 0;
    if (xpEarned > 0) {
      finalXP = await awardXPtoUser(
        userId, xpEarned, 'codelearn_quiz',
        `Quiz passed: ${LANG_NAMES[language]} W${weekNumber}S${sectionNumber} — ${percentScore}%`,
      );
    }

    return res.json({
      success: true,
      passed,
      percentScore,
      xpEarned: finalXP,
      totalXP: progress.totalXP,
      currentStreak: progress.currentStreak,
      message: passed
        ? `Quiz passed! ${percentScore}% — +${finalXP} XP 🎉`
        : `${percentScore}% — Need ${QUIZ_PASS_THRESHOLD}% to unlock next section. Try again!`,
      nextUnlocked: passed,
    });
  } catch (err: any) {
    logger.error({ err: err.message }, 'submitQuiz error');
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/codelearn/ai-hint
// ─────────────────────────────────────────────────────────────
export async function getAIHint(req: Request, res: Response): Promise<Response> {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

  const { language, sectionId, code, taskDescription } = req.body;
  if (!language || !taskDescription) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    const prompt = `You are a friendly coding tutor for ${LANG_NAMES[language]}.

Task the student is trying to complete: "${taskDescription}"

Student's current code:
\`\`\`${language}
${code || '(no code written yet)'}
\`\`\`

Give ONE helpful hint that nudges them in the right direction WITHOUT giving the full solution.
- Be encouraging and friendly
- Keep it under 3 sentences
- Use simple language suitable for beginners
- If their code has a specific bug, point to the line/concept (not the fix)
- End with a question that makes them think`;

    const response = await groq.chat.completions.create({
      model:       'llama-3.3-70b-versatile',
      messages:    [{ role: 'user', content: prompt }],
      max_tokens:  200,
      temperature: 0.7,
    });

    const hint = response.choices[0]?.message?.content?.trim() || 'Think about the syntax carefully!';

    await awardXPtoUser(userId, -XP_HINT_PENALTY, 'codelearn_hint', `AI hint used in ${language}`);
    await CodeSubmission.create({
      userId,
      language,
      sectionId: sectionId || 'unknown',
      code:      code || '',
      isCorrect:  false,
      aiHintUsed: true,
      xpEarned:  -XP_HINT_PENALTY,
    });

    return res.json({
      success: true,
      hint,
      xpPenalty: XP_HINT_PENALTY,
      message:   `Hint used! -${XP_HINT_PENALTY} XP`,
    });
  } catch (err: any) {
    logger.error({ err: err.message }, 'getAIHint error');
    return res.status(500).json({ success: false, message: 'Could not get hint. Try again.' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/codelearn/ai-explain
// ─────────────────────────────────────────────────────────────
export async function getAIExplain(req: Request, res: Response): Promise<Response> {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

  const { language, code, concept } = req.body;

  try {
    const prompt = code
      ? `You are a friendly ${LANG_NAMES[language]} tutor for Indian students.

Explain this code in simple terms (use Hinglish if helpful):
\`\`\`${language}
${code}
\`\`\`

Explain line by line what it does. Keep it beginner-friendly.
Format: Short explanation first, then line-by-line breakdown.`
      : `You are a friendly ${LANG_NAMES[language]} tutor for Indian students.

Explain this concept in simple terms: "${concept}"

Keep it beginner-friendly. Use a real-world analogy. Max 150 words.`;

    const response = await groq.chat.completions.create({
      model:       'llama-3.3-70b-versatile',
      messages:    [{ role: 'user', content: prompt }],
      max_tokens:  400,
      temperature: 0.6,
    });

    const explanation = response.choices[0]?.message?.content?.trim();
    return res.json({ success: true, explanation });
  } catch (err: any) {
    logger.error({ err: err.message }, 'getAIExplain error');
    return res.status(500).json({ success: false, message: 'Could not explain. Try again.' });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/codelearn/certificate/:language
// ─────────────────────────────────────────────────────────────
export async function getCertificate(req: Request, res: Response): Promise<Response> {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

  const language = req.params.language as string;

  try {
    // Check if already issued
    let cert = await CodeCertificate.findOne({ userId, language });

    // Auto-issue: check if student completed all 48 sections
    if (!cert) {
      const progress = await CodeProgress.findOne({ userId, language });
      if (progress) {
        const completedCount = progress.sections.filter((s: any) => s.completed).length;
        const passedCount    = progress.sections.filter(
          (s: any) => s.quizScore != null && s.quizScore >= 70
        ).length;

        // Issue certificate if all 48 sections completed OR all 48 quizzes passed
        if (completedCount >= 48 || passedCount >= 48) {
          cert = (await issueCertificate(userId, language, progress.totalXP)) as any;
          if (cert) {
            await CodeProgress.updateOne(
              { userId, language },
              { certificateIssued: true, certificateIssuedAt: new Date() }
            );
          }
        }

        if (!cert) {
          return res.status(404).json({
            success: false,
            message: 'Certificate not earned yet. Complete the full course!',
            progress: {
              sectionsCompleted: completedCount,
              quizzesPassed:     passedCount,
              totalNeeded:       48,
            },
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: 'No progress found. Start the course first!',
        });
      }
    }

    const user = await User.findById(userId).select('name email').lean();

    return res.json({
      success: true,
      certificate: {
        certificateId:       cert.certificateId,
        userName:            cert.userName,
        language:            cert.language,
        languageDisplayName: cert.languageDisplayName,
        totalXP:             cert.totalXP,
        issuedAt:            cert.issuedAt,
        studentEmail:        (user as any)?.email,
      },
    });
  } catch (err: any) {
    logger.error({ err: err.message }, 'getCertificate error');
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/codelearn/run-code
// ─────────────────────────────────────────────────────────────
export async function runCode(req: Request, res: Response): Promise<Response> {
  // Auth optional — anyone can run code (no XP awarded if not logged in)
  const userId = getUserIdFromToken(req);

  const { language, code, stdin = '', expectedOutput, sectionId } = req.body;
  if (!language || !code) {
    return res.status(400).json({ success: false, message: 'Code required' });
  }

  // HTML/CSS — no server execution needed
  if (language === 'html' || language === 'css') {
    return res.json({ success: true, output: 'HTML/CSS: Preview in browser', isCorrect: true, xpEarned: 0 });
  }

  // Piston API — free, no auth, runs on server (no CORS issues)
  const PISTON_LANG: Record<string, { language: string; version: string }> = {
    python:     { language: 'python',     version: '3.10.0'  },
    c:          { language: 'c',          version: '10.2.0'  },
    cpp:        { language: 'c++',        version: '10.2.0'  },
    javascript: { language: 'javascript', version: '18.15.0' },
  };

  const pistonLang = PISTON_LANG[language];
  if (!pistonLang) {
    return res.json({ success: true, output: `${language}: not supported`, isCorrect: null, xpEarned: 0 });
  }

  // Generate smart stdin based on code content (avoid scanf hangs)
  const smartStdin = (() => {
    if (language === 'python' || language === 'javascript') return stdin;
    const scanfCount = (code.match(/scanf\s*\(/g) || []).length;
    const fgetsCount = (code.match(/fgets\s*\(/g) || []).length;
    if (scanfCount === 0 && fgetsCount === 0) return '';
    if (code.includes('1234') && code.includes('pin')) return '1234\n5000\n';
    if (code.includes('choice') && code.includes('scanf')) return '1\n10\n5\n0\n';
    if (code.includes('secret') && code.includes('guess')) return '42\n';
    const inputs: string[] = [];
    const fmtRe = /scanf\s*\(\s*["'](.*?)["']/g;
    let m;
    while ((m = fmtRe.exec(code)) !== null) {
      const fmt = m[1];
      if (fmt.includes('%d') || fmt.includes('%i')) inputs.push('10');
      else if (fmt.includes('%f') || fmt.includes('%lf')) inputs.push('3.14');
      else if (fmt.includes('%c')) inputs.push('A');
      else if (fmt.includes('%s')) inputs.push('Rahul');
      else inputs.push('5');
    }
    for (let i = 0; i < fgetsCount; i++) inputs.push('Rahul Sharma');
    return inputs.slice(0, 10).join('\n') + '\n';
  })();

  // Try Piston first (fast, real compiler), fallback to AI simulation
  const PISTON_URLS = [
    'https://emkc.org/api/v2/piston/execute',
    'https://piston.harfan.me/api/v2/execute',
  ];

  let pistonOutput: string | null = null;
  let pistonError  = false;
  let pistonCorrect = false;

  for (const pistonUrl of PISTON_URLS) {
    try {
      const pistonRes = await fetch(pistonUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language:        pistonLang.language,
          version:         pistonLang.version,
          files:           [{ name: `main.${language === 'javascript' ? 'js' : language}`, content: code }],
          stdin:           smartStdin,
          run_timeout:     8000,
          compile_timeout: 15000,
        }),
      });

      if (!pistonRes.ok) continue;

      const data = await pistonRes.json() as any;
      const compileErr = data.compile?.stderr?.trim() || '';
      const runOut     = data.run?.stdout?.trim()    || '';
      const runErr     = data.run?.stderr?.trim()    || '';
      const exitCode   = data.run?.code ?? 0;

      if (compileErr) {
        pistonOutput = 'Compile Error:\n' + compileErr
          .replace(/\/tmp\/[^:]+:/g, 'line ')
          .replace(/\/piston\/jobs\/[^:]+:/g, '');
        pistonError = true;
      } else {
        pistonOutput = runOut;
        if (runErr) pistonOutput += (pistonOutput ? '\n' : '') + runErr;
        if (!pistonOutput) pistonOutput = '(No output — check if printf is present)';
        if (exitCode !== 0 && exitCode !== null) pistonOutput += `\n[Exit code: ${exitCode}]`;
        pistonCorrect = !compileErr && exitCode === 0;
      }
      break; // Piston worked!
    } catch (err: any) {
      logger.warn({ pistonUrl, err: err.message }, 'Piston URL failed, trying next');
      continue;
    }
  }

  // If Piston worked, return result
  if (pistonOutput !== null) {
    const isCorrect = expectedOutput ? pistonOutput.trim() === expectedOutput.trim() : pistonCorrect;
    let xpEarned = 0;
    if (isCorrect && sectionId && userId) {
      xpEarned = await awardXPtoUser(userId, XP_CODE_CORRECT, 'codelearn_code', `Correct code in ${language}`);
      await CodeSubmission.create({ userId, language, sectionId, code, isCorrect: true, aiHintUsed: false, xpEarned });
    }
    return res.json({ success: true, output: pistonOutput, isCorrect, xpEarned });
  }

  // Piston failed — use Groq AI to simulate execution
  logger.warn('All Piston URLs failed, using Groq AI fallback for code execution');
  try {
    const prompt = `You are a ${language.toUpperCase()} compiler and runtime simulator. Execute the following code and output ONLY what the program would print to stdout.\n\nRules:\n- Output EXACTLY what printf/puts/cout would print — no extra text\n- For scanf/input: use these sample inputs in order: 10, 3.14, A, Rahul, 5, 20, 100\n- Special: if code has "1234" + "pin" use pin=1234 amount=5000; if "choice" use choice=1; if "secret"/"guess" use 42\n- If compile error, output: "Compile Error:" then the error\n- No explanations, no markdown — raw output only\n\n${language.toUpperCase()} Code:\n${code}`;

    const aiData  = await groq.chat.completions.create({
      model:       'llama-3.3-70b-versatile',
      max_tokens:  500,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }],
    });
    const aiOut   = aiData.choices?.[0]?.message?.content?.trim() || '(No output)';
    const isError = aiOut.startsWith('Compile Error') || aiOut.startsWith('Error:');

    const isCorrect = expectedOutput ? aiOut.trim() === expectedOutput.trim() : !isError;
    let xpEarned = 0;
    if (isCorrect && sectionId && userId) {
      xpEarned = await awardXPtoUser(userId, XP_CODE_CORRECT, 'codelearn_code', `Correct code in ${language}`);
      await CodeSubmission.create({ userId, language, sectionId, code, isCorrect: true, aiHintUsed: false, xpEarned });
    }

    return res.json({ success: true, output: aiOut, isCorrect, xpEarned });

  } catch (aiErr: any) {
    logger.error({ err: aiErr.message }, 'Groq AI fallback also failed');
    return res.json({
      success: true,
      output: 'Compiler temporarily unavailable.\nFree alternatives: onlinegdb.com / godbolt.org',
      isCorrect: null,
      xpEarned: 0,
    });
  }
}

// ─────────────────────────────────────────────────────────────
// PRIVATE — Issue certificate
// ─────────────────────────────────────────────────────────────
async function issueCertificate(userId: string, language: string, totalXP: number) {
  try {
    const user     = await User.findById(userId).select('name').lean();
    const existing = await CodeCertificate.findOne({ userId, language });
    if (existing) return existing;

    const certId = crypto
      .createHash('sha256')
      .update(`${userId}-${language}-${Date.now()}`)
      .digest('hex')
      .substring(0, 16)
      .toUpperCase();

    const cert = await CodeCertificate.create({
      userId,
      userName:            (user as any)?.name || 'Student',
      language,
      languageDisplayName: LANG_NAMES[language],
      totalXP,
      certificateId: certId,
    });

    await awardXPtoUser(userId, 500, 'codelearn_certificate', `Completed full ${LANG_NAMES[language]} course! 🎓`);
    logger.info(`Certificate issued: ${(user as any)?.name} — ${LANG_NAMES[language]} — ID: ${certId}`);
    return cert;
  } catch (err: any) {
    logger.error({ err: err.message }, 'issueCertificate error');
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/codelearn/translate-content
// Body: { content: string, targetLang: 'en' | 'hi' }
// Groq se content translate karo (EN only — HI is native)
// Frontend caches result in localStorage to avoid repeat calls
// ─────────────────────────────────────────────────────────────
export async function translateContent(req: Request, res: Response): Promise<Response> {
  const { content, targetLang, sectionId } = req.body;

  if (!content || !targetLang) {
    return res.status(400).json({ success: false, message: 'content and targetLang required' });
  }

  // Hinglish is the native language — no translation needed
  if (targetLang === 'hi') {
    return res.json({ success: true, translated: content, cached: false });
  }

  try {
    const prompt = `You are a technical content translator. Translate the following Python course content from Hinglish (Hindi-English mix) to clear, simple English.

Rules:
- Keep all code examples EXACTLY as-is (do not translate code)
- Keep markdown formatting (##, ###, **, \`, lists) exactly the same
- Keep all emoji as-is
- Only translate the explanation text from Hinglish to English
- Keep it beginner-friendly and clear
- Do NOT add or remove any sections

Content to translate:
${content}

Return ONLY the translated content, no preamble.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const translated = response.choices[0]?.message?.content?.trim() || content;

    return res.json({
      success: true,
      translated,
      sectionId: sectionId || null,
    });
  } catch (err: any) {
    logger.error({ err: err.message }, 'translateContent error');
    // Fallback: return original content if translation fails
    return res.json({ success: true, translated: content, error: true });
  }
}