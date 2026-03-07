/**
 * StudyEarn AI — Landing Page v2
 * Polished UI with scroll animations, floating elements, better sections
 */
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Brain, FileText, Presentation, Gift,
  ChevronRight, Star, Zap, Trophy, ArrowRight,
  Menu, X, Flame, BarChart2, HelpCircle, BookOpen,
  CheckCircle, Users, MessageSquare, Shield
} from 'lucide-react';
import { testimonials, leaderboardData } from '../data/mockData';

// ─────────────────────────────────────────────────────────────
// Intersection observer hook for scroll animations
// ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─────────────────────────────────────────────────────────────
// Animated counter
// ─────────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────
// Feature card
// ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Brain,        title: 'Ask AI Anything',        desc: 'Instant detailed answers to any question. Upload images for visual problem-solving.', color: 'from-blue-500 to-cyan-500',    pts: '+10 pts per question',  glow: 'rgba(59,130,246,0.15)' },
  { icon: Presentation, title: 'Generate PPTs',           desc: 'Create professional presentations instantly. AI builds complete slides on any topic.', color: 'from-purple-500 to-pink-500',  pts: '+25 pts per PPT',       glow: 'rgba(139,92,246,0.15)' },
  { icon: FileText,     title: 'PDF Tools',               desc: 'Convert, merge, and manage PDFs. All your document needs in one place.',              color: 'from-cyan-500 to-teal-500',    pts: '+5 pts per action',     glow: 'rgba(6,182,212,0.15)' },
  { icon: HelpCircle,   title: 'AI Quiz Generator',       desc: 'Generate 10 MCQ quizzes on any topic. Test yourself and earn points for correct answers.', color: 'from-violet-500 to-purple-500', pts: '+5 pts per correct',  glow: 'rgba(139,92,246,0.15)' },
  { icon: Flame,        title: 'Daily Challenges',        desc: 'One special question every day. Bonus points for streaks — keep the fire going!',    color: 'from-orange-500 to-red-500',   pts: 'Up to +35 pts/day',     glow: 'rgba(249,115,22,0.15)' },
  { icon: BookOpen,     title: 'Smart Study Planner',     desc: 'Enter your exam date and subjects — AI creates your perfect daily timetable.',       color: 'from-emerald-500 to-green-500',pts: '+20 pts per plan',      glow: 'rgba(16,185,129,0.15)' },
  { icon: BarChart2,    title: 'Analytics Dashboard',     desc: 'Track your progress, weak subjects, and activity heatmap. Know exactly where to improve.', color: 'from-pink-500 to-rose-500', pts: 'Full insights',         glow: 'rgba(236,72,153,0.15)' },
  { icon: Gift,         title: 'Earn Real Rewards',       desc: 'Every action earns points. Redeem for rewards, climb the leaderboard, win prizes.',  color: 'from-yellow-500 to-orange-500',pts: '100 pts welcome bonus', glow: 'rgba(234,179,8,0.15)' },
];

const WHY = [
  { icon: Zap,          title: 'Instant AI Answers',    desc: 'No waiting. Get detailed, accurate answers in seconds powered by advanced AI.' },
  { icon: Shield,       title: 'Trusted by Students',   desc: 'Built specifically for CBSE/ICSE Class 8–12 students across India.' },
  { icon: Users,        title: 'Community Leaderboard', desc: 'Compete with thousands of students. Top learners win exclusive rewards.' },
  { icon: MessageSquare,title: 'Any Subject, Any Time', desc: 'Maths, Physics, Chemistry, History — ask anything, get expert-level answers.' },
];

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const go = () => navigate('/signup');

  // ── Sections with scroll reveal ────────────────────────────
  const heroSection     = useInView(0.05);
  const statsSection    = useInView(0.2);
  const featuresSection = useInView(0.1);
  const whySection      = useInView(0.1);
  const testiSection    = useInView(0.1);
  const lbSection       = useInView(0.1);
  const ctaSection      = useInView(0.1);

  return (
    <div className="min-h-screen animated-bg grid-bg relative overflow-hidden">

      {/* ── Orbs ──────────────────────────────────────────── */}
      <div className="orb w-[600px] h-[600px] bg-blue-600   top-[-250px]  left-[-150px]  fixed opacity-40" />
      <div className="orb w-[500px] h-[500px] bg-purple-700 top-[25%]     right-[-200px] fixed opacity-30" />
      <div className="orb w-[350px] h-[350px] bg-cyan-600   bottom-[-80px] left-[35%]    fixed opacity-25" />

      {/* ── Navbar ────────────────────────────────────────── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-white/5 shadow-2xl shadow-black/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">StudyEarn <span className="gradient-text">AI</span></span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {['features','why','testimonials','leaderboard'].map(id => (
                <a key={id} href={`#${id}`}
                  className="text-sm text-slate-400 hover:text-white transition-colors capitalize">
                  {id === 'why' ? 'Why Us' : id}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
                Log in
              </button>
              <button onClick={go}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                Get Started Free
              </button>
            </div>

            <button className="md:hidden text-white p-1" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-3">
            {['features','testimonials','leaderboard'].map(id => (
              <a key={id} href={`#${id}`} onClick={() => setMobileMenu(false)}
                className="block text-sm text-slate-400 hover:text-white capitalize py-1">{id}</a>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => navigate('/login')} className="flex-1 px-4 py-2 rounded-xl glass border border-white/10 text-sm text-white">Log in</button>
              <button onClick={go} className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-sm text-white font-semibold">Sign Up</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div ref={heroSection.ref} className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${heroSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-500/30 mb-8 animate-pulse-slow">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-purple-300">Now with AI Quiz Generator + Study Planner</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Study Smart.{' '}
            <span className="gradient-text neon-text block sm:inline">Earn Smart.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The AI-powered study platform for Indian students that answers your questions,
            generates presentations, and{' '}
            <span className="text-purple-300 font-medium">rewards you for learning.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={go}
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg glow-btn flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
              Start Studying Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={go}
              className="px-8 py-4 rounded-2xl glass border border-white/10 text-white font-semibold text-lg hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2">
              <Presentation className="w-5 h-5 text-purple-400" />
              See All Features
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {['CBSE Ready','ICSE Ready','Class 8–12','Free to Start'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                {t}
              </div>
            ))}
          </div>

          {/* Floating feature pills */}
          <div className="relative mt-16 h-14 hidden sm:block">
            {[
              { label: '🧪 AI Quiz', left: '5%',  delay: '0s',    top: '0px' },
              { label: '📊 PPT Ready', left: '22%', delay: '0.3s',  top: '8px' },
              { label: '🔥 Streak Bonus', left: '42%', delay: '0.6s',  top: '0px' },
              { label: '📅 Study Planner', left: '62%', delay: '0.9s',  top: '8px' },
              { label: '🏆 Leaderboard', left: '80%', delay: '1.2s',  top: '0px' },
            ].map(p => (
              <div key={p.label} className="absolute px-3 py-1.5 glass rounded-full border border-white/10 text-xs text-white whitespace-nowrap animate-float"
                style={{ left: p.left, top: p.top, animationDelay: p.delay }}>
                {p.label}
              </div>
            ))}
          </div>
        </div>

        {/* Stats counter */}
        <div ref={statsSection.ref}
          className={`max-w-lg mx-auto mt-8 grid grid-cols-3 gap-4 sm:gap-8 transition-all duration-1000 delay-300 ${statsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {[
            { target: 50000, suffix: '+', label: 'Students' },
            { target: 2000000, suffix: '+', label: 'Questions' },
            { target: 100000, suffix: '+', label: 'Points Earned' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black gradient-text mb-1">
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <div className="text-xs sm:text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div ref={featuresSection.ref} className="max-w-6xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${featuresSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-300 font-medium">8 Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Everything You Need to <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              AI tools designed for Indian students — answers, presentations, quizzes, and more
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={f.title}
                className={`glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-500 group cursor-default
                  hover:-translate-y-1 hover:shadow-xl
                  ${featuresSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{
                  transitionDelay: featuresSection.inView ? `${i * 60}ms` : '0ms',
                  ['--glow' as any]: f.glow,
                }}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2 leading-tight">{f.title}</h3>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{f.desc}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                  <Zap className="w-2.5 h-2.5" />{f.pts}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY STUDYEARN ─────────────────────────────────── */}
      <section id="why" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div ref={whySection.ref} className="max-w-5xl mx-auto">
          <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-all duration-700 ${whySection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {WHY.map((w, i) => (
              <div key={w.title}
                className="rounded-2xl p-5 border border-white/5 bg-white/[0.02] space-y-3"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center">
                  <w.icon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-sm font-bold text-white">{w.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section id="testimonials" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div ref={testiSection.ref} className="max-w-6xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${testiSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Loved by <span className="gradient-text">Students</span>
            </h2>
            <p className="text-slate-400">See what our community has to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name}
                className={`glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1
                  ${testiSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 mb-5 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
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

      {/* ── LEADERBOARD PREVIEW ───────────────────────────── */}
      <section id="leaderboard" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div ref={lbSection.ref} className="max-w-2xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${lbSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Top <span className="gradient-text">Learners</span>
            </h2>
            <p className="text-slate-400">Compete with students across India</p>
          </div>

          <div className={`glass rounded-2xl border border-white/5 overflow-hidden transition-all duration-700 delay-200 ${lbSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">🏆 Global Rankings</span>
              <span className="text-xs text-slate-500">Updated live</span>
            </div>
            <div className="divide-y divide-white/5">
              {leaderboardData.slice(0, 5).map((user, idx) => (
                <div key={user.id}
                  className={`flex items-center gap-4 px-5 py-4 transition-all ${idx === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/5' : 'hover:bg-white/[0.02]'}`}
                  style={{ transitionDelay: `${idx * 80}ms` }}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0
                    ${idx === 0 ? 'bg-yellow-400 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                    {user.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{user.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" />{user.streak} day streak
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="font-bold text-white text-sm">{user.points.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-white/5 text-center">
              <button onClick={go} className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 mx-auto">
                Join & see your rank <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div ref={ctaSection.ref} className={`max-w-4xl mx-auto transition-all duration-700 ${ctaSection.inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative glass rounded-3xl p-10 sm:p-14 border border-purple-500/20 text-center overflow-hidden">
            {/* CTA glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent rounded-full" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-300 font-medium">1,200+ students joined this week</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
                Ready to Start <span className="gradient-text">Earning?</span>
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Join thousands of students learning smarter with AI. Get 100 welcome points just for signing up.
              </p>

              <button onClick={go}
                className="group px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg glow-btn inline-flex items-center gap-2 hover:scale-105 transition-all">
                Get Started — It's Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex flex-wrap items-center justify-center gap-5 mt-6">
                {['No credit card', 'Free forever plan', '100 pts welcome bonus', 'CBSE/ICSE focused'].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CheckCircle className="w-3 h-3 text-green-500" />{t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="relative border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">StudyEarn <span className="gradient-text">AI</span></span>
            </div>
            <p className="text-xs text-slate-600 text-center">
              © 2026 StudyEarn AI. Made with ❤️ for Indian Students.
            </p>
            <div className="flex gap-4">
              <button onClick={go} className="text-xs text-slate-500 hover:text-white transition-colors">Sign Up</button>
              <button onClick={() => navigate('/login')} className="text-xs text-slate-500 hover:text-white transition-colors">Log In</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}