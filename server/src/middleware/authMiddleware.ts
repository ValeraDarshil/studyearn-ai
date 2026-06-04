// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Auth Middleware
// ─────────────────────────────────────────────────────────────
// PATH: server/src/middleware/authMiddleware.ts

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
 * ORIGINAL — Protected routes ke liye (AskAI, PPT, Quiz etc.)
 * Token nahi hai → 401 return karta hai
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS512', 'HS256'] }) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

/**
 * ✅ NEW — Optional Auth (PDF Tools public access ke liye)
 * - Token hai + valid → req.userId attach karo (logged-in user, milenge points)
 * - Token nahi hai   → guest allow karo (req.userId = undefined)
 * - Token invalid    → guest treat karo, block nahi (req.userId = undefined)
 */
export function authenticateOptional(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return next(); // guest — allow
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS512', 'HS256'] }) as { userId: string };
    req.userId = decoded.userId;
  } catch {
    // invalid/expired token → guest treat karo
  }
  next();
}

/**
 * ORIGINAL — Token se userId nikalo bina error throw kiye
 * Use: Points/XP award karne ke liye (fire-and-forget)
 */
export function getUserIdFromToken(req: Request): string | null {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS512', 'HS256'] }) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}