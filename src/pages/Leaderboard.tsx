import { useState, useEffect } from 'react';
import { Trophy, Zap, Medal, TrendingUp, Crown, Award, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  points: number;
  streak: number;
  joinedDate: string;
}

export function Leaderboard() {
  const { userId } = useApp();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [userId]); // ✅ Re-run when userId changes

  const loadLeaderboard = async () => {
    try {
      const res = await fetch('https://studyearn-backend.onrender.com/api/leaderboard/top?limit=100');
      const data = await res.json();

      if (data.success) {
        setLeaderboard(data.leaderboard);

        // ✅ FIXED: Compare with current user's actual MongoDB _id
        if (userId) {
          const userRank = data.leaderboard.find((u: LeaderboardUser) => u.id === userId);
          if (userRank) {
            setMyRank(userRank.rank);
          } else {
            fetchMyRank();
          }
        }
      }
    } catch (err) {
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRank = async () => {
    if (!userId) return;
    
    try {
      const res = await fetch(`https://studyearn-backend.onrender.com/api/leaderboard/rank/${userId}`);
      const data = await res.json();
      if (data.success) {
        setMyRank(data.rank);
      }
    } catch (err) {
      console.error('Rank error:', err);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (rank === 2) return { icon: Medal, color: 'text-slate-300', bg: 'bg-slate-400/20' };
    if (rank === 3) return { icon: Award, color: 'text-orange-400', bg: 'bg-orange-500/20' };
    return { icon: Trophy, color: 'text-slate-500', bg: 'bg-slate-500/10' };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">Top students ranked by points</p>
        </div>
        {myRank && (
          <div className="glass px-4 py-2 rounded-xl border border-purple-500/20">
            <div className="text-xs text-slate-500">Your Rank</div>
            <div className="text-xl font-bold text-purple-400">#{myRank}</div>
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="glass rounded-2xl p-8 border border-white/10">
          <div className="grid grid-cols-3 gap-4 items-end">
            
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center mx-auto mb-3">
                <Medal className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-semibold text-white">{leaderboard[1].name}</div>
              <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mt-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                {leaderboard[1].points.toLocaleString()}
              </div>
              <div className="mt-2 px-3 py-1 rounded-full bg-slate-500/20 text-xs text-slate-300">
                2nd Place
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center -mt-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-3 ring-4 ring-yellow-500/20">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div className="text-lg font-bold text-white">{leaderboard[0].name}</div>
              <div className="flex items-center justify-center gap-1 text-sm text-slate-400 mt-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                {leaderboard[0].points.toLocaleString()}
              </div>
              <div className="mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-sm font-bold text-black">
                🏆 Champion
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-semibold text-white">{leaderboard[2].name}</div>
              <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mt-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                {leaderboard[2].points.toLocaleString()}
              </div>
              <div className="mt-2 px-3 py-1 rounded-full bg-orange-500/20 text-xs text-orange-300">
                3rd Place
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            All Rankings
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          {leaderboard.map((user) => {
            const badge = getRankBadge(user.rank);
            // ✅ FIXED: Proper comparison with current user's MongoDB _id
            const isCurrentUser = userId && user.id === userId;

            return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 transition-colors ${
                  isCurrentUser 
                    ? 'bg-purple-500/10 border-l-4 border-purple-500' 
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 rounded-full ${badge.bg} flex items-center justify-center`}>
                    {user.rank <= 3 ? (
                      <badge.icon className={`w-5 h-5 ${badge.color}`} />
                    ) : (
                      <span className="text-sm font-bold text-slate-400">#{user.rank}</span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-white truncate">
                        {user.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-purple-400">(You)</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {user.streak > 0 && `🔥 ${user.streak} day streak`}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-lg font-bold text-white">
                      {user.points.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="p-12 text-center">
            <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No users yet. Be the first!</p>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="glass rounded-xl p-4 border border-white/5 text-center">
        <p className="text-sm text-slate-400">
          Showing top <span className="text-white font-semibold">{leaderboard.length}</span> students
        </p>
      </div>
    </div>
  );
}