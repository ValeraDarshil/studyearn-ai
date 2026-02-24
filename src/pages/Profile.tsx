// import { User, Mail, GraduationCap, Calendar, Award, Settings, Bell, Shield, Flame, Star, Edit } from 'lucide-react';
// import { useApp } from '../context/AppContext';
// import { achievements } from '../data/mockData';

// export function Profile() {
//   const { points, streak } = useApp();

//   return (
//     <div className="max-w-3xl mx-auto space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//           <User className="w-6 h-6 text-blue-400" />
//           Profile
//         </h1>
//         <p className="text-sm text-slate-400 mt-1">Manage your account and preferences</p>
//       </div>

//       {/* Profile Card */}
//       <div className="glass rounded-2xl p-6 relative overflow-hidden">
//         <div className="orb w-[250px] h-[250px] bg-purple-600 top-[-100px] right-[-100px]" />
//         <div className="relative z-10">
//           <div className="flex flex-col sm:flex-row items-start gap-6">
//             <div className="relative group">
//               <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
//                 🧑‍💻
//               </div>
//               <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-navy-800 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                 <Edit className="w-3 h-3 text-slate-400" />
//               </button>
//             </div>
//             <div className="flex-1">
//               <h2 className="text-xl font-bold text-white">Alex Student</h2>
//               <p className="text-sm text-slate-400 mt-0.5">alex.student@email.com</p>
//               <div className="flex flex-wrap items-center gap-3 mt-3">
//                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300">
//                   <Star className="w-3 h-3" /> Level 12
//                 </span>
//                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-300">
//                   <Flame className="w-3 h-3" /> {streak} Day Streak
//                 </span>
//                 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300">
//                   <Award className="w-3 h-3" /> {points.toLocaleString()} pts
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Info Cards */}
//       <div className="grid sm:grid-cols-2 gap-4">
//         <div className="glass rounded-2xl p-5 space-y-4">
//           <h3 className="text-sm font-semibold text-white flex items-center gap-2">
//             <User className="w-4 h-4 text-blue-400" />
//             Personal Info
//           </h3>
//           <div className="space-y-3">
//             {[
//               { icon: User, label: 'Name', value: 'Alex Student' },
//               { icon: Mail, label: 'Email', value: 'alex.student@email.com' },
//               { icon: GraduationCap, label: 'Class', value: 'Class 12 - Science' },
//               { icon: Calendar, label: 'Joined', value: 'January 2024' },
//             ].map((item) => (
//               <div key={item.label} className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
//                   <item.icon className="w-4 h-4 text-slate-500" />
//                 </div>
//                 <div>
//                   <div className="text-[10px] text-slate-600 uppercase tracking-wider">{item.label}</div>
//                   <div className="text-sm text-white">{item.value}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="glass rounded-2xl p-5 space-y-4">
//           <h3 className="text-sm font-semibold text-white flex items-center gap-2">
//             <Award className="w-4 h-4 text-purple-400" />
//             Study Stats
//           </h3>
//           <div className="space-y-3">
//             {[
//               { label: 'Questions Asked', value: '127' },
//               { label: 'PPTs Generated', value: '23' },
//               { label: 'Documents Converted', value: '45' },
//               { label: 'Total Study Time', value: '38 hours' },
//             ].map((stat) => (
//               <div key={stat.label} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
//                 <span className="text-sm text-slate-400">{stat.label}</span>
//                 <span className="text-sm font-semibold text-white">{stat.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Achievements */}
//       <div className="glass rounded-2xl p-5">
//         <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
//           <Award className="w-4 h-4 text-yellow-400" />
//           Badges ({achievements.filter(a => a.unlocked).length}/{achievements.length})
//         </h3>
//         <div className="flex flex-wrap gap-3">
//           {achievements.map((badge) => (
//             <div
//               key={badge.id}
//               className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-smooth ${
//                 badge.unlocked
//                   ? 'bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20'
//                   : 'bg-white/[0.01] border-white/5 opacity-40'
//               }`}
//             >
//               <span className="text-lg">{badge.icon}</span>
//               <span className="text-xs font-medium text-white">{badge.name}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Settings */}
//       <div className="glass rounded-2xl p-5">
//         <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
//           <Settings className="w-4 h-4 text-slate-400" />
//           Quick Settings
//         </h3>
//         <div className="space-y-1">
//           {[
//             { icon: Bell, label: 'Notifications', desc: 'Manage notification preferences' },
//             { icon: Shield, label: 'Privacy', desc: 'Control your privacy settings' },
//             { icon: Settings, label: 'Account Settings', desc: 'Update password and security' },
//           ].map((setting) => (
//             <button
//               key={setting.label}
//               className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors text-left"
//             >
//               <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
//                 <setting.icon className="w-4 h-4 text-slate-500" />
//               </div>
//               <div className="flex-1">
//                 <div className="text-sm text-white">{setting.label}</div>
//                 <div className="text-xs text-slate-600">{setting.desc}</div>
//               </div>
//               <div className="text-slate-600">›</div>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// ---------- claude ai ------------ //

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Calendar,
  Zap,
  Trophy,
  Save,
  Loader2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getCurrentUser } from "../utils/user-api";
import Lottie from "lottie-react";
import streakAnimation from "../assets/animations/streak-fire.json";

export function Profile() {
  const { points, streak, questionsLeft } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [joinedDate, setJoinedDate] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = await getCurrentUser();
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setJoinedDate(
        new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      );
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://studyearn-backend.onrender.com/api/user/update-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setSuccess("Profile updated successfully!");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.name = name;
        user.email = email;
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-purple-400" />
          Profile Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-500">Total Points</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {points.toLocaleString()}
          </div>
        </div>
        {/* ✅ ANIMATED STREAK CARD */}
        <div className="glass rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Lottie
              animationData={streakAnimation}
              loop={true}
              style={{ width: 30, height: 30 }}
            />
            <span className="text-xs text-slate-500">Day Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">{streak} 🔥</div>
        </div>
        <div className="glass rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-500">Member Since</span>
          </div>
          <div className="text-sm font-semibold text-white">{joinedDate}</div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Account Information
        </h2>

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Password Section */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Security</h2>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <Lock className="w-5 h-5 text-slate-500" />
          <div className="flex-1">
            <div className="text-sm font-medium text-white">Password</div>
            <div className="text-xs text-slate-500">
              Last changed 30 days ago
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/5 text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            Change
          </button>
        </div>
      </div>

      {/* Account Stats */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">
          Activity Summary
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-slate-500 mb-1">Questions Asked</div>
            <div className="text-xl font-bold text-white">
              {5 - questionsLeft}/5 today
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-slate-500 mb-1">Total Earnings</div>
            <div className="text-xl font-bold text-white">{points} pts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
