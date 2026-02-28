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
  RotateCcw, Check, Layers, BookOpen, Wand2,
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

const PPT_STYLES = [
  {
    id: "simple",
    label: "Simple",
    desc: "Clean & minimal — easy to read",
    icon: <Layers className="w-5 h-5" />,
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/40",
    accent: "text-blue-300",
    slides: "6 slides",
  },
  {
    id: "detailed",
    label: "Detailed",
    desc: "Deep content — every concept covered",
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-purple-500/20 to-indigo-500/10",
    border: "border-purple-500/40",
    accent: "text-purple-300",
    slides: "10 slides",
  },
  {
    id: "creative",
    label: "Creative",
    desc: "Visual & engaging — with emojis & design",
    icon: <Wand2 className="w-5 h-5" />,
    color: "from-pink-500/20 to-orange-500/10",
    border: "border-pink-500/40",
    accent: "text-pink-300",
    slides: "10 slides",
  },
];

// Build a style-specific AI prompt
function buildPrompt(topic: string, classLevel: string, style: string): string {
  const levelContext: Record<string, string> = {
    "8":             "Class 8 students (age 13-14). Use simple language, relatable examples, basic concepts only.",
    "9":             "Class 9 students (age 14-15). Use clear explanations, introduce standard terms, basic to intermediate.",
    "10":            "Class 10 students (age 15-16). CBSE/ICSE board level, exam-focused, standard terminology.",
    "11":            "Class 11 students (age 16-17). Introduce advanced concepts, technical terms, board exam relevant.",
    "12":            "Class 12 students (age 17-18). Full board exam level, in-depth, use technical definitions and formulas.",
    "Undergraduate": "undergraduate college students. Use university-level depth, academic language, real-world applications.",
    "Postgraduate":  "postgraduate/research students. Use advanced technical depth, cite key theories, professional academic tone.",
  };

  const context = levelContext[classLevel] || "students";

  if (style === "simple") {
    return `You are creating a PowerPoint presentation for ${context}

Topic: "${topic}"

Return ONLY a valid JSON array. No markdown, no explanation, no extra text.

Create exactly 6 slides:
1. Title slide — catchy subtitle
2. Overview/Introduction — what this topic is
3. Core Concept 1 — most important idea
4. Core Concept 2 — second key idea  
5. Key Takeaways — 3-4 bullet summary
6. Conclusion — closing thought

Rules for SIMPLE style:
- Each slide: max 4 bullet points
- Each bullet: max 12 words
- Language: simple, clear, no jargon
- Focus on clarity over depth

JSON format:
[
  {
    "title": "slide title here",
    "content": "bullet point one\nbullet point two\nbullet point three",
    "subtitle": "optional subtitle for title slide only"
  }
]`;
  }

  if (style === "detailed") {
    return `You are creating a comprehensive PowerPoint presentation for ${context}

Topic: "${topic}"

Return ONLY a valid JSON array. No markdown, no explanation, no extra text.

Create exactly 10 slides:
1. Title slide — professional subtitle
2. Table of Contents — list all main sections
3. Introduction & Background — context and history
4. Core Concept A — detailed explanation with definition
5. Core Concept B — detailed explanation with examples
6. Core Concept C — detailed explanation with applications
7. Key Formulas / Definitions — (if applicable to topic)
8. Real-World Applications — how this topic is used
9. Important Facts & Statistics — data points, numbers
10. Summary & Conclusion — key takeaways + closing

Rules for DETAILED style:
- Each slide: 5-7 bullet points
- Each bullet: can be 15-20 words
- Use proper academic/technical terminology appropriate for level
- Include specific facts, numbers, definitions
- Content must match exactly the academic level

JSON format:
[
  {
    "title": "slide title here",
    "content": "detailed point one with explanation\ndetailed point two with example\ndetailed point three\ndetailed point four\ndetailed point five"
  }
]`;
  }

  // creative
  return `You are creating a visually engaging, creative PowerPoint presentation for ${context}

Topic: "${topic}"

Return ONLY a valid JSON array. No markdown, no explanation, no extra text.

Create exactly 10 slides:
1. Title slide — exciting hook subtitle
2. "Did You Know?" — 3 surprising facts about the topic
3. The Big Picture — overview with vivid description
4. Deep Dive: Part 1 — first major concept, explained engagingly
5. Deep Dive: Part 2 — second major concept with real examples
6. Deep Dive: Part 3 — third major concept with analogies
7. Visualize It — describe a diagram/concept visually in text
8. Real World Impact — how this changes/affects everyday life
9. Fun Facts & Myths vs Reality
10. Key Takeaways + Call to Action

Rules for CREATIVE style:
- Start bullets with relevant emojis (🔬 ⚡ 🌍 💡 🎯 etc.)
- Use vivid, energetic language
- Include analogies and storytelling
- Each slide: 4-6 engaging bullet points
- Make it fun to read while being accurate
- Include a "visual_idea" field describing what image would suit each slide

JSON format:
[
  {
    "title": "🎯 Exciting Slide Title",
    "content": "🌟 Engaging point one with analogy\n💡 Interesting fact with context\n⚡ Surprising connection to real life\n🔬 Technical concept made fun",
    "visual_idea": "A diagram showing..."
  }
]`;
}

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

  const handleGenerate = async () => {
    if (!topic.trim()) { setError("Please enter a topic"); return; }
    if (!classLevel)   { setError("Please select a class level"); return; }

    setLoading(true); setError("");

    try {
      // Step 1: Generate slide content with AI
      setLoadingStep("AI is building your slides…");
      const token = localStorage.getItem("token");
      const aiRes = await fetch(`${API_URL}/api/ai/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          prompt: buildPrompt(topic, classLevel, style),
          userId,
        }),
      });
      const aiData = await aiRes.json();

      if (!aiData.success) {
        setError("AI failed to generate content. Please try again.");
        setLoading(false); return;
      }

      // Parse JSON from AI response
      let slides: any[];
      try {
        const clean = aiData.answer
          .replace(/```json/gi, "").replace(/```/g, "").trim();
        // Find the JSON array in the response
        const match = clean.match(/\[[\s\S]*\]/);
        if (!match) throw new Error("No JSON array found");
        slides = JSON.parse(match[0]);
        if (!Array.isArray(slides) || slides.length === 0) throw new Error("Empty array");
      } catch (parseErr) {
        console.error("Parse error:", aiData.answer.substring(0, 200));
        setError("AI returned unexpected format. Please try again.");
        setLoading(false); return;
      }

      // Step 2: Generate the actual PPTX file
      setLoadingStep("Creating your presentation file…");
      const pptRes = await fetch(`${API_URL}/api/ppt/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ topic, slides, style, classLevel }),
      });

      if (!pptRes.ok) {
        setError("Failed to create presentation file.");
        setLoading(false); return;
      }

      const blob = await pptRes.blob();
      const url  = window.URL.createObjectURL(blob);

      setDownloadUrl(url);
      setSlideCount(slides.length);
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
              {PPT_STYLES.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  className={`relative p-4 rounded-xl border text-center transition-all duration-200 overflow-hidden group
                    ${style === s.id
                      ? `bg-gradient-to-br ${s.color} ${s.border} ring-1 ${s.border.replace("border-","ring-")}`
                      : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                >
                  {style === s.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  )}
                  <div className={`flex justify-center mb-2 transition-colors ${style === s.id ? s.accent : "text-slate-500"}`}>
                    {s.icon}
                  </div>
                  <div className="text-sm font-bold text-white">{s.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                  <div className={`text-[10px] mt-1.5 font-semibold ${style === s.id ? s.accent : "text-slate-600"}`}>
                    {s.slides}
                  </div>
                </button>
              ))}
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