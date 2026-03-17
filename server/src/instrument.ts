// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Sentry Instrumentation
// ─────────────────────────────────────────────────────────────
// IMPORTANT: Yeh file index.ts mein SABSE PEHLE import honi
// chahiye — kisi bhi aur import se pehle.
// Sentry ko as early as possible initialize karna padta hai
// taaki saare errors capture ho sakein.
// ─────────────────────────────────────────────────────────────

import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Production mein hi enable karo — dev mein noise nahi chahiye
  enabled: process.env.NODE_ENV === 'production',

  environment: process.env.NODE_ENV ?? 'production',

  // 20% requests ka performance trace karo — free tier ke liye enough
  tracesSampleRate: 0.2,

  // PII (IP address etc.) Sentry ko mat bhejo
  sendDefaultPii: false,
});

export { Sentry };