/**
 * StudyEarn AI — MarkdownRenderer v8 (AskAI Ultra-Rich Edition)
 * ─────────────────────────────────────────────────────────────
 * ROUTE: src/components/MarkdownRenderer.tsx
 *
 * What's new in v8:
 *  ✅ AskAI Section Headers auto-detected & rendered as rich cards:
 *       📖 EXPLANATION → purple gradient card
 *       💡 EXAMPLE     → amber/gold card
 *       ⚡ QUICK SUMMARY → blue card
 *       ❓ CHECK YOUR UNDERSTANDING → green card
 *       **Quick check:** → special highlighted callout
 *  ✅ Warning/Important lines → red left-border highlight
 *  ✅ Key/Note/Remember lines → yellow/amber left-border
 *  ✅ Success/Correct lines   → green left-border
 *  ✅ Emoji-rich bullet points with color-matched dots
 *  ✅ Bold text = bright white, not just slightly brighter
 *  ✅ Inline highlights: ==text== → yellow highlight
 *  ✅ All existing features preserved (KaTeX, syntax HL, tables, etc.)
 */

import { useEffect, useRef, useCallback } from "react";

// ─── KaTeX loader ────────────────────────────────────────────
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
    if (!k) return escHtml(latex);
    return k.renderToString(latex, { displayMode: display, throwOnError: false, errorColor: "#f87171" });
  } catch { return escHtml(latex); }
}

// ─── HTML escape ─────────────────────────────────────────────
function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Syntax highlighter ──────────────────────────────────────
function syntaxHL(esc: string, lang: string): string {
  const l = lang.toLowerCase();
  if (l === "python" || l === "py") {
    return esc
      .replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\n]*"|'[^'\n]*')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(def|class|import|from|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|try|except|finally|with|as|pass|break|continue|raise|lambda|yield|async|await|global|nonlocal|del|assert)\b/g, '<span class="syn-kw">$1</span>')
      .replace(/\b(print|input|len|range|type|int|float|str|list|dict|set|tuple|bool|open|sum|max|min|abs|round|sorted|enumerate|zip|map|filter|super|self|cls)\b/g, '<span class="syn-bi">$1</span>')
      .replace(/(@\w+)/g, '<span class="syn-dec">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(#[^\n]*)/g, '<span class="syn-cm">$1</span>');
  }
  if (["js","javascript","ts","typescript","jsx","tsx"].includes(l)) {
    return esc
      .replace(/(`[^`]*`|"[^"\n]*"|'[^'\n]*')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|export|default|from|async|await|try|catch|finally|throw|typeof|instanceof|in|of|this|super|static|null|undefined|true|false|void|delete|yield)\b/g, '<span class="syn-kw">$1</span>')
      .replace(/\b(console|document|window|Math|Array|Object|String|Number|Boolean|Promise|JSON|Date|Error|Map|Set|fetch|setTimeout|setInterval|parseInt|parseFloat)\b/g, '<span class="syn-bi">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(\/\/[^\n]*)/g, '<span class="syn-cm">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syn-cm">$1</span>');
  }
  if (l === "html" || l === "xml") {
    return esc
      .replace(/=("[^"]*"|'[^']*')/g, '=<span class="syn-str">$1</span>')
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="syn-tag">$2</span>')
      .replace(/\s([\w-]+)=/g, ' <span class="syn-attr">$1</span>=')
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="syn-cm">$1</span>');
  }
  if (l === "css" || l === "scss") {
    return esc
      .replace(/(:[^;{}\n]+)/g, '<span class="syn-str">$1</span>')
      .replace(/\b(\d+\.?\d*(px|em|rem|%|vh|vw|s|ms)?)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syn-cm">$1</span>');
  }
  if (["c","cpp","c++"].includes(l)) {
    return esc
      .replace(/(\".*?\"|'.*?')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(int|float|double|char|void|bool|long|short|unsigned|signed|struct|class|return|if|else|for|while|do|switch|case|break|continue|include|define|typedef|enum|const|static|extern|auto|NULL|true|false|new|delete|namespace|using|public|private|protected|virtual)\b/g, '<span class="syn-kw">$1</span>')
      .replace(/(#\w+)/g, '<span class="syn-dec">$1</span>')
      .replace(/\b(\d+\.?\d*[fFlL]?)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(\/\/[^\n]*)/g, '<span class="syn-cm">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syn-cm">$1</span>');
  }
  if (l === "java") {
    return esc
      .replace(/(\".*?\"|'.*?')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(public|private|protected|class|interface|extends|implements|import|package|return|if|else|for|while|do|switch|case|break|continue|new|void|static|final|abstract|try|catch|finally|throw|throws|instanceof|this|super|null|true|false|int|float|double|char|boolean|long|short|byte|String)\b/g, '<span class="syn-kw">$1</span>')
      .replace(/\b(\d+\.?\d*[fFlL]?)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(\/\/[^\n]*)/g, '<span class="syn-cm">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syn-cm">$1</span>');
  }
  if (l === "sql") {
    return esc
      .replace(/('[^']*')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|ORDER|BY|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|AND|OR|IN|LIKE|BETWEEN|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|LIMIT|OFFSET|UNION|ALL|EXISTS|CASE|WHEN|THEN|ELSE|END)\b/gi, '<span class="syn-kw">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-num">$1</span>')
      .replace(/(--[^\n]*)/g, '<span class="syn-cm">$1</span>');
  }
  if (["bash","sh","shell","zsh"].includes(l)) {
    return esc
      .replace(/(\".*?\"|'.*?')/g, '<span class="syn-str">$1</span>')
      .replace(/\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|echo|cd|ls|mkdir|rm|cp|mv|grep|sed|awk|cat|chmod|chown|export|source|alias)\b/g, '<span class="syn-kw">$1</span>')
      .replace(/(\$\{?[\w]+\}?)/g, '<span class="syn-bi">$1</span>')
      .replace(/(#[^\n]*)/g, '<span class="syn-cm">$1</span>');
  }
  return esc;
}

// ─── AskAI Section Header Detector ───────────────────────────
// Detects the 4-part response structure from backend v8
type SectionType = "explanation"|"example"|"summary"|"check"|"warning"|"key"|"success"|"error"|"normal";

function detectSection(t: string): SectionType {
  const upper = t.toUpperCase();
  // AskAI v8 mandatory sections
  if (/^[📖🔷]\s*(EXPLANATION|EXPLAIN)/.test(t))   return "explanation";
  if (/^[💡🔸]\s*(EXAMPLE|EXAMPLES?)/.test(t))     return "example";
  if (/^[⚡🔹]\s*(QUICK\s*SUMMARY|SUMMARY)/.test(t)) return "summary";
  if (/^[❓🔔]\s*(CHECK\s*YOUR\s*UNDERSTANDING|CHECK\s*UNDERSTANDING)/.test(t)) return "check";
  // Numbered sections like "1. 📖 EXPLANATION"
  if (/^\d+\.\s*[📖🔷]?\s*(EXPLANATION|EXPLAIN)/i.test(t)) return "explanation";
  if (/^\d+\.\s*[💡🔸]?\s*(EXAMPLE|EXAMPLES?)/i.test(t))   return "example";
  if (/^\d+\.\s*[⚡🔹]?\s*(QUICK\s*SUMMARY|SUMMARY)/i.test(t)) return "summary";
  if (/^\d+\.\s*[❓🔔]?\s*(CHECK\s*(YOUR\s*)?UNDERSTANDING)/i.test(t)) return "check";
  // Warning / error / success / key signals
  if (/^(⚠️|🚨|WARNING:|CAUTION:|NOTE:|IMPORTANT:)/i.test(t)) return "warning";
  if (/^(📌|💡|🔑|🎯|🚀|KEY\s*(POINT|TAKEAWAY|CONCEPT)|REMEMBER:|NOTE:)/i.test(t)) return "key";
  if (/^(✅|🟢|CORRECT:|RIGHT:|PERFECT:|EXCELLENT:)/i.test(t)) return "success";
  if (/^(❌|🔴|🚫|WRONG:|INCORRECT:|AVOID:|DON'?T:)/i.test(t)) return "error";
  return "normal";
}

// ─── Inline renderer ─────────────────────────────────────────
function renderInline(text: string): string {
  return text
    // KaTeX inline math
    .replace(/\$([^$\n]+?)\$/g, (_, m) => `<span class="katex-il">${renderMath(m, false)}</span>`)
    // Bold+italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    // Bold → bright white
    .replace(/\*\*(.+?)\*\*/g, '<strong class="syn-bold">$1</strong>')
    // Italic
    .replace(/\*(?!\*)(.+?)(?<!\*)\*/g, '<em class="syn-italic">$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="syn-icode">$1</code>')
    // Highlight ==text== → yellow
    .replace(/==(.+?)==/g, '<mark class="syn-hl">$1</mark>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del class="syn-del">$1</del>')
    // **Quick check:** special callout
    .replace(/\*\*Quick check:\*\*/g, '<span class="qc-label">💬 Quick check:</span>')
    // Links
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener" class="syn-link">$1 &#8599;</a>');
}

// ─── Bullet regex ─────────────────────────────────────────────
const BULLET_RE = /^[-*+\u2022\u25CF]\s+\S/;

// ─── Parser ──────────────────────────────────────────────────
function parse(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0, inUl = false, inOl = false;

  const closeUl = () => { if (inUl) { out.push("</ul>"); inUl = false; } };
  const closeOl = () => { if (inOl) { out.push("</ol>"); inOl = false; } };
  const closeLists = () => { closeUl(); closeOl(); };

  while (i < lines.length) {
    const raw = lines[i];
    const t   = raw.trim();

    // ── Block math ───────────────────────────────────────────
    if (t.startsWith("$$")) {
      closeLists();
      let math = t.slice(2); i++;
      while (i < lines.length && !lines[i].trim().endsWith("$$")) { math += "\n" + lines[i]; i++; }
      if (i < lines.length) math += "\n" + lines[i].trim().slice(0, -2);
      out.push(`<div class="md-math">${renderMath(math.trim(), true)}</div>`);
      i++; continue;
    }

    // ── Code fence ───────────────────────────────────────────
    if (t.startsWith("```")) {
      closeLists();
      const lang = t.slice(3).trim() || "code";
      const codeLines: string[] = [];
      i++;
      let closed = false;
      while (i < lines.length) {
        if (lines[i].trim() === "```" || lines[i].trim().startsWith("```")) { closed = true; i++; break; }
        codeLines.push(lines[i]);
        i++;
      }
      const rawCode = codeLines.join("\n");
      if (closed) {
        const hl = syntaxHL(escHtml(rawCode), lang);
        out.push(
          `<div class="md-cb" data-cb>` +
          `<div class="md-cbh"><span class="md-lang">${escHtml(lang)}</span>` +
          `<button class="md-cpb" data-cpb>Copy</button></div>` +
          `<pre class="md-pre"><code class="md-code">${hl}</code></pre></div>`
        );
      } else {
        out.push(
          `<div class="md-cb md-cb-s" data-cb>` +
          `<div class="md-cbh"><span class="md-lang">${escHtml(lang)}</span>` +
          `<span class="md-s-badge">streaming…</span></div>` +
          `<pre class="md-pre"><code class="md-code">${escHtml(rawCode)}</code></pre></div>`
        );
      }
      continue;
    }

    // ── HR ───────────────────────────────────────────────────
    if (t.match(/^[-*_]{3,}$/) && t.length <= 10) {
      closeLists();
      out.push('<hr class="md-hr">');
      i++; continue;
    }

    // ── Headings ─────────────────────────────────────────────
    if (raw.startsWith("# "))   { closeLists(); out.push(`<h1 class="md-h1">${renderInline(raw.slice(2))}</h1>`); i++; continue; }
    if (raw.startsWith("## "))  { closeLists(); out.push(`<h2 class="md-h2">${renderInline(raw.slice(3))}</h2>`); i++; continue; }
    if (raw.startsWith("### ")) { closeLists(); out.push(`<h3 class="md-h3">${renderInline(raw.slice(4))}</h3>`); i++; continue; }

    // ── AskAI Section Header Detection ───────────────────────
    // Detects: "📖 EXPLANATION", "1. 📖 EXPLANATION", "💡 EXAMPLE" etc.
    const sec = detectSection(t);
    if (sec !== "normal" && t.length < 80) {
      closeLists();
      if (sec === "explanation") {
        out.push(`<div class="ai-sec ai-sec-exp"><span class="ai-sec-icon">📖</span><span class="ai-sec-label">Explanation</span></div>`);
        i++; continue;
      }
      if (sec === "example") {
        out.push(`<div class="ai-sec ai-sec-ex"><span class="ai-sec-icon">💡</span><span class="ai-sec-label">Example</span></div>`);
        i++; continue;
      }
      if (sec === "summary") {
        out.push(`<div class="ai-sec ai-sec-sum"><span class="ai-sec-icon">⚡</span><span class="ai-sec-label">Quick Summary</span></div>`);
        i++; continue;
      }
      if (sec === "check") {
        out.push(`<div class="ai-sec ai-sec-chk"><span class="ai-sec-icon">❓</span><span class="ai-sec-label">Check Your Understanding</span></div>`);
        i++; continue;
      }
    }

    // ── Blockquote ───────────────────────────────────────────
    if (raw.startsWith("> ")) {
      closeLists();
      const ct = raw.slice(2);
      const bsec = detectSection(ct);
      const mod = bsec==="warning"?" md-bq-w":bsec==="key"?" md-bq-k":bsec==="success"?" md-bq-s":bsec==="error"?" md-bq-e":"";
      out.push(`<blockquote class="md-bq${mod}">${renderInline(ct)}</blockquote>`);
      i++; continue;
    }

    // ── Table ────────────────────────────────────────────────
    if (t.startsWith("|") && t.endsWith("|")) {
      closeLists();
      const rows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(lines[i]); i++; }
      if (rows.length >= 2) {
        const heads = rows[0].split("|").slice(1,-1).map(c=>c.trim());
        const body  = rows.slice(2);
        out.push(
          `<div class="md-tw"><table class="md-tbl"><thead><tr>` +
          heads.map(h=>`<th class="md-th">${renderInline(h)}</th>`).join("") +
          `</tr></thead><tbody>` +
          body.map((r,ri)=>{
            const cells=r.split("|").slice(1,-1).map(c=>c.trim());
            return `<tr class="${ri%2===0?"md-ta":"md-tb"}">${cells.map(c=>`<td class="md-td">${renderInline(c)}</td>`).join("")}</tr>`;
          }).join("") +
          `</tbody></table></div>`
        );
      }
      continue;
    }

    // ── Bullet list ──────────────────────────────────────────
    if (BULLET_RE.test(t)) {
      closeOl();
      if (!inUl) { out.push('<ul class="md-ul">'); inUl = true; }
      const ct   = t.replace(/^[-*+\u2022\u25CF]\s+/, "");
      const bsec = detectSection(ct);
      const dc   = bsec==="warning"?"md-dw":bsec==="key"?"md-dk":bsec==="success"?"md-ds":bsec==="error"?"md-de":"md-d";
      out.push(`<li class="md-li"><span class="${dc}">●</span><span class="md-lt">${renderInline(ct)}</span></li>`);
      i++; continue;
    }

    // ── Numbered list ────────────────────────────────────────
    if (t.match(/^\d+\.\s+\S/)) {
      // Skip if it's an AskAI section header like "1. 📖 EXPLANATION"
      const numSec = detectSection(t.replace(/^\d+\.\s+/, ""));
      if (numSec !== "normal") {
        closeLists();
        const content = t.replace(/^\d+\.\s+/, "");
        const secType = numSec;
        if (secType === "explanation") {
          out.push(`<div class="ai-sec ai-sec-exp"><span class="ai-sec-icon">📖</span><span class="ai-sec-label">Explanation</span></div>`);
        } else if (secType === "example") {
          out.push(`<div class="ai-sec ai-sec-ex"><span class="ai-sec-icon">💡</span><span class="ai-sec-label">Example</span></div>`);
        } else if (secType === "summary") {
          out.push(`<div class="ai-sec ai-sec-sum"><span class="ai-sec-icon">⚡</span><span class="ai-sec-label">Quick Summary</span></div>`);
        } else if (secType === "check") {
          out.push(`<div class="ai-sec ai-sec-chk"><span class="ai-sec-icon">❓</span><span class="ai-sec-label">Check Your Understanding</span></div>`);
        }
        i++; continue;
      }

      closeUl();
      if (!inOl) { out.push('<ol class="md-ol">'); inOl = true; }
      const num = t.match(/^(\d+)/)?.[1] ?? "1";
      const ct  = t.replace(/^\d+\.\s+/, "");
      out.push(`<li class="md-li"><span class="md-n">${num}.</span><span class="md-lt">${renderInline(ct)}</span></li>`);
      i++; continue;
    }

    // ── Empty line ───────────────────────────────────────────
    if (!t) { closeLists(); out.push('<div class="md-gap"></div>'); i++; continue; }

    // ── Special: "Quick check:" line ─────────────────────────
    if (/^\*?\*?Quick check:/i.test(t)) {
      closeLists();
      const rest = t.replace(/^\*?\*?Quick check:\*?\*?\s*/i, "");
      out.push(
        `<div class="qc-box">` +
        `<div class="qc-header"><span class="qc-icon">💬</span><span class="qc-title">Quick Check</span></div>` +
        `<p class="qc-text">${renderInline(rest)}</p>` +
        `</div>`
      );
      i++; continue;
    }

    // ── Paragraph with semantic coloring ─────────────────────
    closeLists();
    const psec = detectSection(t);
    const pmod = psec==="warning"?" md-pw":psec==="key"?" md-pk":psec==="success"?" md-ps":psec==="error"?" md-pe":"";
    out.push(`<p class="md-p${pmod}">${renderInline(raw)}</p>`);
    i++;
  }

  closeLists();
  return out.join("\n");
}

// ─── Copy buttons ────────────────────────────────────────────
function attachCopy(root: HTMLElement) {
  root.querySelectorAll<HTMLButtonElement>("[data-cpb]").forEach((btn) => {
    const clone = btn.cloneNode(true) as HTMLButtonElement;
    btn.replaceWith(clone);
    clone.addEventListener("click", () => {
      const code = clone.closest("[data-cb]")?.querySelector("code");
      if (!code) return;
      const text = code.innerText;
      const done = () => {
        clone.textContent = "Copied!";
        clone.setAttribute("data-done","1");
        setTimeout(() => { clone.textContent = "Copy"; clone.removeAttribute("data-done"); }, 2000);
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fbCopy(text, done));
      } else { fbCopy(text, done); }
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

// ─── CSS ─────────────────────────────────────────────────────
const CSS = `
.md-root{font-size:14px;line-height:1.85;color:#cbd5e1;word-break:break-word}

/* ── Headings ── */
.md-h1{font-size:1.25rem;font-weight:700;color:#fff;margin:1.2rem 0 .5rem;padding:.5rem .9rem;background:linear-gradient(90deg,rgba(124,58,237,.18),transparent);border-left:4px solid #7c3aed;border-radius:0 8px 8px 0;line-height:1.4}
.md-h2{font-size:1.05rem;font-weight:700;color:#93c5fd;margin:.9rem 0 .4rem;padding:.4rem .75rem;background:linear-gradient(90deg,rgba(59,130,246,.12),transparent);border-left:3px solid #3b82f6;border-radius:0 6px 6px 0;line-height:1.4}
.md-h3{font-size:.95rem;font-weight:700;color:#c4b5fd;margin:.75rem 0 .3rem;padding:.35rem .65rem;border-left:3px solid #8b5cf6;line-height:1.4}

/* ── AskAI Section Cards ── */
.ai-sec{display:flex;align-items:center;gap:.6rem;margin:1rem 0 .35rem;padding:.55rem 1rem;border-radius:10px;font-weight:700;font-size:.82rem;letter-spacing:.04em;text-transform:uppercase}
.ai-sec-icon{font-size:1rem;line-height:1}
.ai-sec-label{letter-spacing:.06em}
.ai-sec-exp{background:linear-gradient(90deg,rgba(124,58,237,.22),rgba(124,58,237,.06));border:1px solid rgba(124,58,237,.35);color:#c4b5fd}
.ai-sec-ex{background:linear-gradient(90deg,rgba(245,158,11,.2),rgba(245,158,11,.05));border:1px solid rgba(245,158,11,.35);color:#fde68a}
.ai-sec-sum{background:linear-gradient(90deg,rgba(59,130,246,.2),rgba(59,130,246,.05));border:1px solid rgba(59,130,246,.35);color:#93c5fd}
.ai-sec-chk{background:linear-gradient(90deg,rgba(34,197,94,.18),rgba(34,197,94,.04));border:1px solid rgba(34,197,94,.35);color:#86efac}

/* ── Quick Check Box ── */
.qc-box{background:linear-gradient(135deg,rgba(34,197,94,.1),rgba(16,185,129,.06));border:1px solid rgba(34,197,94,.3);border-radius:12px;padding:.85rem 1.1rem;margin:.75rem 0}
.qc-header{display:flex;align-items:center;gap:.5rem;margin-bottom:.45rem}
.qc-icon{font-size:1.05rem}
.qc-title{font-weight:700;font-size:.78rem;letter-spacing:.07em;text-transform:uppercase;color:#4ade80}
.qc-text{color:#d1fae5;font-size:.875rem;line-height:1.8;margin:0;font-weight:500}
.qc-label{display:inline-flex;align-items:center;gap:.35rem;font-weight:700;color:#4ade80;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.25);border-radius:6px;padding:.1em .5em;font-size:.82em}

/* ── Paragraph base + semantic variants ── */
.md-p{font-size:.875rem;color:#cbd5e1;margin:.25rem 0;line-height:1.85}
.md-p.md-pw{background:rgba(239,68,68,.09);border-left:3px solid #ef4444;padding:.45rem .85rem;border-radius:0 8px 8px 0;color:#fca5a5;margin:.4rem 0}
.md-p.md-pk{background:rgba(245,158,11,.09);border-left:3px solid #f59e0b;padding:.45rem .85rem;border-radius:0 8px 8px 0;color:#fde68a;margin:.4rem 0;font-weight:600}
.md-p.md-ps{background:rgba(34,197,94,.09);border-left:3px solid #22c55e;padding:.45rem .85rem;border-radius:0 8px 8px 0;color:#86efac;margin:.4rem 0}
.md-p.md-pe{background:rgba(239,68,68,.08);border-left:3px solid #f87171;padding:.45rem .85rem;border-radius:0 8px 8px 0;color:#fca5a5;margin:.4rem 0}

/* ── Inline styles ── */
.syn-bold{font-weight:700;color:#fff}
.syn-italic{font-style:italic;color:#e2e8f0}
.syn-del{text-decoration:line-through;color:#4b5563}
.syn-hl{background:rgba(251,191,36,.25);color:#fcd34d;border-radius:3px;padding:.05em .25em}
.syn-icode{background:rgba(99,102,241,.18);color:#a5b4fc;padding:.1em .45em;border-radius:5px;font-family:'JetBrains Mono','Fira Code',monospace;font-size:.82em;border:1px solid rgba(99,102,241,.28)}
.syn-link{color:#60a5fa;text-decoration:underline;text-underline-offset:2px}
.syn-link:hover{color:#93c5fd}

/* ── Code blocks ── */
.md-cb{background:#0d1117;border:1px solid rgba(255,255,255,.09);border-radius:10px;overflow:hidden;margin:.8rem 0}
.md-cb-s{border-color:rgba(99,102,241,.3);animation:mdpulse 1.2s ease-in-out infinite}
@keyframes mdpulse{0%,100%{border-color:rgba(99,102,241,.15)}50%{border-color:rgba(99,102,241,.45)}}
.md-cbh{display:flex;align-items:center;justify-content:space-between;padding:.38rem .9rem;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.07)}
.md-lang{font-size:.7rem;font-family:monospace;color:#475569;text-transform:uppercase;letter-spacing:.07em;font-weight:600}
.md-s-badge{font-size:.65rem;color:#818cf8;letter-spacing:.04em;animation:mdpulse 1s ease-in-out infinite}
.md-cpb{font-size:.72rem;font-weight:600;color:#64748b;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:.2rem .6rem;cursor:pointer;transition:all .15s;user-select:none;line-height:1.5}
.md-cpb:hover{color:#fff;background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.2)}
.md-cpb[data-done]{color:#4ade80;border-color:rgba(74,222,128,.35)}
.md-pre{margin:0;padding:.9rem 1rem;overflow-x:auto}
.md-code{font-family:'JetBrains Mono','Fira Code','Courier New',monospace;font-size:.8rem;line-height:1.75;color:#e2e8f0;display:block;white-space:pre}

/* ── Syntax colors ── */
.syn-kw{color:#c792ea;font-weight:600}
.syn-str{color:#c3e88d}
.syn-num{color:#f78c6c}
.syn-cm{color:#546e7a;font-style:italic}
.syn-bi{color:#82aaff}
.syn-dec{color:#ffcb6b}
.syn-tag{color:#f07178}
.syn-attr{color:#c792ea}

/* ── Blockquote ── */
.md-bq{border-left:3px solid #4f46e5;background:rgba(79,70,229,.09);padding:.55rem .9rem;border-radius:0 8px 8px 0;margin:.5rem 0;color:#c7d2fe;font-size:.875rem;line-height:1.75}
.md-bq-w{border-left-color:#ef4444;background:rgba(239,68,68,.09);color:#fca5a5}
.md-bq-k{border-left-color:#f59e0b;background:rgba(245,158,11,.09);color:#fde68a;font-weight:600}
.md-bq-s{border-left-color:#22c55e;background:rgba(34,197,94,.09);color:#86efac}
.md-bq-e{border-left-color:#f87171;background:rgba(239,68,68,.08);color:#fca5a5}

/* ── Lists ── */
.md-ul,.md-ol{margin:.4rem 0 .4rem .1rem;padding:0;list-style:none}
.md-li{display:flex;gap:.65rem;align-items:flex-start;padding:.2rem 0}
.md-lt{font-size:.875rem;color:#cbd5e1;line-height:1.8;flex:1;min-width:0}
.md-d{color:#7c3aed;font-size:.5rem;flex-shrink:0;margin-top:7px}
.md-dw{color:#ef4444;font-size:.5rem;flex-shrink:0;margin-top:7px}
.md-dk{color:#f59e0b;font-size:.5rem;flex-shrink:0;margin-top:7px}
.md-ds{color:#22c55e;font-size:.5rem;flex-shrink:0;margin-top:7px}
.md-de{color:#f87171;font-size:.5rem;flex-shrink:0;margin-top:7px}
.md-n{color:#60a5fa;font-weight:700;font-size:.875rem;flex-shrink:0;min-width:1.9rem;padding-top:1px}

/* ── Table ── */
.md-tw{overflow-x:auto;margin:.75rem 0;border-radius:10px;border:1px solid rgba(255,255,255,.09)}
.md-tbl{width:100%;border-collapse:collapse;font-size:.85rem}
.md-th{padding:.48rem .85rem;text-align:left;font-weight:600;font-size:.75rem;color:#94a3b8;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.08);text-transform:uppercase;letter-spacing:.05em}
.md-td{padding:.42rem .85rem;color:#cbd5e1;border-bottom:1px solid rgba(255,255,255,.04)}
.md-ta{background:rgba(255,255,255,.01)}
.md-tb{background:rgba(255,255,255,.033)}

/* ── Misc ── */
.md-hr{border:none;border-top:1px solid rgba(255,255,255,.09);margin:1rem 0}
.md-gap{height:.4rem}
.md-math{overflow-x:auto;text-align:center;margin:.75rem 0;padding:.6rem;background:rgba(255,255,255,.02);border-radius:8px}
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === "undefined") return;
  // Remove old versions
  ["sea-md-v5","sea-md-v6","sea-md-v7","sea-md-v8"].forEach(id => document.getElementById(id)?.remove());
  const el = document.createElement("style");
  el.id = "sea-md-v8";
  el.textContent = CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

// ─── Component ───────────────────────────────────────────────
interface Props { content: string; className?: string; }

export function MarkdownRenderer({ content, className = "" }: Props) {
  const ref     = useRef<HTMLDivElement>(null);
  const lastRef = useRef<string>("");

  const doRender = useCallback(() => {
    if (!ref.current) return;
    const sig = `${content.length}|${content.slice(-30)}`;
    if (lastRef.current === sig) return;
    lastRef.current = sig;
    ref.current.innerHTML = parse(content);
    attachCopy(ref.current);
  }, [content]);

  useEffect(() => { injectCSS(); }, []);

  useEffect(() => {
    doRender();
    if (content.includes("$")) {
      loadKatex().then(() => { if (ref.current && (window as any).katex) doRender(); });
    }
  }, [content, doRender]);

  return <div ref={ref} className={`md-root ${className}`} />;
}