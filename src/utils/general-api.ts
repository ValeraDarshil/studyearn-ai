// ─────────────────────────────────────────────────────────────
// General Knowledge API — general-api.ts
// Frontend utility to call Wikipedia-powered GK endpoints
// ─────────────────────────────────────────────────────────────

import { API_URL } from './api';

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${localStorage.getItem('token') || ''}` };
}

export interface GKData {
  isGeneral:    boolean;
  title:        string;
  summary:      string;
  imageUrl?:    string;
  imageCaption?: string;
  wikiUrl?:     string;
  type:         'person' | 'place' | 'concept' | 'event' | 'unknown';
  keyFacts:     string[];
}

// Check if a prompt is a general knowledge question
export async function checkIsGeneral(prompt: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_URL}/api/general/check?q=${encodeURIComponent(prompt)}`,
      { headers: authHeaders() }
    );
    const data = await res.json();
    return data.isGeneral === true;
  } catch { return false; }
}

// Fetch general knowledge data from Wikipedia
export async function fetchGeneralKnowledge(prompt: string): Promise<GKData | null> {
  try {
    const res = await fetch(`${API_URL}/api/general/fetch`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (data.success && data.data) return data.data as GKData;
    return null;
  } catch { return null; }
}