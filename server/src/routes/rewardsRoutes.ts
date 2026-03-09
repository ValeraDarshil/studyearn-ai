// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Rewards Routes
// ─────────────────────────────────────────────────────────────

import { Router } from 'express';
import {
  getRewardTiers,
  getRewardStatus,
  redeemReward,
  getRewardHistory,
} from '../controllers/rewardsController.js';

const router = Router();

// GET  /api/rewards/tiers   — saare reward tiers dekho
router.get('/tiers',   getRewardTiers);

// GET  /api/rewards/status  — current user premium status
router.get('/status',  getRewardStatus);

// POST /api/rewards/redeem  — reward redeem karo
router.post('/redeem', redeemReward);

// GET  /api/rewards/history — redemption history
router.get('/history', getRewardHistory);

export default router;