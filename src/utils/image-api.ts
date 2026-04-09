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

export async function checkIsImageRequest(prompt: string): Promise<boolean> {
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