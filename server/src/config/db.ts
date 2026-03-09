// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Database Config
// ─────────────────────────────────────────────────────────────
// Purana db.ts yahan shift hua hai
// index.ts ab yahan se import karega

import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI!;

  try {
    await mongoose.connect(uri);
    isConnected = true;
    logger.info('MongoDB connected ✅');
  } catch (error: any) {
    logger.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}