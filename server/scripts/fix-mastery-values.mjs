/**
 * One-time cleanup — sanitize corrupted topicMastery.masteryLevel values
 * ─────────────────────────────────────────────────────────────
 * WHY: A handful of topicMastery entries in production were written by
 * an older version of updateTopicMastery() that didn't round/clamp the
 * value (before the current Math.round(Math.min(100, Math.max(0, ema)))
 * logic existed). Those entries carry a raw float forever until that
 * specific topic is practiced again — which is why "Arrays" showed
 * 0.0055017193632964180% on the dashboard.
 *
 * This script finds every topicMastery entry across every student whose
 * masteryLevel is not a clean 0-100 integer, and fixes it in place.
 * It does NOT touch anything else — no other field, no other collection.
 *
 * Plain JS on purpose — no tsx/ts-node in this project's deps, so this
 * runs directly against the already-compiled dist/ output. Zero new
 * dependencies needed.
 *
 * USAGE (run once, from the server/ folder, AFTER `npm run build`):
 *   node scripts/fix-mastery-values.mjs
 *
 * Safe to run multiple times — already-clean values are simply skipped
 * (idempotent), and it only ever WRITES a value if it actually differs.
 */

import mongoose from 'mongoose';
import { StudentProfile } from '../dist/models/StudentProfile.model.js';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set. Run this with the same env as production:');
    console.error('  MONGODB_URI="<your connection string>" node scripts/fix-mastery-values.mjs');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected. Scanning topicMastery entries...');

  const profiles = await StudentProfile.find({ 'topicMastery.0': { $exists: true } })
    .select('userId topicMastery');

  let studentsFixed = 0;
  let entriesFixed = 0;

  for (const profile of profiles) {
    let changed = false;

    for (const entry of profile.topicMastery) {
      const raw = entry.masteryLevel;
      const clean = Math.round(Math.min(100, Math.max(0, Number(raw) || 0)));

      if (raw !== clean) {
        console.log(`  Fixing ${profile.userId} / "${entry.topic}": ${raw} -> ${clean}`);
        entry.masteryLevel = clean;
        entry.isWeak   = clean < 40;   // matches WEAK_THRESHOLD in studentProfileService.ts
        entry.isStrong = clean >= 80;  // matches STRONG_THRESHOLD in studentProfileService.ts
        changed = true;
        entriesFixed++;
      }
    }

    if (changed) {
      await profile.save();
      studentsFixed++;
    }
  }

  console.log(`\nDone. Fixed ${entriesFixed} entries across ${studentsFixed} student(s).`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Cleanup script failed:', err);
  process.exit(1);
});
