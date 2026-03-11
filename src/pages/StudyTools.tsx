import { useState, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { API_URL } from '../utils/api';
import {
  Sparkles, FileText, Upload, X, Copy, Download,
  Check, Loader2, BookOpen, Brain,
  AlignLeft, List, Lightbulb, Globe, Map, CreditCard,
  MessageSquare, ClipboardList, Layers, HelpCircle,
  Zap, RotateCcw, Mic, MicOff,
} from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

// ── Types ─────────────────────────────────────────────────────
type Tab = 'notes' | 'pdf';

const NOTE_MODES = [
  { id: 'simplify',   label: 'Simplify',           icon: AlignLeft,     color: 'blue',   desc: 'Easy language' },
  { id: 'summarize',  label: 'Summarize',           icon: List,          color: 'purple', desc: 'Short version' },
  { id: 'structure',  label: 'Add Structure',       icon: Layers,        color: 'cyan',   desc: 'Headings & org' },
  { id: 'bullets',    label: 'Bullet Points',       icon: ClipboardList, color: 'green',  desc: 'Neat bullets' },
  { id: 'examples',   label: 'Add Examples',        icon: Lightbulb,     color: 'yellow', desc: 'Real examples' },
  { id: 'detailed',   label: 'Detailed Explain',    icon: BookOpen,      color: 'orange', desc: 'In-depth' },
  { id: 'hinglish',   label: 'Hinglish Mode',       icon: Globe,         color: 'pink',   desc: 'Hindi + English' },
  { id: 'mindmap',    label: 'Mind Map',             icon: Map,           color: 'teal',   desc: 'Visual tree' },
  { id: 'flashcards', label: 'Flashcards',          icon: CreditCard,    color: 'indigo', desc: 'Q&A cards' },
] as const;

const PDF_TYPES = [
  { id: 'summary',     label: 'Summary',              icon: AlignLeft,     color: 'blue',   desc: 'Quick overview' },
  { id: 'mcq',         label: 'MCQ Questions',         icon: HelpCircle,    color: 'purple', desc: '15 MCQs + answers' },
  { id: 'important',   label: 'Important Topics',      icon: Zap,           color: 'yellow', desc: 'Detailed explanation' },
  { id: 'flashcards',  label: 'Key Points & Cards',    icon: CreditCard,    color: 'green',  desc: 'Quick revision' },
  { id: 'chapterwise', label: 'Chapter Breakdown',     icon: Layers,        color: 'cyan',   desc: 'Section by section' },
  { id: 'qa',          label: 'Q&A Practice',          icon: MessageSquare, color: 'orange', desc: 'Short & long answers' },
] as const;

const COLOR_MAP: Record<string, string> = {
  blue:   'border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20',
  purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20',
  cyan:   'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20',
  green:  'border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20',
  yellow: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20',
  orange: 'border-orange-500/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20',
  pink:   'border-pink-500/30 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20',
  teal:   'border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20',
  indigo: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20',
};
const ACTIVE_COLOR_MAP: Record<string, string> = {
  blue:   'border-blue-400/60 bg-blue-500/25 text-blue-200 ring-1 ring-blue-500/30',
  purple: 'border-purple-400/60 bg-purple-500/25 text-purple-200 ring-1 ring-purple-500/30',
  cyan:   'border-cyan-400/60 bg-cyan-500/25 text-cyan-200 ring-1 ring-cyan-500/30',
  green:  'border-green-400/60 bg-green-500/25 text-green-200 ring-1 ring-green-500/30',
  yellow: 'border-yellow-400/60 bg-yellow-500/25 text-yellow-200 ring-1 ring-yellow-500/30',
  orange: 'border-orange-400/60 bg-orange-500/25 text-orange-200 ring-1 ring-orange-500/30',
  pink:   'border-pink-400/60 bg-pink-500/25 text-pink-200 ring-1 ring-pink-500/30',
  teal:   'border-teal-400/60 bg-teal-500/25 text-teal-200 ring-1 ring-teal-500/30',
  indigo: 'border-indigo-400/60 bg-indigo-500/25 text-indigo-200 ring-1 ring-indigo-500/30',
};

// ── Markdown renderer (simple) ────────────────────────────────
function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-white mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-6 mb-2 pb-1 border-b border-white/10">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-200 italic">$1</em>')
    .replace(/^✅ \*\*Answer: (.+)\*\*$/gm, '<div class="mt-1 text-green-300 font-semibold">✅ Answer: $1</div>')
    .replace(/^💡 \*\*Explanation:\*\* (.+)$/gm, '<div class="text-xs text-slate-400 mt-0.5 mb-3">💡 $1</div>')
    .replace(/^---$/gm, '<hr class="border-white/8 my-3" />')
    .replace(/^- (.+)$/gm, '<li class="text-slate-300 text-sm ml-4 list-disc">$1</li>')
    .replace(/^✓ (.+)$/gm, '<li class="text-green-300 text-sm ml-4">✓ $1</li>')
    .replace(/^→ (.+)$/gm, '<li class="text-blue-300 text-sm ml-4">→ $1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="text-slate-300 text-sm ml-4 list-decimal">$2</li>')
    .replace(/^([A-D]\)) (.+)$/gm, '<div class="text-slate-400 text-sm ml-4">$1 $2</div>')
    .replace(/\n\n/g, '</p><p class="text-slate-300 text-sm mb-2">')
    .replace(/\n/g, '<br/>');
}

// ── Main Component ────────────────────────────────────────────
export function StudyTools() {
  const { isPremium } = useApp();
  const [activeTab, setActiveTab]     = useState<Tab>('notes');

  // Notes state
  const [notes, setNotes]           = useState('');
  const [noteMode, setNoteMode]     = useState('simplify');
  const [noteResult, setNoteResult] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [notePoints, setNotePoints] = useState(0);
  const [noteCopied, setNoteCopied] = useState(false);
  const [voiceLang,  setVoiceLang]  = useState<'hi-IN'|'en-IN'>('en-IN');
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Voice Input for Notes ─────────────────────────────────
  const { isListening, isUnsupported, interimText, error: voiceError,
          toggleListening } = useVoiceInput({
    lang: voiceLang,
    onTranscript: (text) => {
      setNotes(text);
      if (notesTextareaRef.current) {
        notesTextareaRef.current.style.height = 'auto';
        notesTextareaRef.current.style.height = notesTextareaRef.current.scrollHeight + 'px';
      }
    },
  });

  // PDF state
  const [pdfFile, setPdfFile]         = useState<File | null>(null);
  const [pdfType, setPdfType]         = useState('summary');
  const [pdfResult, setPdfResult]     = useState('');
  const [pdfLoading, setPdfLoading]   = useState(false);
  const [pdfPoints, setPdfPoints]     = useState(0);
  const [pdfCopied, setPdfCopied]     = useState(false);
  const [isDragging, setIsDragging]   = useState(false);
  const [pageCount, setPageCount]     = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // ── Notes Improver ─────────────────────────────────────────
  const handleImproveNotes = async () => {
    if (!notes.trim() || noteLoading) return;
    setNoteLoading(true);
    setNoteResult('');
    try {
      const res = await fetch(`${API_URL}/api/study/improve-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ notes, mode: noteMode }),
      });
      const data = await res.json();
      if (data.success) {
        setNoteResult(data.result);
        setNotePoints(data.pointsAwarded || 0);
      } else {
        setNoteResult(`❌ ${data.message || 'Something went wrong. Please try again.'}`);
      }
    } catch {
      setNoteResult('❌ Connection error. Please check your internet and try again.');
    }
    setNoteLoading(false);
  };

  const copyNotes = async () => {
    await navigator.clipboard.writeText(noteResult);
    setNoteCopied(true);
    setTimeout(() => setNoteCopied(false), 2000);
  };

  const downloadNotes = () => {
    const blob = new Blob([noteResult], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `studyearn-notes-${noteMode}.txt`;
    a.click();
  };

  // ── PDF Analyzer ───────────────────────────────────────────
  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') { alert('Only PDF files are supported.'); return; }
    if (file.size > 25 * 1024 * 1024) { alert('File too large. Maximum size is 25MB.'); return; }
    setPdfFile(file);
    setPdfResult('');
  };

  const handleAnalyzePDF = async () => {
    if (!pdfFile || pdfLoading) return;
    setPdfLoading(true);
    setPdfResult('');
    try {
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('type', pdfType);
      const res = await fetch(`${API_URL}/api/study/analyze-pdf`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setPdfResult(data.result);
        setPdfPoints(data.pointsAwarded || 0);
        setPageCount(data.pageCount || 0);
      } else {
        setPdfResult(`❌ ${data.message || 'Analysis failed. Please try again.'}`);
      }
    } catch {
      setPdfResult('❌ Connection error. Please try again.');
    }
    setPdfLoading(false);
  };

  const copyPDF = async () => {
    await navigator.clipboard.writeText(pdfResult);
    setPdfCopied(true);
    setTimeout(() => setPdfCopied(false), 2000);
  };

  const downloadPDF = () => {
    const blob = new Blob([pdfResult], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `studyearn-pdf-${pdfType}.txt`;
    a.click();
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="space-y-5 animate-slide-up">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Study Tools</h1>
          <p className="text-xs text-slate-500">Improve notes • Analyze PDFs • Study smarter</p>
        </div>
        {isPremium && (
          <span className="ml-auto text-xs font-bold text-yellow-300 px-2 py-1 rounded-lg border border-yellow-500/30"
            style={{ background: 'rgba(234,179,8,0.1)' }}>⚡ 2× Points</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl border border-white/8" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {[
          { id: 'notes' as Tab, icon: Sparkles, label: 'Notes Improver',  desc: 'Paste & improve' },
          { id: 'pdf'   as Tab, icon: FileText,  label: 'PDF Analyzer',    desc: 'Upload & analyze' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-white'
                : 'text-slate-500 hover:text-slate-300'
            }`}>
            <tab.icon className="w-4 h-4 flex-shrink-0" />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold">{tab.label}</div>
              <div className="text-[10px] opacity-60">{tab.desc}</div>
            </div>
            <div className="text-xs font-semibold sm:hidden">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* ── NOTES IMPROVER TAB ─────────────────────────────── */}
      {activeTab === 'notes' && (
        <div className="space-y-4">

          {/* Mode selector */}
          <div className="glass rounded-2xl p-4 border border-white/8 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Choose Mode</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {NOTE_MODES.map(mode => {
                const isActive = noteMode === mode.id;
                const Icon = mode.icon;
                return (
                  <button key={mode.id} onClick={() => setNoteMode(mode.id)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all duration-150 ${
                      isActive ? ACTIVE_COLOR_MAP[mode.color] : COLOR_MAP[mode.color]
                    }`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[10px] font-semibold leading-tight">{mode.label}</span>
                    <span className="text-[9px] opacity-60 leading-tight hidden sm:block">{mode.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two column layout on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Input */}
            <div className="glass rounded-2xl border border-white/8 flex flex-col" style={{ minHeight: '320px' }}>
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/5">
                <span className="text-xs font-semibold text-slate-400">Your Notes</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-600">{notes.length} chars</span>
                  {/* Lang toggle */}
                  {!isUnsupported && (
                    <button
                      onClick={() => setVoiceLang(l => l === 'hi-IN' ? 'en-IN' : 'hi-IN')}
                      className="text-[10px] text-slate-600 hover:text-slate-300 px-1.5 py-0.5 rounded border border-white/8 transition-colors"
                      title="Toggle language"
                    >🎤 {voiceLang === 'hi-IN' ? 'HI' : 'EN'}</button>
                  )}
                  {/* Mic button */}
                  {!isUnsupported && (
                    <button
                      onClick={() => toggleListening(notes)}
                      title={isListening ? "Stop recording" : "Speak your notes"}
                      className={`relative p-1.5 rounded-lg border transition-all ${
                        isListening
                          ? 'border-red-500/50 bg-red-500/10 text-red-400'
                          : 'border-white/10 text-slate-500 hover:text-purple-400 hover:border-purple-500/20'
                      }`}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      {isListening && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    </button>
                  )}
                  {notes && (
                    <button onClick={() => { setNotes(''); setNoteResult(''); }}
                      className="text-slate-600 hover:text-red-400 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {/* Voice status bar */}
              {isListening && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-red-500/5 border-b border-red-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
                  <span className="text-[11px] text-red-300 flex-1 truncate">
                    {interimText || "Listening… speak now"}
                  </span>
                  <span className="text-[10px] text-red-400/60">Tap 🎤 to stop</span>
                </div>
              )}
              {voiceError && (
                <div className="px-4 py-1.5 bg-red-500/5 border-b border-red-500/10">
                  <span className="text-[11px] text-red-400">{voiceError}</span>
                </div>
              )}
              <textarea
                ref={notesTextareaRef}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={isListening
                  ? (interimText || "🎤 Listening… speak your notes in Hindi or English")
                  : "Paste notes or tap 🎤 to speak… (Hindi & English supported)"}
                className="flex-1 w-full bg-transparent text-sm text-slate-200 placeholder-slate-700 resize-none focus:outline-none p-4 leading-relaxed"
                style={{ minHeight: '260px' }}
              />
              <div className="px-4 pb-3">
                <button
                  onClick={handleImproveNotes}
                  disabled={!notes.trim() || noteLoading}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: noteLoading ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                  {noteLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Improving notes…</>
                    : <><Sparkles className="w-4 h-4" /> Improve with AI</>
                  }
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="glass rounded-2xl border border-white/8 flex flex-col" style={{ minHeight: '320px' }}>
              <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/5">
                <span className="text-xs font-semibold text-slate-400">
                  {noteResult ? `Result — ${NOTE_MODES.find(m => m.id === noteMode)?.label}` : 'Result'}
                </span>
                {noteResult && (
                  <div className="flex items-center gap-2">
                    {notePoints > 0 && (
                      <span className="text-[10px] font-semibold text-green-300">+{notePoints} pts</span>
                    )}
                    <button onClick={copyNotes} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-blue-400 transition-colors">
                      {noteCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={downloadNotes} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-blue-400 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setNoteResult('')} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                {noteLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-600">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))' }}>
                      <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                    </div>
                    <p className="text-sm text-slate-500">AI is improving your notes…</p>
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                ) : noteResult ? (
                  <div className="prose-study text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(noteResult) }} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-700">
                    <Sparkles className="w-8 h-8 opacity-30" />
                    <p className="text-sm">Your improved notes will appear here</p>
                    <p className="text-xs">Select a mode and paste your notes →</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PDF ANALYZER TAB ───────────────────────────────── */}
      {activeTab === 'pdf' && (
        <div className="space-y-4">

          {/* Analysis type selector */}
          <div className="glass rounded-2xl p-4 border border-white/8 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analysis Type</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {PDF_TYPES.map(type => {
                const isActive = pdfType === type.id;
                const Icon = type.icon;
                return (
                  <button key={type.id} onClick={() => setPdfType(type.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-150 ${
                      isActive ? ACTIVE_COLOR_MAP[type.color] : COLOR_MAP[type.color]
                    }`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[10px] font-semibold leading-tight">{type.label}</span>
                    <span className="text-[9px] opacity-60 leading-tight">{type.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Upload area */}
            <div className="space-y-3">
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => !pdfFile && fileRef.current?.click()}
                className={`glass rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer ${
                  pdfFile
                    ? 'border-green-500/30 bg-green-500/5 cursor-default'
                    : isDragging
                      ? 'border-blue-400/60 bg-blue-500/10'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                }`}
                style={{ minHeight: '180px' }}
              >
                {pdfFile ? (
                  <div className="text-center px-4 py-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: 'rgba(34,197,94,0.15)' }}>
                      <FileText className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-sm font-semibold text-white truncate max-w-[200px]">{pdfFile.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(pdfFile.size / 1024).toFixed(0)} KB</p>
                    <button
                      onClick={e => { e.stopPropagation(); setPdfFile(null); setPdfResult(''); }}
                      className="mt-3 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors mx-auto">
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-center px-6 py-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: 'rgba(99,102,241,0.1)' }}>
                      <Upload className="w-6 h-6 text-indigo-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-300">Drop PDF here</p>
                    <p className="text-xs text-slate-600 mt-1">or click to browse</p>
                    <p className="text-[10px] text-slate-700 mt-2">Max 25MB • Text-based PDFs only</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
                onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />

              {/* Analyze button */}
              <button
                onClick={handleAnalyzePDF}
                disabled={!pdfFile || pdfLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: pdfLoading ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                {pdfLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing PDF…</>
                  : <><Brain className="w-4 h-4" /> Analyze PDF</>
                }
              </button>

              {/* Info box */}
              <div className="glass rounded-xl border border-white/5 p-3 space-y-1.5">
                <p className="text-xs font-semibold text-slate-500">💡 Tips for best results</p>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <p>• Use text-based PDFs (not scanned images)</p>
                  <p>• Works best with textbooks, notes, articles</p>
                  <p>• MCQ mode creates 15 exam-ready questions</p>
                  <p>• Chapter breakdown maps the entire document</p>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="glass rounded-2xl border border-white/8 flex flex-col" style={{ minHeight: '400px' }}>
              <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/5">
                <span className="text-xs font-semibold text-slate-400">
                  {pdfResult
                    ? `${PDF_TYPES.find(t => t.id === pdfType)?.label}${pageCount ? ` · ~${pageCount} pages` : ''}`
                    : 'Analysis Result'}
                </span>
                {pdfResult && (
                  <div className="flex items-center gap-2">
                    {pdfPoints > 0 && (
                      <span className="text-[10px] font-semibold text-green-300">+{pdfPoints} pts</span>
                    )}
                    <button onClick={copyPDF} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-blue-400 transition-colors">
                      {pdfCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={downloadPDF} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-blue-400 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setPdfResult('')} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                {pdfLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))' }}>
                      <Brain className="w-7 h-7 text-indigo-400 animate-pulse" />
                    </div>
                    <p className="text-sm text-slate-500 text-center">
                      AI is reading and analyzing your PDF…<br />
                      <span className="text-xs text-slate-700">This may take 10-30 seconds</span>
                    </p>
                    <div className="flex gap-1">
                      {[0,1,2,3,4].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 animate-bounce"
                          style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </div>
                ) : pdfResult ? (
                  <div className="prose-study text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(pdfResult) }} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-700">
                    <Brain className="w-10 h-10 opacity-20" />
                    <p className="text-sm">Analysis will appear here</p>
                    <p className="text-xs text-center">Upload a PDF and choose<br />analysis type above →</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}