/**
 * StudyEarn AI — PDF Tools (v2 — Fast)
 * Images→PDF and Merge PDF with progress feedback
 */
import { useRef, useState } from "react";
import {
  FileText, Upload, Image, File, CheckCircle, X,
  Loader2, ArrowLeft, Merge, ImageIcon, ChevronRight
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { convertImagesToPDF, mergePDFs } from "../utils/api";

const TOOLS = [
  {
    id: "img-pdf",
    title: "Images → PDF",
    desc: "Convert JPG, PNG, WEBP images into a clean A4 PDF",
    icon: ImageIcon,
    accept: "image/jpeg,image/png,image/webp,image/gif",
    color: "from-green-500 to-emerald-600",
    badge: "Most Used",
    multi: true,
  },
  {
    id: "merge-pdf",
    title: "Merge PDFs",
    desc: "Combine multiple PDF files into one document",
    icon: Merge,
    accept: "application/pdf",
    color: "from-pink-500 to-pink-600",
    badge: null,
    multi: true,
  },
];

const COMING_SOON = [
  { title: "PDF → Word",    icon: "📝", from: "PDF",  to: "DOCX" },
  { title: "PDF → PPT",     icon: "📊", from: "PDF",  to: "PPT"  },
  { title: "Word → PDF",    icon: "📄", from: "DOCX", to: "PDF"  },
  { title: "PDF Editor",    icon: "✏️",  from: "PDF",  to: "PDF"  },
];

const STEPS = [
  "Uploading files…",
  "Processing…",
  "Generating PDF…",
  "Almost done…",
];

export function PDFTools() {
  const { addPoints, logActivity } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTool, setActiveTool]   = useState<string | null>(null);
  const [files, setFiles]             = useState<File[]>([]);
  const [dragOver, setDragOver]       = useState(false);
  const [converting, setConverting]   = useState(false);
  const [step, setStep]               = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError]             = useState("");

  const currentTool = TOOLS.find(t => t.id === activeTool);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setError("");
    const arr = Array.from(newFiles);
    setFiles(prev => {
      const merged = [...prev, ...arr];
      // Deduplicate by name+size
      return Array.from(new Map(merged.map(f => [f.name + f.size, f])).values());
    });
  };

  const removeFile = (idx: number) => setFiles(f => f.filter((_, i) => i !== idx));

  const reset = () => {
    setActiveTool(null); setFiles([]); setConverting(false);
    setStep(0); setDownloadUrl(""); setError("");
  };

  const handleConvert = async () => {
    if (!files.length || !activeTool) return;

    // Validate
    if (activeTool === "merge-pdf" && files.length < 2) {
      setError("Please upload at least 2 PDF files to merge.");
      return;
    }

    setConverting(true); setError(""); setStep(0);

    // Step animation — gives user visual feedback while processing
    const stepInterval = setInterval(() => {
      setStep(s => (s < STEPS.length - 1 ? s + 1 : s));
    }, 800);

    try {
      const result = activeTool === "merge-pdf"
        ? await mergePDFs(files)
        : await convertImagesToPDF(files);

      clearInterval(stepInterval);

      if (result?.success) {
        setDownloadUrl(result.url);
        addPoints(5);
        logActivity("pdf_tool", activeTool === "merge-pdf" ? "Merged PDFs" : "Images to PDF", 5);
      } else {
        setError(result?.message || "Conversion failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setConverting(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" /> PDF Tools
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Fast document conversion — seconds, not minutes
        </p>
      </div>

      {/* ── Tool selector ─────────────────────────────────── */}
      {!activeTool && (
        <div className="space-y-4">
          {/* Active tools */}
          <div className="grid sm:grid-cols-2 gap-4">
            {TOOLS.map(tool => (
              <button key={tool.id} onClick={() => setActiveTool(tool.id)}
                className="glass rounded-2xl p-5 text-left border border-white/5 hover:border-white/10 hover:-translate-y-0.5 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 font-semibold">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{tool.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-purple-400 font-medium">
                  Start <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>

          {/* Coming soon */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5">
              <span className="text-xs font-semibold text-slate-400">Coming Soon</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-white/5">
              {COMING_SOON.map(t => (
                <div key={t.title} className="flex items-center gap-2.5 px-4 py-3 opacity-50">
                  <span className="text-lg">{t.icon}</span>
                  <div>
                    <div className="text-xs font-medium text-slate-300">{t.title}</div>
                    <div className="text-[10px] text-slate-600">{t.from} → {t.to}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Active tool ───────────────────────────────────── */}
      {activeTool && currentTool && (
        <div className="space-y-4">

          {/* Back + tool name */}
          <div className="flex items-center gap-3">
            <button onClick={reset}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-sm font-semibold text-white">{currentTool.title}</span>
          </div>

          {/* ── Upload zone ── */}
          {!downloadUrl && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all
                ${dragOver ? "border-purple-500/50 bg-purple-500/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"}`}>
              <input ref={fileInputRef} type="file" multiple={currentTool.multi}
                accept={currentTool.accept} className="hidden"
                onChange={e => addFiles(e.target.files)} />
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-white font-medium mb-1">
                {dragOver ? "Drop files here!" : "Drag & drop or click to upload"}
              </p>
              <p className="text-xs text-slate-500">
                {activeTool === "merge-pdf" ? "PDF files only • Min 2 files" : "JPG, PNG, WEBP • Multiple allowed"}
              </p>
            </div>
          )}

          {/* ── File list ── */}
          {files.length > 0 && !downloadUrl && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{files.length} file{files.length > 1 ? "s" : ""} selected</span>
                <button onClick={() => setFiles([])} className="text-xs text-slate-600 hover:text-red-400 transition-colors">
                  Clear all
                </button>
              </div>
              <div className="divide-y divide-white/5 max-h-52 overflow-y-auto">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    {file.type.includes("pdf")
                      ? <File className="w-4 h-4 text-red-400 flex-shrink-0" />
                      : <Image className="w-4 h-4 text-green-400 flex-shrink-0" />}
                    <span className="flex-1 text-sm text-slate-300 truncate">{file.name}</span>
                    <span className="text-xs text-slate-600 flex-shrink-0">{formatSize(file.size)}</span>
                    <button onClick={() => removeFile(i)}
                      className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* ── Convert button ── */}
          {files.length > 0 && !downloadUrl && !converting && (
            <button onClick={handleConvert}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all glow-btn">
              {currentTool.icon && <currentTool.icon className="w-4 h-4" />}
              Convert Now
            </button>
          )}

          {/* ── Progress / loading ── */}
          {converting && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center space-y-4">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <div>
                <p className="text-white font-semibold text-sm">{STEPS[step]}</p>
                <p className="text-xs text-slate-500 mt-1">Processing {files.length} file{files.length > 1 ? "s" : ""}…</p>
              </div>
              {/* Progress bar animation */}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mx-auto max-w-xs">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%`, transition: "width 0.8s ease" }} />
              </div>
            </div>
          )}

          {/* ── Success ── */}
          {downloadUrl && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Done! ✅</h3>
                <p className="text-xs text-slate-500 mt-1">+5 pts earned</p>
              </div>
              <a href={downloadUrl} download
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm hover:opacity-90 transition-all">
                <FileText className="w-4 h-4" />
                Download PDF
              </a>
              <div>
                <button onClick={reset}
                  className="text-xs text-slate-400 hover:text-white transition-colors">
                  Convert another file
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}