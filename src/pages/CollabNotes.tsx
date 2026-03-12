import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Plus, Search, Pin, Trash2, Share2, Sparkles, BookOpen, X, Check,
  Users, Globe, Lock, Copy, Save, Loader2, ArrowLeft, Wand2, UserPlus,
  MessageSquare, Smile, FileText, AlignLeft, List, Zap, Eye, Edit3,
  ChevronDown, RotateCcw, FlipHorizontal, Brain,
  Bold, Italic, Underline, Heading1, Heading2, List as ListIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { API_URL } from '../utils/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// ── Types ─────────────────────────────────────────────────────
interface Collaborator { userId: string; name: string; canEdit: boolean; }
interface Comment { id: string; userId: string; userName: string; text: string; createdAt: string; resolved: boolean; }
interface FlashCard { q: string; a: string; }
interface Note {
  _id: string; title: string; content: string; format: 'rich' | 'markdown' | 'flashcards'; flashcardCount?: number; contentPreview?: string;
  subject: string; emoji: string; color: string; tags: string[];
  owner: string; ownerName: string;
  collaborators: Collaborator[];
  isPublic: boolean; shareCode: string | null;
  isPinned: boolean; wordCount: number; viewCount: number;
  version: number; lastEditBy: string | null; lastEditAt: string | null;
  comments: Comment[]; reactions: Record<string, {userId:string;name:string}[]>;
  createdAt: string; updatedAt: string;
}

// ── Constants ─────────────────────────────────────────────────
const COLORS: Record<string, {bg:string;border:string;dot:string;text:string;glow:string}> = {
  blue:   {bg:'bg-blue-500/8',   border:'border-blue-500/25',   dot:'bg-blue-500',   text:'text-blue-400',   glow:'shadow-blue-500/10'},
  purple: {bg:'bg-purple-500/8', border:'border-purple-500/25', dot:'bg-purple-500', text:'text-purple-400', glow:'shadow-purple-500/10'},
  green:  {bg:'bg-green-500/8',  border:'border-green-500/25',  dot:'bg-green-500',  text:'text-green-400',  glow:'shadow-green-500/10'},
  orange: {bg:'bg-orange-500/8', border:'border-orange-500/25', dot:'bg-orange-500', text:'text-orange-400', glow:'shadow-orange-500/10'},
  pink:   {bg:'bg-pink-500/8',   border:'border-pink-500/25',   dot:'bg-pink-500',   text:'text-pink-400',   glow:'shadow-pink-500/10'},
  cyan:   {bg:'bg-cyan-500/8',   border:'border-cyan-500/25',   dot:'bg-cyan-500',   text:'text-cyan-400',   glow:'shadow-cyan-500/10'},
};
const SUBJECTS = ['General','Mathematics','Physics','Chemistry','Biology','History','Geography','Economics','English','Computer Science','Reasoning','Current Affairs'];
const EMOJIS   = ['📝','📚','🔬','⚗️','🧮','🌏','💡','⚡','🎯','🧠','📊','🔭','🧪','📐','🗺️','📖','✏️','🏆','🔑','💎'];
const REACT_EMOJIS = ['👍','🔥','💡','❤️','🎯','😮','👏','⭐'];
const AI_MODES = [
  {id:'improve',    label:'Improve',    icon:Wand2,    desc:'Fix grammar & clarity'},
  {id:'summarize',  label:'Summarize',  icon:AlignLeft,desc:'Key points for revision'},
  {id:'expand',     label:'Expand',     icon:FileText, desc:'Add more detail'},
  {id:'bullets',    label:'Bullets',    icon:ListIcon, desc:'Convert to bullets'},
  {id:'flashcards', label:'Flashcards', icon:Brain,    desc:'Generate flashcards'},
  {id:'quiz',       label:'Quick Quiz', icon:Zap,      desc:'3 MCQs for self-test'},
];

function timeAgo(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d/60000);
  if (m<1) return 'just now';
  if (m<60) return `${m}m ago`;
  const h = Math.floor(m/60);
  if (h<24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}

// ── Rich Text Toolbar ─────────────────────────────────────────
function RichToolbar({ editorRef }: { editorRef: React.RefObject<HTMLDivElement | null> }) {
  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
  };
  const btns = [
    { icon: Bold,      cmd: 'bold',           title: 'Bold (Ctrl+B)' },
    { icon: Italic,    cmd: 'italic',         title: 'Italic (Ctrl+I)' },
    { icon: Underline, cmd: 'underline',      title: 'Underline (Ctrl+U)' },
    { icon: Heading1,  cmd: 'formatBlock',    val: 'h2', title: 'Heading' },
    { icon: ListIcon,  cmd: 'insertUnorderedList', title: 'Bullet list' },
    { icon: List,      cmd: 'insertOrderedList',   title: 'Numbered list' },
  ];
  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-white/8 flex-shrink-0 flex-wrap">
      {btns.map(b => (
        <button key={b.cmd+b.title} title={b.title}
          onMouseDown={e => { e.preventDefault(); exec(b.cmd, b.val); }}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors">
          <b.icon className="w-3.5 h-3.5" />
        </button>
      ))}
      <div className="w-px h-4 bg-white/10 mx-1" />
      <button title="Clear formatting" onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }}
        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors">
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Card color palettes ───────────────────────────────────────
const CARD_PALETTES = [
  { bg: 'from-violet-600/30 to-purple-700/20',  border: 'border-violet-500/40',  accent: '#a78bfa', label: 'bg-violet-500/20 text-violet-300' },
  { bg: 'from-cyan-500/30 to-blue-600/20',      border: 'border-cyan-500/40',    accent: '#67e8f9', label: 'bg-cyan-500/20 text-cyan-300' },
  { bg: 'from-rose-500/30 to-pink-600/20',      border: 'border-rose-500/40',    accent: '#fb7185', label: 'bg-rose-500/20 text-rose-300' },
  { bg: 'from-amber-500/30 to-orange-600/20',   border: 'border-amber-500/40',   accent: '#fbbf24', label: 'bg-amber-500/20 text-amber-300' },
  { bg: 'from-emerald-500/30 to-teal-600/20',   border: 'border-emerald-500/40', accent: '#34d399', label: 'bg-emerald-500/20 text-emerald-300' },
  { bg: 'from-sky-500/30 to-indigo-600/20',     border: 'border-sky-500/40',     accent: '#38bdf8', label: 'bg-sky-500/20 text-sky-300' },
  { bg: 'from-fuchsia-500/30 to-purple-600/20', border: 'border-fuchsia-500/40', accent: '#e879f9', label: 'bg-fuchsia-500/20 text-fuchsia-300' },
  { bg: 'from-lime-500/30 to-green-600/20',     border: 'border-lime-500/40',    accent: '#a3e635', label: 'bg-lime-500/20 text-lime-300' },
];

// ── Flashcard Editor ──────────────────────────────────────────
function FlashcardEditor({ cards, onChange, canEdit }: {
  cards: FlashCard[]; onChange: (c: FlashCard[]) => void; canEdit: boolean;
}) {
  const [flipped,  setFlipped]  = useState<Record<number, boolean>>({});
  const [animating, setAnimating] = useState<Record<number, boolean>>({});
  const [study,    setStudy]    = useState(false);
  const [studyIdx, setStudyIdx] = useState(0);
  const [direction, setDirection] = useState<'next'|'prev'>('next');
  const [sliding,  setSliding]  = useState(false);

  const add = () => onChange([...cards, { q: '', a: '' }]);
  const update = (i: number, field: 'q'|'a', val: string) => {
    onChange(cards.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  };
  const remove = (i: number) => onChange(cards.filter((_, idx) => idx !== i));

  const flipCard = (idx: number) => {
    if (animating[idx]) return;
    setAnimating(p => ({ ...p, [idx]: true }));
    setTimeout(() => {
      setFlipped(p => ({ ...p, [idx]: !p[idx] }));
      setAnimating(p => ({ ...p, [idx]: false }));
    }, 150);
  };

  const navigate = (dir: 'next'|'prev') => {
    if (sliding) return;
    setDirection(dir);
    setSliding(true);
    setTimeout(() => {
      setStudyIdx(p => dir === 'next' ? Math.min(cards.length-1, p+1) : Math.max(0, p-1));
      setFlipped({});
      setSliding(false);
    }, 200);
  };

  // ── Study Mode ──────────────────────────────────────────────
  if (study && cards.length > 0) {
    const card = cards[studyIdx];
    const palette = CARD_PALETTES[studyIdx % CARD_PALETTES.length];
    const isFlipped = !!flipped[studyIdx];
    const isAnim    = !!animating[studyIdx];

    return (
      <div className="flex flex-col flex-1 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0d20 100%)' }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-[80px] opacity-20"
            style={{ background: palette.accent }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 relative z-10">
          <button onClick={() => { setStudy(false); setFlipped({}); setStudyIdx(0); }}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Exit
          </button>
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <button key={i} onClick={() => { setStudyIdx(i); setFlipped({}); }}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === studyIdx ? 20 : 6,
                  height: 6,
                  background: i === studyIdx ? palette.accent : 'rgba(255,255,255,0.15)',
                }} />
            ))}
          </div>
          <span className="text-xs font-mono text-slate-500">{studyIdx + 1} / {cards.length}</span>
        </div>

        {/* Card */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 relative z-10">
          <div
            style={{ perspective: '1000px', width: '100%', maxWidth: 480 }}
            onClick={() => flipCard(studyIdx)}>
            <div style={{
              position: 'relative',
              width: '100%',
              minHeight: 240,
              transformStyle: 'preserve-3d',
              transform: isAnim
                ? (isFlipped ? 'rotateY(-90deg)' : 'rotateY(90deg)')
                : 'rotateY(0deg)',
              transition: 'transform 0.15s cubic-bezier(0.4,0,0.2,1)',
              cursor: 'pointer',
            }}>
              <div className={`absolute inset-0 rounded-2xl border bg-gradient-to-br ${palette.bg} ${palette.border} p-6 flex flex-col items-center justify-center gap-3 select-none`}
                style={{ backfaceVisibility: 'hidden' }}>
                {/* Decorative corner dots */}
                <div className="absolute top-3 left-3 w-2 h-2 rounded-full opacity-40" style={{ background: palette.accent }} />
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full opacity-40" style={{ background: palette.accent }} />
                <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full opacity-40" style={{ background: palette.accent }} />
                <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full opacity-40" style={{ background: palette.accent }} />

                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full ${palette.label}`}>
                  {isFlipped ? '✓ Answer' : '? Question'}
                </span>
                <p className="text-white text-base font-medium text-center leading-relaxed">
                  {isFlipped ? card.a : card.q}
                </p>
                <span className="text-[10px] text-white/30 mt-2">tap to flip</span>
              </div>
            </div>
          </div>

          {/* Know it / Still learning */}
          {isFlipped && (
            <div className="flex gap-3 mt-4 w-full max-w-[480px]">
              <button onClick={() => navigate('next')} disabled={studyIdx === cards.length-1}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all disabled:opacity-30"
                style={{ background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)', color: '#34d399' }}>
                ✓ Got it!
              </button>
              <button onClick={() => navigate('prev')} disabled={studyIdx === 0}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all disabled:opacity-30"
                style={{ background: 'rgba(251,113,133,0.1)', borderColor: 'rgba(251,113,133,0.3)', color: '#fb7185' }}>
                ↩ Review again
              </button>
            </div>
          )}
        </div>

        {/* Nav arrows */}
        <div className="flex justify-center gap-4 px-5 pb-6 pt-2 relative z-10">
          <button onClick={() => navigate('prev')} disabled={studyIdx === 0}
            className="px-8 py-2.5 rounded-xl text-sm font-medium border border-white/10 bg-white/5 text-slate-400 disabled:opacity-20 hover:text-white hover:bg-white/10 transition-all">
            ← Prev
          </button>
          <button onClick={() => navigate('next')} disabled={studyIdx === cards.length-1}
            className="px-8 py-2.5 rounded-xl text-sm font-medium border border-white/10 bg-white/5 text-slate-400 disabled:opacity-20 hover:text-white hover:bg-white/10 transition-all">
            Next →
          </button>
        </div>
      </div>
    );
  }

  // ── Edit / List View ─────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-500 font-medium">
          {cards.length} {cards.length !== 1 ? 'flashcards' : 'flashcard'}
        </span>
        <div className="flex gap-2">
          {cards.length > 0 && (
            <button onClick={() => { setStudy(true); setStudyIdx(0); setFlipped({}); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(168,85,247,0.15))', border: '1px solid rgba(139,92,246,0.4)', color: '#c4b5fd' }}>
              <Brain className="w-3.5 h-3.5" /> Study Mode
            </button>
          )}
          {canEdit && (
            <button onClick={add}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.15))', border: '1px solid rgba(59,130,246,0.4)', color: '#93c5fd' }}>
              <Plus className="w-3.5 h-3.5" /> Add Card
            </button>
          )}
        </div>
      </div>

      {/* Card grid */}
      <div className="space-y-3">
        {cards.map((card, i) => {
          const p = CARD_PALETTES[i % CARD_PALETTES.length];
          const isF = !!flipped[i];
          const isA = !!animating[i];
          return (
            <div key={i} className={`rounded-2xl border bg-gradient-to-br ${p.bg} ${p.border} overflow-hidden`}>
              {/* Card number badge */}
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full ${p.label}`}>
                  Card {i + 1}
                </span>
                {canEdit && (
                  <button onClick={() => remove(i)}
                    className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Flip preview (click to flip in list too) */}
              <div className="px-4 pb-1 pt-1" style={{ perspective: '600px' }}>
                <div
                  onClick={() => !canEdit && flipCard(i)}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isA ? (isF ? 'rotateX(-90deg)' : 'rotateX(90deg)') : 'rotateX(0deg)',
                    transition: 'transform 0.15s ease',
                    cursor: !canEdit ? 'pointer' : 'default',
                  }}>
                  {canEdit ? (
                    <div className="space-y-2 pb-3">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest font-bold mb-1 block" style={{ color: p.accent }}>Q</label>
                        <input value={card.q} onChange={e => update(i,'q',e.target.value)}
                          placeholder="Type your question…"
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest font-bold mb-1 block" style={{ color: p.accent }}>A</label>
                        <input value={card.a} onChange={e => update(i,'a',e.target.value)}
                          placeholder="Type the answer…"
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors" />
                      </div>
                    </div>
                  ) : (
                    <div className="pb-3 text-center">
                      <p className="text-[9px] uppercase tracking-widest font-bold mb-1.5" style={{ color: p.accent }}>
                        {isF ? 'Answer' : 'Question'}
                      </p>
                      <p className="text-white text-sm font-medium">{isF ? card.a : card.q}</p>
                      <p className="text-[9px] text-white/25 mt-2">tap to flip</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.1))', border: '1px solid rgba(139,92,246,0.25)' }}>
            🃏
          </div>
          <div>
            <p className="text-white/60 text-sm font-medium">No flashcards yet</p>
            <p className="text-white/25 text-xs mt-0.5">Add your first card to start studying</p>
          </div>
          {canEdit && (
            <button onClick={add}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))', border: '1px solid rgba(139,92,246,0.4)', color: '#c4b5fd' }}>
              <Plus className="w-4 h-4" /> Add first card
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Note Card ─────────────────────────────────────────────────
function NoteCard({ note, isOwner, onOpen, onPin, onDelete, onShare }: {
  note: Note; isOwner: boolean;
  onOpen: () => void; onPin: () => void; onDelete: () => void; onShare: () => void;
}) {
  const c = COLORS[note.color] || COLORS.blue;
  const fcCount = note.flashcardCount ?? (note.content ? (() => { try { return JSON.parse(note.content).length; } catch { return 0; } })() : 0);
  const preview = note.format === 'flashcards'
    ? `${fcCount} flashcard${fcCount !== 1 ? 's' : ''}`
    : (note.contentPreview || (note.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150) || 'No content yet…');
  const totalReactions = Object.values(note.reactions || {}).reduce((s, a) => s + a.length, 0);

  return (
    <div onClick={onOpen}
      className={`group relative rounded-2xl border p-4 cursor-pointer transition-all duration-200 hover:scale-[1.015] hover:shadow-lg ${c.bg} ${c.border} ${c.glow}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl flex-shrink-0">{note.emoji}</span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white leading-tight truncate">{note.title}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-500">{note.subject}</span>
              <span className="text-[10px] text-slate-700">·</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
                {note.format === 'flashcards' ? '🃏 Cards' : note.format === 'markdown' ? '# MD' : '✍️ Rich'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
          {isOwner && <button onClick={e => { e.stopPropagation(); onShare(); }}
            className="p-1 rounded-lg text-slate-600 hover:text-blue-400 transition-colors" title="Share"><Share2 className="w-3 h-3" /></button>}
          {isOwner && <button onClick={e => { e.stopPropagation(); onPin(); }}
            className={`p-1 rounded-lg transition-colors ${note.isPinned ? 'text-orange-400' : 'text-slate-600 hover:text-slate-400'}`}><Pin className="w-3 h-3" /></button>}
          {isOwner && <button onClick={e => { e.stopPropagation(); onDelete(); }}
            className="p-1 rounded-lg text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="w-3 h-3" /></button>}
        </div>
      </div>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{preview}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {note.isPinned && <Pin className="w-3 h-3 text-orange-400" />}
          {note.isPublic && <Globe className="w-3 h-3 text-green-400" />}
          {(note.collaborators?.length ?? 0) > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-slate-500"><Users className="w-3 h-3" />{note.collaborators.length}</span>
          )}
          {(note.comments?.length ?? 0) > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-slate-500"><MessageSquare className="w-3 h-3" />{note.comments.length}</span>
          )}
          {totalReactions > 0 && <span className="text-[10px] text-slate-500">· {totalReactions} reactions</span>}
        </div>
        <span className="text-[10px] text-slate-600">{timeAgo(note.updatedAt)}</span>
      </div>
      {!isOwner && (
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">
          <span className="text-[9px] text-purple-400">shared</span>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export function CollabNotes() {
  const { userId } = useApp();
  const { code: sharedCode } = useParams<{ code?: string }>();
  const [notes,     setNotes]     = useState<Note[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [view,      setView]      = useState<'list'|'editor'>('list');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isOwner,   setIsOwner]   = useState(false);
  const [canEditNote, setCanEditNote] = useState(false);
  const [search,    setSearch]    = useState('');
  const [filterSub, setFilterSub] = useState('All');

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle,   setNewTitle]   = useState('');
  const [newSubject, setNewSubject] = useState('General');
  const [newEmoji,   setNewEmoji]   = useState('📝');
  const [newColor,   setNewColor]   = useState('blue');
  const [newFormat,  setNewFormat]  = useState<'rich'|'markdown'|'flashcards'>('rich');
  const [creating,   setCreating]   = useState(false);

  // Editor
  const editorRef      = useRef<HTMLDivElement>(null);
  const activeNoteRef  = useRef<Note | null>(null);
  const editTitleRef   = useRef<string>('');
  const [editTitle, setEditTitle]   = useState('');
  // Sync refs so callbacks always see latest values
  useEffect(() => { activeNoteRef.current = activeNote; }, [activeNote]);
  useEffect(() => { editTitleRef.current  = editTitle;  }, [editTitle]);
  const [mdContent, setMdContent]   = useState('');
  const [fcCards,   setFcCards]     = useState<FlashCard[]>([]);
  const [saving,    setSaving]      = useState(false);
  const [saved,     setSaved]       = useState(false);
  const [version,   setVersion]     = useState(0);
  const saveTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pendingRichContent, setPendingRichContent] = useState<string | null>(null);
  const pollTimer   = useRef<ReturnType<typeof setInterval> | null>(null);

  // Panels
  const [panel,     setPanel]       = useState<null|'share'|'ai'|'comments'|'reactions'>( null);

  // Share
  const [deleteModal,  setDeleteModal]  = useState<{id: string; title: string; emoji: string} | null>(null);
  const [deleting,     setDeleting]     = useState(false);
  const [enterCode,    setEnterCode]    = useState('');
  const [enterCodeMsg, setEnterCodeMsg] = useState('');
  const [enteringCode, setEnteringCode] = useState(false);
  const [shareUsername, setShareUsername] = useState('');
  const [shareCanEdit,  setShareCanEdit]  = useState(false);
  const [sharing,       setSharing]       = useState(false);
  const [shareMsg,      setShareMsg]      = useState('');
  const [copied,        setCopied]        = useState(false);

  // AI
  const [aiMode,    setAiMode]    = useState('improve');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult,  setAiResult]  = useState<{text:string;mode:string;parseError?:boolean;formatError?:boolean}|null>(null);

  // Comments
  const [newComment,  setNewComment]  = useState('');
  const [addingComment, setAddingComment] = useState(false);

  // ── Fetch list ───────────────────────────────────────────────
  const fetchNotes = useCallback(async () => {
    try {
      const r = await fetch(`${API_URL}/api/notes`, { headers: authHeaders() });
      const d = await r.json();
      if (d.success) setNotes(d.notes);
    } catch {} finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  // ── Auto-open shared note from URL (/app/notes/shared/:code)
  useEffect(() => {
    if (!sharedCode) return;
    const openShared = async () => {
      try {
        const r = await fetch(`${API_URL}/api/notes/shared/${sharedCode}`, { headers: authHeaders() });
        const d = await r.json();
        if (d.success) {
          setActiveNote(d.note);
          setIsOwner(d.isOwner);
          setCanEditNote(d.canEdit);
          setEditTitle(d.note.title);
          setVersion(d.note.version || 0);
          setPanel(null);
          setAiResult(null);
          if (d.note.format === 'markdown') {
            setMdContent(d.note.content || '');
            setPendingRichContent(null);
          } else if (d.note.format === 'flashcards') {
            try { setFcCards(JSON.parse(d.note.content || '[]')); } catch { setFcCards([]); }
            setPendingRichContent(null);
          } else {
            setPendingRichContent(d.note.content || '');
          }
          setView('editor');
        }
      } catch {}
    };
    openShared();
  }, [sharedCode]);

  // ── Open note ────────────────────────────────────────────────
  const openNote = async (id: string) => {
    try {
      const r = await fetch(`${API_URL}/api/notes/${id}`, { headers: authHeaders() });
      const d = await r.json();
      if (!d.success) return;
      setActiveNote(d.note);
      setIsOwner(d.isOwner);
      setCanEditNote(d.canEdit);
      setEditTitle(d.note.title);
      setVersion(d.note.version || 0);
      setPanel(null);
      setAiResult(null);
      if (d.note.format === 'markdown') {
        setMdContent(d.note.content || '');
        setPendingRichContent(null);
      } else if (d.note.format === 'flashcards') {
        try { setFcCards(JSON.parse(d.note.content || '[]')); } catch { setFcCards([]); }
        setPendingRichContent(null);
      } else {
        // Rich: store content, useEffect will inject after editor mounts
        setPendingRichContent(d.note.content || '');
      }
      setView('editor');
    } catch {}
  };

  // ── Inject rich content after editor mounts
  useEffect(() => {
    if (view === 'editor' && pendingRichContent !== null && editorRef.current) {
      editorRef.current.innerHTML = pendingRichContent;
      setPendingRichContent(null);
    }
  }, [view, pendingRichContent]);

  // ── Real-time polling ────────────────────────────────────────
  useEffect(() => {
    if (view !== 'editor' || !activeNote) return;
    pollTimer.current = setInterval(async () => {
      try {
        const r = await fetch(`${API_URL}/api/notes/${activeNote._id}/poll?v=${version}`, { headers: authHeaders() });
        const d = await r.json();
        if (d.changed && d.note) {
          setActiveNote(d.note);
          setVersion(d.version);
          // Update content only if someone else edited
          if (d.note.lastEditBy !== localStorage.getItem('userName')) {
            if (d.note.format === 'markdown') setMdContent(d.note.content || '');
            else if (d.note.format === 'flashcards') {
              try { setFcCards(JSON.parse(d.note.content || '[]')); } catch {}
            } else if (editorRef.current && document.activeElement !== editorRef.current) {
              editorRef.current.innerHTML = d.note.content || '';
            }
          }
        }
      } catch {}
    }, 3000); // poll every 3s
    return () => { if (pollTimer.current) clearInterval(pollTimer.current); };
  }, [view, activeNote, version]);

  // ── Save ─────────────────────────────────────────────────────
  const triggerSave = useCallback((title: string, content: string) => {
    if (!activeNote || !canEditNote) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        const r = await fetch(`${API_URL}/api/notes/${activeNote._id}`, {
          method: 'PUT', headers: authHeaders(),
          body: JSON.stringify({ title, content }),
        });
        const d = await r.json();
        if (d.success) { setSaved(true); setVersion(d.version); setTimeout(() => setSaved(false), 2000); fetchNotes(); }
      } catch {} finally { setSaving(false); }
    }, 1500);
  }, [activeNote, canEditNote, fetchNotes]);

  const handleTitleChange  = (v: string) => { setEditTitle(v); triggerSave(v, getContent()); };
  const handleRichChange   = ()          => { triggerSave(editTitle, editorRef.current?.innerHTML || ''); };
  const handleMdChange     = (v: string) => { setMdContent(v); triggerSave(editTitle, v); };
  const handleFcChange     = (c: FlashCard[]) => { setFcCards(c); triggerSave(editTitle, JSON.stringify(c)); };

  const getContent = () => {
    if (!activeNote) return '';
    if (activeNote.format === 'markdown')   return mdContent;
    if (activeNote.format === 'flashcards') return JSON.stringify(fcCards);
    return editorRef.current?.innerHTML || '';
  };

  // ── Create ───────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const r = await fetch(`${API_URL}/api/notes`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ title: newTitle, format: newFormat, subject: newSubject, emoji: newEmoji, color: newColor,
          content: newFormat === 'flashcards' ? '[]' : '' }),
      });
      const d = await r.json();
      if (d.success) {
        setShowCreate(false); setNewTitle(''); setNewSubject('General'); setNewEmoji('📝'); setNewColor('blue'); setNewFormat('rich');
        await openNote(d.note._id);  // await so editor state is set before creating finishes
        fetchNotes();                 // refresh list in background
      }
    } catch {} finally { setCreating(false); }
  };

  // ── Delete / Pin ─────────────────────────────────────────────
  const confirmDelete = (note: Note) => {
    setDeleteModal({ id: note._id, title: note.title, emoji: note.emoji });
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await fetch(`${API_URL}/api/notes/${deleteModal.id}`, { method: 'DELETE', headers: authHeaders() });
      setNotes(p => p.filter(n => n._id !== deleteModal.id));
      if (activeNote?._id === deleteModal.id) { setView('list'); setActiveNote(null); }
      setDeleteModal(null);
    } catch {} finally { setDeleting(false); }
  };
  const handlePin = async (note: Note) => {
    await fetch(`${API_URL}/api/notes/${note._id}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify({ isPinned: !note.isPinned }),
    });
    fetchNotes();
  };

  // ── Share ────────────────────────────────────────────────────
  const handleShare = async (makePublic = false, makePrivate = false) => {
    if (!activeNote) return;
    setSharing(true); setShareMsg('');
    try {
      const r = await fetch(`${API_URL}/api/notes/${activeNote._id}/share`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ username: shareUsername.trim(), canEdit: shareCanEdit, makePublic, makePrivate }),
      });
      const d = await r.json();
      if (d.success) {
        setActiveNote(p => p ? { ...p, shareCode: d.shareCode, isPublic: d.isPublic, collaborators: d.collaborators } : p);
        setShareUsername('');
        if (makePrivate) setShareMsg('🔒 Note set to private');
        else if (makePublic) setShareMsg('🌐 Note is now public');
        else if (shareUsername) setShareMsg(`✅ Added ${shareUsername}!`);
        else setShareMsg('✅ Code generated!');
      } else setShareMsg(`❌ ${d.message}`);
    } catch { setShareMsg('❌ Error'); } finally { setSharing(false); }
  };
  const handleRemoveCollab = async (uid: string) => {
    if (!activeNote) return;
    const r = await fetch(`${API_URL}/api/notes/${activeNote._id}/collab`, {
      method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ userId: uid }),
    });
    const d = await r.json();
    if (d.success) setActiveNote(p => p ? { ...p, collaborators: d.collaborators } : p);
  };
  const copyLink = () => {
    if (!activeNote?.shareCode) return;
    navigator.clipboard.writeText(`${window.location.origin}/#/app/notes/shared/${activeNote.shareCode}`)
      // URL format matches App.tsx route: /app/notes/shared/:code
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  // ── AI ───────────────────────────────────────────────────────
  const handleAI = async () => {
    if (!activeNote) return;
    setAiLoading(true); setAiResult(null);
    try {
      const r = await fetch(`${API_URL}/api/notes/${activeNote._id}/ai`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ mode: aiMode }),
      });
      const d = await r.json();
      if (d.success) setAiResult({ text: d.result, mode: d.mode });
    } catch {} finally { setAiLoading(false); }
  };

  const applyAI = async () => {
    // Use ref to always get latest activeNote — avoids stale closure
    const note = activeNoteRef.current;
    if (!aiResult || !note) return;

    const m = aiResult.mode;
    let newContent = aiResult.text;

    // SAFETY GUARD: never overwrite flashcard JSON with plain text
    // Only 'flashcards' mode can write to a flashcard-format note
    if (note.format === 'flashcards' && m !== 'flashcards') {
      setAiResult(prev => prev ? { ...prev, formatError: true } : null);
      return;
    }

    if (m === 'flashcards') {
      // AI returns JSON string — parse and set flashcards
      try {
        const raw = aiResult.text.trim();
        // Strip markdown code fences if AI wrapped in ```json
        const clean = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
        const cards = JSON.parse(clean);
        if (!Array.isArray(cards)) throw new Error('Not array');
        setFcCards(cards);
        newContent = JSON.stringify(cards);
      } catch {
        setAiResult(prev => prev ? { ...prev, parseError: true } : null);
        return;
      }
    } else if (note.format === 'rich') {
      // Convert plain text lines to HTML paragraphs
      const html = aiResult.text
        .split('\n')
        .filter(l => l.trim())
        .map(l => `<p>${l.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
        .join('');
      newContent = html;
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
      }
    } else {
      // Markdown format
      newContent = aiResult.text;
      setMdContent(aiResult.text);
    }

    // Clear result first so panel closes
    setAiResult(null);

    // Save immediately — bypass debounce
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaving(true);
    try {
      const r = await fetch(`${API_URL}/api/notes/${note._id}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ title: editTitleRef.current, content: newContent }),
      });
      const d = await r.json();
      if (d.success) {
        setVersion(d.version);
        setActiveNote(prev => prev ? { ...prev, content: newContent, version: d.version } : prev);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        fetchNotes();
      }
    } catch {} finally { setSaving(false); }
  };

  // ── Open note by code ───────────────────────────────────────
  const openByCode = async () => {
    if (!enterCode.trim()) return;
    setEnteringCode(true); setEnterCodeMsg('');
    try {
      const r = await fetch(`${API_URL}/api/notes/shared/${enterCode.trim().toUpperCase()}`, { headers: authHeaders() });
      const d = await r.json();
      if (d.success) {
        setActiveNote(d.note);
        setIsOwner(d.isOwner);
        setCanEditNote(d.canEdit);
        setEditTitle(d.note.title);
        setVersion(d.note.version || 0);
        setPanel(null); setAiResult(null);
        if (d.note.format === 'markdown') { setMdContent(d.note.content || ''); setPendingRichContent(null); }
        else if (d.note.format === 'flashcards') { try { setFcCards(JSON.parse(d.note.content || '[]')); } catch { setFcCards([]); } setPendingRichContent(null); }
        else { setPendingRichContent(d.note.content || ''); }
        setEnterCode(''); setView('editor');
      } else {
        setEnterCodeMsg(d.message || 'Invalid code or note is private');
      }
    } catch { setEnterCodeMsg('Something went wrong'); } finally { setEnteringCode(false); }
  };

  // ── Comments ─────────────────────────────────────────────────
  const addComment = async () => {
    if (!activeNote || !newComment.trim()) return;
    setAddingComment(true);
    try {
      const r = await fetch(`${API_URL}/api/notes/${activeNote._id}/comment`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ text: newComment }),
      });
      const d = await r.json();
      if (d.success) { setActiveNote(p => p ? { ...p, comments: d.comments, version: p.version+1 } : p); setNewComment(''); }
    } catch {} finally { setAddingComment(false); }
  };
  const deleteComment = async (cid: string) => {
    if (!activeNote) return;
    const r = await fetch(`${API_URL}/api/notes/${activeNote._id}/comment/${cid}`, { method: 'DELETE', headers: authHeaders() });
    const d = await r.json();
    if (d.success) setActiveNote(p => p ? { ...p, comments: d.comments } : p);
  };

  // ── Reactions ────────────────────────────────────────────────
  const toggleReaction = async (emoji: string) => {
    if (!activeNote) return;
    const r = await fetch(`${API_URL}/api/notes/${activeNote._id}/react`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify({ emoji }),
    });
    const d = await r.json();
    if (d.success) setActiveNote(p => p ? { ...p, reactions: d.reactions, version: p.version+1 } : p);
  };

  // ── Filter ───────────────────────────────────────────────────
  const filtered  = notes.filter(n => {
    const ms = !search || n.title.toLowerCase().includes(search.toLowerCase());
    const mf = filterSub === 'All' || n.subject === filterSub;
    return ms && mf;
  });
  const pinned   = filtered.filter(n => n.isPinned);
  const unpinned = filtered.filter(n => !n.isPinned);
  const subjects = ['All', ...Array.from(new Set(notes.map(n => n.subject)))];
  const c = activeNote ? (COLORS[activeNote.color] || COLORS.blue) : COLORS.blue;

  // ──────────────────────────────────────────────────────────────
  // EDITOR
  // ──────────────────────────────────────────────────────────────
  if (view === 'editor' && activeNote) {
    const reactions = activeNote.reactions || {};
    const comments  = activeNote.comments  || [];

    return (
      <div className="flex h-full -mx-3 -mt-3 sm:-mx-4 sm:-mt-4 md:-mx-8 md:-mt-8 overflow-hidden">

        {/* ── Main editor column ── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

          {/* Topbar */}
          <div className={`flex items-center justify-between px-4 py-2.5 border-b ${c.border} flex-shrink-0 bg-[#060914]`}>
            <button onClick={() => { setView('list'); setActiveNote(null); if(pollTimer.current) clearInterval(pollTimer.current); }}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Notes
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] transition-opacity mr-1 ${saving ? 'text-slate-500 opacity-100' : saved ? 'text-green-400 opacity-100' : 'opacity-0'}`}>
                {saving ? 'Saving…' : '✓ Saved'}
              </span>
              {/* Panel buttons */}
              {[
                { id: 'reactions' as const, icon: Smile,          label: `${Object.values(reactions).reduce((s,a)=>s+a.length,0)||''}`, show: true },
                { id: 'comments'  as const, icon: MessageSquare,  label: `${comments.length||''}`,         show: true },
                { id: 'ai'        as const, icon: Wand2,          label: 'AI',                              show: canEditNote },
                { id: 'share'     as const, icon: Share2,         label: 'Share',                           show: isOwner },
              ].filter(b => b.show).map(b => (
                <button key={b.id} onClick={() => setPanel(p => p === b.id ? null : b.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs transition-all border
                    ${panel === b.id ? `${c.bg} ${c.border} ${c.text}` : 'bg-white/[0.02] border-white/8 text-slate-500 hover:text-white hover:border-white/15'}`}>
                  <b.icon className="w-3.5 h-3.5" />{b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className={`flex items-center gap-3 px-5 py-3 border-b ${c.border} flex-shrink-0`}>
            <span className="text-2xl">{activeNote.emoji}</span>
            <input value={editTitle} onChange={e => handleTitleChange(e.target.value)} disabled={!canEditNote}
              placeholder="Note title…"
              className="flex-1 bg-transparent text-white font-semibold text-lg placeholder-slate-600 outline-none disabled:cursor-default" />
            <div className="flex items-center gap-2 text-[10px] text-slate-600 flex-shrink-0">
              {activeNote.lastEditBy && <span>Last: {activeNote.lastEditBy}</span>}
              {!canEditNote && <span className="px-1.5 py-0.5 rounded-full bg-slate-500/15 text-slate-400 border border-slate-500/20">View only</span>}
            </div>
          </div>

          {/* Rich toolbar */}
          {activeNote.format === 'rich' && canEditNote && <RichToolbar editorRef={editorRef} />}

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {activeNote.format === 'rich' && (
              <div ref={editorRef} contentEditable={canEditNote} suppressContentEditableWarning
                onInput={handleRichChange}
                data-placeholder={canEditNote ? 'Start writing… (supports bold, italic, headings, lists)' : 'View only'}
                className={`flex-1 overflow-y-auto px-5 py-4 text-sm text-slate-200 leading-relaxed outline-none
                  [&_h2]:text-white [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-3 [&_h2]:mb-1
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                  [&_li]:text-slate-300 [&_b]:text-white [&_strong]:text-white [&_em]:text-slate-300
                  empty:before:content-[attr(data-placeholder)] empty:before:text-slate-700 empty:before:pointer-events-none
                  ${!canEditNote ? 'cursor-default' : ''}`}
              />
            )}
            {activeNote.format === 'markdown' && (
              <textarea value={mdContent} onChange={e => handleMdChange(e.target.value)} disabled={!canEditNote}
                placeholder={canEditNote ? '# Heading\n**bold** *italic*\n- bullet\n1. numbered\n\nWrite in Markdown…' : 'View only'}
                className="flex-1 bg-transparent text-slate-200 placeholder-slate-700 resize-none outline-none px-5 py-4 text-sm leading-relaxed font-mono disabled:cursor-default" />
            )}
            {activeNote.format === 'flashcards' && (
              <FlashcardEditor cards={fcCards} onChange={handleFcChange} canEdit={canEditNote} />
            )}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-between px-5 py-2 border-t ${c.border} flex-shrink-0 bg-[#060914]`}>
            <span className="text-[10px] text-slate-600">{activeNote.wordCount || 0} words · v{activeNote.version || 0}</span>
            <span className="text-[10px] text-slate-600">{activeNote.subject} · {timeAgo(activeNote.updatedAt)}</span>
          </div>
        </div>

        {/* ── Right panel ── */}
        {panel && (
          <div className={`w-72 border-l ${c.border} flex flex-col overflow-hidden bg-[#060914] flex-shrink-0`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${c.border} flex-shrink-0`}>
              <h3 className="text-sm font-semibold text-white capitalize">{panel}</h3>
              <button onClick={() => setPanel(null)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            {/* REACTIONS */}
            {panel === 'reactions' && (
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div className="flex flex-wrap gap-2">
                  {REACT_EMOJIS.map(e => {
                    const users = reactions[e] || [];
                    const reacted = users.some(u => u.userId === userId);
                    return (
                      <button key={e} onClick={() => toggleReaction(e)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all
                          ${reacted ? `${c.bg} ${c.border} ${c.text}` : 'bg-white/[0.03] border-white/8 text-slate-400 hover:border-white/20 hover:text-white'}`}>
                        {e} {users.length > 0 && <span className="text-xs">{users.length}</span>}
                      </button>
                    );
                  })}
                </div>
                {Object.entries(reactions).filter(([,u]) => u.length > 0).map(([e, users]) => (
                  <div key={e} className="space-y-1">
                    <p className="text-[11px] text-slate-500">{e} — {users.length} {users.length===1?'person':'people'}</p>
                    {users.map(u => <p key={u.userId} className="text-xs text-slate-400 pl-2">{u.name}</p>)}
                  </div>
                ))}
                {Object.keys(reactions).length === 0 && <p className="text-slate-600 text-xs text-center py-4">No reactions yet — be the first!</p>}
              </div>
            )}

            {/* COMMENTS */}
            {panel === 'comments' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {comments.map(cm => (
                    <div key={cm.id} className="rounded-xl bg-white/[0.02] border border-white/8 p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[9px] text-white font-bold">
                            {cm.userName?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-[11px] font-medium text-slate-300">{cm.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-600">{timeAgo(cm.createdAt)}</span>
                          {(isOwner || cm.userId === userId) && (
                            <button onClick={() => deleteComment(cm.id)} className="text-slate-700 hover:text-red-400 transition-colors ml-1"><X className="w-3 h-3" /></button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{cm.text}</p>
                    </div>
                  ))}
                  {comments.length === 0 && <p className="text-slate-600 text-xs text-center py-6">No comments yet</p>}
                </div>
                <div className={`p-3 border-t ${c.border} flex-shrink-0`}>
                  <div className="flex gap-2">
                    <input value={newComment} onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && addComment()}
                      placeholder="Add a comment…"
                      className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500/30" />
                    <button onClick={addComment} disabled={addingComment || !newComment.trim()}
                      className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 disabled:opacity-40 hover:bg-blue-500/30 transition-all">
                      {addingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AI ENHANCE */}
            {panel === 'ai' && (
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {activeNote.format === 'flashcards' && (
                  <p className="text-[11px] text-orange-400/80 bg-orange-500/8 border border-orange-500/20 rounded-xl px-3 py-2">
                    🃏 Flashcard note — only "Flashcards" mode will replace cards. Other modes are for Rich/Markdown notes.
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {AI_MODES.map(m => {
                    const disabledForFlashcard = activeNote.format === 'flashcards' && m.id !== 'flashcards';
                    return (
                      <button key={m.id} onClick={() => !disabledForFlashcard && setAiMode(m.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all
                          ${disabledForFlashcard ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:border-purple-500/25'}
                          ${aiMode === m.id && !disabledForFlashcard ? 'bg-purple-500/20 border-purple-500/40' : 'bg-white/[0.02] border-white/8'}`}>
                        <m.icon className="w-3.5 h-3.5 text-purple-400 mb-1.5" />
                        <div className="text-xs font-medium text-white">{m.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{m.desc}</div>
                      </button>
                    );
                  })}
                </div>
                <button onClick={handleAI} disabled={aiLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  {aiLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enhancing…</> : <><Wand2 className="w-3.5 h-3.5" /> Enhance Now</>}
                </button>
                {aiResult && (
                  <div className="space-y-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 max-h-52 overflow-y-auto">
                      <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{aiResult.text}</p>
                    </div>
                    {aiResult?.parseError && (
                      <p className="text-[11px] text-red-400 mt-1">⚠️ Could not parse flashcards. Try generating again.</p>
                    )}
                    {aiResult?.formatError && (
                      <p className="text-[11px] text-orange-400 mt-1">⚠️ This is a Flashcard note — only "Flashcards" mode can be applied here.</p>
                    )}
                    <div className="flex gap-2">
                      <button onClick={applyAI}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-all">
                        <Check className="w-3.5 h-3.5" /> Apply to Note
                      </button>
                      <button onClick={() => setAiResult(null)}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs hover:text-white transition-all">
                        Discard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SHARE */}
            {panel === 'share' && isOwner && (
              <div className="p-4 space-y-4 overflow-y-auto flex-1">

                {/* ── Public / Private toggle ── */}
                <div>
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide mb-2">Visibility</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => activeNote.isPublic && handleShare(false, true)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs transition-all
                        ${!activeNote.isPublic ? 'bg-slate-500/15 border-slate-500/30 text-white' : 'bg-white/[0.02] border-white/8 text-slate-500 hover:border-white/20'}`}>
                      <Lock className="w-4 h-4" />
                      <span className="font-medium">Private</span>
                      <span className="text-[10px] opacity-70">Only collaborators</span>
                    </button>
                    <button onClick={() => !activeNote.isPublic && handleShare(true)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs transition-all
                        ${activeNote.isPublic ? 'bg-green-500/15 border-green-500/30 text-green-300' : 'bg-white/[0.02] border-white/8 text-slate-500 hover:border-green-500/20'}`}>
                      <Globe className="w-4 h-4" />
                      <span className="font-medium">Public</span>
                      <span className="text-[10px] opacity-70">Anyone with code</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-2">
                    {activeNote.isPublic
                      ? '✅ Public — anyone can open via code or link'
                      : '🔒 Private — only added collaborators can access'}
                  </p>
                </div>

                {/* ── Share Code ── */}
                <div>
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide mb-2">Share Code</p>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    {activeNote.shareCode ? (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-2xl font-bold text-white tracking-[0.3em]">{activeNote.shareCode}</span>
                          <button onClick={copyLink}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-500/30 transition-all">
                            {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Link</>}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-600">
                          {activeNote.isPublic
                            ? 'Share this code — anyone can open it'
                            : 'Private — only works for added collaborators'}
                        </p>
                      </>
                    ) : (
                      <button onClick={() => handleShare(false)}
                        className="w-full py-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        Generate code →
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Add Collaborator ── */}
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">Add by Username</p>
                  <input value={shareUsername} onChange={e => setShareUsername(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleShare(false)}
                    placeholder="Friend's username…"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/30" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={shareCanEdit} onChange={e => setShareCanEdit(e.target.checked)} className="accent-blue-500" />
                    <span className="text-xs text-slate-400">Allow editing</span>
                  </label>
                  <button onClick={() => handleShare(false)} disabled={sharing || !shareUsername.trim()}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium disabled:opacity-40 hover:bg-blue-500/30 transition-all">
                    {sharing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />} Add Collaborator
                  </button>
                  {shareMsg && <p className="text-xs">{shareMsg}</p>}
                </div>

                {/* ── Collaborators list ── */}
                {activeNote.collaborators?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">Collaborators ({activeNote.collaborators.length})</p>
                    {activeNote.collaborators.map(col => (
                      <div key={col.userId} className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/8 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                            {col.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-xs text-white truncate max-w-[90px]">{col.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${col.canEdit ? 'bg-green-500/15 text-green-400' : 'bg-slate-500/15 text-slate-400'}`}>
                            {col.canEdit ? 'editor' : 'viewer'}
                          </span>
                        </div>
                        <button onClick={() => handleRemoveCollab(col.userId)} className="text-slate-600 hover:text-red-400 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // LIST VIEW
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" /> Collaborative Notes
          </h1>
          <p className="text-sm text-slate-400 mt-1">Rich text · Markdown · Flashcards · Share with friends</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes…"
            className="w-full bg-white/[0.03] border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/30 transition-colors" />
        </div>
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {subjects.map(s => (
            <button key={s} onClick={() => setFilterSub(s)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all ${filterSub === s ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' : 'bg-white/[0.03] border border-white/8 text-slate-500 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Enter Code Box */}
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-4">
        <p className="text-xs text-slate-500 mb-2 font-medium flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[9px] text-blue-400">↗</span>
          Open a shared note by code
        </p>
        <div className="flex gap-2">
          <input value={enterCode} onChange={e => setEnterCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && openByCode()}
            placeholder="Enter 6-digit code e.g. I3FJ03"
            maxLength={6}
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/40 font-mono tracking-widest uppercase transition-colors" />
          <button onClick={openByCode} disabled={enteringCode || !enterCode.trim()}
            className="px-4 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium disabled:opacity-40 hover:bg-blue-500/30 transition-all flex items-center gap-2">
            {enteringCode ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Open →'}
          </button>
        </div>
        {enterCodeMsg && <p className="text-xs mt-2 text-red-400">{enterCodeMsg}</p>}
      </div>

      {loading && <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-52 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <p className="text-white font-medium">{search ? 'No notes found' : 'No notes yet'}</p>
            <p className="text-slate-500 text-sm mt-1">{search ? 'Try different search' : 'Create your first note!'}</p>
          </div>
          {!search && <button onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm hover:bg-blue-500/30 transition-all">+ Create Note</button>}
        </div>
      )}

      {pinned.length > 0 && (
        <div>
          <p className="text-[11px] text-orange-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5"><Pin className="w-3 h-3" /> Pinned</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pinned.map(n => <NoteCard key={n._id} note={n} isOwner={n.owner === userId} onOpen={() => openNote(n._id)} onPin={() => handlePin(n)} onDelete={() => confirmDelete(n)} onShare={async () => { await openNote(n._id); setPanel('share'); }} />)}
          </div>
        </div>
      )}
      {unpinned.length > 0 && (
        <div>
          {pinned.length > 0 && <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-3">All Notes</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unpinned.map(n => <NoteCard key={n._id} note={n} isOwner={n.owner === userId} onOpen={() => openNote(n._id)} onPin={() => handlePin(n)} onDelete={() => confirmDelete(n)} onShare={async () => { await openNote(n._id); setPanel('share'); }} />)}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteModal(null); }}>
          <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0d1117] p-6 shadow-2xl shadow-red-500/5">

            {/* Icon */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3 text-2xl">
                {deleteModal.emoji}
              </div>
              <h2 className="text-base font-bold text-white">Delete Note?</h2>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                <span className="text-white font-medium">"{deleteModal.title}"</span> will be permanently deleted.
                <br /><span className="text-red-400/80 text-xs">This action cannot be undone.</span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 text-sm font-medium hover:bg-white/[0.06] transition-all">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-semibold hover:bg-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                  : <><Trash2 className="w-4 h-4" /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1117] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">New Note</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {/* Format picker */}
            <div>
              <p className="text-xs text-slate-500 mb-2">Format</p>
              <div className="grid grid-cols-3 gap-2">
                {([['rich','✍️ Rich Text','Bold, headings, lists'],['markdown','# Markdown','Code-style writing'],['flashcards','🃏 Flashcards','Q&A study cards']] as const).map(([f,label,desc]) => (
                  <button key={f} onClick={() => setNewFormat(f)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${newFormat === f ? 'bg-blue-500/20 border-blue-500/40' : 'bg-white/[0.02] border-white/8 hover:border-white/20'}`}>
                    <div className="text-xs font-medium text-white">{label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.03] text-2xl flex items-center justify-center">{newEmoji}</span>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key==='Enter' && handleCreate()}
                placeholder="Note title…" autoFocus
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 outline-none focus:border-blue-500/30 text-sm" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setNewEmoji(e)}
                  className={`w-8 h-8 rounded-lg text-base transition-all ${newEmoji===e ? 'bg-blue-500/20 border border-blue-500/40' : 'hover:bg-white/5'}`}>{e}</button>
              ))}
            </div>

            <select value={newSubject} onChange={e => setNewSubject(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500/30 appearance-none">
              {SUBJECTS.map(s => <option key={s} value={s} className="bg-[#0d1117]">{s}</option>)}
            </select>

            <div className="flex gap-2">
              {Object.entries(COLORS).map(([key, val]) => (
                <button key={key} onClick={() => setNewColor(key)}
                  className={`w-7 h-7 rounded-full ${val.dot} transition-all ${newColor===key ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d1117] scale-110' : 'opacity-50 hover:opacity-80'}`} />
              ))}
            </div>

            <button onClick={handleCreate} disabled={creating || !newTitle.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2">
              {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <><Plus className="w-4 h-4" /> Create Note</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}