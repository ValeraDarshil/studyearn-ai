// ─────────────────────────────────────────────────────────────
// Image Generation Service — imageGenService.ts  (v3 — NVIDIA FLUX)
//
// PROVIDER CHAIN:
//   1. NVIDIA FLUX.1-schnell  — fastest, great quality
//   2. NVIDIA FLUX.1-dev      — higher quality, slower
//   3. NVIDIA flux.2-klein-4b — compact, efficient
//   4. NVIDIA FLUX.1-Kontext-dev — context-aware
//   5. Pollinations.ai        — 100% free fallback
//   6. HuggingFace            — free tier fallback
//   7. Groq SVG               — ONLY for actual educational diagrams
//
// FIX 1: Creative image requests (animated car, nature image, etc.)
//         → ALWAYS go to NVIDIA FLUX providers, NEVER to SVG
// FIX 2: Diagram requests (flowchart, photosynthesis diagram, etc.)
//         → Go to SVG generator (only strict diagrams)
// FIX 3: Download as PNG (SVG converted to PNG on frontend)
// ─────────────────────────────────────────────────────────────

import { logger } from '../../utils/logger.js';

const NVIDIA_API_KEY = (globalThis as any).process?.env?.NVIDIA_API_KEY || '';
const GROQ_KEY       = (globalThis as any).process?.env?.GROQ_API_KEY   || '';
const HF_TOKEN       = (globalThis as any).process?.env?.HF_TOKEN        || '';

export interface ImageGenResult {
  success:     boolean;
  imageB64?:   string;
  imageUrl?:   string;
  provider:    string;
  prompt:      string;
  error?:      string;
  isSvg?:      boolean;
  svgContent?: string;
  format?:     'png' | 'jpeg' | 'svg';
}

// ─── NVIDIA FLUX Models ───────────────────────────────────────
const NVIDIA_MODELS = [
  { id: 'black-forest-labs/flux.1-schnell',      name: 'FLUX.1-schnell',      timeout: 45000 },
  { id: 'black-forest-labs/flux.1-dev',          name: 'FLUX.1-dev',          timeout: 90000 },
  { id: 'black-forest-labs/flux.2-klein-4b',     name: 'FLUX.2-klein-4b',     timeout: 60000 },
  { id: 'black-forest-labs/flux.1-kontext-dev',  name: 'FLUX.1-Kontext-dev',  timeout: 90000 },
];

// ─── Strict diagram patterns — ONLY educational diagrams ──────
const DIAGRAM_PATTERNS = [
  /\b(flowchart|mindmap|mind\s+map|schematic|blueprint)\s+(of|for|showing)?\b/i,
  /\b(photosynthesis|cellular|anatomy|circuit|molecular|biological)\s+diagram\b/i,
  /\b(process|cycle|system|structure)\s+diagram\b/i,
  /\bdiagram\s+(of|for|about|showing|of\s+the)\b/i,
  /\b(explain|show|describe).*with\s+(a\s+)?diagram\b/i,
  /\blabeled\s+diagram\b/i,
];

// Creative signals — these ALWAYS mean image generation
const CREATIVE_SIGNALS = [
  /\b(animated|cartoon|anime|neon|futuristic|pixel|3d|cute|cool|crazy|stylized|realistic|fantasy|beautiful|stunning|vibrant)\b/i,
  /\b(image|picture|photo|art|artwork|drawing|painting|sketch|illustration|poster|wallpaper|landscape|scene|portrait)\b/i,
  /\b(car|bike|vehicle|robot|monster|creature|superhero|animal|person|face|nature|mountain|ocean|forest|sky|sunset|sunrise)\b/i,
];

// Strong image generation phrases
const IMAGE_GEN_PHRASES = [
  'create an image', 'generate an image', 'create a picture', 'make an image',
  'draw me', 'draw a', 'create a cartoon', 'design a', 'create a logo',
  'generate a logo', 'animated car', 'animated character', 'cartoon version',
  'anime style', 'create art', 'generate art', 'make a drawing', 'create a sketch',
  'neon car', 'futuristic design', 'create an illustration', 'generate an illustration',
  'make me a', 'show me a picture', 'create an animated', 'generate an animated',
  'create a poster', 'generate a poster', 'make a cartoon', 'pixel art',
  '3d render', 'realistic image', 'create a character', 'cartoon character',
  'create a nature', 'generate a nature', 'beautiful nature', 'beautiful image',
  'create a beautiful', 'generate a beautiful', 'show me a', 'create a scene',
  'generate a scene', 'make a picture', 'create a photo', 'generate a photo',
  'create a landscape', 'create a drawing', 'create a painting', 'create an art',
];

export function isImageGenRequest(prompt: string): boolean {
  const lower = prompt.toLowerCase().trim();
  if (IMAGE_GEN_PHRASES.some(p => lower.includes(p))) return true;
  const IMAGE_PATTERNS = [
    /\b(create|generate|draw|make|show|produce|design|render)\s+(an?\s+)?(image|picture|photo|illustration|sketch|artwork|poster|cartoon|character|scene|landscape|painting|drawing)/i,
    /\b(design|draw|sketch|illustrate|visualize)\s+(me\s+)?(a|an|the)?\s/i,
    /\b(animated|anime|cartoon|pixel|neon|futuristic|cute|cool|crazy|stylized|beautiful|realistic)\s+(version|style|design|art|picture|image|character|car|robot|nature|scene)/i,
  ];
  return IMAGE_PATTERNS.some(p => p.test(prompt));
}

export function isDiagramRequest(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  // If it has creative signals → image generation, not a diagram
  if (CREATIVE_SIGNALS.some(p => p.test(lower))) return false;
  return DIAGRAM_PATTERNS.some(p => p.test(lower));
}

// ─── Build optimized prompt for FLUX models ───────────────────
function buildImagePrompt(userPrompt: string): string {
  const clean = userPrompt
    .replace(/\b(create|generate|draw|make|show me|give me|produce)\s+(an?\s+)?/i, '')
    .replace(/\b(image|picture|photo|illustration|visual)\s+(of|for|about|showing)?\s*/i, '')
    .trim();
  return `${clean}, masterpiece, highly detailed, vibrant colors, professional quality, 8k resolution, sharp focus, perfect composition, cinematic lighting`;
}

// ─── Provider 1: NVIDIA FLUX Models ──────────────────────────
async function generateWithNvidia(prompt: string): Promise<ImageGenResult> {
  if (!NVIDIA_API_KEY) throw new Error('No NVIDIA_API_KEY set');

  for (const model of NVIDIA_MODELS) {
    try {
      logger.info(`[ImageGen] Trying NVIDIA ${model.name}…`);

      const res = await fetch(`https://ai.api.nvidia.com/v1/genai/${model.id}`, {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type':  'application/json',
          'Accept':        'application/json',
        },
        body: JSON.stringify({
          prompt,
          cfg_scale:       7.5,
          aspect_ratio:    '1:1',
          seed:            Math.floor(Math.random() * 999999),
          steps:           20,
          negative_prompt: 'blurry, low quality, distorted, ugly, bad anatomy, watermark, text overlay',
        }),
        signal: AbortSignal.timeout(model.timeout),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        logger.debug(`[ImageGen] NVIDIA ${model.name} HTTP ${res.status}: ${errText.slice(0, 150)}`);
        continue;
      }

      const data = await res.json();

      // NVIDIA returns base64 in different fields depending on model version
      let b64: string | null = null;
      if (data.artifacts?.[0]?.base64)      b64 = data.artifacts[0].base64;
      else if (data.image)                   b64 = data.image;
      else if (data.b64_json)                b64 = data.b64_json;
      else if (data.images?.[0])             b64 = data.images[0];
      else if (typeof data === 'string' && data.length > 100) b64 = data;

      if (!b64 || b64.length < 100) {
        logger.debug(`[ImageGen] NVIDIA ${model.name}: empty response`);
        continue;
      }

      // Strip data URI prefix if present
      b64 = b64.replace(/^data:image\/[a-z]+;base64,/, '');

      logger.info(`[ImageGen] ✅ NVIDIA ${model.name} success`);
      return { success: true, imageB64: b64, format: 'png', provider: `nvidia-${model.name}`, prompt };
    } catch (e: any) {
      logger.debug(`[ImageGen] NVIDIA ${model.name} error: ${e.message}`);
    }
  }

  throw new Error('All NVIDIA FLUX models failed');
}

// ─── Helper: ArrayBuffer → base64 (Node.js safe) ─────────────
// btoa() is browser-only! In Node.js, use Buffer.from()
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString('base64');
}

// ─── Provider 2: Pollinations.ai — FREE fallback ──────────────
async function generateWithPollinations(prompt: string): Promise<ImageGenResult> {
  const encoded  = encodeURIComponent(prompt);
  const seed     = Math.floor(Math.random() * 99999);
  const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true&model=flux`;

  const res = await fetch(imageUrl, {
    method: 'GET',
    signal: AbortSignal.timeout(40000),
    headers: { 'User-Agent': 'StudyEarnAI/1.0' },
  });
  if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('image')) throw new Error(`Pollinations: not an image (got ${contentType})`);

  // ✅ Node.js compatible
  const b64 = arrayBufferToBase64(await res.arrayBuffer());
  if (!b64 || b64.length < 100) throw new Error('Pollinations: empty image');

  return { success: true, imageB64: b64, format: 'png', provider: 'pollinations', prompt };
}

// ─── Provider 3: HuggingFace ──────────────────────────────────
async function generateWithHuggingFace(prompt: string): Promise<ImageGenResult> {
  if (!HF_TOKEN) throw new Error('No HF_TOKEN');

  for (const model of ['black-forest-labs/FLUX.1-schnell', 'stabilityai/stable-diffusion-xl-base-1.0']) {
    try {
      const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ inputs: prompt, parameters: { width: 1024, height: 1024 } }),
        signal:  AbortSignal.timeout(60000),
      });

      if (!res.ok) continue;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('image')) continue;

      // ✅ Node.js compatible
      const b64 = arrayBufferToBase64(await res.arrayBuffer());
      if (!b64 || b64.length < 100) continue;

      return { success: true, imageB64: b64, format: 'png', provider: `huggingface-${model.split('/')[1]}`, prompt };
    } catch {}
  }
  throw new Error('HuggingFace: all models failed');
}

// ─── Provider 4: Groq SVG — ONLY for actual diagrams ─────────
async function generateSvgDiagram(userPrompt: string): Promise<ImageGenResult> {
  if (!GROQ_KEY) throw new Error('No Groq key');

  const subject = userPrompt
    .replace(/\b(diagram|create|generate|draw|make|show me|of|for|about)\b/gi, '')
    .trim() || userPrompt;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model:       'llama-3.3-70b-versatile',
      max_tokens:  3000,
      temperature: 0.3,
      messages: [{ role: 'user', content: `Create an educational SVG diagram for "${subject}".
Output ONLY valid SVG starting with <svg viewBox="0 0 800 600"> and ending with </svg>.
Requirements: colored labeled boxes/shapes, arrows, white background (#f8fafc), sans-serif text 14px, professional style.
Colors: #3b82f6 blue, #10b981 green, #f59e0b amber, #ef4444 red, #8b5cf6 violet.
NO JavaScript. Output ONLY the SVG:` }],
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
  const data = await res.json();
  let svg = data.choices?.[0]?.message?.content || '';

  const match = svg.match(/<svg[\s\S]*<\/svg>/i);
  if (!match) throw new Error('No SVG in response');

  return {
    success:    true,
    isSvg:      true,
    svgContent: match[0],
    format:     'svg',
    provider:   'groq-svg-diagram',
    prompt:     userPrompt,
  };
}

// ─── Main export ──────────────────────────────────────────────
export async function generateImage(userPrompt: string): Promise<ImageGenResult> {
  const isDiagram  = isDiagramRequest(userPrompt);
  const isCreative = isImageGenRequest(userPrompt);

  logger.info(`[ImageGen] "${userPrompt.slice(0, 60)}" isDiagram=${isDiagram} isCreative=${isCreative}`);

  // Pure educational diagram (no creative signals) → SVG
  if (isDiagram && !isCreative) {
    try {
      const r = await generateSvgDiagram(userPrompt);
      logger.info('[ImageGen] ✅ Groq SVG diagram');
      return r;
    } catch (e: any) {
      logger.debug(`[ImageGen] SVG diagram failed: ${e.message}, falling to image providers`);
    }
  }

  // Creative images → NVIDIA FLUX → Pollinations → HuggingFace
  const optimizedPrompt = buildImagePrompt(userPrompt);
  const providers = [
    { name: 'NVIDIA-FLUX',  fn: () => generateWithNvidia(optimizedPrompt)      },
    { name: 'Pollinations', fn: () => generateWithPollinations(optimizedPrompt) },
    { name: 'HuggingFace',  fn: () => generateWithHuggingFace(optimizedPrompt)  },
  ];

  for (const { name, fn } of providers) {
    try {
      const r = await fn();
      logger.info(`[ImageGen] ✅ ${name}`);
      return r;
    } catch (e: any) {
      logger.debug(`[ImageGen] ${name} failed: ${e.message}`);
    }
  }

  return {
    success:  false,
    error:    'Image generation failed. NVIDIA API key check karo ya thodi der baad try karo.',
    provider: 'none',
    prompt:   userPrompt,
  };
}