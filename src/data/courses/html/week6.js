/**
 * HTML Course — Week 6: CSS Flexbox Layout
 */

export const HTML_WEEK_6 = {
  week: 6,
  title: 'CSS Flexbox — Modern Layout System',
  title_en: 'CSS Flexbox — Modern Layout System',
  description: 'Flexbox se professional layouts banao — cards, navbars, centering sab kuch!',
  description_en: 'Build professional layouts with Flexbox — cards, navbars, centring and more!',
  xpReward: 180,
  sections: [
    {
      id: 'html-w6-s1',
      title: 'Flexbox Basics — Container aur Items',
      title_en: 'Flexbox Basics — Container and Items',
      emoji: '📐',
      content: `## CSS Flexbox — 1D Layout ka Sabse Powerful Tool!

Flexbox se elements ko easily row ya column mein arrange kar sakte ho.

### Flex Container

\`\`\`css
.container {
  display: flex;              /* Flexbox on karo */

  /* Direction */
  flex-direction: row;        /* → left to right (default) */
  flex-direction: row-reverse;/* ← right to left */
  flex-direction: column;     /* ↓ top to bottom */
  flex-direction: column-reverse; /* ↑ bottom to top */

  /* Wrapping */
  flex-wrap: nowrap;          /* Ek hi line (default) */
  flex-wrap: wrap;            /* Next line pe jaaye */
  flex-wrap: wrap-reverse;    /* Reverse wrap */

  /* Shorthand */
  flex-flow: row wrap;
}
\`\`\`

### Alignment

\`\`\`css
.container {
  /* Main axis (flex-direction ke along) */
  justify-content: flex-start;    /* Left (default) */
  justify-content: flex-end;      /* Right */
  justify-content: center;        /* Center */
  justify-content: space-between; /* Equal space between */
  justify-content: space-around;  /* Equal space around */
  justify-content: space-evenly;  /* Perfectly equal space */

  /* Cross axis (perpendicular) */
  align-items: stretch;     /* Full height (default) */
  align-items: flex-start;  /* Top */
  align-items: flex-end;    /* Bottom */
  align-items: center;      /* Center (MOST USEFUL!) */
  align-items: baseline;    /* Text baseline align */

  /* Multiple lines */
  align-content: flex-start | center | space-between | space-around;

  /* GAP between items */
  gap: 20px;         /* Row + column gap same */
  gap: 20px 40px;    /* Row gap, Column gap */
  row-gap: 20px;
  column-gap: 40px;
}
\`\`\`

### Flex Items

\`\`\`css
.item {
  /* How much it grows */
  flex-grow: 0;    /* Don't grow (default) */
  flex-grow: 1;    /* Grow to fill available space */
  flex-grow: 2;    /* Grow 2x more than flex-grow: 1 items */

  /* How much it shrinks */
  flex-shrink: 1;  /* Can shrink (default) */
  flex-shrink: 0;  /* Don't shrink — fixed size */

  /* Base size */
  flex-basis: auto;   /* Use width/content (default) */
  flex-basis: 200px;  /* Start at 200px */
  flex-basis: 25%;    /* Start at 25% of container */

  /* Shorthand: grow shrink basis */
  flex: 0 0 200px;    /* Fixed 200px, no grow/shrink */
  flex: 1;            /* flex: 1 1 0 — grow equally */
  flex: 1 1 auto;     /* Grow + shrink from content size */

  /* Individual alignment */
  align-self: center;    /* Override parent align-items */
  align-self: flex-end;

  /* Order */
  order: -1;   /* First mein le jao */
  order: 1;    /* Default 0 se baad */
  order: 999;  /* Last mein le jao */
}
\`\`\`

### Centering — Flexbox ki Superpower!

\`\`\`css
/* Perfectly center karo — horizontally + vertically */
.center-me {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;      /* Full viewport height */
}

/* Single item center */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\``,
      content_en: `## CSS Flexbox — The Most Powerful 1D Layout Tool!

Flexbox lets you easily arrange elements in a row or column.

### Flex Container

\`\`\`css
.container {
  display: flex;

  flex-direction: row;         /* → left to right (default) */
  flex-direction: column;      /* ↓ top to bottom */

  flex-wrap: nowrap;           /* Single line (default) */
  flex-wrap: wrap;             /* Wrap to next line */

  /* Main axis alignment */
  justify-content: flex-start;    /* Left (default) */
  justify-content: center;        /* Centred */
  justify-content: space-between; /* Equal space between */
  justify-content: space-evenly;  /* Perfectly equal space */

  /* Cross axis alignment */
  align-items: stretch;     /* Full height (default) */
  align-items: center;      /* Centre — MOST USEFUL! */
  align-items: flex-start;  /* Top */
  align-items: flex-end;    /* Bottom */

  gap: 20px;                /* Space between items */
}
\`\`\`

### Flex Items

\`\`\`css
.item {
  flex-grow: 0;      /* Don't grow (default) */
  flex-grow: 1;      /* Grow to fill available space */

  flex-shrink: 1;    /* Can shrink (default) */
  flex-shrink: 0;    /* Don't shrink — fixed size */

  flex-basis: auto;  /* Use width/content (default) */
  flex-basis: 200px; /* Start at 200px */

  /* Shorthand */
  flex: 1;           /* flex: 1 1 0 — grow equally */
  flex: 0 0 200px;   /* Fixed 200px, no grow/shrink */

  align-self: center;   /* Override parent align-items */
  order: -1;            /* Move to the front */
}
\`\`\`

### Centring — Flexbox Superpower!

\`\`\`css
/* Perfectly centre — horizontally + vertically */
.center-me {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Flexbox Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #f1f5f9; }

    /* ── Navbar ── */
    nav {
      background: linear-gradient(135deg, #1e1b4b, #6366f1);
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }
    .logo { color: white; font-size: 20px; font-weight: 700; }
    .nav-links { display: flex; gap: 24px; list-style: none; }
    .nav-links a { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 14px; }
    .nav-links a:hover { color: white; }
    .nav-btn {
      background: white;
      color: #6366f1;
      padding: 8px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
    }

    /* ── Hero — Perfect Center ── */
    .hero {
      background: linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%);
      color: white;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40px 20px;
    }
    .hero h1 { font-size: 48px; margin-bottom: 16px; }
    .hero p  { font-size: 20px; opacity: 0.85; margin-bottom: 32px; }
    .hero-btns { display: flex; gap: 16px; }
    .btn {
      padding: 12px 28px; border-radius: 8px;
      font-weight: 600; text-decoration: none; cursor: pointer; border: none;
    }
    .btn-white { background: white; color: #6366f1; }
    .btn-outline { background: transparent; color: white; border: 2px solid white; }

    /* ── Cards — flex wrap ── */
    .cards-section { padding: 60px 24px; }
    .cards-section h2 { text-align: center; font-size: 32px; color: #1e293b; margin-bottom: 8px; }
    .cards-section p { text-align: center; color: #64748b; margin-bottom: 40px; }

    .cards-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: center;
    }

    .card {
      background: white;
      border-radius: 16px;
      padding: 32px 24px;
      flex: 1 1 260px;          /* grow, shrink, min 260px */
      max-width: 300px;
      text-align: center;
      border: 1px solid #e2e8f0;
      transition: all 0.3s;
    }
    .card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(99,102,241,0.15); }
    .card-icon { font-size: 48px; margin-bottom: 16px; }
    .card h3 { font-size: 20px; color: #1e293b; margin-bottom: 12px; }
    .card p  { color: #64748b; font-size: 14px; line-height: 1.6; }

    /* ── Two column layout ── */
    .two-col {
      display: flex;
      gap: 40px;
      align-items: center;
      padding: 60px 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    .two-col img   { flex: 1; max-width: 400px; border-radius: 16px; }
    .two-col-text  { flex: 1; }
    .two-col-text h2 { font-size: 32px; color: #1e293b; margin-bottom: 16px; }
    .two-col-text p  { color: #64748b; line-height: 1.7; margin-bottom: 20px; }

    /* ── Footer ── */
    footer {
      background: #1e1b4b;
      color: rgba(255,255,255,0.7);
      padding: 40px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    footer a { color: #a78bfa; text-decoration: none; }
  </style>
</head>
<body>

  <!-- Navbar: space-between, align-items center -->
  <nav>
    <div class="logo">📚 StudyEarn</div>
    <ul class="nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">Courses</a></li>
      <li><a href="#">Blog</a></li>
    </ul>
    <a href="#" class="nav-btn">Sign Up</a>
  </nav>

  <!-- Hero: flex-direction column, justify-content center -->
  <section class="hero">
    <h1>Code Seekho 🚀</h1>
    <p>Gamified, AI-powered aur 100% free</p>
    <div class="hero-btns">
      <a href="#" class="btn btn-white">Get Started →</a>
      <a href="#" class="btn btn-outline">View Courses</a>
    </div>
  </section>

  <!-- Cards: flex-wrap, gap -->
  <section class="cards-section">
    <h2>Why StudyEarn?</h2>
    <p>Hamare platform ke features</p>
    <div class="cards-grid">
      <div class="card">
        <div class="card-icon">🤖</div>
        <h3>AI Powered</h3>
        <p>Groq AI se instant hints aur explanations milte hain.</p>
      </div>
      <div class="card">
        <div class="card-icon">🎮</div>
        <h3>Gamified</h3>
        <p>XP, streaks, badges — coding fun ho jaati hai!</p>
      </div>
      <div class="card">
        <div class="card-icon">🎓</div>
        <h3>Certificate</h3>
        <p>Course complete karo — shareable certificate pao!</p>
      </div>
    </div>
  </section>

  <!-- Two column: flex, align-items center -->
  <section class="two-col">
    <img src="https://picsum.photos/400/300" alt="Learning">
    <div class="two-col-text">
      <h2>Real Projects Banao</h2>
      <p>Sirf theory nahi — har section mein practical
      projects hain jo tumhara portfolio strong banate hain.
      Recruiters real code dekhna chahte hain!</p>
      <a href="#" class="btn btn-white" style="background:#6366f1; color:white; padding:12px 28px; border-radius:8px; font-weight:600; text-decoration:none;">
        Start Learning →
      </a>
    </div>
  </section>

  <!-- Footer: space-between, flex-wrap -->
  <footer>
    <div>
      <strong style="color:white">📚 StudyEarn AI</strong><br>
      Learn. Code. Earn.
    </div>
    <div>
      <a href="#">Privacy</a> ·
      <a href="#">Terms</a> ·
      <a href="#">Contact</a>
    </div>
  </footer>

</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Flexbox Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #f1f5f9; }

    nav {
      background: linear-gradient(135deg, #1e1b4b, #6366f1);
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }
    .logo { color: white; font-size: 20px; font-weight: 700; }
    .nav-links { display: flex; gap: 24px; list-style: none; }
    .nav-links a { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 14px; }

    .hero {
      background: linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%);
      color: white;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40px 20px;
    }
    .hero h1 { font-size: 48px; margin-bottom: 16px; }
    .hero p  { font-size: 20px; opacity: 0.85; margin-bottom: 32px; }
    .hero-btns { display: flex; gap: 16px; }

    .btn { padding: 12px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; }
    .btn-white   { background: white; color: #6366f1; }
    .btn-outline { background: transparent; color: white; border: 2px solid white; }

    .cards-section { padding: 60px 24px; }
    .cards-section h2 { text-align: center; font-size: 32px; color: #1e293b; margin-bottom: 8px; }
    .cards-grid { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; margin-top: 40px; }
    .card {
      background: white; border-radius: 16px; padding: 32px 24px;
      flex: 1 1 260px; max-width: 300px; text-align: center;
      border: 1px solid #e2e8f0; transition: all 0.3s;
    }
    .card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(99,102,241,0.15); }
    .card-icon { font-size: 48px; margin-bottom: 16px; }
    .card h3   { font-size: 20px; color: #1e293b; margin-bottom: 12px; }
    .card p    { color: #64748b; font-size: 14px; line-height: 1.6; }

    .two-col {
      display: flex; gap: 40px; align-items: center;
      padding: 60px 24px; max-width: 900px; margin: 0 auto;
    }
    .two-col img       { flex: 1; max-width: 400px; border-radius: 16px; }
    .two-col-text      { flex: 1; }
    .two-col-text h2   { font-size: 32px; color: #1e293b; margin-bottom: 16px; }
    .two-col-text p    { color: #64748b; line-height: 1.7; margin-bottom: 20px; }

    footer {
      background: #1e1b4b; color: rgba(255,255,255,0.7);
      padding: 40px 24px;
      display: flex; justify-content: space-between;
      align-items: center; flex-wrap: wrap; gap: 20px;
    }
    footer a { color: #a78bfa; text-decoration: none; }
  </style>
</head>
<body>

  <nav>
    <div class="logo">📚 StudyEarn</div>
    <ul class="nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">Courses</a></li>
      <li><a href="#">Blog</a></li>
    </ul>
    <a href="#" style="background:white; color:#6366f1; padding:8px 20px; border-radius:8px; font-weight:600; text-decoration:none; font-size:14px;">Sign Up</a>
  </nav>

  <section class="hero">
    <h1>Learn to Code 🚀</h1>
    <p>Gamified, AI-powered and 100% free</p>
    <div class="hero-btns">
      <a href="#" class="btn btn-white">Get Started →</a>
      <a href="#" class="btn btn-outline">View Courses</a>
    </div>
  </section>

  <section class="cards-section">
    <h2>Why StudyEarn?</h2>
    <div class="cards-grid">
      <div class="card">
        <div class="card-icon">🤖</div>
        <h3>AI Powered</h3>
        <p>Get instant hints and explanations from Groq AI.</p>
      </div>
      <div class="card">
        <div class="card-icon">🎮</div>
        <h3>Gamified</h3>
        <p>XP, streaks, badges — coding becomes fun!</p>
      </div>
      <div class="card">
        <div class="card-icon">🎓</div>
        <h3>Certificate</h3>
        <p>Complete the course — earn a shareable certificate!</p>
      </div>
    </div>
  </section>

  <section class="two-col">
    <img src="https://picsum.photos/400/300" alt="Learning">
    <div class="two-col-text">
      <h2>Build Real Projects</h2>
      <p>Not just theory — every section includes practical
      projects that strengthen your portfolio.
      Recruiters want to see real code!</p>
      <a href="#" style="background:#6366f1; color:white; padding:12px 28px; border-radius:8px; font-weight:600; text-decoration:none; display:inline-block;">
        Start Learning →
      </a>
    </div>
  </section>

  <footer>
    <div>
      <strong style="color:white">📚 StudyEarn AI</strong><br>
      Learn. Code. Earn.
    </div>
    <div>
      <a href="#">Privacy</a> ·
      <a href="#">Terms</a> ·
      <a href="#">Contact</a>
    </div>
  </footer>
</body>
</html>`,
      task: {
        description: 'Ek complete landing page banao sirf Flexbox use karke. Zaruri sections: (1) Sticky navbar — logo left, links center, CTA button right (justify-content: space-between), (2) Hero — full height (100vh), content vertically + horizontally centered, (3) Features section — 3 cards flex-wrap ke saath, (4) Testimonials section — 2 quotes side by side (align-items: stretch), (5) Pricing — 3 plans (Basic/Pro/Enterprise), middle plan highlighted, (6) Footer — two column (info left, links right). Sab sections mein gap property use karo.',
        description_en: 'Build a complete landing page using only Flexbox. Required sections: (1) Sticky navbar — logo left, links centre, CTA button right (justify-content: space-between), (2) Hero — full height (100vh), content centred vertically + horizontally, (3) Features — 3 cards with flex-wrap, (4) Testimonials — 2 quotes side by side (align-items: stretch), (5) Pricing — 3 plans (Basic/Pro/Enterprise), middle plan highlighted, (6) Footer — two columns (info left, links right). Use the gap property in all sections.',
        hint: 'Sticky navbar: position: sticky; top: 0; z-index: 100;. Hero: min-height: 100vh; display:flex; flex-direction: column; justify-content: center; align-items: center;. Cards: flex: 1 1 250px; max-width: 350px;',
        hint_en: 'Sticky navbar: position: sticky; top: 0; z-index: 100;. Hero: min-height: 100vh; display:flex; flex-direction: column; justify-content: center; align-items: center;. Cards: flex: 1 1 250px; max-width: 350px;',
      },
      quiz: [
        {
          q: 'justify-content: space-between kya karta hai?',
          options: ['Items ko center karta hai', 'Pehla item start pe, aakhri item end pe, baaki equal space mein', 'Sab items barabar space mein', 'Items ke around space deta hai'],
          correct: 1,
          explanation: 'space-between: pehla item left edge pe, aakhri item right edge pe, baaki items ke beech barabar gap. Navbar mein perfect — logo left, links right!',
          q_en: 'What does justify-content: space-between do?',
          options_en: ['Centres items', 'First item at start, last at end, equal space between the rest', 'All items in equal space', 'Adds space around items'],
          explanation_en: 'space-between: first item on the left edge, last on the right edge, remaining items with equal gaps. Perfect for navbars — logo left, links right!',
        },
        {
          q: 'flex: 1 1 250px ka matlab kya hai?',
          options: ['Width fixed 250px', 'Grow kar sakta hai, shrink kar sakta hai, base size 250px', 'Sirf 1 item dikhao', 'Height 250px'],
          correct: 1,
          explanation: 'flex: grow shrink basis. flex: 1 1 250px = 250px se start karo, grow kar sakte ho extra space mein, shrink bhi ho sakte ho. Responsive cards ke liye perfect!',
          q_en: 'What does flex: 1 1 250px mean?',
          options_en: ['Fixed width of 250px', 'Can grow, can shrink, base size is 250px', 'Show only 1 item', 'Height is 250px'],
          explanation_en: 'flex: grow shrink basis. flex: 1 1 250px = start at 250px, can grow into extra space, can also shrink. Perfect for responsive cards!',
        },
        {
          q: 'Flexbox mein item ko vertically center karne ke liye kya use karte hain?',
          options: ['justify-content: center', 'align-items: center', 'vertical-align: center', 'top: 50%'],
          correct: 1,
          explanation: 'align-items: center cross-axis (vertical, by default) mein items center karta hai. justify-content: center main-axis (horizontal, by default) mein center karta hai.',
          q_en: 'What is used to vertically centre items in Flexbox?',
          options_en: ['justify-content: center', 'align-items: center', 'vertical-align: center', 'top: 50%'],
          explanation_en: 'align-items: center centres items on the cross-axis (vertical by default). justify-content: center centres on the main-axis (horizontal by default).',
        },
      ],
    },

    {
      id: 'html-w6-s2',
      title: 'CSS Grid — 2D Layout Master',
      title_en: 'CSS Grid — 2D Layout Master',
      emoji: '🔲',
      content: `## CSS Grid — Rows aur Columns dono control karo!

Flexbox 1D (row ya column) ke liye hai. Grid 2D (rows AND columns) ke liye.

### Grid Container

\`\`\`css
.container {
  display: grid;

  /* Columns define karo */
  grid-template-columns: 200px 200px 200px;
  grid-template-columns: 1fr 1fr 1fr;          /* Equal thirds */
  grid-template-columns: repeat(3, 1fr);        /* Same as above */
  grid-template-columns: repeat(3, minmax(200px, 1fr)); /* Responsive! */
  grid-template-columns: 250px 1fr;            /* Sidebar + main */
  grid-template-columns: 1fr 2fr 1fr;          /* 25% 50% 25% */

  /* Rows define karo */
  grid-template-rows: auto;                     /* Content height */
  grid-template-rows: 80px 1fr 60px;           /* Header Main Footer */
  grid-template-rows: repeat(3, 200px);

  /* Gap */
  gap: 20px;
  row-gap: 20px;
  column-gap: 30px;

  /* Alignment */
  justify-items: center;   /* Items horizontally center */
  align-items: center;     /* Items vertically center */
  place-items: center;     /* Both at once */
}
\`\`\`

### Grid Items — Placement

\`\`\`css
.item {
  /* Column spanning */
  grid-column: 1;              /* Column 1 */
  grid-column: 1 / 3;          /* Column 1 to 3 (spans 2) */
  grid-column: 1 / -1;         /* Full width (first to last) */
  grid-column: span 2;         /* Span 2 columns */

  /* Row spanning */
  grid-row: 1;
  grid-row: 1 / 3;             /* Row 1 to 3 */
  grid-row: span 2;

  /* Shorthand */
  grid-area: 1 / 1 / 3 / 4;   /* row-start / col-start / row-end / col-end */
}
\`\`\`

### Grid Template Areas — Readable Layout!

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
  gap: 0;
}

header  { grid-area: header; }
.sidebar{ grid-area: sidebar; }
main    { grid-area: main; }
footer  { grid-area: footer; }
\`\`\`

### Auto-fit — Responsive Grid Without Media Queries!

\`\`\`css
/* Magic formula — responsive grid! */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}
/* Large screen: 4 columns
   Medium: 3 columns
   Small: 2 columns
   Mobile: 1 column — automatically! */
\`\`\``,
      content_en: `## CSS Grid — Control Both Rows and Columns!

Flexbox is for 1D (row or column). Grid is for 2D (rows AND columns).

### Grid Container

\`\`\`css
.container {
  display: grid;

  /* Define columns */
  grid-template-columns: 200px 200px 200px;
  grid-template-columns: 1fr 1fr 1fr;          /* Equal thirds */
  grid-template-columns: repeat(3, 1fr);        /* Same as above */
  grid-template-columns: repeat(3, minmax(200px, 1fr)); /* Responsive! */
  grid-template-columns: 250px 1fr;            /* Sidebar + main */

  /* Define rows */
  grid-template-rows: 80px 1fr 60px;          /* Header Main Footer */

  gap: 20px;
  place-items: center;     /* Centre all items */
}
\`\`\`

### Grid Items — Placement

\`\`\`css
.item {
  grid-column: 1 / 3;          /* Span from column 1 to 3 */
  grid-column: 1 / -1;         /* Full width */
  grid-column: span 2;         /* Span 2 columns */
  grid-row: span 2;            /* Span 2 rows */
}
\`\`\`

### Grid Template Areas — Readable Layouts!

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
}

header  { grid-area: header; }
.sidebar{ grid-area: sidebar; }
main    { grid-area: main; }
footer  { grid-area: footer; }
\`\`\`

### Auto-fit — Responsive Grid Without Media Queries!

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}
/* Large screen: 4 columns → Medium: 3 → Small: 2 → Mobile: 1 */
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Grid Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; }

    /* ── Page Layout using Grid Areas ── */
    .page-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      grid-template-rows: 64px 1fr 56px;
      grid-template-areas:
        "header  header"
        "sidebar content"
        "footer  footer";
      min-height: 100vh;
    }

    /* Grid areas */
    .site-header {
      grid-area: header;
      background: linear-gradient(135deg, #1e1b4b, #6366f1);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }
    .site-header .logo { font-size: 20px; font-weight: 700; }
    .site-header nav a { color: rgba(255,255,255,0.8); text-decoration: none; margin-left: 20px; }

    .sidebar {
      grid-area: sidebar;
      background: #1e293b;
      padding: 24px;
      color: white;
    }
    .sidebar h3 { color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; margin-top: 24px; }
    .sidebar h3:first-child { margin-top: 0; }
    .sidebar ul { list-style: none; }
    .sidebar li a {
      display: block; padding: 8px 12px; color: rgba(255,255,255,0.6);
      text-decoration: none; border-radius: 6px; font-size: 14px; margin-bottom: 2px;
    }
    .sidebar li a:hover { background: rgba(99,102,241,0.2); color: white; }
    .sidebar li a.active { background: #6366f1; color: white; }

    .main-content {
      grid-area: content;
      background: #f8fafc;
      padding: 32px;
      overflow-y: auto;
    }
    .main-content h1 { font-size: 28px; color: #1e293b; margin-bottom: 8px; }
    .main-content > p { color: #64748b; margin-bottom: 32px; }

    /* Auto-fit grid inside content */
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .course-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      text-align: center;
      transition: all 0.3s;
    }
    .course-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(99,102,241,0.1); }
    .course-card .emoji { font-size: 40px; margin-bottom: 12px; }
    .course-card h3 { font-size: 16px; color: #1e293b; margin-bottom: 8px; }
    .course-card p { font-size: 13px; color: #64748b; }

    /* Featured: spans 2 columns */
    .featured {
      grid-column: span 2;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      color: white;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .featured h3, .featured p { color: white; }

    .site-footer {
      grid-area: footer;
      background: #1e1b4b;
      color: rgba(255,255,255,0.6);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      font-size: 13px;
    }
    .site-footer a { color: #a78bfa; text-decoration: none; }
  </style>
</head>
<body>

  <div class="page-layout">

    <header class="site-header">
      <div class="logo">📚 StudyEarn AI</div>
      <nav>
        <a href="#">Dashboard</a>
        <a href="#">Profile</a>
        <a href="#">Settings</a>
      </nav>
    </header>

    <aside class="sidebar">
      <h3>Main Menu</h3>
      <ul>
        <li><a href="#" class="active">🏠 Dashboard</a></li>
        <li><a href="#">📚 My Courses</a></li>
        <li><a href="#">🏆 Certificates</a></li>
        <li><a href="#">📊 Progress</a></li>
      </ul>
      <h3>Courses</h3>
      <ul>
        <li><a href="#">🐍 Python</a></li>
        <li><a href="#">🌐 HTML/CSS</a></li>
        <li><a href="#">⚡ JavaScript</a></li>
      </ul>
    </aside>

    <main class="main-content">
      <h1>Apne Courses 🚀</h1>
      <p>Ab tak ki progress aur available courses</p>

      <div class="courses-grid">
        <div class="course-card featured">
          <div class="emoji">🐍</div>
          <div>
            <h3>Python — Week 7 of 12</h3>
            <p>APIs aur Web Scraping — 58% complete</p>
          </div>
        </div>
        <div class="course-card">
          <div class="emoji">🌐</div>
          <h3>HTML</h3>
          <p>Week 6 mein ho</p>
        </div>
        <div class="course-card">
          <div class="emoji">🎨</div>
          <h3>CSS</h3>
          <p>Coming Soon</p>
        </div>
        <div class="course-card">
          <div class="emoji">⚡</div>
          <h3>JavaScript</h3>
          <p>Coming Soon</p>
        </div>
      </div>
    </main>

    <footer class="site-footer">
      <span>&copy; 2024 StudyEarn AI</span>
      <span><a href="#">Help</a> · <a href="#">Terms</a></span>
    </footer>

  </div>

</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Grid Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; }

    .page-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      grid-template-rows: 64px 1fr 56px;
      grid-template-areas:
        "header  header"
        "sidebar content"
        "footer  footer";
      min-height: 100vh;
    }

    .site-header {
      grid-area: header;
      background: linear-gradient(135deg, #1e1b4b, #6366f1);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }
    .site-header .logo { font-size: 20px; font-weight: 700; }
    .site-header nav a { color: rgba(255,255,255,0.8); text-decoration: none; margin-left: 20px; }

    .sidebar {
      grid-area: sidebar;
      background: #1e293b;
      padding: 24px;
      color: white;
    }
    .sidebar h3 { color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; margin-top: 24px; }
    .sidebar ul { list-style: none; }
    .sidebar li a { display: block; padding: 8px 12px; color: rgba(255,255,255,0.6); text-decoration: none; border-radius: 6px; font-size: 14px; margin-bottom: 2px; }
    .sidebar li a:hover { background: rgba(99,102,241,0.2); color: white; }
    .sidebar li a.active { background: #6366f1; color: white; }

    .main-content { grid-area: content; background: #f8fafc; padding: 32px; overflow-y: auto; }
    .main-content h1 { font-size: 28px; color: #1e293b; margin-bottom: 8px; }
    .main-content > p { color: #64748b; margin-bottom: 32px; }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    .course-card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; text-align: center; transition: all 0.3s; }
    .course-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(99,102,241,0.1); }
    .course-card .emoji { font-size: 40px; margin-bottom: 12px; }
    .course-card h3 { font-size: 16px; color: #1e293b; margin-bottom: 8px; }
    .course-card p  { font-size: 13px; color: #64748b; }

    .featured {
      grid-column: span 2;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      color: white; text-align: left;
      display: flex; align-items: center; gap: 20px;
    }
    .featured h3, .featured p { color: white; }

    .site-footer {
      grid-area: footer;
      background: #1e1b4b; color: rgba(255,255,255,0.6);
      display: flex; justify-content: space-between;
      align-items: center; padding: 0 24px; font-size: 13px;
    }
    .site-footer a { color: #a78bfa; text-decoration: none; }
  </style>
</head>
<body>
  <div class="page-layout">
    <header class="site-header">
      <div class="logo">📚 StudyEarn AI</div>
      <nav>
        <a href="#">Dashboard</a>
        <a href="#">Profile</a>
        <a href="#">Settings</a>
      </nav>
    </header>
    <aside class="sidebar">
      <h3>Main Menu</h3>
      <ul>
        <li><a href="#" class="active">🏠 Dashboard</a></li>
        <li><a href="#">📚 My Courses</a></li>
        <li><a href="#">🏆 Certificates</a></li>
      </ul>
      <h3>Courses</h3>
      <ul>
        <li><a href="#">🐍 Python</a></li>
        <li><a href="#">🌐 HTML/CSS</a></li>
        <li><a href="#">⚡ JavaScript</a></li>
      </ul>
    </aside>
    <main class="main-content">
      <h1>My Courses 🚀</h1>
      <p>Your progress and available courses</p>
      <div class="courses-grid">
        <div class="course-card featured">
          <div class="emoji">🐍</div>
          <div>
            <h3>Python — Week 7 of 12</h3>
            <p>APIs and Web Scraping — 58% complete</p>
          </div>
        </div>
        <div class="course-card"><div class="emoji">🌐</div><h3>HTML</h3><p>On Week 6</p></div>
        <div class="course-card"><div class="emoji">🎨</div><h3>CSS</h3><p>Coming Soon</p></div>
        <div class="course-card"><div class="emoji">⚡</div><h3>JavaScript</h3><p>Coming Soon</p></div>
      </div>
    </main>
    <footer class="site-footer">
      <span>&copy; 2024 StudyEarn AI</span>
      <span><a href="#">Help</a> · <a href="#">Terms</a></span>
    </footer>
  </div>
</body>
</html>`,
      task: {
        description: 'Grid Template Areas use karke ek complete dashboard banao. Layout: header (full width), sidebar (left 240px), main content (right flex), footer (full width). Main content mein: stats cards grid (4 cards, auto-fit), recent activity table, quick actions. Sidebar mein: navigation links, user profile. Featured card ko grid-column: span 2 se wider banao. min-height: 100vh se full page coverage.',
        description_en: 'Build a complete dashboard using Grid Template Areas. Layout: header (full width), sidebar (left 240px), main content (right flex), footer (full width). Main content: stats cards grid (4 cards, auto-fit), recent activity table, quick actions. Sidebar: navigation links, user profile. Make a featured card wider with grid-column: span 2. Use min-height: 100vh for full page coverage.',
        hint: 'grid-template-areas se named layout banao. sidebar li a.active ek highlight karo. Stats cards: display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;',
        hint_en: 'Use grid-template-areas for a named layout. Highlight one sidebar link with .active. Stats cards: display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;',
      },
      quiz: [
        {
          q: 'Flexbox aur CSS Grid mein kab konsa use karna chahiye?',
          options: ['Hamesha Grid', 'Flexbox 1D layouts ke liye (navbar, row of cards), Grid 2D ke liye (page layout, dashboard)', 'Hamesha Flexbox', 'Dono same hain'],
          correct: 1,
          explanation: 'Flexbox = ek direction — row ya column. Grid = do direction — rows aur columns. Practical rule: navbar = flexbox, page layout = grid, cards = dono kaam karte hain!',
          q_en: 'When should you use Flexbox vs CSS Grid?',
          options_en: ['Always Grid', 'Flexbox for 1D layouts (navbars, rows of cards), Grid for 2D (page layout, dashboard)', 'Always Flexbox', 'Both are the same'],
          explanation_en: 'Flexbox = one direction — row or column. Grid = two directions — rows and columns. Practical rule: navbar = flexbox, page layout = grid, cards = either works!',
        },
        {
          q: 'grid-column: 1 / -1 kya karta hai?',
          options: ['Item ko column 1 pe rakhta hai', 'Item pehle se aakhri column tak full width le leta hai', 'Item column se bahar jaata hai', 'Grid delete karta hai'],
          correct: 1,
          explanation: '-1 ka matlab hai "last column line". 1 / -1 = pehle column line se aakhri tak = full width! Responsive grid mein featured items ke liye perfect.',
          q_en: 'What does grid-column: 1 / -1 do?',
          options_en: ['Places item in column 1', 'Item spans from the first to the last column — full width', 'Item goes outside the grid', 'Deletes the grid'],
          explanation_en: '-1 means "the last column line". 1 / -1 = from the first column line to the last = full width! Perfect for featured items in a responsive grid.',
        },
        {
          q: 'repeat(auto-fit, minmax(250px, 1fr)) kya karta hai?',
          options: ['Fixed 250px columns banata hai', 'Media queries ke bina responsive grid — screen size ke hisaab se columns adjust hote hain', 'Sirf ek column banata hai', '250 columns banata hai'],
          correct: 1,
          explanation: 'auto-fit: jitne columns fit hon screen mein. minmax(250px, 1fr): minimum 250px, maximum barabar space. Isse grid automatically responsive ho jaata hai bina media queries ke!',
          q_en: 'What does repeat(auto-fit, minmax(250px, 1fr)) do?',
          options_en: ['Creates fixed 250px columns', 'Responsive grid without media queries — columns adjust automatically to screen size', 'Creates only one column', 'Creates 250 columns'],
          explanation_en: 'auto-fit: fit as many columns as the screen allows. minmax(250px, 1fr): minimum 250px, maximum equal space. This makes the grid automatically responsive without any media queries!',
        },
      ],
    },

    {
      id: 'html-w6-s3',
      title: 'Responsive Design — Mobile-First Approach',
      title_en: 'Responsive Design — Mobile-First Approach',
      emoji: '📱',
      content: `## Responsive Design — Har Device pe Perfect!

Internet ka 60%+ traffic mobile se aata hai. Agar website mobile pe kharab dikhe toh visitors chale jaate hain!

### Media Queries — Screen Size ke Hisaab se Style

\`\`\`css
/* Mobile First — default (chhoti screen) */
.container { padding: 16px; }
.cards { display: block; }  /* Stack karo */

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container { padding: 24px; }
  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
  .cards { grid-template-columns: repeat(3, 1fr); }
}

/* Large Desktop (1280px+) */
@media (min-width: 1280px) {
  .cards { grid-template-columns: repeat(4, 1fr); }
}
\`\`\`

### Common Breakpoints

\`\`\`css
/* Mobile: 0 - 767px   (default) */
/* Tablet: 768px+      */
/* Desktop: 1024px+    */
/* Large: 1280px+      */
/* XL: 1536px+         */

/* Max-width queries (desktop first) */
@media (max-width: 768px) {
  .nav-links { display: none; }    /* Mobile pe hide */
  .sidebar { width: 100%; }
}
\`\`\`

### Viewport Units

\`\`\`css
.hero {
  height: 100vh;        /* 100% viewport height */
  width: 100vw;         /* 100% viewport width */
  font-size: 5vw;       /* 5% of viewport width */
}

.card {
  max-width: min(400px, 90vw);  /* 400px ya 90% screen */
}
\`\`\`

### Fluid Typography

\`\`\`css
/* clamp(minimum, preferred, maximum) */
h1 { font-size: clamp(24px, 5vw, 64px); }
p  { font-size: clamp(14px, 2vw, 18px); }

/* calc() */
.container { padding: calc(16px + 2vw); }
\`\`\`

### Responsive Images

\`\`\`css
img { max-width: 100%; height: auto; }

/* Object fit for consistent height */
.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
}
\`\`\`

### Mobile Navigation

\`\`\`css
/* Desktop: horizontal navbar */
nav ul { display: flex; gap: 24px; }

/* Mobile: hide links, show hamburger */
@media (max-width: 768px) {
  nav ul { display: none; }
  nav ul.open { display: flex; flex-direction: column; }
  .hamburger { display: block; }
}
\`\`\``,
      content_en: `## Responsive Design — Perfect on Every Device!

Over 60% of internet traffic comes from mobile. If your website looks bad on mobile, visitors leave!

### Media Queries — Styles That Adapt to Screen Size

\`\`\`css
/* Mobile First — default (small screen) */
.container { padding: 16px; }
.cards { display: block; }   /* Stack vertically */

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container { padding: 24px; }
  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
  .cards { grid-template-columns: repeat(3, 1fr); }
}

/* Large Desktop (1280px+) */
@media (min-width: 1280px) {
  .cards { grid-template-columns: repeat(4, 1fr); }
}
\`\`\`

### Common Breakpoints

\`\`\`css
/* Mobile:  0 – 767px   (default)  */
/* Tablet:  768px+                  */
/* Desktop: 1024px+                 */
/* Large:   1280px+                 */
\`\`\`

### Viewport Units

\`\`\`css
.hero { height: 100vh; width: 100vw; }
.card { max-width: min(400px, 90vw); }
\`\`\`

### Fluid Typography

\`\`\`css
/* clamp(minimum, preferred, maximum) */
h1 { font-size: clamp(24px, 5vw, 64px); }
p  { font-size: clamp(14px, 2vw, 18px); }
\`\`\`

### Responsive Images

\`\`\`css
img { max-width: 100%; height: auto; }

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #f8fafc; color: #334155; }

    /* ── Navigation ─────────────────────────────── */
    nav {
      background: linear-gradient(135deg, #1e1b4b, #6366f1);
      color: white;
      padding: 0 20px;
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
    }
    .logo { font-size: 18px; font-weight: 700; }
    .nav-links { display: flex; list-style: none; gap: 20px; }
    .nav-links a { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 14px; }
    .hamburger {
      display: none;
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
    }

    /* ── Hero ─────────────────────────────────── */
    .hero {
      background: linear-gradient(135deg, #1e1b4b, #6366f1);
      color: white;
      text-align: center;
      padding: 80px 20px;
    }
    .hero h1 { font-size: clamp(28px, 6vw, 56px); margin-bottom: 16px; }
    .hero p  { font-size: clamp(14px, 2.5vw, 20px); opacity: 0.85; margin-bottom: 32px; }

    /* ── Container ────────────────────────────── */
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }

    /* ── Cards Grid — Responsive ──────────────── */
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr;   /* Mobile: 1 column */
      gap: 20px;
    }
    .card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      transition: all 0.3s;
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(99,102,241,0.1); }
    .card img { width: 100%; height: 180px; object-fit: cover; }
    .card-body { padding: 20px; }
    .card h3 { font-size: 18px; color: #1e293b; margin-bottom: 8px; }
    .card p  { color: #64748b; font-size: 14px; line-height: 1.6; }

    /* ── Tablet: 2 columns ────────────────────── */
    @media (min-width: 640px) {
      .cards-grid { grid-template-columns: repeat(2, 1fr); }
    }

    /* ── Desktop: 3 columns ───────────────────── */
    @media (min-width: 1024px) {
      .cards-grid { grid-template-columns: repeat(3, 1fr); }
    }

    /* ── Mobile nav ───────────────────────────── */
    @media (max-width: 640px) {
      .nav-links { display: none; }
      .nav-links.open {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 60px; left: 0; right: 0;
        background: #1e1b4b;
        padding: 16px 20px;
        gap: 12px;
        z-index: 99;
      }
      .hamburger { display: block; }
    }

    /* ── Footer ───────────────────────────────── */
    footer {
      background: #1e1b4b;
      color: rgba(255,255,255,0.7);
      padding: 32px 20px;
      text-align: center;
    }
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    .footer-links a { color: #a78bfa; text-decoration: none; font-size: 14px; }
  </style>
</head>
<body>

  <nav>
    <div class="logo">📚 StudyEarn</div>
    <ul class="nav-links" id="navLinks">
      <li><a href="#">Home</a></li>
      <li><a href="#">Courses</a></li>
      <li><a href="#">Blog</a></li>
      <li><a href="#">About</a></li>
    </ul>
    <button class="hamburger" onclick="toggleNav()">☰</button>
  </nav>

  <section class="hero">
    <h1>Responsive Design Seekho! 📱</h1>
    <p>Screen resize karo — layout automatically adjust hoga!</p>
  </section>

  <div class="container">
    <h2 style="font-size: 28px; color: #1e293b; margin-bottom: 8px;">
      Latest Courses
    </h2>
    <p style="color: #64748b; margin-bottom: 32px;">
      Mobile pe 1 column, Tablet pe 2, Desktop pe 3!
    </p>

    <div class="cards-grid">
      <article class="card">
        <img src="https://picsum.photos/400/180?random=1" alt="Python">
        <div class="card-body">
          <h3>🐍 Python Programming</h3>
          <p>AI, Web Development, Data Science ke liye Python seekho.</p>
        </div>
      </article>
      <article class="card">
        <img src="https://picsum.photos/400/180?random=2" alt="HTML">
        <div class="card-body">
          <h3>🌐 HTML Fundamentals</h3>
          <p>Web development ki shuruwat — HTML se karo.</p>
        </div>
      </article>
      <article class="card">
        <img src="https://picsum.photos/400/180?random=3" alt="CSS">
        <div class="card-body">
          <h3>🎨 CSS Styling</h3>
          <p>Beautiful, responsive websites banao CSS se.</p>
        </div>
      </article>
    </div>
  </div>

  <footer>
    <p>&copy; 2024 StudyEarn AI</p>
    <div class="footer-links">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Contact</a>
    </div>
  </footer>

  <script>
    function toggleNav() {
      document.getElementById('navLinks').classList.toggle('open');
    }
  </script>

</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #f8fafc; color: #334155; }

    nav {
      background: linear-gradient(135deg, #1e1b4b, #6366f1);
      color: white; padding: 0 20px; position: sticky;
      top: 0; z-index: 100; display: flex;
      justify-content: space-between; align-items: center; height: 60px;
    }
    .logo { font-size: 18px; font-weight: 700; }
    .nav-links { display: flex; list-style: none; gap: 20px; }
    .nav-links a { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 14px; }
    .hamburger { display: none; background: none; border: none; color: white; font-size: 24px; cursor: pointer; }

    .hero { background: linear-gradient(135deg, #1e1b4b, #6366f1); color: white; text-align: center; padding: 80px 20px; }
    .hero h1 { font-size: clamp(28px, 6vw, 56px); margin-bottom: 16px; }
    .hero p  { font-size: clamp(14px, 2.5vw, 20px); opacity: 0.85; margin-bottom: 32px; }

    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }

    /* Mobile: 1 column */
    .cards-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
    .card { background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; transition: all 0.3s; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(99,102,241,0.1); }
    .card img  { width: 100%; height: 180px; object-fit: cover; }
    .card-body { padding: 20px; }
    .card h3   { font-size: 18px; color: #1e293b; margin-bottom: 8px; }
    .card p    { color: #64748b; font-size: 14px; line-height: 1.6; }

    /* Tablet: 2 columns */
    @media (min-width: 640px) {
      .cards-grid { grid-template-columns: repeat(2, 1fr); }
    }

    /* Desktop: 3 columns */
    @media (min-width: 1024px) {
      .cards-grid { grid-template-columns: repeat(3, 1fr); }
    }

    /* Mobile nav */
    @media (max-width: 640px) {
      .nav-links { display: none; }
      .nav-links.open {
        display: flex; flex-direction: column;
        position: absolute; top: 60px; left: 0; right: 0;
        background: #1e1b4b; padding: 16px 20px; gap: 12px; z-index: 99;
      }
      .hamburger { display: block; }
    }

    footer { background: #1e1b4b; color: rgba(255,255,255,0.7); padding: 32px 20px; text-align: center; }
    .footer-links { display: flex; justify-content: center; gap: 24px; margin-top: 12px; flex-wrap: wrap; }
    .footer-links a { color: #a78bfa; text-decoration: none; font-size: 14px; }
  </style>
</head>
<body>

  <nav>
    <div class="logo">📚 StudyEarn</div>
    <ul class="nav-links" id="navLinks">
      <li><a href="#">Home</a></li>
      <li><a href="#">Courses</a></li>
      <li><a href="#">Blog</a></li>
      <li><a href="#">About</a></li>
    </ul>
    <button class="hamburger" onclick="toggleNav()">☰</button>
  </nav>

  <section class="hero">
    <h1>Learn Responsive Design! 📱</h1>
    <p>Resize the screen — the layout adjusts automatically!</p>
  </section>

  <div class="container">
    <h2 style="font-size:28px; color:#1e293b; margin-bottom:8px;">Latest Courses</h2>
    <p style="color:#64748b; margin-bottom:32px;">1 column on mobile, 2 on tablet, 3 on desktop!</p>

    <div class="cards-grid">
      <article class="card">
        <img src="https://picsum.photos/400/180?random=1" alt="Python">
        <div class="card-body"><h3>🐍 Python Programming</h3><p>Learn Python for AI, web development, and data science.</p></div>
      </article>
      <article class="card">
        <img src="https://picsum.photos/400/180?random=2" alt="HTML">
        <div class="card-body"><h3>🌐 HTML Fundamentals</h3><p>Start your web development journey with HTML.</p></div>
      </article>
      <article class="card">
        <img src="https://picsum.photos/400/180?random=3" alt="CSS">
        <div class="card-body"><h3>🎨 CSS Styling</h3><p>Build beautiful, responsive websites with CSS.</p></div>
      </article>
    </div>
  </div>

  <footer>
    <p>&copy; 2024 StudyEarn AI</p>
    <div class="footer-links">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Contact</a>
    </div>
  </footer>

  <script>
    function toggleNav() {
      document.getElementById('navLinks').classList.toggle('open');
    }
  </script>
</body>
</html>`,
      task: {
        description: 'Apni pichli blog page ko fully responsive banao. Requirements: (1) Mobile (< 640px): single column, hamburger menu, font size chhota, (2) Tablet (640-1023px): 2 column cards, horizontal nav, (3) Desktop (1024px+): 3 columns, full nav, max-width container, (4) clamp() use karo headings ke liye fluid typography, (5) Images: max-width: 100%; object-fit: cover; (6) Hamburger button — JS se toggle karo nav, (7) Print media query: @media print { nav, footer { display: none; } }',
        description_en: 'Make your previous blog page fully responsive. Requirements: (1) Mobile (< 640px): single column, hamburger menu, smaller fonts, (2) Tablet (640–1023px): 2-column cards, horizontal nav, (3) Desktop (1024px+): 3 columns, full nav, max-width container, (4) Use clamp() for fluid typography on headings, (5) Images: max-width: 100%; object-fit: cover; (6) Hamburger button — toggle nav with JS, (7) Print media query: @media print { nav, footer { display: none; } }',
        hint: 'Mobile-first approach: pehle mobile styles likho, phir @media (min-width: 640px) mein tablet overrides, phir @media (min-width: 1024px) mein desktop. clamp(24px, 5vw, 48px) fluid font size deta hai.',
        hint_en: 'Mobile-first approach: write mobile styles first, then override in @media (min-width: 640px) for tablet, then @media (min-width: 1024px) for desktop. clamp(24px, 5vw, 48px) gives a fluid font size.',
      },
      quiz: [
        {
          q: 'Mobile-first design kya hai?',
          options: ['Sirf mobile ke liye design karo', 'Pehle mobile ke liye CSS likho, phir media queries se desktop ke liye expand karo', 'Mobile app banao', 'Responsive ignore karo'],
          correct: 1,
          explanation: 'Mobile-first: default CSS mobile ke liye hota hai (min-width queries use karo). Desktop-first: default CSS desktop ke liye hota hai (max-width queries use karo). Mobile-first better performance deta hai mobile pe.',
          q_en: 'What is mobile-first design?',
          options_en: ['Design only for mobile', 'Write CSS for mobile first, then expand for desktop with media queries', 'Build a mobile app', 'Ignore responsiveness'],
          explanation_en: 'Mobile-first: default CSS is for mobile (use min-width queries). Desktop-first: default CSS is for desktop (use max-width queries). Mobile-first gives better performance on mobile.',
        },
        {
          q: 'clamp(24px, 5vw, 64px) kya karta hai?',
          options: ['Font size 24px fix karta hai', 'Font size 5vw hoti hai, minimum 24px, maximum 64px', 'Text clamp karta hai', 'Font size 64px fix karta hai'],
          correct: 1,
          explanation: 'clamp(min, value, max): value 5vw use karo, but never 24px se chhota aur never 64px se bada. Small screen pe 24px, large pe 64px, medium pe kuch beech mein — responsive typography!',
          q_en: 'What does clamp(24px, 5vw, 64px) do?',
          options_en: ['Fixes font size at 24px', 'Font size is 5vw, with a minimum of 24px and maximum of 64px', 'Clamps the text', 'Fixes font size at 64px'],
          explanation_en: 'clamp(min, value, max): use the value 5vw, but never smaller than 24px and never larger than 64px. Small screens get 24px, large screens 64px, medium screens something in between — responsive typography!',
        },
        {
          q: 'viewport meta tag responsive design mein kyun zaruri hai?',
          options: ['Speed ke liye', 'Mobile browsers ko bata ta hai page mobile screen width pe render karo, desktop width pe nahi', 'SEO ke liye', 'Fonts ke liye'],
          correct: 1,
          explanation: 'Bina viewport meta tag ke, mobile browser page ko desktop screen (980px) pe render karta hai aur zoom out karta hai — bahut chhota dikhta hai. width=device-width se actual device width pe render hota hai.',
          q_en: 'Why is the viewport meta tag essential for responsive design?',
          options_en: ['For speed', 'Tells mobile browsers to render the page at mobile screen width, not desktop width', 'For SEO', 'For fonts'],
          explanation_en: 'Without the viewport meta tag, mobile browsers render the page at desktop width (980px) and zoom out — it looks tiny. width=device-width renders it at the actual device width.',
        },
      ],
    },

    {
      id: 'html-w6-s4',
      title: 'Week 6 Project — Complete Responsive Portfolio',
      title_en: 'Week 6 Project — Complete Responsive Portfolio',
      emoji: '🏆',
      content: `## Week 6 Project — Professional Responsive Portfolio!

Ab tak seekha:
- CSS Flexbox (1D layouts)
- CSS Grid (2D layouts, template areas)
- Responsive Design (media queries, mobile-first)

In sab ko use karke ek **complete responsive portfolio website** banao!

### Portfolio Requirements:

\`\`\`
1. Sticky Navbar (Flexbox)
   - Logo left, links right
   - Mobile: hamburger menu
   - Active link highlight

2. Hero Section (Flexbox — centered)
   - Full viewport height (100vh)
   - Animated text (CSS animations)
   - CTA buttons

3. About Section (Grid — 2 columns)
   - Photo left, text right
   - Mobile: stacked

4. Skills Section (Grid — auto-fit cards)
   - Progress bars per skill
   - Categories

5. Projects Section (Grid — 3 columns)
   - Image, title, tech tags, links
   - Hover overlay effect
   - Mobile: 1 column

6. Contact Section (Flexbox)
   - Form + contact info side by side
   - Full width on mobile

7. Footer (Flexbox — space-between)
   - Copyright left
   - Social links right

Breakpoints:
   Mobile: < 640px
   Tablet: 640px - 1023px
   Desktop: 1024px+
\`\`\``,
      content_en: `## Week 6 Project — Professional Responsive Portfolio!

CSS learned so far:
- CSS Flexbox (1D layouts)
- CSS Grid (2D layouts, template areas)
- Responsive Design (media queries, mobile-first)

Use all of these to build a **complete responsive portfolio website**!

### Portfolio Requirements:

\`\`\`
1. Sticky Navbar (Flexbox)
   - Logo left, links right
   - Mobile: hamburger menu
   - Active link highlight

2. Hero Section (Flexbox — centred)
   - Full viewport height (100vh)
   - Animated text (CSS animations)
   - CTA buttons

3. About Section (Grid — 2 columns)
   - Photo left, text right
   - Mobile: stacked

4. Skills Section (Grid — auto-fit cards)
   - Progress bars per skill
   - Categories

5. Projects Section (Grid — 3 columns)
   - Image, title, tech tags, links
   - Hover overlay effect
   - Mobile: 1 column

6. Contact Section (Flexbox)
   - Form + contact info side by side
   - Full width on mobile

7. Footer (Flexbox — space-between)
   - Copyright left
   - Social links right

Breakpoints:
   Mobile: < 640px
   Tablet: 640px – 1023px
   Desktop: 1024px+
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rahul Kumar — Portfolio</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; }

    /* ── Variables ── */
    :root {
      --primary: #6366f1;
      --primary-dark: #4f46e5;
      --accent: #a78bfa;
      --bg: #0f172a;
      --bg2: #1e293b;
      --text: #e2e8f0;
      --text-muted: #94a3b8;
    }

    /* ── Navbar ── */
    nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(15,23,42,0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(99,102,241,0.2);
      padding: 0 24px; height: 64px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .logo { color: var(--accent); font-size: 20px; font-weight: 800; }
    .nav-links { display: flex; gap: 32px; list-style: none; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: var(--accent); }
    .hamburger { display: none; background: none; border: none; color: white; font-size: 24px; cursor: pointer; }

    /* ── Hero ── */
    #hero {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
      display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      text-align: center; padding: 40px 24px;
      position: relative; overflow: hidden;
    }
    #hero::before {
      content: "";
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.3), transparent);
    }
    .hero-content { position: relative; z-index: 1; }
    .hero-tag {
      display: inline-block;
      background: rgba(99,102,241,0.15);
      border: 1px solid rgba(99,102,241,0.3);
      color: var(--accent);
      padding: 6px 16px; border-radius: 20px;
      font-size: 13px; font-weight: 500; margin-bottom: 24px;
    }
    #hero h1 { font-size: clamp(36px, 7vw, 72px); font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
    .gradient-text {
      background: linear-gradient(135deg, var(--accent), #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    #hero p { font-size: clamp(16px, 2.5vw, 20px); color: var(--text-muted); max-width: 560px; margin-bottom: 40px; line-height: 1.7; }
    .hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .btn {
      padding: 14px 32px; border-radius: 10px;
      font-weight: 600; font-size: 15px;
      text-decoration: none; cursor: pointer;
      border: none; transition: all 0.2s; display: inline-block;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
    .btn-outline { background: transparent; color: var(--accent); border: 2px solid var(--accent); }
    .btn-outline:hover { background: var(--accent); color: white; transform: translateY(-2px); }

    /* ── Section Base ── */
    .section { padding: 80px 24px; max-width: 1100px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 56px; }
    .section-header h2 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; color: white; margin-bottom: 12px; }
    .section-header p { color: var(--text-muted); font-size: 17px; }

    /* ── Skills ── */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }
    .skill-card {
      background: var(--bg2);
      border-radius: 14px; padding: 24px;
      border: 1px solid rgba(99,102,241,0.1);
      transition: all 0.3s;
    }
    .skill-card:hover { border-color: rgba(99,102,241,0.4); transform: translateY(-4px); }
    .skill-card .icon { font-size: 32px; margin-bottom: 12px; }
    .skill-card h3 { font-size: 16px; color: white; margin-bottom: 16px; }
    .skill-bar { background: rgba(99,102,241,0.15); border-radius: 4px; height: 6px; overflow: hidden; }
    .skill-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 4px; }

    /* ── Projects ── */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    .project-card {
      background: var(--bg2);
      border-radius: 16px; overflow: hidden;
      border: 1px solid rgba(99,102,241,0.1);
      transition: all 0.3s; position: relative;
    }
    .project-card:hover { border-color: rgba(99,102,241,0.4); transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .project-card img { width: 100%; height: 200px; object-fit: cover; }
    .project-body { padding: 24px; }
    .tech-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
    .tech-tag { background: rgba(99,102,241,0.15); color: var(--accent); padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .project-body h3 { font-size: 18px; color: white; margin-bottom: 8px; }
    .project-body p  { color: var(--text-muted); font-size: 14px; line-height: 1.6; margin-bottom: 16px; }
    .project-links { display: flex; gap: 12px; }
    .project-links a { font-size: 13px; color: var(--accent); text-decoration: none; font-weight: 500; }

    /* ── Footer ── */
    footer {
      background: #020617;
      padding: 32px 24px;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 16px;
      border-top: 1px solid rgba(99,102,241,0.1);
    }
    footer p { color: var(--text-muted); font-size: 14px; }
    .social-links { display: flex; gap: 16px; }
    .social-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; transition: color 0.2s; }
    .social-links a:hover { color: var(--accent); }

    /* ── Mobile ── */
    @media (max-width: 640px) {
      .nav-links { display: none; }
      .nav-links.open { display: flex; flex-direction: column; position: absolute; top: 64px; left: 0; right: 0; background: var(--bg); padding: 20px 24px; gap: 16px; border-bottom: 1px solid rgba(99,102,241,0.2); z-index: 99; }
      .hamburger { display: block; }
      .hero-btns { flex-direction: column; align-items: center; }
    }
  </style>
</head>
<body>

  <nav>
    <div class="logo">✨ Rahul.dev</div>
    <ul class="nav-links" id="navLinks">
      <li><a href="#skills">Skills</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <button class="hamburger" onclick="document.getElementById('navLinks').classList.toggle('open')">☰</button>
  </nav>

  <!-- Hero -->
  <section id="hero">
    <div class="hero-content">
      <div class="hero-tag">👋 Available for hire</div>
      <h1>Hi, I'm <span class="gradient-text">Rahul Kumar</span></h1>
      <p>Full Stack Developer building beautiful, fast, accessible web experiences with modern technologies.</p>
      <div class="hero-btns">
        <a href="#projects" class="btn btn-primary">View My Work →</a>
        <a href="#contact" class="btn btn-outline">Contact Me</a>
      </div>
    </div>
  </section>

  <!-- Skills -->
  <div class="section">
    <div class="section-header">
      <h2>What I Know</h2>
      <p>Technologies I work with</p>
    </div>
    <div class="skills-grid">
      <div class="skill-card">
        <div class="icon">🌐</div>
        <h3>HTML / CSS</h3>
        <div class="skill-bar"><div class="skill-fill" style="width:90%"></div></div>
      </div>
      <div class="skill-card">
        <div class="icon">⚡</div>
        <h3>JavaScript</h3>
        <div class="skill-bar"><div class="skill-fill" style="width:75%"></div></div>
      </div>
      <div class="skill-card">
        <div class="icon">⚛️</div>
        <h3>React.js</h3>
        <div class="skill-bar"><div class="skill-fill" style="width:70%"></div></div>
      </div>
      <div class="skill-card">
        <div class="icon">🐍</div>
        <h3>Python</h3>
        <div class="skill-bar"><div class="skill-fill" style="width:65%"></div></div>
      </div>
    </div>
  </div>

  <!-- Projects -->
  <div id="projects" class="section">
    <div class="section-header">
      <h2>My Projects</h2>
      <p>Things I've built</p>
    </div>
    <div class="projects-grid">
      <div class="project-card">
        <img src="https://picsum.photos/600/200?random=10" alt="Project">
        <div class="project-body">
          <div class="tech-tags">
            <span class="tech-tag">React</span>
            <span class="tech-tag">Node.js</span>
            <span class="tech-tag">MongoDB</span>
          </div>
          <h3>StudyEarn AI Platform</h3>
          <p>Ed-tech platform with gamified courses, AI hints, and certificates.</p>
          <div class="project-links">
            <a href="#">Live Demo →</a>
            <a href="#">GitHub →</a>
          </div>
        </div>
      </div>
      <div class="project-card">
        <img src="https://picsum.photos/600/200?random=11" alt="Project">
        <div class="project-body">
          <div class="tech-tags">
            <span class="tech-tag">HTML</span>
            <span class="tech-tag">CSS</span>
          </div>
          <h3>Portfolio Website</h3>
          <p>Responsive portfolio built with pure HTML and CSS.</p>
          <div class="project-links">
            <a href="#">Live Demo →</a>
            <a href="#">GitHub →</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Contact -->
  <div id="contact" class="section">
    <div class="section-header">
      <h2>Get In Touch</h2>
      <p>Let's work together</p>
    </div>
    <div style="text-align:center; color: var(--text-muted);">
      <p>📧 <a href="mailto:rahul@example.com" style="color:var(--accent)">rahul@example.com</a></p>
      <p style="margin-top:8px">💼 Available for freelance projects</p>
    </div>
  </div>

  <footer>
    <p>&copy; 2024 Rahul Kumar. Built with HTML + CSS.</p>
    <div class="social-links">
      <a href="#">GitHub</a>
      <a href="#">LinkedIn</a>
      <a href="#">Twitter</a>
    </div>
  </footer>

</body>
</html>`,
      codeExample_en: `<!-- Same as Hinglish version above — content is already in English -->`,
      task: {
        description: 'Apna complete responsive portfolio banao jo sach mein professional dikhe. Requirements: (1) Dark theme (#0f172a background), (2) CSS variables (:root mein --primary, --accent colors), (3) Sticky blur navbar + hamburger, (4) Hero: gradient text, animated subtitle, 2 CTA buttons, (5) Skills: auto-fit grid, animated skill bars, (6) Projects: 3+ real ya fictional projects, hover effects, tech tags, (7) Footer: flexbox space-between, social links, (8) Fully responsive — mobile se desktop tak, (9) Google Fonts, (10) scroll-behavior: smooth.',
        description_en: 'Build a complete responsive portfolio that genuinely looks professional. Requirements: (1) Dark theme (#0f172a background), (2) CSS variables (:root with --primary, --accent colours), (3) Sticky blur navbar + hamburger, (4) Hero: gradient text, animated subtitle, 2 CTA buttons, (5) Skills: auto-fit grid, animated skill bars, (6) Projects: 3+ real or fictional projects, hover effects, tech tags, (7) Footer: flexbox space-between, social links, (8) Fully responsive — mobile to desktop, (9) Google Fonts, (10) scroll-behavior: smooth.',
        hint: 'CSS variables: :root { --primary: #6366f1; } phir var(--primary) use karo poore CSS mein. Skill bars: <div class="skill-fill" style="width:85%"> se dynamic width set karo. backdrop-filter: blur(12px) glass navbar effect deta hai.',
        hint_en: 'CSS variables: :root { --primary: #6366f1; } then use var(--primary) throughout CSS. Skill bars: <div class="skill-fill" style="width:85%"> to set dynamic width. backdrop-filter: blur(12px) creates a glass navbar effect.',
      },
      quiz: [
        {
          q: 'CSS variables (:root) use karne ka main benefit kya hai?',
          options: ['Faster loading', 'Ek jagah value change karo — poori website update ho jaati hai', 'Better animations', 'More colors available'],
          correct: 1,
          explanation: 'CSS variables define karo :root mein, use karo var(--name) se. Color scheme change karna ho toh sirf :root mein change karo — poore page pe instantly apply ho jaata hai!',
          q_en: 'What is the main benefit of using CSS variables (:root)?',
          options_en: ['Faster loading', 'Change a value in one place — the entire website updates', 'Better animations', 'More colours available'],
          explanation_en: 'Define CSS variables in :root, use them with var(--name). If you want to change the colour scheme, just update :root — it applies instantly across the whole page!',
        },
        {
          q: 'backdrop-filter: blur() kya effect deta hai?',
          options: ['Text blur karta hai', 'Element ke peeche wale content ko blur karta hai — glass morphism effect', 'Image blur karta hai', 'Screen blur karta hai'],
          correct: 1,
          explanation: 'backdrop-filter sirf element ke behind wale content pe apply hota hai. blur() ke saath glass/frosted effect aata hai — premium looking navbars aur cards ke liye perfect!',
          q_en: 'What effect does backdrop-filter: blur() create?',
          options_en: ['Blurs text', 'Blurs the content behind the element — glass morphism effect', 'Blurs the image', 'Blurs the screen'],
          explanation_en: 'backdrop-filter applies only to the content behind the element. Combined with blur(), it creates a glass/frosted effect — perfect for premium-looking navbars and cards!',
        },
        {
          q: 'scroll-behavior: smooth kya karta hai?',
          options: ['Page scroll stop karta hai', 'Anchor links (#section) pe click karne pe smooth animated scroll hota hai', 'Page auto scroll karta hai', 'Scroll speed badhata hai'],
          correct: 1,
          explanation: 'html { scroll-behavior: smooth; } se jab bhi koi #section link click karo, page smoothly animate karke wahan jaata hai — abrupt jump nahi karta.',
          q_en: 'What does scroll-behavior: smooth do?',
          options_en: ['Stops page scrolling', 'Anchor links (#section) scroll smoothly with animation when clicked', 'Auto-scrolls the page', 'Increases scroll speed'],
          explanation_en: 'html { scroll-behavior: smooth; } makes the page smoothly animate to the target when any #section link is clicked — no abrupt jump.',
        },
      ],
    },
  ],
};