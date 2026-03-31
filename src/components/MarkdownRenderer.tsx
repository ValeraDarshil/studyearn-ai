// /**
//  * StudyEarn AI — Markdown + LaTeX Renderer
//  * ─────────────────────────────────────────────────────────────
//  * Pure React, zero external dependencies.
//  * Supports:
//  *   - Headings (H1/H2/H3)
//  *   - Bold (**text**), Italic (*text*), Code (`code`)
//  *   - Bullet lists (- item), Numbered lists (1. item)
//  *   - Code blocks (```language\ncode\n```)
//  *   - Blockquotes (> text)
//  *   - LaTeX math: inline $x^2$ and block $$E=mc^2$$
//  *   - Horizontal rule ---
//  *   - Tables (| col | col |)
//  */

// import { useEffect, useRef } from "react";

// // ─────────────────────────────────────────────────────────────
// // LATEX RENDERER — Uses KaTeX via CDN (loaded once)
// // ─────────────────────────────────────────────────────────────
// let katexLoaded = false;
// let katexLoadPromise: Promise<void> | null = null;

// function loadKatex(): Promise<void> {
//   if (katexLoaded) return Promise.resolve();
//   if (katexLoadPromise) return katexLoadPromise;

//   katexLoadPromise = new Promise((resolve) => {
//     // Load KaTeX CSS
//     if (!document.querySelector('link[href*="katex"]')) {
//       const link = document.createElement("link");
//       link.rel  = "stylesheet";
//       link.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
//       document.head.appendChild(link);
//     }

//     // Load KaTeX JS
//     const script = document.createElement("script");
//     script.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
//     script.onload = () => { katexLoaded = true; resolve(); };
//     script.onerror = () => resolve(); // Fail silently
//     document.head.appendChild(script);
//   });

//   return katexLoadPromise;
// }

// /** Render LaTeX math string to HTML. Falls back to raw text on error. */
// function renderMath(latex: string, displayMode = false): string {
//   try {
//     const katex = (window as any).katex;
//     if (!katex) return latex;
//     return katex.renderToString(latex, {
//       displayMode,
//       throwOnError: false,
//       errorColor: "#ff6b6b",
//     });
//   } catch {
//     return latex;
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // INLINE RENDERER — bold, italic, code, math, links
// // ─────────────────────────────────────────────────────────────
// function renderInlineHTML(text: string): string {
//   return text
//     // Inline math: $...$  (not $$)
//     .replace(/\$([^$\n]+?)\$/g, (_, math) =>
//       `<span class="katex-inline">${renderMath(math, false)}</span>`)
//     // Bold+italic: ***text***
//     .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
//     // Bold: **text**
//     .replace(/\*\*(.+?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>")
//     // Italic: *text*
//     .replace(/\*(.+?)\*/g, "<em class='text-slate-200 italic'>$1</em>")
//     // Code: `code`
//     .replace(/`([^`]+)`/g,
//       "<code class='bg-white/10 text-cyan-300 px-1.5 py-0.5 rounded text-[0.8em] font-mono'>$1</code>")
//     // Strikethrough: ~~text~~
//     .replace(/~~(.+?)~~/g, "<del class='text-slate-500 line-through'>$1</del>");
// }

// // ─────────────────────────────────────────────────────────────
// // PARSE MARKDOWN → HTML STRING
// // ─────────────────────────────────────────────────────────────
// function parseMarkdown(text: string): string {
//   const lines = text.split("\n");
//   const html: string[] = [];
//   let i = 0;
//   let inList = false;
//   let listType = "";

//   const closeList = () => {
//     if (inList) {
//       html.push(listType === "ul" ? "</ul>" : "</ol>");
//       inList = false;
//       listType = "";
//     }
//   };

//   while (i < lines.length) {
//     const line = lines[i];

//     // ── Block math: $$...$$ ──────────────────────────────────
//     if (line.trim().startsWith("$$")) {
//       closeList();
//       let mathContent = line.trim().slice(2);
//       i++;
//       while (i < lines.length && !lines[i].trim().endsWith("$$")) {
//         mathContent += "\n" + lines[i];
//         i++;
//       }
//       if (i < lines.length) mathContent += "\n" + lines[i].trim().slice(0, -2);
//       html.push(`<div class="my-4 overflow-x-auto text-center">${renderMath(mathContent.trim(), true)}</div>`);
//       i++;
//       continue;
//     }

//     // ── Code block: ```lang ─────────────────────────────────
//     if (line.trim().startsWith("```")) {
//       closeList();
//       const lang = line.trim().slice(3).trim() || "code";
//       const codeLines: string[] = [];
//       i++;
//       while (i < lines.length && !lines[i].trim().startsWith("```")) {
//         codeLines.push(lines[i].replace(/</g, "&lt;").replace(/>/g, "&gt;"));
//         i++;
//       }
//       html.push(`
//         <div class="my-3 rounded-xl overflow-hidden border border-white/10">
//           <div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
//             <span class="text-xs font-mono text-slate-500">${lang}</span>
//           </div>
//           <pre class="p-4 overflow-x-auto text-sm"><code class="font-mono text-cyan-300 leading-relaxed">${codeLines.join("\n")}</code></pre>
//         </div>`);
//       i++;
//       continue;
//     }

//     // ── Horizontal rule ─────────────────────────────────────
//     if (line.trim().match(/^[-*_]{3,}$/) && line.trim().length <= 10) {
//       closeList();
//       html.push('<hr class="my-4 border-white/10" />');
//       i++;
//       continue;
//     }

//     // ── Headings ────────────────────────────────────────────
//     if (line.startsWith("### ")) {
//       closeList();
//       html.push(`<h3 class="text-base font-bold text-purple-300 mt-5 mb-2">${renderInlineHTML(line.slice(4))}</h3>`);
//       i++; continue;
//     }
//     if (line.startsWith("## ")) {
//       closeList();
//       html.push(`<h2 class="text-lg font-bold text-blue-300 mt-6 mb-2">${renderInlineHTML(line.slice(3))}</h2>`);
//       i++; continue;
//     }
//     if (line.startsWith("# ")) {
//       closeList();
//       html.push(`<h1 class="text-xl font-bold text-white mt-6 mb-3">${renderInlineHTML(line.slice(2))}</h1>`);
//       i++; continue;
//     }

//     // ── Blockquote ──────────────────────────────────────────
//     if (line.startsWith("> ")) {
//       closeList();
//       html.push(`<blockquote class="border-l-2 border-blue-500/50 pl-4 my-2 text-slate-400 italic text-sm">${renderInlineHTML(line.slice(2))}</blockquote>`);
//       i++; continue;
//     }

//     // ── Table (simple) ──────────────────────────────────────
//     if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
//       closeList();
//       const tableLines: string[] = [];
//       while (i < lines.length && lines[i].trim().startsWith("|")) {
//         tableLines.push(lines[i]);
//         i++;
//       }
//       if (tableLines.length >= 2) {
//         const headerCells = tableLines[0].split("|").filter(c => c.trim());
//         const bodyRows = tableLines.slice(2); // skip separator row
//         html.push(`
//           <div class="my-4 overflow-x-auto rounded-xl border border-white/10">
//             <table class="w-full text-sm">
//               <thead>
//                 <tr class="bg-white/5 border-b border-white/10">
//                   ${headerCells.map(c => `<th class="px-4 py-2 text-left text-xs font-semibold text-slate-300">${renderInlineHTML(c.trim())}</th>`).join("")}
//                 </tr>
//               </thead>
//               <tbody>
//                 ${bodyRows.map((row, ri) => {
//                   const cells = row.split("|").filter(c => c.trim());
//                   return `<tr class="${ri % 2 === 0 ? "bg-white/[0.01]" : "bg-white/[0.03]"} border-b border-white/5">
//                     ${cells.map(c => `<td class="px-4 py-2 text-slate-300">${renderInlineHTML(c.trim())}</td>`).join("")}
//                   </tr>`;
//                 }).join("")}
//               </tbody>
//             </table>
//           </div>`);
//       }
//       continue;
//     }

//     // ── Bullet list ─────────────────────────────────────────
//     if (line.match(/^[\-\*\+] /)) {
//       if (!inList || listType !== "ul") {
//         closeList();
//         html.push('<ul class="my-2 space-y-1">');
//         inList = true; listType = "ul";
//       }
//       html.push(`<li class="flex gap-2 ml-1">
//         <span class="text-purple-400 mt-1.5 flex-shrink-0 text-[8px]">●</span>
//         <span class="text-sm text-slate-300 leading-relaxed">${renderInlineHTML(line.replace(/^[\-\*\+] /, ""))}</span>
//       </li>`);
//       i++; continue;
//     }

//     // ── Numbered list ───────────────────────────────────────
//     if (line.match(/^\d+\. /)) {
//       if (!inList || listType !== "ol") {
//         closeList();
//         html.push('<ol class="my-2 space-y-1">');
//         inList = true; listType = "ol";
//       }
//       const num = line.match(/^(\d+)\./)?.[1];
//       html.push(`<li class="flex gap-2 ml-1">
//         <span class="text-blue-400 font-bold text-sm flex-shrink-0 min-w-[18px] pt-0.5">${num}.</span>
//         <span class="text-sm text-slate-300 leading-relaxed">${renderInlineHTML(line.replace(/^\d+\. /, ""))}</span>
//       </li>`);
//       i++; continue;
//     }

//     // ── Empty line ──────────────────────────────────────────
//     if (!line.trim()) {
//       closeList();
//       html.push('<div class="h-2"></div>');
//       i++; continue;
//     }

//     // ── Paragraph ───────────────────────────────────────────
//     closeList();
//     html.push(`<p class="text-sm text-slate-300 leading-relaxed my-1">${renderInlineHTML(line)}</p>`);
//     i++;
//   }

//   closeList();
//   return html.join("\n");
// }

// // ─────────────────────────────────────────────────────────────
// // REACT COMPONENT
// // ─────────────────────────────────────────────────────────────
// interface MarkdownRendererProps {
//   content: string;
//   className?: string;
// }

// export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // Load KaTeX then re-render if math was detected
//     if (content.includes("$")) {
//       loadKatex().then(() => {
//         if (ref.current && (window as any).katex) {
//           ref.current.innerHTML = parseMarkdown(content);
//         }
//       });
//     }
//   }, [content]);

//   return (
//     <div
//       ref={ref}
//       className={`markdown-content ${className}`}
//       dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
//     />
//   );
// }



/**
 * StudyEarn AI — MarkdownRenderer v5 (Ultra Premium)
 * ─────────────────────────────────────────────────────────────
 * ChatGPT / Gemini / Claude style rendering:
 * ✅ Syntax-colored code (Python, JS, HTML, CSS, C, Java, SQL, Bash)
 * ✅ Working COPY button (clipboard API + textarea fallback)
 * ✅ ⚠️ Warning lines → red pill highlight
 * ✅ 📌 💡 🔥 Key lines → amber pill highlight
 * ✅ ✅ Success lines → green pill highlight
 * ✅ Bold **text** → white & bright
 * ✅ Headings with colored left border accent
 * ✅ Blockquotes → styled callout cards
 * ✅ Tables with zebra stripes
 * ✅ LaTeX math via KaTeX
 * ✅ Bullet & numbered lists — premium style
 */

import { useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// KaTeX loader
// ─────────────────────────────────────────────────────────────
let katexLoaded = false;
let katexPromise: Promise<void> | null = null;
function loadKatex(): Promise<void> {
  if (katexLoaded) return Promise.resolve();
  if (katexPromise) return katexPromise;
  katexPromise = new Promise((resolve) => {
    if (!document.querySelector('link[href*="katex"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
      document.head.appendChild(link);
    }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
    s.onload = () => { katexLoaded = true; resolve(); };
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
  return katexPromise;
}
function renderMath(latex: string, display = false): string {
  try {
    const k = (window as any).katex;
    if (!k) return latex;
    return k.renderToString(latex, { displayMode: display, throwOnError: false, errorColor: "#f87171" });
  } catch { return latex; }
}

// ─────────────────────────────────────────────────────────────
// SYNTAX HIGHLIGHTER — pure regex, no library needed
// ─────────────────────────────────────────────────────────────
function syntaxHighlight(code: string, lang: string): string {
  let c = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const l = lang.toLowerCase();

  if (l === "python" || l === "py") {
    c = c
      .replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\n]*"|'[^'\n]*')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(def|class|import|from|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|try|except|finally|with|as|pass|break|continue|raise|lambda|yield|async|await|global|nonlocal|del|assert)\b/g, '<span class="syn-kw">$1</span>')
      .replace(/\b(print|input|len|range|type|int|float|str|list|dict|set|tuple|bool|open|sum|max|min|abs|round|sorted|enumerate|zip|map|filter|super|self|cls)\b/g, '<span class="syn-builtin">$1</span>')
      .replace(/(@\w+)/g, '<span class="syn-deco">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(#[^\n]*)/g, '<span class="syn-comment">$1</span>');
  } else if (["js","javascript","ts","typescript","jsx","tsx"].includes(l)) {
    c = c
      .replace(/(`[^`]*`|"[^"\n]*"|'[^'\n]*')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|export|default|from|async|await|try|catch|finally|throw|typeof|instanceof|in|of|this|super|static|null|undefined|true|false|void|delete|yield)\b/g, '<span class="syn-kw">$1</span>')
      .replace(/\b(console|document|window|Math|Array|Object|String|Number|Boolean|Promise|JSON|Date|Error|Map|Set|fetch|setTimeout|clearTimeout|setInterval|parseInt|parseFloat)\b/g, '<span class="syn-builtin">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(\/\/[^\n]*)/g, '<span class="syn-comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syn-comment">$1</span>');
  } else if (l === "html" || l === "xml") {
    c = c
      .replace(/=("[\s\S]*?"|'[\s\S]*?')/g, '=<span class="syn-str">$1</span>')
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="syn-tag">$2</span>')
      .replace(/\s([\w-]+)=/g, ' <span class="syn-attr">$1</span>=')
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="syn-comment">$1</span>');
  } else if (l === "css" || l === "scss") {
    c = c
      .replace(/(:[^;{}\n]+)/g, '<span class="syn-str">$1</span>')
      .replace(/\b(\d+\.?\d*(px|em|rem|%|vh|vw|s|ms)?)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syn-comment">$1</span>');
  } else if (["c","cpp","c++"].includes(l)) {
    c = c
      .replace(/(".*?"|'.*?')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(int|float|double|char|void|bool|long|short|unsigned|signed|struct|class|return|if|else|for|while|do|switch|case|break|continue|include|define|typedef|enum|const|static|extern|auto|NULL|true|false|new|delete|namespace|using|public|private|protected|virtual)\b/g, '<span class="syn-kw">$1</span>')
      .replace(/(#\w+)/g, '<span class="syn-deco">$1</span>')
      .replace(/\b(\d+\.?\d*[fFlL]?)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(\/\/[^\n]*)/g, '<span class="syn-comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syn-comment">$1</span>');
  } else if (l === "java") {
    c = c
      .replace(/(".*?"|'.*?')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(public|private|protected|class|interface|extends|implements|import|package|return|if|else|for|while|do|switch|case|break|continue|new|void|static|final|abstract|try|catch|finally|throw|throws|instanceof|this|super|null|true|false|int|float|double|char|boolean|long|short|byte|String)\b/g, '<span class="syn-kw">$1</span>')
      .replace(/\b(\d+\.?\d*[fFlL]?)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(\/\/[^\n]*)/g, '<span class="syn-comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syn-comment">$1</span>');
  } else if (l === "sql") {
    c = c
      .replace(/('.*?')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|ORDER|BY|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|AND|OR|IN|LIKE|BETWEEN|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|LIMIT|OFFSET|UNION|ALL|EXISTS|CASE|WHEN|THEN|ELSE|END)\b/gi, '<span class="syn-kw">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(--[^\n]*)/g, '<span class="syn-comment">$1</span>');
  } else if (["bash","sh","shell","zsh"].includes(l)) {
    c = c
      .replace(/(".*?"|'.*?')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|echo|cd|ls|mkdir|rm|cp|mv|grep|sed|awk|cat|chmod|chown|export|source|alias)\b/g, '<span class="syn-kw">$1</span>')
      .replace(/(\$\{?[\w]+\}?)/g, '<span class="syn-builtin">$1</span>')
      .replace(/(#[^\n]*)/g, '<span class="syn-comment">$1</span>');
  }

  return c;
}

// ─────────────────────────────────────────────────────────────
// LINE TYPE DETECTOR
// ─────────────────────────────────────────────────────────────
type LineType = "warning"|"key"|"success"|"error"|"normal";
function lineType(line: string): LineType {
  const t = line.trim();
  if (t.startsWith("⚠️") || t.includes("Warning:") || t.includes("warning:")) return "warning";
  if (t.startsWith("📌") || t.startsWith("💡") || t.startsWith("🔥") || t.startsWith("🎯") || t.startsWith("🚀")) return "key";
  if (t.startsWith("✅") || t.startsWith("🟢")) return "success";
  if (t.startsWith("❌") || t.startsWith("🔴") || t.startsWith("🚫")) return "error";
  return "normal";
}

// ─────────────────────────────────────────────────────────────
// INLINE RENDERER
// ─────────────────────────────────────────────────────────────
function renderInline(text: string): string {
  return text
    .replace(/\$([^$\n]+?)\$/g, (_, m) => `<span class="katex-inline">${renderMath(m, false)}</span>`)
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="syn-bold">$1</strong>')
    .replace(/\*(?!\*)(.+?)(?<!\*)\*/g, '<em class="syn-italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="syn-icode">$1</code>')
    .replace(/~~(.+?)~~/g, '<del class="syn-del">$1</del>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="syn-link">$1 ↗</a>');
}

// ─────────────────────────────────────────────────────────────
// COPY BUTTON — attach after render
// ─────────────────────────────────────────────────────────────
function attachCopyButtons(root: HTMLElement) {
  root.querySelectorAll<HTMLButtonElement>("[data-cpb]").forEach((btn) => {
    const clone = btn.cloneNode(true) as HTMLButtonElement;
    btn.replaceWith(clone);
    clone.addEventListener("click", () => {
      const block = clone.closest("[data-cb]");
      const code  = block?.querySelector("code");
      if (!code) return;
      const text = code.innerText;
      const done = () => {
        clone.textContent = "✓ Copied!";
        clone.setAttribute("data-done", "1");
        setTimeout(() => { clone.textContent = "Copy"; clone.removeAttribute("data-done"); }, 2000);
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fbCopy(text, done));
      } else {
        fbCopy(text, done);
      }
    });
  });
}

function fbCopy(text: string, done: () => void) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none";
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand("copy"); done(); } catch {}
  document.body.removeChild(ta);
}

// ─────────────────────────────────────────────────────────────
// MARKDOWN → HTML
// ─────────────────────────────────────────────────────────────
function parse(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0, inUl = false, inOl = false;

  const closeUl = () => { if (inUl) { out.push("</ul>"); inUl = false; } };
  const closeOl = () => { if (inOl) { out.push("</ol>"); inOl = false; } };
  const closeLists = () => { closeUl(); closeOl(); };

  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();

    // block math
    if (t.startsWith("$$")) {
      closeLists();
      let math = t.slice(2); i++;
      while (i < lines.length && !lines[i].trim().endsWith("$$")) { math += "\n" + lines[i]; i++; }
      if (i < lines.length) math += "\n" + lines[i].trim().slice(0, -2);
      out.push(`<div class="md-math">${renderMath(math.trim(), true)}</div>`);
      i++; continue;
    }

    // code block
    if (t.startsWith("```")) {
      closeLists();
      const lang = t.slice(3).trim() || "code";
      const codeLines: string[] = []; i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) { codeLines.push(lines[i]); i++; }
      const highlighted = syntaxHighlight(codeLines.join("\n"), lang);
      out.push(`<div class="md-cb" data-cb><div class="md-cbh"><span class="md-lang">${lang}</span><button class="md-cpb" data-cpb>Copy</button></div><pre class="md-pre"><code class="md-code">${highlighted}</code></pre></div>`);
      i++; continue;
    }

    // HR
    if (t.match(/^[-*_]{3,}$/) && t.length <= 10) { closeLists(); out.push('<hr class="md-hr">'); i++; continue; }

    // Headings
    if (raw.startsWith("# "))   { closeLists(); out.push(`<h1 class="md-h1">${renderInline(raw.slice(2))}</h1>`); i++; continue; }
    if (raw.startsWith("## "))  { closeLists(); out.push(`<h2 class="md-h2">${renderInline(raw.slice(3))}</h2>`); i++; continue; }
    if (raw.startsWith("### ")) { closeLists(); out.push(`<h3 class="md-h3">${renderInline(raw.slice(4))}</h3>`); i++; continue; }

    // Blockquote
    if (raw.startsWith("> ")) {
      closeLists();
      const ct = raw.slice(2);
      const lt = lineType(ct);
      const mod = lt==="warning"?" md-bq-w":lt==="key"?" md-bq-k":lt==="success"?" md-bq-s":lt==="error"?" md-bq-e":"";
      out.push(`<blockquote class="md-bq${mod}">${renderInline(ct)}</blockquote>`);
      i++; continue;
    }

    // Table
    if (t.startsWith("|") && t.endsWith("|")) {
      closeLists();
      const rows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(lines[i]); i++; }
      if (rows.length >= 2) {
        const heads = rows[0].split("|").slice(1,-1).map(c=>c.trim());
        const body  = rows.slice(2);
        out.push(`<div class="md-tw"><table class="md-tbl"><thead><tr>${heads.map(h=>`<th class="md-th">${renderInline(h)}</th>`).join("")}</tr></thead><tbody>${body.map((r,ri)=>{const cells=r.split("|").slice(1,-1).map(c=>c.trim());return`<tr class="${ri%2===0?"md-ta":"md-tb"}">${cells.map(c=>`<td class="md-td">${renderInline(c)}</td>`).join("")}</tr>`;}).join("")}</tbody></table></div>`);
      }
      continue;
    }

    // Bullet list
    if (t.match(/^[-*+] /)) {
      closeOl();
      if (!inUl) { out.push('<ul class="md-ul">'); inUl = true; }
      const ct = t.slice(2);
      const lt = lineType(ct);
      const dc = lt==="warning"?"md-dw":lt==="key"?"md-dk":lt==="success"?"md-ds":lt==="error"?"md-de":"md-d";
      out.push(`<li class="md-li"><span class="${dc}">●</span><span class="md-lt">${renderInline(ct)}</span></li>`);
      i++; continue;
    }

    // Numbered list
    if (t.match(/^\d+\. /)) {
      closeUl();
      if (!inOl) { out.push('<ol class="md-ol">'); inOl = true; }
      const num = t.match(/^(\d+)/)?.[1];
      const ct  = t.replace(/^\d+\. /, "");
      out.push(`<li class="md-li"><span class="md-n">${num}.</span><span class="md-lt">${renderInline(ct)}</span></li>`);
      i++; continue;
    }

    // Empty line
    if (!t) { closeLists(); out.push('<div class="md-gap"></div>'); i++; continue; }

    // Paragraph with line type highlighting
    closeLists();
    const lt = lineType(raw);
    const mod = lt==="warning"?" md-pw":lt==="key"?" md-pk":lt==="success"?" md-ps":lt==="error"?" md-pe":"";
    out.push(`<p class="md-p${mod}">${renderInline(raw)}</p>`);
    i++;
  }

  closeLists();
  return out.join("\n");
}

// ─────────────────────────────────────────────────────────────
// CSS — injected once
// ─────────────────────────────────────────────────────────────
const CSS = `
.md-root{font-size:14px;line-height:1.8;color:#cbd5e1;word-break:break-word}

/* Headings */
.md-h1{font-size:1.2rem;font-weight:700;color:#fff;margin:1.2rem 0 .5rem;padding-left:.75rem;border-left:3px solid #7c3aed;line-height:1.4}
.md-h2{font-size:1.05rem;font-weight:700;color:#93c5fd;margin:.9rem 0 .4rem;padding-left:.6rem;border-left:3px solid #3b82f6;line-height:1.4}
.md-h3{font-size:.95rem;font-weight:700;color:#c4b5fd;margin:.75rem 0 .3rem;padding-left:.5rem;border-left:3px solid #8b5cf6;line-height:1.4}

/* Paragraph + specials */
.md-p{font-size:.875rem;color:#cbd5e1;margin:.2rem 0;line-height:1.8}
.md-p.md-pw{background:rgba(239,68,68,.08);border-left:3px solid #ef4444;padding:.4rem .8rem;border-radius:0 6px 6px 0;color:#fca5a5;margin:.35rem 0}
.md-p.md-pk{background:rgba(245,158,11,.08);border-left:3px solid #f59e0b;padding:.4rem .8rem;border-radius:0 6px 6px 0;color:#fde68a;margin:.35rem 0;font-weight:600}
.md-p.md-ps{background:rgba(34,197,94,.08);border-left:3px solid #22c55e;padding:.4rem .8rem;border-radius:0 6px 6px 0;color:#86efac;margin:.35rem 0}
.md-p.md-pe{background:rgba(239,68,68,.07);border-left:3px solid #f87171;padding:.4rem .8rem;border-radius:0 6px 6px 0;color:#fca5a5;margin:.35rem 0}

/* Inline */
.syn-bold   {font-weight:700;color:#fff}
.syn-italic {font-style:italic;color:#e2e8f0}
.syn-del    {text-decoration:line-through;color:#4b5563}
.syn-icode  {background:rgba(99,102,241,.18);color:#a5b4fc;padding:.1em .4em;border-radius:4px;font-family:'JetBrains Mono','Fira Code',monospace;font-size:.82em;border:1px solid rgba(99,102,241,.25)}
.syn-link   {color:#60a5fa;text-decoration:underline;text-underline-offset:2px}
.syn-link:hover{color:#93c5fd}

/* Code blocks */
.md-cb  {background:#0d1117;border:1px solid rgba(255,255,255,.09);border-radius:10px;overflow:hidden;margin:.75rem 0}
.md-cbh {display:flex;align-items:center;justify-content:space-between;padding:.35rem .85rem;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.07)}
.md-lang{font-size:.7rem;font-family:monospace;color:#475569;text-transform:uppercase;letter-spacing:.06em;font-weight:600}
.md-cpb {font-size:.72rem;font-weight:600;color:#64748b;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:.18rem .55rem;cursor:pointer;transition:all .15s;user-select:none;line-height:1.5}
.md-cpb:hover{color:#fff;background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.2)}
.md-cpb[data-done]{color:#4ade80;border-color:rgba(74,222,128,.35)}
.md-pre {margin:0;padding:.9rem 1rem;overflow-x:auto}
.md-code{font-family:'JetBrains Mono','Fira Code','Courier New',monospace;font-size:.8rem;line-height:1.75;color:#e2e8f0;display:block;white-space:pre}

/* Syntax token colors */
.syn-kw      {color:#c792ea;font-weight:600}
.syn-str     {color:#c3e88d}
.syn-num     {color:#f78c6c}
.syn-comment {color:#546e7a;font-style:italic}
.syn-builtin {color:#82aaff}
.syn-deco    {color:#ffcb6b}
.syn-tag     {color:#f07178}
.syn-attr    {color:#c792ea}

/* Blockquotes */
.md-bq   {border-left:3px solid #4f46e5;background:rgba(79,70,229,.08);padding:.5rem .85rem;border-radius:0 8px 8px 0;margin:.5rem 0;color:#c7d2fe;font-size:.875rem;line-height:1.7}
.md-bq-w {border-left-color:#ef4444;background:rgba(239,68,68,.08);color:#fca5a5}
.md-bq-k {border-left-color:#f59e0b;background:rgba(245,158,11,.08);color:#fde68a;font-weight:600}
.md-bq-s {border-left-color:#22c55e;background:rgba(34,197,94,.08);color:#86efac}
.md-bq-e {border-left-color:#f87171;background:rgba(239,68,68,.07);color:#fca5a5}

/* Lists */
.md-ul,.md-ol{margin:.35rem 0;padding:0;list-style:none}
.md-li {display:flex;gap:.5rem;align-items:flex-start;padding:.12rem 0}
.md-lt {font-size:.875rem;color:#cbd5e1;line-height:1.75}
.md-d  {color:#7c3aed;font-size:7px;flex-shrink:0;margin-top:8px}
.md-dw {color:#ef4444;font-size:7px;flex-shrink:0;margin-top:8px}
.md-dk {color:#f59e0b;font-size:7px;flex-shrink:0;margin-top:8px}
.md-ds {color:#22c55e;font-size:7px;flex-shrink:0;margin-top:8px}
.md-de {color:#f87171;font-size:7px;flex-shrink:0;margin-top:8px}
.md-n  {color:#60a5fa;font-weight:700;font-size:.875rem;flex-shrink:0;min-width:1.4rem;padding-top:1px}

/* Tables */
.md-tw {overflow-x:auto;margin:.7rem 0;border-radius:10px;border:1px solid rgba(255,255,255,.09)}
.md-tbl{width:100%;border-collapse:collapse;font-size:.85rem}
.md-th {padding:.45rem .8rem;text-align:left;font-weight:600;font-size:.75rem;color:#94a3b8;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.08);text-transform:uppercase;letter-spacing:.04em}
.md-td {padding:.4rem .8rem;color:#cbd5e1;border-bottom:1px solid rgba(255,255,255,.04)}
.md-ta {background:rgba(255,255,255,.01)}
.md-tb {background:rgba(255,255,255,.033)}

/* Misc */
.md-hr  {border:none;border-top:1px solid rgba(255,255,255,.08);margin:.9rem 0}
.md-gap {height:.3rem}
.md-math{overflow-x:auto;text-align:center;margin:.7rem 0;padding:.5rem;background:rgba(255,255,255,.02);border-radius:8px}
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.id = "sea-md-v5";
  el.textContent = CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

// ─────────────────────────────────────────────────────────────
// REACT COMPONENT
// ─────────────────────────────────────────────────────────────
interface Props { content: string; className?: string; }

export function MarkdownRenderer({ content, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const render = useCallback(() => {
    if (!ref.current) return;
    ref.current.innerHTML = parse(content);
    attachCopyButtons(ref.current);
  }, [content]);

  useEffect(() => { injectCSS(); }, []);

  useEffect(() => {
    render();
    if (content.includes("$")) {
      loadKatex().then(() => { if (ref.current && (window as any).katex) render(); });
    }
  }, [content, render]);

  return (
    <div
      ref={ref}
      className={`md-root ${className}`}
      dangerouslySetInnerHTML={{ __html: parse(content) }}
    />
  );
}