/**
 * StudyEarn AI — Server Entry Point
 * ─────────────────────────────────────────────────────────────
 * Yeh file SIRF yeh kaam karti hai:
 *   1. ENV validation
 *   2. Express setup + middleware
 *   3. Routes mount karna
 *   4. DB connect karna
 *   5. Server start karna
 *   6. Background jobs (premium polling)
 *
 * Business logic KABHI yahan nahi hogi.
 * Saari logic in folders mein hai:
 *   controllers/ → request/response handle karna
 *   services/    → AI, PPT, PDF operations
 *   routes/      → URL to controller mapping
 *   middleware/  → auth, rate limit, validation, error
 *   models/      → MongoDB schemas
 *   config/      → DB connection
 *   utils/       → logger aur shared helpers
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';

dotenv.config();

/* ─── 1. ENV VALIDATION ─────────────────────────────────── */
const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET', 'GROQ_API_KEY'];
const missing      = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  console.error('   Copy server/.env.example to server/.env and fill in all values.');
  process.exit(1);
}

/* ─── 2. IMPORTS ────────────────────────────────────────── */
import { connectDB }     from './config/db.js';
import { logger }        from './utils/logger.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler }  from './middleware/errorHandler.js';

// Purane routes (auth, user, leaderboard) — touch nahi kiye
import authRoutes        from './auth.js';
import userRoutes        from './user-routes.js';
import leaderboardRoutes from './leaderboard-routes.js';

// Naye clean routes
import aiRoutes      from './routes/aiRoutes.js';
import pptRoutes     from './routes/pptRoutes.js';
import pdfRoutes     from './routes/pdfRoutes.js';
import rewardsRoutes from './routes/rewardsRoutes.js';
import chatRoutes        from './routes/chatRoutes.js';
import studyToolsRoutes from './routes/studyToolsRoutes.js';
import notesRoutes      from './routes/notesRoutes.js';

// Background jobs
import { fixStuckRedemptions, processPendingPremiums } from './controllers/rewardsController.js';

/* ─── 3. PROCESS ERROR HANDLERS ────────────────────────── */
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Promise Rejection:', reason?.message || reason);
});
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err.message);
  logger.error(err.stack || '');
  setTimeout(() => process.exit(1), 1000);
});

/* ─── 4. EXPRESS SETUP ──────────────────────────────────── */
const app  = express();
const PORT = process.env.PORT || 5000;

/* ─── 5. CORS ───────────────────────────────────────────── */
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://studyearn-ai.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // mobile / Postman / curl
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // PDF/PPTX downloads ke liye
  contentSecurityPolicy: false, // Frontend alag server pe hai toh off rakho
}));

app.use(compression());

/* ─── 6. MIDDLEWARE ─────────────────────────────────────── */
app.set('trust proxy', 1); // Render/Vercel ke peeche proxy hai
app.use(globalLimiter);
app.use(express.json({ limit: '20mb' })); // 20mb for high-res base64 images

/* ─── 7. HEALTH CHECK ───────────────────────────────────── */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', port: PORT });
});

/* ─── 8. ROUTES ─────────────────────────────────────────── */

// Purane routes — unchanged, exactly wahi kaam karte hain
app.use('/api/auth',        authRoutes);
app.use('/api/user',        userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Naye clean routes
app.use('/api/ai',      aiRoutes);       // POST /api/ai/ask, /api/ai/solve-pdf
app.use('/api/ppt',     pptRoutes);      // POST /api/ppt/content, /api/ppt/generate
app.use('/api',         pdfRoutes);      // POST /api/img-to-pdf, /api/merge-pdf ...
app.use('/api/rewards', rewardsRoutes);  // GET/POST /api/rewards/*
app.use('/api/chat',    chatRoutes);     // GET/POST /api/chat/*
app.use('/api/study',   studyToolsRoutes); // POST /api/study/improve-notes, /api/study/analyze-pdf
app.use('/api/notes',   notesRoutes);      // CRUD /api/notes/*

/* ─── 9. GLOBAL ERROR HANDLER (SABSE LAST) ─────────────── */
app.use(errorHandler);

/* ─── 10. SERVER START ──────────────────────────────────── */
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info('✅ AI Ready   (Groq + OpenRouter)');
    logger.info('✅ PPT Ready  (pptxgenjs)');
    logger.info('✅ PDF Ready  (pdf-lib + sharp)');
    logger.info('✅ Auth Ready (JWT + bcrypt)');
  });

  // Background jobs — startup pe run karo, phir har 5 min
  fixStuckRedemptions()
    .then(() => processPendingPremiums())
    .catch(logger.error);

  setInterval(processPendingPremiums, 5 * 60 * 1000);
});