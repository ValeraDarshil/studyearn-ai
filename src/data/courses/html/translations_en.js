/**
 * StudyEarn AI — HTML Course English Translations
 * src/data/courses/html/translations_en.js
 *
 * ALL 16 sections (Weeks 1-4) — exact same content in English
 * Default language: Hinglish | Toggle: English
 *
 * applyEnglishTranslations() merges these into section objects:
 *   - title_en, content_en, codeExample_en on section
 *   - task.description_en, task.hint_en on task object
 *   - q_en, options_en, explanation_en on each quiz question
 */

// ── WEEK 1 ────────────────────────────────────────────────────
const W1 = {
  'html-w1-s1': {
    title_en: 'What is HTML — Skeleton of the Web',
    content_en: `## What is HTML?

**HTML** (HyperText Markup Language) is the **skeleton** of every website. Just like bones give structure to a human body, HTML gives structure to a webpage!

Every website you open today — Google, YouTube, Instagram — all of them are built on HTML as their foundation.

### How Does HTML Work?

HTML uses **tags**. Tags are written inside angle brackets:

\`\`\`html
<tag>Content goes here</tag>
\`\`\`

- **Opening tag:** \`<tag>\`
- **Closing tag:** \`</tag>\`
- **Content:** everything in between

### Your First HTML File

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>My First Webpage</title>
  </head>
  <body>
    <h1>Hello World! 🌍</h1>
    <p>I am learning HTML!</p>
  </body>
</html>
\`\`\`

### What Each Part Means:

| Part | Meaning |
|------|---------|
| \`<!DOCTYPE html>\` | Tells the browser this is HTML5 |
| \`<html>\` | Container for the entire webpage |
| \`<head>\` | Page info (title, styles, etc.) |
| \`<title>\` | Text shown in the browser tab |
| \`<body>\` | Everything visible on screen goes here |
| \`<h1>\` | The largest heading |
| \`<p>\` | Paragraph text |

### How to Create an HTML File?

1. Open Notepad or VS Code
2. Write your code
3. Save as \`index.html\`
4. Double-click in your browser — webpage ready! 🎉

### Pro Tip 💡
\`index.html\` is the most important filename — it is the **default page** of any website. When you type \`google.com\`, the browser actually looks for \`index.html\`!`,
    codeExample_en: `<!DOCTYPE html>
<html>
  <head>
    <title>My Portfolio</title>
  </head>
  <body>
    <h1>Hello! I am Rahul 👋</h1>
    <p>I am on a journey to become a web developer.</p>
    <p>I started learning HTML today!</p>
  </body>
</html>`,
    task_en: {
      description: 'Create your first webpage! Make an HTML file with: (1) Your name in the title, (2) A large heading with your name in the body, (3) Three paragraphs — about yourself, about your city, and about your hobby.',
      hint: 'Start with <!DOCTYPE html>. Inside <html> you need both <head> and <body>. Use <h1> for heading and <p> for paragraphs.',
    },
    quiz_en: [
      { q: 'What is the full form of HTML?', options: ['HyperText Markup Language', 'High Text Modern Language', 'HyperText Modern Links', 'High Transfer Markup Language'], correct: 0, explanation: 'HTML = HyperText Markup Language. "HyperText" means text connected via links, "Markup" means marking content with tags.' },
      { q: 'What is the purpose of the <body> tag?', options: ['Set the browser tab title', 'Style the page', 'All content visible on screen goes here', 'Write JavaScript code'], correct: 2, explanation: '<body> contains everything the user sees on screen — text, images, buttons, etc.' },
      { q: 'What is the correct HTML closing tag?', options: ['<p/', '</p>', '</ p>', '(p)'], correct: 1, explanation: 'Closing tags have a forward slash (/) before the tag name: </p>, </h1>, </body> etc.' },
    ],
  },

  'html-w1-s2': {
    title_en: 'Headings and Paragraphs — Structuring Text',
    content_en: `## Headings — Give Your Text Structure!

HTML has **6 levels of headings** — \`<h1>\` is the largest, \`<h6>\` the smallest:

\`\`\`html
<h1>Main Title — Largest (only one per page)</h1>
<h2>Section Heading</h2>
<h3>Sub-section Heading</h3>
<h4>Smaller Heading</h4>
<h5>Even Smaller</h5>
<h6>Smallest Heading</h6>
\`\`\`

### Using Headings Correctly:

\`\`\`html
<h1>StudyEarn AI — Learn & Earn 🚀</h1>

<h2>Our Courses</h2>
  <h3>Web Development</h3>
    <h4>HTML Basics</h4>
    <h4>CSS Styling</h4>
  <h3>Programming</h3>
    <h4>Python</h4>

<h2>About Us</h2>
\`\`\`

### Paragraphs — The \`<p>\` Tag

\`\`\`html
<p>This is the first paragraph. Write some text here.</p>
<p>This is the second paragraph. The browser automatically
   adds a line gap between the two.</p>
\`\`\`

### Text Formatting Tags

\`\`\`html
<p>This is <strong>bold text</strong> — for important things.</p>
<p>This is <em>italic text</em> — for emphasis.</p>
<p>This is <mark>highlighted text</mark> — yellow background.</p>
<p>This is <del>strikethrough</del> — deleted content.</p>
<p>This is <u>underlined</u> text.</p>
<p>H<sub>2</sub>O — subscript (below the line)</p>
<p>x<sup>2</sup> — superscript (above the line)</p>
\`\`\`

### Line Break and Horizontal Rule

\`\`\`html
<p>First line.<br>Second line — in the same paragraph!</p>

<hr>  <!-- Horizontal line — to separate sections -->
\`\`\`

### Whitespace in HTML

HTML ignores extra spaces and line breaks:

\`\`\`html
<!-- Both of these look the same in the browser -->
<p>Hello World</p>
<p>Hello          World</p>
\`\`\`

Use \`&nbsp;\` for multiple spaces (non-breaking space).

### Best Practices 🎯
- **Only one \`<h1>\` per page** — important for SEO
- Follow **heading hierarchy** — h2 after h1, h3 after h2
- Write paragraphs in meaningful chunks — avoid very long paragraphs`,
    codeExample_en: `<!DOCTYPE html>
<html>
  <head>
    <title>My Study Blog</title>
  </head>
  <body>
    <h1>📚 My Learning Journey</h1>

    <h2>What I Learned Today</h2>
    <p>Today I learned <strong>HTML basics</strong>.
    It was very <em>exciting</em>!</p>

    <h2>HTML Tags I Learned</h2>
    <p>Important tags from today:</p>
    <p>For headings we use <strong>h1 through h6</strong>.</p>
    <p>For paragraphs we use the <strong>p tag</strong>.</p>

    <hr>

    <h2>What I Will Learn Next</h2>
    <p>Tomorrow I will learn <mark>CSS styling</mark> so my
    page looks <em>beautiful</em>!</p>

    <p>Chemistry formula: H<sub>2</sub>SO<sub>4</sub></p>
    <p>Math: x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup></p>
  </body>
</html>`,
    task_en: {
      description: 'Create a "Study Notes" webpage. It should have: (1) H1 heading "My Study Notes", (2) H2 headings for three subjects (Math, Science, English), (3) A paragraph under each subject about it, (4) Important words in bold, (5) A horizontal rule to separate sections, (6) Use at least one subscript or superscript (like H2O or x2).',
      hint: 'Use <strong> for bold, <em> for italic, <hr> for horizontal line, <sub> for subscript.',
    },
    quiz_en: [
      { q: 'How many levels of headings are there in HTML?', options: ['3', '4', '6', '8'], correct: 2, explanation: 'HTML has 6 heading levels from h1 to h6. h1 is the largest and most important, h6 is the smallest.' },
      { q: 'What does the <strong> tag do?', options: ['Makes text italic', 'Makes text bold', 'Deletes text', 'Highlights text'], correct: 1, explanation: '<strong> makes text bold and also conveys semantic importance. <b> only makes it visually bold.' },
      { q: 'What does the <br> tag do?', options: ['Creates a new paragraph', 'Adds a horizontal line', 'Adds a line break within the same paragraph', 'Makes text bold'], correct: 2, explanation: '<br> adds a line break without creating a new paragraph. <hr> creates a horizontal rule (line).' },
    ],
  },

  'html-w1-s3': {
    title_en: 'Links and Images — Connecting the Web',
    content_en: `## Links — The Soul of the Web!

Links represent the "HyperText" part of HTML. Going from one page to another — that is the magic of the web!

### The Anchor Tag — \`<a>\`

\`\`\`html
<a href="https://www.google.com">Go to Google</a>
<a href="https://studyearnai.tech">StudyEarn AI</a>
\`\`\`

### The href Attribute
\`href\` = "Hypertext REFerence" — where the link goes:

\`\`\`html
<!-- External link — another website -->
<a href="https://youtube.com">YouTube</a>

<!-- Internal link — another page on the same site -->
<a href="about.html">About Page</a>
<a href="contact.html">Contact Us</a>

<!-- Link to a section on the same page -->
<a href="#contact-section">Jump to Contact</a>

<!-- Email link -->
<a href="mailto:rahul@gmail.com">Send Email</a>

<!-- Phone link -->
<a href="tel:+919876543210">Call Us</a>
\`\`\`

### The target Attribute — Where Does It Open?

\`\`\`html
<!-- Opens in the same tab (default) -->
<a href="https://google.com">Google</a>

<!-- Opens in a new tab -->
<a href="https://google.com" target="_blank">
  Google (New Tab)
</a>

<!-- Security best practice: add rel="noopener" -->
<a href="https://google.com" target="_blank" rel="noopener noreferrer">
  Google (Safe New Tab)
</a>
\`\`\`

## Images — The \`<img>\` Tag

\`\`\`html
<!-- Basic image -->
<img src="photo.jpg" alt="My photo">

<!-- Online image (from URL) -->
<img src="https://picsum.photos/400/300" alt="Random photo">

<!-- Specify size -->
<img src="logo.png" alt="Company logo" width="200" height="100">
\`\`\`

### Important img Attributes:
| Attribute | What it does |
|-----------|--------------|
| \`src\` | Image path or URL |
| \`alt\` | Text shown if image fails to load (REQUIRED for accessibility) |
| \`width\` | Width in pixels |
| \`height\` | Height in pixels |
| \`title\` | Tooltip shown on hover |

### Make an Image a Link!

\`\`\`html
<a href="https://studyearnai.tech" target="_blank">
  <img src="logo.png" alt="StudyEarn AI Logo" width="150">
</a>
\`\`\`

### Relative vs Absolute Paths

\`\`\`html
<!-- Absolute — complete URL -->
<img src="https://example.com/images/photo.jpg">

<!-- Relative — same folder -->
<img src="photo.jpg">

<!-- In a subfolder -->
<img src="images/photo.jpg">

<!-- One folder up -->
<img src="../photo.jpg">
\`\`\`

### Why is Alt Text Essential? 🎯
1. **Accessibility** — Screen readers use alt text for visually impaired users
2. **SEO** — Search engines use alt text to "read" images
3. **Fallback** — Alt text is shown when the image fails to load`,
    codeExample_en: `<!DOCTYPE html>
<html>
  <head>
    <title>My Links and Images Demo</title>
  </head>
  <body>
    <h1>🔗 Links and Images Practice</h1>

    <h2>Useful Websites</h2>
    <p>
      <a href="https://studyearnai.tech" target="_blank" rel="noopener">
        Go to StudyEarn AI! 🚀
      </a>
    </p>
    <p>
      <a href="https://www.w3schools.com" target="_blank" rel="noopener">
        W3Schools — Learn HTML
      </a>
    </p>

    <h2>Random Photos</h2>
    <p>Here is a random photo from the internet:</p>
    <img
      src="https://picsum.photos/400/250"
      alt="A beautiful random photo"
      width="400"
    >

    <h2>Clickable Image</h2>
    <p>Click this image to open Google:</p>
    <a href="https://google.com" target="_blank" rel="noopener">
      <img
        src="https://picsum.photos/200/100"
        alt="Click to open Google"
        width="200"
      >
    </a>

    <h2>Contact</h2>
    <p>You can <a href="mailto:rahul@gmail.com">email me</a></p>
  </body>
</html>`,
    task_en: {
      description: 'Create a "My Favourite Things" webpage. It must have: (1) Links to 5 favourite websites (opening in new tab), (2) 3 images — your favourite place, food, and activity (use picsum.photos or any online URL), (3) Clicking each image should open a related website, (4) An email link in a "Contact Me" section, (5) Proper alt text on all images.',
      hint: 'Get placeholder images from picsum.photos/400/300. To make an image a link, place <img> inside <a> tag. Always use target="_blank" and rel="noopener".',
    },
    quiz_en: [
      { q: 'Which attribute opens a link in a new tab?', options: ['href="_blank"', 'target="_blank"', 'open="new"', 'link="newtab"'], correct: 1, explanation: 'target="_blank" opens the link in a new browser tab. For security, also add rel="noopener noreferrer".' },
      { q: 'Why is the "alt" attribute important on <img>?', options: ['Sets image height', 'Alternative text — for accessibility and SEO', 'Compresses the image', 'Animates the image'], correct: 1, explanation: 'Alt text is used by screen readers for the visually impaired, by search engines for SEO, and shown by browsers when image fails to load.' },
      { q: 'How do you write an email link in the href attribute?', options: ['email:rahul@gmail.com', 'mail:rahul@gmail.com', 'mailto:rahul@gmail.com', 'send:rahul@gmail.com'], correct: 2, explanation: 'The mailto: protocol is used for email links. Clicking it opens the default email app.' },
    ],
  },

  'html-w1-s4': {
    title_en: 'Lists — Ordered, Unordered and Description',
    content_en: `## Lists — Organise Your Information!

Lists are very common on real websites — navigation menus, product features, steps, ingredients — they are all lists!

### Unordered List (bullet points)

\`\`\`html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>Python</li>
</ul>
\`\`\`

### Ordered List (numbered)

\`\`\`html
<ol>
  <li>Learn HTML</li>
  <li>Learn CSS</li>
  <li>Learn JavaScript</li>
  <li>Get a job! 💼</li>
</ol>
\`\`\`

### Ordered List Types

\`\`\`html
<!-- Numbers (default) -->
<ol type="1"><li>First</li><li>Second</li></ol>

<!-- Uppercase letters -->
<ol type="A"><li>Option A</li><li>Option B</li></ol>

<!-- Lowercase letters -->
<ol type="a"><li>Option a</li></ol>

<!-- Roman numerals -->
<ol type="I"><li>Chapter I</li><li>Chapter II</li></ol>

<!-- Start from a specific number -->
<ol start="5"><li>Fifth item</li><li>Sixth item</li></ol>
\`\`\`

### Nested Lists (lists inside lists)

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
  <dd>HyperText Markup Language — the structure of a website</dd>

  <dt>CSS</dt>
  <dd>Cascading Style Sheets — the styling of a website</dd>

  <dt>JavaScript</dt>
  <dd>Programming language — makes websites interactive</dd>
</dl>
\`\`\`

- **\`<dl>\`** = Description List
- **\`<dt>\`** = Description Term (the word/phrase)
- **\`<dd>\`** = Description Definition (its meaning)

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

Navigation menus are almost always built with \`<ul>\` — then CSS hides the bullet points!`,
    codeExample_en: `<!DOCTYPE html>
<html>
  <head>
    <title>Web Dev Roadmap</title>
  </head>
  <body>
    <h1>🗺️ Web Developer Roadmap</h1>

    <h2>Learning Steps (Ordered)</h2>
    <ol>
      <li>HTML — Web Structure</li>
      <li>CSS — Styling and Design</li>
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
      <dd>A website that looks good on both mobile and desktop</dd>

      <dt>SEO</dt>
      <dd>Search Engine Optimisation — ranking on Google</dd>

      <dt>Accessibility</dt>
      <dd>A website that can be used by people with disabilities too</dd>
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
    task_en: {
      description: 'Create a "Dream Job" webpage. It must have: (1) An ordered list with 5 steps to reach that job, (2) An unordered list with 5 required skills (nested — each skill with 2-3 sub-skills), (3) A description list with 4 important terms from your field, (4) A navigation menu (Home, Skills, Goals, Contact), (5) Proper heading structure (h1, h2, h3).',
      hint: 'For nested lists, place a second <ul> or <ol> inside an <li>. For description list use <dl>, <dt>, <dd>. For navigation put <ul> inside a <nav> tag.',
    },
    quiz_en: [
      { q: 'Which tag is used for a numbered list?', options: ['<ul>', '<ol>', '<nl>', '<list>'], correct: 1, explanation: '<ol> = Ordered List (numbered). <ul> = Unordered List (bullets). <li> is used for individual items in both.' },
      { q: 'Where is the <dl>, <dt>, <dd> combination used?', options: ['For navigation menus', 'For shopping lists', 'For terms and their definitions', 'For steps and instructions'], correct: 2, explanation: 'Description List (<dl>) is used for glossaries, dictionaries, FAQs — terms and their meanings.' },
      { q: 'What is the correct HTML structure for a navigation menu?', options: ['<nav><p>links</p></nav>', '<nav><ul><li><a>link</a></li></ul></nav>', '<menu><links></links></menu>', '<navigation><items></items></navigation>'], correct: 1, explanation: 'Best practice: <nav> wrapping a <ul>, with <li> items, each containing an <a> link. CSS can then hide the bullets.' },
    ],
  },
};

// ── WEEK 2 ────────────────────────────────────────────────────
const W2 = {
  'html-w2-s1': {
    title_en: 'Tables — Organising Data',
    content_en: `## HTML Tables — Data in Rows and Columns!

Tables are used to display structured data — spreadsheets, schedules, comparisons, price lists, etc.

### Basic Table Structure

\`\`\`html
<table>
  <tr>
    <th>Name</th>
    <th>Subject</th>
    <th>Marks</th>
  </tr>
  <tr>
    <td>Rahul</td>
    <td>Math</td>
    <td>95</td>
  </tr>
  <tr>
    <td>Priya</td>
    <td>Science</td>
    <td>88</td>
  </tr>
</table>
\`\`\`

### Table Tags:
| Tag | Purpose |
|-----|---------|
| \`<table>\` | The table container |
| \`<tr>\` | Table Row |
| \`<th>\` | Table Header (bold + centred by default) |
| \`<td>\` | Table Data (normal cell) |
| \`<thead>\` | Groups the header rows |
| \`<tbody>\` | Groups the body rows |
| \`<tfoot>\` | Groups the footer rows |

### Complete Table with Sections

\`\`\`html
<table border="1">
  <thead>
    <tr>
      <th>Product</th>
      <th>Price</th>
      <th>Stock</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Laptop</td>
      <td>₹45,000</td>
      <td>15</td>
    </tr>
    <tr>
      <td>Phone</td>
      <td>₹15,000</td>
      <td>42</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Total Items</td>
      <td>—</td>
      <td>57</td>
    </tr>
  </tfoot>
</table>
\`\`\`

### Cell Merging — colspan and rowspan

\`\`\`html
<table border="1">
  <tr>
    <!-- colspan: spans across 2 columns -->
    <th colspan="2">Student Information</th>
  </tr>
  <tr>
    <td>Name</td>
    <td>Rahul Kumar</td>
  </tr>
  <tr>
    <!-- rowspan: spans across 2 rows -->
    <td rowspan="2">Marks</td>
    <td>Math: 95</td>
  </tr>
  <tr>
    <td>Science: 88</td>
  </tr>
</table>
\`\`\`

### Important Note ⚠️
Use tables **only for tabular data** (data that fits in rows and columns). Using tables for page layout is an outdated practice. Use CSS Flexbox or Grid for layouts.`,
    codeExample_en: `<!DOCTYPE html>
<html>
  <head>
    <title>Student Report Card</title>
  </head>
  <body>
    <h1>📋 Student Report Card</h1>

    <table border="1" cellpadding="8">
      <thead>
        <tr>
          <th colspan="4">Class 10-A — Annual Result 2024</th>
        </tr>
        <tr>
          <th>Roll No.</th>
          <th>Student Name</th>
          <th>Subject</th>
          <th>Marks / 100</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowspan="3">101</td>
          <td rowspan="3">Rahul Kumar</td>
          <td>Mathematics</td>
          <td>95</td>
        </tr>
        <tr>
          <td>Science</td>
          <td>88</td>
        </tr>
        <tr>
          <td>English</td>
          <td>92</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Class Average</td>
          <td>91.7</td>
        </tr>
      </tfoot>
    </table>
  </body>
</html>`,
    task_en: {
      description: "Create your school or college Weekly Timetable as an HTML table. It must have: (1) 5 days (Monday–Friday) as columns, (2) 6 periods as rows, (3) A lunch break using colspan (merging all 5 day columns), (4) Proper <thead>, <tbody>, <tfoot> structure, (5) Total periods count in the footer.",
      hint: 'colspan="5" will merge from Monday to Friday. Put days in <thead>, periods in <tbody>, total in <tfoot>. Add cellpadding="8" for spacious cells.',
    },
    quiz_en: [
      { q: 'What is the difference between <th> and <td>?', options: ['No difference', '<th> is a header cell — bold and centred by default, <td> is a regular data cell', '<th> is only used in the first row', '<td> is only for numbers'], correct: 1, explanation: '<th> (Table Header) is automatically bold and centred — for column or row headers. <td> (Table Data) is for regular content.' },
      { q: 'What does colspan="3" do?', options: ['Splits a row into 3', 'Gives a cell the width of 3 columns', 'Merges 3 rows', 'Adds 3 items to a cell'], correct: 1, explanation: 'colspan="3" gives one cell the width of 3 columns — merging horizontally. rowspan merges vertically.' },
      { q: 'Is it correct to use <table> for page layout?', options: ['Yes, it is best practice', 'No, use CSS Flexbox or Grid for layout', 'Only for responsive design', 'Only on large screens'], correct: 1, explanation: 'Tables are for tabular data only. Use CSS Flexbox or Grid for page layouts.' },
    ],
  },

  'html-w2-s2': {
    title_en: 'Forms — Getting Input from Users',
    content_en: `## HTML Forms — User Interaction!

Forms are the most important part of websites — login, signup, search, checkout — they are all forms!

### Basic Form Structure

\`\`\`html
<form action="/submit" method="POST">
  <label for="name">Your Name:</label>
  <input type="text" id="name" name="name" placeholder="Enter name...">
  <button type="submit">Submit</button>
</form>
\`\`\`

### Form Attributes:
- **action**: Where the form data goes (server URL)
- **method**: How it gets there — GET (visible in URL) or POST (hidden, secure)

### Input Types — Most Important!

\`\`\`html
<input type="text" placeholder="Name">
<input type="password" placeholder="Password">
<input type="email" placeholder="email@example.com">
<input type="number" min="1" max="100" value="18">
<input type="tel" placeholder="+91 9876543210">
<input type="date">
<input type="color" value="#6366f1">
<input type="range" min="0" max="100" value="50">

<!-- Checkbox -->
<input type="checkbox" id="agree" name="agree">
<label for="agree">I agree to the Terms</label>

<!-- Radio buttons -->
<input type="radio" id="male" name="gender" value="male">
<label for="male">Male</label>
<input type="radio" id="female" name="gender" value="female">
<label for="female">Female</label>

<input type="file" accept=".jpg,.png,.pdf">
<input type="submit" value="Submit">
<input type="reset" value="Clear">
\`\`\`

### Textarea — Multiple Lines

\`\`\`html
<textarea name="message" rows="5" cols="40"
  placeholder="Write your message..."></textarea>
\`\`\`

### Select Dropdown

\`\`\`html
<select name="city">
  <option value="">-- Choose City --</option>
  <option value="mumbai">Mumbai</option>
  <option value="delhi" selected>Delhi</option>
  <option value="bangalore">Bangalore</option>
</select>
\`\`\`

### Label — Essential for Accessibility!

\`\`\`html
<label for="email">Email Address:</label>
<input type="email" id="email" name="email">
\`\`\`

**Clicking the label focuses the input** — great for accessibility!

### Required and Validation

\`\`\`html
<input type="text" name="name" required>
<input type="password" name="pass" minlength="8" required>
<input type="number" name="age" min="18" max="100" required>
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html>
  <head>
    <title>Registration Form</title>
  </head>
  <body>
    <h1>📝 Student Registration</h1>

    <form action="#" method="POST">
      <h3>Personal Information</h3>

      <label for="fullname">Full Name: *</label><br>
      <input type="text" id="fullname" name="fullname"
             placeholder="Your full name" required><br><br>

      <label for="email">Email: *</label><br>
      <input type="email" id="email" name="email"
             placeholder="email@example.com" required><br><br>

      <label for="phone">Phone Number:</label><br>
      <input type="tel" id="phone" name="phone"
             placeholder="+91 9876543210"><br><br>

      <label>Gender:</label><br>
      <input type="radio" id="male" name="gender" value="male">
      <label for="male">Male</label>
      <input type="radio" id="female" name="gender" value="female">
      <label for="female">Female</label><br><br>

      <h3>Course Details</h3>

      <label for="course">Choose Course: *</label><br>
      <select id="course" name="course" required>
        <option value="">-- Select Course --</option>
        <option value="html">HTML + CSS</option>
        <option value="python">Python Programming</option>
        <option value="fullstack">Full Stack Development</option>
      </select><br><br>

      <label for="message">Why do you want to learn? *</label><br>
      <textarea id="message" name="message" rows="4" cols="50"
                placeholder="Share your motivation..."
                required></textarea><br><br>

      <input type="checkbox" id="terms" name="terms" required>
      <label for="terms">I agree to Terms & Conditions *</label>
      <br><br>

      <button type="submit">Register! 🚀</button>
      <button type="reset">Clear Form</button>
    </form>
  </body>
</html>`,
    task_en: {
      description: 'Create a complete "Job Application Form". It must include: Personal Info (name, email, phone, date of birth), Professional Info (current job title, years of experience using range, skills using checkboxes — HTML/CSS/JS/Python/React), Upload section (resume file, profile photo), Salary expectation (number with min/max), Cover letter (textarea), and Submit/Reset buttons. Mark all required fields.',
      hint: 'Use separate input type="checkbox" for each skill. Range: min="0" max="20". For file: accept=".pdf,.doc". Mark required fields with an asterisk (*).',
    },
    quiz_en: [
      { q: 'What is the difference between method="POST" and method="GET" in a form?', options: ['No difference', 'GET shows data in the URL, POST sends data hidden', 'POST is faster', 'GET is only for reading'], correct: 1, explanation: 'GET: data appears in URL (?name=Rahul) — fine for search forms. POST: data is sent hidden — essential for login/signup (passwords must not appear in the URL).' },
      { q: 'What is the difference between radio buttons and checkboxes?', options: ['No difference', 'In a group, only one radio button can be selected, multiple checkboxes can be selected', 'Checkboxes are required', 'Radio buttons allow multiple selection'], correct: 1, explanation: 'Radio buttons (same name attribute) — only one can be selected at a time (e.g., gender). Checkboxes — multiple can be selected at once (e.g., skills).' },
      { q: 'What does the "for" attribute in <label for="email"> do?', options: ['Connects the label to the form', 'Sets the input name', 'Links the label to the input — clicking the label focuses the input', 'For styling purposes'], correct: 2, explanation: 'for="email" links the label to the input with id="email". Clicking the label automatically focuses that input — great for accessibility!' },
    ],
  },

  'html-w2-s3': {
    title_en: 'Semantic HTML — Meaningful Structure',
    content_en: `## Semantic HTML — Tags That Have Meaning!

Semantic HTML means using tags that **describe the purpose of the content** — not just for appearance, but for meaning too!

### Non-Semantic vs Semantic

\`\`\`html
<!-- ❌ Non-Semantic — just divs and spans -->
<div id="header">
  <div id="nav">...</div>
</div>
<div id="main">
  <div class="article">...</div>
</div>
<div id="footer">...</div>

<!-- ✅ Semantic — meaningful tags -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
  <aside>...</aside>
</main>
<footer>...</footer>
\`\`\`

### Main Semantic Tags

\`\`\`html
<header>
  <h1>StudyEarn AI 🚀</h1>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/courses">Courses</a></li>
    </ul>
  </nav>
</header>

<main>
  <!-- Self-contained content — blog post, news article -->
  <article>
    <h2>How to Learn HTML?</h2>
    <p>Learning HTML is very easy...</p>
  </article>

  <!-- Secondary content — sidebar, related links -->
  <aside>
    <h3>Related Articles</h3>
  </aside>

  <!-- A thematic group of related content -->
  <section>
    <h2>Featured Courses</h2>
    <article><h3>Python</h3></article>
    <article><h3>Web Dev</h3></article>
  </section>
</main>

<footer>
  <p>&copy; 2024 StudyEarn AI. All rights reserved.</p>
</footer>
\`\`\`

### More Semantic Tags

\`\`\`html
<figure>
  <img src="chart.png" alt="Sales Chart">
  <figcaption>Figure 1: Monthly Sales Data 2024</figcaption>
</figure>

<p>Published on <time datetime="2024-03-15">March 15, 2024</time></p>

<blockquote>
  <p>Education is the most powerful weapon.</p>
</blockquote>

<p><abbr title="HyperText Markup Language">HTML</abbr> is awesome!</p>

<p>Use the <code>print()</code> function in Python.</p>
\`\`\`

### Benefits of Semantic HTML:

1. **SEO** — Search engines better understand content structure
2. **Accessibility** — Screen readers can navigate properly
3. **Maintainability** — Code is easier to read and maintain
4. **Team collaboration** — Other developers understand code quickly`,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>StudyEarn AI Blog</title>
  </head>
  <body>
    <header>
      <h1>📚 StudyEarn AI Blog</h1>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Courses</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section>
        <h2>Latest Articles</h2>

        <article>
          <header>
            <h3>HTML Basics — Complete Guide</h3>
            <p>By <strong>Rahul Kumar</strong> |
               <time datetime="2024-03-15">March 15, 2024</time>
            </p>
          </header>

          <p>HTML (HyperText Markup Language) is the
          foundation of web development...</p>

          <figure>
            <img src="https://picsum.photos/400/200"
                 alt="HTML Code Screenshot" width="400">
            <figcaption>Figure 1: Basic HTML Structure</figcaption>
          </figure>

          <blockquote>
            <p>Learning HTML is the first step in web development.</p>
          </blockquote>
        </article>
      </section>

      <aside>
        <h3>Popular Courses</h3>
        <ul>
          <li><a href="#">Python Programming</a></li>
          <li><a href="#">Web Development</a></li>
          <li><a href="#">Data Science</a></li>
        </ul>
      </aside>
    </main>

    <footer>
      <p>&copy; 2024 StudyEarn AI. All rights reserved.</p>
    </footer>
  </body>
</html>`,
    task_en: {
      description: 'Create a complete semantic HTML webpage — "My Personal Website". Structure: <header> with your name + navigation (Home, About, Skills, Contact), <main> with: a <section> for "About Me" (an article with a figure and image), a <section> for "My Skills" (skills list), a <section> for "Projects" (2–3 project articles), <aside> with favourite quotes or links, <footer> with copyright and contact. Use proper semantic tags throughout.',
      hint: 'Add lang="en" to the <html> tag. Use <article> for self-contained content and <section> to group related items. Use <figure> with an image and <figcaption> below it.',
    },
    quiz_en: [
      { q: 'What is the difference between <article> and <section>?', options: ['No difference', '<article> is self-contained independent content, <section> is a thematic group of related content', '<section> is only for navigation', '<article> is only for text'], correct: 1, explanation: '<article> = independently meaningful content (blog post, product card) — makes sense on its own. <section> = a group of related content with a common theme.' },
      { q: 'What is the SEO benefit of Semantic HTML?', options: ['Page loads faster', 'Search engines better understand the content structure, improving ranking', 'Images get optimised', 'Code becomes smaller'], correct: 1, explanation: 'Google and other search engines use semantic tags (header, nav, main, article) to understand content importance and structure — this improves ranking.' },
      { q: 'When do you use <figure> and <figcaption>?', options: ['Only for photos', 'For images, diagrams, charts along with their caption/description', 'Only for large images', 'For background images'], correct: 1, explanation: '<figure> wraps an image, diagram, chart, or code block. <figcaption> provides its description — like "Figure 1:" captions in textbooks.' },
    ],
  },

  'html-w2-s4': {
    title_en: 'Week 2 Project — Personal Resume Webpage',
    content_en: `## Week 2 Project — Professional Resume Webpage!

Everything learned so far:
- Tables (organising data)
- Forms (getting user input)
- Semantic HTML (meaningful structure)

Now combine all of these to build a **complete professional resume webpage**!

### Resume HTML Structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rahul Kumar — Resume</title>
</head>
<body>

  <header>
    <h1>Rahul Kumar</h1>
    <p>Web Developer | Mumbai, India</p>
    <nav>
      <a href="mailto:rahul@gmail.com">📧 Email</a>
      <a href="tel:+919876543210">📞 Phone</a>
      <a href="https://linkedin.com/in/rahul" target="_blank">
        💼 LinkedIn
      </a>
    </nav>
  </header>

  <main>
    <section id="summary">
      <h2>Professional Summary</h2>
      <p>Passionate web developer with 2 years of experience
      building responsive websites...</p>
    </section>

    <section id="skills">
      <h2>Technical Skills</h2>
      <table>
        <tr><th>Category</th><th>Skills</th><th>Level</th></tr>
        <tr><td>Frontend</td><td>HTML, CSS, JS</td><td>Advanced</td></tr>
        <tr><td>Backend</td><td>Python</td><td>Intermediate</td></tr>
      </table>
    </section>

    <section id="education">
      <h2>Education</h2>
      <table>
        <thead>
          <tr><th>Degree</th><th>Institution</th><th>Year</th><th>Score</th></tr>
        </thead>
        <tbody>
          <tr><td>B.Tech CS</td><td>Mumbai University</td><td>2022</td><td>8.5 CGPA</td></tr>
        </tbody>
      </table>
    </section>

    <section id="contact">
      <h2>Contact Me</h2>
      <form action="#" method="POST">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <label for="msg">Message:</label>
        <textarea id="msg" name="message" rows="4" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </section>
  </main>

  <footer>
    <p>&copy; 2024 Rahul Kumar. Made with ❤️ using HTML</p>
  </footer>
</body>
</html>
\`\`\`

### What to include:
1. ✅ Header — name, title, contact links
2. ✅ About/Summary section
3. ✅ Skills table (category, skills, level)
4. ✅ Education table (degree, college, year, marks)
5. ✅ Projects section (use article tags)
6. ✅ Contact form (name, email, message)
7. ✅ Footer
8. ✅ Semantic tags throughout`,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arjun Singh — Web Developer Resume</title>
</head>
<body>

  <header>
    <h1>Arjun Singh</h1>
    <p><strong>Full Stack Developer</strong> | Bangalore, India</p>
    <nav>
      <a href="mailto:arjun@gmail.com">📧 arjun@gmail.com</a> |
      <a href="tel:+919876543210">📞 +91 98765 43210</a> |
      <a href="https://github.com/arjun" target="_blank" rel="noopener">
        💻 GitHub
      </a>
    </nav>
  </header>

  <main>
    <section id="summary">
      <h2>About Me</h2>
      <p>Passionate Full Stack Developer with expertise in modern
      web technologies. I love building applications that solve
      real problems.</p>
    </section>

    <section id="skills">
      <h2>Technical Skills</h2>
      <table border="1" cellpadding="8">
        <thead>
          <tr><th>Category</th><th>Technologies</th><th>Proficiency</th></tr>
        </thead>
        <tbody>
          <tr><td>Frontend</td><td>HTML5, CSS3, JavaScript, React</td><td>⭐⭐⭐⭐⭐</td></tr>
          <tr><td>Backend</td><td>Node.js, Python, Django</td><td>⭐⭐⭐⭐</td></tr>
          <tr><td>Database</td><td>MongoDB, PostgreSQL</td><td>⭐⭐⭐</td></tr>
        </tbody>
      </table>
    </section>

    <section id="projects">
      <h2>Projects</h2>
      <article>
        <h3>📚 StudyEarn AI Platform</h3>
        <p><strong>Tech:</strong> React, Node.js, MongoDB</p>
        <ul>
          <li>Built a complete ed-tech platform with AI features</li>
          <li>10,000+ students enrolled in beta</li>
        </ul>
        <p><a href="#" target="_blank">View Project →</a></p>
      </article>
    </section>

    <section id="contact">
      <h2>Get In Touch</h2>
      <form action="#" method="POST">
        <label for="cname">Name: *</label><br>
        <input type="text" id="cname" name="name" required><br><br>
        <label for="cemail">Email: *</label><br>
        <input type="email" id="cemail" name="email" required><br><br>
        <label for="cmsg">Message: *</label><br>
        <textarea id="cmsg" name="message" rows="5" required></textarea>
        <br><br>
        <button type="submit">Send Message 📨</button>
      </form>
    </section>
  </main>

  <footer>
    <p>&copy; 2024 Arjun Singh | Made with ❤️ using HTML</p>
  </footer>
</body>
</html>`,
    task_en: {
      description: 'Build your own professional resume webpage! Use real information: (1) Header — your name, title (Student / Aspiring Developer), contact links, (2) About Me — 2–3 sentences about yourself, (3) Skills table — categories (Programming/Tools/Languages), specific skills, level, (4) Education table — class/degree, school/college, year, percentage, (5) Hobbies/Interests as article tags, (6) Contact form — name, email, subject (dropdown), message. Use proper semantic HTML throughout.',
      hint: 'Use real info — this can become your actual portfolio page! Add lang="en" and meta charset="UTF-8". Give each section a proper id attribute (id="skills" etc.) so navigation links work.',
    },
    quiz_en: [
      { q: 'What is the best HTML tag for experience dates on a resume?', options: ['<date>', '<p>', '<time datetime="2024-01">', '<span>'], correct: 2, explanation: '<time datetime="2024-01"> is a semantic tag that provides machine-readable dates — useful for SEO and assistive technologies.' },
      { q: 'Why use method="POST" in a contact form?', options: ['POST is faster', 'POST data does not appear in the URL — personal information stays secure', 'POST is required', 'GET does not work in forms'], correct: 1, explanation: 'GET method shows data in the URL: ?name=Rahul&email=... — wrong for private info. POST sends data to the server hidden.' },
      { q: 'What is the benefit of using #id links in page navigation?', options: ['Opens a new page', 'Scrolls to that section on the same page', 'Opens an external website', 'Submits the form'], correct: 1, explanation: 'Clicking <a href="#skills"> scrolls the page to the element with id="skills" — great for single-page navigation!' },
    ],
  },
};

// ── WEEK 3 ────────────────────────────────────────────────────
const W3 = {
  'html-w3-s1': {
    title_en: 'Multimedia — Audio and Video',
    content_en: `## HTML5 Multimedia — Native Audio and Video Support!

Before HTML5, playing audio or video on websites required a Flash plugin. HTML5 made it all built-in!

### Video Tag

\`\`\`html
<video src="myvideo.mp4" controls width="640" height="360">
  <p>Your browser does not support video.</p>
</video>

<!-- Multiple formats for better compatibility -->
<video width="640" height="360" controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser does not support video.
</video>
\`\`\`

### Video Attributes:

\`\`\`html
<video
  src="demo.mp4"
  controls        <!-- Show play/pause/volume buttons -->
  autoplay        <!-- Play immediately on page load -->
  muted           <!-- Mute audio (required with autoplay) -->
  loop            <!-- Replay when finished -->
  poster="thumbnail.jpg"  <!-- Image shown before video loads -->
  width="800"
  preload="auto"
>
</video>
\`\`\`

### Audio Tag

\`\`\`html
<audio src="song.mp3" controls>
  Browser does not support audio.
</audio>

<audio controls loop>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
</audio>
\`\`\`

### Embed YouTube Video

\`\`\`html
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

### Responsive Video

\`\`\`html
<video src="video.mp4" controls style="width: 100%; max-width: 800px;">
</video>
\`\`\`

### Picture Tag — Responsive Images

\`\`\`html
<picture>
  <source media="(max-width: 600px)" srcset="small.jpg">
  <source media="(max-width: 1200px)" srcset="medium.jpg">
  <img src="large.jpg" alt="Beautiful landscape">
</picture>
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
      width="560" height="315"
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="YouTube video player"
      frameborder="0"
      allow="autoplay; encrypted-media; fullscreen"
      allowfullscreen
    ></iframe>
  </section>

  <section>
    <h2>Online Audio Player</h2>
    <audio controls>
      <source
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        type="audio/mpeg"
      >
      Your browser does not support audio.
    </audio>
  </section>

  <section>
    <h2>Responsive Images</h2>
    <picture>
      <source media="(min-width: 800px)"
              srcset="https://picsum.photos/800/400">
      <img src="https://picsum.photos/400/300"
           alt="Responsive image example"
           style="max-width: 100%">
    </picture>
    <p><em>A different image loads depending on screen size!</em></p>
  </section>

  <section>
    <h2>Image with Caption</h2>
    <figure>
      <img src="https://picsum.photos/600/300"
           alt="Demo image" width="600">
      <figcaption>Fig 1: Placeholder image from picsum.photos</figcaption>
    </figure>
  </section>
</body>
</html>`,
    task_en: {
      description: 'Create a "Media Gallery" webpage. It must have: (1) One embedded YouTube video (your favourite), (2) An audio player using an online audio URL, (3) 4 images in a responsive layout (you can use picsum.photos), (4) Proper alt text and figcaption for each image, (5) An iframe embedding another website (Wikipedia, Google Maps, etc.), (6) Proper semantic structure (header, main, sections, footer).',
      hint: 'YouTube embed URL: youtube.com/embed/VIDEO_ID (replace watch?v= with embed/). Google Maps can also be embedded via iframe — open Google Maps, click Share → Embed a map → copy the iframe code.',
    },
    quiz_en: [
      { q: 'Which attribute is required alongside autoplay in a video?', options: ['controls', 'muted', 'loop', 'poster'], correct: 1, explanation: 'Browsers allow autoplay only when the video is muted. Without the muted attribute, the browser will block autoplay.' },
      { q: 'Why use the <source> tag multiple times inside <video>?', options: ['To increase speed', 'Different browsers support different video formats — for fallback compatibility', 'To improve quality', 'To compress the file'], correct: 1, explanation: 'Chrome prefers MP4, Firefox also supports OGG. Multiple <source> tags let the browser choose the format it supports best.' },
      { q: 'What is the main use of the <picture> tag?', options: ['Styling images', 'Serving different images for different screen sizes', 'Showing multiple images at once', 'Animating images'], correct: 1, explanation: '<picture> is for responsive images — smaller file on mobile, larger on desktop. This optimises performance.' },
    ],
  },

  'html-w3-s2': {
    title_en: 'HTML5 APIs — Storage, Geolocation and More',
    content_en: `## HTML5 APIs — The Superpowers of the Browser!

HTML5 has given browsers many new capabilities. These APIs are used via JavaScript, but HTML sets them up.

### Local Storage — Save Data in the Browser

\`\`\`html
<input type="text" id="nameInput" placeholder="Your name">
<button onclick="saveName()">Save</button>
<button onclick="loadName()">Load</button>
<p id="output"></p>

<script>
  function saveName() {
    const name = document.getElementById('nameInput').value;
    localStorage.setItem('userName', name);
    alert('Name saved!');
  }

  function loadName() {
    const name = localStorage.getItem('userName');
    if (name) {
      document.getElementById('output').textContent =
        'Saved name: ' + name;
    } else {
      document.getElementById('output').textContent =
        'No name saved yet';
    }
  }
</script>
\`\`\`

### Geolocation — User's Location

\`\`\`html
<button onclick="getLocation()">Show My Location</button>
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
    }
  }
</script>
\`\`\`

### Canvas — Drawing in the Browser

\`\`\`html
<canvas id="myCanvas" width="400" height="200"
  style="border: 1px solid black;">
</canvas>

<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#6366f1';
  ctx.fillRect(10, 10, 150, 100);

  ctx.beginPath();
  ctx.arc(300, 100, 60, 0, 2 * Math.PI);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Hello Canvas!', 30, 60);
</script>
\`\`\`

### Drag and Drop

\`\`\`html
<div draggable="true" ondragstart="drag(event)" id="item1"
     style="background:violet; padding:10px; cursor:grab">
  Drag me! 🎯
</div>

<div ondrop="drop(event)" ondragover="allowDrop(event)"
     style="width:300px; height:150px; border:2px dashed gray">
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
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
    </canvas><br>
    <button onclick="drawShapes()">Draw Shapes!</button>
    <button onclick="clearCanvas()">Clear</button>
  </section>

  <section>
    <h2>🎯 Drag and Drop</h2>
    <div draggable="true" ondragstart="drag(event)" id="item1"
         style="background:#6366f1; color:white; padding:12px;
         margin:5px; cursor:grab; border-radius:6px; display:inline-block">
      🐍 Python
    </div>
    <div ondrop="drop(event)" ondragover="allowDrop(event)"
         style="width:200px; min-height:80px; border:3px dashed #ccc;
         border-radius:8px; padding:10px; margin-top:10px">
      Drop here 📥
    </div>
  </section>

  <script>
    function setTheme(theme) {
      localStorage.setItem('theme', theme);
      document.getElementById('themeStatus').textContent =
        'Theme saved: ' + theme;
    }
    const saved = localStorage.getItem('theme');
    if (saved) document.getElementById('themeStatus').textContent =
      'Saved theme: ' + saved;

    function drawShapes() {
      const ctx = document.getElementById('myCanvas').getContext('2d');
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(20, 20, 150, 80);
      ctx.beginPath();
      ctx.arc(350, 100, 70, 0, 2 * Math.PI);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('HTML5 Canvas!', 30, 65);
    }
    function clearCanvas() {
      const canvas = document.getElementById('myCanvas');
      canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
    }
    function allowDrop(ev) { ev.preventDefault(); }
    function drag(ev) { ev.dataTransfer.setData('text', ev.target.id); }
    function drop(ev) {
      ev.preventDefault();
      const id = ev.dataTransfer.getData('text');
      ev.target.appendChild(document.getElementById(id));
    }
  </script>
</body>
</html>`,
    task_en: {
      description: 'Build a "Mini Todo App" using HTML5 APIs: (1) Add todo items with an input and button, (2) Each todo has a delete button, (3) Todos are saved in localStorage (they persist after page reload), (4) Draw a simple banner on Canvas at the top (text + coloured rectangle), (5) Show total todo count. Note: Using JavaScript with HTML is fine — HTML5 APIs are accessed through JS!',
      hint: 'localStorage.setItem("todos", JSON.stringify(todosArray)) to save. JSON.parse(localStorage.getItem("todos")) to load. Load todos when the page opens.',
    },
    quiz_en: [
      { q: 'What is the difference between localStorage and sessionStorage?', options: ['No difference', 'localStorage saves permanently (even after tab close), sessionStorage is deleted when the tab closes', 'sessionStorage stores more data', 'localStorage only stores numbers'], correct: 1, explanation: 'localStorage = permanent (until the user manually clears it). sessionStorage = only for that browser session (tab/window close = data gone).' },
      { q: 'How do you draw on a Canvas element?', options: ['canvas.draw()', 'canvas.getContext("2d") returns a context object used for drawing', 'canvas.paint()', 'canvas.render()'], correct: 1, explanation: 'const ctx = canvas.getContext("2d") gives the 2D drawing context. Then use ctx.fillRect(), ctx.arc(), ctx.fillText() etc.' },
      { q: 'What is required to use the Geolocation API?', options: ['Nothing', "User's permission (allow in browser popup)", 'HTTPS connection', 'Both B and C'], correct: 3, explanation: 'Geolocation requires explicit user permission (browser popup). In production, HTTPS is also required for security.' },
    ],
  },

  'html-w3-s3': {
    title_en: 'Meta Tags and SEO — Rank on Google',
    content_en: `## Meta Tags — Information About Your Page!

Meta tags give the browser and search engines information about the page. Users don't see them directly, but they are VERY important!

### Essential Meta Tags

\`\`\`html
<head>
  <!-- Character encoding — essential for emojis and special characters -->
  <meta charset="UTF-8">

  <!-- ESSENTIAL for responsive design -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Page description — shown in Google search results -->
  <meta name="description"
    content="StudyEarn AI — gamified coding courses in Hindi & English.
    Learn Python, HTML, CSS, JavaScript with AI help. Free!">

  <!-- Keywords -->
  <meta name="keywords"
    content="HTML tutorial, coding in Hindi, web development course">

  <!-- Author -->
  <meta name="author" content="StudyEarn AI Team">

  <!-- Page title — THE MOST IMPORTANT SEO FACTOR -->
  <title>HTML Basics — Free Course | StudyEarn AI</title>
</head>
\`\`\`

### Open Graph Tags — Social Media Sharing

When someone shares your link on WhatsApp/Facebook, this creates a nice preview:

\`\`\`html
<meta property="og:title" content="HTML Basics — StudyEarn AI">
<meta property="og:description"
  content="Free HTML course in Hindi & English. AI-powered learning!">
<meta property="og:image"
  content="https://studyearnai.tech/og-image.png">
<meta property="og:url" content="https://studyearnai.tech/courses/html">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="HTML Basics — StudyEarn AI">
<meta name="twitter:description" content="Free HTML course!">
<meta name="twitter:image" content="https://studyearnai.tech/og-image.png">
\`\`\`

### Favicon — Browser Tab Icon

\`\`\`html
<link rel="icon" type="image/png" href="favicon.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-icon.png">
\`\`\`

### Robots Meta

\`\`\`html
<meta name="robots" content="index, follow">      <!-- Index this page -->
<meta name="robots" content="noindex, nofollow">  <!-- Don't index -->
<link rel="canonical" href="https://studyearnai.tech/html-course">
\`\`\`

### SEO Best Practices:
1. Keep **title tag** between 50–60 characters
2. Keep **description** between 150–160 characters — write it compellingly
3. **Only one H1** per page
4. **Alt text on every image**
5. **Fast page load speed**
6. **Mobile-friendly** design`,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Essential -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO -->
  <title>My Portfolio Website | Web Developer</title>
  <meta name="description"
    content="Rahul Kumar — passionate web developer from Mumbai.
    Specialising in HTML, CSS, JavaScript, and React.
    Available for freelance projects!">
  <meta name="keywords"
    content="web developer mumbai, html developer, freelance web designer">
  <meta name="author" content="Rahul Kumar">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://rahulkumar.dev">

  <!-- Open Graph -->
  <meta property="og:title" content="Rahul Kumar — Web Developer">
  <meta property="og:description"
    content="Passionate web developer building modern websites.">
  <meta property="og:image" content="https://rahulkumar.dev/profile-og.jpg">
  <meta property="og:url" content="https://rahulkumar.dev">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Rahul Kumar Portfolio">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:creator" content="@rahulkumar">

  <!-- Favicon -->
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
      <p>Passionate about building beautiful, fast, accessible websites.</p>
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
    task_en: {
      description: 'Optimise your previous website (resume or portfolio) for SEO: (1) Proper title tag (50–60 chars, include a keyword), (2) Meta description (150–160 chars, compelling), (3) Keywords meta tag (10–15 relevant keywords), (4) All meta tags (charset, viewport, author, robots), (5) Open Graph tags (title, description, image, url, type), (6) Twitter Card tags, (7) Simulate a Google Search Preview — add a section showing "This is how it will appear on Google:" with title + URL + description.',
      hint: 'Count your title tag characters — keep below 60! Description below 160. For og:image you can use picsum.photos/1200/630 (standard OG image size).',
    },
    quiz_en: [
      { q: 'What is the main purpose of the meta description tag?', options: ['Makes the page load faster', "Appears below the page title in Google search results — increases click-through rate", 'Optimises images', 'Improves security'], correct: 1, explanation: 'Meta description does not directly improve ranking, but it appears as the snippet in Google results — a compelling description means more clicks!' },
      { q: 'When are Open Graph tags useful?', options: ['For search engine optimisation', 'When someone shares a link on WhatsApp/Facebook/LinkedIn — shows a rich preview card', 'For page speed', 'For images'], correct: 1, explanation: 'og:title, og:description, og:image — these create the preview card when a link is shared on social media. Without OG tags, only an ugly plain URL is shown.' },
      { q: 'Why is the viewport meta tag essential?', options: ['Works on desktop', 'Required so the page displays at the correct size on mobile devices', 'For animations', 'For fonts'], correct: 1, explanation: 'Without the viewport meta tag, mobile devices render the page at desktop width — it appears very small. width=device-width makes it adjust to the mobile screen width.' },
    ],
  },

  'html-w3-s4': {
    title_en: 'Accessibility — Web for Everyone',
    content_en: `## Web Accessibility — Design for Everyone!

Around 1 billion people in the world live with disabilities. Accessible web design improves their experience — and also improves your website's SEO!

### ARIA Attributes — For Assistive Technology

\`\`\`html
<!-- aria-label — description when there is no visible text -->
<button aria-label="Search button">🔍</button>

<!-- aria-describedby — link description from another element -->
<input type="password" aria-describedby="pass-help">
<p id="pass-help">Password must be 8+ characters with 1 number</p>

<!-- aria-hidden — hide from screen readers -->
<span aria-hidden="true">🎉</span>  <!-- Decorative emoji -->

<!-- role — describe the purpose of an element -->
<div role="alert">⚠️ Important message!</div>

<!-- aria-expanded — open/close state of dropdowns -->
<button aria-expanded="false" aria-controls="dropdown">Menu ▼</button>
\`\`\`

### Skip Navigation Link

\`\`\`html
<!-- At the top of the page — keyboard users can skip navigation -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<header>
  <nav>...long navigation...</nav>
</header>

<main id="main-content">
  <!-- Main content here -->
</main>
\`\`\`

### Keyboard Navigation

\`\`\`html
<button tabindex="1">First focus</button>
<button tabindex="2">Second focus</button>
<button tabindex="0">Normal order</button>
<button tabindex="-1">Not focusable via Tab</button>
\`\`\`

### Accessible Forms

\`\`\`html
<form>
  <label for="name">
    Full Name
    <span aria-hidden="true" style="color:red">*</span>
  </label>
  <input type="text" id="name" name="name"
    required aria-required="true" autocomplete="name">

  <!-- Error message accessible to screen readers -->
  <div id="name-error" role="alert" aria-live="polite"></div>

  <!-- Fieldset and Legend for grouped inputs -->
  <fieldset>
    <legend>Select your gender:</legend>
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
    width: 1px; height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
</style>

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
- Text contrast ratio minimum 4.5:1
- All images must have alt text
- All form fields must have labels
- Must be keyboard navigable`,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessible Contact Form Demo</title>
  <style>
    .skip-link {
      position: absolute; top: -40px; left: 0;
      background: #6366f1; color: white;
      padding: 8px 16px; z-index: 100;
      text-decoration: none;
    }
    .skip-link:focus { top: 0; }
    :focus { outline: 3px solid #6366f1; outline-offset: 2px; }
    .sr-only {
      position: absolute; width: 1px; height: 1px;
      overflow: hidden; clip: rect(0,0,0,0);
    }
    .error { color: red; font-size: 0.875em; }
    label { display: block; margin-top: 12px; font-weight: bold; }
    input, textarea { display: block; width: 100%; padding: 8px; margin-top: 4px; }
  </style>
</head>
<body>

  <a href="#main-content" class="skip-link">Skip to main content</a>

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

      <form novalidate onsubmit="validateForm(event)"
            aria-describedby="form-instructions">

        <p id="form-instructions">
          Fields marked with
          <span aria-hidden="true" style="color:red">*</span>
          <span class="sr-only">asterisk</span>
          are required.
        </p>

        <label for="fullname">
          Full Name <span aria-hidden="true" style="color:red">*</span>
        </label>
        <input type="text" id="fullname" name="name"
               required aria-required="true"
               aria-describedby="name-error">
        <div id="name-error" class="error" role="alert"></div>

        <fieldset>
          <legend>How did you find us?</legend>
          <input type="radio" id="google" name="source" value="google">
          <label for="google">Google Search</label><br>
          <input type="radio" id="social" name="source" value="social">
          <label for="social">Social Media</label>
        </fieldset>

        <button type="submit">Send Message</button>
      </form>
    </section>
  </main>

  <footer>
    <p>&copy; 2024 | <a href="#">Privacy Policy</a></p>
  </footer>

  <script>
    function validateForm(e) {
      e.preventDefault();
      const name = document.getElementById('fullname');
      if (!name.value.trim()) {
        document.getElementById('name-error').textContent = '❌ Name is required';
        name.setAttribute('aria-invalid', 'true');
      } else {
        document.getElementById('name-error').textContent = '';
        name.removeAttribute('aria-invalid');
        alert('Form submitted successfully! ✅');
      }
    }
  </script>
</body>
</html>`,
    task_en: {
      description: 'Make your resume webpage fully accessible: (1) Add a skip navigation link, (2) Proper alt text on all images, (3) Every form field has a proper label with the for attribute, (4) ARIA labels on buttons that only have icons, (5) lang="en" on the html tag, (6) Test keyboard navigation (all elements must be reachable via Tab key), (7) Add focus visible styling (:focus with outline), (8) Use fieldset + legend for radio buttons in the contact form, (9) Create a "Screen Reader Test" section using the .sr-only class.',
      hint: ':focus { outline: 3px solid #6366f1; } in CSS. For skip link: position: absolute; top: -40px; and top: 0 on :focus. Add aria-label="" to buttons that only have an emoji or icon.',
    },
    quiz_en: [
      { q: 'When do you use the aria-label attribute?', options: ['On every element', 'When an element has no visible text or it is insufficient — to provide a description for screen readers', 'Only on images', 'Only on forms'], correct: 1, explanation: 'Icon-only buttons (🔍), logo images, close buttons (×) — these all need aria-label so screen reader users understand what the element does.' },
      { q: 'Why use a skip navigation link?', options: ['For visual design', 'Allows keyboard users to jump directly to the main content without traversing the entire navigation every time', 'For SEO', 'For mobile users'], correct: 1, explanation: 'Without a skip link, keyboard Tab users must go through every navigation item on every page. The skip link lets them jump straight to the main content.' },
      { q: 'What is the minimum text colour contrast ratio required under WCAG 2.1 Level AA?', options: ['2:1', '3:1', '4.5:1', '7:1'], correct: 2, explanation: 'WCAG Level AA requires a minimum contrast ratio of 4.5:1 for normal text. For large text (18pt+), 3:1 is sufficient. This is essential for visually impaired users.' },
    ],
  },
};

// ── WEEK 4 ────────────────────────────────────────────────────
const W4 = {
  'html-w4-s1': {
    title_en: 'Advanced Forms — Datalist, Progress, Meter',
    content_en: `## Advanced Form Elements — Powerful Browser Features!

### Datalist — Autocomplete with Custom Options

\`\`\`html
<label for="city">City:</label>
<input list="cities" id="city" name="city"
       placeholder="Type or choose a city">

<datalist id="cities">
  <option value="Mumbai">
  <option value="Delhi">
  <option value="Bangalore">
  <option value="Chennai">
  <option value="Kolkata">
</datalist>
\`\`\`

The user types → matching options appear. Free-form typing is also allowed!

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
<label for="download">Download Progress:</label>
<progress id="download" max="100" value="65">65%</progress>

<!-- Indeterminate (unknown progress) -->
<progress id="loading">Loading...</progress>
\`\`\`

### Meter — Gauge / Level Indicator

\`\`\`html
<label>Battery:</label>
<meter min="0" max="100" value="75" low="20" high="80" optimum="90">
  75%
</meter>

<label>Disk Space:</label>
<meter min="0" max="500" value="380" low="100" high="400" optimum="200">
  380GB used of 500GB
</meter>
\`\`\`

### Details and Summary — Accordion

\`\`\`html
<details>
  <summary>What is Python? (Click to expand)</summary>
  <p>Python is a high-level programming language that is
  very easy to learn and use.</p>
</details>

<details open>
  <!-- "open" attribute makes it expanded by default -->
  <summary>Important Note</summary>
  <p>This section will be expanded by default!</p>
</details>
\`\`\`

### Dialog — Modal Popup

\`\`\`html
<button onclick="document.getElementById('myDialog').showModal()">
  Open Dialog
</button>

<dialog id="myDialog">
  <h2>Confirm Action</h2>
  <p>Are you sure?</p>
  <button onclick="document.getElementById('myDialog').close()">
    Cancel
  </button>
  <button onclick="confirmAction()">Confirm</button>
</dialog>
\`\`\`

### Input Attributes

\`\`\`html
<!-- Pattern — regex validation -->
<input type="text" pattern="[0-9]{10}"
       title="10 digit phone number">

<!-- Autocomplete hints -->
<input type="text" autocomplete="name">
<input type="email" autocomplete="email">

<!-- Multiple files -->
<input type="file" multiple accept="image/*">

<!-- Capture camera on mobile -->
<input type="file" capture="camera" accept="image/*">
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Advanced Form Elements</title>
</head>
<body>
  <h1>🎛️ Advanced Form Elements Demo</h1>

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
    </datalist>
  </section>

  <section>
    <h2>Live Calculator — Output Tag</h2>
    <form oninput="calc.value=(parseFloat(x.value||0)*parseFloat(y.value||0)).toFixed(2)">
      <input type="number" name="x" id="x" value="5" step="0.1">
      ×
      <input type="number" name="y" id="y" value="3" step="0.1">
      = <output name="calc" for="x y">15.00</output>
    </form>
  </section>

  <section>
    <h2>Skill Progress Bars</h2>
    <p>HTML: <progress max="100" value="85">85%</progress> 85%</p>
    <p>CSS: <progress max="100" value="60">60%</progress> 60%</p>
    <p>JavaScript: <progress max="100" value="40">40%</progress> 40%</p>
  </section>

  <section>
    <h2>Meter — Storage Gauge</h2>
    <p>Storage Used:
      <meter min="0" max="100" value="73"
             low="60" high="85" optimum="30">73%</meter>
      73/100 GB
    </p>
  </section>

  <section>
    <h2>FAQ — Details/Summary</h2>
    <details>
      <summary>How long does it take to learn HTML?</summary>
      <p>Basic HTML can be learned in 2–3 weeks.
      For professional-level skills, 2–3 months of practice is needed.</p>
    </details>
    <details>
      <summary>What is the difference between HTML and HTML5?</summary>
      <p>HTML5 is the latest version, adding video, audio, canvas,
      localStorage, and geolocation features.</p>
    </details>
    <details open>
      <summary>⚡ Pro Tip (already expanded!)</summary>
      <p>Open Browser DevTools (F12) and inspect HTML —
      you can see the code of any website!</p>
    </details>
  </section>

  <section>
    <h2>Dialog — Modal Popup</h2>
    <button onclick="document.getElementById('demo').showModal()">
      Open Modal Dialog
    </button>
    <dialog id="demo">
      <h3>🎉 The Dialog Element</h3>
      <p>This is the native HTML5 dialog! No JavaScript library needed.</p>
      <button onclick="document.getElementById('demo').close()">Close</button>
    </dialog>
  </section>
</body>
</html>`,
    task_en: {
      description: 'Build a "Course Registration" advanced form. It must include: (1) Datalist for course selection (10 courses), (2) Fee calculator using the output tag (course_fee × discount = final_price), (3) A "Profile Completion" progress bar (updates dynamically as fields are filled), (4) FAQ section with 5 questions using details/summary, (5) Confirmation dialog before form submit, (6) Pattern validation for phone number, (7) Multiple file upload for documents.',
      hint: 'Progress bar update: listen to the oninput event on each form field, count filled fields, set progress.value = (filled/total * 100). For dialog: document.getElementById("id").showModal() and .close().',
    },
    quiz_en: [
      { q: 'What is the difference between <datalist> and <select>?', options: ['No difference', '<datalist> allows free-form typing + shows suggestions, <select> only allows listed options', '<select> supports more options', '<datalist> does not support the required attribute'], correct: 1, explanation: '<select> only allows choosing from predefined options. <datalist> shows suggestions but the user can also type anything — a hybrid approach!' },
      { q: 'What is the difference between <progress> and <meter>?', options: ['No difference', '<progress> shows task completion (0 to max), <meter> shows a scalar value within a known range', '<meter> is animated', '<progress> shows text'], correct: 1, explanation: '<progress> = for tasks (download, form completion). <meter> = for a specific range (battery, disk space, score). Meter has low/high/optimum attributes.' },
      { q: 'What is the default behaviour of the <details> element?', options: ['Expanded by default', 'Collapsed by default — expands on click', 'Requires JavaScript', 'Only shows text'], correct: 1, explanation: '<details> is closed by default — only the <summary> is shown. Clicking expands the content. The "open" attribute makes it expanded by default.' },
    ],
  },

  'html-w4-s2': {
    title_en: 'Iframes and Embedding — Include Other Websites',
    content_en: `## Iframes — A Window Within a Window!

An iframe (Inline Frame) lets you embed another webpage or website inside your own webpage.

### Basic Iframe

\`\`\`html
<iframe
  src="https://www.wikipedia.org"
  width="800"
  height="500"
  title="Wikipedia"
>
  Your browser does not support iframes.
</iframe>
\`\`\`

### Iframe Attributes

\`\`\`html
<iframe
  src="page.html"
  width="100%"
  height="400"
  title="Description"      <!-- REQUIRED for accessibility -->
  frameborder="0"           <!-- Remove border -->
  allow="camera; microphone; geolocation"
  allowfullscreen
  sandbox                   <!-- Security restrictions -->
  loading="lazy"            <!-- Lazy load -->
>
</iframe>
\`\`\`

### Common Embeds

\`\`\`html
<!-- YouTube Video -->
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="YouTube video" frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; fullscreen"
  allowfullscreen></iframe>

<!-- Google Maps -->
<iframe src="https://www.google.com/maps/embed?pb=..."
  width="600" height="450" style="border:0"
  title="Location Map" loading="lazy"></iframe>
\`\`\`

### Sandbox Attribute — Security

\`\`\`html
<!-- Without sandbox — iframe can do everything -->
<iframe src="untrusted.html"></iframe>

<!-- With sandbox — only allow specific things -->
<iframe src="untrusted.html"
  sandbox="allow-scripts allow-forms">
</iframe>
\`\`\`

### Responsive Iframes

\`\`\`html
<style>
  .video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 ratio */
    height: 0;
    overflow: hidden;
  }
  .video-container iframe {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
  }
</style>

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID"
    title="Video" frameborder="0" allowfullscreen></iframe>
</div>
\`\`\`

### Data Attributes — Store Custom Data

\`\`\`html
<div data-product-id="P001" data-price="999" data-category="electronics"
     onclick="addToCart(this)">
  <h3>Laptop</h3>
  <p>₹999</p>
</div>

<script>
  function addToCart(element) {
    const id = element.dataset.productId;
    const price = element.dataset.price;
    console.log('Added:', id, price);
  }
</script>
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Iframes and Data Attributes Demo</title>
  <style>
    .video-container {
      position: relative; padding-bottom: 56.25%;
      height: 0; overflow: hidden; max-width: 600px;
    }
    .video-container iframe {
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
    }
    .card {
      border: 1px solid #ccc; padding: 16px; margin: 8px;
      cursor: pointer; display: inline-block; border-radius: 8px;
    }
    .card:hover { background: #f0f0f0; }
  </style>
</head>
<body>
  <h1>🪟 Iframes and Data Attributes</h1>

  <section>
    <h2>YouTube Embed (Responsive)</h2>
    <div class="video-container">
      <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video" frameborder="0" allowfullscreen>
      </iframe>
    </div>
  </section>

  <section>
    <h2>Data Attributes — Course Cards</h2>
    <p>Click any card to see its details:</p>

    <div class="card"
         data-course-id="C001" data-name="Python Course"
         data-price="free" data-level="beginner"
         onclick="showInfo(this)">
      <h3>🐍 Python Course</h3>
      <p>Beginner Friendly</p>
    </div>

    <div class="card"
         data-course-id="C002" data-name="HTML Course"
         data-price="free" data-level="absolute-beginner"
         onclick="showInfo(this)">
      <h3>🌐 HTML Course</h3>
      <p>Absolute Beginner</p>
    </div>

    <div id="info-box"
         style="margin-top:16px; padding:12px; background:#f0f0f0;
                border-radius:8px; display:none">
    </div>
  </section>

  <script>
    function showInfo(el) {
      const box = document.getElementById('info-box');
      box.style.display = 'block';
      box.innerHTML = \`
        <strong>Course Details:</strong><br>
        ID: \${el.dataset.courseId}<br>
        Name: \${el.dataset.name}<br>
        Price: \${el.dataset.price}<br>
        Level: \${el.dataset.level}
      \`;
    }
  </script>
</body>
</html>`,
    task_en: {
      description: 'Build a "Learning Hub" webpage embedding: (1) A YouTube tutorial video (in a responsive container), (2) Google Maps showing your city, (3) A Wikipedia article in an iframe, (4) 6 course cards using data-* attributes (data-id, data-title, data-duration, data-level, data-price). Show course details on click using JavaScript. (5) Embed a Google Form or fake form, (6) Organise courses by category using details/summary.',
      hint: "Google Maps: search your location on maps.google.com → Share → Embed a map → copy the iframe code. Product cards with data attributes can also build add-to-cart or favourites functionality.",
    },
    quiz_en: [
      { q: 'Why is the title attribute important on an iframe?', options: ['For styling', 'For accessibility — screen readers understand the purpose of the iframe', 'For SEO', 'For sizing'], correct: 1, explanation: 'The title attribute tells screen readers what is inside the iframe (e.g., "YouTube tutorial video"). Without it, screen readers just say "frame" — not helpful!' },
      { q: 'What is the main purpose of data-* attributes?', options: ['For styling', 'To store custom data on HTML elements that can be accessed by JavaScript', 'To send server data', 'For validation'], correct: 1, explanation: 'data-* attributes store extra information on HTML elements. Then in JavaScript, access it with element.dataset.attributeName.' },
      { q: 'Why use the sandbox attribute on an iframe?', options: ['To improve performance', 'To restrict untrusted embedded content — for security', 'To limit size', 'To improve loading speed'], correct: 1, explanation: 'The sandbox attribute restricts the capabilities of embedded content — everything is blocked by default, then you specifically allow things (allow-scripts, allow-forms). Especially useful for third-party content.' },
    ],
  },

  'html-w4-s3': {
    title_en: 'Month 1 Project — Complete Portfolio Website',
    content_en: `## Month 1 Final Project — Professional Portfolio!

In one month you have learned:
- Week 1: HTML basics, headings, links, images, lists
- Week 2: Tables, forms, semantic HTML
- Week 3: Multimedia, HTML5 APIs, SEO, accessibility
- Week 4: Advanced forms, iframes, data attributes

Now combine everything to build a **complete professional portfolio website**!

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

### index.html — Content to Include:

\`\`\`html
1. Hero Section
   - Your name (h1)
   - Tagline (Web Developer | Student)
   - CTA buttons (View Work, Contact Me)

2. About Section
   - Short bio (2–3 paragraphs)
   - Profile photo (with proper alt text)
   - Key stats (years learning, projects done, etc.)

3. Skills Section
   - Progress bars per skill
   - Categories: Frontend, Programming, Tools

4. Projects Section
   - Each project in an <article> tag
   - Project image, title, description, tech used, links

5. FAQ
   - details/summary accordion

6. Contact Section
   - Advanced form (datalist, pattern validation)
   - Social media links
   - Embedded map
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
✅ Proper heading hierarchy
✅ ARIA attributes where needed
✅ Keyboard navigable
✅ Good colour contrast`,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Arjun Singh — Web Developer Portfolio</title>
  <meta name="description"
    content="Arjun Singh — passionate web developer from Bangalore.
    HTML, CSS, JavaScript, Python. Open to opportunities!">
  <meta property="og:title" content="Arjun Singh — Portfolio">
  <meta property="og:type" content="website">
  <style>
    .skip-link { position:absolute; top:-40px; left:0;
      background:#6366f1; color:white; padding:8px; z-index:100;
      text-decoration:none; }
    .skip-link:focus { top:0; }
    :focus { outline:3px solid #6366f1; outline-offset:2px; }
    body { font-family:Arial,sans-serif; margin:0; }
    section { padding:40px 20px; max-width:900px; margin:0 auto; }
    table { border-collapse:collapse; width:100%; }
    th,td { border:1px solid #ddd; padding:10px; text-align:left; }
    th { background:#6366f1; color:white; }
  </style>
</head>
<body>

  <a href="#main" class="skip-link">Skip to main content</a>

  <header>
    <nav aria-label="Main navigation"
         style="display:flex; gap:20px; padding:16px; background:#1a1a2e;">
      <a href="#about" style="color:white">About</a>
      <a href="#skills" style="color:white">Skills</a>
      <a href="#projects" style="color:white">Projects</a>
      <a href="#contact" style="color:white">Contact</a>
    </nav>
  </header>

  <main id="main">

    <section id="hero" style="text-align:center; background:#1a1a2e; color:white; padding:80px 20px">
      <h1>Arjun Singh</h1>
      <p>Full Stack Developer | Bangalore, India</p>
      <p>
        <a href="#projects" style="color:#a78bfa">View My Work →</a> |
        <a href="#contact" style="color:#a78bfa">Contact Me</a>
      </p>
    </section>

    <section id="about">
      <h2>About Me</h2>
      <figure style="float:right; margin-left:20px">
        <img src="https://picsum.photos/200/200" alt="Arjun Singh profile photo"
             width="200" style="border-radius:50%">
        <figcaption style="text-align:center">Arjun Singh</figcaption>
      </figure>
      <p>Passionate Full Stack Developer with 2+ years of experience
      building modern, responsive websites.</p>
    </section>

    <section id="skills">
      <h2>Technical Skills</h2>
      <table>
        <thead><tr><th>Category</th><th>Skills</th><th>Progress</th></tr></thead>
        <tbody>
          <tr><td>Frontend</td><td>HTML5, CSS3, JS</td>
              <td><progress max="10" value="9">90%</progress></td></tr>
          <tr><td>Backend</td><td>Python, Django</td>
              <td><progress max="10" value="6">60%</progress></td></tr>
        </tbody>
      </table>
    </section>

    <section id="projects">
      <h2>My Projects</h2>
      <article data-project-id="P001" data-tech="html,css,js">
        <h3>📚 StudyEarn AI Clone</h3>
        <img src="https://picsum.photos/600/300?random=1"
             alt="StudyEarn AI project screenshot" width="100%">
        <p>Ed-tech platform built with HTML, CSS, JavaScript.</p>
        <p><a href="#" target="_blank" rel="noopener">Live Demo →</a></p>
      </article>
    </section>

    <section>
      <h2>FAQ</h2>
      <details>
        <summary>Do you accept freelance projects?</summary>
        <p>Yes! I accept both short-term and long-term projects.
        Reach out via the contact form below.</p>
      </details>
    </section>

    <section id="contact">
      <h2>Get In Touch</h2>
      <form action="#" method="POST">
        <label for="cname">Your Name: *</label>
        <input type="text" id="cname" name="name" required autocomplete="name">
        <label for="cemail">Email: *</label>
        <input type="email" id="cemail" name="email" required>
        <label for="cmsg">Message: *</label>
        <textarea id="cmsg" name="message" rows="5" required></textarea>
        <br><br>
        <button type="submit">Send Message 📨</button>
      </form>
    </section>

  </main>

  <footer style="background:#1a1a2e; color:white; padding:20px; text-align:center">
    <p>&copy; 2024 Arjun Singh | Made with ❤️ using HTML</p>
  </footer>
</body>
</html>`,
    task_en: {
      description: 'Build your complete portfolio website — 2 files: index.html (main page) and contact.html (dedicated contact page). index.html must include: hero section (name + tagline + CTA), about section (photo + bio + stats), skills table (with progress bars), projects section (3 projects, real or fictional), FAQ (details/summary), embedded map or YouTube video. contact.html: advanced form (datalist, pattern validation, autocomplete), embedded map. Both pages: proper SEO meta tags, accessibility (lang, skip link, alt text, labels), navigation links between both pages.',
      hint: 'Use real information! Your actual skills, hobbies, projects. OpenStreetMap is free and easily embedded via iframe. Create 2 files and link with <a href="contact.html">.',
    },
    quiz_en: [
      { q: 'How do you link between pages in a multi-page website?', options: ['Using JavaScript', '<a href="page.html"> links pages in the same folder', 'Only use absolute URLs', 'A server is required'], correct: 1, explanation: 'Same folder: <a href="about.html">. Subfolder: <a href="pages/about.html">. Parent folder: <a href="../index.html">. These are relative paths — no server needed for local development.' },
      { q: 'What is the best way to embed a Google Maps or OpenStreetMap?', options: ['Screenshot image', 'Embed via <iframe> tag — gives an interactive map', 'JavaScript map library', 'CSS background image'], correct: 1, explanation: 'From maps.google.com or openstreetmap.org, use the "Embed" option to get an iframe code. This gives an interactive map — users can zoom and pan.' },
      { q: 'Is CSS also necessary alongside HTML for a professional portfolio?', options: ['No, HTML is enough', 'Yes, CSS provides the visual design — a pure HTML portfolio does not look professional today', 'Only for senior developers', 'CSS is optional'], correct: 1, explanation: 'HTML provides structure, CSS provides styling. A professional portfolio needs both — the next step is learning CSS! We cover this in Month 2.' },
    ],
  },

  'html-w4-s4': {
    title_en: 'Month 1 Review and Month 2 Preview',
    content_en: `## Month 1 Complete! What Have You Achieved? 🎉

In one month you learned an entire language — **HTML**! That is no small feat.

### Complete Month 1 Summary:

**Week 1 — HTML Basics:**
- HTML structure (DOCTYPE, html, head, body)
- Headings (h1–h6) and Paragraphs
- Links (<a href>) and Images (<img>)
- Lists (ul, ol, dl)

**Week 2 — Data and Input:**
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
- Iframes and embedding
- Data attributes
- Complete Portfolio Project

### HTML Tags You Have Mastered:

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

Now that the HTML structure is ready — it's time to make that plain, ugly HTML **beautiful**!

\`\`\`
Month 2 — CSS (Cascading Style Sheets):
  Week 5:  CSS Basics — Colours, Fonts, Backgrounds
  Week 6:  Box Model — Margin, Padding, Border
  Week 7:  Flexbox — Modern Layout
  Week 8:  CSS Grid — Advanced Layout + Responsive Design
\`\`\`

### Career Path:

\`\`\`
HTML Basics ✅
    ↓
CSS Styling (Month 2)
    ↓
JavaScript (Month 3)
    ↓
Junior Frontend Developer 🎯
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Month 1 — Complete Summary</title>
</head>
<body>

  <h1>🎉 HTML Month 1 — Complete!</h1>

  <section>
    <h2>Topics Covered</h2>
    <details open>
      <summary>Week 1 — HTML Basics ✅</summary>
      <ul>
        <li>HTML structure — DOCTYPE, html, head, body</li>
        <li>Headings h1–h6, paragraphs, text formatting</li>
        <li>Links (a href) and Images (img)</li>
        <li>Lists — ul, ol, dl</li>
      </ul>
    </details>
    <details open>
      <summary>Week 2 — Tables and Forms ✅</summary>
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
        <li>Iframes and data attributes</li>
        <li>Project: Complete Portfolio Website</li>
      </ul>
    </details>
  </section>

  <section>
    <h2>Self Assessment</h2>
    <table border="1" cellpadding="8">
      <thead>
        <tr><th>Skill</th><th>Progress</th><th>Level</th></tr>
      </thead>
      <tbody>
        <tr><td>HTML Structure</td>
            <td><progress max="10" value="9">90%</progress></td>
            <td>Advanced</td></tr>
        <tr><td>Forms</td>
            <td><progress max="10" value="8">80%</progress></td>
            <td>Good</td></tr>
        <tr><td>Semantic HTML</td>
            <td><progress max="10" value="7">70%</progress></td>
            <td>Good</td></tr>
        <tr><td>SEO & Meta Tags</td>
            <td><progress max="10" value="7">70%</progress></td>
            <td>Intermediate</td></tr>
        <tr><td>Accessibility</td>
            <td><progress max="10" value="6">60%</progress></td>
            <td>Intermediate</td></tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>🚀 Month 2 — CSS is Coming!</h2>
    <ol>
      <li>CSS Basics — Colours, Fonts, Backgrounds</li>
      <li>Box Model — Margin, Padding, Border</li>
      <li>Flexbox — Modern Layouts</li>
      <li>CSS Grid — Advanced Responsive Design</li>
    </ol>
    <blockquote>
      <p>"HTML provides structure, CSS provides beauty,
         JavaScript brings it to life!"</p>
    </blockquote>
  </section>

</body>
</html>`,
    task_en: {
      description: 'FINAL CHALLENGE — Complete Month 1: (1) Review your portfolio website — are all topics included? (2) Validate your HTML — paste your code at validator.w3.org and fix any errors, (3) Create a "Self Assessment" page with progress bars showing your level for each topic, (4) Write a README.html explaining your project (what you built, which tags you used, what you learned), (5) Check all pages link to each other correctly, (6) View it on mobile — do you have the viewport meta tag?',
      hint: 'W3C Validator: validator.w3.org — paste your HTML and check errors and warnings. This is professional practice! Use dl/dt/dd tags in the README for the features list.',
    },
    quiz_en: [
      { q: 'Why should you use the W3C HTML Validator?', options: ['For performance', 'To detect HTML errors — browsers handle invalid HTML gracefully, but valid HTML = better compatibility, SEO, and accessibility', 'For security', 'To optimise images'], correct: 1, explanation: 'validator.w3.org finds HTML errors. Browsers fix invalid HTML automatically, but valid HTML = better browser compatibility, better SEO, better accessibility.' },
      { q: 'What is the logical next step after learning HTML?', options: ['Directly learning JavaScript', 'Learning CSS — to make HTML look beautiful', 'Learning databases', 'Learning server-side programming'], correct: 1, explanation: 'Standard web dev path: HTML (structure) → CSS (styling) → JavaScript (interactivity). Without CSS, HTML looks like plain unstyled text!' },
      { q: 'What is the main benefit of building a portfolio website?', options: ['You get marks', 'Practical skills are demonstrated — recruiters can see real code', 'You get a certificate', 'Grades improve'], correct: 1, explanation: 'Portfolio = your live resume! Recruiters look at github.com/username or portfolio.com — they can see actual work, which is far more convincing than a CV.' },
    ],
  },
};

// ── Merge all sections ────────────────────────────────────────
export const HTML_ALL_EN = { ...W1, ...W2, ...W3, ...W4 };

/**
 * Apply English translations to course weeks.
 * - Merges title_en, content_en, codeExample_en directly on section
 * - Patches task with description_en and hint_en
 * - Patches each quiz question with q_en, options_en, explanation_en
 */
export function applyEnglishTranslations(courseWeeks, translationMap) {
  return courseWeeks.map(week => ({
    ...week,
    sections: week.sections.map(section => {
      const trans = translationMap[section.id];
      if (!trans) return section;

      // 1. Patch quiz questions
      let patchedQuiz = section.quiz;
      if (trans.quiz_en && section.quiz) {
        patchedQuiz = section.quiz.map((q, i) => {
          const enQ = trans.quiz_en[i];
          if (!enQ) return q;
          return { ...q, q_en: enQ.q, options_en: enQ.options, explanation_en: enQ.explanation };
        });
      }

      // 2. Patch task
      let patchedTask = section.task;
      if (trans.task_en && section.task) {
        patchedTask = {
          ...section.task,
          description_en: trans.task_en.description,
          hint_en: trans.task_en.hint,
        };
      }

      // 3. Spread title_en, content_en, codeExample_en
      const { quiz_en: _q, task_en: _t, ...restTrans } = trans;
      return { ...section, ...restTrans, quiz: patchedQuiz, task: patchedTask };
    }),
  }));
}