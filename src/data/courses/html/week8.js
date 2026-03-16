/**
 * HTML Course — Week 8: CSS Variables, Custom Properties & Month 2 Project
 */

export const HTML_WEEK_8 = {
  week: 8,
  title: 'CSS Variables aur Month 2 Project',
  title_en: 'CSS Variables and Month 2 Project',
  description: 'CSS Custom Properties se powerful, maintainable design systems banao!',
  description_en: 'Build powerful, maintainable design systems with CSS Custom Properties!',
  xpReward: 220,
  sections: [
    {
      id: 'html-w8-s1',
      title: 'CSS Custom Properties (Variables)',
      title_en: 'CSS Custom Properties (Variables)',
      emoji: '⚙️',
      content: `## CSS Variables — Ek Jagah Change, Poori Website Update!

### Basic CSS Variables

\`\`\`css
/* Define karo :root mein (global) */
:root {
  /* Colors */
  --color-primary:    #6366f1;
  --color-secondary:  #a78bfa;
  --color-accent:     #ec4899;
  --color-bg:         #0f172a;
  --color-bg2:        #1e293b;
  --color-text:       #e2e8f0;
  --color-muted:      #64748b;

  /* Typography */
  --font-sans:  'Inter', sans-serif;
  --font-serif: 'Playfair Display', serif;
  --text-xs:    12px;
  --text-sm:    14px;
  --text-base:  16px;
  --text-lg:    18px;
  --text-xl:    20px;
  --text-2xl:   24px;
  --text-4xl:   36px;

  /* Spacing */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-6:  24px;
  --space-8:  32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Border radius */
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.2);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.3);
  --shadow-glow: 0 0 30px rgba(99,102,241,0.3);

  /* Transitions */
  --transition-fast: all 0.15s ease;
  --transition:      all 0.25s ease;
  --transition-slow: all 0.4s ease;
}

/* Use karo */
.btn {
  background: var(--color-primary);
  color: var(--color-text);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  transition: var(--transition);
}
\`\`\`

### Local Variables (Scoped)

\`\`\`css
/* Global mein set karo */
:root { --card-bg: #1e293b; }

/* Component mein override karo */
.card-featured {
  --card-bg: #312e81;  /* Sirf yahan change */
}

.card {
  background: var(--card-bg);  /* Jo bhi set hai use karega */
}
\`\`\`

### Dark Mode with CSS Variables

\`\`\`css
/* Light mode (default) */
:root {
  --bg:   #ffffff;
  --text: #1e293b;
  --card: #f8fafc;
  --border: rgba(0,0,0,0.1);
}

/* Dark mode */
[data-theme="dark"] {
  --bg:   #0f172a;
  --text: #e2e8f0;
  --card: #1e293b;
  --border: rgba(255,255,255,0.1);
}

/* Toggle with JavaScript */
document.documentElement.setAttribute('data-theme', 'dark');

/* Or with prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  :root {
    --bg:   #0f172a;
    --text: #e2e8f0;
  }
}
\`\`\`

### Variables in Calculations

\`\`\`css
:root {
  --base-space: 8px;
  --header-height: 64px;
}

.content {
  padding: calc(var(--base-space) * 4);  /* 32px */
  min-height: calc(100vh - var(--header-height));
}

/* Color with opacity */
:root { --primary-rgb: 99, 102, 241; }
.btn { background: rgba(var(--primary-rgb), 0.15); }

/* With HSL — easy dark/light variants */
:root {
  --primary-h: 240;
  --primary-s: 80%;
  --primary-l: 67%;
  --primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
  --primary-dark: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) - 15%));
  --primary-light: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) + 15%));
}
\`\`\``,
      content_en: `## CSS Variables — Change in One Place, Update the Whole Website!

### Basic CSS Variables

\`\`\`css
:root {
  /* Colors */
  --color-primary:   #6366f1;
  --color-secondary: #a78bfa;
  --color-bg:        #0f172a;
  --color-text:      #e2e8f0;
  --color-muted:     #64748b;

  /* Typography */
  --text-sm:   14px;
  --text-base: 16px;
  --text-xl:   20px;

  /* Spacing */
  --space-4:  16px;
  --space-6:  24px;
  --space-8:  32px;

  /* Border radius */
  --radius-md:   10px;
  --radius-lg:   16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition: all 0.25s ease;
}

.btn {
  background: var(--color-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  transition: var(--transition);
}
\`\`\`

### Dark Mode with CSS Variables

\`\`\`css
:root        { --bg: #ffffff; --text: #1e293b; }
[data-theme="dark"] { --bg: #0f172a; --text: #e2e8f0; }

/* Toggle with JavaScript */
document.documentElement.setAttribute('data-theme', 'dark');

/* Auto dark mode */
@media (prefers-color-scheme: dark) {
  :root { --bg: #0f172a; --text: #e2e8f0; }
}
\`\`\`

### Variables in Calculations

\`\`\`css
:root {
  --base-space: 8px;
  --header-height: 64px;
  --primary-rgb: 99, 102, 241;
}

.content {
  padding: calc(var(--base-space) * 4);         /* 32px */
  min-height: calc(100vh - var(--header-height));
}
.btn-soft { background: rgba(var(--primary-rgb), 0.15); }
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>CSS Variables + Dark Mode</title>
  <style>
    /* ── Design System Tokens ── */
    :root {
      --font: 'Segoe UI', Arial, sans-serif;

      /* Spacing scale */
      --s1: 4px;  --s2: 8px;   --s3: 12px;
      --s4: 16px; --s6: 24px;  --s8: 32px;
      --s12: 48px;

      /* Radius scale */
      --r-sm: 6px; --r-md: 10px; --r-lg: 16px;
      --r-xl: 24px; --r-full: 9999px;

      /* Shadows */
      --shadow:      0 4px 20px rgba(0,0,0,0.15);
      --shadow-glow: 0 0 30px rgba(99,102,241,0.25);

      /* Transitions */
      --t-fast: all 0.15s ease;
      --t:      all 0.25s ease;
      --t-slow: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* ── Light Theme ── */
    :root, [data-theme="light"] {
      --bg:       #f8fafc;
      --bg2:      #ffffff;
      --bg3:      #f1f5f9;
      --border:   rgba(0,0,0,0.08);
      --text:     #1e293b;
      --muted:    #64748b;
      --primary:  #6366f1;
      --primary2: #4f46e5;
      --accent:   #a78bfa;
      --card-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }

    /* ── Dark Theme ── */
    [data-theme="dark"] {
      --bg:       #0f172a;
      --bg2:      #1e293b;
      --bg3:      #0f172a;
      --border:   rgba(255,255,255,0.08);
      --text:     #e2e8f0;
      --muted:    #64748b;
      --primary:  #6366f1;
      --primary2: #818cf8;
      --accent:   #a78bfa;
      --card-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }

    /* ── Base Styles ── */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      transition: background 0.4s ease, color 0.4s ease;
      min-height: 100vh;
    }

    /* ── Navigation ── */
    nav {
      background: var(--bg2);
      border-bottom: 1px solid var(--border);
      padding: 0 var(--s6); height: 60px;
      display: flex; justify-content: space-between; align-items: center;
      position: sticky; top: 0; z-index: 100;
      box-shadow: var(--shadow);
      transition: var(--t);
    }
    .logo { font-weight: 800; color: var(--primary); font-size: 18px; }
    .theme-toggle {
      width: 52px; height: 28px;
      background: var(--bg3);
      border: 2px solid var(--border);
      border-radius: var(--r-full);
      cursor: pointer; position: relative;
      transition: var(--t);
    }
    .theme-toggle::after {
      content: ""; position: absolute;
      top: 2px; left: 2px;
      width: 20px; height: 20px;
      background: var(--primary);
      border-radius: 50%;
      transition: var(--t-slow);
    }
    [data-theme="light"] .theme-toggle::after {
      transform: translateX(24px);
      background: #f59e0b;
    }
    .theme-label { font-size: 12px; color: var(--muted); margin-right: 8px; }

    /* ── Page ── */
    .page { max-width: 900px; margin: 0 auto; padding: var(--s8) var(--s6); }
    h1 { font-size: 32px; color: var(--text); margin-bottom: var(--s2); }
    p  { color: var(--muted); line-height: 1.7; }

    /* ── Cards ── */
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--s6); margin: var(--s8) 0; }
    .card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      padding: var(--s6);
      box-shadow: var(--card-shadow);
      transition: var(--t);
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-glow);
      border-color: var(--primary);
    }
    .card .icon { font-size: 36px; margin-bottom: var(--s3); }
    .card h3 { font-size: 16px; color: var(--text); margin-bottom: var(--s2); }
    .card p  { font-size: 13px; color: var(--muted); }

    /* ── Buttons ── */
    .btn-row { display: flex; gap: var(--s3); flex-wrap: wrap; margin-top: var(--s6); }
    .btn {
      padding: var(--s3) var(--s6);
      border-radius: var(--r-md);
      font-weight: 600; font-size: var(--text-sm, 14px);
      cursor: pointer; border: none;
      transition: var(--t-slow);
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary2); transform: translateY(-2px); box-shadow: var(--shadow-glow); }
    .btn-soft    { background: rgba(99,102,241,0.1); color: var(--primary); border: 1px solid rgba(99,102,241,0.2); }
    .btn-soft:hover { background: rgba(99,102,241,0.2); transform: translateY(-2px); }
    .btn-muted   { background: var(--bg3); color: var(--muted); border: 1px solid var(--border); }
    .btn-muted:hover { color: var(--text); transform: translateY(-2px); }

    /* ── Color Swatches ── */
    .swatches { display: flex; gap: var(--s3); flex-wrap: wrap; margin: var(--s4) 0; }
    .swatch {
      width: 48px; height: 48px;
      border-radius: var(--r-md);
      position: relative; cursor: pointer;
      transition: var(--t-slow);
    }
    .swatch:hover { transform: scale(1.15) translateY(-4px); }
    .swatch::after {
      content: attr(data-name);
      position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%);
      font-size: 10px; color: var(--muted); white-space: nowrap;
    }
  </style>
</head>
<body>

  <nav>
    <div class="logo">✨ Design System</div>
    <div style="display:flex; align-items:center; gap:8px;">
      <span class="theme-label" id="themeLabel">Dark Mode</span>
      <div class="theme-toggle" onclick="toggleTheme()" title="Toggle theme"></div>
    </div>
  </nav>

  <div class="page">

    <h1>CSS Variables Demo 🎨</h1>
    <p>Theme toggle karo — sab kuch ek saath update hoga! CSS variables ki power dekho.</p>

    <div class="cards">
      <div class="card">
        <div class="icon">⚡</div>
        <h3>Fast Toggle</h3>
        <p>Ek JS line se dark/light mode switch hota hai.</p>
      </div>
      <div class="card">
        <div class="icon">🎨</div>
        <h3>Design Tokens</h3>
        <p>Colors, spacing, radius — sab variables mein.</p>
      </div>
      <div class="card">
        <div class="icon">🔧</div>
        <h3>Easy Maintain</h3>
        <p>Brand color change karo — ek line mein poori site update.</p>
      </div>
    </div>

    <h2 style="margin:32px 0 16px; font-size:20px; color:var(--text);">Buttons with Variables</h2>
    <div class="btn-row">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-soft">Soft</button>
      <button class="btn btn-muted">Muted</button>
    </div>

    <h2 style="margin:32px 0 16px; font-size:20px; color:var(--text);">Color Palette</h2>
    <div class="swatches">
      <div class="swatch" style="background:#6366f1" data-name="primary"></div>
      <div class="swatch" style="background:#8b5cf6" data-name="purple"></div>
      <div class="swatch" style="background:#a78bfa" data-name="violet"></div>
      <div class="swatch" style="background:#ec4899" data-name="pink"></div>
      <div class="swatch" style="background:#f59e0b" data-name="amber"></div>
      <div class="swatch" style="background:#10b981" data-name="green"></div>
    </div>

  </div>

  <script>
    function toggleTheme() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      document.getElementById('themeLabel').textContent =
        next === 'dark' ? 'Dark Mode' : 'Light Mode';
      localStorage.setItem('theme', next);
    }

    // Load saved theme
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      document.getElementById('themeLabel').textContent =
        saved === 'dark' ? 'Dark Mode' : 'Light Mode';
    }
  </script>

</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>CSS Variables + Dark Mode</title>
  <style>
    :root {
      --font: 'Segoe UI', Arial, sans-serif;
      --s3: 12px; --s4: 16px; --s6: 24px; --s8: 32px;
      --r-md: 10px; --r-lg: 16px; --r-full: 9999px;
      --shadow:      0 4px 20px rgba(0,0,0,0.15);
      --shadow-glow: 0 0 30px rgba(99,102,241,0.25);
      --t:      all 0.25s ease;
      --t-slow: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    :root, [data-theme="light"] {
      --bg: #f8fafc; --bg2: #ffffff; --bg3: #f1f5f9;
      --border: rgba(0,0,0,0.08); --text: #1e293b; --muted: #64748b;
      --primary: #6366f1; --accent: #a78bfa;
      --card-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    [data-theme="dark"] {
      --bg: #0f172a; --bg2: #1e293b; --bg3: #0f172a;
      --border: rgba(255,255,255,0.08); --text: #e2e8f0; --muted: #64748b;
      --primary: #6366f1; --accent: #a78bfa;
      --card-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: var(--font); background: var(--bg); color: var(--text); transition: background 0.4s ease, color 0.4s ease; min-height: 100vh; }
    nav { background: var(--bg2); border-bottom: 1px solid var(--border); padding: 0 var(--s6); height: 60px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
    .logo { font-weight: 800; color: var(--primary); font-size: 18px; }
    .theme-toggle { width: 52px; height: 28px; background: var(--bg3); border: 2px solid var(--border); border-radius: var(--r-full); cursor: pointer; position: relative; transition: var(--t); }
    .theme-toggle::after { content: ""; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: var(--primary); border-radius: 50%; transition: var(--t-slow); }
    [data-theme="light"] .theme-toggle::after { transform: translateX(24px); background: #f59e0b; }
    .page { max-width: 900px; margin: 0 auto; padding: var(--s8) var(--s6); }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--s6); margin: var(--s8) 0; }
    .card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--r-lg); padding: var(--s6); box-shadow: var(--card-shadow); transition: var(--t); }
    .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-glow); border-color: var(--primary); }
    .btn { padding: var(--s3) var(--s6); border-radius: var(--r-md); font-weight: 600; font-size: 14px; cursor: pointer; border: none; transition: var(--t-slow); }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-glow); }
  </style>
</head>
<body>
  <nav>
    <div class="logo">✨ Design System</div>
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="font-size:12px; color:var(--muted)" id="themeLabel">Dark Mode</span>
      <div class="theme-toggle" onclick="toggleTheme()"></div>
    </div>
  </nav>
  <div class="page">
    <h1 style="font-size:32px; margin-bottom:8px;">CSS Variables Demo 🎨</h1>
    <p style="color:var(--muted)">Toggle the theme — everything updates at once! The power of CSS variables.</p>
    <div class="cards">
      <div class="card"><div style="font-size:36px; margin-bottom:12px;">⚡</div><h3 style="margin-bottom:8px;">Fast Toggle</h3><p style="font-size:13px; color:var(--muted)">Switch dark/light mode with a single JS line.</p></div>
      <div class="card"><div style="font-size:36px; margin-bottom:12px;">🎨</div><h3 style="margin-bottom:8px;">Design Tokens</h3><p style="font-size:13px; color:var(--muted)">Colours, spacing, radius — all in variables.</p></div>
      <div class="card"><div style="font-size:36px; margin-bottom:12px;">🔧</div><h3 style="margin-bottom:8px;">Easy to Maintain</h3><p style="font-size:13px; color:var(--muted)">Change brand colour — update the whole site in one line.</p></div>
    </div>
    <button class="btn btn-primary" style="margin-top:24px;">Primary Button</button>
  </div>
  <script>
    function toggleTheme() {
      const html = document.documentElement;
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      document.getElementById('themeLabel').textContent = next === 'dark' ? 'Dark Mode' : 'Light Mode';
      localStorage.setItem('theme', next);
    }
    const saved = localStorage.getItem('theme');
    if (saved) { document.documentElement.setAttribute('data-theme', saved); document.getElementById('themeLabel').textContent = saved === 'dark' ? 'Dark Mode' : 'Light Mode'; }
  </script>
</body>
</html>`,
      task: {
        description: 'Apni portfolio website mein complete design system banao CSS variables se: (1) :root mein saari design tokens define karo (colors, spacing, radius, shadows, transitions), (2) Dark/Light mode toggle add karo — localStorage mein save karo, (3) "Prefer color scheme" media query bhi add karo (auto dark mode system setting ke hisaab se), (4) Sab existing CSS mein hardcoded values ko variables se replace karo, (5) Ek "Theme Switcher" button banao navbar mein — sun icon light ke liye, moon icon dark ke liye.',
        description_en: 'Build a complete design system for your portfolio using CSS variables: (1) Define all design tokens in :root (colours, spacing, radius, shadows, transitions), (2) Add a Dark/Light mode toggle — save preference to localStorage, (3) Also add a prefers-color-scheme media query (auto dark mode from system settings), (4) Replace all hardcoded values in existing CSS with variables, (5) Add a "Theme Switcher" button in the navbar — sun icon for light, moon icon for dark.',
        hint: 'Sirf ek attribute set karo: document.documentElement.setAttribute("data-theme", "dark"). CSS variable override: [data-theme="dark"] { --bg: #0f172a; }. Moon/Sun emoji use kar sakte ho ya lucide icons. localStorage.setItem("theme", "dark") se save karo.',
        hint_en: 'Just set one attribute: document.documentElement.setAttribute("data-theme", "dark"). CSS variable override: [data-theme="dark"] { --bg: #0f172a; }. You can use moon/sun emojis or lucide icons. Save with localStorage.setItem("theme", "dark").',
      },
      quiz: [
        {
          q: 'CSS variables aur SCSS variables mein main fark kya hai?',
          options: ['Koi fark nahi', 'CSS variables runtime pe change ho sakte hain (JS se), SCSS variables compile-time pe fixed ho jaate hain', 'SCSS faster hai', 'CSS variables sirf colors ke liye hain'],
          correct: 1,
          explanation: 'SCSS variables = compilation pe replace ho jaate hain, runtime pe exist nahi karte. CSS variables = browser mein live rahte hain, JS se change kiye ja sakte hain, scope ho sakte hain — isliye dark mode possible hai!',
          q_en: 'What is the main difference between CSS variables and SCSS variables?',
          options_en: ['No difference', 'CSS variables can change at runtime (via JS), SCSS variables are fixed at compile time', 'SCSS is faster', 'CSS variables are only for colours'],
          explanation_en: 'SCSS variables = replaced at compilation, do not exist at runtime. CSS variables = live in the browser, can be changed by JS, can be scoped — that is why dark mode is possible!',
        },
        {
          q: 'var(--color-primary, #6366f1) mein second value kya hai?',
          options: ['Second variable', 'Fallback value — agar --color-primary defined nahi toh #6366f1 use hoga', 'Error value', 'Default animation'],
          correct: 1,
          explanation: 'var(--name, fallback) — agar --name undefined hai toh fallback use hoga. Yeh useful hai when variable might not be defined in all contexts.',
          q_en: 'What is the second value in var(--color-primary, #6366f1)?',
          options_en: ['A second variable', 'Fallback value — if --color-primary is not defined, #6366f1 will be used', 'Error value', 'Default animation'],
          explanation_en: 'var(--name, fallback) — if --name is undefined, the fallback is used. This is useful when a variable might not be defined in all contexts.',
        },
        {
          q: 'CSS variable ko JS se kaise change karte hain?',
          options: ['CSS.setVariable("--color", "red")', 'document.documentElement.style.setProperty("--color-primary", "#ff0000")', 'document.style.variable("--color", "red")', 'CSS.variable.set("--color")'],
          correct: 1,
          explanation: 'document.documentElement.style.setProperty("--name", "value") se :root variables change kar sakte hain. Kisi specific element pe: element.style.setProperty("--name", "value").',
          q_en: 'How do you change a CSS variable from JavaScript?',
          options_en: ['CSS.setVariable("--color", "red")', 'document.documentElement.style.setProperty("--color-primary", "#ff0000")', 'document.style.variable("--color", "red")', 'CSS.variable.set("--color")'],
          explanation_en: 'document.documentElement.style.setProperty("--name", "value") changes :root variables. For a specific element: element.style.setProperty("--name", "value").',
        },
      ],
    },

    {
      id: 'html-w8-s2',
      title: 'CSS Pseudo-classes Advanced — :is(), :where(), :has()',
      title_en: 'Advanced CSS Pseudo-classes — :is(), :where(), :has()',
      emoji: '🔬',
      content: `## Modern CSS Selectors — Less Code, More Power!

### :is() — Group Selectors Efficiently

\`\`\`css
/* Purana tarika — repetitive */
h1 a, h2 a, h3 a, h4 a {
  color: #6366f1;
}

/* Modern — :is() se */
:is(h1, h2, h3, h4) a {
  color: #6366f1;
}

/* Complex selectors bhi */
:is(.card, .post, .sidebar) :is(h2, h3) {
  font-size: 18px;
}

/* :is() specificity = highest in list */
:is(#id, .class, div) { }  /* Specificity = #id ka (100) */
\`\`\`

### :where() — Zero Specificity

\`\`\`css
/* :where() = same as :is() but specificity 0! */
:where(h1, h2, h3) { margin-bottom: 16px; }
/* Override karna bahut easy — koi bhi selector override kar sakta hai */

/* Good for utility/reset styles */
:where(*) { box-sizing: border-box; }
:where(ul, ol) { list-style: none; }
\`\`\`

### :has() — Parent Selector! (CSS ka naya superpower)

\`\`\`css
/* Card mein image hai toh alag style */
.card:has(img) { padding: 0; }

/* Form mein error hai toh highlight */
.form-group:has(.error-msg) input {
  border-color: red;
}

/* Nav mein open dropdown hai toh dim karo baaki */
nav:has(.dropdown.open) .nav-link:not(.dropdown) {
  opacity: 0.5;
}

/* Article mein video hai toh alag layout */
article:has(video) { grid-column: span 2; }

/* Input filled hai toh label float karo */
.float-label:has(input:not(:placeholder-shown)) label {
  transform: translateY(-24px) scale(0.85);
  color: #6366f1;
}
\`\`\`

### :not() Advanced

\`\`\`css
/* Sirf last child nahi */
li:not(:last-child) { border-bottom: 1px solid #eee; }

/* Multiple exclusions */
.card:not(.featured):not(.disabled):hover {
  transform: translateY(-4px);
}

/* Attribute exclude */
button:not([disabled]) { cursor: pointer; }
\`\`\`

### :focus-visible — Smart Focus

\`\`\`css
/* Old way — hides outline for mouse users */
:focus { outline: none; }  /* ❌ Accessibility issue! */

/* Modern — only for keyboard navigation */
:focus-visible {
  outline: 3px solid #6366f1;
  outline-offset: 2px;
}
/* Mouse click pe no outline, Tab pe outline — best of both! */
\`\`\`

### Logical Properties — RTL/LTR Support

\`\`\`css
/* Physical (only works well in LTR) */
margin-left: 16px;
padding-right: 24px;
border-left: 2px solid red;

/* Logical (works in both LTR and RTL!) */
margin-inline-start: 16px;  /* left in LTR, right in RTL */
padding-inline-end: 24px;   /* right in LTR, left in RTL */
border-inline-start: 2px solid red;

/* Block = vertical */
margin-block: 16px 32px;    /* top, bottom */
padding-block-start: 24px;  /* top */
\`\`\``,
      content_en: `## Modern CSS Selectors — Less Code, More Power!

### :is() — Group Selectors Efficiently

\`\`\`css
/* Old way — repetitive */
h1 a, h2 a, h3 a, h4 a { color: #6366f1; }

/* Modern — with :is() */
:is(h1, h2, h3, h4) a { color: #6366f1; }

:is(.card, .post, .sidebar) :is(h2, h3) { font-size: 18px; }
\`\`\`

### :where() — Zero Specificity

\`\`\`css
/* Same as :is() but specificity = 0 — easy to override */
:where(h1, h2, h3) { margin-bottom: 16px; }
:where(ul, ol) { list-style: none; }
\`\`\`

### :has() — The Parent Selector!

\`\`\`css
/* Card has an image → different style */
.card:has(img) { padding: 0; }

/* Form has error → highlight input */
.form-group:has(.error-msg) input { border-color: red; }

/* Input is filled → float the label */
.float-label:has(input:not(:placeholder-shown)) label {
  transform: translateY(-24px) scale(0.85);
  color: #6366f1;
}
\`\`\`

### :focus-visible — Smart Focus

\`\`\`css
/* Mouse click = no outline, Tab key = outline — best of both! */
:focus-visible {
  outline: 3px solid #6366f1;
  outline-offset: 2px;
}
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Modern CSS Demo</title>
  <style>
    :root {
      --primary: #6366f1; --accent: #a78bfa;
      --bg: #0f172a; --bg2: #1e293b;
      --text: #e2e8f0; --muted: #64748b;
      --border: rgba(255,255,255,0.08);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: var(--bg); color: var(--text); padding: 40px 20px; }
    h2 { color: var(--accent); margin: 40px 0 16px; font-size: 18px; }
    p { color: var(--muted); margin-bottom: 16px; font-size: 14px; }

    /* :is() — group headings */
    :is(h1, h2, h3, h4) { color: var(--text); }

    /* Cards with :has() */
    .demo-cards { display: flex; gap: 16px; flex-wrap: wrap; }
    .demo-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 12px;
      flex: 1 1 220px; max-width: 280px;
      transition: all 0.3s ease;
      overflow: hidden;
    }
    .demo-card:hover { border-color: var(--primary); transform: translateY(-4px); }

    /* :has(img) — card with image has no top padding */
    .demo-card:has(img) .card-body { padding-top: 0; }
    .demo-card img { width: 100%; height: 140px; object-fit: cover; }
    .card-body { padding: 20px; }
    .card-body h3 { font-size: 15px; margin-bottom: 8px; }
    .card-body p  { font-size: 13px; color: var(--muted); }

    /* :focus-visible */
    .focus-demo a {
      color: var(--accent); text-decoration: none;
      padding: 4px 8px; border-radius: 6px;
      transition: all 0.2s;
    }
    .focus-demo a:focus-visible {
      outline: 3px solid var(--primary);
      outline-offset: 2px;
      background: rgba(99,102,241,0.1);
    }
    .focus-demo a:hover { color: white; }

    /* Floating label using :has() */
    .float-label {
      position: relative;
      margin-top: 24px;
      max-width: 320px;
    }
    .float-label input {
      width: 100%; padding: 14px 16px 6px;
      background: var(--bg2); border: 2px solid var(--border);
      border-radius: 10px; color: var(--text); font-size: 15px;
      outline: none; transition: all 0.2s;
    }
    .float-label input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(99,102,241,0.15);
    }
    .float-label label {
      position: absolute; left: 16px; top: 50%;
      transform: translateY(-50%);
      color: var(--muted); font-size: 14px; pointer-events: none;
      transition: all 0.2s ease;
    }
    /* :has() se floating label — JS nahi chahiye! */
    .float-label:has(input:focus) label,
    .float-label:has(input:not(:placeholder-shown)) label {
      transform: translateY(-20px) scale(0.82);
      color: var(--primary);
    }

    /* :not() — all li except last */
    .demo-list li {
      padding: 10px 0;
      color: var(--text);
      font-size: 14px;
    }
    .demo-list li:not(:last-child) {
      border-bottom: 1px solid var(--border);
    }
    .demo-list li:first-child { font-weight: bold; color: var(--accent); }
  </style>
</head>
<body>

  <h1 style="font-size:28px; margin-bottom:8px;">🔬 Modern CSS Demo</h1>
  <p>:is(), :has(), :where(), :focus-visible — CSS ke new superpowers!</p>

  <h2>1. :has() — Cards With/Without Image</h2>
  <p>Image wale card mein padding nahi hogi (top pe) — CSS sirf dekh raha hai!</p>
  <div class="demo-cards">
    <!-- Card with image — :has(img) applies -->
    <div class="demo-card">
      <img src="https://picsum.photos/280/140?random=30" alt="Course image">
      <div class="card-body">
        <h3>🌐 HTML Course</h3>
        <p>Image wale card mein top padding 0 hai — :has(img) se!</p>
      </div>
    </div>
    <!-- Card without image — normal padding -->
    <div class="demo-card">
      <div class="card-body">
        <h3>🐍 Python Course</h3>
        <p>Image nahi hai toh normal padding — :has() detect karta hai!</p>
      </div>
    </div>
  </div>

  <h2>2. Floating Label — CSS only with :has()</h2>
  <p>JS nahi! Sirf CSS :has() se label float hoti hai.</p>
  <div class="float-label">
    <input type="text" id="email" placeholder=" ">
    <label for="email">Email Address</label>
  </div>
  <div class="float-label" style="margin-top:20px;">
    <input type="text" id="name" placeholder=" ">
    <label for="name">Full Name</label>
  </div>

  <h2>3. :focus-visible — Keyboard vs Mouse</h2>
  <p>Tab se navigate karo — outline dikhega. Mouse se click karo — nahi dikhega!</p>
  <div class="focus-demo" style="display:flex; gap:16px; flex-wrap:wrap;">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Courses</a>
    <a href="#">Contact</a>
  </div>

  <h2>4. :not() — Border except last item</h2>
  <ul class="demo-list" style="max-width:300px;">
    <li>First Item (bold + colored)</li>
    <li>Second Item (has border below)</li>
    <li>Third Item (has border below)</li>
    <li>Last Item (no border — :not(:last-child))</li>
  </ul>

</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Modern CSS Demo</title>
  <style>
    :root { --primary: #6366f1; --accent: #a78bfa; --bg: #0f172a; --bg2: #1e293b; --text: #e2e8f0; --muted: #64748b; --border: rgba(255,255,255,0.08); }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: var(--bg); color: var(--text); padding: 40px 20px; }
    h2 { color: var(--accent); margin: 40px 0 16px; font-size: 18px; }
    p  { color: var(--muted); margin-bottom: 16px; font-size: 14px; }

    .demo-cards { display: flex; gap: 16px; flex-wrap: wrap; }
    .demo-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; flex: 1 1 220px; max-width: 280px; transition: all 0.3s; overflow: hidden; }
    .demo-card:hover { border-color: var(--primary); transform: translateY(-4px); }
    .demo-card:has(img) .card-body { padding-top: 0; }
    .demo-card img { width: 100%; height: 140px; object-fit: cover; }
    .card-body { padding: 20px; }
    .card-body h3 { font-size: 15px; margin-bottom: 8px; }
    .card-body p  { font-size: 13px; color: var(--muted); }

    .float-label { position: relative; margin-top: 24px; max-width: 320px; }
    .float-label input { width: 100%; padding: 14px 16px 6px; background: var(--bg2); border: 2px solid var(--border); border-radius: 10px; color: var(--text); font-size: 15px; outline: none; transition: all 0.2s; }
    .float-label input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(99,102,241,0.15); }
    .float-label label { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 14px; pointer-events: none; transition: all 0.2s ease; }
    .float-label:has(input:focus) label,
    .float-label:has(input:not(:placeholder-shown)) label { transform: translateY(-20px) scale(0.82); color: var(--primary); }

    .focus-demo a { color: var(--accent); text-decoration: none; padding: 4px 8px; border-radius: 6px; transition: all 0.2s; }
    .focus-demo a:focus-visible { outline: 3px solid var(--primary); outline-offset: 2px; background: rgba(99,102,241,0.1); }

    .demo-list li { padding: 10px 0; color: var(--text); font-size: 14px; }
    .demo-list li:not(:last-child) { border-bottom: 1px solid var(--border); }
    .demo-list li:first-child { font-weight: bold; color: var(--accent); }
  </style>
</head>
<body>
  <h1 style="font-size:28px; margin-bottom:8px;">🔬 Modern CSS Demo</h1>
  <p>:is(), :has(), :where(), :focus-visible — the new superpowers of CSS!</p>

  <h2>1. :has() — Cards With/Without Image</h2>
  <p>Cards with an image get no top padding — CSS is detecting it automatically!</p>
  <div class="demo-cards">
    <div class="demo-card">
      <img src="https://picsum.photos/280/140?random=30" alt="Course image">
      <div class="card-body"><h3>🌐 HTML Course</h3><p>Card with image has no top padding — thanks to :has(img)!</p></div>
    </div>
    <div class="demo-card">
      <div class="card-body"><h3>🐍 Python Course</h3><p>No image → normal padding — :has() detects this!</p></div>
    </div>
  </div>

  <h2>2. Floating Label — CSS only with :has()</h2>
  <p>No JavaScript! The label floats using only CSS :has().</p>
  <div class="float-label"><input type="text" id="email" placeholder=" "><label for="email">Email Address</label></div>

  <h2>3. :focus-visible — Keyboard vs Mouse</h2>
  <p>Navigate with Tab — outline appears. Click with mouse — no outline!</p>
  <div class="focus-demo" style="display:flex; gap:16px; flex-wrap:wrap;">
    <a href="#">Home</a><a href="#">About</a><a href="#">Courses</a><a href="#">Contact</a>
  </div>

  <h2>4. :not() — Border except last item</h2>
  <ul class="demo-list" style="max-width:300px; list-style:none;">
    <li>First Item (bold + coloured)</li>
    <li>Second Item (has border below)</li>
    <li>Third Item (has border below)</li>
    <li>Last Item (no border — :not(:last-child))</li>
  </ul>
</body>
</html>`,
      task: {
        description: 'Apni portfolio website mein modern CSS techniques apply karo: (1) :is() se repetitive selectors simplify karo (headings, lists, form elements), (2) :has() se form validation: .form-group:has(input:invalid) red border show karo, (3) Floating label inputs banao :has() use karke (bina JavaScript), (4) :focus-visible se accessibility improve karo, (5) :not() se navigation mein active link ko different style do, (6) :where() se global reset rules write karo zero specificity ke saath.',
        description_en: 'Apply modern CSS techniques to your portfolio website: (1) Use :is() to simplify repetitive selectors (headings, lists, form elements), (2) Use :has() for form validation: show red border for .form-group:has(input:invalid), (3) Build floating label inputs using :has() (no JavaScript), (4) Improve accessibility with :focus-visible, (5) Use :not() to give the active link in navigation a different style, (6) Write global reset rules with :where() (zero specificity).',
        hint: '.form-group:has(input:invalid) { --border-color: red; } — phir input mein var(--border-color) use karo. Floating label: input ka placeholder=" " (space) lagao taaki :placeholder-shown kaam kare.',
        hint_en: '.form-group:has(input:invalid) { --border-color: red; } — then use var(--border-color) in the input. Floating label: set the input placeholder=" " (a space) so that :placeholder-shown works correctly.',
      },
      quiz: [
        {
          q: ':is() aur :where() mein kya fark hai?',
          options: ['Koi fark nahi', ':is() highest specificity use karta hai list se, :where() ka specificity hamesha 0 hota hai', ':where() modern browsers mein kaam nahi karta', ':is() sirf classes ke liye hai'],
          correct: 1,
          explanation: ':is(.card, #hero) specificity = #hero ka (100). :where(.card, #hero) specificity = 0 (override karna bahut aasan). Use :where() for resets/utilities, :is() for semantic grouping.',
          q_en: 'What is the difference between :is() and :where()?',
          options_en: ['No difference', ':is() takes the highest specificity from the list, :where() always has specificity 0', ':where() does not work in modern browsers', ':is() is only for classes'],
          explanation_en: ':is(.card, #hero) specificity = #hero\'s (100). :where(.card, #hero) specificity = 0 (very easy to override). Use :where() for resets/utilities, :is() for semantic grouping.',
        },
        {
          q: ':has() CSS mein kya naya karta hai?',
          options: ['Faster animations', 'Parent ko child ke hisaab se style karne ki ability — pehle yeh sirf JS se possible tha', 'Better colors', 'New layout system'],
          correct: 1,
          explanation: ':has() = CSS parent selector! Pehle "agar element ke andar yeh hai toh parent ko style karo" sirf JavaScript se possible tha. Ab pure CSS mein possible hai — form validation, card layouts, conditional styles sab!',
          q_en: 'What new ability does :has() add to CSS?',
          options_en: ['Faster animations', 'The ability to style a parent based on its children — previously only possible with JavaScript', 'Better colours', 'A new layout system'],
          explanation_en: ':has() = CSS parent selector! Previously, "if this element contains X, style the parent" was only possible with JavaScript. Now it is possible in pure CSS — form validation, card layouts, conditional styles, all of it!',
        },
        {
          q: ':focus-visible kyun behtar hai :focus se?',
          options: ['Faster', 'Mouse users ko unnecessary outline nahi dikha ta, keyboard users ko zaruri outline dikha ta — best of both', 'More colorful', 'Works on more browsers'],
          correct: 1,
          explanation: ':focus = mouse click pe bhi ugly outline. :focus-visible = sirf keyboard navigation pe outline (Tab, Enter). Mouse users ko distraction nahi, keyboard users ko accessibility milti hai.',
          q_en: 'Why is :focus-visible better than :focus?',
          options_en: ['Faster', 'Does not show unnecessary outline to mouse users, but shows the essential outline to keyboard users — best of both worlds', 'More colourful', 'Works on more browsers'],
          explanation_en: ':focus = shows ugly outline even on mouse click. :focus-visible = outline only on keyboard navigation (Tab, Enter). No distraction for mouse users, full accessibility for keyboard users.',
        },
      ],
    },

    {
      id: 'html-w8-s3',
      title: 'Month 2 Capstone Project — Professional Website',
      title_en: 'Month 2 Capstone Project — Professional Website',
      emoji: '🏆',
      content: `## Month 2 Capstone — Poora CSS Ek Project Mein!

Is hafte aur Month 2 mein seekha:
- Week 5: CSS Basics (colors, fonts, selectors, box model)
- Week 6: Flexbox, Grid, Responsive Design
- Week 7: Transitions, Transforms, @keyframes Animations
- Week 8: CSS Variables, Dark Mode, Modern Selectors

Ab in sab ko ek **complete professional website** mein combine karo!

### Capstone Options (koi ek chunno):

**Option A: StudyEarn Clone**
\`\`\`
Ek complete ed-tech landing page:
- Animated hero (gradient + floating elements)
- Feature cards (Flexbox + hover animations)
- Courses grid (CSS Grid + hover effects)
- Pricing section (3 tiers + highlighted middle)
- Testimonials (horizontal scroll)
- Dark/Light mode toggle
- Fully responsive (mobile → desktop)
\`\`\`

**Option B: Agency Website**
\`\`\`
Creative digital agency site:
- Full-screen hero with parallax
- Services grid (CSS Grid auto-fit)
- Portfolio masonry grid
- Team section (card flip animations)
- Contact form (floating labels + :has() validation)
- Animated statistics section
- Mobile hamburger menu
\`\`\`

**Option C: Personal Portfolio (Enhanced)**
\`\`\`
Upgrade karo pichla portfolio:
- CSS variables design system
- Dark/Light mode
- Animated skill bars
- 3D project cards (perspective)
- Scroll-triggered animations
- Animated gradient hero
- Professional typography (Google Fonts)
- Print stylesheet
\`\`\`

### Final Checklist:

\`\`\`css
/* CSS Variables ✅ */
:root { --primary: ...; --space-4: ...; }

/* Responsive ✅ */
@media (min-width: 768px) { }
@media (min-width: 1024px) { }

/* Flexbox + Grid ✅ */
.nav { display: flex; justify-content: space-between; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, ...); }

/* Animations ✅ */
@keyframes fadeInUp { }
transition: all 0.3s ease;

/* Dark Mode ✅ */
[data-theme="dark"] { --bg: #0f172a; }

/* Modern Selectors ✅ */
:is(h1,h2,h3) { }
:focus-visible { outline: 3px solid var(--primary); }
\`\`\``,
      content_en: `## Month 2 Capstone — All CSS in One Project!

This week and Month 2 covered:
- Week 5: CSS Basics (colours, fonts, selectors, box model)
- Week 6: Flexbox, Grid, Responsive Design
- Week 7: Transitions, Transforms, @keyframes Animations
- Week 8: CSS Variables, Dark Mode, Modern Selectors

Now combine all of this into one **complete professional website**!

### Capstone Options (choose one):

**Option A: StudyEarn Clone**
\`\`\`
A complete ed-tech landing page:
- Animated hero (gradient + floating elements)
- Feature cards (Flexbox + hover animations)
- Courses grid (CSS Grid + hover effects)
- Pricing section (3 tiers + highlighted middle)
- Testimonials (horizontal scroll)
- Dark/Light mode toggle
- Fully responsive (mobile → desktop)
\`\`\`

**Option B: Agency Website**
\`\`\`
Creative digital agency site:
- Full-screen hero with parallax
- Services grid (CSS Grid auto-fit)
- Portfolio masonry grid
- Team section (card flip animations)
- Contact form (floating labels + :has() validation)
- Animated statistics section
- Mobile hamburger menu
\`\`\`

**Option C: Personal Portfolio (Enhanced)**
\`\`\`
Upgrade your previous portfolio:
- CSS variables design system
- Dark/Light mode
- Animated skill bars
- 3D project cards (perspective)
- Scroll-triggered animations
- Animated gradient hero
- Professional typography (Google Fonts)
- Print stylesheet
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StudyEarn AI — Month 2 Capstone</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    /* ════════════════════════════════════════════════════════
       DESIGN SYSTEM — CSS Variables
    ════════════════════════════════════════════════════════ */
    :root {
      --font: 'Inter', sans-serif;
      /* Spacing */
      --s2: 8px; --s3: 12px; --s4: 16px;
      --s6: 24px; --s8: 32px; --s12: 48px; --s16: 64px;
      /* Radius */
      --r-sm: 6px; --r-md: 10px; --r-lg: 16px;
      --r-xl: 24px; --r-full: 9999px;
      /* Transitions */
      --t: all 0.25s ease;
      --t-bounce: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    [data-theme="dark"] {
      --bg:      #0f172a; --bg2: #1e293b; --bg3: #0f172a;
      --border:  rgba(255,255,255,0.08);
      --text:    #e2e8f0; --muted: #64748b;
      --primary: #6366f1; --primary2: #818cf8;
      --accent:  #a78bfa; --pink: #ec4899;
      --shadow:  0 4px 24px rgba(0,0,0,0.4);
      --glow:    0 0 40px rgba(99,102,241,0.2);
    }
    [data-theme="light"] {
      --bg:      #f8fafc; --bg2: #ffffff; --bg3: #f1f5f9;
      --border:  rgba(0,0,0,0.08);
      --text:    #1e293b; --muted: #64748b;
      --primary: #6366f1; --primary2: #4f46e5;
      --accent:  #8b5cf6; --pink: #ec4899;
      --shadow:  0 4px 24px rgba(0,0,0,0.08);
      --glow:    0 0 40px rgba(99,102,241,0.15);
    }

    /* ════════════════════════════════════════════════════════
       KEYFRAMES
    ════════════════════════════════════════════════════════ */
    @keyframes gradientShift {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%       { transform: translateY(-16px) rotate(4deg); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.85); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ════════════════════════════════════════════════════════
       BASE
    ════════════════════════════════════════════════════════ */
    :where(*) { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font);
      background: var(--bg); color: var(--text);
      transition: background 0.4s ease, color 0.4s ease;
    }
    :focus-visible { outline: 3px solid var(--primary); outline-offset: 2px; }

    /* ════════════════════════════════════════════════════════
       NAV
    ════════════════════════════════════════════════════════ */
    nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(15,23,42,0.85);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
      padding: 0 var(--s6); height: 64px;
      display: flex; justify-content: space-between; align-items: center;
    }
    [data-theme="light"] nav { background: rgba(248,250,252,0.85); }
    .logo { font-size: 20px; font-weight: 800; }
    .logo span { color: var(--accent); }
    .nav-right { display: flex; align-items: center; gap: var(--s4); }
    .nav-links { display: flex; gap: var(--s6); list-style: none; }
    .nav-links a {
      position: relative; color: var(--muted);
      text-decoration: none; font-size: 14px; font-weight: 500;
      transition: color 0.2s;
    }
    .nav-links a::after {
      content: ""; position: absolute; bottom: -4px; left: 0;
      width: 0; height: 2px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      transition: width 0.3s ease;
    }
    .nav-links a:hover { color: var(--text); }
    .nav-links a:hover::after { width: 100%; }

    /* Theme toggle */
    .theme-btn {
      background: var(--bg2); border: 1px solid var(--border);
      color: var(--text); width: 36px; height: 36px;
      border-radius: var(--r-full); cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      transition: var(--t-bounce);
    }
    .theme-btn:hover { transform: scale(1.15) rotate(15deg); border-color: var(--primary); }

    .cta-btn {
      background: var(--primary); color: white;
      padding: var(--s2) var(--s4); border-radius: var(--r-md);
      text-decoration: none; font-size: 13px; font-weight: 600;
      transition: var(--t-bounce);
    }
    .cta-btn:hover { background: var(--primary2); transform: translateY(-2px); box-shadow: var(--glow); }

    /* ════════════════════════════════════════════════════════
       HERO
    ════════════════════════════════════════════════════════ */
    .hero {
      min-height: 100vh;
      background: linear-gradient(-45deg, #0f172a, #1e1b4b, #312e81, #1e1b4b);
      background-size: 400% 400%;
      animation: gradientShift 12s ease infinite;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: var(--s16) var(--s6);
      position: relative; overflow: hidden;
    }
    [data-theme="light"] .hero {
      background: linear-gradient(-45deg, #f0f4ff, #e0e7ff, #ddd6fe, #e0e7ff);
    }
    .hero::after {
      content: ""; position: absolute; inset: 0;
      background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.2), transparent);
    }
    .hero-content { position: relative; z-index: 1; max-width: 700px; }
    .float-emoji {
      position: absolute; font-size: 28px;
      opacity: 0.1; user-select: none;
    }
    .fe1 { top: 8%;  left: 6%;  animation: float 6s ease infinite; }
    .fe2 { top: 15%; right: 8%; animation: float 8s ease infinite 1.5s; }
    .fe3 { bottom: 20%; left: 10%; animation: float 7s ease infinite 0.5s; }
    .fe4 { bottom: 15%; right: 6%; animation: float 9s ease infinite 2s; }

    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
      color: var(--accent); padding: 6px 18px; border-radius: var(--r-full);
      font-size: 13px; font-weight: 500; margin-bottom: var(--s8);
      animation: fadeInUp 0.6s ease both;
    }
    .pulse-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: float 2s ease infinite; }

    .hero h1 {
      font-size: clamp(36px, 7vw, 76px);
      font-weight: 800; line-height: 1.05; margin-bottom: var(--s6);
      animation: fadeInUp 0.6s ease 0.2s both; color: white;
    }
    [data-theme="light"] .hero h1 { color: var(--text); }
    .grad-text {
      background: linear-gradient(135deg, var(--accent), var(--pink));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-sub {
      font-size: clamp(15px, 2.5vw, 19px);
      color: rgba(255,255,255,0.7); max-width: 520px; line-height: 1.7;
      margin: 0 auto var(--s10, 40px);
      animation: fadeInUp 0.6s ease 0.4s both;
    }
    [data-theme="light"] .hero-sub { color: var(--muted); }
    .hero-btns {
      display: flex; gap: var(--s4); flex-wrap: wrap; justify-content: center;
      animation: fadeInUp 0.6s ease 0.6s both;
    }
    .hero-btn {
      padding: 14px 32px; border-radius: var(--r-md);
      font-weight: 700; font-size: 15px;
      text-decoration: none; cursor: pointer; border: none;
      transition: var(--t-bounce);
    }
    .hb-primary { background: var(--primary); color: white; }
    .hb-primary:hover { background: var(--primary2); transform: translateY(-3px); box-shadow: var(--glow); }
    .hb-outline {
      background: rgba(255,255,255,0.07); color: white;
      border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(8px);
    }
    .hb-outline:hover { background: rgba(255,255,255,0.12); transform: translateY(-3px); }
    [data-theme="light"] .hb-outline { color: var(--text); background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.1); }

    /* ════════════════════════════════════════════════════════
       STATS
    ════════════════════════════════════════════════════════ */
    .stats-bar {
      background: var(--bg2); border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border); padding: var(--s8) var(--s6);
    }
    .stats-inner {
      max-width: 700px; margin: 0 auto;
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: var(--s4); text-align: center;
    }
    .stat-val { font-size: 32px; font-weight: 800; color: var(--primary); }
    .stat-label { font-size: 12px; color: var(--muted); margin-top: 4px; }

    /* ════════════════════════════════════════════════════════
       FEATURES
    ════════════════════════════════════════════════════════ */
    .section { padding: var(--s16) var(--s6); max-width: 1100px; margin: 0 auto; }
    .sec-header { text-align: center; margin-bottom: var(--s12); }
    .sec-header h2 { font-size: clamp(26px, 4vw, 40px); font-weight: 800; margin-bottom: var(--s3); }
    .sec-header p  { color: var(--muted); font-size: 17px; }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--s6);
    }
    .feat-card {
      background: var(--bg2); border: 1px solid var(--border);
      border-radius: var(--r-xl); padding: var(--s8) var(--s6);
      text-align: center; transition: var(--t);
      opacity: 0; transform: translateY(30px);
    }
    .feat-card.visible { animation: slideUp 0.6s ease forwards; }
    :is(.feat-card:nth-child(2)).visible { animation-delay: 0.15s; }
    :is(.feat-card:nth-child(3)).visible { animation-delay: 0.3s; }
    :is(.feat-card:nth-child(4)).visible { animation-delay: 0.45s; }
    .feat-card:hover {
      border-color: var(--primary);
      transform: translateY(-8px);
      box-shadow: var(--glow);
    }
    .feat-icon { font-size: 48px; display: block; margin-bottom: var(--s4); animation: float 6s ease infinite; }
    .feat-card h3 { font-size: 18px; font-weight: 700; margin-bottom: var(--s3); }
    .feat-card p  { color: var(--muted); font-size: 14px; line-height: 1.65; }

    /* ════════════════════════════════════════════════════════
       PRICING
    ════════════════════════════════════════════════════════ */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: var(--s6); align-items: start;
    }
    .price-card {
      background: var(--bg2); border: 1px solid var(--border);
      border-radius: var(--r-xl); padding: var(--s8);
      transition: var(--t); position: relative;
    }
    .price-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
    .price-card.popular {
      background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(167,139,250,0.1));
      border-color: var(--primary);
      transform: scale(1.04);
    }
    .price-card.popular:hover { transform: scale(1.04) translateY(-4px); }
    .popular-badge {
      position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
      background: var(--primary); color: white;
      padding: 4px 16px; border-radius: var(--r-full);
      font-size: 11px; font-weight: 700; white-space: nowrap;
    }
    .plan-name  { font-size: 14px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--s2); }
    .plan-price { font-size: 48px; font-weight: 800; color: var(--text); margin-bottom: var(--s4); }
    .plan-price span { font-size: 18px; font-weight: 500; color: var(--muted); }
    .plan-features { list-style: none; margin-bottom: var(--s6); }
    .plan-features li { padding: var(--s2) 0; font-size: 14px; color: var(--muted); border-bottom: 1px solid var(--border); }
    .plan-features li:last-child { border: none; }
    .plan-features li::before { content: "✓ "; color: var(--primary); font-weight: 700; }
    .plan-btn {
      display: block; text-align: center;
      padding: var(--s3) var(--s6); border-radius: var(--r-md);
      font-weight: 700; font-size: 14px; text-decoration: none;
      transition: var(--t-bounce);
    }
    .plan-btn-primary { background: var(--primary); color: white; }
    .plan-btn-primary:hover { background: var(--primary2); transform: translateY(-2px); box-shadow: var(--glow); }
    .plan-btn-outline { background: transparent; color: var(--primary); border: 2px solid var(--primary); }
    .plan-btn-outline:hover { background: rgba(99,102,241,0.1); transform: translateY(-2px); }

    /* ════════════════════════════════════════════════════════
       FOOTER
    ════════════════════════════════════════════════════════ */
    footer {
      background: #020617; border-top: 1px solid var(--border);
      padding: var(--s8) var(--s6);
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: var(--s4);
    }
    footer p { color: var(--muted); font-size: 14px; }
    .footer-links { display: flex; gap: var(--s6); }
    .footer-links a { color: var(--muted); text-decoration: none; font-size: 14px; transition: color 0.2s; }
    .footer-links a:hover { color: var(--accent); }

    /* ════════════════════════════════════════════════════════
       RESPONSIVE
    ════════════════════════════════════════════════════════ */
    @media (max-width: 640px) {
      .nav-links { display: none; }
      .stats-inner { grid-template-columns: repeat(2, 1fr); }
      .hero h1 { font-size: 36px; }
      .price-card.popular { transform: scale(1); }
    }
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav>
    <div class="logo">Study<span>Earn</span> AI</div>
    <ul class="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#pricing">Pricing</a></li>
    </ul>
    <div class="nav-right">
      <button class="theme-btn" onclick="toggleTheme()" id="themeBtn" title="Toggle theme">🌙</button>
      <a href="#" class="cta-btn">Start Free →</a>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <span class="float-emoji fe1">🐍</span>
    <span class="float-emoji fe2">⚡</span>
    <span class="float-emoji fe3">🌐</span>
    <span class="float-emoji fe4">⚛️</span>

    <div class="hero-content">
      <div class="hero-badge">
        <span class="pulse-dot"></span>
        ✨ Beta Launch — 500+ Students Enrolled
      </div>
      <h1>Code Seekho.<br><span class="grad-text">Pro Bano. Earn Karo.</span></h1>
      <p class="hero-sub">
        Gamified, AI-powered aur 100% free. 3 mahine mein noob se pro.
        Certificate bhi milega! 🎓
      </p>
      <div class="hero-btns">
        <a href="#" class="hero-btn hb-primary">🚀 Start for Free</a>
        <a href="#features" class="hero-btn hb-outline">✨ See Features</a>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <div class="stats-bar">
    <div class="stats-inner">
      <div><div class="stat-val">500+</div><div class="stat-label">Students</div></div>
      <div><div class="stat-val">5</div><div class="stat-label">Languages</div></div>
      <div><div class="stat-val">48+</div><div class="stat-label">Sections</div></div>
      <div><div class="stat-val">100%</div><div class="stat-label">Free</div></div>
    </div>
  </div>

  <!-- Features -->
  <div class="section">
    <div class="sec-header" id="features">
      <h2>Kyun StudyEarn AI?</h2>
      <p>Hamare platform ke unique features</p>
    </div>
    <div class="features-grid">
      <div class="feat-card">
        <span class="feat-icon">🤖</span>
        <h3>AI Powered Hints</h3>
        <p>Stuck ho? Groq AI se turant hints aur code explanations milte hain. Kabhi akela mat feel karo!</p>
      </div>
      <div class="feat-card">
        <span class="feat-icon">💻</span>
        <h3>Live Code Editor</h3>
        <p>Python browser mein seedha run karo — Skulpt engine se. Setup nahi, seedha code!</p>
      </div>
      <div class="feat-card">
        <span class="feat-icon">🎮</span>
        <h3>Gamified Learning</h3>
        <p>XP earn karo, streaks maintain karo, badges unlock karo. Coding ek game hai!</p>
      </div>
      <div class="feat-card">
        <span class="feat-icon">🎓</span>
        <h3>Certificate</h3>
        <p>12 weeks complete karo — downloadable aur sharable certificate milega!</p>
      </div>
    </div>
  </div>

  <!-- Pricing -->
  <div class="section" id="pricing">
    <div class="sec-header">
      <h2>Simple Pricing</h2>
      <p>No hidden fees — forever free!</p>
    </div>
    <div class="pricing-grid">
      <div class="price-card">
        <div class="plan-name">Basic</div>
        <div class="plan-price">₹0 <span>/month</span></div>
        <ul class="plan-features">
          <li>Python + HTML courses</li>
          <li>AI hints (5/day)</li>
          <li>Basic certificate</li>
          <li>Community forum</li>
        </ul>
        <a href="#" class="plan-btn plan-btn-outline">Start Free</a>
      </div>

      <div class="price-card popular">
        <div class="popular-badge">✨ Most Popular</div>
        <div class="plan-name">Pro</div>
        <div class="plan-price">₹499 <span>/month</span></div>
        <ul class="plan-features">
          <li>All 5 languages</li>
          <li>Unlimited AI hints</li>
          <li>Premium certificate</li>
          <li>Live mentorship calls</li>
          <li>Job placement help</li>
        </ul>
        <a href="#" class="plan-btn plan-btn-primary">Get Pro →</a>
      </div>

      <div class="price-card">
        <div class="plan-name">Enterprise</div>
        <div class="plan-price">₹999 <span>/month</span></div>
        <ul class="plan-features">
          <li>Everything in Pro</li>
          <li>Team management</li>
          <li>Custom courses</li>
          <li>Dedicated support</li>
          <li>Analytics dashboard</li>
        </ul>
        <a href="#" class="plan-btn plan-btn-outline">Contact Us</a>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer>
    <p>&copy; 2024 StudyEarn AI | Made with HTML + CSS 💜</p>
    <div class="footer-links">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Contact</a>
      <a href="#">GitHub</a>
    </div>
  </footer>

  <script>
    function toggleTheme() {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      html.setAttribute('data-theme', isDark ? 'light' : 'dark');
      document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }

    // Load saved theme
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('themeBtn').textContent = saved === 'dark' ? '🌙' : '☀️';

    // Scroll animations
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.feat-card').forEach(el => observer.observe(el));
  </script>

</body>
</html>`,
      codeExample_en: `<!-- Same complete code — already in English. See above. -->`,
      task: {
        description: 'Month 2 Capstone: Choose Option A, B, or C and build it completely. Minimum requirements: (1) CSS variables design system with at least 15 tokens, (2) Dark/Light mode with localStorage, (3) 3 media query breakpoints (mobile/tablet/desktop), (4) At least 5 different animations (@keyframes), (5) Flexbox navbar + CSS Grid content sections, (6) Card hover effects with transitions, (7) Scroll-triggered animations (Intersection Observer), (8) Modern selectors (:is(), :focus-visible), (9) Google Fonts, (10) Fully responsive. This is your Month 2 portfolio piece!',
        description_en: 'Month 2 Capstone: Choose Option A, B, or C and build it completely. Minimum requirements: (1) CSS variables design system with at least 15 tokens, (2) Dark/Light mode with localStorage, (3) 3 media query breakpoints (mobile/tablet/desktop), (4) At least 5 different animations (@keyframes), (5) Flexbox navbar + CSS Grid content sections, (6) Card hover effects with transitions, (7) Scroll-triggered animations (Intersection Observer), (8) Modern selectors (:is(), :focus-visible), (9) Google Fonts, (10) Fully responsive. This is your Month 2 portfolio piece!',
        hint: 'Pehle HTML structure banao (poore site ka), phir CSS variables define karo, phir section by section style karo. Dark mode sabse last mein add karo — sirf [data-theme="dark"] { --bg: #0f172a; } add karo aur colors swap ho jaayenge!',
        hint_en: 'Build the HTML structure first (the whole site), then define CSS variables, then style section by section. Add dark mode last — just add [data-theme="dark"] { --bg: #0f172a; } and the colours will swap automatically!',
      },
      quiz: [
        {
          q: 'Month 2 mein CSS ke kaunse main topics cover kiye?',
          options: ['Sirf colors aur fonts', 'CSS Basics, Flexbox, Grid, Responsive, Transitions, Transforms, Animations, Variables, Modern Selectors', 'Sirf layout', 'JavaScript aur CSS'],
          correct: 1,
          explanation: 'Month 2 mein CSS ka foundation se advanced tak sab kuch cover kiya: styling basics, Flexbox aur Grid layouts, responsive design, CSS animations, CSS variables aur dark mode, aur modern selectors.',
          q_en: 'Which main CSS topics were covered in Month 2?',
          options_en: ['Only colours and fonts', 'CSS Basics, Flexbox, Grid, Responsive, Transitions, Transforms, Animations, Variables, Modern Selectors', 'Only layout', 'JavaScript and CSS'],
          explanation_en: 'Month 2 covered CSS from foundation to advanced: styling basics, Flexbox and Grid layouts, responsive design, CSS animations, CSS variables and dark mode, and modern selectors.',
        },
        {
          q: 'Professional website mein performance ke liye kya dhyan rakhna chahiye?',
          options: ['Kuch nahi', 'Sirf zaruri animations, transform/opacity animate karo (not margin/width), system fonts ya woff2 fonts use karo', 'Zyada animations better hain', 'CSS variables slow karte hain'],
          correct: 1,
          explanation: 'Performance tips: transform aur opacity animate karo (GPU accelerated), margin/width/height animate karna expensive hai. Fonts: system font stack ya preload Google Fonts. Animations: will-change: transform hint de sakte ho browser ko.',
          q_en: 'What should you keep in mind for performance on a professional website?',
          options_en: ['Nothing', 'Only essential animations, animate transform/opacity (not margin/width), use system fonts or woff2 fonts', 'More animations are better', 'CSS variables make sites slow'],
          explanation_en: 'Performance tips: animate transform and opacity (GPU accelerated) rather than margin/width/height (expensive). Fonts: use a system font stack or preload Google Fonts. Animations: you can hint with will-change: transform.',
        },
        {
          q: 'CSS sikhne ke baad next logical step kya hai?',
          options: ['PHP seekhna', 'JavaScript — websites ko interactive banane ke liye (DOM manipulation, events, APIs)', 'Database seekhna', 'Server setup karna'],
          correct: 1,
          explanation: 'Web dev path: HTML (structure) → CSS (styling) → JavaScript (interactivity). JS se click events, form validation, API calls, dynamic content, animations sab possible hote hain bina page reload ke!',
          q_en: 'What is the logical next step after learning CSS?',
          options_en: ['Learning PHP', 'JavaScript — to make websites interactive (DOM manipulation, events, APIs)', 'Learning databases', 'Setting up a server'],
          explanation_en: 'Web dev path: HTML (structure) → CSS (styling) → JavaScript (interactivity). With JS you can handle click events, form validation, API calls, dynamic content, and animations without a page reload!',
        },
      ],
    },

    {
      id: 'html-w8-s4',
      title: 'Month 2 Review aur Month 3 Preview',
      title_en: 'Month 2 Review and Month 3 Preview',
      emoji: '🔭',
      content: `## Month 2 Complete! CSS Master Ban Gaye! 🎉

### Month 2 Complete Summary:

**Week 5 — CSS Basics:**
- Colors (hex, rgb, rgba, hsl)
- Text styling (font, size, weight, align)
- CSS selectors (element, class, ID, pseudo)
- Box Model (margin, padding, border, box-sizing)
- Project: Styled Blog Page

**Week 6 — Layout:**
- CSS Flexbox (direction, wrap, justify, align, gap)
- CSS Grid (template-columns, template-areas, auto-fit)
- Responsive Design (media queries, mobile-first, viewport)
- Project: Complete Responsive Portfolio

**Week 7 — Motion:**
- Transitions (property, duration, timing, hover patterns)
- Transforms (translate, scale, rotate, 3D, perspective)
- @keyframes Animations (stagger, scroll-triggered, complex)
- Project: Animated Landing Page

**Week 8 — Advanced:**
- CSS Variables (design tokens, dark mode, JS integration)
- Modern Selectors (:is(), :where(), :has(), :focus-visible)
- Month 2 Capstone Project

### Kya Seekha — Skills Recap:

\`\`\`css
/* ✅ CSS Variables */
:root { --primary: #6366f1; }
element { color: var(--primary); }

/* ✅ Dark Mode */
[data-theme="dark"] { --bg: #0f172a; }

/* ✅ Flexbox */
.nav { display: flex; justify-content: space-between; }

/* ✅ Grid */
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }

/* ✅ Responsive */
@media (min-width: 768px) { .cards { grid-template-columns: repeat(3, 1fr); } }

/* ✅ Transitions */
.card { transition: transform 0.3s ease; }
.card:hover { transform: translateY(-8px); }

/* ✅ Animations */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; } }
.hero-text { animation: fadeInUp 0.6s ease 0.2s both; }

/* ✅ Modern Selectors */
:is(h1, h2, h3) { color: var(--text); }
.card:has(img) { padding: 0; }
:focus-visible { outline: 3px solid var(--primary); }
\`\`\`

### Month 3 Preview — JavaScript!

\`\`\`
Month 3 — JavaScript (Weeks 9-12):

  Week 9:  JS Basics
           - Variables, data types, functions
           - DOM manipulation (getElementById, querySelector)
           - Events (click, submit, keydown)
           - Project: Interactive Counter + To-Do List

  Week 10: Intermediate JS
           - Arrays, objects, loops
           - ES6+ (arrow functions, destructuring, spread)
           - Fetch API (AJAX calls)
           - Project: Weather App using API

  Week 11: Advanced JS
           - Promises, async/await
           - Local Storage
           - Form validation
           - Project: Notes App with localStorage

  Week 12: JS Capstone
           - Complete Interactive Portfolio
           - Dynamic content loading
           - API integration
           - Final Certification Project
\`\`\`

### Career Path Update:

\`\`\`
HTML ✅ (Month 1)
    ↓
CSS  ✅ (Month 2)
    ↓
JavaScript → Month 3 Shuru!
    ↓
React.js → After Course
    ↓
Junior Frontend Developer 🎯
Salary: ₹3-8 LPA
\`\`\``,
      content_en: `## Month 2 Complete! You Are a CSS Master! 🎉

### Month 2 Complete Summary:

**Week 5 — CSS Basics:**
- Colours (hex, rgb, rgba, hsl)
- Text styling (font, size, weight, align)
- CSS selectors (element, class, ID, pseudo)
- Box Model (margin, padding, border, box-sizing)
- Project: Styled Blog Page

**Week 6 — Layout:**
- CSS Flexbox (direction, wrap, justify, align, gap)
- CSS Grid (template-columns, template-areas, auto-fit)
- Responsive Design (media queries, mobile-first, viewport)
- Project: Complete Responsive Portfolio

**Week 7 — Motion:**
- Transitions (property, duration, timing, hover patterns)
- Transforms (translate, scale, rotate, 3D, perspective)
- @keyframes Animations (stagger, scroll-triggered, complex)
- Project: Animated Landing Page

**Week 8 — Advanced:**
- CSS Variables (design tokens, dark mode, JS integration)
- Modern Selectors (:is(), :where(), :has(), :focus-visible)
- Month 2 Capstone Project

### Month 3 Preview — JavaScript!

\`\`\`
Month 3 — JavaScript (Weeks 9–12):

  Week 9:  JS Basics
           - Variables, data types, functions
           - DOM manipulation (getElementById, querySelector)
           - Events (click, submit, keydown)
           - Project: Interactive Counter + To-Do List

  Week 10: Intermediate JS
           - Arrays, objects, loops
           - ES6+ (arrow functions, destructuring, spread)
           - Fetch API (AJAX calls)
           - Project: Weather App using API

  Week 11: Advanced JS
           - Promises, async/await
           - Local Storage
           - Form validation
           - Project: Notes App with localStorage

  Week 12: JS Capstone
           - Complete Interactive Portfolio
           - Dynamic content loading
           - API integration
           - Final Certification Project
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Month 2 Complete!</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px 20px; }

    .celebrate {
      text-align: center;
      background: linear-gradient(-45deg, #1e1b4b, #6366f1, #312e81);
      background-size: 300% 300%;
      animation: grad 6s ease infinite;
      padding: 60px 40px; border-radius: 24px;
      margin-bottom: 40px;
    }
    @keyframes grad {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
    .celebrate h1 { font-size: 48px; margin-bottom: 16px; }
    .celebrate p  { font-size: 18px; opacity: 0.85; }

    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin: 32px 0; }
    .week-card {
      background: #1e293b; border-radius: 16px; padding: 24px;
      border: 1px solid rgba(99,102,241,0.15);
      transition: all 0.3s; cursor: pointer;
      opacity: 0;
      animation: fadeInUp 0.5s ease forwards;
    }
    .week-card:nth-child(1) { animation-delay: 0.1s; }
    .week-card:nth-child(2) { animation-delay: 0.2s; }
    .week-card:nth-child(3) { animation-delay: 0.3s; }
    .week-card:nth-child(4) { animation-delay: 0.4s; }
    .week-card:hover { border-color: #6366f1; transform: translateY(-4px); }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .week-num { color: #6366f1; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .week-card h3 { font-size: 16px; margin-bottom: 12px; }
    .week-card ul { list-style: none; }
    .week-card li { font-size: 13px; color: #64748b; padding: 4px 0; }
    .week-card li::before { content: "✓ "; color: #6366f1; font-weight: 700; }

    .next-section { text-align: center; margin-top: 40px; }
    .next-section h2 { font-size: 28px; margin-bottom: 16px; }
    .next-btn {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      color: white; padding: 16px 40px;
      border-radius: 12px; font-weight: 700; font-size: 16px;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      animation: pulse 2s ease infinite;
    }
    @keyframes pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
      50%      { box-shadow: 0 0 0 16px rgba(99,102,241,0); }
    }
    .next-btn:hover { transform: translateY(-4px) scale(1.03); }
  </style>
</head>
<body>

  <div class="celebrate">
    <h1>🎉 Month 2 Complete!</h1>
    <p>CSS Master ban gaye — transitions, animations, grid, flexbox sab kuch!</p>
  </div>

  <div class="summary">
    <div class="week-card">
      <div class="week-num">Week 5</div>
      <h3>CSS Basics</h3>
      <ul>
        <li>Colors aur fonts</li>
        <li>Selectors</li>
        <li>Box Model</li>
        <li>Blog Page project</li>
      </ul>
    </div>
    <div class="week-card">
      <div class="week-num">Week 6</div>
      <h3>Layout</h3>
      <ul>
        <li>Flexbox</li>
        <li>CSS Grid</li>
        <li>Responsive Design</li>
        <li>Portfolio project</li>
      </ul>
    </div>
    <div class="week-card">
      <div class="week-num">Week 7</div>
      <h3>Animations</h3>
      <ul>
        <li>Transitions</li>
        <li>Transforms (3D)</li>
        <li>@keyframes</li>
        <li>Landing page project</li>
      </ul>
    </div>
    <div class="week-card">
      <div class="week-num">Week 8</div>
      <h3>Advanced CSS</h3>
      <ul>
        <li>CSS Variables</li>
        <li>Dark Mode</li>
        <li>:has(), :is()</li>
        <li>Capstone project</li>
      </ul>
    </div>
  </div>

  <div class="next-section">
    <h2>🚀 Month 3 — JavaScript Shuru!</h2>
    <p style="color:#64748b; margin-bottom:24px;">
      HTML structure ✅ · CSS styling ✅ · JavaScript interactivity = next!
    </p>
    <a href="#" class="next-btn">Start JavaScript →</a>
  </div>

</body>
</html>`,
      codeExample_en: `<!-- Same code — see above, content is already in English where applicable -->`,
      task: {
        description: 'Month 2 Final Challenge: (1) Apna capstone project W3C Validator se validate karo, (2) Browser DevTools mein performance check karo — Lighthouse run karo (Performance, Accessibility, Best Practices), (3) Ek "CSS Skills Summary" page banao jisme progress bars se har week ka confidence level dikhao, (4) GitHub pe upload karo aur README.md banao, (5) LinkedIn pe share karo — "I just completed Month 2 of CSS on StudyEarn AI!" Aage JavaScript seekhne ke liye tayar ho jao!',
        description_en: 'Month 2 Final Challenge: (1) Validate your capstone project at the W3C Validator, (2) Check performance in Browser DevTools — run Lighthouse (Performance, Accessibility, Best Practices), (3) Create a "CSS Skills Summary" page with progress bars showing your confidence level for each week, (4) Upload to GitHub and write a README.md, (5) Share on LinkedIn — "I just completed Month 2 of CSS on StudyEarn AI!" Get ready to learn JavaScript next!',
        hint: 'Lighthouse: Browser mein F12 → Lighthouse tab → Analyze page load. 90+ score aim karo. GitHub: git init, git add ., git commit -m "Month 2 Complete", GitHub pe new repo create karo, phir push karo.',
        hint_en: 'Lighthouse: In the browser press F12 → Lighthouse tab → Analyze page load. Aim for a 90+ score. GitHub: git init, git add ., git commit -m "Month 2 Complete", create a new repo on GitHub, then push.',
      },
      quiz: [
        {
          q: 'CSS Grid aur Flexbox mein kab konsa use karein?',
          options: ['Hamesha Grid', 'Grid = 2D layouts (rows AND columns), Flexbox = 1D (row OR column)', 'Hamesha Flexbox', 'Dono same hain'],
          correct: 1,
          explanation: 'Flexbox: navbar, button group, single row/column. Grid: page layout, card gallery, dashboard. Real world mein dono milke use hote hain — Grid page level pe, Flexbox components ke andar.',
          q_en: 'When should you use CSS Grid vs Flexbox?',
          options_en: ['Always Grid', 'Grid = 2D layouts (rows AND columns), Flexbox = 1D (row OR column)', 'Always Flexbox', 'Both are the same'],
          explanation_en: 'Flexbox: navbars, button groups, single rows/columns. Grid: page layouts, card galleries, dashboards. In the real world, both are used together — Grid at the page level, Flexbox inside components.',
        },
        {
          q: 'Web performance ke liye sabse important CSS property kaunsi animate karni chahiye?',
          options: ['width aur height', 'margin aur padding', 'transform aur opacity — GPU accelerated hain', 'background-color aur font-size'],
          correct: 2,
          explanation: 'transform (translate, scale, rotate) aur opacity GPU pe render hote hain — no layout recalculation. width/height/margin animate karne pe browser har frame mein poora layout recalculate karta hai — expensive!',
          q_en: 'Which CSS properties should you animate for the best performance?',
          options_en: ['width and height', 'margin and padding', 'transform and opacity — they are GPU accelerated', 'background-color and font-size'],
          explanation_en: 'transform (translate, scale, rotate) and opacity render on the GPU — no layout recalculation. Animating width/height/margin forces the browser to recalculate the full layout every frame — expensive!',
        },
        {
          q: 'Ek professional web developer kaise banta hai?',
          options: ['Sirf tutorials dekhke', 'Projects banao, GitHub pe upload karo, real feedback lo, continuously seekhte raho', 'Certificate collect karo', 'Books padho'],
          correct: 1,
          explanation: 'Real developers: 20% theory, 80% practice. Real projects banao (GitHub pe dikhao), code reviews lo, communities join karo, production bugs fix karo. Yahi actual learning hai!',
          q_en: 'How does one become a professional web developer?',
          options_en: ['Just watch tutorials', 'Build projects, upload to GitHub, get real feedback, keep learning continuously', 'Collect certificates', 'Read books'],
          explanation_en: 'Real developers: 20% theory, 80% practice. Build real projects (show them on GitHub), get code reviews, join communities, fix production bugs. That is actual learning!',
        },
      ],
    },
  ],
};