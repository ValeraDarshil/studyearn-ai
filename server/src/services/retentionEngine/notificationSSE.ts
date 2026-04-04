/**
 * AI Study OS — Notification SSE (Stage 7 Advanced — Real-time Push)
 * ─────────────────────────────────────────────────────────────
 * Server-Sent Events for real-time notification delivery.
 *
 * BEFORE: Frontend polls /api/retention/notifications every 30s
 * AFTER:  Frontend connects ONCE → server pushes instantly
 *
 * Route added in retentionRoutes.ts:
 *   GET /api/retention/stream
 *
 * Integration in notificationEngine.ts:
 *   After saveNotification() → call pushToUser(userId, { type, notification })
 */

import { Request, Response } from 'express';
import { logger }            from '../../utils/logger.js';

// ── SSE Connection Registry ─────────────────────────────────
// Maps userId → Set of active Response objects
// One user can have multiple tabs — all receive the notification
const _connections = new Map<string, Set<Response>>();

// ─────────────────────────────────────────────────────────────
// registerSSEConnection
// Called from GET /api/retention/stream (in retentionRoutes.ts)
// ─────────────────────────────────────────────────────────────
export function registerSSEConnection(userId: string, res: Response, req: Request): void {
  // SSE headers — must be set before any write
  res.writeHead(200, {
    'Content-Type':      'text/event-stream',
    'Cache-Control':     'no-cache',
    'Connection':        'keep-alive',
    'X-Accel-Buffering': 'no', // Disables nginx / Vercel proxy buffering
  });

  // Send initial event so client knows stream is live
  res.write(`event: connected\ndata: ${JSON.stringify({ userId, ts: Date.now() })}\n\n`);

  // Register connection
  if (!_connections.has(userId)) _connections.set(userId, new Set());
  _connections.get(userId)!.add(res);

  logger.info({ userId, total: _connections.size }, '[NotificationSSE] Client connected');

  // Heartbeat every 25s — keeps connection alive through proxies
  const heartbeat = setInterval(() => {
    if (res.writableEnded) return clearInterval(heartbeat);
    res.write(': heartbeat\n\n');
  }, 25_000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    const set = _connections.get(userId);
    if (set) {
      set.delete(res);
      if (set.size === 0) _connections.delete(userId);
    }
    logger.info({ userId }, '[NotificationSSE] Client disconnected');
  });
}

// ─────────────────────────────────────────────────────────────
// pushToUser — Send real-time event to a specific user.
//
// Add this call inside notificationEngine.ts after saveNotification():
//   import { pushToUser } from './notificationSSE.js';
//   pushToUser(userId, { type: notification.type, notification });
//
// If user is offline → silent no-op (DB polling handles it)
// ─────────────────────────────────────────────────────────────
export function pushToUser(userId: string, payload: object): void {
  const set = _connections.get(userId?.toString());
  if (!set || set.size === 0) return;

  const data = JSON.stringify(payload);
  const dead: Response[] = [];

  for (const res of set) {
    if (res.writableEnded) {
      dead.push(res);
      continue;
    }
    try {
      res.write(`event: notification\ndata: ${data}\n\n`);
    } catch {
      dead.push(res);
    }
  }

  // Prune dead connections
  dead.forEach((r) => set.delete(r));
  if (set.size === 0) _connections.delete(userId);
}

// ─────────────────────────────────────────────────────────────
// pushToAll — Broadcast to ALL connected users (admin / system)
// ─────────────────────────────────────────────────────────────
export function pushToAll(payload: object): void {
  const data = JSON.stringify(payload);
  for (const [, set] of _connections) {
    for (const res of set) {
      if (!res.writableEnded) {
        try { res.write(`event: notification\ndata: ${data}\n\n`); } catch { /* skip dead */ }
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────
// getActiveConnectionCount — For health/monitoring endpoint
// ─────────────────────────────────────────────────────────────
export function getActiveConnectionCount(): { users: number; connections: number } {
  let connections = 0;
  for (const set of _connections.values()) connections += set.size;
  return { users: _connections.size, connections };
}