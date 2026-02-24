import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Brain, Presentation, FileText, Gift, Trophy, User, LogOut, Sparkles, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Lottie from 'lottie-react';
import streakAnimation from '../assets/animations/streak-fire.json';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { points, questionsLeft, streak, userName } = useApp();

  const navItems = [
    { icon: Sparkles, label: 'Dashboard', path: '/app' },
    { icon: Brain, label: 'Ask AI', path: '/app/ask' },
    { icon: Presentation, label: 'PPT Generator', path: '/app/ppt' },
    { icon: FileText, label: 'PDF Tools', path: '/app/pdf' },
    { icon: Gift, label: 'My Points', path: '/app/rewards' },
    { icon: Trophy, label: 'Leaderboard', path: '/app/leaderboard' },
    { icon: User, label: 'Profile', path: '/app/profile' },
  ];

  // ✅ PROPER LOGOUT - Clears EVERYTHING
  const handleLogout = () => {
    // Clear all localStorage
    localStorage.clear();
    
    // Navigate to login
    navigate('/login');
    
    // Force reload to reset React state
    window.location.reload();
  };

  return (
    <div className="min-h-screen animated-bg grid-bg">
      {/* Orbs */}
      <div className="orb w-[400px] h-[400px] bg-blue-500 top-[-200px] left-[-100px] fixed" />
      <div className="orb w-[300px] h-[300px] bg-purple-600 top-[40%] right-[-150px] fixed" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/5 p-6 flex flex-col z-40">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">StudyEarn <span className="gradient-text">AI</span></span>
        </div>

        {/* Stats Card */}
        <div className="glass rounded-xl p-4 border border-white/5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Your Points</span>
            <Gift className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{points}</div>
          
          {/* ✅ ANIMATED STREAK ICON (24px) */}
          <div className="flex items-center gap-1.5 text-xs text-orange-300 mt-2">
            <Lottie 
              animationData={streakAnimation}
              loop={true}
              style={{ width: 20, height: 20 }}
            />
            <span>{streak} day streak</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors mt-4"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 glass border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Logged in as</p>
            <p className="text-sm font-semibold text-white">{userName || 'Student'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-blue-500/20">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-blue-300">{questionsLeft} questions left today</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-purple-500/20">
              <Gift className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium text-purple-300">{points} pts</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}