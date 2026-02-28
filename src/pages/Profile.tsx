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
import {
  Mail, Lock, Calendar, Zap, Save, Loader2, Shield, Edit3, CheckCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getCurrentUser } from "../utils/user-api";
import Lottie from "lottie-react";
import streakAnimation from "../assets/animations/streak-fire.json";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { calculateLevel, getLevelColor } from "../utils/level-utils";

export function Profile() {
  const { points, streak, questionsLeft, userName, unlockedAchievements } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [joinedDate, setJoinedDate] = useState("");

  const levelInfo = calculateLevel(points);
  const levelColor = getLevelColor(levelInfo.currentLevel);

  // Initials from name
  const initials = name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const user = await getCurrentUser();
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setJoinedDate(new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      }));
    }
    setLoading(false);
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
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Profile updated!");
        setEditMode(false);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.name = name; user.email = email;
        localStorage.setItem("user", JSON.stringify(user));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Update failed");
      }
    } catch {
      setError("Cannot connect to server");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Hero Card with Avatar ────────────────────────────── */}
      <div className="relative glass rounded-3xl overflow-hidden border border-white/5">
        {/* Background mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl" />
          {/* Grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Glowing Avatar Ring */}
          <div className="relative flex-shrink-0">
            {/* outer spinning gradient ring */}
            <div
              className="absolute inset-[-4px] rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #8b5cf6, #3b82f6, #06b6d4, #ec4899, #8b5cf6)',
                animation: 'spin-slow 4s linear infinite',
                borderRadius: '9999px',
              }}
            />
            {/* gap ring */}
            <div className="absolute inset-[-2px] rounded-full" style={{ background: '#030712', borderRadius: '9999px' }} />
            {/* avatar */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center z-10">
              <span className="text-3xl font-black text-white font-display tracking-tight">{initials}</span>
            </div>
            {/* pulse glow */}
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />

            <style>{`@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-black text-white font-display tracking-tight">{name}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{email}</p>

            {/* Level badge */}
            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${levelColor} text-white`}>
                ⚡ Level {levelInfo.currentLevel}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Joined {joinedDate}
              </span>
              <span className="text-xs text-slate-500">
                🏆 {unlockedAchievements.length} achievements
              </span>
            </div>

            {/* XP bar */}
            <div className="mt-4 max-w-sm mx-auto sm:mx-0">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
                <span>XP Progress</span>
                <span>{levelInfo.currentXP} / {levelInfo.requiredXP}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${levelColor} progress-animate`}
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Edit toggle */}
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 hover:border-purple-500/40 text-sm text-slate-300 hover:text-white transition-all flex-shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
        {[
          { label: 'Total Points', value: points, icon: '💎', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20' },
          { label: 'Day Streak',   value: streak, icon: '🔥', color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20', lottie: true },
          { label: 'Questions Left', value: questionsLeft, icon: '🧠', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20' },
          { label: 'Achievements', value: unlockedAchievements.length, icon: '🏆', color: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/20' },
        ].map((s) => (
          <div key={s.label} className={`glass rounded-2xl p-4 border ${s.border} bg-gradient-to-br ${s.color} animate-slide-up group hover:-translate-y-0.5 transition-all duration-300 card-shine`}>
            <div className="flex items-center gap-2 mb-2">
              {s.lottie
                ? <Lottie animationData={streakAnimation} loop style={{ width: 22, height: 22 }} />
                : <span className="text-lg">{s.icon}</span>}
              <span className="text-[10px] text-slate-400 font-medium">{s.label}</span>
            </div>
            <div className="text-2xl font-black text-white">
              <AnimatedNumber value={s.value} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Edit Form ────────────────────────────────────────── */}
      {editMode && (
        <div className="glass rounded-2xl p-6 border border-purple-500/20 animate-slide-up space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-purple-400" /> Edit Profile
          </h2>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {success}
            </div>
          )}

          <button
            onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-all glow-btn"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      )}

      {/* ── Activity & Security ──────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Activity */}
        <div className="glass rounded-2xl p-5 border border-white/5 animate-slide-up">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Activity Summary
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Questions used today', value: `${5 - questionsLeft}/5`, bar: ((5 - questionsLeft) / 5) * 100, color: 'from-blue-500 to-cyan-500' },
              { label: 'Points this session', value: points.toLocaleString(), bar: Math.min((points / 5000) * 100, 100), color: 'from-purple-500 to-pink-500' },
              { label: 'Streak progress (7 day)', value: `${Math.min(streak, 7)}/7`, bar: (Math.min(streak, 7) / 7) * 100, color: 'from-orange-500 to-red-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} progress-animate`}
                    style={{ width: `${item.bar}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
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
            <button className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              Change
            </button>
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