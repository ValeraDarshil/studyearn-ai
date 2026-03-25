/**
 * AI Study OS — Learner Onboarding Page
 * ─────────────────────────────────────────────────────────────
 * 2 modes:
 *   1. Standalone page  → /onboarding route (after signup)
 *   2. Modal mode       → App.tsx ke andar inline modal
 *
 * onComplete prop:
 *   - Modal mode mein pass karo → modal band ho jata hai
 *   - Standalone mode mein auto-navigates to /app/dashboard
 *
 * Drop this in: src/pages/Onboarding.tsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Code2, GraduationCap, BookOpen, ChevronRight, Sparkles, Check } from 'lucide-react';
import { setupLearnerProfile, LearnerCategory } from '../utils/brain-api';

const CATEGORIES = [
  { id: 'school' as const,  icon: BookOpen,       label: 'School Student',        sub: 'Class 1–12 (CBSE / ICSE / State)', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'coding' as const,  icon: Code2,          label: 'Coding Learner',         sub: 'Python, JavaScript, C, Web Dev...', gradient: 'from-violet-500 to-purple-500' },
  { id: 'college' as const, icon: GraduationCap,  label: 'College / University',   sub: 'UG, PG, Engineering, Science...',  gradient: 'from-pink-500 to-rose-500' },
  { id: 'self' as const,    icon: Brain,          label: 'Self Learner',           sub: 'Skill building, certifications...',  gradient: 'from-amber-500 to-orange-500' },
];

const SCHOOL_CLASSES  = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'];
const COLLEGE_LEVELS  = ['1st Year UG','2nd Year UG','3rd Year UG','4th Year UG','Postgraduate (PG)','PhD / Research'];

type LearnerCategory = 'school' | 'coding' | 'college' | 'self';

const SUBJECT_OPTIONS: Record<LearnerCategory, string[]> = {
  school:  ['Mathematics','Physics','Chemistry','Biology','English','History','Geography','Economics','Computer Science'],
  coding:  ['Python','JavaScript','C/C++','Java','HTML & CSS','React','Data Structures','Algorithms','Databases'],
  college: ['Mathematics','Physics','Chemistry','Data Structures','Algorithms','Machine Learning','Economics','Management','Engineering'],
  self:    ['Web Development','Data Science','Design','Business','Finance','Communication','AI/ML','Marketing','Photography'],
};

interface OnboardingProps {
  onComplete?: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps = {}) {
  const navigate = useNavigate();
  const [step, setStep]        = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<LearnerCategory | null>(null);
  const [classLevel, setClass]  = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [language, setLanguage] = useState<'english' | 'hinglish'>('english');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const toggleSubject = (s: string) =>
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 5 ? [...prev, s] : prev);

  const handleFinish = async () => {
    if (!category) return;
    setLoading(true); setError('');
    try {
      const res = await setupLearnerProfile({ learnerCategory: category, classLevel: classLevel || undefined, primarySubjects: subjects, preferredLanguage: language });
      if (res.success) { onComplete ? onComplete() : navigate('/app/dashboard', { replace: true }); }
      else setError('Something went wrong. Please try again.');
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> AI Study OS — Quick Setup
          </div>
          <h1 className="text-3xl font-bold text-white">Personalize Your Learning</h1>
          <p className="text-slate-400 mt-2">Takes 30 seconds. Your AI tutor adapts to you.</p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8">
          {[1,2,3].map(n => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > n ? 'bg-violet-500 text-white' : step === n ? 'bg-violet-500/20 border-2 border-violet-500 text-violet-400' : 'bg-slate-800 text-slate-600'}`}>
                {step > n ? <Check className="w-4 h-4" /> : n}
              </div>
              {n < 3 && <div className={`w-12 h-0.5 ${step > n ? 'bg-violet-500' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-white text-center mb-6">Who are you learning as?</h2>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon; const selected = category === cat.id;
                return (
                  <button key={cat.id} onClick={() => setCategory(cat.id)} className={`relative p-5 rounded-2xl border text-left transition-all ${selected ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                    {selected && <div className="absolute top-3 right-3 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-3`}><Icon className="w-5 h-5 text-white" /></div>
                    <div className="font-semibold text-white text-sm">{cat.label}</div>
                    <div className="text-slate-400 text-xs mt-1">{cat.sub}</div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => category && setStep(2)} disabled={!category} className="mt-6 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-all">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && category && (
          <div>
            {(category === 'school' || category === 'college') && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white text-center mb-4">{category === 'school' ? 'Which class are you in?' : 'What is your current level?'}</h2>
                <div className="grid grid-cols-3 gap-2">
                  {(category === 'school' ? SCHOOL_CLASSES : COLLEGE_LEVELS).map(level => (
                    <button key={level} onClick={() => setClass(level)} className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${classLevel === level ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{level}</button>
                  ))}
                </div>
              </div>
            )}
            <h2 className="text-xl font-semibold text-white text-center mb-4">Pick your subjects <span className="text-slate-400 text-base font-normal">(up to 5)</span></h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUBJECT_OPTIONS[category].map(s => (
                <button key={s} onClick={() => toggleSubject(s)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${subjects.includes(s) ? 'bg-violet-600 text-white border border-violet-500' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500'}`}>
                  {subjects.includes(s) && '✓ '}{s}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition-all">Back</button>
              <button onClick={() => setStep(3)} className="flex-[2] py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-2 transition-all">Continue <ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-white text-center mb-2">How should your AI tutor explain?</h2>
            <p className="text-slate-400 text-center text-sm mb-6">You can change this anytime in settings</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { id: 'english' as const, emoji: '🇬🇧', label: 'English',  sub: 'Formal, clear explanations' },
                { id: 'hinglish' as const, emoji: '🇮🇳', label: 'Hinglish', sub: 'English + Hindi mix, friendly tone' },
              ].map(opt => (
                <button key={opt.id} onClick={() => setLanguage(opt.id)} className={`p-5 rounded-2xl border text-center transition-all ${language === opt.id ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                  <div className="text-4xl mb-2">{opt.emoji}</div>
                  <div className="font-semibold text-white">{opt.label}</div>
                  <div className="text-slate-400 text-xs mt-1">{opt.sub}</div>
                  {language === opt.id && <div className="mt-2 text-violet-400 text-xs font-medium">✓ Selected</div>}
                </button>
              ))}
            </div>
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition-all">Back</button>
              <button onClick={handleFinish} disabled={loading} className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Setting up...</> : <><Sparkles className="w-4 h-4" /> Launch AI Study OS</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}