// image-api.ts (v5 — Smart SD-style prompt detection)

import { API_URL } from './api';

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${localStorage.getItem('token') || ''}` };
}

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

// ─── Stable Diffusion / Midjourney style prompt detector ──────
// Catches long detailed prompts with section headers or many visual tags
function isSDStylePrompt(prompt: string): boolean {
  const lower = prompt.toLowerCase();

  // Section headers that ONLY appear in image prompts
  const SD_HEADERS = [
    'outfit:', 'pose:', 'environment:', 'lighting:', 'camera:',
    'quality tags:', 'rendering style:', 'art style:', 'negative prompt:',
    'style tags:', 'color palette:',
  ];
  if (SD_HEADERS.some(h => lower.includes(h))) return true;

  // Comma-heavy prompt with visual keywords = SD prompt
  const commas = (prompt.match(/,/g) || []).length;
  if (commas >= 5) {
    const visualTerms = [
      'photorealistic', 'cinematic', 'detailed', 'realistic', 'lighting', 'render',
      'resolution', 'quality', 'bokeh', 'depth of field', 'subsurface', 'unreal',
      'hyperreal', 'masterpiece', 'ray trac', 'ambient', 'textur', 'poly',
      'skin pore', 'facial', 'jawline', 'stubble', 'AAA', 'game character',
    ];
    const matches = visualTerms.filter(t => lower.includes(t.toLowerCase())).length;
    if (matches >= 3) return true;
  }

  return false;
}

const STRONG_IMAGE_PHRASES = [
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
  // Quality tags used in SD/MJ prompts
  'hyperreal', 'ultra realistic', 'ultra-realistic', 'hyper realistic', 'hyperrealism',
  'photorealistic', 'unreal engine', 'octane render', 'ray tracing', 'subsurface scattering',
  'global illumination', 'high poly', '8k resolution', '4k resolution',
  'masterpiece', 'best quality', 'highly detailed', 'ultra detailed', 'cinematic lighting',
  'depth of field', 'bokeh', 'rim light',
  // Section headers
  'quality tags:', 'rendering style:', 'camera:', 'outfit:', 'pose:', 'environment:', 'lighting:',
];

const IMAGE_PATTERNS = [
  /\b(create|generate|draw|make|show|produce|design|render)\s+(an?\s+)?(image|picture|photo|illustration|sketch|artwork|poster|cartoon|character|scene|landscape|painting|drawing)/i,
  /\b(design|draw|sketch|illustrate|visualize)\s+(me\s+)?(a|an|the)?\s/i,
  /\b(animated|anime|cartoon|pixel|neon|futuristic|cute|cool|crazy|stylized|beautiful|realistic|hyperreal|photorealistic)\s+(version|style|design|art|picture|image|character|car|robot|nature|scene)/i,
  /\b(ultra[\s-]?realistic|hyper[\s-]?realistic|photo[\s-]?realistic)\s+\w+/i,
  /\b(3d|aaa)\s+(game|character|render|model|art)/i,
];

export function clientSideImageCheck(prompt: string): boolean {
  if (isSDStylePrompt(prompt)) return true;
  const lower = prompt.toLowerCase().trim();
  if (STRONG_IMAGE_PHRASES.some(p => lower.includes(p))) return true;
  return IMAGE_PATTERNS.some(p => p.test(prompt));
}

export async function checkIsImageRequest(prompt: string): Promise<boolean> {
  if (clientSideImageCheck(prompt)) return true;
  try {
    const res = await fetch(`${API_URL}/api/image/check`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return data.isImageRequest === true;
  } catch { return false; }
}

export async function generateImage(prompt: string): Promise<ImageGenResult> {
  const res = await fetch(`${API_URL}/api/image/generate`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}