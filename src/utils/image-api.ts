// ─────────────────────────────────────────────────────────────
// Image Generation API — image-api.ts
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
}

// Client-side quick detection — avoids network round-trip
function clientSideImageCheck(prompt: string): boolean {
  const lower = prompt.toLowerCase().trim();
  const STRONG_SIGNALS = [
    'create an image', 'generate an image', 'create a picture', 'make an image',
    'draw me', 'draw a', 'create a diagram', 'generate a diagram',
    'create a cartoon', 'design a', 'create a logo', 'generate a logo',
    'animated car', 'animated character', 'cartoon version', 'anime style',
    'create art', 'generate art', 'make a drawing', 'create a sketch',
    'neon car', 'futuristic design', 'create an illustration',
    'generate an illustration', 'make me a', 'show me a picture',
    'create an animated', 'generate an animated', 'visualize',
    'create a poster', 'generate a poster', 'make a cartoon',
    'pixel art', '3d render', 'realistic image', 'show me how',
  ];
  if (STRONG_SIGNALS.some(s => lower.includes(s))) return true;

  // Pattern check
  const PATTERNS = [
    /\b(create|generate|draw|make|show|produce|design|render)\s+(an?\s+)?(image|picture|photo|diagram|illustration|sketch|artwork|poster|cartoon|character)/i,
    /\b(diagram|flowchart|mind\s*map|infographic)\s+(of|for|about|showing)?/i,
    /\b(design|draw|sketch|illustrate|visualize)\s+(me\s+)?(a|an|the)?\s/i,
    /\b(animated|anime|cartoon|pixel|neon|futuristic|cute|cool|crazy)\s+(version|style|design|art|picture|image|character|car|robot)/i,
  ];
  return PATTERNS.some(p => p.test(prompt));
}

export async function checkIsImageRequest(prompt: string): Promise<boolean> {
  // Quick client-side check first (no network needed)
  if (clientSideImageCheck(prompt)) return true;
  // Server-side check for edge cases
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