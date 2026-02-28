// import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { Brain, Presentation, FileText, Gift, Trophy, User, LogOut, Sparkles, Zap } from 'lucide-react';
// import { useApp } from '../context/AppContext';
// import Lottie from 'lottie-react';
// import streakAnimation from '../assets/animations/streak-fire.json';

// export function DashboardLayout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { points, questionsLeft, streak, userName } = useApp();

//   const navItems = [
//     { icon: Sparkles, label: 'Dashboard', path: '/app' },
//     { icon: Brain, label: 'Ask AI', path: '/app/ask' },
//     { icon: Presentation, label: 'PPT Generator', path: '/app/ppt' },
//     { icon: FileText, label: 'PDF Tools', path: '/app/pdf' },
//     { icon: Gift, label: 'My Points', path: '/app/rewards' },
//     { icon: Trophy, label: 'Leaderboard', path: '/app/leaderboard' },
//     { icon: User, label: 'Profile', path: '/app/profile' },
//   ];

//   // ✅ PROPER LOGOUT - Clears EVERYTHING
//   const handleLogout = () => {
//     // Clear all localStorage
//     localStorage.clear();
    
//     // Navigate to login
//     navigate('/login');
    
//     // Force reload to reset React state
//     window.location.reload();
//   };

//   return (
//     <div className="min-h-screen animated-bg grid-bg">
//       {/* Orbs */}
//       <div className="orb w-[400px] h-[400px] bg-blue-500 top-[-200px] left-[-100px] fixed" />
//       <div className="orb w-[300px] h-[300px] bg-purple-600 top-[40%] right-[-150px] fixed" />

//       {/* Sidebar */}
//       <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/5 p-6 flex flex-col z-40">
//         {/* Logo */}
//         <div className="flex items-center gap-2 mb-8">
//           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//             <Sparkles className="w-4 h-4 text-white" />
//           </div>
//           <span className="text-lg font-bold text-white">StudyEarn <span className="gradient-text">AI</span></span>
//         </div>

//         {/* Stats Card */}
//         <div className="glass rounded-xl p-4 border border-white/5 mb-6">
//           <div className="flex items-center justify-between mb-3">
//             <span className="text-xs text-slate-500">Your Points</span>
//             <Gift className="w-4 h-4 text-purple-400" />
//           </div>
//           <div className="text-2xl font-bold text-white mb-1">{points}</div>
          
//           {/* ✅ ANIMATED STREAK ICON (24px) */}
//           <div className="flex items-center gap-1.5 text-xs text-orange-300 mt-2">
//             <Lottie 
//               animationData={streakAnimation}
//               loop={true}
//               style={{ width: 20, height: 20 }}
//             />
//             <span>{streak} day streak</span>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 space-y-1">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.path === '/app'}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
//                   isActive
//                     ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white border border-blue-500/20'
//                     : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
//                 }`
//               }
//             >
//               <item.icon className="w-4 h-4" />
//               {item.label}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors mt-4"
//         >
//           <LogOut className="w-4 h-4" />
//           Sign Out
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="ml-64 min-h-screen">
//         {/* Top Bar */}
//         <div className="sticky top-0 z-30 glass border-b border-white/5 px-8 py-4 flex items-center justify-between">
//           <div>
//             <p className="text-xs text-slate-500">Logged in as</p>
//             <p className="text-sm font-semibold text-white">{userName || 'Student'}</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-blue-500/20">
//               <Zap className="w-4 h-4 text-blue-400" />
//               <span className="text-xs font-medium text-blue-300">{questionsLeft} questions left today</span>
//             </div>
//             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-purple-500/20">
//               <Gift className="w-4 h-4 text-purple-400" />
//               <span className="text-xs font-medium text-purple-300">{points} pts</span>
//             </div>
//           </div>
//         </div>

//         {/* Page Content */}
//         <div className="p-8">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }


// ------- calude ai ------- //

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Brain, Presentation, FileText, Gift, Trophy, User, LogOut, Sparkles, Zap, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Lottie from 'lottie-react';
import streakAnimation from '../assets/animations/streak-fire.json';
import profileIconAnimation from '../assets/animations/profile-icon.json';

export function DashboardLayout() {
  const navigate = useNavigate();
  const { points, questionsLeft, streak, userName } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);

  const navItems = [
    { icon: Sparkles, label: 'Dashboard', path: '/app' },
    { icon: Brain, label: 'Ask AI', path: '/app/ask' },
    { icon: Presentation, label: 'PPT', path: '/app/ppt' },
    { icon: FileText, label: 'PDF', path: '/app/pdf' },
    { icon: Gift, label: 'Points', path: '/app/rewards' },
    { icon: Trophy, label: 'Ranks', path: '/app/leaderboard' },
    { icon: User, label: 'Profile', path: '/app/profile' },
  ];

  const navItemsFull = [
    { icon: Sparkles, label: 'Dashboard', path: '/app' },
    { icon: Brain, label: 'Ask AI', path: '/app/ask' },
    { icon: Presentation, label: 'PPT Generator', path: '/app/ppt' },
    { icon: FileText, label: 'PDF Tools', path: '/app/pdf' },
    { icon: Gift, label: 'My Points', path: '/app/rewards' },
    { icon: Trophy, label: 'Leaderboard', path: '/app/leaderboard' },
    { icon: User, label: 'Profile', path: '/app/profile' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="min-h-screen animated-bg grid-bg">
      {/* Orbs */}
      <div className="orb w-[400px] h-[400px] bg-blue-500 top-[-200px] left-[-100px] fixed" />
      <div className="orb w-[300px] h-[300px] bg-purple-600 top-[40%] right-[-150px] fixed" />

      {/* Inline styles for premium profile icon animations */}
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
        .profile-spin-ring {
          animation: spin-slow 3s linear infinite;
        }
        .profile-glow-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .profile-tooltip {
          animation: float-up 0.2s ease-out forwards;
        }
        .profile-icon-wrapper {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .profile-icon-wrapper:hover {
          transform: scale(1.15);
        }
      `}</style>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 glass border-r border-white/5 p-6 flex flex-col z-40 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Logo + Close btn on mobile */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">StudyEarn <span className="gradient-text">AI</span></span>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Card */}
        <div className="glass rounded-xl p-4 border border-white/5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Your Points</span>
            <Gift className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{points}</div>
          <div className="flex items-center gap-1.5 text-xs text-orange-300 mt-2">
            <Lottie animationData={streakAnimation} loop={true} style={{ width: 20, height: 20 }} />
            <span>{streak} day streak</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItemsFull.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              onClick={() => setSidebarOpen(false)}
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
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 glass border-b border-white/5 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger - mobile only */}
            <button
              className="md:hidden text-slate-400 hover:text-white p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>

          <div className="flex items-center gap-3">
            {/* Questions left badge */}
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg glass border border-blue-500/20">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-medium text-blue-300">{questionsLeft} questions left today</span>
            </div>

            {/* Points badge */}
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg glass border border-purple-500/20">
              <Gift className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-medium text-purple-300">{points} pts</span>
            </div>

            {/* ✨ PREMIUM Animated Profile Icon */}
            <NavLink to="/app/profile">
              <div
                className="relative cursor-pointer profile-icon-wrapper"
                onMouseEnter={() => setProfileHovered(true)}
                onMouseLeave={() => setProfileHovered(false)}
              >
                {/* Spinning gradient ring — only on hover */}
                {profileHovered && (
                  <div
                    className="profile-spin-ring absolute inset-0 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, #8b5cf6, #3b82f6, #06b6d4, #8b5cf6)',
                      padding: '2px',
                      borderRadius: '9999px',
                      zIndex: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '9999px',
                        background: '#030712',
                      }}
                    />
                  </div>
                )}

                {/* Soft glow behind icon on hover */}
                {profileHovered && (
                  <div
                    className="profile-glow-pulse absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
                      filter: 'blur(6px)',
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Lottie icon — NO background, no border, clean */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Lottie
                    animationData={profileIconAnimation}
                    loop={true}
                    style={{ width: 42, height: 42 }}
                  />
                </div>

                {/* Tooltip */}
                {profileHovered && (
                  <div
                    className="profile-tooltip absolute pointer-events-none"
                    style={{
                      bottom: '-32px',
                      left: '50%',
                      whiteSpace: 'nowrap',
                      background: 'rgba(15,10,30,0.92)',
                      border: '1px solid rgba(139,92,246,0.35)',
                      borderRadius: '8px',
                      padding: '3px 10px',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#c4b5fd',
                      backdropFilter: 'blur(8px)',
                      zIndex: 50,
                    }}
                  >
                    My Profile
                  </div>
                )}
              </div>
            </NavLink>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-[44px] ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30' : ''}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-medium leading-none">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}