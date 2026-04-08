/**
 * StudyEarn AI — MarkdownRenderer v11 (Premium Notes Style)
 * ─────────────────────────────────────────────────────────────
 * ROUTE: src/components/MarkdownRenderer.tsx
 *
 * v11 — Premium Visual Redesign:
 *  ✅ NO more color background boxes for sections
 *  ✅ Notes-style: key sentences get a subtle left accent line
 *  ✅ Bold terms auto-highlighted with soft color underline
 *  ✅ Section labels = tiny elegant pills (not full-width blocks)
 *  ✅ Analogy → italic teal text, no background
 *  ✅ Formula → monospace indigo text, minimal left border only
 *  ✅ Quick Check → clean green left-border card (no full bg)
 *  ✅ Key insights → amber left-border accent, no bg box
 *  ✅ Warnings → red left-border accent, no bg box
 *  ✅ Smooth fade-in animation on each paragraph
 *  ✅ MCQ, code blocks, KaTeX, tables — all preserved
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

function escHtml(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ─── Syntax highlighter ──────────────────────────────────────
function syntaxHL(esc: string, lang: string): string {
  const l = lang.toLowerCase();
  if (l === "python" || l === "py") {
    return esc
      .replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\n]*"|'[^'\n]*')/g,'<span class="syn-str">$1</span>')
      .replace(/\b(def|class|import|from|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|try|except|finally|with|as|pass|break|continue|raise|lambda|yield|async|await|global|nonlocal|del|assert)\b/g,'<span class="syn-kw">$1</span>')
      .replace(/\b(print|input|len|range|type|int|float|str|list|dict|set|tuple|bool|open|sum|max|min|abs|round|sorted|enumerate|zip|map|filter|super|self|cls)\b/g,'<span class="syn-bi">$1</span>')
      .replace(/(@\w+)/g,'<span class="syn-dec">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g,'<span class="syn-num">$1</span>')
      .replace(/(#[^\n]*)/g,'<span class="syn-cm">$1</span>');
  }
  if (["js","javascript","ts","typescript","jsx","tsx"].includes(l)) {
    return esc
      .replace(/(`[^`]*`|"[^"\n]*"|'[^'\n]*')/g,'<span class="syn-str">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|export|default|from|async|await|try|catch|finally|throw|typeof|instanceof|in|of|this|super|static|null|undefined|true|false|void|delete|yield)\b/g,'<span class="syn-kw">$1</span>')
      .replace(/\b(console|document|window|Math|Array|Object|String|Number|Boolean|Promise|JSON|Date|Error|Map|Set|fetch|setTimeout|setInterval|parseInt|parseFloat)\b/g,'<span class="syn-bi">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g,'<span class="syn-num">$1</span>')
      .replace(/(\/\/[^\n]*)/g,'<span class="syn-cm">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="syn-cm">$1</span>');
  }
  if (l === "html" || l === "xml") {
    return esc
      .replace(/=("[^"]*"|'[^']*')/g,'=<span class="syn-str">$1</span>')
      .replace(/(&lt;\/?)([\w-]+)/g,'$1<span class="syn-tag">$2</span>')
      .replace(/\s([\w-]+)=/g,' <span class="syn-attr">$1</span>=')
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g,'<span class="syn-cm">$1</span>');
  }
  if (l === "css" || l === "scss") {
    return esc
      .replace(/(:[^;{}\n]+)/g,'<span class="syn-str">$1</span>')
      .replace(/\b(\d+\.?\d*(px|em|rem|%|vh|vw|s|ms)?)\b/g,'<span class="syn-num">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="syn-cm">$1</span>');
  }
  if (["c","cpp","c++"].includes(l)) {
    return esc
      .replace(/(\".*?\"|'.*?')/g,'<span class="syn-str">$1</span>')
      .replace(/\b(int|float|double|char|void|bool|long|short|unsigned|signed|struct|class|return|if|else|for|while|do|switch|case|break|continue|include|define|typedef|enum|const|static|extern|auto|NULL|true|false|new|delete|namespace|using|public|private|protected|virtual)\b/g,'<span class="syn-kw">$1</span>')
      .replace(/(#\w+)/g,'<span class="syn-dec">$1</span>')
      .replace(/\b(\d+\.?\d*[fFlL]?)\b/g,'<span class="syn-num">$1</span>')
      .replace(/(\/\/[^\n]*)/g,'<span class="syn-cm">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="syn-cm">$1</span>');
  }
  if (l === "java") {
    return esc
      .replace(/(\".*?\"|'.*?')/g,'<span class="syn-str">$1</span>')
      .replace(/\b(public|private|protected|class|interface|extends|implements|import|package|return|if|else|for|while|do|switch|case|break|continue|new|void|static|final|abstract|try|catch|finally|throw|throws|instanceof|this|super|null|true|false|int|float|double|char|boolean|long|short|byte|String)\b/g,'<span class="syn-kw">$1</span>')
      .replace(/\b(\d+\.?\d*[fFlL]?)\b/g,'<span class="syn-num">$1</span>')
      .replace(/(\/\/[^\n]*)/g,'<span class="syn-cm">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="syn-cm">$1</span>');
  }
  if (l === "sql") {
    return esc
      .replace(/('[^']*')/g,'<span class="syn-str">$1</span>')
      .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|ORDER|BY|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|AND|OR|IN|LIKE|BETWEEN|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|LIMIT|OFFSET|UNION|ALL|EXISTS|CASE|WHEN|THEN|ELSE|END)\b/gi,'<span class="syn-kw">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g,'<span class="syn-num">$1</span>')
      .replace(/(--[^\n]*)/g,'<span class="syn-cm">$1</span>');
  }
  if (["bash","sh","shell","zsh"].includes(l)) {
    return esc
      .replace(/(\".*?\"|'.*?')/g,'<span class="syn-str">$1</span>')
      .replace(/\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|echo|cd|ls|mkdir|rm|cp|mv|grep|sed|awk|cat|chmod|chown|export|source|alias)\b/g,'<span class="syn-kw">$1</span>')
      .replace(/(\$\{?[\w]+\}?)/g,'<span class="syn-bi">$1</span>')
      .replace(/(#[^\n]*)/g,'<span class="syn-cm">$1</span>');
  }
  return esc;
}

// ─── Paragraph classifier (no color boxes — just style hints) ─
type LineStyle = "analogy"|"formula"|"key"|"warning"|"hook"|"normal";

function classifyLine(text: string): LineStyle {
  const lower = text.toLowerCase();
  if (/[A-Z]\s*=\s*[\w\/+\-×·*]/.test(text) && text.length < 200)                              return "formula";
  if (/think of (it|this)|just like|imagine (you|a )|real.world|for example,|consider a /i.test(lower) && text.length < 500) return "analogy";
  if (/this means|key (point|insight)|most important|remember that|note that|the key is/i.test(lower) && text.length < 350) return "key";
  if (/be careful|don'?t (forget|confuse)|common mistake|watch out|avoid /i.test(lower) && text.length < 350)               return "warning";
  if (/bonus curiosity|next level|if you (understood|get|got)|the next interesting/i.test(lower))                             return "hook";
  return "normal";
}

// ─── Inline renderer ─────────────────────────────────────────
function renderInline(text: string): string {
  return text
    .replace(/\$([^$\n]+?)\$/g,(_,m)=>`<span class="katex-il">${renderMath(m,false)}</span>`)
    .replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>")
    // Bold → highlighted term (colored underline, no bg)
    .replace(/\*\*(.+?)\*\*/g,'<strong class="hl-bold">$1</strong>')
    .replace(/\*(?!\*)(.+?)(?<!\*)\*/g,'<em class="syn-italic">$1</em>')
    .replace(/`([^`]+)`/g,'<code class="syn-icode">$1</code>')
    .replace(/==(.+?)==/g,'<mark class="syn-hl">$1</mark>')
    .replace(/~~(.+?)~~/g,'<del class="syn-del">$1</del>')
    .replace(/\*\*Quick check:\*\*/g,'<span class="qc-inline-label">Quick check:</span>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener" class="syn-link">$1 &#8599;</a>');
}

const BULLET_RE = /^[-*+\u2022\u25CF]\s+\S/;

// ─── Section label pill (tiny, elegant) ──────────────────────
function sectionPill(icon: string, label: string, cls: string): string {
  return `<div class="v11-pill ${cls}"><span>${icon}</span><span>${label}</span></div>`;
}

// ─── MCQ helpers ─────────────────────────────────────────────
function isMcqOption(line: string): boolean {
  return /^[A-D][)\.]\s+\S/i.test(line.trim());
}

function buildMcqCard(question: string, options: string[]): string {
  const id = `mcq-${Math.random().toString(36).slice(2,9)}`;
  const opts = options.map((opt, idx) => {
    const letter = opt.trim()[0].toUpperCase();
    const text   = opt.trim().replace(/^[A-D][)\.\s]+/i,"").replace(/\(correct\)/i,"").trim();
    const isMarkedCorrect = /\(correct\)/i.test(opt);
    return `<button class="mcq-opt" data-mcq-id="${id}" data-idx="${idx}" data-letter="${letter}" ${isMarkedCorrect?'data-correct="1"':""} onclick="window.__mcqClick&&window.__mcqClick('${id}',${idx},'${letter}')">
      <span class="mcq-letter">${letter}</span>
      <span class="mcq-text">${escHtml(text)}</span>
    </button>`;
  }).join("");
  return `<div class="mcq-card" id="${id}">
    <div class="mcq-q">${escHtml(question)}</div>
    <div class="mcq-opts">${opts}</div>
    <div class="mcq-feedback" id="${id}-fb"></div>
  </div>`;
}

// ─── Parser ──────────────────────────────────────────────────
function parse(md: string): string {
  const lines = md.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");
  const out: string[] = [];
  let i = 0, inUl = false, inOl = false;
  const closeUl=()=>{ if(inUl){out.push("</ul>");inUl=false;} };
  const closeOl=()=>{ if(inOl){out.push("</ol>");inOl=false;} };
  const closeLists=()=>{ closeUl();closeOl(); };

  let pendingQuestion = "";
  let mcqOptions: string[] = [];
  let paraBuffer: string[] = [];

  const flushPara = () => {
    if (!paraBuffer.length) return;
    // Classify by first non-empty line
    const firstLine = paraBuffer.find(l => l.trim()) || "";
    const style = classifyLine(firstLine.trim());
    const rendered = paraBuffer.map(l => renderInline(l)).join("<br>");

    if (style === "analogy") {
      // Italic teal, no background — just subtle left border
      out.push(`<p class="v11-p v11-analogy">${rendered}</p>`);
    } else if (style === "formula") {
      // Monospace, indigo tint, left border only
      out.push(`<p class="v11-p v11-formula">${rendered}</p>`);
    } else if (style === "key") {
      // Amber left-border accent, no bg
      out.push(`<p class="v11-p v11-key">${rendered}</p>`);
    } else if (style === "warning") {
      // Red left-border, no bg
      out.push(`<p class="v11-p v11-warn">${rendered}</p>`);
    } else if (style === "hook") {
      // Orange left-border, no bg — micro-learning hook
      out.push(`<p class="v11-p v11-hook">${rendered}</p>`);
    } else {
      out.push(`<p class="v11-p">${rendered}</p>`);
    }
    paraBuffer = [];
  };

  const flushMcq = () => {
    if (!pendingQuestion) return;
    if (mcqOptions.length >= 2) {
      out.push(buildMcqCard(pendingQuestion, mcqOptions));
    } else {
      // Quick check — green left border, no full bg
      out.push(
        `<div class="v11-qc"><div class="v11-qc-hdr"><span class="v11-qc-ico">💬</span><span class="v11-qc-ttl">Quick Check</span></div>` +
        `<p class="v11-qc-txt">${renderInline(pendingQuestion)}</p></div>`
      );
    }
    pendingQuestion = "";
    mcqOptions = [];
  };

  while (i < lines.length) {
    const raw = lines[i];
    const t   = raw.trim();

    if (pendingQuestion) {
      if (isMcqOption(t)) { mcqOptions.push(t); i++; continue; }
      if (!t && mcqOptions.length === 0) { i++; continue; }
      flushMcq();
    }

    // Block math
    if (t.startsWith("$$")) {
      flushPara(); closeLists();
      let math=t.slice(2); i++;
      while(i<lines.length&&!lines[i].trim().endsWith("$$")){math+="\n"+lines[i];i++;}
      if(i<lines.length) math+="\n"+lines[i].trim().slice(0,-2);
      out.push(`<div class="md-math">${renderMath(math.trim(),true)}</div>`);
      i++; continue;
    }

    // Code fence
    if (t.startsWith("```")) {
      flushPara(); closeLists();
      const lang=t.slice(3).trim()||"code";
      const codeLines:string[]=[]; i++;
      let closed=false;
      while(i<lines.length){
        if(lines[i].trim()==="```"||lines[i].trim().startsWith("```")){closed=true;i++;break;}
        codeLines.push(lines[i]); i++;
      }
      const rawCode=codeLines.join("\n");
      if(closed){
        const hl=syntaxHL(escHtml(rawCode),lang);
        out.push(`<div class="md-cb" data-cb><div class="md-cbh"><span class="md-lang">${escHtml(lang)}</span><button class="md-cpb" data-cpb>Copy</button></div><pre class="md-pre"><code class="md-code">${hl}</code></pre></div>`);
      } else {
        out.push(`<div class="md-cb md-cb-s" data-cb><div class="md-cbh"><span class="md-lang">${escHtml(lang)}</span><span class="md-s-badge">streaming…</span></div><pre class="md-pre"><code class="md-code">${escHtml(rawCode)}</code></pre></div>`);
      }
      continue;
    }

    // HR
    if(t.match(/^[-*_]{3,}$/)&&t.length<=10){flushPara();closeLists();out.push('<hr class="md-hr">');i++;continue;}

    // Headings
    if(raw.startsWith("# ")){flushPara();closeLists();out.push(`<h1 class="md-h1">${renderInline(raw.slice(2))}</h1>`);i++;continue;}
    if(raw.startsWith("## ")){flushPara();closeLists();out.push(`<h2 class="md-h2">${renderInline(raw.slice(3))}</h2>`);i++;continue;}
    if(raw.startsWith("### ")){flushPara();closeLists();out.push(`<h3 class="md-h3">${renderInline(raw.slice(4))}</h3>`);i++;continue;}

    // Section labels → tiny pills only (no background cards)
    if(/^[📖🔷]\s*(EXPLANATION|EXPLAIN)/i.test(t)&&t.length<80){
      flushPara();closeLists();
      out.push(sectionPill("📖","Explanation","v11-pill-explain"));
      i++;continue;
    }
    if(/^\d+\.\s*[📖🔷]?\s*(EXPLANATION|EXPLAIN)/i.test(t)&&t.length<80){
      flushPara();closeLists();
      out.push(sectionPill("📖","Explanation","v11-pill-explain"));
      i++;continue;
    }
    if(/^[💡🔸]\s*(EXAMPLE|EXAMPLES?)/i.test(t)&&t.length<80){
      flushPara();closeLists();
      out.push(sectionPill("💡","Example","v11-pill-example"));
      i++;continue;
    }
    if(/^\d+\.\s*[💡🔸]?\s*EXAMPLE/i.test(t)&&t.length<80){
      flushPara();closeLists();
      out.push(sectionPill("💡","Example","v11-pill-example"));
      i++;continue;
    }
    if(/^[⚡🔹]\s*(QUICK\s*SUMMARY|SUMMARY)/i.test(t)&&t.length<80){
      flushPara();closeLists();
      out.push(sectionPill("⚡","Quick Summary","v11-pill-summary"));
      i++;continue;
    }
    if(/^\d+\.\s*[⚡🔹]?\s*(QUICK\s*SUMMARY|SUMMARY)/i.test(t)&&t.length<80){
      flushPara();closeLists();
      out.push(sectionPill("⚡","Quick Summary","v11-pill-summary"));
      i++;continue;
    }
    if(/^[❓🔔]\s*(CHECK\s*YOUR\s*UNDERSTANDING)/i.test(t)&&t.length<80){
      flushPara();closeLists();
      out.push(sectionPill("🧠","Check Your Understanding","v11-pill-check"));
      i++;continue;
    }
    if(/^\d+\.\s*[❓🔔]?\s*CHECK\s*(YOUR\s*)?UNDERSTANDING/i.test(t)&&t.length<80){
      flushPara();closeLists();
      out.push(sectionPill("🧠","Check Your Understanding","v11-pill-check"));
      i++;continue;
    }
    if(/^(🔥\s*MICRO-LEARNING|🔥\s*BONUS CURIOSITY|Bonus curiosity:|Next level:)/i.test(t)&&t.length<100){
      flushPara();closeLists();
      out.push(sectionPill("🔥","Explore Next","v11-pill-hook"));
      i++;continue;
    }

    // Inline callouts (warning/key/success/error lines)
    if(/^(⚠️|🚨|WARNING:|CAUTION:|IMPORTANT:)/i.test(t)){
      flushPara();closeLists();
      out.push(`<p class="v11-p v11-warn"><span class="v11-ico">⚠️</span>${renderInline(t.replace(/^(⚠️|🚨|WARNING:|CAUTION:|IMPORTANT:)\s*/i,""))}</p>`);
      i++;continue;
    }
    if(/^(📌|🔑|🎯|KEY\s*(POINT|TAKEAWAY)|REMEMBER:|NOTE:)/i.test(t)){
      flushPara();closeLists();
      out.push(`<p class="v11-p v11-key"><span class="v11-ico">🔑</span>${renderInline(t.replace(/^(📌|🔑|🎯|KEY\s*(POINT|TAKEAWAY)|REMEMBER:|NOTE:)\s*/i,""))}</p>`);
      i++;continue;
    }
    if(/^(✅|🟢|CORRECT:|RIGHT:)/i.test(t)){
      flushPara();closeLists();
      out.push(`<p class="v11-p v11-ok"><span class="v11-ico">✅</span>${renderInline(t.replace(/^(✅|🟢|CORRECT:|RIGHT:)\s*/i,""))}</p>`);
      i++;continue;
    }
    if(/^(❌|🔴|🚫|WRONG:|AVOID:)/i.test(t)){
      flushPara();closeLists();
      out.push(`<p class="v11-p v11-err"><span class="v11-ico">❌</span>${renderInline(t.replace(/^(❌|🔴|🚫|WRONG:|AVOID:)\s*/i,""))}</p>`);
      i++;continue;
    }

    // Blockquote — left border style, no bg
    if(raw.startsWith("> ")){
      flushPara();closeLists();
      out.push(`<blockquote class="md-bq">${renderInline(raw.slice(2))}</blockquote>`);
      i++; continue;
    }

    // Table
    if(t.startsWith("|")&&t.endsWith("|")){
      flushPara();closeLists();
      const rows:string[]=[];
      while(i<lines.length&&lines[i].trim().startsWith("|")){rows.push(lines[i]);i++;}
      if(rows.length>=2){
        const heads=rows[0].split("|").slice(1,-1).map(c=>c.trim());
        const body=rows.slice(2);
        out.push(
          `<div class="md-tw"><table class="md-tbl"><thead><tr>`+
          heads.map(h=>`<th class="md-th">${renderInline(h)}</th>`).join("")+
          `</tr></thead><tbody>`+
          body.map((r,ri)=>{const cells=r.split("|").slice(1,-1).map(c=>c.trim());return`<tr class="${ri%2===0?"md-ta":"md-tb"}">${cells.map(c=>`<td class="md-td">${renderInline(c)}</td>`).join("")}</tr>`;}).join("")+
          `</tbody></table></div>`
        );
      }
      continue;
    }

    // Bullet list
    if(BULLET_RE.test(t)){
      flushPara();closeOl();
      if(!inUl){out.push('<ul class="md-ul">');inUl=true;}
      const ct=t.replace(/^[-*+\u2022\u25CF]\s+/,"");
      out.push(`<li class="md-li"><span class="md-d">◆</span><span class="md-lt">${renderInline(ct)}</span></li>`);
      i++; continue;
    }

    // Numbered list
    if(t.match(/^\d+\.\s+\S/)){
      flushPara();closeUl();
      if(!inOl){out.push('<ol class="md-ol">');inOl=true;}
      const num=t.match(/^(\d+)/)?.[1]??"1";
      const ct=t.replace(/^\d+\.\s+/,"");
      out.push(`<li class="md-li"><span class="md-n">${num}.</span><span class="md-lt">${renderInline(ct)}</span></li>`);
      i++; continue;
    }

    // Empty line → flush
    if(!t){
      flushPara();
      closeLists();
      out.push('<div class="md-gap"></div>');
      i++;continue;
    }

    // Quick check
    if(/^\*?\*?Quick check:/i.test(t)){
      flushPara();closeLists();
      const qText=t.replace(/^\*?\*?Quick check:\*?\*?\s*/i,"").trim();
      let peek=i+1;
      while(peek<lines.length&&!lines[peek].trim()) peek++;
      if(peek<lines.length&&isMcqOption(lines[peek].trim())){
        pendingQuestion=qText;
        i++; continue;
      }
      out.push(
        `<div class="v11-qc"><div class="v11-qc-hdr"><span class="v11-qc-ico">💬</span><span class="v11-qc-ttl">Quick Check</span></div>` +
        `<p class="v11-qc-txt">${renderInline(qText)}</p></div>`
      );
      i++; continue;
    }

    // Plain paragraph — buffer
    closeLists();
    paraBuffer.push(raw);
    i++;
  }

  flushMcq();
  flushPara();
  closeLists();
  return out.join("\n");
}

// ─── Handlers ────────────────────────────────────────────────
function attachCopy(root: HTMLElement) {
  root.querySelectorAll<HTMLButtonElement>("[data-cpb]").forEach((btn) => {
    const clone=btn.cloneNode(true) as HTMLButtonElement;
    btn.replaceWith(clone);
    clone.addEventListener("click",()=>{
      const code=clone.closest("[data-cb]")?.querySelector("code");
      if(!code) return;
      const text=code.innerText;
      const done=()=>{clone.textContent="Copied!";clone.setAttribute("data-done","1");setTimeout(()=>{clone.textContent="Copy";clone.removeAttribute("data-done");},2000);};
      if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(done).catch(()=>fbCopy(text,done));}
      else fbCopy(text,done);
    });
  });
}
function fbCopy(text:string,done:()=>void){
  const ta=document.createElement("textarea");ta.value=text;
  ta.style.cssText="position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none";
  document.body.appendChild(ta);ta.focus();ta.select();
  try{document.execCommand("copy");done();}catch{}
  document.body.removeChild(ta);
}
function attachMcqHandlers(_root: HTMLElement) {
  (window as any).__mcqClick = (id: string, _idx: number, letter: string) => {
    const card=document.getElementById(id);
    if(!card||card.getAttribute("data-answered")) return;
    card.setAttribute("data-answered","1");
    const buttons=card.querySelectorAll<HTMLButtonElement>(".mcq-opt");
    const fb=document.getElementById(`${id}-fb`);
    let correctLetter="";
    buttons.forEach(btn=>{if(btn.getAttribute("data-correct")==="1") correctLetter=btn.getAttribute("data-letter")||"";});
    const isCorrect=correctLetter?letter===correctLetter:true;
    buttons.forEach(btn=>{
      const bl=btn.getAttribute("data-letter");
      btn.disabled=true;
      if(bl===letter) btn.classList.add(isCorrect?"mcq-correct":"mcq-wrong");
      if(correctLetter&&bl===correctLetter&&!isCorrect) btn.classList.add("mcq-reveal");
    });
    if(fb){
      fb.className=`mcq-feedback mcq-fb-${isCorrect?"ok":"err"}`;
      fb.innerHTML=isCorrect
        ?`<span>🎉</span><span>Correct! Well done!</span>`
        :`<span>💡</span><span>Not quite — the highlighted option is correct.</span>`;
    }
  };
}

// ─── CSS v11 — Premium Notes Style ───────────────────────────
const CSS=`
.md-root{font-size:14px;line-height:1.95;color:#cbd5e1;word-break:break-word}

/* Headings */
.md-h1{font-size:1.2rem;font-weight:700;color:#fff;margin:1.1rem 0 .45rem;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:.35rem;line-height:1.4}
.md-h2{font-size:1rem;font-weight:700;color:#e2e8f0;margin:.9rem 0 .35rem;line-height:1.4}
.md-h3{font-size:.9rem;font-weight:700;color:#c4b5fd;margin:.7rem 0 .3rem;line-height:1.4}

/* ── Section label pills (tiny, no full-width bg) ── */
@keyframes v11in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
.v11-pill{display:inline-flex;align-items:center;gap:.4rem;padding:.22rem .75rem;border-radius:20px;font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin:.85rem 0 .25rem;animation:v11in .25s ease-out;border:1px solid}
.v11-pill-explain{color:#a78bfa;border-color:rgba(167,139,250,.3);background:rgba(167,139,250,.07)}
.v11-pill-example{color:#fbbf24;border-color:rgba(251,191,36,.3);background:rgba(251,191,36,.07)}
.v11-pill-summary{color:#60a5fa;border-color:rgba(96,165,250,.3);background:rgba(96,165,250,.07)}
.v11-pill-check{color:#4ade80;border-color:rgba(74,222,128,.3);background:rgba(74,222,128,.07)}
.v11-pill-hook{color:#fb923c;border-color:rgba(251,146,60,.3);background:rgba(251,146,60,.07)}

/* ── Paragraphs — notes style ── */
.v11-p{font-size:.875rem;color:#cbd5e1;margin:.15rem 0 .6rem;line-height:1.95;animation:v11in .3s ease-out}

/* Analogy → italic, teal tint, subtle left line */
.v11-analogy{color:#99f6e4;font-style:italic;padding-left:.85rem;border-left:2px solid rgba(20,184,166,.5);margin-left:.1rem}

/* Formula → monospace, indigo, left border */
.v11-formula{font-family:'JetBrains Mono','Fira Code',monospace;font-size:.85rem;color:#a5b4fc;padding-left:.85rem;border-left:2px solid rgba(99,102,241,.5);margin-left:.1rem;letter-spacing:.025em}

/* Key insight → amber left border, slightly brighter text */
.v11-key{color:#fde68a;padding-left:.85rem;border-left:2px solid rgba(245,158,11,.55);margin-left:.1rem;font-weight:500}

/* Warning → red left border */
.v11-warn{color:#fca5a5;padding-left:.85rem;border-left:2px solid rgba(239,68,68,.5);margin-left:.1rem}

/* OK / correct */
.v11-ok{color:#86efac;padding-left:.85rem;border-left:2px solid rgba(34,197,94,.5);margin-left:.1rem}

/* Error */
.v11-err{color:#fca5a5;padding-left:.85rem;border-left:2px solid rgba(239,68,68,.4);margin-left:.1rem}

/* Micro-learning hook → orange */
.v11-hook{color:#fed7aa;padding-left:.85rem;border-left:2px solid rgba(249,115,22,.5);margin-left:.1rem;font-style:italic}

.v11-ico{margin-right:.35rem}

/* ── Quick Check — clean left-border card ── */
.v11-qc{border-left:3px solid #22c55e;padding:.7rem .95rem;margin:.8rem 0;background:rgba(34,197,94,.05);border-radius:0 10px 10px 0;animation:v11in .3s ease-out}
.v11-qc-hdr{display:flex;align-items:center;gap:.45rem;margin-bottom:.4rem}
.v11-qc-ico{font-size:.95rem}
.v11-qc-ttl{font-weight:700;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:#4ade80}
.v11-qc-txt{color:#d1fae5;font-size:.875rem;line-height:1.9;margin:0;font-weight:500}
.qc-inline-label{font-weight:700;color:#4ade80;font-size:.85em}

/* ── Bold = highlighted term ── */
.hl-bold{font-weight:700;color:#fff;text-decoration:underline;text-decoration-color:rgba(139,92,246,.6);text-decoration-thickness:2px;text-underline-offset:3px}

/* ── MCQ ── */
.mcq-card{border-left:3px solid rgba(99,102,241,.5);padding:.85rem .95rem;margin:.75rem 0;background:rgba(99,102,241,.04);border-radius:0 12px 12px 0;animation:v11in .35s ease-out}
.mcq-q{font-size:.875rem;font-weight:600;color:#e2e8f0;margin-bottom:.75rem;line-height:1.65}
.mcq-opts{display:flex;flex-direction:column;gap:.45rem}
.mcq-opt{display:flex;align-items:center;gap:.7rem;padding:.55rem .85rem;border-radius:8px;border:1px solid rgba(99,102,241,.2);background:rgba(99,102,241,.06);cursor:pointer;transition:all .15s;text-align:left;width:100%;color:#cbd5e1;font-size:.85rem;line-height:1.5}
.mcq-opt:hover:not(:disabled){border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.15);color:#fff;transform:translateX(3px)}
.mcq-opt:disabled{cursor:default;transform:none}
.mcq-letter{font-weight:700;font-size:.76rem;color:#818cf8;background:rgba(99,102,241,.18);border-radius:4px;padding:.12em .4em;flex-shrink:0;min-width:1.4rem;text-align:center;border:1px solid rgba(99,102,241,.28)}
.mcq-text{flex:1;min-width:0}
.mcq-opt.mcq-correct{border-color:rgba(34,197,94,.55)!important;background:rgba(34,197,94,.1)!important;color:#86efac!important}
.mcq-opt.mcq-correct .mcq-letter{color:#4ade80;background:rgba(34,197,94,.2);border-color:rgba(34,197,94,.35)}
.mcq-opt.mcq-wrong{border-color:rgba(239,68,68,.45)!important;background:rgba(239,68,68,.08)!important;color:#fca5a5!important}
.mcq-opt.mcq-wrong .mcq-letter{color:#f87171;background:rgba(239,68,68,.18);border-color:rgba(239,68,68,.3)}
.mcq-opt.mcq-reveal{border-color:rgba(34,197,94,.4)!important;background:rgba(34,197,94,.07)!important}
.mcq-feedback{display:none;align-items:center;gap:.5rem;margin-top:.65rem;padding:.55rem .8rem;border-radius:7px;font-size:.82rem;font-weight:600}
.mcq-feedback.mcq-fb-ok{display:flex;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);color:#86efac}
.mcq-feedback.mcq-fb-err{display:flex;background:rgba(245,158,11,.09);border:1px solid rgba(245,158,11,.25);color:#fde68a}

/* ── Base inline ── */
.syn-bold{font-weight:700;color:#fff}
.syn-italic{font-style:italic;color:#e2e8f0}
.syn-del{text-decoration:line-through;color:#4b5563}
.syn-hl{background:rgba(251,191,36,.2);color:#fcd34d;border-radius:3px;padding:.05em .22em}
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
.md-cpb:hover{color:#fff;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.18)}
.md-cpb[data-done]{color:#4ade80;border-color:rgba(74,222,128,.3)}
.md-pre{margin:0;padding:.85rem 1rem;overflow-x:auto}
.md-code{font-family:'JetBrains Mono','Fira Code','Courier New',monospace;font-size:.8rem;line-height:1.75;color:#e2e8f0;display:block;white-space:pre}
.syn-kw{color:#c792ea;font-weight:600}.syn-str{color:#c3e88d}.syn-num{color:#f78c6c}.syn-cm{color:#546e7a;font-style:italic}.syn-bi{color:#82aaff}.syn-dec{color:#ffcb6b}.syn-tag{color:#f07178}.syn-attr{color:#c792ea}

/* ── Lists ── */
.md-ul,.md-ol{margin:.3rem 0;padding:0;list-style:none}
.md-li{display:flex;gap:.6rem;align-items:flex-start;padding:.18rem 0}
.md-lt{font-size:.875rem;color:#cbd5e1;line-height:1.9;flex:1;min-width:0}
.md-d{color:rgba(139,92,246,.7);font-size:.45rem;flex-shrink:0;margin-top:8px}
.md-n{color:#60a5fa;font-weight:700;font-size:.875rem;flex-shrink:0;min-width:1.8rem;padding-top:1px}

/* ── Blockquote ── */
.md-bq{border-left:2px solid rgba(99,102,241,.4);padding:.5rem .85rem;margin:.45rem 0 .45rem .1rem;color:#c7d2fe;font-size:.875rem;line-height:1.85;font-style:italic}

/* ── Table ── */
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
  ["sea-md-v5","sea-md-v6","sea-md-v7","sea-md-v8","sea-md-v9","sea-md-v10","sea-md-v11"].forEach(id=>document.getElementById(id)?.remove());
  const el = document.createElement("style");
  el.id = "sea-md-v11";
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
    attachMcqHandlers(ref.current);
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