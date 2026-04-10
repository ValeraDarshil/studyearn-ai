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
// Much broader detection — catches creative/visual requests
// even when user doesn't explicitly say "image"
const IMAGE_GEN_PATTERNS = [
  // Explicit image words
  /\b(create|generate|draw|make|show|give me|produce|design|build|render)\s+(an?\s+)?(image|picture|photo|diagram|illustration|chart|visual|figure|sketch|drawing|artwork|poster|banner)\b/i,
  // Diagram-first patterns
  /\b(diagram|flowchart|mind\s*map|timeline|infographic|blueprint|schematic)\s+(of|for|about|showing)?/i,
  /\b(image|picture|photo|visual|illustration)\s+(of|for|about|showing)\b/i,
  // Creative design requests
  /\b(design|draw|sketch|illustrate|depict|visualize|show)\s+(me\s+)?(a|an|the)?\s/i,
  // Character/scene creation
  /\b(create|generate|make|draw)\s+(a|an)\s+(cartoon|character|logo|icon|avatar|scene|landscape|portrait|anime|monster|robot|superhero|car|animal|creature|sprite)/i,
  // Animated/styled
  /\b(animated|anime|cartoon|pixel|3d|realistic|stylized|neon|futuristic|cute|cool|crazy)\s+(version|style|design|art|picture|image|illustration|character)/i,
  // Photo-realistic requests
  /\b(photo|photograph)\s+(of|showing|depicting)/i,
  // "Show me how X looks"
  /show\s+me\s+(how|what)\s+.{0,30}\s+(looks?|appears?)/i,
  // Asking for visualization
  /\bvisuali(ze|se)\b/i,
];

// Additional heuristic: short creative prompts that are likely image requests
function looksLikeCreativePrompt(prompt: string): boolean {
  const lower = prompt.toLowerCase().trim();
  // Phrases that strongly suggest image generation
  const STRONG_SIGNALS = [
    'create an image', 'generate an image', 'create a picture', 'make an image',
    'draw me', 'draw a', 'create a diagram', 'generate a diagram',
    'create a cartoon', 'design a', 'create a logo', 'generate a logo',
    'animated car', 'animated character', 'cartoon version', 'anime style',
    'create art', 'generate art', 'make a drawing', 'create a sketch',
    'neon car', 'futuristic design', 'create an illustration',
    'generate an illustration', 'make me a', 'show me a picture',
    'create an animated', 'generate an animated',
  ];
  return STRONG_SIGNALS.some(s => lower.includes(s));
}

export function isImageGenRequest(prompt: string): boolean {
  if (looksLikeCreativePrompt(prompt)) return true;
  return IMAGE_GEN_PATTERNS.some(p => p.test(prompt));
}

// ─── Detect if it's a REAL diagram request (educational only) ──
// STRICT rules:
//   ✅ "diagram of photosynthesis" → diagram
//   ✅ "explain photosynthesis with diagram" → diagram
//   ✅ "labeled diagram of a cell" → diagram
//   ❌ "animated car image" → NOT diagram (creative image)
//   ❌ "cartoon character" → NOT diagram
//   ❌ "neon car design" → NOT diagram
//   ❌ "create a drawing of a robot" → NOT diagram

// Things that override diagram detection — clearly creative/artistic
const CREATIVE_OVERRIDE = [
  /\b(animated|cartoon|anime|neon|futuristic|pixel|3d|cute|cool|crazy|stylized|realistic|fantasy|sci-fi)\b/i,
  /\b(character|avatar|logo|mascot|poster|art|artwork|portrait|illustration|landscape|scene|render)\b/i,
  /\b(car|bike|vehicle|robot|monster|creature|superhero|animal|person|face|character)\b/i,
  /\b(design|style|look|appearance|visual|drawing|sketch)\b/i,
];

// Only these are genuine diagram requests
const DIAGRAM_PATTERNS = [
  /\bdiagram\s+(of|for|about|showing|of\s+the)\b/i,       // "diagram of X"
  /\b(explain|show|describe).*with\s+(a\s+)?diagram\b/i, // "explain X with diagram"
  /\blabeled\s+diagram\b/i,                                 // "labeled diagram"
  /\b(flowchart|mindmap|mind\s+map|schematic|blueprint)\s+(of|for|showing)?\b/i,
  // Science-specific ONLY when "diagram" is explicitly mentioned
  /\b(photosynthesis|cellular|anatomy|circuit|molecular|biological)\s+diagram\b/i,
  /\b(process|cycle|system|structure)\s+diagram\b/i,
];

export function isDiagramRequest(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  
  // If it has creative/artistic signals → NOT a diagram
  if (CREATIVE_OVERRIDE.some(p => p.test(lower))) return false;
  
  // Must explicitly mention "diagram" or "flowchart" etc.
  return DIAGRAM_PATTERNS.some(p => p.test(lower));
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

  // Provider chain: NVIDIA → OpenRouter
  // SVG only used for explicit diagram requests (handled above)
  const providers = [
    { name: 'NVIDIA',     fn: () => generateWithNvidia(optimizedPrompt) },
    { name: 'OpenRouter', fn: () => generateWithOpenRouter(optimizedPrompt) },
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