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

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Sparkles, Brain, Presentation, FileText, Gift, Trophy,
  User, LayoutDashboard, Zap, Menu, X, LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Lottie from 'lottie-react';
import streakAnimation from '../assets/animations/streak-fire.json';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/ask', icon: Brain, label: 'Ask AI', end: false },
  { to: '/app/ppt', icon: Presentation, label: 'PPT Generator', end: false },
  { to: '/app/pdf', icon: FileText, label: 'PDF Tools', end: false },
  { to: '/app/rewards', icon: Gift, label: 'My Points', end: false },
  { to: '/app/leaderboard', icon: Trophy, label: 'Leaderboard', end: false },
  { to: '/app/profile', icon: User, label: 'Profile', end: false },
];

export function DashboardLayout() {
  const { points, streak, questionsLeft } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ PROPER LOGOUT - Clear everything
  const handleLogout = () => {
    localStorage.clear(); // Clear ALL localStorage
    navigate('/login');
    window.location.reload(); // Force full reload
  };

  return (
    <div className="min-h-screen animated-bg grid-bg flex">
      {/* Orbs */}
      <div className="orb w-[400px] h-[400px] bg-blue-500 top-[-200px] left-[-100px] fixed" />
      <div className="orb w-[300px] h-[300px] bg-purple-600 bottom-[-100px] right-[-100px] fixed" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 glass border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">StudyEarn <span className="gradient-text">AI</span></span>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Points Card */}
        <div className="mx-4 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-purple-500/20 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Your Points</span>
            <Lottie 
              animationData={streakAnimation}
              loop={true}
              style={{ width: 20, height: 20 }}
            />
          </div>
          <div className="text-2xl font-bold gradient-text">{points.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-orange-400 font-medium">{streak} day streak 🔥</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'sidebar-active bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`
              }
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom - Logout */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass border-b border-white/5">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-medium text-blue-300">{questionsLeft} questions left today</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Gift className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-medium text-purple-300">{points.toLocaleString()} pts</span>
              </div>
              
              {/* Profile Icon */}
              <div 
                onClick={() => navigate('/app/profile')}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              >
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}