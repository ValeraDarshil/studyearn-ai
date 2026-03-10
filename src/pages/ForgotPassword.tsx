import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Loader2, AlertCircle, CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// ─── Step indicator ───────────────────────────────────────────
function StepDot({ step, current }: { step: number; current: number }) {
  const done   = current > step;
  const active = current === step;
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
        ${done   ? "bg-green-500 text-white" :
          active  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30" :
                    "bg-white/5 text-slate-600 border border-white/10"}`}>
        {done ? "✓" : step}
      </div>
      {step < 3 && (
        <div className={`w-12 h-0.5 transition-all duration-500 ${current > step ? "bg-green-500" : "bg-white/10"}`} />
      )}
    </div>
  );
}

// ─── OTP Input — 6 boxes ─────────────────────────────────────
function OTPInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const arr = value.split("");
    arr[i] = digit;
    const next = arr.join("").padEnd(6, "").slice(0, 6);
    onChange(next.trimEnd()); // keep only filled part
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted);
      inputs.current[Math.min(pasted.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          className={`w-11 h-13 text-center text-xl font-bold rounded-xl border transition-all duration-200
            bg-white/[0.04] text-white outline-none
            ${value[i]
              ? "border-blue-500/60 bg-blue-500/10 shadow-md shadow-blue-500/10"
              : "border-white/10 focus:border-blue-500/40 focus:bg-white/[0.06]"}`}
          style={{ fontSize: "22px", height: "52px" }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep]   = useState(1); // 1=email, 2=otp, 3=newpassword
  const [email,    setEmail]    = useState("");
  const [otp,      setOtp]      = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [resetToken, setResetToken] = useState("");
  const [countdown, setCountdown]   = useState(0); // resend cooldown

  // Resend cooldown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Step 1: Send OTP ───────────────────────────────────────
  const handleSendOTP = async () => {
    if (!email.trim()) return setError("Please enter your email.");
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        setCountdown(60); // 60s before resend allowed
        setSuccess("OTP sent! Check your inbox and spam folder.");
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────
  const handleVerifyOTP = async () => {
    if (otp.length < 6) return setError("Please enter all 6 digits.");
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      });
      const data = await res.json();
      if (data.success) {
        setResetToken(data.resetToken);
        setStep(3);
        setSuccess("");
      } else {
        setError(data.message || "Wrong OTP.");
        if (data.message?.includes("expired") || data.message?.includes("Too many")) {
          setOtp("");
        }
      }
    } catch {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────
  const handleResetPassword = async () => {
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword: password }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(4 as any); // success screen
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Auto-verify when all 6 digits entered ────────────────
  useEffect(() => {
    if (otp.length === 6 && step === 2) handleVerifyOTP();
  }, [otp]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animated-bg grid-bg">
      {/* Orbs */}
      <div className="orb w-[500px] h-[500px] bg-blue-500 top-[-200px] left-[-100px] fixed" />
      <div className="orb w-[400px] h-[400px] bg-purple-600 top-[30%] right-[-150px] fixed" />

      <div className="relative w-full max-w-md z-10 py-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">StudyEarn AI</h1>
          <p className="text-slate-400 text-sm">Reset your password</p>
        </div>

        {/* Step indicators — only show during steps 1-3 */}
        {(step as any) !== 4 && (
          <div className="flex items-center justify-center mb-6">
            <StepDot step={1} current={step} />
            <StepDot step={2} current={step} />
            <StepDot step={3} current={step} />
          </div>
        )}

        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10">

          {/* ── SUCCESS SCREEN ──────────────────────────────── */}
          {(step as any) === 4 ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/15 border border-green-500/25 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Password Reset!</h2>
              <p className="text-slate-400 text-sm mb-6">
                Your password has been updated successfully. You can now login with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Go to Login
              </button>
            </div>

          /* ── STEP 1: EMAIL ──────────────────────────────── */
          ) : step === 1 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Enter your email</h2>
                  <p className="text-slate-500 text-xs">We'll send you a 6-digit OTP</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleSendOTP()}
                    placeholder="you@example.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40"
                    style={{ fontSize: "16px" }}
                    autoFocus
                  />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={loading || !email.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Sending OTP...</> : <><Mail className="w-5 h-5" />Send OTP</>}
              </button>
            </div>

          /* ── STEP 2: OTP ────────────────────────────────── */
          ) : step === 2 ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Enter OTP</h2>
                  <p className="text-slate-500 text-xs">Sent to <span className="text-slate-300">{email}</span></p>
                </div>
              </div>

              {success && !error && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-300">{success}</p>
                </div>
              )}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <OTPInput value={otp} onChange={v => { setOtp(v); setError(""); }} />

              {loading && (
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />Verifying...
                </div>
              )}

              {/* Resend */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-slate-600 text-sm">Resend OTP in <span className="text-slate-400 font-medium">{countdown}s</span></p>
                ) : (
                  <button
                    onClick={() => { setOtp(""); setError(""); handleSendOTP(); }}
                    disabled={loading}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={() => { setStep(1); setOtp(""); setError(""); setSuccess(""); }}
                className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Use a different email
              </button>
            </div>

          /* ── STEP 3: NEW PASSWORD ────────────────────────── */
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Set new password</h2>
                  <p className="text-slate-500 text-xs">OTP verified ✓ &nbsp;Choose a strong password</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="Min. 6 characters"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40"
                    style={{ fontSize: "16px" }}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleResetPassword()}
                    placeholder="Same password again"
                    className={`w-full bg-white/[0.03] border rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-colors
                      ${confirm && password !== confirm ? "border-red-500/40" : "border-white/10 focus:border-blue-500/40"}`}
                    style={{ fontSize: "16px" }}
                  />
                </div>
                {confirm && password !== confirm && (
                  <p className="text-red-400 text-xs mt-1.5">Passwords don't match</p>
                )}
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[6, 8, 12].map(len => (
                      <div key={len} className={`h-1 flex-1 rounded-full transition-all duration-300
                        ${password.length >= len ? (len === 12 ? "bg-green-500" : len === 8 ? "bg-yellow-500" : "bg-orange-500") : "bg-white/10"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600">
                    {password.length < 6 ? "Too short" : password.length < 8 ? "Weak" : password.length < 12 ? "Good" : "Strong ✓"}
                  </p>
                </div>
              )}

              <button
                onClick={handleResetPassword}
                disabled={loading || password.length < 6 || password !== confirm}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Resetting...</> : <><CheckCircle2 className="w-5 h-5" />Reset Password</>}
              </button>
            </div>
          )}

          {/* Login link */}
          {(step as any) !== 4 && (
            <p className="text-center text-sm text-slate-500 mt-5">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Login</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}