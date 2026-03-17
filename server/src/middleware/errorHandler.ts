// // ─────────────────────────────────────────────────────────────
// // StudyEarn AI — Global Error Handler
// // ─────────────────────────────────────────────────────────────
// // index.ts mein SABSE LAST register karo
// // Koi bhi unhandled error yahan aake land karega

// import { Request, Response, NextFunction } from 'express';
// import { logger } from '../utils/logger.js';

// export function errorHandler(
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   logger.error('Unhandled error:', err.message);
//   logger.error(err.stack);

//   // CORS error
//   if (err.message?.startsWith('CORS:')) {
//     return res.status(403).json({ success: false, message: 'Not allowed by CORS policy.' });
//   }

//   // Rate limit
//   if (err.status === 429) {
//     return res.status(429).json({ success: false, message: 'Too many requests. Please slow down.' });
//   }

//   // Default 500
//   res.status(500).json({
//     success: false,
//     message: 'An internal server error occurred. Please try again.',
//   });
// }





// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Global Error Handler
// ─────────────────────────────────────────────────────────────
// index.ts mein SABSE LAST register karo
// Koi bhi unhandled error yahan aake land karega

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import * as Sentry from '@sentry/node';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // CORS aur 429 errors Sentry mein nahi bhejne — noise badhata hai
  const isCors       = err.message?.startsWith('CORS:');
  const isRateLimit  = err.status === 429;

  // Sirf real 500 errors Sentry ko bhejo
  if (!isCors && !isRateLimit) {
    Sentry.captureException(err, {
      extra: {
        url:    req.originalUrl,
        method: req.method,
        userId: (req as any).userId ?? 'unauthenticated',
      },
    });
  }

  logger.error({ err: err.message }, 'Unhandled error');
  logger.error({ stack: err.stack }, 'Error stack trace');

  if (isCors) {
    return res.status(403).json({ success: false, message: 'Not allowed by CORS policy.' });
  }

  if (isRateLimit) {
    return res.status(429).json({ success: false, message: 'Too many requests. Please slow down.' });
  }

  res.status(500).json({
    success: false,
    message: 'An internal server error occurred. Please try again.',
  });
}