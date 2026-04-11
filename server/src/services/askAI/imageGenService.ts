// ─────────────────────────────────────────────────────────────
// Image Generation Service — imageGenService.ts  (v2 — Fixed)
//
// PROVIDER CHAIN (tested, working, free):
//   1. Pollinations.ai  — 100% free, no API key, unlimited
//                         Best for creative/artistic images
//   2. HuggingFace     — free tier, FLUX.1-schnell model
//                         Good quality, needs HF_TOKEN env var
//   3. Groq SVG        — always works (Groq text → SVG code)
//                         For diagrams AND creative requests
//
// NOTE: NVIDIA image gen and OpenRouter image gen endpoints
// are NOT free / don't work on free tier — removed.
// ─────────────────────────────────────────────────────────────

import { logger } from '../../utils/logger.js';

const GROQ_KEY = (globalThis as any).process?.env?.GROQ_API_KEY    || '';
const HF_TOKEN = (globalThis as any).process?.env?.HF_TOKEN         || '';

export interface ImageGenResult {
  success:     boolean;
  imageB64?:   string;
  imageUrl?:   string;
  provider:    string;
  prompt:      string;
  error?:      string;
  isSvg?:      boolean;
  svgContent?: string;
}

// ─── Detect image generation requests ────────────────────────
const CREATIVE_OVERRIDE = [
  /\b(animated|cartoon|anime|neon|futuristic|pixel|3d|cute|cool|crazy|stylized|realistic|fantasy|sci-fi)\b/i,
  /\b(character|avatar|logo|mascot|poster|art|artwork|portrait|illustration|landscape|scene|render)\b/i,
  /\b(car|bike|vehicle|robot|monster|creature|superhero|animal|person|face)\b/i,
];

const DIAGRAM_PATTERNS = [
  /\bdiagram\s+(of|for|about|showing|of\s+the)\b/i,
  /\b(explain|show|describe).*with\s+(a\s+)?diagram\b/i,
  /\blabeled\s+diagram\b/i,
  /\b(flowchart|mindmap|mind\s+map|schematic|blueprint)\s+(of|for|showing)?\b/i,
  /\b(photosynthesis|cellular|anatomy|circuit|molecular|biological)\s+diagram\b/i,
  /\b(process|cycle|system|structure)\s+diagram\b/i,
];

const IMAGE_GEN_PATTERNS = [
  /\b(create|generate|draw|make|show|produce|design|render)\s+(an?\s+)?(image|picture|photo|diagram|illustration|sketch|artwork|poster|cartoon|character)/i,
  /\b(diagram|flowchart|infographic)\s+(of|for|about|showing)?/i,
  /\b(design|draw|sketch|illustrate|visualize)\s+(me\s+)?(a|an|the)?\s/i,
  /\b(animated|anime|cartoon|pixel|neon|futuristic|cute|cool|crazy|stylized)\s+(version|style|design|art|picture|image|character|car|robot)/i,
];

function clientSideImageSignals(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  const STRONG = [
    'create an image','generate an image','create a picture','make an image',
    'draw me','draw a','create a diagram','generate a diagram',
    'create a cartoon','design a','create a logo','generate a logo',
    'animated car','animated character','cartoon version','anime style',
    'create art','generate art','make a drawing','create a sketch',
    'neon car','futuristic design','create an illustration',
    'generate an illustration','make me a','show me a picture',
    'create an animated','generate an animated','visualize',
    'create a poster','generate a poster','make a cartoon','pixel art',
    '3d render','realistic image','create a character','cartoon character',
  ];
  return STRONG.some(s => lower.includes(s));
}

export function isImageGenRequest(prompt: string): boolean {
  if (clientSideImageSignals(prompt)) return true;
  return IMAGE_GEN_PATTERNS.some(p => p.test(prompt));
}

export function isDiagramRequest(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  if (CREATIVE_OVERRIDE.some(p => p.test(lower))) return false;
  return DIAGRAM_PATTERNS.some(p => p.test(lower));
}

// ─── Build optimized prompt ───────────────────────────────────
function buildImagePrompt(userPrompt: string): string {
  const clean = userPrompt
    .replace(/\b(create|generate|draw|make|show me|give me|produce)\s+(an?\s+)?/i, '')
    .replace(/\b(image|picture|photo|illustration|visual)\s+(of|for|about|showing)?\s*/i, '')
    .trim();

  if (isDiagramRequest(userPrompt)) {
    return `Educational labeled diagram: ${clean}. Clear labels, scientific accuracy, white background, professional textbook style`;
  }
  // For creative requests — keep it simple and vivid
  return `${clean}, vibrant colors, high detail, digital art style, sharp`;
}

// ─── Provider 1: Pollinations.ai — 100% FREE, no key needed ──
// Simple URL-based API — just GET the image URL
async function generateWithPollinations(prompt: string): Promise<ImageGenResult> {
  const encoded  = encodeURIComponent(prompt);
  const seed     = Math.floor(Math.random() * 99999);
  // Pollinations URL returns image directly
  const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`;

  // Verify it responds (HEAD request)
  const check = await fetch(imageUrl, {
    method: 'GET',
    signal: AbortSignal.timeout(30000),
  });

  if (!check.ok) throw new Error(`Pollinations HTTP ${check.status}`);

  // Convert to base64 for storage/display consistency
  const buffer  = await check.arrayBuffer();
  const bytes   = new Uint8Array(buffer);
  let   binary  = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  if (!b64 || b64.length < 100) throw new Error('Pollinations: empty image');

  return {
    success:  true,
    imageB64: b64,
    provider: 'pollinations',
    prompt,
  };
}

// ─── Provider 2: HuggingFace Inference API (free tier) ───────
// Requires HF_TOKEN env var (free account at huggingface.co)
async function generateWithHuggingFace(prompt: string): Promise<ImageGenResult> {
  if (!HF_TOKEN) throw new Error('No HF_TOKEN');

  const HF_MODELS = [
    'black-forest-labs/FLUX.1-schnell',
    'stabilityai/stable-diffusion-xl-base-1.0',
  ];

  for (const model of HF_MODELS) {
    try {
      const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({ inputs: prompt, parameters: { width: 1024, height: 1024 } }),
        signal: AbortSignal.timeout(60000),
      });

      if (!res.ok) { logger.debug(`[HF] ${model} HTTP ${res.status}`); continue; }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('image')) { continue; }

      const buffer = await res.arrayBuffer();
      const bytes  = new Uint8Array(buffer);
      let binary   = '';
      for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
      const b64 = btoa(binary);
      if (!b64 || b64.length < 100) continue;

      return { success: true, imageB64: b64, provider: `huggingface-${model.split('/')[1]}`, prompt };
    } catch (e: any) {
      logger.debug(`[HF] ${model} error: ${e.message}`);
      continue;
    }
  }
  throw new Error('HuggingFace: all models failed');
}

// ─── Provider 3: Groq SVG (always works — text to SVG) ───────
async function generateSvgDiagram(userPrompt: string): Promise<ImageGenResult> {
  if (!GROQ_KEY) throw new Error('No Groq key');

  const isDiagram = isDiagramRequest(userPrompt);
  const subject   = userPrompt
    .replace(/\b(diagram|create|generate|draw|make|show me|of|for|about|image|picture|cartoon|character|animated|crazy)\b/gi, '')
    .trim() || userPrompt;

  const svgPrompt = isDiagram
    ? `Create an educational SVG diagram for "${subject}".
Output ONLY valid SVG starting with <svg viewBox="0 0 800 600"> and ending with </svg>.
Requirements: colored labeled boxes, arrows, white/light background (#f8fafc), sans-serif text 14px, professional textbook style.
Colors: #3b82f6 blue, #10b981 green, #f59e0b amber, #ef4444 red, #8b5cf6 violet.
NO JavaScript. Output ONLY the SVG:`
    : `Create a creative SVG illustration of "${subject}".
Output ONLY valid SVG starting with <svg viewBox="0 0 800 600"> and ending with </svg>.
Requirements: colorful, vibrant, artistic, detailed shapes and colors. Use gradients, circles, polygons.
Make it look like a fun cartoon/illustration. White background.
Colors: Use bright vivid colors — oranges, blues, greens, purples.
NO JavaScript. Output ONLY the SVG:`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model:       'llama-3.3-70b-versatile',
      max_tokens:  3000,
      temperature: 0.3,
      messages: [{ role: 'user', content: svgPrompt }],
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
  const data = await res.json();
  let svg = data.choices?.[0]?.message?.content || '';

  const match = svg.match(/<svg[\s\S]*<\/svg>/i);
  if (!match) throw new Error('No SVG in response');
  svg = match[0];

  return {
    success:    true,
    isSvg:      true,
    svgContent: svg,
    provider:   isDiagram ? 'groq-svg-diagram' : 'groq-svg-illustration',
    prompt:     userPrompt,
  };
}

// ─── Main export ──────────────────────────────────────────────
export async function generateImage(userPrompt: string): Promise<ImageGenResult> {
  const optimizedPrompt = buildImagePrompt(userPrompt);
  const isDiagram       = isDiagramRequest(userPrompt);

  logger.info(`[ImageGen] "${userPrompt.slice(0,60)}" isDiagram=${isDiagram}`);

  // Diagrams: use Groq SVG directly (best for educational diagrams)
  if (isDiagram) {
    try {
      const r = await generateSvgDiagram(userPrompt);
      logger.info('[ImageGen] ✅ Groq SVG diagram');
      return r;
    } catch (e: any) {
      logger.debug(`[ImageGen] SVG diagram failed: ${e.message}`);
    }
  }

  // Creative images: Pollinations → HuggingFace → Groq SVG
  const providers = [
    { name: 'Pollinations', fn: () => generateWithPollinations(optimizedPrompt) },
    { name: 'HuggingFace',  fn: () => generateWithHuggingFace(optimizedPrompt) },
    { name: 'Groq-SVG',     fn: () => generateSvgDiagram(userPrompt) },
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
    error:    'All image generation providers failed. Please try again.',
    provider: 'none',
    prompt:   userPrompt,
  };
}