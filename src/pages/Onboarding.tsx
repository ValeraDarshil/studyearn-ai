/**
 * AI Study OS — Learner Onboarding Page
 * ─────────────────────────────────────────────────────────────
 * 2 modes:
 *   1. Standalone page → /onboarding route
 *   2. Modal mode      → App.tsx ke andar inline modal
 *
 * College students ke liye:
 *   - Branch selection added (Mechanical, Chemical, Civil, etc.)
 *   - Har branch ke liye relevant subjects
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Code2, GraduationCap, BookOpen,
  ChevronRight, Sparkles, Check, Wrench,
  FlaskConical, Cpu, Building2, Zap,
} from 'lucide-react';
import { setupLearnerProfile } from '../utils/brain-api';

type LearnerCategory = 'school' | 'coding' | 'college' | 'self';

// ── Learner category cards ──────────────────────────────────
const CATEGORIES = [
  { id: 'school'  as LearnerCategory, icon: BookOpen,      label: 'School Student',      sub: 'Class 1–12 (CBSE / ICSE / State)',  gradient: 'from-blue-500 to-cyan-500' },
  { id: 'coding'  as LearnerCategory, icon: Code2,         label: 'Coding Learner',       sub: 'Python, JS, C, Web Dev & more',     gradient: 'from-violet-500 to-purple-500' },
  { id: 'college' as LearnerCategory, icon: GraduationCap, label: 'College / University', sub: 'UG, PG, Engineering, Science...',   gradient: 'from-pink-500 to-rose-500' },
  { id: 'self'    as LearnerCategory, icon: Brain,         label: 'Self Learner',         sub: 'Skills, certs, curiosity & growth', gradient: 'from-amber-500 to-orange-500' },
];

// ── School classes ──────────────────────────────────────────
const SCHOOL_CLASSES = [
  'Class 1','Class 2','Class 3','Class 4','Class 5','Class 6',
  'Class 7','Class 8','Class 9','Class 10','Class 11','Class 12',
];

// ── College levels ──────────────────────────────────────────
const COLLEGE_LEVELS = [
  '1st Year','2nd Year','3rd Year','4th Year','Postgraduate (PG)','PhD / Research',
];

// ── College branches — NEW ──────────────────────────────────
const COLLEGE_BRANCHES = [
  { id: 'cs',        label: 'Computer Science / IT',    icon: Cpu },
  { id: 'mech',      label: 'Mechanical Engineering',   icon: Wrench },
  { id: 'chem',      label: 'Chemical Engineering',     icon: FlaskConical },
  { id: 'civil',     label: 'Civil Engineering',        icon: Building2 },
  { id: 'elec',      label: 'Electrical / Electronics', icon: Zap },
  { id: 'science',   label: 'Pure Science (B.Sc/M.Sc)', icon: FlaskConical },
  { id: 'commerce',  label: 'Commerce / MBA',           icon: Brain },
  { id: 'arts',      label: 'Arts / Humanities',        icon: BookOpen },
  { id: 'other',     label: 'Other / Not Listed',       icon: GraduationCap },
];

// ── Subjects per branch ─────────────────────────────────────
const BRANCH_SUBJECTS: Record<string, string[]> = {
  cs:       ['Data Structures', 'Algorithms', 'Operating Systems', 'Database (DBMS)', 'Computer Networks', 'Machine Learning', 'Web Development', 'Software Engineering', 'Theory of Computation'],
  mech:     ['Engineering Mechanics', 'Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Machine Design', 'Heat Transfer', 'Strength of Materials', 'CAD/CAM', 'Industrial Engineering'],
  chem:     ['Chemical Reaction Engineering', 'Mass Transfer', 'Heat Transfer', 'Fluid Mechanics', 'Process Control', 'Thermodynamics', 'Transport Phenomena', 'Industrial Chemistry', 'Biochemical Engineering'],
  civil:    ['Structural Analysis', 'Fluid Mechanics', 'Geotechnical Engineering', 'Transportation Engineering', 'Environmental Engineering', 'Surveying', 'Construction Management', 'Concrete Technology', 'Steel Design'],
  elec:     ['Circuit Analysis', 'Signals & Systems', 'Digital Electronics', 'Power Systems', 'Control Systems', 'Electromagnetics', 'Microprocessors', 'Communication Systems', 'VLSI Design'],
  science:  ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Statistics', 'Biochemistry', 'Organic Chemistry', 'Quantum Mechanics', 'Molecular Biology'],
  commerce: ['Accounting', 'Financial Management', 'Marketing', 'Business Law', 'Economics', 'Human Resources', 'Operations Management', 'Strategic Management', 'Taxation'],
  arts:     ['History', 'Political Science', 'Sociology', 'Psychology', 'Literature', 'Philosophy', 'Geography', 'Economics', 'Journalism'],
  other:    ['Mathematics', 'Physics', 'Chemistry', 'Core Subjects', 'Research Methods', 'Technical Writing', 'Project Management', 'Statistics', 'Communication Skills'],
};

// ── Coding subjects ─────────────────────────────────────────
const CODING_SUBJECTS = [
  'Python', 'JavaScript', 'C/C++', 'Java', 'HTML & CSS',
  'React', 'Node.js', 'Data Structures', 'Algorithms',
  'Databases (SQL)', 'Git & GitHub', 'System Design',
];

// ── Self learner subjects ───────────────────────────────────
const SELF_SUBJECTS = [
  'Web Development', 'Data Science', 'AI / Machine Learning',
  'UI/UX Design', 'Digital Marketing', 'Finance & Investing',
  'Business & Entrepreneurship', 'Communication Skills',
  'Photography / Video', 'Content Writing', 'Cloud Computing', 'Cybersecurity',
];

interface OnboardingProps {
  onComplete?: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps = {}) {
  const navigate = useNavigate();

  const [step, setStep]               = useState<1 | 2 | 3 | 4>(1);
  const [category, setCategory]       = useState<LearnerCategory | null>(null);
  const [classLevel, setClassLevel]   = useState('');
  const [branch, setBranch]           = useState('');       // college branch
  const [subjects, setSubjects]       = useState<string[]>([]);
  const [language, setLanguage]       = useState<'english' | 'hinglish'>('english');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  // Max steps: college = 4 (category → year → branch → subjects → language)
  // Others    = 3 (category → class/subjects → language)
  const totalSteps = category === 'college' ? 4 : 3;

  const toggleSubject = (s: string) =>
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 6 ? [...prev, s] : prev);

  // Get subjects list based on category + branch
  const getSubjectList = (): string[] => {
    if (category === 'coding')  return CODING_SUBJECTS;
    if (category === 'self')    return SELF_SUBJECTS;
    if (category === 'college') return BRANCH_SUBJECTS[branch] || BRANCH_SUBJECTS['other'];
    // School — general subjects
    return ['Mathematics','Physics','Chemistry','Biology','English','History','Geography','Economics','Computer Science','Hindi'];
  };

  const handleNext = () => {
    if (step === 1 && category) {
      setStep(2); return;
    }
    if (step === 2) {
      if (category === 'college') { setStep(3); return; }
      setStep(3); return; // school/coding/self → go to subjects (step 3 for them = language actually, see below)
    }
    if (step === 3 && category === 'college') {
      setStep(4); return;
    }
  };

  // For non-college users: step 2 = class+subjects, step 3 = language
  // For college users:     step 2 = year, step 3 = branch+subjects, step 4 = language

  const handleFinish = async () => {
    if (!category) return;
    setLoading(true); setError('');
    try {
      // Build classLevel string
      let finalClassLevel = classLevel;
      if (category === 'college' && branch) {
        // e.g. "2nd Year — Mechanical Engineering"
        const branchLabel = COLLEGE_BRANCHES.find(b => b.id === branch)?.label || branch;
        finalClassLevel = classLevel ? `${classLevel} — ${branchLabel}` : branchLabel;
      }

      const res = await setupLearnerProfile({
        learnerCategory:   category,
        classLevel:        finalClassLevel || undefined,
        primarySubjects:   subjects,
        preferredLanguage: language,
      });

      if (res.success) {
        onComplete ? onComplete() : navigate('/app/brain', { replace: true });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step indicator
  const stepLabels: Record<LearnerCategory, string[]> = {
    school:  ['Who are you?', 'Your Subjects', 'Language'],
    coding:  ['Who are you?', 'Your Subjects', 'Language'],
    college: ['Who are you?', 'Your Year',     'Your Branch', 'Language'],
    self:    ['Who are you?', 'Your Interests','Language'],
  };
  const labels = category ? stepLabels[category] : ['Who are you?', 'Details', 'Language'];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> AI Study OS — Quick Setup
          </div>
          <h1 className="text-3xl font-bold text-white">Personalize Your Learning</h1>
          <p className="text-slate-400 mt-2">Takes 30 seconds. Your AI tutor adapts to you.</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(n => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > n  ? 'bg-violet-500 text-white' :
                step === n ? 'bg-violet-500/20 border-2 border-violet-500 text-violet-400' :
                'bg-slate-800 text-slate-600'
              }`}>
                {step > n ? <Check className="w-4 h-4" /> : n}
              </div>
              {n < totalSteps && <div className={`w-8 h-0.5 ${step > n ? 'bg-violet-500' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Learner Category ───────────────────────── */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-white text-center mb-6">Who are you learning as?</h2>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const selected = category === cat.id;
                return (
                  <button key={cat.id} onClick={() => setCategory(cat.id)}
                    className={`relative p-5 rounded-2xl border text-left transition-all ${selected ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                    {selected && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-semibold text-white text-sm">{cat.label}</div>
                    <div className="text-slate-400 text-xs mt-1">{cat.sub}</div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => category && setStep(2)} disabled={!category}
              className="mt-6 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-all">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── STEP 2: School class / College year / Coding & Self → subjects ── */}
        {step === 2 && category && (
          <div>
            {/* School → class selector */}
            {category === 'school' && (
              <>
                <h2 className="text-xl font-semibold text-white text-center mb-4">Which class are you in?</h2>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {SCHOOL_CLASSES.map(c => (
                    <button key={c} onClick={() => setClassLevel(c)}
                      className={`py-2 px-2 rounded-xl text-sm font-medium transition-all text-center ${classLevel === c ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* College → year selector */}
            {category === 'college' && (
              <>
                <h2 className="text-xl font-semibold text-white text-center mb-4">What year are you in?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
                  {COLLEGE_LEVELS.map(level => (
                    <button key={level} onClick={() => setClassLevel(level)}
                      className={`py-3 px-3 rounded-xl text-sm font-medium transition-all text-center ${classLevel === level ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                      {level}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Coding & Self → subjects directly */}
            {(category === 'coding' || category === 'self') && (
              <>
                <h2 className="text-xl font-semibold text-white text-center mb-4">
                  {category === 'coding' ? 'What do you want to learn?' : 'What are your interests?'}
                  <span className="text-slate-400 text-base font-normal ml-2">(up to 6)</span>
                </h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  {getSubjectList().map(s => (
                    <button key={s} onClick={() => toggleSubject(s)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${subjects.includes(s) ? 'bg-violet-600 text-white border border-violet-500' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500'}`}>
                      {subjects.includes(s) && '✓ '}{s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* School → also add subject selector below class */}
            {category === 'school' && (
              <>
                <h2 className="text-base font-semibold text-white text-center mb-3">
                  Which subjects? <span className="text-slate-400 font-normal">(up to 6)</span>
                </h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  {getSubjectList().map(s => (
                    <button key={s} onClick={() => toggleSubject(s)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${subjects.includes(s) ? 'bg-violet-600 text-white border border-violet-500' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500'}`}>
                      {subjects.includes(s) && '✓ '}{s}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition-all">Back</button>
              <button onClick={handleNext}
                className="flex-[2] py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-2 transition-all">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 (College): Branch + Subjects ─────────────── */}
        {step === 3 && category === 'college' && (
          <div>
            <h2 className="text-xl font-semibold text-white text-center mb-4">What is your branch / stream?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {COLLEGE_BRANCHES.map(b => {
                const Icon = b.icon;
                const selected = branch === b.id;
                return (
                  <button key={b.id} onClick={() => { setBranch(b.id); setSubjects([]); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${selected ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${selected ? 'bg-violet-500/20' : 'bg-slate-700'}`}>
                      <Icon className={`w-4 h-4 ${selected ? 'text-violet-400' : 'text-slate-400'}`} />
                    </div>
                    <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-300'}`}>{b.label}</span>
                    {selected && <Check className="w-4 h-4 text-violet-400 ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Subjects for selected branch */}
            {branch && (
              <>
                <h2 className="text-base font-semibold text-white text-center mb-3">
                  Key subjects <span className="text-slate-400 font-normal">(up to 6)</span>
                </h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  {getSubjectList().map(s => (
                    <button key={s} onClick={() => toggleSubject(s)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${subjects.includes(s) ? 'bg-violet-600 text-white border border-violet-500' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500'}`}>
                      {subjects.includes(s) && '✓ '}{s}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition-all">Back</button>
              <button onClick={() => setStep(4)} disabled={!branch}
                className="flex-[2] py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-all">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 (non-college) or STEP 4 (college): Language ── */}
        {((step === 3 && category !== 'college') || (step === 4 && category === 'college')) && (
          <div>
            <h2 className="text-xl font-semibold text-white text-center mb-2">How should your AI tutor explain?</h2>
            <p className="text-slate-400 text-center text-sm mb-6">You can change this anytime in settings</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { id: 'english'  as const, emoji: '🇬🇧', label: 'English',  sub: 'Formal, clear explanations' },
                { id: 'hinglish' as const, emoji: '🇮🇳', label: 'Hinglish', sub: 'English + Hindi mix, friendly tone' },
              ].map(opt => (
                <button key={opt.id} onClick={() => setLanguage(opt.id)}
                  className={`p-5 rounded-2xl border text-center transition-all ${language === opt.id ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                  <div className="text-4xl mb-2">{opt.emoji}</div>
                  <div className="font-semibold text-white">{opt.label}</div>
                  <div className="text-slate-400 text-xs mt-1">{opt.sub}</div>
                  {language === opt.id && <div className="mt-2 text-violet-400 text-xs font-medium">✓ Selected</div>}
                </button>
              ))}
            </div>

            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => {
                if (step === 4) setStep(3);
                else setStep(2);
              }} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition-all">
                Back
              </button>
              <button onClick={handleFinish} disabled={loading}
                className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Setting up...</>
                  : <><Sparkles className="w-4 h-4" /> Launch AI Study OS</>}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}