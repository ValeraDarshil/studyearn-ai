/**
 * StudyEarn AI — PDF Tools (v3 — Full Suite)
 * 10 tools: Images→PDF, Merge, Split, Compress, Rotate,
 *           Page Numbers, Watermark, Word→PDF, PPT→PDF, Excel→PDF
 * Custom filename before download on every tool
 */
import { useRef, useState } from "react";
import {
  FileText, Upload, Image, File, CheckCircle, X,
  Loader2, ArrowLeft, ChevronRight, Download, Edit3,
  Scissors, Minimize2, RotateCw, Hash, Droplets,
  FileType, FileSpreadsheet, Presentation as PptIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  convertImagesToPDF, mergePDFs, splitPDF, compressPDF,
  rotatePDF, addPageNumbers, watermarkPDF,
  wordToPDF, pptToPDF, excelToPDF,
} from "../utils/api";

// ─────────────────────────────────────────────────────────────
// TOOL DEFINITIONS
// ─────────────────────────────────────────────────────────────
interface Tool {
  id: string;
  title: string;
  desc: string;
  icon: any;
  color: string;
  accept: string;
  multi: boolean;
  singleFile?: boolean;
  extraConfig?: "split-pages" | "rotate-deg" | "watermark-text" | "page-num-pos";
  defaultFilename: string;
  category: "convert" | "edit" | "organize";
}

const TOOLS: Tool[] = [
  // ── Convert ──────────────────────────────────────────────
  {
    id: "img-pdf", title: "Images → PDF", desc: "JPG/PNG/WEBP images ko A4 PDF mein convert karo",
    icon: Image, color: "from-green-500 to-emerald-600",
    accept: "image/jpeg,image/png,image/webp,image/gif", multi: true,
    defaultFilename: "images-converted", category: "convert",
  },
  {
    id: "word-pdf", title: "Word → PDF", desc: ".docx/.doc file ko high-quality PDF mein convert karo",
    icon: FileType, color: "from-blue-500 to-blue-700",
    accept: ".docx,.doc,.odt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    multi: false, singleFile: true, defaultFilename: "word-converted", category: "convert",
  },
  {
    id: "ppt-pdf", title: "PPT → PDF", desc: ".pptx/.ppt presentations ko PDF mein convert karo",
    icon: PptIcon, color: "from-orange-500 to-red-500",
    accept: ".pptx,.ppt,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    multi: false, singleFile: true, defaultFilename: "presentation-converted", category: "convert",
  },
  {
    id: "excel-pdf", title: "Excel → PDF", desc: ".xlsx/.xls spreadsheets ko PDF mein convert karo",
    icon: FileSpreadsheet, color: "from-emerald-500 to-teal-600",
    accept: ".xlsx,.xls,.ods,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    multi: false, singleFile: true, defaultFilename: "spreadsheet-converted", category: "convert",
  },
  // ── Organize ─────────────────────────────────────────────
  {
    id: "merge-pdf", title: "Merge PDFs", desc: "Multiple PDF files ko ek document mein combine karo",
    icon: FileText, color: "from-pink-500 to-pink-700",
    accept: "application/pdf,.pdf", multi: true,
    defaultFilename: "merged", category: "organize",
  },
  {
    id: "split-pdf", title: "Split PDF", desc: "PDF se specific pages extract karo (e.g. 1,3,5-7)",
    icon: Scissors, color: "from-purple-500 to-purple-700",
    accept: "application/pdf,.pdf", multi: false, singleFile: true,
    extraConfig: "split-pages", defaultFilename: "split", category: "organize",
  },
  // ── Edit ─────────────────────────────────────────────────
  {
    id: "compress-pdf", title: "Compress PDF", desc: "PDF ka size reduce karo — sharing ke liye perfect",
    icon: Minimize2, color: "from-cyan-500 to-cyan-700",
    accept: "application/pdf,.pdf", multi: false, singleFile: true,
    defaultFilename: "compressed", category: "edit",
  },
  {
    id: "rotate-pdf", title: "Rotate PDF", desc: "Saare pages ko 90°, 180°, ya 270° rotate karo",
    icon: RotateCw, color: "from-yellow-500 to-orange-500",
    accept: "application/pdf,.pdf", multi: false, singleFile: true,
    extraConfig: "rotate-deg", defaultFilename: "rotated", category: "edit",
  },
  {
    id: "page-numbers", title: "Add Page Numbers", desc: "Har page pe page number stamp karo",
    icon: Hash, color: "from-indigo-500 to-violet-600",
    accept: "application/pdf,.pdf", multi: false, singleFile: true,
    extraConfig: "page-num-pos", defaultFilename: "numbered", category: "edit",
  },
  {
    id: "watermark", title: "Watermark PDF", desc: "PDF pe custom watermark text add karo",
    icon: Droplets, color: "from-rose-500 to-pink-600",
    accept: "application/pdf,.pdf", multi: false, singleFile: true,
    extraConfig: "watermark-text", defaultFilename: "watermarked", category: "edit",
  },
];

const CATEGORIES = [
  { id: "convert",  label: "Convert",  desc: "File formats convert karo" },
  { id: "organize", label: "Organize", desc: "PDFs manage karo" },
  { id: "edit",     label: "Edit",     desc: "PDF tools" },
];

const PROGRESS_STEPS: Record<string, string[]> = {
  "img-pdf":      ["Uploading images…", "Processing images…", "Creating PDF…", "Finishing…"],
  "merge-pdf":    ["Uploading PDFs…",   "Loading files…",     "Merging pages…", "Finishing…"],
  "split-pdf":    ["Uploading PDF…",    "Reading pages…",     "Extracting…",    "Finishing…"],
  "compress-pdf": ["Uploading PDF…",    "Analyzing…",         "Compressing…",   "Finishing…"],
  "rotate-pdf":   ["Uploading PDF…",    "Reading pages…",     "Rotating…",      "Finishing…"],
  "page-numbers": ["Uploading PDF…",    "Reading pages…",     "Adding numbers…","Finishing…"],
  "watermark":    ["Uploading PDF…",    "Reading pages…",     "Adding watermark…","Finishing…"],
  "word-pdf":     ["Uploading file…",   "Starting LibreOffice…","Converting…",  "Finishing…"],
  "ppt-pdf":      ["Uploading file…",   "Starting LibreOffice…","Converting…",  "Finishing…"],
  "excel-pdf":    ["Uploading file…",   "Starting LibreOffice…","Converting…",  "Finishing…"],
};

// ─────────────────────────────────────────────────────────────
// DOWNLOAD with custom filename
// ─────────────────────────────────────────────────────────────
function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export function PDFTools() {
  const { addPoints, logActivity } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTool, setActiveTool]       = useState<Tool | null>(null);
  const [activeCategory, setActiveCategory] = useState("convert");
  const [files, setFiles]                 = useState<File[]>([]);
  const [dragOver, setDragOver]           = useState(false);
  const [converting, setConverting]       = useState(false);
  const [step, setStep]                   = useState(0);
  const [result, setResult]               = useState<{ url: string; info?: string } | null>(null);
  const [error, setError]                 = useState("");

  // Extra config states
  const [splitPages, setSplitPages]       = useState("1-5");
  const [rotateDeg, setRotateDeg]         = useState<90 | 180 | 270>(90);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [pageNumPos, setPageNumPos]       = useState<"bottom-center" | "bottom-right">("bottom-center");

  // Custom filename state (shown after success)
  const [customName, setCustomName]       = useState("");
  const [editingName, setEditingName]     = useState(false);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles || !activeTool) return;
    setError("");
    const arr = Array.from(newFiles);
    if (activeTool.singleFile) {
      setFiles([arr[0]]);
      return;
    }
    setFiles(prev => Array.from(new Map([...prev, ...arr].map(f => [f.name + f.size, f])).values()));
  };

  const reset = () => {
    setActiveTool(null); setFiles([]); setConverting(false);
    setStep(0); setResult(null); setError("");
    setCustomName(""); setEditingName(false);
  };

  const selectTool = (tool: Tool) => {
    setActiveTool(tool);
    setFiles([]); setResult(null); setError("");
    setCustomName(tool.defaultFilename);
  };

  const formatSize = (b: number) =>
    b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(1)}KB` : `${(b/1048576).toFixed(1)}MB`;

  const handleConvert = async () => {
    if (!activeTool || !files.length) return;

    // Validations
    if (activeTool.id === "merge-pdf" && files.length < 2) {
      setError("Kam se kam 2 PDF files upload karo merge karne ke liye."); return;
    }

    setConverting(true); setError(""); setStep(0);

    const steps = PROGRESS_STEPS[activeTool.id] || PROGRESS_STEPS["img-pdf"];
    const stepInterval = setInterval(() => setStep(s => s < steps.length - 1 ? s + 1 : s), 900);

    try {
      let res: any;

      switch (activeTool.id) {
        case "img-pdf":      res = await convertImagesToPDF(files); break;
        case "merge-pdf":    res = await mergePDFs(files); break;
        case "split-pdf":    res = await splitPDF(files[0], splitPages); break;
        case "compress-pdf": res = await compressPDF(files[0]); break;
        case "rotate-pdf":   res = await rotatePDF(files[0], rotateDeg); break;
        case "page-numbers": res = await addPageNumbers(files[0], pageNumPos); break;
        case "watermark":    res = await watermarkPDF(files[0], watermarkText); break;
        case "word-pdf":     res = await wordToPDF(files[0]); break;
        case "ppt-pdf":      res = await pptToPDF(files[0]); break;
        case "excel-pdf":    res = await excelToPDF(files[0]); break;
        default:             res = { success: false, message: "Unknown tool" };
      }

      clearInterval(stepInterval);

      if (res?.success) {
        let info: string | undefined;
        if (activeTool.id === "compress-pdf" && res.savings) {
          info = `${res.origKB}KB → ${res.compKB}KB (${res.savings}% saved)`;
        }
        setResult({ url: res.url, info });
        addPoints(5);
        logActivity("pdf_tool", activeTool.title, 5);
      } else {
        setError(res?.message || "Conversion failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setConverting(false);
    }
  };

  const currentSteps = activeTool ? PROGRESS_STEPS[activeTool.id] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" /> PDF Tools
        </h1>
        <p className="text-sm text-slate-400 mt-1">10 powerful tools — fast, accurate, free</p>
      </div>

      {/* ── Tool Grid ─────────────────────────────────────── */}
      {!activeTool && (
        <div className="space-y-5">
          {/* Category tabs */}
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                  ${activeCategory === cat.id ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {TOOLS.filter(t => t.category === activeCategory).map(tool => (
              <button key={tool.id} onClick={() => selectTool(tool)}
                className="glass rounded-2xl p-5 text-left border border-white/5 hover:border-white/10 hover:-translate-y-0.5 transition-all group">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    <tool.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-white text-sm">{tool.title}</h3>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tool.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Active Tool UI ────────────────────────────────── */}
      {activeTool && (
        <div className="space-y-4">

          {/* Back + tool header */}
          <div className="flex items-center gap-3">
            <button onClick={reset}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${activeTool.color} flex items-center justify-center`}>
                <activeTool.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">{activeTool.title}</span>
            </div>
          </div>

          {/* Extra config options */}
          {activeTool.extraConfig === "split-pages" && !result && (
            <div className="rounded-xl p-4 border border-white/10 bg-white/[0.02] space-y-2">
              <label className="text-xs font-medium text-slate-400">Konse pages extract karne hain?</label>
              <input value={splitPages} onChange={e => setSplitPages(e.target.value)}
                placeholder="e.g. 1,3,5-7 ya all"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50" />
              <p className="text-xs text-slate-600">Examples: "1-5" (pages 1 to 5), "1,3,7" (specific pages), "all" (sab pages)</p>
            </div>
          )}

          {activeTool.extraConfig === "rotate-deg" && !result && (
            <div className="rounded-xl p-4 border border-white/10 bg-white/[0.02] space-y-2">
              <label className="text-xs font-medium text-slate-400">Rotation angle:</label>
              <div className="flex gap-2">
                {([90, 180, 270] as const).map(deg => (
                  <button key={deg} onClick={() => setRotateDeg(deg)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all
                      ${rotateDeg === deg ? "border-purple-500/50 bg-purple-500/10 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}>
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTool.extraConfig === "watermark-text" && !result && (
            <div className="rounded-xl p-4 border border-white/10 bg-white/[0.02] space-y-2">
              <label className="text-xs font-medium text-slate-400">Watermark text:</label>
              <input value={watermarkText} onChange={e => setWatermarkText(e.target.value.slice(0, 30))}
                placeholder="e.g. CONFIDENTIAL, DRAFT, My Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50" />
              <p className="text-xs text-slate-600">Max 30 characters • Diagonal pe appear karega</p>
            </div>
          )}

          {activeTool.extraConfig === "page-num-pos" && !result && (
            <div className="rounded-xl p-4 border border-white/10 bg-white/[0.02] space-y-2">
              <label className="text-xs font-medium text-slate-400">Page number position:</label>
              <div className="flex gap-2">
                {[
                  { val: "bottom-center", label: "Bottom Center" },
                  { val: "bottom-right",  label: "Bottom Right" },
                ].map(opt => (
                  <button key={opt.val} onClick={() => setPageNumPos(opt.val as any)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all
                      ${pageNumPos === opt.val ? "border-purple-500/50 bg-purple-500/10 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upload zone */}
          {!result && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all
                ${dragOver ? "border-purple-500/50 bg-purple-500/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"}`}>
              <input ref={fileInputRef} type="file"
                multiple={activeTool.multi && !activeTool.singleFile}
                accept={activeTool.accept} className="hidden"
                onChange={e => addFiles(e.target.files)} />
              <Upload className="w-7 h-7 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-white font-medium mb-1">
                {dragOver ? "Drop karo!" : "Drag & drop ya click karo upload karne ke liye"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {activeTool.singleFile ? "1 file" : "Multiple files allowed"} •{" "}
                {activeTool.accept.split(",").map(a => a.split("/").pop()?.replace(".", "")).filter(Boolean).join(", ").toUpperCase()}
              </p>
            </div>
          )}

          {/* File list */}
          {files.length > 0 && !result && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{files.length} file{files.length > 1 ? "s" : ""} selected</span>
                <button onClick={() => setFiles([])} className="text-xs text-slate-600 hover:text-red-400 transition-colors">Clear all</button>
              </div>
              <div className="divide-y divide-white/5 max-h-48 overflow-y-auto">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    {file.type.includes("pdf")
                      ? <File className="w-4 h-4 text-red-400 flex-shrink-0" />
                      : <Image className="w-4 h-4 text-green-400 flex-shrink-0" />}
                    <span className="flex-1 text-sm text-slate-300 truncate">{file.name}</span>
                    <span className="text-xs text-slate-600 flex-shrink-0">{formatSize(file.size)}</span>
                    <button onClick={() => setFiles(f => f.filter((_, j) => j !== i))}
                      className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0 ml-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              ❌ {error}
            </div>
          )}

          {/* Convert button */}
          {files.length > 0 && !result && !converting && (
            <button onClick={handleConvert}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all glow-btn">
              <activeTool.icon className="w-4 h-4" />
              {activeTool.title} — Convert Now
            </button>
          )}

          {/* Progress */}
          {converting && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center space-y-4">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <div>
                <p className="text-white font-semibold text-sm">{currentSteps[step] || "Processing…"}</p>
                <p className="text-xs text-slate-500 mt-1">{files.length} file{files.length > 1 ? "s" : ""} processing…</p>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden max-w-xs mx-auto">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${((step + 1) / currentSteps.length) * 100}%` }} />
              </div>
            </div>
          )}

          {/* ── SUCCESS + Custom Filename ── */}
          {result && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Ready to Download! ✅</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {result.info ? result.info : "+5 pts earned"}
                  </p>
                </div>
              </div>

              {/* ── CUSTOM FILENAME BOX ─────────────────── */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-semibold text-slate-300">Download file ka naam set karo:</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={customName}
                    onChange={e => setCustomName(e.target.value.replace(/[^a-zA-Z0-9\-_ ]/g, ""))}
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                    placeholder="File name (without .pdf)"
                  />
                  <span className="text-sm text-slate-500 flex-shrink-0">.pdf</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  File "{customName || activeTool.defaultFilename}.pdf" ke naam se download hogi
                </p>
              </div>

              {/* Download button */}
              <button
                onClick={() => triggerDownload(result.url, customName || activeTool.defaultFilename)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm hover:opacity-90 transition-all">
                <Download className="w-4 h-4" />
                Download: {(customName || activeTool.defaultFilename)}.pdf
              </button>

              <button onClick={reset}
                className="w-full text-xs text-slate-500 hover:text-white transition-colors py-1">
                ← Convert another file
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}