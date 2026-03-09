// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Logger Utility
// ─────────────────────────────────────────────────────────────
// Simple wrapper around console.* 
// Baad mein winston/pino se replace karna ho toh
// sirf yeh ek file change karni padegi — koi aur file nahi

const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  info:  (...args: any[]) => console.log('[INFO] ', ...args),
  warn:  (...args: any[]) => console.warn('[WARN] ', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  debug: (...args: any[]) => { if (isDev) console.log('[DEBUG]', ...args); },
};