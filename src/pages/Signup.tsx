import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  User as UserIcon,
  LogIn,
  Loader2,
  Gift,
  CheckCircle2,
} from "lucide-react";

export function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(refCode || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReferralBonus, setShowReferralBonus] = useState(false);

  // ✅ Toast state — replaces ugly alert()
  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  useEffect(() => {
    if (refCode) setShowReferralBonus(true);
  }, [refCode]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    if (!/\d/.test(password)) {
      setError("Password must contain at least one number (e.g. abc12345)");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            referralCode: referralCode.trim().toUpperCase() || undefined,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);

        // ✅ Toast instead of alert() — beautiful, non-blocking
        if (data.referralBonus) {
          showToast("🎉 Referral bonus applied! You got 200 points!");
        }

        navigate("/app");
        // ✅ Same as Login — reload so App.tsx loadUserData() runs fresh
        window.location.reload();
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Cannot connect to server. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animated-bg grid-bg">
      {/* Orbs */}
      <div className="orb w-[500px] h-[500px] bg-blue-500 top-[-200px] left-[-100px] fixed" />
      <div className="orb w-[400px] h-[400px] bg-purple-600 top-[30%] right-[-150px] fixed" />

      {/* ✅ Toast notification — slides in from top-right */}
      {toastMsg && (
        <div
          className="fixed top-6 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border border-green-500/40 max-w-xs"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,17,40,0.97) 0%, rgba(5,30,20,0.97) 100%)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(34,197,94,0.15)",
            backdropFilter: "blur(20px)",
            animation: "slideInRight 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <style>{`
            @keyframes slideInRight {
              from { opacity: 0; transform: translateX(60px) scale(0.8); }
              to   { opacity: 1; transform: translateX(0) scale(1); }
            }
          `}</style>
          <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
          <p className="text-sm font-semibold text-white">{toastMsg}</p>
        </div>
      )}

      <div className="relative w-full max-w-md z-10 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
            StudyEarn AI
          </h1>
          <p className="text-slate-400 text-sm">
            Create your account and start earning
          </p>
        </div>

        {/* Referral Bonus Badge */}
        {showReferralBonus && (
          <div className="glass rounded-2xl p-4 mb-4 border border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">
                  🎁 Referral Bonus Active!
                </div>
                <div className="text-xs text-green-400">
                  Get 200 points instead of 100!
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10">
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40"
                  style={{ fontSize: "16px" }}
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
                  required
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40"
                  style={{ fontSize: "16px" }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* Referral Code */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2">
                Referral Code
                <span className="text-xs text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => {
                    setReferralCode(e.target.value.toUpperCase());
                    setShowReferralBonus(e.target.value.length > 0);
                  }}
                  placeholder="Enter code for bonus points"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-green-500/40 uppercase"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">Already have an account? </span>
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Welcome Bonus Badge */}
        <div className="mt-4 text-center text-xs text-slate-600">
          <p>
            🎁 Get {showReferralBonus ? "200" : "100"} points welcome bonus on
            signup!
          </p>
        </div>
      </div>
    </div>
  );
}
