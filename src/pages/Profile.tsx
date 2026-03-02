// import { useState, useEffect } from "react";
// import {
//   User,
//   Mail,
//   Lock,
//   Calendar,
//   Zap,
//   Trophy,
//   Save,
//   Loader2,
// } from "lucide-react";
// import { useApp } from "../context/AppContext";
// import { getCurrentUser } from "../utils/user-api";
// import Lottie from "lottie-react";
// import streakAnimation from "../assets/animations/streak-fire.json";

// export function Profile() {
//   const { points, streak, questionsLeft } = useApp();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [joinedDate, setJoinedDate] = useState("");

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   const loadProfile = async () => {
//     const user = await getCurrentUser();
//     if (user) {
//       setName(user.name);
//       setEmail(user.email);
//       setJoinedDate(
//         new Date(user.createdAt).toLocaleDateString("en-US", {
//           month: "long",
//           day: "numeric",
//           year: "numeric",
//         }),
//       );
//     }
//     setLoading(false);
//   };

//   const handleSave = async () => {
//     setError("");
//     setSuccess("");

//     if (!name.trim()) {
//       setError("Name cannot be empty");
//       return;
//     }

//     if (!email.trim() || !email.includes("@")) {
//       setError("Please enter a valid email");
//       return;
//     }

//     setSaving(true);

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         "https://studyearn-backend.onrender.com/api/user/update-profile",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ name, email }),
//         },
//       );

//       const data = await res.json();

//       if (data.success) {
//         setSuccess("Profile updated successfully!");
//         const user = JSON.parse(localStorage.getItem("user") || "{}");
//         user.name = name;
//         user.email = email;
//         localStorage.setItem("user", JSON.stringify(user));
//       } else {
//         setError(data.message || "Update failed");
//       }
//     } catch (err) {
//       setError("Cannot connect to server");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//           <User className="w-6 h-6 text-purple-400" />
//           Profile Settings
//         </h1>
//         <p className="text-sm text-slate-400 mt-1">
//           Manage your account information
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-3 gap-4">
//         <div className="glass rounded-xl p-4 border border-white/5">
//           <div className="flex items-center gap-2 mb-2">
//             <Zap className="w-4 h-4 text-yellow-400" />
//             <span className="text-xs text-slate-500">Total Points</span>
//           </div>
//           <div className="text-2xl font-bold text-white">
//             {points.toLocaleString()}
//           </div>
//         </div>
//         {/* ✅ ANIMATED STREAK CARD */}
//         <div className="glass rounded-xl p-4 border border-white/5">
//           <div className="flex items-center gap-2 mb-2">
//             <Lottie
//               animationData={streakAnimation}
//               loop={true}
//               style={{ width: 30, height: 30 }}
//             />
//             <span className="text-xs text-slate-500">Day Streak</span>
//           </div>
//           <div className="text-2xl font-bold text-white">{streak} 🔥</div>
//         </div>
//         <div className="glass rounded-xl p-4 border border-white/5">
//           <div className="flex items-center gap-2 mb-2">
//             <Calendar className="w-4 h-4 text-blue-400" />
//             <span className="text-xs text-slate-500">Member Since</span>
//           </div>
//           <div className="text-sm font-semibold text-white">{joinedDate}</div>
//         </div>
//       </div>

//       {/* Profile Form */}
//       <div className="glass rounded-2xl p-6 border border-white/10 space-y-5">
//         <h2 className="text-lg font-semibold text-white mb-4">
//           Account Information
//         </h2>

//         {/* Name */}
//         <div>
//           <label className="text-sm font-medium text-slate-300 mb-2 block">
//             Full Name
//           </label>
//           <div className="relative">
//             <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Your name"
//               className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40"
//             />
//           </div>
//         </div>

//         {/* Email */}
//         <div>
//           <label className="text-sm font-medium text-slate-300 mb-2 block">
//             Email Address
//           </label>
//           <div className="relative">
//             <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40"
//             />
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400">
//             {success}
//           </div>
//         )}

//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
//         >
//           {saving ? (
//             <>
//               <Loader2 className="w-5 h-5 animate-spin" />
//               Saving...
//             </>
//           ) : (
//             <>
//               <Save className="w-5 h-5" />
//               Save Changes
//             </>
//           )}
//         </button>
//       </div>

//       {/* Password Section */}
//       <div className="glass rounded-2xl p-6 border border-white/10">
//         <h2 className="text-lg font-semibold text-white mb-4">Security</h2>
//         <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
//           <Lock className="w-5 h-5 text-slate-500" />
//           <div className="flex-1">
//             <div className="text-sm font-medium text-white">Password</div>
//             <div className="text-xs text-slate-500">
//               Last changed 30 days ago
//             </div>
//           </div>
//           <button className="px-4 py-2 rounded-lg bg-white/5 text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
//             Change
//           </button>
//         </div>
//       </div>

//       {/* Account Stats */}
//       <div className="glass rounded-2xl p-6 border border-white/10">
//         <h2 className="text-lg font-semibold text-white mb-4">
//           Activity Summary
//         </h2>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
//             <div className="text-xs text-slate-500 mb-1">Questions Asked</div>
//             <div className="text-xl font-bold text-white">
//               {5 - questionsLeft}/5 today
//             </div>
//           </div>
//           <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
//             <div className="text-xs text-slate-500 mb-1">Total Earnings</div>
//             <div className="text-xl font-bold text-white">{points} pts</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// calude aii //

import { useState, useEffect } from "react";
import { Mail, Lock, Calendar, Zap, Save, Loader2, Shield, Edit3, CheckCircle, X, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getCurrentUser } from "../utils/user-api";
import Lottie from "lottie-react";
import streakAnimation from "../assets/animations/streak-fire.json";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { calculateLevel, getLevelColor } from "../utils/level-utils";
import { AVATARS, AVATAR_CATEGORIES, getAvatar, type AvatarDef } from "../data/avatars";

// ── AvatarCircle — reusable everywhere ────────────────────────────────────────
export function AvatarCircle({
  avatarId, initials, size = "md", ring = true,
}: { avatarId?: string | null; initials: string; size?: "sm"|"md"|"lg"; ring?: boolean }) {
  const av = getAvatar(avatarId);
  const dims = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-28 h-28" : "w-24 h-24";
  const emojiSize = size === "lg" ? "text-4xl" : size === "sm" ? "text-base" : "text-3xl";
  const textSize  = size === "lg" ? "text-3xl"  : size === "sm" ? "text-xs"   : "text-2xl";

  return (
    <div className={`relative flex-shrink-0 ${dims}`}>
      {ring && (
        <>
          <div className="absolute inset-[-4px] rounded-full" style={{
            background: av ? `conic-gradient(from 0deg, ${av.glow}, transparent, ${av.glow})` : 'conic-gradient(from 0deg, #8b5cf6, #3b82f6, #06b6d4, #ec4899, #8b5cf6)',
            animation: 'spin-slow 4s linear infinite',
          }} />
          <div className="absolute inset-[-2px] rounded-full bg-gray-950" />
        </>
      )}

      {/* Avatar circle */}
      <div className={`relative ${dims} rounded-full flex items-center justify-center z-10 overflow-hidden bg-gradient-to-br ${av ? av.bg : "from-blue-500 via-purple-600 to-pink-500"}`}>
        {av?.imageUrl
          ? <img src={av.imageUrl} alt={av.label} className="w-full h-full object-cover rounded-full" />
          : av
            ? <span className={emojiSize} style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}>{av.emoji}</span>
            : <span className={`font-black text-white ${textSize}`}>{initials}</span>
        }
      </div>

      {ring && av && (
        <div className="absolute inset-0 rounded-full animate-pulse" style={{ boxShadow: `0 0 20px ${av.glow}40` }} />
      )}
      <style>{`@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Avatar Picker Modal ────────────────────────────────────────────────────────
function AvatarPickerModal({
  current, initials, onSelect, onClose,
}: { current: string | null; initials: string; onSelect: (id: string) => void; onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>("characters");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(current);

  const filtered = AVATARS.filter(a => a.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden border border-white/10"
        style={{ background: "rgba(8,10,25,0.97)", boxShadow: "0 0 80px rgba(139,92,246,0.2), 0 40px 80px rgba(0,0,0,0.8)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full bg-purple-600/15 blur-3xl" />
          </div>
          <div className="relative flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Choose Your Avatar</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 relative">Pick an avatar that represents you best</p>
        </div>

        {/* Preview strip */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <AvatarCircle avatarId={selected} initials={initials} size="md" ring={true} />
            <div>
              <div className="text-sm font-semibold text-white">
                {selected ? getAvatar(selected)?.label : "Default"} Avatar
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {selected ? `${getAvatar(selected)?.category} collection` : "Showing your initials"}
              </div>
            </div>
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="ml-auto text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="px-6 pb-3 flex gap-2">
          {AVATAR_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                  : "bg-white/[0.03] border border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Avatar grid */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-5 gap-2.5">
            {filtered.map((av, i) => {
              const isSelected = selected === av.id;
              const isHovered = hovered === av.id;
              return (
                <button
                  key={av.id}
                  onClick={() => setSelected(av.id)}
                  onMouseEnter={() => setHovered(av.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="group relative flex flex-col items-center gap-1.5 p-1"
                  style={{ animation: `avatarIn 0.3s ease ${i * 40}ms both` }}
                >
                  {/* Avatar circle */}
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${av.bg} flex items-center justify-center transition-all duration-200 overflow-hidden ${
                    isSelected ? "ring-2 scale-110" : isHovered ? "scale-105" : "scale-100"
                  }`}
                    style={isSelected ? { boxShadow: `0 0 20px ${av.glow}60`, ringColor: av.glow } : isHovered ? { boxShadow: `0 0 12px ${av.glow}40` } : {}}
                  >
                    {/* Inner glow */}
                    {(isSelected || isHovered) && (
                      <div className="absolute inset-0 rounded-2xl" style={{ background: `radial-gradient(circle at center, ${av.glow}30, transparent 70%)` }} />
                    )}
                    {av.imageUrl
                      ? <img src={av.imageUrl} alt={av.label} className="w-full h-full object-cover" />
                      : <span className="relative text-2xl" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }}>{av.emoji}</span>
                    }

                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <span className={`text-[9px] font-medium leading-none transition-colors ${isSelected ? "text-white" : "text-slate-600 group-hover:text-slate-400"}`}>
                    {av.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 text-sm hover:bg-white/5 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSelect(selected ?? ""); onClose(); }}
            className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}
          >
            Apply Avatar ✨
          </button>
        </div>

        <style>{`
          @keyframes avatarIn {
            from { opacity: 0; transform: scale(0.7) translateY(10px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}

// ── Main Profile Page ──────────────────────────────────────────────────────────
export function Profile() {
  const { points, streak, questionsLeft, unlockedAchievements } = useApp();
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [editMode, setEditMode]   = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [joinedDate, setJoinedDate] = useState("");
  const [avatarId, setAvatarId]   = useState<string | null>(null);

  const levelInfo  = calculateLevel(points);
  const levelColor = getLevelColor(levelInfo.currentLevel);

  const initials = name.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const user = await getCurrentUser();
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarId(user.avatar ?? null);
      setJoinedDate(new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
    }
    setLoading(false);
  };

  const handleAvatarSelect = async (id: string) => {
    const newId = id || null;
    setAvatarId(newId);
    // Immediately save avatar to backend
    try {
      const token = localStorage.getItem("token");
      await fetch("https://studyearn-backend.onrender.com/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, avatar: newId }),
      });
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.avatar = newId;
      localStorage.setItem("user", JSON.stringify(user));
    } catch {}
  };

  const handleSave = async () => {
    setError(""); setSuccess("");
    if (!name.trim()) { setError("Name cannot be empty"); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email"); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://studyearn-backend.onrender.com/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, avatar: avatarId }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Profile updated!");
        setEditMode(false);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.name = name; user.email = email; user.avatar = avatarId;
        localStorage.setItem("user", JSON.stringify(user));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Update failed");
      }
    } catch { setError("Cannot connect to server"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Avatar Picker Modal */}
      {showPicker && (
        <AvatarPickerModal
          current={avatarId}
          initials={initials}
          onSelect={handleAvatarSelect}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* ── Hero Card ─────────────────────────────────────────── */}
      <div className="relative glass rounded-3xl overflow-hidden border border-white/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        </div>

        <div className="relative p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with click-to-change */}
          <div className="relative group cursor-pointer" onClick={() => setShowPicker(true)}>
            <AvatarCircle avatarId={avatarId} initials={initials} size="lg" ring={true} />
            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-20"
              style={{ background: "rgba(0,0,0,0.6)", borderRadius: "9999px" }}>
              <div className="text-center">
                <Sparkles className="w-5 h-5 text-white mx-auto mb-0.5" />
                <span className="text-[9px] text-white font-semibold">Change</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-black text-white font-display tracking-tight">{name}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{email}</p>

            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${levelColor} text-white`}>
                ⚡ Level {levelInfo.currentLevel}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Joined {joinedDate}
              </span>
              <span className="text-xs text-slate-500">🏆 {unlockedAchievements.length} achievements</span>
            </div>

            {/* XP bar */}
            <div className="mt-4 max-w-sm mx-auto sm:mx-0">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
                <span>XP Progress</span>
                <span>{levelInfo.currentXP} / {levelInfo.requiredXP}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${levelColor} progress-animate`} style={{ width: `${levelInfo.progress}%` }} />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #7c3aed80, #3b82f680)", border: "1px solid rgba(139,92,246,0.3)" }}
            >
              <Sparkles className="w-3.5 h-3.5" /> Avatar
            </button>
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 hover:border-purple-500/40 text-sm text-slate-300 hover:text-white transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" /> {editMode ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
        {[
          { label: "Total Points",    value: points,                    icon: "💎", color: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/20" },
          { label: "Day Streak",      value: streak,                    icon: "🔥", color: "from-orange-500/20 to-orange-600/10", border: "border-orange-500/20", lottie: true },
          { label: "Questions Left",  value: questionsLeft,             icon: "🧠", color: "from-blue-500/20 to-blue-600/10",    border: "border-blue-500/20" },
          { label: "Achievements",    value: unlockedAchievements.length, icon: "🏆", color: "from-yellow-500/20 to-yellow-600/10", border: "border-yellow-500/20" },
        ].map(s => (
          <div key={s.label} className={`glass rounded-2xl p-4 border ${s.border} bg-gradient-to-br ${s.color} animate-slide-up group hover:-translate-y-0.5 transition-all duration-300 card-shine`}>
            <div className="flex items-center gap-2 mb-2">
              {s.lottie
                ? <Lottie animationData={streakAnimation} loop style={{ width: 22, height: 22 }} />
                : <span className="text-lg">{s.icon}</span>}
              <span className="text-[10px] text-slate-400 font-medium">{s.label}</span>
            </div>
            <div className="text-2xl font-black text-white"><AnimatedNumber value={s.value} /></div>
          </div>
        ))}
      </div>

      {/* ── Edit Form ──────────────────────────────────────────── */}
      {editMode && (
        <div className="glass rounded-2xl p-6 border border-purple-500/20 animate-slide-up space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-purple-400" /> Edit Profile
          </h2>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors" />
            </div>
          </div>
          {error   && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>}
          {success && <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" />{success}</div>}
          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-all glow-btn">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      )}

      {/* ── Activity & Security ────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/5 animate-slide-up">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Activity Summary
          </h2>
          <div className="space-y-3">
            {[
              { label: "Questions used today",   value: `${5 - questionsLeft}/5`,          bar: ((5 - questionsLeft) / 5) * 100,           color: "from-blue-500 to-cyan-500" },
              { label: "Points this session",    value: points.toLocaleString(),            bar: Math.min((points / 5000) * 100, 100),       color: "from-purple-500 to-pink-500" },
              { label: "Streak progress (7 day)", value: `${Math.min(streak, 7)}/7`,        bar: (Math.min(streak, 7) / 7) * 100,           color: "from-orange-500 to-red-500" },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${item.color} progress-animate`} style={{ width: `${item.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-white/5 animate-slide-up space-y-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" /> Security
          </h2>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Password</div>
              <div className="text-xs text-slate-500">Protected • Last changed recently</div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors">Change</button>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/15">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Account Status</div>
              <div className="text-xs text-green-400/80">Active & Verified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}