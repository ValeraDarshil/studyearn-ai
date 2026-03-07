import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Sparkles, Brain, FileText, Presentation, Gift, ChevronRight, Star, Zap, Trophy, ArrowRight, Menu, X } from 'lucide-react';
import { testimonials, leaderboardData } from '../data/mockData';

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  // ✅ FIXED: Redirect to signup instead of directly to app
  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen animated-bg grid-bg relative overflow-hidden">
      {/* Orbs */}
      <div className="orb w-[500px] h-[500px] bg-blue-500 top-[-200px] left-[-100px] fixed" />
      <div className="orb w-[400px] h-[400px] bg-purple-600 top-[30%] right-[-150px] fixed" />
      <div className="orb w-[300px] h-[300px] bg-cyan-500 bottom-[-100px] left-[40%] fixed" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">StudyEarn <span className="gradient-text">AI</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-sm text-slate-400 hover:text-white transition-colors">Testimonials</a>
              <a href="#leaderboard" className="text-sm text-slate-400 hover:text-white transition-colors">Leaderboard</a>
              <button
                onClick={handleGetStarted}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-slate-400 hover:text-white">Features</a>
            <a href="#testimonials" className="block text-sm text-slate-400 hover:text-white">Testimonials</a>
            <a href="#leaderboard" className="block text-sm text-slate-400 hover:text-white">Leaderboard</a>
            <button onClick={handleGetStarted} className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-500/20 mb-8">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-tight tracking-tight mb-6">
            Study Smart.{' '}
            <span className="gradient-text neon-text">Earn Smart.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The AI-powered study platform that answers your questions, generates presentations,
            converts documents — and <span className="text-purple-400 font-medium">rewards you</span> for learning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg glow-btn flex items-center justify-center gap-2"
            >
              Start Studying
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 rounded-2xl glass border border-white/10 text-white font-semibold text-lg hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Presentation className="w-5 h-5 text-purple-400" />
              Generate PPT
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 max-w-lg mx-auto">
            {[
              { value: '50K+', label: 'Students' },
              { value: '2M+', label: 'Questions' },
              { value: '100K+', label: 'Rewards' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Everything You Need to <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              AI-powered tools designed to make learning easier, faster, and more rewarding
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'Ask AI Anything',
                desc: 'Get instant, detailed answers to any question. Upload images for visual problem-solving.',
                color: 'from-blue-500 to-cyan-500',
                points: '+10 pts',
              },
              {
                icon: Presentation,
                title: 'Generate Presentations',
                desc: 'Create professional slides instantly. AI builds complete PPTs on any topic.',
                color: 'from-purple-500 to-pink-500',
                points: '+25 pts',
              },
              {
                icon: FileText,
                title: 'PDF Tools',
                desc: 'Convert images to PDF, merge files, and more. All your document needs in one place.',
                color: 'from-cyan-500 to-blue-500',
                points: '+5 pts',
              },
              {
                icon: Gift,
                title: 'Earn Rewards',
                desc: 'Every action earns points. Redeem for real rewards and climb the leaderboard.',
                color: 'from-pink-500 to-purple-500',
                points: '100 pts',
              },
              {
                icon: Trophy,
                title: 'Daily Challenges',
                desc: '5 free AI questions daily. Complete streaks for bonus rewards.',
                color: 'from-orange-500 to-red-500',
                points: 'Streak',
              },
              {
                icon: Star,
                title: 'Track Progress',
                desc: 'View your stats, achievements, and activity history in a beautiful dashboard.',
                color: 'from-yellow-500 to-orange-500',
                points: 'Stats',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 mb-3">{feature.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-400">
                  <Zap className="w-3 h-3" />
                  {feature.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Loved by <span className="gradient-text">Students</span>
            </h2>
            <p className="text-slate-400">See what our community has to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="glass rounded-2xl p-6 border border-white/5">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={`star2-${t.id}-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section id="leaderboard" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Top <span className="gradient-text">Learners</span>
            </h2>
            <p className="text-slate-400">Compete with students worldwide</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5">
            <div className="space-y-3">
              {leaderboardData.slice(0, 5).map((user, idx) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    idx === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' :
                    'bg-white/[0.02] border border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      idx === 0 ? 'bg-yellow-500 text-black' :
                      idx === 1 ? 'bg-slate-400 text-black' :
                      idx === 2 ? 'bg-orange-600 text-white' :
                      'bg-white/10 text-slate-400'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.streak} day streak</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-white">{user.points.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 border border-purple-500/20">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Ready to Start <span className="gradient-text">Earning?</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of students already learning smarter and earning rewards
            </p>
            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg glow-btn inline-flex items-center gap-2"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-slate-500 mt-4">No credit card required • 100 points welcome bonus</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-500">
          <p>© 2026 StudyEarn AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}