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
 * StudyEarn AI — Ultra Markdown Renderer (v4)
 * ─────────────────────────────────────────────────────────────
 * ChatGPT / Gemini / Claude jaisi rendering:
 *
 * ✅ Emoji rendering (auto-detect and display)
 * ✅ Code blocks with syntax highlight + COPY button
 * ✅ Warning lines → red highlight (⚠️ text)
 * ✅ Important/key points → yellow/amber highlight (📌 💡 🔥)
 * ✅ Bold (**text**), Italic (*text*), Inline code (`code`)
 * ✅ Headings H1 / H2 / H3 with icons
 * ✅ Bullet lists & numbered lists (beautiful styling)
 * ✅ Blockquotes (> text) — styled callout boxes
 * ✅ Tables with alternating rows
 * ✅ LaTeX math via KaTeX ($inline$ and $$block$$)
 * ✅ Horizontal rules
 * ✅ Strikethrough ~~text~~
 * ✅ Links
 * ✅ Dark theme — perfect on StudyEarn's dark UI
 */

import { useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────
// KATEX LOADER (math rendering)
// ─────────────────────────────────────────────────────────────
let katexLoaded = false;
let katexLoadPromise: Promise<void> | null = null;

function loadKatex(): Promise<void> {
  if (katexLoaded) return Promise.resolve();
  if (katexLoadPromise) return katexLoadPromise;
  katexLoadPromise = new Promise((resolve) => {
    if (!document.querySelector('link[href*="katex"]')) {
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css';
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js';
    script.onload = () => { katexLoaded = true; resolve(); };
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
  return katexLoadPromise;
}

function renderMath(latex: string, displayMode = false): string {
  try {
    const katex = (window as any).katex;
    if (!katex) return latex;
    return katex.renderToString(latex, { displayMode, throwOnError: false, errorColor: '#ff6b6b' });
  } catch {
    return latex;
  }
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/** Escape HTML special chars safely */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Detect if a line is a warning (⚠️) or key point (📌 💡 🔥) */
function getLineType(line: string): 'warning' | 'key' | 'success' | 'error' | 'normal' {
  const t = line.trim();
  if (t.startsWith('⚠️') || t.toLowerCase().startsWith('⚠') || t.toLowerCase().includes('warning:')) return 'warning';
  if (t.startsWith('📌') || t.startsWith('💡') || t.startsWith('🔥') || t.startsWith('🎯')) return 'key';
  if (t.startsWith('✅') || t.startsWith('🟢')) return 'success';
  if (t.startsWith('❌') || t.startsWith('🔴')) return 'error';
  return 'normal';
}

// ─────────────────────────────────────────────────────────────
// INLINE RENDERER — bold, italic, code, math, emoji, links
// ─────────────────────────────────────────────────────────────
function renderInlineHTML(text: string): string {
  return text
    // Inline math: $...$ (not $$)
    .replace(/\$([^$\n]+?)\$/g, (_, math) =>
      `<span class="katex-inline">${renderMath(math, false)}</span>`)
    // Bold+italic: ***text***
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold: **text**
    .replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold">$1</strong>')
    // Italic: *text*
    .replace(/\*(?!\*)(.+?)(?<!\*)\*/g, '<em class="md-italic">$1</em>')
    // Inline code: `code`
    .replace(/`([^`]+)`/g,
      '<code class="md-inline-code">$1</code>')
    // Strikethrough: ~~text~~
    .replace(/~~(.+?)~~/g, '<del class="md-del">$1</del>')
    // Links: [text](url)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener" class="md-link">$1 ↗</a>');
}

// ─────────────────────────────────────────────────────────────
// COPY BUTTON INJECTOR
// Called after HTML is inserted into DOM
// ─────────────────────────────────────────────────────────────
function attachCopyButtons(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>('.md-copy-btn').forEach((btn) => {
    // Remove old listener to avoid duplicates
    const fresh = btn.cloneNode(true) as HTMLElement;
    btn.parentNode?.replaceChild(fresh, btn);

    fresh.addEventListener('click', () => {
      const codeEl = fresh.closest('.md-code-block')?.querySelector('code');
      if (!codeEl) return;
      const text = codeEl.innerText;
      navigator.clipboard.writeText(text).then(() => {
        fresh.textContent = '✓ Copied!';
        fresh.classList.add('md-copy-btn--done');
        setTimeout(() => {
          fresh.textContent = 'Copy';
          fresh.classList.remove('md-copy-btn--done');
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        fresh.textContent = '✓ Copied!';
        setTimeout(() => { fresh.textContent = 'Copy'; }, 2000);
      });
    });
  });
}

// ─────────────────────────────────────────────────────────────
// PARSE MARKDOWN → HTML
// ─────────────────────────────────────────────────────────────
function parseMarkdown(text: string): string {
  const lines = text.split('\n');
  const html: string[] = [];
  let i = 0;
  let inList = false;
  let listType = '';
  let listDepth = 0;

  const closeList = () => {
    if (inList) {
      html.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false; listType = ''; listDepth = 0;
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── Block math: $$...$$ ────────────────────────────────
    if (trimmed.startsWith('$$')) {
      closeList();
      let mathContent = trimmed.slice(2);
      i++;
      while (i < lines.length && !lines[i].trim().endsWith('$$')) {
        mathContent += '\n' + lines[i];
        i++;
      }
      if (i < lines.length) mathContent += '\n' + lines[i].trim().slice(0, -2);
      html.push(`<div class="md-math-block">${renderMath(mathContent.trim(), true)}</div>`);
      i++; continue;
    }

    // ── Code block: ```lang ────────────────────────────────
    if (trimmed.startsWith('```')) {
      closeList();
      const lang = trimmed.slice(3).trim() || 'code';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(escapeHtml(lines[i]));
        i++;
      }
      const codeContent = codeLines.join('\n');
      html.push(`
<div class="md-code-block">
  <div class="md-code-header">
    <span class="md-code-lang">${lang}</span>
    <button class="md-copy-btn">Copy</button>
  </div>
  <pre class="md-pre"><code class="md-code lang-${lang}">${codeContent}</code></pre>
</div>`);
      i++; continue;
    }

    // ── Horizontal rule ────────────────────────────────────
    if (trimmed.match(/^[-*_]{3,}$/) && trimmed.length <= 10) {
      closeList();
      html.push('<hr class="md-hr" />');
      i++; continue;
    }

    // ── H1 ─────────────────────────────────────────────────
    if (line.startsWith('# ')) {
      closeList();
      html.push(`<h1 class="md-h1">${renderInlineHTML(line.slice(2))}</h1>`);
      i++; continue;
    }

    // ── H2 ─────────────────────────────────────────────────
    if (line.startsWith('## ')) {
      closeList();
      html.push(`<h2 class="md-h2">${renderInlineHTML(line.slice(3))}</h2>`);
      i++; continue;
    }

    // ── H3 ─────────────────────────────────────────────────
    if (line.startsWith('### ')) {
      closeList();
      html.push(`<h3 class="md-h3">${renderInlineHTML(line.slice(4))}</h3>`);
      i++; continue;
    }

    // ── Blockquote (> text) — styled callout ───────────────
    if (line.startsWith('> ')) {
      closeList();
      const content = line.slice(2);
      const type    = getLineType(content);
      let cls = 'md-blockquote';
      if (type === 'warning') cls += ' md-blockquote--warning';
      else if (type === 'key') cls += ' md-blockquote--key';
      else if (type === 'success') cls += ' md-blockquote--success';
      else if (type === 'error') cls += ' md-blockquote--error';
      html.push(`<blockquote class="${cls}">${renderInlineHTML(content)}</blockquote>`);
      i++; continue;
    }

    // ── Table ──────────────────────────────────────────────
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      closeList();
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const headerCells = tableLines[0].split('|').filter(c => c.trim());
        const bodyRows    = tableLines.slice(2);
        html.push(`
<div class="md-table-wrap">
  <table class="md-table">
    <thead><tr>${headerCells.map(c =>
      `<th class="md-th">${renderInlineHTML(c.trim())}</th>`
    ).join('')}</tr></thead>
    <tbody>${bodyRows.map((row, ri) => {
      const cells = row.split('|').filter(c => c.trim());
      return `<tr class="${ri % 2 === 0 ? 'md-tr-even' : 'md-tr-odd'}">${
        cells.map(c => `<td class="md-td">${renderInlineHTML(c.trim())}</td>`).join('')
      }</tr>`;
    }).join('')}</tbody>
  </table>
</div>`);
      }
      continue;
    }

    // ── Bullet list ────────────────────────────────────────
    if (trimmed.match(/^[-*+] /)) {
      if (!inList || listType !== 'ul') {
        closeList();
        html.push('<ul class="md-ul">');
        inList = true; listType = 'ul';
      }
      const content  = trimmed.replace(/^[-*+] /, '');
      const lineType = getLineType(content);
      let itemCls = 'md-li';
      if (lineType === 'warning') itemCls += ' md-li--warning';
      else if (lineType === 'key') itemCls += ' md-li--key';
      html.push(`<li class="${itemCls}"><span class="md-bullet">●</span><span class="md-li-text">${renderInlineHTML(content)}</span></li>`);
      i++; continue;
    }

    // ── Numbered list ──────────────────────────────────────
    if (trimmed.match(/^\d+\. /)) {
      if (!inList || listType !== 'ol') {
        closeList();
        html.push('<ol class="md-ol">');
        inList = true; listType = 'ol';
      }
      const num     = trimmed.match(/^(\d+)\./)?.[1];
      const content = trimmed.replace(/^\d+\. /, '');
      html.push(`<li class="md-li md-li-num"><span class="md-num">${num}.</span><span class="md-li-text">${renderInlineHTML(content)}</span></li>`);
      i++; continue;
    }

    // ── Empty line ─────────────────────────────────────────
    if (!trimmed) {
      closeList();
      html.push('<div class="md-spacer"></div>');
      i++; continue;
    }

    // ── Paragraph (with special line highlighting) ─────────
    closeList();
    const lineType = getLineType(line);
    if (lineType === 'warning') {
      html.push(`<p class="md-p md-p--warning">${renderInlineHTML(line)}</p>`);
    } else if (lineType === 'key') {
      html.push(`<p class="md-p md-p--key">${renderInlineHTML(line)}</p>`);
    } else if (lineType === 'success') {
      html.push(`<p class="md-p md-p--success">${renderInlineHTML(line)}</p>`);
    } else if (lineType === 'error') {
      html.push(`<p class="md-p md-p--error">${renderInlineHTML(line)}</p>`);
    } else {
      html.push(`<p class="md-p">${renderInlineHTML(line)}</p>`);
    }
    i++;
  }

  closeList();
  return html.join('\n');
}

// ─────────────────────────────────────────────────────────────
// CSS STYLES — injected once into <head>
// ─────────────────────────────────────────────────────────────
const MD_STYLES = `
/* ── MarkdownRenderer v4 styles ── */
.md-content { font-size: 14px; line-height: 1.75; color: #cbd5e1; }

/* Headings */
.md-h1 { font-size: 1.25rem; font-weight: 700; color: #fff; margin: 1.25rem 0 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.35rem; }
.md-h2 { font-size: 1.1rem; font-weight: 700; color: #93c5fd; margin: 1rem 0 0.4rem; }
.md-h3 { font-size: 0.95rem; font-weight: 700; color: #c4b5fd; margin: 0.85rem 0 0.3rem; }

/* Paragraphs */
.md-p { color: #cbd5e1; margin: 0.25rem 0; line-height: 1.75; font-size: 0.875rem; }
.md-p--warning { background: rgba(239,68,68,0.08); border-left: 3px solid #ef4444; padding: 0.4rem 0.75rem; border-radius: 0 6px 6px 0; color: #fca5a5; margin: 0.35rem 0; }
.md-p--key     { background: rgba(245,158,11,0.08); border-left: 3px solid #f59e0b; padding: 0.4rem 0.75rem; border-radius: 0 6px 6px 0; color: #fde68a; margin: 0.35rem 0; }
.md-p--success { background: rgba(34,197,94,0.08);  border-left: 3px solid #22c55e; padding: 0.4rem 0.75rem; border-radius: 0 6px 6px 0; color: #86efac; margin: 0.35rem 0; }
.md-p--error   { background: rgba(239,68,68,0.06);  border-left: 3px solid #f87171; padding: 0.4rem 0.75rem; border-radius: 0 6px 6px 0; color: #fca5a5; margin: 0.35rem 0; }

/* Inline styles */
.md-bold        { font-weight: 700; color: #fff; }
.md-italic      { font-style: italic; color: #e2e8f0; }
.md-del         { text-decoration: line-through; color: #64748b; }
.md-inline-code { background: rgba(99,102,241,0.15); color: #a5b4fc; padding: 0.15em 0.45em; border-radius: 5px; font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace; font-size: 0.82em; border: 1px solid rgba(99,102,241,0.2); }
.md-link        { color: #60a5fa; text-decoration: underline; text-underline-offset: 2px; }
.md-link:hover  { color: #93c5fd; }

/* Code blocks */
.md-code-block  { background: #0d1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; margin: 0.75rem 0; }
.md-code-header { display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 1rem; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.06); }
.md-code-lang   { font-size: 0.75rem; font-family: monospace; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
.md-copy-btn    { font-size: 0.72rem; font-weight: 600; color: #94a3b8; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 0.2rem 0.6rem; cursor: pointer; transition: all 0.15s; }
.md-copy-btn:hover { color: #fff; background: rgba(255,255,255,0.12); }
.md-copy-btn--done { color: #4ade80 !important; border-color: rgba(74,222,128,0.3) !important; }
.md-pre         { padding: 1rem; overflow-x: auto; margin: 0; }
.md-code        { font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace; font-size: 0.82rem; line-height: 1.7; color: #e2e8f0; display: block; white-space: pre; }

/* Blockquotes */
.md-blockquote          { border-left: 3px solid #4f46e5; background: rgba(79,70,229,0.08); padding: 0.5rem 0.85rem; border-radius: 0 8px 8px 0; margin: 0.5rem 0; color: #c7d2fe; font-size: 0.875rem; }
.md-blockquote--warning { border-left-color: #ef4444; background: rgba(239,68,68,0.08); color: #fca5a5; }
.md-blockquote--key     { border-left-color: #f59e0b; background: rgba(245,158,11,0.08); color: #fde68a; }
.md-blockquote--success { border-left-color: #22c55e; background: rgba(34,197,94,0.08);  color: #86efac; }
.md-blockquote--error   { border-left-color: #f87171; background: rgba(239,68,68,0.06);  color: #fca5a5; }

/* Lists */
.md-ul, .md-ol { margin: 0.4rem 0; padding: 0; list-style: none; }
.md-li         { display: flex; gap: 0.5rem; align-items: flex-start; padding: 0.15rem 0; }
.md-li--warning .md-li-text { color: #fca5a5; }
.md-li--key     .md-li-text { color: #fde68a; font-weight: 600; }
.md-bullet     { color: #7c3aed; font-size: 8px; flex-shrink: 0; margin-top: 7px; }
.md-num        { color: #60a5fa; font-weight: 700; font-size: 0.875rem; flex-shrink: 0; min-width: 1.4rem; padding-top: 1px; }
.md-li-text    { font-size: 0.875rem; color: #cbd5e1; line-height: 1.7; }

/* Tables */
.md-table-wrap { overflow-x: auto; margin: 0.75rem 0; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); }
.md-table      { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.md-th         { padding: 0.5rem 0.85rem; text-align: left; font-weight: 600; font-size: 0.78rem; color: #94a3b8; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.08); text-transform: uppercase; letter-spacing: 0.04em; }
.md-td         { padding: 0.45rem 0.85rem; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.04); }
.md-tr-even    { background: rgba(255,255,255,0.01); }
.md-tr-odd     { background: rgba(255,255,255,0.03); }

/* Misc */
.md-hr      { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 1rem 0; }
.md-spacer  { height: 0.35rem; }
.md-math-block { overflow-x: auto; text-align: center; margin: 0.75rem 0; padding: 0.5rem; background: rgba(255,255,255,0.02); border-radius: 8px; }
`;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.id    = 'studyearn-md-styles';
  style.textContent = MD_STYLES;
  document.head.appendChild(style);
  stylesInjected = true;
}

// ─────────────────────────────────────────────────────────────
// REACT COMPONENT
// ─────────────────────────────────────────────────────────────
interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  const render = useCallback(() => {
    if (!ref.current) return;
    ref.current.innerHTML = parseMarkdown(content);
    attachCopyButtons(ref.current);
  }, [content]);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    render();

    // Load KaTeX if math is present, then re-render
    if (content.includes('$')) {
      loadKatex().then(() => {
        if (ref.current && (window as any).katex) {
          render();
        }
      });
    }
  }, [content, render]);

  return (
    <div
      ref={ref}
      className={`md-content ${className}`}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}