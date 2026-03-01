// import { useState } from "react";
// import {
//   Presentation,
//   ExternalLink,
//   Sparkles,
//   Palette,
//   GraduationCap,
//   FileText,
//   ChevronDown,
//   CheckCircle,
//   RotateCcw,
// } from "lucide-react";
// import { useApp } from "../context/AppContext";
// import { generatePPT, askAIFromServer } from "../utils/api";

// export function PPTGenerator() {
//   const { addPoints, userId, logActivity } = useApp();
//   const [topic, setTopic] = useState("");
//   const [classLevel, setClassLevel] = useState("");
//   const [style, setStyle] = useState("detailed");
//   const [loading, setLoading] = useState(false);
//   const [generated, setGenerated] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [slideCount, setSlideCount] = useState(0);
//   const [error, setError] = useState("");

//   const handleGenerate = async () => {
//     if (!topic.trim()) {
//       setError("Please enter a topic");
//       return;
//     }

//     if (!classLevel) {
//       setError("Please select a class level");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const prompt = `
// Return ONLY valid JSON.
// Do not add explanation.
// Do not use markdown.

// Create 5 slides about "${topic}" for ${classLevel} students.
// Style: ${style}

// Format:
// [
//  { "title": "Slide title", "content": "Point1\\nPoint2\\nPoint3" }
// ]
// `;

//       const aiResponse = await askAIFromServer(userId, prompt);

//       if (!aiResponse.success) {
//         setError("AI failed to generate slides.");
//         setLoading(false);
//         return;
//       }

//       let slides;

//       try {
//         const clean = aiResponse.answer
//           .replace(/```json/g, "")
//           .replace(/```/g, "")
//           .trim();

//         slides = JSON.parse(clean);
//       } catch (err) {
//         console.error("JSON ERROR:", aiResponse.answer);
//         setError("AI returned invalid format. Try again.");
//         setLoading(false);
//         return;
//       }

//       const response = await generatePPT(topic, slides);

//       if (response.success) {
//         setDownloadUrl(response.url);
//         setSlideCount(slides.length);
//         setGenerated(true);
//         addPoints(25);
//         logActivity("ppt_generated", `PPT: ${topic}`, 25);
//       } else {
//         setError(response.message || "Generation failed.");
//       }

//     } catch (err) {
//       setError("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = () => {
//     setGenerated(false);
//     setTopic("");
//     setClassLevel("");
//     setStyle("detailed");
//     setDownloadUrl("");
//     setError("");
//   };

//   const styles = [
//     { id: "simple", label: "Simple", desc: "Clean & minimal", icon: "📋" },
//     { id: "detailed", label: "Detailed", desc: "Comprehensive", icon: "📊" },
//     { id: "creative", label: "Creative", desc: "Visual & engaging", icon: "🎨" },
//   ];

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//           <Presentation className="w-6 h-6 text-purple-400" />
//           PPT Generator
//         </h1>
//         <p className="text-sm text-slate-400 mt-1">
//           AI creates real presentation slides • Earn 25 pts per PPT
//         </p>
//       </div>

//       {generated ? (
//         <div className="glass rounded-2xl p-8 text-center space-y-5 border border-green-500/20">
//           <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
//           <div>
//             <h3 className="text-xl font-bold text-white">
//               Presentation Ready! 🎉
//             </h3>
//             <p className="text-sm text-slate-400 mt-1">
//               {slideCount} slides generated for "{topic}"
//             </p>
//           </div>
//           <div className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
//             <Sparkles className="w-3 h-3" /> +25 points earned
//           </div>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
//             <a
//               href={downloadUrl}
//               download
//               className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
//             >
//               <ExternalLink className="w-4 h-4" />
//               Download Presentation
//             </a>
//             <button
//               onClick={reset}
//               className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors"
//             >
//               <RotateCcw className="w-4 h-4" />
//               Generate Another
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="glass rounded-2xl p-6 space-y-5">
//           <div>
//             <label className="text-sm font-medium text-slate-300 mb-2 block">
//               Topic *
//             </label>
//             <div className="relative">
//               <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
//               <input
//                 type="text"
//                 value={topic}
//                 onChange={(e) => {
//                   setTopic(e.target.value);
//                   setError("");
//                 }}
//                 placeholder="e.g. Bitcoin, Photosynthesis, World War 2..."
//                 className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40 text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-slate-300 mb-2 block">
//               Class Level *
//             </label>
//             <div className="relative">
//               <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
//               <select
//                 value={classLevel}
//                 onChange={(e) => {
//                   setClassLevel(e.target.value);
//                   setError("");
//                 }}
//                 className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white appearance-none focus:outline-none focus:border-purple-500/40 text-sm cursor-pointer"
//               >
//                 <option value="">Select class level</option>
//                 <option value="8">Class 8</option>
//                 <option value="9">Class 9</option>
//                 <option value="10">Class 10</option>
//                 <option value="11">Class 11</option>
//                 <option value="12">Class 12</option>
//                 <option value="Undergraduate">Undergraduate</option>
//                 <option value="Postgraduate">Postgraduate</option>
//               </select>
//               <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
//             </div>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-slate-300 mb-3 block flex items-center gap-2">
//               <Palette className="w-4 h-4 text-purple-400" /> Style
//             </label>
//             <div className="grid grid-cols-3 gap-3">
//               {styles.map((s) => (
//                 <button
//                   key={s.id}
//                   onClick={() => setStyle(s.id)}
//                   className={`p-4 rounded-xl border text-center transition-all ${
//                     style === s.id
//                       ? "bg-purple-500/10 border-purple-500/40 ring-1 ring-purple-500/20"
//                       : "bg-white/[0.02] border-white/5 hover:border-white/15"
//                   }`}
//                 >
//                   <div className="text-2xl mb-1">{s.icon}</div>
//                   <div className="text-sm font-semibold text-white">
//                     {s.label}
//                   </div>
//                   <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {error && (
//             <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
//               {error}
//             </div>
//           )}

//           <button
//             onClick={handleGenerate}
//             disabled={loading}
//             className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 AI is creating your slides...
//               </>
//             ) : (
//               <>
//                 <Sparkles className="w-4 h-4" />
//                 Generate Presentation
//               </>
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// ----------- claude ai --------- //

// import { useState, useRef, useEffect } from "react";
// import {
//   Presentation,
//   ExternalLink,
//   Sparkles,
//   Palette,
//   GraduationCap,
//   FileText,
//   ChevronDown,
//   CheckCircle,
//   RotateCcw,
//   Check,
// } from "lucide-react";
// import { useApp } from "../context/AppContext";
// import { generatePPT, askAIFromServer } from "../utils/api";

// const CLASS_LEVELS = [
//   { value: "8", label: "Class 8" },
//   { value: "9", label: "Class 9" },
//   { value: "10", label: "Class 10" },
//   { value: "11", label: "Class 11" },
//   { value: "12", label: "Class 12" },
//   { value: "Undergraduate", label: "Undergraduate" },
//   { value: "Postgraduate", label: "Postgraduate" },
// ];

// export function PPTGenerator() {
//   const { addPoints, userId, logActivity } = useApp();
//   const [topic, setTopic] = useState("");
//   const [classLevel, setClassLevel] = useState("");
//   const [style, setStyle] = useState("detailed");
//   const [loading, setLoading] = useState(false);
//   const [generated, setGenerated] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [slideCount, setSlideCount] = useState(0);
//   const [error, setError] = useState("");

//   // Custom dropdown state
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const selectedLabel = CLASS_LEVELS.find((c) => c.value === classLevel)?.label || null;

//   const handleGenerate = async () => {
//     if (!topic.trim()) { setError("Please enter a topic"); return; }
//     if (!classLevel) { setError("Please select a class level"); return; }

//     setLoading(true);
//     setError("");

//     try {
//       const prompt = `
// Return ONLY valid JSON.
// Do not add explanation.
// Do not use markdown.

// Create 5 slides about "${topic}" for ${classLevel} students.
// Style: ${style}

// Format:
// [
//  { "title": "Slide title", "content": "Point1\\nPoint2\\nPoint3" }
// ]
// `;
//       const aiResponse = await askAIFromServer(userId, prompt);

//       if (!aiResponse.success) {
//         setError("AI failed to generate slides.");
//         setLoading(false);
//         return;
//       }

//       let slides;
//       try {
//         const clean = aiResponse.answer
//           .replace(/```json/g, "")
//           .replace(/```/g, "")
//           .trim();
//         slides = JSON.parse(clean);
//       } catch (err) {
//         console.error("JSON ERROR:", aiResponse.answer);
//         setError("AI returned invalid format. Try again.");
//         setLoading(false);
//         return;
//       }

//       const response = await generatePPT(topic, slides);

//       if (response.success) {
//         setDownloadUrl(response.url);
//         setSlideCount(slides.length);
//         setGenerated(true);
//         addPoints(25);
//         logActivity("ppt_generated", `PPT: ${topic}`, 25);
//       } else {
//         setError(response.message || "Generation failed.");
//       }
//     } catch (err) {
//       setError("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = () => {
//     setGenerated(false);
//     setTopic("");
//     setClassLevel("");
//     setStyle("detailed");
//     setDownloadUrl("");
//     setError("");
//   };

//   const styles = [
//     { id: "simple", label: "Simple", desc: "Clean & minimal", icon: "📋" },
//     { id: "detailed", label: "Detailed", desc: "Comprehensive", icon: "📊" },
//     { id: "creative", label: "Creative", desc: "Visual & engaging", icon: "🎨" },
//   ];

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//           <Presentation className="w-6 h-6 text-purple-400" />
//           PPT Generator
//         </h1>
//         <p className="text-sm text-slate-400 mt-1">
//           AI creates real presentation slides • Earn 25 pts per PPT
//         </p>
//       </div>

//       {generated ? (
//         <div className="glass rounded-2xl p-8 text-center space-y-5 border border-green-500/20">
//           <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
//           <div>
//             <h3 className="text-xl font-bold text-white">Presentation Ready! 🎉</h3>
//             <p className="text-sm text-slate-400 mt-1">
//               {slideCount} slides generated for "{topic}"
//             </p>
//           </div>
//           <div className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
//             <Sparkles className="w-3 h-3" /> +25 points earned
//           </div>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
//             <a
//               href={downloadUrl}
//               download
//               className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
//             >
//               <ExternalLink className="w-4 h-4" />
//               Download Presentation
//             </a>
//             <button
//               onClick={reset}
//               className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors"
//             >
//               <RotateCcw className="w-4 h-4" />
//               Generate Another
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="glass rounded-2xl p-6 space-y-5">

//           {/* Topic Input */}
//           <div>
//             <label className="text-sm font-medium text-slate-300 mb-2 block">Topic *</label>
//             <div className="relative">
//               <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
//               <input
//                 type="text"
//                 value={topic}
//                 onChange={(e) => { setTopic(e.target.value); setError(""); }}
//                 placeholder="e.g. Bitcoin, Photosynthesis, World War 2..."
//                 className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40 text-sm"
//               />
//             </div>
//           </div>

//           {/* Custom Class Level Dropdown */}
//           <div>
//             <label className="text-sm font-medium text-slate-300 mb-2 block">Class Level *</label>
//             <div className="relative" ref={dropdownRef}>
//               {/* Trigger button */}
//               <button
//                 type="button"
//                 onClick={() => setDropdownOpen((prev) => !prev)}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all duration-200 focus:outline-none
//                   ${dropdownOpen
//                     ? "bg-white/[0.06] border-purple-500/50 shadow-lg shadow-purple-500/10"
//                     : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
//                   }`}
//               >
//                 <GraduationCap className="w-4 h-4 text-purple-400 flex-shrink-0" />
//                 <span className={`flex-1 ${selectedLabel ? "text-white" : "text-slate-500"}`}>
//                   {selectedLabel || "Select class level"}
//                 </span>
//                 <ChevronDown
//                   className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180 text-purple-400" : ""}`}
//                 />
//               </button>

//               {/* Dropdown panel */}
//               {dropdownOpen && (
//                 <div
//                   className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden"
//                   style={{
//                     background: "rgba(10, 17, 40, 0.97)",
//                     border: "1px solid rgba(139, 92, 246, 0.25)",
//                     boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)",
//                     backdropFilter: "blur(20px)",
//                   }}
//                 >
//                   <div className="py-1.5">
//                     {CLASS_LEVELS.map((cls, idx) => {
//                       const isSelected = classLevel === cls.value;
//                       return (
//                         <button
//                           key={cls.value}
//                           type="button"
//                           onClick={() => {
//                             setClassLevel(cls.value);
//                             setDropdownOpen(false);
//                             setError("");
//                           }}
//                           className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 text-left group
//                             ${isSelected
//                               ? "text-purple-300"
//                               : "text-slate-300 hover:text-white"
//                             }`}
//                           style={{
//                             background: isSelected
//                               ? "linear-gradient(90deg, rgba(139,92,246,0.15), rgba(59,130,246,0.08))"
//                               : "transparent",
//                           }}
//                           onMouseEnter={(e) => {
//                             if (!isSelected) {
//                               (e.currentTarget as HTMLButtonElement).style.background =
//                                 "rgba(255,255,255,0.04)";
//                             }
//                           }}
//                           onMouseLeave={(e) => {
//                             if (!isSelected) {
//                               (e.currentTarget as HTMLButtonElement).style.background =
//                                 "transparent";
//                             }
//                           }}
//                         >
//                           {/* Left accent bar for selected */}
//                           <div
//                             className={`w-0.5 h-4 rounded-full transition-all duration-200 flex-shrink-0 ${
//                               isSelected ? "bg-purple-400" : "bg-transparent group-hover:bg-white/20"
//                             }`}
//                           />
//                           <span className="flex-1">{cls.label}</span>
//                           {isSelected && (
//                             <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
//                           )}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Style Selector */}
//           <div>
//             <label className="text-sm font-medium text-slate-300 mb-3 block flex items-center gap-2">
//               <Palette className="w-4 h-4 text-purple-400" /> Style
//             </label>
//             <div className="grid grid-cols-3 gap-3">
//               {styles.map((s) => (
//                 <button
//                   key={s.id}
//                   onClick={() => setStyle(s.id)}
//                   className={`p-4 rounded-xl border text-center transition-all ${
//                     style === s.id
//                       ? "bg-purple-500/10 border-purple-500/40 ring-1 ring-purple-500/20"
//                       : "bg-white/[0.02] border-white/5 hover:border-white/15"
//                   }`}
//                 >
//                   <div className="text-2xl mb-1">{s.icon}</div>
//                   <div className="text-sm font-semibold text-white">{s.label}</div>
//                   <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {error && (
//             <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
//               {error}
//             </div>
//           )}

//           <button
//             onClick={handleGenerate}
//             disabled={loading}
//             className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 AI is creating your slides...
//               </>
//             ) : (
//               <>
//                 <Sparkles className="w-4 h-4" />
//                 Generate Presentation
//               </>
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// claude aii //

import { useState, useRef, useEffect } from "react";
import {
  Presentation, ExternalLink, Sparkles, Palette,
  GraduationCap, FileText, ChevronDown, CheckCircle,
  RotateCcw, Check,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { API_URL } from "../utils/api";
import { incrementAction } from "../utils/user-api";

const CLASS_LEVELS = [
  { value: "8",             label: "Class 8",       emoji: "📚" },
  { value: "9",             label: "Class 9",       emoji: "📚" },
  { value: "10",            label: "Class 10",      emoji: "📚" },
  { value: "11",            label: "Class 11",      emoji: "🔬" },
  { value: "12",            label: "Class 12",      emoji: "🔬" },
  { value: "Undergraduate", label: "Undergraduate", emoji: "🎓" },
  { value: "Postgraduate",  label: "Postgraduate",  emoji: "🏛️" },
];

// ── Premium SVG Icons ─────────────────────────────────────────────────────────

const SimpleIcon = ({ active }: { active: boolean }) => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="simpleGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#60A5FA"/>
        <stop offset="100%" stopColor="#06B6D4"/>
      </linearGradient>
      <filter id="simpleGlow">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Outer hexagon ring */}
    <path
      d="M26 4 L44 15 L44 37 L26 48 L8 37 L8 15 Z"
      stroke={active ? "url(#simpleGrad)" : "#334155"}
      strokeWidth="1.5" fill="none"
      style={{ transition: "all 0.3s" }}
    />
    {/* Inner clean slides stack */}
    <rect x="15" y="17" width="22" height="3" rx="1.5"
      fill={active ? "url(#simpleGrad)" : "#475569"}
      filter={active ? "url(#simpleGlow)" : undefined}
      style={{ transition: "all 0.3s" }}
    />
    <rect x="15" y="23" width="16" height="3" rx="1.5"
      fill={active ? "#60A5FA" : "#374151"}
      opacity={active ? 0.8 : 0.5}
      style={{ transition: "all 0.3s" }}
    />
    <rect x="15" y="29" width="19" height="3" rx="1.5"
      fill={active ? "#06B6D4" : "#374151"}
      opacity={active ? 0.6 : 0.4}
      style={{ transition: "all 0.3s" }}
    />
    {/* Corner accent dot */}
    <circle cx="40" cy="12" r="3"
      fill={active ? "#60A5FA" : "#1E3A5F"}
      style={{ transition: "all 0.3s" }}
    />
  </svg>
);

const DetailedIcon = ({ active }: { active: boolean }) => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="detailGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A78BFA"/>
        <stop offset="100%" stopColor="#7C3AED"/>
      </linearGradient>
      <linearGradient id="detailGrad2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C4B5FD"/>
        <stop offset="100%" stopColor="#8B5CF6"/>
      </linearGradient>
      <filter id="detailGlow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Document frame */}
    <rect x="10" y="6" width="32" height="40" rx="4"
      stroke={active ? "url(#detailGrad)" : "#334155"}
      strokeWidth="1.5" fill={active ? "rgba(124,58,237,0.08)" : "none"}
      style={{ transition: "all 0.3s" }}
    />
    {/* Top accent bar */}
    <rect x="10" y="6" width="32" height="5" rx="2"
      fill={active ? "url(#detailGrad)" : "#1E293B"}
      style={{ transition: "all 0.3s" }}
    />
    {/* Content lines — varied widths like real data */}
    {[14, 18, 22, 27, 31, 35].map((y, i) => (
      <rect key={i} x="16" y={y} width={i % 3 === 0 ? 22 : i % 3 === 1 ? 16 : 19} height="2.2" rx="1.1"
        fill={active ? (i === 0 ? "#C4B5FD" : i < 3 ? "#A78BFA" : "#7C3AED") : "#2D3748"}
        opacity={active ? (1 - i * 0.08) : 0.5}
        filter={active && i === 0 ? "url(#detailGlow)" : undefined}
        style={{ transition: "all 0.3s" }}
      />
    ))}
    {/* Bookmark ribbon */}
    <path d="M35 6 L35 15 L31.5 12 L28 15 L28 6 Z"
      fill={active ? "url(#detailGrad2)" : "#374151"}
      style={{ transition: "all 0.3s" }}
    />
  </svg>
);

const CreativeIcon = ({ active }: { active: boolean }) => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="creativeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F97316"/>
        <stop offset="100%" stopColor="#EC4899"/>
      </linearGradient>
      <linearGradient id="creativeGrad2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#F97316"/>
        <stop offset="50%" stopColor="#A855F7"/>
        <stop offset="100%" stopColor="#06B6D4"/>
      </linearGradient>
      <filter id="creativeGlow">
        <feGaussianBlur stdDeviation="3.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Outer circle ring */}
    <circle cx="26" cy="26" r="21"
      stroke={active ? "url(#creativeGrad2)" : "#334155"}
      strokeWidth="1.5" strokeDasharray="4 3" fill="none"
      style={{ transition: "all 0.3s" }}
    />
    {/* Magic wand body */}
    <line x1="14" y1="38" x2="30" y2="22"
      stroke={active ? "url(#creativeGrad)" : "#475569"}
      strokeWidth="3" strokeLinecap="round"
      filter={active ? "url(#creativeGlow)" : undefined}
      style={{ transition: "all 0.3s" }}
    />
    {/* Wand tip star */}
    <path d="M30 22 L32 18 L34 22 L38 24 L34 26 L32 30 L30 26 L26 24 Z"
      fill={active ? "url(#creativeGrad)" : "#374151"}
      filter={active ? "url(#creativeGlow)" : undefined}
      style={{ transition: "all 0.3s" }}
    />
    {/* Sparkle dots */}
    <circle cx="18" cy="16" r="2.5"
      fill={active ? "#F97316" : "#2D3748"}
      opacity={active ? 0.9 : 0.4}
      filter={active ? "url(#creativeGlow)" : undefined}
      style={{ transition: "all 0.3s" }}
    />
    <circle cx="38" cy="36" r="1.8"
      fill={active ? "#A855F7" : "#2D3748"}
      opacity={active ? 0.8 : 0.3}
      style={{ transition: "all 0.3s" }}
    />
    <circle cx="14" cy="28" r="1.4"
      fill={active ? "#06B6D4" : "#2D3748"}
      opacity={active ? 0.7 : 0.3}
      style={{ transition: "all 0.3s" }}
    />
    <circle cx="36" cy="14" r="1.2"
      fill={active ? "#EC4899" : "#2D3748"}
      opacity={active ? 0.6 : 0.3}
      style={{ transition: "all 0.3s" }}
    />
  </svg>
);

const PPT_STYLES = [
  {
    id: "simple",
    label: "Simple",
    desc: "Clean & minimal — easy to read",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/40",
    accent: "text-blue-300",
    ring: "ring-blue-500/30",
    glow: "shadow-blue-500/20",
    slides: "6 slides",
  },
  {
    id: "detailed",
    label: "Detailed",
    desc: "Deep content — every concept covered",
    color: "from-purple-500/20 to-indigo-500/10",
    border: "border-purple-500/40",
    accent: "text-purple-300",
    ring: "ring-purple-500/30",
    glow: "shadow-purple-500/20",
    slides: "10 slides",
  },
  {
    id: "creative",
    label: "Creative",
    desc: "Visual & engaging — with emojis & design",
    color: "from-orange-500/20 to-pink-500/10",
    border: "border-orange-500/40",
    accent: "text-orange-300",
    ring: "ring-orange-500/30",
    glow: "shadow-orange-500/20",
    slides: "10 slides",
  },
];


export function PPTGenerator() {
  const { addPoints, userId, logActivity, checkAndUnlockAchievements, userStats, setUserStats } = useApp();
  const [topic, setTopic]       = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [style, setStyle]       = useState("detailed");
  const [loading, setLoading]   = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [generated, setGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [slideCount, setSlideCount] = useState(0);
  const [error, setError]       = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel = CLASS_LEVELS.find(c => c.value === classLevel) || null;
  const selectedStyle = PPT_STYLES.find(s => s.id === style)!;

  // ── Robust JSON extractor — 4 fallback strategies ──────────────────────────
  const extractSlides = (raw: string): any[] | null => {
    const attempts = [
      // 1. Direct parse after cleaning markdown fences
      () => {
        const clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(clean);
        return Array.isArray(parsed) ? parsed : null;
      },
      // 2. Find first [ to last ]
      () => {
        const s = raw.indexOf("["), e = raw.lastIndexOf("]");
        if (s === -1 || e <= s) return null;
        const parsed = JSON.parse(raw.slice(s, e + 1));
        return Array.isArray(parsed) ? parsed : null;
      },
      // 3. Fix common issues: trailing commas, smart quotes, then extract array
      () => {
        const fixed = raw
          .replace(/```json/gi, "").replace(/```/g, "")
          .replace(/,\s*]/g, "]").replace(/,\s*}/g, "}")
          .replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
        const s = fixed.indexOf("["), e = fixed.lastIndexOf("]");
        if (s === -1 || e <= s) return null;
        const parsed = JSON.parse(fixed.slice(s, e + 1));
        return Array.isArray(parsed) ? parsed : null;
      },
      // 4. Regex: extract individual {title, content} objects
      () => {
        const objs: any[] = [];
        const re = /\{\s*"title"\s*:\s*"[^"]*"[^}]*"content"\s*:\s*"[^"]*"[^}]*\}/g;
        let m;
        while ((m = re.exec(raw)) !== null) {
          try { objs.push(JSON.parse(m[0])); } catch {}
        }
        return objs.length >= 3 ? objs : null;
      },
    ];
    for (const fn of attempts) {
      try { const r = fn(); if (r && r.length >= 3) return r; } catch {}
    }
    return null;
  };

  // ── Build a tight AI prompt for each style ─────────────────────────────────
  const buildPPTPrompt = (t: string, level: string, s: string): string => {
    const lvl: Record<string, string> = {
      "8": "Class 8 (simple language, basic concepts)",
      "9": "Class 9 (clear explanations, standard terms)",
      "10": "Class 10 (CBSE/ICSE board level)",
      "11": "Class 11 (advanced concepts, technical terms)",
      "12": "Class 12 (full board level, formulas)",
      "Undergraduate": "Undergraduate (university depth)",
      "Postgraduate": "Postgraduate (research level)",
    };
    const ctx = lvl[level] || level;

    if (s === "simple") return `Output only a JSON array. No explanation. No markdown. Just JSON.

Create 6 PowerPoint slides about "${t}" for ${ctx}.

[
{"title":"Introduction","content":"point1\\npoint2\\npoint3"},
{"title":"Overview","content":"point1\\npoint2\\npoint3"},
{"title":"Key Concept 1","content":"point1\\npoint2\\npoint3"},
{"title":"Key Concept 2","content":"point1\\npoint2\\npoint3"},
{"title":"Key Takeaways","content":"point1\\npoint2\\npoint3"},
{"title":"Conclusion","content":"point1\\npoint2\\npoint3"}
]

Rules: max 4 bullets per slide, max 12 words each, simple clear language for ${ctx}.
Output the JSON array now:`;

    if (s === "detailed") return `Output only a JSON array. No explanation. No markdown. Just JSON.

Create 10 PowerPoint slides about "${t}" for ${ctx}.

[
{"title":"Title","content":"subtitle text here"},
{"title":"Overview & Background","content":"point1\\npoint2\\npoint3\\npoint4\\npoint5"},
{"title":"Core Concept A","content":"point1\\npoint2\\npoint3\\npoint4\\npoint5"},
{"title":"Core Concept B","content":"point1\\npoint2\\npoint3\\npoint4\\npoint5"},
{"title":"Core Concept C","content":"point1\\npoint2\\npoint3\\npoint4\\npoint5"},
{"title":"Key Definitions","content":"point1\\npoint2\\npoint3\\npoint4"},
{"title":"Real-World Applications","content":"point1\\npoint2\\npoint3\\npoint4"},
{"title":"Important Facts & Data","content":"point1\\npoint2\\npoint3\\npoint4"},
{"title":"Case Study / Example","content":"point1\\npoint2\\npoint3\\npoint4"},
{"title":"Summary & Conclusion","content":"point1\\npoint2\\npoint3\\npoint4"}
]

Rules: 5-6 bullets per slide, technical depth for ${ctx}, real facts and definitions.
Output the JSON array now:`;

    return `Output only a JSON array. No explanation. No markdown. Just JSON.

Create 10 creative PowerPoint slides about "${t}" for ${ctx}.

[
{"title":"🚀 Title Slide","content":"hook subtitle"},
{"title":"💡 Did You Know?","content":"🌟 fact1\\n⚡ fact2\\n🔥 fact3"},
{"title":"🌍 The Big Picture","content":"🎯 point1\\n💫 point2\\n🔬 point3\\n✨ point4"},
{"title":"🔍 Deep Dive Part 1","content":"💡 point1\\n⚡ point2\\n🌟 point3\\n🎯 point4"},
{"title":"⚡ Deep Dive Part 2","content":"🔥 point1\\n💫 point2\\n🌍 point3\\n✅ point4"},
{"title":"🎯 Deep Dive Part 3","content":"🚀 point1\\n🔬 point2\\n💡 point3\\n⚡ point4"},
{"title":"🖼️ Visualize It","content":"📊 point1\\n🎨 point2\\n📐 point3\\n🔭 point4"},
{"title":"🌟 Real World Impact","content":"🏙️ point1\\n💼 point2\\n🌱 point3\\n🚀 point4"},
{"title":"🤔 Myths vs Reality","content":"❌ myth1 → ✅ truth1\\n❌ myth2 → ✅ truth2\\n💡 fact1\\n⚡ fact2"},
{"title":"✅ Key Takeaways","content":"🌟 takeaway1\\n💡 takeaway2\\n🎯 takeaway3\\n🚀 takeaway4"}
]

Rules: use emojis, vivid engaging language, analogies for ${ctx}. 4-5 bullets per slide.
Output the JSON array now:`;
  };

  const handleGenerate = async () => {
    if (!topic.trim()) { setError("Please enter a topic"); return; }
    if (!classLevel)   { setError("Please select a class level"); return; }

    setLoading(true); setError("");

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` };
      const prompt = buildPPTPrompt(topic.trim(), classLevel, style);

      // ── Step 1: Get slide content from AI (retry up to 3 times) ────────────
      setLoadingStep("AI is building your slides…");
      let slides: any[] | null = null;

      for (let attempt = 1; attempt <= 3 && !slides; attempt++) {
        try {
          if (attempt > 1) setLoadingStep(`Retrying… (attempt ${attempt}/3)`);
          const aiRes = await fetch(`${API_URL}/api/ai/ask`, {
            method: "POST", headers,
            body: JSON.stringify({ prompt, userId }),
          });
          if (!aiRes.ok) continue;
          const aiData = await aiRes.json();
          if (aiData.success && aiData.answer) {
            slides = extractSlides(aiData.answer);
          }
        } catch {}
      }

      if (!slides || slides.length < 3) {
        setError("AI could not generate slides. Please try again.");
        setLoading(false); return;
      }

      // Normalize slides
      const normalized = slides.map((sl: any, i: number) => ({
        title:   String(sl.title   || sl.Title   || `Slide ${i + 1}`).trim(),
        content: String(sl.content || sl.Content || sl.body || "").trim(),
        subtitle: String(sl.subtitle || "").trim(),
      })).filter((sl: any) => sl.title.length > 0);

      // ── Step 2: Build PPTX file ─────────────────────────────────────────────
      setLoadingStep(`Designing ${style} presentation…`);
      const pptRes = await fetch(`${API_URL}/api/ppt/generate`, {
        method: "POST", headers,
        body: JSON.stringify({ topic, slides: normalized, style, classLevel }),
      });

      if (!pptRes.ok) {
        setError("Failed to create presentation file. Please try again.");
        setLoading(false); return;
      }

      const blob = await pptRes.blob();
      const url  = window.URL.createObjectURL(blob);

      setDownloadUrl(url);
      setSlideCount(normalized.length);
      setGenerated(true);
      addPoints(25);
      logActivity("ppt_generated", `PPT: ${topic}`, 25);
      const newTotal = (userStats.totalPPTsGenerated || 0) + 1;
      setUserStats({ ...userStats, totalPPTsGenerated: newTotal });
      incrementAction("ppt");
      checkAndUnlockAchievements({ totalPPTsGenerated: newTotal });

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); setLoadingStep("");
    }
  };

  const reset = () => {
    setGenerated(false); setTopic(""); setClassLevel("");
    setStyle("detailed"); setDownloadUrl(""); setError("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Presentation className="w-6 h-6 text-purple-400" /> PPT Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          AI builds a professional presentation for your exact level • Earn 25 pts
        </p>
      </div>

      {generated ? (
        /* ── Success State ─────────────────────────────────────────────── */
        <div className="glass rounded-2xl p-8 text-center space-y-5 border border-green-500/20 animate-slide-up">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Presentation Ready! 🎉</h3>
            <p className="text-sm text-slate-400 mt-1">
              {slideCount} slides · <span className="capitalize">{style}</span> style · {selectedLabel?.label}
            </p>
            <p className="text-sm text-slate-400">"{topic}"</p>
          </div>
          <div className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" /> +25 points earned
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={downloadUrl} download={`${topic}.pptx`}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity glow-btn"
            >
              <ExternalLink className="w-4 h-4" /> Download Presentation
            </a>
            <button onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors">
              <RotateCcw className="w-4 h-4" /> Generate Another
            </button>
          </div>
        </div>
      ) : (
        /* ── Form ──────────────────────────────────────────────────────── */
        <div className="glass rounded-2xl p-6 space-y-6">

          {/* Topic */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Topic *</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text" value={topic}
                onChange={e => { setTopic(e.target.value); setError(""); }}
                placeholder="e.g. Photosynthesis, French Revolution, Machine Learning…"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40 text-sm transition-colors"
              />
            </div>
          </div>

          {/* Class Level */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Class Level *</label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(v => !v)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all
                  ${dropdownOpen ? "bg-white/[0.06] border-purple-500/50" : "bg-white/[0.03] border-white/10 hover:border-white/20"}`}
              >
                <GraduationCap className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className={`flex-1 ${selectedLabel ? "text-white" : "text-slate-500"}`}>
                  {selectedLabel ? `${selectedLabel.emoji} ${selectedLabel.label}` : "Select class level"}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180 text-purple-400" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden"
                  style={{ background: "rgba(10,17,40,0.97)", border: "1px solid rgba(139,92,246,0.25)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", backdropFilter: "blur(20px)" }}>
                  <div className="py-1.5">
                    {CLASS_LEVELS.map(cls => {
                      const sel = classLevel === cls.value;
                      return (
                        <button key={cls.value} type="button"
                          onClick={() => { setClassLevel(cls.value); setDropdownOpen(false); setError(""); }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all text-left
                            ${sel ? "text-purple-300" : "text-slate-300 hover:text-white hover:bg-white/[0.04]"}`}
                          style={{ background: sel ? "linear-gradient(90deg, rgba(139,92,246,0.15), rgba(59,130,246,0.08))" : undefined }}
                        >
                          <span className="text-base">{cls.emoji}</span>
                          <span className="flex-1">{cls.label}</span>
                          {sel && <Check className="w-3.5 h-3.5 text-purple-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Style Selector */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2 block">
              <Palette className="w-4 h-4 text-purple-400" /> Presentation Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PPT_STYLES.map(s => {
                const active = style === s.id;
                return (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  className={`relative p-4 rounded-xl border text-center transition-all duration-300 overflow-hidden group
                    ${active
                      ? `bg-gradient-to-br ${s.color} ${s.border} ring-1 ${s.ring} shadow-lg ${s.glow}`
                      : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                >
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  )}
                  {/* Premium icon */}
                  <div className={`flex justify-center mb-3 transition-all duration-300 ${active ? "scale-110 drop-shadow-lg" : "scale-100 opacity-50 grayscale"}`}>
                    {s.id === "simple"   && <SimpleIcon   active={active} />}
                    {s.id === "detailed" && <DetailedIcon active={active} />}
                    {s.id === "creative" && <CreativeIcon active={active} />}
                  </div>
                  <div className="text-sm font-bold text-white">{s.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                  <div className={`text-[10px] mt-1.5 font-semibold ${active ? s.accent : "text-slate-600"}`}>
                    {s.slides}
                  </div>
                </button>
                );
              })}
            </div>
          </div>

          {/* What to expect */}
          {topic && classLevel && (
            <div className={`rounded-xl p-4 bg-gradient-to-br ${selectedStyle.color} border ${selectedStyle.border} animate-slide-up`}>
              <p className="text-xs font-semibold text-white mb-2">📋 What AI will generate:</p>
              <div className="text-xs text-slate-300 space-y-1">
                {style === "simple" && <>
                  <p>• 6-slide clean presentation for {selectedLabel?.label}</p>
                  <p>• Simple language, max 4 bullets per slide</p>
                  <p>• Cover: Intro → Core Concepts → Takeaways → Conclusion</p>
                </>}
                {style === "detailed" && <>
                  <p>• 10-slide comprehensive presentation for {selectedLabel?.label}</p>
                  <p>• Deep academic content, proper terminology</p>
                  <p>• Cover: Background → 3 Core Concepts → Applications → Facts → Summary</p>
                </>}
                {style === "creative" && <>
                  <p>• 10-slide visual & engaging presentation for {selectedLabel?.label}</p>
                  <p>• Emojis, analogies, storytelling, fun facts</p>
                  <p>• Cover: Hook → Deep Dives → Visual Ideas → Real Impact → Myths vs Reality</p>
                </>}
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</div>
          )}

          <button
            onClick={handleGenerate} disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all glow-btn"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {loadingStep || "Generating…"}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate {selectedStyle.label} Presentation
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}