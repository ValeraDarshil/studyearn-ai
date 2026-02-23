// New file: src/utils/level-utils.ts
// Level calculation and progression system

export interface LevelInfo {
  currentLevel: number;
  currentXP: number;
  requiredXP: number;
  progress: number; // 0-100
  nextLevelXP: number;
}

/**
 * Calculate user level from total points
 * Formula: Level = floor(sqrt(points / 100))
 * Each level requires exponentially more points
 */
export function calculateLevel(totalPoints: number): LevelInfo {
  // Base XP per level (exponential growth)
  // Level 1: 100 XP
  // Level 2: 400 XP
  // Level 3: 900 XP
  // Level 4: 1600 XP
  // Level 5: 2500 XP
  // Formula: XP needed = (level * 100)^2
  
  const currentLevel = Math.floor(Math.sqrt(totalPoints / 100)) || 1;
  const currentLevelStartXP = Math.pow(currentLevel, 2) * 100;
  const nextLevelStartXP = Math.pow(currentLevel + 1, 2) * 100;
  
  const currentXP = totalPoints - currentLevelStartXP;
  const requiredXP = nextLevelStartXP - currentLevelStartXP;
  const progress = Math.min((currentXP / requiredXP) * 100, 100);

  return {
    currentLevel,
    currentXP,
    requiredXP,
    progress,
    nextLevelXP: nextLevelStartXP,
  };
}

/**
 * Get level tier name based on level
 */
export function getLevelTier(level: number): string {
  if (level >= 50) return '🏆 Master';
  if (level >= 30) return '💎 Expert';
  if (level >= 20) return '⭐ Advanced';
  if (level >= 10) return '🔥 Intermediate';
  if (level >= 5) return '🌟 Beginner+';
  return '🌱 Beginner';
}

/**
 * Get level color based on level
 */
export function getLevelColor(level: number): string {
  if (level >= 50) return 'from-yellow-400 to-orange-500';
  if (level >= 30) return 'from-purple-400 to-pink-500';
  if (level >= 20) return 'from-blue-400 to-cyan-500';
  if (level >= 10) return 'from-green-400 to-emerald-500';
  return 'from-slate-400 to-slate-500';
}