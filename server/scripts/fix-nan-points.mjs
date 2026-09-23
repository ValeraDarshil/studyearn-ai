/**
 * One-time cleanup — fix NaN `points` by reconstructing the true total
 * ─────────────────────────────────────────────────────────────
 * WHY: Seven different controllers did `user.points += pts` with no
 * fallback for an undefined/null starting value (every other field
 * right next to it, like totalXP, DID have `|| 0` — this was a
 * copy-paste oversight, now fixed in code). Once `user.points` becomes
 * NaN from a single bad increment, EVERY future `+= pts` keeps it NaN
 * forever (NaN + anything = NaN), which is why it's stuck showing "NaN
 * pts" on the dashboard.
 *
 * The code fix (`user.points || 0`) is self-healing for anyone who
 * earns MORE points from now on — but it would restart them from 0,
 * silently discarding everything they legitimately earned before the
 * corruption. That's unfair, and unnecessary: the Activity collection
 * already has a `pointsEarned` value on every single point-earning
 * event (signup bonus included), which is the same source the Points
 * History page already sums for its "Earned (30d)" figure. Summing
 * ALL of a user's Activity.pointsEarned reconstructs their true
 * lifetime total exactly.
 *
 * USAGE (run once, from the server/ folder, AFTER `npm run build`):
 *   MONGODB_URI="<your NEW connection string>" node scripts/fix-nan-points.mjs
 *
 * Safe to run multiple times — a user whose points are already a
 * valid number is left untouched.
 */

import mongoose from 'mongoose';
import { User }     from '../dist/models/User.model.js';
import { Activity } from '../dist/models/Activity.model.js';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set. Run with:');
    console.error('  MONGODB_URI="<your connection string>" node scripts/fix-nan-points.mjs');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected. Scanning for corrupted points...');

  const allUsers = await User.find({}).select('points totalXP');
  const broken = allUsers.filter(u => typeof u.points !== 'number' || Number.isNaN(u.points));

  console.log(`Found ${broken.length} user(s) with corrupted points out of ${allUsers.length} total.\n`);

  let fixed = 0;
  for (const user of broken) {
    const activities = await Activity.find({ userId: user._id }).select('pointsEarned');
    const trueTotal = activities.reduce((sum, a) => sum + (Number(a.pointsEarned) || 0), 0);

    console.log(`  Fixing ${user._id}: NaN -> ${trueTotal} (reconstructed from ${activities.length} activity records)`);
    user.points = trueTotal;
    // totalXP had its own `|| 0` guard everywhere, so it should already
    // be a valid number — but if it somehow also got corrupted, this
    // is a reasonable same-value fallback rather than leaving it NaN.
    if (typeof user.totalXP !== 'number' || Number.isNaN(user.totalXP)) {
      user.totalXP = trueTotal;
    }

    try {
      await user.save();
      fixed++;
    } catch (err) {
      console.error(`  ⚠ Could not save ${user._id}: ${err.message}`);
    }
  }

  console.log(`\nDone. Fixed ${fixed}/${broken.length} user(s).`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Cleanup script failed:', err);
  process.exit(1);
});
