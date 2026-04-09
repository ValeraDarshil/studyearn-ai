/**
 * StudyEarn AI — MarkdownRenderer v12 (Visual Brain Powered)
 * ─────────────────────────────────────────────────────────────
 * Two rendering modes:
 *
 * MODE A — Visual Brain Active (visualBrain prop present):
 *   Uses AI-generated segment classifications to render each
 *   segment with the exact right visual treatment.
 *   Brain picks UNIQUE highlights per response — not repetitive.
 *
 * MODE B — Smart Fallback (no brain / streaming):
 *   Heuristic-based rendering — detects patterns, applies styles.
 *   Still looks great, just less personalized.
 *
 * Visuals — what makes this unique:
 *   ◆ Lead sentence — brighter white, slightly larger
 *   ◆ Highlight chips — only on truly important terms
 *   ◆ Analogy — italic teal with left glow line
 *   ◆ Formula — monospace indigo card
 *   ◆ Key insight — amber glow left border
 *   ◆ Warning — red left accent
 *   ◆ Hook — orange italic "explore next"
 *   ◆ Quick Check — animated pulsing gradient border
 *   ◆ MCQ, code, KaTeX, tables — all premium
 */

import { useEffect, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────
interface VisualSegment {
  type:       'lead' | 'body' | 'key' | 'analogy' | 'formula' | 'warning' | 'hook' | 'heading';
  content:    string;
  highlights: string[];
  emoji?:     string;
}

// ─── KaTeX ───────────────────────────────────────────────────
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
function escHtml(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ─── Syntax highlighter ──────────────────────────────────────
function syntaxHL(esc: string, lang: string): string {
  const l = lang.toLowerCase();
  if (l==="python"||l==="py") return esc.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\n]*"|'[^'\n]*')/g,'<span class="syn-str">$1</span>').replace(/\b(def|class|import|from|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|try|except|finally|with|as|pass|break|continue|raise|lambda|yield|async|await|global|nonlocal|del|assert)\b/g,'<span class="syn-kw">$1</span>').replace(/\b(print|input|len|range|type|int|float|str|list|dict|set|tuple|bool|open|sum|max|min|abs|round|sorted|enumerate|zip|map|filter|super|self|cls)\b/g,'<span class="syn-bi">$1</span>').replace(/(@\w+)/g,'<span class="syn-dec">$1</span>').replace(/\b(\d+\.?\d*)\b/g,'<span class="syn-num">$1</span>').replace(/(#[^\n]*)/g,'<span class="syn-cm">$1</span>');
  if (["js","javascript","ts","typescript","jsx","tsx"].includes(l)) return esc.replace(/(`[^`]*`|"[^"\n]*"|'[^'\n]*')/g,'<span class="syn-str">$1</span>').replace(/\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|export|default|from|async|await|try|catch|finally|throw|typeof|instanceof|in|of|this|super|static|null|undefined|true|false|void|delete|yield)\b/g,'<span class="syn-kw">$1</span>').replace(/\b(console|document|window|Math|Array|Object|String|Number|Boolean|Promise|JSON|Date|Error|Map|Set|fetch|setTimeout|setInterval|parseInt|parseFloat)\b/g,'<span class="syn-bi">$1</span>').replace(/\b(\d+\.?\d*)\b/g,'<span class="syn-num">$1</span>').replace(/(\/\/[^\n]*)/g,'<span class="syn-cm">$1</span>').replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="syn-cm">$1</span>');
  if (l==="html"||l==="xml") return esc.replace(/=("[^"]*"|'[^']*')/g,'=<span class="syn-str">$1</span>').replace(/(&lt;\/?)([\w-]+)/g,'$1<span class="syn-tag">$2</span>').replace(/\s([\w-]+)=/g,' <span class="syn-attr">$1</span>=').replace(/(&lt;!--[\s\S]*?--&gt;)/g,'<span class="syn-cm">$1</span>');
  if (l==="css"||l==="scss") return esc.replace(/(:[^;{}\n]+)/g,'<span class="syn-str">$1</span>').replace(/\b(\d+\.?\d*(px|em|rem|%|vh|vw|s|ms)?)\b/g,'<span class="syn-num">$1</span>').replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="syn-cm">$1</span>');
  if (["c","cpp","c++"].includes(l)) return esc.replace(/(\".*?\"|'.*?')/g,'<span class="syn-str">$1</span>').replace(/\b(int|float|double|char|void|bool|long|short|unsigned|signed|struct|class|return|if|else|for|while|do|switch|case|break|continue|include|define|typedef|enum|const|static|extern|auto|NULL|true|false|new|delete|namespace|using|public|private|protected|virtual)\b/g,'<span class="syn-kw">$1</span>').replace(/(#\w+)/g,'<span class="syn-dec">$1</span>').replace(/\b(\d+\.?\d*[fFlL]?)\b/g,'<span class="syn-num">$1</span>').replace(/(\/\/[^\n]*)/g,'<span class="syn-cm">$1</span>').replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="syn-cm">$1</span>');
  if (l==="java") return esc.replace(/(\".*?\"|'.*?')/g,'<span class="syn-str">$1</span>').replace(/\b(public|private|protected|class|interface|extends|implements|import|package|return|if|else|for|while|do|switch|case|break|continue|new|void|static|final|abstract|try|catch|finally|throw|throws|instanceof|this|super|null|true|false|int|float|double|char|boolean|long|short|byte|String)\b/g,'<span class="syn-kw">$1</span>').replace(/\b(\d+\.?\d*[fFlL]?)\b/g,'<span class="syn-num">$1</span>').replace(/(\/\/[^\n]*)/g,'<span class="syn-cm">$1</span>').replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="syn-cm">$1</span>');
  if (l==="sql") return esc.replace(/('[^']*')/g,'<span class="syn-str">$1</span>').replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|ON|GROUP|ORDER|BY|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|AND|OR|NOT|NULL|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|LIMIT)\b/gi,'<span class="syn-kw">$1</span>').replace(/\b(\d+\.?\d*)\b/g,'<span class="syn-num">$1</span>').replace(/(--[^\n]*)/g,'<span class="syn-cm">$1</span>');
  if (["bash","sh","shell","zsh"].includes(l)) return esc.replace(/(\".*?\"|'.*?')/g,'<span class="syn-str">$1</span>').replace(/\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|echo|cd|ls|mkdir|rm|cp|mv|grep|sed|awk|cat|chmod|export|source|alias)\b/g,'<span class="syn-kw">$1</span>').replace(/(\$\{?[\w]+\}?)/g,'<span class="syn-bi">$1</span>').replace(/(#[^\n]*)/g,'<span class="syn-cm">$1</span>');
  return esc;
}

// ─── Inline base renderer (bold, italic, code, links, math) ──
function renderInline(text: string): string {
  return text
    .replace(/\$([^$\n]+?)\$/g, (_,m) => `<span class="katex-il">${renderMath(m,false)}</span>`)
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, '<mark class="chip-bold">$1</mark>')
    .replace(/\*(?!\*)(.+?)(?<!\*)\*/g, '<em class="syn-italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="syn-icode">$1</code>')
    .replace(/==(.+?)==/g, '<mark class="chip-yellow">$1</mark>')
    .replace(/~~(.+?)~~/g, '<del class="syn-del">$1</del>')
    .replace(/\*\*Quick check:\*\*/g, '<span class="qc-inline">Quick check:</span>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener" class="syn-link">$1 &#8599;</a>');
}

// Apply brain-selected highlights to rendered HTML
function applyHighlights(html: string, highlights: string[]): string {
  if (!highlights.length) return html;
  let result = html;
  for (const term of highlights) {
    if (!term || term.length < 2) continue;
    // Escape regex special chars
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match whole word or phrase, case-insensitive, NOT inside existing tags
    const re = new RegExp(`(?<![<"'])\\b(${escaped})\\b(?![^<]*>)`, 'gi');
    // Only replace first occurrence to avoid repetition
    let replaced = false;
    result = result.replace(re, (match) => {
      if (replaced) return match;
      replaced = true;
      return `<mark class="chip-hl">${match}</mark>`;
    });
  }
  return result;
}

// ─── MODE A: Brain-powered segment renderer ───────────────────
function renderBrainSegment(seg: VisualSegment): string {
  const base = renderInline(seg.content);
  const highlighted = applyHighlights(base, seg.highlights);
  const emo = seg.emoji ? `<span class="seg-emoji">${seg.emoji}</span>` : '';

  switch (seg.type) {
    case 'lead':
      return `<p class="seg seg-lead">${emo}${highlighted}</p>`;
    case 'key':
      return `<p class="seg seg-key">${emo}<span class="seg-key-text">${highlighted}</span></p>`;
    case 'analogy':
      return `<p class="seg seg-analogy">${emo}${highlighted}</p>`;
    case 'formula':
      return `<div class="seg seg-formula">${emo}<span class="seg-formula-text">${highlighted}</span></div>`;
    case 'warning':
      return `<p class="seg seg-warning">${emo}${highlighted}</p>`;
    case 'hook':
      return `<p class="seg seg-hook">${emo}${highlighted}</p>`;
    case 'heading':
      return `<h3 class="md-h3">${highlighted}</h3>`;
    default: // 'body'
      return `<p class="seg seg-body">${highlighted}</p>`;
  }
}

// ─── MODE B: Fallback heuristic classifier ────────────────────
type FallbackStyle = 'formula'|'analogy'|'key'|'warning'|'hook'|'normal';

function classifyFallback(text: string): FallbackStyle {
  const t = text.toLowerCase().trim();
  if (/[A-Z]\s*=\s*[\w\/+\-×·*]/.test(text) && text.length < 250)                       return 'formula';
  if (/think of (it|this)|just like|imagine (you|a )|real.world|for example,|consider a /i.test(t)) return 'analogy';
  if (/this means|key (point|insight)|most important|remember that|note that|the key/i.test(t))      return 'key';
  if (/be careful|don'?t (forget|confuse)|common mistake|watch out|avoid /i.test(t))                 return 'warning';
  if (/bonus curiosity|next level|if you (understood|get|got)|the next interesting/i.test(t))         return 'hook';
  return 'normal';
}

function autoEmoji(text: string, style: FallbackStyle): string {
  if (style === 'formula') return '📐';
  if (style === 'analogy') return '🌍';
  if (style === 'key')     return '🔑';
  if (style === 'warning') return '⚠️';
  if (style === 'hook')    return '🚀';
  return '';
}

function renderFallbackPara(text: string): string {
  const style = classifyFallback(text.trim());
  const emo   = autoEmoji(text, style);
  const emoHtml = emo ? `<span class="seg-emoji">${emo}</span>` : '';

  // Split into lead + rest for 'normal' paragraphs
  const sentBreak = text.match(/^([^.!?]{20,}[.!?]+)\s+(.{20,})$/s);
  let inner: string;
  if (style === 'normal' && sentBreak) {
    inner = `<span class="seg-lead-inline">${renderInline(sentBreak[1])}</span> ${renderInline(sentBreak[2])}`;
  } else {
    inner = renderInline(text);
  }

  if (style === 'formula')  return `<div class="seg seg-formula">${emoHtml}<span class="seg-formula-text">${inner}</span></div>`;
  if (style === 'analogy')  return `<p class="seg seg-analogy">${emoHtml}${inner}</p>`;
  if (style === 'key')      return `<p class="seg seg-key">${emoHtml}<span class="seg-key-text">${inner}</span></p>`;
  if (style === 'warning')  return `<p class="seg seg-warning">${emoHtml}${inner}</p>`;
  if (style === 'hook')     return `<p class="seg seg-hook">${emoHtml}${inner}</p>`;
  return `<p class="seg seg-body">${inner}</p>`;
}

// ─── Pill label for section headers ──────────────────────────
function pill(icon: string, label: string, cls: string): string {
  return `<div class="v12-pill ${cls}"><span>${icon}</span><span>${label}</span></div>`;
}

// ─── MCQ ─────────────────────────────────────────────────────
function isMcqOpt(l: string): boolean { return /^[A-D][)\.]\s+\S/i.test(l.trim()); }
function buildMcq(question: string, opts: string[]): string {
  const id = `mcq-${Math.random().toString(36).slice(2,9)}`;
  const os = opts.map(opt => {
    const letter = opt.trim()[0].toUpperCase();
    const text   = opt.trim().replace(/^[A-D][)\.\s]+/i,"").replace(/\(correct\)/i,"").trim();
    const isCor  = /\(correct\)/i.test(opt);
    return `<button class="mcq-opt" data-mcq-id="${id}" data-letter="${letter}" ${isCor?'data-correct="1"':""} onclick="window.__mcqClick&&window.__mcqClick('${id}',0,'${letter}')"><span class="mcq-letter">${letter}</span><span class="mcq-text">${escHtml(text)}</span></button>`;
  }).join("");
  return `<div class="mcq-card" id="${id}"><div class="mcq-q">${escHtml(question)}</div><div class="mcq-opts">${os}</div><div class="mcq-feedback" id="${id}-fb"></div></div>`;
}

const BULLET_RE = /^[-*+\u2022\u25CF]\s+\S/;

// ─── Fallback parser (Mode B) ─────────────────────────────────
function parseFallback(md: string): string {
  const lines = md.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");
  const out: string[] = [];
  let i=0, inUl=false, inOl=false;
  const closeUl=()=>{if(inUl){out.push("</ul>");inUl=false;}};
  const closeOl=()=>{if(inOl){out.push("</ol>");inOl=false;}};
  const closeAll=()=>{closeUl();closeOl();};
  let pq=""; let mqOpts: string[]=[];
  let buf: string[]=[];

  const flushBuf=()=>{
    if(!buf.length) return;
    const joined=buf.join(" ").trim();
    if(joined) out.push(renderFallbackPara(joined));
    buf=[];
  };
  const flushMcq=()=>{
    if(!pq) return;
    if(mqOpts.length>=2) out.push(buildMcq(pq,mqOpts));
    else out.push(`<div class="v12-qc"><div class="v12-qc-hdr"><span>💬</span><span class="v12-qc-ttl">Quick Check</span></div><p class="v12-qc-txt">${renderInline(pq)}</p></div>`);
    pq=""; mqOpts=[];
  };

  while(i<lines.length){
    const raw=lines[i]; const t=raw.trim();
    if(pq){if(isMcqOpt(t)){mqOpts.push(t);i++;continue;}if(!t&&!mqOpts.length){i++;continue;}flushMcq();}

    // Block math
    if(t.startsWith("$$")){flushBuf();closeAll();let m=t.slice(2);i++;while(i<lines.length&&!lines[i].trim().endsWith("$$")){m+="\n"+lines[i];i++;}if(i<lines.length)m+="\n"+lines[i].trim().slice(0,-2);out.push(`<div class="md-math">${renderMath(m.trim(),true)}</div>`);i++;continue;}

    // Code fence
    if(t.startsWith("```")){flushBuf();closeAll();const lang=t.slice(3).trim()||"code";const cl:string[]=[];i++;let closed=false;while(i<lines.length){if(lines[i].trim()==="```"||lines[i].trim().startsWith("```")){closed=true;i++;break;}cl.push(lines[i]);i++;}const rc=cl.join("\n");if(closed){const hl=syntaxHL(escHtml(rc),lang);out.push(`<div class="md-cb" data-cb><div class="md-cbh"><span class="md-lang">${escHtml(lang)}</span><button class="md-cpb" data-cpb>Copy</button></div><pre class="md-pre"><code class="md-code">${hl}</code></pre></div>`);}else{out.push(`<div class="md-cb md-cb-s" data-cb><div class="md-cbh"><span class="md-lang">${escHtml(lang)}</span><span class="md-s-badge">streaming…</span></div><pre class="md-pre"><code class="md-code">${escHtml(rc)}</code></pre></div>`);}continue;}

    // HR
    if(t.match(/^[-*_]{3,}$/)&&t.length<=10){flushBuf();closeAll();out.push('<hr class="md-hr">');i++;continue;}

    // Headings
    if(raw.startsWith("# ")){flushBuf();closeAll();out.push(`<h1 class="md-h1">${renderInline(raw.slice(2))}</h1>`);i++;continue;}
    if(raw.startsWith("## ")){flushBuf();closeAll();out.push(`<h2 class="md-h2">${renderInline(raw.slice(3))}</h2>`);i++;continue;}
    if(raw.startsWith("### ")){flushBuf();closeAll();out.push(`<h3 class="md-h3">${renderInline(raw.slice(4))}</h3>`);i++;continue;}

    // Section pills
    const PILLS: [RegExp, string, string, string][] = [
      [/^[📖🔷]\s*(EXPLANATION|EXPLAIN)/i,"📖","Explanation","v12-pill-explain"],
      [/^\d+\.\s*[📖]?\s*(EXPLANATION|EXPLAIN)/i,"📖","Explanation","v12-pill-explain"],
      [/^[💡🔸]\s*(EXAMPLE|EXAMPLES?)/i,"💡","Example","v12-pill-example"],
      [/^\d+\.\s*[💡]?\s*EXAMPLE/i,"💡","Example","v12-pill-example"],
      [/^[⚡🔹]\s*(QUICK\s*SUMMARY|SUMMARY)/i,"⚡","Quick Summary","v12-pill-summary"],
      [/^\d+\.\s*[⚡]?\s*(QUICK\s*SUMMARY|SUMMARY)/i,"⚡","Quick Summary","v12-pill-summary"],
      [/^[❓🔔🧠]\s*(CHECK\s*YOUR\s*UNDERSTANDING)/i,"🧠","Check","v12-pill-check"],
      [/^\d+\.\s*[❓🔔🧠]?\s*CHECK\s*(YOUR\s*)?UNDERSTANDING/i,"🧠","Check","v12-pill-check"],
      [/^(🔥\s*MICRO-LEARNING|Bonus curiosity:|Next level:)/i,"🔥","Explore Next","v12-pill-hook"],
    ];
    let hit=false;
    for(const [re,ic,lb,cl] of PILLS){if(re.test(t)&&t.length<100){flushBuf();closeAll();out.push(pill(ic,lb,cl));hit=true;break;}}
    if(hit){i++;continue;}

    // Inline signals
    if(/^(⚠️|🚨|WARNING:|CAUTION:|IMPORTANT:)/i.test(t)){flushBuf();closeAll();out.push(`<p class="seg seg-warning"><span class="seg-emoji">⚠️</span>${renderInline(t.replace(/^(⚠️|🚨|WARNING:|CAUTION:|IMPORTANT:)\s*/i,""))}</p>`);i++;continue;}
    if(/^(📌|🔑|🎯|KEY\s*(POINT|TAKEAWAY)|REMEMBER:|NOTE:)/i.test(t)){flushBuf();closeAll();out.push(`<p class="seg seg-key"><span class="seg-emoji">🔑</span><span class="seg-key-text">${renderInline(t.replace(/^(📌|🔑|🎯|KEY\s*(POINT|TAKEAWAY)|REMEMBER:|NOTE:)\s*/i,""))}</span></p>`);i++;continue;}
    if(/^(✅|🟢|CORRECT:|RIGHT:)/i.test(t)){flushBuf();closeAll();out.push(`<p class="seg seg-ok">${renderInline(t)}</p>`);i++;continue;}
    if(/^(❌|🔴|🚫|WRONG:|AVOID:)/i.test(t)){flushBuf();closeAll();out.push(`<p class="seg seg-warning">${renderInline(t)}</p>`);i++;continue;}

    // Blockquote
    if(raw.startsWith("> ")){flushBuf();closeAll();out.push(`<blockquote class="md-bq">${renderInline(raw.slice(2))}</blockquote>`);i++;continue;}

    // Table
    if(t.startsWith("|")&&t.endsWith("|")){
      flushBuf();closeAll();
      const rows:string[]=[];while(i<lines.length&&lines[i].trim().startsWith("|")){rows.push(lines[i]);i++;}
      if(rows.length>=2){const heads=rows[0].split("|").slice(1,-1).map(c=>c.trim());const body=rows.slice(2);out.push(`<div class="md-tw"><table class="md-tbl"><thead><tr>${heads.map(h=>`<th class="md-th">${renderInline(h)}</th>`).join("")}</tr></thead><tbody>${body.map((r,ri)=>{const cells=r.split("|").slice(1,-1).map(c=>c.trim());return`<tr class="${ri%2===0?"md-ta":"md-tb"}">${cells.map(c=>`<td class="md-td">${renderInline(c)}</td>`).join("")}</tr>`;}).join("")}</tbody></table></div>`);}
      continue;
    }

    // Bullet
    if(BULLET_RE.test(t)){flushBuf();closeOl();if(!inUl){out.push('<ul class="md-ul">');inUl=true;}out.push(`<li class="md-li"><span class="md-dot">◆</span><span class="md-lt">${renderInline(t.replace(/^[-*+\u2022\u25CF]\s+/,""))}</span></li>`);i++;continue;}

    // Numbered list
    if(t.match(/^\d+\.\s+\S/)){flushBuf();closeUl();if(!inOl){out.push('<ol class="md-ol">');inOl=true;}const num=t.match(/^(\d+)/)?.[1]??"1";out.push(`<li class="md-li"><span class="md-n">${num}.</span><span class="md-lt">${renderInline(t.replace(/^\d+\.\s+/,""))}</span></li>`);i++;continue;}

    // Empty line
    if(!t){flushBuf();closeAll();out.push('<div class="md-gap"></div>');i++;continue;}

    // Quick check
    if(/^\*?\*?Quick check:/i.test(t)){flushBuf();closeAll();const qText=t.replace(/^\*?\*?Quick check:\*?\*?\s*/i,"").trim();let peek=i+1;while(peek<lines.length&&!lines[peek].trim())peek++;if(peek<lines.length&&isMcqOpt(lines[peek].trim())){pq=qText;i++;continue;}out.push(`<div class="v12-qc"><div class="v12-qc-hdr"><span>💬</span><span class="v12-qc-ttl">Quick Check</span></div><p class="v12-qc-txt">${renderInline(qText)}</p></div>`);i++;continue;}

    closeAll();
    buf.push(raw);
    i++;
  }
  flushMcq();flushBuf();closeAll();
  return out.join("\n");
}

// ─── MODE A: Brain-powered renderer ──────────────────────────
// When visual brain segments are available, render them directly
// BUT also parse code blocks, quick checks, lists from content
function parseBrain(segments: VisualSegment[]): string {
  const out: string[] = [];
  for (const seg of segments) {
    // Check if segment contains code blocks — use fallback parser for those
    if (seg.content.includes('```') || seg.content.startsWith('$$')) {
      out.push(parseFallback(seg.content));
      continue;
    }
    // Quick check detection
    if (/^\*?\*?Quick check:/i.test(seg.content)) {
      out.push(parseFallback(seg.content));
      continue;
    }
    // Bullet list detection
    if (BULLET_RE.test(seg.content.trim())) {
      out.push(parseFallback(seg.content));
      continue;
    }
    out.push(renderBrainSegment(seg));
  }
  return out.join("\n");
}

// ─── Handlers ────────────────────────────────────────────────
function attachCopy(root: HTMLElement) {
  root.querySelectorAll<HTMLButtonElement>("[data-cpb]").forEach((btn) => {
    const clone=btn.cloneNode(true) as HTMLButtonElement; btn.replaceWith(clone);
    clone.addEventListener("click",()=>{
      const code=clone.closest("[data-cb]")?.querySelector("code");if(!code)return;
      const text=code.innerText;
      const done=()=>{clone.textContent="Copied!";clone.setAttribute("data-done","1");setTimeout(()=>{clone.textContent="Copy";clone.removeAttribute("data-done");},2000);};
      if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(done).catch(()=>fbCopy(text,done));}else fbCopy(text,done);
    });
  });
}
function fbCopy(text:string,done:()=>void){const ta=document.createElement("textarea");ta.value=text;ta.style.cssText="position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none";document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand("copy");done();}catch{}document.body.removeChild(ta);}
function attachMcqHandlers(_root: HTMLElement) {
  (window as any).__mcqClick = (id:string,_:number,letter:string) => {
    const card=document.getElementById(id);if(!card||card.getAttribute("data-answered"))return;
    card.setAttribute("data-answered","1");
    const btns=card.querySelectorAll<HTMLButtonElement>(".mcq-opt");const fb=document.getElementById(`${id}-fb`);let cor="";
    btns.forEach(b=>{if(b.getAttribute("data-correct")==="1")cor=b.getAttribute("data-letter")||"";});
    const ok=cor?letter===cor:true;
    btns.forEach(b=>{const bl=b.getAttribute("data-letter");b.disabled=true;if(bl===letter)b.classList.add(ok?"mcq-correct":"mcq-wrong");if(cor&&bl===cor&&!ok)b.classList.add("mcq-reveal");});
    if(fb){fb.className=`mcq-feedback mcq-fb-${ok?"ok":"err"}`;fb.innerHTML=ok?`<span>🎉</span><span>Correct!</span>`:`<span>💡</span><span>Not quite — correct answer is highlighted.</span>`;}
  };
}

// ─── CSS v12 ─────────────────────────────────────────────────
const CSS = `
.md-root{font-size:14px;line-height:1.95;color:#cbd5e1;word-break:break-word}

/* Headings */
.md-h1{font-size:1.2rem;font-weight:700;color:#fff;margin:1rem 0 .45rem;padding-bottom:.3rem;border-bottom:1px solid rgba(255,255,255,.08)}
.md-h2{font-size:1rem;font-weight:700;color:#e2e8f0;margin:.85rem 0 .3rem}
.md-h3{font-size:.9rem;font-weight:700;color:#c4b5fd;margin:.7rem 0 .25rem}

/* ── Section pills ── */
@keyframes v12in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.v12-pill{display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .8rem;border-radius:20px;font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin:.85rem 0 .2rem;animation:v12in .25s ease-out;border:1px solid;width:fit-content}
.v12-pill-explain{color:#a78bfa;border-color:rgba(167,139,250,.35);background:rgba(167,139,250,.08)}
.v12-pill-example{color:#fbbf24;border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.08)}
.v12-pill-summary{color:#60a5fa;border-color:rgba(96,165,250,.35);background:rgba(96,165,250,.08)}
.v12-pill-check{color:#4ade80;border-color:rgba(74,222,128,.35);background:rgba(74,222,128,.08)}
.v12-pill-hook{color:#fb923c;border-color:rgba(251,146,60,.35);background:rgba(251,146,60,.08)}

/* ── Segments ── */
.seg{margin:.15rem 0 .7rem;line-height:1.95;animation:v12in .3s ease-out;font-size:.875rem}

/* Lead — brighter, slightly heavier */
.seg-lead{color:#f1f5f9;font-weight:500;font-size:.9rem}
/* Lead emoji */
.seg-emoji{margin-right:.4rem;font-size:.9rem}
/* Inline lead (fallback — first sentence brighter) */
.seg-lead-inline{color:#f1f5f9;font-weight:500}

/* Body — normal text */
.seg-body{color:#cbd5e1}

/* Key insight — amber glow left border, no bg box */
.seg-key{color:#fde68a;padding-left:.9rem;border-left:3px solid rgba(245,158,11,.7)}
.seg-key-text{font-weight:500}

/* Analogy — italic teal, left glow */
.seg-analogy{color:#99f6e4;font-style:italic;padding-left:.9rem;border-left:2px solid rgba(20,184,166,.6)}

/* Formula — monospace indigo minimal card */
.seg-formula{display:flex;align-items:flex-start;gap:.5rem;font-family:'JetBrains Mono','Fira Code',monospace;font-size:.85rem;color:#a5b4fc;padding:.4rem .85rem;border-left:2px solid rgba(99,102,241,.65);background:rgba(99,102,241,.06);border-radius:0 7px 7px 0;letter-spacing:.03em;margin:.5rem 0 .8rem}
.seg-formula-text{flex:1}

/* Warning — red left accent */
.seg-warning{color:#fca5a5;padding-left:.9rem;border-left:2px solid rgba(239,68,68,.6)}

/* OK / correct */
.seg-ok{color:#86efac;padding-left:.9rem;border-left:2px solid rgba(34,197,94,.6)}

/* Hook — orange italic */
.seg-hook{color:#fed7aa;font-style:italic;padding-left:.9rem;border-left:2px solid rgba(249,115,22,.6)}

/* ── Highlight chips (brain-selected, max 1 per term) ── */
/* Bold → violet chip */
mark.chip-bold{background:rgba(139,92,246,.2);color:#c4b5fd;border-radius:4px;padding:.05em .35em;font-weight:700;border:none;font-style:normal}
/* Yellow == highlighter */
mark.chip-yellow{background:rgba(251,191,36,.22);color:#fcd34d;border-radius:4px;padding:.05em .3em;border:none}
/* Brain-selected highlights → teal underline only (not bg — subtle & smart) */
mark.chip-hl{background:transparent;color:inherit;text-decoration:underline;text-decoration-color:rgba(20,184,166,.7);text-decoration-thickness:2px;text-underline-offset:3px;font-weight:600}

/* ── Quick Check — animated gradient border ── */
.v12-qc{position:relative;margin:.8rem 0 .5rem;border-radius:12px;padding:1.5px;background:linear-gradient(135deg,#22c55e,#10b981,#4ade80,#22c55e);background-size:300% 300%;animation:qcb 4s ease infinite,v12in .4s ease-out}
@keyframes qcb{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.v12-qc-hdr{display:flex;align-items:center;gap:.45rem;padding:.7rem 1rem .3rem;background:#080e1d;border-radius:11px 11px 0 0;font-size:.9rem}
.v12-qc-ttl{font-weight:700;font-size:.7rem;letter-spacing:.09em;text-transform:uppercase;color:#4ade80}
.v12-qc-txt{color:#d1fae5;font-size:.875rem;line-height:1.9;margin:0;padding:.1rem 1rem .75rem;font-weight:500;background:#080e1d;border-radius:0 0 11px 11px}
.qc-inline{font-weight:700;color:#4ade80;font-size:.85em}

/* ── MCQ ── */
.mcq-card{border-left:3px solid rgba(99,102,241,.55);padding:.85rem .95rem;margin:.75rem 0;background:rgba(99,102,241,.04);border-radius:0 12px 12px 0;animation:v12in .35s ease-out}
.mcq-q{font-size:.875rem;font-weight:600;color:#e2e8f0;margin-bottom:.75rem;line-height:1.65}
.mcq-opts{display:flex;flex-direction:column;gap:.45rem}
.mcq-opt{display:flex;align-items:center;gap:.7rem;padding:.55rem .85rem;border-radius:8px;border:1px solid rgba(99,102,241,.22);background:rgba(99,102,241,.06);cursor:pointer;transition:all .15s;text-align:left;width:100%;color:#cbd5e1;font-size:.85rem}
.mcq-opt:hover:not(:disabled){border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.15);color:#fff;transform:translateX(3px)}
.mcq-opt:disabled{cursor:default;transform:none}
.mcq-letter{font-weight:700;font-size:.76rem;color:#818cf8;background:rgba(99,102,241,.18);border-radius:4px;padding:.12em .4em;flex-shrink:0;min-width:1.4rem;text-align:center}
.mcq-text{flex:1}
.mcq-opt.mcq-correct{border-color:rgba(34,197,94,.55)!important;background:rgba(34,197,94,.1)!important;color:#86efac!important}
.mcq-opt.mcq-correct .mcq-letter{color:#4ade80;background:rgba(34,197,94,.2)}
.mcq-opt.mcq-wrong{border-color:rgba(239,68,68,.45)!important;background:rgba(239,68,68,.08)!important;color:#fca5a5!important}
.mcq-opt.mcq-wrong .mcq-letter{color:#f87171}
.mcq-opt.mcq-reveal{border-color:rgba(34,197,94,.4)!important;background:rgba(34,197,94,.07)!important}
.mcq-feedback{display:none;align-items:center;gap:.5rem;margin-top:.65rem;padding:.55rem .8rem;border-radius:7px;font-size:.82rem;font-weight:600}
.mcq-feedback.mcq-fb-ok{display:flex;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);color:#86efac}
.mcq-feedback.mcq-fb-err{display:flex;background:rgba(245,158,11,.09);border:1px solid rgba(245,158,11,.25);color:#fde68a}

/* ── Inline ── */
.syn-italic{font-style:italic;color:#e2e8f0}
.syn-del{text-decoration:line-through;color:#4b5563}
.syn-icode{background:rgba(99,102,241,.16);color:#a5b4fc;padding:.1em .42em;border-radius:4px;font-family:'JetBrains Mono','Fira Code',monospace;font-size:.82em;border:1px solid rgba(99,102,241,.25)}
.syn-link{color:#60a5fa;text-decoration:underline;text-underline-offset:2px}
.syn-link:hover{color:#93c5fd}

/* ── Code block ── */
.md-cb{background:#0d1117;border:1px solid rgba(255,255,255,.08);border-radius:10px;overflow:hidden;margin:.75rem 0}
.md-cb-s{border-color:rgba(99,102,241,.3);animation:cbpls 1.2s ease-in-out infinite}
@keyframes cbpls{0%,100%{border-color:rgba(99,102,241,.12)}50%{border-color:rgba(99,102,241,.4)}}
.md-cbh{display:flex;align-items:center;justify-content:space-between;padding:.38rem .85rem;background:rgba(255,255,255,.03);border-bottom:1px solid rgba(255,255,255,.06)}
.md-lang{font-size:.68rem;font-family:monospace;color:#475569;text-transform:uppercase;letter-spacing:.07em;font-weight:600}
.md-s-badge{font-size:.65rem;color:#818cf8;animation:cbpls 1s ease-in-out infinite}
.md-cpb{font-size:.7rem;font-weight:600;color:#64748b;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:4px;padding:.18rem .55rem;cursor:pointer;transition:all .15s;user-select:none}
.md-cpb:hover{color:#fff;background:rgba(255,255,255,.1)}
.md-cpb[data-done]{color:#4ade80}
.md-pre{margin:0;padding:.85rem 1rem;overflow-x:auto}
.md-code{font-family:'JetBrains Mono','Fira Code','Courier New',monospace;font-size:.8rem;line-height:1.75;color:#e2e8f0;display:block;white-space:pre}
.syn-kw{color:#c792ea;font-weight:600}.syn-str{color:#c3e88d}.syn-num{color:#f78c6c}.syn-cm{color:#546e7a;font-style:italic}.syn-bi{color:#82aaff}.syn-dec{color:#ffcb6b}.syn-tag{color:#f07178}.syn-attr{color:#c792ea}

/* ── Lists ── */
.md-ul,.md-ol{margin:.3rem 0;padding:0;list-style:none}
.md-li{display:flex;gap:.6rem;align-items:flex-start;padding:.18rem 0}
.md-lt{font-size:.875rem;color:#cbd5e1;line-height:1.9;flex:1}
.md-dot{color:rgba(139,92,246,.7);font-size:.42rem;flex-shrink:0;margin-top:9px}
.md-n{color:#60a5fa;font-weight:700;font-size:.875rem;flex-shrink:0;min-width:1.8rem;padding-top:1px}

/* ── Blockquote / Table / HR / Gap / Math ── */
.md-bq{border-left:2px solid rgba(99,102,241,.4);padding:.5rem .85rem;margin:.45rem 0;color:#c7d2fe;font-size:.875rem;line-height:1.85;font-style:italic}
.md-tw{overflow-x:auto;margin:.7rem 0;border-radius:9px;border:1px solid rgba(255,255,255,.08)}
.md-tbl{width:100%;border-collapse:collapse;font-size:.84rem}
.md-th{padding:.45rem .8rem;text-align:left;font-weight:600;font-size:.72rem;color:#94a3b8;background:rgba(255,255,255,.03);border-bottom:1px solid rgba(255,255,255,.07);text-transform:uppercase;letter-spacing:.05em}
.md-td{padding:.4rem .8rem;color:#cbd5e1;border-bottom:1px solid rgba(255,255,255,.04)}
.md-ta{background:rgba(255,255,255,.01)}.md-tb{background:rgba(255,255,255,.025)}
.md-hr{border:none;border-top:1px solid rgba(255,255,255,.08);margin:.9rem 0}
.md-gap{height:.3rem}
.md-math{overflow-x:auto;text-align:center;margin:.7rem 0;padding:.55rem;background:rgba(255,255,255,.02);border-radius:8px}
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === "undefined") return;
  ["sea-md-v5","sea-md-v6","sea-md-v7","sea-md-v8","sea-md-v9","sea-md-v10","sea-md-v11","sea-md-v12"].forEach(id=>document.getElementById(id)?.remove());
  const el = document.createElement("style");
  el.id = "sea-md-v12";
  el.textContent = CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

// ─── Component ───────────────────────────────────────────────
interface Props {
  content:      string;
  className?:   string;
  visualBrain?: VisualSegment[];
}

export function MarkdownRenderer({ content, className = "", visualBrain }: Props) {
  const ref     = useRef<HTMLDivElement>(null);
  const lastRef = useRef<string>("");

  const doRender = useCallback(() => {
    if (!ref.current) return;
    // Include visualBrain in sig so re-renders when brain arrives
    const brainSig  = visualBrain ? visualBrain.length.toString() : "0";
    const sig = `${content.length}|${content.slice(-30)}|${brainSig}`;
    if (lastRef.current === sig) return;
    lastRef.current = sig;

    // Use brain if available and response is complete (not streaming)
    const html = (visualBrain && visualBrain.length > 0)
      ? parseBrain(visualBrain)
      : parseFallback(content);

    ref.current.innerHTML = html;
    attachCopy(ref.current);
    attachMcqHandlers(ref.current);
  }, [content, visualBrain]);

  useEffect(() => { injectCSS(); }, []);

  useEffect(() => {
    doRender();
    if (content.includes("$")) {
      loadKatex().then(() => { if (ref.current && (window as any).katex) doRender(); });
    }
  }, [content, visualBrain, doRender]);

  return <div ref={ref} className={`md-root ${className}`} />;
}