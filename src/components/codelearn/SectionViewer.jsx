/**
 * StudyEarn AI — SectionViewer Component
 * FIXED: No separate useCodeLearn hook — state comes from CoursePage
 * Flow: Read → Mark as Read → Quiz → 70%+ Pass → Next Section unlocks
 */
import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Lightbulb, Play, RotateCcw, ChevronRight, X, Zap, Bot, Loader2, Lock } from 'lucide-react';
import QuizModal from './QuizModal.jsx';

// ─── UI Text ────────────────────────────────────────────────────
const UI_TEXT = {
  en: {
    markRead: 'Mark as Read (+20 XP)',
    alreadyRead: 'Content Read ✓',
    practiceCode: 'Practice Code →',
    takeQuiz: 'Take Quiz 🎯',
    quizLockedBtn: '🔒 Quiz Locked',
    quizLocked: 'Read the content first, then take the quiz',
    runBtn: 'Run Code', running: 'Running...',
    ctrlEnter: 'Ctrl+Enter to run',
    aiHint: 'AI Hint (-5 XP)', gettingHint: 'Getting hint...',
    explainCode: 'Explain My Code', explaining: 'Explaining...',
    output: 'Output', success: '✓ Success', error: '✗ Error',
    aiHintLabel: 'AI Hint', explanationLabel: 'Code Explanation',
    quizTitle: 'Section Quiz',
    quizDesc: (n) => `${n} questions · Score 70%+ to pass`,
    quizXp: 'Pass to earn +30 XP and unlock the next section!',
    startQuiz: 'Start Quiz →', retakeQuiz: 'Try Again',
    nextSection: 'Next Section →',
    completed: 'Completed', reset: 'Reset',
    runningCode: 'Running your code...',
    yourTask: 'Your Task:',
    quizPassed: 'Quiz Passed! 🎉',
    quizFailed: 'Not quite there yet!',
    quizFailedMsg: 'Go back and re-read the content carefully, then try again.',
    goBackRead: '← Re-read Content',
    readFirst: 'Please read the content first before taking the quiz.',
  },
  hi: {
    markRead: 'Padh Liya (+20 XP)',
    alreadyRead: 'Content Padh Liya ✓',
    practiceCode: 'Code Practice Karo →',
    takeQuiz: 'Quiz Do 🎯',
    quizLockedBtn: '🔒 Quiz Locked',
    quizLocked: 'Pehle content padho, phir quiz do',
    runBtn: 'Code Chalao', running: 'Chal raha hai...',
    ctrlEnter: 'Ctrl+Enter se bhi chala sakte ho',
    aiHint: 'AI Hint (-5 XP)', gettingHint: 'Hint aa rahi hai...',
    explainCode: 'Mera Code Samjhao', explaining: 'Samjha raha hai...',
    output: 'Output', success: '✓ Sahi Hai', error: '✗ Error',
    aiHintLabel: 'AI Hint', explanationLabel: 'Code Explanation',
    quizTitle: 'Section Quiz',
    quizDesc: (n) => `${n} sawaal · 70%+ score karo pass hone ke liye`,
    quizXp: 'Pass karo toh +30 XP milega aur agla section khulega!',
    startQuiz: 'Quiz Shuru Karo →', retakeQuiz: 'Dobara Try Karo',
    nextSection: 'Agla Section →',
    completed: 'Ho Gaya', reset: 'Reset',
    runningCode: 'Code chal raha hai...',
    yourTask: 'Tumhara Task:',
    quizPassed: 'Quiz Pass! 🎉',
    quizFailed: 'Abhi aur mehnat chahiye!',
    quizFailedMsg: 'Wapas jao aur content dhyan se padho, phir dobara try karo.',
    goBackRead: '← Content Dobara Padho',
    readFirst: 'Quiz lene se pehle please content padho.',
  },
};

// ─── Skulpt ─────────────────────────────────────────────────────
let skulptLoaded = false, skulptLoading = false, skulptCallbacks = [];
function loadSkulptScripts() {
  return new Promise((resolve, reject) => {
    if (skulptLoaded) { resolve(); return; }
    if (skulptLoading) { skulptCallbacks.push({ resolve, reject }); return; }
    skulptLoading = true;
    const loadScript = (src) => new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res;
      s.onerror = () => rej(new Error(`Failed: ${src}`));
      document.head.appendChild(s);
    });
    loadScript('https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js')
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js'))
      .then(() => {
        skulptLoaded = true; skulptLoading = false; resolve();
        skulptCallbacks.forEach(cb => cb.resolve()); skulptCallbacks = [];
      })
      .catch((err) => {
        skulptLoading = false; reject(err);
        skulptCallbacks.forEach(cb => cb.reject(err)); skulptCallbacks = [];
      });
  });
}
function runPythonWithSkulpt(code) {
  return new Promise(async (resolve) => {
    try {
      await loadSkulptScripts();
      let out = [];
      window.Sk.configure({
        output: (t) => out.push(t),
        read: (x) => {
          if (window.Sk.builtinFiles?.files[x]) return window.Sk.builtinFiles.files[x];
          throw new Error(`File not found: '${x}'`);
        },
        inputfun: (p) => window.prompt(p || 'Input: ') || '',
        inputfunTakesPrompt: true, execLimit: 10000,
        killableWhile: true, killableFor: true,
      });
      window.Sk.misceval.asyncToPromise(() =>
        window.Sk.importMainWithBody('<stdin>', false, code, true)
      ).then(() => {
        resolve({ output: out.join('') || '(No output)', isError: false });
      }).catch((err) => {
        let msg = err.toString().replace(/skulpt/gi, 'Python').replace(/on line (\d+) of <stdin>/g, '(line $1)');
        resolve({ output: msg, isError: true });
      });
    } catch (err) {
      resolve({ output: `Error: ${err.message}`, isError: true });
    }
  });
}

// ─── Markdown renderer ──────────────────────────────────────────
function CodeBlock({ code }) {
  return (
    <pre className="bg-[#0d1117] border border-white/5 rounded-xl p-4 overflow-x-auto text-sm font-mono leading-relaxed">
      <code className="text-gray-300">{code}</code>
    </pre>
  );
}
function ContentRenderer({ markdown }) {
  const parts = markdown.split('\n');
  const elements = [];
  let i = 0;
  while (i < parts.length) {
    const line = parts[i];
    if (line.startsWith('## '))       { elements.push(<h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>); }
    else if (line.startsWith('### ')) { elements.push(<h3 key={i} className="text-base font-semibold text-gray-200 mt-4 mb-2">{line.slice(4)}</h3>); }
    else if (line.startsWith('```'))  {
      let codeLines = []; i++;
      while (i < parts.length && !parts[i].startsWith('```')) { codeLines.push(parts[i]); i++; }
      elements.push(<CodeBlock key={i} code={codeLines.join('\n')} />);
    }
    else if (line.startsWith('| ')) {
      let rows = [];
      while (i < parts.length && parts[i].startsWith('|')) { if (!parts[i].includes('---')) rows.push(parts[i]); i++; }
      elements.push(
        <div key={i} className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            {rows.map((row, ri) => {
              const cells = row.split('|').filter(c => c.trim());
              return <tr key={ri} className={ri === 0 ? 'bg-white/5 font-medium text-gray-200' : 'border-t border-white/5 text-gray-400'}>
                {cells.map((cell, ci) => <td key={ci} className="px-3 py-2">{cell.trim()}</td>)}
              </tr>;
            })}
          </table>
        </div>
      );
      continue;
    }
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(<li key={i} className="text-gray-400 ml-4 mb-1 list-disc"
        dangerouslySetInnerHTML={{ __html: line.slice(2)
          .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-violet-300 px-1 rounded text-xs font-mono">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>') }} />);
    }
    else if (line.trim() === '') { elements.push(<div key={i} className="h-2" />); }
    else {
      const html = line
        .replace(/`([^`]+)`/g, `<code class="bg-white/10 text-violet-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>`)
        .replace(/\*\*([^*]+)\*\*/g, `<strong class="text-white font-semibold">$1</strong>`);
      elements.push(<p key={i} className="text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />);
    }
    i++;
  }
  return <div className="space-y-1">{elements}</div>;
}

// ─── XP Toast ───────────────────────────────────────────────────
function XPToast({ xp, message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed top-20 right-4 z-50 bg-violet-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
      <Zap size={18} className="text-yellow-300" />
      <div><div className="font-bold">+{xp} XP!</div><div className="text-xs text-violet-200">{message}</div></div>
      <button onClick={onClose} className="ml-2 text-violet-300 hover:text-white"><X size={14} /></button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
// Props: isContentRead, isQuizPassed come from CoursePage (single source of truth)
// onComplete, onQuizSubmit callbacks update CoursePage's progress state directly
export default function SectionViewer({
  language,
  lang = 'en',
  courseInfo,
  weekNumber,
  section,
  isContentRead = false,   // From CoursePage — based on live progress
  isQuizPassed  = false,   // From CoursePage — based on live progress (quizScore >= 70)
  onComplete,              // Calls backend + refreshes progress in CoursePage
  onQuizSubmit,            // Calls backend + refreshes progress in CoursePage
  onNext,
  onGetHint,
  onGetExplanation,
}) {
  const t = UI_TEXT[lang] || UI_TEXT.en;

  const [activeTab, setActiveTab] = useState('learn');
  const [userCode, setUserCode] = useState(section.codeExample || '');
  const [output, setOutput] = useState('');
  const [outputIsError, setOutputIsError] = useState(false);
  const [running, setRunning] = useState(false);
  const [hint, setHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [xpToast, setXpToast] = useState(null);

  // Reset UI when section changes
  useEffect(() => {
    setUserCode(section.codeExample || '');
    setOutput(''); setOutputIsError(false);
    setHint(''); setExplanation('');
    setActiveTab('learn');
    setQuizResult(null);
    setShowQuizModal(false);
  }, [section.id]);

  // Preload Skulpt when Code tab opens
  useEffect(() => {
    if (activeTab === 'code' && language === 'python') loadSkulptScripts().catch(() => {});
  }, [activeTab, language]);

  // ── Handlers ─────────────────────────────────────────────────
  const handleMarkRead = async () => {
    if (isContentRead) return;
    const result = await onComplete(weekNumber, section.sectionNumber || 1, section.id);
    // isContentRead will update via props from CoursePage after progress refresh
    if (result?.xpEarned > 0) {
      setXpToast({ xp: result.xpEarned, message: lang === 'hi' ? 'Section padh liya!' : 'Section read!' });
    }
  };

  const handleQuizTabClick = () => {
    if (!isContentRead) { setActiveTab('learn'); return; }
    setActiveTab('quiz');
  };

  const handleQuizComplete = async (score, total) => {
    setShowQuizModal(false);
    const result = await onQuizSubmit(weekNumber, section.sectionNumber || 1, section.id, score, total);
    setQuizResult(result);
    // isQuizPassed will update via props from CoursePage after progress refresh
    if (result?.passed && result.xpEarned > 0) {
      setXpToast({ xp: result.xpEarned, message: result.message });
    }
    return result;
  };

  const handleRunCode = useCallback(async () => {
    if (running) return;
    setRunning(true); setOutput(t.running); setOutputIsError(false);
    if (language === 'python') {
      const r = await runPythonWithSkulpt(userCode);
      setOutput(r.output); setOutputIsError(r.isError);
    } else if (language === 'html' || language === 'css') {
      setOutput('HTML/CSS: Copy your code and paste at codepen.io for live preview!');
    } else {
      setOutput(`${language.toUpperCase()}: Coming soon!\n• JS: Use browser console (F12)\n• C/C++: Try onlinegdb.com`);
    }
    setRunning(false);
  }, [language, userCode, running, t]);

  const handleGetHint = async () => {
    setLoadingHint(true);
    const r = await onGetHint(section.id, userCode, section.task?.description);
    setHint(r.hint); setLoadingHint(false);
  };

  const handleExplainCode = async () => {
    setLoadingExplain(true);
    const r = await onGetExplanation(userCode, null);
    setExplanation(r.explanation); setLoadingExplain(false);
  };

  const displayContent = lang === 'en' && section.content_en ? section.content_en : section.content;
  const displayTitle   = lang === 'en' && section.title_en   ? section.title_en   : section.title;
  const displayTask    = lang === 'en' && section.task?.description_en ? section.task.description_en : section.task?.description;

  const tabs = [
    { id: 'learn', label: lang === 'hi' ? '📖 Padho' : '📖 Learn', onClick: () => setActiveTab('learn') },
    { id: 'code',  label: '💻 Code',  onClick: () => setActiveTab('code') },
    { id: 'quiz',  label: isContentRead ? '🎯 Quiz' : '🔒 Quiz', onClick: handleQuizTabClick, locked: !isContentRead },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-gray-600 mb-1">Week {weekNumber} · Section {section.id?.split('-s')[1]}</div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{section.emoji}</span>{displayTitle}
            </h1>
          </div>
          {isQuizPassed && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-sm shrink-0">
              <CheckCircle size={14} />{t.completed}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-white/[0.03] border border-white/5 rounded-xl p-1 w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={tab.onClick}
              title={tab.locked ? t.quizLocked : undefined}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.id ? `bg-gradient-to-r ${courseInfo?.color} text-white shadow-sm`
                  : tab.locked ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-300 cursor-pointer'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'learn' && !isContentRead && (
          <p className="text-xs text-amber-500/70 mt-2">
            💡 {lang === 'hi' ? 'Pehle content padho aur "Padh Liya" click karo, phir Quiz unlock hoga' : 'Read the content and click "Mark as Read" to unlock the Quiz'}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* LEARN TAB */}
        {activeTab === 'learn' && (
          <div className="max-w-3xl">
            <ContentRenderer markdown={displayContent} />
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3 flex-wrap">
              {!isContentRead ? (
                <button onClick={handleMarkRead}
                  className={`px-6 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all flex items-center gap-2`}>
                  <CheckCircle size={16} />{t.markRead}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
                  <CheckCircle size={15} />{t.alreadyRead}
                </div>
              )}
              {isContentRead ? (
                <button onClick={() => setActiveTab('quiz')}
                  className="px-6 py-3 rounded-xl border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 font-medium transition-all flex items-center gap-2">
                  🎯 {t.takeQuiz}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-gray-600 text-sm px-4 py-2 rounded-xl border border-white/5 cursor-not-allowed">
                  <Lock size={14} />{t.quizLockedBtn}
                </div>
              )}
              {isContentRead && (
                <button onClick={() => setActiveTab('code')}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-all">
                  {t.practiceCode}
                </button>
              )}
            </div>
          </div>
        )}

        {/* CODE TAB */}
        {activeTab === 'code' && (
          <div className="max-w-4xl">
            {section.task && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-4">
                <div className="text-xs text-blue-400 font-medium mb-1">{t.yourTask}</div>
                <p className="text-gray-300 text-sm leading-relaxed">{displayTask}</p>
              </div>
            )}
            <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="text-xs text-gray-600 ml-2 font-mono">main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}</span>
                </div>
                <button onClick={() => { setUserCode(section.codeExample || ''); setOutput(''); }}
                  className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1 transition-colors">
                  <RotateCcw size={11} />{t.reset}
                </button>
              </div>
              <textarea value={userCode} onChange={e => setUserCode(e.target.value)}
                className="w-full bg-transparent text-gray-200 font-mono text-sm p-4 outline-none resize-none min-h-[280px] leading-relaxed"
                placeholder={`# Write your ${language} code here...`} spellCheck={false}
                onKeyDown={e => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const s = e.target.selectionStart, end = e.target.selectionEnd;
                    const nc = userCode.substring(0, s) + '    ' + userCode.substring(end);
                    setUserCode(nc);
                    setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 4; }, 0);
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRunCode(); }
                }} />
            </div>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <button onClick={handleRunCode} disabled={running}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50`}>
                {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                {running ? t.running : t.runBtn}
              </button>
              <span className="text-xs text-gray-700 hidden sm:block">{t.ctrlEnter}</span>
              <button onClick={handleGetHint} disabled={loadingHint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/10 transition-all disabled:opacity-50">
                <Lightbulb size={14} />{loadingHint ? t.gettingHint : t.aiHint}
              </button>
              <button onClick={handleExplainCode} disabled={loadingExplain || !userCode.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-500/30 text-blue-400 text-sm hover:bg-blue-500/10 transition-all disabled:opacity-50">
                <Bot size={14} />{loadingExplain ? t.explaining : t.explainCode}
              </button>
            </div>
            {output && output !== t.running && (
              <div className="mt-4 bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-mono">{t.output}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${outputIsError ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>
                    {outputIsError ? t.error : t.success}
                  </span>
                </div>
                <pre className={`p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed ${outputIsError ? 'text-red-400' : 'text-green-300'}`}>{output}</pre>
              </div>
            )}
            {output === t.running && (
              <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 size={14} className="animate-spin" />{t.runningCode}
              </div>
            )}
            {hint && (
              <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-2"><Lightbulb size={13} />{t.aiHintLabel}</div>
                <p className="text-gray-300 text-sm leading-relaxed">{hint}</p>
              </div>
            )}
            {explanation && (
              <div className="mt-4 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-medium mb-2"><Bot size={13} />{t.explanationLabel}</div>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="max-w-2xl">

            {/* Locked */}
            {!isContentRead && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-white mb-2">{lang === 'hi' ? 'Quiz Locked Hai' : 'Quiz is Locked'}</h3>
                <p className="text-gray-400 mb-6">{t.readFirst}</p>
                <button onClick={() => setActiveTab('learn')}
                  className={`px-8 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all`}>
                  {lang === 'hi' ? '← Content Padho' : '← Read Content'}
                </button>
              </div>
            )}

            {/* Failed */}
            {isContentRead && quizResult && !quizResult.passed && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">😅</div>
                <h3 className="text-xl font-bold text-white mb-2">{t.quizFailed}</h3>
                <div className="text-3xl font-bold text-red-400 mb-2">{quizResult.percentScore}%</div>
                <p className="text-gray-400 mb-6 text-sm">{t.quizFailedMsg}</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button onClick={() => setActiveTab('learn')}
                    className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 font-medium transition-all">
                    {t.goBackRead}
                  </button>
                  <button onClick={() => setShowQuizModal(true)}
                    className={`px-6 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all`}>
                    {t.retakeQuiz}
                  </button>
                </div>
              </div>
            )}

            {/* Passed */}
            {isContentRead && isQuizPassed && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">{t.quizPassed}</h3>
                {quizResult && <div className="text-3xl font-bold text-green-400 mb-2">{quizResult.percentScore}%</div>}
                <p className="text-green-400/70 text-sm mb-8">{lang === 'hi' ? 'Agla section unlock ho gaya!' : 'Next section unlocked!'}</p>
                <button onClick={onNext}
                  className={`px-8 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2 mx-auto`}>
                  {t.nextSection}<ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Ready to take */}
            {isContentRead && !isQuizPassed && !quizResult && (
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">{t.quizTitle}</h3>
                <p className="text-gray-500 mb-2">{t.quizDesc(section.quiz?.length || 3)}</p>
                <p className="text-sm text-violet-400 mb-6">{t.quizXp}</p>
                <button onClick={() => setShowQuizModal(true)}
                  className={`px-8 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all`}>
                  {t.startQuiz}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showQuizModal && (
        <QuizModal questions={section.quiz || []} sectionTitle={displayTitle}
          courseInfo={courseInfo} onComplete={handleQuizComplete}
          onClose={() => setShowQuizModal(false)} lang={lang} />
      )}
      {xpToast && <XPToast xp={xpToast.xp} message={xpToast.message} onClose={() => setXpToast(null)} />}
    </div>
  );
}