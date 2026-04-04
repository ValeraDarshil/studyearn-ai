// ─────────────────────────────────────────────────────────────
// AskAI — askAIController.ts
// Drop-in upgrade for aiController.ts's askAIStream endpoint.
// Integrates the full ChatGPT-level pipeline into the SSE stream.
//
// Import this in your aiRoutes.ts and replace the askAIStream handler.
// ─────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import { buildMasterPrompt, afterResponse } from '../askAI/askAIService.js';
import { validateResponse, truncateIfNeeded } from '../askAI/responseValidator.js';
import { solveTextStreamWithContext }          from '../aiService.js';
import { getUserIdFromToken }                  from '../../middleware/authMiddleware.js';
import { logger }                             from '../../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// POST /api/ai/ask-stream  (UPGRADED — ChatGPT-level)
// ─────────────────────────────────────────────────────────────
export async function askAIStreamUpgraded(req: Request, res: Response): Promise<void> {
  const {
    prompt,
    history     = [],
    subjectMode = 'auto',
    stepByStep  = false,
  } = req.body;

  const userId = getUserIdFromToken(req) ?? '';

  if (!prompt) {
    res.status(400).json({ error: 'prompt required' });
    return;
  }

  // ── SSE headers ───────────────────────────────────────────
  res.setHeader('Content-Type',      'text/event-stream');
  res.setHeader('Cache-Control',     'no-cache');
  res.setHeader('Connection',        'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  try {
    // ── Step 1–7: Build master prompt via full pipeline ──────
    const promptPackage = await buildMasterPrompt({
      userId,
      message:    prompt,
      subjectMode,
      stepByStep,
      history:    Array.isArray(history) ? history : [],
    });

    logger.info(
      'AskAI stream | intent='    + promptPackage.plan.intent +
      ' strategy='  + promptPackage.plan.strategy +
      ' skill='     + promptPackage.context.skillLevel +
      ' model='     + promptPackage.modelConfig.modelId
    );

    // ── Step 8: Stream AI response ───────────────────────────
    // Collect the full response for post-processing
    let fullResponse = '';

    // Wrap solveTextStreamWithContext to also capture tokens
    const wrappedRes = createCapturingSSEProxy(res, (token: string) => {
      fullResponse += token;
    });

    await solveTextStreamWithContext(
      promptPackage.userMessage,
      promptPackage.history,
      promptPackage.systemPrompt,
      wrappedRes as any,
    );

    // ── Step 9: Validate response (non-blocking, just log) ───
    if (fullResponse) {
      const validation = validateResponse(
        fullResponse,
        promptPackage.plan.intent,
        prompt,
      );

      if (!validation.isValid) {
        logger.warn(
          'AskAI response quality low: score=' + validation.score +
          ' issues=' + validation.issues.join(', ')
        );
        // Note: we already streamed — can't replace. Just log for monitoring.
      }

      // ── Step 10: Update conversation memory ─────────────────
      afterResponse(
        userId,
        prompt,
        fullResponse,
        promptPackage.detectedTopic,
      );
    }

  } catch (err: any) {
    logger.error('AskAI stream error: ' + err.message);
    res.write('data: ' + JSON.stringify({ error: 'Stream failed. Please try again.' }) + '\n\n');
  } finally {
    res.end();
  }
}

// ─────────────────────────────────────────────────────────────
// createCapturingSSEProxy
// Creates a proxy around the SSE response that captures tokens
// for post-processing (memory update, validation) without
// interfering with the stream itself.
// ─────────────────────────────────────────────────────────────
function createCapturingSSEProxy(
  originalRes: Response,
  onToken: (token: string) => void,
) {
  return {
    ...originalRes,
    write: (chunk: any) => {
      // Extract token from SSE line for capture
      try {
        const str = typeof chunk === 'string' ? chunk : chunk.toString();
        const lines = str.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const raw = line.slice(6).trim();
            if (raw && raw !== '[DONE]') {
              const parsed = JSON.parse(raw);
              if (parsed.token) onToken(parsed.token);
            }
          }
        }
      } catch { /* ignore parse errors */ }

      // Always forward to real response
      return originalRes.write(chunk);
    },
    // Forward all other methods
    setHeader:     originalRes.setHeader.bind(originalRes),
    flushHeaders:  originalRes.flushHeaders.bind(originalRes),
    end:           originalRes.end.bind(originalRes),
    status:        originalRes.status.bind(originalRes),
    json:          originalRes.json.bind(originalRes),
    writableEnded: originalRes.writableEnded,
  };
}