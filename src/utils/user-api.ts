/**
 * StudyEarn AI — User API Utils (Frontend)
 * ─────────────────────────────────────────────────────────────
 * All authenticated API calls for user data.
 * Base URL: configured via VITE_API_URL env variable.
 */

const AUTH_BASE = `${import.meta.env.VITE_API_URL}/api`;

function getToken(): string | null {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─────────────────────────────────────────────────────────────
// GET CURRENT USER
// ─────────────────────────────────────────────────────────────
export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const res  = await fetch(`${AUTH_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!data.success) return null;
    return data.streakInfo ? { ...data.user, _streakInfo: data.streakInfo } : data.user;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// ADD POINTS
// ─────────────────────────────────────────────────────────────
export async function updateUserPoints(pointsToAdd: number) {
  try {
    const res = await fetch(`${AUTH_BASE}/user/add-points`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ points: pointsToAdd }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

// ─────────────────────────────────────────────────────────────
// USE QUESTION (decrement daily quota)
// ─────────────────────────────────────────────────────────────
export async function useQuestion() {
  try {
    const res = await fetch(`${AUTH_BASE}/user/use-question`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

// ─────────────────────────────────────────────────────────────
// LOG ACTIVITY
// ─────────────────────────────────────────────────────────────
export async function logActivity(action: string, details: string, pointsEarned: number) {
  try {
    const res = await fetch(`${AUTH_BASE}/user/log-activity`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ action, details, pointsEarned }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

// ─────────────────────────────────────────────────────────────
// GET RECENT ACTIVITY
// ─────────────────────────────────────────────────────────────
export async function getRecentActivity() {
  try {
    const token = getToken();
    const res   = await fetch(`${AUTH_BASE}/user/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false, activities: [] };
  }
}

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────
export async function getAchievements() {
  try {
    const token = getToken();
    const res   = await fetch(`${AUTH_BASE}/user/achievements`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false, unlockedAchievements: [], totalQuestionsAsked: 0, totalPPTsGenerated: 0, totalPDFsConverted: 0 };
  }
}

export async function unlockAchievement(achievementId: string) {
  try {
    const res = await fetch(`${AUTH_BASE}/user/unlock-achievement`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ achievementId }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

export async function incrementAction(action: 'question' | 'ppt' | 'pdf') {
  try {
    const res = await fetch(`${AUTH_BASE}/user/increment-action`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ action }),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

// ─────────────────────────────────────────────────────────────
// UPDATE STREAK
// ─────────────────────────────────────────────────────────────
export async function updateStreak() {
  try {
    const res = await fetch(`${AUTH_BASE}/user/update-streak`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}