// import { useState } from 'react';
// import { Presentation, Download, Sparkles, Palette, GraduationCap, FileText, ChevronDown } from 'lucide-react';
// import { useApp } from '../context/AppContext';

// export function PPTGenerator() {
//   const { addPoints } = useApp();
//   const [topic, setTopic] = useState('');
//   const [classLevel, setClassLevel] = useState('');
//   const [style, setStyle] = useState('detailed');
//   const [loading, setLoading] = useState(false);
//   const [generated, setGenerated] = useState(false);

//   const handleGenerate = () => {
//     if (!topic.trim()) return;
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       setGenerated(true);
//       addPoints(25);
//     }, 3000);
//   };

//   const styles = [
//     { id: 'simple', label: 'Simple', desc: 'Clean & minimal', icon: '📋' },
//     { id: 'detailed', label: 'Detailed', desc: 'Comprehensive', icon: '📊' },
//     { id: 'creative', label: 'Creative', desc: 'Visual & fun', icon: '🎨' },
//   ];

//   const previewSlides = [
//     { title: 'Title Slide', content: topic || 'Your Topic', color: 'from-blue-500/20 to-purple-500/20' },
//     { title: 'Introduction', content: 'Overview and key concepts', color: 'from-purple-500/20 to-pink-500/20' },
//     { title: 'Main Content', content: 'Detailed explanation with diagrams', color: 'from-cyan-500/20 to-blue-500/20' },
//   ];

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//           <Presentation className="w-6 h-6 text-purple-400" />
//           PPT Generator
//         </h1>
//         <p className="text-sm text-slate-400 mt-1">Create beautiful presentations in seconds with AI</p>
//       </div>

//       {/* Input Section */}
//       <div className="glass rounded-2xl p-6 space-y-5">
//         {/* Topic */}
//         <div>
//           <label className="text-sm font-medium text-slate-300 mb-2 block">Topic</label>
//           <div className="relative">
//             <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
//             <input
//               type="text"
//               value={topic}
//               onChange={(e) => setTopic(e.target.value)}
//               placeholder="e.g., Machine Learning Basics, Photosynthesis Process..."
//               className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm"
//             />
//           </div>
//         </div>

//         {/* Class Level */}
//         <div>
//           <label className="text-sm font-medium text-slate-300 mb-2 block">Class Level</label>
//           <div className="relative">
//             <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
//             <select
//               value={classLevel}
//               onChange={(e) => setClassLevel(e.target.value)}
//               className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white appearance-none focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm cursor-pointer"
//             >
//               <option value="" className="bg-navy-900">Select class level</option>
//               <option value="8" className="bg-navy-900">Class 8</option>
//               <option value="9" className="bg-navy-900">Class 9</option>
//               <option value="10" className="bg-navy-900">Class 10</option>
//               <option value="11" className="bg-navy-900">Class 11</option>
//               <option value="12" className="bg-navy-900">Class 12</option>
//               <option value="ug" className="bg-navy-900">Undergraduate</option>
//               <option value="pg" className="bg-navy-900">Postgraduate</option>
//             </select>
//             <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-600 pointer-events-none" />
//           </div>
//         </div>

//         {/* Style Selector */}
//         <div>
//           <label className="text-sm font-medium text-slate-300 mb-3 block flex items-center gap-2">
//             <Palette className="w-4 h-4 text-purple-400" />
//             Style
//           </label>
//           <div className="grid grid-cols-3 gap-3">
//             {styles.map((s) => (
//               <button
//                 key={s.id}
//                 onClick={() => setStyle(s.id)}
//                 className={`p-4 rounded-xl border text-center transition-all duration-200 ${
//                   style === s.id
//                     ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30 ring-1 ring-purple-500/20'
//                     : 'bg-white/[0.02] border-white/5 hover:border-white/10'
//                 }`}
//               >
//                 <div className="text-2xl mb-2">{s.icon}</div>
//                 <div className="text-sm font-semibold text-white">{s.label}</div>
//                 <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Generate Button */}
//         <button
//           onClick={handleGenerate}
//           disabled={!topic.trim() || loading}
//           className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed glow-btn text-sm"
//         >
//           {loading ? (
//             <>
//               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               Generating presentation...
//             </>
//           ) : (
//             <>
//               <Sparkles className="w-4 h-4" />
//               Generate Presentation
//             </>
//           )}
//         </button>
//       </div>

//       {/* Loading Animation */}
//       {loading && (
//         <div className="glass rounded-2xl p-8">
//           <div className="flex flex-col items-center">
//             <div className="flex gap-3 mb-6">
//               {[0, 1, 2].map((i) => (
//                 <div
//                   key={i}
//                   className="w-16 h-20 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 animate-pulse"
//                   style={{ animationDelay: `${i * 200}ms` }}
//                 />
//               ))}
//             </div>
//             <div className="w-48 h-1.5 rounded-full bg-white/5 overflow-hidden">
//               <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" style={{ width: '60%' }} />
//             </div>
//             <p className="text-sm text-slate-400 mt-3">Creating slides... This may take a moment</p>
//           </div>
//         </div>
//       )}

//       {/* Generated Preview */}
//       {generated && !loading && (
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-white">Preview</h2>
//             <div className="flex items-center gap-1 text-xs text-green-400">
//               <Sparkles className="w-3 h-3" />
//               +25 points earned
//             </div>
//           </div>

//           <div className="grid sm:grid-cols-3 gap-4">
//             {previewSlides.map((slide, i) => (
//               <div
//                 key={i}
//                 className={`glass rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300`}
//               >
//                 <div className={`h-32 bg-gradient-to-br ${slide.color} flex items-center justify-center p-4`}>
//                   <div className="text-center">
//                     <div className="text-xs text-slate-400 mb-1">Slide {i + 1}</div>
//                     <div className="text-sm font-semibold text-white">{slide.content}</div>
//                   </div>
//                 </div>
//                 <div className="p-3">
//                   <h3 className="text-sm font-medium text-white">{slide.title}</h3>
//                   <p className="text-xs text-slate-500 mt-0.5">{style} style</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3">
//             <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm glow-btn">
//               <Download className="w-4 h-4" />
//               Download PPTX
//             </button>
//             <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-all">
//               <Download className="w-4 h-4" />
//               Download as PDF
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// ---------- claude ai ----------- //

import { useState } from "react";
import {
  Presentation,
  ExternalLink,
  Sparkles,
  Palette,
  GraduationCap,
  FileText,
  ChevronDown,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export function PPTGenerator() {
  const { addPoints, userId, logActivity } = useApp();
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [style, setStyle] = useState("detailed");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [viewUrl, setViewUrl] = useState("");
  const [slideCount, setSlideCount] = useState(0);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    if (!classLevel) {
      setError("Please select a class level");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5002/api/generate-ppt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          classLevel,
          style,
          userId: userId || "demo-user",
        }),
      });
      const data = await res.json();

      if (data.success) {
        setViewUrl(data.viewUrl);
        setSlideCount(data.slides);
        setGenerated(true);
        addPoints(25);
        logActivity("ppt_generated", `PPT: ${topic}`, 25);
      } else {
        setError(data.message || "Generation failed. Try again.");
      }
    } catch {
      setError(
        "Cannot connect to PPT server (port 5002). Make sure backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setGenerated(false);
    setTopic("");
    setClassLevel("");
    setStyle("detailed");
    setViewUrl("");
    setError("");
  };

  const styles = [
    { id: "simple", label: "Simple", desc: "Clean & minimal", icon: "📋" },
    { id: "detailed", label: "Detailed", desc: "Comprehensive", icon: "📊" },
    {
      id: "creative",
      label: "Creative",
      desc: "Visual & engaging",
      icon: "🎨",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Presentation className="w-6 h-6 text-purple-400" />
          PPT Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          AI creates real presentation slides • Earn 25 pts per PPT
        </p>
      </div>

      {/* Success State */}
      {generated ? (
        <div className="glass rounded-2xl p-8 text-center space-y-5 border border-green-500/20">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-white">
              Presentation Ready! 🎉
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {slideCount} slides generated for "{topic}"
            </p>
          </div>
          <div className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" /> +25 points earned
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              Open Presentation
            </a>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Generate Another
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Tip: Use keyboard arrows to navigate slides
          </p>
        </div>
      ) : (
        /* Input Form */
        <div className="glass rounded-2xl p-6 space-y-5">
          {/* Topic */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Topic *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Bitcoin, Photosynthesis, World War 2..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>
          </div>

          {/* Class Level */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Class Level *
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <select
                value={classLevel}
                onChange={(e) => {
                  setClassLevel(e.target.value);
                  setError("");
                }}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white appearance-none focus:outline-none focus:border-purple-500/40 text-sm cursor-pointer"
              >
                <option value="" className="bg-slate-900">
                  Select class level
                </option>
                <option value="8" className="bg-slate-900">
                  Class 8
                </option>
                <option value="9" className="bg-slate-900">
                  Class 9
                </option>
                <option value="10" className="bg-slate-900">
                  Class 10
                </option>
                <option value="11" className="bg-slate-900">
                  Class 11
                </option>
                <option value="12" className="bg-slate-900">
                  Class 12
                </option>
                <option value="Undergraduate" className="bg-slate-900">
                  Undergraduate
                </option>
                <option value="Postgraduate" className="bg-slate-900">
                  Postgraduate
                </option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-3 block flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" /> Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    style === s.id
                      ? "bg-purple-500/10 border-purple-500/40 ring-1 ring-purple-500/20"
                      : "bg-white/[0.02] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-sm font-semibold text-white">
                    {s.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI is creating your slides... (15-20 sec)
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Presentation
              </>
            )}
          </button>

          {loading && (
            <p className="text-center text-xs text-slate-500">
              AI is researching "{topic}" and building slides...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
