import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL as string;

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        if (data.streakInfo?.streakIncreased) {
          sessionStorage.setItem("streakCelebration", JSON.stringify(data.streakInfo));
        }
        if (data.streakInfo?.bonusPoints > 0) {
          sessionStorage.setItem("loginBonus", String(data.streakInfo.bonusPoints));
        }
        navigate("/app");
        window.location.reload();
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Cannot connect to server. Backend might be starting up. Please wait 30 seconds and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError("");
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
    if (!clientId) { setError("Google Sign In not configured."); setGoogleLoading(false); return; }
    const google = (window as any).google;
    if (!google) { setError("Google Sign In failed to load. Please refresh."); setGoogleLoading(false); return; }
    const client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "email profile",
      callback: async (tokenResponse: any) => {
        if (tokenResponse.error) { setError("Google sign in was cancelled."); setGoogleLoading(false); return; }
        try {
          const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });
          const userInfo = await userInfoRes.json();
          const res = await fetch(`${API_URL}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: tokenResponse.access_token, userInfo }),
          });
          const data = await res.json();
          if (data.success) {
            localStorage.setItem("token", data.token);
            if (data.streakInfo?.streakIncreased) {
              sessionStorage.setItem("streakCelebration", JSON.stringify(data.streakInfo));
            }
            navigate("/app");
            window.location.reload();
          } else {
            setError(data.message || "Google sign in failed");
          }
        } catch { setError("Google sign in failed. Please try again."); }
        finally { setGoogleLoading(false); }
      },
    });
    client.requestAccessToken();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animated-bg grid-bg">
      <div className="orb w-[500px] h-[500px] bg-blue-500 top-[-200px] left-[-100px] fixed" />
      <div className="orb w-[400px] h-[400px] bg-purple-600 top-[30%] right-[-150px] fixed" />
      <div className="relative w-full max-w-md z-10 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">StudyEarn AI</h1>
          <p className="text-slate-400 text-sm">Login to continue learning</p>
        </div>
        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@example.com" style={{ fontSize: "16px" }}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 text-base" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••" style={{ fontSize: "16px" }}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40" />
              </div>
            </div>
            <div className="text-right -mt-1">
              <Link to="/forgot-password" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Logging in...</>) : (<><LogIn className="w-5 h-5" />Login</>)}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0f1117] px-3 text-slate-500">or continue with</span>
            </div>
          </div>

          <button type="button" onClick={handleGoogleLogin} disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm font-medium hover:bg-white/[0.06] hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {googleLoading ? (<Loader2 className="w-5 h-5 animate-spin" />) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">Sign Up</Link>
          </p>
        </div>
        {loading && (
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-600">If this is taking long, the free backend server might be waking up (takes ~30s)</p>
          </div>
        )}
      </div>
    </div>
  );
}