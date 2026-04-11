// imageGenService.ts (v5 — Smart SD-style prompt detection + Node.js fix)

import { logger } from '../../utils/logger.js';

const NVIDIA_API_KEY = (globalThis as any).process?.env?.NVIDIA_API_KEY || '';
const GROQ_KEY       = (globalThis as any).process?.env?.GROQ_API_KEY   || '';
const HF_TOKEN       = (globalThis as any).process?.env?.HF_TOKEN        || '';

export interface ImageGenResult {
  success: boolean; imageB64?: string; imageUrl?: string;
  provider: string; prompt: string; error?: string;
  isSvg?: boolean; svgContent?: string; format?: 'png' | 'jpeg' | 'svg';
}

const NVIDIA_MODELS = [
  { id: 'black-forest-labs/flux.1-schnell',     name: 'FLUX.1-schnell',     timeout: 45000 },
  { id: 'black-forest-labs/flux.1-dev',         name: 'FLUX.1-dev',         timeout: 90000 },
  { id: 'black-forest-labs/flux.2-klein-4b',    name: 'FLUX.2-klein-4b',    timeout: 60000 },
  { id: 'black-forest-labs/flux.1-kontext-dev', name: 'FLUX.1-Kontext-dev', timeout: 90000 },
];

// Node.js safe base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString('base64');
}

const DIAGRAM_PATTERNS = [
  /\b(flowchart|mindmap|mind\s+map|schematic|blueprint)\s+(of|for|showing)?\b/i,
  /\b(photosynthesis|cellular|anatomy|circuit|molecular|biological)\s+diagram\b/i,
  /\b(process|cycle|system|structure)\s+diagram\b/i,
  /\bdiagram\s+(of|for|about|showing|of\s+the)\b/i,
  /\b(explain|show|describe).*with\s+(a\s+)?diagram\b/i,
  /\blabeled\s+diagram\b/i,
];

const CREATIVE_SIGNALS = [
  /\b(animated|cartoon|anime|neon|futuristic|pixel|3d|cute|cool|crazy|stylized|realistic|fantasy|beautiful|stunning|vibrant|hyperreal|photorealistic|cinematic)\b/i,
  /\b(image|picture|photo|art|artwork|drawing|painting|sketch|illustration|poster|wallpaper|landscape|scene|portrait|render|rendering)\b/i,
  /\b(car|bike|vehicle|robot|monster|creature|superhero|animal|person|face|nature|mountain|ocean|forest|sky|sunset|sunrise|character|protagonist)\b/i,
];

const IMAGE_GEN_PHRASES = [
  'create an image', 'generate an image', 'create a picture', 'make an image',
  'draw me', 'draw a', 'create a cartoon', 'design a', 'create a logo',
  'generate a logo', 'animated car', 'animated character', 'cartoon version',
  'anime style', 'create art', 'generate art', 'make a drawing', 'create a sketch',
  'neon car', 'futuristic design', 'create an illustration', 'generate an illustration',
  'make me a', 'show me a picture', 'create an animated', 'generate an animated',
  'create a poster', 'generate a poster', 'make a cartoon', 'pixel art',
  '3d render', '3d character', 'realistic image', 'create a character', 'cartoon character',
  'create a nature', 'generate a nature', 'beautiful nature', 'beautiful image',
  'create a beautiful', 'generate a beautiful', 'create a scene', 'generate a scene',
  'make a picture', 'create a photo', 'generate a photo', 'create a landscape',
  'create a drawing', 'create a painting',
  'hyperreal', 'ultra realistic', 'ultra-realistic', 'hyper realistic', 'hyperrealism',
  'photorealistic', 'unreal engine', 'octane render', 'ray tracing', 'subsurface scattering',
  'global illumination', 'high poly', '8k resolution', '4k resolution',
  'masterpiece', 'best quality', 'highly detailed', 'ultra detailed', 'cinematic lighting',
  'depth of field', 'bokeh', 'rim light',
  'quality tags:', 'rendering style:', 'camera:', 'outfit:', 'pose:', 'environment:', 'lighting:',
];

function isSDStylePrompt(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  const SD_HEADERS = ['outfit:', 'pose:', 'environment:', 'lighting:', 'camera:', 'quality tags:', 'rendering style:', 'art style:', 'negative prompt:'];
  if (SD_HEADERS.some(h => lower.includes(h))) return true;

  const commas = (prompt.match(/,/g) || []).length;
  if (commas >= 5) {
    const visualTerms = [
      'photorealistic', 'cinematic', 'detailed', 'realistic', 'lighting', 'render',
      'resolution', 'quality', 'bokeh', 'depth of field', 'subsurface', 'unreal',
      'hyperreal', 'masterpiece', 'ray trac', 'ambient', 'textur', 'poly',
      'skin pore', 'facial', 'jawline', 'stubble', 'aaa', 'game character',
    ];
    const matches = visualTerms.filter(t => lower.includes(t)).length;
    if (matches >= 3) return true;
  }
  return false;
}

export function isImageGenRequest(prompt: string): boolean {
  if (isSDStylePrompt(prompt)) return true;
  const lower = prompt.toLowerCase().trim();
  if (IMAGE_GEN_PHRASES.some(p => lower.includes(p))) return true;
  const IMAGE_PATTERNS = [
    /\b(create|generate|draw|make|show|produce|design|render)\s+(an?\s+)?(image|picture|photo|illustration|sketch|artwork|poster|cartoon|character|scene|landscape|painting|drawing)/i,
    /\b(design|draw|sketch|illustrate|visualize)\s+(me\s+)?(a|an|the)?\s/i,
    /\b(animated|anime|cartoon|pixel|neon|futuristic|cute|cool|crazy|stylized|beautiful|realistic|hyperreal|photorealistic)\s+(version|style|design|art|picture|image|character|car|robot|nature|scene)/i,
    /\b(ultra[\s-]?realistic|hyper[\s-]?realistic|photo[\s-]?realistic)\s+\w+/i,
    /\b(3d|aaa)\s+(game|character|render|model|art)/i,
  ];
  return IMAGE_PATTERNS.some(p => p.test(prompt));
}

export function isDiagramRequest(prompt: string): boolean {
  if (isSDStylePrompt(prompt)) return false;
  const lower = prompt.toLowerCase();
  if (CREATIVE_SIGNALS.some(p => p.test(lower))) return false;
  return DIAGRAM_PATTERNS.some(p => p.test(lower));
}

function buildImagePrompt(userPrompt: string): string {
  if (isSDStylePrompt(userPrompt)) return userPrompt; // Use as-is
  const clean = userPrompt
    .replace(/\b(create|generate|draw|make|show me|give me|produce)\s+(an?\s+)?/i, '')
    .replace(/\b(image|picture|photo|illustration|visual)\s+(of|for|about|showing)?\s*/i, '')
    .trim();
  return `${clean}, masterpiece, highly detailed, vibrant colors, professional quality, 8k resolution, sharp focus, cinematic lighting`;
}

async function generateWithNvidia(prompt: string): Promise<ImageGenResult> {
  if (!NVIDIA_API_KEY) throw new Error('No NVIDIA_API_KEY set');
  for (const model of NVIDIA_MODELS) {
    try {
      const res = await fetch(`https://ai.api.nvidia.com/v1/genai/${model.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${NVIDIA_API_KEY}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ prompt, cfg_scale: 7.5, aspect_ratio: '1:1', seed: Math.floor(Math.random() * 999999), steps: 20, negative_prompt: 'blurry, low quality, distorted, watermark' }),
        signal: AbortSignal.timeout(model.timeout),
      });
      if (!res.ok) { logger.debug(`[NVIDIA] ${model.name} HTTP ${res.status}`); continue; }
      const data = await res.json();
      let b64: string | null = data.artifacts?.[0]?.base64 || data.image || data.b64_json || data.images?.[0] || null;
      if (!b64 || b64.length < 100) continue;
      b64 = b64.replace(/^data:image\/[a-z]+;base64,/, '');
      return { success: true, imageB64: b64, format: 'png', provider: `nvidia-${model.name}`, prompt };
    } catch (e: any) { logger.debug(`[NVIDIA] ${model.name}: ${e.message}`); }
  }
  throw new Error('All NVIDIA models failed');
}

async function generateWithPollinations(prompt: string): Promise<ImageGenResult> {
  const truncated = prompt.length > 500 ? prompt.slice(0, 500) : prompt;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(truncated)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 99999)}&nologo=true&enhance=true&model=flux`;
  const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(40000), headers: { 'User-Agent': 'StudyEarnAI/1.0' } });
  if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('image')) throw new Error(`Not an image: ${ct}`);
  const b64 = arrayBufferToBase64(await res.arrayBuffer());
  if (!b64 || b64.length < 100) throw new Error('Empty image');
  return { success: true, imageB64: b64, format: 'png', provider: 'pollinations', prompt };
}

async function generateWithHuggingFace(prompt: string): Promise<ImageGenResult> {
  if (!HF_TOKEN) throw new Error('No HF_TOKEN');
  const truncated = prompt.length > 500 ? prompt.slice(0, 500) : prompt;
  for (const model of ['black-forest-labs/FLUX.1-schnell', 'stabilityai/stable-diffusion-xl-base-1.0']) {
    try {
      const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: truncated, parameters: { width: 1024, height: 1024 } }), signal: AbortSignal.timeout(60000),
      });
      if (!res.ok || !res.headers.get('content-type')?.includes('image')) continue;
      const b64 = arrayBufferToBase64(await res.arrayBuffer());
      if (!b64 || b64.length < 100) continue;
      return { success: true, imageB64: b64, format: 'png', provider: `huggingface-${model.split('/')[1]}`, prompt };
    } catch {}
  }
  throw new Error('HuggingFace failed');
}

async function generateSvgDiagram(userPrompt: string): Promise<ImageGenResult> {
  if (!GROQ_KEY) throw new Error('No Groq key');
  const subject = userPrompt.replace(/\b(diagram|create|generate|draw|make|show me|of|for|about)\b/gi, '').trim() || userPrompt;
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', max_tokens: 3000, temperature: 0.3,
      messages: [{ role: 'user', content: `Create an educational SVG diagram for "${subject}". Output ONLY valid SVG <svg viewBox="0 0 800 600">...</svg>. White background, labeled shapes, arrows. NO JavaScript.` }],
    }),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
  const data = await res.json();
  const match = (data.choices?.[0]?.message?.content || '').match(/<svg[\s\S]*<\/svg>/i);
  if (!match) throw new Error('No SVG');
  return { success: true, isSvg: true, svgContent: match[0], format: 'svg', provider: 'groq-svg-diagram', prompt: userPrompt };
}

export async function generateImage(userPrompt: string): Promise<ImageGenResult> {
  const isDiagram  = isDiagramRequest(userPrompt);
  const isCreative = isImageGenRequest(userPrompt);
  logger.info(`[ImageGen] "${userPrompt.slice(0, 80)}" isDiagram=${isDiagram} isCreative=${isCreative}`);

  if (isDiagram && !isCreative) {
    try { return await generateSvgDiagram(userPrompt); } catch (e: any) { logger.debug(`SVG failed: ${e.message}`); }
  }

  const prompt = buildImagePrompt(userPrompt);
  for (const { name, fn } of [
    { name: 'NVIDIA',       fn: () => generateWithNvidia(prompt)       },
    { name: 'Pollinations', fn: () => generateWithPollinations(prompt)  },
    { name: 'HuggingFace',  fn: () => generateWithHuggingFace(prompt)   },
  ]) {
    try { const r = await fn(); logger.info(`[ImageGen] ✅ ${name}`); return r; }
    catch (e: any) { logger.debug(`[ImageGen] ${name} failed: ${e.message}`); }
  }

  if (GROQ_KEY) { try { return await generateSvgDiagram(userPrompt); } catch {} }

  return { success: false, error: 'Image generation failed. Please try again.', provider: 'none', prompt: userPrompt };
}