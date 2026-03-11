import { useState, useRef, useCallback, useEffect } from "react";
import {
  Brain, Send, Zap, ImagePlus, FileText, X,
  Trash2, User, Sparkles, Plus, MessageSquare,
  ChevronLeft, MoreHorizontal, Check, Pencil,
  Play, Clock, RefreshCw,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { API_URL } from "../utils/api";
import { incrementAction } from "../utils/user-api";
import { MarkdownRenderer } from "../components/MarkdownRenderer";

// ─── Types ────────────────────────────────────────────────────
type Role = "user" | "assistant";
interface ChatMsg {
  role: Role;
  content: string;
  imagePreview?: string;
  fileName?: string;
  fileType?: "image" | "pdf";
  pointsAwarded?: number;
  isError?: boolean;
}
interface ConvoSummary {
  _id: string;
  title: string;
  lastMessageAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────
async function compressImage(base64: string, maxPx = 1600): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Higher quality for OCR — math questions need clarity
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };
    img.onerror = () => resolve(base64); // If compression fails, send original
    img.src = base64;
  });
}

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
}

function groupByDate(convos: ConvoSummary[]) {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yest  = new Date(today); yest.setDate(yest.getDate() - 1);
  const week  = new Date(today); week.setDate(week.getDate() - 7);

  const groups: { label: string; items: ConvoSummary[] }[] = [
    { label: "Today",       items: [] },
    { label: "Yesterday",   items: [] },
    { label: "Last 7 days", items: [] },
    { label: "Older",       items: [] },
  ];

  for (const c of convos) {
    const d = new Date(c.lastMessageAt);
    if (d >= today)      groups[0].items.push(c);
    else if (d >= yest)  groups[1].items.push(c);
    else if (d >= week)  groups[2].items.push(c);
    else                 groups[3].items.push(c);
  }
  return groups.filter(g => g.items.length > 0);
}

// ─── Bubbles ──────────────────────────────────────────────────
function UserBubble({ msg }: { msg: ChatMsg }) {
  return (
    <div className="flex justify-end gap-2 items-end">
      <div className="max-w-[80%] space-y-2">
        {msg.imagePreview && (
          <div className="flex justify-end">
            <img src={msg.imagePreview} alt="uploaded"
              className="max-h-48 rounded-2xl border border-white/10 object-contain bg-black/20" />
          </div>
        )}
        {msg.fileName && !msg.imagePreview && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
              <FileText className="w-3.5 h-3.5" />
              <span className="max-w-[180px] truncate">{msg.fileName}</span>
            </div>
          </div>
        )}
        {msg.content && (
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 rounded-2xl rounded-br-sm px-4 py-3">
            <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          </div>
        )}
      </div>
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mb-0.5">
        <User className="w-3.5 h-3.5 text-white" />
      </div>
    </div>
  );
}

function AIBubble({ msg, isPremium }: { msg: ChatMsg; isPremium: boolean }) {
  return (
    <div className="flex gap-2 items-end">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0 mb-0.5">
        <Brain className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="max-w-[85%] space-y-1">
        <div className={`rounded-2xl rounded-bl-sm px-4 py-3 border
          ${msg.isError ? "bg-red-500/10 border-red-500/20" : "bg-white/[0.04] border-white/10"}`}>
          {msg.isError
            ? <p className="text-sm text-red-300 leading-relaxed">{msg.content}</p>
            : <MarkdownRenderer content={msg.content} />}
        </div>
        {!!msg.pointsAwarded && (
          <div className="px-2">
            <span className="text-xs font-medium text-green-400">
              +{msg.pointsAwarded} pts ✓{isPremium && msg.pointsAwarded > 10 ? " ⚡" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "Explain photosynthesis with the chemical equation",
  "Solve: ∫x²dx from 0 to 1, show all steps",
  "What is Newton's Third Law? Give real examples",
  "Explain supply and demand with a simple example",
];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export function AskAI() {
  const {
    questionsLeft, setQuestionsLeft, useQuestion, addPoints, userId,
    logActivity, isPremium, checkAndUnlockAchievements, userStats, setUserStats,
  } = useApp();

  // ── Sidebar state ────────────────────────────────────────
  const [convos,      setConvos]      = useState<ConvoSummary[]>([]);
  const [activeId,    setActiveId]    = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [loadingConvos, setLoadingConvos] = useState(true);

  // Rename state
  const [renamingId,    setRenamingId]    = useState<string | null>(null);
  const [renameValue,   setRenameValue]   = useState("");
  const [menuOpenId,    setMenuOpenId]    = useState<string | null>(null);

  // ── Chat state ───────────────────────────────────────────
  const [messages,    setMessages]    = useState<ChatMsg[]>([]);
  const [question,    setQuestion]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  // ── File state ───────────────────────────────────────────
  const [uploadedFile,  setUploadedFile]  = useState<File | null>(null);
  const [fileType,      setFileType]      = useState<"image" | "pdf" | null>(null);
  const [previewSrc,    setPreviewSrc]    = useState<string | null>(null);
  const [isDragging,    setIsDragging]    = useState(false);

  // ── Hourly refill + video ad state ───────────────────────
  const [nextRefillSecs, setNextRefillSecs] = useState<number>(0);
  const [videoAdsLeft,   setVideoAdsLeft]   = useState<number>(5);
  const [watchingAd,     setWatchingAd]     = useState(false);
  const [adCountdown,    setAdCountdown]    = useState(0);
  const refillTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fileRef     = useRef<HTMLInputElement>(null);
  // Ref to track current convoId reliably across async calls
  const convoIdRef  = useRef<string | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Load conversations ───────────────────────────────────
  const fetchConvos = useCallback(async () => {
    setLoadingConvos(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { setLoadingConvos(false); return; }
      const res  = await fetch(`${API_URL}/api/chat`, { headers: authHeaders() });
      if (!res.ok) { console.error('[Chat] fetchConvos HTTP:', res.status); setLoadingConvos(false); return; }
      const data = await res.json();
      console.log('[Chat] fetchConvos:', data.conversations?.length, 'convos');
      if (data.success) setConvos(data.conversations);
    } catch(e) { console.error('[Chat] fetchConvos error:', e); }
    finally { setLoadingConvos(false); }
  }, []);

  useEffect(() => {
    fetchConvos();
  }, [fetchConvos]);

  // ── Fetch quota on mount & start refill timer ────────────
  useEffect(() => {
    async function fetchQuota() {
      try {
        const res  = await fetch(`${API_URL}/api/ai/quota`, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) {
          setQuestionsLeft(data.questionsLeft);
          setNextRefillSecs(data.nextRefillSecs || 0);
          setVideoAdsLeft(data.videoAdsLeft ?? 5);
        }
      } catch { /* silent */ }
    }
    fetchQuota();
  }, []);

  // ── Countdown timer — tick every second ──────────────────
  useEffect(() => {
    if (refillTimerRef.current) clearInterval(refillTimerRef.current);
    if (nextRefillSecs <= 0) return;
    refillTimerRef.current = setInterval(() => {
      setNextRefillSecs(prev => {
        if (prev <= 1) {
          clearInterval(refillTimerRef.current!);
          // Auto-refill: re-fetch quota
          fetch(`${API_URL}/api/ai/quota`, { headers: authHeaders() })
            .then(r => r.json())
            .then(d => { if (d.success) { setQuestionsLeft(d.questionsLeft); setNextRefillSecs(d.nextRefillSecs || 0); } })
            .catch(() => {});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (refillTimerRef.current) clearInterval(refillTimerRef.current); };
  }, [nextRefillSecs]);

  // ── Auto scroll ──────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Auto-resize textarea ─────────────────────────────────
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [question]);

  // ── Close menu on outside click ──────────────────────────
  useEffect(() => {
    if (!menuOpenId) return;
    const close = () => setMenuOpenId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpenId]);

  // ─────────────────────────────────────────────────────────
  // API helpers
  // ─────────────────────────────────────────────────────────


  async function loadConversation(id: string) {
    setActiveId(id);
    convoIdRef.current = id;
    setSidebarOpen(false);
    try {
      const res  = await fetch(`${API_URL}/api/chat/${id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setMessages(data.conversation.messages.map((m: any) => ({
          role:          m.role,
          content:       m.content,
          fileName:      m.fileName  || undefined,
          fileType:      m.fileType  || undefined,
          pointsAwarded: m.pointsAwarded || undefined,
          isError:       m.isError   || false,
        })));
      }
    } catch { /* silent */ }
  }

  async function createNewConvo(firstMessage?: string): Promise<string | null> {
    try {
      const res  = await fetch(`${API_URL}/api/chat`, {
        method:  "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body:    JSON.stringify({ firstMessage }),
      });
      const data = await res.json();
      console.log('[Chat] createNewConvo:', data);
      if (data.success) {
        const newConvo: ConvoSummary = {
          _id:           data.conversation._id,
          title:         data.conversation.title,
          lastMessageAt: data.conversation.lastMessageAt,
        };
        setConvos(prev => [newConvo, ...prev]);
        setActiveId(data.conversation._id);
        return data.conversation._id;
      }
    } catch(e) { console.error('[Chat] createNewConvo error:', e); }
    return null;
  }

  async function saveMessages(convoId: string, msgs: ChatMsg[]) {
    try {
      const res = await fetch(`${API_URL}/api/chat/${convoId}/messages`, {
        method:  "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: msgs.map(m => ({
          role:          m.role,
          content:       m.content,
          fileName:      m.fileName  || null,
          fileType:      m.fileType  || null,
          pointsAwarded: m.pointsAwarded || null,
          isError:       m.isError   || false,
        })) }),
      });
      const data = await res.json();
      console.log('[Chat] saveMessages:', data);
      // Update title in sidebar if it changed
      if (data.success && data.title) {
        setConvos(prev => prev.map(c =>
          c._id === convoId
            ? { ...c, title: data.title, lastMessageAt: new Date().toISOString() }
            : c
        ));
      }
    } catch(e) { console.error('[Chat] saveMessages error:', e); }
  }

  async function handleDeleteConvo(id: string) {
    setMenuOpenId(null);
    try {
      await fetch(`${API_URL}/api/chat/${id}`, { method: "DELETE", headers: authHeaders() });
    } catch { /* silent */ }
    setConvos(prev => prev.filter(c => c._id !== id));
    if (activeId === id) {
      setActiveId(null);
      convoIdRef.current = null;
      setMessages([]);
    }
  }

  async function handleRename(id: string) {
    const title = renameValue.trim();
    if (!title) { setRenamingId(null); return; }
    try {
      await fetch(`${API_URL}/api/chat/${id}/title`, {
        method:  "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body:    JSON.stringify({ title }),
      });
      setConvos(prev => prev.map(c => c._id === id ? { ...c, title } : c));
    } catch { /* silent */ }
    setRenamingId(null);
  }

  // ─────────────────────────────────────────────────────────
  // File handlers
  // ─────────────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const isImg = file.type.startsWith("image/"); // includes jpg, png, webp, gif, etc.
    const isPdf = file.type === "application/pdf";
    if (!isImg && !isPdf) { alert("Only images and PDF files are supported."); return; }
    setUploadedFile(file);
    setFileType(isImg ? "image" : "pdf");
    if (isImg) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewSrc(reader.result as string);
      reader.readAsDataURL(file);
    } else setPreviewSrc(null);
    textareaRef.current?.focus();
  }, []);

  const removeFile = () => {
    setUploadedFile(null); setFileType(null); setPreviewSrc(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ─────────────────────────────────────────────────────────
  // New chat
  // ─────────────────────────────────────────────────────────
  function startNewChat() {
    setActiveId(null);
    convoIdRef.current = null;
    setMessages([]);
    setQuestion("");
    removeFile();
    setSidebarOpen(false);
    textareaRef.current?.focus();
  }

  // ─────────────────────────────────────────────────────────
  // SEND MESSAGE
  // ─────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────
  // WATCH VIDEO AD → +1 Question
  // ─────────────────────────────────────────────────────────
  const handleWatchAd = async () => {
    if (watchingAd || videoAdsLeft <= 0) return;
    setWatchingAd(true);
    setAdCountdown(15); // 15 sec fake video

    // Fake video countdown
    const timer = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);

    // Wait 15 seconds (fake ad duration)
    await new Promise(resolve => setTimeout(resolve, 15000));
    clearInterval(timer);

    try {
      const res  = await fetch(`${API_URL}/api/ai/watch-ad`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setQuestionsLeft(data.questionsLeft);
        setVideoAdsLeft(data.videoAdsLeft ?? 0);
        if (data.nextRefillSecs !== undefined) setNextRefillSecs(data.nextRefillSecs);
        alert(`🎓 ${data.message}`);
      } else {
        alert(data.message || 'Could not unlock question.');
      }
    } catch {
      alert('Connection error. Please try again.');
    }
    setWatchingAd(false);
    setAdCountdown(0);
  };

  // Build conversation history for AI context
  // Uses \`messages\` state directly (previous exchanges only — current prompt goes as `prompt` field)
  const buildHistory = () =>
    messages
      .filter(m => !m.isError && !m.imagePreview && !m.fileName)
      .slice(-10)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const handleSend = async () => {
    const text = question.trim();
    if ((!text && !uploadedFile) || loading || questionsLeft <= 0) return;

    // Optimistic UI — add user message immediately
    const userMsg: ChatMsg = {
      role: "user", content: text,
      imagePreview: previewSrc   || undefined,
      fileName:     uploadedFile?.name,
      fileType:     fileType     || undefined,
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    const currentFile     = uploadedFile;
    const currentFileType = fileType;
    const currentPreview  = previewSrc;
    removeFile();

    // Create conversation if new chat — use ref (not state) for reliability
    let convoId = convoIdRef.current;
    if (!convoId) {
      convoId = await createNewConvo(text || currentFile?.name);
      if (convoId) convoIdRef.current = convoId; // persist for next messages
    }

    try {
      const headers = authHeaders();
      let result: { success: boolean; answer: string; pointsAwarded?: number; questionsLeft?: number; nextRefillSecs?: number };

      if (currentFileType === "pdf" && currentFile) {
        setLoadingStep("Extracting PDF text…");
        const form = new FormData();
        form.append("file", currentFile);
        if (text) form.append("prompt", text);
        const res = await fetch(`${API_URL}/api/ai/solve-pdf`, { method: "POST", headers, body: form });
        result = await res.json();
      } else {
        let imageData: string | undefined;
        if (currentFileType === "image" && currentPreview) {
          setLoadingStep("Compressing image…");
          imageData = await compressImage(currentPreview, 1600); // Higher res for better OCR
          setLoadingStep("AI is analyzing image…");
        } else {
          setLoadingStep("AI is thinking…");
        }
        const res = await fetch(`${API_URL}/api/ai/ask`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt:  text    || undefined,
            image:   imageData,
            history: imageData ? [] : buildHistory(),
            userId,
          }),
        });
        result = await res.json();
      }

      const aiMsg: ChatMsg = {
        role:    "assistant",
        content: result.answer || "No answer received. Please try again.",
        isError: !result.success,
      };

      if (result.success) {
        const pts = result.pointsAwarded ?? (isPremium ? 20 : 10);
        aiMsg.pointsAwarded = pts;
        addPoints(pts);
        if (result.questionsLeft !== undefined) setQuestionsLeft(result.questionsLeft);
        else useQuestion();
        if (result.nextRefillSecs !== undefined) setNextRefillSecs(result.nextRefillSecs);
        logActivity("ask_question", text.substring(0, 50) || `${currentFileType} question`, pts);
        const newTotal = (userStats.totalQuestionsAsked || 0) + 1;
        setUserStats({ ...userStats, totalQuestionsAsked: newTotal });
        incrementAction("question");
        checkAndUnlockAchievements({ totalQuestionsAsked: newTotal });
      }

      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);

      // Save both messages to DB
      if (convoId) {
        await saveMessages(convoId, [userMsg, aiMsg]);
        // Refresh sidebar to show updated title/timestamp
        fetchConvos();
      }

    } catch {
      const errMsg: ChatMsg = { role: "assistant", content: "Connection error. Please check your internet and try again.", isError: true };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false); setLoadingStep("");
      textareaRef.current?.focus();
    }
  };

  const canSend = (!!question.trim() || !!uploadedFile) && questionsLeft > 0 && !loading;
  const hasChat = messages.length > 0;
  const grouped = groupByDate(convos);

  // ─────────────────────────────────────────────────────────
  // SIDEBAR
  // ─────────────────────────────────────────────────────────
  const sidebar = (
    <div className="flex flex-col h-full">
      {/* New Chat button */}
      <div className="p-3 flex-shrink-0">
        <button
          onClick={startNewChat}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/20 text-sm font-semibold text-white hover:from-blue-500/25 hover:to-purple-500/25 transition-all"
        >
          <Plus className="w-4 h-4 text-blue-400" />
          New Chat
        </button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 pb-4">
        {loadingConvos ? (
          <div className="space-y-2 px-1 pt-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-9 rounded-lg bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : convos.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-600">No conversations yet.<br />Start chatting!</p>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-3 mb-1">
                {group.label}
              </p>
              {group.items.map(c => (
                <div key={c._id} className="relative group/item">
                  {renamingId === c._id ? (
                    /* Rename input */
                    <div className="flex items-center gap-1 px-2 py-1">
                      <input
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") handleRename(c._id);
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        autoFocus
                        className="flex-1 bg-white/[0.06] border border-blue-500/30 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                      />
                      <button onClick={() => handleRename(c._id)} className="text-green-400 hover:text-green-300 p-1">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setRenamingId(null)} className="text-slate-500 hover:text-slate-300 p-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => loadConversation(c._id)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all group/btn
                        ${activeId === c._id
                          ? "bg-white/[0.07] text-white border border-white/10"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.04]"}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-slate-600 group-hover/btn:text-slate-400" />
                      <span className="flex-1 truncate">{c.title}</span>
                      {/* Context menu button */}
                      <span
                        onClick={e => { e.stopPropagation(); setMenuOpenId(prev => prev === c._id ? null : c._id); }}
                        className={`p-0.5 rounded transition-opacity flex-shrink-0
                          ${menuOpenId === c._id ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}`}
                      >
                        <MoreHorizontal className="w-3.5 h-3.5 text-slate-500 hover:text-white" />
                      </span>
                    </button>
                  )}

                  {/* Dropdown menu */}
                  {menuOpenId === c._id && renamingId !== c._id && (
                    <div
                      className="absolute right-2 top-8 z-50 bg-[#0f1120] border border-white/10 rounded-xl shadow-xl overflow-hidden w-36"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        onClick={() => { setMenuOpenId(null); setRenamingId(c._id); setRenameValue(c.title); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Rename
                      </button>
                      <button
                        onClick={() => handleDeleteConvo(c._id)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    /* Break out of page padding, fill remaining viewport height */
    <div className="flex -mx-3 -mt-3 sm:-mx-4 sm:-mt-4 md:-mx-8 md:-mt-8" style={{ height: 'calc(100vh - 56px)', minHeight: 0 }}>

      {/* ── SIDEBAR OVERLAY (mobile only) ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          flex-shrink-0 w-64 border-r border-white/8 flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          fixed md:static top-0 left-0 h-full z-50 md:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ background: 'rgba(5, 8, 22, 0.98)', backdropFilter: 'blur(20px)' }}
      >
        {/* Mobile close button */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0">
          <span className="text-sm font-semibold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-400" /> Ask AI
          </span>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        {sidebar}
      </aside>

      {/* ── CHAT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: '#060914' }}>

        {/* Chat topbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile sidebar toggle */}
            <button
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-blue-400 hidden md:block" />
                {activeId
                  ? (convos.find(c => c._id === activeId)?.title || "Chat")
                  : "New Chat"
                }
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Questions left */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium
              ${questionsLeft > 0 ? "border-blue-500/20 bg-blue-500/5 text-blue-300" : "border-red-500/20 bg-red-500/5 text-red-300"}`}>
              <Zap className="w-3 h-3" />
              {questionsLeft}/{isPremium ? 30 : 15}
              {isPremium && <span className="text-yellow-300 ml-0.5">⚡</span>}
              {questionsLeft <= 0 && nextRefillSecs > 0 && (
                <span className="text-[10px] text-slate-500 ml-1">{Math.floor(nextRefillSecs/60)}m</span>
              )}
            </div>
            {/* New chat (desktop) */}
            <button
              onClick={startNewChat}
              title="New chat"
              className="hidden md:flex p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all items-center gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 px-4 py-5" style={{ minHeight: 0 }}>

          {/* Empty state */}
          {!hasChat && (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white mb-1">
                  {activeId ? "Conversation loaded" : "Start a conversation"}
                </h2>
                <p className="text-xs text-slate-500">
                  Ask a question, upload image/PDF.<br />AI remembers context within a chat.
                </p>
              </div>
              <div className="w-full max-w-md grid sm:grid-cols-2 gap-2">
                {SUGGESTIONS.map(q => (
                  <button key={q}
                    onClick={() => { setQuestion(q); textareaRef.current?.focus(); }}
                    className="text-left p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-all group">
                    <span className="text-purple-400 mr-1.5 group-hover:mr-2 transition-all">→</span>{q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) =>
            msg.role === "user"
              ? <UserBubble key={i} msg={msg} />
              : <AIBubble   key={i} msg={msg} isPremium={isPremium} />
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2 items-end">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="rounded-2xl rounded-bl-sm px-4 py-3 border border-white/10 bg-white/[0.04] flex items-center gap-3">
                <div className="flex gap-1">
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
                <span className="text-xs text-slate-500">{loadingStep || "AI is thinking…"}</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input box ───────────────────────────────────── */}
        <div className="flex-shrink-0 p-3 border-t border-white/8">
          {/* ── Smart quota bar — jaise hi 1 question use ho dikhna shuru ── */}
          {(() => {
            const dailyLimit = isPremium ? 30 : 15;
            const used = dailyLimit - questionsLeft;
            const pct  = Math.round((questionsLeft / dailyLimit) * 100);
            const mins = Math.floor(nextRefillSecs / 60);
            const secs = nextRefillSecs % 60;
            const timeStr = `${mins}:${String(secs).padStart(2,'0')}`;

            // Show bar only if at least 1 question has been used
            if (used === 0) return null;

            return (
              <div className={`mb-2 rounded-xl border p-2.5 space-y-2 transition-all
                ${questionsLeft === 0
                  ? 'border-red-500/25 bg-red-500/[0.07]'
                  : 'border-white/8 bg-white/[0.02]'}`}>

                {/* Row 1: status + timer */}
                <div className="flex items-center gap-2">
                  {questionsLeft === 0 ? (
                    <Zap className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  )}
                  <span className={`text-xs font-semibold flex-1 ${questionsLeft === 0 ? 'text-red-300' : 'text-slate-300'}`}>
                    {questionsLeft === 0 ? 'No questions left' : `${questionsLeft}/${dailyLimit} questions left`}
                  </span>
                  {nextRefillSecs > 0 && questionsLeft < dailyLimit && (
                    <span className="text-[10px] text-blue-300 font-medium">
                      +1 in {timeStr}
                    </span>
                  )}
                </div>

                {/* Row 2: progress bar */}
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: pct > 40 ? 'linear-gradient(90deg,#3b82f6,#8b5cf6)'
                                : pct > 15 ? 'linear-gradient(90deg,#f59e0b,#f97316)'
                                : '#ef4444'
                    }}
                  />
                </div>

                {/* Row 3: Watch Video button — always visible when any question used */}
                <div className="flex gap-2">
                  {videoAdsLeft > 0 && questionsLeft < dailyLimit && (
                    <button
                      onClick={handleWatchAd}
                      disabled={watchingAd || questionsLeft >= dailyLimit}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-green-500/12 border border-green-500/25 text-[11px] font-semibold text-green-300 hover:bg-green-500/20 hover:border-green-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {watchingAd ? (
                        <><RefreshCw className="w-3 h-3 animate-spin" /> Watching ad… {adCountdown}s</>
                      ) : (
                        <><Play className="w-3 h-3" /> Watch Video → +1 Q &nbsp;·&nbsp; {videoAdsLeft} left today</>
                      )}
                    </button>
                  )}
                  {!isPremium && questionsLeft === 0 && (
                    <button
                      onClick={() => window.location.href = '/app/rewards'}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-yellow-500/12 border border-yellow-500/25 text-[11px] font-semibold text-yellow-300 hover:bg-yellow-500/20 transition-all flex-shrink-0"
                    >
                      ⚡ Get Premium
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-2 space-y-2">

            {/* File strip */}
            {uploadedFile && (
              <div className="flex items-center gap-2 px-1 py-1 rounded-xl bg-white/[0.03] border border-white/10">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
                  ${fileType === "pdf" ? "bg-red-500/15" : "bg-blue-500/15"}`}>
                  {fileType === "pdf"
                    ? <FileText className="w-3 h-3 text-red-400" />
                    : <ImagePlus className="w-3 h-3 text-blue-400" />}
                </div>
                {previewSrc && (
                  <img src={previewSrc} alt="preview" className="h-7 w-7 rounded object-cover border border-white/10" />
                )}
                <span className="text-xs text-slate-300 flex-1 truncate">{uploadedFile.name}</span>
                <button onClick={removeFile} className="text-slate-500 hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2"
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>

              <button onClick={() => fileRef.current?.click()} title="Upload"
                className={`p-1.5 rounded-lg border transition-all flex-shrink-0 mb-0.5
                  ${isDragging ? "border-blue-500/50 text-blue-400" : "border-white/10 text-slate-500 hover:text-blue-400 hover:border-blue-500/20"}`}>
                <ImagePlus className="w-4 h-4" />
              </button>

              <textarea
                ref={textareaRef}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={
                  questionsLeft <= 0     ? "Daily limit reached…"
                  : fileType === "pdf"   ? "What to do with this PDF? (leave blank to auto-solve)"
                  : fileType === "image" ? "Describe what to solve (optional)…"
                  : hasChat              ? "Ask a follow-up…"
                  :                       "Ask anything… (Shift+Enter for new line)"
                }
                disabled={questionsLeft <= 0 || loading}
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-slate-600 resize-none focus:outline-none text-sm leading-relaxed py-1.5 disabled:opacity-40"
                style={{ minHeight: "32px", maxHeight: "160px" }}
              />

              <button onClick={handleSend} disabled={!canSend}
                className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all flex-shrink-0 mb-0.5 glow-btn">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-700 mt-1.5">
            Earn {isPremium ? "20" : "10"} pts per question • History saved 30 days
          </p>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*,.webp,application/pdf" className="hidden"
        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
    </div>
  );
}