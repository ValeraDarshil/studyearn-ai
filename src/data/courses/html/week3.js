/**
 * HTML Course — Week 3: HTML5 APIs aur Advanced Features
 */

export const HTML_WEEK_3 = {
  week: 3,
  title: 'HTML5 Advanced — Modern Web Features',
  description: 'HTML5 ke powerful features — multimedia, canvas, storage, aur more!',
  xpReward: 140,
  sections: [
    {
      id: 'html-w3-s1',
      title: 'Multimedia — Audio aur Video',
      emoji: '🎬',
      content: `## HTML5 Multimedia — Audio aur Video Native Support!

Pehle websites pe audio/video chalane ke liye Flash plugin chahiye hota tha. HTML5 ne yeh sab built-in kar diya!

### Video Tag

\`\`\`html
<!-- Basic video -->
<video src="myvideo.mp4" controls width="640" height="360">
  <p>Tera browser video support nahi karta.</p>
</video>

<!-- Multiple formats (compatibility ke liye) -->
<video width="640" height="360" controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <source src="video.ogg" type="video/ogg">
  Your browser does not support video.
</video>
\`\`\`

### Video Attributes:

\`\`\`html
<video
  src="demo.mp4"
  controls        <!-- Play/pause/volume buttons show karo -->
  autoplay        <!-- Page load hote hi play shuru -->
  muted           <!-- Sound band (autoplay ke saath zaroori) -->
  loop            <!-- Khatam hone pe dobara chalao -->
  poster="thumbnail.jpg"  <!-- Video load hone se pehle image -->
  width="800"
  preload="auto"  <!-- auto / metadata / none -->
>
</video>
\`\`\`

### Audio Tag

\`\`\`html
<!-- Basic audio -->
<audio src="song.mp3" controls>
  Browser audio support nahi karta.
</audio>

<!-- Multiple sources + attributes -->
<audio controls loop>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
</audio>
\`\`\`

### YouTube Video Embed

\`\`\`html
<!-- YouTube ya koi bhi website embed karo -->
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="YouTube video"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write;
         encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>
\`\`\`

### Responsive Video (size ke saath adjust ho)

\`\`\`html
<!-- width: 100% se video container ke saath fit hoga -->
<video src="video.mp4" controls style="width: 100%; max-width: 800px;">
</video>
\`\`\`

### Picture Tag — Responsive Images

\`\`\`html
<!-- Different images for different screen sizes -->
<picture>
  <!-- Mobile pe chhoti image -->
  <source media="(max-width: 600px)" srcset="small.jpg">
  <!-- Tablet pe medium image -->
  <source media="(max-width: 1200px)" srcset="medium.jpg">
  <!-- Default (desktop) -->
  <img src="large.jpg" alt="Beautiful landscape">
</picture>
\`\`\`

### Track — Subtitles aur Captions

\`\`\`html
<video controls>
  <source src="movie.mp4" type="video/mp4">
  <track
    kind="subtitles"
    src="subtitles_en.vtt"
    srclang="en"
    label="English"
    default
  >
  <track
    kind="subtitles"
    src="subtitles_hi.vtt"
    srclang="hi"
    label="Hindi"
  >
</video>
\`\`\``,

      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Media Demo Page</title>
</head>
<body>
  <h1>🎬 HTML5 Multimedia Demo</h1>

  <section>
    <h2>Embedded YouTube Video</h2>
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="YouTube video player"
      frameborder="0"
      allow="autoplay; encrypted-media; fullscreen"
      allowfullscreen
    ></iframe>
  </section>

  <section>
    <h2>Online Audio</h2>
    <p>Browser ka built-in audio player:</p>
    <audio controls>
      <source
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        type="audio/mpeg"
      >
      Tera browser audio support nahi karta.
    </audio>
  </section>

  <section>
    <h2>Responsive Images</h2>
    <picture>
      <source
        media="(min-width: 800px)"
        srcset="https://picsum.photos/800/400"
      >
      <img
        src="https://picsum.photos/400/300"
        alt="Responsive image example"
        style="max-width: 100%"
      >
    </picture>
    <p><em>Screen size ke hisaab se alag image load hogi!</em></p>
  </section>

  <section>
    <h2>Image with Figure</h2>
    <figure>
      <img
        src="https://picsum.photos/600/300"
        alt="Demo image"
        width="600"
      >
      <figcaption>
        Fig 1: Placeholder image from picsum.photos
      </figcaption>
    </figure>
  </section>
</body>
</html>`,

      task: {
        description: 'Ek "Media Gallery" webpage banao. Ismein hona chahiye: (1) Ek YouTube video embedded (apna favourite video), (2) Ek audio player online audio URL se, (3) 4 images responsive layout mein (picsum.photos use kar sakte ho), (4) Har image ke saath proper alt text aur figcaption, (5) Ek section mein kisi bhi doosri website ka iframe embed karo (Wikipedia, Google Maps, etc.), (6) Proper semantic structure (header, main, sections, footer).',
        hint: 'YouTube embed URL: youtube.com/embed/VIDEO_ID (watch?v= wali URL ko embed/ se replace karo). Google Maps bhi iframe se embed ho sakta hai — Google Maps open karo, Share → Embed karo.',
      },
      quiz: [
        {
          q: 'Video mein autoplay use karne ke saath kounsa attribute zaroori hai?',
          options: ['controls', 'muted', 'loop', 'poster'],
          correct: 1,
          explanation: 'Browsers autoplay tab allow karte hain jab video muted ho. muted attribute add karo warna browser autoplay block kar dega.',
        },
        {
          q: '<source> tag video mein multiple baar kyun use karte hain?',
          options: ['Speed badhane ke liye', 'Different browsers alag video formats support karte hain — fallback ke liye', 'Quality improve karne ke liye', 'Size compress karne ke liye'],
          correct: 1,
          explanation: 'Chrome MP4 prefer karta hai, Firefox OGG bhi support karta hai. Multiple <source> tags deke browser apne supported format choose kar sakta hai.',
        },
        {
          q: '<picture> tag ka main use kya hai?',
          options: ['Images style karna', 'Alag screen sizes ke liye alag images serve karna', 'Multiple images ek saath dikhana', 'Images animate karna'],
          correct: 1,
          explanation: '<picture> responsive images ke liye hai — mobile pe chhoti file, desktop pe badi. Performance optimize hoti hai.',
        },
      ],
    },

    {
      id: 'html-w3-s2',
      title: 'HTML5 APIs — Storage, Geolocation aur More',
      emoji: '⚡',
      content: `## HTML5 APIs — Browser ki Superpowers!

HTML5 ne browsers ko bahut saari new capabilities di hain. Ye APIs JavaScript se use hoti hain, but HTML setup zaruri hai.

### Local Storage — Data Browser mein Save Karo

\`\`\`html
<!DOCTYPE html>
<html>
<body>
  <h2>Name Saver</h2>
  <input type="text" id="nameInput" placeholder="Apna naam">
  <button onclick="saveName()">Save</button>
  <button onclick="loadName()">Load</button>
  <p id="output"></p>

  <script>
    function saveName() {
      const name = document.getElementById('nameInput').value;
      localStorage.setItem('userName', name);
      alert('Naam save ho gaya!');
    }

    function loadName() {
      const name = localStorage.getItem('userName');
      if (name) {
        document.getElementById('output').textContent =
          'Saved naam: ' + name;
      } else {
        document.getElementById('output').textContent =
          'Koi naam save nahi hua abhi tak';
      }
    }
  </script>
</body>
</html>
\`\`\`

### Geolocation — User ki Location

\`\`\`html
<button onclick="getLocation()">Meri Location Batao</button>
<p id="location">...</p>

<script>
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          document.getElementById('location').innerHTML =
            'Latitude: ' + position.coords.latitude + '<br>' +
            'Longitude: ' + position.coords.longitude;
        },
        function(error) {
          document.getElementById('location').textContent =
            'Location access denied: ' + error.message;
        }
      );
    } else {
      document.getElementById('location').textContent =
        'Geolocation supported nahi hai is browser mein';
    }
  }
</script>
\`\`\`

### Canvas — Drawing in Browser

\`\`\`html
<canvas id="myCanvas" width="400" height="200"
  style="border: 1px solid black;">
</canvas>

<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  // Rectangle
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(10, 10, 150, 100);

  // Circle
  ctx.beginPath();
  ctx.arc(300, 100, 60, 0, 2 * Math.PI);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();

  // Text
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Hello Canvas!', 30, 60);

  // Line
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.lineTo(400, 0);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke();
</script>
\`\`\`

### Drag and Drop

\`\`\`html
<!-- Draggable element -->
<div id="dragItem"
     draggable="true"
     ondragstart="drag(event)"
     style="width:100px; background:violet; padding:10px; cursor:grab">
  Drag me! 🎯
</div>

<!-- Drop zone -->
<div id="dropZone"
     ondrop="drop(event)"
     ondragover="allowDrop(event)"
     style="width:300px; height:150px; border:2px dashed gray; margin-top:20px">
  Drop here 📥
</div>

<script>
  function allowDrop(ev) { ev.preventDefault(); }
  function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }
  function drop(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(id));
  }
</script>
\`\`\`

### Form Validation API

\`\`\`html
<form id="myForm">
  <input type="email" id="email" required
    oninvalid="this.setCustomValidity('Valid email chahiye!')"
    oninput="this.setCustomValidity('')"
  >
  <input type="password" id="pass" minlength="8" required>
  <button type="submit">Submit</button>
</form>
\`\`\``,

      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HTML5 APIs Demo</title>
</head>
<body>
  <h1>⚡ HTML5 APIs Demo</h1>

  <section>
    <h2>📦 Local Storage — Theme Saver</h2>
    <button onclick="setTheme('light')">☀️ Light Mode</button>
    <button onclick="setTheme('dark')">🌙 Dark Mode</button>
    <p id="themeStatus">Current theme: none saved</p>
  </section>

  <section>
    <h2>🎨 Canvas Drawing</h2>
    <canvas id="myCanvas" width="500" height="200"
      style="border: 2px solid #6366f1; border-radius: 8px;">
    </canvas>
    <br>
    <button onclick="drawShapes()">Draw Shapes!</button>
    <button onclick="clearCanvas()">Clear</button>
  </section>

  <section>
    <h2>🎯 Drag and Drop</h2>
    <div style="display:flex; gap:20px; align-items:flex-start">
      <div>
        <p>Drag these:</p>
        <div draggable="true" ondragstart="drag(event)"
             id="item1" style="background:#6366f1; color:white;
             padding:12px; margin:5px; cursor:grab; border-radius:6px">
          🐍 Python
        </div>
        <div draggable="true" ondragstart="drag(event)"
             id="item2" style="background:#f59e0b; color:white;
             padding:12px; margin:5px; cursor:grab; border-radius:6px">
          🌐 HTML
        </div>
      </div>
      <div ondrop="drop(event)" ondragover="allowDrop(event)"
           style="width:200px; min-height:120px; border:3px dashed #ccc;
           border-radius:8px; padding:10px">
        <p style="color:#ccc">Drop here 📥</p>
      </div>
    </div>
  </section>

  <script>
    // Local Storage
    function setTheme(theme) {
      localStorage.setItem('theme', theme);
      document.getElementById('themeStatus').textContent =
        'Theme saved: ' + theme;
    }
    const saved = localStorage.getItem('theme');
    if (saved) document.getElementById('themeStatus').textContent =
      'Saved theme: ' + saved;

    // Canvas
    function drawShapes() {
      const canvas = document.getElementById('myCanvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(20, 20, 150, 80);
      ctx.beginPath();
      ctx.arc(280, 100, 70, 0, 2 * Math.PI);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('HTML5 Canvas!', 30, 65);
    }
    function clearCanvas() {
      const canvas = document.getElementById('myCanvas');
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }

    // Drag & Drop
    function allowDrop(ev) { ev.preventDefault(); }
    function drag(ev) {
      ev.dataTransfer.setData('text', ev.target.id);
    }
    function drop(ev) {
      ev.preventDefault();
      const id = ev.dataTransfer.getData('text');
      ev.target.appendChild(document.getElementById(id));
    }
  </script>
</body>
</html>`,

      task: {
        description: 'Ek "Mini Todo App" banao HTML5 APIs use karke: (1) Input + button se todo items add ho, (2) Har todo ke saath delete button, (3) Todos localStorage mein save hon (page reload karne pe bhi rahe), (4) Canvas pe top mein ek simple banner draw karo (text + colored rectangle), (5) Total todos count dikhao. Note: JavaScript use karo HTML ke saath — it is okay, HTML5 APIs JS se hi use hoti hain!',
        hint: 'localStorage.setItem("todos", JSON.stringify(todosArray)) se array save karo. JSON.parse(localStorage.getItem("todos")) se load karo. Page load hone pe todos load karo.',
      },
      quiz: [
        {
          q: 'localStorage aur sessionStorage mein kya fark hai?',
          options: ['Koi fark nahi', 'localStorage permanently save karta hai (tab close karne pe bhi), sessionStorage tab close hone pe delete ho jaata hai', 'sessionStorage zyada data store kar sakta hai', 'localStorage sirf numbers store karta hai'],
          correct: 1,
          explanation: 'localStorage = permanent (jab tak user manually clear na kare). sessionStorage = sirf us browser session tak (tab/window close = data gone).',
        },
        {
          q: 'Canvas pe drawing ke liye kya use karte hain?',
          options: ['canvas.draw()', 'canvas.getContext("2d") se ek context object milta hai jisse draw karte hain', 'canvas.paint()', 'canvas.render()'],
          correct: 1,
          explanation: 'const ctx = canvas.getContext("2d") 2D drawing context deta hai. Phir ctx.fillRect(), ctx.arc(), ctx.fillText() etc. use karte hain.',
        },
        {
          q: 'Geolocation API use karne ke liye kya zaruri hai?',
          options: ['Kuch nahi', 'User ka permission (browser popup mein allow karna)', 'HTTPS connection', 'Both B and C'],
          correct: 3,
          explanation: 'Geolocation ke liye user ka explicit permission ZARURI hai (browser popup). Aur production mein HTTPS required hai security ke liye.',
        },
      ],
    },

    {
      id: 'html-w3-s3',
      title: 'Meta Tags aur SEO — Google pe Rank Karo',
      emoji: '🔍',
      content: `## Meta Tags — Page ke Baare mein Information!

Meta tags browser aur search engines ko page ke baare mein information dete hain. User inhe directly nahi dekhta, but yeh BAHUT important hain!

### Essential Meta Tags

\`\`\`html
<head>
  <!-- Character encoding — emojis aur special chars ke liye zaruri -->
  <meta charset="UTF-8">

  <!-- Responsive design ke liye ZARURI -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Page ka description — Google search results mein dikhta hai -->
  <meta name="description"
    content="StudyEarn AI — gamified coding courses in Hindi & English.
    Learn Python, HTML, CSS, JavaScript with AI help. Free!">

  <!-- Keywords (aajkal Google zyada use nahi karta, but still add karo) -->
  <meta name="keywords"
    content="HTML tutorial, coding in Hindi, web development course,
    free coding, learn programming">

  <!-- Author -->
  <meta name="author" content="StudyEarn AI Team">

  <!-- Page ka title — SABSE IMPORTANT SEO FACTOR -->
  <title>HTML Basics — Free Course | StudyEarn AI</title>
</head>
\`\`\`

### Open Graph Tags — Social Media Sharing

Jab koi link WhatsApp/Facebook pe share kare toh sundar preview dikhata hai:

\`\`\`html
<head>
  <!-- Facebook, WhatsApp, LinkedIn ke liye -->
  <meta property="og:title" content="HTML Basics — StudyEarn AI">
  <meta property="og:description"
    content="Free HTML course in Hindi & English. AI-powered learning!">
  <meta property="og:image"
    content="https://studyearnai.tech/og-image.png">
  <meta property="og:url" content="https://studyearnai.tech/courses/html">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="StudyEarn AI">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="HTML Basics — StudyEarn AI">
  <meta name="twitter:description" content="Free HTML course!">
  <meta name="twitter:image" content="https://studyearnai.tech/og-image.png">
</head>
\`\`\`

### Favicon — Browser Tab Icon

\`\`\`html
<head>
  <!-- Basic favicon -->
  <link rel="icon" type="image/png" href="favicon.png">

  <!-- Different sizes -->
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">

  <!-- Apple devices ke liye -->
  <link rel="apple-touch-icon" sizes="180x180" href="apple-icon.png">
</head>
\`\`\`

### Robots Meta — Search Engine Control

\`\`\`html
<!-- Sab pages index karo (default) -->
<meta name="robots" content="index, follow">

<!-- Yeh page index mat karo -->
<meta name="robots" content="noindex, nofollow">

<!-- Sitemap link -->
<link rel="sitemap" type="application/xml" href="/sitemap.xml">

<!-- Canonical URL — duplicate content issue fix -->
<link rel="canonical" href="https://studyearnai.tech/html-course">
\`\`\`

### Complete SEO-Ready HTML Template

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Essential -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO -->
  <title>Best HTML Course Free | StudyEarn AI</title>
  <meta name="description" content="Learn HTML in Hindi & English.
    Gamified, AI-powered, free course. Certificate included!">
  <meta name="keywords" content="html course, html tutorial hindi">
  <meta name="author" content="StudyEarn AI">
  <meta name="robots" content="index, follow">

  <!-- Canonical -->
  <link rel="canonical" href="https://studyearnai.tech/html">

  <!-- Open Graph -->
  <meta property="og:title" content="Best HTML Course Free">
  <meta property="og:description" content="Learn HTML for free!">
  <meta property="og:image" content="/og-image.png">
  <meta property="og:url" content="https://studyearnai.tech/html">
  <meta property="og:type" content="website">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png">

</head>
<body>
  <!-- Content here -->
</body>
</html>
\`\`\`

### SEO Best Practices:
1. **Title tag** 50-60 characters mein rakho
2. **Description** 150-160 characters mein — compelling likho
3. **Ek hi H1** per page
4. **Images pe alt text** zaroor do
5. **Page load speed** fast rakho
6. **Mobile-friendly** design banao`,

      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ── Essential Meta Tags ── -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ── SEO Meta Tags ── -->
  <title>Meri Portfolio Website | Web Developer</title>
  <meta name="description"
    content="Rahul Kumar — passionate web developer from Mumbai.
    Specializing in HTML, CSS, JavaScript, and React.
    Available for freelance projects!">
  <meta name="keywords"
    content="web developer mumbai, html developer, freelance web designer">
  <meta name="author" content="Rahul Kumar">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://rahulkumar.dev">

  <!-- ── Open Graph (Social Sharing) ── -->
  <meta property="og:title" content="Rahul Kumar — Web Developer">
  <meta property="og:description"
    content="Passionate web developer building modern websites.">
  <meta property="og:image"
    content="https://rahulkumar.dev/profile-og.jpg">
  <meta property="og:url" content="https://rahulkumar.dev">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Rahul Kumar Portfolio">

  <!-- ── Twitter Card ── -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:creator" content="@rahulkumar">

  <!-- ── Favicon ── -->
  <link rel="icon" type="image/png" href="favicon.png">
</head>
<body>

  <header>
    <h1>Rahul Kumar</h1>
    <p>Web Developer | Mumbai, India</p>
  </header>

  <main>
    <section>
      <h2>About Me</h2>
      <p>Passionate about building beautiful, fast, accessible websites.
      Currently learning React and Node.js.</p>
    </section>

    <section>
      <h2>My Skills</h2>
      <ul>
        <li>HTML5 — Advanced</li>
        <li>CSS3 — Intermediate</li>
        <li>JavaScript — Intermediate</li>
      </ul>
    </section>
  </main>

  <footer>
    <p>&copy; 2024 Rahul Kumar</p>
  </footer>

</body>
</html>`,

      task: {
        description: 'Apni pichli bani website (resume ya portfolio) mein SEO optimize karo: (1) Proper title tag (50-60 chars, keyword include karo), (2) Meta description (150-160 chars, compelling), (3) Keywords meta tag (10-15 relevant keywords), (4) Sab meta tags add karo (charset, viewport, author, robots), (5) Open Graph tags add karo (title, description, image, url, type), (6) Twitter Card tags, (7) Google Search Preview simulate karo — ek section banao jo dikhaye "Google search mein kuch aisa dikhega:" aur title + URL + description show karo.',
        hint: 'Title tag 60 chars se chhota rakho — count karo! Description 160 chars se chhoti. og:image ke liye picsum.photos/1200/630 URL use kar sakte ho (standard OG image size).',
      },
      quiz: [
        {
          q: 'Meta description tag ka main purpose kya hai?',
          options: ['Page fast load hota hai', 'Google search results mein page ke neeche short description dikhti hai — click-through rate badhata hai', 'Images optimize hoti hain', 'Security improve hoti hai'],
          correct: 1,
          explanation: 'Meta description directly ranking improve nahi karta, but Google search result snippet mein dikhta hai — compelling description = zyada clicks!',
        },
        {
          q: 'Open Graph tags kab useful hote hain?',
          options: ['Search engine optimization ke liye', 'Jab koi link WhatsApp/Facebook/LinkedIn pe share kare toh sundar preview dikhane ke liye', 'Page speed ke liye', 'Images ke liye'],
          correct: 1,
          explanation: 'og:title, og:description, og:image — yeh social media pe link share karne pe preview card banate hain. Bina OG tags ke ugly bare URL dikhti hai.',
        },
        {
          q: 'Viewport meta tag kyun zaruri hai?',
          options: ['Desktop pe kaam karta hai', 'Mobile devices pe page sahi size mein dikhne ke liye zaroori hai', 'Animations ke liye', 'Fonts ke liye'],
          correct: 1,
          explanation: 'Bina viewport meta tag ke mobile pe page desktop size mein render hota hai — bahut chhota dikhta hai. width=device-width se page mobile screen width ke hisaab se adjust hota hai.',
        },
      ],
    },

    {
      id: 'html-w3-s4',
      title: 'Accessibility — Sabke Liye Web',
      emoji: '♿',
      content: `## Web Accessibility — Sabke Liye Design Karo!

Duniya mein ~1 billion log disabilities ke saath jeete hain. Accessible web design inka experience better banata hai — aur aapki website ka SEO bhi!

### ARIA Attributes — Assistive Technology ke Liye

\`\`\`html
<!-- aria-label — element ka description jab text nahi ho -->
<button aria-label="Search button">🔍</button>

<!-- aria-describedby — doosre element se description link karo -->
<input type="password" aria-describedby="pass-help">
<p id="pass-help">Password mein 8+ characters aur 1 number chahiye</p>

<!-- aria-hidden — screen readers se hide karo -->
<span aria-hidden="true">🎉</span>  <!-- Decorative emoji -->

<!-- role — element ka purpose batao -->
<div role="alert">⚠️ Important message!</div>
<div role="navigation">...</div>
<div role="main">...</div>

<!-- aria-expanded — dropdown open/close state -->
<button aria-expanded="false" aria-controls="dropdown">
  Menu ▼
</button>
<ul id="dropdown" hidden>...</ul>

<!-- aria-required — required field indicate karo -->
<input type="text" aria-required="true">

<!-- aria-invalid — error state -->
<input type="email" aria-invalid="true">
<span role="alert">Valid email address enter karo</span>
\`\`\`

### Skip Navigation Link

\`\`\`html
<!-- Page ke top pe — keyboard users navigation skip kar sakein -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<header>
  <nav>...long navigation...</nav>
</header>

<main id="main-content">
  <!-- Main content yahan -->
</main>
\`\`\`

### Keyboard Navigation

\`\`\`html
<!-- tabindex — keyboard Tab order control -->
<button tabindex="1">First focus</button>
<button tabindex="2">Second focus</button>
<button tabindex="0">Normal order</button>
<button tabindex="-1">Not focusable via Tab</button>

<!-- Focus visible styling (CSS zaruri) -->
<style>
  :focus {
    outline: 3px solid #6366f1;
    outline-offset: 2px;
  }
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #6366f1;
    color: white;
    padding: 8px;
    z-index: 100;
  }
  .skip-link:focus {
    top: 0;
  }
</style>
\`\`\`

### Color Contrast aur Visual

\`\`\`html
<!-- Sirf color pe depend mat karo -->

<!-- ❌ Bad: Sirf color se error indicate karna -->
<p style="color: red;">Error hua!</p>

<!-- ✅ Good: Color + icon + text -->
<p style="color: red;">
  ❌ <strong>Error:</strong> Password galat hai
</p>

<!-- Alt text har image pe -->
<img src="photo.jpg" alt="Rahul Kumar working on laptop">

<!-- Decorative images ka empty alt -->
<img src="decoration.png" alt="">
\`\`\`

### Accessible Forms

\`\`\`html
<form>
  <!-- ✅ Label har input se connected -->
  <label for="name">
    Full Name
    <span aria-hidden="true" style="color:red">*</span>
    <span class="sr-only">(required)</span>
  </label>
  <input
    type="text"
    id="name"
    name="name"
    required
    aria-required="true"
    autocomplete="name"
  >

  <!-- Error message accessible -->
  <div id="name-error" role="alert" aria-live="polite">
    <!-- JavaScript se error message yahan inject karo -->
  </div>

  <!-- Fieldset aur Legend grouped inputs ke liye -->
  <fieldset>
    <legend>Gender chunno:</legend>
    <input type="radio" id="m" name="gender" value="male">
    <label for="m">Male</label>
    <input type="radio" id="f" name="gender" value="female">
    <label for="f">Female</label>
  </fieldset>
</form>
\`\`\`

### Screen Reader Only Text

\`\`\`html
<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>

<!-- Screen readers padhenge, screen pe nahi dikhega -->
<span class="sr-only">Loading spinner</span>
<div class="spinner" aria-hidden="true"></div>
\`\`\`

### WCAG Guidelines (Web Content Accessibility Guidelines)

| Level | Meaning |
|-------|---------|
| A | Minimum accessibility |
| AA | Standard (most websites target this) |
| AAA | Highest level |

**Key requirements:**
- Text contrast ratio minimum 4.5:1 (normal text)
- All images must have alt text
- All form fields must have labels
- Keyboard navigable
- No flashing content (seizure risk)`,

      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessible Contact Form Demo</title>
  <style>
    /* Skip link */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: #6366f1;
      color: white;
      padding: 8px 16px;
      z-index: 100;
      text-decoration: none;
      border-radius: 0 0 4px 0;
    }
    .skip-link:focus { top: 0; }

    /* Focus visible */
    :focus {
      outline: 3px solid #6366f1;
      outline-offset: 2px;
    }

    /* Screen reader only */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
    }

    /* Error styling */
    .error { color: red; font-size: 0.875em; }
    input[aria-invalid="true"] { border: 2px solid red; }

    /* Form styling */
    form { max-width: 400px; }
    label { display: block; margin-top: 12px; font-weight: bold; }
    input, textarea, select {
      display: block;
      width: 100%;
      padding: 8px;
      margin-top: 4px;
    }
  </style>
</head>
<body>

  <!-- Skip navigation -->
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>

  <header>
    <h1>Accessible Demo Page</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content">

    <section id="contact">
      <h2>Contact Form</h2>

      <form novalidate
            onsubmit="validateForm(event)"
            aria-describedby="form-instructions">

        <p id="form-instructions">
          Fields marked with
          <span aria-hidden="true" style="color:red">*</span>
          <span class="sr-only">asterisk</span>
          are required.
        </p>

        <label for="fullname">
          Full Name
          <span aria-hidden="true" style="color:red"> *</span>
        </label>
        <input type="text" id="fullname" name="name"
               required aria-required="true"
               autocomplete="name"
               aria-describedby="name-error">
        <div id="name-error" class="error" role="alert"></div>

        <label for="email">
          Email Address
          <span aria-hidden="true" style="color:red"> *</span>
        </label>
        <input type="email" id="email" name="email"
               required aria-required="true"
               autocomplete="email"
               aria-describedby="email-error">
        <div id="email-error" class="error" role="alert"></div>

        <fieldset>
          <legend>How did you find us?</legend>
          <input type="radio" id="google" name="source" value="google">
          <label for="google">Google Search</label><br>
          <input type="radio" id="friend" name="source" value="friend">
          <label for="friend">Friend's Recommendation</label><br>
          <input type="radio" id="social" name="source" value="social">
          <label for="social">Social Media</label>
        </fieldset>

        <label for="message">Message</label>
        <textarea id="message" name="message" rows="4"
                  aria-describedby="char-count"></textarea>
        <span id="char-count" aria-live="polite"></span>

        <button type="submit">
          Send Message
          <span class="sr-only">(opens thank you page)</span>
        </button>

      </form>
    </section>

  </main>

  <footer>
    <p>&copy; 2024 | <a href="#">Privacy Policy</a></p>
  </footer>

  <script>
    // Character count for message
    document.getElementById('message').addEventListener('input', function() {
      const count = this.value.length;
      document.getElementById('char-count').textContent =
        count + ' characters typed';
    });

    // Simple validation
    function validateForm(e) {
      e.preventDefault();
      const name = document.getElementById('fullname');
      const email = document.getElementById('email');
      let isValid = true;

      if (!name.value.trim()) {
        document.getElementById('name-error').textContent = '❌ Naam required hai';
        name.setAttribute('aria-invalid', 'true');
        isValid = false;
      } else {
        document.getElementById('name-error').textContent = '';
        name.removeAttribute('aria-invalid');
      }

      if (!email.value.includes('@')) {
        document.getElementById('email-error').textContent = '❌ Valid email chahiye';
        email.setAttribute('aria-invalid', 'true');
        isValid = false;
      } else {
        document.getElementById('email-error').textContent = '';
        email.removeAttribute('aria-invalid');
      }

      if (isValid) alert('Form successfully submitted! ✅');
    }
  </script>

</body>
</html>`,

      task: {
        description: 'Apni resume webpage ko fully accessible banao: (1) Skip navigation link add karo, (2) Sab images pe meaningful alt text, (3) Har form field ka proper label with for attribute, (4) ARIA labels buttons pe jahan sirf icons hain, (5) lang="en" html tag pe, (6) Keyboard navigation test karo (Tab key se sab elements accessible hone chahiye), (7) Focus visible styling add karo (:focus ke liye outline), (8) Contact form mein fieldset + legend use karo radio buttons ke liye, (9) Ek "Screen reader test" section banao jisme .sr-only class use karo.',
        hint: ':focus { outline: 3px solid #6366f1; } CSS mein add karo. Skip link ke liye position: absolute; top: -40px; aur :focus pe top: 0 karo. aria-label="" buttons pe add karo jahan sirf emoji/icon hai.',
      },
      quiz: [
        {
          q: 'aria-label attribute kab use karte hain?',
          options: ['Har element pe', 'Jab element ka visible text nahi ho ya insufficient ho — screen readers ke liye description dena ho', 'Sirf images pe', 'Forms ke liye'],
          correct: 1,
          explanation: 'Icon-only buttons (🔍), logo images, close buttons (×) — inpe aria-label dena zaroori hai taaki screen reader users samjhein element kya karta hai.',
        },
        {
          q: 'Skip navigation link kyun use karte hain?',
          options: ['Visual design ke liye', 'Keyboard users ko har baar sara navigation traverse kiye bina main content pe jump karne ki suvidha deta hai', 'SEO ke liye', 'Mobile users ke liye'],
          correct: 1,
          explanation: 'Har page pe keyboard Tab se chalne waale users ko otherwise poora navigation traverse karna padta. Skip link se directly main content pe ja sakte hain.',
        },
        {
          q: 'WCAG 2.1 Level AA mein text color contrast ratio minimum kitna hona chahiye?',
          options: ['2:1', '3:1', '4.5:1', '7:1'],
          correct: 2,
          explanation: 'WCAG Level AA mein normal text ke liye 4.5:1 contrast ratio minimum required hai. Large text (18pt+) ke liye 3:1. Ye visually impaired users ke liye zaruri hai.',
        },
      ],
    },
  ],
};