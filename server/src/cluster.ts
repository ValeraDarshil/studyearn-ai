/**
 * StudyEarn AI — Cluster Mode
 * ─────────────────────────────────────────────────────────────
 * Production pe multi-core CPU ka full use karta hai.
 * Default Node.js single core use karta hai — yeh file
 * available cores pe workers spawn karta hai.
 *
 * Usage: package.json ke "start" script mein swap karo:
 *   "start": "node dist/cluster.js"
 *
 * Development mein normal index.ts hi use karo:
 *   "dev": "ts-node src/index.ts"
 *
 * NOTE: Agar Railway/Render pe 1 CPU hai toh cluster se
 * koi fayda nahi — woh khud handle kar lete hain.
 * 2+ CPU wale plans pe useful hoga.
 */

import cluster from 'cluster';
import os from 'os';

const NUM_WORKERS = Math.min(os.cpus().length, 4); // max 4 workers — zyada se overhead badh jaata hai

if (cluster.isPrimary) {
  console.log(`🚀 Primary ${process.pid} — spawning ${NUM_WORKERS} workers`);

  // Utne workers spawn karo jitne CPUs hain
  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }

  // Worker crash ho toh restart karo
  cluster.on('exit', (worker, code, signal) => {
    console.error(`⚠️ Worker ${worker.process.pid} died (code=${code}, signal=${signal}) — restarting`);
    cluster.fork();
  });

} else {
  // Har worker apna Express server start karta hai
  // Yeh import automatically index.ts run kar deta hai
  await import('./index.js');
  console.log(`✅ Worker ${process.pid} started`);
}