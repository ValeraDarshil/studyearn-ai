/**
 * StudyEarn AI — SectionViewer Component
 * Pyodide integration — Python runs directly in browser!
 * No API key needed, unlimited runs, zero cost.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { CheckCircle, Lightbulb, Play, RotateCcw, ChevronRight, X, Zap, Bot, Loader2 } from 'lucide-react';
import { useCodeLearn } from '../../hooks/useCodeLearn.js';
import QuizModal from './QuizModal.jsx';

// ─── Pyodide Singleton ─────────────────────────────────────────
// Ek baar load karo, baar baar use karo — page pe sirf ek instance
let pyodideInstance = null;
let pyodideLoading = false;
let pyodideLoadCallbacks = [];

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;

  if (pyodideLoading) {
    return new Promise((resolve) => {
      pyodideLoadCallbacks.push(resolve);
    });
  }

  pyodideLoading = true;

  // CDN se Pyodide script load karo (sirf ek baar)
  if (!window.loadPyodide) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  pyodideInstance = await window.loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
  });

  pyodideLoading = false;
  pyodideLoadCallbacks.forEach(cb => cb(pyodideInstance));
  pyodideLoadCallbacks = [];
  return pyodideInstance;
}

// ─── Python Code Run Karo in Browser ──────────────────────────
async function runPythonCode(code) {
  const pyodide = await getPyodide();

  // stdout aur stderr capture karo
  const wrappedCode = `
import sys
import io
import traceback

_out_buf = io.StringIO()
_err_buf = io.StringIO()
sys.stdout = _out_buf
sys.stderr = _err_buf

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except SystemExit:
    pass
except Exception as _e:
    print(traceback.format_exc(), file=sys.stderr)
finally:
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__

_final_out = _out_buf.getvalue()
_final_err = _err_buf.getvalue()
`;

  pyodide.runPython(wrappedCode);
  const stdout = pyodide.globals.get('_final_out') || '';
  const stderr = pyodide.globals.get('_final_err') || '';

  return {
    output: stdout || stderr || '(No output)',
    isError: !!stderr && !stdout,
  };
}

// ─── Simple Code Block ─────────────────────────────────────────
function CodeBlock({ code }) {
  return (
    <pre className="bg-[#0d1117] border border-white/5 rounded-xl p-4 overflow-x-auto text-sm font-mono leading-relaxed">
      <code className="text-gray-300">{code}</code>
    </pre>
  );
}

// ─── Markdown Renderer ─────────────────────────────────────────
function ContentRenderer({ markdown }) {
  const parts = markdown.split('\n');
  const elements = [];
  let i = 0;

  while (i < parts.length) {
    const line = parts[i];

    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-base font-semibold text-gray-200 mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      let codeLines = [];
      i++;
      while (i < parts.length && !parts[i].startsWith('```')) {
        codeLines.push(parts[i]);
        i++;
      }
      elements.push(<CodeBlock key={i} code={codeLines.join('\n')} />);
    } else if (line.startsWith('| ')) {
      let rows = [];
      while (i < parts.length && parts[i].startsWith('|')) {
        if (!parts[i].includes('---')) rows.push(parts[i]);
        i++;
      }
      elements.push(
        <div key={i} className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            {rows.map((row, ri) => {
              const cells = row.split('|').filter(c => c.trim());
              return (
                <tr key={ri} className={ri === 0 ? 'bg-white/5 font-medium text-gray-200' : 'border-t border-white/5 text-gray-400'}>
                  {cells.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2">{cell.trim()}</td>
                  ))}
                </tr>
              );
            })}
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="text-gray-400 ml-4 mb-1 list-disc"
          dangerouslySetInnerHTML={{ __html: line.slice(2)
            .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-violet-300 px-1 rounded text-xs font-mono">$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
          }}
        />
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      const html = line
        .replace(/`([^`]+)`/g, `<code class="bg-white/10 text-violet-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>`)
        .replace(/\*\*([^*]+)\*\*/g, `<strong class="text-white font-semibold">$1</strong>`);
      elements.push(
        <p key={i} className="text-gray-400 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}

// ─── XP Toast ──────────────────────────────────────────────────
function XPToast({ xp, message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50 bg-violet-600 text-white px-4 py-3 rounded-xl shadow-lg shadow-violet-500/30 flex items-center gap-3">
      <Zap size={18} className="text-yellow-300" />
      <div>
        <div className="font-bold">+{xp} XP Earned!</div>
        <div className="text-xs text-violet-200">{message}</div>
      </div>
      <button onClick={onClose} className="ml-2 text-violet-300 hover:text-white"><X size={14} /></button>
    </div>
  );
}

// ─── Pyodide Status Badge ──────────────────────────────────────
function PyodideStatus({ status }) {
  if (status === 'ready' || status === 'idle') return null;
  return (
    <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg
      ${status === 'loading'
        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
        : 'bg-red-500/10 border border-red-500/20 text-red-400'
      }`}>
      {status === 'loading' && <Loader2 size={11} className="animate-spin" />}
      {status === 'loading' ? 'Loading Python...' : 'Python load failed — reload karo'}
    </div>
  );
}

// ─── Main SectionViewer ────────────────────────────────────────
export default function SectionViewer({ language, courseInfo, weekNumber, section, isCompleted, onComplete, onNext }) {
  const [activeTab, setActiveTab] = useState('learn');
  const [userCode, setUserCode] = useState(section.codeExample || '');
  const [output, setOutput] = useState('');
  const [outputIsError, setOutputIsError] = useState(false);
  const [running, setRunning] = useState(false);
  const [hint, setHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [xpToast, setXpToast] = useState(null);
  const [sectionDone, setSectionDone] = useState(isCompleted);
  const [pyodideStatus, setPyodideStatus] = useState('idle');
  const [runCount, setRunCount] = useState(0);

  const { getHint, getExplanation, submitQuiz } = useCodeLearn(language);

  // Reset when section changes
  useEffect(() => {
    setUserCode(section.codeExample || '');
    setOutput('');
    setOutputIsError(false);
    setHint('');
    setExplanation('');
    setActiveTab('learn');
    setSectionDone(isCompleted);
    setRunCount(0);
  }, [section.id]);

  // Preload Pyodide when Code tab opens (Python only)
  useEffect(() => {
    if (activeTab === 'code' && language === 'python' && pyodideStatus === 'idle') {
      setPyodideStatus('loading');
      getPyodide()
        .then(() => setPyodideStatus('ready'))
        .catch(() => setPyodideStatus('error'));
    }
  }, [activeTab, language, pyodideStatus]);

  const handleMarkRead = async () => {
    if (sectionDone) return;
    const result = await onComplete(weekNumber, section.sectionNumber || 1, section.id);
    if (result?.xpEarned > 0) {
      setXpToast({ xp: result.xpEarned, message: 'Section completed!' });
    }
    setSectionDone(true);
  };

  // ── Run Code Handler ───────────────────────────────────────
  const handleRunCode = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setOutput('');
    setOutputIsError(false);

    try {
      if (language === 'python') {
        if (pyodideStatus === 'loading') {
          setOutput('Python abhi load ho raha hai... thoda wait karo phir try karo!');
          setRunning(false);
          return;
        }
        if (pyodideStatus === 'error') {
          setOutput('Python load nahi hua. Page reload karo aur dobara try karo.');
          setOutputIsError(true);
          setRunning(false);
          return;
        }

        setOutput('Running...');
        const result = await runPythonCode(userCode);
        setOutput(result.output);
        setOutputIsError(result.isError);

        // First successful run pe XP bonus
        if (!result.isError && runCount === 0) {
          setXpToast({ xp: 5, message: 'Code run kiya! Keep going!' });
        }
        setRunCount(prev => prev + 1);

      } else if (language === 'html' || language === 'css') {
        setOutput('HTML/CSS live preview:\nApna code copy karo aur codepen.io pe paste karo preview dekhne ke liye!');

      } else {
        setOutput(`${language.toUpperCase()} execution coming soon!\n\nAbhi ke liye:\n• JavaScript: Browser console (F12) mein run karo\n• C/C++: onlinegdb.com pe try karo`);
      }
    } catch (err) {
      setOutput(`Error: ${err.message || 'Code run nahi hua. Syntax check karo!'}`);
      setOutputIsError(true);
    } finally {
      setRunning(false);
    }
  }, [language, userCode, pyodideStatus, running, runCount]);

  const handleGetHint = async () => {
    setLoadingHint(true);
    const result = await getHint(section.id, userCode, section.task?.description);
    setHint(result.hint);
    setLoadingHint(false);
  };

  const handleExplainCode = async () => {
    setLoadingExplain(true);
    const result = await getExplanation(userCode, null);
    setExplanation(result.explanation);
    setLoadingExplain(false);
  };

  const handleQuizComplete = async (score, total) => {
    setShowQuiz(false);
    const result = await submitQuiz(weekNumber, section.sectionNumber || 1, section.id, score, total);
    if (result?.xpEarned > 0) {
      setXpToast({ xp: result.xpEarned, message: result.message });
    }
    if (result?.passed) setSectionDone(true);
    return result;
  };

  const tabs = [
    { id: 'learn', label: '📖 Learn' },
    { id: 'code',  label: '💻 Code'  },
    { id: 'quiz',  label: '🎯 Quiz'  },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-gray-600 mb-1">Week {weekNumber} · Section {section.id?.split('-s')[1]}</div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{section.emoji}</span>
              {section.title}
            </h1>
          </div>
          {sectionDone && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-sm shrink-0">
              <CheckCircle size={14} />
              Completed
            </div>
          )}
        </div>

        <div className="flex gap-1 mt-4 bg-white/[0.03] border border-white/5 rounded-xl p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? `bg-gradient-to-r ${courseInfo?.color} text-white shadow-sm`
                  : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* LEARN */}
        {activeTab === 'learn' && (
          <div className="max-w-3xl">
            <ContentRenderer markdown={section.content} />
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4 flex-wrap">
              {!sectionDone ? (
                <button onClick={handleMarkRead}
                  className={`px-6 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all flex items-center gap-2`}>
                  <CheckCircle size={16} />
                  Mark as Read (+20 XP)
                </button>
              ) : (
                <button onClick={() => setActiveTab('code')}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 font-medium transition-all">
                  Practice Code →
                </button>
              )}
              <button onClick={() => setShowQuiz(true)}
                className="px-6 py-3 rounded-xl border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 font-medium transition-all">
                Take Quiz 🎯
              </button>
            </div>
          </div>
        )}

        {/* CODE */}
        {activeTab === 'code' && (
          <div className="max-w-4xl">
            {section.task && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-4">
                <div className="text-xs text-blue-400 font-medium mb-1">🎯 Your Task:</div>
                <p className="text-gray-300 text-sm leading-relaxed">{section.task.description}</p>
              </div>
            )}

            <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="text-xs text-gray-600 ml-2 font-mono">
                    main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {language === 'python' && <PyodideStatus status={pyodideStatus} />}
                  <button
                    onClick={() => { setUserCode(section.codeExample || ''); setOutput(''); }}
                    className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1 transition-colors">
                    <RotateCcw size={11} /> Reset
                  </button>
                </div>
              </div>

              <textarea
                value={userCode}
                onChange={e => setUserCode(e.target.value)}
                className="w-full bg-transparent text-gray-200 font-mono text-sm p-4 outline-none resize-none min-h-[280px] leading-relaxed"
                placeholder={`# Write your ${language} code here...`}
                spellCheck={false}
                onKeyDown={e => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = e.target.selectionStart;
                    const end = e.target.selectionEnd;
                    const newCode = userCode.substring(0, start) + '    ' + userCode.substring(end);
                    setUserCode(newCode);
                    setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 4; }, 0);
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    handleRunCode();
                  }
                }}
              />
            </div>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <button
                onClick={handleRunCode}
                disabled={running || (language === 'python' && pyodideStatus === 'loading')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50`}>
                {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                {running ? 'Running...' : pyodideStatus === 'loading' ? 'Loading Python...' : 'Run Code'}
              </button>

              <span className="text-xs text-gray-700 hidden sm:block">Ctrl+Enter to run</span>

              <button onClick={handleGetHint} disabled={loadingHint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/10 transition-all disabled:opacity-50">
                <Lightbulb size={14} />
                {loadingHint ? 'Getting hint...' : 'AI Hint (-5 XP)'}
              </button>

              <button onClick={handleExplainCode} disabled={loadingExplain || !userCode.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-500/30 text-blue-400 text-sm hover:bg-blue-500/10 transition-all disabled:opacity-50">
                <Bot size={14} />
                {loadingExplain ? 'Explaining...' : 'Explain My Code'}
              </button>
            </div>

            {output && (
              <div className="mt-4 bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-mono">Output</span>
                  {output !== 'Running...' && (
                    <span className={`text-xs px-2 py-0.5 rounded ${outputIsError ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>
                      {outputIsError ? 'Error' : '✓ Success'}
                    </span>
                  )}
                </div>
                <pre className={`p-4 text-sm font-mono whitespace-pre-wrap ${outputIsError ? 'text-red-400' : 'text-gray-300'}`}>
                  {output}
                </pre>
              </div>
            )}

            {hint && (
              <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-2">
                  <Lightbulb size={13} /> AI Hint
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{hint}</p>
              </div>
            )}

            {explanation && (
              <div className="mt-4 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-medium mb-2">
                  <Bot size={13} /> Code Explanation
                </div>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* QUIZ */}
        {activeTab === 'quiz' && (
          <div className="max-w-2xl">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Section Quiz</h3>
              <p className="text-gray-500 mb-2">{section.quiz?.length || 3} questions · 70% se zyada score karo to pass</p>
              <p className="text-sm text-violet-400 mb-6">Pass karo to +30 XP milega aur next section unlock hoga!</p>
              <button onClick={() => setShowQuiz(true)}
                className={`px-8 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all`}>
                Start Quiz →
              </button>
              {sectionDone && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <button onClick={onNext} className="flex items-center gap-2 mx-auto text-gray-400 hover:text-white transition-colors">
                    Next Section <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showQuiz && (
        <QuizModal
          questions={section.quiz || []}
          sectionTitle={section.title}
          courseInfo={courseInfo}
          onComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {xpToast && (
        <XPToast xp={xpToast.xp} message={xpToast.message} onClose={() => setXpToast(null)} />
      )}
    </div>
  );
}