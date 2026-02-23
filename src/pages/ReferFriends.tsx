import { useState, useEffect } from 'react';
import { Users, Copy, Check, Gift, TrendingUp, Share2, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ReferFriends() {
  const { points, userId } = useApp();
  const [referralCode, setReferralCode] = useState('');
  const [referredUsers, setReferredUsers] = useState<any[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(true);

  const referralLink = `${window.location.origin}/#/signup?ref=${referralCode}`;

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5003/api/user/referral-data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (data.success) {
        setReferralCode(data.referralCode);
        setReferredUsers(data.referredUsers || []);
      }
    } catch (err) {
      console.error('Load referral error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const shareVia = (platform: string) => {
    const text = `Join StudyEarn AI and get 200 points bonus! Use my referral code: ${referralCode} or link: ${referralLink}`;
    const encodedText = encodeURIComponent(text);
    const encodedLink = encodeURIComponent(referralLink);
    
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedLink}&text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      email: `mailto:?subject=Join StudyEarn AI - Get 200 Points!&body=${encodedText}`,
    };
    
    window.open(urls[platform], '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-green-400" />
          Refer & Earn
        </h1>
        <p className="text-sm text-slate-400 mt-1">Share the learning, share the rewards! 🎉</p>
      </div>

      {/* Hero Card */}
      <div className="glass rounded-2xl p-8 border border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5 relative overflow-hidden">
        <div className="orb w-[300px] h-[300px] bg-green-500 top-[-100px] right-[-100px]" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-green-300">Limited Time Offer!</span>
              </div>
              
              <h2 className="text-3xl font-black gradient-text mb-3">
                Earn 100 Points Per Friend!
              </h2>
              <p className="text-slate-300 mb-4">
                Your friend gets <span className="text-green-400 font-bold">200 points</span>, 
                you get <span className="text-green-400 font-bold">100 points</span>. 
                Win-win! 🎁
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Check className="w-4 h-4 text-green-400" />
                <span>No limits • Unlimited referrals</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="glass rounded-xl p-4 border border-white/10 text-center min-w-[120px]">
                <div className="text-3xl font-bold text-white mb-1">{referredUsers.length}</div>
                <div className="text-xs text-slate-500">Friends</div>
              </div>
              <div className="glass rounded-xl p-4 border border-white/10 text-center min-w-[120px]">
                <div className="text-3xl font-bold text-green-400 mb-1">{referredUsers.length * 100}</div>
                <div className="text-xs text-slate-500">Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="glass rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-400" />
          Your Referral Code
        </h3>
        
        <div className="glass rounded-xl p-6 border border-white/10 text-center">
          <div className="text-4xl font-black gradient-text mb-3 tracking-widest">
            {referralCode}
          </div>
          <button
            onClick={() => copyToClipboard(referralCode, 'code')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              copiedCode 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {copiedCode ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Copied!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Code
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Referral Link */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-400" />
          Share Your Link
        </h3>
        
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono truncate">
            {referralLink}
          </div>
          <button
            onClick={() => copyToClipboard(referralLink, 'link')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
              copiedLink 
                ? 'bg-green-500 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
            }`}
          >
            {copiedLink ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Quick Share Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'WhatsApp', icon: MessageCircle, color: 'from-green-500 to-green-600', platform: 'whatsapp' },
            { name: 'Telegram', icon: MessageCircle, color: 'from-blue-500 to-blue-600', platform: 'telegram' },
            { name: 'Twitter', icon: MessageCircle, color: 'from-sky-400 to-sky-600', platform: 'twitter' },
            { name: 'Email', icon: Mail, color: 'from-purple-500 to-purple-600', platform: 'email' },
          ].map((option) => (
            <button
              key={option.name}
              onClick={() => shareVia(option.platform)}
              className="glass rounded-xl p-3 border border-white/5 hover:border-white/20 transition-all group flex flex-col items-center gap-2"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <option.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-slate-300">{option.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
        <div className="space-y-4">
          {[
            { 
              step: '1', 
              title: 'Share Your Code or Link', 
              desc: 'Send your referral code or link to friends via WhatsApp, email, or social media.' 
            },
            { 
              step: '2', 
              title: 'Friend Signs Up', 
              desc: 'When they create an account with your code, they get 200 points (100 base + 100 bonus)!' 
            },
            { 
              step: '3', 
              title: 'You Get Rewarded', 
              desc: 'Instantly receive 100 points in your account. No waiting, no limits!' 
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referred Friends List */}
      {referredUsers.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Your Referrals ({referredUsers.length})
          </h3>
          
          <div className="space-y-2">
            {referredUsers.map((user, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                  {user.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-slate-500">
                    Joined {new Date(user.joinedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-400 font-semibold text-sm">
                  <Gift className="w-4 h-4" />
                  +100
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}