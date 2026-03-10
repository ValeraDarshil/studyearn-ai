import { useState, useRef, useCallback, useEffect } from "react";
import {
  Brain, Send, Zap, ImagePlus, FileText, AlertCircle, X,
  Trash2, User, Sparkles, Lightbulb,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { API_URL } from "../utils/api";
import { incrementAction } from "../utils/user-api";
import { MarkdownRenderer } from "../components/MarkdownRenderer";

type Role = "user" | "assistant";
interface ChatMessage {
  role: Role;
  content: string;
  imagePreview?: string;
  fileName?: string;
  pointsAwarded?: number;
  isError?: boolean;
}

async function compressImage(base64: string, maxPx = 1024): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}

function UserBubble({ msg }: { msg: ChatMessage }) {
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

function AIBubble({ msg, isPremium }: { msg: ChatMessage; isPremium: boolean }) {
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
        {msg.pointsAwarded && (
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

export function AskAI() {
  const {
    questionsLeft, setQuestionsLeft, useQuestion, addPoints, userId,
    logActivity, isPremium, checkAndUnlockAchievements, userStats, setUserStats,
  } = useApp();

  const [messages,    setMessages]    = useState<ChatMessage[]>([]);
  const [question,    setQuestion]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileType,     setFileType]     = useState<"image" | "pdf" | null>(null);
  const [previewSrc,   setPreviewSrc]   = useState<string | null>(null);
  const [isDragging,   setIsDragging]   = useState(false);

  const fileRef     = useRef<HTMLInputElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [question]);

  const handleFile = useCallback((file: File) => {
    const isImg = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImg && !isPdf) { alert("Only images and PDF files are supported."); return; }
    setUploadedFile(file);
    setFileType(isImg ? "image" : "pdf");
    if (isImg) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewSrc(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc(null);
    }
    textareaRef.current?.focus();
  }, []);

  const removeFile = () => {
    setUploadedFile(null); setFileType(null); setPreviewSrc(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const clearChat = () => { setMessages([]); setQuestion(""); removeFile(); };

  const buildHistory = () =>
    messages
      .filter(m => !m.isError && !m.imagePreview && !m.fileName)
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

  const handleSend = async () => {
    const text = question.trim();
    if ((!text && !uploadedFile) || loading || questionsLeft <= 0) return;

    const userMsg: ChatMessage = {
      role: "user", content: text,
      imagePreview: previewSrc || undefined,
      fileName: uploadedFile?.name,
    };
    setMessages(prev => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    const currentFile     = uploadedFile;
    const currentFileType = fileType;
    const currentPreview  = previewSrc;
    removeFile();

    try {
      const token   = localStorage.getItem("token");
      const headers: Record<string, string> = { Authorization: `Bearer ${token || ""}` };
      let result: { success: boolean; answer: string; pointsAwarded?: number; questionsLeft?: number };

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
          imageData = await compressImage(currentPreview, 1024);
          setLoadingStep("AI is analyzing image…");
        } else {
          setLoadingStep("AI is thinking…");
        }
        const res = await fetch(`${API_URL}/api/ai/ask`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt:  text || undefined,
            image:   imageData,
            history: imageData ? [] : buildHistory(),
            userId,
          }),
        });
        result = await res.json();
      }

      const aiMsg: ChatMessage = {
        role: "assistant",
        content: result.answer || "No answer received. Please try again.",
        isError: !result.success,
      };

      if (result.success) {
        const pts = result.pointsAwarded ?? (isPremium ? 20 : 10);
        aiMsg.pointsAwarded = pts;
        addPoints(pts);
        if (result.questionsLeft !== undefined) setQuestionsLeft(result.questionsLeft);
        else useQuestion();
        logActivity("ask_question", text.substring(0, 50) || `${currentFileType} question`, pts);
        const newTotal = (userStats.totalQuestionsAsked || 0) + 1;
        setUserStats({ ...userStats, totalQuestionsAsked: newTotal });
        incrementAction("question");
        checkAndUnlockAchievements({ totalQuestionsAsked: newTotal });
      }

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Connection error. Please check your internet and try again.",
        isError: true,
      }]);
    } finally {
      setLoading(false); setLoadingStep("");
      textareaRef.current?.focus();
    }
  };

  const canSend = (!!question.trim() || !!uploadedFile) && questionsLeft > 0 && !loading;
  const hasChat = messages.length > 0;

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-400" /> Ask AI
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Earn {isPremium ? "20" : "10"} pts per question{isPremium ? " ⚡ 2×" : ""} • Context stays in chat
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium
            ${questionsLeft > 0 ? "border-blue-500/20 bg-blue-500/5 text-blue-300" : "border-red-500/20 bg-red-500/5 text-red-300"}`}>
            <Zap className="w-3.5 h-3.5" />
            {questionsLeft} left
            {isPremium && <span className="text-xs font-bold text-yellow-300 ml-1">⚡</span>}
          </div>
          {hasChat && (
            <button onClick={clearChat} title="Clear chat"
              className="p-2 rounded-xl border border-white/10 text-slate-500 hover:text-red-400 hover:border-red-500/20 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-2 min-h-0">

        {!hasChat && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Start a conversation</h2>
              <p className="text-sm text-slate-500">
                Ask a question, upload an image or PDF.<br />AI remembers your chat context!
              </p>
            </div>
            <div className="w-full max-w-lg">
              <p className="text-xs text-slate-600 mb-3 flex items-center justify-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-500" /> Try these
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {SUGGESTIONS.map(q => (
                  <button key={q}
                    onClick={() => { setQuestion(q); textareaRef.current?.focus(); }}
                    className="text-left p-3 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-all group">
                    <span className="text-purple-400 mr-1.5 group-hover:mr-2 transition-all">→</span>{q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          msg.role === "user"
            ? <UserBubble key={i} msg={msg} />
            : <AIBubble   key={i} msg={msg} isPremium={isPremium} />
        ))}

        {loading && (
          <div className="flex gap-2 items-end">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="rounded-2xl rounded-bl-sm px-4 py-3 border border-white/10 bg-white/[0.04] flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-xs text-slate-500">{loadingStep || "AI is thinking…"}</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Limit banner */}
      {questionsLeft <= 0 && (
        <div className="flex-shrink-0 mb-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">
            Daily limit reached. {isPremium ? "Come back tomorrow!" : "Upgrade to Premium for 10 questions/day ⚡"}
          </p>
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 rounded-2xl border border-white/10 bg-white/[0.02] p-3 space-y-2">

        {uploadedFile && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
              ${fileType === "pdf" ? "bg-red-500/15 border border-red-500/20" : "bg-blue-500/15 border border-blue-500/20"}`}>
              {fileType === "pdf"
                ? <FileText className="w-3.5 h-3.5 text-red-400" />
                : <ImagePlus className="w-3.5 h-3.5 text-blue-400" />}
            </div>
            {previewSrc && (
              <img src={previewSrc} alt="preview" className="h-8 w-8 rounded object-cover border border-white/10" />
            )}
            <span className="text-xs text-slate-300 flex-1 truncate">{uploadedFile.name}</span>
            <button onClick={removeFile} className="text-slate-500 hover:text-red-400 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <button onClick={() => fileRef.current?.click()} title="Upload image or PDF"
            className="p-2 rounded-xl border border-white/10 text-slate-500 hover:text-blue-400 hover:border-blue-500/20 transition-all flex-shrink-0 mb-0.5">
            <ImagePlus className="w-4 h-4" />
          </button>

          <div className={`flex-1 relative transition-all ${isDragging ? "opacity-70" : ""}`}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
            <textarea
              ref={textareaRef}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={
                questionsLeft <= 0    ? "Daily limit reached…"
                : fileType === "pdf"  ? "What to do with this PDF? (or leave blank to auto-solve)"
                : fileType === "image"? "Describe what to solve (optional)…"
                : hasChat             ? "Ask a follow-up question…"
                :                      "Ask anything… (Shift+Enter for new line)"
              }
              disabled={questionsLeft <= 0 || loading}
              rows={1}
              className="w-full bg-transparent text-white placeholder-slate-600 resize-none focus:outline-none text-sm leading-relaxed py-2 disabled:opacity-40"
              style={{ minHeight: "36px", maxHeight: "160px" }}
            />
          </div>

          <button onClick={handleSend} disabled={!canSend}
            className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all flex-shrink-0 mb-0.5 glow-btn">
            <Send className="w-4 h-4" />
          </button>
        </div>

        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
      </div>
    </div>
  );
}