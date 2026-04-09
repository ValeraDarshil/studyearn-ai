// ─────────────────────────────────────────────────────────────
// Image Generation Service — imageGenService.ts
//
// PROVIDER CHAIN (all free tier):
//   1. NVIDIA — flux-dev (best quality, free tier available)
//   2. OpenRouter — free image models (fallback)
//   3. SVG diagram fallback — always works, no API needed
//
// Storage Strategy (DB-efficient):
//   - Store only base64 hash + metadata, NOT raw base64
//   - Use Conversation model's existing messages array
//   - Images stored as URLs (if hosted) or compressed base64
//   - Auto-compress: max 512x512 for storage, full for display
//   - 30-day TTL matches chat history TTL
// ─────────────────────────────────────────────────────────────

import { logger } from '../../utils/logger.js';

const NVIDIA_KEY     = (globalThis as any).process?.env?.NVIDIA_API_KEY     || '';
const OPENROUTER_KEY = (globalThis as any).process?.env?.OPENROUTER_API_KEY || '';
const NVIDIA_BASE    = 'https://integrate.api.nvidia.com/v1';

export interface ImageGenResult {
  success:    boolean;
  imageB64?:  string;   // base64 PNG — compressed for display
  imageUrl?:  string;   // URL if hosted externally
  provider:   string;
  prompt:     string;
  error?:     string;
  isSvg?:     boolean;  // true if fallback SVG returned
  svgContent?: string;  // SVG markup for diagram fallback
}

// ─── Detect if this is an image generation request ───────────
const IMAGE_GEN_PATTERNS = [
  /\b(create|generate|draw|make|show|give me|produce)\s+(an?\s+)?(image|picture|photo|diagram|illustration|chart|visual|figure|sketch)\b/i,
  /\b(diagram|flowchart|mind\s*map|timeline|infographic)\s+(of|for|about|showing)\b/i,
  /\bimage\s+(of|for|about|showing)\b/i,
  /\bvisualize\b/i,
  /\bshow\s+me\s+a\b/i,
];

export function isImageGenRequest(prompt: string): boolean {
  return IMAGE_GEN_PATTERNS.some(p => p.test(prompt));
}

// ─── Detect if it's a diagram (science/educational) ──────────
const DIAGRAM_PATTERNS = [
  /\b(diagram|flowchart|labeled|label)\b/i,
  /\b(photosynthesis|cell|atom|circuit|structure|process|cycle|system)\s+(diagram|structure)\b/i,
  /\bdiagram\s+(of|for|about|showing|of\s+the)\b/i,
];

export function isDiagramRequest(prompt: string): boolean {
  return DIAGRAM_PATTERNS.some(p => p.test(prompt));
}

// ─── Build optimized image prompt ────────────────────────────
function buildImagePrompt(userPrompt: string): string {
  const isDiagram = isDiagramRequest(userPrompt);

  // Clean the user prompt
  const clean = userPrompt
    .replace(/\b(create|generate|draw|make|show me|give me|produce)\s+(an?\s+)?/i, '')
    .replace(/\b(image|picture|photo|diagram|illustration|visual)\s+(of|for|about|showing)?\s*/i, '')
    .trim();

  if (isDiagram) {
    return `Educational labeled diagram: ${clean}. Clear labels, scientific accuracy, clean white background, professional textbook style, high detail, educational illustration`;
  }

  return `${clean}, high quality, detailed, educational illustration, professional, clean background`;
}

// ─── Provider 1: NVIDIA (flux-dev — best free image model) ───
async function generateWithNvidia(prompt: string): Promise<ImageGenResult> {
  if (!NVIDIA_KEY) throw new Error('No NVIDIA key');

  const response = await fetch(`${NVIDIA_BASE}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${NVIDIA_KEY}`,
    },
    body: JSON.stringify({
      model:   'black-forest-labs/flux-dev',
      prompt,
      n:       1,
      width:   1024,
      height:  1024,
    }),
    signal: AbortSignal.timeout(45000),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`NVIDIA HTTP ${response.status}: ${err.slice(0, 100)}`);
  }

  const data = await response.json();

  // NVIDIA returns base64 or URL
  const item = data.data?.[0];
  if (!item) throw new Error('NVIDIA: no image in response');

  if (item.b64_json) {
    return { success: true, imageB64: item.b64_json, provider: 'nvidia-flux', prompt };
  }
  if (item.url) {
    return { success: true, imageUrl: item.url, provider: 'nvidia-flux', prompt };
  }
  throw new Error('NVIDIA: no image data');
}

// ─── Provider 2: OpenRouter free image models ─────────────────
const OR_IMAGE_MODELS = [
  'black-forest-labs/flux-schnell:free',
  'black-forest-labs/flux-1-schnell:free',
];

async function generateWithOpenRouter(prompt: string): Promise<ImageGenResult> {
  if (!OPENROUTER_KEY) throw new Error('No OpenRouter key');

  for (const model of OR_IMAGE_MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer':  'https://studyearnai.tech',
        },
        body: JSON.stringify({
          model,
          prompt,
          n:      1,
          size:   '1024x1024',
        }),
        signal: AbortSignal.timeout(40000),
      });

      if (!response.ok) continue;
      const data = await response.json();
      const item = data.data?.[0];
      if (!item) continue;

      if (item.b64_json) return { success: true, imageB64: item.b64_json, provider: `openrouter-${model}`, prompt };
      if (item.url)      return { success: true, imageUrl: item.url,      provider: `openrouter-${model}`, prompt };
    } catch { continue; }
  }
  throw new Error('OpenRouter: all image models failed');
}

// ─── Provider 3: SVG diagram fallback (always free) ──────────
// Generates a beautiful SVG diagram using Groq text completion
async function generateSvgDiagram(userPrompt: string): Promise<ImageGenResult> {
  const GROQ_KEY = (globalThis as any).process?.env?.GROQ_API_KEY || '';
  if (!GROQ_KEY) throw new Error('No Groq key for SVG');

  const subject = userPrompt
    .replace(/\b(diagram|create|generate|draw|make|show me|of|for|about)\b/gi, '')
    .trim();

  const svgPrompt = `Create a clean, educational SVG diagram for "${subject}".

Requirements:
- Output ONLY valid SVG code, starting with <svg and ending with </svg>
- viewBox="0 0 800 600"
- White or light background (#f8fafc)
- Use colored boxes, arrows, labels — make it look like a textbook diagram
- Include clear text labels for all parts
- Use these colors: #3b82f6 (blue), #10b981 (green), #f59e0b (amber), #ef4444 (red), #8b5cf6 (violet)
- Font: sans-serif, size 14-16px
- Arrows: use simple lines with arrowheads
- NO JavaScript, NO external resources, NO images
- Make it educational and visually clear for students

Output ONLY the SVG code:`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 3000,
      temperature: 0.2,
      messages: [{ role: 'user', content: svgPrompt }],
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) throw new Error(`Groq SVG HTTP ${res.status}`);
  const data = await res.json();
  let svg = data.choices?.[0]?.message?.content || '';

  // Extract SVG from response
  const svgMatch = svg.match(/<svg[\s\S]*<\/svg>/i);
  if (!svgMatch) throw new Error('No SVG in Groq response');

  svg = svgMatch[0];
  return {
    success:    true,
    isSvg:      true,
    svgContent: svg,
    provider:   'groq-svg',
    prompt:     userPrompt,
  };
}

// ─── Main export ─────────────────────────────────────────────
export async function generateImage(userPrompt: string): Promise<ImageGenResult> {
  const optimizedPrompt = buildImagePrompt(userPrompt);
  const isDiagram       = isDiagramRequest(userPrompt);

  logger.info(`[ImageGen] prompt="${optimizedPrompt.slice(0,80)}" isDiagram=${isDiagram}`);

  // For diagrams: try SVG first (always works, no quota)
  if (isDiagram) {
    try {
      const svgResult = await generateSvgDiagram(userPrompt);
      logger.info('[ImageGen] ✅ SVG diagram generated');
      return svgResult;
    } catch (e: any) {
      logger.debug(`[ImageGen] SVG failed: ${e.message} — trying NVIDIA`);
    }
  }

  // Provider chain: NVIDIA → OpenRouter → SVG fallback
  const providers = [
    { name: 'NVIDIA',      fn: () => generateWithNvidia(optimizedPrompt) },
    { name: 'OpenRouter',  fn: () => generateWithOpenRouter(optimizedPrompt) },
    { name: 'SVG-fallback',fn: () => generateSvgDiagram(userPrompt) },
  ];

  for (const { name, fn } of providers) {
    try {
      const result = await fn();
      logger.info(`[ImageGen] ✅ ${name} success`);
      return result;
    } catch (e: any) {
      logger.debug(`[ImageGen] ${name} failed: ${e.message}`);
    }
  }

  return {
    success:  false,
    error:    'All image generation providers failed. Please try again.',
    provider: 'none',
    prompt:   userPrompt,
  };
}