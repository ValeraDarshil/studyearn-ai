// // ─────────────────────────────────────────────────────────────
// // StudyEarn AI — Logger Utility
// // ─────────────────────────────────────────────────────────────
// // Simple wrapper around console.* 
// // Baad mein winston/pino se replace karna ho toh
// // sirf yeh ek file change karni padegi — koi aur file nahi

// const isDev = process.env.NODE_ENV !== 'production';

// export const logger = {
//   info:  (...args: any[]) => console.log('[INFO] ', ...args),
//   warn:  (...args: any[]) => console.warn('[WARN] ', ...args),
//   error: (...args: any[]) => console.error('[ERROR]', ...args),
//   debug: (...args: any[]) => { if (isDev) console.log('[DEBUG]', ...args); },
// };

// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Logger Utility (pino)
// ─────────────────────────────────────────────────────────────
// Production-ready structured logging via pino
//
// DEV  → human-readable pretty print (pino-pretty)
// PROD → JSON lines (works with Render, Datadog, Logtail etc.)
//
// Usage:
//   import { logger } from '../utils/logger.js';
//   logger.info('Server started');
//   logger.error({ err }, 'DB connection failed');
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Logger Utility (pino)
// ─────────────────────────────────────────────────────────────
// Production-ready structured logging via pino
//
// DEV  → human-readable pretty print (pino-pretty)
// PROD → JSON lines (works with Render, Datadog, Logtail etc.)
//
// Usage:
//   import { logger } from '../utils/logger.js';
//   logger.info('Server started');
//   logger.error({ err }, 'DB connection failed');
// ─────────────────────────────────────────────────────────────

// import pino from 'pino';

// const isDev = process.env.NODE_ENV !== 'production';

// export const logger = pino({
//   // Log level: in prod only info+, in dev show debug too
//   level: isDev ? 'debug' : 'info',

//   // In production → plain JSON (fastest, works with all log aggregators)
//   // In dev        → pretty human-readable output via pino-pretty
//   transport: isDev
//     ? {
//         target: 'pino-pretty',
//         options: {
//           colorize:        true,
//           translateTime:   'SYS:HH:MM:ss',
//           ignore:          'pid,hostname',
//           messageFormat:   '{msg}',
//         },
//       }
//     : undefined,

//   // Base fields added to every log line in production
//   base: isDev ? undefined : {
//     app:     'studyearn-ai',
//     env:     process.env.NODE_ENV ?? 'production',
//     version: process.env.npm_package_version ?? '1.0.0',
//   },

//   // Redact sensitive fields from logs — never log these
//   redact: {
//     paths: [
//       'password',
//       'token',
//       'authorization',
//       'req.headers.authorization',
//       '*.password',
//       '*.token',
//       '*.jwt',
//       '*.apiKey',
//     ],
//     censor: '[REDACTED]',
//   },

//   // ISO timestamp on every line
//   timestamp: pino.stdTimeFunctions.isoTime,
// });








// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Logger Utility (pino + Betterstack)
// ─────────────────────────────────────────────────────────────
// DEV  → human-readable pretty print (pino-pretty)
// PROD → Betterstack (permanent logs, searchable, free)
//        fallback → plain JSON if BETTERSTACK_TOKEN not set
//
// Usage:
//   import { logger } from '../utils/logger.js';
//   logger.info('Server started');
//   logger.error({ err }, 'Something broke');
// ─────────────────────────────────────────────────────────────

import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';
const hasBetterstack = !!process.env.BETTERSTACK_TOKEN;

function getTransport() {
  // Dev → pretty colored output
  if (isDev) {
    return {
      target: 'pino-pretty',
      options: {
        colorize:      true,
        translateTime: 'SYS:HH:MM:ss',
        ignore:        'pid,hostname',
        messageFormat: '{msg}',
      },
    };
  }

  // Production + Betterstack token set → send logs to Betterstack
  if (hasBetterstack) {
    return {
      target: '@logtail/pino',
      options: {
        sourceToken: process.env.BETTERSTACK_TOKEN,
      },
    };
  }

  // Production but no Betterstack → plain JSON to stdout (Render logs)
  return undefined;
}

export const logger = pino({
  level: isDev ? 'debug' : 'info',

  transport: getTransport(),

  base: isDev ? undefined : {
    app:     'studyearn-ai',
    env:     process.env.NODE_ENV ?? 'production',
    version: process.env.npm_package_version ?? '1.0.0',
  },

  // Sensitive fields ko KABHI log mat karo
  redact: {
    paths: [
      'password',
      'token',
      'authorization',
      'req.headers.authorization',
      '*.password',
      '*.token',
      '*.jwt',
      '*.apiKey',
    ],
    censor: '[REDACTED]',
  },

  timestamp: pino.stdTimeFunctions.isoTime,
});