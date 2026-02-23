// import { useNavigate } from 'react-router-dom';
// import { Brain, Presentation, FileText, Gift, TrendingUp, Flame, Zap, ArrowRight, Clock } from 'lucide-react';
// import { useApp } from '../context/AppContext';
// import { recentActivity, achievements } from '../data/mockData';

// export function Dashboard() {
//   const { points, streak, questionsLeft } = useApp();
//   const navigate = useNavigate();

//   const quickActions = [
//     { icon: Brain, label: 'Ask AI', desc: 'Get instant answers', path: '/app/ask', gradient: 'from-blue-500 to-blue-600', glow: 'hover:shadow-blue-500/20' },
//     { icon: Presentation, label: 'Generate PPT', desc: 'Create presentations', path: '/app/ppt', gradient: 'from-purple-500 to-purple-600', glow: 'hover:shadow-purple-500/20' },
//     { icon: FileText, label: 'PDF Tools', desc: 'Convert documents', path: '/app/pdf', gradient: 'from-cyan-500 to-cyan-600', glow: 'hover:shadow-cyan-500/20' },
//     { icon: Gift, label: 'Rewards', desc: 'View your points', path: '/app/rewards', gradient: 'from-pink-500 to-pink-600', glow: 'hover:shadow-pink-500/20' },
//   ];

//   return (
//     <div className="space-y-6 max-w-6xl">
//       {/* Welcome */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-white">
//             Welcome back, <span className="gradient-text">Student</span> 👋
//           </h1>
//           <p className="text-slate-400 text-sm mt-1">Ready to learn something new today?</p>
//         </div>
//         <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-orange-500/20">
//           <Flame className="w-5 h-5 text-orange-400 fire-animation" />
//           <span className="text-sm font-semibold text-orange-300">{streak} Day Streak!</span>
//         </div>
//       </div>

//       {/* Stats Row */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           { label: 'Total Points', value: points.toLocaleString(), icon: Gift, color: 'text-purple-400', bg: 'bg-purple-500/10' },
//           { label: 'Questions Today', value: `${5 - questionsLeft}/5`, icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500/10' },
//           { label: 'Day Streak', value: streak.toString(), icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
//           { label: 'Weekly XP', value: '+340', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
//         ].map((stat) => (
//           <div key={stat.label} className="glass rounded-2xl p-4 glass-hover transition-smooth">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
//               <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
//                 <stat.icon className={`w-4 h-4 ${stat.color}`} />
//               </div>
//             </div>
//             <div className="text-2xl font-bold text-white">{stat.value}</div>
//           </div>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div>
//         <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {quickActions.map((action) => (
//             <button
//               key={action.label}
//               onClick={() => navigate(action.path)}
//               className={`glass rounded-2xl p-5 text-left glass-hover transition-smooth group card-shine hover:shadow-lg ${action.glow}`}
//             >
//               <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
//                 <action.icon className="w-5 h-5" />
//               </div>
//               <h3 className="font-semibold text-white text-sm">{action.label}</h3>
//               <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
//               <ArrowRight className="w-4 h-4 text-slate-600 mt-3 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* Recent Activity */}
//         <div className="glass rounded-2xl p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
//             <Clock className="w-4 h-4 text-slate-500" />
//           </div>
//           <div className="space-y-3">
//             {recentActivity.map((activity, i) => (
//               <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
//                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
//                   activity.type === 'question' ? 'bg-blue-500/10' :
//                   activity.type === 'ppt' ? 'bg-purple-500/10' :
//                   activity.type === 'streak' ? 'bg-orange-500/10' :
//                   'bg-cyan-500/10'
//                 }`}>
//                   {activity.type === 'question' && <Brain className="w-4 h-4 text-blue-400" />}
//                   {activity.type === 'ppt' && <Presentation className="w-4 h-4 text-purple-400" />}
//                   {activity.type === 'pdf' && <FileText className="w-4 h-4 text-cyan-400" />}
//                   {activity.type === 'streak' && <Flame className="w-4 h-4 text-orange-400" />}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm text-slate-300 truncate">{activity.text}</p>
//                   <p className="text-xs text-slate-600 mt-0.5">{activity.time}</p>
//                 </div>
//                 <div className="flex items-center gap-1 flex-shrink-0">
//                   <Zap className="w-3 h-3 text-yellow-400" />
//                   <span className="text-xs font-semibold text-yellow-400">+{activity.points}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Achievements */}
//         <div className="glass rounded-2xl p-5">
//           <h2 className="text-lg font-semibold text-white mb-4">Achievements</h2>
//           <div className="grid grid-cols-2 gap-3">
//             {achievements.map((badge) => (
//               <div
//                 key={badge.id}
//                 className={`p-4 rounded-xl border transition-smooth ${
//                   badge.unlocked
//                     ? 'bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20 hover:border-purple-500/40'
//                     : 'bg-white/[0.01] border-white/5 opacity-40'
//                 }`}
//               >
//                 <div className="text-2xl mb-2">{badge.icon}</div>
//                 <h3 className="text-sm font-semibold text-white">{badge.name}</h3>
//                 <p className="text-xs text-slate-500 mt-0.5">{badge.description}</p>
//                 {badge.unlocked && (
//                   <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-400 mt-2">
//                     ✓ Unlocked
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* XP Progress */}
//       <div className="glass rounded-2xl p-5">
//         <div className="flex items-center justify-between mb-3">
//           <div>
//             <h2 className="text-lg font-semibold text-white">Level Progress</h2>
//             <p className="text-xs text-slate-500 mt-0.5">Level 12 → Level 13</p>
//           </div>
//           <span className="text-sm font-bold gradient-text">2,450 / 3,000 XP</span>
//         </div>
//         <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
//           <div
//             className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 progress-animate"
//             style={{ width: '82%' }}
//           />
//         </div>
//         <p className="text-xs text-slate-500 mt-2">550 XP until next level</p>
//       </div>
//     </div>
//   );
// }


// ---------- calude ai ---------- //


import { useNavigate } from 'react-router-dom';
import { Brain, Presentation, FileText, Gift, TrendingUp, Zap, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateLevel, getLevelTier, getLevelColor } from '../utils/level-utils';
import Lottie from 'lottie-react';
import streakAnimation from '../assets/animations/streak-fire.json';

export function Dashboard() {
  const { points, streak, questionsLeft, recentActivity } = useApp();
  const navigate = useNavigate();

  const levelInfo = calculateLevel(points);
  const levelTier = getLevelTier(levelInfo.currentLevel);
  const levelColor = getLevelColor(levelInfo.currentLevel);

  const quickActions = [
    { icon: Brain, label: 'Ask AI', desc: 'Get instant answers', path: '/app/ask', gradient: 'from-blue-500 to-blue-600', glow: 'hover:shadow-blue-500/20' },
    { icon: Presentation, label: 'Generate PPT', desc: 'Create presentations', path: '/app/ppt', gradient: 'from-purple-500 to-purple-600', glow: 'hover:shadow-purple-500/20' },
    { icon: FileText, label: 'PDF Tools', desc: 'Convert documents', path: '/app/pdf', gradient: 'from-cyan-500 to-cyan-600', glow: 'hover:shadow-cyan-500/20' },
    { icon: Gift, label: 'Rewards', desc: 'View your points', path: '/app/rewards', gradient: 'from-pink-500 to-pink-600', glow: 'hover:shadow-pink-500/20' },
  ];

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('ask')) return { Icon: Brain, color: 'bg-blue-500/10', iconColor: 'text-blue-400' };
    if (action.includes('ppt')) return { Icon: Presentation, color: 'bg-purple-500/10', iconColor: 'text-purple-400' };
    if (action.includes('pdf')) return { Icon: FileText, color: 'bg-cyan-500/10', iconColor: 'text-cyan-400' };
    return { Icon: Zap, color: 'bg-green-500/10', iconColor: 'text-green-400' };
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, <span className="gradient-text">Student</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Ready to learn something new today?</p>
        </div>
        {/* ✅ ANIMATED STREAK BADGE */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-orange-500/20">
          <Lottie 
            animationData={streakAnimation}
            loop={true}
            style={{ width: 32, height: 32 }}
          />
          <span className="text-sm font-semibold text-orange-300">{streak} Day Streak!</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Points', value: points.toLocaleString(), icon: Gift, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Questions Today', value: `${5 - questionsLeft}/5`, icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { 
            label: 'Day Streak', 
            value: streak.toString(), 
            icon: 'lottie', // ✅ SPECIAL MARKER FOR LOTTIE
            color: 'text-orange-400', 
            bg: 'bg-orange-500/10' 
          },
          { label: 'Current Level', value: levelInfo.currentLevel.toString(), icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-4 glass-hover transition-smooth">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                {/* ✅ ANIMATED ICON FOR STREAK */}
                {stat.icon === 'lottie' ? (
                  <Lottie 
                    animationData={streakAnimation}
                    loop={true}
                    style={{ width: 30, height: 30 }}
                  />
                ) : (
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                )}
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`glass rounded-2xl p-5 group cursor-pointer ${action.glow} hover:scale-[1.02] transition-all`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{action.label}</h3>
              <p className="text-xs text-slate-500">{action.desc}</p>
              <div className="flex items-center gap-1 text-xs text-purple-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Start now <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity + Achievements */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <Zap className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No activity yet. Start earning points!
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => {
                const { Icon, color, iconColor } = getActivityIcon(activity.action);
                return (
                  <div key={activity._id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className={`w-4 h-4 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 truncate">{activity.details}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{formatTime(activity.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs font-semibold text-yellow-400">+{activity.pointsEarned}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Achievements</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 1, icon: '🎓', name: 'First Question', desc: 'Asked your first question', unlocked: points >= 10 },
              { id: 2, icon: '📊', name: 'PPT Master', desc: 'Created 5 presentations', unlocked: false },
              { id: 3, icon: '🔥', name: '7 Day Streak', desc: 'Maintained a 7 day streak', unlocked: streak >= 7 },
              { id: 4, icon: '💎', name: '1000 Points', desc: 'Earned 1000 total points', unlocked: points >= 1000 },
            ].map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-smooth ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20 hover:border-purple-500/40'
                    : 'bg-white/[0.01] border-white/5 opacity-40'
                }`}
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <h3 className="text-sm font-semibold text-white">{badge.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{badge.desc}</p>
                {badge.unlocked && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-400 mt-2">
                    ✓ Unlocked
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              Level Progress
              <span className={`text-sm px-2 py-0.5 rounded-full bg-gradient-to-r ${levelColor} text-white`}>
                {levelTier}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Level {levelInfo.currentLevel} → Level {levelInfo.currentLevel + 1}
            </p>
          </div>
          <span className="text-sm font-bold gradient-text">
            {levelInfo.currentXP} / {levelInfo.requiredXP} XP
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${levelColor} progress-animate`}
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {levelInfo.requiredXP - levelInfo.currentXP} XP until next level
        </p>
      </div>
    </div>
  );
}