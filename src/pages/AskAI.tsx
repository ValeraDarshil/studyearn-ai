// import { useState, useRef } from "react";
// import { Brain, Send, Zap, Lightbulb, X, ImagePlus } from "lucide-react";
// import { useApp } from "../context/AppContext";
// import { askAIFromServer } from "../utils/api";

// // ── Markdown-style formatter ─────────────────────────────────────────────────
// function formatAnswer(text: string) {
//   if (!text) return null;

//   const lines = text.split("\n");
//   const elements: JSX.Element[] = [];
//   let key = 0;

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];

//     // Skip empty lines (add spacing)
//     if (line.trim() === "") {
//       elements.push(<div key={key++} className="h-2" />);
//       continue;
//     }

//     // ### Heading 3
//     if (line.startsWith("### ")) {
//       elements.push(
//         <h3
//           key={key++}
//           className="text-base font-bold text-purple-300 mt-4 mb-1"
//         >
//           {line.replace("### ", "")}
//         </h3>,
//       );
//       continue;
//     }

//     // ## Heading 2
//     if (line.startsWith("## ")) {
//       elements.push(
//         <h2 key={key++} className="text-lg font-bold text-blue-300 mt-4 mb-2">
//           {line.replace("## ", "")}
//         </h2>,
//       );
//       continue;
//     }

//     // Bullet points  - or *
//     if (line.match(/^[\-\*] /)) {
//       elements.push(
//         <div key={key++} className="flex gap-2 my-1">
//           <span className="text-purple-400 mt-1 flex-shrink-0">▸</span>
//           <span className="text-sm text-slate-300 leading-relaxed">
//             {renderInline(line.replace(/^[\-\*] /, ""))}
//           </span>
//         </div>,
//       );
//       continue;
//     }

//     // Numbered list  1. 2. etc
//     if (line.match(/^\d+\. /)) {
//       const num = line.match(/^(\d+)\. /)?.[1];
//       elements.push(
//         <div key={key++} className="flex gap-2 my-1">
//           <span className="text-blue-400 font-bold text-sm flex-shrink-0 w-5">
//             {num}.
//           </span>
//           <span className="text-sm text-slate-300 leading-relaxed">
//             {renderInline(line.replace(/^\d+\. /, ""))}
//           </span>
//         </div>,
//       );
//       continue;
//     }

//     // Normal paragraph
//     elements.push(
//       <p key={key++} className="text-sm text-slate-300 leading-relaxed my-1">
//         {renderInline(line)}
//       </p>,
//     );
//   }

//   return <div className="space-y-0.5">{elements}</div>;
// }

// // Inline: bold **text**, inline code `code`
// function renderInline(text: string): JSX.Element {
//   const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
//   return (
//     <>
//       {parts.map((part, i) => {
//         if (part.startsWith("**") && part.endsWith("**")) {
//           return (
//             <strong key={i} className="text-white font-semibold">
//               {part.slice(2, -2)}
//             </strong>
//           );
//         }
//         if (part.startsWith("`") && part.endsWith("`")) {
//           return (
//             <code
//               key={i}
//               className="bg-white/10 text-green-300 px-1 rounded text-xs font-mono"
//             >
//               {part.slice(1, -1)}
//             </code>
//           );
//         }
//         return <span key={i}>{part}</span>;
//       })}
//     </>
//   );
// }
// // ─────────────────────────────────────────────────────────────────────────────

// export function AskAI() {
//   const { questionsLeft, useQuestion, addPoints, userId, logActivity } =
//     useApp();
//   const [image, setImage] = useState<string | null>(null);
//   const [imageName, setImageName] = useState<string>("");
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const fileRef = useRef<HTMLInputElement>(null);

//   const handleImageUpload = (file: File) => {
//     setImageName(file.name);
//     const reader = new FileReader();
//     reader.onloadend = () => setImage(reader.result as string);
//     reader.readAsDataURL(file);
//   };

//   const removeImage = () => {
//     setImage(null);
//     setImageName("");
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   const handleAsk = async () => {
//     if ((!question.trim() && !image) || loading || questionsLeft <= 0) return;

//     try {
//       setLoading(true);
//       setShowAnswer(false);

//       const result = await askAIFromServer(
//         userId,
//         question,
//         image || undefined,
//       );

//       setAnswer(result.success ? result.answer : result.answer);
//       if (result.success) {
//         addPoints(10);
//         useQuestion();
//         logActivity(
//           "ask_question",
//           question.substring(0, 50) || "Image question",
//           10,
//         );
//       }
//       setShowAnswer(true);
//     } catch {
//       setAnswer("Something went wrong. Please try again.");
//       setShowAnswer(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const suggestedQuestions = [
//     "Explain photosynthesis with chemical equation",
//     "Solve: ∫x²dx from 0 to 1",
//     "What is Newton's Third Law of Motion?",
//     "Explain the concept of supply and demand",
//   ];

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* ── Header ── */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//             <Brain className="w-6 h-6 text-blue-400" />
//             Ask AI
//           </h1>
//           <p className="text-sm text-slate-400 mt-1">
//             Get instant explanations • Earn 10 pts per question
//           </p>
//         </div>
//         <div
//           className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${questionsLeft > 0 ? "border-blue-500/20 bg-blue-500/5" : "border-red-500/20 bg-red-500/5"}`}
//         >
//           <Zap
//             className={`w-4 h-4 ${questionsLeft > 0 ? "text-blue-400" : "text-red-400"}`}
//           />
//           <span
//             className={`text-sm font-medium ${questionsLeft > 0 ? "text-blue-300" : "text-red-300"}`}
//           >
//             {questionsLeft} questions remaining
//           </span>
//         </div>
//       </div>

//       {/* ── Input Box ── */}
//       <div className="rounded-2xl p-6 border border-white/10 bg-white/[0.02] space-y-4">
//         {/* Text area */}
//         <textarea
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Type your question here... (or just upload an image below)"
//           className="w-full h-28 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 resize-none focus:outline-none focus:border-blue-500/40 transition-colors text-sm"
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               handleAsk();
//             }
//           }}
//         />

//         {/* Image upload area */}
//         <div
//           className="border border-dashed border-white/10 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
//           onClick={() => fileRef.current?.click()}
//         >
//           <ImagePlus className="w-5 h-5 text-slate-500 flex-shrink-0" />
//           <span className="text-sm text-slate-500">
//             {imageName ? imageName : "Upload image of your question (optional)"}
//           </span>
//           {imageName && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 removeImage();
//               }}
//               className="ml-auto text-slate-600 hover:text-red-400 transition-colors"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//         <input
//           ref={fileRef}
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => {
//             if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
//           }}
//         />

//         {/* Image preview */}
//         {image && (
//           <div className="relative w-fit">
//             <img
//               src={image}
//               alt="preview"
//               className="rounded-xl max-h-48 border border-white/10"
//             />
//             <button
//               onClick={removeImage}
//               className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
//             >
//               <X className="w-3 h-3" />
//             </button>
//           </div>
//         )}

//         {/* Submit */}
//         <button
//           onClick={handleAsk}
//           disabled={
//             (!question.trim() && !image) || questionsLeft <= 0 || loading
//           }
//           className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
//         >
//           {loading ? (
//             <>
//               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               AI is thinking...
//             </>
//           ) : (
//             <>
//               <Send className="w-4 h-4" />
//               Ask Question
//             </>
//           )}
//         </button>
//       </div>

//       {/* ── Suggested Questions ── */}
//       {!showAnswer && !loading && (
//         <div>
//           <h3 className="text-sm text-slate-400 mb-3 flex items-center gap-2">
//             <Lightbulb className="w-4 h-4 text-yellow-400" />
//             Try these questions
//           </h3>
//           <div className="grid sm:grid-cols-2 gap-3">
//             {suggestedQuestions.map((q) => (
//               <button
//                 key={q}
//                 onClick={() => setQuestion(q)}
//                 className="text-left p-3 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-all"
//               >
//                 <span className="text-purple-400 mr-2">→</span>
//                 {q}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── Loading ── */}
//       {loading && (
//         <div className="rounded-2xl p-8 border border-white/5 bg-white/[0.02] text-center">
//           <div className="flex justify-center gap-1 mb-3">
//             {[0, 1, 2].map((i) => (
//               <div
//                 key={i}
//                 className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
//                 style={{ animationDelay: `${i * 150}ms` }}
//               />
//             ))}
//           </div>
//           <p className="text-sm text-slate-400">
//             AI is analyzing your question...
//           </p>
//         </div>
//       )}

//       {/* ── Answer ── */}
//       {showAnswer && !loading && (
//         <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
//           {/* Answer header */}
//           <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10">
//             <div className="flex items-center gap-2">
//               <Brain className="w-4 h-4 text-blue-400" />
//               <span className="text-sm font-semibold text-white">
//                 AI Answer
//               </span>
//             </div>
//             <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
//               +10 pts earned ✓
//             </span>
//           </div>

//           {/* Question echo */}
//           <div className="px-6 py-3 border-b border-white/5 bg-white/[0.01]">
//             <p className="text-xs text-slate-500 mb-1">Your question:</p>
//             <p className="text-sm text-slate-300">
//               {question || "(image question)"}
//             </p>
//           </div>

//           {/* Answer body */}
//           <div className="px-6 py-5">{formatAnswer(answer)}</div>

//           {/* Ask another */}
//           <div className="px-6 py-3 border-t border-white/5">
//             <button
//               onClick={() => {
//                 setShowAnswer(false);
//                 setQuestion("");
//                 removeImage();
//               }}
//               className="text-xs text-slate-500 hover:text-white transition-colors"
//             >
//               + Ask another question
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// calude aii //

import { useState, useRef, useCallback } from "react";
import {
  Brain, Send, Zap, Lightbulb, X, ImagePlus, FileText, AlertCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { API_URL } from "../utils/api";
import { incrementAction } from "../utils/user-api";

// ── Markdown formatter ────────────────────────────────────────────────────────
function renderInline(text: string): JSX.Element {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        if (part.startsWith("`") && part.endsWith("`"))
          return <code key={i} className="bg-white/10 text-green-300 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
          return <em key={i} className="text-slate-300 italic">{part.slice(1, -1)}</em>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function formatAnswer(text: string) {
  if (!text) return null;
  const elements: JSX.Element[] = [];
  let key = 0;
  for (const line of text.split("\n")) {
    if (!line.trim()) { elements.push(<div key={key++} className="h-2" />); continue; }
    if (line.startsWith("### ")) { elements.push(<h3 key={key++} className="text-base font-bold text-purple-300 mt-4 mb-1">{line.slice(4)}</h3>); continue; }
    if (line.startsWith("## "))  { elements.push(<h2 key={key++} className="text-lg font-bold text-blue-300 mt-4 mb-2">{line.slice(3)}</h2>); continue; }
    if (line.startsWith("# "))   { elements.push(<h1 key={key++} className="text-xl font-bold text-white mt-4 mb-2">{line.slice(2)}</h1>); continue; }
    if (line.match(/^[-*] /)) {
      elements.push(
        <div key={key++} className="flex gap-2 my-1">
          <span className="text-purple-400 mt-0.5 flex-shrink-0 text-xs">▸</span>
          <span className="text-sm text-slate-300 leading-relaxed">{renderInline(line.slice(2))}</span>
        </div>
      ); continue;
    }
    if (line.match(/^\d+\. /)) {
      const num = line.match(/^(\d+)\./)?.[1];
      elements.push(
        <div key={key++} className="flex gap-2 my-1">
          <span className="text-blue-400 font-bold text-sm flex-shrink-0 min-w-[20px]">{num}.</span>
          <span className="text-sm text-slate-300 leading-relaxed">{renderInline(line.replace(/^\d+\. /, ""))}</span>
        </div>
      ); continue;
    }
    elements.push(<p key={key++} className="text-sm text-slate-300 leading-relaxed my-1">{renderInline(line)}</p>);
  }
  return <div className="space-y-0.5">{elements}</div>;
}

// ── Compress image to keep it small for API ───────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
export function AskAI() {
  const {
    questionsLeft, useQuestion, addPoints, userId, logActivity,
    checkAndUnlockAchievements, userStats, setUserStats,
  } = useApp();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileType, setFileType]         = useState<"image" | "pdf" | null>(null);
  const [previewSrc, setPreviewSrc]     = useState<string | null>(null);

  const [question, setQuestion]     = useState("");
  const [answer, setAnswer]         = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // ── File selection ──────────────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const isImg = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImg && !isPdf) {
      alert("Only images (JPG/PNG/WebP) and PDF files are supported.");
      return;
    }
    setUploadedFile(file);
    setFileType(isImg ? "image" : "pdf");
    setShowAnswer(false);
    setAnswer("");

    if (isImg) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewSrc(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc(null);
    }
  }, []);

  const removeFile = () => {
    setUploadedFile(null); setFileType(null); setPreviewSrc(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleAsk = async () => {
    if ((!question.trim() && !uploadedFile) || loading || questionsLeft <= 0) return;
    setLoading(true); setShowAnswer(false);

    try {
      let result: { success: boolean; answer: string };
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = { Authorization: `Bearer ${token || ""}` };

      if (fileType === "pdf" && uploadedFile) {
        // ── PDF path: send as FormData to /api/ai/solve-pdf ────────────
        setLoadingStep("Extracting PDF text…");
        const form = new FormData();
        form.append("file", uploadedFile);
        if (question.trim()) form.append("prompt", question.trim());

        const res = await fetch(`${API_URL}/api/ai/solve-pdf`, {
          method: "POST",
          headers, // no Content-Type — browser sets multipart boundary
          body: form,
        });
        result = await res.json();

      } else {
        // ── Image or text path: send as JSON to /api/ai/ask ────────────
        setLoadingStep(fileType === "image" ? "Compressing image…" : "Thinking…");
        let imageData: string | undefined;

        if (fileType === "image" && previewSrc) {
          imageData = await compressImage(previewSrc, 1024);
          setLoadingStep("AI is analyzing image…");
        } else {
          setLoadingStep("AI is thinking…");
        }

        const res = await fetch(`${API_URL}/api/ai/ask`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: question.trim() || undefined,
            image:  imageData,
            userId,
          }),
        });
        result = await res.json();
      }

      setAnswer(result.answer || "No answer received. Please try again.");

      if (result.success) {
        addPoints(10);
        useQuestion();
        logActivity("ask_question", question.substring(0, 50) || `${fileType} question`, 10);
        const newTotal = (userStats.totalQuestionsAsked || 0) + 1;
        setUserStats({ ...userStats, totalQuestionsAsked: newTotal });
        incrementAction("question");
        checkAndUnlockAchievements({ totalQuestionsAsked: newTotal });
      }
      setShowAnswer(true);

    } catch (err) {
      console.error(err);
      setAnswer("Connection error. Please check your internet and try again.");
      setShowAnswer(true);
    } finally {
      setLoading(false); setLoadingStep("");
    }
  };

  const suggestedQuestions = [
    "Explain photosynthesis with the chemical equation",
    "Solve: ∫x²dx from 0 to 1, show all steps",
    "What is Newton's Third Law? Give real examples",
    "Explain supply and demand with a simple example",
  ];

  const canAsk = (!!question.trim() || !!uploadedFile) && questionsLeft > 0 && !loading;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-400" /> Ask AI
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Type a question • Upload an image or PDF • Earn 10 pts per question
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border w-fit
          ${questionsLeft > 0 ? "border-blue-500/20 bg-blue-500/5" : "border-red-500/20 bg-red-500/5"}`}>
          <Zap className={`w-4 h-4 ${questionsLeft > 0 ? "text-blue-400" : "text-red-400"}`} />
          <span className={`text-sm font-medium ${questionsLeft > 0 ? "text-blue-300" : "text-red-300"}`}>
            {questionsLeft} questions remaining
          </span>
        </div>
      </div>

      {/* ── Input card ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.02] space-y-4">

        {/* Textarea */}
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder={
            fileType === "pdf"   ? "What to do with this PDF? e.g. 'Solve all questions' or 'Summarize chapter 3'…"
            : fileType === "image" ? "Optional: describe what to solve — or leave blank and AI reads it automatically…"
            : "Type your question here… or upload an image / PDF below"
          }
          rows={4}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 resize-none focus:outline-none focus:border-blue-500/40 transition-colors text-sm leading-relaxed"
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); } }}
        />

        {/* Upload zone — when no file selected */}
        {!uploadedFile && (
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200
              ${isDragging ? "border-purple-400/70 bg-purple-500/10 scale-[1.01]" : "border-white/10 hover:border-purple-500/30 hover:bg-white/[0.02]"}`}
          >
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <ImagePlus className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-[11px] text-slate-500">Image</span>
              </div>
              <span className="text-slate-600 text-xs font-light">or</span>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-[11px] text-slate-500">PDF</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400">
                <span className="text-slate-200 font-medium">Click to upload</span> or drag &amp; drop
              </p>
              <p className="text-xs text-slate-600 mt-0.5">JPG · PNG · WebP · PDF</p>
            </div>
          </div>
        )}

        {/* File preview — when file selected */}
        {uploadedFile && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="flex items-center gap-3 p-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                ${fileType === "pdf" ? "bg-red-500/15 border border-red-500/20" : "bg-blue-500/15 border border-blue-500/20"}`}>
                {fileType === "pdf"
                  ? <FileText className="w-4 h-4 text-red-400" />
                  : <ImagePlus className="w-4 h-4 text-blue-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{uploadedFile.name}</p>
                <p className="text-xs text-slate-500">
                  {fileType === "pdf" ? "PDF document" : "Image"} · {(uploadedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <button onClick={removeFile} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image preview */}
            {fileType === "image" && previewSrc && (
              <div className="px-3 pb-3">
                <img src={previewSrc} alt="preview" className="rounded-lg max-h-64 max-w-full border border-white/10 object-contain bg-black/20" />
              </div>
            )}

            {/* PDF info */}
            {fileType === "pdf" && (
              <div className="px-3 pb-3 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  AI will extract and read all text from this PDF. Works best with text-based PDFs.
                  If scanned/handwritten, use image upload instead.
                </p>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />

        {/* Submit button */}
        <button
          onClick={handleAsk}
          disabled={!canAsk}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all glow-btn"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
              {loadingStep || "Processing…"}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {fileType === "pdf" ? "Solve PDF" : fileType === "image" ? "Solve Image" : "Ask Question"}
            </>
          )}
        </button>
      </div>

      {/* ── Suggested questions ─────────────────────────────────────────── */}
      {!showAnswer && !loading && !uploadedFile && (
        <div>
          <h3 className="text-sm text-slate-400 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" /> Try these
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {suggestedQuestions.map(q => (
              <button key={q} onClick={() => setQuestion(q)}
                className="text-left p-3 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-all group">
                <span className="text-purple-400 mr-2 group-hover:mr-3 transition-all">→</span>{q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Loading ─────────────────────────────────────────────────────── */}
      {loading && (
        <div className="rounded-2xl p-8 border border-white/5 bg-white/[0.02] text-center">
          <div className="flex justify-center gap-1.5 mb-4">
            {[0,1,2,3].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
          <p className="text-sm text-white font-medium">{loadingStep || "AI is thinking…"}</p>
          <p className="text-xs text-slate-500 mt-1">
            {fileType === "pdf" ? "Reading and solving PDF questions…" : fileType === "image" ? "Analyzing image, this may take 10–20s…" : "Usually takes 5–10 seconds"}
          </p>
        </div>
      )}

      {/* ── Answer ──────────────────────────────────────────────────────── */}
      {showAnswer && !loading && (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] animate-slide-up">
          {/* Header */}
          <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">AI Answer</span>
              {fileType && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${fileType === "pdf" ? "bg-red-500/15 text-red-300" : "bg-blue-500/15 text-blue-300"}`}>
                  {fileType === "pdf" ? "📄 PDF" : "🖼️ Image"}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
              +10 pts ✓
            </span>
          </div>

          {/* Question echo */}
          <div className="px-6 py-3 border-b border-white/5 bg-white/[0.01]">
            <p className="text-xs text-slate-500 mb-1">Your question:</p>
            <p className="text-sm text-slate-300">
              {question || `(${fileType === "pdf" ? "PDF analysis" : "image question"})`}
            </p>
            {uploadedFile && (
              <p className="text-xs text-slate-600 mt-0.5">📎 {uploadedFile.name}</p>
            )}
          </div>

          {/* Answer body */}
          <div className="px-6 py-5">{formatAnswer(answer)}</div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-white/5">
            <button
              onClick={() => { setShowAnswer(false); setQuestion(""); removeFile(); }}
              className="text-xs text-slate-500 hover:text-purple-400 transition-colors"
            >
              + Ask another question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}