import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth.js';
import userRoutes from './user-routes.js';
import leaderboardRoutes from './leaderboard-routes.js';
import { connectDB } from './db.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://studyearn-ai.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Auth Server' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);  // ✅ NEW

const PORT = 5003;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🔐 Auth Server running on http://localhost:${PORT}`);
  });
});