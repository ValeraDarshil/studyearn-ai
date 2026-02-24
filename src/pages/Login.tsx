import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'https://studyearn-backend.onrender.com';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        // ✅ Save session
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // ✅ Navigate to app
        navigate("/app");
        
        // ✅ Force reload to load user data
        window.location.reload();
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Cannot connect to server. Backend might be starting up. Please wait 30 seconds and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animated-bg grid-bg">
      {/* Orbs */}
      <div className="orb w-[500px] h-[500px] bg-blue-500 top-[-200px] left-[-100px] fixed" />
      <div className="orb w-[400px] h-[400px] bg-purple-600 top-[30%] right-[-150px] fixed" />

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            StudyEarn AI
          </h1>
          <p className="text-slate-400 text-sm">Login to continue learning</p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Backend Status Hint */}
        {loading && (
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-600">
              If this is taking long, the free backend server might be waking up (takes ~30s)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}