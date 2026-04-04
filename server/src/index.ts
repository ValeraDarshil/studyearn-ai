// // ─── DOTENV: Sabse pehle — env vars load karo ────────────────
// import dotenv from 'dotenv';
// dotenv.config();
// // ─────────────────────────────────────────────────────────────

// // ─── SENTRY: Dotenv ke baad, baaki sab se pehle ──────────────
// import './instrument.js';
// // ─────────────────────────────────────────────────────────────

// /**
//  * StudyEarn AI — Server Entry Point
//  */

// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import compression from 'compression';
// import codelearnRoutes from './routes/codelearnRoutes.js';

// /* ─── 1. ENV VALIDATION ─────────────────────────────────── */
// const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET', 'GROQ_API_KEY'];
// const missing      = REQUIRED_ENV.filter(key => !process.env[key]);
// if (missing.length > 0) {
//   console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
//   console.error('   Copy server/.env.example to server/.env and fill in all values.');
//   process.exit(1);
// }

// /* ─── 2. IMPORTS ────────────────────────────────────────── */
// import { connectDB }     from './config/db.js';
// import { logger }        from './utils/logger.js';
// import { globalLimiter } from './middleware/rateLimiter.js';
// import { errorHandler }  from './middleware/errorHandler.js';

// import authRoutes        from './auth.js';
// import userRoutes        from './user-routes.js';
// import leaderboardRoutes from './leaderboard-routes.js';

// import aiRoutes          from './routes/aiRoutes.js';
// import pptRoutes         from './routes/pptRoutes.js';
// import pdfRoutes         from './routes/pdfRoutes.js';
// import rewardsRoutes     from './routes/rewardsRoutes.js';
// import chatRoutes        from './routes/chatRoutes.js';
// import studyToolsRoutes  from './routes/studyToolsRoutes.js';
// import notesRoutes       from './routes/notesRoutes.js';

// import { fixStuckRedemptions, processPendingPremiums } from './controllers/rewardsController.js';

// /* ─── 3. PROCESS ERROR HANDLERS ────────────────────────── */
// process.on('unhandledRejection', (reason: any) => {
//   logger.error({ err: reason?.message || reason }, 'Unhandled Promise Rejection');
// });
// process.on('uncaughtException', (err: Error) => {
//   logger.error({ err: err.message, stack: err.stack || '' }, 'Uncaught Exception');
//   setTimeout(() => process.exit(1), 1000);
// });

// /* ─── 4. EXPRESS SETUP ──────────────────────────────────── */
// const app  = express();
// const PORT = process.env.PORT || 5000;

// /* ─── 5. CORS ───────────────────────────────────────────── */
// const ALLOWED_ORIGINS = [
//   'https://studyearnai.tech',
//   'https://www.studyearnai.tech',
//   'http://localhost:5173',
//   'http://localhost:5174',
//   'https://studyearn-ai.vercel.app',
//   process.env.FRONTEND_URL,
// ].filter(Boolean) as string[];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
//     callback(new Error(`CORS: Origin ${origin} not allowed`));
//   },
//   credentials: true,
// }));

// app.use(helmet({
//   crossOriginResourcePolicy: { policy: 'cross-origin' },
//   contentSecurityPolicy: false,
// }));

// app.use(compression());

// /* ─── 6. MIDDLEWARE ─────────────────────────────────────── */
// app.set('trust proxy', 1);
// app.use(globalLimiter);
// app.use(express.json({ limit: '20mb' }));

// /* ─── 7. HEALTH CHECK ───────────────────────────────────── */
// app.get('/health', (_req, res) => {
//   res.json({ status: 'ok', port: PORT });
// });

// /* ─── 8. ROUTES ─────────────────────────────────────────── */
// app.use('/api/auth',        authRoutes);
// app.use('/api/user',        userRoutes);
// app.use('/api/leaderboard', leaderboardRoutes);
// app.use('/api/ai',          aiRoutes);
// app.use('/api/ppt',         pptRoutes);
// app.use('/api',             pdfRoutes);
// app.use('/api/rewards',     rewardsRoutes);
// app.use('/api/chat',        chatRoutes);
// app.use('/api/study',       studyToolsRoutes);
// app.use('/api/notes',       notesRoutes);
// app.use('/api/codelearn',   codelearnRoutes);

// /* ─── 9. GLOBAL ERROR HANDLER (SABSE LAST) ─────────────── */
// app.use(errorHandler);

// /* ─── 10. SERVER START ──────────────────────────────────── */
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     logger.info(`🚀 Server running on port ${PORT}`);
//     logger.info('✅ AI Ready   (Groq + OpenRouter)');
//     logger.info('✅ PPT Ready  (pptxgenjs)');
//     logger.info('✅ PDF Ready  (pdf-lib + sharp)');
//     logger.info('✅ Auth Ready (JWT + bcrypt)');
//     logger.info('✅ Sentry Ready (error tracking)');
//   });

//   fixStuckRedemptions()
//     .then(() => processPendingPremiums())
//     .catch((e: unknown) => logger.error({ err: e }, 'background task failed'));

//   setInterval(processPendingPremiums, 5 * 60 * 1000);
// });









// // ─── DOTENV: Sabse pehle — env vars load karo ────────────────
// import dotenv from 'dotenv';
// dotenv.config();
// // ─────────────────────────────────────────────────────────────

// // ─── SENTRY: Dotenv ke baad, baaki sab se pehle ──────────────
// import './instrument.js';
// // ─────────────────────────────────────────────────────────────

// /**
//  * AI Study OS — Server Entry Point
//  * ─────────────────────────────────────────────────────────────
//  * Yeh file SIRF yeh kaam karti hai:
//  *   1. ENV validation
//  *   2. Express setup + middleware
//  *   3. Routes mount karna
//  *   4. DB connect karna
//  *   5. Server start karna
//  *   6. Background jobs (premium polling)
//  *
//  * Business logic KABHI yahan nahi hogi.
//  * Saari logic in folders mein hai:
//  *   controllers/ → request/response handle karna
//  *   services/    → AI, PPT, PDF operations
//  *   routes/      → URL to controller mapping
//  *   middleware/  → auth, rate limit, validation, error
//  *   models/      → MongoDB schemas
//  *   config/      → DB connection
//  *   utils/       → logger aur shared helpers
//  */

// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import compression from 'compression';
// import codelearnRoutes from './routes/codelearnRoutes.js';

// /* ─── 1. ENV VALIDATION ─────────────────────────────────── */
// const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET', 'GROQ_API_KEY'];
// const missing      = REQUIRED_ENV.filter(key => !process.env[key]);
// if (missing.length > 0) {
//   console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
//   console.error('   Copy server/.env.example to server/.env and fill in all values.');
//   process.exit(1);
// }

// /* ─── 2. IMPORTS ────────────────────────────────────────── */
// import { connectDB }     from './config/db.js';
// import { logger }        from './utils/logger.js';
// import { globalLimiter } from './middleware/rateLimiter.js';
// import { errorHandler }  from './middleware/errorHandler.js';

// import authRoutes        from './auth.js';
// import userRoutes        from './user-routes.js';
// import leaderboardRoutes from './leaderboard-routes.js';

// import aiRoutes          from './routes/aiRoutes.js';
// import pptRoutes         from './routes/pptRoutes.js';
// import pdfRoutes         from './routes/pdfRoutes.js';
// import rewardsRoutes     from './routes/rewardsRoutes.js';
// import chatRoutes        from './routes/chatRoutes.js';
// import studyToolsRoutes  from './routes/studyToolsRoutes.js';
// import notesRoutes       from './routes/notesRoutes.js';

// // ── AI Study OS — Brain System ────────────────────────────────
// import brainRoutes       from './routes/brainRoutes.js';
// import learningRoutes    from './routes/learningEngineRoutes.js';
// import progressRoutes    from './routes/progressRoutes.js';

// import { fixStuckRedemptions, processPendingPremiums } from './controllers/rewardsController.js';

// /* ─── 3. PROCESS ERROR HANDLERS ────────────────────────── */
// process.on('unhandledRejection', (reason: any) => {
//   logger.error({ err: reason?.message || reason }, 'Unhandled Promise Rejection');
// });
// process.on('uncaughtException', (err: Error) => {
//   logger.error({ err: err.message, stack: err.stack || '' }, 'Uncaught Exception');
//   setTimeout(() => process.exit(1), 1000);
// });

// /* ─── 4. EXPRESS SETUP ──────────────────────────────────── */
// const app  = express();
// const PORT = process.env.PORT || 5000;

// /* ─── 5. CORS ───────────────────────────────────────────── */
// const ALLOWED_ORIGINS = [
//   'https://studyearnai.tech',
//   'https://www.studyearnai.tech',
//   'http://localhost:5173',
//   'http://localhost:5174',
//   'https://studyearn-ai.vercel.app',
//   process.env.FRONTEND_URL,
// ].filter(Boolean) as string[];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
//     callback(new Error(`CORS: Origin ${origin} not allowed`));
//   },
//   credentials: true,
// }));

// app.use(helmet({
//   crossOriginResourcePolicy: { policy: 'cross-origin' },
//   contentSecurityPolicy: false,
// }));

// app.use(compression());

// /* ─── 6. MIDDLEWARE ─────────────────────────────────────── */
// app.set('trust proxy', 1);
// app.use(globalLimiter);
// app.use(express.json({ limit: '20mb' }));

// /* ─── 7. HEALTH CHECK ───────────────────────────────────── */
// app.get('/health', (_req, res) => {
//   res.json({ status: 'ok', port: PORT });
// });

// /* ─── 8. ROUTES ─────────────────────────────────────────── */
// // Existing routes — unchanged
// app.use('/api/auth',        authRoutes);
// app.use('/api/user',        userRoutes);
// app.use('/api/leaderboard', leaderboardRoutes);
// app.use('/api/ai',          aiRoutes);
// app.use('/api/ppt',         pptRoutes);
// app.use('/api',             pdfRoutes);
// app.use('/api/rewards',     rewardsRoutes);
// app.use('/api/chat',        chatRoutes);
// app.use('/api/study',       studyToolsRoutes);
// app.use('/api/notes',       notesRoutes);
// app.use('/api/codelearn',   codelearnRoutes);

// // ── AI Study OS Brain System ──────────────────────────────────
// app.use('/api/brain',       brainRoutes);
// // ── AI Study OS Stage 3 — Personal Learning Engine ───────────
// app.use('/api/learn',       learningRoutes);
// // ── AI Study OS Stage 4 — Progress Intelligence ──────────────
// app.use('/api/progress',    progressRoutes);

// /* ─── 9. GLOBAL ERROR HANDLER (SABSE LAST) ─────────────── */
// app.use(errorHandler);

// /* ─── 10. SERVER START ──────────────────────────────────── */
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     logger.info(`🚀 Server running on port ${PORT}`);
//     logger.info('✅ AI Ready        (Groq + OpenRouter)');
//     logger.info('✅ PPT Ready       (pptxgenjs)');
//     logger.info('✅ PDF Ready       (pdf-lib + sharp)');
//     logger.info('✅ Auth Ready      (JWT + bcrypt)');
//     logger.info('✅ Sentry Ready    (error tracking)');
//     logger.info('✅ AI Brain Ready     (Stage 1 — AI Brain)');
//     logger.info('✅ AI Tutor Ready     (Stage 2 — Personal AI Tutor)');
//     logger.info('✅ Learn Engine Ready (Stage 3 — Learning Engine)');
//     logger.info('✅ Progress Ready     (Stage 4 — Progress Intelligence)');
//   });

//   fixStuckRedemptions()
//     .then(() => processPendingPremiums())
//     .catch((e: unknown) => logger.error({ err: e }, 'background task failed'));

//   setInterval(processPendingPremiums, 5 * 60 * 1000);
// });





// ─── DOTENV: Sabse pehle — env vars load karo ────────────────
import dotenv from 'dotenv';
dotenv.config();

// ─── SENTRY ───────────────────────────────────────────────────
import './instrument.js';

import express, { Request, Response, NextFunction } from 'express';
import cors        from 'cors';
import helmet      from 'helmet';
import compression from 'compression';

import codelearnRoutes  from './routes/codelearnRoutes.js';

/* ─── 1. ENV VALIDATION ─────────────────────────────────── */
const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET', 'GROQ_API_KEY'];
const missing      = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

/* ─── 2. IMPORTS ────────────────────────────────────────── */
import { connectDB }     from './config/db.js';
import { logger }        from './utils/logger.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler }  from './middleware/errorHandler.js';

import authRoutes        from './auth.js';
import userRoutes        from './user-routes.js';
import leaderboardRoutes from './leaderboard-routes.js';
import aiRoutes          from './routes/aiRoutes.js';
import pptRoutes         from './routes/pptRoutes.js';
import pdfRoutes         from './routes/pdfRoutes.js';
import rewardsRoutes     from './routes/rewardsRoutes.js';
import chatRoutes        from './routes/chatRoutes.js';
import studyToolsRoutes  from './routes/studyToolsRoutes.js';
import notesRoutes       from './routes/notesRoutes.js';
import brainRoutes       from './routes/brainRoutes.js';
import learningRoutes    from './routes/learningEngineRoutes.js';
import progressRoutes    from './routes/progressRoutes.js';

// ── Stage 6: AI Mentor ────────────────────────────────────────
import mentorRoutes      from './routes/mentorRoutes.js';
import { mentorScheduler } from './services/aiMentor/mentorScheduler.js';

// ── Stage 7: Retention Engine ─────────────────────────────────
import retentionRoutes   from './routes/retentionRoutes.js';

// ── Stage 7 Advanced: Urgency Scheduler (precise 20h detection) ──
import { UrgencyScheduler } from './services/retentionEngine/urgencyScheduler.js';

import { fixStuckRedemptions, processPendingPremiums } from './controllers/rewardsController.js';

/* ─── 3. PROCESS ERROR HANDLERS ────────────────────────── */
process.on('unhandledRejection', (reason: any) => {
  logger.error({ err: reason?.message || reason }, 'Unhandled Promise Rejection');
});
process.on('uncaughtException', (err: Error) => {
  logger.error({ err: err.message, stack: err.stack || '' }, 'Uncaught Exception');
  setTimeout(() => process.exit(1), 1000);
});

/* ─── 4. EXPRESS SETUP ──────────────────────────────────── */
const app  = express();
const PORT = process.env.PORT || 5000;

/* ─── 5. CORS ───────────────────────────────────────────── */
const ALLOWED_ORIGINS = [
  'https://studyearnai.tech',
  'https://www.studyearnai.tech',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://studyearn-ai.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// ─── FIX: SSE routes pe compression SKIP karo ────────────────
// /api/ai/ask-stream aur /api/retention/stream dono SSE hain
app.use(compression({
  filter: (req: Request, _res: Response) => {
    if (req.path === '/api/ai/ask-stream')    return false;
    if (req.path === '/api/retention/stream') return false;
    return compression.filter(req, _res);
  },
}));

/* ─── 6. MIDDLEWARE ─────────────────────────────────────── */
app.set('trust proxy', 1);
app.use(globalLimiter);
app.use(express.json({ limit: '20mb' }));

/* ─── 7. HEALTH CHECK ───────────────────────────────────── */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', port: PORT });
});

/* ─── 8. ROUTES ─────────────────────────────────────────── */
app.use('/api/auth',        authRoutes);
app.use('/api/user',        userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai',          aiRoutes);
app.use('/api/ppt',         pptRoutes);
app.use('/api',             pdfRoutes);
app.use('/api/rewards',     rewardsRoutes);
app.use('/api/chat',        chatRoutes);
app.use('/api/study',       studyToolsRoutes);
app.use('/api/notes',       notesRoutes);
app.use('/api/codelearn',   codelearnRoutes);
app.use('/api/brain',       brainRoutes);
app.use('/api/learn',       learningRoutes);
app.use('/api/progress',    progressRoutes);
// ── Stage 6: AI Mentor ────────────────────────────────────────
app.use('/api/mentor',      mentorRoutes);
// ── Stage 7: Retention Engine ─────────────────────────────────
app.use('/api/retention',   retentionRoutes);

/* ─── 9. GLOBAL ERROR HANDLER ───────────────────────────── */
app.use(errorHandler);

/* ─── 10. SERVER START ──────────────────────────────────── */
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info('✅ AI Ready               (NVIDIA + Groq + OpenRouter)');
    logger.info('✅ Streaming Ready        (SSE — compression bypassed)');
    logger.info('✅ PPT Ready              (pptxgenjs)');
    logger.info('✅ PDF Ready              (pdf-lib + sharp)');
    logger.info('✅ Auth Ready             (JWT + bcrypt)');
    logger.info('✅ AI Brain Ready         (Stage 1)');
    logger.info('✅ AI Tutor Ready         (Stage 2)');
    logger.info('✅ Learn Engine Ready     (Stage 3)');
    logger.info('✅ Progress Ready         (Stage 4)');
    logger.info('✅ AI Mentor Ready        (Stage 6 — Proactive Mentor)');
    logger.info('✅ Retention Engine Ready  (Stage 7 — Streaks + Comeback)');
    logger.info('✅ Urgency Scheduler Ready (Stage 7 Advanced — Precise 20h Detection)');
    logger.info('✅ SSE Push Ready          (Stage 7 Advanced — Real-time Notifications)');
    logger.info('✅ Emotional AI Ready      (Stage 7 Advanced — Mentor + Retention Merge)');
  });

  fixStuckRedemptions()
    .then(() => processPendingPremiums())
    .catch((e: unknown) => logger.error({ err: e }, 'background task failed'));

  setInterval(processPendingPremiums, 5 * 60 * 1000);

  // ── Stage 6: Start AI Mentor Scheduler ───────────────────
  mentorScheduler.start();

  // ── Stage 7 Advanced: Start Urgency Scheduler ────────────
  // Precise 20h/36h/48h cron detection — not request-driven
  const urgencyScheduler = new UrgencyScheduler();
  urgencyScheduler.start();
});