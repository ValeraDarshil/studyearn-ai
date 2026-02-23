// import { useState } from "react";
// import { Brain, Send, Zap, Lightbulb } from "lucide-react";
// import { useApp } from "../context/AppContext";
// import { askAIFromServer } from "../utils/api";

// export function AskAI() {
//   const { questionsLeft, useQuestion, addPoints, userId } = useApp();
//   const [image, setImage] = useState<string | null>(null);
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleImageUpload = (file: File) => {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImage(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleAsk = async () => {
//     if (!question.trim() || loading || questionsLeft <= 0) return;

//     try {
//       setLoading(true);
//       setShowAnswer(false);

//       const result = await askAIFromServer(
//         userId,
//         question,
//         image || undefined,
//       );

//       // if (result.error) {
//       //   setAnswer(result.error);
//       // } else {
//       //   setAnswer(result.answer);
//       //   addPoints(10);
//       //   useQuestion();
//       // }
//       if (!result.success) {
//         setAnswer(result.answer);
//       } else {
//         setAnswer(result.answer);
//         addPoints(10);
//         useQuestion();
//       }

//       setShowAnswer(true);
//     } catch (error) {
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

//   const formatAnswer = (text?: string) => {
//     if (!text) return null;

//     const lines = text.split("\n");

//     return lines.map((line, i) => (
//       <p key={i} className="text-sm text-slate-300 leading-relaxed my-1">
//         {line}
//       </p>
//     ));
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//             <Brain className="w-6 h-6 text-blue-400" />
//             Ask AI
//           </h1>
//           <p className="text-sm text-slate-400 mt-1">
//             Get instant explanations
//           </p>
//         </div>

//         <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500/20">
//           <Zap className="w-4 h-4 text-blue-400" />
//           <span className="text-sm font-medium text-blue-300">
//             {questionsLeft} questions remaining
//           </span>
//         </div>
//       </div>

//       {/* Input */}
//       <div className="rounded-2xl p-6 border border-white/10">
//         <textarea
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Ask any question..."
//           className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none"
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               handleAsk();
//             }
//           }}
//         />

//         <input
//           type="file"
//           accept="image/*"
//           capture="environment"
//           onChange={(e) => {
//             if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
//           }}
//           className="mt-3 text-sm text-slate-300"
//         />

//         {image && (
//           <img
//             src={image}
//             alt="preview"
//             className="mt-3 rounded-xl max-h-48 border border-white/10"
//           />
//         )}

//         <button
//           onClick={handleAsk}
//           disabled={!question.trim() || questionsLeft <= 0 || loading}
//           className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm disabled:opacity-40"
//         >
//           {loading ? (
//             <>
//               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               Processing...
//             </>
//           ) : (
//             <>
//               <Send className="w-4 h-4" />
//               Ask Question
//             </>
//           )}
//         </button>
//       </div>

//       {/* Suggested */}
//       {!showAnswer && (
//         <div>
//           <h3 className="text-sm text-slate-400 mb-3 flex items-center gap-2">
//             <Lightbulb className="w-4 h-4 text-yellow-400" />
//             Suggested Questions
//           </h3>
//           <div className="grid sm:grid-cols-2 gap-3">
//             {suggestedQuestions.map((q) => (
//               <button
//                 key={q}
//                 onClick={() => setQuestion(q)}
//                 className="text-left p-3 rounded-xl border border-white/5 text-sm text-slate-400 hover:text-slate-200"
//               >
//                 → {q}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Loading */}
//       {loading && (
//         <div className="rounded-2xl p-8 text-center text-slate-400">
//           AI is thinking...
//         </div>
//       )}

//       {/* Answer */}
//       {showAnswer && !loading && (
//         <div className="rounded-2xl overflow-hidden border border-white/10">
//           <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
//             <span className="text-sm font-semibold text-white">AI Answer</span>
//             <span className="text-xs text-green-400">+10 points earned</span>
//           </div>

//           <div className="px-6 py-4 bg-blue-500/[0.03] border-b border-white/5">
//             <p className="text-sm text-white">{question}</p>
//           </div>

//           <div className="px-6 py-6">{formatAnswer(answer)}</div>
//         </div>
//       )}
//     </div>
//   );
// }


// ------ calude ai -------- //


import { useState, useRef } from "react";
import { Brain, Send, Zap, Lightbulb, X, ImagePlus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { askAIFromServer } from "../utils/api";

// ── Markdown-style formatter ─────────────────────────────────────────────────
function formatAnswer(text: string) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines (add spacing)
    if (line.trim() === "") {
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }

    // ### Heading 3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-base font-bold text-purple-300 mt-4 mb-1">
          {line.replace("### ", "")}
        </h3>
      );
      continue;
    }

    // ## Heading 2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-lg font-bold text-blue-300 mt-4 mb-2">
          {line.replace("## ", "")}
        </h2>
      );
      continue;
    }

    // Bullet points  - or *
    if (line.match(/^[\-\*] /)) {
      elements.push(
        <div key={key++} className="flex gap-2 my-1">
          <span className="text-purple-400 mt-1 flex-shrink-0">▸</span>
          <span className="text-sm text-slate-300 leading-relaxed">
            {renderInline(line.replace(/^[\-\*] /, ""))}
          </span>
        </div>
      );
      continue;
    }

    // Numbered list  1. 2. etc
    if (line.match(/^\d+\. /)) {
      const num = line.match(/^(\d+)\. /)?.[1];
      elements.push(
        <div key={key++} className="flex gap-2 my-1">
          <span className="text-blue-400 font-bold text-sm flex-shrink-0 w-5">{num}.</span>
          <span className="text-sm text-slate-300 leading-relaxed">
            {renderInline(line.replace(/^\d+\. /, ""))}
          </span>
        </div>
      );
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={key++} className="text-sm text-slate-300 leading-relaxed my-1">
        {renderInline(line)}
      </p>
    );
  }

  return <div className="space-y-0.5">{elements}</div>;
}

// Inline: bold **text**, inline code `code`
function renderInline(text: string): JSX.Element {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="bg-white/10 text-green-300 px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export function AskAI() {
  const { questionsLeft, useQuestion, addPoints, userId, logActivity } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    setImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImageName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAsk = async () => {
    if ((!question.trim() && !image) || loading || questionsLeft <= 0) return;

    try {
      setLoading(true);
      setShowAnswer(false);

      const result = await askAIFromServer(userId, question, image || undefined);

      setAnswer(result.success ? result.answer : result.answer);
      if (result.success) {
        addPoints(10);
        useQuestion();
        logActivity("ask_ai", question.substring(0, 50) || "Image question", 10);
      }
      setShowAnswer(true);
    } catch {
      setAnswer("Something went wrong. Please try again.");
      setShowAnswer(true);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "Explain photosynthesis with chemical equation",
    "Solve: ∫x²dx from 0 to 1",
    "What is Newton's Third Law of Motion?",
    "Explain the concept of supply and demand",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-400" />
            Ask AI
          </h1>
          <p className="text-sm text-slate-400 mt-1">Get instant explanations • Earn 10 pts per question</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${questionsLeft > 0 ? "border-blue-500/20 bg-blue-500/5" : "border-red-500/20 bg-red-500/5"}`}>
          <Zap className={`w-4 h-4 ${questionsLeft > 0 ? "text-blue-400" : "text-red-400"}`} />
          <span className={`text-sm font-medium ${questionsLeft > 0 ? "text-blue-300" : "text-red-300"}`}>
            {questionsLeft} questions remaining
          </span>
        </div>
      </div>

      {/* ── Input Box ── */}
      <div className="rounded-2xl p-6 border border-white/10 bg-white/[0.02] space-y-4">

        {/* Text area */}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here... (or just upload an image below)"
          className="w-full h-28 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 resize-none focus:outline-none focus:border-blue-500/40 transition-colors text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); }
          }}
        />

        {/* Image upload area */}
        <div
          className="border border-dashed border-white/10 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus className="w-5 h-5 text-slate-500 flex-shrink-0" />
          <span className="text-sm text-slate-500">
            {imageName ? imageName : "Upload image of your question (optional)"}
          </span>
          {imageName && (
            <button
              onClick={(e) => { e.stopPropagation(); removeImage(); }}
              className="ml-auto text-slate-600 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }}
        />

        {/* Image preview */}
        {image && (
          <div className="relative w-fit">
            <img src={image} alt="preview" className="rounded-xl max-h-48 border border-white/10" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleAsk}
          disabled={(!question.trim() && !image) || questionsLeft <= 0 || loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              AI is thinking...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Ask Question
            </>
          )}
        </button>
      </div>

      {/* ── Suggested Questions ── */}
      {!showAnswer && !loading && (
        <div>
          <h3 className="text-sm text-slate-400 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            Try these questions
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setQuestion(q)}
                className="text-left p-3 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-all"
              >
                <span className="text-purple-400 mr-2">→</span>{q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="rounded-2xl p-8 border border-white/5 bg-white/[0.02] text-center">
          <div className="flex justify-center gap-1 mb-3">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
          <p className="text-sm text-slate-400">AI is analyzing your question...</p>
        </div>
      )}

      {/* ── Answer ── */}
      {showAnswer && !loading && (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">

          {/* Answer header */}
          <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">AI Answer</span>
            </div>
            <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
              +10 pts earned ✓
            </span>
          </div>

          {/* Question echo */}
          <div className="px-6 py-3 border-b border-white/5 bg-white/[0.01]">
            <p className="text-xs text-slate-500 mb-1">Your question:</p>
            <p className="text-sm text-slate-300">{question || "(image question)"}</p>
          </div>

          {/* Answer body */}
          <div className="px-6 py-5">
            {formatAnswer(answer)}
          </div>

          {/* Ask another */}
          <div className="px-6 py-3 border-t border-white/5">
            <button
              onClick={() => {
                setShowAnswer(false);
                setQuestion("");
                removeImage();
              }}
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              + Ask another question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}