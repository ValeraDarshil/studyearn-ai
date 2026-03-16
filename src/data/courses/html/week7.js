/**
 * HTML Course — Week 7: CSS Animations, Transitions & Transforms
 */

export const HTML_WEEK_7 = {
  week: 7,
  title: 'CSS Animations — Webpages ko Alive Banao',
  title_en: 'CSS Animations — Bringing Webpages to Life',
  description: 'Transitions, transforms aur animations se dynamic UI banao!',
  description_en: 'Create dynamic UI with transitions, transforms and animations!',
  xpReward: 200,
  sections: [
    {
      id: 'html-w7-s1',
      title: 'CSS Transitions — Smooth Changes',
      title_en: 'CSS Transitions — Smooth Changes',
      emoji: '🌊',
      content: `## CSS Transitions — Property Changes ko Smooth Banao!

Bina transition ke: color instantly changes. With transition: smoothly animates!

### Basic Transition

\`\`\`css
.btn {
  background: #6366f1;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;

  /* transition: property duration timing-function delay */
  transition: background 0.3s ease;
}

.btn:hover {
  background: #4f46e5;
}
\`\`\`

### Transition Properties

\`\`\`css
/* Single property */
transition: color 0.2s ease;
transition: transform 0.3s ease-in-out;

/* Multiple properties */
transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;

/* All properties */
transition: all 0.3s ease;

/* Shorthand breakdown */
transition: property | duration | timing | delay
transition: background  0.3s     ease      0s;
\`\`\`

### Timing Functions

\`\`\`css
transition-timing-function: ease;         /* Slow > Fast > Slow (default) */
transition-timing-function: linear;       /* Constant speed */
transition-timing-function: ease-in;      /* Slow start */
transition-timing-function: ease-out;     /* Slow end */
transition-timing-function: ease-in-out;  /* Slow start and end */

/* Custom cubic-bezier */
transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy! */
\`\`\`

### Common Transition Patterns

\`\`\`css
/* Card hover lift */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
}

/* Button press effect */
.btn {
  transition: transform 0.1s ease, background 0.2s ease;
}
.btn:hover  { transform: translateY(-2px); }
.btn:active { transform: translateY(0) scale(0.98); }

/* Color fade */
a {
  color: #64748b;
  transition: color 0.2s ease;
}
a:hover { color: #6366f1; }

/* Image zoom on hover */
.img-wrapper {
  overflow: hidden;
  border-radius: 12px;
}
.img-wrapper img {
  transition: transform 0.4s ease;
}
.img-wrapper:hover img {
  transform: scale(1.08);
}

/* Underline animation */
.nav-link {
  position: relative;
  text-decoration: none;
  color: white;
}
.nav-link::after {
  content: "";
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 2px;
  background: #a78bfa;
  transition: width 0.3s ease;
}
.nav-link:hover::after { width: 100%; }
\`\`\``,
      content_en: `## CSS Transitions — Make Property Changes Smooth!

Without a transition: colour changes instantly. With a transition: it animates smoothly!

### Basic Transition

\`\`\`css
.btn {
  background: #6366f1;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;

  /* transition: property duration timing-function delay */
  transition: background 0.3s ease;
}
.btn:hover { background: #4f46e5; }
\`\`\`

### Transition Properties

\`\`\`css
transition: color 0.2s ease;
transition: background 0.3s ease, transform 0.2s ease;
transition: all 0.3s ease;
\`\`\`

### Timing Functions

\`\`\`css
ease           /* Slow → Fast → Slow (default) */
linear         /* Constant speed */
ease-in        /* Slow start */
ease-out       /* Slow end */
ease-in-out    /* Slow start and end */
cubic-bezier(0.34, 1.56, 0.64, 1)  /* Bouncy! */
\`\`\`

### Common Transition Patterns

\`\`\`css
/* Card hover lift */
.card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(99,102,241,0.2); }

/* Button press effect */
.btn:hover  { transform: translateY(-2px); }
.btn:active { transform: translateY(0) scale(0.98); }

/* Image zoom on hover */
.img-wrapper { overflow: hidden; border-radius: 12px; }
.img-wrapper img { transition: transform 0.4s ease; }
.img-wrapper:hover img { transform: scale(1.08); }

/* Underline animation */
.nav-link::after {
  content: ""; position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 2px;
  background: #a78bfa;
  transition: width 0.3s ease;
}
.nav-link:hover::after { width: 100%; }
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Transitions Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: white; padding: 40px 20px; }

    h2 { color: #a78bfa; margin: 40px 0 20px; font-size: 18px; }

    /* 1. Button transitions */
    .btn-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .btn {
      padding: 12px 28px; border-radius: 10px;
      font-weight: 600; font-size: 14px;
      cursor: pointer; border: none;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .btn-primary { background: #6366f1; color: white; }
    .btn-primary:hover { background: #4f46e5; transform: translateY(-4px); box-shadow: 0 12px 24px rgba(99,102,241,0.4); }
    .btn-primary:active { transform: translateY(-1px) scale(0.98); }

    .btn-outline { background: transparent; color: #6366f1; border: 2px solid #6366f1; }
    .btn-outline:hover { background: #6366f1; color: white; transform: translateY(-4px); }

    .btn-ghost { background: rgba(255,255,255,0.05); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); }
    .btn-ghost:hover { background: rgba(255,255,255,0.1); color: white; transform: translateY(-4px); border-color: rgba(255,255,255,0.2); }

    /* 2. Card transitions */
    .cards-row { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 8px; }
    .card {
      background: #1e293b;
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 16px; padding: 24px;
      flex: 1 1 200px; max-width: 260px;
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      cursor: pointer;
    }
    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 24px 48px rgba(99,102,241,0.2);
      border-color: rgba(99,102,241,0.5);
    }
    .card .icon { font-size: 36px; margin-bottom: 12px; }
    .card h3 { font-size: 16px; margin-bottom: 8px; }
    .card p { color: #64748b; font-size: 13px; line-height: 1.5; }

    /* 3. Image zoom */
    .img-gallery { display: flex; gap: 16px; flex-wrap: wrap; }
    .img-wrapper {
      overflow: hidden; border-radius: 12px;
      flex: 1 1 180px; max-width: 220px;
      height: 140px;
    }
    .img-wrapper img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .img-wrapper:hover img { transform: scale(1.12); }

    /* 4. Nav underline */
    .nav-demo { display: flex; gap: 32px; padding: 20px; background: #1e293b; border-radius: 12px; }
    .nav-link {
      position: relative; color: #94a3b8;
      text-decoration: none; font-weight: 500;
      transition: color 0.2s;
    }
    .nav-link::after {
      content: ""; position: absolute;
      bottom: -4px; left: 0;
      width: 0; height: 2px;
      background: linear-gradient(90deg, #6366f1, #a78bfa);
      transition: width 0.3s ease;
      border-radius: 1px;
    }
    .nav-link:hover { color: white; }
    .nav-link:hover::after { width: 100%; }

    /* 5. Input focus */
    .input-demo { margin-top: 8px; }
    .fancy-input {
      width: 100%; max-width: 400px;
      background: #1e293b; border: 2px solid rgba(255,255,255,0.1);
      color: white; padding: 12px 16px; border-radius: 10px;
      font-size: 14px; outline: none;
      transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
    }
    .fancy-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99,102,241,0.15);
      background: rgba(99,102,241,0.05);
    }
    .fancy-input::placeholder { color: #475569; }
  </style>
</head>
<body>

  <h1 style="font-size:28px; margin-bottom:8px;">🌊 CSS Transitions Demo</h1>
  <p style="color:#64748b; margin-bottom:20px;">Har element pe hover karo!</p>

  <h2>1. Button Transitions</h2>
  <div class="btn-row">
    <button class="btn btn-primary">Primary Button</button>
    <button class="btn btn-outline">Outline Button</button>
    <button class="btn btn-ghost">Ghost Button</button>
  </div>

  <h2>2. Card Hover Lift</h2>
  <div class="cards-row">
    <div class="card"><div class="icon">🐍</div><h3>Python</h3><p>Backend development aur data science ke liye.</p></div>
    <div class="card"><div class="icon">🌐</div><h3>HTML/CSS</h3><p>Web ka structure aur design banao.</p></div>
    <div class="card"><div class="icon">⚡</div><h3>JavaScript</h3><p>Interactive websites banao.</p></div>
  </div>

  <h2>3. Image Zoom</h2>
  <div class="img-gallery">
    <div class="img-wrapper"><img src="https://picsum.photos/220/140?random=20" alt="Photo 1"></div>
    <div class="img-wrapper"><img src="https://picsum.photos/220/140?random=21" alt="Photo 2"></div>
    <div class="img-wrapper"><img src="https://picsum.photos/220/140?random=22" alt="Photo 3"></div>
  </div>

  <h2>4. Navigation Underline</h2>
  <nav class="nav-demo">
    <a href="#" class="nav-link">Home</a>
    <a href="#" class="nav-link">Courses</a>
    <a href="#" class="nav-link">Blog</a>
    <a href="#" class="nav-link">Contact</a>
  </nav>

  <h2>5. Input Focus Effect</h2>
  <div class="input-demo">
    <input class="fancy-input" type="text" placeholder="Click to focus — see the transition...">
  </div>

</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Transitions Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: white; padding: 40px 20px; }
    h2 { color: #a78bfa; margin: 40px 0 20px; font-size: 18px; }

    .btn-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .btn { padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; border: none; transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .btn-primary { background: #6366f1; color: white; }
    .btn-primary:hover { background: #4f46e5; transform: translateY(-4px); box-shadow: 0 12px 24px rgba(99,102,241,0.4); }
    .btn-outline { background: transparent; color: #6366f1; border: 2px solid #6366f1; }
    .btn-outline:hover { background: #6366f1; color: white; transform: translateY(-4px); }

    .cards-row { display: flex; gap: 20px; flex-wrap: wrap; }
    .card { background: #1e293b; border: 1px solid rgba(99,102,241,0.15); border-radius: 16px; padding: 24px; flex: 1 1 200px; max-width: 260px; transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; cursor: pointer; }
    .card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.5); }
    .card .icon { font-size: 36px; margin-bottom: 12px; }
    .card h3 { font-size: 16px; margin-bottom: 8px; }
    .card p { color: #64748b; font-size: 13px; line-height: 1.5; }

    .img-gallery { display: flex; gap: 16px; flex-wrap: wrap; }
    .img-wrapper { overflow: hidden; border-radius: 12px; flex: 1 1 180px; max-width: 220px; height: 140px; }
    .img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
    .img-wrapper:hover img { transform: scale(1.12); }

    .nav-demo { display: flex; gap: 32px; padding: 20px; background: #1e293b; border-radius: 12px; }
    .nav-link { position: relative; color: #94a3b8; text-decoration: none; font-weight: 500; transition: color 0.2s; }
    .nav-link::after { content: ""; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, #6366f1, #a78bfa); transition: width 0.3s ease; border-radius: 1px; }
    .nav-link:hover { color: white; }
    .nav-link:hover::after { width: 100%; }

    .fancy-input { width: 100%; max-width: 400px; background: #1e293b; border: 2px solid rgba(255,255,255,0.1); color: white; padding: 12px 16px; border-radius: 10px; font-size: 14px; outline: none; transition: border-color 0.3s ease, box-shadow 0.3s ease; }
    .fancy-input:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.15); }
    .fancy-input::placeholder { color: #475569; }
  </style>
</head>
<body>
  <h1 style="font-size:28px; margin-bottom:8px;">🌊 CSS Transitions Demo</h1>
  <p style="color:#64748b; margin-bottom:20px;">Hover over each element!</p>

  <h2>1. Button Transitions</h2>
  <div class="btn-row">
    <button class="btn btn-primary">Primary Button</button>
    <button class="btn btn-outline">Outline Button</button>
  </div>

  <h2>2. Card Hover Lift</h2>
  <div class="cards-row">
    <div class="card"><div class="icon">🐍</div><h3>Python</h3><p>For backend and data science.</p></div>
    <div class="card"><div class="icon">🌐</div><h3>HTML/CSS</h3><p>Build web structure and design.</p></div>
    <div class="card"><div class="icon">⚡</div><h3>JavaScript</h3><p>Create interactive websites.</p></div>
  </div>

  <h2>3. Image Zoom</h2>
  <div class="img-gallery">
    <div class="img-wrapper"><img src="https://picsum.photos/220/140?random=20" alt="Photo 1"></div>
    <div class="img-wrapper"><img src="https://picsum.photos/220/140?random=21" alt="Photo 2"></div>
    <div class="img-wrapper"><img src="https://picsum.photos/220/140?random=22" alt="Photo 3"></div>
  </div>

  <h2>4. Navigation Underline</h2>
  <nav class="nav-demo">
    <a href="#" class="nav-link">Home</a>
    <a href="#" class="nav-link">Courses</a>
    <a href="#" class="nav-link">Blog</a>
    <a href="#" class="nav-link">Contact</a>
  </nav>

  <h2>5. Input Focus Effect</h2>
  <input class="fancy-input" type="text" placeholder="Click to focus — watch the transition...">
</body>
</html>`,
      task: {
        description: 'Apni portfolio website mein yeh transitions add karo: (1) Navbar links — hover pe color change + underline animation (::after width), (2) Project cards — hover pe translateY(-8px) + box-shadow, (3) Skills progress bars — fill karne pe transition (width 1s ease), (4) Profile photo — hover pe scale(1.05) + border glow, (5) All buttons — hover lift + active press, (6) Form inputs — :focus pe border glow effect, (7) Footer social links — hover pe scale + color change.',
        description_en: 'Add these transitions to your portfolio website: (1) Navbar links — colour change + underline animation on hover (::after width), (2) Project cards — translateY(-8px) + box-shadow on hover, (3) Skills progress bars — transition on fill (width 1s ease), (4) Profile photo — scale(1.05) + border glow on hover, (5) All buttons — hover lift + active press, (6) Form inputs — border glow on :focus, (7) Footer social links — scale + colour change on hover.',
        hint: 'Progress bar transition: pehle .skill-fill { width: 0; transition: width 1s ease; } set karo, phir JavaScript ya inline style se actual width set karo. Yeh ek nice loading animation deta hai.',
        hint_en: 'Progress bar transition: first set .skill-fill { width: 0; transition: width 1s ease; }, then set the actual width via JavaScript or inline style. This gives a nice loading animation.',
      },
      quiz: [
        {
          q: 'transition: all 0.3s ease; aur specific property ka fark kya hai?',
          options: ['Koi fark nahi', '"all" sab properties animate karta hai — heavier. Specific property sirf wo ek animate karta hai — better performance', '"all" faster hai', 'Specific property kaam nahi karta'],
          correct: 1,
          explanation: 'transition: all performance cost zyada hai kyunki browser har property check karta hai. Specific: transition: transform 0.3s ease; sirf woh property track karta hai — better for performance.',
          q_en: 'What is the difference between transition: all 0.3s ease; and a specific property?',
          options_en: ['"all" and specific are the same', '"all" animates every property — heavier. Specific only animates that one property — better performance', '"all" is faster', 'Specific property does not work'],
          explanation_en: 'transition: all has a higher performance cost because the browser checks every property. Specific: transition: transform 0.3s ease; only tracks that one property — better for performance.',
        },
        {
          q: 'cubic-bezier(0.34, 1.56, 0.64, 1) kya deta hai?',
          options: ['Linear motion', 'Bouncy spring effect — value 1 se upar jaata hai', 'Slow motion', 'No animation'],
          correct: 1,
          explanation: '1.56 > 1 matlab value "overshoot" karta hai — element thoda zyada jaata hai phir wapis aata hai. Yeh natural spring/bounce feel deta hai.',
          q_en: 'What does cubic-bezier(0.34, 1.56, 0.64, 1) produce?',
          options_en: ['Linear motion', 'A bouncy spring effect — the value goes above 1', 'Slow motion', 'No animation'],
          explanation_en: '1.56 > 1 means the value "overshoots" — the element goes a little further then springs back. This gives a natural spring/bounce feel.',
        },
        {
          q: ':hover transition ke liye kahan transition property likhni chahiye?',
          options: [':hover rule mein', 'Base element pe (normal state)', 'Dono jagah same', 'Kisi alag file mein'],
          correct: 1,
          explanation: 'Transition base element pe likhte hain, :hover mein nahi. Base pe likhne se hover in AND hover out dono smooth hote hain. :hover mein likhne se sirf hover IN smooth hota hai.',
          q_en: 'Where should the transition property be written for a :hover transition?',
          options_en: ['In the :hover rule', 'On the base element (normal state)', 'Same in both places', 'In a separate file'],
          explanation_en: 'Write transition on the base element, not in :hover. Writing it on the base element makes both hover IN and hover OUT smooth. Writing it only in :hover makes only the hover IN smooth.',
        },
      ],
    },

    {
      id: 'html-w7-s2',
      title: 'CSS Transforms — Elements ko Move, Rotate, Scale Karo',
      title_en: 'CSS Transforms — Move, Rotate and Scale Elements',
      emoji: '🔄',
      content: `## CSS Transforms — 2D aur 3D Manipulation!

### 2D Transforms

\`\`\`css
/* Translate — move karo */
transform: translateX(50px);       /* Right move */
transform: translateY(-20px);      /* Up move */
transform: translate(50px, -20px); /* X aur Y dono */
transform: translate(-50%, -50%);  /* % = element ki size ka % */

/* Scale — size change karo */
transform: scale(1.2);             /* 20% bada */
transform: scale(0.8);             /* 20% chhota */
transform: scaleX(2);              /* Sirf horizontal */
transform: scaleY(0.5);            /* Sirf vertical */
transform: scale(1.1, 0.9);        /* X aur Y alag */

/* Rotate — ghoomao */
transform: rotate(45deg);          /* Clockwise 45 degrees */
transform: rotate(-90deg);         /* Counter-clockwise */
transform: rotate(1turn);          /* 360 degrees */

/* Skew — teda karo */
transform: skewX(15deg);
transform: skewY(-10deg);
transform: skew(15deg, -10deg);

/* Multiple transforms (space se separate) */
transform: translateY(-8px) scale(1.02) rotate(2deg);
\`\`\`

### Transform Origin

\`\`\`css
/* Default: center */
transform-origin: center;

/* Corner rotations */
transform-origin: top left;
transform-origin: bottom right;
transform-origin: 0 0;             /* Same as top left */

/* Custom point */
transform-origin: 20px 30px;

/* Practical use — flip effect */
.card-flip {
  transform-origin: left center;
  transition: transform 0.4s ease;
}
.card-flip:hover {
  transform: rotateY(15deg);
}
\`\`\`

### 3D Transforms

\`\`\`css
/* 3D setup */
.container {
  perspective: 1000px;          /* 3D depth */
}

.card {
  transform-style: preserve-3d; /* 3D space maintain */
  transition: transform 0.5s ease;
}

.card:hover {
  transform: rotateY(180deg);   /* 3D flip! */
}

/* 3D translate */
transform: translateZ(50px);      /* Toward viewer */
transform: translate3d(x, y, z);

/* 3D rotate */
transform: rotateX(45deg);        /* Tilt forward */
transform: rotateY(45deg);        /* Turn sideways */
transform: rotateZ(45deg);        /* Same as rotate() */
\`\`\`

### Complete Card Flip Effect

\`\`\`css
.flip-container {
  perspective: 1000px;
  width: 300px; height: 200px;
}
.flip-card {
  width: 100%; height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}
.flip-container:hover .flip-card {
  transform: rotateY(180deg);
}
.flip-front, .flip-back {
  position: absolute; inset: 0;
  backface-visibility: hidden;  /* Hide when facing away */
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.flip-front { background: #6366f1; }
.flip-back  {
  background: #1e293b;
  transform: rotateY(180deg);   /* Pre-rotated */
}
\`\`\``,
      content_en: `## CSS Transforms — 2D and 3D Manipulation!

### 2D Transforms

\`\`\`css
/* Translate — move the element */
transform: translateX(50px);       /* Right */
transform: translateY(-20px);      /* Up */
transform: translate(50px, -20px); /* Both X and Y */
transform: translate(-50%, -50%);  /* % = % of element's own size */

/* Scale — change size */
transform: scale(1.2);             /* 20% larger */
transform: scale(0.8);             /* 20% smaller */

/* Rotate */
transform: rotate(45deg);
transform: rotate(-90deg);
transform: rotate(1turn);          /* 360 degrees */

/* Skew */
transform: skewX(15deg);
transform: skew(15deg, -10deg);

/* Multiple transforms */
transform: translateY(-8px) scale(1.02) rotate(2deg);
\`\`\`

### Transform Origin

\`\`\`css
transform-origin: center;       /* Default */
transform-origin: top left;
transform-origin: bottom right;
transform-origin: 20px 30px;

/* Practical — flip effect */
.card { transform-origin: left center; transition: transform 0.4s ease; }
.card:hover { transform: rotateY(15deg); }
\`\`\`

### 3D Transforms

\`\`\`css
.container { perspective: 1000px; }

.card {
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}
.card:hover { transform: rotateY(180deg); }
\`\`\`

### Complete Card Flip

\`\`\`css
.flip-container { perspective: 1000px; }
.flip-card { transform-style: preserve-3d; transition: transform 0.6s ease; }
.flip-container:hover .flip-card { transform: rotateY(180deg); }

.flip-front, .flip-back {
  position: absolute; inset: 0;
  backface-visibility: hidden;
}
.flip-back { transform: rotateY(180deg); }
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Transforms Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: white; padding: 40px 20px; }
    h2 { color: #a78bfa; margin: 48px 0 20px; }
    .row { display: flex; gap: 20px; flex-wrap: wrap; align-items: center; }

    /* Basic transforms */
    .transform-box {
      width: 80px; height: 80px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .t1 { background: #6366f1; }
    .t1:hover { transform: translateY(-20px); }
    .t2 { background: #8b5cf6; }
    .t2:hover { transform: scale(1.4) rotate(45deg); }
    .t3 { background: #a78bfa; }
    .t3:hover { transform: skew(20deg, 10deg); }
    .t4 { background: #ec4899; }
    .t4:hover { transform: rotate(360deg) scale(1.2); }

    /* 3D Card flip */
    .flip-container {
      perspective: 800px;
      width: 200px; height: 130px;
      cursor: pointer;
    }
    .flip-card {
      width: 100%; height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.7s ease;
    }
    .flip-container:hover .flip-card {
      transform: rotateY(180deg);
    }
    .flip-front, .flip-back {
      position: absolute; inset: 0;
      backface-visibility: hidden;
      border-radius: 12px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 16px; text-align: center;
    }
    .flip-front {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
    }
    .flip-front .emoji { font-size: 32px; margin-bottom: 8px; }
    .flip-front p { font-size: 13px; opacity: 0.9; }
    .flip-back {
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      border: 1px solid rgba(99,102,241,0.4);
      transform: rotateY(180deg);
    }
    .flip-back h3 { font-size: 15px; margin-bottom: 8px; color: #a78bfa; }
    .flip-back p  { font-size: 12px; color: #94a3b8; line-height: 1.5; }

    /* Centered element trick */
    .center-demo {
      position: relative;
      background: #1e293b;
      border-radius: 16px; height: 160px;
      margin-top: 8px;
    }
    .centered {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      padding: 12px 24px; border-radius: 8px;
      font-weight: 600; white-space: nowrap;
    }

    /* Loading spinner */
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(99,102,241,0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>

  <h1 style="font-size:28px; margin-bottom:8px;">🔄 CSS Transforms Demo</h1>
  <p style="color:#64748b; margin-bottom:20px;">Hover over each element to see transforms!</p>

  <h2>1. Basic Transforms (hover karo)</h2>
  <div class="row">
    <div class="transform-box t1" title="translateY(-20px)">⬆️</div>
    <div class="transform-box t2" title="scale + rotate">🔄</div>
    <div class="transform-box t3" title="skew">↗️</div>
    <div class="transform-box t4" title="rotate 360°">🌀</div>
    <div style="color:#64748b; font-size:13px; margin-left:8px;">← Hover each box</div>
  </div>

  <h2>2. 3D Card Flip (hover karo)</h2>
  <div class="row">
    <div class="flip-container">
      <div class="flip-card">
        <div class="flip-front">
          <div class="emoji">🐍</div>
          <p>Hover to flip!</p>
        </div>
        <div class="flip-back">
          <h3>Python Course</h3>
          <p>3 months · 48 sections · Certificate included!</p>
        </div>
      </div>
    </div>

    <div class="flip-container">
      <div class="flip-card">
        <div class="flip-front">
          <div class="emoji">🌐</div>
          <p>Hover to flip!</p>
        </div>
        <div class="flip-back">
          <h3>HTML Course</h3>
          <p>Absolute beginner · Build real websites!</p>
        </div>
      </div>
    </div>
  </div>

  <h2>3. Perfect Centering with translate(-50%, -50%)</h2>
  <div class="center-demo">
    <div class="centered">✨ Perfectly Centered!</div>
  </div>

  <h2>4. Spinner (CSS rotate animation)</h2>
  <div class="spinner"></div>

</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Transforms Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: white; padding: 40px 20px; }
    h2 { color: #a78bfa; margin: 48px 0 20px; }
    .row { display: flex; gap: 20px; flex-wrap: wrap; align-items: center; }

    .transform-box { width: 80px; height: 80px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .t1 { background: #6366f1; } .t1:hover { transform: translateY(-20px); }
    .t2 { background: #8b5cf6; } .t2:hover { transform: scale(1.4) rotate(45deg); }
    .t3 { background: #a78bfa; } .t3:hover { transform: skew(20deg, 10deg); }
    .t4 { background: #ec4899; } .t4:hover { transform: rotate(360deg) scale(1.2); }

    .flip-container { perspective: 800px; width: 200px; height: 130px; cursor: pointer; }
    .flip-card { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.7s ease; }
    .flip-container:hover .flip-card { transform: rotateY(180deg); }
    .flip-front, .flip-back { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; text-align: center; }
    .flip-front { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
    .flip-back  { background: linear-gradient(135deg, #1e1b4b, #312e81); border: 1px solid rgba(99,102,241,0.4); transform: rotateY(180deg); }
    .flip-back h3 { font-size: 15px; margin-bottom: 8px; color: #a78bfa; }
    .flip-back p  { font-size: 12px; color: #94a3b8; line-height: 1.5; }

    .center-demo { position: relative; background: #1e293b; border-radius: 16px; height: 160px; margin-top: 8px; }
    .centered { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #6366f1, #a78bfa); padding: 12px 24px; border-radius: 8px; font-weight: 600; white-space: nowrap; }

    .spinner { width: 40px; height: 40px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <h1 style="font-size:28px; margin-bottom:8px;">🔄 CSS Transforms Demo</h1>
  <p style="color:#64748b; margin-bottom:20px;">Hover over each element to see transforms!</p>

  <h2>1. Basic Transforms</h2>
  <div class="row">
    <div class="transform-box t1">⬆️</div>
    <div class="transform-box t2">🔄</div>
    <div class="transform-box t3">↗️</div>
    <div class="transform-box t4">🌀</div>
  </div>

  <h2>2. 3D Card Flip</h2>
  <div class="row">
    <div class="flip-container"><div class="flip-card">
      <div class="flip-front"><div style="font-size:32px">🐍</div><p>Hover to flip!</p></div>
      <div class="flip-back"><h3>Python Course</h3><p>3 months · 48 sections · Certificate!</p></div>
    </div></div>
  </div>

  <h2>3. Perfect Centering</h2>
  <div class="center-demo"><div class="centered">✨ Perfectly Centred!</div></div>

  <h2>4. CSS Spinner</h2>
  <div class="spinner"></div>
</body>
</html>`,
      task: {
        description: 'Ek interactive "Skills Showcase" page banao transforms use karke. Har skill card pe: (1) Hover pe rotateY(10deg) tilt effect, (2) Click pe full rotateY(180deg) flip — front mein skill name aur icon, back mein skill description aur proficiency level, (3) Loading spinner jab page load ho, (4) Hero section mein floating elements (different translateY pe loop karte hue — CSS animations use karo), (5) "Featured" card pe CSS glowing border effect.',
        description_en: 'Build an interactive "Skills Showcase" page using transforms. On each skill card: (1) rotateY(10deg) tilt effect on hover, (2) Full rotateY(180deg) flip on click — skill name and icon on front, description and proficiency on back, (3) A loading spinner when the page loads, (4) Floating elements in the hero section (CSS animations looping at different translateY values), (5) Glowing CSS border effect on the "Featured" card.',
        hint: 'Click flip ke liye JavaScript class toggle use karo: element.classList.toggle("flipped"). CSS mein .flipped { transform: rotateY(180deg); }. Floating: @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }',
        hint_en: 'For click flip, use JavaScript class toggle: element.classList.toggle("flipped"). In CSS: .flipped { transform: rotateY(180deg); }. Floating: @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }',
      },
      quiz: [
        {
          q: 'transform: translate(-50%, -50%) kab use karte hain?',
          options: ['Image rotate karne ke liye', 'position: absolute element ko perfectly center karne ke liye (top:50% left:50% ke saath)', 'Text move karne ke liye', 'Element hide karne ke liye'],
          correct: 1,
          explanation: 'top:50% left:50% element ka top-left corner center pe le jaata hai. translate(-50%,-50%) element ko apni khud ki size ka 50% back move karta hai — perfect center!',
          q_en: 'When do you use transform: translate(-50%, -50%)?',
          options_en: ['To rotate an image', 'To perfectly centre a position: absolute element (with top:50% left:50%)', 'To move text', 'To hide an element'],
          explanation_en: 'top:50% left:50% puts the top-left corner at the centre. translate(-50%,-50%) moves the element back by 50% of its own size — perfect centre!',
        },
        {
          q: 'backface-visibility: hidden kab zaruri hota hai?',
          options: ['Hamesha', '3D card flip mein — card ke peeche wale side ko hide karne ke liye jab woh face-down ho', 'Images ke liye', 'Text ke liye'],
          correct: 1,
          explanation: 'Card flip mein front aur back dono sides hain. backface-visibility: hidden se jab ek side 180deg face-down ho toh woh invisible ho jaati hai — warna dono sides ek saath dikhte hain.',
          q_en: 'When is backface-visibility: hidden necessary?',
          options_en: ['Always', 'In 3D card flips — to hide the back side when it is face-down', 'For images', 'For text'],
          explanation_en: 'A card flip has a front and a back side. backface-visibility: hidden makes a side invisible when it is rotated 180deg face-down — otherwise both sides show at the same time.',
        },
        {
          q: 'Multiple transforms ek saath kaise apply karte hain?',
          options: ['transform: translateY(-8px); transform: scale(1.1);', 'transform: translateY(-8px) scale(1.1);', 'transform: [translateY(-8px), scale(1.1)]', 'transforms: translateY(-8px) scale(1.1);'],
          correct: 1,
          explanation: 'Multiple transforms space se separate karke ek hi transform property mein likhe jaate hain: transform: translateY(-8px) scale(1.1) rotate(5deg);',
          q_en: 'How do you apply multiple transforms at once?',
          options_en: ['transform: translateY(-8px); transform: scale(1.1);', 'transform: translateY(-8px) scale(1.1);', 'transform: [translateY(-8px), scale(1.1)]', 'transforms: translateY(-8px) scale(1.1);'],
          explanation_en: 'Multiple transforms are written space-separated in a single transform property: transform: translateY(-8px) scale(1.1) rotate(5deg);',
        },
      ],
    },

    {
      id: 'html-w7-s3',
      title: 'CSS Animations — @keyframes se Custom Animations',
      title_en: 'CSS Animations — Custom Animations with @keyframes',
      emoji: '🎬',
      content: `## CSS @keyframes Animations — Full Control!

Transitions sirf A → B hoti hain. @keyframes animations complex multi-step sequences banate hain!

### Basic @keyframes

\`\`\`css
/* Animation define karo */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Use karo */
.hero-text {
  animation: fadeIn 1s ease forwards;
}

/* animation shorthand */
/* name | duration | timing | delay | iterations | direction | fill-mode */
animation: fadeIn 1s ease 0.2s 1 normal forwards;
\`\`\`

### Animation Properties

\`\`\`css
.element {
  animation-name: fadeIn;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-delay: 0.5s;
  animation-iteration-count: infinite; /* 1, 2, infinite */
  animation-direction: normal;         /* normal, reverse, alternate */
  animation-fill-mode: forwards;       /* none, forwards, backwards, both */
  animation-play-state: running;       /* running, paused */
}
\`\`\`

### Common Animations

\`\`\`css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.05); opacity: 0.8; }
}

/* Slide in from left */
@keyframes slideInLeft {
  from { transform: translateX(-100px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

/* Bounce */
@keyframes bounce {
  0%, 100% { transform: translateY(0); animation-timing-function: ease-in; }
  50%       { transform: translateY(-30px); animation-timing-function: ease-out; }
}

/* Shake */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-10px); }
  40%       { transform: translateX(10px); }
  60%       { transform: translateX(-8px); }
  80%       { transform: translateX(8px); }
}

/* Gradient background shift */
@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animated-bg {
  background: linear-gradient(-45deg, #6366f1, #a78bfa, #ec4899, #8b5cf6);
  background-size: 400% 400%;
  animation: gradientShift 6s ease infinite;
}

/* Typing cursor effect */
@keyframes blink {
  0%, 100% { border-color: transparent; }
  50%       { border-color: #6366f1; }
}
.cursor {
  border-right: 3px solid #6366f1;
  animation: blink 1s step-end infinite;
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-15px); }
}
\`\`\`

### Staggered Animations

\`\`\`css
/* Items ek ek karke appear hon */
.item { animation: fadeIn 0.5s ease forwards; opacity: 0; }
.item:nth-child(1) { animation-delay: 0.1s; }
.item:nth-child(2) { animation-delay: 0.2s; }
.item:nth-child(3) { animation-delay: 0.3s; }
.item:nth-child(4) { animation-delay: 0.4s; }
\`\`\`

### Pause on Hover

\`\`\`css
.spinner { animation: spin 1s linear infinite; }
.spinner:hover { animation-play-state: paused; }
\`\`\``,
      content_en: `## CSS @keyframes Animations — Full Control!

Transitions only go from A → B. @keyframes animations create complex multi-step sequences!

### Basic @keyframes

\`\`\`css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-text {
  animation: fadeIn 1s ease forwards;
}

/* Shorthand: name | duration | timing | delay | iterations | direction | fill-mode */
animation: fadeIn 1s ease 0.2s 1 normal forwards;
\`\`\`

### Common Animations

\`\`\`css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.05); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); animation-timing-function: ease-in; }
  50%       { transform: translateY(-30px); animation-timing-function: ease-out; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-10px); }
  40%       { transform: translateX(10px); }
  60%       { transform: translateX(-8px); }
  80%       { transform: translateX(8px); }
}

/* Animated gradient background */
@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animated-bg {
  background: linear-gradient(-45deg, #6366f1, #a78bfa, #ec4899, #8b5cf6);
  background-size: 400% 400%;
  animation: gradientShift 6s ease infinite;
}
\`\`\`

### Staggered Animations

\`\`\`css
.item { animation: fadeIn 0.5s ease forwards; opacity: 0; }
.item:nth-child(1) { animation-delay: 0.1s; }
.item:nth-child(2) { animation-delay: 0.2s; }
.item:nth-child(3) { animation-delay: 0.3s; }
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Animations Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: white; }

    /* ── Keyframes ── */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-60px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
      50%       { transform: scale(1.03); box-shadow: 0 0 0 12px rgba(99,102,241,0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33%       { transform: translateY(-18px) rotate(3deg); }
      66%       { transform: translateY(-8px) rotate(-2deg); }
    }
    @keyframes gradientShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes blink {
      0%, 100% { border-color: transparent; }
      50%       { border-color: #a78bfa; }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-20px); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }

    /* ── Hero ── */
    .hero {
      min-height: 400px;
      background: linear-gradient(-45deg, #1e1b4b, #6366f1, #312e81, #4f46e5);
      background-size: 400% 400%;
      animation: gradientShift 8s ease infinite;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 60px 20px;
      position: relative; overflow: hidden;
    }
    .hero-tag {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      padding: 6px 16px; border-radius: 20px;
      font-size: 13px; margin-bottom: 24px;
      animation: fadeInUp 0.6s ease forwards;
    }
    .hero h1 {
      font-size: 48px; font-weight: 800;
      margin-bottom: 16px;
      animation: fadeInUp 0.6s ease 0.2s both;
    }
    .hero p {
      font-size: 18px; opacity: 0.85; max-width: 500px;
      animation: fadeInUp 0.6s ease 0.4s both;
    }
    .hero .cursor {
      display: inline-block;
      border-right: 3px solid #a78bfa;
      animation: blink 1s step-end infinite;
    }

    /* Floating elements */
    .float-el {
      position: absolute;
      font-size: 28px; opacity: 0.15;
    }
    .float-el:nth-child(1) { top: 10%; left: 8%;  animation: float 5s ease infinite; }
    .float-el:nth-child(2) { top: 20%; right: 12%; animation: float 7s ease infinite 1s; }
    .float-el:nth-child(3) { bottom: 15%; left: 15%; animation: float 6s ease infinite 0.5s; }
    .float-el:nth-child(4) { bottom: 25%; right: 8%; animation: float 8s ease infinite 2s; }

    /* ── Content ── */
    .content { padding: 48px 24px; max-width: 900px; margin: 0 auto; }
    h2 { color: #a78bfa; margin: 40px 0 20px; font-size: 18px; }

    /* Staggered cards */
    .stagger-grid { display: flex; gap: 16px; flex-wrap: wrap; }
    .stagger-card {
      background: #1e293b; border: 1px solid rgba(99,102,241,0.15);
      border-radius: 14px; padding: 20px;
      flex: 1 1 180px; text-align: center;
      opacity: 0;
      animation: fadeInUp 0.5s ease forwards;
    }
    .stagger-card:nth-child(1) { animation-delay: 0.1s; }
    .stagger-card:nth-child(2) { animation-delay: 0.25s; }
    .stagger-card:nth-child(3) { animation-delay: 0.4s; }
    .stagger-card:nth-child(4) { animation-delay: 0.55s; }
    .stagger-card .icon { font-size: 32px; margin-bottom: 10px; }
    .stagger-card p { font-size: 14px; color: #a78bfa; font-weight: 600; }

    /* Pulse button */
    .pulse-btn {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white; padding: 14px 32px;
      border-radius: 10px; font-weight: 700; cursor: pointer;
      border: none; font-size: 16px;
      animation: pulse 2s ease infinite;
    }
    .pulse-btn:hover { animation-play-state: paused; }

    /* Slide in list */
    .slide-list li {
      list-style: none;
      background: #1e293b; border-left: 3px solid #6366f1;
      padding: 12px 20px; margin-bottom: 8px;
      border-radius: 0 8px 8px 0;
      opacity: 0;
      animation: slideInLeft 0.5s ease forwards;
    }
    .slide-list li:nth-child(1) { animation-delay: 0.1s; }
    .slide-list li:nth-child(2) { animation-delay: 0.25s; }
    .slide-list li:nth-child(3) { animation-delay: 0.4s; }

    /* Shimmer skeleton */
    .skeleton {
      background: linear-gradient(90deg, #1e293b 0%, #334155 50%, #1e293b 100%);
      background-size: 200% 100%;
      animation: shimmer 1.5s linear infinite;
      border-radius: 8px; height: 16px; margin: 8px 0;
    }
    .skeleton.wide  { width: 100%; }
    .skeleton.medium{ width: 60%; }
    .skeleton.short { width: 40%; }
  </style>
</head>
<body>

  <!-- Hero with animated gradient + floating elements + staggered text -->
  <section class="hero">
    <span class="float-el">🐍</span>
    <span class="float-el">🌐</span>
    <span class="float-el">⚡</span>
    <span class="float-el">🎨</span>

    <div class="hero-tag">✨ CSS Animations Demo</div>
    <h1>Code Seekho<span class="cursor"> </span></h1>
    <p>Transitions, transforms aur animations se websites ko alive banao!</p>
  </section>

  <div class="content">

    <h2>1. Staggered Cards (ek ek karke appear)</h2>
    <div class="stagger-grid">
      <div class="stagger-card"><div class="icon">🐍</div><p>Python</p></div>
      <div class="stagger-card"><div class="icon">🌐</div><p>HTML/CSS</p></div>
      <div class="stagger-card"><div class="icon">⚡</div><p>JavaScript</p></div>
      <div class="stagger-card"><div class="icon">⚛️</div><p>React</p></div>
    </div>

    <h2>2. Pulsing CTA Button (hover pe pause)</h2>
    <button class="pulse-btn">🚀 Start Learning Today!</button>

    <h2>3. Slide-in List</h2>
    <ul class="slide-list">
      <li>✅ HTML Fundamentals</li>
      <li>✅ CSS Styling & Animations</li>
      <li>✅ Responsive Design</li>
    </ul>

    <h2>4. Loading Skeleton</h2>
    <div style="background:#1e293b; padding:20px; border-radius:12px; max-width:400px;">
      <div class="skeleton wide"></div>
      <div class="skeleton medium"></div>
      <div class="skeleton short"></div>
    </div>

  </div>

</body>
</html>`,
      codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Animations Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: white; }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,102,241,0.4); } 50% { transform: scale(1.03); box-shadow: 0 0 0 12px rgba(99,102,241,0); } }
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-18px); } }
    @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    @keyframes blink { 0%, 100% { border-color: transparent; } 50% { border-color: #a78bfa; } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

    .hero { min-height: 400px; background: linear-gradient(-45deg, #1e1b4b, #6366f1, #312e81, #4f46e5); background-size: 400% 400%; animation: gradientShift 8s ease infinite; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 20px; position: relative; overflow: hidden; }
    .hero h1 { font-size: 48px; font-weight: 800; margin-bottom: 16px; animation: fadeInUp 0.6s ease 0.2s both; }
    .hero p  { font-size: 18px; opacity: 0.85; animation: fadeInUp 0.6s ease 0.4s both; }
    .cursor  { display: inline-block; border-right: 3px solid #a78bfa; animation: blink 1s step-end infinite; }
    .float-el { position: absolute; font-size: 28px; opacity: 0.15; }
    .float-el:nth-child(1) { top: 10%; left: 8%;  animation: float 5s ease infinite; }
    .float-el:nth-child(2) { top: 20%; right: 12%; animation: float 7s ease infinite 1s; }

    .content { padding: 48px 24px; max-width: 900px; margin: 0 auto; }
    h2 { color: #a78bfa; margin: 40px 0 20px; font-size: 18px; }

    .stagger-grid { display: flex; gap: 16px; flex-wrap: wrap; }
    .stagger-card { background: #1e293b; border: 1px solid rgba(99,102,241,0.15); border-radius: 14px; padding: 20px; flex: 1 1 180px; text-align: center; opacity: 0; animation: fadeInUp 0.5s ease forwards; }
    .stagger-card:nth-child(1) { animation-delay: 0.1s; }
    .stagger-card:nth-child(2) { animation-delay: 0.25s; }
    .stagger-card:nth-child(3) { animation-delay: 0.4s; }
    .stagger-card:nth-child(4) { animation-delay: 0.55s; }
    .stagger-card .icon { font-size: 32px; margin-bottom: 10px; }
    .stagger-card p { font-size: 14px; color: #a78bfa; font-weight: 600; }

    .pulse-btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; border-radius: 10px; font-weight: 700; cursor: pointer; border: none; font-size: 16px; animation: pulse 2s ease infinite; }
    .pulse-btn:hover { animation-play-state: paused; }

    .slide-list li { list-style: none; background: #1e293b; border-left: 3px solid #6366f1; padding: 12px 20px; margin-bottom: 8px; border-radius: 0 8px 8px 0; opacity: 0; animation: slideInLeft 0.5s ease forwards; }
    .slide-list li:nth-child(1) { animation-delay: 0.1s; }
    .slide-list li:nth-child(2) { animation-delay: 0.25s; }
    .slide-list li:nth-child(3) { animation-delay: 0.4s; }

    .skeleton { background: linear-gradient(90deg, #1e293b 0%, #334155 50%, #1e293b 100%); background-size: 200% 100%; animation: shimmer 1.5s linear infinite; border-radius: 8px; height: 16px; margin: 8px 0; }
    .skeleton.wide { width: 100%; } .skeleton.medium { width: 60%; } .skeleton.short { width: 40%; }
  </style>
</head>
<body>
  <section class="hero">
    <span class="float-el">🐍</span>
    <span class="float-el">🌐</span>
    <h1>Learn to Code<span class="cursor"> </span></h1>
    <p>CSS Animations bring websites to life!</p>
  </section>
  <div class="content">
    <h2>1. Staggered Cards</h2>
    <div class="stagger-grid">
      <div class="stagger-card"><div class="icon">🐍</div><p>Python</p></div>
      <div class="stagger-card"><div class="icon">🌐</div><p>HTML/CSS</p></div>
      <div class="stagger-card"><div class="icon">⚡</div><p>JavaScript</p></div>
      <div class="stagger-card"><div class="icon">⚛️</div><p>React</p></div>
    </div>
    <h2>2. Pulsing CTA Button (hover to pause)</h2>
    <button class="pulse-btn">🚀 Start Learning Today!</button>
    <h2>3. Slide-in List</h2>
    <ul class="slide-list">
      <li>✅ HTML Fundamentals</li>
      <li>✅ CSS Styling & Animations</li>
      <li>✅ Responsive Design</li>
    </ul>
    <h2>4. Loading Skeleton</h2>
    <div style="background:#1e293b; padding:20px; border-radius:12px; max-width:400px;">
      <div class="skeleton wide"></div>
      <div class="skeleton medium"></div>
      <div class="skeleton short"></div>
    </div>
  </div>
</body>
</html>`,
      task: {
        description: 'Apni portfolio website mein yeh animations add karo: (1) Page load pe hero text fadeInUp with stagger (name 0.2s delay, tagline 0.4s, buttons 0.6s), (2) Animated gradient background on hero, (3) Skill cards staggered appearance (nth-child delays), (4) Loading skeleton placeholder (3-4 shimmer bars) — page load hone pe JS se remove karo, (5) Scroll-triggered animation — elements appear karen jab viewport mein aayein (Intersection Observer use karo), (6) Success animation jab contact form submit ho.',
        description_en: 'Add these animations to your portfolio website: (1) Hero text fadeInUp with stagger on page load (name 0.2s delay, tagline 0.4s, buttons 0.6s), (2) Animated gradient background on hero, (3) Staggered appearance for skill cards (nth-child delays), (4) Loading skeleton placeholder (3-4 shimmer bars) — remove with JS once loaded, (5) Scroll-triggered animation — elements appear when entering the viewport (use Intersection Observer), (6) Success animation when the contact form is submitted.',
        hint: 'Intersection Observer: const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }); }); document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));',
        hint_en: 'Intersection Observer: const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }); }); document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));',
      },
      quiz: [
        {
          q: 'animation-fill-mode: forwards kya karta hai?',
          options: ['Animation forward direction mein chalata hai', 'Animation khatam hone ke baad element last keyframe ki state mein rakhta hai', 'Animation loop karta hai', 'Animation delay karta hai'],
          correct: 1,
          explanation: 'forwards: animation khatam hone ke baad element wahan reh jaata hai jahan animation ne chhoda tha (last keyframe). Bina iske element apni original state mein wapis aa jaata hai.',
          q_en: 'What does animation-fill-mode: forwards do?',
          options_en: ['Runs the animation in the forward direction', 'After the animation ends, keeps the element in the state of the last keyframe', 'Loops the animation', 'Delays the animation'],
          explanation_en: 'forwards: after the animation ends, the element stays at the last keyframe state. Without it, the element snaps back to its original state.',
        },
        {
          q: 'Staggered animation ke liye kaunsa CSS property use karte hain?',
          options: ['animation-duration', 'animation-delay — nth-child pe alag alag delay', 'animation-iteration-count', 'animation-direction'],
          correct: 1,
          explanation: 'Stagger effect ke liye har item pe alag animation-delay dete hain: .item:nth-child(1){animation-delay:0.1s} .item:nth-child(2){animation-delay:0.2s} etc.',
          q_en: 'Which CSS property is used for staggered animations?',
          options_en: ['animation-duration', 'animation-delay — different delay for each nth-child', 'animation-iteration-count', 'animation-direction'],
          explanation_en: 'For a stagger effect, give each item a different animation-delay: .item:nth-child(1){animation-delay:0.1s} .item:nth-child(2){animation-delay:0.2s} etc.',
        },
        {
          q: 'Transition aur @keyframes animation mein main fark kya hai?',
          options: ['Koi fark nahi', 'Transition = 2 states ke beech (A→B), @keyframes = complex multi-step sequences + auto-play', '@keyframes sirf hover pe kaam karta hai', 'Transition zyada features deta hai'],
          correct: 1,
          explanation: 'Transition CSS property change pe trigger hota hai (hover, focus etc.) — sirf start aur end. @keyframes = apna animation define karo, automatically play karo, loops, complex sequences sab possible.',
          q_en: 'What is the main difference between a transition and a @keyframes animation?',
          options_en: ['No difference', 'Transition = between 2 states (A→B), @keyframes = complex multi-step sequences + auto-play', '@keyframes only works on hover', 'Transition has more features'],
          explanation_en: 'Transition triggers on a CSS property change (hover, focus etc.) — just start and end. @keyframes = define your own animation, auto-play, loops, complex sequences all possible.',
        },
      ],
    },

    {
      id: 'html-w7-s4',
      title: 'Week 7 Project — Animated Landing Page',
      title_en: 'Week 7 Project — Animated Landing Page',
      emoji: '🚀',
      content: `## Week 7 Project — Full Animated Landing Page!

Is week mein seekha:
- CSS Transitions (smooth property changes)
- CSS Transforms (move, rotate, scale, 3D)
- CSS Animations (@keyframes, stagger, scroll-triggered)

Ab in sab ko combine karke ek **stunning animated landing page** banao!

### Required Animations Checklist:

\`\`\`
Hero Section:
  ✅ Animated gradient background (@keyframes gradientShift)
  ✅ Floating decorative elements
  ✅ Staggered text fadeInUp (heading → subtext → buttons)
  ✅ Typing cursor blink effect
  ✅ CTA buttons: hover lift + pulse animation

Navigation:
  ✅ Logo: subtle pulse on load
  ✅ Links: underline slide animation on hover
  ✅ Mobile: slide-in hamburger menu

Cards/Features Section:
  ✅ Scroll-triggered fadeInUp (Intersection Observer)
  ✅ Hover: translateY + box-shadow
  ✅ Icon: float animation

Stats Counter:
  ✅ Number count-up animation (JS + CSS)

Projects:
  ✅ Image zoom on hover
  ✅ Overlay slide up on hover

Loading:
  ✅ Initial page skeleton (shimmer)
  ✅ Remove after 1-2 seconds

Contact Form:
  ✅ Input focus animations
  ✅ Submit button loading state
  ✅ Success/error message animation
\`\`\``,
      content_en: `## Week 7 Project — Full Animated Landing Page!

This week covered:
- CSS Transitions (smooth property changes)
- CSS Transforms (move, rotate, scale, 3D)
- CSS Animations (@keyframes, stagger, scroll-triggered)

Now combine all of these to build a **stunning animated landing page**!

### Required Animations Checklist:

\`\`\`
Hero Section:
  ✅ Animated gradient background (@keyframes gradientShift)
  ✅ Floating decorative elements
  ✅ Staggered text fadeInUp (heading → subtext → buttons)
  ✅ Typing cursor blink effect
  ✅ CTA buttons: hover lift + pulse animation

Navigation:
  ✅ Logo: subtle pulse on load
  ✅ Links: underline slide animation on hover
  ✅ Mobile: slide-in hamburger menu

Cards/Features Section:
  ✅ Scroll-triggered fadeInUp (Intersection Observer)
  ✅ Hover: translateY + box-shadow
  ✅ Icon: float animation

Stats Counter:
  ✅ Number count-up animation (JS + CSS)

Projects:
  ✅ Image zoom on hover
  ✅ Overlay slide up on hover

Loading:
  ✅ Initial page skeleton (shimmer)
  ✅ Remove after 1–2 seconds

Contact Form:
  ✅ Input focus animations
  ✅ Submit button loading state
  ✅ Success/error message animation
\`\`\``,
      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StudyEarn AI — Learn. Code. Earn.</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #6366f1;
      --primary-dark: #4f46e5;
      --accent: #a78bfa;
      --pink: #ec4899;
      --bg: #0f172a;
      --bg2: #1e293b;
      --text: #e2e8f0;
      --muted: #64748b;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }

    /* ══ KEYFRAMES ═══════════════════════════════════════════ */
    @keyframes gradientShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%       { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
      70%  { box-shadow: 0 0 0 20px rgba(99,102,241,0); }
      100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.8); }
      to   { opacity: 1; transform: scale(1); }
    }

    /* ══ NAV ════════════════════════════════════════════════ */
    nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(15,23,42,0.85);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(99,102,241,0.15);
      padding: 0 24px; height: 64px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .logo {
      font-size: 20px; font-weight: 800; color: white;
      animation: scaleIn 0.5s ease;
    }
    .logo span { color: var(--accent); }
    .nav-links { display: flex; gap: 28px; list-style: none; }
    .nav-link {
      position: relative; color: var(--muted);
      text-decoration: none; font-size: 14px; font-weight: 500;
      transition: color 0.2s;
    }
    .nav-link::after {
      content: ""; position: absolute; bottom: -4px; left: 0;
      width: 0; height: 2px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      transition: width 0.3s ease; border-radius: 1px;
    }
    .nav-link:hover { color: white; }
    .nav-link:hover::after { width: 100%; }
    .nav-cta {
      background: var(--primary); color: white;
      padding: 8px 20px; border-radius: 8px;
      text-decoration: none; font-size: 14px; font-weight: 600;
      transition: all 0.2s;
    }
    .nav-cta:hover { background: var(--primary-dark); transform: translateY(-1px); }

    /* ══ HERO ═══════════════════════════════════════════════ */
    .hero {
      min-height: 100vh;
      background: linear-gradient(-45deg, #0f172a, #1e1b4b, #312e81, #1e1b4b, #0f172a);
      background-size: 400% 400%;
      animation: gradientShift 12s ease infinite;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 80px 24px;
      position: relative; overflow: hidden;
    }
    .hero::after {
      content: "";
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.25), transparent);
      pointer-events: none;
    }
    .float-icon {
      position: absolute; font-size: 32px; opacity: 0.1; user-select: none;
    }
    .fi1 { top: 8%;  left: 6%;  animation: float 6s ease infinite; }
    .fi2 { top: 15%; right: 8%; animation: float 8s ease infinite 1s; }
    .fi3 { bottom: 20%; left: 10%; animation: float 7s ease infinite 0.5s; }
    .fi4 { bottom: 12%; right: 6%; animation: float 9s ease infinite 2s; }
    .fi5 { top: 50%; left: 2%;  animation: float 5s ease infinite 0.3s; }

    .hero-tag {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.3);
      color: var(--accent); padding: 6px 18px;
      border-radius: 24px; font-size: 13px; font-weight: 500;
      margin-bottom: 32px;
      animation: fadeInUp 0.6s ease both;
    }
    .dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse-ring 2s infinite; }

    .hero-title {
      font-size: clamp(40px, 7vw, 80px);
      font-weight: 800; line-height: 1.05;
      margin-bottom: 24px;
      animation: fadeInUp 0.6s ease 0.2s both;
    }
    .grad { background: linear-gradient(135deg, var(--accent), var(--pink)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    .hero-sub {
      font-size: clamp(16px, 2.5vw, 20px);
      color: #94a3b8; max-width: 560px;
      line-height: 1.7; margin-bottom: 40px;
      animation: fadeInUp 0.6s ease 0.4s both;
    }

    .hero-btns {
      display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
      animation: fadeInUp 0.6s ease 0.6s both;
    }
    .btn {
      padding: 14px 32px; border-radius: 10px; font-weight: 700;
      font-size: 15px; text-decoration: none; cursor: pointer;
      border: none; transition: all 0.25s ease; display: inline-flex;
      align-items: center; gap: 8px;
    }
    .btn-primary {
      background: var(--primary); color: white;
      animation: pulse-ring 3s ease infinite 2s;
    }
    .btn-primary:hover { background: var(--primary-dark); transform: translateY(-3px); box-shadow: 0 12px 32px rgba(99,102,241,0.4); }
    .btn-outline { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(8px); }
    .btn-outline:hover { background: rgba(255,255,255,0.1); transform: translateY(-3px); }

    /* ══ SECTION BASE ═══════════════════════════════════════ */
    .section { padding: 96px 24px; max-width: 1100px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 60px; }
    .section-header h2 { font-size: clamp(28px, 4vw, 42px); font-weight: 800; color: white; margin-bottom: 12px; }
    .section-header p { color: var(--muted); font-size: 17px; }

    /* ══ STATS ══════════════════════════════════════════════ */
    .stats {
      background: var(--bg2);
      border-top: 1px solid rgba(99,102,241,0.1);
      border-bottom: 1px solid rgba(99,102,241,0.1);
      padding: 40px 24px;
    }
    .stats-grid {
      max-width: 800px; margin: 0 auto;
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 20px; text-align: center;
    }
    .stat-item { animation: scaleIn 0.5s ease both; }
    .stat-item:nth-child(1) { animation-delay: 0.1s; }
    .stat-item:nth-child(2) { animation-delay: 0.2s; }
    .stat-item:nth-child(3) { animation-delay: 0.3s; }
    .stat-item:nth-child(4) { animation-delay: 0.4s; }
    .stat-num { font-size: 36px; font-weight: 800; color: var(--accent); }
    .stat-label { font-size: 13px; color: var(--muted); margin-top: 4px; }

    /* ══ FEATURE CARDS ══════════════════════════════════════ */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
    }
    .feature-card {
      background: var(--bg2);
      border: 1px solid rgba(99,102,241,0.1);
      border-radius: 20px; padding: 32px 24px;
      text-align: center;
      transition: all 0.3s ease;
      opacity: 0; transform: translateY(30px);
    }
    .feature-card.visible {
      animation: slideUp 0.6s ease forwards;
    }
    .feature-card:nth-child(1).visible { animation-delay: 0.1s; }
    .feature-card:nth-child(2).visible { animation-delay: 0.2s; }
    .feature-card:nth-child(3).visible { animation-delay: 0.3s; }
    .feature-card:nth-child(4).visible { animation-delay: 0.4s; }
    .feature-card:hover {
      border-color: rgba(99,102,241,0.4);
      transform: translateY(-8px);
      box-shadow: 0 24px 48px rgba(99,102,241,0.15);
    }
    .feature-icon { font-size: 44px; margin-bottom: 16px; display: block; animation: float 6s ease infinite; }
    .feature-card h3 { font-size: 18px; font-weight: 700; color: white; margin-bottom: 10px; }
    .feature-card p  { color: var(--muted); font-size: 14px; line-height: 1.6; }

    /* ══ FOOTER ══════════════════════════════════════════════ */
    footer {
      background: #020617;
      border-top: 1px solid rgba(99,102,241,0.1);
      padding: 40px 24px;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 16px;
    }
    footer p { color: var(--muted); font-size: 14px; }
    .footer-links { display: flex; gap: 24px; }
    .footer-links a { color: var(--muted); text-decoration: none; font-size: 14px; transition: color 0.2s; }
    .footer-links a:hover { color: var(--accent); }

    /* ══ RESPONSIVE ══════════════════════════════════════════ */
    @media (max-width: 640px) {
      .nav-links, .nav-cta { display: none; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
</head>
<body>

  <nav>
    <div class="logo">Study<span>Earn</span> AI</div>
    <ul class="nav-links">
      <li><a href="#features" class="nav-link">Features</a></li>
      <li><a href="#stats" class="nav-link">Stats</a></li>
      <li><a href="#cta" class="nav-link">Get Started</a></li>
    </ul>
    <a href="#" class="nav-cta">Sign Up Free →</a>
  </nav>

  <section class="hero">
    <span class="float-icon fi1">🐍</span>
    <span class="float-icon fi2">⚡</span>
    <span class="float-icon fi3">🌐</span>
    <span class="float-icon fi4">⚛️</span>
    <span class="float-icon fi5">🎨</span>

    <div class="hero-tag">
      <span class="dot"></span>
      ✨ Beta Launch — Join 500+ Students
    </div>

    <h1 class="hero-title">
      Code Seekho.<br>
      <span class="grad">Pro Bano. Earn Karo.</span>
    </h1>

    <p class="hero-sub">
      Gamified, AI-powered aur 100% free. 3 mahine mein noob se pro.
      Certificate bhi milega!
    </p>

    <div class="hero-btns">
      <a href="#" class="btn btn-primary">🚀 Start for Free</a>
      <a href="#features" class="btn btn-outline">✨ See Features</a>
    </div>
  </section>

  <div class="stats" id="stats">
    <div class="stats-grid">
      <div class="stat-item"><div class="stat-num">500+</div><div class="stat-label">Students</div></div>
      <div class="stat-item"><div class="stat-num">5</div><div class="stat-label">Languages</div></div>
      <div class="stat-item"><div class="stat-num">48+</div><div class="stat-label">Sections</div></div>
      <div class="stat-item"><div class="stat-num">100%</div><div class="stat-label">Free</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-header" id="features">
      <h2>Kyun StudyEarn?</h2>
      <p>Hamare platform ke unique features</p>
    </div>
    <div class="features-grid">
      <div class="feature-card">
        <span class="feature-icon">🤖</span>
        <h3>AI Hints</h3>
        <p>Groq AI se instant hints aur explanations — kabhi stuck mat raho!</p>
      </div>
      <div class="feature-card">
        <span class="feature-icon">💻</span>
        <h3>Live Editor</h3>
        <p>Browser mein seedha code likho aur instantly run karo.</p>
      </div>
      <div class="feature-card">
        <span class="feature-icon">🎮</span>
        <h3>Gamified</h3>
        <p>XP, streaks, badges — coding ko game ki tarah fun banao!</p>
      </div>
      <div class="feature-card">
        <span class="feature-icon">🎓</span>
        <h3>Certificate</h3>
        <p>Course complete karo, sharable certificate pao!</p>
      </div>
    </div>
  </div>

  <footer>
    <p>&copy; 2024 StudyEarn AI | Made with ❤️ + CSS Animations</p>
    <div class="footer-links">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Contact</a>
    </div>
  </footer>

  <script>
    // Scroll-triggered animations
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.feature-card').forEach(el => observer.observe(el));
  </script>

</body>
</html>`,
      codeExample_en: `<!-- Same code works in English too — see above for the complete demo -->`,
      task: {
        description: 'Apni pichli portfolio website ko fully animated banao. Sab animations include karo: animated gradient hero, staggered card appearance, scroll-triggered visibility, hover transitions on every interactive element, image zoom on project cards, form input focus effects, nav underline animation. Bonus: ek loading screen banao (1-2 second shimmer) jo then fade out ho jaaye.',
        description_en: 'Make your previous portfolio website fully animated. Include all animations: animated gradient hero, staggered card appearance, scroll-triggered visibility, hover transitions on every interactive element, image zoom on project cards, form input focus effects, nav underline animation. Bonus: build a loading screen (1-2 second shimmer) that then fades out.',
        hint: 'Loading screen: ek full-page div banao id="loader", CSS mein opacity: 1 + transition, JS mein setTimeout(() => { loader.style.opacity = "0"; setTimeout(() => loader.remove(), 500); }, 1500). Intersection Observer feature cards ke liye use karo.',
        hint_en: 'Loading screen: create a full-page div id="loader", CSS: opacity: 1 + transition, JS: setTimeout(() => { loader.style.opacity = "0"; setTimeout(() => loader.remove(), 500); }, 1500). Use Intersection Observer for feature cards.',
      },
      quiz: [
        {
          q: 'Intersection Observer kab use karte hain?',
          options: ['Hamesha', 'Scroll-triggered animations ke liye — jab element viewport mein aaye toh animation play karo', 'Click events ke liye', 'Form validation ke liye'],
          correct: 1,
          explanation: 'Intersection Observer browser API hai jo batata hai kab koi element viewport mein enter/exit karta hai — perfect for scroll animations bina expensive scroll event listeners ke.',
          q_en: 'When do you use Intersection Observer?',
          options_en: ['Always', 'For scroll-triggered animations — play animation when element enters the viewport', 'For click events', 'For form validation'],
          explanation_en: 'Intersection Observer is a browser API that tells you when an element enters or exits the viewport — perfect for scroll animations without expensive scroll event listeners.',
        },
        {
          q: 'animation: fadeIn 0.5s ease 0.3s both; mein "both" kya karta hai?',
          options: ['Dono directions animate karta hai', 'fill-mode: both — delay se pehle backwards state maintain, khatam hone ke baad forwards state', 'Dono elements animate karta hai', 'Loop karta hai'],
          correct: 1,
          explanation: '"both" = backwards + forwards. Backwards: delay ke dauran element initial keyframe (from) state mein rahega. Forwards: animation khatam hone ke baad final keyframe (to) state mein rahega.',
          q_en: 'What does "both" do in animation: fadeIn 0.5s ease 0.3s both;?',
          options_en: ['Animates in both directions', 'fill-mode: both — maintains backwards state during delay and forwards state after completion', 'Animates both elements', 'Loops the animation'],
          explanation_en: '"both" = backwards + forwards. Backwards: during the delay, the element stays in the initial keyframe (from) state. Forwards: after completion, it stays in the final (to) state.',
        },
        {
          q: 'backdrop-filter: blur() use karne se pehle kya ensure karna hai?',
          options: ['Kuch nahi', 'Element ka background transparent ya semi-transparent hona chahiye — nahi toh blur effect nahi dikhega', 'Fixed width chahiye', 'JavaScript zaruri hai'],
          correct: 1,
          explanation: 'backdrop-filter element ke BEHIND wale content ko blur karta hai. Agar element ka background opaque (solid color) hai toh blur effect show nahi hoga kyunki behind ka content visible hi nahi hai.',
          q_en: 'What must you ensure before using backdrop-filter: blur()?',
          options_en: ['Nothing', 'The element background must be transparent or semi-transparent — otherwise the blur effect will not be visible', 'A fixed width is needed', 'JavaScript is required'],
          explanation_en: 'backdrop-filter blurs the content BEHIND the element. If the element has an opaque (solid colour) background, the blur effect will not show because the content behind is not visible.',
        },
      ],
    },
  ],
};