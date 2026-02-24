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
