/**
 * StudyEarn AI — HTML Course
 * Week 5: CSS Basics — Apne HTML ko Sundar Banao
 * Hinglish content + English translations built-in
 */

export const HTML_WEEK_5 = {
  week: 5,
  title: 'CSS Basics — HTML ko Sundar Banao',
  title_en: 'CSS Basics — Making HTML Beautiful',
  description: 'CSS se apne HTML pages ko colors, fonts aur styling do!',
  description_en: 'Use CSS to give your HTML pages colours, fonts and styling!',
  xpReward: 160,
  sections: [
    {
      id: 'html-w5-s1',
      title: 'CSS kya hai — Styling ka Introduction',
      title_en: 'What is CSS — Introduction to Styling',
      emoji: '🎨',
      content: `## CSS — Web ka Makeup Artist!

HTML se structure banta hai, **CSS (Cascading Style Sheets)** se usse beautiful banate hain!

### CSS kaise kaam karta hai?

\`\`\`css
selector {
  property: value;
}
\`\`\`

\`\`\`html
<!-- Inline CSS — ek element pe directly -->
<h1 style="color: purple; font-size: 32px;">Hello!</h1>

<!-- Internal CSS — <style> tag mein -->
<head>
  <style>
    h1 { color: purple; }
    p  { font-size: 18px; }
  </style>
</head>

<!-- External CSS — alag .css file (BEST PRACTICE) -->
<head>
  <link rel="stylesheet" href="style.css">
</head>
\`\`\`

### Colors in CSS

\`\`\`css
/* Named colors */
color: red;
color: blue;
color: tomato;
color: steelblue;

/* Hex codes (#RRGGBB) */
color: #ff0000;   /* red */
color: #6366f1;   /* violet */
color: #f59e0b;   /* amber */

/* RGB */
color: rgb(99, 102, 241);

/* RGBA — transparency ke saath */
color: rgba(99, 102, 241, 0.5);

/* HSL */
color: hsl(240, 80%, 67%);
\`\`\`

### Text Styling

\`\`\`css
p {
  color: #333333;
  font-size: 18px;
  font-family: Arial, sans-serif;
  font-weight: bold;       /* normal, bold, 100-900 */
  font-style: italic;
  text-decoration: underline;  /* none, underline, line-through */
  text-transform: uppercase;   /* lowercase, capitalize */
  text-align: center;          /* left, right, justify */
  line-height: 1.6;            /* line spacing */
  letter-spacing: 2px;
}
\`\`\`

### Background

\`\`\`css
body {
  background-color: #f0f0f0;
  background-image: url('bg.jpg');
  background-size: cover;      /* contain, 100% */
  background-position: center;
  background-repeat: no-repeat;

  /* Shorthand */
  background: #1a1a2e url('bg.jpg') center/cover no-repeat;
}

/* Gradient */
.hero {
  background: linear-gradient(135deg, #6366f1, #a78bfa);
  background: radial-gradient(circle, #6366f1, #1a1a2e);
}
\`\`\``,
      content_en: `## CSS — The Makeup Artist of the Web!

HTML creates structure, **CSS (Cascading Style Sheets)** makes it beautiful!

### How Does CSS Work?

\`\`\`css
selector {
  property: value;
}
\`\`\`

\`\`\`html
<!-- Inline CSS — directly on one element -->
<h1 style="color: purple; font-size: 32px;">Hello!</h1>

<!-- Internal CSS — inside <style> tag -->
<head>
  <style>
    h1 { color: purple; }
    p  { font-size: 18px; }
  </style>
</head>

<!-- External CSS — separate .css file (BEST PRACTICE) -->
<head>
  <link rel="stylesheet" href="style.css">
</head>
\`\`\`

### Colors in CSS

\`\`\`css
/* Named colors */
color: red;
color: tomato;
color: steelblue;

/* Hex codes (#RRGGBB) */
color: #ff0000;   /* red */
color: #6366f1;   /* violet */

/* RGB */
color: rgb(99, 102, 241);

/* RGBA — with transparency */
color: rgba(99, 102, 241, 0.5);

/* HSL */
color: hsl(240, 80%, 67%);
\`\`\`

### Text Styling

\`\`\`css
p {
  color: #333333;
  font-size: 18px;
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-style: italic;
  text-decoration: underline;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.6;
  letter-spacing: 2px;
}
\`\`\`

### Background

\`\`\`css
body {
  background-color: #f0f0f0;

  /* Gradient */
  background: linear-gradient(135deg, #6366f1, #a78bfa);
  background: radial-gradient(circle, #6366f1, #1a1a2e);
}
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Basics Demo</title>
  <style>
    /* Reset */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f8f9fa;
      color: #333;
    }

    /* Header */
    header {
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    header h1 {
      font-size: 48px;
      letter-spacing: 2px;
      margin-bottom: 10px;
    }
    header p {
      font-size: 20px;
      opacity: 0.9;
    }

    /* Main content */
    main {
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }

    h2 {
      color: #6366f1;
      font-size: 28px;
      margin-bottom: 15px;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 8px;
    }

    p {
      font-size: 16px;
      line-height: 1.8;
      color: #555;
      margin-bottom: 15px;
    }

    /* Highlight box */
    .highlight {
      background: #ede9fe;
      border-left: 4px solid #6366f1;
      padding: 16px 20px;
      border-radius: 0 8px 8px 0;
      margin: 20px 0;
    }

    /* Footer */
    footer {
      background: #1a1a2e;
      color: white;
      text-align: center;
      padding: 20px;
      margin-top: 60px;
    }
  </style>
</head>
<body>

  <header>
    <h1>🎨 CSS Basics</h1>
    <p>HTML + CSS = Beautiful Webpage!</p>
  </header>

  <main>
    <h2>CSS kya karta hai?</h2>
    <p>CSS se hum HTML elements ko style karte hain — colors,
    fonts, spacing, layout — sab kuch CSS se control hota hai.</p>

    <div class="highlight">
      <strong>💡 Tip:</strong> Hamesha external CSS file use karo
      — <code>style.css</code> alag banao aur HTML mein link karo!
    </div>

    <h2>Color Examples</h2>
    <p style="color: #6366f1; font-weight: bold;">
      Yeh violet color hai — hex: #6366f1
    </p>
    <p style="color: #f59e0b; font-weight: bold;">
      Yeh amber color hai — hex: #f59e0b
    </p>
    <p style="background: linear-gradient(90deg,#6366f1,#ec4899);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              font-size: 24px; font-weight: bold;">
      Gradient Text! ✨
    </p>
  </main>

  <footer>
    <p>Made with HTML + CSS 💜</p>
  </footer>

</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Basics Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f8f9fa;
      color: #333;
    }

    header {
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    header h1 { font-size: 48px; letter-spacing: 2px; margin-bottom: 10px; }
    header p  { font-size: 20px; opacity: 0.9; }

    main {
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }

    h2 {
      color: #6366f1;
      font-size: 28px;
      margin-bottom: 15px;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 8px;
    }

    p {
      font-size: 16px;
      line-height: 1.8;
      color: #555;
      margin-bottom: 15px;
    }

    .highlight {
      background: #ede9fe;
      border-left: 4px solid #6366f1;
      padding: 16px 20px;
      border-radius: 0 8px 8px 0;
      margin: 20px 0;
    }

    footer {
      background: #1a1a2e;
      color: white;
      text-align: center;
      padding: 20px;
      margin-top: 60px;
    }
  </style>
</head>
<body>

  <header>
    <h1>🎨 CSS Basics</h1>
    <p>HTML + CSS = Beautiful Webpage!</p>
  </header>

  <main>
    <h2>What Does CSS Do?</h2>
    <p>CSS lets us style HTML elements — colours, fonts,
    spacing, layout — everything is controlled by CSS.</p>

    <div class="highlight">
      <strong>💡 Tip:</strong> Always use an external CSS file
      — create a separate <code>style.css</code> and link it in HTML!
    </div>

    <h2>Colour Examples</h2>
    <p style="color: #6366f1; font-weight: bold;">
      This is violet — hex: #6366f1
    </p>
    <p style="background: linear-gradient(90deg,#6366f1,#ec4899);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              font-size: 24px; font-weight: bold;">
      Gradient Text! ✨
    </p>
  </main>

  <footer>
    <p>Made with HTML + CSS 💜</p>
  </footer>

</body>
</html>`,
      task: {
        description: 'Apni Week 2 ki resume webpage ko CSS se style karo! Ismein hona chahiye: (1) Header mein gradient background (violet se purple), (2) Body mein acha font-family, background color, (3) H2 headings ko color aur border-bottom se highlight karo, (4) Links ko style karo — hover pe color change ho, (5) Footer dark background ke saath, (6) Ek .highlight class banao important text ke liye.',
        description_en: 'Style your Week 2 resume webpage with CSS! It must have: (1) Header with a gradient background (violet to purple), (2) Good font-family and background colour on body, (3) H2 headings highlighted with colour and border-bottom, (4) Styled links — colour changes on hover, (5) Footer with dark background, (6) A .highlight class for important text.',
        hint: 'Internal CSS use karo pehle — <style> tag head mein. Hover ke liye: a:hover { color: #6366f1; }. Gradient: background: linear-gradient(135deg, #6366f1, #a78bfa);',
        hint_en: 'Use internal CSS first — <style> tag inside head. For hover: a:hover { color: #6366f1; }. Gradient: background: linear-gradient(135deg, #6366f1, #a78bfa);',
      },
      quiz: [
        {
          q: 'CSS use karne ka best tarika kaunsa hai?',
          options: ['Inline CSS (style attribute)', 'Internal CSS (<style> tag)', 'External CSS (alag .css file)', 'Teeno same hain'],
          correct: 2,
          explanation: 'External CSS best practice hai — ek file se poori website style hoti hai, maintainable hoti hai, aur browser cache karta hai speed ke liye.',
          q_en: 'What is the best way to use CSS?',
          options_en: ['Inline CSS (style attribute)', 'Internal CSS (<style> tag)', 'External CSS (separate .css file)', 'All three are the same'],
          explanation_en: 'External CSS is best practice — one file styles the entire website, it is maintainable, and the browser caches it for speed.',
        },
        {
          q: 'Hex color #ff0000 kaunsa color hai?',
          options: ['Blue', 'Green', 'Red', 'Yellow'],
          correct: 2,
          explanation: '#ff0000 = RGB(255,0,0) = pure red. FF = 255 (max), 00 = 0. Red channel full on, green and blue off.',
          q_en: 'What colour is the hex code #ff0000?',
          options_en: ['Blue', 'Green', 'Red', 'Yellow'],
          explanation_en: '#ff0000 = RGB(255,0,0) = pure red. FF = 255 (maximum), 00 = 0. Red channel fully on, green and blue off.',
        },
        {
          q: 'CSS mein text ko center karne ke liye kya use karte hain?',
          options: ['text-position: center', 'text-align: center', 'align: center', 'center: true'],
          correct: 1,
          explanation: 'text-align: center; se text horizontally center hota hai. Vertically center karne ke liye flexbox use karte hain.',
          q_en: 'What property is used to centre text in CSS?',
          options_en: ['text-position: center', 'text-align: center', 'align: center', 'center: true'],
          explanation_en: 'text-align: center; centres text horizontally. For vertical centring, use flexbox.',
        },
      ],
    },

    {
      id: 'html-w5-s2',
      title: 'CSS Selectors — Elements ko Target Karo',
      title_en: 'CSS Selectors — Targeting Elements',
      emoji: '🎯',
      content: `## CSS Selectors — Exactly Kaunsa Element Style Karna Hai?

### Basic Selectors

\`\`\`css
/* Element selector */
h1 { color: violet; }
p  { font-size: 16px; }

/* Class selector (.) — multiple elements */
.card { background: white; border-radius: 8px; }
.highlight { background: yellow; }

/* ID selector (#) — ek unique element */
#hero { background: linear-gradient(135deg, #6366f1, #a78bfa); }
#footer { background: #1a1a2e; }

/* Universal selector */
* { box-sizing: border-box; margin: 0; }
\`\`\`

### Grouping aur Combinators

\`\`\`css
/* Multiple elements ek saath */
h1, h2, h3 { font-family: 'Georgia', serif; }

/* Descendant — nav ke andar ke a tags */
nav a { color: white; text-decoration: none; }

/* Direct child (>) */
ul > li { list-style: none; }

/* Adjacent sibling (+) */
h2 + p { font-size: 18px; font-weight: bold; }

/* General sibling (~) */
h2 ~ p { color: #666; }
\`\`\`

### Attribute Selectors

\`\`\`css
/* Has attribute */
[disabled] { opacity: 0.5; cursor: not-allowed; }

/* Specific value */
[type="text"]    { border: 2px solid #ccc; }
[type="submit"]  { background: #6366f1; color: white; }

/* Starts with */
[href^="https"]  { color: green; }

/* Ends with */
[src$=".png"]    { border: 2px solid blue; }

/* Contains */
[class*="btn"]   { padding: 8px 16px; border-radius: 6px; }
\`\`\`

### Pseudo-classes

\`\`\`css
/* Hover, focus, active */
a:hover           { color: #6366f1; text-decoration: underline; }
button:hover      { background: #4f46e5; transform: scale(1.05); }
input:focus       { outline: 3px solid #6366f1; border-color: #6366f1; }
button:active     { transform: scale(0.98); }

/* Structure */
li:first-child    { font-weight: bold; }
li:last-child     { border-bottom: none; }
li:nth-child(2)   { color: red; }
li:nth-child(odd) { background: #f0f0f0; }
tr:nth-child(even){ background: #f8f8f8; }

/* Form states */
input:valid       { border-color: green; }
input:invalid     { border-color: red; }
input:disabled    { background: #eee; }
input:checked + label { font-weight: bold; }

/* Not */
p:not(.special)   { color: #333; }
\`\`\`

### Pseudo-elements

\`\`\`css
/* Before aur after — content inject karo */
.required::before {
  content: "* ";
  color: red;
}

h2::after {
  content: "";
  display: block;
  width: 50px;
  height: 3px;
  background: #6366f1;
  margin-top: 8px;
}

/* First letter aur first line */
p::first-letter { font-size: 2em; float: left; }
p::first-line   { font-weight: bold; }

/* Selection color */
::selection { background: #6366f1; color: white; }
\`\`\`

### CSS Specificity — Priority Order

\`\`\`
Inline style     → 1000 points (highest)
ID (#)           → 100  points
Class/Pseudo (.) → 10   points
Element          → 1    point (lowest)

Example:
#header .nav a:hover → 100 + 10 + 1 + 10 = 121 points
\`\`\``,
      content_en: `## CSS Selectors — Targeting Exactly the Right Element

### Basic Selectors

\`\`\`css
/* Element selector */
h1 { color: violet; }
p  { font-size: 16px; }

/* Class selector (.) — multiple elements */
.card      { background: white; border-radius: 8px; }
.highlight { background: yellow; }

/* ID selector (#) — one unique element */
#hero   { background: linear-gradient(135deg, #6366f1, #a78bfa); }
#footer { background: #1a1a2e; }

/* Universal selector */
* { box-sizing: border-box; margin: 0; }
\`\`\`

### Grouping and Combinators

\`\`\`css
/* Multiple elements at once */
h1, h2, h3 { font-family: 'Georgia', serif; }

/* Descendant — all <a> tags inside <nav> */
nav a { color: white; text-decoration: none; }

/* Direct child (>) */
ul > li { list-style: none; }

/* Adjacent sibling (+) */
h2 + p { font-size: 18px; font-weight: bold; }
\`\`\`

### Attribute Selectors

\`\`\`css
[type="text"]   { border: 2px solid #ccc; }
[type="submit"] { background: #6366f1; color: white; }
[href^="https"] { color: green; }   /* starts with */
[src$=".png"]   { border: 2px solid blue; }  /* ends with */
\`\`\`

### Pseudo-classes

\`\`\`css
a:hover           { color: #6366f1; }
button:hover      { background: #4f46e5; transform: scale(1.05); }
input:focus       { outline: 3px solid #6366f1; }
li:nth-child(odd) { background: #f0f0f0; }
tr:nth-child(even){ background: #f8f8f8; }
input:valid       { border-color: green; }
input:invalid     { border-color: red; }
\`\`\`

### Pseudo-elements

\`\`\`css
.required::before {
  content: "* ";
  color: red;
}

h2::after {
  content: "";
  display: block;
  width: 50px; height: 3px;
  background: #6366f1;
  margin-top: 8px;
}

::selection { background: #6366f1; color: white; }
\`\`\`

### CSS Specificity — Priority Order

\`\`\`
Inline style     → 1000 points (highest)
ID (#)           → 100  points
Class/Pseudo (.) → 10   points
Element          → 1    point  (lowest)
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Selectors Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 20px; background: #f8f9fa; }

    /* Element + Grouping */
    h1, h2 { color: #6366f1; margin-bottom: 12px; }
    h2::after {
      content: ""; display: block;
      width: 40px; height: 3px;
      background: #6366f1; margin-top: 6px;
    }

    /* Class selector */
    .card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin: 12px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .card.featured {
      border: 2px solid #6366f1;
    }

    /* Pseudo-classes — hover effects */
    .btn {
      display: inline-block;
      padding: 10px 24px;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn:hover { background: #4f46e5; transform: translateY(-2px); }
    .btn:active { transform: translateY(0); }

    /* nth-child — table rows */
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th { background: #6366f1; color: white; padding: 10px; }
    td { padding: 10px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) td { background: #f0f0f0; }
    tr:hover td { background: #ede9fe; }

    /* Attribute selector */
    input[type="text"]  { border: 2px solid #ccc; padding: 8px; border-radius: 6px; }
    input:focus         { border-color: #6366f1; outline: none; }
    input:valid         { border-color: #10b981; }

    /* ::before pseudo-element */
    .required label::before { content: "* "; color: red; }

    /* ::selection */
    ::selection { background: #6366f1; color: white; }
  </style>
</head>
<body>

  <h1>🎯 CSS Selectors Demo</h1>

  <div class="card">
    <h2>Normal Card</h2>
    <p>Yeh ek normal card hai — .card class se styled.</p>
    <br>
    <a href="#" class="btn">Click Me!</a>
  </div>

  <div class="card featured">
    <h2>Featured Card</h2>
    <p>Yeh .card.featured hai — violet border ke saath!</p>
  </div>

  <div class="card">
    <h2>nth-child Table</h2>
    <table>
      <thead>
        <tr><th>Name</th><th>Subject</th><th>Marks</th></tr>
      </thead>
      <tbody>
        <tr><td>Rahul</td><td>Math</td><td>95</td></tr>
        <tr><td>Priya</td><td>Science</td><td>88</td></tr>
        <tr><td>Arjun</td><td>English</td><td>92</td></tr>
        <tr><td>Neha</td><td>Hindi</td><td>85</td></tr>
      </tbody>
    </table>
  </div>

  <div class="card required">
    <h2>Form Selectors</h2>
    <label>Name (required):</label><br>
    <input type="text" required placeholder="Type something...">
  </div>

</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Selectors Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 20px; background: #f8f9fa; }

    h1, h2 { color: #6366f1; margin-bottom: 12px; }
    h2::after {
      content: ""; display: block;
      width: 40px; height: 3px;
      background: #6366f1; margin-top: 6px;
    }

    .card {
      background: white; border-radius: 12px;
      padding: 20px; margin: 12px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .card.featured { border: 2px solid #6366f1; }

    .btn {
      display: inline-block; padding: 10px 24px;
      background: #6366f1; color: white;
      border: none; border-radius: 8px;
      cursor: pointer; text-decoration: none;
      transition: all 0.2s;
    }
    .btn:hover { background: #4f46e5; transform: translateY(-2px); }
    .btn:active { transform: translateY(0); }

    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th { background: #6366f1; color: white; padding: 10px; }
    td { padding: 10px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) td { background: #f0f0f0; }
    tr:hover td { background: #ede9fe; }

    input[type="text"] { border: 2px solid #ccc; padding: 8px; border-radius: 6px; }
    input:focus        { border-color: #6366f1; outline: none; }
    input:valid        { border-color: #10b981; }

    ::selection { background: #6366f1; color: white; }
  </style>
</head>
<body>

  <h1>🎯 CSS Selectors Demo</h1>

  <div class="card">
    <h2>Normal Card</h2>
    <p>This is a normal card — styled with the .card class.</p>
    <br>
    <a href="#" class="btn">Click Me!</a>
  </div>

  <div class="card featured">
    <h2>Featured Card</h2>
    <p>This is .card.featured — with a violet border!</p>
  </div>

  <div class="card">
    <h2>nth-child Table</h2>
    <table>
      <thead>
        <tr><th>Name</th><th>Subject</th><th>Marks</th></tr>
      </thead>
      <tbody>
        <tr><td>Rahul</td><td>Math</td><td>95</td></tr>
        <tr><td>Priya</td><td>Science</td><td>88</td></tr>
        <tr><td>Arjun</td><td>English</td><td>92</td></tr>
        <tr><td>Neha</td><td>Hindi</td><td>85</td></tr>
      </tbody>
    </table>
  </div>

</body>
</html>`,
      task: {
        description: 'Ek "Styled Navigation Menu" banao CSS selectors use karke. Ismein hona chahiye: (1) nav ul li a — links white, no underline, (2) a:hover — background change, smooth transition, (3) .active class — current page highlight, (4) Table zebra striping — tr:nth-child(even), (5) Form inputs — :focus state violet border, :valid green border, :invalid red border, (6) Buttons — hover pe scale + shadow effect, (7) ::selection — text select karne pe violet background.',
        description_en: 'Build a "Styled Navigation Menu" using CSS selectors. It must have: (1) nav ul li a — white links, no underline, (2) a:hover — background changes with smooth transition, (3) .active class — current page highlighted, (4) Table zebra striping — tr:nth-child(even), (5) Form inputs — :focus violet border, :valid green, :invalid red, (6) Buttons — scale + shadow on hover, (7) ::selection — violet background when text is selected.',
        hint: 'transition: all 0.2s ease; smooth hover ke liye. :nth-child(even) alternate rows color karta hai. transform: scale(1.05) button thoda bada dikhata hai hover pe.',
        hint_en: 'transition: all 0.2s ease; for smooth hover. :nth-child(even) colours alternate rows. transform: scale(1.05) makes the button slightly larger on hover.',
      },
      quiz: [
        {
          q: 'Class selector aur ID selector mein kya fark hai?',
          options: ['Koi fark nahi', 'Class (.) multiple elements pe use ho sakti hai, ID (#) sirf ek unique element pe', 'ID faster hai', 'Class sirf divs ke liye hai'],
          correct: 1,
          explanation: 'Class — ek page pe multiple elements pe same class use ho sakti hai. ID — unique hona chahiye, ek page pe sirf ek element ka woh ID hona chahiye.',
          q_en: 'What is the difference between a class selector and an ID selector?',
          options_en: ['No difference', 'A class (.) can be used on multiple elements, an ID (#) is for one unique element only', 'ID is faster', 'Class is only for divs'],
          explanation_en: 'Class — the same class can be applied to multiple elements on a page. ID — must be unique; only one element on the page should have that ID.',
        },
        {
          q: 'li:nth-child(2n+1) kaun se items select karta hai?',
          options: ['Even items', 'Odd items', 'Every 2nd item', 'First item only'],
          correct: 1,
          explanation: '2n+1 = 1, 3, 5, 7... = odd items. 2n = even. :nth-child(odd) aur :nth-child(2n+1) same hain.',
          q_en: 'Which items does li:nth-child(2n+1) select?',
          options_en: ['Even items', 'Odd items', 'Every 2nd item', 'First item only'],
          explanation_en: '2n+1 = 1, 3, 5, 7... = odd items. 2n = even. :nth-child(odd) and :nth-child(2n+1) are equivalent.',
        },
        {
          q: '::before aur ::after pseudo-elements kya karte hain?',
          options: ['Element ke before/after naye elements banate hain', 'CSS se HTML content inject karte hain element ke pehle/baad mein', 'Elements reorder karte hain', 'Display hide karte hain'],
          correct: 1,
          explanation: '::before aur ::after CSS se content property ka use karke element ke pehle ya baad decorative content add karte hain — bina HTML badlaav ke.',
          q_en: 'What do the ::before and ::after pseudo-elements do?',
          options_en: ['Create new elements before/after', 'Inject CSS content before/after an element without changing HTML', 'Reorder elements', 'Hide elements'],
          explanation_en: '::before and ::after use the content property to add decorative content before or after an element — without any changes to the HTML.',
        },
      ],
    },

    {
      id: 'html-w5-s3',
      title: 'Box Model — Spacing aur Layout ka Foundation',
      title_en: 'Box Model — The Foundation of Spacing and Layout',
      emoji: '📦',
      content: `## CSS Box Model — Har Element ek Box Hai!

HTML ka har element ek box hai jisme 4 layers hote hain:

\`\`\`
┌─────────────────────────────┐
│         MARGIN              │ ← Element ke bahar space
│  ┌───────────────────────┐  │
│  │       BORDER          │  │ ← Border line
│  │  ┌─────────────────┐  │  │
│  │  │    PADDING      │  │  │ ← Content ke around space
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  CONTENT  │  │  │  │ ← Actual text/image
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
\`\`\`

### Margin — Bahar ki Space

\`\`\`css
/* Sab sides */
margin: 20px;

/* Top/Bottom, Left/Right */
margin: 20px 40px;

/* Top, Right, Bottom, Left (clockwise) */
margin: 10px 20px 30px 40px;

/* Individual sides */
margin-top: 20px;
margin-right: 15px;
margin-bottom: 20px;
margin-left: 15px;

/* Auto — horizontally center karo */
.container {
  max-width: 900px;
  margin: 0 auto;  /* top/bottom 0, left/right auto = centered */
}
\`\`\`

### Padding — Andar ki Space

\`\`\`css
/* Same syntax as margin */
padding: 20px;
padding: 12px 24px;         /* vertical, horizontal */
padding: 10px 20px 15px 20px;

.card {
  padding: 24px;
  background: white;
}

.btn {
  padding: 12px 32px;       /* button ke andar space */
}
\`\`\`

### Border

\`\`\`css
/* Shorthand: width style color */
border: 2px solid #6366f1;
border: 1px dashed #ccc;
border: 3px dotted red;

/* Individual sides */
border-top: 3px solid #6366f1;
border-bottom: 1px solid #eee;
border-left: 4px solid #6366f1;  /* left accent */

/* Border radius — rounded corners */
border-radius: 8px;          /* sab corners */
border-radius: 50%;          /* perfect circle */
border-radius: 12px 4px;     /* top-left/bottom-right, top-right/bottom-left */

/* Border styles */
border-style: solid | dashed | dotted | double | none;
\`\`\`

### Box Sizing — ZARURI!

\`\`\`css
/* Default (content-box): width sirf content ki hoti hai
   padding + border ADD hote hain width mein */
.box { width: 300px; padding: 20px; }
/* Actual width = 300 + 20 + 20 = 340px ❌ Confusing! */

/* Better: border-box — width mein padding+border INCLUDED */
* { box-sizing: border-box; }
.box { width: 300px; padding: 20px; }
/* Actual width = exactly 300px ✅ */
\`\`\`

### Display Property

\`\`\`css
display: block;        /* Full width, new line pe */
display: inline;       /* Sirf content jitna, same line */
display: inline-block; /* Same line + width/height set ho sakti hai */
display: none;         /* Hide completely (space bhi nahi) */
display: flex;         /* Flexbox (next section mein) */
display: grid;         /* Grid layout */
\`\`\`

### Width aur Height

\`\`\`css
.box {
  width: 300px;
  height: 200px;
  max-width: 100%;      /* Responsive! */
  min-height: 100vh;    /* Viewport height */

  /* Overflow */
  overflow: hidden;     /* Bahar jaane wala content hide */
  overflow: scroll;     /* Scroll bar */
  overflow: auto;       /* Zarurat pe scroll bar */
  overflow-x: hidden;   /* Horizontal overflow hide */
}
\`\`\``,
      content_en: `## CSS Box Model — Every Element is a Box!

Every HTML element is a box with 4 layers:

\`\`\`
┌─────────────────────────────┐
│         MARGIN              │ ← Space outside the element
│  ┌───────────────────────┐  │
│  │       BORDER          │  │ ← Border line
│  │  ┌─────────────────┐  │  │
│  │  │    PADDING      │  │  │ ← Space around the content
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  CONTENT  │  │  │  │ ← Actual text/image
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
\`\`\`

### Margin — Outside Space

\`\`\`css
margin: 20px;               /* All sides */
margin: 20px 40px;          /* Top/Bottom, Left/Right */
margin: 10px 20px 30px 40px;/* Top, Right, Bottom, Left */

/* Centre a container horizontally */
.container {
  max-width: 900px;
  margin: 0 auto;
}
\`\`\`

### Padding — Inside Space

\`\`\`css
padding: 20px;
padding: 12px 24px;         /* vertical, horizontal */

.card { padding: 24px; background: white; }
.btn  { padding: 12px 32px; }
\`\`\`

### Border

\`\`\`css
border: 2px solid #6366f1;
border: 1px dashed #ccc;
border-left: 4px solid #6366f1;  /* left accent */

border-radius: 8px;   /* rounded corners */
border-radius: 50%;   /* perfect circle */
\`\`\`

### Box Sizing — IMPORTANT!

\`\`\`css
/* Always add this — width includes padding and border */
* { box-sizing: border-box; }

.box { width: 300px; padding: 20px; }
/* Actual width = exactly 300px ✅ */
\`\`\`

### Display Property

\`\`\`css
display: block;        /* Full width, new line */
display: inline;       /* Content width, same line */
display: inline-block; /* Same line + can set width/height */
display: none;         /* Hide completely */
display: flex;         /* Flexbox layout */
display: grid;         /* Grid layout */
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Box Model Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 20px; }

    /* Container — centered */
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }

    h1 {
      color: #6366f1;
      padding: 20px 0;
      border-bottom: 3px solid #6366f1;
      margin-bottom: 30px;
    }

    /* Card with full box model */
    .card {
      background: white;
      padding: 24px;
      margin-bottom: 20px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .card h2 {
      color: #334155;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #f1f5f9;
    }

    .card p { color: #64748b; line-height: 1.7; }

    /* Buttons with padding */
    .btn {
      display: inline-block;
      padding: 10px 24px;
      margin: 8px 4px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary { background: #6366f1; color: white; }
    .btn-primary:hover { background: #4f46e5; transform: translateY(-2px); }
    .btn-outline {
      background: transparent;
      color: #6366f1;
      border: 2px solid #6366f1;
    }
    .btn-outline:hover { background: #6366f1; color: white; }

    /* Circle avatar */
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: white;
      margin-bottom: 12px;
    }

    /* Left border accent */
    .info-box {
      border-left: 4px solid #6366f1;
      background: #ede9fe;
      padding: 16px 20px;
      border-radius: 0 8px 8px 0;
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📦 Box Model Demo</h1>

    <div class="card">
      <div class="avatar">👤</div>
      <h2>Rahul Kumar</h2>
      <p>Web Developer | Mumbai, India</p>
      <div class="info-box">
        <strong>Box Model in Action!</strong> Is card mein:
        padding: 24px andar, margin-bottom: 20px bahar,
        border-radius: 12px corners, border: 1px solid outline.
      </div>
      <br>
      <button class="btn btn-primary">Primary Button</button>
      <button class="btn btn-outline">Outline Button</button>
    </div>

    <div class="card">
      <h2>Spacing Visual</h2>
      <p>Browser DevTools (F12 → Elements → Computed) mein
      box model visually dekh sakte ho — colorful diagram!</p>
    </div>
  </div>
</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Box Model Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 20px; }

    .container { max-width: 800px; margin: 0 auto; padding: 0 20px; }

    h1 {
      color: #6366f1;
      padding: 20px 0;
      border-bottom: 3px solid #6366f1;
      margin-bottom: 30px;
    }

    .card {
      background: white;
      padding: 24px;
      margin-bottom: 20px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .card h2 { color: #334155; margin-bottom: 12px; }
    .card p  { color: #64748b; line-height: 1.7; }

    .btn {
      display: inline-block;
      padding: 10px 24px; margin: 8px 4px;
      border-radius: 8px; font-weight: 600;
      cursor: pointer; border: none; transition: all 0.2s;
    }
    .btn-primary { background: #6366f1; color: white; }
    .btn-primary:hover { background: #4f46e5; transform: translateY(-2px); }
    .btn-outline { background: transparent; color: #6366f1; border: 2px solid #6366f1; }
    .btn-outline:hover { background: #6366f1; color: white; }

    .avatar {
      width: 80px; height: 80px; border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 32px; color: white; margin-bottom: 12px;
    }

    .info-box {
      border-left: 4px solid #6366f1;
      background: #ede9fe;
      padding: 16px 20px;
      border-radius: 0 8px 8px 0;
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📦 Box Model Demo</h1>

    <div class="card">
      <div class="avatar">👤</div>
      <h2>Rahul Kumar</h2>
      <p>Web Developer | Mumbai, India</p>
      <div class="info-box">
        <strong>Box Model in Action!</strong> This card has:
        padding: 24px inside, margin-bottom: 20px outside,
        border-radius: 12px on corners, border: 1px solid outline.
      </div>
      <br>
      <button class="btn btn-primary">Primary Button</button>
      <button class="btn btn-outline">Outline Button</button>
    </div>
  </div>
</body>
</html>`,
      task: {
        description: 'Ek "Pricing Cards" layout banao Box Model use karke. Teen cards (Basic, Pro, Enterprise). Har card mein: padding: 32px, border-radius: 16px, ek card mein "Popular" badge, price bold + big font size, features list, button bottom mein. Pro card ko highlight karo — different background + scale(1.05). margin: 0 auto se container center karo. box-sizing: border-box zaroor use karo.',
        description_en: 'Build a "Pricing Cards" layout using the Box Model. Three cards (Basic, Pro, Enterprise). Each card must have: padding: 32px, border-radius: 16px, one card with a "Popular" badge, price in bold + large font size, features list, button at the bottom. Highlight the Pro card — different background + scale(1.05). Centre the container with margin: 0 auto. Make sure to use box-sizing: border-box.',
        hint: 'Cards ko side by side rakhne ke liye display: inline-block; ya float: left; use karo. Ya simply margin auto se vertical stack bhi theek hai abhi — flexbox next section mein seekhenge!',
        hint_en: 'To place cards side by side, use display: inline-block; or float: left; — or a simple vertical stack with margin auto is also fine for now. We will learn flexbox in the next section!',
      },
      quiz: [
        {
          q: 'box-sizing: border-box kyun use karte hain?',
          options: ['Performance ke liye', 'Width mein padding aur border include hoti hai — predictable sizing', 'Color fix karne ke liye', 'Animation ke liye'],
          correct: 1,
          explanation: 'Default content-box mein width sirf content ki hoti hai — padding add karne se element bada ho jaata hai unexpectedly. border-box mein width total size fix karta hai including padding and border.',
          q_en: 'Why do we use box-sizing: border-box?',
          options_en: ['For performance', 'Padding and border are included in the width — predictable sizing', 'To fix colours', 'For animations'],
          explanation_en: 'With the default content-box, width only covers the content — adding padding makes the element unexpectedly larger. With border-box, the width is the fixed total size including padding and border.',
        },
        {
          q: 'margin: 0 auto kya karta hai?',
          options: ['Element ko hide karta hai', 'Element ko horizontally center karta hai — fixed width ke saath', 'Top margin 0 karta hai', 'Sab margins remove karta hai'],
          correct: 1,
          explanation: 'margin: 0 auto — top/bottom margin 0, left/right auto (barabar distribute). Isse block element center ho jaata hai — zaroor width ya max-width set karni hogi.',
          q_en: 'What does margin: 0 auto do?',
          options_en: ['Hides the element', 'Centres the element horizontally — requires a fixed width', 'Sets top margin to 0', 'Removes all margins'],
          explanation_en: 'margin: 0 auto — top/bottom margin 0, left/right auto (equally distributed). This centres a block element — a width or max-width must also be set.',
        },
        {
          q: 'border-radius: 50% kya banata hai?',
          options: ['Half circle', 'Perfect circle (agar width = height)', 'Oval shape', 'Rounded rectangle'],
          correct: 1,
          explanation: 'border-radius: 50% sab corners ke radius ko width/height ka 50% set karta hai. Agar element square hai (width = height) toh perfect circle banega.',
          q_en: 'What does border-radius: 50% create?',
          options_en: ['Half circle', 'Perfect circle (if width = height)', 'Oval shape', 'Rounded rectangle'],
          explanation_en: 'border-radius: 50% sets all corners to 50% of the width/height. If the element is square (width = height), it becomes a perfect circle.',
        },
      ],
    },

    {
      id: 'html-w5-s4',
      title: 'Week 5 Project — Styled Blog Page',
      title_en: 'Week 5 Project — Styled Blog Page',
      emoji: '📰',
      content: `## Week 5 Project — HTML + CSS Blog Page!

Ab tak CSS mein seekha:
- Colors, fonts, text styling
- Selectors (element, class, ID, pseudo)
- Box Model (margin, padding, border)

In sab ko use karke ek **complete styled blog page** banao!

### Blog Page Structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    /* 1. Reset + Base */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ...; background: ...; color: ...; }

    /* 2. Layout */
    .container { max-width: 900px; margin: 0 auto; padding: 0 20px; }

    /* 3. Header */
    header { background: gradient; color: white; padding: 20px; }
    nav ul  { list-style: none; display: flex; gap: 20px; }
    nav a   { color: white; text-decoration: none; }
    nav a:hover { border-bottom: 2px solid white; }

    /* 4. Blog Cards */
    .blog-grid { display: grid; ... }   /* Next week mein */
    .card { background: white; border-radius: 12px; padding: 24px; }
    .card:hover { transform: translateY(-4px); box-shadow: ...; }

    /* 5. Tags/Badges */
    .tag {
      display: inline-block;
      padding: 4px 12px;
      background: #ede9fe;
      color: #6366f1;
      border-radius: 20px;
      font-size: 12px;
    }

    /* 6. Read More button */
    .btn { ... }

    /* 7. Footer */
    footer { background: #1a1a2e; color: white; ... }
  </style>
</head>
\`\`\`

### CSS Features to Include:
1. ✅ Gradient header background
2. ✅ Google Fonts import
3. ✅ Card hover effects (transform + box-shadow)
4. ✅ Tag/badge pills with border-radius
5. ✅ Smooth transitions on all interactive elements
6. ✅ Proper color scheme (consistent throughout)
7. ✅ Typography hierarchy (h1 > h2 > p)`,
      content_en: `## Week 5 Project — HTML + CSS Blog Page!

CSS learned so far:
- Colours, fonts, text styling
- Selectors (element, class, ID, pseudo)
- Box Model (margin, padding, border)

Use all of these to build a **complete styled blog page**!

### Blog Page Structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    /* 1. Reset + Base */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ...; background: ...; color: ...; }

    /* 2. Layout */
    .container { max-width: 900px; margin: 0 auto; padding: 0 20px; }

    /* 3. Header */
    header { background: gradient; color: white; padding: 20px; }
    nav a   { color: white; text-decoration: none; }
    nav a:hover { border-bottom: 2px solid white; }

    /* 4. Blog Cards */
    .card { background: white; border-radius: 12px; padding: 24px; }
    .card:hover { transform: translateY(-4px); box-shadow: ...; }

    /* 5. Tags/Badges */
    .tag {
      display: inline-block;
      padding: 4px 12px;
      background: #ede9fe; color: #6366f1;
      border-radius: 20px; font-size: 12px;
    }

    /* 6. Footer */
    footer { background: #1a1a2e; color: white; ... }
  </style>
</head>
\`\`\`

### CSS Features to Include:
1. ✅ Gradient header background
2. ✅ Google Fonts import
3. ✅ Card hover effects (transform + box-shadow)
4. ✅ Tag/badge pills with border-radius
5. ✅ Smooth transitions on all interactive elements
6. ✅ Consistent colour scheme throughout
7. ✅ Typography hierarchy (h1 > h2 > p)`,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StudyEarn Blog</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <style>
    /* ── Reset ─────────────────────────────────── */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    /* ── Base ──────────────────────────────────── */
    body {
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      color: #334155;
      line-height: 1.6;
    }

    /* ── Header ─────────────────────────────────── */
    header {
      background: linear-gradient(135deg, #1e1b4b, #6366f1);
      color: white;
      padding: 0 20px;
    }
    .header-inner {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      letter-spacing: 1px;
    }
    nav ul { list-style: none; display: flex; gap: 24px; }
    nav a  {
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s;
      padding-bottom: 2px;
    }
    nav a:hover { color: white; border-bottom: 2px solid white; }
    nav a.active { color: white; border-bottom: 2px solid #a78bfa; }

    /* ── Hero ──────────────────────────────────── */
    .hero {
      background: linear-gradient(135deg, #1e1b4b, #6366f1);
      color: white;
      text-align: center;
      padding: 80px 20px;
    }
    .hero h1 {
      font-family: 'Playfair Display', serif;
      font-size: 52px;
      margin-bottom: 16px;
    }
    .hero p { font-size: 20px; opacity: 0.85; max-width: 500px; margin: 0 auto; }

    /* ── Container ──────────────────────────────── */
    .container { max-width: 900px; margin: 0 auto; padding: 60px 20px; }

    /* ── Section titles ──────────────────────────── */
    .section-title {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }
    .section-subtitle {
      color: #64748b;
      margin-bottom: 32px;
    }

    /* ── Blog Card ──────────────────────────────── */
    .card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      margin-bottom: 28px;
      transition: all 0.3s ease;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(99,102,241,0.12);
      border-color: #c7d2fe;
    }
    .card img {
      width: 100%;
      height: 220px;
      object-fit: cover;
    }
    .card-body { padding: 28px; }

    /* ── Tags ────────────────────────────────────── */
    .tags { margin-bottom: 14px; }
    .tag {
      display: inline-block;
      padding: 4px 14px;
      background: #ede9fe;
      color: #6366f1;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tag.html   { background: #fef3c7; color: #d97706; }
    .tag.css    { background: #ede9fe; color: #6366f1; }
    .tag.python { background: #d1fae5; color: #059669; }

    .card h2 { font-size: 22px; color: #1e293b; margin-bottom: 10px; }
    .card p  { color: #64748b; line-height: 1.7; margin-bottom: 20px; }

    .card-meta {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 16px;
    }
    .card-meta strong { color: #475569; }

    /* ── Button ──────────────────────────────────── */
    .btn {
      display: inline-block;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary { background: #6366f1; color: white; }
    .btn-primary:hover { background: #4f46e5; transform: translateY(-1px); }

    /* ── Footer ──────────────────────────────────── */
    footer {
      background: #1e1b4b;
      color: rgba(255,255,255,0.7);
      text-align: center;
      padding: 32px 20px;
      font-size: 14px;
    }
    footer a { color: #a78bfa; text-decoration: none; }
  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <div class="header-inner">
      <div class="logo">📚 StudyEarn</div>
      <nav>
        <ul>
          <li><a href="#" class="active">Blog</a></li>
          <li><a href="#">Courses</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <h1>Web Dev Blog ✨</h1>
    <p>HTML, CSS, JavaScript aur Python ke tutorials</p>
  </section>

  <!-- Blog Posts -->
  <div class="container">
    <p class="section-title">Latest Articles</p>
    <p class="section-subtitle">Naye tutorials har hafte</p>

    <article class="card">
      <img src="https://picsum.photos/900/220?random=1" alt="HTML Tutorial">
      <div class="card-body">
        <div class="tags">
          <span class="tag html">HTML</span>
          <span class="tag css">CSS</span>
        </div>
        <h2>HTML Basics — Complete Guide for Beginners</h2>
        <p class="card-meta">
          By <strong>Rahul Kumar</strong> · March 15, 2024 · 8 min read
        </p>
        <p>HTML har website ka foundation hai. Is tutorial mein
        hum HTML ke basics se lekar advanced features tak sab
        cover karenge with real examples...</p>
        <a href="#" class="btn btn-primary">Read More →</a>
      </div>
    </article>

    <article class="card">
      <img src="https://picsum.photos/900/220?random=2" alt="CSS Tutorial">
      <div class="card-body">
        <div class="tags">
          <span class="tag css">CSS</span>
        </div>
        <h2>CSS Box Model — Everything You Need to Know</h2>
        <p class="card-meta">
          By <strong>Priya Sharma</strong> · March 10, 2024 · 6 min read
        </p>
        <p>CSS Box Model web development ka core concept hai.
        Margin, padding, border — sab kuch is tutorial mein
        clearly explain kiya gaya hai...</p>
        <a href="#" class="btn btn-primary">Read More →</a>
      </div>
    </article>
  </div>

  <footer>
    <p>&copy; 2024 StudyEarn AI | <a href="#">Privacy Policy</a></p>
  </footer>

</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StudyEarn Blog</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #334155; }

    header { background: linear-gradient(135deg, #1e1b4b, #6366f1); color: white; padding: 0 20px; }
    .header-inner { max-width: 900px; margin: 0 auto; padding: 20px 0; display: flex; align-items: center; justify-content: space-between; }
    .logo { font-family: 'Playfair Display', serif; font-size: 24px; }
    nav ul { list-style: none; display: flex; gap: 24px; }
    nav a  { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
    nav a:hover { color: white; border-bottom: 2px solid white; }

    .hero { background: linear-gradient(135deg, #1e1b4b, #6366f1); color: white; text-align: center; padding: 80px 20px; }
    .hero h1 { font-family: 'Playfair Display', serif; font-size: 52px; margin-bottom: 16px; }
    .hero p  { font-size: 20px; opacity: 0.85; }

    .container { max-width: 900px; margin: 0 auto; padding: 60px 20px; }

    .card { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; margin-bottom: 28px; transition: all 0.3s ease; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(99,102,241,0.12); }
    .card img { width: 100%; height: 220px; object-fit: cover; }
    .card-body { padding: 28px; }

    .tag { display: inline-block; padding: 4px 14px; background: #ede9fe; color: #6366f1; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 6px; }
    .card h2 { font-size: 22px; color: #1e293b; margin: 12px 0 10px; }
    .card p  { color: #64748b; line-height: 1.7; margin-bottom: 20px; }

    .btn { display: inline-block; padding: 10px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-primary { background: #6366f1; color: white; }
    .btn-primary:hover { background: #4f46e5; transform: translateY(-1px); }

    footer { background: #1e1b4b; color: rgba(255,255,255,0.7); text-align: center; padding: 32px 20px; }
    footer a { color: #a78bfa; text-decoration: none; }
  </style>
</head>
<body>

  <header>
    <div class="header-inner">
      <div class="logo">📚 StudyEarn</div>
      <nav><ul>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Courses</a></li>
        <li><a href="#">About</a></li>
      </ul></nav>
    </div>
  </header>

  <section class="hero">
    <h1>Web Dev Blog ✨</h1>
    <p>Tutorials on HTML, CSS, JavaScript and Python</p>
  </section>

  <div class="container">
    <article class="card">
      <img src="https://picsum.photos/900/220?random=1" alt="HTML Tutorial">
      <div class="card-body">
        <span class="tag">HTML</span>
        <h2>HTML Basics — Complete Guide for Beginners</h2>
        <p>By <strong>Rahul Kumar</strong> · March 15, 2024 · 8 min read</p>
        <p>HTML is the foundation of every website. In this tutorial
        we cover everything from HTML basics to advanced features
        with real examples...</p>
        <a href="#" class="btn btn-primary">Read More →</a>
      </div>
    </article>

    <article class="card">
      <img src="https://picsum.photos/900/220?random=2" alt="CSS Tutorial">
      <div class="card-body">
        <span class="tag">CSS</span>
        <h2>CSS Box Model — Everything You Need to Know</h2>
        <p>By <strong>Priya Sharma</strong> · March 10, 2024 · 6 min read</p>
        <p>The CSS Box Model is a core concept in web development.
        Margin, padding, border — all clearly explained
        in this tutorial...</p>
        <a href="#" class="btn btn-primary">Read More →</a>
      </div>
    </article>
  </div>

  <footer>
    <p>&copy; 2024 StudyEarn AI | <a href="#">Privacy Policy</a></p>
  </footer>

</body>
</html>`,
      task: {
        description: 'Complete styled blog page banao apne 3 topics pe (HTML/CSS/Python se related kuch bhi). Requirements: (1) Google Fonts import karo (Inter ya Poppins), (2) Gradient header + hero section, (3) 3 blog post cards — image, tags, title, author, date, excerpt, Read More button, (4) Card hover effect — transform + box-shadow, (5) Tag badges (.tag class — color per category), (6) Responsive images (max-width: 100%), (7) Consistent color scheme poore page mein, (8) Proper footer with links.',
        description_en: 'Build a complete styled blog page on 3 topics of your choice (anything related to HTML/CSS/Python). Requirements: (1) Import Google Fonts (Inter or Poppins), (2) Gradient header + hero section, (3) 3 blog post cards — image, tags, title, author, date, excerpt, Read More button, (4) Card hover effect — transform + box-shadow, (5) Tag badges (.tag class — different colour per category), (6) Responsive images (max-width: 100%), (7) Consistent colour scheme throughout, (8) Proper footer with links.',
        hint: 'Google Fonts CDN: fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700. Card hover: transition: all 0.3s ease; property lagao pehle, phir :hover mein transform + box-shadow.',
        hint_en: 'Google Fonts CDN: fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700. For card hover: add transition: all 0.3s ease; first, then transform + box-shadow inside :hover.',
      },
      quiz: [
        {
          q: 'Google Fonts HTML mein kaise add karte hain?',
          options: ['<script src="fonts.js">', '<link rel="stylesheet" href="fonts.googleapis.com/css2?family=...">', '@import url("fonts.js")', '<font src="google">'],
          correct: 1,
          explanation: 'Google Fonts <link> tag se CSS file load hoti hai jo font define karti hai. Phir font-family property mein us font ka naam use karo.',
          q_en: 'How do you add Google Fonts to HTML?',
          options_en: ['<script src="fonts.js">', '<link rel="stylesheet" href="fonts.googleapis.com/css2?family=...">', '@import url("fonts.js")', '<font src="google">'],
          explanation_en: 'Google Fonts loads a CSS file via a <link> tag that defines the font. Then use the font name in the font-family property.',
        },
        {
          q: 'transition: all 0.3s ease; kya karta hai?',
          options: ['Element ko animate karta hai indefinitely', 'CSS property changes ko 0.3 seconds mein smoothly animate karta hai', 'Element rotate karta hai', '0.3 seconds delay deta hai'],
          correct: 1,
          explanation: 'transition property CSS changes ko smooth banata hai. all = saari properties, 0.3s = 300ms duration, ease = slow start, fast middle, slow end.',
          q_en: 'What does transition: all 0.3s ease; do?',
          options_en: ['Animates the element indefinitely', 'Smoothly animates CSS property changes over 0.3 seconds', 'Rotates the element', 'Adds a 0.3 second delay'],
          explanation_en: 'The transition property makes CSS changes smooth. all = all properties, 0.3s = 300ms duration, ease = slow start, fast middle, slow end.',
        },
        {
          q: 'object-fit: cover img tag pe kya karta hai?',
          options: ['Image resize karta hai stretch karke', 'Image aspect ratio maintain karta hai aur container fill karta hai (crop hoti hai)', 'Image hide karta hai', 'Image transparent banata hai'],
          correct: 1,
          explanation: 'object-fit: cover — image apna aspect ratio maintain karta hai aur container completely fill karta hai. Extra part crop ho jaata hai. Consistent card images ke liye perfect!',
          q_en: 'What does object-fit: cover do on an img tag?',
          options_en: ['Stretches image to fit', 'Maintains aspect ratio and fills the container (crops the overflow)', 'Hides the image', 'Makes image transparent'],
          explanation_en: 'object-fit: cover — the image maintains its aspect ratio and completely fills the container. The overflow is cropped. Perfect for consistent card images!',
        },
      ],
    },
  ],
};