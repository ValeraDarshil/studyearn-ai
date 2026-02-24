import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  User as UserIcon,
  LogIn,
  Loader2,
  Gift,
} from "lucide-react";

export function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref"); // Get referral code from URL

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(refCode || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReferralBonus, setShowReferralBonus] = useState(false);

  useEffect(() => {
    if (refCode) {
      setShowReferralBonus(true);
    }
  }, [refCode]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://studyearn-backend.onrender.com/api/auth/signup",
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
        localStorage.setItem("user", JSON.stringify(data.user));

        // Show bonus message if referred
        if (data.referralBonus) {
          alert("🎉 Referral bonus applied! You got 200 points!");
        }

        navigate("/app");
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
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

        <div className="glass rounded-2xl p-8 border border-white/10">
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
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* ✅ REFERRAL CODE */}
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
                    if (e.target.value.length > 0) {
                      setShowReferralBonus(true);
                    } else {
                      setShowReferralBonus(false);
                    }
                  }}
                  placeholder="Enter code for bonus points"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-green-500/40 uppercase"
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
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
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
