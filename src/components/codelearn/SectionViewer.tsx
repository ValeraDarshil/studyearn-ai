// /**
//  * StudyEarn AI — SectionViewer Component
//  * FIXED: No separate useCodeLearn hook — state comes from CoursePage
//  * Flow: Read → Mark as Read → Quiz → 70%+ Pass → Next Section unlocks
//  */
// import { useState, useEffect, useCallback } from 'react';
// import { CheckCircle, Lightbulb, Play, RotateCcw, ChevronRight, X, Zap, Bot, Loader2, Lock } from 'lucide-react';
// import QuizModal from './QuizModal.jsx';

// // ─── UI Text ────────────────────────────────────────────────────
// const UI_TEXT = {
//   en: {
//     markRead: 'Mark as Read (+20 XP)',
//     alreadyRead: 'Content Read ✓',
//     practiceCode: 'Practice Code →',
//     takeQuiz: 'Take Quiz 🎯',
//     quizLockedBtn: '🔒 Quiz Locked',
//     quizLocked: 'Read the content first, then take the quiz',
//     runBtn: 'Run Code', running: 'Running...',
//     ctrlEnter: 'Ctrl+Enter to run',
//     aiHint: 'AI Hint (-5 XP)', gettingHint: 'Getting hint...',
//     explainCode: 'Explain My Code', explaining: 'Explaining...',
//     output: 'Output', success: '✓ Success', error: '✗ Error',
//     aiHintLabel: 'AI Hint', explanationLabel: 'Code Explanation',
//     quizTitle: 'Section Quiz',
//     quizDesc: (n) => `${n} questions · Score 70%+ to pass`,
//     quizXp: 'Pass to earn +30 XP and unlock the next section!',
//     startQuiz: 'Start Quiz →', retakeQuiz: 'Try Again',
//     nextSection: 'Next Section →',
//     completed: 'Completed', reset: 'Reset',
//     runningCode: 'Running your code...',
//     yourTask: 'Your Task:',
//     quizPassed: 'Quiz Passed! 🎉',
//     quizFailed: 'Not quite there yet!',
//     quizFailedMsg: 'Go back and re-read the content carefully, then try again.',
//     goBackRead: '← Re-read Content',
//     readFirst: 'Please read the content first before taking the quiz.',
//   },
//   hi: {
//     markRead: 'Padh Liya (+20 XP)',
//     alreadyRead: 'Content Padh Liya ✓',
//     practiceCode: 'Code Practice Karo →',
//     takeQuiz: 'Quiz Do 🎯',
//     quizLockedBtn: '🔒 Quiz Locked',
//     quizLocked: 'Pehle content padho, phir quiz do',
//     runBtn: 'Code Chalao', running: 'Chal raha hai...',
//     ctrlEnter: 'Ctrl+Enter se bhi chala sakte ho',
//     aiHint: 'AI Hint (-5 XP)', gettingHint: 'Hint aa rahi hai...',
//     explainCode: 'Mera Code Samjhao', explaining: 'Samjha raha hai...',
//     output: 'Output', success: '✓ Sahi Hai', error: '✗ Error',
//     aiHintLabel: 'AI Hint', explanationLabel: 'Code Explanation',
//     quizTitle: 'Section Quiz',
//     quizDesc: (n) => `${n} sawaal · 70%+ score karo pass hone ke liye`,
//     quizXp: 'Pass karo toh +30 XP milega aur agla section khulega!',
//     startQuiz: 'Quiz Shuru Karo →', retakeQuiz: 'Dobara Try Karo',
//     nextSection: 'Agla Section →',
//     completed: 'Ho Gaya', reset: 'Reset',
//     runningCode: 'Code chal raha hai...',
//     yourTask: 'Tumhara Task:',
//     quizPassed: 'Quiz Pass! 🎉',
//     quizFailed: 'Abhi aur mehnat chahiye!',
//     quizFailedMsg: 'Wapas jao aur content dhyan se padho, phir dobara try karo.',
//     goBackRead: '← Content Dobara Padho',
//     readFirst: 'Quiz lene se pehle please content padho.',
//   },
// };

// // ─── C/C++ Runner — backend /run-code (public, no login needed) ──
// async function runCWithBackend(code, language) {
//   // Smart stdin: auto-detect what scanf needs
//   function makeStdin(src) {
//     const n = (src.match(/scanf\s*\(/g) || []).length + (src.match(/fgets\s*\(/g) || []).length;
//     if (!n) return '';
//     if (src.includes('1234') && src.includes('pin')) return '1234\n5000\n';
//     if (src.includes('choice') && src.includes('scanf')) return '1\n10\n5\n0\n';
//     if (src.includes('secret') && src.includes('guess')) return '42\n';
//     const vals = [];
//     const re = /scanf\s*\(\s*["'](.*?)["\']/g;
//     let m;
//     while ((m = re.exec(src)) !== null) {
//       const f = m[1];
//       if (f.includes('%d')||f.includes('%i')) vals.push('10');
//       else if (f.includes('%f')||f.includes('%lf')) vals.push('3.14');
//       else if (f.includes('%c')) vals.push('A');
//       else if (f.includes('%s')) vals.push('Rahul');
//       else vals.push('5');
//     }
//     for (let i = 0; i < (src.match(/fgets\s*\(/g)||[]).length; i++) vals.push('Rahul Sharma');
//     return vals.slice(0,12).join('\n') + '\n';
//   }

//   const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
//     ? 'http://localhost:5000'
//     : 'https://studyearn-backend.onrender.com';

//   try {
//     const resp = await fetch(`${API}/api/codelearn/run-code`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       // No credentials — public endpoint, no auth needed
//       body: JSON.stringify({ language, code, stdin: makeStdin(code) }),
//     });
//     if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
//     const data = await resp.json();
//     const out = data.output || '(No output)';
//     return { output: out, isError: out.startsWith('Compile Error') || out.startsWith('❌') };
//   } catch (err) {
//     return { output: '⚠️ Compiler unavailable. Try onlinegdb.com', isError: true };
//   }
// }

// // ─── Skulpt ─────────────────────────────────────────────────────
// let skulptLoaded = false, skulptLoading = false, skulptCallbacks = [];
// function loadSkulptScripts() {
//   return new Promise((resolve, reject) => {
//     if (skulptLoaded) { resolve(); return; }
//     if (skulptLoading) { skulptCallbacks.push({ resolve, reject }); return; }
//     skulptLoading = true;
//     const loadScript = (src) => new Promise((res, rej) => {
//       const s = document.createElement('script');
//       s.src = src; s.onload = res;
//       s.onerror = () => rej(new Error(`Failed: ${src}`));
//       document.head.appendChild(s);
//     });
//     loadScript('https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js')
//       .then(() => loadScript('https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js'))
//       .then(() => {
//         skulptLoaded = true; skulptLoading = false; resolve();
//         skulptCallbacks.forEach(cb => cb.resolve()); skulptCallbacks = [];
//       })
//       .catch((err) => {
//         skulptLoading = false; reject(err);
//         skulptCallbacks.forEach(cb => cb.reject(err)); skulptCallbacks = [];
//       });
//   });
// }
// function runPythonWithSkulpt(code) {
//   return new Promise(async (resolve) => {
//     try {
//       await loadSkulptScripts();
//       let out = [];
//       window.Sk.configure({
//         output: (t) => out.push(t),
//         read: (x) => {
//           if (window.Sk.builtinFiles?.files[x]) return window.Sk.builtinFiles.files[x];
//           throw new Error(`File not found: '${x}'`);
//         },
//         inputfun: (p) => window.prompt(p || 'Input: ') || '',
//         inputfunTakesPrompt: true, execLimit: 10000,
//         killableWhile: true, killableFor: true,
//       });
//       window.Sk.misceval.asyncToPromise(() =>
//         window.Sk.importMainWithBody('<stdin>', false, code, true)
//       ).then(() => {
//         resolve({ output: out.join('') || '(No output)', isError: false });
//       }).catch((err) => {
//         let msg = err.toString().replace(/skulpt/gi, 'Python').replace(/on line (\d+) of <stdin>/g, '(line $1)');
//         resolve({ output: msg, isError: true });
//       });
//     } catch (err) {
//       resolve({ output: `Error: ${err.message}`, isError: true });
//     }
//   });
// }

// // ─── Markdown renderer ──────────────────────────────────────────
// function CodeBlock({ code }) {
//   return (
//     <pre className="bg-[#0d1117] border border-white/5 rounded-xl p-4 overflow-x-auto text-sm font-mono leading-relaxed">
//       <code className="text-gray-300">{code}</code>
//     </pre>
//   );
// }
// function ContentRenderer({ markdown }) {
//   const parts = markdown.split('\n');
//   const elements = [];
//   let i = 0;
//   while (i < parts.length) {
//     const line = parts[i];
//     if (line.startsWith('## '))       { elements.push(<h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>); }
//     else if (line.startsWith('### ')) { elements.push(<h3 key={i} className="text-base font-semibold text-gray-200 mt-4 mb-2">{line.slice(4)}</h3>); }
//     else if (line.startsWith('```'))  {
//       let codeLines = []; i++;
//       while (i < parts.length && !parts[i].startsWith('```')) { codeLines.push(parts[i]); i++; }
//       elements.push(<CodeBlock key={i} code={codeLines.join('\n')} />);
//     }
//     else if (line.startsWith('| ')) {
//       let rows = [];
//       while (i < parts.length && parts[i].startsWith('|')) { if (!parts[i].includes('---')) rows.push(parts[i]); i++; }
//       elements.push(
//         <div key={i} className="overflow-x-auto my-4">
//           <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
//             {rows.map((row, ri) => {
//               const cells = row.split('|').filter(c => c.trim());
//               return <tr key={ri} className={ri === 0 ? 'bg-white/5 font-medium text-gray-200' : 'border-t border-white/5 text-gray-400'}>
//                 {cells.map((cell, ci) => <td key={ci} className="px-3 py-2">{cell.trim()}</td>)}
//               </tr>;
//             })}
//           </table>
//         </div>
//       );
//       continue;
//     }
//     else if (line.startsWith('- ') || line.startsWith('* ')) {
//       elements.push(<li key={i} className="text-gray-400 ml-4 mb-1 list-disc"
//         dangerouslySetInnerHTML={{ __html: line.slice(2)
//           .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-violet-300 px-1 rounded text-xs font-mono">$1</code>')
//           .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>') }} />);
//     }
//     else if (line.trim() === '') { elements.push(<div key={i} className="h-2" />); }
//     else {
//       const html = line
//         .replace(/`([^`]+)`/g, `<code class="bg-white/10 text-violet-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>`)
//         .replace(/\*\*([^*]+)\*\*/g, `<strong class="text-white font-semibold">$1</strong>`);
//       elements.push(<p key={i} className="text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />);
//     }
//     i++;
//   }
//   return <div className="space-y-1">{elements}</div>;
// }

// // ─── XP Toast ───────────────────────────────────────────────────
// function XPToast({ xp, message, onClose }) {
//   useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
//   return (
//     <div className="fixed top-20 right-4 z-50 bg-violet-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
//       <Zap size={18} className="text-yellow-300" />
//       <div><div className="font-bold">+{xp} XP!</div><div className="text-xs text-violet-200">{message}</div></div>
//       <button onClick={onClose} className="ml-2 text-violet-300 hover:text-white"><X size={14} /></button>
//     </div>
//   );
// }

// // ─── Main Component ──────────────────────────────────────────────
// // Props: isContentRead, isQuizPassed come from CoursePage (single source of truth)
// // onComplete, onQuizSubmit callbacks update CoursePage's progress state directly
// export default function SectionViewer({
//   language,
//   lang = 'en',
//   courseInfo,
//   weekNumber,
//   section,
//   isContentRead = false,   // From CoursePage — based on live progress
//   isQuizPassed  = false,   // From CoursePage — based on live progress (quizScore >= 70)
//   onComplete,              // Calls backend + refreshes progress in CoursePage
//   onQuizSubmit,            // Calls backend + refreshes progress in CoursePage
//   onNext,
//   onGetHint,
//   onGetExplanation,
// }) {
//   const t = UI_TEXT[lang] || UI_TEXT.en;

//   const [activeTab, setActiveTab] = useState('learn');
//   const displayCodeExample = lang === 'en' && section.codeExample_en ? section.codeExample_en : (section.codeExample || '');
//   const [userCode, setUserCode] = useState(displayCodeExample);
//   const [output, setOutput] = useState('');
//   const [outputIsError, setOutputIsError] = useState(false);
//   const [running, setRunning] = useState(false);
//   const [hint, setHint] = useState('');
//   const [loadingHint, setLoadingHint] = useState(false);
//   const [explanation, setExplanation] = useState('');
//   const [loadingExplain, setLoadingExplain] = useState(false);
//   const [showQuizModal, setShowQuizModal] = useState(false);
//   const [quizResult, setQuizResult] = useState(null);
//   const [xpToast, setXpToast] = useState(null);

//   // Reset UI when section changes
//   useEffect(() => {
//     const langCode = lang === 'en' && section.codeExample_en ? section.codeExample_en : (section.codeExample || '');
//     setUserCode(langCode);
//     setOutput(''); setOutputIsError(false);
//     setHint(''); setExplanation('');
//     setActiveTab('learn');
//     setQuizResult(null);
//     setShowQuizModal(false);
//   }, [section.id]);

//   // Preload Skulpt when Code tab opens
//   useEffect(() => {
//     if (activeTab === 'code' && language === 'python') loadSkulptScripts().catch(() => {});
//   }, [activeTab, language]);

//   // ── Handlers ─────────────────────────────────────────────────
//   const handleMarkRead = async () => {
//     if (isContentRead) return;
//     const result = await onComplete(weekNumber, section.sectionNumber || 1, section.id);
//     // isContentRead will update via props from CoursePage after progress refresh
//     if (result?.xpEarned > 0) {
//       setXpToast({ xp: result.xpEarned, message: lang === 'hi' ? 'Section padh liya!' : 'Section read!' });
//     }
//   };

//   const handleQuizTabClick = () => {
//     if (!isContentRead) { setActiveTab('learn'); return; }
//     setActiveTab('quiz');
//   };

//   const handleQuizComplete = async (score, total) => {
//     setShowQuizModal(false);
//     const result = await onQuizSubmit(weekNumber, section.sectionNumber || 1, section.id, score, total);
//     setQuizResult(result);
//     // isQuizPassed will update via props from CoursePage after progress refresh
//     if (result?.passed && result.xpEarned > 0) {
//       setXpToast({ xp: result.xpEarned, message: result.message });
//     }
//     return result;
//   };

//   const handleRunCode = useCallback(async () => {
//     if (running) return;
//     setRunning(true); setOutput(t.running); setOutputIsError(false);

//     // ── Python: run in-browser with Skulpt (no network needed) ──
//     if (language === 'python') {
//       const r = await runPythonWithSkulpt(userCode);
//       setOutput(r.output); setOutputIsError(r.isError);
//       setRunning(false);
//       return;
//     }

//     // ── HTML preview ──
//     if (language === 'html') {
//       setOutput('HTML Preview: Copy code → paste at codepen.io for live preview!');
//       setRunning(false);
//       return;
//     }

//     // ── C / C++ → Claude AI (instant, free, no login needed) ──
//     if (language === 'c' || language === 'cpp') {
//       const r = await runCWithBackend(userCode, language);
//       setOutput(r.output);
//       setOutputIsError(r.isError);
//       setRunning(false);
//       return;
//     }

//     // ── JavaScript → run in browser via Function() ──
//     if (language === 'javascript') {
//       try {
//         const logs = [];
//         const fakeConsole = { log: (...a) => logs.push(a.join(' ')), error: (...a) => logs.push('Error: '+a.join(' ')), warn: (...a) => logs.push('Warn: '+a.join(' ')) };
//         // eslint-disable-next-line no-new-func
//         const fn = new Function('console', userCode);
//         fn(fakeConsole);
//         setOutput(logs.join('\n') || '(No output — use console.log() to print)');
//         setOutputIsError(false);
//       } catch (err) {
//         setOutput('Error: ' + err.message);
//         setOutputIsError(true);
//       }
//       setRunning(false);
//       return;
//     }

//     setOutput(`${language.toUpperCase()}: Not supported for in-browser execution.`);
//     setOutputIsError(false);

//     setRunning(false);
//   }, [language, userCode, running, t]);

//   const handleGetHint = async () => {
//     setLoadingHint(true);
//     const r = await onGetHint(section.id, userCode, section.task?.description);
//     setHint(r.hint); setLoadingHint(false);
//   };

//   const handleExplainCode = async () => {
//     setLoadingExplain(true);
//     const r = await onGetExplanation(userCode, null);
//     setExplanation(r.explanation); setLoadingExplain(false);
//   };

//   const displayContent = lang === 'en' && section.content_en ? section.content_en : section.content;
//   const displayTitle   = lang === 'en' && section.title_en   ? section.title_en   : section.title;
//   const displayTask    = lang === 'en' && section.task?.description_en ? section.task.description_en : section.task?.description;

//   const tabs = [
//     { id: 'learn', label: lang === 'hi' ? '📖 Padho' : '📖 Learn', onClick: () => setActiveTab('learn') },
//     { id: 'code',  label: '💻 Code',  onClick: () => setActiveTab('code') },
//     { id: 'quiz',  label: isContentRead ? '🎯 Quiz' : '🔒 Quiz', onClick: handleQuizTabClick, locked: !isContentRead },
//   ];

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header */}
//       <div className="p-6 border-b border-white/5">
//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <div className="text-xs text-gray-600 mb-1">Week {weekNumber} · Section {section.id?.split('-s')[1]}</div>
//             <h1 className="text-xl font-bold text-white flex items-center gap-2">
//               <span>{section.emoji}</span>{displayTitle}
//             </h1>
//           </div>
//           {isQuizPassed && (
//             <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-sm shrink-0">
//               <CheckCircle size={14} />{t.completed}
//             </div>
//           )}
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-1 mt-4 bg-white/[0.03] border border-white/5 rounded-xl p-1 w-fit">
//           {tabs.map(tab => (
//             <button key={tab.id} onClick={tab.onClick}
//               title={tab.locked ? t.quizLocked : undefined}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
//                 ${activeTab === tab.id ? `bg-gradient-to-r ${courseInfo?.color} text-white shadow-sm`
//                   : tab.locked ? 'text-gray-600 cursor-not-allowed'
//                   : 'text-gray-500 hover:text-gray-300 cursor-pointer'}`}>
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {activeTab === 'learn' && !isContentRead && (
//           <p className="text-xs text-amber-500/70 mt-2">
//             💡 {lang === 'hi' ? 'Pehle content padho aur "Padh Liya" click karo, phir Quiz unlock hoga' : 'Read the content and click "Mark as Read" to unlock the Quiz'}
//           </p>
//         )}
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-y-auto p-6">

//         {/* LEARN TAB */}
//         {activeTab === 'learn' && (
//           <div className="max-w-3xl">
//             <ContentRenderer markdown={displayContent} />
//             <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3 flex-wrap">
//               {!isContentRead ? (
//                 <button onClick={handleMarkRead}
//                   className={`px-6 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all flex items-center gap-2`}>
//                   <CheckCircle size={16} />{t.markRead}
//                 </button>
//               ) : (
//                 <div className="flex items-center gap-2 text-green-400 text-sm font-medium bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
//                   <CheckCircle size={15} />{t.alreadyRead}
//                 </div>
//               )}
//               {isContentRead ? (
//                 <button onClick={() => setActiveTab('quiz')}
//                   className="px-6 py-3 rounded-xl border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 font-medium transition-all flex items-center gap-2">
//                   🎯 {t.takeQuiz}
//                 </button>
//               ) : (
//                 <div className="flex items-center gap-2 text-gray-600 text-sm px-4 py-2 rounded-xl border border-white/5 cursor-not-allowed">
//                   <Lock size={14} />{t.quizLockedBtn}
//                 </div>
//               )}
//               {isContentRead && (
//                 <button onClick={() => setActiveTab('code')}
//                   className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-all">
//                   {t.practiceCode}
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {/* CODE TAB */}
//         {activeTab === 'code' && (
//           <div className="max-w-4xl">
//             {section.task && (
//               <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-4">
//                 <div className="text-xs text-blue-400 font-medium mb-1">{t.yourTask}</div>
//                 <p className="text-gray-300 text-sm leading-relaxed">{displayTask}</p>
//               </div>
//             )}
//             <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
//               <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-red-500/60" />
//                   <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
//                   <div className="w-3 h-3 rounded-full bg-green-500/60" />
//                   <span className="text-xs text-gray-600 ml-2 font-mono">main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}</span>
//                 </div>
//                 <button onClick={() => { const lc = lang === 'en' && section.codeExample_en ? section.codeExample_en : (section.codeExample || ''); setUserCode(lc); setOutput(''); }}
//                   className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1 transition-colors">
//                   <RotateCcw size={11} />{t.reset}
//                 </button>
//               </div>
//               <textarea value={userCode} onChange={e => setUserCode(e.target.value)}
//                 className="w-full bg-transparent text-gray-200 font-mono text-sm p-4 outline-none resize-none min-h-[280px] leading-relaxed"
//                 placeholder={language === 'python' ? '# Write Python code here...' : (language === 'c' || language === 'cpp') ? '// Write C code here...' : '// Write code here...'} spellCheck={false}
//                 onKeyDown={e => {
//                   if (e.key === 'Tab') {
//                     e.preventDefault();
//                     const s = e.target.selectionStart, end = e.target.selectionEnd;
//                     const nc = userCode.substring(0, s) + '    ' + userCode.substring(end);
//                     setUserCode(nc);
//                     setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 4; }, 0);
//                   }
//                   if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRunCode(); }
//                 }} />
//             </div>
//             <div className="flex items-center gap-3 mt-3 flex-wrap">
//               <button onClick={handleRunCode} disabled={running}
//                 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50`}>
//                 {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
//                 {running ? t.running : t.runBtn}
//               </button>
//               <span className="text-xs text-gray-700 hidden sm:block">{t.ctrlEnter}</span>
//               <button onClick={handleGetHint} disabled={loadingHint}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/10 transition-all disabled:opacity-50">
//                 <Lightbulb size={14} />{loadingHint ? t.gettingHint : t.aiHint}
//               </button>
//               <button onClick={handleExplainCode} disabled={loadingExplain || !userCode.trim()}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-500/30 text-blue-400 text-sm hover:bg-blue-500/10 transition-all disabled:opacity-50">
//                 <Bot size={14} />{loadingExplain ? t.explaining : t.explainCode}
//               </button>
//             </div>
//             {output && output !== t.running && (
//               <div className="mt-4 bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
//                 <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
//                   <span className="text-xs text-gray-600 font-mono">{t.output}</span>
//                   <span className={`text-xs px-2 py-0.5 rounded ${outputIsError ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>
//                     {outputIsError ? t.error : t.success}
//                   </span>
//                 </div>
//                 <pre className={`p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed ${outputIsError ? 'text-red-400' : 'text-green-300'}`}>{output}</pre>
//               </div>
//             )}
//             {output === t.running && (
//               <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
//                 <Loader2 size={14} className="animate-spin" />{t.runningCode}
//               </div>
//             )}
//             {hint && (
//               <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
//                 <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-2"><Lightbulb size={13} />{t.aiHintLabel}</div>
//                 <p className="text-gray-300 text-sm leading-relaxed">{hint}</p>
//               </div>
//             )}
//             {explanation && (
//               <div className="mt-4 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
//                 <div className="flex items-center gap-2 text-blue-400 text-xs font-medium mb-2"><Bot size={13} />{t.explanationLabel}</div>
//                 <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* QUIZ TAB */}
//         {activeTab === 'quiz' && (
//           <div className="max-w-2xl">

//             {/* Locked */}
//             {!isContentRead && (
//               <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 text-center">
//                 <div className="text-5xl mb-4">🔒</div>
//                 <h3 className="text-xl font-bold text-white mb-2">{lang === 'hi' ? 'Quiz Locked Hai' : 'Quiz is Locked'}</h3>
//                 <p className="text-gray-400 mb-6">{t.readFirst}</p>
//                 <button onClick={() => setActiveTab('learn')}
//                   className={`px-8 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all`}>
//                   {lang === 'hi' ? '← Content Padho' : '← Read Content'}
//                 </button>
//               </div>
//             )}

//             {/* Failed */}
//             {isContentRead && quizResult && !quizResult.passed && (
//               <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center">
//                 <div className="text-5xl mb-4">😅</div>
//                 <h3 className="text-xl font-bold text-white mb-2">{t.quizFailed}</h3>
//                 <div className="text-3xl font-bold text-red-400 mb-2">{quizResult.percentScore}%</div>
//                 <p className="text-gray-400 mb-6 text-sm">{t.quizFailedMsg}</p>
//                 <div className="flex gap-3 justify-center flex-wrap">
//                   <button onClick={() => setActiveTab('learn')}
//                     className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 font-medium transition-all">
//                     {t.goBackRead}
//                   </button>
//                   <button onClick={() => setShowQuizModal(true)}
//                     className={`px-6 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all`}>
//                     {t.retakeQuiz}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Passed */}
//             {isContentRead && isQuizPassed && (
//               <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-8 text-center">
//                 <div className="text-5xl mb-4">🏆</div>
//                 <h3 className="text-xl font-bold text-white mb-2">{t.quizPassed}</h3>
//                 {quizResult && <div className="text-3xl font-bold text-green-400 mb-2">{quizResult.percentScore}%</div>}
//                 <p className="text-green-400/70 text-sm mb-8">{lang === 'hi' ? 'Agla section unlock ho gaya!' : 'Next section unlocked!'}</p>
//                 <button onClick={onNext}
//                   className={`px-8 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2 mx-auto`}>
//                   {t.nextSection}<ChevronRight size={18} />
//                 </button>
//               </div>
//             )}

//             {/* Ready to take */}
//             {isContentRead && !isQuizPassed && !quizResult && (
//               <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
//                 <div className="text-5xl mb-4">🎯</div>
//                 <h3 className="text-xl font-bold text-white mb-2">{t.quizTitle}</h3>
//                 <p className="text-gray-500 mb-2">{t.quizDesc(section.quiz?.length || 3)}</p>
//                 <p className="text-sm text-violet-400 mb-6">{t.quizXp}</p>
//                 <button onClick={() => setShowQuizModal(true)}
//                   className={`px-8 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all`}>
//                   {t.startQuiz}
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {showQuizModal && (
//         <QuizModal questions={section.quiz || []} sectionTitle={displayTitle}
//           courseInfo={courseInfo} onComplete={handleQuizComplete}
//           onClose={() => setShowQuizModal(false)} lang={lang} />
//       )}
//       {xpToast && <XPToast xp={xpToast.xp} message={xpToast.message} onClose={() => setXpToast(null)} />}
//     </div>
//   );
// }





/**
 * StudyEarn AI — SectionViewer Component (Unforgettable Edition)
 *
 * New flow (no tab-switching for content):
 *   1. Rich scroll content — concept blocks, inline runnable snippets,
 *      mistake blocks, inline checkpoints
 *   2. Code tab — ??? starter code, guided task
 *   3. Quiz tab — existing QuizModal, unlocked after Mark as Read
 *
 * richContent array in section data drives the learn tab.
 * Falls back to legacy `content` markdown if richContent not present.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
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
    runBtn: 'Run', running: 'Running...',
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
    quizFailedMsg: 'Re-read the content carefully, then try again.',
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
    runBtn: 'Run Karo', running: 'Chal raha...',
    ctrlEnter: 'Ctrl+Enter se chala sakte ho',
    aiHint: 'AI Hint (-5 XP)', gettingHint: 'Hint aa rahi hai...',
    explainCode: 'Mera Code Samjhao', explaining: 'Samjha raha hai...',
    output: 'Output', success: '✓ Sahi', error: '✗ Error',
    aiHintLabel: 'AI Hint', explanationLabel: 'Code Explanation',
    quizTitle: 'Section Quiz',
    quizDesc: (n) => `${n} sawaal · 70%+ chahiye`,
    quizXp: 'Pass karo → +30 XP + agla section unlock!',
    startQuiz: 'Quiz Shuru Karo →', retakeQuiz: 'Dobara Try Karo',
    nextSection: 'Agla Section →',
    completed: 'Ho Gaya', reset: 'Reset',
    runningCode: 'Code chal raha hai...',
    yourTask: 'Tumhara Task:',
    quizPassed: 'Quiz Pass! 🎉',
    quizFailed: 'Abhi aur mehnat chahiye!',
    quizFailedMsg: 'Wapas jao, dhyan se padho, phir try karo.',
    goBackRead: '← Content Padho',
    readFirst: 'Quiz se pehle content padho.',
  },
};

// ─── C/C++ Runner ────────────────────────────────────────────────
async function runCWithBackend(code, language) {
  function makeStdin(src) {
    const n = (src.match(/scanf\s*\(/g) || []).length + (src.match(/fgets\s*\(/g) || []).length;
    if (!n) return '';
    const vals = [];
    const re = /scanf\s*\(\s*["'](.*?)["\\']/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      const f = m[1];
      if (f.includes('%d')||f.includes('%i')) vals.push('10');
      else if (f.includes('%f')||f.includes('%lf')) vals.push('3.14');
      else if (f.includes('%c')) vals.push('A');
      else if (f.includes('%s')) vals.push('Rahul');
      else vals.push('5');
    }
    for (let i = 0; i < (src.match(/fgets\s*\(/g)||[]).length; i++) vals.push('Rahul Sharma');
    return vals.slice(0,12).join('\n') + '\n';
  }
  const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000' : 'https://studyearn-backend.onrender.com';
  try {
    const resp = await fetch(`${API}/api/codelearn/run-code`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code, stdin: makeStdin(code) }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const out = data.output || '(No output)';
    return { output: out, isError: out.startsWith('Compile Error') || out.startsWith('❌') };
  } catch {
    return { output: '⚠️ Compiler unavailable. Try onlinegdb.com', isError: true };
  }
}

// ─── Skulpt Python Runner ────────────────────────────────────────
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

async function runCode(code, language) {
  if (language === 'python') return runPythonWithSkulpt(code);
  if (language === 'javascript') {
    try {
      const logs = [];
      const fakeConsole = { log: (...a) => logs.push(a.join(' ')), error: (...a) => logs.push('Error: '+a.join(' ')), warn: (...a) => logs.push('Warn: '+a.join(' ')) };
      // eslint-disable-next-line no-new-func
      new Function('console', code)(fakeConsole);
      return { output: logs.join('\n') || '(No output)', isError: false };
    } catch (err) {
      return { output: 'Error: ' + err.message, isError: true };
    }
  }
  if (language === 'c' || language === 'cpp') return runCWithBackend(code, language);
  if (language === 'html') return { output: 'HTML: Copy paste at codepen.io for live preview!', isError: false };
  return { output: `${language.toUpperCase()}: Not supported for in-browser run.`, isError: false };
}

// ─── XP Toast ────────────────────────────────────────────────────
function XPToast({ xp, message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-20 right-4 z-50 bg-violet-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right">
      <Zap size={18} className="text-yellow-300" />
      <div><div className="font-bold">+{xp} XP!</div><div className="text-xs text-violet-200">{message}</div></div>
      <button onClick={onClose} className="ml-2 text-violet-300 hover:text-white"><X size={14} /></button>
    </div>
  );
}

// ─── Legacy Markdown Renderer (fallback) ─────────────────────────
function CodeBlock({ code }) {
  return (
    <pre className="bg-[#0d1117] border border-white/5 rounded-xl p-4 overflow-x-auto text-sm font-mono leading-relaxed">
      <code className="text-gray-300">{code}</code>
    </pre>
  );
}
function LegacyContentRenderer({ markdown }) {
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

// ─── Inline Snippet Block ─────────────────────────────────────────
function InlineSnippet({ block, language, courseInfo, onXP }) {
  const [output, setOutput]     = useState('');
  const [isError, setIsError]   = useState(false);
  const [running, setRunning]   = useState(false);
  const [hasRun, setHasRun]     = useState(false);
  const [code, setCode]         = useState(block.code);

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setOutput('Running...');
    const result = await runCode(code, language);
    setOutput(result.output);
    setIsError(result.isError);
    setRunning(false);
    if (!hasRun && !result.isError) {
      setHasRun(true);
      onXP?.(5, 'Code run kiya!');
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          {block.label && <span className="text-xs text-gray-500 ml-2">{block.label}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCode(block.code)} className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1 transition-colors">
            <RotateCcw size={10} /> Reset
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all disabled:opacity-50
              ${hasRun ? 'bg-green-500/15 text-green-400 border border-green-500/30' : `bg-gradient-to-r ${courseInfo?.color} text-white`}`}
          >
            {running ? <Loader2 size={11} className="animate-spin" /> : <Play size={11} />}
            {running ? 'Running...' : hasRun ? 'Run Again' : 'Run Code ▶'}
          </button>
        </div>
      </div>

      {/* Code editor */}
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        className="w-full bg-[#0d1117] text-gray-200 font-mono text-sm p-4 outline-none resize-none leading-relaxed"
        style={{ minHeight: `${Math.max(3, code.split('\n').length) * 1.6 + 2}rem` }}
        spellCheck={false}
        onKeyDown={e => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const s = e.target.selectionStart;
            const nc = code.substring(0, s) + '    ' + code.substring(e.target.selectionEnd);
            setCode(nc);
            setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 4; }, 0);
          }
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
        }}
      />

      {/* Output */}
      {output && output !== 'Running...' && (
        <div className={`border-t border-white/5 px-4 py-3 font-mono text-sm whitespace-pre-wrap leading-relaxed
          ${isError ? 'bg-red-500/5 text-red-400' : 'bg-[#0d1117] text-green-300'}`}>
          <span className={`text-xs font-sans mr-2 ${isError ? 'text-red-500' : 'text-green-500'}`}>
            {isError ? '✗ Error' : '✓ Output:'}
          </span>
          {output}
        </div>
      )}
    </div>
  );
}

// ─── Mistake Block ────────────────────────────────────────────────
function MistakeBlock({ block, lang = "hi" }) {
  const [showFix, setShowFix] = useState(false);
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-red-500/20">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500/5 border-b border-red-500/15">
        <span className="text-xs font-semibold text-red-400">⚠ {lang === "hi" ? "Aam Galati — Shuruaati log yeh karte hain" : "Common Mistake — Beginners do this"}</span>
      </div>
      <div className="bg-[#0d1117] px-4 py-3">
        <div className="text-xs text-red-400 mb-1.5 font-medium">{lang === "hi" ? "✗ Galat:" : "✗ Wrong:"}</div>
        <pre className="font-mono text-sm text-red-300/70 line-through leading-relaxed">{block.wrong}</pre>
      </div>
      {showFix ? (
        <>
          <div className="bg-[#0d1117] px-4 py-3 border-t border-white/5">
            <div className="text-xs text-green-400 mb-1.5 font-medium">{lang === "hi" ? "✓ Sahi:" : "✓ Correct:"}</div>
            <pre className="font-mono text-sm text-green-300 leading-relaxed">{block.right}</pre>
          </div>
          <div className="px-4 py-3 bg-blue-500/5 border-t border-blue-500/15 text-sm text-gray-300 leading-relaxed">
            <span className="text-blue-400 text-xs font-medium">{lang === "hi" ? "Kyun? " : "Why? "}</span>{block.why}
          </div>
        </>
      ) : (
        <button
          onClick={() => setShowFix(true)}
          className="w-full py-2.5 text-xs text-red-400 hover:text-white hover:bg-red-500/10 transition-all border-t border-red-500/15"
        >
          {lang === "hi" ? "Sahi tarika dekho →" : "Show the fix →"}
        </button>
      )}
    </div>
  );
}

// ─── Inline Checkpoint ────────────────────────────────────────────
function InlineCheckpoint({ block, onCorrect, lang = "hi" }) {
  const [selected, setSelected]   = useState(null);
  const [answered, setAnswered]   = useState(false);

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === block.correct) onCorrect?.();
  };

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-violet-500/20 bg-violet-500/5">
      <div className="px-4 py-3 border-b border-violet-500/15">
        <div className="text-xs text-violet-400 font-medium mb-1.5">⚡ {lang === "hi" ? "Jaldi Jaancho" : "Quick Check"}</div>
        <p className="text-gray-200 text-sm font-medium leading-relaxed">{block.question}</p>
      </div>
      <div className="p-3 grid grid-cols-1 gap-2">
        {block.options.map((opt, idx) => {
          let style = 'border-white/10 text-gray-400 hover:border-violet-500/40 hover:bg-violet-500/5';
          if (answered) {
            if (idx === block.correct) style = 'border-green-500/50 bg-green-500/10 text-green-300';
            else if (idx === selected) style = 'border-red-500/50 bg-red-500/10 text-red-300';
            else style = 'border-white/5 text-gray-600';
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={answered}
              className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${style} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="text-xs opacity-60 mr-2">{String.fromCharCode(65+idx)}.</span>{opt}
            </button>
          );
        })}
      </div>
      {answered && block.explanation && (
        <div className={`px-4 py-3 border-t text-sm leading-relaxed
          ${selected === block.correct
            ? 'bg-green-500/5 border-green-500/15 text-green-300'
            : 'bg-orange-500/5 border-orange-500/15 text-orange-300'}`}>
          <span className="font-medium mr-1">{selected === block.correct ? (lang === "hi" ? "✓ Bilkul sahi!" : "✓ Correct!") : (lang === "hi" ? "✗ Nahi —" : "✗ Not quite —")}</span>
          {block.explanation}
        </div>
      )}
    </div>
  );
}

// ─── Rich Content Renderer ────────────────────────────────────────
function RichContentRenderer({ blocks, language, courseInfo, onXP, lang = "hi" }) {
  return (
    <div className="space-y-1">
      {blocks.map((block, idx) => {
        if (block.type === 'concept') {
          // Cycle through heading accent colors for visual variety
          const accentColors = [
            { bg: 'bg-violet-500/10', border: 'border-violet-500/25', text: 'text-violet-300', dot: 'bg-violet-400' },
            { bg: 'bg-blue-500/10',   border: 'border-blue-500/25',   text: 'text-blue-300',   dot: 'bg-blue-400' },
            { bg: 'bg-emerald-500/10',border: 'border-emerald-500/25',text: 'text-emerald-300', dot: 'bg-emerald-400' },
            { bg: 'bg-amber-500/10',  border: 'border-amber-500/25',  text: 'text-amber-300',  dot: 'bg-amber-400' },
            { bg: 'bg-pink-500/10',   border: 'border-pink-500/25',   text: 'text-pink-300',   dot: 'bg-pink-400' },
          ];
          const accent = accentColors[idx % accentColors.length];
          return (
            <div key={idx} className="mb-4 mt-5">
              {block.heading && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-3 ${accent.bg} border ${accent.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} shrink-0`} />
                  <h3 className={`text-sm font-semibold ${accent.text}`}>{block.heading}</h3>
                </div>
              )}
              {block.body && (
                <p className="text-gray-400 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: block.body
                    .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-violet-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
                    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
              )}
            </div>
          );
        }

        if (block.type === 'analogy') {
          return (
            <div key={idx} className="my-4 flex gap-3 px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <span className="text-lg mt-0.5 shrink-0">🔗</span>
              <div>
                <div className="text-xs text-amber-400 font-medium mb-1">{lang === "hi" ? "Asli Zindagi se Misaal" : "Real Life Analogy"}</div>
                <p className="text-gray-300 text-sm leading-relaxed">{block.text}</p>
              </div>
            </div>
          );
        }

        if (block.type === 'snippet') {
          return <InlineSnippet key={idx} block={block} language={language} courseInfo={courseInfo} onXP={onXP} lang={lang} />;
        }

        if (block.type === 'mistake') {
          return <MistakeBlock key={idx} block={block} lang={lang} />;
        }

        if (block.type === 'checkpoint') {
          return <InlineCheckpoint key={idx} block={block} lang={lang} onCorrect={() => onXP?.(10, lang === 'hi' ? 'Checkpoint sahi kiya!' : 'Checkpoint correct!')} />;
        }

        return null;
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function SectionViewer({
  language,
  lang = 'en',
  courseInfo,
  weekNumber,
  section,
  isContentRead = false,
  isQuizPassed  = false,
  onComplete,
  onQuizSubmit,
  onNext,
  onGetHint,
  onGetExplanation,
}) {
  const t = UI_TEXT[lang] || UI_TEXT.en;

  const [activeTab, setActiveTab]         = useState('learn');
  const [userCode, setUserCode]           = useState('');
  const [output, setOutput]               = useState('');
  const [outputIsError, setOutputIsError] = useState(false);
  const [running, setRunning]             = useState(false);
  const [hint, setHint]                   = useState('');
  const [loadingHint, setLoadingHint]     = useState(false);
  const [explanation, setExplanation]     = useState('');
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizResult, setQuizResult]       = useState(null);
  const [xpToast, setXpToast]             = useState(null);

  // Pick starter code: prefer starterCode > codeExample > ''
  const getStarterCode = useCallback(() => {
    // English: prefer task.starterCode_en → codeExample_en → starterCode → codeExample
    if (lang === 'en') {
      return section.task?.starterCode_en
        || section.codeExample_en
        || section.task?.starterCode
        || section.codeExample || '';
    }
    // Hinglish: starterCode → codeExample
    return section.task?.starterCode || section.codeExample || '';
  }, [section, lang]);

  useEffect(() => {
    setUserCode(getStarterCode());
    setOutput(''); setOutputIsError(false);
    setHint(''); setExplanation('');
    setActiveTab('learn');
    setQuizResult(null);
    setShowQuizModal(false);
  }, [section.id]);

  useEffect(() => {
    if (activeTab === 'code' && language === 'python') loadSkulptScripts().catch(() => {});
  }, [activeTab, language]);

  const showXP = (xp, message) => setXpToast({ xp, message });

  const handleMarkRead = async () => {
    if (isContentRead) return;
    const result = await onComplete(weekNumber, section.sectionNumber || 1, section.id);
    if (result?.xpEarned > 0) showXP(result.xpEarned, lang === 'hi' ? 'Section padh liya!' : 'Section read!');
  };

  const handleQuizTabClick = () => {
    if (!isContentRead) { setActiveTab('learn'); return; }
    setActiveTab('quiz');
  };

  const handleQuizComplete = async (score, total) => {
    setShowQuizModal(false);
    const result = await onQuizSubmit(weekNumber, section.sectionNumber || 1, section.id, score, total);
    setQuizResult(result);
    if (result?.passed && result.xpEarned > 0) showXP(result.xpEarned, result.message);
    return result;
  };

  const handleRunCode = useCallback(async () => {
    if (running) return;
    setRunning(true); setOutput(t.running); setOutputIsError(false);
    const result = await runCode(userCode, language);
    setOutput(result.output); setOutputIsError(result.isError);
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

  const displayTitle  = lang === 'en' && section.title_en   ? section.title_en   : section.title;
  const displayTask    = lang === 'en' && section.task?.description_en ? section.task.description_en : section.task?.description;
  const displayHint    = lang === 'en' && section.task?.hint_en ? section.task.hint_en : section.task?.hint;
  // Pick richContent based on lang — English gets richContent_en, Hinglish gets richContent
  const activeRichContent = (lang === 'en' && section.richContent_en?.length)
    ? section.richContent_en
    : (section.richContent?.length ? section.richContent : null);
  const hasRichContent = !!activeRichContent;

  const tabs = [
    { id: 'learn', label: lang === 'hi' ? '📖 Padho' : '📖 Learn', onClick: () => setActiveTab('learn') },
    { id: 'code',  label: '💻 Code',  onClick: () => setActiveTab('code') },
    { id: 'quiz',  label: isContentRead ? '🎯 Quiz' : '🔒 Quiz', onClick: handleQuizTabClick, locked: !isContentRead },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* ── Header ── */}
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
                ${activeTab === tab.id
                  ? `bg-gradient-to-r ${courseInfo?.color} text-white shadow-sm`
                  : tab.locked ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-300 cursor-pointer'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'learn' && !isContentRead && (
          <p className="text-xs text-amber-500/70 mt-2">
            💡 {lang === 'hi' ? 'Pehle content padho — tab Quiz unlock hoga' : 'Read through and click "Mark as Read" to unlock Quiz'}
          </p>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* ══ LEARN TAB ══ */}
        {activeTab === 'learn' && (
          <div className="max-w-3xl">
            {hasRichContent
              ? <RichContentRenderer
                  blocks={activeRichContent}
                  language={language}
                  courseInfo={courseInfo}
                  onXP={showXP}
                  lang={lang}
                />
              : <LegacyContentRenderer markdown={
                  lang === 'en' && section.content_en ? section.content_en : section.content
                } />
            }

            {/* Bottom actions */}
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
              {isContentRead && (
                <button onClick={() => setActiveTab('quiz')}
                  className="px-6 py-3 rounded-xl border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 font-medium transition-all flex items-center gap-2">
                  🎯 {t.takeQuiz}
                </button>
              )}
              <button onClick={() => setActiveTab('code')}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-all">
                {t.practiceCode}
              </button>
            </div>
          </div>
        )}

        {/* ══ CODE TAB ══ */}
        {activeTab === 'code' && (
          <div className="max-w-4xl">
            {/* Task description */}
            {section.task && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-5">
                <div className="text-xs text-blue-400 font-medium mb-1.5">
                  ⚡ {t.yourTask} <span className="text-gray-600 font-normal ml-1">— ??? ki jagah apna code likho</span>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed font-medium">{displayTask}</p>
                {displayHint && (
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                    💡 Hint: {displayHint}
                  </p>
                )}
              </div>
            )}

            {/* Editor */}
            <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="text-xs text-gray-600 ml-2 font-mono">
                    task.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}
                  </span>
                </div>
                <button
                  onClick={() => { setUserCode(getStarterCode()); setOutput(''); setHint(''); setExplanation(''); }}
                  className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1 transition-colors">
                  <RotateCcw size={11} />{t.reset}
                </button>
              </div>
              <textarea
                value={userCode}
                onChange={e => setUserCode(e.target.value)}
                className="w-full bg-transparent text-gray-200 font-mono text-sm p-4 outline-none resize-none min-h-[240px] leading-relaxed"
                placeholder={`# ${language === 'python' ? '??? ki jagah apna code likho' : '// Write your code here'}`}
                spellCheck={false}
                onKeyDown={e => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const s = e.target.selectionStart;
                    const nc = userCode.substring(0, s) + '    ' + userCode.substring(e.target.selectionEnd);
                    setUserCode(nc);
                    setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 4; }, 0);
                  }
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRunCode(); }
                }}
              />
            </div>

            {/* Run buttons */}
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

            {/* Output */}
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

        {/* ══ QUIZ TAB ══ */}
        {activeTab === 'quiz' && (
          <div className="max-w-2xl">
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
                  <button onClick={() => { setQuizResult(null); setShowQuizModal(true); }}
                    className={`px-6 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all`}>
                    {t.retakeQuiz}
                  </button>
                </div>
              </div>
            )}

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
        <QuizModal
          questions={section.quiz || []}
          sectionTitle={displayTitle}
          courseInfo={courseInfo}
          onComplete={handleQuizComplete}
          onClose={() => setShowQuizModal(false)}
          lang={lang}
        />
      )}
      {xpToast && <XPToast xp={xpToast.xp} message={xpToast.message} onClose={() => setXpToast(null)} />}
    </div>
  );
}