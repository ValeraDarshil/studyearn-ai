/**
 * HTML Course — Week 4: Advanced Forms, iframes, aur Month 1 Project
 */

export const HTML_WEEK_4 = {
  week: 4,
  title: 'Advanced HTML aur Month 1 Project',
  description: 'Advanced form features, iframes, data attributes, aur complete project!',
  xpReward: 160,
  sections: [
    {
      id: 'html-w4-s1',
      title: 'Advanced Forms — Datalist, Progress, Meter',
      emoji: '🎛️',
      content: `## Advanced Form Elements — Browser ke Powerful Features!

### Datalist — Autocomplete with Custom Options

\`\`\`html
<!-- Datalist: input + dropdown suggestions ka combination -->
<label for="city">City:</label>
<input list="cities" id="city" name="city"
       placeholder="City type karo ya chunno">

<datalist id="cities">
  <option value="Mumbai">
  <option value="Delhi">
  <option value="Bangalore">
  <option value="Chennai">
  <option value="Kolkata">
  <option value="Hyderabad">
  <option value="Pune">
  <option value="Ahmedabad">
</datalist>
\`\`\`

User type karta hai → matching options dikhte hain. Free-form typing bhi allowed hai!

### Output Element — Calculation Result

\`\`\`html
<form oninput="result.value = parseInt(a.value) + parseInt(b.value)">
  <input type="number" id="a" value="0"> +
  <input type="number" id="b" value="0"> =
  <output name="result" for="a b">0</output>
</form>
\`\`\`

### Progress Bar

\`\`\`html
<!-- Progress bar — task completion dikhao -->
<label for="download">Download Progress:</label>
<progress id="download" max="100" value="65">65%</progress>

<!-- Indeterminate (unknown progress) -->
<progress id="loading">Loading...</progress>
\`\`\`

### Meter — Gauge/Level Indicator

\`\`\`html
<!-- Meter — specific range mein value dikhao -->
<label>Battery:</label>
<meter min="0" max="100" value="75" low="20" high="80" optimum="90">
  75%
</meter>

<label>Disk Space:</label>
<meter min="0" max="500" value="380" low="100" high="400" optimum="200">
  380GB used of 500GB
</meter>
\`\`\`

### Details aur Summary — Accordion

\`\`\`html
<details>
  <summary>Python kya hai? (Click karo)</summary>
  <p>Python ek high-level programming language hai jo...
  bahut easy hai seekhna aur use karna.</p>
</details>

<details>
  <summary>HTML aur CSS mein fark?</summary>
  <p>HTML structure deta hai, CSS styling deta hai.
  HTML = skeleton, CSS = kapde aur makeup!</p>
</details>

<details open>
  <!-- "open" attribute se default mein khula rahega -->
  <summary>Important Note</summary>
  <p>Yeh section default mein expand hoga!</p>
</details>
\`\`\`

### Dialog — Modal/Popup

\`\`\`html
<button onclick="document.getElementById('myDialog').showModal()">
  Open Dialog
</button>

<dialog id="myDialog">
  <h2>Confirm Action</h2>
  <p>Kya aap sure hain?</p>
  <button onclick="document.getElementById('myDialog').close()">
    Cancel
  </button>
  <button onclick="confirmAction()">Confirm</button>
</dialog>

<script>
  function confirmAction() {
    document.getElementById('myDialog').close();
    alert('Action confirmed!');
  }
</script>
\`\`\`

### Input Attributes

\`\`\`html
<!-- Pattern — regex validation -->
<input type="text" pattern="[0-9]{10}"
       title="10 digit phone number"
       placeholder="9876543210">

<!-- Autocomplete hints -->
<input type="text" autocomplete="name">
<input type="email" autocomplete="email">
<input type="tel" autocomplete="tel">
<input type="text" autocomplete="street-address">

<!-- Multiple files upload -->
<input type="file" multiple accept="image/*">

<!-- Capture — mobile camera directly -->
<input type="file" capture="camera" accept="image/*">
\`\`\``,

      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Advanced Form Elements</title>
</head>
<body>
  <h1>🎛️ Advanced Form Elements Demo</h1>

  <!-- Datalist -->
  <section>
    <h2>Datalist — Smart Autocomplete</h2>
    <label for="framework">Favourite Framework:</label>
    <input list="frameworks" id="framework"
           placeholder="Search or type...">
    <datalist id="frameworks">
      <option value="React">
      <option value="Vue.js">
      <option value="Angular">
      <option value="Svelte">
      <option value="Next.js">
      <option value="Django">
      <option value="Flask">
      <option value="FastAPI">
    </datalist>
  </section>

  <!-- Calculator with output -->
  <section>
    <h2>Live Calculator — Output Tag</h2>
    <form oninput="calc.value = (parseFloat(x.value||0) * parseFloat(y.value||0)).toFixed(2)">
      <input type="number" name="x" id="x" value="5" step="0.1">
      ×
      <input type="number" name="y" id="y" value="3" step="0.1">
      = <output name="calc" for="x y">15.00</output>
    </form>
  </section>

  <!-- Progress bars -->
  <section>
    <h2>Progress Bars</h2>
    <p>HTML Skills:
      <progress max="100" value="85">85%</progress> 85%
    </p>
    <p>CSS Skills:
      <progress max="100" value="60">60%</progress> 60%
    </p>
    <p>JavaScript:
      <progress max="100" value="40">40%</progress> 40%
    </p>
  </section>

  <!-- Meter -->
  <section>
    <h2>Meter — Gauge Indicator</h2>
    <p>Storage Used:
      <meter min="0" max="100" value="73"
             low="60" high="85" optimum="30">73%</meter>
      73/100 GB
    </p>
  </section>

  <!-- Details/Summary -->
  <section>
    <h2>FAQ — Details/Summary</h2>
    <details>
      <summary>HTML seekhne mein kitna time lagta hai?</summary>
      <p>Basic HTML 2-3 weeks mein seekha ja sakta hai.
      Professional level ke liye 2-3 months practice chahiye.</p>
    </details>
    <details>
      <summary>HTML aur HTML5 mein kya fark hai?</summary>
      <p>HTML5 latest version hai jisme video, audio, canvas,
      localStorage, geolocation jaise features added hain.</p>
    </details>
    <details open>
      <summary>⚡ Pro Tip (expand karke dekho!)</summary>
      <p>Browser DevTools (F12) mein HTML inspect karo —
      kisi bhi website ka code dekh sakte ho!</p>
    </details>
  </section>

  <!-- Dialog -->
  <section>
    <h2>Dialog — Modal Popup</h2>
    <button onclick="document.getElementById('demo').showModal()">
      Open Modal Dialog
    </button>
    <dialog id="demo">
      <h3>🎉 Dialog Element</h3>
      <p>Yeh HTML5 native dialog hai! No JavaScript library needed.</p>
      <button onclick="document.getElementById('demo').close()">
        Close
      </button>
    </dialog>
  </section>
</body>
</html>`,

      task: {
        description: 'Ek "Course Registration" advanced form banao. Ismein hona chahiye: (1) Datalist for course selection (10 courses), (2) Fee calculator with output tag (course_fee × discount = final_price), (3) Progress bar dikhao "Profile Completion" (fields fill hone pe dynamically update ho), (4) FAQ section mein 5 questions using details/summary, (5) Confirmation dialog before form submit, (6) Pattern validation phone number ke liye, (7) Multiple file upload for documents.',
        hint: 'Progress bar update: form ke har field ka oninput event listen karo. Filled fields count karo aur progress.value = (filled/total * 100) set karo. Dialog ke liye document.getElementById("id").showModal() aur .close() use karo.',
      },
      quiz: [
        {
          q: '<datalist> aur <select> mein kya fark hai?',
          options: ['Koi fark nahi', '<datalist> free-form typing bhi allow karta hai + suggestions deta hai, <select> sirf listed options', '<select> zyada options de sakta hai', '<datalist> required attribute support nahi karta'],
          correct: 1,
          explanation: '<select> mein sirf predefined options choose kar sakte ho. <datalist> mein suggestions deta hai but user kuch bhi type kar sakta hai — hybrid approach!',
        },
        {
          q: '<progress> aur <meter> mein kya fark hai?',
          options: ['Koi fark nahi', '<progress> task completion dikhata hai (0 se max), <meter> known range mein scalar measurement', '<meter> animated hota hai', '<progress> text show karta hai'],
          correct: 1,
          explanation: '<progress> = task ke liye (download, form completion). <meter> = specific range mein value (battery, disk space, score). Meter mein low/high/optimum attributes hain.',
        },
        {
          q: '<details> element ka default behavior kya hai?',
          options: ['Default mein expand hota hai', 'Default mein collapsed hota hai — click pe expand', 'JavaScript zaruri hai', 'Sirf text show karta hai'],
          correct: 1,
          explanation: '<details> default mein closed hota hai — sirf <summary> dikhti hai. Click karne pe content expand hota hai. "open" attribute se default expand kar sakte ho.',
        },
      ],
    },

    {
      id: 'html-w4-s2',
      title: 'Iframes aur Embedding — Doosri Websites Include Karo',
      emoji: '🪟',
      content: `## Iframes — Window Within a Window!

Iframe (Inline Frame) se tum ek webpage ke andar doosri website ya page embed kar sakte ho.

### Basic Iframe

\`\`\`html
<iframe
  src="https://www.wikipedia.org"
  width="800"
  height="500"
  title="Wikipedia"
>
  Tera browser iframe support nahi karta.
</iframe>
\`\`\`

### Iframe Attributes

\`\`\`html
<iframe
  src="page.html"
  width="100%"          <!-- Percentage ya pixels -->
  height="400"
  title="Description"   <!-- Accessibility ke liye ZARURI -->
  frameborder="0"       <!-- Border hata do -->
  scrolling="no"        <!-- Scroll bar control -->
  allow="camera; microphone; geolocation"  <!-- Permissions -->
  allowfullscreen       <!-- Fullscreen allow karo -->
  sandbox               <!-- Security restrictions -->
  loading="lazy"        <!-- Lazy load -->
>
</iframe>
\`\`\`

### Common Embeds

\`\`\`html
<!-- YouTube Video -->
<iframe
  width="560" height="315"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="YouTube video"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; fullscreen"
  allowfullscreen
></iframe>

<!-- Google Maps -->
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!..."
  width="600" height="450"
  style="border:0"
  title="Location Map"
  loading="lazy"
></iframe>

<!-- CodePen -->
<iframe
  height="300"
  src="https://codepen.io/username/embed/abc123"
  title="CodePen Demo"
  frameborder="0"
></iframe>

<!-- Google Forms -->
<iframe
  src="https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true"
  width="640" height="800"
  frameborder="0"
  title="Google Form"
></iframe>
\`\`\`

### Sandbox Attribute — Security

\`\`\`html
<!-- Bina sandbox — iframe sab kuch kar sakta hai -->
<iframe src="untrusted.html"></iframe>

<!-- Sandbox — sirf specific things allow karo -->
<iframe
  src="untrusted.html"
  sandbox="allow-scripts allow-forms"
>
</iframe>

<!-- sandbox values:
  allow-scripts     — JavaScript allow karo
  allow-forms       — Forms submit allow karo
  allow-same-origin — Same origin access allow
  allow-popups      — Popups allow karo
  allow-top-navigation — Parent page navigate allow
  (empty sandbox = sab kuch block)
-->
\`\`\`

### Responsive Iframes

\`\`\`html
<!-- 16:9 aspect ratio maintain karo -->
<style>
  .video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 ratio */
    height: 0;
    overflow: hidden;
  }
  .video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>

<div class="video-container">
  <iframe
    src="https://www.youtube.com/embed/VIDEO_ID"
    title="Video Title"
    frameborder="0"
    allowfullscreen
  ></iframe>
</div>
\`\`\`

### Data Attributes — Custom HTML Attributes

\`\`\`html
<!-- data-* attributes se custom data store karo -->
<div
  data-user-id="12345"
  data-role="admin"
  data-created="2024-03-15"
>
  User Card
</div>

<!-- JavaScript se access karo -->
<script>
  const div = document.querySelector('div');
  console.log(div.dataset.userId);  // "12345"
  console.log(div.dataset.role);    // "admin"

  // Set bhi kar sakte ho
  div.dataset.status = 'active';
</script>

<!-- Practical example — product cards -->
<div class="product-card"
     data-product-id="P001"
     data-price="999"
     data-category="electronics"
     onclick="addToCart(this)">
  <h3>Laptop</h3>
  <p>₹999</p>
</div>

<script>
  function addToCart(element) {
    const id = element.dataset.productId;
    const price = element.dataset.price;
    const category = element.dataset.category;
    console.log('Added to cart:', id, price, category);
  }
</script>
\`\`\``,

      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Iframe aur Data Attributes Demo</title>
  <style>
    .video-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      max-width: 600px;
    }
    .video-container iframe {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
    }
    .card {
      border: 1px solid #ccc;
      padding: 16px;
      margin: 8px;
      cursor: pointer;
      display: inline-block;
      border-radius: 8px;
    }
    .card:hover { background: #f0f0f0; }
  </style>
</head>
<body>

  <h1>🪟 Iframes aur Data Attributes</h1>

  <section>
    <h2>YouTube Embed (Responsive)</h2>
    <div class="video-container">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </section>

  <section>
    <h2>Data Attributes — Product Cards</h2>
    <p>Kisi bhi card pe click karo:</p>

    <div class="card"
         data-product-id="P001"
         data-name="Python Course"
         data-price="free"
         data-level="beginner"
         onclick="showInfo(this)">
      <h3>🐍 Python Course</h3>
      <p>Beginner Friendly</p>
    </div>

    <div class="card"
         data-product-id="P002"
         data-name="HTML Course"
         data-price="free"
         data-level="absolute-beginner"
         onclick="showInfo(this)">
      <h3>🌐 HTML Course</h3>
      <p>Absolute Beginner</p>
    </div>

    <div class="card"
         data-product-id="P003"
         data-name="React Course"
         data-price="premium"
         data-level="intermediate"
         onclick="showInfo(this)">
      <h3>⚛️ React Course</h3>
      <p>Intermediate</p>
    </div>

    <div id="info-box"
         style="margin-top:16px; padding:12px;
                background:#f0f0f0; border-radius:8px; display:none">
    </div>
  </section>

  <section>
    <h2>Wikipedia Embedded</h2>
    <iframe
      src="https://en.wikipedia.org/wiki/HTML"
      width="100%"
      height="400"
      title="Wikipedia - HTML Article"
      sandbox="allow-scripts allow-same-origin"
    ></iframe>
  </section>

  <script>
    function showInfo(element) {
      const box = document.getElementById('info-box');
      box.style.display = 'block';
      box.innerHTML = \`
        <strong>Product Details:</strong><br>
        ID: \${element.dataset.productId}<br>
        Name: \${element.dataset.name}<br>
        Price: \${element.dataset.price}<br>
        Level: \${element.dataset.level}
      \`;
    }
  </script>

</body>
</html>`,

      task: {
        description: 'Ek "Learning Hub" webpage banao jisme embed karo: (1) Ek YouTube tutorial video (responsive container mein), (2) Google Maps — apne city ka location, (3) Ek Wikipedia article iframe mein, (4) 6 course cards banao data-* attributes use karke (data-id, data-title, data-duration, data-level, data-price). JavaScript se click pe course details show karo. (5) Ek Google Form embed karo (ya fake form), (6) Details/summary se courses ko category-wise organize karo.',
        hint: 'Google Maps: maps.google.com pe location search karo → Share → Embed a map → iframe code copy karo. Product cards mein data attributes se cart mein add/remove functionality bana sakte ho.',
      },
      quiz: [
        {
          q: 'Iframe mein title attribute kyun zaruri hai?',
          options: ['Styling ke liye', 'Accessibility ke liye — screen readers iframe ka purpose samjhte hain', 'SEO ke liye', 'Size ke liye'],
          correct: 1,
          explanation: 'title attribute screen readers ko batata hai iframe mein kya hai (e.g., "YouTube video tutorial"). Bina title ke screen readers bas "frame" kehte hain — not helpful!',
        },
        {
          q: 'data-* attributes ka main purpose kya hai?',
          options: ['Styling ke liye', 'Custom data ko HTML elements pe store karna jo JavaScript se access ho sake', 'Server data send karna', 'Validation ke liye'],
          correct: 1,
          explanation: 'data-* attributes HTML elements pe extra information store karne ke liye hain. Fir JavaScript mein element.dataset.attributeName se access kar sakte ho.',
        },
        {
          q: 'sandbox attribute iframe pe kyon use karte hain?',
          options: ['Performance improve karna', 'Untrusted content ko restrict karna — security ke liye', 'Size limit karna', 'Loading speed improve karna'],
          correct: 1,
          explanation: 'sandbox attribute embedded content ki capabilities restrict karta hai — default mein sab block, phir specifically allow karo (allow-scripts, allow-forms). Third-party content pe especially useful.',
        },
      ],
    },

    {
      id: 'html-w4-s3',
      title: 'Month 1 Project — Complete Portfolio Website',
      emoji: '🚀',
      content: `## Month 1 Final Project — Professional Portfolio!

Ek mahine mein yeh sab seekha:
- Week 1: HTML basics, headings, links, images, lists
- Week 2: Tables, forms, semantic HTML
- Week 3: Multimedia, HTML5 APIs, SEO, Accessibility
- Week 4: Advanced forms, iframes, data attributes

Ab in sab ko combine karke ek **complete professional portfolio website** banao!

### Portfolio Structure:

\`\`\`
portfolio/
├── index.html          ← Main page
├── about.html          ← About page
├── projects.html       ← Projects showcase
├── skills.html         ← Skills page
├── contact.html        ← Contact page
└── resume.html         ← Resume/CV page
\`\`\`

### index.html — Home Page Content:

\`\`\`html
<!-- Sections needed: -->

1. Hero Section
   - Tera naam (h1)
   - Tagline (Web Developer | Student)
   - CTA buttons (View Work, Contact Me)

2. About Section
   - Short bio (2-3 paragraphs)
   - Profile photo (with proper alt text)
   - Key stats (years learning, projects done, etc.)

3. Skills Section
   - Table ya list form mein
   - Categories: Frontend, Programming, Tools

4. Projects Section
   - Article tags mein each project
   - Project image, title, description, tech used, links

5. Testimonials/Achievements
   - blockquote for quotes
   - dl/dt/dd for key-value info

6. Contact Section
   - Advanced form (datalist, pattern validation)
   - Social media links
   - Location (Google Maps iframe)
\`\`\`

### SEO Checklist:
✅ Proper title tags on all pages
✅ Meta descriptions
✅ Open Graph tags
✅ Viewport meta tag
✅ Canonical URLs
✅ Favicon

### Accessibility Checklist:
✅ lang attribute on html tag
✅ Skip navigation link
✅ All images have alt text
✅ All form fields have labels
✅ Proper heading hierarchy (h1 → h2 → h3)
✅ ARIA attributes where needed
✅ Keyboard navigable
✅ Good color contrast`,

      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arjun Singh — Web Developer Portfolio</title>
  <meta name="description"
    content="Arjun Singh — passionate web developer from Bangalore.
    HTML, CSS, JavaScript, Python. Open to opportunities!">
  <meta property="og:title" content="Arjun Singh — Portfolio">
  <meta property="og:description" content="Web Developer Portfolio">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/png" href="favicon.png">

  <style>
    /* Skip link */
    .skip-link {
      position: absolute; top: -40px; left: 0;
      background: #6366f1; color: white;
      padding: 8px; text-decoration: none; z-index: 100;
    }
    .skip-link:focus { top: 0; }
    :focus { outline: 3px solid #6366f1; outline-offset: 2px; }
    body { font-family: Arial, sans-serif; margin: 0; }
    section { padding: 40px 20px; max-width: 900px; margin: 0 auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #6366f1; color: white; }
    form label { display: block; margin-top: 12px; font-weight: bold; }
    form input, form textarea, form select {
      width: 100%; padding: 8px; margin-top: 4px; box-sizing: border-box;
    }
    form button {
      margin-top: 16px; padding: 10px 24px;
      background: #6366f1; color: white;
      border: none; cursor: pointer; border-radius: 4px;
    }
  </style>
</head>
<body>

  <a href="#main" class="skip-link">Skip to main content</a>

  <header>
    <nav aria-label="Main navigation">
      <ul style="list-style:none; display:flex; gap:20px; padding:16px; margin:0; background:#1a1a2e;">
        <li><a href="#about" style="color:white">About</a></li>
        <li><a href="#skills" style="color:white">Skills</a></li>
        <li><a href="#projects" style="color:white">Projects</a></li>
        <li><a href="#contact" style="color:white">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">

    <!-- Hero -->
    <section id="hero" style="text-align:center; background:#1a1a2e; color:white; padding:80px 20px">
      <h1>Arjun Singh</h1>
      <p>Full Stack Developer | Bangalore, India</p>
      <p>
        <a href="#projects" style="color:#a78bfa">View My Work →</a> |
        <a href="#contact" style="color:#a78bfa">Contact Me</a>
      </p>
    </section>

    <!-- About -->
    <section id="about">
      <h2>About Me</h2>
      <figure style="float:right; margin-left:20px">
        <img src="https://picsum.photos/200/200"
             alt="Arjun Singh profile photo"
             width="200" style="border-radius:50%">
        <figcaption style="text-align:center">Arjun Singh</figcaption>
      </figure>
      <p>Passionate web developer with 2+ years of experience building
      modern, responsive websites. I specialize in creating user-friendly
      interfaces with clean, accessible HTML.</p>
      <dl>
        <dt><strong>Location</strong></dt>
        <dd>Bangalore, Karnataka</dd>
        <dt><strong>Email</strong></dt>
        <dd><a href="mailto:arjun@example.com">arjun@example.com</a></dd>
        <dt><strong>Available For</strong></dt>
        <dd>Freelance & Full-time opportunities</dd>
      </dl>
    </section>

    <!-- Skills -->
    <section id="skills">
      <h2>Technical Skills</h2>
      <table>
        <thead>
          <tr><th>Category</th><th>Skills</th><th>Level</th></tr>
        </thead>
        <tbody>
          <tr><td>Frontend</td><td>HTML5, CSS3, JavaScript</td>
              <td><progress max="10" value="9">90%</progress></td></tr>
          <tr><td>Frameworks</td><td>React, Bootstrap</td>
              <td><progress max="10" value="7">70%</progress></td></tr>
          <tr><td>Backend</td><td>Python, Django, Node.js</td>
              <td><progress max="10" value="6">60%</progress></td></tr>
        </tbody>
      </table>
    </section>

    <!-- Projects -->
    <section id="projects">
      <h2>My Projects</h2>

      <article data-project-id="P001" data-tech="html,css,js">
        <h3>📚 StudyEarn AI Clone</h3>
        <figure>
          <img src="https://picsum.photos/600/300?random=1"
               alt="StudyEarn AI project screenshot"
               width="100%">
        </figure>
        <p>Ed-tech platform banaya HTML, CSS, JavaScript se.
        Features: quiz, progress tracking, gamification.</p>
        <p><strong>Tech:</strong> HTML5, CSS3, JavaScript</p>
        <p>
          <a href="#" target="_blank" rel="noopener">Live Demo →</a> |
          <a href="#" target="_blank" rel="noopener">GitHub →</a>
        </p>
      </article>
    </section>

    <!-- FAQ -->
    <section>
      <h2>FAQ</h2>
      <details>
        <summary>Freelance projects accept karte ho?</summary>
        <p>Haan! Short-term aur long-term dono projects accept karta hoon.
        Contact form se reach out karo.</p>
      </details>
      <details>
        <summary>Minimum project budget kya hai?</summary>
        <p>Simple landing pages ke liye ₹5,000 se start.
        Complex web apps ke liye alag quote milega.</p>
      </details>
    </section>

    <!-- Contact -->
    <section id="contact">
      <h2>Get In Touch</h2>

      <div style="display:flex; gap:40px; flex-wrap:wrap">

        <form action="#" method="POST" style="flex:1; min-width:300px">
          <label for="cname">Your Name: *</label>
          <input type="text" id="cname" name="name"
                 required autocomplete="name"
                 placeholder="Apna naam">

          <label for="cemail">Email: *</label>
          <input type="email" id="cemail" name="email"
                 required autocomplete="email">

          <label for="ctype">Contact Type:</label>
          <select id="ctype" name="type">
            <option value="">Select...</option>
            <option value="job">Job Offer</option>
            <option value="project">Project</option>
            <option value="collab">Collaboration</option>
            <option value="other">Other</option>
          </select>

          <label for="cmsg">Message: *</label>
          <textarea id="cmsg" name="message" rows="5"
                    required></textarea>

          <button type="submit">Send Message 📨</button>
        </form>

        <div style="flex:1; min-width:300px">
          <h3>Location</h3>
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=77.4,12.8,77.8,13.2&layer=mapnik"
            width="100%" height="200"
            title="Bangalore location map"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </section>

  </main>

  <footer style="background:#1a1a2e; color:white; padding:20px; text-align:center">
    <p>
      &copy; 2024 Arjun Singh |
      <a href="mailto:arjun@example.com" style="color:#a78bfa">Email</a> |
      <a href="https://linkedin.com" target="_blank"
         rel="noopener" style="color:#a78bfa">LinkedIn</a>
    </p>
  </footer>

</body>
</html>`,

      task: {
        description: 'Apna complete portfolio website banao — 2 files: index.html (main page) aur contact.html (dedicated contact page). index.html mein: hero section (naam + tagline + CTA), about section (photo + bio + stats), skills table (progress bars ke saath), projects section (3 projects, real ya fake), FAQ (details/summary), embed karo OpenStreetMap ya YouTube. contact.html mein: advanced form (datalist, pattern validation, autocomplete), Google Maps/OpenStreetMap. Dono pages mein: proper SEO meta tags, accessibility (lang, skip link, alt text, labels), navigation links dono pages ke beech.',
        hint: 'Real info use karo! Apne actual skills, hobbies, projects. OpenStreetMap free hai aur iframe se easily embed hota hai. 2 files banao aur <a href="contact.html"> se link karo.',
      },
      quiz: [
        {
          q: 'Multi-page website mein pages kaise link karte hain?',
          options: ['JavaScript se', '<a href="page.html"> se same folder ke pages link hote hain', 'Sirf absolute URLs use karte hain', 'Server ki zarurat hai'],
          correct: 1,
          explanation: 'Same folder: <a href="about.html">. Subfolder: <a href="pages/about.html">. Parent folder: <a href="../index.html">. Yeh relative paths hain — kisi server ki zarurat nahi local development mein.',
        },
        {
          q: 'Portfolio website mein OpenStreetMap/Google Maps embed karne ka best tarika?',
          options: ['Screenshot image se', '<iframe> tag se embed karo — interactive map milti hai', 'JavaScript map library se', 'CSS background image se'],
          correct: 1,
          explanation: 'Maps.google.com ya openstreetmap.org se "Embed" option se iframe code milta hai. Yeh interactive map deta hai — user zoom/pan kar sakta hai.',
        },
        {
          q: 'Professional portfolio mein CSS bhi zaruri hai HTML ke saath?',
          options: ['Nahi, HTML hi kaafi hai', 'Haan, CSS se visual design improve hoti hai — aaj kal pure HTML portfolio professional nahi lagti', 'Sirf senior developers ke liye', 'CSS optional hai'],
          correct: 1,
          explanation: 'HTML structure deta hai, CSS styling deta hai. Ek professional portfolio mein dono zaruri hain — next step CSS seekhna hai! Month 2 mein CSS seekhenge.',
        },
      ],
    },

    {
      id: 'html-w4-s4',
      title: 'Month 1 Review aur Month 2 Preview',
      emoji: '🔭',
      content: `## Month 1 Complete! Kya Seekha? 🎉

Ek mahine mein ek complete language seekhi — **HTML**! Yeh chhoti baat nahi hai.

### Complete Month 1 Summary:

**Week 1 — HTML Basics:**
- HTML structure (DOCTYPE, html, head, body)
- Headings (h1-h6) aur Paragraphs
- Links (<a href>) aur Images (<img>)
- Lists (ul, ol, dl)

**Week 2 — Data aur Input:**
- Tables (tr, th, td, colspan, rowspan)
- Forms (input types, label, select, textarea)
- Semantic HTML (header, nav, main, article, section, footer)

**Week 3 — HTML5 Power:**
- Multimedia (video, audio, iframe)
- HTML5 APIs (localStorage, Canvas, Geolocation)
- SEO (meta tags, OG tags, robots)
- Accessibility (ARIA, skip links, keyboard nav)

**Week 4 — Advanced:**
- Advanced forms (datalist, output, progress, meter, details, dialog)
- Iframes aur embedding
- Data attributes
- Complete Portfolio Project

### HTML Tags jo Tune Seekhe:

\`\`\`
Structure:    html, head, body, main, header, footer, nav
Content:      h1-h6, p, span, div, br, hr
Text Format:  strong, em, mark, del, u, sub, sup, code, pre
Links/Media:  a, img, video, audio, iframe, figure, figcaption
Lists:        ul, ol, li, dl, dt, dd
Tables:       table, thead, tbody, tfoot, tr, th, td
Forms:        form, input, label, select, option, textarea,
              button, datalist, output, progress, meter,
              details, summary, dialog, fieldset, legend
Semantic:     article, section, aside, time, address,
              blockquote, abbr, picture, track
Meta:         meta, title, link
\`\`\`

**Total: 55+ HTML tags mastered!** 💪

### Month 2 Preview — CSS Styling!

Ab HTML structure ready hai — woh ugly plain HTML ko **beautiful** banane ka time!

\`\`\`
Month 2 — CSS (Cascading Style Sheets):
  Week 5:  CSS Basics — Colors, Fonts, Backgrounds
  Week 6:  Box Model — Margin, Padding, Border
  Week 7:  Flexbox — Modern Layout
  Week 8:  CSS Grid — Advanced Layout + Responsive Design
\`\`\`

CSS se kya kar paoge:
- Beautiful colors aur gradients
- Custom fonts (Google Fonts)
- Cards aur shadows
- Animations aur transitions
- Mobile-responsive design
- Dark/light mode
- Modern layouts

### Career Path:

\`\`\`
HTML Basics ✅
    ↓
CSS Styling (Month 2)
    ↓
JavaScript (Month 3)
    ↓
Junior Frontend Developer 🎯
Salary: ₹3-6 LPA (fresher)
\`\`\`

### Agle Steps:
1. 🏆 Apna portfolio website complete karo
2. 📁 GitHub pe upload karo
3. 🔗 Portfolio link LinkedIn pe add karo
4. 📚 CSS Month 2 start karo!`,

      codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Month 1 — Complete Summary</title>
</head>
<body>

  <h1>🎉 HTML Month 1 — Poora Seekh Liya!</h1>

  <section>
    <h2>Topics Covered</h2>
    <details open>
      <summary>Week 1 — HTML Basics ✅</summary>
      <ul>
        <li>HTML structure — DOCTYPE, html, head, body</li>
        <li>Headings h1-h6, paragraphs, text formatting</li>
        <li>Links (a href) aur Images (img)</li>
        <li>Lists — ul, ol, dl</li>
      </ul>
    </details>

    <details open>
      <summary>Week 2 — Tables aur Forms ✅</summary>
      <ul>
        <li>HTML Tables — tr, th, td, colspan, rowspan</li>
        <li>Forms — 15+ input types</li>
        <li>Semantic HTML — header, nav, main, article</li>
        <li>Project: Resume Webpage</li>
      </ul>
    </details>

    <details open>
      <summary>Week 3 — HTML5 Advanced ✅</summary>
      <ul>
        <li>Multimedia — video, audio, iframe</li>
        <li>HTML5 APIs — localStorage, Canvas</li>
        <li>SEO — meta tags, Open Graph</li>
        <li>Accessibility — ARIA, skip links</li>
      </ul>
    </details>

    <details open>
      <summary>Week 4 — Advanced HTML ✅</summary>
      <ul>
        <li>Advanced forms — datalist, progress, dialog</li>
        <li>Iframes aur data attributes</li>
        <li>Project: Complete Portfolio Website</li>
      </ul>
    </details>
  </section>

  <section>
    <h2>Self Assessment</h2>
    <table border="1" cellpadding="8">
      <thead>
        <tr>
          <th>Skill</th>
          <th>Progress</th>
          <th>Level</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>HTML Structure</td>
          <td><progress max="10" value="9">90%</progress></td>
          <td>Advanced</td>
        </tr>
        <tr>
          <td>Forms</td>
          <td><progress max="10" value="8">80%</progress></td>
          <td>Good</td>
        </tr>
        <tr>
          <td>Semantic HTML</td>
          <td><progress max="10" value="7">70%</progress></td>
          <td>Good</td>
        </tr>
        <tr>
          <td>SEO & Meta Tags</td>
          <td><progress max="10" value="7">70%</progress></td>
          <td>Intermediate</td>
        </tr>
        <tr>
          <td>Accessibility</td>
          <td><progress max="10" value="6">60%</progress></td>
          <td>Intermediate</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>🚀 Month 2 — CSS Aayega!</h2>
    <ol>
      <li>CSS Basics — Colors, Fonts, Backgrounds</li>
      <li>Box Model — Margin, Padding, Border</li>
      <li>Flexbox — Modern Layouts</li>
      <li>CSS Grid — Advanced Responsive Design</li>
    </ol>

    <blockquote>
      <p>"HTML se structure banta hai,
         CSS se beauty aati hai,
         JavaScript se jaan aati hai!"</p>
    </blockquote>
  </section>

</body>
</html>`,

      task: {
        description: 'FINAL CHALLENGE — Month 1 Complete karo: (1) Apna portfolio website review karo — sab topics include hain? (2) HTML Validation karo — validator.w3.org pe apna HTML paste karo aur errors fix karo, (3) Ek "Self Assessment" page banao — progress bars se har topic mein apna level dikhao, (4) README.html banao — apni project ka explanation (kya banaya, kaunse tags use kiye, kya seekha), (5) Sab pages ek doosre se properly linked hain check karo, (6) Mobile pe dekho — viewport meta tag hai na?',
        hint: 'W3C Validator: validator.w3.org — apna HTML code paste karo, errors aur warnings dekhkar fix karo. Yeh professional practice hai. README mein dl/dt/dd tags use karo features list ke liye.',
      },
      quiz: [
        {
          q: 'W3C HTML Validator kyun use karna chahiye?',
          options: ['Performance check ke liye', 'HTML errors detect karne ke liye — browsers invalid HTML fix kar lete hain but good practice hai', 'Security ke liye', 'Images optimize karne ke liye'],
          correct: 1,
          explanation: 'validator.w3.org HTML errors find karta hai. Browsers gracefully invalid HTML handle karte hain, but valid HTML = better browser compatibility, better SEO, better accessibility.',
        },
        {
          q: 'HTML seekhne ke baad next logical step kya hai?',
          options: ['Directly JavaScript seekhna', 'CSS seekhna — HTML ko beautiful banane ke liye', 'Database seekhna', 'Server-side programming'],
          correct: 1,
          explanation: 'Standard web dev path: HTML (structure) → CSS (styling) → JavaScript (interactivity). CSS bina HTML ugly plain text jaisi dikhti hai!',
        },
        {
          q: 'Portfolio website banane ka main benefit kya hai?',
          options: ['Marks milte hain', 'Practical skills demonstrate hoti hain — recruiters real code dekh sakte hain', 'Certificate milta hai', 'Marks improve hote hain'],
          correct: 1,
          explanation: 'Portfolio = tumhara live resume! Recruiters github.com/username ya portfolio.com dekhte hain — actual kaam dekh sakte hain, resume se zyada convincing hota hai.',
        },
      ],
    },
  ],
};