/**
 * StudyEarn AI — MarkdownRenderer v10 (VISUAL UPGRADE)
 * ─────────────────────────────────────────────────────────────
 * ROUTE: src/components/MarkdownRenderer.tsx
 *
 * v10 — Complete Visual Overhaul:
 *  ✅ Smart paragraph classifier — auto-detects analogies,
 *     formulas, key insights, warnings from plain text
 *  ✅ Animated section label pills (Explanation/Example/Summary)
 *  ✅ Beautiful colored cards: violet/amber/blue/green/teal/red
 *  ✅ Enhanced Quick Check — animated pulsing gradient border
 *  ✅ Inline callouts for key/warning/success/error
 *  ✅ Analogy auto-card (teal) — "Think of it like..."
 *  ✅ Formula auto-card (indigo) — "V = IR" style lines
 *  ✅ Micro-learning hook card (orange) — "Bonus curiosity..."
 *  ✅ Fade-in animations on every card
 *  ✅ MCQ cards, code blocks, KaTeX, tables — all preserved
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

// ─── Section / card type ─────────────────────────────────────
type CardType = "explanation"|"example"|"summary"|"check"|"warning"|"key"|"success"|"error"|"analogy"|"formula"|"micrhook"|"normal";

function detectSection(t: string): CardType {
  if (/^[📖🔷]\s*(EXPLANATION|EXPLAIN)/i.test(t))                     return "explanation";
  if (/^[💡🔸]\s*(EXAMPLE|EXAMPLES?)/i.test(t))                       return "example";
  if (/^[⚡🔹]\s*(QUICK\s*SUMMARY|SUMMARY)/i.test(t))                 return "summary";
  if (/^[❓🔔]\s*(CHECK\s*YOUR\s*UNDERSTANDING)/i.test(t))            return "check";
  if (/^\d+\.\s*[📖🔷]?\s*(EXPLANATION|EXPLAIN)/i.test(t))           return "explanation";
  if (/^\d+\.\s*[💡🔸]?\s*EXAMPLE/i.test(t))                         return "example";
  if (/^\d+\.\s*[⚡🔹]?\s*(QUICK\s*SUMMARY|SUMMARY)/i.test(t))       return "summary";
  if (/^\d+\.\s*[❓🔔]?\s*CHECK\s*(YOUR\s*)?UNDERSTANDING/i.test(t))  return "check";
  if (/^(⚠️|🚨|WARNING:|CAUTION:|IMPORTANT:)/i.test(t))              return "warning";
  if (/^(📌|🔑|🎯|🚀|KEY\s*(POINT|TAKEAWAY)|REMEMBER:|NOTE:)/i.test(t)) return "key";
  if (/^(✅|🟢|CORRECT:|RIGHT:|PERFECT:|EXCELLENT:)/i.test(t))        return "success";
  if (/^(❌|🔴|🚫|WRONG:|INCORRECT:|AVOID:|DON'?T:)/i.test(t))        return "error";
  if (/^(🔥\s*MICRO-LEARNING|🔥\s*BONUS CURIOSITY|Bonus curiosity:|Next level:)/i.test(t)) return "micrhook";
  return "normal";
}

// ─── Smart paragraph auto-classifier ─────────────────────────
function classifyParagraph(text: string): CardType {
  const lower = text.toLowerCase();
  if (/[A-Z]\s*=\s*[\w\/+\-×·*]/.test(text) && text.length < 200)     return "formula";
  if (/think of (it|this)|just like|imagine (you|a )|real.world analogy|for example,|for instance,|consider a /i.test(lower) && text.length < 500) return "analogy";
  if (/this means|key (point|insight|takeaway)|most important|remember that|note that|in short,/i.test(lower) && text.length < 350) return "key";
  if (/be careful|don'?t (forget|confuse|mix)|common mistake|watch out|avoid /i.test(lower) && text.length < 350) return "warning";
  if (/bonus curiosity|next level|if you (understood|get|got)|the next interesting/i.test(lower)) return "micrhook";
  return "normal";
}

// ─── Inline renderer ─────────────────────────────────────────
function renderInline(text: string): string {
  return text
    .replace(/\$([^$\n]+?)\$/g,(_,m)=>`<span class="katex-il">${renderMath(m,false)}</span>`)
    .replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g,'<strong class="syn-bold">$1</strong>')
    .replace(/\*(?!\*)(.+?)(?<!\*)\*/g,'<em class="syn-italic">$1</em>')
    .replace(/`([^`]+)`/g,'<code class="syn-icode">$1</code>')
    .replace(/==(.+?)==/g,'<mark class="syn-hl">$1</mark>')
    .replace(/~~(.+?)~~/g,'<del class="syn-del">$1</del>')
    .replace(/\*\*Quick check:\*\*/g,'<span class="qc-label">💬 Quick check:</span>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener" class="syn-link">$1 &#8599;</a>');
}

const BULLET_RE = /^[-*+\u2022\u25CF]\s+\S/;

// ─── Card HTML builders ──────────────────────────────────────
function buildInlineCallout(type: CardType, icon: string, body: string): string {
  return `<div class="v10-callout v10-co-${type}"><span class="v10-co-icon">${icon}</span><div class="v10-co-body">${body}</div></div>`;
}

function buildCard(type: CardType, icon: string, label: string, body: string): string {
  return `<div class="v10-card v10-card-${type}"><div class="v10-ch"><span class="v10-cico">${icon}</span><span class="v10-clbl">${label}</span></div><div class="v10-cbody">${body}</div></div>`;
}

function buildSectionLabel(type: CardType, icon: string, label: string): string {
  return `<div class="v10-sl v10-sl-${type}"><span>${icon}</span><span>${label}</span></div>`;
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

// ─── Main parser ─────────────────────────────────────────────
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
    const combined = paraBuffer.join(" ");
    const cls = classifyParagraph(combined);
    const rendered = paraBuffer.map(l => renderInline(l)).join("<br>");
    const bodyHtml = `<p class="v10-p">${rendered}</p>`;
    if      (cls === "analogy")  out.push(buildCard("analogy",  "🌍", "Real-world analogy", bodyHtml));
    else if (cls === "formula")  out.push(buildCard("formula",  "📐", "Formula",            bodyHtml));
    else if (cls === "micrhook") out.push(buildCard("micrhook", "🔥", "Explore next",       bodyHtml));
    else if (cls === "key")      out.push(buildInlineCallout("key",  "🔑", `<p class="v10-p">${rendered}</p>`));
    else if (cls === "warning")  out.push(buildInlineCallout("warning", "⚠️", `<p class="v10-p">${rendered}</p>`));
    else                         out.push(`<p class="md-p">${rendered}</p>`);
    paraBuffer = [];
  };

  const flushMcq = () => {
    if (!pendingQuestion) return;
    if (mcqOptions.length >= 2) {
      out.push(buildMcqCard(pendingQuestion, mcqOptions));
    } else {
      out.push(
        `<div class="v10-qc-card"><div class="v10-qc-inner">` +
        `<div class="v10-qc-hdr"><span class="v10-qc-ico">💬</span><span class="v10-qc-ttl">Quick Check</span></div>` +
        `<p class="v10-qc-txt">${renderInline(pendingQuestion)}</p></div></div>`
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

    // Section label headers
    if(/^[📖🔷]\s*(EXPLANATION|EXPLAIN)/i.test(t)&&t.length<80){
      flushPara();closeLists();
      out.push(buildSectionLabel("explanation","📖","Explanation"));
      i++;continue;
    }
    if(/^\d+\.\s*[📖🔷]?\s*(EXPLANATION|EXPLAIN)/i.test(t)&&t.length<80){
      flushPara();closeLists();
      out.push(buildSectionLabel("explanation","📖","Explanation"));
      i++;continue;
    }

    const sec=detectSection(t);
    if(sec!=="normal"&&t.length<120){
      flushPara();closeLists();
      if(sec==="example")    {out.push(buildSectionLabel("example","💡","Example"));i++;continue;}
      if(sec==="summary")    {out.push(buildSectionLabel("summary","⚡","Quick Summary"));i++;continue;}
      if(sec==="check")      {out.push(buildSectionLabel("check","🧠","Check Your Understanding"));i++;continue;}
      if(sec==="micrhook")   {out.push(buildSectionLabel("micrhook","🔥","Explore next"));i++;continue;}
      if(sec==="warning")    {out.push(buildInlineCallout("warning","⚠️",`<span>${renderInline(t)}</span>`));i++;continue;}
      if(sec==="key")        {out.push(buildInlineCallout("key","🔑",`<span>${renderInline(t)}</span>`));i++;continue;}
      if(sec==="success")    {out.push(buildInlineCallout("success","✅",`<span>${renderInline(t)}</span>`));i++;continue;}
      if(sec==="error")      {out.push(buildInlineCallout("error","❌",`<span>${renderInline(t)}</span>`));i++;continue;}
    }

    // Blockquote
    if(raw.startsWith("> ")){
      flushPara();closeLists();
      const ct=raw.slice(2);
      const bsec=detectSection(ct)||classifyParagraph(ct);
      if(bsec==="warning") {out.push(buildInlineCallout("warning","⚠️",`<span>${renderInline(ct)}</span>`));i++;continue;}
      if(bsec==="key")     {out.push(buildInlineCallout("key","🔑",`<span>${renderInline(ct)}</span>`));i++;continue;}
      if(bsec==="analogy") {out.push(buildCard("analogy","🌍","Real-world analogy",`<p class="v10-p">${renderInline(ct)}</p>`));i++;continue;}
      out.push(`<blockquote class="md-bq">${renderInline(ct)}</blockquote>`);
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
      const bsec=detectSection(ct);
      const dc=bsec==="warning"?"md-dw":bsec==="key"?"md-dk":bsec==="success"?"md-ds":bsec==="error"?"md-de":"md-d";
      out.push(`<li class="md-li"><span class="${dc}">◆</span><span class="md-lt">${renderInline(ct)}</span></li>`);
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

    // Empty line → flush paragraph buffer
    if(!t){
      flushPara();
      closeLists();
      out.push('<div class="md-gap"></div>');
      i++;continue;
    }

    // "Quick check:" → enhanced card
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
        `<div class="v10-qc-card"><div class="v10-qc-inner">` +
        `<div class="v10-qc-hdr"><span class="v10-qc-ico">💬</span><span class="v10-qc-ttl">Quick Check</span></div>` +
        `<p class="v10-qc-txt">${renderInline(qText)}</p></div></div>`
      );
      i++; continue;
    }

    // Plain paragraph — buffer for smart classification
    closeLists();
    paraBuffer.push(raw);
    i++;
  }

  flushMcq();
  flushPara();
  closeLists();
  return out.join("\n");
}

// ─── Copy + MCQ handlers ─────────────────────────────────────
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
        :`<span>💡</span><span>Not quite — the highlighted option above is correct.</span>`;
    }
  };
}

// ─── CSS v10 ─────────────────────────────────────────────────
const CSS=`
.md-root{font-size:14px;line-height:1.9;color:#cbd5e1;word-break:break-word}

/* Headings */
.md-h1{font-size:1.25rem;font-weight:700;color:#fff;margin:1.2rem 0 .5rem;padding:.5rem .9rem;background:linear-gradient(90deg,rgba(124,58,237,.2),transparent);border-left:3px solid #7c3aed;border-radius:0 8px 8px 0;line-height:1.4}
.md-h2{font-size:1.05rem;font-weight:700;color:#93c5fd;margin:.9rem 0 .4rem;padding:.4rem .75rem;background:linear-gradient(90deg,rgba(59,130,246,.14),transparent);border-left:3px solid #3b82f6;border-radius:0 6px 6px 0;line-height:1.4}
.md-h3{font-size:.95rem;font-weight:700;color:#c4b5fd;margin:.75rem 0 .3rem;padding:.35rem .65rem;border-left:2px solid #8b5cf6;line-height:1.4}

/* Section label pills */
@keyframes v10in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.v10-sl{display:inline-flex;align-items:center;gap:.45rem;padding:.32rem .85rem;border-radius:20px;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin:.85rem 0 .3rem;animation:v10in .3s ease-out}
.v10-sl-explanation{background:rgba(139,92,246,.18);border:1px solid rgba(139,92,246,.4);color:#c4b5fd}
.v10-sl-example{background:rgba(245,158,11,.18);border:1px solid rgba(245,158,11,.4);color:#fde68a}
.v10-sl-summary{background:rgba(59,130,246,.18);border:1px solid rgba(59,130,246,.4);color:#93c5fd}
.v10-sl-check{background:rgba(34,197,94,.16);border:1px solid rgba(34,197,94,.4);color:#86efac}
.v10-sl-micrhook{background:rgba(249,115,22,.16);border:1px solid rgba(249,115,22,.35);color:#fdba74}

/* v10 Cards */
.v10-card{border-radius:13px;margin:.6rem 0;overflow:hidden;animation:v10in .35s ease-out}
.v10-ch{display:flex;align-items:center;gap:.5rem;padding:.55rem 1rem .4rem}
.v10-cico{font-size:.95rem;line-height:1}
.v10-clbl{font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.v10-cbody{padding:0 1rem .8rem}
.v10-p{font-size:.875rem;line-height:1.9;margin:0;color:inherit}

.v10-card-analogy{background:linear-gradient(135deg,rgba(20,184,166,.12),rgba(6,182,212,.05));border:1px solid rgba(20,184,166,.3)}
.v10-card-analogy .v10-clbl{color:#2dd4bf}
.v10-card-analogy .v10-ch{background:rgba(20,184,166,.08);border-bottom:1px solid rgba(20,184,166,.12)}
.v10-card-analogy .v10-p{color:#ccfbf1}

.v10-card-formula{background:linear-gradient(135deg,rgba(99,102,241,.14),rgba(129,140,248,.06));border:1px solid rgba(99,102,241,.35)}
.v10-card-formula .v10-clbl{color:#a5b4fc}
.v10-card-formula .v10-ch{background:rgba(99,102,241,.1);border-bottom:1px solid rgba(99,102,241,.18)}
.v10-card-formula .v10-p{font-family:'JetBrains Mono','Fira Code',monospace;font-size:.9rem;color:#c7d2fe;letter-spacing:.03em}

.v10-card-micrhook{background:linear-gradient(135deg,rgba(249,115,22,.11),rgba(251,146,60,.05));border:1px solid rgba(249,115,22,.28)}
.v10-card-micrhook .v10-clbl{color:#fb923c}
.v10-card-micrhook .v10-ch{background:rgba(249,115,22,.08);border-bottom:1px solid rgba(249,115,22,.12)}
.v10-card-micrhook .v10-p{color:#fed7aa}

/* Inline callouts */
.v10-callout{display:flex;align-items:flex-start;gap:.65rem;padding:.6rem .9rem;border-radius:10px;margin:.45rem 0;font-size:.875rem;line-height:1.85;animation:v10in .3s ease-out}
.v10-co-icon{font-size:.95rem;flex-shrink:0;margin-top:2px}
.v10-co-body{flex:1;min-width:0}
.v10-co-key{background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);color:#fde68a}
.v10-co-warning{background:rgba(239,68,68,.09);border:1px solid rgba(239,68,68,.3);color:#fca5a5}
.v10-co-success{background:rgba(34,197,94,.09);border:1px solid rgba(34,197,94,.3);color:#86efac}
.v10-co-error{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);color:#fca5a5}

/* Quick Check — animated gradient border */
.v10-qc-card{position:relative;margin:.8rem 0;border-radius:14px;padding:1.5px;background:linear-gradient(135deg,#22c55e,#16a34a,#4ade80,#22c55e);background-size:300% 300%;animation:v10qcb 4s ease infinite,v10in .4s ease-out}
@keyframes v10qcb{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.v10-qc-inner{background:#080e1d;border-radius:12.5px;padding:.85rem 1.05rem}
.v10-qc-hdr{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem}
.v10-qc-ico{font-size:1rem}
.v10-qc-ttl{font-weight:700;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#4ade80}
.v10-qc-txt{color:#d1fae5;font-size:.875rem;line-height:1.9;margin:0;font-weight:500}
.qc-label{display:inline-flex;align-items:center;gap:.35rem;font-weight:700;color:#4ade80;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.25);border-radius:6px;padding:.1em .5em;font-size:.82em}

/* MCQ */
.mcq-card{background:rgba(30,27,75,.55);border:1px solid rgba(99,102,241,.3);border-radius:14px;padding:1rem 1.1rem;margin:.75rem 0;animation:v10in .4s ease-out}
.mcq-q{font-size:.875rem;font-weight:600;color:#e2e8f0;margin-bottom:.85rem;line-height:1.65}
.mcq-opts{display:flex;flex-direction:column;gap:.5rem}
.mcq-opt{display:flex;align-items:center;gap:.75rem;padding:.6rem .9rem;border-radius:9px;border:1px solid rgba(99,102,241,.25);background:rgba(99,102,241,.08);cursor:pointer;transition:all .15s;text-align:left;width:100%;color:#cbd5e1;font-size:.85rem;line-height:1.5}
.mcq-opt:hover:not(:disabled){border-color:rgba(99,102,241,.55);background:rgba(99,102,241,.18);color:#fff;transform:translateX(3px)}
.mcq-opt:disabled{cursor:default;transform:none}
.mcq-letter{font-weight:700;font-size:.78rem;color:#818cf8;background:rgba(99,102,241,.2);border-radius:5px;padding:.15em .45em;flex-shrink:0;min-width:1.5rem;text-align:center;border:1px solid rgba(99,102,241,.3)}
.mcq-text{flex:1;min-width:0}
.mcq-opt.mcq-correct{border-color:rgba(34,197,94,.6)!important;background:rgba(34,197,94,.15)!important;color:#86efac!important}
.mcq-opt.mcq-correct .mcq-letter{color:#4ade80;background:rgba(34,197,94,.25);border-color:rgba(34,197,94,.4)}
.mcq-opt.mcq-wrong{border-color:rgba(239,68,68,.5)!important;background:rgba(239,68,68,.1)!important;color:#fca5a5!important}
.mcq-opt.mcq-wrong .mcq-letter{color:#f87171;background:rgba(239,68,68,.2);border-color:rgba(239,68,68,.35)}
.mcq-opt.mcq-reveal{border-color:rgba(34,197,94,.45)!important;background:rgba(34,197,94,.08)!important}
.mcq-feedback{display:none;align-items:center;gap:.55rem;margin-top:.75rem;padding:.6rem .85rem;border-radius:8px;font-size:.82rem;font-weight:600}
.mcq-feedback.mcq-fb-ok{display:flex;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.3);color:#86efac}
.mcq-feedback.mcq-fb-err{display:flex;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);color:#fde68a}

/* Base para */
.md-p{font-size:.875rem;color:#cbd5e1;margin:.2rem 0;line-height:1.9}

/* Inline */
.syn-bold{font-weight:700;color:#fff}
.syn-italic{font-style:italic;color:#e2e8f0}
.syn-del{text-decoration:line-through;color:#4b5563}
.syn-hl{background:rgba(251,191,36,.25);color:#fcd34d;border-radius:3px;padding:.05em .25em}
.syn-icode{background:rgba(99,102,241,.18);color:#a5b4fc;padding:.1em .45em;border-radius:5px;font-family:'JetBrains Mono','Fira Code',monospace;font-size:.82em;border:1px solid rgba(99,102,241,.28)}
.syn-link{color:#60a5fa;text-decoration:underline;text-underline-offset:2px}
.syn-link:hover{color:#93c5fd}

/* Code block */
.md-cb{background:#0d1117;border:1px solid rgba(255,255,255,.09);border-radius:12px;overflow:hidden;margin:.8rem 0}
.md-cb-s{border-color:rgba(99,102,241,.3);animation:cbpls 1.2s ease-in-out infinite}
@keyframes cbpls{0%,100%{border-color:rgba(99,102,241,.15)}50%{border-color:rgba(99,102,241,.45)}}
.md-cbh{display:flex;align-items:center;justify-content:space-between;padding:.4rem .9rem;background:rgba(255,255,255,.035);border-bottom:1px solid rgba(255,255,255,.07)}
.md-lang{font-size:.7rem;font-family:monospace;color:#475569;text-transform:uppercase;letter-spacing:.07em;font-weight:600}
.md-s-badge{font-size:.65rem;color:#818cf8;animation:cbpls 1s ease-in-out infinite}
.md-cpb{font-size:.72rem;font-weight:600;color:#64748b;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:.2rem .6rem;cursor:pointer;transition:all .15s;user-select:none}
.md-cpb:hover{color:#fff;background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.2)}
.md-cpb[data-done]{color:#4ade80;border-color:rgba(74,222,128,.35)}
.md-pre{margin:0;padding:.9rem 1rem;overflow-x:auto}
.md-code{font-family:'JetBrains Mono','Fira Code','Courier New',monospace;font-size:.8rem;line-height:1.75;color:#e2e8f0;display:block;white-space:pre}
.syn-kw{color:#c792ea;font-weight:600}.syn-str{color:#c3e88d}.syn-num{color:#f78c6c}.syn-cm{color:#546e7a;font-style:italic}.syn-bi{color:#82aaff}.syn-dec{color:#ffcb6b}.syn-tag{color:#f07178}.syn-attr{color:#c792ea}

/* Lists */
.md-ul,.md-ol{margin:.35rem 0 .35rem .1rem;padding:0;list-style:none}
.md-li{display:flex;gap:.65rem;align-items:flex-start;padding:.2rem 0}
.md-lt{font-size:.875rem;color:#cbd5e1;line-height:1.85;flex:1;min-width:0}
.md-d{color:#7c3aed;font-size:.5rem;flex-shrink:0;margin-top:7px}
.md-dw{color:#ef4444;font-size:.5rem;flex-shrink:0;margin-top:7px}
.md-dk{color:#f59e0b;font-size:.5rem;flex-shrink:0;margin-top:7px}
.md-ds{color:#22c55e;font-size:.5rem;flex-shrink:0;margin-top:7px}
.md-de{color:#f87171;font-size:.5rem;flex-shrink:0;margin-top:7px}
.md-n{color:#60a5fa;font-weight:700;font-size:.875rem;flex-shrink:0;min-width:1.9rem;padding-top:1px}

/* Table */
.md-tw{overflow-x:auto;margin:.75rem 0;border-radius:10px;border:1px solid rgba(255,255,255,.09)}
.md-tbl{width:100%;border-collapse:collapse;font-size:.85rem}
.md-th{padding:.48rem .85rem;text-align:left;font-weight:600;font-size:.75rem;color:#94a3b8;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.08);text-transform:uppercase;letter-spacing:.05em}
.md-td{padding:.42rem .85rem;color:#cbd5e1;border-bottom:1px solid rgba(255,255,255,.04)}
.md-ta{background:rgba(255,255,255,.01)}.md-tb{background:rgba(255,255,255,.033)}
.md-bq{border-left:3px solid #4f46e5;background:rgba(79,70,229,.09);padding:.55rem .9rem;border-radius:0 8px 8px 0;margin:.5rem 0;color:#c7d2fe;font-size:.875rem;line-height:1.75}
.md-hr{border:none;border-top:1px solid rgba(255,255,255,.09);margin:1rem 0}
.md-gap{height:.35rem}
.md-math{overflow-x:auto;text-align:center;margin:.75rem 0;padding:.6rem;background:rgba(255,255,255,.02);border-radius:8px}
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === "undefined") return;
  ["sea-md-v5","sea-md-v6","sea-md-v7","sea-md-v8","sea-md-v9","sea-md-v10"].forEach(id=>document.getElementById(id)?.remove());
  const el = document.createElement("style");
  el.id = "sea-md-v10";
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