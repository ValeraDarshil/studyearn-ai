/**
 * StudyEarn AI — Markdown + LaTeX Renderer
 * ─────────────────────────────────────────────────────────────
 * Pure React, zero external dependencies.
 * Supports:
 *   - Headings (H1/H2/H3)
 *   - Bold (**text**), Italic (*text*), Code (`code`)
 *   - Bullet lists (- item), Numbered lists (1. item)
 *   - Code blocks (```language\ncode\n```)
 *   - Blockquotes (> text)
 *   - LaTeX math: inline $x^2$ and block $$E=mc^2$$
 *   - Horizontal rule ---
 *   - Tables (| col | col |)
 */

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// LATEX RENDERER — Uses KaTeX via CDN (loaded once)
// ─────────────────────────────────────────────────────────────
let katexLoaded = false;
let katexLoadPromise: Promise<void> | null = null;

function loadKatex(): Promise<void> {
  if (katexLoaded) return Promise.resolve();
  if (katexLoadPromise) return katexLoadPromise;

  katexLoadPromise = new Promise((resolve) => {
    // Load KaTeX CSS
    if (!document.querySelector('link[href*="katex"]')) {
      const link = document.createElement("link");
      link.rel  = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
      document.head.appendChild(link);
    }

    // Load KaTeX JS
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
    script.onload = () => { katexLoaded = true; resolve(); };
    script.onerror = () => resolve(); // Fail silently
    document.head.appendChild(script);
  });

  return katexLoadPromise;
}

/** Render LaTeX math string to HTML. Falls back to raw text on error. */
function renderMath(latex: string, displayMode = false): string {
  try {
    const katex = (window as any).katex;
    if (!katex) return latex;
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      errorColor: "#ff6b6b",
    });
  } catch {
    return latex;
  }
}

// ─────────────────────────────────────────────────────────────
// INLINE RENDERER — bold, italic, code, math, links
// ─────────────────────────────────────────────────────────────
function renderInlineHTML(text: string): string {
  return text
    // Inline math: $...$  (not $$)
    .replace(/\$([^$\n]+?)\$/g, (_, math) =>
      `<span class="katex-inline">${renderMath(math, false)}</span>`)
    // Bold+italic: ***text***
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    // Bold: **text**
    .replace(/\*\*(.+?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>")
    // Italic: *text*
    .replace(/\*(.+?)\*/g, "<em class='text-slate-200 italic'>$1</em>")
    // Code: `code`
    .replace(/`([^`]+)`/g,
      "<code class='bg-white/10 text-cyan-300 px-1.5 py-0.5 rounded text-[0.8em] font-mono'>$1</code>")
    // Strikethrough: ~~text~~
    .replace(/~~(.+?)~~/g, "<del class='text-slate-500 line-through'>$1</del>");
}

// ─────────────────────────────────────────────────────────────
// PARSE MARKDOWN → HTML STRING
// ─────────────────────────────────────────────────────────────
function parseMarkdown(text: string): string {
  const lines = text.split("\n");
  const html: string[] = [];
  let i = 0;
  let inList = false;
  let listType = "";

  const closeList = () => {
    if (inList) {
      html.push(listType === "ul" ? "</ul>" : "</ol>");
      inList = false;
      listType = "";
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // ── Block math: $$...$$ ──────────────────────────────────
    if (line.trim().startsWith("$$")) {
      closeList();
      let mathContent = line.trim().slice(2);
      i++;
      while (i < lines.length && !lines[i].trim().endsWith("$$")) {
        mathContent += "\n" + lines[i];
        i++;
      }
      if (i < lines.length) mathContent += "\n" + lines[i].trim().slice(0, -2);
      html.push(`<div class="my-4 overflow-x-auto text-center">${renderMath(mathContent.trim(), true)}</div>`);
      i++;
      continue;
    }

    // ── Code block: ```lang ─────────────────────────────────
    if (line.trim().startsWith("```")) {
      closeList();
      const lang = line.trim().slice(3).trim() || "code";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i].replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        i++;
      }
      html.push(`
        <div class="my-3 rounded-xl overflow-hidden border border-white/10">
          <div class="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
            <span class="text-xs font-mono text-slate-500">${lang}</span>
          </div>
          <pre class="p-4 overflow-x-auto text-sm"><code class="font-mono text-cyan-300 leading-relaxed">${codeLines.join("\n")}</code></pre>
        </div>`);
      i++;
      continue;
    }

    // ── Horizontal rule ─────────────────────────────────────
    if (line.trim().match(/^[-*_]{3,}$/) && line.trim().length <= 10) {
      closeList();
      html.push('<hr class="my-4 border-white/10" />');
      i++;
      continue;
    }

    // ── Headings ────────────────────────────────────────────
    if (line.startsWith("### ")) {
      closeList();
      html.push(`<h3 class="text-base font-bold text-purple-300 mt-5 mb-2">${renderInlineHTML(line.slice(4))}</h3>`);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2 class="text-lg font-bold text-blue-300 mt-6 mb-2">${renderInlineHTML(line.slice(3))}</h2>`);
      i++; continue;
    }
    if (line.startsWith("# ")) {
      closeList();
      html.push(`<h1 class="text-xl font-bold text-white mt-6 mb-3">${renderInlineHTML(line.slice(2))}</h1>`);
      i++; continue;
    }

    // ── Blockquote ──────────────────────────────────────────
    if (line.startsWith("> ")) {
      closeList();
      html.push(`<blockquote class="border-l-2 border-blue-500/50 pl-4 my-2 text-slate-400 italic text-sm">${renderInlineHTML(line.slice(2))}</blockquote>`);
      i++; continue;
    }

    // ── Table (simple) ──────────────────────────────────────
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      closeList();
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const headerCells = tableLines[0].split("|").filter(c => c.trim());
        const bodyRows = tableLines.slice(2); // skip separator row
        html.push(`
          <div class="my-4 overflow-x-auto rounded-xl border border-white/10">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-white/5 border-b border-white/10">
                  ${headerCells.map(c => `<th class="px-4 py-2 text-left text-xs font-semibold text-slate-300">${renderInlineHTML(c.trim())}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${bodyRows.map((row, ri) => {
                  const cells = row.split("|").filter(c => c.trim());
                  return `<tr class="${ri % 2 === 0 ? "bg-white/[0.01]" : "bg-white/[0.03]"} border-b border-white/5">
                    ${cells.map(c => `<td class="px-4 py-2 text-slate-300">${renderInlineHTML(c.trim())}</td>`).join("")}
                  </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>`);
      }
      continue;
    }

    // ── Bullet list ─────────────────────────────────────────
    if (line.match(/^[\-\*\+] /)) {
      if (!inList || listType !== "ul") {
        closeList();
        html.push('<ul class="my-2 space-y-1">');
        inList = true; listType = "ul";
      }
      html.push(`<li class="flex gap-2 ml-1">
        <span class="text-purple-400 mt-1.5 flex-shrink-0 text-[8px]">●</span>
        <span class="text-sm text-slate-300 leading-relaxed">${renderInlineHTML(line.replace(/^[\-\*\+] /, ""))}</span>
      </li>`);
      i++; continue;
    }

    // ── Numbered list ───────────────────────────────────────
    if (line.match(/^\d+\. /)) {
      if (!inList || listType !== "ol") {
        closeList();
        html.push('<ol class="my-2 space-y-1">');
        inList = true; listType = "ol";
      }
      const num = line.match(/^(\d+)\./)?.[1];
      html.push(`<li class="flex gap-2 ml-1">
        <span class="text-blue-400 font-bold text-sm flex-shrink-0 min-w-[18px] pt-0.5">${num}.</span>
        <span class="text-sm text-slate-300 leading-relaxed">${renderInlineHTML(line.replace(/^\d+\. /, ""))}</span>
      </li>`);
      i++; continue;
    }

    // ── Empty line ──────────────────────────────────────────
    if (!line.trim()) {
      closeList();
      html.push('<div class="h-2"></div>');
      i++; continue;
    }

    // ── Paragraph ───────────────────────────────────────────
    closeList();
    html.push(`<p class="text-sm text-slate-300 leading-relaxed my-1">${renderInlineHTML(line)}</p>`);
    i++;
  }

  closeList();
  return html.join("\n");
}

// ─────────────────────────────────────────────────────────────
// REACT COMPONENT
// ─────────────────────────────────────────────────────────────
interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load KaTeX then re-render if math was detected
    if (content.includes("$")) {
      loadKatex().then(() => {
        if (ref.current && (window as any).katex) {
          ref.current.innerHTML = parseMarkdown(content);
        }
      });
    }
  }, [content]);

  return (
    <div
      ref={ref}
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}