// ─────────────────────────────────────────────────────────────
// Image Generation API — image-api.ts  (v3 — NVIDIA FLUX)
// ─────────────────────────────────────────────────────────────

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

// ─── Client-side quick detection ─────────────────────────────
// These phrases are CLEARLY image generation requests
// → Skip GK check entirely, go straight to image gen
const STRONG_IMAGE_PHRASES = [
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

const IMAGE_PATTERNS = [
  /\b(create|generate|draw|make|show|produce|design|render)\s+(an?\s+)?(image|picture|photo|illustration|sketch|artwork|poster|cartoon|character|scene|landscape|painting|drawing)/i,
  /\b(design|draw|sketch|illustrate|visualize)\s+(me\s+)?(a|an|the)?\s/i,
  /\b(animated|anime|cartoon|pixel|neon|futuristic|cute|cool|crazy|stylized|beautiful|realistic)\s+(version|style|design|art|picture|image|character|car|robot|nature|scene)/i,
];

export function clientSideImageCheck(prompt: string): boolean {
  const lower = prompt.toLowerCase().trim();
  if (STRONG_IMAGE_PHRASES.some(p => lower.includes(p))) return true;
  return IMAGE_PATTERNS.some(p => p.test(prompt));
}

export async function checkIsImageRequest(prompt: string): Promise<boolean> {
  // Quick client-side check first (no network needed)
  if (clientSideImageCheck(prompt)) return true;
  // Server-side check for edge cases
  try {
    const res = await fetch(`${API_URL}/api/image/check`, {
      method:  'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body:    JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return data.isImageRequest === true;
  } catch { return false; }
}

export async function generateImage(prompt: string): Promise<ImageGenResult> {
  const res = await fetch(`${API_URL}/api/image/generate`, {
    method:  'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body:    JSON.stringify({ prompt }),
  });
  return res.json();
}