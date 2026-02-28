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
  Presentation,
  ExternalLink,
  Sparkles,
  Palette,
  GraduationCap,
  FileText,
  ChevronDown,
  CheckCircle,
  RotateCcw,
  Check,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { generatePPT, askAIFromServer } from "../utils/api";
import { incrementAction } from "../utils/user-api";

const CLASS_LEVELS = [
  { value: "8", label: "Class 8" },
  { value: "9", label: "Class 9" },
  { value: "10", label: "Class 10" },
  { value: "11", label: "Class 11" },
  { value: "12", label: "Class 12" },
  { value: "Undergraduate", label: "Undergraduate" },
  { value: "Postgraduate", label: "Postgraduate" },
];

export function PPTGenerator() {
  const { addPoints, userId, logActivity, checkAndUnlockAchievements, userStats, setUserStats } = useApp();
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [style, setStyle] = useState("detailed");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [slideCount, setSlideCount] = useState(0);
  const [error, setError] = useState("");

  // Custom dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = CLASS_LEVELS.find((c) => c.value === classLevel)?.label || null;

  const handleGenerate = async () => {
    if (!topic.trim()) { setError("Please enter a topic"); return; }
    if (!classLevel) { setError("Please select a class level"); return; }

    setLoading(true);
    setError("");

    try {
      const prompt = `
Return ONLY valid JSON.
Do not add explanation.
Do not use markdown.

Create 5 slides about "${topic}" for ${classLevel} students.
Style: ${style}

Format:
[
 { "title": "Slide title", "content": "Point1\\nPoint2\\nPoint3" }
]
`;
      const aiResponse = await askAIFromServer(userId, prompt);

      if (!aiResponse.success) {
        setError("AI failed to generate slides.");
        setLoading(false);
        return;
      }

      let slides;
      try {
        const clean = aiResponse.answer
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        slides = JSON.parse(clean);
      } catch (err) {
        console.error("JSON ERROR:", aiResponse.answer);
        setError("AI returned invalid format. Try again.");
        setLoading(false);
        return;
      }

      const response = await generatePPT(topic, slides);

      if (response.success) {
        setDownloadUrl(response.url);
        setSlideCount(slides.length);
        setGenerated(true);
        addPoints(25);
        logActivity("ppt_generated", `PPT: ${topic}`, 25);
        // ✅ Track PPT count & check achievements
        const newTotal = (userStats.totalPPTsGenerated || 0) + 1;
        setUserStats({ ...userStats, totalPPTsGenerated: newTotal });
        incrementAction("ppt");
        checkAndUnlockAchievements({ totalPPTsGenerated: newTotal });
      } else {
        setError(response.message || "Generation failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setGenerated(false);
    setTopic("");
    setClassLevel("");
    setStyle("detailed");
    setDownloadUrl("");
    setError("");
  };

  const styles = [
    { id: "simple", label: "Simple", desc: "Clean & minimal", icon: "📋" },
    { id: "detailed", label: "Detailed", desc: "Comprehensive", icon: "📊" },
    { id: "creative", label: "Creative", desc: "Visual & engaging", icon: "🎨" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Presentation className="w-6 h-6 text-purple-400" />
          PPT Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          AI creates real presentation slides • Earn 25 pts per PPT
        </p>
      </div>

      {generated ? (
        <div className="glass rounded-2xl p-8 text-center space-y-5 border border-green-500/20">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-white">Presentation Ready! 🎉</h3>
            <p className="text-sm text-slate-400 mt-1">
              {slideCount} slides generated for "{topic}"
            </p>
          </div>
          <div className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" /> +25 points earned
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              Download Presentation
            </a>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Generate Another
            </button>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 space-y-5">

          {/* Topic Input */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Topic *</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={topic}
                onChange={(e) => { setTopic(e.target.value); setError(""); }}
                placeholder="e.g. Bitcoin, Photosynthesis, World War 2..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40 text-sm"
              />
            </div>
          </div>

          {/* Custom Class Level Dropdown */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Class Level *</label>
            <div className="relative" ref={dropdownRef}>
              {/* Trigger button */}
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all duration-200 focus:outline-none
                  ${dropdownOpen
                    ? "bg-white/[0.06] border-purple-500/50 shadow-lg shadow-purple-500/10"
                    : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
              >
                <GraduationCap className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className={`flex-1 ${selectedLabel ? "text-white" : "text-slate-500"}`}>
                  {selectedLabel || "Select class level"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180 text-purple-400" : ""}`}
                />
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div
                  className="absolute z-50 w-full mt-2 rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(10, 17, 40, 0.97)",
                    border: "1px solid rgba(139, 92, 246, 0.25)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div className="py-1.5">
                    {CLASS_LEVELS.map((cls, idx) => {
                      const isSelected = classLevel === cls.value;
                      return (
                        <button
                          key={cls.value}
                          type="button"
                          onClick={() => {
                            setClassLevel(cls.value);
                            setDropdownOpen(false);
                            setError("");
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 text-left group
                            ${isSelected
                              ? "text-purple-300"
                              : "text-slate-300 hover:text-white"
                            }`}
                          style={{
                            background: isSelected
                              ? "linear-gradient(90deg, rgba(139,92,246,0.15), rgba(59,130,246,0.08))"
                              : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "rgba(255,255,255,0.04)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "transparent";
                            }
                          }}
                        >
                          {/* Left accent bar for selected */}
                          <div
                            className={`w-0.5 h-4 rounded-full transition-all duration-200 flex-shrink-0 ${
                              isSelected ? "bg-purple-400" : "bg-transparent group-hover:bg-white/20"
                            }`}
                          />
                          <span className="flex-1">{cls.label}</span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                          )}
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
                  <div className="text-sm font-semibold text-white">{s.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI is creating your slides...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Presentation
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}