/**
 * StudyEarn AI — CodeLearn Routes (TypeScript)
 * ─────────────────────────────────────────────────────────────
 * Mount in server/src/index.ts:
 *   import codelearnRoutes from './routes/codelearnRoutes.js';
 *   app.use('/api/codelearn', codelearnRoutes);
 */
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getProgress,
  completeSection,
  submitQuiz,
  getAIHint,
  getAIExplain,
  runCode,
  getCertificate,
  translateContent,
} from '../controllers/codelearnController.js';

const router = Router();

// Rate limiter — AI endpoints
const codelearnAILimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { success: false, message: '⏳ Too many requests. Please slow down.' },
});

// Rate limiter — code execution
const codeRunLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { success: false, message: '⏳ Too many code runs. Please wait a moment.' },
});

// Progress
router.get('/progress/:language', getProgress);

// Learning actions
router.post('/complete-section', completeSection);
router.post('/submit-quiz',      submitQuiz);

// AI features
router.post('/ai-hint',    codelearnAILimiter, getAIHint);
router.post('/ai-explain', codelearnAILimiter, getAIExplain);

// Code execution
router.post('/run-code', codeRunLimiter, runCode);

// Certificate
router.get('/certificate/:language', getCertificate);

// Content translation (EN/HI)
router.post('/translate-content', codelearnAILimiter, translateContent);

export default router;