import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Brain, Presentation, FileText, Gift, Trophy, User, LogOut, Sparkles, Zap, Menu, X, Flame as FlameIcon, BookOpen, HelpCircle, BarChart2, FlaskConical, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Lottie from 'lottie-react';
import streakAnimation from '../assets/animations/streak-fire.json';
import profileIconAnimation from '../assets/animations/profile-icon.json';

export function DashboardLayout() {
  const navigate = useNavigate();
  const { points, questionsLeft, streak, userName } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);

  // Bottom nav — only 5 primary items for clean mobile UX
  const bottomNavItems = [
    { icon: Sparkles,   label: 'Home',      path: '/app' },
    { icon: Brain,      label: 'Ask AI',    path: '/app/ask' },
    { icon: HelpCircle, label: 'Quiz',      path: '/app/quiz' },
    { icon: FlameIcon,  label: 'Challenge', path: '/app/challenge' },
    { icon: Gift,       label: 'Points',    path: '/app/rewards' },
  ];

  // Sidebar — full list
  const navItemsFull = [
    { icon: Sparkles,     label: 'Dashboard',      path: '/app' },
    { icon: Brain,        label: 'Ask AI',          path: '/app/ask' },
    { icon: HelpCircle,   label: 'AI Quiz',         path: '/app/quiz' },
    { icon: FlameIcon,    label: 'Daily Challenge', path: '/app/challenge' },
    { icon: BookOpen,     label: 'Study Planner',   path: '/app/planner' },
    { icon: BarChart2,    label: 'Analytics',       path: '/app/analytics' },
    { icon: FlaskConical, label: 'Formula Sheet',   path: '/app/formulas' },
    { icon: Presentation, label: 'PPT Generator',   path: '/app/ppt' },
    { icon: FileText,     label: 'PDF Tools',       path: '/app/pdf' },
    { icon: Gift,         label: 'My Points',       path: '/app/rewards' },
    { icon: Trophy,       label: 'Leaderboard',     path: '/app/leaderboard' },
    { icon: User,         label: 'Profile',         path: '/app/profile' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="min-h-screen animated-bg grid-bg">
      {/* Orbs — hidden on small screens for perf */}
      <div className="orb w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-blue-500 top-[-150px] left-[-80px] fixed" />
      <div className="orb w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-purple-600 top-[40%] right-[-100px] fixed" />

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(6px) translateX(-50%); }
          100% { opacity: 1; transform: translateY(0px) translateX(-50%); }
        }
        .profile-spin-ring { animation: spin-slow 3s linear infinite; }
        .profile-glow-pulse { animation: pulse-glow 2s ease-in-out infinite; }
        .profile-tooltip { animation: float-up 0.2s ease-out forwards; }
        .profile-icon-wrapper { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .profile-icon-wrapper:hover { transform: scale(1.15); }

        /* iOS input zoom fix — all inputs/selects/textareas min font-size 16px */
        input, select, textarea {
          font-size: 16px !important;
        }
        @media (min-width: 768px) {
          input, select, textarea {
            font-size: inherit !important;
          }
        }

        /* Safe tap target size on mobile */
        @media (max-width: 767px) {
          button, a {
            -webkit-tap-highlight-color: transparent;
          }
        }

        /* Smooth scrolling */
        * {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-72 glass border-r border-white/5 flex flex-col z-40 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full'} md:translate-x-0 md:w-64`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">StudyEarn <span className="gradient-text">AI</span></span>
          </div>
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Card */}
        <div className="mx-4 glass rounded-xl p-4 border border-white/5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Your Points</span>
            <Gift className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{points}</div>
          <div className="flex items-center gap-1.5 text-xs text-orange-300">
            <Lottie animationData={streakAnimation} loop style={{ width: 20, height: 20 }} />
            <span>{streak} day streak</span>
          </div>
        </div>

        {/* Nav — scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
          {navItemsFull.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group/nav ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-gradient-to-b from-blue-400 to-purple-500" />
                  )}
                  <item.icon className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${isActive ? 'text-blue-400' : 'group-hover/nav:text-white'}`} />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 pt-2 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">

        {/* Top Bar */}
        <div className="sticky top-0 z-30 glass border-b border-white/5 px-3 md:px-8 py-3 md:py-4 flex items-center justify-between gap-2">

          {/* Left — hamburger + logo on mobile */}
          <div className="flex items-center gap-2">
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Show brand on mobile topbar */}
            <span className="md:hidden text-sm font-bold text-white">
              StudyEarn <span className="gradient-text">AI</span>
            </span>
          </div>

          {/* Right badges */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Questions left */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass border border-blue-500/20">
              <Zap className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-blue-300 whitespace-nowrap">
                <span className="hidden sm:inline">{questionsLeft} questions left</span>
                <span className="sm:hidden">{questionsLeft}Q</span>
              </span>
            </div>

            {/* Points */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass border border-purple-500/20">
              <Gift className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-purple-300 whitespace-nowrap">{points} pts</span>
            </div>

            {/* Profile */}
            <NavLink to="/app/profile">
              <div
                className="relative cursor-pointer profile-icon-wrapper"
                onMouseEnter={() => setProfileHovered(true)}
                onMouseLeave={() => setProfileHovered(false)}
              >
                {profileHovered && (
                  <div className="profile-spin-ring absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg, #8b5cf6, #3b82f6, #06b6d4, #8b5cf6)', padding: '2px', borderRadius: '9999px', zIndex: 0 }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '9999px', background: '#030712' }} />
                  </div>
                )}
                {profileHovered && (
                  <div className="profile-glow-pulse absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)', filter: 'blur(6px)', zIndex: 0 }} />
                )}
                <div style={{ position: 'relative', zIndex: 1, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lottie animationData={profileIconAnimation} loop style={{ width: 36, height: 36 }} />
                </div>
                {profileHovered && (
                  <div className="profile-tooltip absolute pointer-events-none" style={{ bottom: '-32px', left: '50%', whiteSpace: 'nowrap', background: 'rgba(15,10,30,0.92)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: '8px', padding: '3px 10px', fontSize: '11px', fontWeight: 500, color: '#c4b5fd', backdropFilter: 'blur(8px)', zIndex: 50 }}>
                    My Profile
                  </div>
                )}
              </div>
            </NavLink>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-3 sm:p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation — 5 primary items only */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around px-2 py-1">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-[52px] ${
                  isActive ? 'text-white' : 'text-slate-500 active:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-gradient-to-br from-blue-500/25 to-purple-500/25 border border-blue-500/30' : ''}`}>
                    <item.icon className="w-[18px] h-[18px]" />
                  </div>
                  <span className="text-[10px] font-medium leading-none mt-0.5">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* "More" button — opens sidebar */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl text-slate-500 active:text-slate-300 transition-all min-w-[52px]"
          >
            <div className="p-1.5 rounded-xl">
              <Menu className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[10px] font-medium leading-none mt-0.5">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}