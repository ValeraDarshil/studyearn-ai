// New file: src/utils/user-api.ts
// Database API calls for user data sync

const AUTH_BASE = 'https://studyearn-backend.onrender.com/api';

// Get current user token
function getToken(): string | null {
  return localStorage.getItem('token');
}

// Get current user data from token
export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${AUTH_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data.user : null;
  } catch (err) {
    console.error('Get user error:', err);
    return null;
  }
}

// Update user points in database
export async function updateUserPoints(pointsToAdd: number) {
  const token = getToken();
  if (!token) return { success: false };

  try {
    const res = await fetch(`${AUTH_BASE}/user/add-points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ points: pointsToAdd }),
    });
    return await res.json();
  } catch (err) {
    console.error('Update points error:', err);
    return { success: false };
  }
}

// Use a question (decrement questionsLeft)
export async function useQuestion() {
  const token = getToken();
  if (!token) return { success: false };

  try {
    const res = await fetch(`${AUTH_BASE}/user/use-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error('Use question error:', err);
    return { success: false };
  }
}

// Log activity to database
export async function logActivity(action: string, details: string, pointsEarned: number) {
  const token = getToken();
  if (!token) return { success: false };

  try {
    const res = await fetch(`${AUTH_BASE}/user/log-activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action, details, pointsEarned }),
    });
    return await res.json();
  } catch (err) {
    console.error('Log activity error:', err);
    return { success: false };
  }
}

// Get user's recent activity
export async function getRecentActivity() {
  const token = getToken();
  if (!token) return { success: false, activities: [] };

  try {
    const res = await fetch(`${AUTH_BASE}/user/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Get activity error:', err);
    return { success: false, activities: [] };
  }
}