// imageGenService.ts (v6 — FINAL FIX)
// ROOT CAUSE FIX: SVG is NEVER used as fallback for image requests

import { logger } from '../../utils/logger.js';

const NVIDIA_API_KEY     = (globalThis as any).process?.env?.NVIDIA_API_KEY     || '';
const GROQ_KEY           = (globalThis as any).process?.env?.GROQ_API_KEY       || '';
const HF_TOKEN           = (globalThis as any).process?.env?.HF_TOKEN            || '';
const STABLE_HORDE_KEY   = (globalThis as any).process?.env?.STABLE_HORDE_KEY   || '0000000000';

export interface ImageGenResult {
  success: boolean; imageB64?: string; imageUrl?: string;
  provider: string; prompt: string; error?: string;
  isSvg?: boolean; svgContent?: string; format?: 'png' | 'jpeg' | 'svg';
}

function toBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString('base64');
}

const NVIDIA_MODELS = [
  { name: 'FLUX.1-schnell',  url: 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell',  timeout: 60000 },
  { name: 'FLUX.1-dev',      url: 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev',      timeout: 90000 },
  { name: 'FLUX.2-klein-4b', url: 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b', timeout: 60000 },
];

const DIAGRAM_ONLY_PATTERNS = [
  /\b(flowchart|mindmap|mind\s+map|schematic|blueprint)\s+(of|for|showing)?\b/i,
  /\b(photosynthesis|cellular|anatomy|circuit|molecular|biological)\s+diagram\b/i,
  /\b(process|cycle|system|structure)\s+diagram\b/i,
  /\bdiagram\s+(of|for|about|showing)\b/i,
  /\blabeled\s+diagram\b/i,
];

const CREATIVE_KEYWORDS = [
  /\b(animated|cartoon|anime|neon|futuristic|pixel|3d|cute|cool|crazy|stylized|realistic|fantasy|beautiful|stunning|vibrant|hyperreal|photorealistic|cinematic|render)\b/i,
  /\b(image|picture|photo|art|artwork|drawing|painting|sketch|illustration|poster|landscape|scene|portrait|wallpaper)\b/i,
  /\b(car|bike|vehicle|robot|monster|creature|superhero|animal|person|face|nature|mountain|ocean|forest|sky|sunset|character|protagonist|human|male|female)\b/i,
];

const IMAGE_GEN_PHRASES = [
  'create an image','generate an image','create a picture','make an image','draw me','draw a',
  'create a cartoon','design a','create a logo','generate a logo','animated car','animated character',
  'cartoon version','anime style','create art','generate art','make a drawing','create a sketch',
  'neon car','futuristic design','create an illustration','generate an illustration','make me a',
  'show me a picture','create an animated','generate an animated','create a poster','generate a poster',
  'make a cartoon','pixel art','3d render','3d character','realistic image','create a character',
  'cartoon character','create a nature','beautiful image','create a beautiful','generate a beautiful',
  'create a scene','generate a scene','make a picture','create a photo','generate a photo',
  'create a landscape','create a drawing','create a painting',
  'hyperreal','ultra realistic','ultra-realistic','hyper realistic','hyperrealism',
  'photorealistic','unreal engine','octane render','ray tracing','subsurface scattering',
  'global illumination','high poly','8k resolution','4k resolution',
  'masterpiece','best quality','highly detailed','ultra detailed','cinematic lighting',
  'depth of field','bokeh','rim light',
  'quality tags:','rendering style:','camera:','outfit:','pose:','environment:','lighting:',
  'art style:','negative prompt:','style tags:',
];

function isSDStylePrompt(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  const headers = ['outfit:','pose:','environment:','lighting:','camera:','quality tags:','rendering style:','art style:','negative prompt:'];
  if (headers.some(h => lower.includes(h))) return true;
  const commas = (prompt.match(/,/g) || []).length;
  if (commas >= 5) {
    const terms = ['photorealistic','cinematic','detailed','realistic','lighting','render','resolution','quality','bokeh','depth of field','subsurface','unreal','hyperreal','masterpiece','ray trac','ambient','textur','poly','skin pore','facial','jawline','stubble','aaa','game character'];
    if (terms.filter(t => lower.includes(t)).length >= 3) return true;
  }
  return false;
}

export function isImageGenRequest(prompt: string): boolean {
  if (isSDStylePrompt(prompt)) return true;
  const lower = prompt.toLowerCase().trim();
  if (IMAGE_GEN_PHRASES.some(p => lower.includes(p))) return true;
  return [
    /\b(create|generate|draw|make|show|produce|design|render)\s+(an?\s+)?(image|picture|photo|illustration|sketch|artwork|poster|cartoon|character|scene|landscape|painting|drawing)/i,
    /\b(animated|anime|cartoon|pixel|neon|futuristic|cute|cool|crazy|beautiful|realistic|hyperreal|photorealistic)\s+(version|style|design|art|picture|image|character|car|robot|nature|scene)/i,
    /\b(ultra[\s-]?realistic|hyper[\s-]?realistic|photo[\s-]?realistic)\s+\w+/i,
    /\b(3d|aaa)\s+(game|character|render|model|art)/i,
  ].some(p => p.test(prompt));
}

export function isDiagramRequest(prompt: string): boolean {
  if (isSDStylePrompt(prompt)) return false;
  if (CREATIVE_KEYWORDS.some(p => p.test(prompt.toLowerCase()))) return false;
  return DIAGRAM_ONLY_PATTERNS.some(p => p.test(prompt));
}

function buildPrompt(userPrompt: string): string {
  if (isSDStylePrompt(userPrompt)) return userPrompt;
  const clean = userPrompt
    .replace(/\b(create|generate|draw|make|show me|give me|produce)\s+(an?\s+)?/i, '')
    .replace(/\b(image|picture|photo|illustration|visual)\s+(of|for|about|showing)?\s*/i, '')
    .trim();
  return `${clean}, masterpiece, highly detailed, vibrant colors, professional quality, 8k resolution, sharp focus, cinematic lighting`;
}

async function tryNvidia(prompt: string): Promise<ImageGenResult> {
  if (!NVIDIA_API_KEY) throw new Error('No NVIDIA_API_KEY');
  for (const model of NVIDIA_MODELS) {
    try {
      const res = await fetch(model.url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${NVIDIA_API_KEY}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          prompt,
          width: 1024,
          height: 1024,
          guidance_scale: 3.5,
          num_inference_steps: 20,
          seed: Math.floor(Math.random() * 9999999),
          negative_prompt: 'blurry, ugly, distorted, low quality, watermark',
        }),
        signal: AbortSignal.timeout(model.timeout),
      });
      if (!res.ok) { logger.debug(`[NVIDIA] ${model.name} ${res.status}`); continue; }
      const data = await res.json();
      let b64: string = data?.artifacts?.[0]?.base64 || data?.image || data?.b64_json || data?.images?.[0] || '';
      if (!b64 || b64.length < 500) continue;
      b64 = b64.replace(/^data:image\/[a-z+]+;base64,/, '');
      return { success: true, imageB64: b64, format: 'png', provider: `nvidia-${model.name}`, prompt };
    } catch (e: any) { logger.debug(`[NVIDIA] ${model.name}: ${e.message}`); }
  }
  throw new Error('NVIDIA all failed');
}

async function tryPollinations(prompt: string): Promise<ImageGenResult> {
  const p = prompt.length > 400 ? prompt.slice(0, 400) : prompt;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=1024&height=1024&seed=${Math.floor(Math.random()*99999)}&nologo=true&enhance=true&model=flux`;
  const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(45000), headers: { 'User-Agent': 'Mozilla/5.0 StudyEarnAI/1.0' } });
  if (!res.ok) throw new Error(`Pollinations ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('image')) throw new Error(`Not image: ${ct}`);
  const b64 = toBase64(await res.arrayBuffer());
  if (!b64 || b64.length < 500) throw new Error('Empty');
  return { success: true, imageB64: b64, format: 'png', provider: 'pollinations', prompt };
}

async function tryHuggingFace(prompt: string): Promise<ImageGenResult> {
  if (!HF_TOKEN) throw new Error('No HF_TOKEN');
  const p = prompt.length > 400 ? prompt.slice(0, 400) : prompt;
  for (const model of ['black-forest-labs/FLUX.1-schnell', 'stabilityai/stable-diffusion-xl-base-1.0']) {
    try {
      const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: p, parameters: { width: 1024, height: 1024 } }), signal: AbortSignal.timeout(90000),
      });
      if (!res.ok || !(res.headers.get('content-type') || '').includes('image')) continue;
      const b64 = toBase64(await res.arrayBuffer());
      if (!b64 || b64.length < 500) continue;
      return { success: true, imageB64: b64, format: 'png', provider: `huggingface-${model.split('/')[1]}`, prompt };
    } catch {}
  }
  throw new Error('HF all failed');
}

async function tryStableHorde(prompt: string): Promise<ImageGenResult> {
  const p = prompt.length > 300 ? prompt.slice(0, 300) : prompt;
  const submitRes = await fetch('https://stablehorde.net/api/v2/generate/async', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': STABLE_HORDE_KEY, 'Client-Agent': 'StudyEarnAI:1.0:studyearnai' },
    body: JSON.stringify({ prompt: p, params: { width: 512, height: 512, steps: 20, n: 1 }, models: ['Deliberate'], r2: false }),
    signal: AbortSignal.timeout(15000),
  });
  if (!submitRes.ok) throw new Error(`Horde submit ${submitRes.status}`);
  const { id } = await submitRes.json();
  if (!id) throw new Error('No job id');
  for (let i = 0; i < 18; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const check = await fetch(`https://stablehorde.net/api/v2/generate/check/${id}`, { signal: AbortSignal.timeout(10000) });
    if (!check.ok) continue;
    const status = await check.json();
    if (!status.done) continue;
    const result = await (await fetch(`https://stablehorde.net/api/v2/generate/status/${id}`, { signal: AbortSignal.timeout(10000) })).json();
    const imgUrl = result?.generations?.[0]?.img;
    if (!imgUrl) throw new Error('No img url');
    const imgRes = await fetch(imgUrl, { signal: AbortSignal.timeout(20000) });
    const b64 = toBase64(await imgRes.arrayBuffer());
    if (!b64 || b64.length < 500) throw new Error('Empty');
    return { success: true, imageB64: b64, format: 'png', provider: 'stable-horde', prompt };
  }
  throw new Error('Horde timeout');
}

async function makeSvgDiagram(userPrompt: string): Promise<ImageGenResult> {
  if (!GROQ_KEY) throw new Error('No Groq key');
  const subject = userPrompt.replace(/\b(diagram|create|generate|draw|make|show me|of|for|about)\b/gi, '').trim() || userPrompt;
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: 3000, temperature: 0.3, messages: [{ role: 'user', content: `Create an educational SVG diagram for "${subject}". Output ONLY valid SVG <svg viewBox="0 0 800 600">...</svg>. White background, labeled shapes, arrows. NO JavaScript.` }] }),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  const match = (data.choices?.[0]?.message?.content || '').match(/<svg[\s\S]*<\/svg>/i);
  if (!match) throw new Error('No SVG');
  return { success: true, isSvg: true, svgContent: match[0], format: 'svg', provider: 'groq-svg-diagram', prompt: userPrompt };
}

export async function generateImage(userPrompt: string): Promise<ImageGenResult> {
  const diagram  = isDiagramRequest(userPrompt);
  const creative = isImageGenRequest(userPrompt);
  logger.info(`[ImageGen] "${userPrompt.slice(0,80)}" | diagram=${diagram} creative=${creative}`);

  // ONLY pure diagrams → SVG
  if (diagram && !creative) {
    try { return await makeSvgDiagram(userPrompt); } catch (e: any) { logger.debug(`SVG: ${e.message}`); }
  }

  // Image requests → real providers ONLY, NEVER SVG fallback
  const p = buildPrompt(userPrompt);
  for (const { name, fn } of [
    { name: 'NVIDIA',       fn: () => tryNvidia(p)       },
    { name: 'Pollinations', fn: () => tryPollinations(p) },
    { name: 'HuggingFace',  fn: () => tryHuggingFace(p)  },
    { name: 'StableHorde',  fn: () => tryStableHorde(p)  },
  ]) {
    try { const r = await fn(); logger.info(`[ImageGen] ✅ ${name}`); return r; }
    catch (e: any) { logger.debug(`[ImageGen] ${name}: ${e.message}`); }
  }

  return { success: false, error: 'Image generation failed. NVIDIA_API_KEY .env mein set karo, ya thodi der baad try karo.', provider: 'none', prompt: userPrompt };
}