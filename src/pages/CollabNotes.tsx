import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus, Search, Pin, Trash2, Share2, Sparkles, BookOpen,
  X, Check, Edit3, Users, Globe, Lock, Copy, ChevronDown,
  Save, Loader2, ArrowLeft, Tag, Palette, Smile,
  FileText, AlignLeft, List, Wand2, UserPlus, Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { API_URL } from '../utils/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// ── Types ─────────────────────────────────────────────────────
interface Collaborator { userId: string; name: string; canEdit: boolean; addedAt: string; }
interface Note {
  _id: string; title: string; content: string; subject: string;
  emoji: string; color: string; tags: string[];
  owner: string; ownerName: string;
  collaborators: Collaborator[];
  isPublic: boolean; shareCode: string | null;
  isPinned: boolean; wordCount: number; viewCount: number;
  lastEditBy: string | null; lastEditAt: string | null;
  createdAt: string; updatedAt: string;
}

// ── Constants ─────────────────────────────────────────────────
const COLORS: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   dot: 'bg-blue-500',   text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', dot: 'bg-purple-500', text: 'text-purple-400' },
  green:  { bg: 'bg-green-500/10',  border: 'border-green-500/30',  dot: 'bg-green-500',  text: 'text-green-400' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: 'bg-orange-500', text: 'text-orange-400' },
  pink:   { bg: 'bg-pink-500/10',   border: 'border-pink-500/30',   dot: 'bg-pink-500',   text: 'text-pink-400' },
  cyan:   { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30',   dot: 'bg-cyan-500',   text: 'text-cyan-400' },
};

const SUBJECTS = ['General', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Economics', 'English', 'Computer Science', 'Reasoning'];
const EMOJIS   = ['📝','📚','🔬','⚗️','🧮','🌏','💡','⚡','🎯','🧠','📊','🔭','🧪','📐','🗺️'];
const AI_MODES = [
  { id: 'improve',   label: 'Improve',   icon: Wand2,      desc: 'Fix grammar & clarity' },
  { id: 'summarize', label: 'Summarize', icon: AlignLeft,  desc: 'Key points for revision' },
  { id: 'expand',    label: 'Expand',    icon: FileText,   desc: 'Add more detail' },
  { id: 'bullets',   label: 'Bullets',   icon: List,       desc: 'Convert to bullet points' },
];

// ── Helpers ───────────────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Note Card ─────────────────────────────────────────────────
function NoteCard({ note, isOwner, onOpen, onPin, onDelete }: {
  note: Note; isOwner: boolean;
  onOpen: () => void; onPin: () => void; onDelete: () => void;
}) {
  const c = COLORS[note.color] || COLORS.blue;
  const preview = note.content?.slice(0, 120) || 'No content yet…';

  return (
    <div
      onClick={onOpen}
      className={`group relative rounded-2xl border p-4 cursor-pointer transition-all duration-200
        hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 ${c.bg} ${c.border}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{note.emoji}</span>
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight line-clamp-1">{note.title}</h3>
            <span className="text-[10px] text-slate-500">{note.subject}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isOwner && (
            <button onClick={e => { e.stopPropagation(); onPin(); }}
              className={`p-1 rounded-lg transition-colors ${note.isPinned ? 'text-orange-400' : 'text-slate-600 hover:text-slate-400'}`}>
              <Pin className="w-3 h-3" />
            </button>
          )}
          {isOwner && (
            <button onClick={e => { e.stopPropagation(); onDelete(); }}
              className="p-1 rounded-lg text-slate-600 hover:text-red-400 transition-colors">
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-3">{preview}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {note.isPinned && <Pin className="w-3 h-3 text-orange-400" />}
          {note.isPublic && <Globe className="w-3 h-3 text-green-400" />}
          {note.collaborators?.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
              <Users className="w-3 h-3" />{note.collaborators.length}
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-600">{timeAgo(note.updatedAt)}</span>
      </div>

      {/* Shared badge */}
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
  const { userId, userName } = useApp();

  const [notes,      setNotes]      = useState<Note[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isOwner,    setIsOwner]    = useState(false);
  const [canEdit,    setCanEdit]    = useState(false);
  const [view,       setView]       = useState<'list' | 'editor'>('list');

  const [search,    setSearch]    = useState('');
  const [filterSub, setFilterSub] = useState('All');

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle,   setNewTitle]   = useState('');
  const [newSubject, setNewSubject] = useState('General');
  const [newEmoji,   setNewEmoji]   = useState('📝');
  const [newColor,   setNewColor]   = useState('blue');
  const [creating,   setCreating]   = useState(false);

  // Editor state
  const [editTitle,   setEditTitle]   = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Share panel
  const [showShare,    setShowShare]    = useState(false);
  const [shareUsername, setShareUsername] = useState('');
  const [shareCanEdit, setShareCanEdit] = useState(false);
  const [sharing,      setSharing]      = useState(false);
  const [shareMsg,     setShareMsg]     = useState('');
  const [copied,       setCopied]       = useState(false);

  // AI panel
  const [showAI,    setShowAI]    = useState(false);
  const [aiMode,    setAiMode]    = useState('improve');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult,  setAiResult]  = useState('');

  // ── Fetch notes ─────────────────────────────────────────────
  const fetchNotes = useCallback(async () => {
    try {
      const res  = await fetch(`${API_URL}/api/notes`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setNotes(data.notes);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  // ── Open note ───────────────────────────────────────────────
  const openNote = async (id: string) => {
    try {
      const res  = await fetch(`${API_URL}/api/notes/${id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setActiveNote(data.note);
        setIsOwner(data.isOwner);
        setCanEdit(data.canEdit);
        setEditTitle(data.note.title);
        setEditContent(data.note.content || '');
        setView('editor');
        setAiResult('');
      }
    } catch {}
  };

  // ── Auto-save ────────────────────────────────────────────────
  const triggerSave = useCallback((title: string, content: string) => {
    if (!activeNote || !canEdit) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch(`${API_URL}/api/notes/${activeNote._id}`, {
          method: 'PUT', headers: authHeaders(),
          body: JSON.stringify({ title, content }),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        fetchNotes();
      } catch {} finally { setSaving(false); }
    }, 1200);
  }, [activeNote, canEdit, fetchNotes]);

  const handleTitleChange = (v: string) => { setEditTitle(v); triggerSave(v, editContent); };
  const handleContentChange = (v: string) => { setEditContent(v); triggerSave(editTitle, v); };

  // ── Create note ──────────────────────────────────────────────
  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res  = await fetch(`${API_URL}/api/notes`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ title: newTitle, subject: newSubject, emoji: newEmoji, color: newColor }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreate(false); setNewTitle(''); setNewSubject('General'); setNewEmoji('📝'); setNewColor('blue');
        await fetchNotes();
        openNote(data.note._id);
      }
    } catch {} finally { setCreating(false); }
  };

  // ── Delete note ──────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    await fetch(`${API_URL}/api/notes/${id}`, { method: 'DELETE', headers: authHeaders() });
    setNotes(prev => prev.filter(n => n._id !== id));
    if (activeNote?._id === id) { setView('list'); setActiveNote(null); }
  };

  // ── Pin note ─────────────────────────────────────────────────
  const handlePin = async (note: Note) => {
    await fetch(`${API_URL}/api/notes/${note._id}`, {
      method: 'PUT', headers: authHeaders(),
      body: JSON.stringify({ isPinned: !note.isPinned }),
    });
    fetchNotes();
  };

  // ── Share ────────────────────────────────────────────────────
  const handleShare = async (makePublic = false) => {
    if (!activeNote) return;
    setSharing(true); setShareMsg('');
    try {
      const res  = await fetch(`${API_URL}/api/notes/${activeNote._id}/share`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ username: shareUsername.trim(), canEdit: shareCanEdit, makePublic }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveNote(prev => prev ? { ...prev, shareCode: data.shareCode, isPublic: data.isPublic, collaborators: data.collaborators } : prev);
        setShareUsername(''); setShareMsg(shareUsername ? `✅ Added ${shareUsername}!` : '✅ Link generated!');
      } else {
        setShareMsg(`❌ ${data.message}`);
      }
    } catch { setShareMsg('❌ Something went wrong'); } finally { setSharing(false); }
  };

  const handleRemoveCollab = async (collabUserId: string) => {
    if (!activeNote) return;
    const res  = await fetch(`${API_URL}/api/notes/${activeNote._id}/collaborator`, {
      method: 'DELETE', headers: authHeaders(),
      body: JSON.stringify({ userId: collabUserId }),
    });
    const data = await res.json();
    if (data.success) setActiveNote(prev => prev ? { ...prev, collaborators: data.collaborators } : prev);
  };

  const copyLink = () => {
    if (!activeNote?.shareCode) return;
    const link = `${window.location.origin}/#/app/notes/shared/${activeNote.shareCode}`;
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  // ── AI Enhance ───────────────────────────────────────────────
  const handleAIEnhance = async () => {
    if (!activeNote) return;
    setAiLoading(true); setAiResult('');
    try {
      const res  = await fetch(`${API_URL}/api/notes/${activeNote._id}/ai-enhance`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ mode: aiMode }),
      });
      const data = await res.json();
      if (data.success) setAiResult(data.enhanced);
    } catch {} finally { setAiLoading(false); }
  };

  const applyAIResult = () => {
    if (!aiResult) return;
    handleContentChange(aiResult);
    setAiResult('');
    setShowAI(false);
  };

  // ── Filtered notes ───────────────────────────────────────────
  const filtered = notes.filter(n => {
    const matchSearch  = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = filterSub === 'All' || n.subject === filterSub;
    return matchSearch && matchSubject;
  });

  const pinned   = filtered.filter(n => n.isPinned);
  const unpinned = filtered.filter(n => !n.isPinned);
  const subjects = ['All', ...Array.from(new Set(notes.map(n => n.subject)))];

  const c = activeNote ? (COLORS[activeNote.color] || COLORS.blue) : COLORS.blue;

  // ── EDITOR VIEW ──────────────────────────────────────────────
  if (view === 'editor' && activeNote) {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto">

        {/* Editor topbar */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <button onClick={() => { setView('list'); setActiveNote(null); setShowShare(false); setShowAI(false); setAiResult(''); }}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Notes
          </button>

          <div className="flex items-center gap-2">
            {/* Save indicator */}
            <span className={`text-[11px] transition-opacity ${saving ? 'text-slate-500 opacity-100' : saved ? 'text-green-400 opacity-100' : 'opacity-0'}`}>
              {saving ? 'Saving…' : '✓ Saved'}
            </span>

            {canEdit && (
              <button onClick={() => { setShowAI(!showAI); setShowShare(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border
                  ${showAI ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/10 text-slate-400 hover:text-purple-300 hover:border-purple-500/30'}`}>
                <Wand2 className="w-3.5 h-3.5" /> AI Enhance
              </button>
            )}

            {isOwner && (
              <button onClick={() => { setShowShare(!showShare); setShowAI(false); setShareMsg(''); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border
                  ${showShare ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-slate-400 hover:text-blue-300 hover:border-blue-500/30'}`}>
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            )}
          </div>
        </div>

        {/* AI Panel */}
        {showAI && (
          <div className="mb-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> AI Enhance Notes
              </h3>
              <button onClick={() => { setShowAI(false); setAiResult(''); }} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {AI_MODES.map(m => (
                <button key={m.id} onClick={() => setAiMode(m.id)}
                  className={`p-2 rounded-xl border text-left transition-all ${aiMode === m.id ? 'bg-purple-500/20 border-purple-500/40' : 'bg-white/[0.02] border-white/8 hover:border-purple-500/20'}`}>
                  <m.icon className="w-3.5 h-3.5 text-purple-400 mb-1" />
                  <div className="text-xs font-medium text-white">{m.label}</div>
                  <div className="text-[10px] text-slate-500">{m.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={handleAIEnhance} disabled={aiLoading || !editContent.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-all flex items-center gap-2">
              {aiLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enhancing…</> : <><Wand2 className="w-3.5 h-3.5" /> Enhance Now</>}
            </button>

            {aiResult && (
              <div className="mt-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 max-h-48 overflow-y-auto">
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{aiResult}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={applyAIResult}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-all">
                    <Check className="w-3.5 h-3.5" /> Apply to Note
                  </button>
                  <button onClick={() => setAiResult('')}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs hover:text-white transition-all">
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Share Panel */}
        {showShare && isOwner && (
          <div className="mb-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-400" /> Share Note
              </h3>
              <button onClick={() => setShowShare(false)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            {/* Share by username */}
            <div className="flex gap-2 mb-3">
              <input value={shareUsername} onChange={e => setShareUsername(e.target.value)}
                placeholder="Friend's username…"
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/40" />
              <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                <input type="checkbox" checked={shareCanEdit} onChange={e => setShareCanEdit(e.target.checked)} className="accent-blue-500" />
                Can edit
              </label>
              <button onClick={() => handleShare(false)} disabled={sharing || !shareUsername.trim()}
                className="px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium disabled:opacity-40 hover:bg-blue-500/30 transition-all flex items-center gap-1">
                {sharing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />} Add
              </button>
            </div>

            {shareMsg && <p className="text-xs mb-3">{shareMsg}</p>}

            {/* Public link */}
            <div className="flex gap-2 mb-3">
              <button onClick={() => handleShare(true)} disabled={sharing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs hover:text-white hover:border-white/20 transition-all">
                <Globe className="w-3.5 h-3.5" />
                {activeNote.isPublic ? 'Public ✓' : 'Make Public'}
              </button>
              {activeNote.shareCode && (
                <button onClick={copyLink}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs hover:text-white hover:border-white/20 transition-all">
                  {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              )}
            </div>

            {/* Collaborators list */}
            {activeNote.collaborators?.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[11px] text-slate-500 font-medium">Collaborators</p>
                {activeNote.collaborators.map(c => (
                  <div key={c.userId} className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/8 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                        {c.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-xs text-white">{c.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.canEdit ? 'bg-green-500/15 text-green-400' : 'bg-slate-500/15 text-slate-400'}`}>
                        {c.canEdit ? 'editor' : 'viewer'}
                      </span>
                    </div>
                    <button onClick={() => handleRemoveCollab(c.userId)} className="text-slate-600 hover:text-red-400 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Editor */}
        <div className={`flex-1 rounded-2xl border ${c.border} ${c.bg} flex flex-col overflow-hidden min-h-0`}>
          {/* Note header */}
          <div className={`flex items-center gap-3 px-5 py-3 border-b ${c.border} flex-shrink-0`}>
            <span className="text-2xl">{activeNote.emoji}</span>
            <input value={editTitle} onChange={e => handleTitleChange(e.target.value)}
              disabled={!canEdit}
              placeholder="Note title…"
              className="flex-1 bg-transparent text-white font-semibold text-lg placeholder-slate-600 outline-none disabled:cursor-default" />
            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              {activeNote.collaborators?.length > 0 && (
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{activeNote.collaborators.length}</span>
              )}
              {activeNote.isPublic ? <Globe className="w-3 h-3 text-green-400" /> : <Lock className="w-3 h-3" />}
              {activeNote.lastEditBy && <span>Last edited by {activeNote.lastEditBy}</span>}
              {!canEdit && <span className="px-1.5 py-0.5 rounded-full bg-slate-500/15 text-slate-400">View only</span>}
            </div>
          </div>

          {/* Content area */}
          <textarea
            value={editContent}
            onChange={e => handleContentChange(e.target.value)}
            disabled={!canEdit}
            placeholder={canEdit
              ? "Start writing your notes here…\n\nTip: Use AI Enhance to improve, summarize or expand your notes!"
              : "This note is view-only for you."}
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-700 resize-none outline-none px-5 py-4 text-sm leading-relaxed disabled:cursor-default"
          />

          {/* Footer bar */}
          <div className={`flex items-center justify-between px-5 py-2 border-t ${c.border} flex-shrink-0`}>
            <div className="flex items-center gap-3 text-[10px] text-slate-600">
              <span>{editContent.split(/\s+/).filter(Boolean).length} words</span>
              <span>{editContent.length} chars</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              <span>{activeNote.subject}</span>
              <span>·</span>
              <span>{timeAgo(activeNote.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" /> Collaborative Notes
          </h1>
          <p className="text-sm text-slate-400 mt-1">Create, share and study with friends</p>
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
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search notes…"
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-52 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <p className="text-white font-medium">{search ? 'No notes found' : 'No notes yet'}</p>
            <p className="text-slate-500 text-sm mt-1">{search ? 'Try a different search' : 'Create your first note to get started!'}</p>
          </div>
          {!search && (
            <button onClick={() => setShowCreate(true)}
              className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm hover:bg-blue-500/30 transition-all">
              + Create Note
            </button>
          )}
        </div>
      )}

      {/* Pinned */}
      {pinned.length > 0 && (
        <div>
          <p className="text-[11px] text-orange-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Pin className="w-3 h-3" /> Pinned
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pinned.map(n => (
              <NoteCard key={n._id} note={n}
                isOwner={n.owner === userId || n.owner.toString() === userId}
                onOpen={() => openNote(n._id)}
                onPin={() => handlePin(n)}
                onDelete={() => handleDelete(n._id)} />
            ))}
          </div>
        </div>
      )}

      {/* All notes */}
      {unpinned.length > 0 && (
        <div>
          {pinned.length > 0 && <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-3">All Notes</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unpinned.map(n => (
              <NoteCard key={n._id} note={n}
                isOwner={n.owner === userId || n.owner.toString() === userId}
                onOpen={() => openNote(n._id)}
                onPin={() => handlePin(n)}
                onDelete={() => handleDelete(n._id)} />
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1117] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">New Note</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {/* Emoji + Title */}
            <div className="flex gap-3">
              <div className="relative">
                <button className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.03] text-2xl flex items-center justify-center hover:border-white/20 transition-colors">
                  {newEmoji}
                </button>
              </div>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="Note title…" autoFocus
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-600 outline-none focus:border-blue-500/30 text-sm" />
            </div>

            {/* Emoji picker */}
            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setNewEmoji(e)}
                  className={`w-8 h-8 rounded-lg text-base transition-all ${newEmoji === e ? 'bg-blue-500/20 border border-blue-500/40' : 'hover:bg-white/5'}`}>
                  {e}
                </button>
              ))}
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Subject</label>
              <select value={newSubject} onChange={e => setNewSubject(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500/30 appearance-none">
                {SUBJECTS.map(s => <option key={s} value={s} className="bg-[#0d1117]">{s}</option>)}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Color</label>
              <div className="flex gap-2">
                {Object.entries(COLORS).map(([key, val]) => (
                  <button key={key} onClick={() => setNewColor(key)}
                    className={`w-7 h-7 rounded-full ${val.dot} transition-all ${newColor === key ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d1117] scale-110' : 'opacity-60 hover:opacity-100'}`} />
                ))}
              </div>
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