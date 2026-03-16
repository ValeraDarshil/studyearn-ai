/**
 * StudyEarn AI — HTML Course
 * Week 1: HTML Basics — Web ka Foundation
 * 4 sections, fully detailed content
 */

export const HTML_WEEK_1 = {
  week: 1,
  title: 'HTML Basics — Web ka Foundation',
  description: 'HTML kya hai, kaise kaam karta hai, aur apna pehla webpage banao!',
  xpReward: 100,
  sections: [
    // ── SECTION 1 ─────────────────────────────────────────────
    {
      id: 'html-w1-s1',
      title: 'HTML kya hai — Web ka Skeleton',
      emoji: '🌐',
      content: `## HTML kya hai?

**HTML** (HyperText Markup Language) har website ka **skeleton** hai. Jaise insaan ke body mein bones hote hain, waise hi website mein HTML hota hai!

Aaj internet pe jo bhi website kholo — Google, YouTube, Instagram — sab ka base HTML hai.

### HTML kaise kaam karta hai?

HTML **tags** use karta hai. Tags angle brackets mein likhe jaate hain:

\`\`\`html
<tag>Content yahan</tag>
\`\`\`

- **Opening tag:** \`<tag>\`
- **Closing tag:** \`</tag>\`
- **Content:** dono ke beech mein

### Pehla HTML File

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Mera Pehla Webpage</title>
  </head>
  <body>
    <h1>Hello Duniya! 🌍</h1>
    <p>Main HTML seekh raha hoon!</p>
  </body>
</html>
\`\`\`

### Har part ka matlab:

| Part | Matlab |
|------|--------|
| \`<!DOCTYPE html>\` | Browser ko batata hai yeh HTML5 hai |
| \`<html>\` | Poore webpage ka container |
| \`<head>\` | Page ki info (title, styles, etc.) |
| \`<title>\` | Browser tab mein jo dikhta hai |
| \`<body>\` | Screen pe jo dikhta hai — sab yahan |
| \`<h1>\` | Sabse bada heading |
| \`<p>\` | Paragraph text |

### HTML file kaise banayein?

1. Notepad ya VS Code kholo
2. Code likho
3. \`index.html\` naam se save karo
4. Browser mein double-click karo — webpage ready! 🎉

### Pro Tip 💡
\`index.html\` naam sabse important hai — yeh kisi bhi website ka **default page** hota hai. Jab tum \`google.com\` type karte ho, browser actually \`index.html\` hi dhundta hai!`,

      codeExample: `<!DOCTYPE html>
<html>
  <head>
    <title>Mera Portfolio</title>
  </head>
  <body>
    <h1>Namaste! Main Rahul hoon 👋</h1>
    <p>Main ek web developer banne ki journey pe hoon.</p>
    <p>HTML seekhna shuru kiya hai aaj se!</p>
  </body>
</html>`,

      task: {
        description: 'Apna pehla webpage banao! Ek HTML file banao jisme: (1) Title mein tumhara naam ho, (2) Body mein ek bada heading ho apne naam ke saath, (3) Teen paragraph ho — apne baare mein, apne sheher ke baare mein, aur apne hobby ke baare mein.',
        hint: '<!DOCTYPE html> se shuru karo. <html> ke andar <head> aur <body> dono chahiye. Heading ke liye <h1>, paragraph ke liye <p> use karo.',
      },
      quiz: [
        {
          q: 'HTML ka full form kya hai?',
          options: ['HyperText Markup Language', 'High Text Modern Language', 'HyperText Modern Links', 'High Transfer Markup Language'],
          correct: 0,
          explanation: 'HTML = HyperText Markup Language. "HyperText" matlab links se connected text, "Markup" matlab tags se content mark karna.',
        },
        {
          q: '<body> tag ka kya kaam hai?',
          options: ['Browser tab ka title set karna', 'Page ki styling karna', 'Screen pe dikhne wala saara content yahan hota hai', 'JavaScript code likhna'],
          correct: 2,
          explanation: '<body> mein woh sab kuch hota hai jo user screen pe dekhta hai — text, images, buttons, etc.',
        },
        {
          q: 'Sahi HTML closing tag kaun sa hai?',
          options: ['<p/', '</p>', '</ p>', '(p)'],
          correct: 1,
          explanation: 'Closing tag mein forward slash (/) hota hai tag naam se pehle: </p>, </h1>, </body> etc.',
        },
      ],
    },

    // ── SECTION 2 ─────────────────────────────────────────────
    {
      id: 'html-w1-s2',
      title: 'Headings aur Paragraphs — Text ka Structure',
      emoji: '📝',
      content: `## Headings — Text ko Structure Do!

HTML mein **6 levels ke headings** hote hain — \`<h1>\` sabse bada, \`<h6>\` sabse chhota:

\`\`\`html
<h1>Main Title — Sabse Bada (Ek hi hona chahiye)</h1>
<h2>Section Heading</h2>
<h3>Sub-section Heading</h3>
<h4>Smaller Heading</h4>
<h5>Even Smaller</h5>
<h6>Sabse Chhota Heading</h6>
\`\`\`

### Headings ka sahi use:

\`\`\`html
<h1>StudyEarn AI — Learn & Earn 🚀</h1>

<h2>Hamare Courses</h2>
  <h3>Web Development</h3>
    <h4>HTML Basics</h4>
    <h4>CSS Styling</h4>
  <h3>Programming</h3>
    <h4>Python</h4>

<h2>About Us</h2>
\`\`\`

### Paragraphs — \`<p>\` Tag

\`\`\`html
<p>Yeh pehla paragraph hai. Kuch text yahan likho.</p>
<p>Yeh doosra paragraph hai. Browser automatically
   ek line gap dega dono ke beech.</p>
\`\`\`

### Text Formatting Tags

\`\`\`html
<p>Yeh <strong>bold text</strong> hai — important cheezein.</p>
<p>Yeh <em>italic text</em> hai — emphasis ke liye.</p>
<p>Yeh <mark>highlighted text</mark> hai — yellow background.</p>
<p>Yeh <del>strikethrough</del> hai — deleted content.</p>
<p>Yeh <u>underlined</u> hai.</p>
<p>H<sub>2</sub>O — subscript (neeche)</p>
<p>x<sup>2</sup> — superscript (upar)</p>
\`\`\`

### Line Break aur Horizontal Rule

\`\`\`html
<p>Pehli line.<br>Doosri line — same paragraph mein!</p>

<hr>  <!-- Horizontal line — sections separate karne ke liye -->
\`\`\`

### Whitespace aur HTML

HTML mein extra spaces aur line breaks **ignore** hote hain:

\`\`\`html
<!-- Yeh dono same dikhenge browser mein -->
<p>Hello World</p>
<p>Hello          World</p>
\`\`\`

Multiple spaces ke liye \`&nbsp;\` use karo (non-breaking space).

### Best Practices 🎯
- **Ek page mein sirf ek \`<h1>\`** — yeh SEO ke liye important hai
- Headings **hierarchy follow** karein — h2 ke baad h3, h3 ke baad h4
- Paragraphs meaningful chunks mein likho — bahut lamba paragraph mat banao`,

      codeExample: `<!DOCTYPE html>
<html>
  <head>
    <title>Meri Study Blog</title>
  </head>
  <body>
    <h1>📚 Meri Learning Journey</h1>

    <h2>Aaj Kya Seekha</h2>
    <p>Aaj maine <strong>HTML basics</strong> seekhe.
    Bahut <em>exciting</em> tha!</p>

    <h2>HTML Tags Seekhe</h2>
    <p>Aaj ke important tags:</p>
    <p>Headings ke liye <strong>h1 se h6</strong> use karte hain.</p>
    <p>Paragraphs ke liye <strong>p tag</strong> use karte hain.</p>

    <hr>

    <h2>Aage Kya Seekhunga</h2>
    <p>Kal <mark>CSS styling</mark> seekhunga taaki
    page <em>sundar</em> dikhe!</p>

    <p>Chemistry formula: H<sub>2</sub>SO<sub>4</sub></p>
    <p>Math: x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup></p>
  </body>
</html>`,

      task: {
        description: 'Ek "Study Notes" webpage banao. Ismein hona chahiye: (1) H1 mein "Meri Study Notes" heading, (2) Teen subjects ke liye H2 headings (Math, Science, English), (3) Har subject ke neeche ek paragraph us subject ke baare mein, (4) Important words bold mein, (5) Ek horizontal rule sections separate karne ke liye, (6) Koi ek subscript ya superscript use karo (jaise H2O ya x2).',
        hint: '<strong> bold ke liye, <em> italic ke liye, <hr> horizontal line ke liye, <sub> subscript ke liye use karo.',
      },
      quiz: [
        {
          q: 'Kitne levels ke headings HTML mein hote hain?',
          options: ['3', '4', '6', '8'],
          correct: 2,
          explanation: 'HTML mein h1 se h6 tak 6 levels ke headings hote hain. h1 sabse bada aur important, h6 sabse chhota.',
        },
        {
          q: '<strong> tag kya karta hai?',
          options: ['Text ko italic banata hai', 'Text ko bold banata hai', 'Text ko delete karta hai', 'Text ko highlight karta hai'],
          correct: 1,
          explanation: '<strong> text ko bold banata hai aur semantic importance bhi batata hai. <b> sirf visually bold karta hai.',
        },
        {
          q: '<br> tag ka kya kaam hai?',
          options: ['New paragraph banata hai', 'Horizontal line add karta hai', 'Same paragraph mein line break deta hai', 'Text bold karta hai'],
          correct: 2,
          explanation: '<br> ek line break deta hai bina naya paragraph banaye. <hr> horizontal rule (line) deta hai.',
        },
      ],
    },

    // ── SECTION 3 ─────────────────────────────────────────────
    {
      id: 'html-w1-s3',
      title: 'Links aur Images — Web ko Connect Karo',
      emoji: '🔗',
      content: `## Links — Web ki Jaan!

Internet ke "HyperText" part ko links represent karte hain. Ek page se doosre pe jaana — yahi web ka magic hai!

### Anchor Tag — \`<a>\`

\`\`\`html
<a href="https://www.google.com">Google pe jao</a>
<a href="https://studyearnai.tech">StudyEarn AI</a>
\`\`\`

### href Attribute
\`href\` = "Hypertext REFerence" — link kahan jaayega:

\`\`\`html
<!-- External link — doosri website -->
<a href="https://youtube.com">YouTube</a>

<!-- Internal link — same website ka doosra page -->
<a href="about.html">About Page</a>
<a href="contact.html">Contact Us</a>

<!-- Same page ka koi section -->
<a href="#contact-section">Contact Section Dekho</a>

<!-- Email link -->
<a href="mailto:rahul@gmail.com">Email Bhejo</a>

<!-- Phone link -->
<a href="tel:+919876543210">Call Karo</a>
\`\`\`

### target Attribute — Kahan Khule?

\`\`\`html
<!-- Same tab mein khule (default) -->
<a href="https://google.com">Google</a>

<!-- Naye tab mein khule -->
<a href="https://google.com" target="_blank">
  Google (New Tab)
</a>

<!-- Security best practice: rel="noopener" zaroor add karo -->
<a href="https://google.com" target="_blank" rel="noopener noreferrer">
  Google (Safe New Tab)
</a>
\`\`\`

## Images — \`<img>\` Tag

\`\`\`html
<!-- Basic image -->
<img src="photo.jpg" alt="Meri photo">

<!-- Online image (URL se) -->
<img src="https://picsum.photos/400/300" alt="Random photo">

<!-- Size specify karo -->
<img src="logo.png" alt="Company logo" width="200" height="100">
\`\`\`

### img tag ke important attributes:
| Attribute | Kya karta hai |
|-----------|---------------|
| \`src\` | Image ka path/URL |
| \`alt\` | Image load na ho toh kya dikhaye (accessibility ke liye ZARURI) |
| \`width\` | Width pixels mein |
| \`height\` | Height pixels mein |
| \`title\` | Hover karne pe tooltip |

### Image ko Link banao!

\`\`\`html
<a href="https://studyearnai.tech" target="_blank">
  <img src="logo.png" alt="StudyEarn AI Logo" width="150">
</a>
\`\`\`

### Relative vs Absolute Paths

\`\`\`html
<!-- Absolute path — complete URL -->
<img src="https://example.com/images/photo.jpg">

<!-- Relative path — same folder mein -->
<img src="photo.jpg">

<!-- Subfolder mein -->
<img src="images/photo.jpg">

<!-- Ek folder upar -->
<img src="../photo.jpg">
\`\`\`

### Alt Text kyun zaroori hai? 🎯
1. **Accessibility** — screen readers blind users ke liye alt text padhte hain
2. **SEO** — search engines images "padhne" ke liye alt text use karte hain
3. **Fallback** — agar image load na ho toh alt text dikhta hai`,

      codeExample: `<!DOCTYPE html>
<html>
  <head>
    <title>Mera Link aur Image Demo</title>
  </head>
  <body>
    <h1>🔗 Links aur Images Practice</h1>

    <h2>Useful Websites</h2>
    <p>
      <a href="https://studyearnai.tech" target="_blank" rel="noopener">
        StudyEarn AI pe jao! 🚀
      </a>
    </p>
    <p>
      <a href="https://www.w3schools.com" target="_blank" rel="noopener">
        HTML seekhne ki website
      </a>
    </p>

    <h2>Random Photos</h2>
    <p>Yeh ek random photo hai internet se:</p>
    <img
      src="https://picsum.photos/400/250"
      alt="Random beautiful photo"
      width="400"
    >

    <h2>Image Link</h2>
    <p>Is image pe click karo Google khulega:</p>
    <a href="https://google.com" target="_blank" rel="noopener">
      <img
        src="https://picsum.photos/200/100"
        alt="Google pe jaane ke liye click karo"
        width="200"
      >
    </a>

    <h2>Contact</h2>
    <p>Mujhe <a href="mailto:rahul@gmail.com">email karo</a></p>
  </body>
</html>`,

      task: {
        description: 'Ek "My Favourite Things" webpage banao. Ismein hona chahiye: (1) 5 favourite websites ke links (new tab mein khulen), (2) 3 images — ek tumhari favorite jagah, ek favorite food, ek favorite activity (picsum.photos se ya koi bhi online URL use kar sakte ho), (3) Har image pe click karne se koi related website khule, (4) Ek email link "Contact Me" section mein, (5) Proper alt text sab images pe.',
        hint: 'picsum.photos/400/300 se placeholder images lo. Image ko link banane ke liye <a> ke andar <img> tag rakho. target="_blank" aur rel="noopener" zaroor use karo.',
      },
      quiz: [
        {
          q: 'Link naye tab mein kholne ke liye kaunsa attribute use karte hain?',
          options: ['href="_blank"', 'target="_blank"', 'open="new"', 'link="newtab"'],
          correct: 1,
          explanation: 'target="_blank" link ko naye browser tab mein kholta hai. Security ke liye rel="noopener noreferrer" bhi add karo.',
        },
        {
          q: '<img> tag mein "alt" attribute kyun zaroori hai?',
          options: ['Image ki height set karna', 'Image ka alternative text — accessibility aur SEO ke liye', 'Image ka size compress karna', 'Image ko animate karna'],
          correct: 1,
          explanation: 'alt text screen readers use karte hain blind users ke liye, search engines SEO ke liye, aur browser show karta hai jab image load na ho.',
        },
        {
          q: 'Email link banane ke liye href mein kya likhte hain?',
          options: ['email:rahul@gmail.com', 'mail:rahul@gmail.com', 'mailto:rahul@gmail.com', 'send:rahul@gmail.com'],
          correct: 2,
          explanation: 'mailto: protocol use hota hai email links ke liye. Click karne pe default email app khulta hai.',
        },
      ],
    },

    // ── SECTION 4 ─────────────────────────────────────────────
    {
      id: 'html-w1-s4',
      title: 'Lists — Ordered, Unordered aur Description',
      emoji: '📋',
      content: `## Lists — Information Organize Karo!

Real websites mein lists bahut common hain — navigation menus, product features, steps, ingredients — sab lists hote hain!

### Unordered List (bullet points)

\`\`\`html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>Python</li>
</ul>
\`\`\`

Result:
- HTML
- CSS
- JavaScript
- Python

### Ordered List (numbered)

\`\`\`html
<ol>
  <li>HTML seekho</li>
  <li>CSS seekho</li>
  <li>JavaScript seekho</li>
  <li>Job pao! 💼</li>
</ol>
\`\`\`

Result:
1. HTML seekho
2. CSS seekho
3. JavaScript seekho
4. Job pao! 💼

### Ordered List ke Types

\`\`\`html
<!-- Numbers (default) -->
<ol type="1">
  <li>Pehla</li>
  <li>Doosra</li>
</ol>

<!-- Uppercase letters -->
<ol type="A">
  <li>Option A</li>
  <li>Option B</li>
</ol>

<!-- Lowercase letters -->
<ol type="a">
  <li>Option a</li>
</ol>

<!-- Roman numerals -->
<ol type="I">
  <li>Chapter I</li>
  <li>Chapter II</li>
</ol>

<!-- Kisi number se start karo -->
<ol start="5">
  <li>Paanchva item</li>
  <li>Chhata item</li>
</ol>
\`\`\`

### Nested Lists (lists ke andar lists)

\`\`\`html
<ul>
  <li>Frontend Development
    <ul>
      <li>HTML</li>
      <li>CSS
        <ul>
          <li>Flexbox</li>
          <li>Grid</li>
        </ul>
      </li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Backend Development
    <ul>
      <li>Python</li>
      <li>Node.js</li>
    </ul>
  </li>
</ul>
\`\`\`

### Description List

\`\`\`html
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language — website ka structure</dd>

  <dt>CSS</dt>
  <dd>Cascading Style Sheets — website ki styling</dd>

  <dt>JavaScript</dt>
  <dd>Programming language — website ko interactive banata hai</dd>
</dl>
\`\`\`

- **\`<dl>\`** = Description List
- **\`<dt>\`** = Description Term (word/phrase)
- **\`<dd>\`** = Description Definition (meaning)

### Practical Example — Navigation Menu

\`\`\`html
<nav>
  <ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="courses.html">Courses</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>
\`\`\`

Navigation menus almost hamesha \`<ul>\` se banate hain — CSS se bullets hide kar dete hain baad mein!`,

      codeExample: `<!DOCTYPE html>
<html>
  <head>
    <title>Web Dev Roadmap</title>
  </head>
  <body>
    <h1>🗺️ Web Developer Roadmap</h1>

    <h2>Seekhne ki Steps (Ordered)</h2>
    <ol>
      <li>HTML — Web ka Structure</li>
      <li>CSS — Styling aur Design</li>
      <li>JavaScript — Interactivity</li>
      <li>React — Modern Frontend</li>
      <li>Node.js — Backend</li>
    </ol>

    <h2>Frontend Technologies (Unordered)</h2>
    <ul>
      <li>HTML5
        <ul>
          <li>Semantic Tags</li>
          <li>Forms</li>
          <li>Tables</li>
        </ul>
      </li>
      <li>CSS3
        <ul>
          <li>Flexbox</li>
          <li>Grid</li>
          <li>Animations</li>
        </ul>
      </li>
      <li>JavaScript</li>
    </ul>

    <h2>Important Terms</h2>
    <dl>
      <dt>Responsive Design</dt>
      <dd>Website jo mobile aur desktop dono pe acchi dikhe</dd>

      <dt>SEO</dt>
      <dd>Search Engine Optimization — Google pe rank karna</dd>

      <dt>Accessibility</dt>
      <dd>Website jo disabled users bhi use kar sakein</dd>
    </dl>

    <h2>Navigation Menu</h2>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Courses</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </body>
</html>`,

      task: {
        description: 'Apni "Dream Job" ke baare mein ek webpage banao. Ismein hona chahiye: (1) Ordered list mein us job tak pahunchne ke 5 steps, (2) Unordered list mein us job ke 5 skills chahiye (nested — har skill ke neeche 2-3 sub-skills bhi), (3) Description list mein 4 important terms apni field se, (4) Ek navigation menu (Home, Skills, Goals, Contact), (5) Heading structure properly use karo (h1, h2, h3).',
        hint: 'Nested list ke liye <li> ke andar doosra <ul> ya <ol> rakho. Description list mein <dl>, <dt>, <dd> use karo. Navigation ke liye <nav> tag ke andar <ul> rakho.',
      },
      quiz: [
        {
          q: 'Numbered list ke liye kaunsa tag use karte hain?',
          options: ['<ul>', '<ol>', '<nl>', '<list>'],
          correct: 1,
          explanation: '<ol> = Ordered List (numbered). <ul> = Unordered List (bullets). <li> dono mein individual items ke liye.',
        },
        {
          q: '<dl>, <dt>, <dd> ka combination kahan use hota hai?',
          options: ['Navigation menu ke liye', 'Shopping list ke liye', 'Terms aur unki definitions ke liye', 'Steps aur instructions ke liye'],
          correct: 2,
          explanation: 'Description List (<dl>) glossary, dictionary, FAQ jaisi cheezein banane ke liye use hoti hai — terms aur unke meanings.',
        },
        {
          q: 'Navigation menu banane ka sahi HTML structure kaunsa hai?',
          options: ['<nav><p>links</p></nav>', '<nav><ul><li><a>link</a></li></ul></nav>', '<menu><links></links></menu>', '<navigation><items></items></navigation>'],
          correct: 1,
          explanation: 'Best practice hai <nav> ke andar <ul>, usme <li> items, aur har item mein <a> link. CSS se bullets baad mein hide kar sakte hain.',
        },
      ],
    },
  ],
};