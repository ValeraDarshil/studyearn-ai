// New file: server/src/leaderboard-routes.ts
// Leaderboard API endpoints

import express from 'express';
import { User } from './models/User.model';
import { connectDB } from './db';

const router = express.Router();

// ── GET TOP USERS ────────────────────────────────────────────────────────────
router.get('/top', async (req, res) => {
  try {
    await connectDB();
    
    const limit = parseInt(req.query.limit as string) || 10;

    // Get top users by points
    const topUsers = await User.find()
      .select('name email points streak createdAt')
      .sort({ points: -1 })
      .limit(limit)
      .lean();

    // Add rank
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      id: user._id.toString(), // ✅ FIXED: Convert ObjectId to string
      name: user.name,
      points: user.points,
      streak: user.streak || 0,
      joinedDate: user.createdAt,
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET USER RANK ────────────────────────────────────────────────────────────
router.get('/rank/:userId', async (req, res) => {
  try {
    await connectDB();
    
    const { userId } = req.params;

    // Count users with more points
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;

    res.json({ 
      success: true, 
      rank,
      points: user.points,
      totalUsers: await User.countDocuments(),
    });
  } catch (error) {
    console.error('Rank error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;