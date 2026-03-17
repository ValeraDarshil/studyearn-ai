/**
 * HTML Course — Week 12: JavaScript Capstone — Complete Portfolio + Certificate
 * Month 3, Week 4 (Final Week!)
 */

export const HTML_WEEK_12 = {
  week: 12,
  title: 'JavaScript Capstone — Final Project aur Certificate!',
  title_en: 'JavaScript Capstone — Final Project and Certificate!',
  description: 'Teeno mahine ka sab kuch — HTML, CSS, JavaScript — ek epic final project mein! Certificate ready hai!',
  description_en: 'Everything from three months — HTML, CSS, JavaScript — in one epic final project! Certificate ready!',
  xpReward: 500,
  sections: [
    {
      id: 'html-w12-s1',
      title: 'Month 3 Review — JavaScript Mastery',
      title_en: 'Month 3 Review — JavaScript Mastery',
      emoji: '🔄',
      content: `## Month 3 Complete! JavaScript Master Ban Gaye! 🎉

### Teen Mahine Ka Safar:

**Month 1 — HTML:**
- Week 1-2: HTML basics, tags, links, images, tables
- Week 3-4: Forms, semantics, accessibility

**Month 2 — CSS:**
- Week 5-6: CSS basics, Flexbox, Grid, Responsive
- Week 7-8: Animations, CSS Variables, Dark Mode

**Month 3 — JavaScript:**
- Week 9: Variables, functions, DOM manipulation
- Week 10: Fetch API, Promises, async/await
- Week 11: OOP, Modules, Performance patterns
- Week 12: Final Capstone + Certificate 🎓

### JavaScript Quick Reference:

\`\`\`javascript
// Variables
const name  = 'Rahul';    // immutable
let   count = 0;          // mutable

// Arrow functions
const greet  = name => \`Hello \${name}!\`;
const double = n    => n * 2;
const isEven = n    => n % 2 === 0;

// Array methods
const nums    = [1, 2, 3, 4, 5];
const evens   = nums.filter(n => n % 2 === 0);   // [2,4]
const doubled = nums.map(n => n * 2);             // [2,4,6,8,10]
const sum     = nums.reduce((acc, n) => acc + n, 0); // 15
const found   = nums.find(n => n > 3);            // 4

// DOM
const el = document.querySelector('#myEl');
el.textContent = 'New text';
el.classList.toggle('active');
el.addEventListener('click', () => doSomething());

// Async/Await
async function getData(url) {
  try {
    const res  = await fetch(url);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

// Classes
class Student {
  constructor(name, course) {
    this.name   = name;
    this.course = course;
    this.xp     = 0;
  }
  addXP(n) { this.xp += n; return this; }
  get level() { return Math.floor(this.xp / 100) + 1; }
  toString() { return \`\${this.name} | Lv\${this.level} | \${this.xp}XP\`; }
}

// localStorage helpers
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
\`\`\``,
      content_en: `## Month 3 Complete! You Are a JavaScript Master! 🎉

### Three-Month Journey:
- **Month 1:** HTML — structure, tags, forms, semantics
- **Month 2:** CSS — Flexbox, Grid, animations, CSS variables, dark mode
- **Month 3:** JavaScript — DOM, Fetch API, OOP, modules, async/await

### JavaScript Quick Reference:

\`\`\`javascript
const greet  = name => \`Hello \${name}!\`;
const evens  = [1,2,3,4].filter(n => n%2===0);
const sum    = [1,2,3].reduce((acc,n) => acc+n, 0);

async function getData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

class Student {
  constructor(name) { this.name = name; this.xp = 0; }
  addXP(n) { this.xp += n; return this; }
  get level() { return Math.floor(this.xp/100)+1; }
}

const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k,d) => JSON.parse(localStorage.getItem(k)||JSON.stringify(d));
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Month 3 Review Quiz</title>
  <style>
    :root { --bg:#0f172a; --bg2:#1e293b; --text:#e2e8f0; --muted:#64748b; --primary:#6366f1; --accent:#a78bfa; --green:#10b981; --red:#ef4444; --amber:#f59e0b; --border:rgba(255,255,255,0.08); }
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:Arial,sans-serif;background:var(--bg);color:var(--text);padding:24px;}
    h2{color:var(--primary);margin:20px 0 12px;font-size:18px;}
    .card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:16px;}
    .weeks{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;}
    .wk{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:14px;}
    .wk-n{color:var(--primary);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}
    .wk-t{font-size:14px;font-weight:700;margin-bottom:8px;}
    .wk ul{list-style:none;}
    .wk li{font-size:12px;color:var(--muted);padding:2px 0;}
    .wk li::before{content:"✓ ";color:var(--green);}
    .opt{display:block;width:100%;text-align:left;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:10px 14px;border-radius:8px;margin:5px 0;cursor:pointer;font-size:14px;transition:all 0.2s;}
    .opt:hover{border-color:var(--primary);}
    .opt.ok{background:rgba(16,185,129,0.1);border-color:var(--green);color:var(--green);}
    .opt.ng{background:rgba(239,68,68,0.1);border-color:var(--red);color:var(--red);}
    .res{padding:10px;border-radius:8px;margin-top:8px;font-size:13px;display:none;}
    .res.ok{background:rgba(16,185,129,0.1);color:var(--green);display:block;}
    .res.ng{background:rgba(239,68,68,0.1);color:var(--red);display:block;}
    button{background:var(--primary);color:white;border:none;padding:9px 18px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;margin-top:8px;transition:all 0.2s;}
    button:hover{opacity:0.85;}
    .skill-row{display:flex;align-items:center;gap:10px;margin:8px 0;}
    .skill-name{font-size:13px;min-width:130px;color:var(--muted);}
    .skill-bar{flex:1;height:7px;background:var(--border);border-radius:99px;overflow:hidden;}
    .skill-fill{height:100%;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:99px;width:0;transition:width 1.2s ease;}
    .skill-pct{font-size:12px;color:var(--primary);font-weight:700;min-width:34px;text-align:right;}
  </style>
</head>
<body>

<h1 style="font-size:24px;margin-bottom:4px;">🔄 Month 3 — JS Review</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:20px;">Teen mahine ka safar — ek nazar mein!</p>

<div class="card">
  <h2>📚 Teen Mahine ka Syllabus</h2>
  <div class="weeks">
    <div class="wk"><div class="wk-n">Month 1</div><div class="wk-t">HTML</div><ul><li>Tags & Structure</li><li>Forms & Input</li><li>Semantics</li><li>Accessibility</li></ul></div>
    <div class="wk"><div class="wk-n">Month 2</div><div class="wk-t">CSS</div><ul><li>Flexbox & Grid</li><li>Responsive</li><li>Animations</li><li>CSS Variables</li></ul></div>
    <div class="wk"><div class="wk-n">Week 9-10</div><div class="wk-t">JS Basics + API</div><ul><li>Variables/Functions</li><li>DOM Events</li><li>Fetch + async/await</li><li>To-Do + Weather App</li></ul></div>
    <div class="wk"><div class="wk-n">Week 11-12</div><div class="wk-t">Advanced JS</div><ul><li>OOP & Classes</li><li>Modules & Patterns</li><li>Performance</li><li>Final Portfolio 🎓</li></ul></div>
  </div>
</div>

<div class="card">
  <h2>📊 Skills Progress</h2>
  <div id="skillsDiv">
    <div class="skill-row"><span class="skill-name">HTML Structure</span><div class="skill-bar"><div class="skill-fill" data-w="95"></div></div><span class="skill-pct">95%</span></div>
    <div class="skill-row"><span class="skill-name">CSS Styling</span><div class="skill-bar"><div class="skill-fill" data-w="88"></div></div><span class="skill-pct">88%</span></div>
    <div class="skill-row"><span class="skill-name">Flexbox + Grid</span><div class="skill-bar"><div class="skill-fill" data-w="85"></div></div><span class="skill-pct">85%</span></div>
    <div class="skill-row"><span class="skill-name">JS Basics</span><div class="skill-bar"><div class="skill-fill" data-w="80"></div></div><span class="skill-pct">80%</span></div>
    <div class="skill-row"><span class="skill-name">Async / Fetch</span><div class="skill-bar"><div class="skill-fill" data-w="72"></div></div><span class="skill-pct">72%</span></div>
    <div class="skill-row"><span class="skill-name">OOP & Classes</span><div class="skill-bar"><div class="skill-fill" data-w="68"></div></div><span class="skill-pct">68%</span></div>
    <div class="skill-row"><span class="skill-name">Performance</span><div class="skill-bar"><div class="skill-fill" data-w="60"></div></div><span class="skill-pct">60%</span></div>
  </div>
</div>

<div class="card">
  <h2>🧠 Quick Quiz</h2>
  <div id="qBox"><p id="qText" style="font-size:15px;margin-bottom:12px;"></p><div id="qOpts"></div><div class="res" id="qRes"></div><button id="nextBtn" onclick="nextQ()" style="display:none;">Next →</button></div>
  <p id="qDone" style="display:none;color:var(--green);font-weight:700;font-size:16px;margin-top:12px;"></p>
</div>

<script>
  setTimeout(() => document.querySelectorAll('.skill-fill').forEach(el => el.style.width = el.dataset.w + '%'), 400);

  const qs = [
    { q:'[1,2,3,4].filter(n => n > 2) returns?', opts:['[1,2]','[3,4]','[1,2,3]','undefined'], c:1 },
    { q:'async/await mein errors handle karne ke liye?', opts:['if/else','try/catch','switch','throw sirf'], c:1 },
    { q:'localStorage mein array save karne ke liye?', opts:['setItem("k",arr)','setItem("k",JSON.stringify(arr))','saveArray(arr)','direct store hota hai'], c:1 },
    { q:'new Student() ke baad — instanceof Student returns?', opts:['undefined','false','true','null'], c:2 },
    { q:'debounce search mein kyun use karte hain?', opts:['Speed ke liye','Har keystroke pe API call rokne ke liye','Disable karne ke liye','Autocomplete ke liye'], c:1 },
  ];
  let qi = 0, score = 0;
  function loadQ() {
    if (qi >= qs.length) { document.getElementById('qBox').style.display='none'; const d=document.getElementById('qDone'); d.style.display='block'; d.textContent='Score: '+score+'/'+qs.length+(score===qs.length?' 🌟':score>=3?' 😊':' 💪'); return; }
    const q = qs[qi];
    document.getElementById('qText').textContent = (qi+1)+'/'+qs.length+': '+q.q;
    document.getElementById('qOpts').innerHTML = q.opts.map((o,i)=>'<button class="opt" onclick="ans('+i+')">'+o+'</button>').join('');
    document.getElementById('qRes').className='res';
    document.getElementById('nextBtn').style.display='none';
  }
  function ans(i) {
    const q=qs[qi]; document.querySelectorAll('.opt').forEach(b=>b.onclick=null);
    document.querySelectorAll('.opt')[q.c].classList.add('ok');
    const res=document.getElementById('qRes');
    if (i!==q.c) { document.querySelectorAll('.opt')[i].classList.add('ng'); res.className='res ng'; res.textContent='❌ Wrong! Correct: '+q.opts[q.c]; }
    else { score++; res.className='res ok'; res.textContent='✅ Correct!'; }
    document.getElementById('nextBtn').style.display='inline-block';
  }
  function nextQ() { qi++; loadQ(); }
  loadQ();
</script>
</body>
</html>`,
      codeExample_en: `<!-- See above — English content is integrated -->`,
      task: {
        description: 'Review karo: (1) Ek JS cheatsheet page banao — variables, functions, array methods, DOM, async, classes sab ek page pe examples ke saath. (2) Apne Week 9/10/11 projects revisit karo aur koi ek feature add karo har ek mein. (3) Console mein sab key concepts test karo.',
        description_en: 'Review: (1) Build a JS cheatsheet page — variables, functions, array methods, DOM, async, classes all on one page with examples. (2) Revisit your Week 9/10/11 projects and add one new feature to each. (3) Test all key concepts in the console.',
        hint: 'Cheatsheet: har concept ke liye naam, 1-line explanation, aur runnable example. Array methods: map, filter, reduce, find, every, some, sort. DOM: querySelector, classList, addEventListener, createElement.',
        hint_en: 'Cheatsheet: for each concept include name, 1-line explanation, and runnable example. Array methods: map, filter, reduce, find, every, some, sort. DOM: querySelector, classList, addEventListener, createElement.',
      },
      quiz: [
        {
          q: 'Teen mahine mein kaunsi teen technologies seekhi?',
          options: ['HTML only','HTML + CSS','HTML + CSS + JavaScript','HTML + CSS + JS + React'],
          correct: 2,
          explanation: 'Month 1: HTML (structure). Month 2: CSS (style — Flexbox, Grid, animations, variables). Month 3: JavaScript (interactivity — DOM, Fetch API, OOP, async/await). Yeh web development ka solid foundation hai!',
          q_en: 'Which three technologies were learned over three months?',
          options_en: ['HTML only','HTML + CSS','HTML + CSS + JavaScript','HTML + CSS + JS + React'],
          explanation_en: 'Month 1: HTML (structure). Month 2: CSS (Flexbox, Grid, animations, variables). Month 3: JavaScript (DOM, Fetch API, OOP, async/await). This is the solid foundation of web development!',
        },
        {
          q: 'Course complete karne ke baad next logical step?',
          options: ['PHP seekhna','React.js ya Vue.js — component-based frameworks','Database sirf','Mobile apps'],
          correct: 1,
          explanation: 'Web dev roadmap: HTML → CSS → JavaScript → React/Vue → Node.js → Database → Full-stack! React especially popular hai — 80%+ companies use karti hain.',
          q_en: 'What is the next logical step after completing this course?',
          options_en: ['Learn PHP','React.js or Vue.js — component-based frameworks','Only databases','Mobile apps'],
          explanation_en: 'Web dev roadmap: HTML → CSS → JavaScript → React/Vue → Node.js → Database → Full-stack! React is especially popular — used by 80%+ of companies.',
        },
        {
          q: 'Portfolio mein sabse important kya hona chahiye?',
          options: ['Sirf naam aur photo','About + Projects (live demo + GitHub) + Skills + Contact','Sirf skills list','Sirf social links'],
          correct: 1,
          explanation: 'Recruiter checklist: About, minimum 3 real projects (live demo + GitHub), skills list, contact info. Real projects > certificates. Always deploy and link!',
          q_en: 'What is the most important thing in a portfolio?',
          options_en: ['Only name and photo','About + Projects (live demo + GitHub) + Skills + Contact','Only a skills list','Only social links'],
          explanation_en: 'Recruiter checklist: About, minimum 3 real projects (live demo + GitHub), skills list, contact info. Real projects > certificates. Always deploy and share links!',
        },
      ],
    },

    {
      id: 'html-w12-s2',
      title: 'Capstone — Complete Portfolio Website',
      title_en: 'Capstone — Complete Portfolio Website',
      emoji: '💼',
      content: `## Final Capstone — Sab Kuch Ek Project Mein!

### Portfolio ke 7 Sections:

\`\`\`
1. Navbar    → sticky, dark/light toggle, smooth scroll
2. Hero      → animated, typing effect, CTA buttons
3. About     → bio, photo, quick facts
4. Projects  → card grid, live demo + GitHub links
5. Skills    → animated progress bars
6. Contact   → validated form
7. Footer    → social links
\`\`\`

### JavaScript Features — Step by Step:

\`\`\`javascript
// ── 1. Smooth Scroll ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

// ── 2. Active Nav on Scroll ───────────────────────────────
const sections = document.querySelectorAll('section[id]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelector(\`a[href="#\${e.target.id}"]\`)?.classList.add('active');
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => observer.observe(s));

// ── 3. Scroll-triggered Animations ───────────────────────
const animObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      animObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('[data-anim]').forEach(el => animObs.observe(el));

// ── 4. Skill Bars ─────────────────────────────────────────
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width;
      barObs.unobserve(e.target);
    }
  });
});
document.querySelectorAll('.skill-fill[data-width]').forEach(b => barObs.observe(b));

// ── 5. Typing Effect ──────────────────────────────────────
const roles = ['Frontend Developer', 'HTML/CSS Expert', 'JavaScript Learner', 'Creative Builder'];
let ri = 0, ci = 0, del = false;
const typeEl = document.querySelector('#typing');

function type() {
  const role = roles[ri];
  typeEl.textContent = del ? role.slice(0, ci--) : role.slice(0, ci++);
  if (!del && ci > role.length)  { del = true;  setTimeout(type, 1500); return; }
  if (del  && ci < 0)            { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 300); return; }
  setTimeout(type, del ? 50 : 100);
}
type();

// ── 6. Dark Mode Toggle ───────────────────────────────────
const theme = localStorage.getItem('portfolio-theme') || 'dark';
document.documentElement.setAttribute('data-theme', theme);

document.querySelector('#theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  document.querySelector('#theme-toggle').textContent = next === 'dark' ? '🌙' : '☀️';
});

// ── 7. Contact Form Validation ────────────────────────────
document.querySelector('#contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const name  = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const msg   = e.target.message.value.trim();
  if (!name)            { showErr('name', 'Name required!');   return; }
  if (!email.includes('@')) { showErr('email', 'Valid email!'); return; }
  if (msg.length < 10)  { showErr('message', 'Min 10 chars!'); return; }
  showSuccess('✅ Message sent! Will reply in 24 hours.');
  e.target.reset();
});
\`\`\`

### Final Checklist:

\`\`\`
HTML:   ✅ Semantic tags  ✅ Alt text  ✅ Meta description
CSS:    ✅ Variables  ✅ Dark mode  ✅ Responsive  ✅ Animations
JS:     ✅ Smooth scroll  ✅ Scroll animations  ✅ Form validation
Deploy: ✅ GitHub repo  ✅ Netlify/Vercel live  ✅ LinkedIn share
\`\`\``,
      content_en: `## Final Capstone — Everything in One Project!

### Portfolio — 7 Sections:
Navbar → Hero → About → Projects → Skills → Contact → Footer

### Key JavaScript:

\`\`\`javascript
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'}); });
});

// Scroll animations
const obs = new IntersectionObserver(entries =>
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
  { threshold: 0.1 }
);
document.querySelectorAll('[data-anim]').forEach(el => obs.observe(el));

// Typing effect
const roles = ['Frontend Dev','HTML/CSS Expert','JS Learner'];
let ri=0,ci=0,del=false;
function type() {
  const r=roles[ri];
  typeEl.textContent = del ? r.slice(0,ci--) : r.slice(0,ci++);
  if (!del&&ci>r.length) { del=true; setTimeout(type,1500); return; }
  if (del&&ci<0) { del=false; ri=(ri+1)%roles.length; setTimeout(type,300); return; }
  setTimeout(type, del?50:100);
}
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio — Web Developer</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --font:'Inter',sans-serif;
      --s3:12px;--s4:16px;--s6:24px;--s8:32px;--s12:48px;--s16:64px;
      --r-md:10px;--r-lg:16px;--r-xl:24px;--r-full:9999px;
      --t:all 0.25s ease;--t-b:all 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    [data-theme="dark"] {
      --bg:#0f172a;--bg2:#1e293b;--text:#e2e8f0;--muted:#64748b;
      --primary:#6366f1;--accent:#a78bfa;--pink:#ec4899;
      --border:rgba(255,255,255,0.08);--shadow:0 4px 24px rgba(0,0,0,0.4);
      --glow:0 0 40px rgba(99,102,241,0.2);
    }
    [data-theme="light"] {
      --bg:#f8fafc;--bg2:#ffffff;--text:#1e293b;--muted:#64748b;
      --primary:#6366f1;--accent:#8b5cf6;--pink:#ec4899;
      --border:rgba(0,0,0,0.08);--shadow:0 4px 24px rgba(0,0,0,0.08);
      --glow:0 0 40px rgba(99,102,241,0.15);
    }
    :where(*){margin:0;padding:0;box-sizing:border-box;}
    html{scroll-behavior:smooth;}
    body{font-family:var(--font);background:var(--bg);color:var(--text);transition:background 0.4s,color 0.4s;}
    :focus-visible{outline:3px solid var(--primary);outline-offset:2px;}

    /* NAV */
    nav{position:sticky;top:0;z-index:100;background:rgba(15,23,42,0.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:0 var(--s6);height:64px;display:flex;justify-content:space-between;align-items:center;}
    [data-theme="light"] nav{background:rgba(248,250,252,0.92);}
    .logo{font-size:18px;font-weight:800;background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
    .nav-links{display:flex;gap:var(--s6);list-style:none;}
    .nav-links a{color:var(--muted);text-decoration:none;font-size:14px;font-weight:500;transition:color 0.2s;padding-bottom:2px;border-bottom:2px solid transparent;}
    .nav-links a:hover,.nav-links a.active{color:var(--text);border-bottom-color:var(--primary);}
    .theme-btn{background:var(--bg2);border:1px solid var(--border);color:var(--text);width:36px;height:36px;border-radius:var(--r-full);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:var(--t-b);}
    .theme-btn:hover{transform:scale(1.15) rotate(15deg);border-color:var(--primary);}

    /* HERO */
    .hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:var(--s16) var(--s6);background:linear-gradient(-45deg,#0f172a,#1e1b4b,#312e81,#1e1b4b);background-size:400% 400%;animation:grad 12s ease infinite;position:relative;overflow:hidden;}
    [data-theme="light"] .hero{background:linear-gradient(-45deg,#f0f4ff,#e0e7ff,#ddd6fe,#e0e7ff);}
    @keyframes grad{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
    .hero-content{position:relative;z-index:1;max-width:600px;}
    .avatar{width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:inline-flex;align-items:center;justify-content:center;font-size:40px;margin-bottom:var(--s6);animation:float 4s ease infinite;}
    @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
    .hero h1{font-size:clamp(32px,6vw,64px);font-weight:800;color:white;line-height:1.1;margin-bottom:var(--s3);}
    [data-theme="light"] .hero h1{color:var(--text);}
    .typing-wrap{font-size:clamp(16px,3vw,22px);color:rgba(255,255,255,0.75);margin-bottom:var(--s6);}
    [data-theme="light"] .typing-wrap{color:var(--muted);}
    #typing{color:var(--accent);}
    .cursor{animation:blink 1s infinite;}@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
    .hero-p{color:rgba(255,255,255,0.65);font-size:16px;max-width:480px;margin:0 auto var(--s8);line-height:1.7;}
    [data-theme="light"] .hero-p{color:var(--muted);}
    .hero-btns{display:flex;gap:var(--s4);flex-wrap:wrap;justify-content:center;}
    .btn{padding:13px 28px;border-radius:var(--r-md);font-weight:700;font-size:15px;cursor:pointer;text-decoration:none;border:none;transition:var(--t-b);}
    .btn-p{background:var(--primary);color:white;}
    .btn-p:hover{background:#818cf8;transform:translateY(-3px);box-shadow:var(--glow);}
    .btn-o{background:rgba(255,255,255,0.08);color:white;border:1px solid rgba(255,255,255,0.2);}
    .btn-o:hover{background:rgba(255,255,255,0.15);transform:translateY(-3px);}
    [data-theme="light"] .btn-o{color:var(--text);background:rgba(0,0,0,0.05);border-color:rgba(0,0,0,0.12);}

    /* SECTIONS */
    section{padding:var(--s16) var(--s6);}
    .sec-inner{max-width:1000px;margin:0 auto;}
    .sec-head{text-align:center;margin-bottom:var(--s12);}
    .sec-head h2{font-size:clamp(24px,4vw,36px);font-weight:800;margin-bottom:8px;}
    .sec-head p{color:var(--muted);font-size:16px;}
    .alt-bg{background:var(--bg2);}

    /* PROJECTS */
    .proj-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:var(--s6);}
    .proj-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xl);overflow:hidden;transition:var(--t);}
    [data-theme="light"] .proj-card{background:var(--bg2);}
    .proj-card:hover{transform:translateY(-8px);box-shadow:var(--glow);border-color:var(--primary);}
    .proj-thumb{height:160px;display:flex;align-items:center;justify-content:center;font-size:56px;}
    .proj-body{padding:var(--s6);}
    .proj-title{font-size:17px;font-weight:700;margin-bottom:6px;}
    .proj-desc{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:var(--s4);}
    .proj-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:var(--s4);}
    .proj-tag{background:rgba(99,102,241,0.12);color:var(--accent);padding:3px 10px;border-radius:var(--r-full);font-size:11px;font-weight:600;}
    .proj-links{display:flex;gap:8px;}
    .proj-link{flex:1;text-align:center;padding:8px 12px;border-radius:var(--r-md);font-size:13px;font-weight:600;text-decoration:none;transition:var(--t);}
    .proj-link.demo{background:var(--primary);color:white;}
    .proj-link.demo:hover{background:#818cf8;transform:translateY(-1px);}
    .proj-link.code{background:rgba(99,102,241,0.1);color:var(--primary);border:1px solid rgba(99,102,241,0.2);}
    .proj-link.code:hover{background:rgba(99,102,241,0.2);}

    /* SKILLS */
    .skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--s6);}
    .skill-group h3{font-size:15px;font-weight:700;margin-bottom:var(--s4);color:var(--accent);}
    .skill-item{margin-bottom:14px;}
    .skill-top{display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;}
    .skill-top span:last-child{color:var(--primary);font-weight:600;}
    .skill-bar{height:6px;background:var(--border);border-radius:var(--r-full);overflow:hidden;}
    .skill-fill{height:100%;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:var(--r-full);width:0;transition:width 1.2s ease;}

    /* CONTACT */
    .contact-wrap{display:grid;grid-template-columns:1fr 1fr;gap:var(--s8);}
    .contact-info h3{font-size:20px;font-weight:700;margin-bottom:var(--s3);}
    .contact-info p{color:var(--muted);line-height:1.7;margin-bottom:var(--s6);}
    .social-links{display:flex;gap:10px;}
    .social-btn{background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:10px 16px;border-radius:var(--r-md);text-decoration:none;font-size:13px;font-weight:600;transition:var(--t);}
    .social-btn:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-2px);}
    .cf input,.cf textarea{width:100%;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:12px 16px;border-radius:var(--r-md);font-size:14px;outline:none;font-family:var(--font);margin-bottom:12px;transition:border-color 0.2s;}
    .cf input:focus,.cf textarea:focus{border-color:var(--primary);}
    .cf textarea{resize:vertical;min-height:120px;}
    .cf-btn{width:100%;background:var(--primary);color:white;border:none;padding:13px;border-radius:var(--r-md);font-size:15px;font-weight:700;cursor:pointer;transition:var(--t-b);}
    .cf-btn:hover{background:#818cf8;transform:translateY(-2px);box-shadow:var(--glow);}
    .cf-msg{padding:10px 14px;border-radius:var(--r-md);margin-top:8px;font-size:14px;display:none;}
    .cf-msg.ok{background:rgba(16,185,129,0.1);color:#10b981;display:block;}
    .cf-msg.ng{background:rgba(239,68,68,0.1);color:#ef4444;display:block;}

    /* FOOTER */
    footer{background:var(--bg2);border-top:1px solid var(--border);padding:var(--s8) var(--s6);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--s4);}
    footer p{color:var(--muted);font-size:14px;}

    /* ANIMATIONS */
    [data-anim]{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease, transform 0.7s ease;}
    [data-anim].visible{opacity:1;transform:none;}
    [data-anim="left"]{transform:translateX(-30px);}
    [data-anim="left"].visible{transform:none;}
    [data-anim="right"]{transform:translateX(30px);}
    [data-anim="right"].visible{transform:none;}

    @media(max-width:640px){.nav-links{display:none;}.contact-wrap{grid-template-columns:1fr;}.hero h1{font-size:32px;}}
  </style>
</head>
<body>

<!-- NAVBAR -->
<nav>
  <div class="logo">Portfolio.dev</div>
  <ul class="nav-links">
    <li><a href="#about"    class="nav-link">About</a></li>
    <li><a href="#projects" class="nav-link">Projects</a></li>
    <li><a href="#skills"   class="nav-link">Skills</a></li>
    <li><a href="#contact"  class="nav-link">Contact</a></li>
  </ul>
  <button class="theme-btn" id="theme-toggle" title="Toggle theme">🌙</button>
</nav>

<!-- HERO -->
<section class="hero" id="hero">
  <div class="hero-content">
    <div class="avatar">👨‍💻</div>
    <h1>Hi, I'm <span style="background:linear-gradient(135deg,#a78bfa,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Rahul</span></h1>
    <div class="typing-wrap"><span id="typing"></span><span class="cursor">|</span></div>
    <p class="hero-p">HTML, CSS, aur JavaScript seekhkar websites banata hoon. StudyEarn AI se complete web dev journey complete ki! 🚀</p>
    <div class="hero-btns">
      <a href="#projects" class="btn btn-p">🚀 Projects Dekho</a>
      <a href="#contact"  class="btn btn-o">📩 Contact Karo</a>
    </div>
  </div>
</section>

<!-- ABOUT -->
<section id="about" class="alt-bg">
  <div class="sec-inner">
    <div class="sec-head" data-anim>
      <h2>About Me</h2>
      <p>Mera coding journey aur mission</p>
    </div>
    <div style="max-width:600px;margin:0 auto;text-align:center;" data-anim>
      <p style="font-size:16px;line-height:1.8;color:var(--muted);margin-bottom:var(--s6);">
        Main ek passionate web developer hoon jo HTML, CSS, aur JavaScript se websites banata hoon.
        StudyEarn AI pe 3 mahine ki journey mein maine frontend development ka solid foundation banaya.
        Ab main real-world projects banakar apna portfolio grow kar raha hoon! 💪
      </p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px 24px;text-align:center;">
          <div style="font-size:28px;font-weight:800;color:var(--primary);">3</div>
          <div style="font-size:12px;color:var(--muted);">Months Learning</div>
        </div>
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px 24px;text-align:center;">
          <div style="font-size:28px;font-weight:800;color:var(--accent);">5+</div>
          <div style="font-size:12px;color:var(--muted);">Projects Built</div>
        </div>
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px 24px;text-align:center;">
          <div style="font-size:28px;font-weight:800;color:var(--pink);">12</div>
          <div style="font-size:12px;color:var(--muted);">Weeks Completed</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PROJECTS -->
<section id="projects">
  <div class="sec-inner">
    <div class="sec-head" data-anim>
      <h2>Projects</h2>
      <p>Real projects jo maine banaye</p>
    </div>
    <div class="proj-grid">
      <div class="proj-card" data-anim>
        <div class="proj-thumb" style="background:linear-gradient(135deg,#1e1b4b,#312e81);">✅</div>
        <div class="proj-body">
          <div class="proj-title">Interactive To-Do App</div>
          <div class="proj-desc">JavaScript DOM manipulation se bana. localStorage mein save hota hai. Filter, add, delete features.</div>
          <div class="proj-tags"><span class="proj-tag">HTML</span><span class="proj-tag">CSS</span><span class="proj-tag">JavaScript</span></div>
          <div class="proj-links"><a href="#" class="proj-link demo">🔗 Live Demo</a><a href="#" class="proj-link code">💻 GitHub</a></div>
        </div>
      </div>
      <div class="proj-card" data-anim>
        <div class="proj-thumb" style="background:linear-gradient(135deg,#0f2d2b,#065f46);">🌤️</div>
        <div class="proj-body">
          <div class="proj-title">Weather App</div>
          <div class="proj-desc">OpenWeather API se real-time data. Fetch + async/await. City search, 5-day forecast.</div>
          <div class="proj-tags"><span class="proj-tag">Fetch API</span><span class="proj-tag">async/await</span><span class="proj-tag">JSON</span></div>
          <div class="proj-links"><a href="#" class="proj-link demo">🔗 Live Demo</a><a href="#" class="proj-link code">💻 GitHub</a></div>
        </div>
      </div>
      <div class="proj-card" data-anim>
        <div class="proj-thumb" style="background:linear-gradient(135deg,#2d1515,#7f1d1d);">📝</div>
        <div class="proj-body">
          <div class="proj-title">Notes App</div>
          <div class="proj-desc">OOP + Module pattern se. Tags, colors, pin, search. localStorage sync. Debounced search.</div>
          <div class="proj-tags"><span class="proj-tag">OOP</span><span class="proj-tag">Modules</span><span class="proj-tag">localStorage</span></div>
          <div class="proj-links"><a href="#" class="proj-link demo">🔗 Live Demo</a><a href="#" class="proj-link code">💻 GitHub</a></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SKILLS -->
<section id="skills" class="alt-bg">
  <div class="sec-inner">
    <div class="sec-head" data-anim>
      <h2>Skills</h2>
      <p>Technologies jo main use karta hoon</p>
    </div>
    <div class="skills-grid">
      <div class="skill-group" data-anim="left">
        <h3>🌐 Frontend</h3>
        <div class="skill-item"><div class="skill-top"><span>HTML5</span><span>95%</span></div><div class="skill-bar"><div class="skill-fill" data-width="95%"></div></div></div>
        <div class="skill-item"><div class="skill-top"><span>CSS3</span><span>88%</span></div><div class="skill-bar"><div class="skill-fill" data-width="88%"></div></div></div>
        <div class="skill-item"><div class="skill-top"><span>JavaScript</span><span>78%</span></div><div class="skill-bar"><div class="skill-fill" data-width="78%"></div></div></div>
        <div class="skill-item"><div class="skill-top"><span>Responsive Design</span><span>85%</span></div><div class="skill-bar"><div class="skill-fill" data-width="85%"></div></div></div>
      </div>
      <div class="skill-group" data-anim="right">
        <h3>🛠️ Tools & Concepts</h3>
        <div class="skill-item"><div class="skill-top"><span>CSS Flexbox + Grid</span><span>90%</span></div><div class="skill-bar"><div class="skill-fill" data-width="90%"></div></div></div>
        <div class="skill-item"><div class="skill-top"><span>Fetch API</span><span>72%</span></div><div class="skill-bar"><div class="skill-fill" data-width="72%"></div></div></div>
        <div class="skill-item"><div class="skill-top"><span>OOP / Classes</span><span>65%</span></div><div class="skill-bar"><div class="skill-fill" data-width="65%"></div></div></div>
        <div class="skill-item"><div class="skill-top"><span>Git / GitHub</span><span>60%</span></div><div class="skill-bar"><div class="skill-fill" data-width="60%"></div></div></div>
      </div>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section id="contact">
  <div class="sec-inner">
    <div class="sec-head" data-anim>
      <h2>Contact</h2>
      <p>Baat karte hain!</p>
    </div>
    <div class="contact-wrap">
      <div class="contact-info" data-anim="left">
        <h3>Milte Hain! 👋</h3>
        <p>Koi project idea hai, collaboration chahiye, ya sirf hi karna hai? Message karo! Main 24 ghante mein reply karta hoon.</p>
        <div class="social-links">
          <a href="#" class="social-btn">💼 LinkedIn</a>
          <a href="#" class="social-btn">🐙 GitHub</a>
          <a href="#" class="social-btn">🐦 Twitter</a>
        </div>
      </div>
      <div data-anim="right">
        <form class="cf" id="contact-form">
          <input type="text"  name="name"    placeholder="Tumhara naam *" required>
          <input type="email" name="email"   placeholder="Email address *" required>
          <input type="text"  name="subject" placeholder="Subject">
          <textarea           name="message" placeholder="Message likhho... (min 10 chars)" required></textarea>
          <button type="submit" class="cf-btn">Send Message 📩</button>
          <div class="cf-msg" id="cf-msg"></div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <p>© 2024 Rahul | Made with HTML + CSS + JS ❤️ | StudyEarn AI Graduate 🎓</p>
  <p style="color:var(--primary);">Web Developer · JavaScript Enthusiast</p>
</footer>

<script>
  // Theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('theme-toggle').textContent = savedTheme === 'dark' ? '🌙' : '☀️';
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    document.getElementById('theme-toggle').textContent = next === 'dark' ? '🌙' : '☀️';
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' }); });
  });

  // Active nav
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('a[href="#' + e.target.id + '"]')?.classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('section[id]').forEach(s => navObs.observe(s));

  // Scroll animations
  const animObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); animObs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-anim]').forEach(el => animObs.observe(el));

  // Skill bars
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.width; barObs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.skill-fill[data-width]').forEach(b => barObs.observe(b));

  // Typing
  const roles = ['Frontend Developer', 'HTML/CSS Expert', 'JavaScript Developer', 'Creative Builder'];
  let ri = 0, ci = 0, del = false;
  const typeEl = document.querySelector('#typing');
  function type() {
    const role = roles[ri];
    typeEl.textContent = del ? role.slice(0, ci--) : role.slice(0, ci++);
    if (!del && ci > role.length)  { del = true;  setTimeout(type, 1500); return; }
    if (del  && ci < 0)            { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 300); return; }
    setTimeout(type, del ? 50 : 100);
  }
  type();

  // Contact form
  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const name  = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const msg   = e.target.message.value.trim();
    const cfMsg = document.getElementById('cf-msg');
    if (!name)               { cfMsg.className='cf-msg ng'; cfMsg.textContent='⚠️ Name required!'; return; }
    if (!email.includes('@')){ cfMsg.className='cf-msg ng'; cfMsg.textContent='⚠️ Valid email chahiye!'; return; }
    if (msg.length < 10)     { cfMsg.className='cf-msg ng'; cfMsg.textContent='⚠️ Message min 10 characters hona chahiye!'; return; }
    cfMsg.className='cf-msg ok';
    cfMsg.textContent='✅ Message send ho gaya! 24 ghante mein reply milega.';
    e.target.reset();
    setTimeout(() => { cfMsg.style.display='none'; }, 4000);
  });
</script>
</body>
</html>`,
      codeExample_en: `<!-- See above — English content is fully integrated -->`,
      task: {
        description: 'Apna complete portfolio banao: (1) Sab 7 sections add karo, (2) Apne real projects add karo (To-Do, Weather, Notes App), (3) Smooth scroll + active nav + scroll animations lagao, (4) Skill bars animate karo IntersectionObserver se, (5) Typing effect add karo, (6) Contact form validate karo, (7) Dark/Light mode, (8) Netlify ya GitHub Pages pe deploy karo, (9) GitHub pe push karo, (10) LinkedIn pe share karo!',
        description_en: 'Build your complete portfolio: (1) Add all 7 sections, (2) Add your real projects (To-Do, Weather, Notes), (3) Add smooth scroll + active nav + scroll animations, (4) Animate skill bars with IntersectionObserver, (5) Add a typing effect, (6) Validate the contact form, (7) Dark/Light mode, (8) Deploy on Netlify or GitHub Pages, (9) Push to GitHub, (10) Share on LinkedIn!',
        hint: 'IntersectionObserver: new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); }), {threshold:0.1}). Typing: use setInterval ya recursive setTimeout. Deploy: Netlify mein GitHub repo connect karo — auto-deploy!',
        hint_en: 'IntersectionObserver: new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); }), {threshold:0.1}). Typing: use setInterval or recursive setTimeout. Deploy: connect your GitHub repo to Netlify — auto-deploy!',
      },
      quiz: [
        {
          q: 'IntersectionObserver kyun use karte hain scroll animations ke liye?',
          options: ['Scroll event se better lagta hai','Performance: element viewport mein aaye tabhi callback fire hoti hai — nahi toh CPU waste nahi hota. Scroll event har scroll pe fire hoti hai (throttle bhi karna padta hai).','Scroll events deprecated hain','CSS animations ke liye'],
          correct: 1,
          explanation: 'IntersectionObserver = browser ka built-in solution viewport visibility check karne ke liye. Scroll event listener se zyada efficient hai. Element visible hone pe ek baar callback → animation trigger → unobserve. Pure CSS transitions se bhi combine kar sakte ho.',
          q_en: 'Why use IntersectionObserver for scroll animations?',
          options_en: ['It looks better than scroll events','Performance: the callback only fires when the element enters the viewport — no CPU wasted otherwise. Scroll events fire on every scroll (and need throttling too).','Scroll events are deprecated','For CSS animations'],
          explanation_en: 'IntersectionObserver = browser\'s built-in solution for viewport visibility checks. More efficient than scroll event listeners. Callback fires once when element is visible → trigger animation → unobserve. Can be combined with pure CSS transitions too.',
        },
        {
          q: 'Portfolio deploy karne ke liye best free option?',
          options: ['Sirf local machine pe rakho','Netlify ya GitHub Pages — dono free hain, custom domain support karte hain, aur GitHub se auto-deploy hota hai','Paid hosting zaruri hai','FTP se manually upload karo'],
          correct: 1,
          explanation: 'Netlify: drag-drop deploy ya GitHub connect → push karo → auto-deploy. Free tier mein custom domain, HTTPS, form handling, serverless functions bhi milte hain! GitHub Pages: repo se seedha deploy, perfect for static sites. Dono portfolio ke liye ideal hain.',
          q_en: 'What is the best free option for deploying a portfolio?',
          options_en: ['Keep it only on local machine','Netlify or GitHub Pages — both free, support custom domains, and auto-deploy from GitHub','Paid hosting is required','Manually upload via FTP'],
          explanation_en: 'Netlify: drag-drop deploy or connect GitHub → push → auto-deploy. Free tier includes custom domain, HTTPS, form handling, and serverless functions! GitHub Pages: deploy directly from a repo, perfect for static sites. Both are ideal for portfolios.',
        },
        {
          q: 'Form validation JavaScript mein kyun karni chahiye?',
          options: ['HTML validation sufficient hai','JavaScript validation = better UX (inline errors), custom messages, complex rules. HTML validation = basic fallback. Dono saath use karo.','Sirf backend pe karo','Forms validate nahi karne chahiye'],
          correct: 1,
          explanation: 'HTML validation (required, type="email") = browser-level, basic. JS validation = real-time feedback (type karte waqt), custom error messages, complex rules (password match, phone format). Backend validation bhi zaruri hai (JS bypass ho sakta hai). Best: HTML + JS + Backend.',
          q_en: 'Why should you do form validation in JavaScript?',
          options_en: ['HTML validation is sufficient','JS validation = better UX (inline errors), custom messages, complex rules. HTML = basic fallback. Use both together.','Only do it on the backend','Forms should not be validated'],
          explanation_en: 'HTML validation (required, type="email") = browser-level, basic. JS validation = real-time feedback (while typing), custom error messages, complex rules (password match, phone format). Backend validation is also necessary (JS can be bypassed). Best practice: HTML + JS + Backend.',
        },
      ],
    },

    {
      id: 'html-w12-s3',
      title: 'Course Complete — Certificate Time! 🎓',
      title_en: 'Course Complete — Certificate Time! 🎓',
      emoji: '🏆',
      content: `## Congratulations! 🎉 Course Complete!

### Teen Mahine Mein Kya Seekha — Full Summary:

\`\`\`
MONTH 1 — HTML (Weeks 1-4)
  ✅ HTML5 basics — tags, attributes, nesting
  ✅ Text, headings, paragraphs, lists
  ✅ Links, images, tables
  ✅ Forms — inputs, validation, accessibility
  ✅ Semantic HTML — header, nav, main, footer, article
  ✅ HTML Accessibility — ARIA, screen readers
  ✅ Month 1 Project: Complete HTML Website

MONTH 2 — CSS (Weeks 5-8)
  ✅ CSS basics — selectors, colors, typography, box model
  ✅ CSS Flexbox — direction, align, justify, gap
  ✅ CSS Grid — template areas, auto-fit, responsive
  ✅ Responsive Design — media queries, mobile-first
  ✅ Transitions + Transforms — 2D + 3D
  ✅ @keyframes Animations — stagger, scroll-triggered
  ✅ CSS Variables — design tokens, dark mode
  ✅ Modern Selectors — :is(), :where(), :has()
  ✅ Month 2 Capstone: Professional Animated Website

MONTH 3 — JavaScript (Weeks 9-12)
  ✅ JS Basics — variables, data types, operators
  ✅ Functions — arrow functions, default params
  ✅ Control Flow — if/else, loops, ternary
  ✅ Array Methods — map, filter, reduce, find
  ✅ DOM Manipulation — querySelector, events, classList
  ✅ Fetch API — GET/POST, JSON
  ✅ Promises + async/await — clean async code
  ✅ localStorage — data persistence
  ✅ OOP — Classes, inheritance, destructuring
  ✅ Modules — import/export, IIFE pattern
  ✅ Performance — debounce, throttle, event delegation
  ✅ Final Capstone: Complete Portfolio Website 🎓
\`\`\`

### Next Steps — Career Path:

\`\`\`
Web Dev Roadmap:

HTML ✅ → CSS ✅ → JavaScript ✅
                  ↓
           React.js / Vue.js
          (Frontend Framework)
                  ↓
         Node.js + Express.js
              (Backend)
                  ↓
      MongoDB / PostgreSQL
            (Database)
                  ↓
       Full-Stack Developer
        Salary: ₹4-12 LPA
\`\`\`

### Tumhari Achievements:

\`\`\`
🏆 Course Complete      — 12 weeks, 3 months
🌟 All Quizzes Passed   — 70%+ on every section
💻 Projects Built:
   ✅ HTML Website (Month 1)
   ✅ CSS Portfolio (Month 2)
   ✅ To-Do App (Week 9)
   ✅ Weather App (Week 10)
   ✅ Notes App (Week 11)
   ✅ Final Portfolio (Week 12)
🎓 Certificate Earned!
\`\`\`

### React Seekhne Ke Liye Resources:

\`\`\`
Free:
• React Official Docs: react.dev (best!)
• freeCodeCamp React Course (free)
• Scrimba React Course (interactive)

Paid (worth it):
• Udemy — "React Complete Guide" (sale pe ₹399)
• Zero to Mastery React Course

Practice:
• Build React versions of your JS projects
• Add React to your portfolio gradually
\`\`\``,
      content_en: `## Congratulations! 🎉 Course Complete!

### Three-Month Summary:
- **Month 1 (HTML):** Structure, forms, semantics, accessibility
- **Month 2 (CSS):** Flexbox, Grid, animations, CSS variables, dark mode
- **Month 3 (JavaScript):** DOM, Fetch API, OOP, modules, async/await, portfolio

### Career Path:
HTML ✅ → CSS ✅ → JavaScript ✅ → React.js → Node.js → Full-Stack (₹4–12 LPA)

### Resources for React:
- **react.dev** — official docs (best starting point)
- **freeCodeCamp** — free React course
- **Scrimba** — interactive React course
- **Udemy** — "React Complete Guide" (great value on sale)`,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Course Complete! 🎓</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root { --bg:#0f172a; --bg2:#1e293b; --text:#e2e8f0; --muted:#64748b; --primary:#6366f1; --accent:#a78bfa; --pink:#ec4899; --green:#10b981; --amber:#f59e0b; --border:rgba(255,255,255,0.08); }
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;}
    .page{max-width:640px;width:100%;text-align:center;}

    .celebrate{background:linear-gradient(-45deg,#1e1b4b,#6366f1,#312e81,#a78bfa);background-size:400% 400%;animation:grad 6s ease infinite;border-radius:24px;padding:48px 32px;margin-bottom:24px;position:relative;overflow:hidden;}
    @keyframes grad{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
    .trophy{font-size:72px;display:block;animation:bounce 2s ease infinite;}
    @keyframes bounce{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-16px) rotate(5deg);}}
    .celebrate h1{font-size:36px;font-weight:800;color:white;margin:16px 0 8px;}
    .celebrate p{color:rgba(255,255,255,0.8);font-size:16px;}

    .months{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;}
    .month-card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:20px 12px;animation:fadeUp 0.5s ease both;}
    .month-card:nth-child(1){animation-delay:0.1s;}
    .month-card:nth-child(2){animation-delay:0.2s;}
    .month-card:nth-child(3){animation-delay:0.3s;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}
    .month-emoji{font-size:32px;display:block;margin-bottom:8px;}
    .month-name{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--primary);margin-bottom:4px;}
    .month-title{font-size:14px;font-weight:700;margin-bottom:8px;}
    .month-items{list-style:none;font-size:12px;color:var(--muted);text-align:left;}
    .month-items li{padding:2px 0;}
    .month-items li::before{content:"✓ ";color:var(--green);}

    .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;}
    .stat{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;animation:fadeUp 0.5s ease 0.4s both;}
    .stat-n{font-size:28px;font-weight:800;background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:block;}
    .stat-l{font-size:11px;color:var(--muted);margin-top:2px;}

    .next{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:20px;text-align:left;animation:fadeUp 0.5s ease 0.5s both;}
    .next h3{font-size:16px;font-weight:700;margin-bottom:12px;color:var(--accent);}
    .path{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
    .path-step{background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.2);color:var(--accent);padding:6px 14px;border-radius:var(--r-full,99px);font-size:12px;font-weight:600;white-space:nowrap;}
    .path-step.done{background:rgba(16,185,129,0.1);border-color:rgba(16,185,129,0.2);color:var(--green);}
    .path-arrow{color:var(--muted);font-size:16px;}

    .cert-btn{display:inline-block;background:linear-gradient(135deg,var(--primary),var(--accent));color:white;padding:16px 40px;border-radius:12px;font-weight:800;font-size:16px;text-decoration:none;cursor:pointer;border:none;animation:pulse 2s ease infinite;margin-top:8px;transition:all 0.3s;}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.4);}50%{box-shadow:0 0 0 16px rgba(99,102,241,0);}}
    .cert-btn:hover{transform:translateY(-4px) scale(1.03);}

    @media(max-width:480px){.months{grid-template-columns:1fr;}.stats{grid-template-columns:repeat(3,1fr);}}
  </style>
</head>
<body>
<div class="page">

  <div class="celebrate">
    <span class="trophy">🏆</span>
    <h1>Course Complete!</h1>
    <p>Teen mahine ki mehnat — ab tum Web Developer ho! 🚀</p>
  </div>

  <div class="months">
    <div class="month-card">
      <span class="month-emoji">🌐</span>
      <div class="month-name">Month 1</div>
      <div class="month-title">HTML</div>
      <ul class="month-items"><li>Tags & Structure</li><li>Forms & Input</li><li>Semantics</li><li>Accessibility</li></ul>
    </div>
    <div class="month-card">
      <span class="month-emoji">🎨</span>
      <div class="month-name">Month 2</div>
      <div class="month-title">CSS</div>
      <ul class="month-items"><li>Flexbox & Grid</li><li>Responsive</li><li>Animations</li><li>CSS Variables</li></ul>
    </div>
    <div class="month-card">
      <span class="month-emoji">⚡</span>
      <div class="month-name">Month 3</div>
      <div class="month-title">JavaScript</div>
      <ul class="month-items"><li>DOM & Events</li><li>Fetch API</li><li>OOP & Modules</li><li>Portfolio 🎓</li></ul>
    </div>
  </div>

  <div class="stats">
    <div class="stat"><span class="stat-n">12</span><span class="stat-l">Weeks</span></div>
    <div class="stat"><span class="stat-n">6+</span><span class="stat-l">Projects</span></div>
    <div class="stat"><span class="stat-n">🎓</span><span class="stat-l">Certified</span></div>
  </div>

  <div class="next">
    <h3>🚀 Next Steps — Your Career Path:</h3>
    <div class="path">
      <span class="path-step done">✅ HTML</span>
      <span class="path-arrow">→</span>
      <span class="path-step done">✅ CSS</span>
      <span class="path-arrow">→</span>
      <span class="path-step done">✅ JavaScript</span>
      <span class="path-arrow">→</span>
      <span class="path-step">React.js</span>
      <span class="path-arrow">→</span>
      <span class="path-step">Node.js</span>
      <span class="path-arrow">→</span>
      <span class="path-step">Full-Stack 💰</span>
    </div>
  </div>

  <button class="cert-btn" onclick="alert('🎓 Certificate generate ho rahi hai! Certificate page pe jao.')">
    🎓 Download Certificate →
  </button>

</div>
</body>
</html>`,
      codeExample_en: `<!-- See above — English content is fully integrated -->`,
      task: {
        description: 'Final tasks: (1) Apna portfolio Netlify pe deploy karo — free account banao, GitHub repo connect karo, (2) Portfolio ka link LinkedIn pe share karo with caption: "I just completed 3 months of Web Development on StudyEarn AI! #WebDevelopment #HTML #CSS #JavaScript", (3) GitHub pe saare 6 projects push karo with proper READMEs, (4) React.js official docs padho — react.dev — pehle "Quick Start" section, (5) Ek doosre student ko StudyEarn AI recommend karo!',
        description_en: 'Final tasks: (1) Deploy your portfolio on Netlify — create a free account, connect your GitHub repo, (2) Share your portfolio link on LinkedIn: "I just completed 3 months of Web Development on StudyEarn AI! #WebDevelopment #HTML #CSS #JavaScript", (3) Push all 6 projects to GitHub with proper READMEs, (4) Read the React.js official docs at react.dev — start with the "Quick Start" section, (5) Recommend StudyEarn AI to another student!',
        hint: 'Netlify deploy: netlify.com → "Add new site" → "Import from Git" → GitHub select → repo select → Deploy! Auto-deploy on every push. README: ## Project Name, ## Description, ## Tech Stack, ## Live Demo [link], ## How to Run.',
        hint_en: 'Netlify deploy: netlify.com → "Add new site" → "Import from Git" → select GitHub → select repo → Deploy! Auto-deploys on every push. README: ## Project Name, ## Description, ## Tech Stack, ## Live Demo [link], ## How to Run.',
      },
      quiz: [
        {
          q: 'Course complete karne ke baad portfolio mein kya hona chahiye?',
          options: ['Sirf naam','About + 3+ real projects (live + GitHub) + Skills + Contact — deploye karo!','Sirf certificate upload karo','Sirf skills list'],
          correct: 1,
          explanation: 'Recruiter checklist: About (kaun ho), Projects (minimum 3 — live demo aur GitHub link zaroori!), Skills (technology list), Contact (email/LinkedIn). Deploy karna mandatory hai — local pe rakha project kisi ko kaam nahi aata.',
          q_en: 'What should your portfolio contain after completing the course?',
          options_en: ['Only your name','About + 3+ real projects (live + GitHub) + Skills + Contact — deploy it!','Just upload your certificate','Only a skills list'],
          explanation_en: 'Recruiter checklist: About (who you are), Projects (minimum 3 — live demo and GitHub link required!), Skills (technology list), Contact (email/LinkedIn). Deploying is mandatory — a project sitting on your local machine is useless to anyone else.',
        },
        {
          q: 'React seekhne ke liye best free resource?',
          options: ['Random YouTube videos','react.dev — official documentation. Best structured learning, interactive examples, aur latest React 18+ features.','Paid courses sirf','Facebook groups'],
          correct: 1,
          explanation: 'react.dev = Meta ki official React documentation. 2023 mein complete rewrite hua — ab modern React (hooks, functional components) first-class citizen hai. Quick Start se shuru karo, phir Learn React section. Free, accurate, aur hamesha updated.',
          q_en: 'What is the best free resource for learning React?',
          options_en: ['Random YouTube videos','react.dev — official documentation. Best structured learning, interactive examples, and latest React 18+ features.','Only paid courses','Facebook groups'],
          explanation_en: 'react.dev = Meta\'s official React documentation. It was completely rewritten in 2023 — modern React (hooks, functional components) is now first-class. Start with Quick Start, then the Learn React section. Free, accurate, and always up to date.',
        },
        {
          q: 'GitHub pe portfolio push karna kyun important hai?',
          options: ['Zaruri nahi hai','Recruiters GitHub dekhte hain — active profile = job opportunities. Code history, collaboration, open source contributions — sab yahan hai.','Sirf backup ke liye','Git sirf big companies ke liye'],
          correct: 1,
          explanation: 'GitHub = developer ka resume. Recruiters directly GitHub profile check karte hain. Green contribution graph, pinned repos, good READMEs — yeh sab impress karte hain. Open source contributions — bonus points. Private projects bhi commit history se activity dikhata hai.',
          q_en: 'Why is it important to push your portfolio to GitHub?',
          options_en: ['It is not necessary','Recruiters check GitHub — an active profile means job opportunities. Code history, collaboration, open source — all here.','Only for backup','Git is only for big companies'],
          explanation_en: 'GitHub = a developer\'s resume. Recruiters check GitHub profiles directly. A green contribution graph, pinned repos, and good READMEs all make an impression. Open source contributions = bonus points. Even private projects show activity through commit history.',
        },
      ],
    },

    {
      id: 'html-w12-s4',
      title: 'What\'s Next? — React.js Preview',
      title_en: 'What\'s Next? — React.js Preview',
      emoji: '⚛️',
      content: `## React.js — Agle Level ka Frontend!

### React Kya Hai?

\`\`\`javascript
// Vanilla JS mein — manually DOM update karo
function updateCart(items) {
  document.querySelector('#cart-count').textContent = items.length;
  document.querySelector('#cart-list').innerHTML =
    items.map(i => \`<li>\${i.name} — ₹\${i.price}</li>\`).join('');
  // Har jagah manually update karna padta hai
}

// React mein — state change karo, UI automatically update!
function CartApp() {
  const [items, setItems] = React.useState([]);

  return (
    <div>
      <h2>Cart ({items.length} items)</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name} — ₹{item.price}</li>
        ))}
      </ul>
      <button onClick={() => setItems([...items, newItem])}>
        Add Item
      </button>
    </div>
  );
}
// State change karo → React automatically re-renders the right parts!
\`\`\`

### JSX — HTML in JavaScript

\`\`\`jsx
// JSX = JavaScript + HTML-like syntax
function Greeting({ name, isPremium }) {
  return (
    <div className="card">
      <h1>Hello, {name}!</h1>
      {isPremium && <span className="badge">⭐ Premium</span>}
      <p>Welcome to React!</p>
    </div>
  );
}

// Use karo
<Greeting name="Rahul" isPremium={true} />
\`\`\`

### Hooks — State aur Side Effects

\`\`\`jsx
import { useState, useEffect } from 'react';

function WeatherWidget({ city }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect = componentDidMount equivalent
  useEffect(() => {
    fetch(\`/api/weather?city=\${city}\`)
      .then(r => r.json())
      .then(data => { setWeather(data); setLoading(false); });
  }, [city]);  // city change hone pe re-run karo

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{weather.city}</h2>
      <p>{weather.temp}°C — {weather.condition}</p>
    </div>
  );
}
\`\`\`

### Why React?

\`\`\`
✅ Component-based — reusable UI pieces
✅ Virtual DOM — efficient re-renders
✅ Huge ecosystem — 1000s of libraries
✅ Job market — 80%+ companies use it
✅ React Native — mobile apps bhi!
✅ Next.js — full-stack React
✅ Great community + docs (react.dev)

Companies using React:
Facebook, Instagram, WhatsApp,
Netflix, Airbnb, Uber, Swiggy,
Zomato, Flipkart, Razorpay...
\`\`\`

### Tumhari Journey Kab Shuru Karein:

\`\`\`
Step 1: react.dev → Quick Start (1-2 din)
Step 2: Tutorial: Tic-Tac-Toe banao (2-3 din)
Step 3: Apne JavaScript projects React mein convert karo
Step 4: React Router add karo (multi-page apps)
Step 5: API calls with useEffect
Step 6: State management (Context API / Zustand)
Step 7: Next.js seekho
\`\`\``,
      content_en: `## React.js — Next-Level Frontend!

### What is React?

\`\`\`jsx
// Vanilla JS: manually update DOM everywhere
// React: change state → UI automatically updates!

function CartApp() {
  const [items, setItems] = React.useState([]);
  return (
    <div>
      <h2>Cart ({items.length} items)</h2>
      <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
      <button onClick={() => setItems([...items, newItem])}>Add</button>
    </div>
  );
}
\`\`\`

### JSX + Hooks

\`\`\`jsx
function WeatherWidget({ city }) {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    fetch(\`/api/weather?city=\${city}\`).then(r=>r.json()).then(setWeather);
  }, [city]);
  if (!weather) return <div>Loading...</div>;
  return <div>{weather.city} — {weather.temp}°C</div>;
}
\`\`\`

### Why React?
- Component-based, reusable UI
- Virtual DOM — efficient updates
- Massive ecosystem + great jobs
- React Native for mobile
- Next.js for full-stack`,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>React Preview</title>
  <style>
    :root{--bg:#0f172a;--bg2:#1e293b;--text:#e2e8f0;--muted:#64748b;--primary:#6366f1;--accent:#a78bfa;--green:#10b981;--border:rgba(255,255,255,0.08);}
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:Arial,sans-serif;background:var(--bg);color:var(--text);padding:24px;}
    h2{color:var(--primary);margin:24px 0 12px;font-size:18px;}
    .card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:16px;}
    .compare{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
    .col-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;padding:6px 10px;border-radius:6px;}
    .col-js{background:rgba(245,158,11,0.12);color:#f59e0b;}
    .col-react{background:rgba(99,102,241,0.12);color:var(--accent);}
    pre{background:#020617;border:1px solid var(--border);border-radius:8px;padding:14px;font-size:12px;overflow-x:auto;line-height:1.6;color:#94a3b8;}
    .kw{color:#818cf8;} .fn{color:#34d399;} .str{color:#fbbf24;} .cm{color:#475569;}
    button{background:var(--primary);color:white;border:none;padding:9px 16px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;margin:4px;transition:all 0.2s;}
    button:hover{opacity:0.85;}
    .react-demo{border:2px solid rgba(99,102,241,0.2);border-radius:12px;padding:16px;margin-top:12px;background:rgba(99,102,241,0.03);}
    .demo-label{font-size:11px;color:var(--accent);font-weight:600;margin-bottom:8px;}
    .cart-item{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--bg);border:1px solid var(--border);border-radius:8px;margin:5px 0;font-size:14px;}
    .cart-item .del{margin-left:auto;background:none;border:none;color:#ef4444;cursor:pointer;padding:0;font-size:16px;}
    .count-badge{display:inline-flex;align-items:center;justify-content:center;background:var(--primary);color:white;border-radius:99px;width:22px;height:22px;font-size:11px;font-weight:700;}
    .roadmap{display:flex;flex-direction:column;gap:8px;}
    .road-step{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:8px;font-size:14px;}
    .road-step.done{border-color:rgba(16,185,129,0.3);background:rgba(16,185,129,0.05);}
    .road-step .num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;}
    .road-step.done .num{background:rgba(16,185,129,0.2);color:var(--green);}
    .road-step:not(.done) .num{background:rgba(99,102,241,0.15);color:var(--primary);}
  </style>
</head>
<body>

<h1 style="font-size:24px;margin-bottom:4px;">⚛️ React.js Preview</h1>
<p style="color:var(--muted);font-size:14px;margin-bottom:20px;">Vanilla JS vs React — fark samjho</p>

<div class="card">
  <h2>📊 Vanilla JS vs React</h2>
  <div class="compare">
    <div>
      <div class="col-title col-js">Vanilla JavaScript</div>
      <pre><span class="cm">// Manual DOM update</span>
<span class="kw">let</span> count = 0;

<span class="kw">function</span> <span class="fn">increment</span>() {
  count++;
  <span class="cm">// Manually find + update</span>
  document
    .querySelector(<span class="str">'#count'</span>)
    .textContent = count;
  <span class="cm">// Multiple places update!</span>
}

<span class="kw">const</span> btn =
  document.querySelector(<span class="str">'#btn'</span>);
btn.addEventListener(
  <span class="str">'click'</span>, increment
);</pre>
    </div>
    <div>
      <div class="col-title col-react">React</div>
      <pre><span class="cm">// State change → auto UI update</span>
<span class="kw">function</span> <span class="fn">Counter</span>() {
  <span class="kw">const</span> [count, setCount] =
    useState(0);

  <span class="cm">// Just update state!</span>
  <span class="kw">return</span> (
    &lt;div&gt;
      &lt;p&gt;{count}&lt;/p&gt;
      &lt;button
        onClick={() =>
          setCount(count + 1)
        }
      &gt;
        +1
      &lt;/button&gt;
    &lt;/div&gt;
  );
}
<span class="cm">// React re-renders automatically</span></pre>
    </div>
  </div>
</div>

<div class="card">
  <h2>🛒 React-style Cart Demo (Vanilla JS simulation)</h2>
  <p style="color:var(--muted);font-size:13px;margin-bottom:12px;">React mein state change karo → UI automatically update hoti hai. Yeh uska simulation hai!</p>
  <div style="display:flex;gap:8px;flex-wrap:wrap;">
    <button onclick="addItem('📱 Phone — ₹15,000')">Add Phone</button>
    <button onclick="addItem('💻 Laptop — ₹55,000')">Add Laptop</button>
    <button onclick="addItem('⌚ Watch — ₹8,000')">Add Watch</button>
  </div>
  <div class="react-demo">
    <div class="demo-label">⚛️ React Component Output (simulated):</div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <strong>🛒 Cart</strong>
      <span class="count-badge" id="cartCount">0</span>
      <span style="color:var(--muted);font-size:13px;">items — Total: ₹<span id="cartTotal">0</span></span>
    </div>
    <div id="cartItems"><p style="color:var(--muted);font-size:13px;">Cart empty hai — items add karo!</p></div>
  </div>
</div>

<div class="card">
  <h2>🗺️ React Roadmap</h2>
  <div class="roadmap">
    <div class="road-step done"><div class="num">✓</div><div><strong>HTML + CSS + JavaScript</strong> — Complete! ✅</div></div>
    <div class="road-step"><div class="num">1</div><div><strong>React Basics</strong> — JSX, components, props, state</div></div>
    <div class="road-step"><div class="num">2</div><div><strong>React Hooks</strong> — useState, useEffect, useContext</div></div>
    <div class="road-step"><div class="num">3</div><div><strong>React Router</strong> — Multi-page apps</div></div>
    <div class="road-step"><div class="num">4</div><div><strong>API Integration</strong> — Real apps with backend</div></div>
    <div class="road-step"><div class="num">5</div><div><strong>Next.js</strong> — Full-stack React framework</div></div>
    <div class="road-step"><div class="num">6</div><div><strong>Job Ready! 💼</strong> — ₹4-12 LPA Frontend Developer</div></div>
  </div>
</div>

<script>
  let cart = [];
  let idCounter = 1;

  function addItem(text) {
    const priceMatch = text.match(/₹([\d,]+)/);
    const price = priceMatch ? parseInt(priceMatch[1].replace(',','')) : 0;
    cart.push({ id: idCounter++, text, price });
    renderCart();  // "setState" equivalent
  }

  function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
  }

  function renderCart() {  // "render" equivalent
    document.getElementById('cartCount').textContent = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cartTotal').textContent = total.toLocaleString('en-IN');

    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
      container.innerHTML = '<p style="color:var(--muted);font-size:13px;">Cart empty hai — items add karo!</p>';
      return;
    }
    container.innerHTML = cart.map(item =>
      '<div class="cart-item">' + item.text +
      '<button class="del" onclick="removeItem(' + item.id + ')">✕</button></div>'
    ).join('');
  }
</script>
</body>
</html>`,
      codeExample_en: `<!-- See above — English content is fully integrated -->`,
      task: {
        description: 'React ke liye prepare karo: (1) react.dev kholo aur "Quick Start" section padho — ek ghante mein basics samajh aayenge. (2) Apne To-Do App ka React version plan karo — kaunse components honge? (TodoApp, TodoInput, TodoList, TodoItem), (3) CodeSandbox.io pe ek simple React counter banao bina koi setup ke, (4) Apne portfolio pe "Learning React" ya "React Enthusiast" add karo skills mein, (5) Ek JavaScript concept likho jo React mein bahut use hota hai (hint: array methods, arrow functions, destructuring).',
        description_en: 'Prepare for React: (1) Open react.dev and read the "Quick Start" section — the basics will make sense in an hour. (2) Plan a React version of your To-Do App — which components would it have? (TodoApp, TodoInput, TodoList, TodoItem), (3) Build a simple React counter on CodeSandbox.io with no setup required, (4) Add "Learning React" or "React Enthusiast" to your portfolio skills, (5) Write down one JavaScript concept that is used heavily in React (hint: array methods, arrow functions, destructuring).',
        hint: 'React concepts jo tumhe already pata hain: arrow functions, array.map() for rendering lists, destructuring for props, async/await for API calls, modules (import/export). React mostly JavaScript hai — extra syntax thodi si sikhni hai!',
        hint_en: 'React concepts you already know: arrow functions, array.map() for rendering lists, destructuring for props, async/await for API calls, modules (import/export). React is mostly JavaScript — you just need to learn a little extra syntax!',
      },
      quiz: [
        {
          q: 'React mein "state" kya hai?',
          options: ['CSS variable','Component ka internal data jo change hone pe UI automatically re-render karta hai','HTML attribute','JavaScript object sirf'],
          correct: 1,
          explanation: 'State = component ka data jo time ke saath change ho sakta hai. State change → React virtual DOM compare karta hai → sirf changed parts re-render karta hai. Vanilla JS mein yeh manually karna padta tha. useState hook se state manage karte hain.',
          q_en: 'What is "state" in React?',
          options_en: ['A CSS variable','Internal component data that automatically re-renders the UI when it changes','An HTML attribute','Just a JavaScript object'],
          explanation_en: 'State = component data that can change over time. State changes → React compares the virtual DOM → only re-renders changed parts. In vanilla JS you had to do this manually. State is managed with the useState hook.',
        },
        {
          q: 'JSX kya hai?',
          options: ['New programming language','JavaScript ka syntax extension — HTML jaisi syntax JS mein likh sakte ho. Babel isko pure JavaScript mein compile karta hai.','CSS framework','HTML replacement'],
          correct: 1,
          explanation: 'JSX = JavaScript XML. HTML-like syntax directly JS mein likhne ki facility. <div className="card">{name}</div> → React.createElement("div",{className:"card"},name). Babel compile karta hai. {} mein koi bhi JS expression likh sakte ho.',
          q_en: 'What is JSX?',
          options_en: ['A new programming language','A JavaScript syntax extension — lets you write HTML-like syntax in JS. Babel compiles it to pure JavaScript.','A CSS framework','A replacement for HTML'],
          explanation_en: 'JSX = JavaScript XML. It lets you write HTML-like syntax directly in JavaScript. <div className="card">{name}</div> → React.createElement("div",{className:"card"},name). Babel compiles it. You can write any JavaScript expression inside {}.',
        },
        {
          q: 'React vanilla JS se better kyun hai large apps ke liye?',
          options: ['React faster hai','Component reusability + automatic state management + virtual DOM = less code, fewer bugs, easier to maintain. Large apps mein vanilla JS unmanageable ho jaati hai.','React sirf Facebook ke liye hai','CSS ke liye better'],
          correct: 1,
          explanation: 'Vanilla JS large apps mein: manually DOM updates, state scattered everywhere, bugs easy to introduce. React: ek component banao, kahin bhi reuse karo. State change karo, React sab update karta hai. 100k lines code pe bhi manageable rehta hai.',
          q_en: 'Why is React better than vanilla JS for large apps?',
          options_en: ['React is faster','Component reusability + automatic state management + virtual DOM = less code, fewer bugs, easier to maintain. Vanilla JS becomes unmanageable in large apps.','React is only for Facebook','Better for CSS'],
          explanation_en: 'Vanilla JS in large apps: manual DOM updates, state scattered everywhere, bugs creep in easily. React: build one component, reuse it anywhere. Change state, React updates everything. Stays manageable even at 100k lines of code.',
        },
      ],
    },
  ],
};