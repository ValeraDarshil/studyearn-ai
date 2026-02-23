// import { useState } from "react";
// import {
//   FileText,
//   Upload,
//   ArrowRight,
//   Image,
//   File,
//   Presentation,
//   CheckCircle,
//   X,
// } from "lucide-react";
// import { useApp } from "../context/AppContext";
// import { File } from "buffer";

// const tools = [
//   {
//     id: "pdf-ppt",
//     title: "PDF to PPT",
//     desc: "Convert PDF files to PowerPoint presentations",
//     icon: "📊",
//     from: "PDF",
//     to: "PPT",
//     color: "from-orange-500 to-red-500",
//   },
//   {
//     id: "word-pdf",
//     title: "Word to PDF",
//     desc: "Convert Word documents to PDF format",
//     icon: "📝",
//     from: "DOCX",
//     to: "PDF",
//     color: "from-blue-500 to-blue-600",
//   },
//   {
//     id: "img-pdf",
//     title: "Images to PDF",
//     desc: "Combine multiple images into a single PDF",
//     icon: "🖼️",
//     from: "IMG",
//     to: "PDF",
//     color: "from-green-500 to-emerald-600",
//   },
//   {
//     id: "pdf-edit",
//     title: "PDF Editor",
//     desc: "Edit, annotate, and modify PDF files",
//     icon: "✏️",
//     from: "PDF",
//     to: "PDF",
//     color: "from-purple-500 to-purple-600",
//   },
//   {
//     id: "ppt-pdf",
//     title: "PPT to PDF",
//     desc: "Convert PowerPoint to PDF format",
//     icon: "📑",
//     from: "PPT",
//     to: "PDF",
//     color: "from-cyan-500 to-cyan-600",
//   },
//   {
//     id: "merge-pdf",
//     title: "Merge PDFs",
//     desc: "Combine multiple PDFs into one document",
//     icon: "📎",
//     from: "PDFs",
//     to: "PDF",
//     color: "from-pink-500 to-pink-600",
//   },
// ];

// export function PDFTools() {
//   const { addPoints } = useApp();
//   const [selectedTool, setSelectedTool] = useState<string | null>(null);
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
//   const [converting, setConverting] = useState(false);
//   const [converted, setConverted] = useState(false);
//   const [dragOver, setDragOver] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     setUploadedFiles(Array.from(e.target.files));
//   };

//   const handleConvert = async () => {
//     if (!uploadedFiles.length) return;

//     setConverting(true);
//     const result = await convertImagesToPDF(uploadedFiles);

//     setConverting(false);

//     if (result.success) {
//       setConverted(true);
//       setDownloadUrl(result.url);
//       addPoints(5);
//     }
//   };

//   const resetState = () => {
//     setSelectedTool(null);
//     setUploadedFiles([]);
//     setConverting(false);
//     setConverted(false);
//   };

//   const currentTool = tools.find((t) => t.id === selectedTool);

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//           <FileText className="w-6 h-6 text-cyan-400" />
//           PDF Tools
//         </h1>
//         <p className="text-sm text-slate-400 mt-1">
//           Convert, merge, and edit your documents with ease
//         </p>
//       </div>

//       {!selectedTool ? (
//         /* Tool Grid */
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {tools.map((tool) => (
//             <button
//               key={tool.id}
//               onClick={() => setSelectedTool(tool.id)}
//               className="glass rounded-2xl p-5 text-left glass-hover transition-smooth group card-shine"
//             >
//               <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
//                 {tool.icon}
//               </div>
//               <h3 className="font-semibold text-white text-sm">{tool.title}</h3>
//               <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//                 {tool.desc}
//               </p>
//               <div className="flex items-center gap-2 mt-4">
//                 <span
//                   className={`px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r ${tool.color} text-white`}
//                 >
//                   {tool.from}
//                 </span>
//                 <ArrowRight className="w-3 h-3 text-slate-600" />
//                 <span
//                   className={`px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r ${tool.color} text-white`}
//                 >
//                   {tool.to}
//                 </span>
//               </div>
//             </button>
//           ))}
//         </div>
//       ) : (
//         /* Upload Area */
//         <div className="space-y-4">
//           <button
//             onClick={resetState}
//             className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
//           >
//             ← Back to tools
//           </button>

//           <div className="glass rounded-2xl p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <span className="text-2xl">{currentTool?.icon}</span>
//               <div>
//                 <h2 className="text-lg font-semibold text-white">
//                   {currentTool?.title}
//                 </h2>
//                 <p className="text-xs text-slate-500">{currentTool?.desc}</p>
//               </div>
//             </div>

//             {/* Drop Zone */}
//             {!converted && (
//               <div
//                 onDragOver={(e) => {
//                   e.preventDefault();
//                   setDragOver(true);
//                 }}
//                 onDragLeave={() => setDragOver(false)}
//                 onDrop={(e) => {
//                   e.preventDefault();
//                   setDragOver(false);
//                   handleFileUpload();
//                 }}
//                 className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
//                   dragOver
//                     ? "border-purple-500/40 bg-purple-500/5"
//                     : "border-white/10 hover:border-white/20"
//                 }`}
//               >
//                 <div className="flex flex-col items-center">
//                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4">
//                     <Upload className="w-7 h-7 text-slate-500" />
//                   </div>
//                   <h3 className="text-sm font-semibold text-white mb-1">
//                     Drag & drop your files here
//                   </h3>
//                   <p className="text-xs text-slate-500 mb-4">
//                     or click to browse
//                   </p>
//                   <button
//                     onClick={handleFileUpload}
//                     className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium glow-btn"
//                   >
//                     Choose Files
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Uploaded Files */}
//             {uploadedFiles.length > 0 && !converted && (
//               <div className="mt-4 space-y-2">
//                 {uploadedFiles.map((file, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
//                   >
//                     {file.endsWith(".pdf") ? (
//                       <File className="w-5 h-5 text-red-400" />
//                     ) : file.endsWith(".pptx") ? (
//                       <Presentation className="w-5 h-5 text-orange-400" />
//                     ) : (
//                       <Image className="w-5 h-5 text-green-400" />
//                     )}
//                     <span className="flex-1 text-sm text-slate-300">
//                       {file}
//                     </span>
//                     <button
//                       onClick={() =>
//                         setUploadedFiles((files) =>
//                           files.filter((_, idx) => idx !== i),
//                         )
//                       }
//                       className="text-slate-600 hover:text-slate-400"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}

//                 <button
//                   onClick={handleConvert}
//                   disabled={converting}
//                   className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm disabled:opacity-60 glow-btn"
//                 >
//                   {converting ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       Converting...
//                     </>
//                   ) : (
//                     <>
//                       Convert Now
//                       <ArrowRight className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}

//             {/* Converting Progress */}
//             {converting && (
//               <div className="mt-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-xs text-slate-400">Converting...</span>
//                   <span className="text-xs text-purple-400">Processing</span>
//                 </div>
//                 <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
//                   <div
//                     className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"
//                     style={{ width: "75%" }}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Converted */}
//             {converted && (
//               <div className="text-center py-6">
//                 <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
//                   <CheckCircle className="w-8 h-8 text-green-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-white mb-1">
//                   Conversion Complete!
//                 </h3>
//                 <p className="text-xs text-slate-500 mb-1">
//                   +5 points earned ✨
//                 </p>
//                 <p className="text-sm text-slate-400 mb-6">
//                   Your file is ready to download
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                   <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm glow-btn flex items-center justify-center gap-2">
//                     <Upload className="w-4 h-4 rotate-180" />
//                     Download File
//                   </button>
//                   <button
//                     onClick={resetState}
//                     className="px-6 py-2.5 rounded-xl glass border border-white/10 text-white text-sm hover:bg-white/5 transition-all"
//                   >
//                     Convert Another
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useRef, useState } from "react";
// import {
//   FileText,
//   Upload,
//   ArrowRight,
//   Image,
//   File,
//   Presentation,
//   CheckCircle,
//   X,
// } from "lucide-react";
// import { useApp } from "../context/AppContext";
// import { convertImagesToPDF } from "../utils/api";

// const tools = [
//   {
//     id: "pdf-ppt",
//     title: "PDF to PPT",
//     desc: "Convert PDF files to PowerPoint presentations",
//     icon: "📊",
//     from: "PDF",
//     to: "PPT",
//     color: "from-orange-500 to-red-500",
//   },
//   {
//     id: "word-pdf",
//     title: "Word to PDF",
//     desc: "Convert Word documents to PDF format",
//     icon: "📝",
//     from: "DOCX",
//     to: "PDF",
//     color: "from-blue-500 to-blue-600",
//   },
//   {
//     id: "img-pdf",
//     title: "Images to PDF",
//     desc: "Combine multiple images into a single PDF",
//     icon: "🖼️",
//     from: "IMG",
//     to: "PDF",
//     color: "from-green-500 to-emerald-600",
//   },
//   {
//     id: "pdf-edit",
//     title: "PDF Editor",
//     desc: "Edit, annotate, and modify PDF files",
//     icon: "✏️",
//     from: "PDF",
//     to: "PDF",
//     color: "from-purple-500 to-purple-600",
//   },
//   {
//     id: "ppt-pdf",
//     title: "PPT to PDF",
//     desc: "Convert PowerPoint to PDF format",
//     icon: "📑",
//     from: "PPT",
//     to: "PDF",
//     color: "from-cyan-500 to-cyan-600",
//   },
//   {
//     id: "merge-pdf",
//     title: "Merge PDFs",
//     desc: "Combine multiple PDFs into one document",
//     icon: "📎",
//     from: "PDFs",
//     to: "PDF",
//     color: "from-pink-500 to-pink-600",
//   },
// ];

// export function PDFTools() {
//   const { addPoints } = useApp();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [selectedTool, setSelectedTool] = useState<string | null>(null);
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
//   const [converting, setConverting] = useState(false);
//   const [converted, setConverted] = useState(false);
//   const [dragOver, setDragOver] = useState(false);
//   const [downloadUrl, setDownloadUrl] = useState("");

//   const handleFileUpload = (files: FileList | null) => {
//     if (!files) return;
//     setUploadedFiles(Array.from(files));
//   };

//   const handleConvert = async () => {
//     if (!uploadedFiles.length) return;

//     setConverting(true);
//     const result = await convertImagesToPDF(uploadedFiles);
//     setConverting(false);

//     if (result?.success) {
//       setConverted(true);
//       setDownloadUrl(result.url);
//       addPoints(5);
//     } else {
//       alert("Conversion failed");
//     }

//     if (selectedTool === "merge-pdf") {
//       const result = await mergePDF(uploadedFiles);

//       if (result.success) {
//         setConverted(true);
//         setDownloadUrl("http://localhost:5000" + result.url);
//         addPoints(5);
//       }
//     }
//   };

//   const resetState = () => {
//     setSelectedTool(null);
//     setUploadedFiles([]);
//     setConverting(false);
//     setConverted(false);
//     setDownloadUrl("");
//   };

//   const currentTool = tools.find((t) => t.id === selectedTool);

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-white flex items-center gap-2">
//           <FileText className="w-6 h-6 text-cyan-400" /> PDF Tools
//         </h1>
//         <p className="text-sm text-slate-400 mt-1">
//           Convert, merge, and edit your documents with ease
//         </p>
//       </div>

//       {!selectedTool ? (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {tools.map((tool) => (
//             <button
//               key={tool.id}
//               onClick={() => setSelectedTool(tool.id)}
//               className="glass rounded-2xl p-5 text-left glass-hover transition-smooth group card-shine"
//             >
//               <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
//                 {tool.icon}
//               </div>
//               <h3 className="font-semibold text-white text-sm">{tool.title}</h3>
//               <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//                 {tool.desc}
//               </p>
//               <div className="flex items-center gap-2 mt-4">
//                 <span
//                   className={`px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r ${tool.color} text-white`}
//                 >
//                   {tool.from}
//                 </span>
//                 <ArrowRight className="w-3 h-3 text-slate-600" />
//                 <span
//                   className={`px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r ${tool.color} text-white`}
//                 >
//                   {tool.to}
//                 </span>
//               </div>
//             </button>
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <button
//             onClick={resetState}
//             className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
//           >
//             ← Back to tools
//           </button>

//           <div className="glass rounded-2xl p-6">
//             <div className="flex items-center gap-3 mb-6">
//               <span className="text-2xl">{currentTool?.icon}</span>
//               <div>
//                 <h2 className="text-lg font-semibold text-white">
//                   {currentTool?.title}
//                 </h2>
//                 <p className="text-xs text-slate-500">{currentTool?.desc}</p>
//               </div>
//             </div>

//             {!converted && (
//               <div
//                 onDragOver={(e) => {
//                   e.preventDefault();
//                   setDragOver(true);
//                 }}
//                 onDragLeave={() => setDragOver(false)}
//                 onDrop={(e) => {
//                   e.preventDefault();
//                   setDragOver(false);
//                   handleFileUpload(e.dataTransfer.files);
//                 }}
//                 className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${dragOver ? "border-purple-500/40 bg-purple-500/5" : "border-white/10 hover:border-white/20"}`}
//               >
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) => handleFileUpload(e.target.files)}
//                 />

//                 <div className="flex flex-col items-center">
//                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4">
//                     <Upload className="w-7 h-7 text-slate-500" />
//                   </div>
//                   <h3 className="text-sm font-semibold text-white mb-1">
//                     Drag & drop your files here
//                   </h3>
//                   <p className="text-xs text-slate-500 mb-4">
//                     or click to browse
//                   </p>
//                   <button
//                     onClick={() => fileInputRef.current?.click()}
//                     className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium glow-btn"
//                   >
//                     Choose Files
//                   </button>
//                 </div>
//               </div>
//             )}

//             {uploadedFiles.length > 0 && !converted && (
//               <div className="mt-4 space-y-2">
//                 {uploadedFiles.map((file, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
//                   >
//                     {file.type.includes("pdf") ? (
//                       <File className="w-5 h-5 text-red-400" />
//                     ) : file.type.includes("presentation") ? (
//                       <Presentation className="w-5 h-5 text-orange-400" />
//                     ) : (
//                       <Image className="w-5 h-5 text-green-400" />
//                     )}
//                     <span className="flex-1 text-sm text-slate-300">
//                       {file.name}
//                     </span>
//                     <button
//                       onClick={() =>
//                         setUploadedFiles((files) =>
//                           files.filter((_, idx) => idx !== i),
//                         )
//                       }
//                       className="text-slate-600 hover:text-slate-400"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}

//                 <button
//                   onClick={handleConvert}
//                   disabled={converting}
//                   className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm disabled:opacity-60 glow-btn"
//                 >
//                   {converting ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
//                       Converting...
//                     </>
//                   ) : (
//                     <>
//                       Convert Now <ArrowRight className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}

//             {converted && (
//               <div className="text-center py-6">
//                 <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
//                   <CheckCircle className="w-8 h-8 text-green-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-white mb-1">
//                   Conversion Complete!
//                 </h3>
//                 <p className="text-xs text-slate-500 mb-1">
//                   +5 points earned ✨
//                 </p>
//                 <p className="text-sm text-slate-400 mb-6">
//                   Your file is ready to download
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                   <a
//                     href={downloadUrl}
//                     download
//                     className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm glow-btn flex items-center justify-center gap-2"
//                   >
//                     <Upload className="w-4 h-4 rotate-180" /> Download PDF
//                   </a>
//                   <button
//                     onClick={resetState}
//                     className="px-6 py-2.5 rounded-xl glass border border-white/10 text-white text-sm hover:bg-white/5 transition-all"
//                   >
//                     Convert Another
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useRef, useState } from "react";
import {
  FileText,
  Upload,
  ArrowRight,
  Image,
  File,
  Presentation,
  CheckCircle,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { convertImagesToPDF, mergePDF } from "../utils/api";

const tools = [
  {
    id: "pdf-ppt",
    title: "PDF to PPT",
    desc: "Coming soon",
    icon: "📊",
    from: "PDF",
    to: "PPT",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "word-pdf",
    title: "Word to PDF",
    desc: "Coming soon",
    icon: "📝",
    from: "DOCX",
    to: "PDF",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "img-pdf",
    title: "Images to PDF",
    desc: "Combine images into a single PDF",
    icon: "🖼️",
    from: "IMG",
    to: "PDF",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "pdf-edit",
    title: "PDF Editor",
    desc: "Coming soon",
    icon: "✏️",
    from: "PDF",
    to: "PDF",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "ppt-pdf",
    title: "PPT to PDF",
    desc: "Coming soon",
    icon: "📑",
    from: "PPT",
    to: "PDF",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: "merge-pdf",
    title: "Merge PDFs",
    desc: "Combine multiple PDFs into one document",
    icon: "📎",
    from: "PDFs",
    to: "PDF",
    color: "from-pink-500 to-pink-600",
  },
];

export function PDFTools() {
  const { addPoints, logActivity } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  // ===== FILE UPLOAD (APPEND MODE + REMOVE DUPLICATES) =====
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);

    setUploadedFiles((prev) => {
      const all = [...prev, ...newFiles];

      // remove duplicates
      return Array.from(new Map(all.map((f) => [f.name + f.size, f])).values());
    });
  };

  // ===== CONVERT LOGIC =====
  const handleConvert = async () => {
    if (!uploadedFiles.length) return;

    setConverting(true);

    let result;

    if (selectedTool === "merge-pdf") {
      result = await mergePDF(uploadedFiles);
    } else {
      result = await convertImagesToPDF(uploadedFiles);
    }

    setConverting(false);

    if (result?.success) {
      setConverted(true);
      setDownloadUrl(result.url);
      addPoints(5);

      const toolName =
        selectedTool === "merge-pdf" ? "PDF Merge" : "Images to PDF";
      logActivity("pdf_tool", toolName, 5);
    } else {
      alert(result?.message || "Conversion failed");
    }
  };

  const resetState = () => {
    setSelectedTool(null);
    setUploadedFiles([]);
    setConverting(false);
    setConverted(false);
    setDownloadUrl("");
  };

  const currentTool = tools.find((t) => t.id === selectedTool);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" /> PDF Tools
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Convert and merge your documents easily
        </p>
      </div>

      {!selectedTool ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className="glass rounded-2xl p-5 text-left hover:bg-white/5 transition"
            >
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="font-semibold text-white text-sm">{tool.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{tool.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={resetState}
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Back
          </button>

          <div className="glass rounded-2xl p-6">
            {/* ===== DROP ZONE ===== */}
            {!converted && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition ${
                  dragOver
                    ? "border-purple-500/40 bg-purple-500/5"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={
                    selectedTool === "merge-pdf"
                      ? "application/pdf"
                      : "image/*,application/pdf"
                  }
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />

                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-slate-400 mb-4" />
                  <p className="text-sm text-white mb-2">
                    Drag & drop files here
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm"
                  >
                    Choose Files
                  </button>
                </div>
              </div>
            )}

            {/* ===== FILE LIST ===== */}
            {uploadedFiles.length > 0 && !converted && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    {file.type.includes("pdf") ? (
                      <File className="w-5 h-5 text-red-400" />
                    ) : (
                      <Image className="w-5 h-5 text-green-400" />
                    )}

                    <span className="flex-1 text-sm text-slate-300">
                      {file.name}
                    </span>

                    <button
                      onClick={() =>
                        setUploadedFiles((files) =>
                          files.filter((_, idx) => idx !== i),
                        )
                      }
                      className="text-slate-600 hover:text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleConvert}
                  disabled={converting}
                  className="w-full mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm"
                >
                  {converting ? "Processing..." : "Convert Now"}
                </button>
              </div>
            )}

            {/* ===== SUCCESS ===== */}
            {converted && (
              <div className="text-center py-6">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Done!</h3>

                <a
                  href={downloadUrl}
                  download
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  Download PDF
                </a>

                <div className="mt-4">
                  <button
                    onClick={resetState}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    Convert Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
