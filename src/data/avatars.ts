// // ═══════════════════════════════════════════════════════════════════════════
// // AVATAR CONFIG — Single source of truth for all profile avatars
// //
// // ✅ HOW TO ADD: Add object to AVATARS array, give it unique id
// // ❌ HOW TO REMOVE: Delete object from AVATARS array
// // Zero other files need changes. Zero breakage risk.
// // ═══════════════════════════════════════════════════════════════════════════

// export type AvatarCategory = 'cosmic' | 'nature' | 'tech' | 'legends';

// export interface AvatarDef {
//   id: string;
//   emoji: string;
//   label: string;
//   category: AvatarCategory;
//   bg: string;
//   glow: string;
// }

// export const AVATARS: AvatarDef[] = [
//   // cosmic
//   { id: 'av_galaxy',    emoji: '🌌', label: 'Galaxy',   category: 'cosmic',  bg: 'from-indigo-900 via-violet-800 to-blue-900',   glow: '#818cf8' },
//   { id: 'av_rocket',    emoji: '🚀', label: 'Rocket',   category: 'cosmic',  bg: 'from-slate-800 via-orange-700 to-red-800',     glow: '#fb923c' },
//   { id: 'av_planet',    emoji: '🪐', label: 'Saturn',   category: 'cosmic',  bg: 'from-amber-900 via-yellow-700 to-orange-800',  glow: '#fbbf24' },
//   { id: 'av_comet',     emoji: '☄️', label: 'Comet',    category: 'cosmic',  bg: 'from-sky-900 via-cyan-700 to-teal-800',        glow: '#22d3ee' },
//   { id: 'av_blackhole', emoji: '✨', label: 'Void',     category: 'cosmic',  bg: 'from-gray-950 via-purple-950 to-black',        glow: '#a855f7' },
//   // tech
//   { id: 'av_robot',     emoji: '🤖', label: 'Robot',    category: 'tech',    bg: 'from-slate-700 via-zinc-600 to-gray-700',      glow: '#94a3b8' },
//   { id: 'av_brain',     emoji: '🧠', label: 'Brain',    category: 'tech',    bg: 'from-pink-800 via-fuchsia-700 to-purple-800',  glow: '#e879f9' },
//   { id: 'av_atom',      emoji: '⚛️', label: 'Atom',     category: 'tech',    bg: 'from-blue-800 via-cyan-700 to-teal-700',       glow: '#06b6d4' },
//   { id: 'av_cpu',       emoji: '💻', label: 'Hacker',   category: 'tech',    bg: 'from-green-900 via-emerald-700 to-teal-800',   glow: '#10b981' },
//   { id: 'av_crown',     emoji: '👑', label: 'Crown',    category: 'tech',    bg: 'from-yellow-700 via-amber-600 to-orange-700',  glow: '#f59e0b' },
//   // nature
//   { id: 'av_fire',      emoji: '🔥', label: 'Fire',     category: 'nature',  bg: 'from-red-700 via-orange-600 to-yellow-600',    glow: '#f97316' },
//   { id: 'av_lightning', emoji: '⚡', label: 'Storm',    category: 'nature',  bg: 'from-yellow-600 via-amber-500 to-yellow-700',  glow: '#eab308' },
//   { id: 'av_gem',       emoji: '💎', label: 'Crystal',  category: 'nature',  bg: 'from-cyan-600 via-sky-500 to-blue-600',        glow: '#38bdf8' },
//   { id: 'av_moon',      emoji: '🌙', label: 'Moon',     category: 'nature',  bg: 'from-indigo-800 via-blue-700 to-slate-800',    glow: '#6366f1' },
//   { id: 'av_volcano',   emoji: '🌋', label: 'Magma',    category: 'nature',  bg: 'from-red-900 via-orange-700 to-red-800',       glow: '#ef4444' },
//   // legends
//   { id: 'av_ninja',     emoji: '🥷', label: 'Ninja',    category: 'legends', bg: 'from-gray-900 via-slate-700 to-gray-900',      glow: '#475569' },
//   { id: 'av_wizard',    emoji: '🧙', label: 'Wizard',   category: 'legends', bg: 'from-purple-900 via-violet-700 to-indigo-800', glow: '#7c3aed' },
//   { id: 'av_dragon',    emoji: '🐉', label: 'Dragon',   category: 'legends', bg: 'from-green-800 via-emerald-700 to-teal-800',   glow: '#059669' },
//   { id: 'av_phoenix',   emoji: '🦅', label: 'Phoenix',  category: 'legends', bg: 'from-orange-700 via-red-600 to-yellow-700',    glow: '#dc2626' },
//   { id: 'av_lion',      emoji: '🦁', label: 'Lion',     category: 'legends', bg: 'from-amber-700 via-yellow-600 to-orange-700',  glow: '#d97706' },
// ];

// export const AVATAR_CATEGORIES: { id: AvatarCategory; label: string; icon: string }[] = [
//   { id: 'cosmic',  label: 'Cosmic',  icon: '🌌' },
//   { id: 'tech',    label: 'Tech',    icon: '⚡' },
//   { id: 'nature',  label: 'Nature',  icon: '🌿' },
//   { id: 'legends', label: 'Legends', icon: '🏆' },
// ];

// export function getAvatar(id?: string | null): AvatarDef | null {
//   if (!id) return null;
//   return AVATARS.find(a => a.id === id) ?? null;
// }


// ═══════════════════════════════════════════════════════════════════════════
// AVATAR CONFIG — Single source of truth for all profile avatars
//
// ✅ HOW TO ADD A NEW IMAGE AVATAR:
//   1. Put your image in /src/assets/avatars/  (JPEG/PNG/WebP)
//   2. Add import below (follow the pattern)
//   3. Add entry to AVATARS with imageUrl pointing to your import
//   4. That's it! Zero other files to touch.
//
// ✅ HOW TO ADD AN EMOJI AVATAR:
//   Just add an entry to AVATARS — no import needed
//
// ❌ HOW TO REMOVE: Delete the entry from AVATARS (+ import if image)
// ═══════════════════════════════════════════════════════════════════════════

// ── Image avatar imports — add new imports here ───────────────────────────
import avatarBoyBlack   from '../assets/avatars/avatar_boy_black.jpeg';
import avatarBoyHoodie  from '../assets/avatars/avatar_boy_hoodie.jpeg';
import avatarGirlHoodie from '../assets/avatars/avatar_girl_hoodie.jpeg';
// import myNewAvatar from '../assets/avatars/my_new_avatar.jpeg';  ← ADD LIKE THIS

export type AvatarCategory = 'characters' | 'cosmic' | 'nature' | 'tech' | 'legends';

export interface AvatarDef {
  id: string;
  emoji: string;          // shown as fallback or for emoji-only avatars
  label: string;
  category: AvatarCategory;
  bg: string;             // gradient bg (used when no imageUrl)
  glow: string;           // hex color for the outer ring glow
  imageUrl?: string;      // if set, shows image instead of emoji
}

export const AVATARS: AvatarDef[] = [

  // ── 👤 Characters (real 3D avatars) ─────────────────────────────────────
  // Add more 3D character images here — they all appear in the Characters tab
  {
    id: 'ch_boy_black',
    emoji: '🧑',
    label: 'Alex',
    category: 'characters',
    bg: 'from-gray-700 via-slate-600 to-gray-800',
    glow: '#94a3b8',
    imageUrl: avatarBoyBlack,
  },
  {
    id: 'ch_boy_hoodie',
    emoji: '😎',
    label: 'Jay',
    category: 'characters',
    bg: 'from-blue-800 via-cyan-700 to-blue-900',
    glow: '#38bdf8',
    imageUrl: avatarBoyHoodie,
  },
  {
    id: 'ch_girl_hoodie',
    emoji: '🙂',
    label: 'Mia',
    category: 'characters',
    bg: 'from-teal-700 via-cyan-600 to-sky-700',
    glow: '#2dd4bf',
    imageUrl: avatarGirlHoodie,
  },
  // ← Paste more character entries here when you have more images

  // ── 🌌 Cosmic ───────────────────────────────────────────────────────────
  { id: 'av_galaxy',    emoji: '🌌', label: 'Galaxy',   category: 'cosmic',  bg: 'from-indigo-900 via-violet-800 to-blue-900',   glow: '#818cf8' },
  { id: 'av_rocket',    emoji: '🚀', label: 'Rocket',   category: 'cosmic',  bg: 'from-slate-800 via-orange-700 to-red-800',     glow: '#fb923c' },
  { id: 'av_planet',    emoji: '🪐', label: 'Saturn',   category: 'cosmic',  bg: 'from-amber-900 via-yellow-700 to-orange-800',  glow: '#fbbf24' },
  { id: 'av_comet',     emoji: '☄️', label: 'Comet',    category: 'cosmic',  bg: 'from-sky-900 via-cyan-700 to-teal-800',        glow: '#22d3ee' },
  { id: 'av_blackhole', emoji: '✨', label: 'Void',     category: 'cosmic',  bg: 'from-gray-950 via-purple-950 to-black',        glow: '#a855f7' },

  // ── ⚡ Tech ──────────────────────────────────────────────────────────────
  { id: 'av_robot',     emoji: '🤖', label: 'Robot',    category: 'tech',    bg: 'from-slate-700 via-zinc-600 to-gray-700',      glow: '#94a3b8' },
  { id: 'av_brain',     emoji: '🧠', label: 'Brain',    category: 'tech',    bg: 'from-pink-800 via-fuchsia-700 to-purple-800',  glow: '#e879f9' },
  { id: 'av_atom',      emoji: '⚛️', label: 'Atom',     category: 'tech',    bg: 'from-blue-800 via-cyan-700 to-teal-700',       glow: '#06b6d4' },
  { id: 'av_cpu',       emoji: '💻', label: 'Hacker',   category: 'tech',    bg: 'from-green-900 via-emerald-700 to-teal-800',   glow: '#10b981' },
  { id: 'av_crown',     emoji: '👑', label: 'Crown',    category: 'tech',    bg: 'from-yellow-700 via-amber-600 to-orange-700',  glow: '#f59e0b' },

  // ── 🌿 Nature ────────────────────────────────────────────────────────────
  { id: 'av_fire',      emoji: '🔥', label: 'Fire',     category: 'nature',  bg: 'from-red-700 via-orange-600 to-yellow-600',    glow: '#f97316' },
  { id: 'av_lightning', emoji: '⚡', label: 'Storm',    category: 'nature',  bg: 'from-yellow-600 via-amber-500 to-yellow-700',  glow: '#eab308' },
  { id: 'av_gem',       emoji: '💎', label: 'Crystal',  category: 'nature',  bg: 'from-cyan-600 via-sky-500 to-blue-600',        glow: '#38bdf8' },
  { id: 'av_moon',      emoji: '🌙', label: 'Moon',     category: 'nature',  bg: 'from-indigo-800 via-blue-700 to-slate-800',    glow: '#6366f1' },
  { id: 'av_volcano',   emoji: '🌋', label: 'Magma',    category: 'nature',  bg: 'from-red-900 via-orange-700 to-red-800',       glow: '#ef4444' },

  // ── 🏆 Legends ───────────────────────────────────────────────────────────
  { id: 'av_ninja',     emoji: '🥷', label: 'Ninja',    category: 'legends', bg: 'from-gray-900 via-slate-700 to-gray-900',      glow: '#475569' },
  { id: 'av_wizard',    emoji: '🧙', label: 'Wizard',   category: 'legends', bg: 'from-purple-900 via-violet-700 to-indigo-800', glow: '#7c3aed' },
  { id: 'av_dragon',    emoji: '🐉', label: 'Dragon',   category: 'legends', bg: 'from-green-800 via-emerald-700 to-teal-800',   glow: '#059669' },
  { id: 'av_phoenix',   emoji: '🦅', label: 'Phoenix',  category: 'legends', bg: 'from-orange-700 via-red-600 to-yellow-700',    glow: '#dc2626' },
  { id: 'av_lion',      emoji: '🦁', label: 'Lion',     category: 'legends', bg: 'from-amber-700 via-yellow-600 to-orange-700',  glow: '#d97706' },
];

// ── Category tabs shown in picker ────────────────────────────────────────────
export const AVATAR_CATEGORIES: { id: AvatarCategory; label: string; icon: string }[] = [
  { id: 'characters', label: 'Characters', icon: '👤' },
  { id: 'cosmic',     label: 'Cosmic',     icon: '🌌' },
  { id: 'tech',       label: 'Tech',       icon: '⚡' },
  { id: 'nature',     label: 'Nature',     icon: '🌿' },
  { id: 'legends',    label: 'Legends',    icon: '🏆' },
];

export function getAvatar(id?: string | null): AvatarDef | null {
  if (!id) return null;
  return AVATARS.find(a => a.id === id) ?? null;
}