import { useState, useEffect } from 'react';
import { Trophy, Zap, Medal, TrendingUp, Crown, Award, Loader2, Flame, Star, Search, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  points: number;
  streak: number;
  joinedDate: string;
}

const RANK_CONFIG = [
  { min: 1,  max: 1,   icon: Crown,  color: 'text-yellow-400',  bg: 'bg-yellow-500/20',  label: '🏆 Champion',   border: 'border-yellow-500/40' },
  { min: 2,  max: 2,   icon: Medal,  color: 'text-slate-300',   bg: 'bg-slate-400/20',   label: '🥈 Silver',     border: 'border-slate-400/40'  },
  { min: 3,  max: 3,   icon: Award,  color: 'text-orange-400',  bg: 'bg-orange-500/20',  label: '🥉 Bronze',     border: 'border-orange-500/40' },
  { min: 4,  max: 10,  icon: Star,   color: 'text-purple-400',  bg: 'bg-purple-500/10',  label: 'Top 10',        border: '' },
  { min: 11, max: 50,  icon: Trophy, color: 'text-blue-400',    bg: 'bg-blue-500/10',    label: 'Top 50',        border: '' },
  { min: 51, max: 9999,icon: Trophy, color: 'text-slate-500',   bg: 'bg-slate-500/10',   label: '',              border: '' },
];

function getRankConfig(rank: number) {
  return RANK_CONFIG.find(c => rank >= c.min && rank <= c.max) || RANK_CONFIG[RANK_CONFIG.length - 1];
}

function getStreakEmoji(streak: number) {
  if (streak >= 30) return '🔥🔥🔥';
  if (streak >= 14) return '🔥🔥';
  if (streak >= 7)  return '🔥';
  if (streak >= 3)  return '✨';
  return '';
}

function PointsBadge({ points }: { points: number }) {
  if (points >= 10000) return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold">Legend</span>;
  if (points >= 5000)  return <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-semibold">Master</span>;
  if (points >= 2000)  return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold">Expert</span>;
  if (points >= 500)   return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">Pro</span>;
  return null;
}

export function Leaderboard() {
  const { userId } = useApp();
  const [leaderboard, setLeaderboard]   = useState<LeaderboardUser[]>([]);
  const [filtered, setFiltered]         = useState<LeaderboardUser[]>([]);
  const [myRank, setMyRank]             = useState<number | null>(null);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [search, setSearch]             = useState('');
  const [lastUpdated, setLastUpdated]   = useState<Date | null>(null);

  useEffect(() => { loadLeaderboard(); }, [userId]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(leaderboard); return; }
    const q = search.toLowerCase();
    setFiltered(leaderboard.filter(u => u.name.toLowerCase().includes(q)));
  }, [search, leaderboard]);

  const loadLeaderboard = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard/top?limit=100`);
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
        setFiltered(data.leaderboard);
        setLastUpdated(new Date());
        if (userId) {
          const me = data.leaderboard.find((u: LeaderboardUser) => u.id === userId);
          if (me) setMyRank(me.rank); else fetchMyRank();
        }
      }
    } catch (err) { console.error('Leaderboard error:', err); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const fetchMyRank = async () => {
    if (!userId) return;
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard/rank/${userId}`);
      const data = await res.json();
      if (data.success) setMyRank(data.rank);
    } catch {}
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const myEntry = leaderboard.find(u => u.id === userId);

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" /> Leaderboard
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {leaderboard.length} students · {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {myRank && (
            <div className="glass px-4 py-2 rounded-xl border border-purple-500/30 text-center">
              <div className="text-xs text-slate-500">Your Rank</div>
              <div className="text-xl font-bold text-purple-400">#{myRank}</div>
            </div>
          )}
          <button
            onClick={() => loadLeaderboard(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
            title="Refresh"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Top 3 Podium ── */}
      {top3.length >= 3 && (
        <div className="glass rounded-2xl p-6 border border-white/10 overflow-hidden relative">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />

          <div className="grid grid-cols-3 gap-3 items-end relative">
            {/* 2nd Place */}
            {[1, 0, 2].map((idx) => {
              const user = top3[idx];
              const isFirst = idx === 0;
              const cfg = getRankConfig(user.rank);
              return (
                <div
                  key={user.id}
                  className={`text-center ${isFirst ? '-mt-6' : 'mt-4'} ${user.id === userId ? 'ring-2 ring-purple-500 rounded-2xl p-2' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`${isFirst ? 'w-18 h-18' : 'w-14 h-14'} rounded-full bg-gradient-to-br ${
                    idx === 0 ? 'from-yellow-400 to-orange-500 ring-4 ring-yellow-500/30' :
                    idx === 1 ? 'from-slate-400 to-slate-600' : 'from-orange-400 to-orange-600'
                  } flex items-center justify-center mx-auto mb-2`}
                    style={{ width: isFirst ? '72px' : '56px', height: isFirst ? '72px' : '56px' }}
                  >
                    <cfg.icon className={`${isFirst ? 'w-9 h-9' : 'w-7 h-7'} text-white`} />
                  </div>

                  {/* Name */}
                  <div className={`${isFirst ? 'text-base' : 'text-sm'} font-bold text-white truncate px-1`}>
                    {user.name}
                    {user.id === userId && <span className="text-purple-400 text-xs"> (You)</span>}
                  </div>

                  {/* Points */}
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mt-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="font-semibold text-white">{user.points.toLocaleString()}</span>
                  </div>

                  {/* Streak */}
                  {user.streak > 0 && (
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center justify-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" />
                      {user.streak}d
                    </div>
                  )}

                  {/* Place Badge */}
                  <div className={`mt-2 mx-auto px-3 py-1 rounded-full text-xs font-bold w-fit ${
                    idx === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' :
                    idx === 1 ? 'bg-slate-500/30 text-slate-300' : 'bg-orange-500/20 text-orange-300'
                  }`}>
                    {idx === 0 ? '🏆 1st' : idx === 1 ? '🥈 2nd' : '🥉 3rd'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── My Position (if outside top 100) ── */}
      {myEntry && myEntry.rank > 3 && (
        <div className="glass rounded-xl p-4 border border-purple-500/30 bg-purple-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-sm font-bold text-purple-400">#{myEntry.rank}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{myEntry.name} <span className="text-purple-400 text-xs">(You)</span></div>
                {myEntry.streak > 0 && (
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" />
                    {myEntry.streak} day streak {getStreakEmoji(myEntry.streak)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PointsBadge points={myEntry.points} />
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-white">{myEntry.points.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/40 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-lg leading-none">×</button>
        )}
      </div>

      {/* ── Full Rankings Table ── */}
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            {search ? `Results for "${search}" (${filtered.length})` : `All Rankings (${leaderboard.length})`}
          </h2>
          <div className="text-xs text-slate-600">Rank · Name · XP</div>
        </div>

        <div className="divide-y divide-white/[0.04] max-h-[60vh] overflow-y-auto">
          {filtered.map((user) => {
            const cfg = getRankConfig(user.rank);
            const isMe = userId && user.id === userId;
            return (
              <div
                key={user.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isMe ? 'bg-purple-500/10 border-l-2 border-purple-500' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Rank */}
                <div className={`w-9 h-9 rounded-full flex-shrink-0 ${cfg.bg} flex items-center justify-center`}>
                  {user.rank <= 3 ? (
                    <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                  ) : (
                    <span className={`text-xs font-bold ${user.rank <= 10 ? 'text-purple-400' : 'text-slate-500'}`}>
                      #{user.rank}
                    </span>
                  )}
                </div>

                {/* Name + streak */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate">
                      {user.name}
                    </span>
                    {isMe && <span className="text-xs text-purple-400 shrink-0">(You)</span>}
                    <PointsBadge points={user.points} />
                  </div>
                  {user.streak > 0 && (
                    <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <Flame className="w-3 h-3 text-orange-400" />
                      {user.streak}d streak {getStreakEmoji(user.streak)}
                    </div>
                  )}
                </div>

                {/* XP */}
                <div className="flex items-center gap-1 shrink-0">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span className={`font-bold tabular-nums ${isMe ? 'text-purple-300' : 'text-white'} text-sm`}>
                    {user.points.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <Trophy className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                {search ? `No results for "${search}"` : 'No students yet. Be the first!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="text-center text-xs text-slate-600">
        Earn XP by completing sections and quizzes · Streak bonus for daily practice
      </div>
    </div>
  );
}