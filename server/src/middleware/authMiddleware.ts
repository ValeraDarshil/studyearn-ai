// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Auth Middleware
// ─────────────────────────────────────────────────────────────
// JWT token verify karta hai
// req.userId attach karta hai saare protected routes ke liye

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Express Request mein userId add karo globally
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Middleware: Bearer token verify karo → req.userId attach karo
 * Use: Protected routes ke liye
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

/**
 * Helper: Token se userId nikalo bina error throw kiye
 * Use: Points/XP award karne ke liye (fire-and-forget)
 */
export function getUserIdFromToken(req: Request): string | null {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}