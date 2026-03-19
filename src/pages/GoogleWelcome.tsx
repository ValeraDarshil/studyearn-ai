import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, ArrowRight, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL as string;

export function GoogleWelcome() {
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);

  // If not a new Google user — redirect to dashboard
  useEffect(() => {
    const isNewGoogleUser = sessionStorage.getItem("newGoogleUser");
    if (!isNewGoogleUser) {
      navigate("/app", { replace: true });
    }
  }, []);

  const handleApply = async () => {
    const code = referralCode.trim().toUpperCase();
    if (!code) { handleSkip(); return; }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/auth/google/apply-referral`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ referralCode: code }),
      });
      const data = await res.json();

      if (data.success) {
        setApplied(true);
        sessionStorage.removeItem("newGoogleUser");
        setTimeout(() => {
          navigate("/app", { replace: true });
          window.location.reload();
        }, 1500);
      } else {
        setError(data.message || "Invalid referral code.");
        setLoading(false);
      }
    } catch {
      setError("Could not apply referral code. You can skip for now.");
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    // Even on skip — auto-assign default referrer (same as normal signup)
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/auth/google/apply-referral`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ referralCode: "", skipMode: true }),
      });
    } catch { /* silent — don't block navigation */ }
    sessionStorage.removeItem("newGoogleUser");
    navigate("/app", { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animated-bg grid-bg">
      <div className="orb w-[500px] h-[500px] bg-blue-500 top-[-200px] left-[-100px] fixed" />
      <div className="orb w-[400px] h-[400px] bg-purple-600 top-[30%] right-[-150px] fixed" />

      <div className="relative w-full max-w-md z-10">

        {/* Success state */}
        {applied ? (
          <div className="glass rounded-3xl p-10 border border-green-500/30 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">🎉 Referral Applied!</h2>
            <p className="text-slate-400 text-sm">You got 200 points! Going to dashboard...</p>
          </div>
        ) : (
          <div className="glass rounded-3xl p-8 border border-white/10">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to StudyEarn AI! 🎓</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Got a referral code from a friend?<br />
                Enter it below to get <span className="text-purple-300 font-semibold">200 bonus points</span> instead of 100!
              </p>
            </div>

            {/* Referral code input */}
            <div className="mb-4">
              <div className="relative">
                <Gift className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => {
                    setReferralCode(e.target.value.toUpperCase());
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Enter referral code (e.g. DARSHIL123)"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40 uppercase tracking-wider text-sm"
                  style={{ fontSize: "16px" }}
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-2 px-1">{error}</p>
              )}
            </div>

            {/* Points info */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 mb-6 text-xs text-slate-400">
              <span>Without code</span>
              <span className="font-semibold text-white">100 pts</span>
              <span className="text-slate-600">|</span>
              <span>With code</span>
              <span className="font-semibold text-purple-300">200 pts 🎁</span>
            </div>

            {/* Buttons */}
            <button
              onClick={handleApply}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Applying...</>
              ) : (
                <><Gift className="w-4 h-4" />Apply & Continue</>
              )}
            </button>

            <button
              onClick={handleSkip}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-slate-400 text-sm hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
            >
              Skip for now
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-slate-600 mt-4">
              Referral code can only be applied once during signup
            </p>
          </div>
        )}
      </div>
    </div>
  );
}