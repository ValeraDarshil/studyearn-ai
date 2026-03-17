// /**
//  * StudyEarn AI — Rate Limiter Middleware
//  * ─────────────────────────────────────────────────────────────
//  * Protects all endpoints from:
//  *   - API quota drain (AI endpoints)
//  *   - Brute force attacks (auth endpoints)
//  *   - Abuse / spam (general endpoints)
//  *
//  * Uses: express-rate-limit (already installed in root package.json)
//  */

// import rateLimit from 'express-rate-limit';

// // ─────────────────────────────────────────────────────────────
// // HELPER — Standard rate limit response format
// // ─────────────────────────────────────────────────────────────
// function rateLimitHandler(req: any, res: any) {
//   res.status(429).json({
//     success: false,
//     message: '⏳ Too many requests. Please slow down and try again shortly.',
//     retryAfter: res.getHeader('Retry-After'),
//   });
// }

// // ─────────────────────────────────────────────────────────────
// // 1. AI ASK — Most critical endpoint (Groq/OpenRouter costs)
// //    Rule: Max 15 requests per minute per IP
// //    Why: Prevents API quota drain from bots/abuse
// // ─────────────────────────────────────────────────────────────
// export const aiAskLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,   // 1 minute window
//   max: 15,                    // 15 AI questions per minute per IP
//   standardHeaders: true,      // Return rate limit info in headers
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: '⏳ Too many questions asked. Please wait a moment before asking again.',
//   },
//   handler: rateLimitHandler,
//   skip: (req) => {
//     // Skip rate limiting in test/dev environment
//     return process.env.NODE_ENV === 'test';
//   },
// });

// // ─────────────────────────────────────────────────────────────
// // 2. PDF SOLVE — Heavy AI call with file processing
// //    Rule: Max 8 requests per minute per IP
// // ─────────────────────────────────────────────────────────────
// export const pdfSolveLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,   // 1 minute
//   max: 8,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: '⏳ Too many PDF requests. Please wait a moment.',
//   },
//   handler: rateLimitHandler,
// });

// // ─────────────────────────────────────────────────────────────
// // 3. PPT GENERATOR — Heavy AI + file generation
// //    Rule: Max 5 PPTs per minute per IP
// // ─────────────────────────────────────────────────────────────
// export const pptLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,   // 1 minute
//   max: 5,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: '⏳ Too many PPT requests. Please wait a moment.',
//   },
//   handler: rateLimitHandler,
// });

// // ─────────────────────────────────────────────────────────────
// // 4. AUTH — Login / Signup (Brute force protection)
// //    Rule: Max 10 attempts per 15 minutes per IP
// //    Why: Prevents password brute force attacks
// // ─────────────────────────────────────────────────────────────
// export const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,  // 15 minute window
//   max: 10,                   // 10 login attempts per 15 min
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: '🔒 Too many login attempts. Please try again after 15 minutes.',
//   },
//   handler: rateLimitHandler,
//   skipSuccessfulRequests: true, // Only count FAILED attempts toward limit
// });

// // ─────────────────────────────────────────────────────────────
// // 5. FILE TOOLS (Image→PDF, Merge PDF)
// //    Rule: Max 20 per minute per IP
// // ─────────────────────────────────────────────────────────────
// export const fileToolsLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,   // 1 minute
//   max: 20,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: '⏳ Too many file requests. Please slow down.',
//   },
//   handler: rateLimitHandler,
// });

// // ─────────────────────────────────────────────────────────────
// // 6. GLOBAL — Catches everything else
// //    Rule: Max 100 requests per minute per IP (safety net)
// // ─────────────────────────────────────────────────────────────
// export const globalLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,   // 1 minute
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: '⏳ Too many requests. Please slow down.',
//   },
//   handler: rateLimitHandler,
// });
// // ─────────────────────────────────────────────────────────────
// // 7. OTP / FORGOT PASSWORD — Strict limit to prevent spam
// //    Rule: Max 3 OTP requests per 15 minutes per IP
// // ─────────────────────────────────────────────────────────────
// export const otpLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,  // 15 minutes
//   max: 3,                     // only 3 OTP emails per 15 min
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: '⏳ Too many OTP requests. Please wait 15 minutes before trying again.',
//   },
//   handler: rateLimitHandler,
// });



/**
 * StudyEarn AI — Rate Limiter Middleware
 * ─────────────────────────────────────────────────────────────
 * Protects all endpoints from:
 *   - API quota drain (AI endpoints)
 *   - Brute force attacks (auth endpoints)
 *   - Abuse / spam (general endpoints)
 *
 * Uses: express-rate-limit (already installed in root package.json)
 */

import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// ─────────────────────────────────────────────────────────────
// HELPER — Standard rate limit response format
// ─────────────────────────────────────────────────────────────
function rateLimitHandler(req: any, res: any) {
  res.status(429).json({
    success: false,
    message: '⏳ Too many requests. Please slow down and try again shortly.',
    retryAfter: res.getHeader('Retry-After'),
  });
}

// ─────────────────────────────────────────────────────────────
// KEY GENERATOR — Per user (if logged in) else per IP
// ipKeyGenerator: express-rate-limit v8 ka required helper
// IPv4 aur IPv6 dono correctly handle karta hai
// ─────────────────────────────────────────────────────────────
function perUserKey(req: any): string {
  // Agar user logged in hai → userId se limit karo (most accurate)
  if (req.userId) return `user_${req.userId}`;
  // Bina login ke → ipKeyGenerator use karo (IPv6 safe)
  return ipKeyGenerator(req);
}

// ─────────────────────────────────────────────────────────────
// 1. AI ASK — Most critical endpoint (Groq/OpenRouter costs)
//    Rule: Max 15 requests per minute per USER (not just IP)
//    Why: Prevents API quota drain from bots/abuse
// ─────────────────────────────────────────────────────────────
export const aiAskLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute window
  max: 15,                    // 15 AI questions per minute per user
  keyGenerator: perUserKey,   // per-user, not per-IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '⏳ Too many questions asked. Please wait a moment before asking again.',
  },
  handler: rateLimitHandler,
  skip: (req) => {
    return process.env.NODE_ENV === 'test';
  },
});

// ─────────────────────────────────────────────────────────────
// 2. PDF SOLVE — Heavy AI call with file processing
//    Rule: Max 8 requests per minute per USER
// ─────────────────────────────────────────────────────────────
export const pdfSolveLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 8,
  keyGenerator: perUserKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '⏳ Too many PDF requests. Please wait a moment.',
  },
  handler: rateLimitHandler,
});

// ─────────────────────────────────────────────────────────────
// 3. PPT GENERATOR — Heavy AI + file generation
//    Rule: Max 5 PPTs per minute per USER
// ─────────────────────────────────────────────────────────────
export const pptLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  keyGenerator: perUserKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '⏳ Too many PPT requests. Please wait a moment.',
  },
  handler: rateLimitHandler,
});

// ─────────────────────────────────────────────────────────────
// 4. AUTH — Login / Signup (Brute force protection)
//    Rule: Max 10 attempts per 15 minutes per IP
//    Why: Auth happens before userId is known, so IP is correct here
// ─────────────────────────────────────────────────────────────
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '🔒 Too many login attempts. Please try again after 15 minutes.',
  },
  handler: rateLimitHandler,
  skipSuccessfulRequests: true,
});

// ─────────────────────────────────────────────────────────────
// 5. FILE TOOLS (Image→PDF, Merge PDF)
//    Rule: Max 20 per minute per USER
// ─────────────────────────────────────────────────────────────
export const fileToolsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  keyGenerator: perUserKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '⏳ Too many file requests. Please slow down.',
  },
  handler: rateLimitHandler,
});

// ─────────────────────────────────────────────────────────────
// 6. GLOBAL — Catches everything else
//    Rule: Max 100 requests per minute per IP (safety net)
// ─────────────────────────────────────────────────────────────
export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '⏳ Too many requests. Please slow down.',
  },
  handler: rateLimitHandler,
});
// ─────────────────────────────────────────────────────────────
// 7. OTP / FORGOT PASSWORD — Strict limit to prevent spam
//    Rule: Max 3 OTP requests per 15 minutes per IP
// ─────────────────────────────────────────────────────────────
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '⏳ Too many OTP requests. Please wait 15 minutes before trying again.',
  },
  handler: rateLimitHandler,
});