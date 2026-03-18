/**
 * StudyEarn AI — HTML/Web Dev Course English Translations
 * src/data/courses/html/translations_en.js
 *
 * ALL 48 sections (Weeks 1-12)
 * Same architecture as Python course
 * applyEnglishTranslations() merges into section objects
 */

// ── WEEK 1 ──────────────────────────────────────────────────
const W1 = {
  'html-w1-s1': {
    title_en: "What is HTML — The Skeleton of the Web",
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
| \`<p>\` | A paragraph of text |

### Pro Tip 🔥
Always indent your HTML properly — it makes reading and debugging much easier!`,
    codeExample_en: `<!DOCTYPE html>
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
    task_en: {
      description: "Apna pehla webpage banao! Ek HTML file banao jisme: (1) Title in tumhara naam ho, (2) Body in ek bada heading ho apne naam ke saath, (3) Teen paragraph ho — apne baare mein, apne sheher ke baare mein, and apne hobby ke baare mein.",
      hint: "<!DOCTYPE html> from shuru karo. <html> ke andar <head> and <body> dono chahiye. Heading for <h1>, paragraph for <p> use karo.",
    },
    quiz_en: [
      { q: 'HTML ka full form is?', options: ['HyperText Markup Language', 'High Text Modern Language', 'HyperText Modern Links', 'High Transfer Markup Language'], correct: 0, explanation: 'HTML = HyperText Markup Language. "HyperText" matlab links from connected text, "Markup" matlab tags from content mark karna.' },
      { q: '<body> tag ka what kaam hai?', options: ['Browser tab ka title set karna', 'Page ki styling karna', 'Screen pe dikhne wala saara content yahan hota hai', 'JavaScript code likhna'], correct: 2, explanation: '<body> in woh sab kuch hota is jo user screen pe dekhta is — text, images, buttons, etc.' },
      { q: 'Sahi HTML closing tag kaun sa hai?', options: ['<p/', '</p>', '</ p>', '(p)'], correct: 1, explanation: 'Closing tag in forward slash (/) hota is tag naam from pehle: </p>, </h1>, </body> etc.' },
    ],
  },

  'html-w1-s2': {
    title_en: "Headings and Paragraphs — Text Structure",
    content_en: `## Headings and Paragraphs — Structuring Text!

### Headings — h1 to h6
\`\`\`html
<h1>Largest Heading (Page Title)</h1>
<h2>Second Level</h2>
<h3>Third Level</h3>
<h4>Fourth Level</h4>
<h5>Fifth Level</h5>
<h6>Smallest Heading</h6>
\`\`\`

**Rule:** Use only ONE \`<h1>\` per page. It tells search engines what the page is about.

### Paragraphs
\`\`\`html
<p>This is a paragraph. It creates a new block of text.</p>
<p>This is another paragraph — automatically separated by space.</p>
\`\`\`

### Text Formatting
\`\`\`html
<b>Bold text</b>        — visually bold
<strong>Important!</strong>  — bold + semantic meaning

<i>Italic text</i>          — visually italic
<em>Emphasised text</em>     — italic + semantic meaning

<u>Underlined text</u>
<s>Strikethrough</s>

<sup>Superscript</sup>  e.g. 2<sup>10</sup>
<sub>Subscript</sub>    e.g. H<sub>2</sub>O

<mark>Highlighted text</mark>
<code>Inline code</code>
<pre>Preserved    spacing</pre>
\`\`\`

### Line Break and Horizontal Rule
\`\`\`html
First line<br>   <!-- Line break — no closing tag! -->
Second line

<hr>  <!-- Horizontal line — no closing tag! -->
\`\`\`

### Blockquote
\`\`\`html
<blockquote cite="https://source.com">
  "The best way to predict the future is to create it."
  <footer>— Abraham Lincoln</footer>
</blockquote>
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
    task_en: {
      description: "Ek \"Study Notes\" webpage banao. Ismein hona chahiye: (1) H1 in \"Meri Study Notes\" heading, (2) Teen subjects for H2 headings (Math, Science, English), (3) Har subject ke neeche ek paragraph us subject ke baare mein, (4) Important words bold mein, (5) Ek horizontal rule sections separate karne ke liye, (6) Koi ek subscript or superscript use karo (jaise H2O or x2).",
      hint: "<strong> bold ke liye, <em> italic ke liye, <hr> horizontal line ke liye, <sub> subscript for use karo.",
    },
    quiz_en: [
      { q: 'Kitne levels ke headings HTML in hote hain?', options: ['3', '4', '6', '8'], correct: 2, explanation: 'HTML in h1 from h6 tak 6 levels ke headings hote hain. h1 sabse bada and important, h6 sabse chhota.' },
      { q: '<strong> tag what karta hai?', options: ['Text to italic banata hai', 'Text to bold banata hai', 'Text to delete karta hai', 'Text to highlight karta hai'], correct: 1, explanation: '<strong> text to bold banata is and semantic importance bhi batata hai. <b> sirf visually bold karta hai.' },
      { q: '<br> tag ka what kaam hai?', options: ['New paragraph banata hai', 'Horizontal line add karta hai', 'Same paragraph in line break deta hai', 'Text bold karta hai'], correct: 2, explanation: '<br> ek line break deta is bina naya paragraph banaye. <hr> horizontal rule (line) deta hai.' },
    ],
  },

  'html-w1-s3': {
    title_en: "Links and Images — Connecting the Web",
    content_en: `## Links and Images — Connecting the Web!

### Links — \`<a>\` tag
\`\`\`html
<!-- External link -->
<a href="https://google.com">Visit Google</a>

<!-- Open in new tab -->
<a href="https://google.com" target="_blank" rel="noopener">Google (new tab)</a>

<!-- Internal page link -->
<a href="about.html">About Us</a>

<!-- Jump to section on same page -->
<a href="#contact">Jump to Contact</a>
<div id="contact">Contact Section</div>

<!-- Email link -->
<a href="mailto:me@email.com">Email Me</a>

<!-- Phone link -->
<a href="tel:+919876543210">Call Me</a>

<!-- Download link -->
<a href="resume.pdf" download>Download Resume</a>
\`\`\`

### Images — \`<img>\` tag
\`\`\`html
<!-- Basic image -->
<img src="photo.jpg" alt="My Photo">

<!-- With size -->
<img src="logo.png" alt="Company Logo" width="200" height="100">

<!-- From the internet -->
<img src="https://picsum.photos/400/300" alt="Random Photo">
\`\`\`

### alt Attribute — Very Important!
- Shown when the image fails to load
- Read by screen readers for visually impaired users
- Used by search engines (SEO)

### Figure and Figcaption
\`\`\`html
<figure>
  <img src="chart.png" alt="Sales Chart 2024">
  <figcaption>Fig 1: Annual sales growth 2024</figcaption>
</figure>
\`\`\`

### Image Best Practices
\`\`\`html
<!-- Always add alt text -->
<img src="cat.jpg" alt="Orange cat sleeping on a sofa">

<!-- Lazy loading — faster page load -->
<img src="photo.jpg" alt="Photo" loading="lazy">
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
    task_en: {
      description: "Ek \"My Favourite Things\" webpage banao. Ismein hona chahiye: (1) 5 favourite websites ke links (new tab in khulen), (2) 3 images — ek tumhari favorite jagah, ek favorite food, ek favorite activity (picsum.photos from or koi bhi online URL use kar sakte ho), (3) Har image pe click karne from koi related website khule, (4) Ek email link \"Contact Me\" section mein, (5) Proper alt text sab images pe.",
      hint: "picsum.photos/400/300 from placeholder images lo. Image to link banane for <a> ke andar <img> tag rakho. target=\"_blank\" and rel=\"noopener\" zaroor use karo.",
    },
    quiz_en: [
      { q: 'Link naye tab in kholne for which attribute use karte hain?', options: ['href="_blank"', 'target="_blank"', 'open="new"', 'link="newtab"'], correct: 1, explanation: 'target="_blank" link to naye browser tab in kholta hai. Security for rel="noopener noreferrer" bhi add karo.' },
      { q: '<img> tag in "alt" attribute why zaroori hai?', options: ['Image ki height set karna', 'Image ka alternative text — accessibility and SEO ke liye', 'Image ka size compress karna', 'Image to animate karna'], correct: 1, explanation: 'alt text screen readers use karte are blind users ke liye, search engines SEO ke liye, and browser show karta is jab image load na ho.' },
      { q: 'Email link banane for href in what likhte hain?', options: ['email:rahul@gmail.com', 'mail:rahul@gmail.com', 'mailto:rahul@gmail.com', 'send:rahul@gmail.com'], correct: 2, explanation: 'mailto: protocol use hota is email links ke liye. Click karne pe default email app khulta hai.' },
    ],
  },

  'html-w1-s4': {
    title_en: "Lists — Ordered, Unordered and Description",
    content_en: `## Lists — Organising Information!

### Unordered List (bullet points)
\`\`\`html
<ul>
  <li>Python</li>
  <li>JavaScript</li>
  <li>HTML & CSS</li>
</ul>
\`\`\`

### Ordered List (numbered)
\`\`\`html
<ol>
  <li>Download VS Code</li>
  <li>Install Live Server extension</li>
  <li>Create index.html</li>
  <li>Start coding!</li>
</ol>
\`\`\`

### Nested Lists
\`\`\`html
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Backend
    <ul>
      <li>Python (Django)</li>
      <li>Node.js</li>
    </ul>
  </li>
</ul>
\`\`\`

### Description List
\`\`\`html
<dl>
  <dt>HTML</dt>
  <dd>The structure of a webpage</dd>

  <dt>CSS</dt>
  <dd>The styling and appearance of a webpage</dd>

  <dt>JavaScript</dt>
  <dd>The behaviour and interactivity of a webpage</dd>
</dl>
\`\`\`

### Changing List Style
\`\`\`html
<!-- Ordered list types -->
<ol type="A">   <!-- A, B, C -->
<ol type="i">   <!-- i, ii, iii (Roman numerals) -->
<ol start="5">  <!-- Start from 5 -->

<!-- Unordered list styles (controlled with CSS) -->
<ul style="list-style-type: square;">
<ul style="list-style-type: circle;">
<ul style="list-style-type: none;">  <!-- No bullets -->
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
    task_en: {
      description: "Apni \"Dream Job\" ke baare in ek webpage banao. Ismein hona chahiye: (1) Ordered list in us job tak pahunchne ke 5 steps, (2) Unordered list in us job ke 5 skills chahiye (nested — har skill ke neeche 2-3 sub-skills bhi), (3) Description list in 4 important terms apni field se, (4) Ek navigation menu (Home, Skills, Goals, Contact), (5) Heading structure properly use karo (h1, h2, h3).",
      hint: "Nested list for <li> ke andar doosra <ul> or <ol> rakho. Description list in <dl>, <dt>, <dd> use karo. Navigation for <nav> tag ke andar <ul> rakho.",
    },
    quiz_en: [
      { q: 'Numbered list for which tag use karte hain?', options: ['<ul>', '<ol>', '<nl>', '<list>'], correct: 1, explanation: '<ol> = Ordered List (numbered). <ul> = Unordered List (bullets). <li> dono in individual items ke liye.' },
      { q: '<dl>, <dt>, <dd> ka combination kahan use hota hai?', options: ['Navigation menu ke liye', 'Shopping list ke liye', 'Terms and unki definitions ke liye', 'Steps and instructions ke liye'], correct: 2, explanation: 'Description List (<dl>) glossary, dictionary, FAQ jaisi cheezein banane for use hoti is — terms and unke meanings.' },
      { q: 'Navigation menu banane ka correct HTML structure which hai?', options: ['<nav><p>links</p></nav>', '<nav><ul><li><a>link</a></li></ul></nav>', '<menu><links></links></menu>', '<navigation><items></items></navigation>'], correct: 1, explanation: 'Best practice is <nav> ke andar <ul>, usme <li> items, and har item in <a> link. CSS from bullets baad in hide kar sakte hain.' },
    ],
  },

};

// ── WEEK 2 ──────────────────────────────────────────────────
const W2 = {
  'html-w2-s1': {
    title_en: "Tables — Organise Your Data",
    content_en: `## Tables — Organising Data in Rows and Columns!

### Basic Table Structure
\`\`\`html
<table border="1">
  <thead>                    <!-- Header rows -->
    <tr>                     <!-- Table Row -->
      <th>Name</th>          <!-- Table Header — bold + centered -->
      <th>Subject</th>
      <th>Marks</th>
    </tr>
  </thead>
  <tbody>                    <!-- Data rows -->
    <tr>
      <td>Rahul</td>         <!-- Table Data -->
      <td>Maths</td>
      <td>95</td>
    </tr>
    <tr>
      <td>Priya</td>
      <td>Science</td>
      <td>88</td>
    </tr>
  </tbody>
  <tfoot>                    <!-- Footer row -->
    <tr>
      <td colspan="2">Average</td>
      <td>91.5</td>
    </tr>
  </tfoot>
</table>
\`\`\`

### colspan and rowspan
\`\`\`html
<table border="1">
  <tr>
    <th colspan="3">Student Report</th>  <!-- spans 3 columns -->
  </tr>
  <tr>
    <td rowspan="2">Rahul</td>   <!-- spans 2 rows -->
    <td>Maths</td>
    <td>95</td>
  </tr>
  <tr>
    <td>Science</td>
    <td>88</td>
  </tr>
</table>
\`\`\`

### Styling Tables with CSS
\`\`\`html
<style>
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }
  th { background-color: #4472C4; color: white; }
  tr:nth-child(even) { background-color: #f2f2f2; }  /* zebra stripes */
  tr:hover { background-color: #ddd; }
</style>
\`\`\``,
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
          <th>Subjects</th>
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
        <tr>
          <td rowspan="3">102</td>
          <td rowspan="3">Priya Sharma</td>
          <td>Mathematics</td>
          <td>78</td>
        </tr>
        <tr>
          <td>Science</td>
          <td>91</td>
        </tr>
        <tr>
          <td>English</td>
          <td>85</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Class Average</td>
          <td>88.2</td>
        </tr>
      </tfoot>
    </table>
  </body>
</html>`,
    task_en: {
      description: "Apne school/college ka Weekly Timetable banao HTML table mein. Ismein hona chahiye: (1) 5 days (Monday-Friday) columns mein, (2) 6 periods rows mein, (3) Lunch break for colspan use karo (5 columns merge karo), (4) Proper <thead>, <tbody>, <tfoot> structure, (5) Footer in total periods count.",
      hint: "colspan=\"5\" from Monday from Friday tak merge hoga. <thead> in days, <tbody> in periods, <tfoot> in total. cellpadding=\"8\" from cells spacious lagengi.",
    },
    quiz_en: [
      { q: '<th> and <td> in what fark hai?', options: ['Koi fark nahi', '<th> header cell is — bold and centered by default, <td> regular data cell', '<th> sirf first row in use hota hai', '<td> sirf numbers ke liye'], correct: 1, explanation: '<th> (Table Header) automatically bold and center hota is — column/row headers ke liye. <td> (Table Data) regular content ke liye.' },
      { q: 'colspan="3" what karta hai?', options: ['Row to 3 hissa karta hai', 'Cell to 3 columns ki width deta hai', '3 rows merge karta hai', 'Cell in 3 items add karta hai'], correct: 1, explanation: 'colspan="3" ek cell to 3 columns ki width deta is — horizontally merge karta hai. rowspan vertically merge karta hai.' },
      { q: 'Table layout for <table> use karna correct hai?', options: ['Haan, yeh best practice hai', 'Nahi, layout for CSS Flexbox/Grid use karo', 'Sirf responsive design mein', 'Sirf large screens pe'], correct: 1, explanation: 'Tables sirf tabular data for are (rows/columns in fit data). Page layout for CSS Flexbox or Grid use karo.' },
    ],
  },

  'html-w2-s2': {
    title_en: "Forms — Getting Input from Users",
    content_en: `## Forms — Getting Input from Users!

### Basic Form Structure
\`\`\`html
<form action="/submit" method="POST">
  <!-- Input fields go here -->
  <input type="submit" value="Submit">
</form>
\`\`\`

### Input Types
\`\`\`html
<!-- Text -->
<input type="text"     name="name"     placeholder="Your name">
<input type="email"    name="email"    placeholder="email@example.com">
<input type="password" name="pwd"      placeholder="Password">
<input type="number"   name="age"      min="1" max="120">
<input type="tel"      name="phone"    placeholder="9876543210">
<input type="url"      name="website"  placeholder="https://">
<input type="date"     name="dob">
<input type="time"     name="meeting">
<input type="color"    name="fav_color">
<input type="range"    name="volume"   min="0" max="100" step="5">
<input type="file"     name="photo"    accept="image/*">

<!-- Checkbox and Radio -->
<input type="checkbox" name="agree" id="agree">
<label for="agree">I agree to terms</label>

<input type="radio" name="gender" value="male" id="male">
<label for="male">Male</label>
<input type="radio" name="gender" value="female" id="female">
<label for="female">Female</label>
\`\`\`

### Textarea and Select
\`\`\`html
<textarea name="message" rows="5" cols="40" placeholder="Your message..."></textarea>

<select name="city">
  <option value="">-- Select City --</option>
  <option value="mumbai">Mumbai</option>
  <option value="delhi">Delhi</option>
  <option value="bangalore">Bangalore</option>
</select>
\`\`\`

### Labels — Essential for Accessibility
\`\`\`html
<!-- Method 1: for + id -->
<label for="email">Email:</label>
<input type="email" id="email" name="email">

<!-- Method 2: wrap the input -->
<label>
  Phone:
  <input type="tel" name="phone">
</label>
\`\`\`

### Form Validation
\`\`\`html
<input type="text"  name="name"  required minlength="2" maxlength="50">
<input type="email" name="email" required>
<input type="number" name="age" required min="18" max="100">
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
             placeholder="Apna pura naam" required><br><br>

      <label for="email">Email: *</label><br>
      <input type="email" id="email" name="email"
             placeholder="email@example.com" required><br><br>

      <label for="phone">Phone Number:</label><br>
      <input type="tel" id="phone" name="phone"
             placeholder="+91 9876543210"><br><br>

      <label for="dob">Date of Birth:</label><br>
      <input type="date" id="dob" name="dob"><br><br>

      <label>Gender:</label><br>
      <input type="radio" id="male" name="gender" value="male">
      <label for="male">Male</label>
      <input type="radio" id="female" name="gender" value="female">
      <label for="female">Female</label>
      <input type="radio" id="other" name="gender" value="other">
      <label for="other">Other</label><br><br>

      <h3>Course Details</h3>

      <label for="course">Choose Course: *</label><br>
      <select id="course" name="course" required>
        <option value="">-- Course chunno --</option>
        <option value="html">HTML + CSS</option>
        <option value="python">Python Programming</option>
        <option value="fullstack">Full Stack Development</option>
        <option value="datascience">Data Science</option>
      </select><br><br>

      <label for="experience">Coding Experience:</label><br>
      <input type="range" id="experience" name="experience"
             min="0" max="5" value="0">
      <span>0-5 years</span><br><br>

      <label for="message">Why do you want to learn? *</label><br>
      <textarea id="message" name="message" rows="4" cols="50"
                placeholder="Apni motivation share karo..."
                required></textarea><br><br>

      <label for="photo">Profile Photo:</label><br>
      <input type="file" id="photo" name="photo"
             accept=".jpg,.jpeg,.png"><br><br>

      <input type="checkbox" id="terms" name="terms" required>
      <label for="terms">Main Terms & Conditions se agree karta/karti hoon *</label>
      <br><br>

      <button type="submit">Register Karo! 🚀</button>
      <button type="reset">Clear Form</button>

    </form>
  </body>
</html>`,
    task_en: {
      description: "Ek complete \"Job Application Form\" banao. Ismein hona chahiye: Personal Info (naam, email, phone, date of birth), Professional Info (current job title, experience in years using range, skills using checkboxes — HTML/CSS/JS/Python/React in from multiple), Upload section (resume file upload, profile photo), Salary expectation (number input with min/max), Cover letter (textarea), and Submit/Reset buttons. Saare required fields mark karo.",
      hint: "Checkboxes for alag alag input type=\"checkbox\" use karo har skill ke liye. Range for min=\"0\" max=\"20\". File for accept=\".pdf,.doc\" specify karo.",
    },
    quiz_en: [
      { q: 'Form in method="POST" and method="GET" in what fark hai?', options: ['Koi fark nahi', 'GET data URL in show karta hai, POST data hidden bhejta hai', 'POST faster hai', 'GET sirf read ke liye'], correct: 1, explanation: 'GET: data URL in dikhta is (?name=Rahul) — search forms for theek hai. POST: data hidden bhejta is — login/signup for zaroori (password URL in not dikhna chahiye).' },
      { q: 'Radio buttons and checkboxes in what fark hai?', options: ['Koi fark nahi', 'Radio buttons ek group in sirf ek select hota hai, checkboxes multiple select kar sakte hain', 'Checkboxes required hote hain', 'Radio buttons multiple select kar sakte hain'], correct: 1, explanation: 'Radio buttons (same name attribute) — sirf ek select hota is (like gender). Checkboxes — multiple select kar sakte are (like skills).' },
      { q: '<label for="email"> in "for" attribute what karta hai?', options: ['Label to form from connect karta hai', 'Input ka naam set karta hai', 'Label to input from link karta is — label click pe input focus hota hai', 'Styling ke liye'], correct: 2, explanation: 'for="email" label to us input from link karta is jiska id="email" ho. Label click karne pe input automatically focus ho jaata is — great for accessibility!' },
    ],
  },

  'html-w2-s3': {
    title_en: "Semantic HTML — Meaningful Structure",
    content_en: `## Semantic HTML — Meaningful Structure!

### What is Semantic HTML?
Semantic HTML uses tags that **describe their meaning** — to both humans and browsers.

\`\`\`html
<!-- ❌ Non-semantic — meaningless divs -->
<div id="header">...</div>
<div id="nav">...</div>
<div id="main">...</div>
<div id="footer">...</div>

<!-- ✅ Semantic — self-describing tags -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>
\`\`\`

### The Main Semantic Tags
\`\`\`html
<header>   — Page/section header (logo, title, nav)
<nav>      — Navigation links
<main>     — Main content (only ONE per page)
<section>  — A standalone section
<article>  — Self-contained content (blog post, news item)
<aside>    — Sidebar / supplementary content
<footer>   — Page/section footer
<figure>   — Image with caption
<time>     — Date/time value
<address>  — Contact information
<details>  — Expandable content (accordion)
<summary>  — Summary for <details>
\`\`\`

### Full Page Structure
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>StudyEarn Blog</title>
</head>
<body>
  <header>
    <h1>StudyEarn Blog</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>

  <main>
    <article>
      <h2>Learning HTML in 2024</h2>
      <time datetime="2024-01-15">January 15, 2024</time>
      <p>HTML is still the foundation...</p>
    </article>
    <aside>
      <h3>Related Posts</h3>
    </aside>
  </main>

  <footer>
    <p>© 2024 StudyEarn</p>
    <address>Email: <a href="mailto:hi@studyearn.ai">hi@studyearn.ai</a></address>
  </footer>
</body>
</html>
\`\`\`

### Why Semantic HTML Matters:
1. **SEO** — Search engines understand your content better
2. **Accessibility** — Screen readers navigate correctly
3. **Maintainability** — Code is easier to understand
4. **Developer Tools** — Browser devtools work better`,
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

          <p>HTML (HyperText Markup Language) web development
          ka foundation hai. Is article mein hum...</p>

          <figure>
            <img src="https://picsum.photos/400/200"
                 alt="HTML Code Screenshot" width="400">
            <figcaption>Figure 1: Basic HTML Structure</figcaption>
          </figure>

          <blockquote>
            <p>HTML sikhna web development ki pehli step hai.</p>
          </blockquote>

          <footer>
            <p>Tags: <a href="#">HTML</a>, <a href="#">Web Dev</a></p>
          </footer>
        </article>

      </section>

      <aside>
        <h3>Popular Courses</h3>
        <ul>
          <li><a href="#">Python Programming</a></li>
          <li><a href="#">Web Development</a></li>
          <li><a href="#">Data Science</a></li>
        </ul>

        <address>
          <strong>Contact Us:</strong><br>
          <a href="mailto:info@studyearnai.tech">info@studyearnai.tech</a>
        </address>
      </aside>

    </main>

    <footer>
      <p>&copy; 2024 StudyEarn AI. All rights reserved.</p>
      <nav>
        <a href="#">Privacy Policy</a> |
        <a href="#">Terms of Service</a>
      </nav>
    </footer>

  </body>
</html>`,
    task_en: {
      description: "Ek complete semantic HTML webpage banao — \"Meri Personal Website\". Structure: <header> in naam + navigation (Home, About, Skills, Contact), <main> mein: ek <section> \"About Me\" for (apne baare in ek article with figure and image), ek <section> \"My Skills\" for (skills list), ek <section> \"Projects\" for (2-3 project articles), <aside> in favourite quotes or links, <footer> in copyright and contact. Har jagah proper semantic tags use karo.",
      hint: "lang=\"en\" attribute <html> tag in add karo. <article> self-contained content ke liye, <section> related items group karne ke liye. <figure> ke saath image and <figcaption> use karo.",
    },
    quiz_en: [
      { q: '<article> and <section> in what fark hai?', options: ['Koi fark nahi', '<article> self-contained independent content, <section> related content ka thematic group', '<section> sirf navigation ke liye', '<article> sirf text ke liye'], correct: 1, explanation: '<article> = independently meaningful content (blog post, news article, product card) — akele bhi sense banaata hai. <section> = related content ka group jiska ek theme ho.' },
      { q: 'Semantic HTML ka SEO benefit is?', options: ['Page faster load hota hai', 'Search engines content structure better samjhte are and ranking improve hoti hai', 'Images optimize hoti hain', 'Code chhota hota hai'], correct: 1, explanation: 'Google and other search engines semantic tags (header, nav, main, article) use karke content ka importance and structure samjhte are — isse ranking improve hoti hai.' },
      { q: '<figure> and <figcaption> when use karte hain?', options: ['Sirf photos ke liye', 'Images, diagrams, charts ke saath unki caption/description ke liye', 'Sirf large images ke liye', 'Background images ke liye'], correct: 1, explanation: '<figure> image/diagram/chart/code to wrap karta hai. <figcaption> uski description deta is — jaise textbooks in "Figure 1:" captions hote hain.' },
    ],
  },

  'html-w2-s4': {
    title_en: "Week 2 Project — Personal Resume Webpage",
    content_en: `## Week 2 Project — Personal Resume Webpage!

Build a complete, professional-looking resume as a webpage — no CSS yet, pure HTML!

### Required Sections:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Your Name — Resume</title>
</head>
<body>

  <header>
    <h1>Your Full Name</h1>
    <p>Web Developer | Student | Python Enthusiast</p>
    <address>
      📍 City, State |
      📧 <a href="mailto:you@email.com">you@email.com</a> |
      📞 <a href="tel:+91XXXXXXXXXX">+91-XXXXXXXXXX</a>
    </address>
  </header>

  <nav>
    <a href="#education">Education</a> |
    <a href="#skills">Skills</a> |
    <a href="#projects">Projects</a>
  </nav>

  <main>
    <section id="education">
      <h2>Education</h2>
      <!-- Table with School/College, Year, Percentage -->
    </section>

    <section id="skills">
      <h2>Skills</h2>
      <!-- Unordered list of skills -->
    </section>

    <section id="projects">
      <h2>Projects</h2>
      <!-- Description list: project name + description -->
    </section>
  </main>

  <footer>
    <p>Last updated: <time datetime="2024-01">January 2024</time></p>
  </footer>

</body>
</html>
\`\`\``,
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
      real problems and create great user experiences.</p>
    </section>

    <section id="skills">
      <h2>Technical Skills</h2>
      <table border="1" cellpadding="8">
        <thead>
          <tr>
            <th>Category</th>
            <th>Technologies</th>
            <th>Proficiency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Frontend</td>
            <td>HTML5, CSS3, JavaScript, React</td>
            <td>⭐⭐⭐⭐⭐</td>
          </tr>
          <tr>
            <td>Backend</td>
            <td>Node.js, Python, Django</td>
            <td>⭐⭐⭐⭐</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>MongoDB, PostgreSQL</td>
            <td>⭐⭐⭐</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="projects">
      <h2>Projects</h2>

      <article>
        <h3>📚 StudyEarn AI Platform</h3>
        <p>
          <strong>Tech:</strong> React, Node.js, MongoDB<br>
          <strong>Duration:</strong>
          <time datetime="2024-01">Jan 2024</time> —
          <time datetime="2024-03">Mar 2024</time>
        </p>
        <ul>
          <li>Built complete ed-tech platform with AI features</li>
          <li>10,000+ students enrolled in beta</li>
          <li>Achieved 98% uptime</li>
        </ul>
        <p><a href="#" target="_blank">View Project →</a></p>
      </article>

    </section>

    <section id="contact">
      <h2>Get In Touch</h2>
      <form action="#" method="POST">
        <label for="name">Name: *</label><br>
        <input type="text" id="name" name="name"
               placeholder="Your name" required><br><br>

        <label for="email">Email: *</label><br>
        <input type="email" id="email" name="email"
               placeholder="your@email.com" required><br><br>

        <label for="subject">Subject:</label><br>
        <select id="subject" name="subject">
          <option value="">Select...</option>
          <option value="job">Job Opportunity</option>
          <option value="project">Project Collaboration</option>
          <option value="other">Other</option>
        </select><br><br>

        <label for="message">Message: *</label><br>
        <textarea id="message" name="message" rows="5"
                  placeholder="Your message..." required></textarea>
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
      description: "Apna khud ka professional resume webpage banao! Ismein real information use karo: (1) Header — apna naam, title (Student / Aspiring Developer), contact links, (2) About Me section — apne baare in 2-3 sentences, (3) Skills table — categories (Programming/Tools/Languages), specific skills, and level, (4) Education table — class/degree, school/college, year, percentage, (5) Hobbies/Interests section as article tags, (6) Contact form — naam, email, subject (dropdown), message. Proper semantic HTML use karo throughout.",
      hint: "Real info use karo — yeh tumhara actual portfolio page ban sakta hai! lang=\"en\" and meta charset=\"UTF-8\" zaroor add karo. Har section to proper id attribute do (id=\"skills\" etc.) taaki navigation links kaam karein.",
    },
    quiz_en: [
      { q: 'Resume webpage in experience dates for best HTML tag which hai?', options: ['<date>', '<p>', '<time datetime="2024-01">', '<span>'], correct: 2, explanation: '<time datetime="2024-01"> semantic tag is jo machine-readable date provide karta is — SEO for and assistive technologies for useful.' },
      { q: 'Contact form in method="POST" why use karna chahiye?', options: ['POST faster hota hai', 'POST data URL in show not hota — personal info secure rehti hai', 'POST required hota hai', 'GET kaam not karta forms mein'], correct: 1, explanation: 'GET method data URL in show karta hai: ?name=Rahul&email=... — yeh private info for wrong hai. POST data server to hidden bhejta hai.' },
      { q: 'Page navigation in #id links use karne ka what faida hai?', options: ['New page khulta hai', 'Same page ke kisi section pe scroll ho jaata hai', 'External website pe jaata hai', 'Form submit hota hai'], correct: 1, explanation: '<a href="#skills"> click karne pe page same page ke id="skills" element pe scroll ho jaata is — single-page navigation for useful!' },
    ],
  },

};

// ── WEEK 3 ──────────────────────────────────────────────────
const W3 = {
  'html-w3-s1': {
    title_en: "Multimedia — Audio and Video",
    content_en: `## Multimedia — Audio and Video in HTML!

### Video — \`<video>\` tag
\`\`\`html
<video width="640" height="360" controls>
  <source src="video.mp4"  type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser does not support video.  <!-- Fallback text -->
</video>
\`\`\`

### Video Attributes
\`\`\`html
<!-- Autoplay + muted (muted required for autoplay) -->
<video autoplay muted loop>

<!-- Poster image before playing -->
<video controls poster="thumbnail.jpg">

<!-- Preload options -->
<video preload="auto">    <!-- Load everything -->
<video preload="metadata"><!-- Load only metadata -->
<video preload="none">    <!-- Load nothing until play -->
\`\`\`

### Audio — \`<audio>\` tag
\`\`\`html
<audio controls>
  <source src="song.mp3" type="audio/mpeg">
  <source src="song.ogg" type="audio/ogg">
  Your browser does not support audio.
</audio>
\`\`\`

### Embed YouTube Video
\`\`\`html
<!-- Get embed code from YouTube: Share → Embed -->
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Video title"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media"
  allowfullscreen>
</iframe>
\`\`\`

### Responsive Video (CSS trick)
\`\`\`html
<style>
  .video-container {
    position: relative;
    padding-bottom: 56.25%;  /* 16:9 ratio */
    height: 0;
    overflow: hidden;
  }
  .video-container iframe {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
  }
</style>
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
    task_en: {
      description: "Ek \"Media Gallery\" webpage banao. Ismein hona chahiye: (1) Ek YouTube video embedded (apna favourite video), (2) Ek audio player online audio URL se, (3) 4 images responsive layout in (picsum.photos use kar sakte ho), (4) Har image ke saath proper alt text and figcaption, (5) Ek section in kisi bhi doosri website ka iframe embed karo (Wikipedia, Google Maps, etc.), (6) Proper semantic structure (header, main, sections, footer).",
      hint: "YouTube embed URL: youtube.com/embed/VIDEO_ID (watch?v= wali URL to embed/ from replace karo). Google Maps bhi iframe from embed ho sakta is — Google Maps open karo, Share \u2192 Embed karo.",
    },
    quiz_en: [
      { q: 'Video in autoplay use karne ke saath kounsa attribute zaroori hai?', options: ['controls', 'muted', 'loop', 'poster'], correct: 1, explanation: 'Browsers autoplay tab allow karte are jab video muted ho. muted attribute add karo warna browser autoplay block kar dega.' },
      { q: '<source> tag video in multiple baar why use karte hain?', options: ['Speed badhane ke liye', 'Different browsers alag video formats support karte are — fallback ke liye', 'Quality improve karne ke liye', 'Size compress karne ke liye'], correct: 1, explanation: 'Chrome MP4 prefer karta hai, Firefox OGG bhi support karta hai. Multiple <source> tags deke browser apne supported format choose kar sakta hai.' },
      { q: '<picture> tag ka main use is?', options: ['Images style karna', 'Alag screen sizes for alag images serve karna', 'Multiple images ek saath dikhana', 'Images animate karna'], correct: 1, explanation: '<picture> responsive images for is — mobile pe chhoti file, desktop pe badi. Performance optimize hoti hai.' },
    ],
  },

  'html-w3-s2': {
    title_en: "HTML5 APIs — Storage, Geolocation and More",
    content_en: `## HTML5 APIs — Browser Superpowers!

### localStorage — Save Data in the Browser
\`\`\`javascript
// Save data
localStorage.setItem('username', 'Rahul');
localStorage.setItem('score', '95');

// Read data
const name  = localStorage.getItem('username');  // 'Rahul'
const score = localStorage.getItem('score');     // '95'

// Save objects (must use JSON)
const user = { name: 'Priya', age: 20 };
localStorage.setItem('user', JSON.stringify(user));
const loaded = JSON.parse(localStorage.getItem('user'));

// Remove
localStorage.removeItem('username');
localStorage.clear();  // Remove everything
\`\`\`

### sessionStorage — Data for Current Session Only
\`\`\`javascript
// Same API as localStorage, but clears when browser tab closes
sessionStorage.setItem('tempToken', 'abc123');
const token = sessionStorage.getItem('tempToken');
\`\`\`

### Geolocation API
\`\`\`javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      console.log(\`Location: \${lat}, \${lng}\`);
    },
    (error) => {
      console.log('Location denied:', error.message);
    }
  );
}
\`\`\`

### Clipboard API
\`\`\`javascript
// Copy to clipboard
async function copyText(text) {
  await navigator.clipboard.writeText(text);
  alert('Copied!');
}
\`\`\`

### Notification API
\`\`\`javascript
async function showNotification() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    new Notification('StudyEarn', {
      body: 'Time to code! 🚀',
      icon: '/logo.png',
    });
  }
}
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
    task_en: {
      description: "Ek \"Mini Todo App\" banao HTML5 APIs use karke: (1) Input + button from todo items add ho, (2) Har todo ke saath delete button, (3) Todos localStorage in save hon (page reload karne pe bhi rahe), (4) Canvas pe top in ek simple banner draw karo (text + colored rectangle), (5) Total todos count dikhao. Note: JavaScript use karo HTML ke saath — it is okay, HTML5 APIs JS from hi use hoti hain!",
      hint: "localStorage.setItem(\"todos\", JSON.stringify(todosArray)) from array save karo. JSON.parse(localStorage.getItem(\"todos\")) from load karo. Page load hone pe todos load karo.",
    },
    quiz_en: [
      { q: 'localStorage and sessionStorage in what fark hai?', options: ['Koi fark nahi', 'localStorage permanently save karta is (tab close karne pe bhi), sessionStorage tab close hone pe delete ho jaata hai', 'sessionStorage zyada data store kar sakta hai', 'localStorage sirf numbers store karta hai'], correct: 1, explanation: 'localStorage = permanent (jab tak user manually clear na kare). sessionStorage = sirf us browser session tak (tab/window close = data gone).' },
      { q: 'Canvas pe drawing for what use karte hain?', options: ['canvas.draw()', 'canvas.getContext("2d") from ek context object milta is jisse draw karte hain', 'canvas.paint()', 'canvas.render()'], correct: 1, explanation: 'const ctx = canvas.getContext("2d") 2D drawing context deta hai. Phir ctx.fillRect(), ctx.arc(), ctx.fillText() etc. use karte hain.' },
      { q: 'Geolocation API use karne for what zaruri hai?', options: ['Kuch nahi', 'User ka permission (browser popup in allow karna)', 'HTTPS connection', 'Both B and C'], correct: 3, explanation: 'Geolocation for user ka explicit permission ZARURI is (browser popup). Aur production in HTTPS required is security ke liye.' },
    ],
  },

  'html-w3-s3': {
    title_en: "Meta Tags and SEO — Rank on Google",
    content_en: `## Meta Tags and SEO — Get Ranked on Google!

### Essential Meta Tags
\`\`\`html
<head>
  <!-- Character encoding — always first -->
  <meta charset="UTF-8">

  <!-- Responsive on mobile devices -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Page description (shown in Google results) -->
  <meta name="description" content="StudyEarn — Learn coding for free in Hindi. Python, HTML, CSS, JavaScript courses.">

  <!-- Keywords (less important today, but still useful) -->
  <meta name="keywords" content="learn coding, Python tutorial, HTML course, free coding">

  <!-- Page author -->
  <meta name="author" content="StudyEarn Team">

  <!-- Prevent search engine indexing (for private pages) -->
  <meta name="robots" content="noindex, nofollow">
</head>
\`\`\`

### Open Graph — Social Media Preview
\`\`\`html
<!-- When you share a link on WhatsApp/Facebook/Twitter -->
<meta property="og:title"       content="Learn Python in 3 Months — StudyEarn">
<meta property="og:description" content="Free Python course from beginner to advanced">
<meta property="og:image"       content="https://studyearnai.tech/og-image.jpg">
<meta property="og:url"         content="https://studyearnai.tech/python">
<meta property="og:type"        content="website">

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="Learn Python — StudyEarn">
<meta name="twitter:description" content="Free Python course">
\`\`\`

### Canonical URL — Avoid Duplicate Content
\`\`\`html
<!-- If the same content appears at multiple URLs, tell Google the original -->
<link rel="canonical" href="https://studyearnai.tech/python">
\`\`\`

### SEO Best Practices
\`\`\`html
<!-- One h1 per page — your main keyword -->
<h1>Learn Python Programming for Free</h1>

<!-- Descriptive alt text on all images -->
<img src="python-logo.png" alt="Python programming language logo">

<!-- Descriptive link text — not "click here" -->
<a href="/python">Start Python Course</a>  <!-- ✅ Good -->
<a href="/python">Click here</a>            <!-- ❌ Bad -->

<!-- Structured data (JSON-LD) — rich results in Google -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Python Programming",
  "provider": { "@type": "Organization", "name": "StudyEarn" }
}
</script>
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
    task_en: {
      description: "Apni pichli bani website (resume or portfolio) in SEO optimize karo: (1) Proper title tag (50-60 chars, keyword include karo), (2) Meta description (150-160 chars, compelling), (3) Keywords meta tag (10-15 relevant keywords), (4) Sab meta tags add karo (charset, viewport, author, robots), (5) Open Graph tags add karo (title, description, image, url, type), (6) Twitter Card tags, (7) Google Search Preview simulate karo — ek section banao jo dikhaye \"Google search in kuch aisa dikhega:\" and title + URL + description show karo.",
      hint: "Title tag 60 chars from chhota rakho — count karo! Description 160 chars from chhoti. og:image for picsum.photos/1200/630 URL use kar sakte ho (standard OG image size).",
    },
    quiz_en: [
      { q: 'Meta description tag ka main purpose is?', options: ['Page fast load hota hai', 'Google search results in page ke neeche short description dikhti is — click-through rate badhata hai', 'Images optimize hoti hain', 'Security improve hoti hai'], correct: 1, explanation: 'Meta description directly ranking improve not karta, but Google search result snippet in dikhta is — compelling description = zyada clicks!' },
      { q: 'Open Graph tags when useful hote hain?', options: ['Search engine optimization ke liye', 'Jab koi link WhatsApp/Facebook/LinkedIn pe share kare toh sundar preview dikhane ke liye', 'Page speed ke liye', 'Images ke liye'], correct: 1, explanation: 'og:title, og:description, og:image — yeh social media pe link share karne pe preview card banate hain. Bina OG tags ke ugly bare URL dikhti hai.' },
      { q: 'Viewport meta tag why zaruri hai?', options: ['Desktop pe kaam karta hai', 'Mobile devices pe page correct size in dikhne for zaroori hai', 'Animations ke liye', 'Fonts ke liye'], correct: 1, explanation: 'Bina viewport meta tag ke mobile pe page desktop size in render hota is — bahut chhota dikhta hai. width=device-width from page mobile screen width ke hisaab from adjust hota hai.' },
    ],
  },

  'html-w3-s4': {
    title_en: "Accessibility — Web for Everyone",
    content_en: `## Accessibility — Web for Everyone!

### What is Web Accessibility?
Accessibility means making websites usable by everyone — including people with visual, hearing, motor, or cognitive disabilities.

### ARIA — Accessible Rich Internet Applications
\`\`\`html
<!-- role — describes what the element is -->
<div role="button" onclick="submit()">Submit</div>
<div role="navigation">...</div>
<div role="alert">⚠️ Error: Invalid email</div>

<!-- aria-label — label for screen readers -->
<button aria-label="Close dialog">✕</button>
<img src="chart.png" aria-label="Bar chart showing monthly sales">

<!-- aria-hidden — hide from screen readers -->
<span aria-hidden="true">🎉</span>  <!-- decorative emoji -->

<!-- aria-live — announce dynamic changes -->
<div aria-live="polite">Loading...</div>
\`\`\`

### Keyboard Navigation
\`\`\`html
<!-- tabindex — make elements focusable -->
<div tabindex="0">Focusable div</div>
<div tabindex="-1">Programmatically focusable</div>

<!-- Skip navigation link — for keyboard users -->
<a href="#main-content" class="skip-link">Skip to main content</a>
\`\`\`

### Colour and Contrast
\`\`\`html
<!-- Minimum contrast ratio: 4.5:1 for text -->
<!-- Use tools: https://webaim.org/resources/contrastchecker/ -->

<!-- Don't rely on colour alone to convey information -->
<!-- ❌ Bad: "Errors are shown in red" -->
<!-- ✅ Good: "❌ Error: Invalid email address" -->
\`\`\`

### Accessible Form
\`\`\`html
<form>
  <label for="name">
    Full Name <span aria-label="required">*</span>
  </label>
  <input type="text" id="name" name="name" required
         aria-describedby="name-hint">
  <small id="name-hint">Enter your first and last name</small>

  <fieldset>
    <legend>Gender</legend>
    <input type="radio" id="male" name="gender" value="male">
    <label for="male">Male</label>
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">Female</label>
  </fieldset>
</form>
\`\`\`

### Accessibility Checklist
- ✅ All images have descriptive alt text
- ✅ All form inputs have labels
- ✅ Website works with keyboard only (Tab, Enter, Escape)
- ✅ Sufficient colour contrast (4.5:1 minimum)
- ✅ Page has a descriptive \`<title>\`
- ✅ Language set: \`<html lang="en">\`
- ✅ No content flashes more than 3 times per second`,
    codeExample_en: `<!DOCTYPE html>
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
    task_en: {
      description: "Apni resume webpage to fully accessible banao: (1) Skip navigation link add karo, (2) Sab images pe meaningful alt text, (3) Har form field ka proper label with for attribute, (4) ARIA labels buttons pe jahan sirf icons hain, (5) lang=\"en\" html tag pe, (6) Keyboard navigation test karo (Tab key from sab elements accessible hone chahiye), (7) Focus visible styling add karo (:focus for outline), (8) Contact form in fieldset + legend use karo radio buttons ke liye, (9) Ek \"Screen reader test\" section banao jisme .sr-only class use karo.",
      hint: ":focus { outline: 3px solid #6366f1; } CSS in add karo. Skip link for position: absolute; top: -40px; and :focus pe top: 0 karo. aria-label=\"\" buttons pe add karo jahan sirf emoji/icon hai.",
    },
    quiz_en: [
      { q: 'aria-label attribute when use karte hain?', options: ['Har element pe', 'Jab element ka visible text not ho or insufficient ho — screen readers for description dena ho', 'Sirf images pe', 'Forms ke liye'], correct: 1, explanation: 'Icon-only buttons (🔍), logo images, close buttons (×) — inpe aria-label dena zaroori is taaki screen reader users samjhein element what karta hai.' },
      { q: 'Skip navigation link why use karte hain?', options: ['Visual design ke liye', 'Keyboard users to har baar sara navigation traverse kiye bina main content pe jump karne ki suvidha deta hai', 'SEO ke liye', 'Mobile users ke liye'], correct: 1, explanation: 'Har page pe keyboard Tab from chalne waale users to otherwise poora navigation traverse karna padta. Skip link from directly main content pe ja sakte hain.' },
      { q: 'WCAG 2.1 Level AA in text color contrast ratio minimum kitna hona chahiye?', options: ['2:1', '3:1', '4.5:1', '7:1'], correct: 2, explanation: 'WCAG Level AA in normal text for 4.5:1 contrast ratio minimum required hai. Large text (18pt+) for 3:1. Ye visually impaired users for zaruri hai.' },
    ],
  },

};

// ── WEEK 4 ──────────────────────────────────────────────────
const W4 = {
  'html-w4-s1': {
    title_en: "Advanced Forms — Datalist, Progress, Meter",
    content_en: `## Advanced Forms — More Input Types!

### Datalist — Autocomplete Suggestions
\`\`\`html
<input list="cities" name="city" placeholder="Type your city">
<datalist id="cities">
  <option value="Mumbai">
  <option value="Delhi">
  <option value="Bangalore">
  <option value="Chennai">
  <option value="Kolkata">
</datalist>
\`\`\`

### Progress Bar
\`\`\`html
<!-- Determinate progress (known value) -->
<label>Download Progress:</label>
<progress value="65" max="100">65%</progress>

<!-- Indeterminate (loading, unknown end) -->
<progress></progress>
\`\`\`

### Meter — Gauge / Rating
\`\`\`html
<!-- Disk usage -->
<label>Storage Used:</label>
<meter value="70" min="0" max="100" low="25" high="75" optimum="10">
  70 GB of 100 GB
</meter>

<!-- Score gauge -->
<label>Your Score:</label>
<meter value="87" min="0" max="100" low="40" high="70" optimum="100">87%</meter>
\`\`\`

### Output Element
\`\`\`html
<form oninput="result.value = Number(a.value) + Number(b.value)">
  <input type="number" id="a" value="0"> +
  <input type="number" id="b" value="0"> =
  <output name="result" for="a b">0</output>
</form>
\`\`\`

### Input Patterns (Validation)
\`\`\`html
<!-- Custom regex validation -->
<input type="text" pattern="[A-Z]{3}-[0-9]{4}"
       title="Format: ABC-1234"
       placeholder="e.g. ABC-1234">

<!-- Indian phone number -->
<input type="tel" pattern="[6-9][0-9]{9}"
       title="10-digit Indian mobile starting with 6-9"
       placeholder="9876543210">
\`\`\`

### Autocomplete Hints
\`\`\`html
<input type="text"     name="name"    autocomplete="name">
<input type="email"    name="email"   autocomplete="email">
<input type="tel"      name="phone"   autocomplete="tel">
<input type="password" name="current" autocomplete="current-password">
<input type="password" name="new"     autocomplete="new-password">
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
    task_en: {
      description: "Ek \"Course Registration\" advanced form banao. Ismein hona chahiye: (1) Datalist for course selection (10 courses), (2) Fee calculator with output tag (course_fee \u00d7 discount = final_price), (3) Progress bar dikhao \"Profile Completion\" (fields fill hone pe dynamically update ho), (4) FAQ section in 5 questions using details/summary, (5) Confirmation dialog before form submit, (6) Pattern validation phone number ke liye, (7) Multiple file upload for documents.",
      hint: "Progress bar update: form ke har field ka oninput event listen karo. Filled fields count karo and progress.value = (filled/total * 100) set karo. Dialog for document.getElementById(\"id\").showModal() and .close() use karo.",
    },
    quiz_en: [
      { q: '<datalist> and <select> in what fark hai?', options: ['Koi fark nahi', '<datalist> free-form typing bhi allow karta is + suggestions deta hai, <select> sirf listed options', '<select> zyada options de sakta hai', '<datalist> required attribute support not karta'], correct: 1, explanation: '<select> in sirf predefined options choose kar sakte ho. <datalist> in suggestions deta is but user kuch bhi type kar sakta is — hybrid approach!' },
      { q: '<progress> and <meter> in what fark hai?', options: ['Koi fark nahi', '<progress> task completion dikhata is (0 from max), <meter> known range in scalar measurement', '<meter> animated hota hai', '<progress> text show karta hai'], correct: 1, explanation: '<progress> = task for (download, form completion). <meter> = specific range in value (battery, disk space, score). Meter in low/high/optimum attributes hain.' },
      { q: '<details> element ka default behavior is?', options: ['Default in expand hota hai', 'Default in collapsed hota is — click pe expand', 'JavaScript zaruri hai', 'Sirf text show karta hai'], correct: 1, explanation: '<details> default in closed hota is — sirf <summary> dikhti hai. Click karne pe content expand hota hai. "open" attribute from default expand kar sakte ho.' },
    ],
  },

  'html-w4-s2': {
    title_en: "iFrames and Embedding — Include Other Websites",
    content_en: `## iFrames and Embedding — Include Other Websites!

### Basic iFrame
\`\`\`html
<iframe
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  width="560"
  height="315"
  title="YouTube video"
  frameborder="0"
  allowfullscreen>
</iframe>
\`\`\`

### Embedding a Map (Google Maps)
\`\`\`html
<!-- Get embed code from Google Maps: Share → Embed a map -->
<iframe
  src="https://www.google.com/maps/embed?pb=..."
  width="600"
  height="450"
  style="border:0;"
  allowfullscreen
  loading="lazy">
</iframe>
\`\`\`

### iFrame Security
\`\`\`html
<!-- sandbox — restrict what the iframe can do -->
<iframe
  src="user-content.html"
  sandbox="allow-scripts allow-forms">
  <!-- allow-scripts: JS runs in iframe -->
  <!-- allow-forms: form submission allowed -->
  <!-- without sandbox: full access! -->
</iframe>
\`\`\`

### Embedding a PDF
\`\`\`html
<iframe
  src="document.pdf"
  width="800"
  height="600"
  type="application/pdf">
  <p>PDF not supported — <a href="document.pdf">download it</a></p>
</iframe>
\`\`\`

### When NOT to Use iFrames
\`\`\`
❌ Don't use iFrames for:
  - Your own page content (use regular HTML)
  - Performance-sensitive pages
  - Sites that block embedding (X-Frame-Options)
  
✅ Do use iFrames for:
  - YouTube / Vimeo videos
  - Google Maps
  - External widgets (payment forms, etc.)
  - Sandboxed content
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
      box.innerHTML = \\\`
        <strong>Product Details:</strong><br>
        ID: \\\${element.dataset.productId}<br>
        Name: \\\${element.dataset.name}<br>
        Price: \\\${element.dataset.price}<br>
        Level: \\\${element.dataset.level}
      \\\`;
    }
  </script>

</body>
</html>`,
    task_en: {
      description: "Ek \"Learning Hub\" webpage banao jisme embed karo: (1) Ek YouTube tutorial video (responsive container mein), (2) Google Maps — apne city ka location, (3) Ek Wikipedia article iframe mein, (4) 6 course cards banao data-* attributes use karke (data-id, data-title, data-duration, data-level, data-price). JavaScript from click pe course details show karo. (5) Ek Google Form embed karo (ya fake form), (6) Details/summary from courses to category-wise organize karo.",
      hint: "Google Maps: maps.google.com pe location search karo \u2192 Share \u2192 Embed a map \u2192 iframe code copy karo. Product cards in data attributes from cart in add/remove functionality bana sakte ho.",
    },
    quiz_en: [
      { q: 'Iframe in title attribute why zaruri hai?', options: ['Styling ke liye', 'Accessibility for — screen readers iframe ka purpose samjhte hain', 'SEO ke liye', 'Size ke liye'], correct: 1, explanation: 'title attribute screen readers to batata is iframe in is (e.g., "YouTube video tutorial"). Bina title ke screen readers bas "frame" kehte are — not helpful!' },
      { q: 'data-* attributes ka main purpose is?', options: ['Styling ke liye', 'Custom data to HTML elements pe store karna jo JavaScript from access ho sake', 'Server data send karna', 'Validation ke liye'], correct: 1, explanation: 'data-* attributes HTML elements pe extra information store karne for hain. Fir JavaScript in element.dataset.attributeName from access kar sakte ho.' },
      { q: 'sandbox attribute iframe pe kyon use karte hain?', options: ['Performance improve karna', 'Untrusted content to restrict karna — security ke liye', 'Size limit karna', 'Loading speed improve karna'], correct: 1, explanation: 'sandbox attribute embedded content ki capabilities restrict karta is — default in sab block, phir specifically allow karo (allow-scripts, allow-forms). Third-party content pe especially useful.' },
    ],
  },

  'html-w4-s3': {
    title_en: "Month 1 Project — Complete Portfolio Website",
    content_en: `## Month 1 Project — Complete Portfolio Website!

Build a complete personal portfolio using everything from Month 1!

### Required Pages:
\`\`\`
portfolio/
├── index.html         ← Home page
├── about.html         ← About me
├── projects.html      ← My projects
├── contact.html       ← Contact form
└── assets/
    ├── style.css      ← (minimal, optional)
    └── profile.jpg    ← Your photo
\`\`\`

### Home Page (index.html) — Must Have:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Rahul Kumar — Web Developer Portfolio">
  <title>Rahul Kumar | Portfolio</title>
</head>
<body>
  <header>
    <nav>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="projects.html">Projects</a>
      <a href="contact.html">Contact</a>
    </nav>
  </header>

  <main>
    <section id="hero">
      <img src="assets/profile.jpg" alt="Rahul Kumar">
      <h1>Hi, I am Rahul Kumar 👋</h1>
      <p>Aspiring Web Developer | Python Enthusiast</p>
      <a href="contact.html">Hire Me</a>
      <a href="assets/resume.pdf" download>Download CV</a>
    </section>

    <section id="skills">
      <h2>My Skills</h2>
      <!-- List or table of skills -->
    </section>
  </main>

  <footer>
    <p>© 2024 Rahul Kumar</p>
  </footer>
</body>
</html>
\`\`\`

### Checklist:
- ✅ All 4 pages linked correctly
- ✅ Proper semantic HTML on every page
- ✅ Working navigation
- ✅ Contact form with validation
- ✅ Responsive meta viewport tag
- ✅ SEO meta description
- ✅ All images have alt text
- ✅ Page titles are descriptive`,
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
    task_en: {
      description: "Apna complete portfolio website banao — 2 files: index.html (main page) and contact.html (dedicated contact page). index.html mein: hero section (naam + tagline + CTA), about section (photo + bio + stats), skills table (progress bars ke saath), projects section (3 projects, real or fake), FAQ (details/summary), embed karo OpenStreetMap or YouTube. contact.html mein: advanced form (datalist, pattern validation, autocomplete), Google Maps/OpenStreetMap. Dono pages mein: proper SEO meta tags, accessibility (lang, skip link, alt text, labels), navigation links dono pages ke beech.",
      hint: "Real info use karo! Apne actual skills, hobbies, projects. OpenStreetMap free is and iframe from easily embed hota hai. 2 files banao and <a href=\"contact.html\"> from link karo.",
    },
    quiz_en: [
      { q: 'Multi-page website in pages how link karte hain?', options: ['JavaScript se', '<a href="page.html"> from same folder ke pages link hote hain', 'Sirf absolute URLs use karte hain', 'Server ki zarurat hai'], correct: 1, explanation: 'Same folder: <a href="about.html">. Subfolder: <a href="pages/about.html">. Parent folder: <a href="../index.html">. Yeh relative paths are — kisi server ki zarurat not local development mein.' },
      { q: 'Portfolio website in OpenStreetMap/Google Maps embed karne ka best tarika?', options: ['Screenshot image se', '<iframe> tag from embed karo — interactive map milti hai', 'JavaScript map library se', 'CSS background image se'], correct: 1, explanation: 'Maps.google.com or openstreetmap.org from "Embed" option from iframe code milta hai. Yeh interactive map deta is — user zoom/pan kar sakta hai.' },
      { q: 'Professional portfolio in CSS bhi zaruri is HTML ke saath?', options: ['Nahi, HTML hi kaafi hai', 'Haan, CSS from visual design improve hoti is — aaj kal pure HTML portfolio professional not lagti', 'Sirf senior developers ke liye', 'CSS optional hai'], correct: 1, explanation: 'HTML structure deta hai, CSS styling deta hai. Ek professional portfolio in dono zaruri are — next step CSS seekhna hai! Month 2 in CSS seekhenge.' },
    ],
  },

  'html-w4-s4': {
    title_en: "Month 1 Review and Month 2 Preview",
    content_en: `## Month 1 Review and Month 2 Preview!

### Month 1 Recap — What You Learned:

\`\`\`
Week 1: HTML Foundations
  ✅ Tags, attributes, document structure
  ✅ Headings, paragraphs, formatting
  ✅ Links and images
  ✅ Ordered/unordered/description lists

Week 2: HTML for Content
  ✅ Tables with colspan/rowspan
  ✅ All form input types + validation
  ✅ Semantic HTML5 elements
  ✅ Resume webpage project

Week 3: HTML5 Advanced
  ✅ Audio and video embedding
  ✅ HTML5 APIs (localStorage, Geolocation)
  ✅ Meta tags and SEO
  ✅ Web accessibility (ARIA, keyboard nav)

Week 4: HTML Mastery
  ✅ Advanced form elements
  ✅ iFrames and embedding
  ✅ Complete portfolio project
\`\`\`

### Month 2 Preview — CSS! 🎨

\`\`\`
Week 5: CSS Foundations
  → Selectors, properties, values
  → Box model (margin, padding, border)
  → Colors, fonts, backgrounds

Week 6: CSS Layout
  → Flexbox — 1D layouts
  → CSS Grid — 2D layouts
  → Responsive design / media queries

Week 7: CSS Animations
  → Transitions
  → Transforms (translate, rotate, scale)
  → @keyframes animations

Week 8: CSS Advanced
  → CSS Variables
  → Advanced selectors
  → CSS capstone project
\`\`\`

### Resources to Explore:
- **MDN Web Docs** — best HTML reference: developer.mozilla.org
- **W3Schools** — quick examples: w3schools.com
- **Can I Use** — browser support checker: caniuse.com
- **Validator** — check your HTML: validator.w3.org`,
    codeExample_en: `<!DOCTYPE html>
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
    task_en: {
      description: "FINAL CHALLENGE — Month 1 Complete karo: (1) Apna portfolio website review karo — sab topics include hain? (2) HTML Validation karo — validator.w3.org pe apna HTML paste karo and errors fix karo, (3) Ek \"Self Assessment\" page banao — progress bars from har topic in apna level dikhao, (4) README.html banao — apni project ka explanation (kya banaya, kaunse tags use kiye, what seekha), (5) Sab pages ek doosre from properly linked are check karo, (6) Mobile pe dekho — viewport meta tag is na?",
      hint: "W3C Validator: validator.w3.org — apna HTML code paste karo, errors and warnings dekhkar fix karo. Yeh professional practice hai. README in dl/dt/dd tags use karo features list ke liye.",
    },
    quiz_en: [
      { q: 'W3C HTML Validator why use karna chahiye?', options: ['Performance check ke liye', 'HTML errors detect karne for — browsers invalid HTML fix kar lete are but good practice hai', 'Security ke liye', 'Images optimize karne ke liye'], correct: 1, explanation: 'validator.w3.org HTML errors find karta hai. Browsers gracefully invalid HTML handle karte hain, but valid HTML = better browser compatibility, better SEO, better accessibility.' },
      { q: 'HTML seekhne ke baad next logical step is?', options: ['Directly JavaScript seekhna', 'CSS seekhna — HTML to beautiful banane ke liye', 'Database seekhna', 'Server-side programming'], correct: 1, explanation: 'Standard web dev path: HTML (structure) → CSS (styling) → JavaScript (interactivity). CSS bina HTML ugly plain text jaisi dikhti hai!' },
      { q: 'Portfolio website banane ka main benefit is?', options: ['Marks milte hain', 'Practical skills demonstrate hoti are — recruiters real code dekh sakte hain', 'Certificate milta hai', 'Marks improve hote hain'], correct: 1, explanation: 'Portfolio = tumhara live resume! Recruiters github.com/username or portfolio.com dekhte are — actual kaam dekh sakte hain, resume from zyada convincing hota hai.' },
    ],
  },

};

// ── WEEK 5 ──────────────────────────────────────────────────
const W5 = {
  'html-w5-s1': {
    title_en: "What is CSS — Introduction to Styling",
    content_en: `## What is CSS — Introduction to Styling!

### CSS — Making HTML Beautiful!
HTML gives structure. **CSS (Cascading Style Sheets)** makes it beautiful!

\`\`\`css
/* Basic CSS syntax */
selector {
  property: value;
  property: value;
}

/* Example */
h1 {
  color: #4472C4;
  font-size: 32px;
  text-align: center;
}
\`\`\`

### Three Ways to Add CSS

**1. Inline — directly on the element:**
\`\`\`html
<p style="color: red; font-size: 18px;">Red text</p>
\`\`\`

**2. Internal — in the \`<head>\` section:**
\`\`\`html
<style>
  p { color: blue; }
</style>
\`\`\`

**3. External — separate .css file (best!):**
\`\`\`html
<link rel="stylesheet" href="style.css">
\`\`\`

### Common CSS Properties
\`\`\`css
/* Text */
color: #333;
font-size: 16px;
font-family: 'Arial', sans-serif;
font-weight: bold;
text-align: center;
text-decoration: underline;
line-height: 1.6;
letter-spacing: 2px;

/* Background */
background-color: #f0f0f0;
background-image: url('bg.jpg');
background-size: cover;

/* Dimensions */
width: 300px;
height: 200px;
max-width: 1200px;
min-height: 100vh;

/* Display */
display: block;
display: inline;
display: flex;
display: none;  /* hide element */

/* Cursor */
cursor: pointer;
\`\`\`

### Colours in CSS
\`\`\`css
/* Name */
color: red;

/* Hex */
color: #FF5733;
color: #f00;   /* short form */

/* RGB */
color: rgb(255, 87, 51);

/* RGBA (with transparency) */
color: rgba(255, 87, 51, 0.8);

/* HSL */
color: hsl(9, 100%, 60%);
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Apni Week 2 ki resume webpage to CSS from style karo! Ismein hona chahiye: (1) Header in gradient background (violet from purple), (2) Body in acha font-family, background color, (3) H2 headings to color and border-bottom from highlight karo, (4) Links to style karo — hover pe color change ho, (5) Footer dark background ke saath, (6) Ek .highlight class banao important text ke liye.',\n description_en: 'Style your Week 2 resume webpage with CSS! It must have: (1) Header with a gradient background (violet to purple), (2) Good font-family and background colour on body, (3) H2 headings highlighted with colour and border-bottom, (4) Styled links — colour changes on hover, (5) Footer with dark background, (6) A .highlight class for important text.",
      hint: "Internal CSS use karo pehle — <style> tag head mein. Hover ke liye: a:hover { color: #6366f1; }. Gradient: background: linear-gradient(135deg, #6366f1, #a78bfa);",
    },
    quiz_en: [
      { q: 'CSS use karne ka best tarika which hai?', options: ['Inline CSS (style attribute)', 'Internal CSS (<style> tag)', 'External CSS (alag .css file)', 'Teeno same hain'], correct: 2, explanation: 'External CSS best practice is — ek file from poori website style hoti hai, maintainable hoti hai, and browser cache karta is speed ke liye.',
 q_en: 'What is the best way to use CSS?',
 options_en: ['Inline CSS (style attribute)', 'Internal CSS (<style> tag)', 'External CSS (separate .css file)', 'All three are the same'],
 explanation_en: 'External CSS is best practice — one file styles the entire website, it is maintainable, and the browser caches it for speed.' },
      { q: 'Hex color #ff0000 which color hai?', options: ['Blue', 'Green', 'Red', 'Yellow'], correct: 2, explanation: '#ff0000 = RGB(255,0,0) = pure red. FF = 255 (max), 00 = 0. Red channel full on, green and blue off.',
 q_en: 'What colour is the hex code #ff0000?',
 options_en: ['Blue', 'Green', 'Red', 'Yellow'],
 explanation_en: '#ff0000 = RGB(255,0,0) = pure red. FF = 255 (maximum), 00 = 0. Red channel fully on, green and blue off.' },
      { q: 'CSS in text to center karne for what use karte hain?', options: ['text-position: center', 'text-align: center', 'align: center', 'center: true'], correct: 1, explanation: 'text-align: center; from text horizontally center hota hai. Vertically center karne for flexbox use karte hain.',
 q_en: 'What property is used to centre text in CSS?',
 options_en: ['text-position: center', 'text-align: center', 'align: center', 'center: true'],
 explanation_en: 'text-align: center; centres text horizontally. For vertical centring, use flexbox.' },
    ],
  },

  'html-w5-s2': {
    title_en: "CSS Selectors — Target Your Elements",
    content_en: `## CSS Selectors — Target Your Elements!

### Basic Selectors
\`\`\`css
/* Element selector */
p { color: gray; }
h1 { font-size: 32px; }

/* Class selector — .classname */
.highlight { background: yellow; }
.btn { padding: 10px 20px; }

/* ID selector — #id (unique per page) */
#header { background: #333; }
#logo { width: 100px; }

/* Universal selector */
* { box-sizing: border-box; }
\`\`\`

### Combination Selectors
\`\`\`css
/* Group — comma separated */
h1, h2, h3 { color: #333; font-weight: bold; }

/* Descendant — space */
.card p { color: gray; }        /* <p> inside .card */

/* Direct child — > */
nav > a { color: white; }       /* <a> direct child of nav */

/* Adjacent sibling — + */
h2 + p { margin-top: 0; }      /* <p> immediately after h2 */

/* General sibling — ~ */
h2 ~ p { color: gray; }        /* all <p> after h2 */
\`\`\`

### Attribute Selectors
\`\`\`css
a[href]                  { color: blue; }   /* has href attribute */
a[href="https://google"] { color: red; }    /* exact value */
a[href^="https"]         { color: green; }  /* starts with */
a[href$=".pdf"]          { color: orange; } /* ends with */
a[href*="google"]        { color: purple; } /* contains */
input[type="text"]       { border: 2px solid blue; }
\`\`\`

### Pseudo-classes
\`\`\`css
a:hover    { color: red; }          /* mouse over */
a:active   { color: darkred; }      /* being clicked */
a:visited  { color: purple; }       /* already visited */
a:focus    { outline: 2px solid blue; }

input:valid   { border-color: green; }
input:invalid { border-color: red; }
input:focus   { box-shadow: 0 0 5px blue; }

li:first-child  { font-weight: bold; }
li:last-child   { border-bottom: none; }
li:nth-child(2) { background: #f0f0f0; }
li:nth-child(even) { background: #f5f5f5; }
li:not(.skip)   { color: black; }
\`\`\`

### Pseudo-elements
\`\`\`css
p::first-line   { font-weight: bold; }
p::first-letter { font-size: 2em; float: left; }
p::before       { content: "→ "; color: blue; }
p::after        { content: " ✓"; color: green; }
::selection     { background: yellow; }  /* text selected by user */
::placeholder   { color: #999; }         /* input placeholder */
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Ek \"Styled Navigation Menu\" banao CSS selectors use karke. Ismein hona chahiye: (1) nav ul li a — links white, no underline, (2) a:hover — background change, smooth transition, (3) .active class — current page highlight, (4) Table zebra striping — tr:nth-child(even), (5) Form inputs — :focus state violet border, :valid green border, :invalid red border, (6) Buttons — hover pe scale + shadow effect, (7) ::selection — text select karne pe violet background.',\n description_en: 'Build a \"Styled Navigation Menu\" using CSS selectors. It must have: (1) nav ul li a — white links, no underline, (2) a:hover — background changes with smooth transition, (3) .active class — current page highlighted, (4) Table zebra striping — tr:nth-child(even), (5) Form inputs — :focus violet border, :valid green, :invalid red, (6) Buttons — scale + shadow on hover, (7) ::selection — violet background when text is selected.",
      hint: "transition: all 0.2s ease; smooth hover ke liye. :nth-child(even) alternate rows color karta hai. transform: scale(1.05) button thoda bada dikhata is hover pe.",
    },
    quiz_en: [
      { q: 'Class selector and ID selector in what fark hai?', options: ['Koi fark nahi', 'Class (.) multiple elements pe use ho sakti hai, ID (#) sirf ek unique element pe', 'ID faster hai', 'Class sirf divs for hai'], correct: 1, explanation: 'Class — ek page pe multiple elements pe same class use ho sakti hai. ID — unique hona chahiye, ek page pe sirf ek element ka woh ID hona chahiye.',
 q_en: 'What is the difference between a class selector and an ID selector?',
 options_en: ['No difference', 'A class (.) can be used on multiple elements, an ID (#) is for one unique element only', 'ID is faster', 'Class is only for divs'],
 explanation_en: 'Class — the same class can be applied to multiple elements on a page. ID — must be unique; only one element on the page should have that ID.' },
      { q: 'li:nth-child(2n+1) kaun from items select karta hai?', options: ['Even items', 'Odd items', 'Every 2nd item', 'First item only'], correct: 1, explanation: '2n+1 = 1, 3, 5, 7... = odd items. 2n = even. :nth-child(odd) and :nth-child(2n+1) same hain.',
 q_en: 'Which items does li:nth-child(2n+1) select?',
 options_en: ['Even items', 'Odd items', 'Every 2nd item', 'First item only'],
 explanation_en: '2n+1 = 1, 3, 5, 7... = odd items. 2n = even. :nth-child(odd) and :nth-child(2n+1) are equivalent.' },
      { q: '::before and ::after pseudo-elements what karte hain?', options: ['Element ke before/after naye elements banate hain', 'CSS from HTML content inject karte are element ke pehle/baad mein', 'Elements reorder karte hain', 'Display hide karte hain'], correct: 1, explanation: '::before and ::after CSS from content property ka use karke element ke pehle or baad decorative content add karte are — bina HTML badlaav ke.',
 q_en: 'What do the ::before and ::after pseudo-elements do?',
 options_en: ['Create new elements before/after', 'Inject CSS content before/after an element without changing HTML', 'Reorder elements', 'Hide elements'],
 explanation_en: '::before and ::after use the content property to add decorative content before or after an element — without any changes to the HTML.' },
    ],
  },

  'html-w5-s3': {
    title_en: "The Box Model — Foundation of Spacing and Layout",
    content_en: `## The Box Model — Foundation of Spacing and Layout!

### Every Element is a Box
\`\`\`
┌─────────────────────────────┐  ← margin (outside, transparent)
│  ┌───────────────────────┐  │
│  │  border               │  │
│  │  ┌─────────────────┐  │  │
│  │  │  padding        │  │  │
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  content  │  │  │  │
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
\`\`\`

### Margin, Padding, Border
\`\`\`css
.box {
  /* Content */
  width: 200px;
  height: 100px;

  /* Padding — inside, pushes content inward */
  padding: 20px;              /* all sides */
  padding: 10px 20px;         /* top-bottom left-right */
  padding: 5px 10px 15px 20px; /* top right bottom left (clockwise) */

  /* Border */
  border: 2px solid #333;
  border-top: 3px dashed red;
  border-radius: 8px;         /* rounded corners */
  border-radius: 50%;         /* circle! */

  /* Margin — outside, pushes away from other elements */
  margin: 20px;
  margin: 0 auto;             /* horizontally centre a block element */
  margin-bottom: 16px;
}
\`\`\`

### box-sizing — The Important Property
\`\`\`css
/* Default: width = content only */
/* Total width = width + padding + border */
.bad {
  box-sizing: content-box;  /* default, confusing */
  width: 200px;
  padding: 20px;
  border: 2px solid;
  /* Actual width: 200 + 40 + 4 = 244px! */
}

/* Better: width includes padding + border */
* {
  box-sizing: border-box;  /* use this always! */
}
.good {
  width: 200px;
  padding: 20px;
  border: 2px solid;
  /* Actual width: 200px exactly */
}
\`\`\`

### Display Property
\`\`\`css
/* Block — full width, starts on new line */
div, p, h1-h6, section { display: block; }

/* Inline — same line, no width/height */
span, a, strong, em { display: inline; }

/* Inline-block — same line, but can have width/height */
img, button, input { display: inline-block; }

/* None — completely hidden (removed from layout) */
.hidden { display: none; }

/* Visibility hidden — invisible but still takes up space */
.invisible { visibility: hidden; }
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Ek \"Pricing Cards\" layout banao Box Model use karke. Teen cards (Basic, Pro, Enterprise). Har card mein: padding: 32px, border-radius: 16px, ek card in \"Popular\" badge, price bold + big font size, features list, button bottom mein. Pro card to highlight karo — different background + scale(1.05). margin: 0 auto from container center karo. box-sizing: border-box zaroor use karo.',\n description_en: 'Build a \"Pricing Cards\" layout using the Box Model. Three cards (Basic, Pro, Enterprise). Each card must have: padding: 32px, border-radius: 16px, one card with a \"Popular\" badge, price in bold + large font size, features list, button at the bottom. Highlight the Pro card — different background + scale(1.05). Centre the container with margin: 0 auto. Make sure to use box-sizing: border-box.",
      hint: "Cards to side by side rakhne for display: inline-block; or float: left; use karo. Ya simply margin auto from vertical stack bhi theek is abhi — flexbox next section in seekhenge!",
    },
    quiz_en: [
      { q: 'box-sizing: border-box why use karte hain?', options: ['Performance ke liye', 'Width in padding and border include hoti is — predictable sizing', 'Color fix karne ke liye', 'Animation ke liye'], correct: 1, explanation: 'Default content-box in width sirf content ki hoti is — padding add karne from element bada ho jaata is unexpectedly. border-box in width total size fix karta is including padding and border.',
 q_en: 'Why do we use box-sizing: border-box?',
 options_en: ['For performance', 'Padding and border are included in the width — predictable sizing', 'To fix colours', 'For animations'],
 explanation_en: 'With the default content-box, width only covers the content — adding padding makes the element unexpectedly larger. With border-box, the width is the fixed total size including padding and border.' },
      { q: 'margin: 0 auto what karta hai?', options: ['Element to hide karta hai', 'Element to horizontally center karta is — fixed width ke saath', 'Top margin 0 karta hai', 'Sab margins remove karta hai'], correct: 1, explanation: 'margin: 0 auto — top/bottom margin 0, left/right auto (barabar distribute). Isse block element center ho jaata is — zaroor width or max-width set karni hogi.',
 q_en: 'What does margin: 0 auto do?',
 options_en: ['Hides the element', 'Centres the element horizontally — requires a fixed width', 'Sets top margin to 0', 'Removes all margins'],
 explanation_en: 'margin: 0 auto — top/bottom margin 0, left/right auto (equally distributed). This centres a block element — a width or max-width must also be set.' },
      { q: 'border-radius: 50% what banata hai?', options: ['Half circle', 'Perfect circle (agar width = height)', 'Oval shape', 'Rounded rectangle'], correct: 1, explanation: 'border-radius: 50% sab corners ke radius to width/height ka 50% set karta hai. Agar element square is (width = height) toh perfect circle banega.',
 q_en: 'What does border-radius: 50% create?',
 options_en: ['Half circle', 'Perfect circle (if width = height)', 'Oval shape', 'Rounded rectangle'],
 explanation_en: 'border-radius: 50% sets all corners to 50% of the width/height. If the element is square (width = height), it becomes a perfect circle.' },
    ],
  },

  'html-w5-s4': {
    title_en: "Week 5 Project — Styled Blog Page",
    content_en: `## Week 5 Project — Styled Blog Page!

Apply all your CSS fundamentals to create a beautiful blog!

### HTML Structure:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Blog</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <h1 class="logo">My Blog</h1>
      <nav>
        <a href="#">Home</a>
        <a href="#">Articles</a>
        <a href="#">About</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <article class="post-card">
      <img src="post1.jpg" alt="Post Image" class="post-image">
      <div class="post-content">
        <span class="category">Python</span>
        <h2 class="post-title">Learning Python in 3 Months</h2>
        <p class="post-excerpt">Here is what I learned...</p>
        <a href="#" class="read-more">Read More →</a>
      </div>
    </article>
    <!-- More articles -->
  </main>

  <footer class="site-footer">
    <p>© 2024 My Blog</p>
  </footer>
</body>
</html>
\`\`\`

### CSS Requirements:
\`\`\`css
/* 1. Reset and global styles */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }

/* 2. Container (centered, max-width) */
.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

/* 3. Header with navigation */
.site-header { background: #1a1a2e; color: white; padding: 16px 0; }

/* 4. Post cards with hover effect */
.post-card { border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: transform 0.3s; }
.post-card:hover { transform: translateY(-4px); }

/* 5. Buttons and links styled */
.read-more { display: inline-block; background: #4472C4; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; }
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Complete styled blog page banao apne 3 topics pe (HTML/CSS/Python from related kuch bhi). Requirements: (1) Google Fonts import karo (Inter or Poppins), (2) Gradient header + hero section, (3) 3 blog post cards — image, tags, title, author, date, excerpt, Read More button, (4) Card hover effect — transform + box-shadow, (5) Tag badges (.tag class — color per category), (6) Responsive images (max-width: 100%), (7) Consistent color scheme poore page mein, (8) Proper footer with links.',\n description_en: 'Build a complete styled blog page on 3 topics of your choice (anything related to HTML/CSS/Python). Requirements: (1) Import Google Fonts (Inter or Poppins), (2) Gradient header + hero section, (3) 3 blog post cards — image, tags, title, author, date, excerpt, Read More button, (4) Card hover effect — transform + box-shadow, (5) Tag badges (.tag class — different colour per category), (6) Responsive images (max-width: 100%), (7) Consistent colour scheme throughout, (8) Proper footer with links.",
      hint: "Google Fonts CDN: fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700. Card hover: transition: all 0.3s ease; property lagao pehle, phir :hover in transform + box-shadow.",
    },
    quiz_en: [
      { q: 'Google Fonts HTML in how add karte hain?', options: ['<script src="fonts.js">', '<link rel="stylesheet" href="fonts.googleapis.com/css2?family=...">', '@import url("fonts.js")', '<font src="google">'], correct: 1, explanation: 'Google Fonts <link> tag from CSS file load hoti is jo font define karti hai. Phir font-family property in us font ka naam use karo.',
 q_en: 'How do you add Google Fonts to HTML?',
 options_en: ['<script src="fonts.js">', '<link rel="stylesheet" href="fonts.googleapis.com/css2?family=...">', '@import url("fonts.js")', '<font src="google">'],
 explanation_en: 'Google Fonts loads a CSS file via a <link> tag that defines the font. Then use the font name in the font-family property.' },
      { q: 'transition: all 0.3s ease; what karta hai?', options: ['Element to animate karta is indefinitely', 'CSS property changes to 0.3 seconds in smoothly animate karta hai', 'Element rotate karta hai', '0.3 seconds delay deta hai'], correct: 1, explanation: 'transition property CSS changes to smooth banata hai. all = saari properties, 0.3s = 300ms duration, ease = slow start, fast middle, slow end.',
 q_en: 'What does transition: all 0.3s ease; do?',
 options_en: ['Animates the element indefinitely', 'Smoothly animates CSS property changes over 0.3 seconds', 'Rotates the element', 'Adds a 0.3 second delay'],
 explanation_en: 'The transition property makes CSS changes smooth. all = all properties, 0.3s = 300ms duration, ease = slow start, fast middle, slow end.' },
      { q: 'object-fit: cover img tag pe what karta hai?', options: ['Image resize karta is stretch karke', 'Image aspect ratio maintain karta is and container fill karta is (crop hoti hai)', 'Image hide karta hai', 'Image transparent banata hai'], correct: 1, explanation: 'object-fit: cover — image apna aspect ratio maintain karta is and container completely fill karta hai. Extra part crop ho jaata hai. Consistent card images for perfect!',
 q_en: 'What does object-fit: cover do on an img tag?',
 options_en: ['Stretches image to fit', 'Maintains aspect ratio and fills the container (crops the overflow)', 'Hides the image', 'Makes image transparent'],
 explanation_en: 'object-fit: cover — the image maintains its aspect ratio and completely fills the container. The overflow is cropped. Perfect for consistent card images!' },
    ],
  },

};

// ── WEEK 6 ──────────────────────────────────────────────────
const W6 = {
  'html-w6-s1': {
    title_en: "Flexbox Basics — Container and Items",
    content_en: `## Flexbox — One-Dimensional Layouts!

### What is Flexbox?
Flexbox arranges items in **one direction** — row (horizontal) or column (vertical). Perfect for navigation bars, card rows, centring content.

### Container Properties (parent element)
\`\`\`css
.container {
  display: flex;

  /* Direction */
  flex-direction: row;          /* default: horizontal */
  flex-direction: column;       /* vertical */
  flex-direction: row-reverse;  /* right to left */

  /* Wrap */
  flex-wrap: nowrap;   /* default: no wrapping */
  flex-wrap: wrap;     /* items wrap to next line */

  /* Shorthand */
  flex-flow: row wrap;

  /* Horizontal alignment (main axis) */
  justify-content: flex-start;    /* default: left */
  justify-content: flex-end;      /* right */
  justify-content: center;        /* centre */
  justify-content: space-between; /* equal space between */
  justify-content: space-around;  /* space around each */
  justify-content: space-evenly;  /* completely even */

  /* Vertical alignment (cross axis) */
  align-items: stretch;     /* default: fill height */
  align-items: flex-start;  /* top */
  align-items: flex-end;    /* bottom */
  align-items: center;      /* vertically centre */
  align-items: baseline;    /* align text baselines */

  /* Gap between items */
  gap: 16px;
  gap: 10px 20px;  /* row-gap column-gap */
}
\`\`\`

### Item Properties (child elements)
\`\`\`css
.item {
  flex-grow: 1;    /* grow to fill available space */
  flex-shrink: 0;  /* do not shrink */
  flex-basis: 200px; /* initial size */
  flex: 1;         /* shorthand: grow=1, shrink=1, basis=0 */
  flex: 0 0 200px; /* fixed width, do not grow or shrink */

  align-self: center;  /* override parent's align-items */
  order: 2;            /* change display order */
}
\`\`\`

### The Most Common Use: Perfect Centring
\`\`\`css
.centre-everything {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;  /* full viewport height */
}
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Ek complete landing page banao sirf Flexbox use karke. Zaruri sections: (1) Sticky navbar — logo left, links center, CTA button right (justify-content: space-between), (2) Hero — full height (100vh), content vertically + horizontally centered, (3) Features section — 3 cards flex-wrap ke saath, (4) Testimonials section — 2 quotes side by side (align-items: stretch), (5) Pricing — 3 plans (Basic/Pro/Enterprise), middle plan highlighted, (6) Footer — two column (info left, links right). Sab sections in gap property use karo.',\n description_en: 'Build a complete landing page using only Flexbox. Required sections: (1) Sticky navbar — logo left, links centre, CTA button right (justify-content: space-between), (2) Hero — full height (100vh), content centred vertically + horizontally, (3) Features — 3 cards with flex-wrap, (4) Testimonials — 2 quotes side by side (align-items: stretch), (5) Pricing — 3 plans (Basic/Pro/Enterprise), middle plan highlighted, (6) Footer — two columns (info left, links right). Use the gap property in all sections.",
      hint: "Sticky navbar: position: sticky; top: 0; z-index: 100;. Hero: min-height: 100vh; display:flex; flex-direction: column; justify-content: center; align-items: center;. Cards: flex: 1 1 250px; max-width: 350px;",
    },
    quiz_en: [
      { q: 'justify-content: space-between what karta hai?', options: ['Items to center karta hai', 'Pehla item start pe, aakhri item end pe, baaki equal space mein', 'Sab items barabar space mein', 'Items ke around space deta hai'], correct: 1, explanation: 'space-between: pehla item left edge pe, aakhri item right edge pe, baaki items ke beech barabar gap. Navbar in perfect — logo left, links right!',
 q_en: 'What does justify-content: space-between do?',
 options_en: ['Centres items', 'First item at start, last at end, equal space between the rest', 'All items in equal space', 'Adds space around items'],
 explanation_en: 'space-between: first item on the left edge, last on the right edge, remaining items with equal gaps. Perfect for navbars — logo left, links right!' },
      { q: 'flex: 1 1 250px ka matlab is?', options: ['Width fixed 250px', 'Grow kar sakta hai, shrink kar sakta hai, base size 250px', 'Sirf 1 item dikhao', 'Height 250px'], correct: 1, explanation: 'flex: grow shrink basis. flex: 1 1 250px = 250px from start karo, grow kar sakte ho extra space mein, shrink bhi ho sakte ho. Responsive cards for perfect!',
 q_en: 'What does flex: 1 1 250px mean?',
 options_en: ['Fixed width of 250px', 'Can grow, can shrink, base size is 250px', 'Show only 1 item', 'Height is 250px'],
 explanation_en: 'flex: grow shrink basis. flex: 1 1 250px = start at 250px, can grow into extra space, can also shrink. Perfect for responsive cards!' },
      { q: 'Flexbox in item to vertically center karne for what use karte hain?', options: ['justify-content: center', 'align-items: center', 'vertical-align: center', 'top: 50%'], correct: 1, explanation: 'align-items: center cross-axis (vertical, by default) in items center karta hai. justify-content: center main-axis (horizontal, by default) in center karta hai.',
 q_en: 'What is used to vertically centre items in Flexbox?',
 options_en: ['justify-content: center', 'align-items: center', 'vertical-align: center', 'top: 50%'],
 explanation_en: 'align-items: center centres items on the cross-axis (vertical by default). justify-content: center centres on the main-axis (horizontal by default).' },
    ],
  },

  'html-w6-s2': {
    title_en: "CSS Grid — 2D Layout Master",
    content_en: `## CSS Grid — Two-Dimensional Layouts!

### What is CSS Grid?
Grid works in **two dimensions** — rows AND columns simultaneously. Perfect for complex page layouts.

### Defining a Grid
\`\`\`css
.grid {
  display: grid;

  /* Define columns */
  grid-template-columns: 200px 1fr 1fr;     /* 3 columns */
  grid-template-columns: repeat(3, 1fr);     /* 3 equal columns */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* responsive! */

  /* Define rows */
  grid-template-rows: auto 1fr auto;  /* header, content, footer */

  /* Gaps */
  gap: 20px;
  row-gap: 20px;
  column-gap: 10px;
}
\`\`\`

### Placing Items
\`\`\`css
.item {
  /* Span multiple columns/rows */
  grid-column: 1 / 3;      /* from line 1 to line 3 (2 columns) */
  grid-column: span 2;     /* span 2 columns from current position */
  grid-row: 1 / 3;         /* span 2 rows */

  /* Named areas */
  grid-area: header;
}

/* Named template areas */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

### fr Unit — Fractional Space
\`\`\`css
/* 1fr = one fraction of available space */
grid-template-columns: 1fr 2fr 1fr;
/* Total: 4 parts — 25%, 50%, 25% */

grid-template-columns: 300px 1fr;
/* 300px fixed, rest of space for second column */
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Grid Template Areas use karke ek complete dashboard banao. Layout: header (full width), sidebar (left 240px), main content (right flex), footer (full width). Main content mein: stats cards grid (4 cards, auto-fit), recent activity table, quick actions. Sidebar mein: navigation links, user profile. Featured card to grid-column: span 2 from wider banao. min-height: 100vh from full page coverage.',\n description_en: 'Build a complete dashboard using Grid Template Areas. Layout: header (full width), sidebar (left 240px), main content (right flex), footer (full width). Main content: stats cards grid (4 cards, auto-fit), recent activity table, quick actions. Sidebar: navigation links, user profile. Make a featured card wider with grid-column: span 2. Use min-height: 100vh for full page coverage.",
      hint: "grid-template-areas from named layout banao. sidebar li a.active ek highlight karo. Stats cards: display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;",
    },
    quiz_en: [
      { q: 'Flexbox and CSS Grid in when konsa use karna chahiye?', options: ['Hamesha Grid', 'Flexbox 1D layouts for (navbar, row of cards), Grid 2D for (page layout, dashboard)', 'Hamesha Flexbox', 'Dono same hain'], correct: 1, explanation: 'Flexbox = ek direction — row or column. Grid = do direction — rows and columns. Practical rule: navbar = flexbox, page layout = grid, cards = dono kaam karte hain!',
 q_en: 'When should you use Flexbox vs CSS Grid?',
 options_en: ['Always Grid', 'Flexbox for 1D layouts (navbars, rows of cards), Grid for 2D (page layout, dashboard)', 'Always Flexbox', 'Both are the same'],
 explanation_en: 'Flexbox = one direction — row or column. Grid = two directions — rows and columns. Practical rule: navbar = flexbox, page layout = grid, cards = either works!' },
      { q: 'grid-column: 1 / -1 what karta hai?', options: ['Item to column 1 pe rakhta hai', 'Item pehle from aakhri column tak full width le leta hai', 'Item column from bahar jaata hai', 'Grid delete karta hai'], correct: 1, explanation: '-1 ka matlab is "last column line". 1 / -1 = pehle column line from aakhri tak = full width! Responsive grid in featured items for perfect.',
 q_en: 'What does grid-column: 1 / -1 do?',
 options_en: ['Places item in column 1', 'Item spans from the first to the last column — full width', 'Item goes outside the grid', 'Deletes the grid'],
 explanation_en: '-1 means "the last column line". 1 / -1 = from the first column line to the last = full width! Perfect for featured items in a responsive grid.' },
      { q: 'repeat(auto-fit, minmax(250px, 1fr)) what karta hai?', options: ['Fixed 250px columns banata hai', 'Media queries ke bina responsive grid — screen size ke hisaab from columns adjust hote hain', 'Sirf ek column banata hai', '250 columns banata hai'], correct: 1, explanation: 'auto-fit: jitne columns fit hon screen mein. minmax(250px, 1fr): minimum 250px, maximum barabar space. Isse grid automatically responsive ho jaata is bina media queries ke!',
 q_en: 'What does repeat(auto-fit, minmax(250px, 1fr)) do?',
 options_en: ['Creates fixed 250px columns', 'Responsive grid without media queries — columns adjust automatically to screen size', 'Creates only one column', 'Creates 250 columns'],
 explanation_en: 'auto-fit: fit as many columns as the screen allows. minmax(250px, 1fr): minimum 250px, maximum equal space. This makes the grid automatically responsive without any media queries!' },
    ],
  },

  'html-w6-s3': {
    title_en: "Responsive Design — Mobile-First Approach",
    content_en: `## Responsive Design — Mobile-First Approach!

### Media Queries — Different Styles for Different Screens
\`\`\`css
/* Mobile first — default styles are for small screens */
.container { padding: 16px; }
.grid { grid-template-columns: 1fr; }  /* single column on mobile */

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container { padding: 24px; }
  .grid { grid-template-columns: 1fr 1fr; }  /* 2 columns */
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
  .grid { grid-template-columns: repeat(3, 1fr); }  /* 3 columns */
}

/* Large desktop (1400px+) */
@media (min-width: 1400px) {
  .container { max-width: 1400px; }
  .grid { grid-template-columns: repeat(4, 1fr); }
}
\`\`\`

### Responsive Typography
\`\`\`css
/* Fluid font size — scales with viewport */
h1 { font-size: clamp(1.5rem, 5vw, 3rem); }
p  { font-size: clamp(0.9rem, 2vw, 1.1rem); }

/* Viewport-relative units */
.hero { height: 100vh; }  /* 100% viewport height */
.hero { width: 100vw; }   /* 100% viewport width */
\`\`\`

### Responsive Images
\`\`\`css
img {
  max-width: 100%;  /* never wider than container */
  height: auto;     /* maintain aspect ratio */
}

/* Object-fit for fixed-size containers */
.thumbnail {
  width: 300px;
  height: 200px;
  object-fit: cover;    /* crop to fill, no distortion */
  object-position: top; /* align to top */
}
\`\`\`

### Common Breakpoints
\`\`\`css
/* Tailwind / popular convention */
/* sm:  640px  — small devices */
/* md:  768px  — tablets */
/* lg:  1024px — small laptops */
/* xl:  1280px — desktops */
/* 2xl: 1536px — large screens */
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Apni pichli blog page to fully responsive banao. Requirements: (1) Mobile (< 640px): single column, hamburger menu, font size chhota, (2) Tablet (640-1023px): 2 column cards, horizontal nav, (3) Desktop (1024px+): 3 columns, full nav, max-width container, (4) clamp() use karo headings for fluid typography, (5) Images: max-width: 100%; object-fit: cover; (6) Hamburger button — JS from toggle karo nav, (7) Print media query: @media print { nav, footer { display: none; } }',\n description_en: 'Make your previous blog page fully responsive. Requirements: (1) Mobile (< 640px): single column, hamburger menu, smaller fonts, (2) Tablet (640\u20131023px): 2-column cards, horizontal nav, (3) Desktop (1024px+): 3 columns, full nav, max-width container, (4) Use clamp() for fluid typography on headings, (5) Images: max-width: 100%; object-fit: cover; (6) Hamburger button — toggle nav with JS, (7) Print media query: @media print { nav, footer { display: none; } }",
      hint: "Mobile-first approach: pehle mobile styles likho, phir @media (min-width: 640px) in tablet overrides, phir @media (min-width: 1024px) in desktop. clamp(24px, 5vw, 48px) fluid font size deta hai.",
    },
    quiz_en: [
      { q: 'Mobile-first design is?', options: ['Sirf mobile for design karo', 'Pehle mobile for CSS likho, phir media queries from desktop for expand karo', 'Mobile app banao', 'Responsive ignore karo'], correct: 1, explanation: 'Mobile-first: default CSS mobile for hota is (min-width queries use karo). Desktop-first: default CSS desktop for hota is (max-width queries use karo). Mobile-first better performance deta is mobile pe.',
 q_en: 'What is mobile-first design?',
 options_en: ['Design only for mobile', 'Write CSS for mobile first, then expand for desktop with media queries', 'Build a mobile app', 'Ignore responsiveness'],
 explanation_en: 'Mobile-first: default CSS is for mobile (use min-width queries). Desktop-first: default CSS is for desktop (use max-width queries). Mobile-first gives better performance on mobile.' },
      { q: 'clamp(24px, 5vw, 64px) what karta hai?', options: ['Font size 24px fix karta hai', 'Font size 5vw hoti hai, minimum 24px, maximum 64px', 'Text clamp karta hai', 'Font size 64px fix karta hai'], correct: 1, explanation: 'clamp(min, value, max): value 5vw use karo, but never 24px from chhota and never 64px from bada. Small screen pe 24px, large pe 64px, medium pe kuch beech in — responsive typography!',
 q_en: 'What does clamp(24px, 5vw, 64px) do?',
 options_en: ['Fixes font size at 24px', 'Font size is 5vw, with a minimum of 24px and maximum of 64px', 'Clamps the text', 'Fixes font size at 64px'],
 explanation_en: 'clamp(min, value, max): use the value 5vw, but never smaller than 24px and never larger than 64px. Small screens get 24px, large screens 64px, medium screens something in between — responsive typography!' },
      { q: 'viewport meta tag responsive design in why zaruri hai?', options: ['Speed ke liye', 'Mobile browsers to bata ta is page mobile screen width pe render karo, desktop width pe nahi', 'SEO ke liye', 'Fonts ke liye'], correct: 1, explanation: 'Bina viewport meta tag ke, mobile browser page to desktop screen (980px) pe render karta is and zoom out karta is — bahut chhota dikhta hai. width=device-width from actual device width pe render hota hai.',
 q_en: 'Why is the viewport meta tag essential for responsive design?',
 options_en: ['For speed', 'Tells mobile browsers to render the page at mobile screen width, not desktop width', 'For SEO', 'For fonts'],
 explanation_en: 'Without the viewport meta tag, mobile browsers render the page at desktop width (980px) and zoom out — it looks tiny. width=device-width renders it at the actual device width.' },
    ],
  },

  'html-w6-s4': {
    title_en: "Week 6 Project — Complete Responsive Portfolio",
    content_en: `## Week 6 Project — Complete Responsive Portfolio!

Upgrade your Month 1 portfolio with full CSS — modern, mobile-responsive!

### Design Requirements:
\`\`\`
Colour palette: Pick one from below
  → Blue: #1a1a2e, #16213e, #0f3460, #533483
  → Green: #1a2a1a, #2d6a4f, #40916c, #95d5b2

Fonts: Google Fonts
  → Heading: Syne (bold, modern)
  → Body: Inter (clean, readable)

Layout:
  → Hero section (name + title + CTA buttons)
  → Skills grid (Flexbox, 3–4 per row)
  → Projects grid (CSS Grid, responsive)
  → Contact form (styled)
  → Footer
\`\`\`

### Responsive Navbar:
\`\`\`css
/* Desktop: horizontal links */
nav { display: flex; gap: 24px; }

/* Mobile: hamburger menu (CSS only) */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-links.open { display: flex; flex-direction: column; }
  .hamburger { display: block; }
}
\`\`\`

### Checklist:
- ✅ Mobile-first CSS
- ✅ Works at 320px, 768px, 1024px, 1440px
- ✅ Google Fonts loaded
- ✅ Smooth hover effects on cards and buttons
- ✅ Form is usable on mobile
- ✅ Images are responsive (max-width: 100%)
- ✅ No horizontal scroll on any screen size`,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!-- Same as Hinglish version above — content is already in English -->`,
    task_en: {
      description: "Apna complete responsive portfolio banao jo sach in professional dikhe. Requirements: (1) Dark theme (#0f172a background), (2) CSS variables (:root in --primary, --accent colors), (3) Sticky blur navbar + hamburger, (4) Hero: gradient text, animated subtitle, 2 CTA buttons, (5) Skills: auto-fit grid, animated skill bars, (6) Projects: 3+ real or fictional projects, hover effects, tech tags, (7) Footer: flexbox space-between, social links, (8) Fully responsive — mobile from desktop tak, (9) Google Fonts, (10) scroll-behavior: smooth.',\n description_en: 'Build a complete responsive portfolio that genuinely looks professional. Requirements: (1) Dark theme (#0f172a background), (2) CSS variables (:root with --primary, --accent colours), (3) Sticky blur navbar + hamburger, (4) Hero: gradient text, animated subtitle, 2 CTA buttons, (5) Skills: auto-fit grid, animated skill bars, (6) Projects: 3+ real or fictional projects, hover effects, tech tags, (7) Footer: flexbox space-between, social links, (8) Fully responsive — mobile to desktop, (9) Google Fonts, (10) scroll-behavior: smooth.",
      hint: "CSS variables: :root { --primary: #6366f1; } phir var(--primary) use karo poore CSS mein. Skill bars: <div class=\"skill-fill\" style=\"width:85%\"> from dynamic width set karo. backdrop-filter: blur(12px) glass navbar effect deta hai.",
    },
    quiz_en: [
      { q: 'CSS variables (:root) use karne ka main benefit is?', options: ['Faster loading', 'Ek jagah value change karo — poori website update ho jaati hai', 'Better animations', 'More colors available'], correct: 1, explanation: 'CSS variables define karo :root mein, use karo var(--name) se. Color scheme change karna ho toh sirf :root in change karo — poore page pe instantly apply ho jaata hai!',
 q_en: 'What is the main benefit of using CSS variables (:root)?',
 options_en: ['Faster loading', 'Change a value in one place — the entire website updates', 'Better animations', 'More colours available'],
 explanation_en: 'Define CSS variables in :root, use them with var(--name). If you want to change the colour scheme, just update :root — it applies instantly across the whole page!' },
      { q: 'backdrop-filter: blur() what effect deta hai?', options: ['Text blur karta hai', 'Element ke peeche wale content to blur karta is — glass morphism effect', 'Image blur karta hai', 'Screen blur karta hai'], correct: 1, explanation: 'backdrop-filter sirf element ke behind wale content pe apply hota hai. blur() ke saath glass/frosted effect aata is — premium looking navbars and cards for perfect!',
 q_en: 'What effect does backdrop-filter: blur() create?',
 options_en: ['Blurs text', 'Blurs the content behind the element — glass morphism effect', 'Blurs the image', 'Blurs the screen'],
 explanation_en: 'backdrop-filter applies only to the content behind the element. Combined with blur(), it creates a glass/frosted effect — perfect for premium-looking navbars and cards!' },
      { q: 'scroll-behavior: smooth what karta hai?', options: ['Page scroll stop karta hai', 'Anchor links (#section) pe click karne pe smooth animated scroll hota hai', 'Page auto scroll karta hai', 'Scroll speed badhata hai'], correct: 1, explanation: 'html { scroll-behavior: smooth; } from jab bhi koi #section link click karo, page smoothly animate karke wahan jaata is — abrupt jump not karta.',
 q_en: 'What does scroll-behavior: smooth do?',
 options_en: ['Stops page scrolling', 'Anchor links (#section) scroll smoothly with animation when clicked', 'Auto-scrolls the page', 'Increases scroll speed'],
 explanation_en: 'html { scroll-behavior: smooth; } makes the page smoothly animate to the target when any #section link is clicked — no abrupt jump.' },
    ],
  },

};

// ── WEEK 7 ──────────────────────────────────────────────────
const W7 = {
  'html-w7-s1': {
    title_en: "CSS Transitions — Smooth Changes",
    content_en: `## CSS Transitions — Smooth Changes!

### What is a Transition?
When a CSS property changes (on hover, focus, click), a transition smoothly animates between the old and new value.

\`\`\`css
/* Basic syntax */
.btn {
  background: blue;
  transition: property duration timing-function delay;
}

/* Common usage */
.btn {
  background: #4472C4;
  transform: scale(1);
  transition: all 0.3s ease;  /* all properties, 0.3s, ease curve */
}

.btn:hover {
  background: #2856a0;
  transform: scale(1.05);
}
\`\`\`

### Transition Properties
\`\`\`css
/* Single property */
transition: background-color 0.3s ease;

/* Multiple properties */
transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s;

/* All properties */
transition: all 0.3s ease;

/* Duration options */
transition-duration: 0.3s;   /* 300ms */
transition-duration: 500ms;
\`\`\`

### Timing Functions
\`\`\`css
transition-timing-function: ease;        /* slow-fast-slow (default) */
transition-timing-function: linear;      /* constant speed */
transition-timing-function: ease-in;     /* slow start */
transition-timing-function: ease-out;    /* slow end */
transition-timing-function: ease-in-out; /* slow start and end */
transition-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55); /* custom */
\`\`\`

### Practical Examples
\`\`\`css
/* Card lift on hover */
.card {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.2);
}

/* Smooth colour change */
.nav-link {
  color: #ccc;
  transition: color 0.2s ease;
}
.nav-link:hover { color: white; }

/* Expanding underline */
.link { position: relative; }
.link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 2px;
  background: #4472C4;
  transition: width 0.3s ease;
}
.link:hover::after { width: 100%; }
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Apni portfolio website in yeh transitions add karo: (1) Navbar links — hover pe color change + underline animation (::after width), (2) Project cards — hover pe translateY(-8px) + box-shadow, (3) Skills progress bars — fill karne pe transition (width 1s ease), (4) Profile photo — hover pe scale(1.05) + border glow, (5) All buttons — hover lift + active press, (6) Form inputs — :focus pe border glow effect, (7) Footer social links — hover pe scale + color change.',\n description_en: 'Add these transitions to your portfolio website: (1) Navbar links — colour change + underline animation on hover (::after width), (2) Project cards — translateY(-8px) + box-shadow on hover, (3) Skills progress bars — transition on fill (width 1s ease), (4) Profile photo — scale(1.05) + border glow on hover, (5) All buttons — hover lift + active press, (6) Form inputs — border glow on :focus, (7) Footer social links — scale + colour change on hover.",
      hint: "Progress bar transition: pehle .skill-fill { width: 0; transition: width 1s ease; } set karo, phir JavaScript or inline style from actual width set karo. Yeh ek nice loading animation deta hai.",
    },
    quiz_en: [
      { q: 'transition: all 0.3s ease; and specific property ka fark is?', options: ['Koi fark nahi', '"all" sab properties animate karta is — heavier. Specific property sirf wo ek animate karta is — better performance', '"all" faster hai', 'Specific property kaam not karta'], correct: 1, explanation: 'transition: all performance cost zyada is kyunki browser har property check karta hai. Specific: transition: transform 0.3s ease; sirf woh property track karta is — better for performance.',
 q_en: 'What is the difference between transition: all 0.3s ease; and a specific property?',
 options_en: ['"all" and specific are the same', '"all" animates every property — heavier. Specific only animates that one property — better performance', '"all" is faster', 'Specific property does not work'],
 explanation_en: 'transition: all has a higher performance cost because the browser checks every property. Specific: transition: transform 0.3s ease; only tracks that one property — better for performance.' },
      { q: 'cubic-bezier(0.34, 1.56, 0.64, 1) what deta hai?', options: ['Linear motion', 'Bouncy spring effect — value 1 from upar jaata hai', 'Slow motion', 'No animation'], correct: 1, explanation: '1.56 > 1 matlab value "overshoot" karta is — element thoda zyada jaata is phir wapis aata hai. Yeh natural spring/bounce feel deta hai.',
 q_en: 'What does cubic-bezier(0.34, 1.56, 0.64, 1) produce?',
 options_en: ['Linear motion', 'A bouncy spring effect — the value goes above 1', 'Slow motion', 'No animation'],
 explanation_en: '1.56 > 1 means the value "overshoots" — the element goes a little further then springs back. This gives a natural spring/bounce feel.' },
      { q: ':hover transition for kahan transition property likhni chahiye?', options: [':hover rule mein', 'Base element pe (normal state)', 'Dono jagah same', 'Kisi alag file mein'], correct: 1, explanation: 'Transition base element pe likhte hain, :hover in nahi. Base pe likhne from hover in AND hover out dono smooth hote hain. :hover in likhne from sirf hover IN smooth hota hai.',
 q_en: 'Where should the transition property be written for a :hover transition?',
 options_en: ['In the :hover rule', 'On the base element (normal state)', 'Same in both places', 'In a separate file'],
 explanation_en: 'Write transition on the base element, not in :hover. Writing it on the base element makes both hover IN and hover OUT smooth. Writing it only in :hover makes only the hover IN smooth.' },
    ],
  },

  'html-w7-s2': {
    title_en: "CSS Transforms — Move, Rotate, Scale Elements",
    content_en: `## CSS Transforms — Move, Rotate, and Scale Elements!

### Transform Functions
\`\`\`css
/* Translate — move position */
transform: translateX(50px);      /* move right */
transform: translateY(-20px);     /* move up */
transform: translate(50px, -20px); /* move right and up */
transform: translate(-50%, -50%); /* useful for centering */

/* Scale — resize */
transform: scale(1.1);     /* 10% bigger */
transform: scale(0.8);     /* 20% smaller */
transform: scaleX(2);      /* double width */
transform: scale(1.1, 0.9);/* wider but shorter */

/* Rotate */
transform: rotate(45deg);
transform: rotate(-90deg);
transform: rotateX(45deg); /* 3D flip on X axis */
transform: rotateY(180deg);/* 3D flip on Y axis (card flip) */

/* Skew */
transform: skewX(20deg);
transform: skewY(10deg);

/* Multiple transforms */
transform: translateY(-10px) rotate(5deg) scale(1.05);
\`\`\`

### Transform Origin
\`\`\`css
/* Default: centre of element */
transform-origin: center;

/* Custom origin */
transform-origin: top left;
transform-origin: bottom right;
transform-origin: 0 0;        /* top-left corner */
transform-origin: 50% 100%;   /* bottom centre */
\`\`\`

### 3D Card Flip Effect
\`\`\`css
.card-container {
  perspective: 1000px;  /* 3D perspective depth */
}

.card {
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.card:hover {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}
\`\`\`

### Centring with Transform
\`\`\`css
/* Perfect centring — works with any size! */
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
\`\`\``,
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Ek interactive \"Skills Showcase\" page banao transforms use karke. Har skill card pe: (1) Hover pe rotateY(10deg) tilt effect, (2) Click pe full rotateY(180deg) flip — front in skill name and icon, back in skill description and proficiency level, (3) Loading spinner jab page load ho, (4) Hero section in floating elements (different translateY pe loop karte hue — CSS animations use karo), (5) \"Featured\" card pe CSS glowing border effect.',\n description_en: 'Build an interactive \"Skills Showcase\" page using transforms. On each skill card: (1) rotateY(10deg) tilt effect on hover, (2) Full rotateY(180deg) flip on click — skill name and icon on front, description and proficiency on back, (3) A loading spinner when the page loads, (4) Floating elements in the hero section (CSS animations looping at different translateY values), (5) Glowing CSS border effect on the \"Featured\" card.",
      hint: "Click flip for JavaScript class toggle use karo: element.classList.toggle(\"flipped\"). CSS in .flipped { transform: rotateY(180deg); }. Floating: @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }",
    },
    quiz_en: [
      { q: 'transform: translate(-50%, -50%) when use karte hain?', options: ['Image rotate karne ke liye', 'position: absolute element to perfectly center karne for (top:50% left:50% ke saath)', 'Text move karne ke liye', 'Element hide karne ke liye'], correct: 1, explanation: 'top:50% left:50% element ka top-left corner center pe le jaata hai. translate(-50%,-50%) element to apni khud ki size ka 50% back move karta is — perfect center!',
 q_en: 'When do you use transform: translate(-50%, -50%)?',
 options_en: ['To rotate an image', 'To perfectly centre a position: absolute element (with top:50% left:50%)', 'To move text', 'To hide an element'],
 explanation_en: 'top:50% left:50% puts the top-left corner at the centre. translate(-50%,-50%) moves the element back by 50% of its own size — perfect centre!' },
      { q: 'backface-visibility: hidden when zaruri hota hai?', options: ['Hamesha', '3D card flip in — card ke peeche wale side to hide karne for jab woh face-down ho', 'Images ke liye', 'Text ke liye'], correct: 1, explanation: 'Card flip in front and back dono sides hain. backface-visibility: hidden from jab ek side 180deg face-down ho toh woh invisible ho jaati is — warna dono sides ek saath dikhte hain.',
 q_en: 'When is backface-visibility: hidden necessary?',
 options_en: ['Always', 'In 3D card flips — to hide the back side when it is face-down', 'For images', 'For text'],
 explanation_en: 'A card flip has a front and a back side. backface-visibility: hidden makes a side invisible when it is rotated 180deg face-down — otherwise both sides show at the same time.' },
      { q: 'Multiple transforms ek saath how apply karte hain?', options: ['transform: translateY(-8px); transform: scale(1.1);', 'transform: translateY(-8px) scale(1.1);', 'transform: [translateY(-8px), scale(1.1)]', 'transforms: translateY(-8px) scale(1.1);'], correct: 1, explanation: 'Multiple transforms space from separate karke ek hi transform property in likhe jaate hain: transform: translateY(-8px) scale(1.1) rotate(5deg);',
 q_en: 'How do you apply multiple transforms at once?',
 options_en: ['transform: translateY(-8px); transform: scale(1.1);', 'transform: translateY(-8px) scale(1.1);', 'transform: [translateY(-8px), scale(1.1)]', 'transforms: translateY(-8px) scale(1.1);'],
 explanation_en: 'Multiple transforms are written space-separated in a single transform property: transform: translateY(-8px) scale(1.1) rotate(5deg);' },
    ],
  },

  'html-w7-s3': {
    title_en: "CSS Animations — Custom Animations with @keyframes",
    content_en: `## CSS Animations — Custom Animations with @keyframes!

### @keyframes — Define the Animation
\`\`\`css
/* Define keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0%   { transform: translateY(0); }
  40%  { transform: translateY(-30px); }
  60%  { transform: translateY(-15px); }
  80%  { transform: translateY(-5px); }
  100% { transform: translateY(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
\`\`\`

### Apply the Animation
\`\`\`css
.element {
  animation-name:            fadeIn;
  animation-duration:        0.5s;
  animation-timing-function: ease-out;
  animation-delay:           0.2s;
  animation-iteration-count: 1;     /* or: infinite, 3 */
  animation-direction:       normal; /* or: reverse, alternate */
  animation-fill-mode:       forwards; /* keep final state */

  /* Shorthand: name duration timing delay count direction fill-mode */
  animation: fadeIn 0.5s ease-out 0.2s 1 normal forwards;
}

/* Multiple animations */
.card {
  animation: slideUp 0.5s ease, fadeIn 0.3s ease;
}
\`\`\`

### Loading Spinner
\`\`\`css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top-color: #4472C4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
\`\`\`

### Pulse Animation (for CTAs)
\`\`\`css
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(68, 114, 196, 0.7); }
  70%  { box-shadow: 0 0 0 15px rgba(68, 114, 196, 0); }
  100% { box-shadow: 0 0 0 0 rgba(68, 114, 196, 0); }
}

.btn-cta { animation: pulse 2s infinite; }
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Apni portfolio website in yeh animations add karo: (1) Page load pe hero text fadeInUp with stagger (name 0.2s delay, tagline 0.4s, buttons 0.6s), (2) Animated gradient background on hero, (3) Skill cards staggered appearance (nth-child delays), (4) Loading skeleton placeholder (3-4 shimmer bars) — page load hone pe JS from remove karo, (5) Scroll-triggered animation — elements appear karen jab viewport in aayein (Intersection Observer use karo), (6) Success animation jab contact form submit ho.',\n description_en: 'Add these animations to your portfolio website: (1) Hero text fadeInUp with stagger on page load (name 0.2s delay, tagline 0.4s, buttons 0.6s), (2) Animated gradient background on hero, (3) Staggered appearance for skill cards (nth-child delays), (4) Loading skeleton placeholder (3-4 shimmer bars) — remove with JS once loaded, (5) Scroll-triggered animation — elements appear when entering the viewport (use Intersection Observer), (6) Success animation when the contact form is submitted.",
      hint: "Intersection Observer: const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add(\"visible\"); }); }); document.querySelectorAll(\".animate-on-scroll\").forEach(el => observer.observe(el));",
    },
    quiz_en: [
      { q: 'animation-fill-mode: forwards what karta hai?', options: ['Animation forward direction in chalata hai', 'Animation khatam hone ke baad element last keyframe ki state in rakhta hai', 'Animation loop karta hai', 'Animation delay karta hai'], correct: 1, explanation: 'forwards: animation khatam hone ke baad element wahan reh jaata is jahan animation ne chhoda tha (last keyframe). Bina iske element apni original state in wapis aa jaata hai.',
 q_en: 'What does animation-fill-mode: forwards do?',
 options_en: ['Runs the animation in the forward direction', 'After the animation ends, keeps the element in the state of the last keyframe', 'Loops the animation', 'Delays the animation'],
 explanation_en: 'forwards: after the animation ends, the element stays at the last keyframe state. Without it, the element snaps back to its original state.' },
      { q: 'Staggered animation for which CSS property use karte hain?', options: ['animation-duration', 'animation-delay — nth-child pe alag alag delay', 'animation-iteration-count', 'animation-direction'], correct: 1, explanation: 'Stagger effect for har item pe alag animation-delay dete hain: .item:nth-child(1){animation-delay:0.1s} .item:nth-child(2){animation-delay:0.2s} etc.',
 q_en: 'Which CSS property is used for staggered animations?',
 options_en: ['animation-duration', 'animation-delay — different delay for each nth-child', 'animation-iteration-count', 'animation-direction'],
 explanation_en: 'For a stagger effect, give each item a different animation-delay: .item:nth-child(1){animation-delay:0.1s} .item:nth-child(2){animation-delay:0.2s} etc.' },
      { q: 'Transition and @keyframes animation in main fark is?', options: ['Koi fark nahi', 'Transition = 2 states ke beech (A→B), @keyframes = complex multi-step sequences + auto-play', '@keyframes sirf hover pe kaam karta hai', 'Transition zyada features deta hai'], correct: 1, explanation: 'Transition CSS property change pe trigger hota is (hover, focus etc.) — sirf start and end. @keyframes = apna animation define karo, automatically play karo, loops, complex sequences sab possible.',
 q_en: 'What is the main difference between a transition and a @keyframes animation?',
 options_en: ['No difference', 'Transition = between 2 states (A→B), @keyframes = complex multi-step sequences + auto-play', '@keyframes only works on hover', 'Transition has more features'],
 explanation_en: 'Transition triggers on a CSS property change (hover, focus etc.) — just start and end. @keyframes = define your own animation, auto-play, loops, complex sequences all possible.' },
    ],
  },

  'html-w7-s4': {
    title_en: "Week 7 Project — Animated Landing Page",
    content_en: `## Week 7 Project — Animated Landing Page!

Build a stunning animated landing page combining all CSS skills!

### Required Animations:
\`\`\`
Hero Section:
  → Heading: slideUp + fadeIn on page load
  → Subtext: slideUp with 0.2s delay
  → CTA Button: pulse animation + hover lift

Navigation:
  → Logo: fadeIn on load
  → Nav links: underline expansion on hover

Feature Cards:
  → Slide in from left/right on scroll
  → Hover: lift + shadow increase

Statistics Section:
  → Numbers count up on scroll (CSS only: opacity transition)

Skills Section:
  → Progress bars animate width on load
\`\`\`

### Scroll Animation with Intersection Observer (JavaScript):
\`\`\`javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
});

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
\`\`\`

\`\`\`css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.animate {
  opacity: 1;
  transform: translateY(0);
}
\`\`\`

### Checklist:
- ✅ Hero section with entrance animation
- ✅ Smooth hover effects on all interactive elements
- ✅ Loading spinner while page loads
- ✅ At least one looping animation
- ✅ Responsive on mobile
- ✅ No jarring/flashing animations`,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!-- Same code works in English too — see above for the complete demo -->`,
    task_en: {
      description: "Apni pichli portfolio website to fully animated banao. Sab animations include karo: animated gradient hero, staggered card appearance, scroll-triggered visibility, hover transitions on every interactive element, image zoom on project cards, form input focus effects, nav underline animation. Bonus: ek loading screen banao (1-2 second shimmer) jo then fade out ho jaaye.',\n description_en: 'Make your previous portfolio website fully animated. Include all animations: animated gradient hero, staggered card appearance, scroll-triggered visibility, hover transitions on every interactive element, image zoom on project cards, form input focus effects, nav underline animation. Bonus: build a loading screen (1-2 second shimmer) that then fades out.",
      hint: "Loading screen: ek full-page div banao id=\"loader\", CSS in opacity: 1 + transition, JS in setTimeout(() => { loader.style.opacity = \"0\"; setTimeout(() => loader.remove(), 500); }, 1500). Intersection Observer feature cards for use karo.",
    },
    quiz_en: [
      { q: 'Intersection Observer when use karte hain?', options: ['Hamesha', 'Scroll-triggered animations for — jab element viewport in aaye toh animation play karo', 'Click events ke liye', 'Form validation ke liye'], correct: 1, explanation: 'Intersection Observer browser API is jo batata is when koi element viewport in enter/exit karta is — perfect for scroll animations bina expensive scroll event listeners ke.',
 q_en: 'When do you use Intersection Observer?',
 options_en: ['Always', 'For scroll-triggered animations — play animation when element enters the viewport', 'For click events', 'For form validation'],
 explanation_en: 'Intersection Observer is a browser API that tells you when an element enters or exits the viewport — perfect for scroll animations without expensive scroll event listeners.' },
      { q: 'animation: fadeIn 0.5s ease 0.3s both; in "both" what karta hai?', options: ['Dono directions animate karta hai', 'fill-mode: both — delay from pehle backwards state maintain, khatam hone ke baad forwards state', 'Dono elements animate karta hai', 'Loop karta hai'], correct: 1, explanation: '"both" = backwards + forwards. Backwards: delay ke dauran element initial keyframe (from) state in rahega. Forwards: animation khatam hone ke baad final keyframe (to) state in rahega.',
 q_en: 'What does "both" do in animation: fadeIn 0.5s ease 0.3s both;?',
 options_en: ['Animates in both directions', 'fill-mode: both — maintains backwards state during delay and forwards state after completion', 'Animates both elements', 'Loops the animation'],
 explanation_en: '"both" = backwards + forwards. Backwards: during the delay, the element stays in the initial keyframe (from) state. Forwards: after completion, it stays in the final (to) state.' },
      { q: 'backdrop-filter: blur() use karne from pehle what ensure karna hai?', options: ['Kuch nahi', 'Element ka background transparent or semi-transparent hona chahiye — not toh blur effect not dikhega', 'Fixed width chahiye', 'JavaScript zaruri hai'], correct: 1, explanation: 'backdrop-filter element ke BEHIND wale content to blur karta hai. Agar element ka background opaque (solid color) is toh blur effect show not hoga kyunki behind ka content visible hi not hai.',
 q_en: 'What must you ensure before using backdrop-filter: blur()?',
 options_en: ['Nothing', 'The element background must be transparent or semi-transparent — otherwise the blur effect will not be visible', 'A fixed width is needed', 'JavaScript is required'],
 explanation_en: 'backdrop-filter blurs the content BEHIND the element. If the element has an opaque (solid colour) background, the blur effect will not show because the content behind is not visible.' },
    ],
  },

};

// ── WEEK 8 ──────────────────────────────────────────────────
const W8 = {
  'html-w8-s1': {
    title_en: "CSS Custom Properties (Variables)",
    content_en: `## CSS Custom Properties (Variables)!

### What are CSS Variables?
CSS Variables let you store values and reuse them — like variables in programming!

\`\`\`css
/* Define variables in :root (global scope) */
:root {
  /* Colours */
  --primary: #4472C4;
  --primary-dark: #2856a0;
  --secondary: #FF6B6B;
  --bg: #0f0f1a;
  --surface: #1a1a2e;
  --text: #e0e0e0;
  --text-muted: #888;
  --border: rgba(255,255,255,0.1);

  /* Spacing scale */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 48px;

  /* Typography */
  --font-body: 'Inter', sans-serif;
  --font-heading: 'Syne', sans-serif;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.5rem;

  /* Borders */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.3);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.4);
}

/* Use variables */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  color: var(--text);
}
\`\`\`

### Dark / Light Theme Toggle
\`\`\`css
[data-theme="light"] {
  --bg: #ffffff;
  --surface: #f5f5f5;
  --text: #333333;
  --border: rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  --bg: #0f0f1a;
  --surface: #1a1a2e;
  --text: #e0e0e0;
  --border: rgba(255,255,255,0.1);
}
\`\`\`

\`\`\`javascript
const toggle = document.querySelector('#theme-toggle');
toggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute(
    'data-theme', current === 'dark' ? 'light' : 'dark'
  );
});
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Apni portfolio website in complete design system banao CSS variables se: (1) :root in saari design tokens define karo (colors, spacing, radius, shadows, transitions), (2) Dark/Light mode toggle add karo — localStorage in save karo, (3) \"Prefer color scheme\" media query bhi add karo (auto dark mode system setting ke hisaab se), (4) Sab existing CSS in hardcoded values to variables from replace karo, (5) Ek \"Theme Switcher\" button banao navbar in — sun icon light ke liye, moon icon dark ke liye.',\n description_en: 'Build a complete design system for your portfolio using CSS variables: (1) Define all design tokens in :root (colours, spacing, radius, shadows, transitions), (2) Add a Dark/Light mode toggle — save preference to localStorage, (3) Also add a prefers-color-scheme media query (auto dark mode from system settings), (4) Replace all hardcoded values in existing CSS with variables, (5) Add a \"Theme Switcher\" button in the navbar — sun icon for light, moon icon for dark.",
      hint: "Sirf ek attribute set karo: document.documentElement.setAttribute(\"data-theme\", \"dark\"). CSS variable override: [data-theme=\"dark\"] { --bg: #0f172a; }. Moon/Sun emoji use kar sakte ho or lucide icons. localStorage.setItem(\"theme\", \"dark\") from save karo.",
    },
    quiz_en: [
      { q: 'CSS variables and SCSS variables in main fark is?', options: ['Koi fark nahi', 'CSS variables runtime pe change ho sakte are (JS se), SCSS variables compile-time pe fixed ho jaate hain', 'SCSS faster hai', 'CSS variables sirf colors for hain'], correct: 1, explanation: 'SCSS variables = compilation pe replace ho jaate hain, runtime pe exist not karte. CSS variables = browser in live rahte hain, JS from change kiye ja sakte hain, scope ho sakte are — isliye dark mode possible hai!',
 q_en: 'What is the main difference between CSS variables and SCSS variables?',
 options_en: ['No difference', 'CSS variables can change at runtime (via JS), SCSS variables are fixed at compile time', 'SCSS is faster', 'CSS variables are only for colours'],
 explanation_en: 'SCSS variables = replaced at compilation, do not exist at runtime. CSS variables = live in the browser, can be changed by JS, can be scoped — that is why dark mode is possible!' },
      { q: 'var(--color-primary, #6366f1) in second value is?', options: ['Second variable', 'Fallback value — agar --color-primary defined not toh #6366f1 use hoga', 'Error value', 'Default animation'], correct: 1, explanation: 'var(--name, fallback) — agar --name undefined is toh fallback use hoga. Yeh useful is when variable might not be defined in all contexts.',
 q_en: 'What is the second value in var(--color-primary, #6366f1)?',
 options_en: ['A second variable', 'Fallback value — if --color-primary is not defined, #6366f1 will be used', 'Error value', 'Default animation'],
 explanation_en: 'var(--name, fallback) — if --name is undefined, the fallback is used. This is useful when a variable might not be defined in all contexts.' },
      { q: 'CSS variable to JS from how change karte hain?', options: ['CSS.setVariable("--color", "red")', 'document.documentElement.style.setProperty("--color-primary", "#ff0000")', 'document.style.variable("--color", "red")', 'CSS.variable.set("--color")'], correct: 1, explanation: 'document.documentElement.style.setProperty("--name", "value") from :root variables change kar sakte hain. Kisi specific element pe: element.style.setProperty("--name", "value").',
 q_en: 'How do you change a CSS variable from JavaScript?',
 options_en: ['CSS.setVariable("--color", "red")', 'document.documentElement.style.setProperty("--color-primary", "#ff0000")', 'document.style.variable("--color", "red")', 'CSS.variable.set("--color")'],
 explanation_en: 'document.documentElement.style.setProperty("--name", "value") changes :root variables. For a specific element: element.style.setProperty("--name", "value").' },
    ],
  },

  'html-w8-s2': {
    title_en: "Advanced CSS Pseudo-classes — :is(), :where(), :has()",
    content_en: `## Advanced CSS Pseudo-classes!

### :is() — Group Selectors Neatly
\`\`\`css
/* Instead of writing this: */
h1 a:hover, h2 a:hover, h3 a:hover { color: blue; }

/* Write this: */
:is(h1, h2, h3) a:hover { color: blue; }

/* Complex selectors become cleaner */
:is(.card, .post, .article) :is(h1, h2, h3) {
  font-weight: 700;
  color: var(--primary);
}
\`\`\`

### :where() — Zero Specificity
\`\`\`css
/* Same as :is() but specificity = 0 */
/* Useful for base styles that are easy to override */
:where(h1, h2, h3, h4, h5, h6) {
  font-family: var(--font-heading);
  line-height: 1.2;
}
\`\`\`

### :has() — Parent Selector (CSS Game-Changer!)
\`\`\`css
/* Style a card differently if it contains an image */
.card:has(img) { padding: 0; }
.card:has(img) .card-body { padding: 16px; }

/* Form validation */
.form-group:has(input:invalid) label { color: red; }
.form-group:has(input:valid)   label { color: green; }

/* Navigation with active link */
nav:has(a.active) { background: #1a1a2e; }
\`\`\`

### :not() — Exclude Elements
\`\`\`css
/* Style all buttons except disabled ones */
.btn:not(:disabled):hover { transform: translateY(-2px); }

/* Style all list items except the last */
li:not(:last-child) { border-bottom: 1px solid #eee; }

/* All inputs except checkboxes and radios */
input:not([type="checkbox"]):not([type="radio"]) {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
\`\`\`

### :focus-visible — Keyboard Focus Only
\`\`\`css
/* Remove ugly outline for mouse clicks */
button:focus { outline: none; }

/* Keep outline for keyboard navigation */
button:focus-visible {
  outline: 2px solid #4472C4;
  outline-offset: 2px;
}
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
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
    task_en: {
      description: "Apni portfolio website in modern CSS techniques apply karo: (1) :is() from repetitive selectors simplify karo (headings, lists, form elements), (2) :has() from form validation: .form-group:has(input:invalid) red border show karo, (3) Floating label inputs banao :has() use karke (bina JavaScript), (4) :focus-visible from accessibility improve karo, (5) :not() from navigation in active link to different style do, (6) :where() from global reset rules write karo zero specificity ke saath.',\n description_en: 'Apply modern CSS techniques to your portfolio website: (1) Use :is() to simplify repetitive selectors (headings, lists, form elements), (2) Use :has() for form validation: show red border for .form-group:has(input:invalid), (3) Build floating label inputs using :has() (no JavaScript), (4) Improve accessibility with :focus-visible, (5) Use :not() to give the active link in navigation a different style, (6) Write global reset rules with :where() (zero specificity).",
      hint: ".form-group:has(input:invalid) { --border-color: red; } — phir input in var(--border-color) use karo. Floating label: input ka placeholder=\" \" (space) lagao taaki :placeholder-shown kaam kare.",
    },
    quiz_en: [
      { q: ':is() and :where() in what fark hai?', options: ['Koi fark nahi', ':is() highest specificity use karta is list se, :where() ka specificity hamesha 0 hota hai', ':where() modern browsers in kaam not karta', ':is() sirf classes for hai'], correct: 1, explanation: ':is(.card, #hero) specificity = #hero ka (100). :where(.card, #hero) specificity = 0 (override karna bahut aasan). Use :where() for resets/utilities, :is() for semantic grouping.',
 q_en: 'What is the difference between :is() and :where()?',
 options_en: ['No difference', ':is() takes the highest specificity from the list, :where() always has specificity 0', ':where() does not work in modern browsers', ':is() is only for classes'],
 explanation_en: ':is(.card, #hero) specificity = #hero\'s (100). :where(.card, #hero) specificity = 0 (very easy to override). Use :where() for resets/utilities, :is() for semantic grouping.' },
      { q: ':has() CSS in what naya karta hai?', options: ['Faster animations', 'Parent to child ke hisaab from style karne ki ability — pehle yeh sirf JS from possible tha', 'Better colors', 'New layout system'], correct: 1, explanation: ':has() = CSS parent selector! Pehle "agar element ke andar yeh is toh parent to style karo" sirf JavaScript from possible tha. Ab pure CSS in possible is — form validation, card layouts, conditional styles sab!',
 q_en: 'What new ability does :has() add to CSS?',
 options_en: ['Faster animations', 'The ability to style a parent based on its children — previously only possible with JavaScript', 'Better colours', 'A new layout system'],
 explanation_en: ':has() = CSS parent selector! Previously, "if this element contains X, style the parent" was only possible with JavaScript. Now it is possible in pure CSS — form validation, card layouts, conditional styles, all of it!' },
      { q: ':focus-visible why behtar is :focus se?', options: ['Faster', 'Mouse users to unnecessary outline not dikha ta, keyboard users to zaruri outline dikha ta — best of both', 'More colorful', 'Works on more browsers'], correct: 1, explanation: ':focus = mouse click pe bhi ugly outline. :focus-visible = sirf keyboard navigation pe outline (Tab, Enter). Mouse users to distraction nahi, keyboard users to accessibility milti hai.',
 q_en: 'Why is :focus-visible better than :focus?',
 options_en: ['Faster', 'Does not show unnecessary outline to mouse users, but shows the essential outline to keyboard users — best of both worlds', 'More colourful', 'Works on more browsers'],
 explanation_en: ':focus = shows ugly outline even on mouse click. :focus-visible = outline only on keyboard navigation (Tab, Enter). No distraction for mouse users, full accessibility for keyboard users.' },
    ],
  },

  'html-w8-s3': {
    title_en: "Month 2 Capstone — Professional Website",
    content_en: `## Month 2 Capstone — Professional Website!

Apply all 4 weeks of CSS to build a complete professional website!

### Project: Tech Agency Website

**Pages Required:**
1. \`index.html\` — Home (hero, services, stats, testimonials)
2. \`work.html\` — Portfolio (filterable grid)
3. \`about.html\` — Team page
4. \`contact.html\` — Contact form + map

**CSS Architecture:**
\`\`\`css
/* style.css structure */
/* 1. Custom Properties (variables) */
/* 2. CSS Reset */
/* 3. Typography */
/* 4. Layout (container, grid, flex) */
/* 5. Components (card, btn, badge) */
/* 6. Sections (hero, services, etc.) */
/* 7. Animations */
/* 8. Media Queries */
\`\`\`

**Components to Build:**
\`\`\`css
/* Button variants */
.btn { ... }
.btn-primary { background: var(--primary); }
.btn-outline { border: 2px solid var(--primary); background: transparent; }
.btn-ghost { background: transparent; color: var(--text); }

/* Card */
.card { border-radius: var(--radius-md); background: var(--surface); ... }

/* Badge */
.badge { display: inline-flex; padding: 4px 12px; border-radius: var(--radius-full); }

/* Tag cloud */
.tag { background: rgba(68,114,196,0.1); color: var(--primary); ... }
\`\`\`

**Checklist:**
- ✅ CSS Variables for entire design system
- ✅ Mobile-first, responsive (320px – 1440px)
- ✅ Smooth transitions on all interactive elements
- ✅ At least 2 CSS animations (hero, loading)
- ✅ Dark/light mode toggle
- ✅ Perfect accessibility (contrast, focus states)
- ✅ Portfolio grid with CSS Grid
- ✅ Contact form with CSS validation states`,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!-- Same complete code — already in English. See above. -->`,
    task_en: {
      description: "Month 2 Capstone: Choose Option A, B, or C and build it completely. Minimum requirements: (1) CSS variables design system with at least 15 tokens, (2) Dark/Light mode with localStorage, (3) 3 media query breakpoints (mobile/tablet/desktop), (4) At least 5 different animations (@keyframes), (5) Flexbox navbar + CSS Grid content sections, (6) Card hover effects with transitions, (7) Scroll-triggered animations (Intersection Observer), (8) Modern selectors (:is(), :focus-visible), (9) Google Fonts, (10) Fully responsive. This is your Month 2 portfolio piece!',\n description_en: 'Month 2 Capstone: Choose Option A, B, or C and build it completely. Minimum requirements: (1) CSS variables design system with at least 15 tokens, (2) Dark/Light mode with localStorage, (3) 3 media query breakpoints (mobile/tablet/desktop), (4) At least 5 different animations (@keyframes), (5) Flexbox navbar + CSS Grid content sections, (6) Card hover effects with transitions, (7) Scroll-triggered animations (Intersection Observer), (8) Modern selectors (:is(), :focus-visible), (9) Google Fonts, (10) Fully responsive. This is your Month 2 portfolio piece!",
      hint: "Pehle HTML structure banao (poore site ka), phir CSS variables define karo, phir section by section style karo. Dark mode sabse last in add karo — sirf [data-theme=\"dark\"] { --bg: #0f172a; } add karo and colors swap ho jaayenge!",
    },
    quiz_en: [
      { q: 'Month 2 in CSS ke kaunse main topics cover kiye?', options: ['Sirf colors and fonts', 'CSS Basics, Flexbox, Grid, Responsive, Transitions, Transforms, Animations, Variables, Modern Selectors', 'Sirf layout', 'JavaScript and CSS'], correct: 1, explanation: 'Month 2 in CSS ka foundation from advanced tak sab kuch cover kiya: styling basics, Flexbox and Grid layouts, responsive design, CSS animations, CSS variables and dark mode, and modern selectors.',
 q_en: 'Which main CSS topics were covered in Month 2?',
 options_en: ['Only colours and fonts', 'CSS Basics, Flexbox, Grid, Responsive, Transitions, Transforms, Animations, Variables, Modern Selectors', 'Only layout', 'JavaScript and CSS'],
 explanation_en: 'Month 2 covered CSS from foundation to advanced: styling basics, Flexbox and Grid layouts, responsive design, CSS animations, CSS variables and dark mode, and modern selectors.' },
      { q: 'Professional website in performance for what dhyan rakhna chahiye?', options: ['Kuch nahi', 'Sirf zaruri animations, transform/opacity animate karo (not margin/width), system fonts or woff2 fonts use karo', 'Zyada animations better hain', 'CSS variables slow karte hain'], correct: 1, explanation: 'Performance tips: transform and opacity animate karo (GPU accelerated), margin/width/height animate karna expensive hai. Fonts: system font stack or preload Google Fonts. Animations: will-change: transform hint de sakte ho browser ko.',
 q_en: 'What should you keep in mind for performance on a professional website?',
 options_en: ['Nothing', 'Only essential animations, animate transform/opacity (not margin/width), use system fonts or woff2 fonts', 'More animations are better', 'CSS variables make sites slow'],
 explanation_en: 'Performance tips: animate transform and opacity (GPU accelerated) rather than margin/width/height (expensive). Fonts: use a system font stack or preload Google Fonts. Animations: you can hint with will-change: transform.' },
      { q: 'CSS sikhne ke baad next logical step is?', options: ['PHP seekhna', 'JavaScript — websites to interactive banane for (DOM manipulation, events, APIs)', 'Database seekhna', 'Server setup karna'], correct: 1, explanation: 'Web dev path: HTML (structure) → CSS (styling) → JavaScript (interactivity). JS from click events, form validation, API calls, dynamic content, animations sab possible hote are bina page reload ke!',
 q_en: 'What is the logical next step after learning CSS?',
 options_en: ['Learning PHP', 'JavaScript — to make websites interactive (DOM manipulation, events, APIs)', 'Learning databases', 'Setting up a server'],
 explanation_en: 'Web dev path: HTML (structure) → CSS (styling) → JavaScript (interactivity). With JS you can handle click events, form validation, API calls, dynamic content, and animations without a page reload!' },
    ],
  },

  'html-w8-s4': {
    title_en: "Month 2 Review and Month 3 Preview",
    content_en: `## Month 2 Review and Month 3 Preview!

### Month 2 Recap — CSS Mastered:

\`\`\`
Week 5: CSS Foundations
  ✅ Selectors (element, class, ID, attribute, pseudo)
  ✅ Box model (margin, padding, border, box-sizing)
  ✅ Display (block, inline, flex, grid, none)

Week 6: CSS Layout
  ✅ Flexbox — 1D layouts (nav, card rows, centering)
  ✅ CSS Grid — 2D layouts (page layouts, galleries)
  ✅ Responsive design, media queries, mobile-first

Week 7: CSS Motion
  ✅ Transitions (hover effects, state changes)
  ✅ Transforms (translate, rotate, scale, 3D)
  ✅ @keyframes animations (loader, entrance, pulse)

Week 8: CSS Advanced
  ✅ CSS Custom Properties (design system, theming)
  ✅ :is(), :where(), :has(), :not(), :focus-visible
  ✅ Professional website capstone
\`\`\`

### Month 3 Preview — JavaScript! ⚡

\`\`\`
Week 9:  JS Basics + DOM
  → Variables, functions, conditions, loops
  → document.querySelector, innerHTML, style
  → Event listeners (click, input, submit)

Week 10: Async JavaScript
  → Fetch API — call real APIs!
  → Promises and async/await
  → ES6+: arrow functions, destructuring, spread

Week 11: Advanced JS
  → OOP with Classes
  → Modules (import/export)
  → Performance and best practices

Week 12: Capstone
  → Full interactive portfolio
  → Real API integration
  → Deployment on Vercel/Netlify
\`\`\`

By Month 3 end, you will be able to build fully interactive websites that call real APIs — like a real frontend developer! 🚀`,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!-- Same code — see above, content is already in English where applicable -->`,
    task_en: {
      description: "Month 2 Final Challenge: (1) Apna capstone project W3C Validator from validate karo, (2) Browser DevTools in performance check karo — Lighthouse run karo (Performance, Accessibility, Best Practices), (3) Ek \"CSS Skills Summary\" page banao jisme progress bars from har week ka confidence level dikhao, (4) GitHub pe upload karo and README.md banao, (5) LinkedIn pe share karo — \"I just completed Month 2 of CSS on StudyEarn AI!\" Aage JavaScript seekhne for tayar ho jao!',\n description_en: 'Month 2 Final Challenge: (1) Validate your capstone project at the W3C Validator, (2) Check performance in Browser DevTools — run Lighthouse (Performance, Accessibility, Best Practices), (3) Create a \"CSS Skills Summary\" page with progress bars showing your confidence level for each week, (4) Upload to GitHub and write a README.md, (5) Share on LinkedIn — \"I just completed Month 2 of CSS on StudyEarn AI!\" Get ready to learn JavaScript next!",
      hint: "Lighthouse: Browser in F12 \u2192 Lighthouse tab \u2192 Analyze page load. 90+ score aim karo. GitHub: git init, git add ., git commit -m \"Month 2 Complete\", GitHub pe new repo create karo, phir push karo.",
    },
    quiz_en: [
      { q: 'CSS Grid and Flexbox in when konsa use karein?', options: ['Hamesha Grid', 'Grid = 2D layouts (rows AND columns), Flexbox = 1D (row OR column)', 'Hamesha Flexbox', 'Dono same hain'], correct: 1, explanation: 'Flexbox: navbar, button group, single row/column. Grid: page layout, card gallery, dashboard. Real world in dono milke use hote are — Grid page level pe, Flexbox components ke andar.',
 q_en: 'When should you use CSS Grid vs Flexbox?',
 options_en: ['Always Grid', 'Grid = 2D layouts (rows AND columns), Flexbox = 1D (row OR column)', 'Always Flexbox', 'Both are the same'],
 explanation_en: 'Flexbox: navbars, button groups, single rows/columns. Grid: page layouts, card galleries, dashboards. In the real world, both are used together — Grid at the page level, Flexbox inside components.' },
      { q: 'Web performance for sabse important CSS property kaunsi animate karni chahiye?', options: ['width and height', 'margin and padding', 'transform and opacity — GPU accelerated hain', 'background-color and font-size'], correct: 2, explanation: 'transform (translate, scale, rotate) and opacity GPU pe render hote are — no layout recalculation. width/height/margin animate karne pe browser har frame in poora layout recalculate karta is — expensive!',
 q_en: 'Which CSS properties should you animate for the best performance?',
 options_en: ['width and height', 'margin and padding', 'transform and opacity — they are GPU accelerated', 'background-color and font-size'],
 explanation_en: 'transform (translate, scale, rotate) and opacity render on the GPU — no layout recalculation. Animating width/height/margin forces the browser to recalculate the full layout every frame — expensive!' },
      { q: 'Ek professional web developer how banta hai?', options: ['Sirf tutorials dekhke', 'Projects banao, GitHub pe upload karo, real feedback lo, continuously seekhte raho', 'Certificate collect karo', 'Books padho'], correct: 1, explanation: 'Real developers: 20% theory, 80% practice. Real projects banao (GitHub pe dikhao), code reviews lo, communities join karo, production bugs fix karo. Yahi actual learning hai!',
 q_en: 'How does one become a professional web developer?',
 options_en: ['Just watch tutorials', 'Build projects, upload to GitHub, get real feedback, keep learning continuously', 'Collect certificates', 'Read books'],
 explanation_en: 'Real developers: 20% theory, 80% practice. Build real projects (show them on GitHub), get code reviews, join communities, fix production bugs. That is actual learning!' },
    ],
  },

};

// ── WEEK 9 ──────────────────────────────────────────────────
const W9 = {
  'html-w9-s1': {
    title_en: "JavaScript Introduction — DOM Manipulation",
    content_en: `## JavaScript — Making Webpages Interactive!

HTML + CSS create static content. JavaScript makes it **interactive**!

### Adding JavaScript
\`\`\`html
<!-- In <head> — use defer -->
<script src="script.js" defer></script>

<!-- At end of <body> (old way) -->
<script src="script.js"></script>

<!-- Inline (for small snippets) -->
<script>
  console.log("Hello from JS!");
</script>
\`\`\`

### DOM — Document Object Model
The DOM is a JavaScript representation of the HTML. You can select, modify, create, and delete elements.

\`\`\`javascript
// Select elements
const title   = document.querySelector('h1');        // first match
const buttons = document.querySelectorAll('.btn');   // all matches
const header  = document.getElementById('header');
const items   = document.getElementsByClassName('item');

// Modify content
title.textContent = 'New Title';           // text only (safer)
title.innerHTML   = 'Hello <b>World</b>'; // HTML content

// Modify attributes
const img = document.querySelector('img');
img.src = 'new-image.jpg';
img.alt = 'New description';
img.setAttribute('loading', 'lazy');

// Modify styles
title.style.color      = 'red';
title.style.fontSize   = '24px';
title.style.display    = 'none';   // hide
title.style.display    = 'block';  // show

// Add/remove classes
title.classList.add('active');
title.classList.remove('hidden');
title.classList.toggle('dark');    // add if absent, remove if present
title.classList.contains('active'); // true/false
\`\`\`

### Event Listeners
\`\`\`javascript
const btn = document.querySelector('#myBtn');

btn.addEventListener('click', function() {
  alert('Button clicked!');
});

// Arrow function (modern style)
btn.addEventListener('click', () => {
  btn.textContent = 'Clicked!';
  btn.style.background = 'green';
});

// Input event
const input = document.querySelector('#nameInput');
input.addEventListener('input', (e) => {
  document.querySelector('#greeting').textContent = \`Hello, \${e.target.value}!\`;
});

// Form submit
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();  // stop page reload!
  console.log('Form submitted');
});
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JS DOM Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 32px 20px; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    p  { color: #64748b; margin-bottom: 24px; }
    .section { background: #1e293b; border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    h2 { color: #a78bfa; font-size: 16px; margin-bottom: 16px; }
    .btn { padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 4px; font-size: 14px; transition: all 0.2s; }
    .btn:hover { background: #4f46e5; transform: translateY(-2px); }
    #output { background: #0f172a; border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; padding: 12px; margin-top: 12px; font-size: 14px; min-height: 40px; color: #a78bfa; }
    #colorBox { width: 100px; height: 100px; background: #6366f1; border-radius: 8px; margin: 12px 0; transition: all 0.3s; display: flex; align-items: center; justify-content: center; font-size: 32px; }
    input { background: #0f172a; border: 2px solid rgba(99,102,241,0.3); color: #e2e8f0; padding: 8px 12px; border-radius: 8px; width: 200px; font-size: 14px; outline: none; }
    input:focus { border-color: #6366f1; }
    #greeting { color: #a78bfa; font-size: 18px; margin-top: 8px; min-height: 28px; }
    #counter-display { font-size: 48px; font-weight: 800; color: #6366f1; text-align: center; padding: 16px 0; }
  </style>
</head>
<body>

  <h1>⚡ JavaScript DOM Demo</h1>
  <p>Buttons click karo — JS DOM ko manipulate karega!</p>

  <!-- 1. Content Change -->
  <div class="section">
    <h2>1. Content aur Style Change</h2>
    <div id="colorBox">🎨</div>
    <button class="btn" onclick="changeColor()">Random Color</button>
    <button class="btn" onclick="changeEmoji()">Change Emoji</button>
    <button class="btn" onclick="resetBox()">Reset</button>
  </div>

  <!-- 2. Counter -->
  <div class="section">
    <h2>2. Counter (State Management)</h2>
    <div id="counter-display">0</div>
    <div style="text-align:center">
      <button class="btn" onclick="updateCounter(-1)">− Minus</button>
      <button class="btn" onclick="updateCounter(0)">Reset</button>
      <button class="btn" onclick="updateCounter(1)">+ Plus</button>
    </div>
  </div>

  <!-- 3. Live Input -->
  <div class="section">
    <h2>3. Live Input → DOM Update</h2>
    <input type="text" id="nameInput" placeholder="Apna naam likho...">
    <div id="greeting">Naam likho toh greeting milegi!</div>
  </div>

  <!-- 4. DOM createElement -->
  <div class="section">
    <h2>4. Dynamic Elements Create Karo</h2>
    <button class="btn" onclick="addItem()">+ Item Add Karo</button>
    <button class="btn" onclick="clearItems()">Clear All</button>
    <div id="output">Items yahan aayenge...</div>
  </div>

  <script>
    // 1. Color + Emoji
    const colors = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6'];
    const emojis = ['🎨','🚀','⭐','🔥','💎','🎯','🌈','⚡'];
    let colorIdx = 0, emojiIdx = 0;

    function changeColor() {
      colorIdx = (colorIdx + 1) % colors.length;
      document.getElementById('colorBox').style.background = colors[colorIdx];
    }
    function changeEmoji() {
      emojiIdx = (emojiIdx + 1) % emojis.length;
      document.getElementById('colorBox').textContent = emojis[emojiIdx];
    }
    function resetBox() {
      document.getElementById('colorBox').style.background = '#6366f1';
      document.getElementById('colorBox').textContent = '🎨';
      colorIdx = 0; emojiIdx = 0;
    }

    // 2. Counter
    let count = 0;
    function updateCounter(delta) {
      count = delta === 0 ? 0 : count + delta;
      const display = document.getElementById('counter-display');
      display.textContent = count;
      display.style.color = count > 0 ? '#10b981' : count < 0 ? '#ef4444' : '#6366f1';
    }

    // 3. Live greeting
    document.getElementById('nameInput').addEventListener('input', function() {
      const name = this.value.trim();
      const greeting = document.getElementById('greeting');
      greeting.textContent = name ? \\\`Namaste, \\\${name}! 👋 Welcome to StudyEarn!\\\` : 'Naam likho toh greeting milegi!';
    });

    // 4. Dynamic elements
    let itemCount = 0;
    function addItem() {
      itemCount++;
      const output = document.getElementById('output');
      if (itemCount === 1) output.innerHTML = '';
      const item = document.createElement('div');
      item.style.cssText = 'padding:8px 12px; margin:4px 0; background:rgba(99,102,241,0.1); border-radius:6px; border-left:3px solid #6366f1; display:flex; justify-content:space-between; align-items:center;';
      item.innerHTML = \\\`<span>Item #\\\${itemCount}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px;">✕</button>\\\`;
      output.appendChild(item);
    }
    function clearItems() {
      document.getElementById('output').innerHTML = 'Items yahan aayenge...';
      itemCount = 0;
    }
  </script>

</body>
</html>\`,
      codeExample_en: \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JS DOM Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 32px 20px; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    p  { color: #64748b; margin-bottom: 24px; }
    .section { background: #1e293b; border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    h2 { color: #a78bfa; font-size: 16px; margin-bottom: 16px; }
    .btn { padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 4px; font-size: 14px; transition: all 0.2s; }
    .btn:hover { background: #4f46e5; transform: translateY(-2px); }
    #output { background: #0f172a; border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; padding: 12px; margin-top: 12px; font-size: 14px; min-height: 40px; color: #a78bfa; }
    #colorBox { width: 100px; height: 100px; background: #6366f1; border-radius: 8px; margin: 12px 0; transition: all 0.3s; display: flex; align-items: center; justify-content: center; font-size: 32px; }
    input { background: #0f172a; border: 2px solid rgba(99,102,241,0.3); color: #e2e8f0; padding: 8px 12px; border-radius: 8px; width: 200px; font-size: 14px; outline: none; }
    input:focus { border-color: #6366f1; }
    #greeting { color: #a78bfa; font-size: 18px; margin-top: 8px; min-height: 28px; }
    #counter-display { font-size: 48px; font-weight: 800; color: #6366f1; text-align: center; padding: 16px 0; }
  </style>
</head>
<body>
  <h1>⚡ JavaScript DOM Demo</h1>
  <p>Click the buttons — JS will manipulate the DOM!</p>

  <div class="section">
    <h2>1. Content and Style Change</h2>
    <div id="colorBox">🎨</div>
    <button class="btn" onclick="changeColor()">Random Colour</button>
    <button class="btn" onclick="changeEmoji()">Change Emoji</button>
    <button class="btn" onclick="resetBox()">Reset</button>
  </div>

  <div class="section">
    <h2>2. Counter</h2>
    <div id="counter-display">0</div>
    <div style="text-align:center">
      <button class="btn" onclick="updateCounter(-1)">− Minus</button>
      <button class="btn" onclick="updateCounter(0)">Reset</button>
      <button class="btn" onclick="updateCounter(1)">+ Plus</button>
    </div>
  </div>

  <div class="section">
    <h2>3. Live Input → DOM Update</h2>
    <input type="text" id="nameInput" placeholder="Type your name...">
    <div id="greeting">Type a name to get a greeting!</div>
  </div>

  <div class="section">
    <h2>4. Create Dynamic Elements</h2>
    <button class="btn" onclick="addItem()">+ Add Item</button>
    <button class="btn" onclick="clearItems()">Clear All</button>
    <div id="output">Items will appear here...</div>
  </div>

  <script>
    const colors = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6'];
    const emojis = ['🎨','🚀','⭐','🔥','💎','🎯','🌈','⚡'];
    let colorIdx = 0, emojiIdx = 0;

    function changeColor() {
      colorIdx = (colorIdx + 1) % colors.length;
      document.getElementById('colorBox').style.background = colors[colorIdx];
    }
    function changeEmoji() {
      emojiIdx = (emojiIdx + 1) % emojis.length;
      document.getElementById('colorBox').textContent = emojis[emojiIdx];
    }
    function resetBox() {
      document.getElementById('colorBox').style.background = '#6366f1';
      document.getElementById('colorBox').textContent = '🎨';
      colorIdx = 0; emojiIdx = 0;
    }

    let count = 0;
    function updateCounter(delta) {
      count = delta === 0 ? 0 : count + delta;
      const display = document.getElementById('counter-display');
      display.textContent = count;
      display.style.color = count > 0 ? '#10b981' : count < 0 ? '#ef4444' : '#6366f1';
    }

    document.getElementById('nameInput').addEventListener('input', function() {
      const name = this.value.trim();
      const greeting = document.getElementById('greeting');
      greeting.textContent = name ? \\\`Hello, \\\${name}! 👋 Welcome to StudyEarn!\\\` : 'Type a name to get a greeting!';
    });

    let itemCount = 0;
    function addItem() {
      itemCount++;
      const output = document.getElementById('output');
      if (itemCount === 1) output.innerHTML = '';
      const item = document.createElement('div');
      item.style.cssText = 'padding:8px 12px; margin:4px 0; background:rgba(99,102,241,0.1); border-radius:6px; border-left:3px solid #6366f1; display:flex; justify-content:space-between; align-items:center;';
      item.innerHTML = \\\`<span>Item #\\\${itemCount}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px;">✕</button>\\\`;
      output.appendChild(item);
    }
    function clearItems() {
      document.getElementById('output').innerHTML = 'Items will appear here...';
      itemCount = 0;
    }
  </script>
</body>
</html>`,
    task_en: {
      description: "Apni portfolio website in JS add karo. Requirements: (1) Smooth scroll — navbar links pe click karne pe smooth scroll ho section in (scrollIntoView), (2) Dark/Light toggle — button from theme switch karo (CSS variables update karo via JS), (3) Skill bars — page load pe skill bars animate hokar fill hon (width 0 from actual value tak), (4) Form validation — contact form submit pe naam and email validate karo, error message dikhao, (5) Active nav link — scroll karte waqt current section ka nav link highlight ho.',\n description_en: 'Add JS to your portfolio website. Requirements: (1) Smooth scroll — clicking navbar links smoothly scrolls to the section (scrollIntoView), (2) Dark/Light toggle — a button switches the theme (update CSS variables via JS), (3) Skill bars — on page load, skill bars animate from 0 to their actual value, (4) Form validation — validate name and email on contact form submit, show error messages, (5) Active nav link — highlight the current section\\'s nav link as you scroll.",
      hint: "scrollIntoView({behavior:\"smooth\"}). CSS variables: document.documentElement.style.setProperty(\"--bg\",\"#fff\"). Skill bars: setTimeout(() => bar.style.width = \"80%\", 200). Form: if(!email.includes(\"@\")) error.textContent = \"Valid email chahiye!\"",
    },
    quiz_en: [
      { q: 'document.querySelector() and document.getElementById() in what fark hai?', options: ['Koi fark nahi', 'querySelector kisi bhi CSS selector from kaam karta hai, getElementById sirf ID se', 'getElementById faster hai', 'querySelector sirf classes for hai'], correct: 1, explanation: 'getElementById("name") sirf id="name" dhundta hai. querySelector(".card") koi bhi CSS selector (#id, .class, tag, [attr]) use kar sakta is — zyada flexible!',
 q_en: 'What is the difference between document.querySelector() and document.getElementById()?',
 options_en: ['No difference', 'querySelector works with any CSS selector, getElementById only with IDs', 'getElementById is faster', 'querySelector is only for classes'],
 explanation_en: 'getElementById("name") only finds id="name". querySelector(".card") works with any CSS selector (#id, .class, tag, [attr]) — much more flexible!' },
      { q: '<script> tag in defer attribute what karta hai?', options: ['Script block karta hai', 'Script HTML load hone ke baad chalta is — DOM ready hoti hai', 'Script cancel karta hai', 'Script async banata hai'], correct: 1, explanation: 'defer = HTML parse hone ke baad, DOM complete hone ke baad script run karo. Bina defer ke script HTML ke beech in run karta is — DOM elements not milte.',
 q_en: 'What does the defer attribute on a <script> tag do?',
 options_en: ['Blocks the script', 'Script runs after HTML has loaded — DOM is ready', 'Cancels the script', 'Makes the script async'],
 explanation_en: 'defer = run the script after HTML is parsed and the DOM is complete. Without defer, the script runs mid-HTML — and DOM elements are not yet available.' },
      { q: 'classList.toggle("active") what karta hai?', options: ['Hamesha class add karta hai', 'Class is toh remove, not is toh add — toggle', 'Hamesha class remove karta hai', 'Class ka naam change karta hai'], correct: 1, explanation: 'toggle = agar class present is toh remove karo, absent is toh add karo. Dark mode, menu open/close, accordion expand/collapse for perfect!',
 q_en: 'What does classList.toggle("active") do?',
 options_en: ['Always adds the class', 'If the class is present it removes it, if absent it adds it — a toggle', 'Always removes the class', 'Changes the class name'],
 explanation_en: 'toggle = if the class is present, remove it; if absent, add it. Perfect for dark mode, open/close menus, expand/collapse accordions!' },
    ],
  },

  'html-w9-s2': {
    title_en: "JavaScript Functions and Conditions",
    content_en: `## JavaScript Functions and Conditions!

### Variables
\`\`\`javascript
// Modern: use let and const (not var)
const name = 'Rahul';    // cannot be reassigned
let   score = 95;        // can change
let   isLoggedIn = true;

// Data types
const text    = "Hello";
const number  = 42;
const decimal = 3.14;
const bool    = true;
const nothing = null;
const undef   = undefined;
const arr     = [1, 2, 3];
const obj     = { name: 'Rahul', age: 20 };
\`\`\`

### Conditions
\`\`\`javascript
const score = 85;

if (score >= 90) {
  console.log("A grade!");
} else if (score >= 75) {
  console.log("B grade");
} else if (score >= 60) {
  console.log("C grade");
} else {
  console.log("Needs improvement");
}

// Ternary operator (short if-else)
const grade = score >= 60 ? 'Pass' : 'Fail';

// Logical operators
if (age >= 18 && isRegistered) { vote(); }
if (isMember || hasCode) { applyDiscount(); }
if (!isLoggedIn) { redirect('/login'); }
\`\`\`

### Loops
\`\`\`javascript
// for loop
for (let i = 0; i < 5; i++) {
  console.log(\`Item \${i}\`);
}

// forEach — for arrays
const names = ['Rahul', 'Priya', 'Arjun'];
names.forEach(name => console.log(\`Hello, \${name}!\`));

// for...of
for (const item of names) {
  console.log(item);
}
\`\`\`

### Functions
\`\`\`javascript
// Function declaration
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Arrow function (modern)
const greet = (name) => \`Hello, \${name}!\`;

// Default parameters
const createCard = (title, color = 'blue') => {
  return \`<div class="card" style="background:\${color}">\${title}</div>\`;
};

// DOM example
function updateCounter() {
  let count = 0;
  const display = document.querySelector('#count');
  const btn = document.querySelector('#increment');

  btn.addEventListener('click', () => {
    count++;
    display.textContent = count;
  });
}
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JS Functions Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 32px 20px; }
    .section { background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(99,102,241,0.15); }
    h2 { color: #a78bfa; font-size: 16px; margin-bottom: 16px; }
    label { display: block; font-size: 14px; color: #94a3b8; margin-bottom: 6px; }
    input, select { width: 100%; padding: 10px 14px; background: #0f172a; border: 2px solid rgba(99,102,241,0.3); color: #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; margin-bottom: 8px; }
    input:focus { border-color: #6366f1; }
    .error { color: #ef4444; font-size: 12px; margin-top: -4px; margin-bottom: 8px; min-height: 18px; }
    .success-msg { color: #10b981; font-size: 14px; padding: 10px; background: rgba(16,185,129,0.1); border-radius: 8px; border: 1px solid rgba(16,185,129,0.3); display: none; }
    .btn { padding: 10px 24px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; }
    .btn:hover { background: #4f46e5; transform: translateY(-2px); }
    .result-box { background: #0f172a; border-radius: 8px; padding: 14px; margin-top: 12px; font-size: 14px; border: 1px solid rgba(99,102,241,0.2); }
    .grade { font-size: 32px; font-weight: 800; text-align: center; padding: 8px 0; }
    input[type=range] { -webkit-appearance: none; height: 6px; border-radius: 3px; background: rgba(99,102,241,0.3); border: none; padding: 0; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: #6366f1; border-radius: 50%; cursor: pointer; }
    .range-val { font-size: 32px; font-weight: 800; color: #6366f1; text-align: center; }
  </style>
</head>
<body>

  <!-- 1. Grade Calculator -->
  <div class="section">
    <h2>📊 1. Grade Calculator (Functions + Conditions)</h2>
    <label>Score (0-100):</label>
    <input type="range" id="scoreSlider" min="0" max="100" value="75" oninput="updateGrade(this.value)">
    <div class="range-val" id="scoreVal">75</div>
    <div class="result-box">
      <div class="grade" id="gradeResult">B</div>
      <div id="gradeMsg" style="text-align:center; color:#64748b; font-size:14px;">Keep it up!</div>
    </div>
  </div>

  <!-- 2. Form Validation -->
  <div class="section">
    <h2>✅ 2. Form Validation (Functions + Conditions)</h2>
    <label>Full Name:</label>
    <input type="text" id="fullName" placeholder="Apna naam...">
    <div class="error" id="nameErr"></div>

    <label>Email:</label>
    <input type="email" id="emailInput" placeholder="email@example.com">
    <div class="error" id="emailErr"></div>

    <label>Password:</label>
    <input type="password" id="passInput" placeholder="8+ characters">
    <div class="error" id="passErr"></div>

    <button class="btn" onclick="submitForm()">Submit Form</button>
    <div class="success-msg" id="successMsg">🎉 Form submit ho gaya!</div>
  </div>

  <!-- 3. Shopping Cart (Arrays + Loops) -->
  <div class="section">
    <h2>🛒 3. Shopping Cart (Arrays + forEach)</h2>
    <select id="productSelect">
      <option value="">-- Product chunno --</option>
      <option value="Python Course|499">Python Course — ₹499</option>
      <option value="HTML Course|299">HTML Course — ₹299</option>
      <option value="CSS Course|199">CSS Course — ₹199</option>
      <option value="JS Course|599">JS Course — ₹599</option>
    </select>
    <button class="btn" onclick="addToCart()">+ Cart Mein Daalo</button>
    <div class="result-box" id="cartBox" style="margin-top:12px;">Cart empty hai...</div>
  </div>

  <script>
    // 1. Grade Calculator
    function updateGrade(score) {
      score = parseInt(score);
      document.getElementById('scoreVal').textContent = score;
      const { grade, color, msg } = getGrade(score);
      document.getElementById('gradeResult').textContent = grade;
      document.getElementById('gradeResult').style.color = color;
      document.getElementById('gradeMsg').textContent = msg;
    }
    function getGrade(score) {
      if (score >= 90) return { grade: 'A+', color: '#10b981', msg: 'Outstanding! 🏆' };
      if (score >= 80) return { grade: 'A',  color: '#22c55e', msg: 'Excellent! 🎉' };
      if (score >= 70) return { grade: 'B',  color: '#6366f1', msg: 'Good work! 👍' };
      if (score >= 60) return { grade: 'C',  color: '#f59e0b', msg: 'Keep improving! 💪' };
      if (score >= 50) return { grade: 'D',  color: '#f97316', msg: 'Need more effort! 📚' };
      return { grade: 'F', color: '#ef4444', msg: 'Study harder! 😤' };
    }
    updateGrade(75);

    // 2. Form Validation
    function validateField(value, type) {
      if (type === 'name')  return value.trim().length >= 2 ? '' : 'Naam 2+ characters ka hona chahiye!';
      if (type === 'email') return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) ? '' : 'Valid email format chahiye!';
      if (type === 'pass')  return value.length >= 8 ? '' : 'Password 8+ characters ka hona chahiye!';
      return '';
    }
    function submitForm() {
      const name  = document.getElementById('fullName').value;
      const email = document.getElementById('emailInput').value;
      const pass  = document.getElementById('passInput').value;
      const nameErr  = validateField(name,  'name');
      const emailErr = validateField(email, 'email');
      const passErr  = validateField(pass,  'pass');
      document.getElementById('nameErr').textContent  = nameErr;
      document.getElementById('emailErr').textContent = emailErr;
      document.getElementById('passErr').textContent  = passErr;
      if (!nameErr && !emailErr && !passErr) {
        document.getElementById('successMsg').style.display = 'block';
        setTimeout(() => document.getElementById('successMsg').style.display = 'none', 3000);
      }
    }

    // 3. Shopping Cart
    let cart = [];
    function addToCart() {
      const select = document.getElementById('productSelect');
      if (!select.value) return;
      const [name, price] = select.value.split('|');
      cart.push({ name, price: parseInt(price) });
      renderCart();
      select.value = '';
    }
    function removeFromCart(idx) {
      cart.splice(idx, 1);
      renderCart();
    }
    function renderCart() {
      const box = document.getElementById('cartBox');
      if (cart.length === 0) { box.innerHTML = 'Cart empty hai...'; return; }
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      box.innerHTML = cart.map((item, i) =>
        \\\`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(99,102,241,0.1)">
          <span>📚 \\\${item.name}</span>
          <span>₹\\\${item.price} <button onclick="removeFromCart(\\\${i})" style="background:none;border:none;color:#ef4444;cursor:pointer;margin-left:8px">✕</button></span>
        </div>\\\`
      ).join('') + \\\`<div style="text-align:right;padding-top:8px;font-weight:700;color:#6366f1">Total: ₹\\\${total}</div>\\\`;
    }
  </script>

</body>
</html>\`,
      codeExample_en: \`<!-- Same structure in English — only text content differs. See Hinglish version above for the full interactive demo. -->`,
    task_en: {
      description: "Ek complete \"Student Grade Calculator\" banao. Features: (1) Multiple subjects for input fields (Math, Science, English, Hindi, Computer), (2) Har subject ka marks input (0-100), (3) Real-time total and percentage calculate ho jaise marks type karo, (4) Grade calculate karo (A+/A/B/C/D/F) and color from highlight karo, (5) \"Best Subject\" and \"Needs Improvement\" subject show karo (Math.max / Math.min), (6) Result card generate karo — student ka naam and result table — jise print bhi kar sakein (@media print).',\n description_en: 'Build a complete \"Student Grade Calculator\". Features: (1) Input fields for multiple subjects (Math, Science, English, Hindi, Computer), (2) Marks input per subject (0-100), (3) Total and percentage calculated in real time as marks are typed, (4) Calculate grade (A+/A/B/C/D/F) and colour-code it, (5) Show \"Best Subject\" and \"Needs Improvement\" subject (Math.max / Math.min), (6) Generate a result card — student name and result table — that can also be printed (@media print).",
      hint: "Real-time: input pe addEventListener(\"input\", calculate). Math.max(...scores) from highest nikalo. window.print() from print dialog khulta hai. @media print { .no-print { display: none; } }",
    },
    quiz_en: [
      { q: 'Arrow function and regular function in main fark is?', options: ['Koi fark nahi', 'Arrow functions concise are and apna "this" not rakhte — parent ka "this" use karte hain', 'Arrow functions faster hain', 'Arrow functions return not kar sakte'], correct: 1, explanation: 'Arrow functions: shorter syntax, "this" lexically scoped (parent ka this use karte hain). Regular functions: apna this context banate hain. Event handlers mein, class methods in yeh difference important hai.',
 q_en: 'What is the main difference between an arrow function and a regular function?',
 options_en: ['No difference', 'Arrow functions are concise and do not have their own "this" — they use the parent\'s "this"', 'Arrow functions are faster', 'Arrow functions cannot return values'],
 explanation_en: 'Arrow functions: shorter syntax, "this" is lexically scoped (uses parent\'s this). Regular functions: create their own "this" context. This difference matters in event handlers and class methods.' },
      { q: 'Nullish coalescing operator (??) when use karte hain?', options: ['Hamesha', 'Jab value null or undefined ho toh fallback dene for (0 and "" to false not maanta)', 'Boolean conditions ke liye', 'Math operations ke liye'], correct: 1, explanation: '?? sirf null and undefined pe fallback deta hai. || operator 0, "", false pe bhi fallback deta hai. user?.name ?? "Guest" — agar name null/undefined ho toh "Guest", warna actual name.',
 q_en: 'When do you use the nullish coalescing operator (??)?',
 options_en: ['Always', 'To provide a fallback when a value is null or undefined (does not treat 0 and "" as false)', 'For boolean conditions', 'For math operations'],
 explanation_en: '?? only falls back for null and undefined. The || operator also falls back for 0, "", false. user?.name ?? "Guest" — shows "Guest" only if name is null/undefined, otherwise shows the actual name.' },
      { q: 'Array.reduce() what karta hai?', options: ['Array to chhota banata hai', 'Array ke saare elements to ek single value in combine karta hai', 'Array sort karta hai', 'Array copy karta hai'], correct: 1, explanation: 'reduce((accumulator, currentValue) => ..., initialValue) — sab elements loop karke ek result build karta hai. Sum: reduce((sum, n) => sum + n, 0). Shopping cart total for perfect!',
 q_en: 'What does Array.reduce() do?',
 options_en: ['Makes the array smaller', 'Combines all elements into a single value', 'Sorts the array', 'Copies the array'],
 explanation_en: 'reduce((accumulator, currentValue) => ..., initialValue) — loops through all elements and builds a single result. Sum: reduce((sum, n) => sum + n, 0). Perfect for shopping cart totals!' },
    ],
  },

  'html-w9-s3': {
    title_en: "localStorage and JSON — Saving Data",
    content_en: `## localStorage and JSON — Saving Data!

### localStorage — Persist Data in the Browser
\`\`\`javascript
// Save data (only strings allowed!)
localStorage.setItem('username', 'Rahul');
localStorage.setItem('theme', 'dark');

// Read data
const username = localStorage.getItem('username');
if (username) {
  document.querySelector('#greeting').textContent = \`Welcome back, \${username}!\`;
}

// Remove a key
localStorage.removeItem('tempData');

// Clear everything
localStorage.clear();
\`\`\`

### Saving Objects — JSON
\`\`\`javascript
// Save an object
const user = {
  name: 'Priya',
  score: 1250,
  level: 'Intermediate',
  badges: ['first-code', 'week-1', 'streak-7'],
};
localStorage.setItem('user', JSON.stringify(user));

// Load it back
const loaded = JSON.parse(localStorage.getItem('user'));
console.log(loaded.name);    // Priya
console.log(loaded.badges);  // ['first-code', 'week-1', 'streak-7']

// Safe load (with fallback)
function loadUser() {
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : { name: 'Guest', score: 0, badges: [] };
}
\`\`\`

### Todo List with Persistence
\`\`\`javascript
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo(text) {
  todos.push({ id: Date.now(), text, done: false });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? {...t, done: !t.done} : t);
  saveTodos();
  renderTodos();
}

function renderTodos() {
  const list = document.querySelector('#todo-list');
  list.innerHTML = todos.map(t => \`
    <li class="\${t.done ? 'done' : ''}" onclick="toggleTodo(\${t.id})">
      \${t.done ? '✅' : '⬜'} \${t.text}
    </li>
  \`).join('');
}

renderTodos();  // Load on page open
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>Todo App — localStorage</title>
  <style>
    :root { --bg: #0f172a; --bg2: #1e293b; --border: rgba(99,102,241,0.2); --text: #e2e8f0; --muted: #64748b; }
    [data-theme="light"] { --bg: #f8fafc; --bg2: #ffffff; --border: rgba(0,0,0,0.1); --text: #1e293b; --muted: #64748b; }
    * { margin: 0; padding: 0; box-sizing: border-box; transition: background 0.3s, color 0.3s; }
    body { font-family: Arial, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; padding: 0; }
    header { background: var(--bg2); border-bottom: 1px solid var(--border); padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-weight: 800; font-size: 18px; color: #6366f1; }
    .theme-btn { background: none; border: 1px solid var(--border); color: var(--text); padding: 6px 12px; border-radius: 20px; cursor: pointer; font-size: 14px; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px 20px; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    .subtitle { color: var(--muted); margin-bottom: 24px; font-size: 14px; }
    .add-row { display: flex; gap: 8px; margin-bottom: 24px; }
    .add-row input { flex: 1; padding: 12px 16px; background: var(--bg2); border: 2px solid var(--border); color: var(--text); border-radius: 10px; font-size: 15px; outline: none; }
    .add-row input:focus { border-color: #6366f1; }
    .btn { padding: 12px 20px; background: #6366f1; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px; white-space: nowrap; }
    .btn:hover { background: #4f46e5; }
    .filters { display: flex; gap: 8px; margin-bottom: 16px; }
    .filter-btn { padding: 6px 16px; border: 1px solid var(--border); background: none; color: var(--muted); border-radius: 20px; cursor: pointer; font-size: 13px; }
    .filter-btn.active { background: rgba(99,102,241,0.15); border-color: #6366f1; color: #6366f1; font-weight: 600; }
    .stats { display: flex; gap: 16px; margin-bottom: 20px; font-size: 13px; color: var(--muted); }
    .stat { background: var(--bg2); padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border); }
    .stat span { color: #6366f1; font-weight: 700; font-size: 18px; display: block; text-align: center; }
    .todo-item { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; transition: all 0.2s; }
    .todo-item:hover { border-color: rgba(99,102,241,0.4); }
    .todo-item.done { opacity: 0.6; }
    .todo-item.done .todo-text { text-decoration: line-through; color: var(--muted); }
    .todo-check { width: 20px; height: 20px; border: 2px solid var(--border); border-radius: 50%; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .todo-check:hover { border-color: #6366f1; }
    .todo-item.done .todo-check { background: #6366f1; border-color: #6366f1; }
    .todo-text { flex: 1; font-size: 15px; }
    .todo-date { font-size: 11px; color: var(--muted); }
    .del-btn { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 18px; padding: 0 4px; line-height: 1; }
    .del-btn:hover { color: #ef4444; }
    .empty { text-align: center; padding: 40px; color: var(--muted); }
    .empty div { font-size: 48px; margin-bottom: 12px; }
  </style>
</head>
<body>

  <header>
    <div class="logo">✅ TodoApp</div>
    <button class="theme-btn" id="themeBtn" onclick="toggleTheme()">🌙 Dark</button>
  </header>

  <div class="container">
    <h1>My Tasks</h1>
    <p class="subtitle" id="dateLabel"></p>

    <div class="add-row">
      <input type="text" id="todoInput" placeholder="Naya task add karo..." onkeydown="if(event.key==='Enter')addTodo()">
      <button class="btn" onclick="addTodo()">+ Add</button>
    </div>

    <div class="stats">
      <div class="stat"><span id="totalCount">0</span>Total</div>
      <div class="stat"><span id="doneCount">0</span>Done</div>
      <div class="stat"><span id="leftCount">0</span>Left</div>
    </div>

    <div class="filters">
      <button class="filter-btn active" onclick="setFilter('all', this)">All</button>
      <button class="filter-btn" onclick="setFilter('active', this)">Active</button>
      <button class="filter-btn" onclick="setFilter('done', this)">Done</button>
    </div>

    <div id="todoList"></div>
  </div>

  <script>
    // localStorage helpers
    const load   = () => JSON.parse(localStorage.getItem('todos') || '[]');
    const save   = (t) => localStorage.setItem('todos', JSON.stringify(t));
    let filter   = 'all';

    // Date
    document.getElementById('dateLabel').textContent =
      new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeBtn').textContent = savedTheme === 'dark' ? '🌙 Dark' : '☀️ Light';

    function toggleTheme() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next   = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      document.getElementById('themeBtn').textContent = next === 'dark' ? '🌙 Dark' : '☀️ Light';
    }

    function setFilter(f, btn) {
      filter = f;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    }

    function addTodo() {
      const input = document.getElementById('todoInput');
      const text  = input.value.trim();
      if (!text) return;
      const todos = load();
      todos.unshift({ id: Date.now(), text, done: false, date: new Date().toLocaleDateString('en-IN') });
      save(todos);
      input.value = '';
      render();
    }

    function toggle(id) {
      const todos = load();
      const t = todos.find(t => t.id === id);
      if (t) t.done = !t.done;
      save(todos);
      render();
    }

    function remove(id) {
      save(load().filter(t => t.id !== id));
      render();
    }

    function render() {
      const all   = load();
      const shown = filter === 'all'    ? all
                  : filter === 'active' ? all.filter(t => !t.done)
                  :                       all.filter(t =>  t.done);

      document.getElementById('totalCount').textContent = all.length;
      document.getElementById('doneCount').textContent  = all.filter(t => t.done).length;
      document.getElementById('leftCount').textContent  = all.filter(t => !t.done).length;

      const list = document.getElementById('todoList');
      if (!shown.length) {
        list.innerHTML = \\\`<div class="empty"><div>\\\${filter === 'done' ? '🎉' : '📝'}</div>\\\${filter === 'done' ? 'Koi completed task nahi!' : 'Koi task nahi! Add karo ☝️'}</div>\\\`;
        return;
      }
      list.innerHTML = shown.map(t => \\\`
        <div class="todo-item \\\${t.done ? 'done' : ''}" id="todo-\\\${t.id}">
          <div class="todo-check" onclick="toggle(\\\${t.id})">\\\${t.done ? '✓' : ''}</div>
          <span class="todo-text">\\\${t.text}</span>
          <span class="todo-date">\\\${t.date}</span>
          <button class="del-btn" onclick="remove(\\\${t.id})">✕</button>
        </div>
      \\\`).join('');
    }

    render();
  </script>

</body>
</html>\`,
      codeExample_en: \`<!-- Same app with English text — see Hinglish version above for the full working Todo App with localStorage + dark mode -->`,
    task_en: {
      description: "Todo app to upgrade karo: (1) Categories add karo — Work, Personal, Study (color-coded), (2) Priority levels — High/Medium/Low, (3) Due date input per task, (4) Overdue tasks to red in highlight karo, (5) Drag and drop to reorder (HTML5 draggable attribute), (6) Export all todos as JSON file (download), (7) Import todos from JSON file, (8) Stats: pie chart-like progress bar (% complete), (9) Search/filter by text, (10) Clear completed todos button.',\n description_en: 'Upgrade the Todo app: (1) Add categories — Work, Personal, Study (colour-coded), (2) Priority levels — High/Medium/Low, (3) Due date input per task, (4) Highlight overdue tasks in red, (5) Drag and drop to reorder (HTML5 draggable attribute), (6) Export all todos as a JSON file (download), (7) Import todos from a JSON file, (8) Stats: progress bar showing % complete, (9) Search/filter by text, (10) Clear completed todos button.",
      hint: "Export: const blob = new Blob([JSON.stringify(todos)], {type:\"application/json\"}); const url = URL.createObjectURL(blob); const a = document.createElement(\"a\"); a.href=url; a.download=\"todos.json\"; a.click(). Import: fileInput.files[0] to FileReader from read karo.",
    },
    quiz_en: [
      { q: 'JSON.stringify() and JSON.parse() when use karte hain?', options: ['Kabhi nahi', 'stringify: JS object/array → string (localStorage ke liye), parse: string → JS object/array', 'stringify sirf numbers ke liye', 'parse sirf strings ke liye'], correct: 1, explanation: 'localStorage sirf strings store karta hai. stringify from object to string in convert karo save karne ke liye. parse from wapis object in convert karo use karne ke liye.',
 q_en: 'When do you use JSON.stringify() and JSON.parse()?',
 options_en: ['Never', 'stringify: JS object/array → string (for localStorage), parse: string → JS object/array', 'stringify is only for numbers', 'parse is only for strings'],
 explanation_en: 'localStorage only stores strings. Use stringify to convert an object to a string for saving. Use parse to convert it back to an object for use.' },
      { q: 'Date.now() what return karta hai?', options: ['Current date string', 'Unix timestamp — 1970 from milliseconds in — unique ID for use hota hai', 'Current time string', 'Calendar object'], correct: 1, explanation: 'Date.now() = milliseconds since January 1, 1970. Iska use unique IDs banane for hota is (todo items mein) — same millisecond in 2 items banana practically impossible hai.',
 q_en: 'What does Date.now() return?',
 options_en: ['Current date string', 'Unix timestamp — milliseconds since 1970 — used for unique IDs', 'Current time string', 'A calendar object'],
 explanation_en: 'Date.now() = milliseconds since January 1, 1970. Used to generate unique IDs (in todo items) — it is practically impossible to create 2 items within the same millisecond.' },
      { q: 'localStorage.getItem("key") jab key exist not karta toh what return karta hai?', options: ['Empty string', 'null', 'undefined', 'Error throw karta hai'], correct: 1, explanation: 'localStorage.getItem() null return karta is agar key exist not karta. Isliye safe pattern hai: JSON.parse(localStorage.getItem("todos") || "[]") — null toh "[]" use karo.',
 q_en: 'What does localStorage.getItem("key") return when the key does not exist?',
 options_en: ['Empty string', 'null', 'undefined', 'Throws an error'],
 explanation_en: 'localStorage.getItem() returns null if the key does not exist. That is why the safe pattern is: JSON.parse(localStorage.getItem("todos") || "[]") — if null, use "[]".' },
    ],
  },

  'html-w9-s4': {
    title_en: "Week 9 Project — Interactive Portfolio",
    content_en: `## Week 9 Project — Interactive Portfolio!

Make your portfolio come alive with JavaScript!

### Features to Add:
\`\`\`
1. Dark/Light Mode Toggle
2. Smooth scroll navigation
3. Skill bars that animate on scroll
4. Project filter (by technology)
5. Contact form with localStorage save
6. Typing animation in hero section
7. Live visitor counter (localStorage)
\`\`\`

### Typing Animation:
\`\`\`javascript
const phrases = [
  'Web Developer',
  'Python Enthusiast',
  'Problem Solver',
  'Open Source Contributor',
];
let pIdx = 0, cIdx = 0, deleting = false;
const el = document.querySelector('.typing');

function type() {
  const current = phrases[pIdx];
  el.textContent = deleting
    ? current.slice(0, --cIdx)
    : current.slice(0, ++cIdx);

  if (!deleting && cIdx === current.length) {
    setTimeout(() => deleting = true, 1500);
  } else if (deleting && cIdx === 0) {
    deleting = false;
    pIdx = (pIdx + 1) % phrases.length;
  }

  setTimeout(type, deleting ? 60 : 100);
}
type();
\`\`\`

### Project Filter:
\`\`\`javascript
const buttons  = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    projects.forEach(card => {
      const show = filter === 'all' || card.dataset.tech.includes(filter);
      card.style.display = show ? 'block' : 'none';
    });
  });
});
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Portfolio</title>
  <style>
    :root { --primary: #6366f1; --accent: #a78bfa; --t: all 0.3s ease; }
    [data-theme="dark"]  { --bg:#0f172a; --bg2:#1e293b; --text:#e2e8f0; --muted:#64748b; --border:rgba(255,255,255,0.08); }
    [data-theme="light"] { --bg:#f8fafc; --bg2:#ffffff; --text:#1e293b; --muted:#64748b; --border:rgba(0,0,0,0.08); }
    * { margin:0; padding:0; box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { font-family:Arial,sans-serif; background:var(--bg); color:var(--text); transition:var(--t); }

    nav { position:sticky; top:0; z-index:100; background:rgba(15,23,42,0.9); backdrop-filter:blur(16px); border-bottom:1px solid var(--border); padding:0 20px; height:60px; display:flex; justify-content:space-between; align-items:center; transition:box-shadow 0.3s; }
    nav.scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
    [data-theme="light"] nav { background:rgba(248,250,252,0.9); }
    .logo { font-weight:800; color:var(--primary); font-size:18px; }
    .nav-links { display:flex; gap:24px; list-style:none; }
    .nav-links a { color:var(--muted); text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; padding:4px 0; border-bottom:2px solid transparent; }
    .nav-links a.active, .nav-links a:hover { color:var(--text); border-bottom-color:var(--primary); }
    .nav-right { display:flex; gap:8px; align-items:center; }
    .theme-btn { background:var(--bg2); border:1px solid var(--border); color:var(--text); width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:16px; transition:var(--t); }
    .theme-btn:hover { transform:scale(1.1) rotate(15deg); border-color:var(--primary); }
    .hamburger { display:none; background:none; border:none; color:var(--text); font-size:22px; cursor:pointer; }

    section { padding:80px 20px; max-width:900px; margin:0 auto; }
    h1 { font-size:clamp(32px,6vw,64px); font-weight:800; margin-bottom:12px; }
    .typing-line { color:var(--primary); font-size:clamp(18px,3vw,28px); min-height:40px; margin-bottom:24px; }
    .cursor-blink { display:inline-block; width:3px; height:1em; background:var(--primary); margin-left:2px; animation:blink 1s step-end infinite; vertical-align:middle; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    .skill-item { margin-bottom:16px; }
    .skill-label { display:flex; justify-content:space-between; font-size:14px; color:var(--text); margin-bottom:6px; }
    .skill-bar { background:var(--bg2); border-radius:4px; height:8px; overflow:hidden; }
    .skill-fill { height:100%; background:linear-gradient(90deg,var(--primary),var(--accent)); border-radius:4px; width:0; transition:width 1s ease; }

    .projects-filter { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:24px; }
    .filter-btn { padding:6px 16px; border:1px solid var(--border); background:none; color:var(--muted); border-radius:20px; cursor:pointer; font-size:13px; transition:var(--t); }
    .filter-btn.active { background:rgba(99,102,241,0.15); border-color:var(--primary); color:var(--primary); font-weight:600; }
    .projects-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px; }
    .project-card { background:var(--bg2); border:1px solid var(--border); border-radius:12px; padding:20px; transition:var(--t); }
    .project-card:hover { transform:translateY(-4px); border-color:var(--primary); }
    .project-card.hidden { display:none; }
    .tag { display:inline-block; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; margin:2px; background:rgba(99,102,241,0.15); color:var(--primary); }

    .back-to-top { position:fixed; bottom:24px; right:24px; background:var(--primary); color:white; border:none; border-radius:50%; width:44px; height:44px; cursor:pointer; font-size:18px; display:none; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(99,102,241,0.4); transition:var(--t); z-index:50; }
    .back-to-top.show { display:flex; }
    .back-to-top:hover { transform:translateY(-3px) scale(1.1); }

    @media (max-width:640px) {
      .nav-links { display:none; position:absolute; top:60px; left:0; right:0; background:var(--bg2); flex-direction:column; padding:16px 20px; gap:12px; border-bottom:1px solid var(--border); z-index:99; }
      .nav-links.open { display:flex; }
      .hamburger { display:block; }
    }
  </style>
</head>
<body>

  <nav id="navbar">
    <div class="logo">✨ Portfolio</div>
    <ul class="nav-links" id="navLinks">
      <li><a href="#hero">Home</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <div class="nav-right">
      <button class="theme-btn" id="themeBtn" onclick="toggleTheme()">🌙</button>
      <button class="hamburger" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <section id="hero" style="min-height:100vh;display:flex;flex-direction:column;justify-content:center;">
    <h1>Rahul Kumar</h1>
    <div class="typing-line">
      <span id="typingText"></span><span class="cursor-blink"></span>
    </div>
    <p style="color:var(--muted);max-width:500px;line-height:1.7;margin-bottom:32px">
      Building beautiful, interactive websites with HTML, CSS, and JavaScript.
    </p>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <a href="#projects" style="padding:12px 28px;background:var(--primary);color:white;border-radius:10px;text-decoration:none;font-weight:700">View Work →</a>
      <a href="#contact"  style="padding:12px 28px;background:var(--bg2);color:var(--text);border:1px solid var(--border);border-radius:10px;text-decoration:none;font-weight:700">Contact Me</a>
    </div>
  </section>

  <section id="skills">
    <h2 style="font-size:28px;margin-bottom:32px">My Skills</h2>
    <div id="skillsContainer">
      <div class="skill-item"><div class="skill-label"><span>HTML5</span><span>90%</span></div><div class="skill-bar"><div class="skill-fill" data-width="90"></div></div></div>
      <div class="skill-item"><div class="skill-label"><span>CSS3</span><span>80%</span></div><div class="skill-bar"><div class="skill-fill" data-width="80"></div></div></div>
      <div class="skill-item"><div class="skill-label"><span>JavaScript</span><span>70%</span></div><div class="skill-bar"><div class="skill-fill" data-width="70"></div></div></div>
      <div class="skill-item"><div class="skill-label"><span>Python</span><span>65%</span></div><div class="skill-bar"><div class="skill-fill" data-width="65"></div></div></div>
    </div>
  </section>

  <section id="projects">
    <h2 style="font-size:28px;margin-bottom:20px">My Projects</h2>
    <div class="projects-filter">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="html">HTML</button>
      <button class="filter-btn" data-filter="css">CSS</button>
      <button class="filter-btn" data-filter="js">JavaScript</button>
    </div>
    <div class="projects-grid">
      <div class="project-card" data-tags="html css"><h3>Portfolio Website</h3><p style="color:var(--muted);font-size:14px;margin:8px 0">Personal portfolio with dark mode</p><span class="tag">HTML</span><span class="tag">CSS</span></div>
      <div class="project-card" data-tags="html css js"><h3>Todo App</h3><p style="color:var(--muted);font-size:14px;margin:8px 0">localStorage-powered task manager</p><span class="tag">HTML</span><span class="tag">CSS</span><span class="tag">JavaScript</span></div>
      <div class="project-card" data-tags="js"><h3>Grade Calculator</h3><p style="color:var(--muted);font-size:14px;margin:8px 0">Real-time grade calculator</p><span class="tag">JavaScript</span></div>
      <div class="project-card" data-tags="css"><h3>Animated Landing</h3><p style="color:var(--muted);font-size:14px;margin:8px 0">CSS animations showcase</p><span class="tag">CSS</span></div>
    </div>
  </section>

  <section id="contact">
    <h2 style="font-size:28px;margin-bottom:24px">Contact Me</h2>
    <form id="contactForm" onsubmit="submitContact(event)" style="max-width:480px">
      <div style="margin-bottom:16px">
        <input type="text" id="cName" placeholder="Your Name" style="width:100%;padding:12px 16px;background:var(--bg2);border:2px solid var(--border);color:var(--text);border-radius:10px;font-size:14px;outline:none">
        <div id="nameErr" style="color:#ef4444;font-size:12px;margin-top:4px;min-height:18px"></div>
      </div>
      <div style="margin-bottom:16px">
        <input type="email" id="cEmail" placeholder="Your Email" style="width:100%;padding:12px 16px;background:var(--bg2);border:2px solid var(--border);color:var(--text);border-radius:10px;font-size:14px;outline:none">
        <div id="emailErr" style="color:#ef4444;font-size:12px;margin-top:4px;min-height:18px"></div>
      </div>
      <div style="margin-bottom:20px">
        <textarea id="cMsg" placeholder="Your Message" rows="4" style="width:100%;padding:12px 16px;background:var(--bg2);border:2px solid var(--border);color:var(--text);border-radius:10px;font-size:14px;outline:none;resize:vertical"></textarea>
        <div id="msgErr" style="color:#ef4444;font-size:12px;margin-top:4px;min-height:18px"></div>
      </div>
      <button type="submit" style="padding:12px 32px;background:var(--primary);color:white;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:15px;transition:all 0.2s">Send Message 📨</button>
      <div id="formSuccess" style="display:none;margin-top:12px;padding:12px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:8px;color:#10b981;font-size:14px">🎉 Message sent! I'll reply soon.</div>
    </form>
  </section>

  <button class="back-to-top" id="backToTop" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</button>

  <script>
    // Theme
    const saved = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('themeBtn').textContent = saved === 'dark' ? '🌙' : '☀️';
    function toggleTheme() {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      document.getElementById('themeBtn').textContent = next === 'dark' ? '🌙' : '☀️';
    }

    // Hamburger
    function toggleMenu() {
      document.getElementById('navLinks').classList.toggle('open');
    }
    document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
    }));

    // Sticky nav shadow
    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', scrollY > 50);
      document.getElementById('backToTop').classList.toggle('show', scrollY > 400);
    });

    // Typing animation
    function typing(el, strings, speed=80) {
      let si=0, ci=0, del=false;
      function go() {
        const s = strings[si];
        el.textContent = del ? s.slice(0,ci-1) : s.slice(0,ci+1);
        del ? ci-- : ci++;
        if (!del && ci===s.length)  { del=true; setTimeout(go,1500); return; }
        if (del && ci===0)          { del=false; si=(si+1)%strings.length; }
        setTimeout(go, del ? speed/2 : speed);
      }
      go();
    }
    typing(document.getElementById('typingText'), ['Web Developer','HTML Expert','CSS Artist','JS Enthusiast']);

    // Skill bars (Intersection Observer)
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.skill-fill').forEach(b => {
            setTimeout(() => b.style.width = b.dataset.width + '%', 200);
          });
          skillObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    skillObserver.observe(document.getElementById('skillsContainer'));

    // Active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
          const link = document.querySelector(\\\`.nav-links a[href="#\\\${e.target.id}"]\\\`);
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => navObserver.observe(s));

    // Projects filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
          const match = f === 'all' || card.dataset.tags.includes(f);
          card.classList.toggle('hidden', !match);
          card.style.opacity = match ? '1' : '0';
          card.style.transform = match ? 'none' : 'scale(0.9)';
        });
      });
    });

    // Form validation
    function submitContact(e) {
      e.preventDefault();
      const name  = document.getElementById('cName').value.trim();
      const email = document.getElementById('cEmail').value.trim();
      const msg   = document.getElementById('cMsg').value.trim();
      let valid = true;
      const setErr = (id, txt) => { document.getElementById(id).textContent = txt; if (txt) valid = false; };
      setErr('nameErr',  name.length < 2    ? 'Naam 2+ characters ka hona chahiye!' : '');
      setErr('emailErr', !email.includes('@') ? 'Valid email chahiye!'               : '');
      setErr('msgErr',   msg.length < 10    ? 'Message 10+ characters ka hona chahiye!' : '');
      if (valid) { document.getElementById('formSuccess').style.display = 'block'; e.target.reset(); }
    }
  </script>

</body>
</html>\`,
      codeExample_en: \`<!-- Same complete interactive portfolio — already fully in English in the code above. All JS features work the same way. -->`,
    task_en: {
      description: "Apna complete interactive portfolio finalize karo. Sabhi JS features add karo: (1) Typing animation hero mein, (2) Smooth scroll + active nav, (3) Skill bars animation on scroll, (4) Dark/Light mode toggle + localStorage save, (5) Project category filter, (6) Contact form validation with error messages, (7) Back to top button, (8) Mobile hamburger menu, (9) Scroll progress bar at top of page, (10) visitor count using localStorage (page views).',\n description_en: 'Finalise your complete interactive portfolio. Add all JS features: (1) Typing animation in hero, (2) Smooth scroll + active nav, (3) Skill bars animation on scroll, (4) Dark/Light mode toggle + localStorage save, (5) Project category filter, (6) Contact form validation with error messages, (7) Back to top button, (8) Mobile hamburger menu, (9) Scroll progress bar at top of page, (10) Visitor count using localStorage (page views).",
      hint: "Scroll progress: window.addEventListener(\"scroll\", () => { const pct = scrollY / (document.body.scrollHeight - innerHeight) * 100; bar.style.width = pct + \"%\" }). Visitor count: let visits = parseInt(localStorage.getItem(\"visits\")||0)+1; localStorage.setItem(\"visits\",visits).",
    },
    quiz_en: [
      { q: 'Intersection Observer when use karte hain?', options: ['Hamesha', 'Scroll-triggered animations for — viewport in element aane pe action lo', 'Click events ke liye', 'Form validation ke liye'], correct: 1, explanation: 'Intersection Observer batata is when koi element viewport in enter/exit karta is — scroll event from zyada efficient. Skill bar animations, lazy loading, active nav for perfect!',
 q_en: 'When do you use Intersection Observer?',
 options_en: ['Always', 'For scroll-triggered animations — take action when an element enters the viewport', 'For click events', 'For form validation'],
 explanation_en: 'Intersection Observer tells you when an element enters or exits the viewport — more efficient than the scroll event. Perfect for skill bar animations, lazy loading, and active nav!' },
      { q: 'matchMedia("(prefers-color-scheme: dark)").matches what detect karta hai?', options: ['Browser dark theme', 'OS/system dark mode preference — user ke system setting ke hisaab se', 'Website color', 'Screen brightness'], correct: 1, explanation: 'matchMedia system-level dark/light mode preference detect karta hai. Agar user ke OS in dark mode is toh automatically website bhi dark mode in load ho — better UX!',
 q_en: 'What does matchMedia("(prefers-color-scheme: dark)").matches detect?',
 options_en: ['Browser dark theme', 'OS/system dark mode preference — based on the user\'s system settings', 'Website colour', 'Screen brightness'],
 explanation_en: 'matchMedia detects the system-level dark/light mode preference. If the user has dark mode on their OS, the website can automatically load in dark mode — better UX!' },
      { q: 'event.preventDefault() form submit in why use karte hain?', options: ['Form submit block karne for permanently', 'Default browser form submission (page reload) rokne for — taaki JS from handle kar sakein', 'Form reset karne ke liye', 'Validation disable karne ke liye'], correct: 1, explanation: 'Default form submit page reload karta is data loss ke saath. preventDefault() from page reload rokto, phir JS from validation karo, AJAX from data bhejo, or custom success message dikhao.',
 q_en: 'Why do you use event.preventDefault() on form submit?',
 options_en: ['To block form submission permanently', 'To prevent the default browser form submission (page reload) — so JS can handle it', 'To reset the form', 'To disable validation'],
 explanation_en: 'The default form submission reloads the page and loses data. preventDefault() stops the reload, so you can validate with JS, send data with AJAX, or show a custom success message.' },
    ],
  },

};

// ── WEEK 10 ──────────────────────────────────────────────────
const W10 = {
  'html-w10-s1': {
    title_en: "Fetch API and Promises",
    content_en: `## Fetch API and Promises — Calling Real APIs!

### What is Fetch?
Fetch lets JavaScript make HTTP requests — without a page reload!

\`\`\`javascript
// Basic fetch
fetch('https://api.github.com/users/torvalds')
  .then(response => response.json())
  .then(data => {
    console.log(data.name);       // Linus Torvalds
    console.log(data.followers);  // 200000+
  })
  .catch(error => console.error('Error:', error));
\`\`\`

### async/await — Cleaner Syntax
\`\`\`javascript
async function loadUser(username) {
  try {
    const response = await fetch(\`https://api.github.com/users/\${username}\`);

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to load user:', error);
    return null;
  }
}

// Usage
async function showUser() {
  const user = await loadUser('torvalds');
  if (user) {
    document.querySelector('#name').textContent   = user.name;
    document.querySelector('#avatar').src         = user.avatar_url;
    document.querySelector('#followers').textContent = user.followers;
  }
}
showUser();
\`\`\`

### Loading State
\`\`\`javascript
async function fetchWithLoading(url) {
  const loader = document.querySelector('#loader');
  const content = document.querySelector('#content');

  loader.style.display  = 'block';
  content.style.opacity = '0.5';

  try {
    const res  = await fetch(url);
    const data = await res.json();
    return data;
  } finally {
    loader.style.display  = 'none';
    content.style.opacity = '1';
  }
}
\`\`\`

### Free APIs to Practice With:
\`\`\`
https://api.github.com/users/{username}
https://api.github.com/repos/{owner}/{repo}
https://official-joke-api.appspot.com/random_joke
https://dog.ceo/api/breeds/image/random
https://api.agify.io?name=rahul
https://hacker-news.firebaseio.com/v0/topstories.json
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fetch API Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px 20px; }
    h1 { font-size: 26px; margin-bottom: 6px; }
    p  { color: #64748b; margin-bottom: 24px; font-size: 14px; }
    .tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
    .tab-btn { padding: 8px 20px; background: #1e293b; border: 1px solid rgba(99,102,241,0.2); color: #94a3b8; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
    .tab-btn.active { background: #6366f1; color: white; border-color: #6366f1; }
    #output { min-height: 200px; }
    .user-card { background: #1e293b; border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; align-items: center; gap: 16px; }
    .avatar { width: 48px; height: 48px; background: linear-gradient(135deg,#6366f1,#a78bfa); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: white; flex-shrink: 0; }
    .user-info h3 { font-size: 15px; margin-bottom: 4px; }
    .user-info p  { color: #64748b; font-size: 13px; margin: 0; }
    .joke-card { background: #1e293b; border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; padding: 24px; text-align: center; }
    .joke-setup { font-size: 18px; margin-bottom: 16px; }
    .joke-punch { font-size: 22px; font-weight: 700; color: #a78bfa; }
    .skeleton { background: linear-gradient(90deg,#1e293b 0%,#334155 50%,#1e293b 100%); background-size: 200%; animation: shimmer 1.5s linear infinite; border-radius: 8px; }
    @keyframes shimmer { 0%{background-position:-200%} 100%{background-position:200%} }
    .loading-card { height: 76px; border-radius: 12px; margin-bottom: 12px; }
    .btn { padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; margin-top: 12px; }
    .btn:hover { background: #4f46e5; transform: translateY(-2px); }
    .error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; padding: 16px; border-radius: 10px; font-size: 14px; }
    .post-card { background: #1e293b; border: 1px solid rgba(99,102,241,0.15); border-radius: 10px; padding: 16px; margin-bottom: 10px; }
    .post-card h3 { font-size: 14px; text-transform: capitalize; margin-bottom: 8px; color: #a78bfa; }
    .post-card p  { color: #64748b; font-size: 13px; line-height: 1.5; }
  </style>
</head>
<body>

  <h1>🌐 Fetch API Demo</h1>
  <p>Real APIs se data fetch karo — click karo!</p>

  <div class="tabs">
    <button class="tab-btn active" onclick="loadTab('users', this)">👥 Users</button>
    <button class="tab-btn" onclick="loadTab('joke',  this)">😂 Joke</button>
    <button class="tab-btn" onclick="loadTab('posts', this)">📝 Posts</button>
  </div>

  <div id="output">
    <div class="skeleton loading-card"></div>
    <div class="skeleton loading-card"></div>
    <div class="skeleton loading-card" style="height:56px"></div>
  </div>

  <script>
    function showLoading(count = 3, h = 76) {
      document.getElementById('output').innerHTML =
        Array(count).fill(\\\`<div class="skeleton loading-card" style="height:\\\${h}px"></div>\\\`).join('');
    }

    async function loadTab(tab, btn) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (tab === 'users') await loadUsers();
      if (tab === 'joke')  await loadJoke();
      if (tab === 'posts') await loadPosts();
    }

    async function loadUsers() {
      showLoading(5);
      try {
        const res  = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await res.json();
        document.getElementById('output').innerHTML = data.map(u => \\\`
          <div class="user-card">
            <div class="avatar">\\\${u.name[0]}</div>
            <div class="user-info">
              <h3>\\\${u.name}</h3>
              <p>📧 \\\${u.email} &nbsp;·&nbsp; 🌐 \\\${u.website}</p>
              <p>🏙️ \\\${u.address.city} &nbsp;·&nbsp; 🏢 \\\${u.company.name}</p>
            </div>
          </div>
        \\\`).join('');
      } catch (e) {
        document.getElementById('output').innerHTML = \\\`<div class="error-msg">❌ \\\${e.message}</div>\\\`;
      }
    }

    async function loadJoke() {
      showLoading(1, 120);
      try {
        const res  = await fetch('https://official-joke-api.appspot.com/random_joke');
        const joke = await res.json();
        document.getElementById('output').innerHTML = \\\`
          <div class="joke-card">
            <div class="joke-setup">🤔 \\\${joke.setup}</div>
            <div class="joke-punch">😂 \\\${joke.punchline}</div>
            <button class="btn" onclick="loadJoke(document.querySelector('.tab-btn.active'))">Another Joke 🎲</button>
          </div>
        \\\`;
      } catch (e) {
        document.getElementById('output').innerHTML = \\\`<div class="error-msg">❌ \\\${e.message}</div>\\\`;
      }
    }

    async function loadPosts() {
      showLoading(5, 90);
      try {
        const res   = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        const posts = await res.json();
        document.getElementById('output').innerHTML = posts.map(p => \\\`
          <div class="post-card">
            <h3>\\\${p.title}</h3>
            <p>\\\${p.body.substring(0, 100)}...</p>
          </div>
        \\\`).join('');
      } catch (e) {
        document.getElementById('output').innerHTML = \\\`<div class="error-msg">❌ \\\${e.message}</div>\\\`;
      }
    }

    // Load users by default
    loadUsers();
  </script>

</body>
</html>\`,
      codeExample_en: \`<!-- Same demo — text labels are already in English. See Hinglish version for the complete working Fetch API demo. -->`,
    task_en: {
      description: "Ek \"Country Explorer\" app banao using https://restcountries.com/v3.1/all API. Features: (1) Saare countries load karo on start (loading skeleton show karo), (2) Search box — real-time filter by country name, (3) Region filter — All, Asia, Europe, Africa, Americas, (4) Country card — flag, name, population, capital, region, (5) Card click pe detailed modal — all details, (6) Sort by population (high/low), (7) localStorage in favourite countries save karo (heart button), (8) Favourites tab.',\n description_en: 'Build a \"Country Explorer\" app using https://restcountries.com/v3.1/all. Features: (1) Load all countries on start (show loading skeleton), (2) Search box — real-time filter by country name, (3) Region filter — All, Asia, Europe, Africa, Americas, (4) Country card — flag, name, population, capital, region, (5) Click card for a detailed modal, (6) Sort by population (high/low), (7) Save favourite countries to localStorage (heart button), (8) Favourites tab.",
      hint: "restcountries.com/v3.1/all from sab countries milte hain. flag: country.flags.png. population: Intl.NumberFormat().format(num) from formatted number milta hai. Modal: position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:100.",
    },
    quiz_en: [
      { q: 'async/await and .then() in what fark hai?', options: ['Koi fark nahi', 'Dono Promises handle karte are — async/await zyada readable and synchronous-looking code deta hai', 'async/await faster hai', '.then() deprecated hai'], correct: 1, explanation: 'Dono ka same result hai. async/await code to synchronous-looking banata is — nested .then() chains from zyada readable. Error handling: try/catch vs .catch(). Modern code in async/await prefer karte hain.',
 q_en: 'What is the difference between async/await and .then()?',
 options_en: ['No difference', 'Both handle Promises — async/await gives more readable, synchronous-looking code', 'async/await is faster', '.then() is deprecated'],
 explanation_en: 'Both achieve the same result. async/await makes code look synchronous — more readable than nested .then() chains. Error handling: try/catch vs .catch(). Modern code prefers async/await.' },
      { q: 'response.json() what karta hai?', options: ['JSON file save karta hai', 'Response body to JavaScript object/array in convert karta hai', 'JSON validate karta hai', 'Response header read karta hai'], correct: 1, explanation: 'fetch() Response object return karta hai. .json() response body to string from parse karke JavaScript object/array in convert karta hai. Yeh bhi async hai, isliye await karte hain.',
 q_en: 'What does response.json() do?',
 options_en: ['Saves a JSON file', 'Converts the response body into a JavaScript object/array', 'Validates JSON', 'Reads the response header'],
 explanation_en: 'fetch() returns a Response object. .json() parses the response body from a string into a JavaScript object/array. It is also async, so we await it.' },
      { q: 'Promise.all() when use karte hain?', options: ['Ek API call ke liye', 'Multiple async operations parallel in run karne for — sab complete hone ka intezaar', 'Error handle karne ke liye', 'API cancel karne ke liye'], correct: 1, explanation: 'Promise.all([p1, p2, p3]) — sab Promises parallel in run karta is and sab ke complete hone ka wait karta hai. Sequential await from tez hota hai. Agar koi bhi fail ho toh poora fail.',
 q_en: 'When do you use Promise.all()?',
 options_en: ['For a single API call', 'To run multiple async operations in parallel — waiting for all to complete', 'For error handling', 'For cancelling an API call'],
 explanation_en: 'Promise.all([p1, p2, p3]) — runs all Promises in parallel and waits for all to complete. Faster than sequential awaits. If any one fails, the whole thing fails.' },
    ],
  },

  'html-w10-s2': {
    title_en: "JavaScript ES6+ Features",
    content_en: `## JavaScript ES6+ Features!

### Arrow Functions
\`\`\`javascript
// Old style
function add(a, b) { return a + b; }

// Arrow function
const add = (a, b) => a + b;

// Single parameter (no brackets needed)
const double = n => n * 2;

// Multi-line body needs {}  and return
const greet = name => {
  const message = \`Hello, \${name}!\`;
  return message;
};
\`\`\`

### Destructuring
\`\`\`javascript
// Array destructuring
const [first, second, ...rest] = [10, 20, 30, 40, 50];
console.log(first);  // 10
console.log(rest);   // [30, 40, 50]

// Object destructuring
const { name, age, city = 'Mumbai' } = { name: 'Rahul', age: 20 };
console.log(name);  // Rahul
console.log(city);  // Mumbai (default)

// Function parameter destructuring
function showUser({ name, score, level = 'beginner' }) {
  console.log(\`\${name} — \${score} pts — \${level}\`);
}
\`\`\`

### Spread and Rest
\`\`\`javascript
// Spread: expand array/object
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5, 6];  // [1, 2, 3, 4, 5, 6]

const user = { name: 'Rahul', score: 100 };
const updated = { ...user, score: 150, badge: 'gold' };

// Rest: collect remaining arguments
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4, 5);  // 15
\`\`\`

### Array Methods
\`\`\`javascript
const students = [
  { name: 'Rahul', score: 85 },
  { name: 'Priya', score: 92 },
  { name: 'Arjun', score: 67 },
];

// map — transform each item
const names = students.map(s => s.name);  // ['Rahul', 'Priya', 'Arjun']

// filter — keep items matching condition
const topStudents = students.filter(s => s.score >= 80);

// find — first match
const priya = students.find(s => s.name === 'Priya');

// reduce — combine into single value
const total = students.reduce((sum, s) => sum + s.score, 0);

// sort
students.sort((a, b) => b.score - a.score);  // descending by score
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ES6+ Features Demo</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px 20px; }
    h2 { color: #a78bfa; font-size: 16px; margin: 32px 0 12px; }
    .box { background: #1e293b; border: 1px solid rgba(99,102,241,0.15); border-radius: 10px; padding: 16px; font-size: 14px; }
    .tag { display: inline-block; padding: 3px 10px; background: rgba(99,102,241,0.15); color: #a78bfa; border-radius: 12px; font-size: 12px; margin: 2px; }
    .user-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(99,102,241,0.1); }
    .user-row:last-child { border: none; }
    .rank { width: 28px; height: 28px; background: linear-gradient(135deg,#6366f1,#a78bfa); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: white; flex-shrink: 0; }
    .score-bar { flex: 1; background: rgba(99,102,241,0.1); border-radius: 4px; height: 6px; overflow: hidden; }
    .score-fill { height: 100%; background: linear-gradient(90deg,#6366f1,#a78bfa); border-radius: 4px; }
  </style>
</head>
<body>

  <h1 style="font-size:26px;margin-bottom:6px">✨ ES6+ Features Demo</h1>
  <p style="color:#64748b;font-size:14px;margin-bottom:8px">Modern JavaScript features in action!</p>

  <div id="output"></div>

  <script>
    const users = [
      { name: 'Rahul Kumar',  age: 21, score: 85, city: 'Mumbai',    skills: ['HTML','CSS','JS'] },
      { name: 'Priya Sharma', age: 19, score: 92, city: 'Delhi',     skills: ['Python','React'] },
      { name: 'Arjun Singh',  age: 23, score: 78, city: null,        skills: ['HTML','Python'] },
      { name: 'Neha Patel',   age: 20, score: 95, city: 'Bangalore', skills: ['CSS','JS','Node'] },
      { name: 'Vikram Rao',   age: 22, score: 70, city: 'Chennai',   skills: ['Java','SQL'] },
    ];

    const output = document.getElementById('output');

    // 1. Destructuring
    output.innerHTML += \\\`
      <h2>1. Destructuring</h2>
      <div class="box">
        \\\${users.map(({ name, age, city = 'Unknown', skills }) =>
          \\\`<div class="user-row">
            <div style="flex:1">
              <strong>\\\${name}</strong><br>
              <small style="color:#64748b">Age: \\\${age} · City: \\\${city}</small><br>
              \\\${skills.map(s => \\\`<span class="tag">\\\${s}</span>\\\`).join('')}
            </div>
          </div>\\\`
        ).join('')}
      </div>
    \\\`;

    // 2. Sort + Spread (original array unchanged)
    const sorted = [...users].sort((a, b) => b.score - a.score);
    output.innerHTML += \\\`
      <h2>2. Sort by Score (Spread prevents mutation)</h2>
      <div class="box">
        \\\${sorted.map((u, i) =>
          \\\`<div class="user-row">
            <div class="rank">\\\${i+1}</div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span>\\\${u.name}</span>
                <strong style="color:#6366f1">\\\${u.score}%</strong>
              </div>
              <div class="score-bar"><div class="score-fill" style="width:\\\${u.score}%"></div></div>
            </div>
          </div>\\\`
        ).join('')}
      </div>
    \\\`;

    // 3. Array methods
    const topScorer  = users.find(u => u.score === Math.max(...users.map(u => u.score)));
    const avgScore   = (users.reduce((s, u) => s + u.score, 0) / users.length).toFixed(1);
    const allAdults  = users.every(u => u.age >= 18);
    const hasExpert  = users.some(u => u.score >= 90);
    const allSkills  = [...new Set(users.flatMap(u => u.skills))];

    output.innerHTML += \\\`
      <h2>3. Array Methods (find, every, some, flatMap, Set)</h2>
      <div class="box">
        <p>🏆 Top Scorer: <strong>\\\${topScorer.name}</strong> (\\\${topScorer.score}%)</p>
        <p>📊 Average: <strong>\\\${avgScore}%</strong></p>
        <p>👤 All Adults: <strong>\\\${allAdults ? '✅ Yes' : '❌ No'}</strong></p>
        <p>🌟 Expert Scorer (90%+): <strong>\\\${hasExpert ? '✅ Yes' : '❌ No'}</strong></p>
        <p style="margin-top:8px">🛠 All Skills: \\\${allSkills.map(s => \\\`<span class="tag">\\\${s}</span>\\\`).join('')}</p>
      </div>
    \\\`;

    // 4. Optional chaining + nullish coalescing
    output.innerHTML += \\\`
      <h2>4. Optional Chaining + Nullish Coalescing</h2>
      <div class="box">
        \\\${users.map(u =>
          \\\`<p>\\\${u.name}: City = <strong>\\\${u?.city ?? 'Unknown 🏙️'}</strong></p>\\\`
        ).join('')}
      </div>
    \\\`;
  </script>

</body>
</html>\`,
      codeExample_en: \`<!-- Same demo in English — all JS logic is identical. See Hinglish version for the complete working ES6+ features showcase. -->`,
    task_en: {
      description: "Ek \"StudyEarn Dashboard\" page banao ES6+ features use karke. JSONPlaceholder API from data fetch karo. Dashboard show kare: (1) Users list — destructuring from name/email/company nikalo, (2) Posts summary — find karke user ke posts count dikhao, (3) Todo stats — filter karke completed vs pending count, (4) Leaderboard — users to sort karo algo-generated score from (todos completed / total * 100), (5) Skills cloud — flatMap from all unique company domains nikalo, (6) Search bar — real-time filter users by name.',\n description_en: 'Build a \"StudyEarn Dashboard\" page using ES6+ features. Fetch data from JSONPlaceholder API. Dashboard should show: (1) Users list — extract name/email/company using destructuring, (2) Posts summary — find and show post count per user, (3) Todo stats — filter completed vs pending count, (4) Leaderboard — sort users by algo-generated score (todos completed / total * 100), (5) Skills cloud — extract all unique company domains using flatMap, (6) Search bar — real-time filter users by name.",
      hint: "Promise.all from users, todos, posts ek saath fetch karo. User posts count: posts.filter(p => p.userId === user.id).length. Spread: [...new Set(arr)] from unique values nikalo. Optional chaining: user?.company?.name ?? \"Unknown\".",
    },
    quiz_en: [
      { q: 'Spread operator (...) array sort karne from pehle why use karte hain?', options: ['Performance ke liye', 'Sort original array mutate karta is — spread from copy pe sort karo', 'Syntax ke liye', 'Sort kaam not karta bina spread ke'], correct: 1, explanation: 'Array.sort() original array to in-place sort karta is (mutate). [...arr].sort() pehle copy banata is phir sort karta is — original array unchanged rehta hai. React in bhi yahi best practice hai!',
 q_en: 'Why do you use the spread operator (...) before sorting an array?',
 options_en: ['For performance', 'sort() mutates the original array — spread to sort a copy instead', 'For syntax', 'sort() does not work without spread'],
 explanation_en: 'Array.sort() sorts the original array in place (mutates it). [...arr].sort() first creates a copy then sorts it — the original array remains unchanged. This is also best practice in React!' },
      { q: '[...new Set(array)] what karta hai?', options: ['Array shuffle karta hai', 'Duplicate values hata ke unique values ka new array deta hai', 'Array reverse karta hai', 'Array khali karta hai'], correct: 1, explanation: 'Set sirf unique values store karta hai. new Set([1,2,2,3]) → Set{1,2,3}. Spread from wapis array in convert karo: [...new Set([1,2,2,3])] → [1,2,3].',
 q_en: 'What does [...new Set(array)] do?',
 options_en: ['Shuffles the array', 'Removes duplicate values and returns a new array of unique values', 'Reverses the array', 'Empties the array'],
 explanation_en: 'Set only stores unique values. new Set([1,2,2,3]) → Set{1,2,3}. Spread converts it back to an array: [...new Set([1,2,2,3])] → [1,2,3].' },
      { q: 'Object destructuring in default value how dete hain?', options: ['{ name = "default" } = obj', '{ name: "default" } = obj', '{ name || "default" } = obj', 'name = obj.name || "default"'], correct: 0, explanation: '{ name = "default" } = obj — agar obj.name undefined is toh name ki value "default" hogi. Colon (:) rename for hota hai: { name: userName } = obj — obj.name to userName variable in store karo.',
 q_en: 'How do you provide a default value in object destructuring?',
 options_en: ['{ name = "default" } = obj', '{ name: "default" } = obj', '{ name || "default" } = obj', 'name = obj.name || "default"'],
 explanation_en: '{ name = "default" } = obj — if obj.name is undefined, name will be "default". The colon (:) is for renaming: { name: userName } = obj — stores obj.name in the userName variable.' },
    ],
  },

  'html-w10-s3': {
    title_en: "JavaScript Error Handling and Debugging",
    content_en: `## JavaScript Error Handling and Debugging!

### try/catch/finally
\`\`\`javascript
async function loadData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(\`HTTP Error: \${response.status}\`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Network error — no internet?', error);
    } else {
      console.error('Unexpected error:', error.message);
    }
    return null;

  } finally {
    // Always runs — hide loader, re-enable button
    hideLoader();
  }
}
\`\`\`

### Custom Errors
\`\`\`javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name  = 'ValidationError';
    this.field = field;
  }
}

function validateEmail(email) {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
  return true;
}

try {
  validateEmail('notanemail');
} catch (e) {
  if (e instanceof ValidationError) {
    document.querySelector(\`#\${e.field}-error\`).textContent = e.message;
  }
}
\`\`\`

### Console Debugging
\`\`\`javascript
console.log('Value:', variable);
console.table(arrayOfObjects);   // nice table view
console.group('API Response');
console.log('Status:', status);
console.log('Data:', data);
console.groupEnd();
console.time('operation');
// ... code ...
console.timeEnd('operation');    // "operation: 45ms"
console.warn('Deprecated use!');
console.error('Something failed!');
\`\`\`

### Browser DevTools Tips:
\`\`\`
F12 / Cmd+Shift+I → Open DevTools
Sources → Debugger → Set breakpoints (click line numbers)
Console → Test JS expressions live
Network → See all API calls + responses
Elements → Inspect and edit HTML/CSS live
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Error Handling Demo</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px 20px; }
    .section { background: #1e293b; border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    h2 { color: #a78bfa; font-size: 15px; margin-bottom: 14px; }
    .log-line { font-family: monospace; font-size: 13px; padding: 6px 10px; border-radius: 6px; margin-bottom: 4px; }
    .log-ok    { background: rgba(16,185,129,0.1); color: #10b981; border-left: 3px solid #10b981; }
    .log-err   { background: rgba(239,68,68,0.1);  color: #ef4444; border-left: 3px solid #ef4444; }
    .log-warn  { background: rgba(245,158,11,0.1); color: #f59e0b; border-left: 3px solid #f59e0b; }
    .log-info  { background: rgba(99,102,241,0.1); color: #a78bfa; border-left: 3px solid #6366f1; }
    .btn { padding: 8px 18px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; margin: 4px 2px; transition: all 0.2s; }
    .btn:hover { background: #4f46e5; }
    .btn.red { background: #ef4444; }
    .btn.red:hover { background: #dc2626; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px; }
    th { background: rgba(99,102,241,0.2); padding: 8px; text-align: left; color: #a78bfa; }
    td { padding: 8px; border-bottom: 1px solid rgba(99,102,241,0.1); color: #94a3b8; }
  </style>
</head>
<body>

  <h1 style="font-size:26px;margin-bottom:6px">🐛 Error Handling Demo</h1>
  <p style="color:#64748b;font-size:14px;margin-bottom:24px">Error handling patterns in action</p>

  <!-- 1. try/catch demo -->
  <div class="section">
    <h2>1. try/catch — Different Error Types</h2>
    <button class="btn" onclick="testFetch('good')">✅ Good URL</button>
    <button class="btn red" onclick="testFetch('bad')">❌ Bad URL</button>
    <button class="btn red" onclick="testFetch('network')">🔌 Network Error</button>
    <div id="fetchLog" style="margin-top:12px"></div>
  </div>

  <!-- 2. console methods -->
  <div class="section">
    <h2>2. console.table() — Data kaise dekhe?</h2>
    <button class="btn" onclick="showTable()">Show Users Table</button>
    <div id="tableOut"></div>
  </div>

  <!-- 3. Common bug fixes -->
  <div class="section">
    <h2>3. Common JS Bugs — Click to See</h2>
    <button class="btn" onclick="showBugs()">Show Bug Examples</button>
    <div id="bugsOut"></div>
  </div>

  <script>
    const log = (id, msg, type='info') => {
      document.getElementById(id).innerHTML +=
        \\\`<div class="log-line log-\\\${type}">\\\${msg}</div>\\\`;
    };

    // 1. Fetch with error handling
    async function testFetch(type) {
      document.getElementById('fetchLog').innerHTML = '';
      log('fetchLog', '⏳ Fetching data...', 'info');

      try {
        let url;
        if (type === 'good')    url = 'https://jsonplaceholder.typicode.com/users/1';
        if (type === 'bad')     url = 'https://jsonplaceholder.typicode.com/users/999999';
        if (type === 'network') url = 'https://this-domain-does-not-exist-abc123.com/api';

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(\\\`HTTP \\\${res.status}: \\\${res.statusText}\\\`);
        }

        const data = await res.json();
        log('fetchLog', \\\`✅ Success! Got user: \\\${data.name} (\\\${data.email})\\\`, 'ok');

      } catch (error) {
        if (error.name === 'TypeError') {
          log('fetchLog', \\\`🔌 Network Error: Internet ya URL problem. (\\\${error.message})\\\`, 'err');
        } else if (error.message.includes('404')) {
          log('fetchLog', \\\`🔍 Not Found (404): URL exist nahi karta\\\`, 'err');
        } else {
          log('fetchLog', \\\`❌ Error: \\\${error.message}\\\`, 'err');
        }
      } finally {
        log('fetchLog', '🏁 finally block: Hamesha run hoga!', 'warn');
      }
    }

    // 2. console.table equivalent
    function showTable() {
      const users = [
        { Name: 'Rahul', Score: 85, City: 'Mumbai' },
        { Name: 'Priya', Score: 92, City: 'Delhi'  },
        { Name: 'Arjun', Score: 78, City: 'Pune'   },
      ];
      document.getElementById('tableOut').innerHTML = \\\`
        <table>
          <thead><tr>\\\${Object.keys(users[0]).map(k=>\\\`<th>\\\${k}</th>\\\`).join('')}</tr></thead>
          <tbody>\\\${users.map(u=>\\\`<tr>\\\${Object.values(u).map(v=>\\\`<td>\\\${v}</td>\\\`).join('')}</tr>\\\`).join('')}</tbody>
        </table>
      \\\`;
    }

    // 3. Common bugs
    function showBugs() {
      const bugs = [
        { Bug: '= vs ===', Wrong: 'if (x = 5)', Right: 'if (x === 5)', Note: '= is assignment!' },
        { Bug: 'await missing', Wrong: 'const data = fetch(url)', Right: 'const data = await fetch(url)', Note: 'Gives Promise not data' },
        { Bug: 'Array mutation', Wrong: 'arr.push(item)', Right: 'arr = [...arr, item]', Note: 'push mutates original' },
        { Bug: 'typeof null', Wrong: 'typeof null === "object"', Right: 'null === null', Note: 'typeof null bug in JS' },
      ];
      document.getElementById('bugsOut').innerHTML = \\\`
        <table style="margin-top:12px">
          <thead><tr><th>Bug</th><th style="color:#ef4444">Wrong</th><th style="color:#10b981">Right</th><th>Note</th></tr></thead>
          <tbody>\\\${bugs.map(b=>\\\`<tr>
            <td>\\\${b.Bug}</td>
            <td style="color:#ef4444;font-family:monospace">\\\${b.Wrong}</td>
            <td style="color:#10b981;font-family:monospace">\\\${b.Right}</td>
            <td style="color:#64748b">\\\${b.Note}</td>
          </tr>\\\`).join('')}</tbody>
        </table>
      \\\`;
    }

    // Auto-load table
    showTable();
  </script>

</body>
</html>\`,
      codeExample_en: \`<!-- Same demo — all labels are already in English in the code. See Hinglish version for the full working Error Handling demo. -->`,
    task_en: {
      description: "Apni Country Explorer app in robust error handling add karo: (1) Network offline hone pe friendly error message, (2) API slow hone pe retry button (3 attempts), (3) Custom APIError class banao, (4) Loading states: shimmer skeleton, (5) Empty states: search result na mile toh friendly message, (6) Error boundary component — ek try/catch wrapper jo kisi bhi error to gracefully handle kare, (7) console.table() from data DevTools in dekho, (8) performance timing — console.time() from fetch kitna time le raha is measure karo.',\n description_en: 'Add robust error handling to your Country Explorer app: (1) Friendly error message when network is offline, (2) Retry button when API is slow (3 attempts), (3) Build a custom APIError class, (4) Loading states: shimmer skeleton, (5) Empty states: friendly message when search finds nothing, (6) Error boundary — a try/catch wrapper that gracefully handles any error, (7) View data in DevTools with console.table(), (8) Performance timing — measure fetch time with console.time().",
      hint: "Network check: navigator.onLine. Retry: for(let i=0;i<3;i++) { try { return await fetch(); } catch(e) { if(i===2) throw e; await sleep(1000); } }. sleep: const sleep = ms => new Promise(r => setTimeout(r, ms)).",
    },
    quiz_en: [
      { q: 'finally block when run hota hai?', options: ['Sirf success pe', 'Sirf error pe', 'Hamesha — success or error dono cases mein', 'Kabhi nahi'], correct: 2, explanation: 'finally block hamesha run hota is — try successful ho or catch in error aaye. Loading spinner hide karne, resources cleanup karne, logs lene for perfect!',
 q_en: 'When does the finally block run?',
 options_en: ['Only on success', 'Only on error', 'Always — both on success and error', 'Never'],
 explanation_en: 'The finally block always runs — whether try succeeded or catch caught an error. Perfect for hiding loading spinners, cleaning up resources, and logging!' },
      { q: '=== (strict equality) and == (loose equality) in what fark hai?', options: ['Koi fark nahi', '=== type and value dono check karta hai, == sirf value check karta is (type coercion karta hai)', '== faster hai', '=== sirf numbers for hai'], correct: 1, explanation: '0 == false → true (loose), 0 === false → false (strict). "1" == 1 → true (loose), "1" === 1 → false (strict). Hamesha === use karo unexpected results from bachne ke liye!',
 q_en: 'What is the difference between === (strict equality) and == (loose equality)?',
 options_en: ['No difference', '=== checks both type AND value, == only checks value (with type coercion)', '== is faster', '=== is only for numbers'],
 explanation_en: '0 == false → true (loose), 0 === false → false (strict). "1" == 1 → true (loose), "1" === 1 → false (strict). Always use === to avoid unexpected results!' },
      { q: 'navigator.onLine what detect karta hai?', options: ['User logged in is or nahi', 'Browser internet from connected is or nahi', 'Page online is or nahi', 'Server status'], correct: 1, explanation: 'navigator.onLine = true agar browser internet from connected hai. False agar offline. window.addEventListener("offline", handler) from offline event bhi sun sakte ho.',
 q_en: 'What does navigator.onLine detect?',
 options_en: ['Whether the user is logged in', 'Whether the browser is connected to the internet', 'Whether the page is online', 'Server status'],
 explanation_en: 'navigator.onLine = true if the browser is connected to the internet. False if offline. You can also listen to window.addEventListener("offline", handler) for the offline event.' },
    ],
  },

  'html-w10-s4': {
    title_en: "Week 10 Project — Weather App",
    content_en: `## Week 10 Project — Weather App!

Build a real weather app using a free weather API!

### Free Weather APIs:
\`\`\`
Open-Meteo (completely free, no key):
  https://api.open-meteo.com/v1/forecast?latitude=19.07&longitude=72.88&current_weather=true

wttr.in (free, simple):
  https://wttr.in/Mumbai?format=j1
\`\`\`

### Project Features:
\`\`\`
1. Search for any city
2. Current temperature, condition, humidity
3. Weather icon (emoji or icon font)
4. 5-day forecast
5. Toggle Celsius/Fahrenheit
6. Recent searches (localStorage)
7. Loading state and error handling
8. Geolocation for current location
\`\`\`

### Architecture:
\`\`\`javascript
// api.js
async function getWeather(city) {
  // First: get coordinates from city name
  const geoRes  = await fetch(\`https://geocoding-api.open-meteo.com/v1/search?name=\${city}\`);
  const geoData = await geoRes.json();
  const { latitude, longitude, name } = geoData.results[0];

  // Then: get weather from coordinates
  const weatherRes  = await fetch(
    \`https://api.open-meteo.com/v1/forecast?latitude=\${latitude}&longitude=\${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto\`
  );
  return weatherRes.json();
}

// ui.js
function renderWeather(data, city) {
  const { temperature, windspeed, weathercode } = data.current_weather;
  // ... update DOM
}
\`\`\`

### Weather Code to Emoji Mapping:
\`\`\`javascript
const weatherEmoji = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 51: '🌦️', 61: '🌧️', 80: '🌦️',
  95: '⛈️', 99: '🌩️',
};
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather App Demo</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:Arial,sans-serif; background:linear-gradient(135deg,#0f172a,#1e1b4b); min-height:100vh; color:#e2e8f0; padding:24px 20px; }
    h1 { font-size:26px; text-align:center; margin-bottom:6px; }
    .sub { color:#64748b; text-align:center; font-size:14px; margin-bottom:28px; }
    .search-row { display:flex; gap:8px; max-width:440px; margin:0 auto 24px; }
    .search-row input { flex:1; padding:12px 16px; background:#1e293b; border:2px solid rgba(99,102,241,0.3); color:#e2e8f0; border-radius:10px; font-size:15px; outline:none; }
    .search-row input:focus { border-color:#6366f1; }
    .search-row button { padding:12px 20px; background:#6366f1; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:700; transition:all 0.2s; }
    .search-row button:hover { background:#4f46e5; transform:translateY(-2px); }
    .weather-card { background:rgba(30,41,59,0.8); backdrop-filter:blur(12px); border:1px solid rgba(99,102,241,0.2); border-radius:20px; padding:28px; max-width:440px; margin:0 auto; text-align:center; }
    .weather-icon { font-size:80px; margin:12px 0; animation:float 3s ease-in-out infinite; }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .temp { font-size:72px; font-weight:800; margin:8px 0; background:linear-gradient(135deg,#6366f1,#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .condition { font-size:18px; color:#94a3b8; margin-bottom:20px; }
    .city-name { font-size:22px; font-weight:700; margin-bottom:4px; }
    .date { color:#64748b; font-size:13px; margin-bottom:20px; }
    .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:16px; }
    .stat { background:rgba(99,102,241,0.1); border-radius:12px; padding:14px 8px; }
    .stat .val { font-size:20px; font-weight:700; color:#a78bfa; }
    .stat .lbl { font-size:11px; color:#64748b; margin-top:4px; }
    .recent { max-width:440px; margin:16px auto 0; }
    .recent-title { font-size:12px; color:#64748b; margin-bottom:8px; }
    .recent-tags { display:flex; gap:6px; flex-wrap:wrap; }
    .recent-tag { padding:4px 12px; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); border-radius:20px; font-size:12px; cursor:pointer; color:#a78bfa; }
    .recent-tag:hover { background:rgba(99,102,241,0.2); }
    .error { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:12px; padding:16px; text-align:center; color:#ef4444; max-width:440px; margin:0 auto; }
    .skeleton { background:linear-gradient(90deg,#1e293b 0%,#334155 50%,#1e293b 100%); background-size:200%; animation:shimmer 1.5s linear infinite; border-radius:12px; }
    @keyframes shimmer { 0%{background-position:-200%} 100%{background-position:200%} }
  </style>
</head>
<body>

  <h1>🌤️ Weather App</h1>
  <p class="sub">Free JSONPlaceholder data se simulated — real app mein OpenWeatherMap API use karo!</p>

  <div class="search-row">
    <input type="text" id="cityInput" placeholder="City naam likho... (e.g., Mumbai)" onkeydown="if(event.key==='Enter')search()">
    <button onclick="search()">Search</button>
  </div>

  <div id="weatherOut"></div>

  <div class="recent" id="recentSection" style="display:none">
    <div class="recent-title">🕐 Recent Searches:</div>
    <div class="recent-tags" id="recentTags"></div>
  </div>

  <script>
    // Simulated weather data (real app mein OpenWeatherMap API use karo)
    const MOCK_WEATHER = {
      'mumbai':     { temp:32, feels:36, humidity:78, wind:12, condition:'Haze',        icon:'🌫️', country:'IN' },
      'delhi':      { temp:28, feels:30, humidity:55, wind:20, condition:'Clear',        icon:'☀️', country:'IN' },
      'bangalore':  { temp:24, feels:25, humidity:65, wind:15, condition:'Partly Cloudy',icon:'⛅', country:'IN' },
      'chennai':    { temp:34, feels:40, humidity:82, wind:18, condition:'Hot & Humid',  icon:'🌡️', country:'IN' },
      'kolkata':    { temp:30, feels:35, humidity:70, wind:10, condition:'Thunderstorm', icon:'⛈️', country:'IN' },
      'pune':       { temp:26, feels:27, humidity:60, wind:14, condition:'Windy',        icon:'💨', country:'IN' },
      'hyderabad':  { temp:29, feels:32, humidity:58, wind:16, condition:'Sunny',        icon:'☀️', country:'IN' },
      'london':     { temp: 8, feels: 5, humidity:75, wind:25, condition:'Rainy',        icon:'🌧️', country:'GB' },
      'new york':   { temp:15, feels:12, humidity:62, wind:22, condition:'Cloudy',       icon:'☁️', country:'US' },
      'tokyo':      { temp:18, feels:16, humidity:68, wind:8,  condition:'Partly Cloudy',icon:'⛅', country:'JP' },
    };

    const today = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });
    let recent = JSON.parse(localStorage.getItem('recentCities') || '[]');

    function showLoading() {
      document.getElementById('weatherOut').innerHTML = \\\`
        <div class="weather-card" style="padding:40px">
          <div class="skeleton" style="width:80px;height:80px;border-radius:50%;margin:0 auto 16px"></div>
          <div class="skeleton" style="width:120px;height:64px;margin:0 auto 12px"></div>
          <div class="skeleton" style="width:160px;height:20px;margin:0 auto 12px"></div>
          <div class="stats">
            <div class="skeleton" style="height:64px"></div>
            <div class="skeleton" style="height:64px"></div>
            <div class="skeleton" style="height:64px"></div>
          </div>
        </div>
      \\\`;
    }

    function search(city) {
      const query = (city || document.getElementById('cityInput').value).trim().toLowerCase();
      if (!query) return;
      showLoading();
      // Simulate API delay
      setTimeout(() => displayWeather(query), 800);
    }

    function displayWeather(query) {
      const data = MOCK_WEATHER[query];
      if (!data) {
        document.getElementById('weatherOut').innerHTML = \\\`
          <div class="error">
            <div style="font-size:48px;margin-bottom:8px">🏙️</div>
            <strong>"\\\${query}" city nahi mila!</strong><br>
            <small>Try: Mumbai, Delhi, London, Tokyo...</small>
          </div>
        \\\`;
        return;
      }

      // Add to recent
      recent = [query, ...recent.filter(c => c !== query)].slice(0, 5);
      localStorage.setItem('recentCities', JSON.stringify(recent));
      renderRecent();

      document.getElementById('weatherOut').innerHTML = \\\`
        <div class="weather-card">
          <div class="city-name">\\\${query.charAt(0).toUpperCase()+query.slice(1)}, \\\${data.country}</div>
          <div class="date">\\\${today}</div>
          <div class="weather-icon">\\\${data.icon}</div>
          <div class="temp">\\\${data.temp}°C</div>
          <div class="condition">\\\${data.condition}</div>
          <div class="stats">
            <div class="stat"><div class="val">💧 \\\${data.humidity}%</div><div class="lbl">Humidity</div></div>
            <div class="stat"><div class="val">🌡️ \\\${data.feels}°C</div><div class="lbl">Feels Like</div></div>
            <div class="stat"><div class="val">💨 \\\${data.wind} km/h</div><div class="lbl">Wind Speed</div></div>
          </div>
        </div>
      \\\`;
      document.getElementById('cityInput').value = '';
    }

    function renderRecent() {
      if (recent.length === 0) { document.getElementById('recentSection').style.display = 'none'; return; }
      document.getElementById('recentSection').style.display = 'block';
      document.getElementById('recentTags').innerHTML = recent.map(c =>
        \\\`<span class="recent-tag" onclick="search('\\\${c}')">\\\${c.charAt(0).toUpperCase()+c.slice(1)}</span>\\\`
      ).join('');
    }

    // Init
    renderRecent();
    search('mumbai');
  </script>

</body>
</html>\`,
      codeExample_en: \`<!-- Same weather app demo — see Hinglish version. For a real app, replace MOCK_WEATHER with actual OpenWeatherMap API calls. -->`,
    task_en: {
      description: "Real Weather App banao with OpenWeatherMap API (free account banao). Features: (1) City search with recent history (localStorage), (2) Current weather — temp, feels like, humidity, wind, visibility, (3) 5-day forecast cards (https://api.openweathermap.org/data/2.5/forecast), (4) Celsius/Fahrenheit toggle, (5) Geolocation — \"Use My Location\" button, (6) Background gradient change based on weather condition (sunny=warm, rainy=cool), (7) Loading skeletons, (8) Error handling (city not found, offline, API limit exceeded), (9) Sunrise/Sunset times from API data.',\n description_en: 'Build a real Weather App with the OpenWeatherMap API (create a free account). Features: (1) City search with recent history (localStorage), (2) Current weather — temp, feels like, humidity, wind, visibility, (3) 5-day forecast cards (https://api.openweathermap.org/data/2.5/forecast), (4) Celsius/Fahrenheit toggle, (5) Geolocation — \"Use My Location\" button, (6) Background gradient changes based on weather condition (sunny=warm, rainy=cool), (7) Loading skeletons, (8) Error handling (city not found, offline, API limit exceeded), (9) Sunrise/Sunset times from API data.",
      hint: "API_KEY environment variable or direct string in rakh sakte ho (sirf learning ke liye). Temp toggle: (celsius * 9/5 + 32).toFixed(1). Background: sunny \u2192 gradient orange, rainy \u2192 gradient blue, etc. Timestamp \u2192 time: new Date(unixTimestamp*1000).toLocaleTimeString()",
    },
    quiz_en: [
      { q: 'API key to frontend JS in hardcode karna safe is kya?', options: ['Haan, completely safe', 'Nahi — source code in visible hota hai. Public APIs for theek, sensitive ones for backend proxy use karo', 'Haan, browsers encrypt karte hain', 'Koi fark nahi'], correct: 1, explanation: 'Frontend JS in sab kuch visible is (Inspect → Sources). Weather API free in abuse ho sakta hai. Real projects mein: API calls backend from karo, key wahan rakho. Sirf learning/demo for frontend in rakh sakte ho.',
 q_en: 'Is it safe to hardcode an API key in frontend JS?',
 options_en: ['Yes, completely safe', 'No — it is visible in source code. OK for public APIs, use a backend proxy for sensitive ones', 'Yes, browsers encrypt it', 'It makes no difference'],
 explanation_en: 'Everything in frontend JS is visible (Inspect → Sources). A weather API key could be abused for free. In real projects: make API calls from the backend, store the key there. It is only acceptable in frontend for learning/demos.' },
      { q: 'navigator.geolocation.getCurrentPosition() what return karta hai?', options: ['City name', 'Latitude and Longitude coordinates — phir reverse geocoding from city milti hai', 'IP address', 'Country name'], correct: 1, explanation: 'Geolocation API lat/lon deta hai, city nahi. Coordinates milne ke baad weather API to lat/lon pass karo directly, or reverse geocoding API from city name nikalo.',
 q_en: 'What does navigator.geolocation.getCurrentPosition() return?',
 options_en: ['City name', 'Latitude and Longitude coordinates — reverse geocoding gives the city', 'IP address', 'Country name'],
 explanation_en: 'The Geolocation API gives lat/lon, not a city name. Once you have coordinates, pass them directly to the weather API, or use a reverse geocoding API to get the city name.' },
      { q: 'Unix timestamp to readable date in how convert karte hain?', options: ['timestamp.toString()', 'new Date(timestamp * 1000).toLocaleDateString()', 'Date.fromUnix(timestamp)', 'timestamp.toDate()'], correct: 1, explanation: 'Unix timestamp = seconds since 1970. JS Date milliseconds use karta is — isliye 1000 from multiply karo. new Date(1678886400 * 1000) → Date object, phir .toLocaleDateString() from readable format.',
 q_en: 'How do you convert a Unix timestamp to a readable date?',
 options_en: ['timestamp.toString()', 'new Date(timestamp * 1000).toLocaleDateString()', 'Date.fromUnix(timestamp)', 'timestamp.toDate()'],
 explanation_en: 'A Unix timestamp = seconds since 1970. JS Date uses milliseconds — so multiply by 1000. new Date(1678886400 * 1000) → Date object, then .toLocaleDateString() for a readable format.' },
    ],
  },

};

// ── WEEK 11 ──────────────────────────────────────────────────
const W11 = {
  'html-w11-s1': {
    title_en: "Objects and Classes — OOP in JavaScript",
    content_en: `## Objects and Classes — OOP in JavaScript!

### Objects
\`\`\`javascript
// Object literal
const student = {
  name: 'Rahul',
  age: 20,
  scores: [85, 92, 78],

  // Method
  getAverage() {
    return this.scores.reduce((a, b) => a + b, 0) / this.scores.length;
  },

  greet() {
    return \`Hi! I am \${this.name}, average score: \${this.getAverage().toFixed(1)}\`;
  },
};

console.log(student.greet());
console.log(student['name']);  // bracket notation
\`\`\`

### Classes
\`\`\`javascript
class Student {
  constructor(name, grade) {
    this.name   = name;
    this.grade  = grade;
    this.scores = [];
  }

  addScore(score) {
    this.scores.push(score);
    return this;  // method chaining
  }

  get average() {
    return this.scores.length === 0 ? 0
      : this.scores.reduce((a, b) => a + b, 0) / this.scores.length;
  }

  get rank() {
    if (this.average >= 90) return 'A+';
    if (this.average >= 75) return 'A';
    if (this.average >= 60) return 'B';
    return 'C';
  }

  toString() {
    return \`\${this.name} (\${this.grade}) — Avg: \${this.average.toFixed(1)} [\${this.rank}]\`;
  }
}

// Inheritance
class TeacherAssistant extends Student {
  constructor(name, subject) {
    super(name, 'TA');
    this.subject = subject;
  }

  teach() {
    return \`\${this.name} is teaching \${this.subject}\`;
  }
}

const rahul = new Student('Rahul', '10th');
rahul.addScore(85).addScore(92).addScore(78);
console.log(rahul.toString());   // method chaining!
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OOP Demo</title>
  <style>
    :root { --bg: #0f172a; --bg2: #1e293b; --text: #e2e8f0; --muted: #64748b; --primary: #6366f1; --accent: #a78bfa; --green: #10b981; --amber: #f59e0b; --border: rgba(255,255,255,0.08); }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: var(--bg); color: var(--text); padding: 24px; }
    h2 { color: var(--primary); margin: 20px 0 12px; font-size: 18px; }
    .card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .row { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0; align-items: center; }
    input, select { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 8px 12px; border-radius: 8px; font-size: 14px; outline: none; }
    input:focus, select:focus { border-color: var(--primary); }
    button { background: var(--primary); color: white; border: none; padding: 9px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; }
    button:hover { opacity: 0.85; transform: translateY(-1px); }
    .student-card { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin: 8px 0; animation: slideIn 0.3s ease; }
    @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } }
    .student-name { font-weight: 700; font-size: 15px; margin-bottom: 4px; }
    .student-meta { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
    .grade-badge { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 700; }
    .grade-A { background: rgba(16,185,129,0.15); color: #10b981; }
    .grade-B { background: rgba(99,102,241,0.15); color: var(--primary); }
    .grade-C { background: rgba(245,158,11,0.15); color: var(--amber); }
    .grade-F { background: rgba(239,68,68,0.15); color: #ef4444; }
    .xp-bar { height: 4px; background: var(--border); border-radius: 99px; margin-top: 8px; }
    .xp-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 99px; transition: width 0.5s ease; }
    .score-chips { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px; }
    .chip { padding: 2px 8px; border-radius: 99px; font-size: 11px; background: rgba(99,102,241,0.15); color: var(--accent); }
    .premium-badge { background: rgba(245,158,11,0.15); color: var(--amber); padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 700; }
  </style>
</head>
<body>
  <h1 style="font-size:24px; margin-bottom:4px;">🏛️ OOP Student Manager</h1>
  <p style="color:var(--muted); font-size:14px; margin-bottom:20px;">JavaScript Classes aur Objects live demo!</p>

  <div class="card">
    <h2>➕ Naya Student Add Karo</h2>
    <div class="row">
      <input type="text" id="sName" placeholder="Name" value="Rahul Sharma" style="flex:1; min-width:120px;">
      <input type="number" id="sAge" placeholder="Age" value="21" style="width:70px;">
      <select id="sCourse"><option>HTML</option><option>CSS</option><option>JavaScript</option><option>Python</option></select>
      <label style="color:var(--muted); font-size:13px; white-space:nowrap;">
        <input type="checkbox" id="sPremium" style="width:auto;"> Premium
      </label>
    </div>
    <div class="row">
      <input type="number" id="sScore" placeholder="Score (0-100)" min="0" max="100" value="85" style="width:140px;">
      <button onclick="addScore()">Add Score</button>
      <button onclick="createStudent()">Create Student →</button>
    </div>
    <p style="color:var(--muted); font-size:12px; margin-top:8px;">Multiple scores add karo phir "Create Student" click karo</p>
    <div id="tempScores" style="margin-top:8px; display:flex; gap:4px; flex-wrap:wrap;"></div>
  </div>

  <div class="card">
    <h2>👥 Students</h2>
    <div id="studentsList">
      <p style="color:var(--muted); font-size:14px;">Koi student nahi — upar se add karo!</p>
    </div>
  </div>

  <div class="card">
    <h2>📊 Class Stats</h2>
    <div id="classStats" style="font-size:14px; color:var(--muted);">Stats yahan dikhengi jab students add honge.</div>
  </div>

  <script>
    class Student {
      constructor(name, age, course, isPremium = false) {
        this.id        = Date.now();
        this.name      = name;
        this.age       = age;
        this.course    = course;
        this.isPremium = isPremium;
        this.scores    = [];
        this.xp        = isPremium ? 50 : 0;
      }

      addScore(score) {
        this.scores.push(score);
        const xpGain = score >= 70 ? 30 : 10;
        this.xp += this.isPremium ? xpGain * 2 : xpGain;
        return this;
      }

      getAverage() {
        if (!this.scores.length) return 0;
        return this.scores.reduce((a, b) => a + b, 0) / this.scores.length;
      }

      getGrade() {
        const avg = this.getAverage();
        if (avg >= 90) return { grade: 'A', emoji: '🌟', label: 'Excellent!' };
        if (avg >= 75) return { grade: 'B', emoji: '😊', label: 'Good job!' };
        if (avg >= 60) return { grade: 'C', emoji: '😐', label: 'Keep trying!' };
        if (avg > 0)   return { grade: 'F', emoji: '😢', label: 'Needs work' };
        return { grade: '?', emoji: '📝', label: 'No scores yet' };
      }

      get summary() { return \\\`\\\${this.name} | \\\${this.course} | Avg: \\\${this.getAverage().toFixed(1)}\\\`; }
    }

    let students = [];
    let tempScores = [];

    function addScore() {
      const val = parseInt(document.getElementById('sScore').value);
      if (isNaN(val) || val < 0 || val > 100) return;
      tempScores.push(val);
      document.getElementById('sScore').value = '';
      renderTempScores();
    }

    function renderTempScores() {
      document.getElementById('tempScores').innerHTML =
        tempScores.length
          ? tempScores.map(s => \\\`<span class="chip">\\\${s}</span>\\\`).join('')
          : '';
    }

    function createStudent() {
      const name   = document.getElementById('sName').value.trim();
      const age    = parseInt(document.getElementById('sAge').value);
      const course = document.getElementById('sCourse').value;
      const isPrem = document.getElementById('sPremium').checked;
      if (!name) return;

      const s = new Student(name, age, course, isPrem);
      tempScores.forEach(score => s.addScore(score));
      students.push(s);
      tempScores = [];
      renderTempScores();
      renderStudents();
      updateStats();
    }

    function renderStudents() {
      const container = document.getElementById('studentsList');
      if (!students.length) {
        container.innerHTML = '<p style="color:var(--muted); font-size:14px;">Koi student nahi — upar se add karo!</p>';
        return;
      }
      container.innerHTML = students.map(s => {
        const { grade, emoji, label } = s.getGrade();
        const avg = s.getAverage();
        const xpPct = Math.min(100, (s.xp / 500) * 100);
        return \\\`
          <div class="student-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <div class="student-name">\\\${s.name} \\\${s.isPremium ? '<span class="premium-badge">⭐ Premium</span>' : ''}</div>
                <div class="student-meta">Age: \\\${s.age} | Course: \\\${s.course} | XP: \\\${s.xp}</div>
              </div>
              <span class="grade-badge grade-\\\${grade}">\\\${emoji} \\\${grade} — \\\${label}</span>
            </div>
            \\\${s.scores.length ? \\\`
              <div class="score-chips">\\\${s.scores.map(sc => \\\`<span class="chip">\\\${sc}</span>\\\`).join('')}</div>
              <div style="font-size:12px; color:var(--muted); margin-top:4px;">Average: \\\${avg.toFixed(1)}</div>
            \\\` : '<div style="font-size:12px; color:var(--muted); margin-top:4px;">No scores yet</div>'}
            <div class="xp-bar"><div class="xp-fill" style="width:\\\${xpPct}%"></div></div>
          </div>
        \\\`;
      }).join('');
    }

    function updateStats() {
      if (!students.length) return;
      const avgs   = students.map(s => s.getAverage()).filter(a => a > 0);
      const classAvg = avgs.length ? (avgs.reduce((a,b) => a+b, 0) / avgs.length).toFixed(1) : 'N/A';
      const premium  = students.filter(s => s.isPremium).length;
      const topStudent = students.reduce((best, s) => s.getAverage() > best.getAverage() ? s : best, students[0]);

      document.getElementById('classStats').innerHTML = \\\`
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px;">
          <div style="background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:12px; text-align:center;">
            <div style="font-size:28px; font-weight:800; color:var(--primary);">\\\${students.length}</div>
            <div style="font-size:11px; color:var(--muted);">Total Students</div>
          </div>
          <div style="background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:12px; text-align:center;">
            <div style="font-size:28px; font-weight:800; color:var(--green);">\\\${classAvg}</div>
            <div style="font-size:11px; color:var(--muted);">Class Average</div>
          </div>
          <div style="background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:12px; text-align:center;">
            <div style="font-size:28px; font-weight:800; color:var(--amber);">\\\${premium}</div>
            <div style="font-size:11px; color:var(--muted);">Premium Students</div>
          </div>
          <div style="background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:12px; text-align:center;">
            <div style="font-size:16px; font-weight:800; color:var(--accent);">\\\${topStudent.name}</div>
            <div style="font-size:11px; color:var(--muted);">Top Student 🏆</div>
          </div>
        </div>
      \\\`;
    }
  </script>
</body>
</html>\`,
      codeExample_en: \`<!-- See above — English content is integrated -->`,
    task_en: {
      description: "OOP practice karo: (1) Ek BankAccount class banao with: balance, owner, transactions array. Methods: deposit(amount), withdraw(amount) — balance check karo, getStatement() — sari transactions show karo, (2) PremiumAccount extend karo BankAccount from — higher withdrawal limit, cashback feature, (3) Ek ProductManager class banao: products array, addProduct(), removeProduct(), searchProduct(query), getByCategory(), getTotalValue(), (4) Destructuring practice: ek nested API response object banao and usme from data destructure karo (name, address.city, scores[0]).',\n description_en: 'Practice OOP: (1) Build a BankAccount class with: balance, owner, transactions array. Methods: deposit(amount), withdraw(amount) (check balance), getStatement() (show all transactions), (2) Extend BankAccount with a PremiumAccount — higher withdrawal limit, cashback feature, (3) Build a ProductManager class: products array, addProduct(), removeProduct(), searchProduct(query), getByCategory(), getTotalValue(), (4) Destructuring practice: create a nested API response object and destructure data from it (name, address.city, scores[0]).",
      hint: "BankAccount: constructor in this.balance=0, this.transactions=[]. deposit: balance badhaao, transaction push karo. withdraw: if(amount > this.balance) throw error. Inheritance: class Premium extends BankAccount { constructor(owner) { super(owner); this.cashbackRate = 0.02; } }",
    },
    quiz_en: [
      { q: 'JavaScript class in this what refer karta hai?', options: ['Global window object', 'Class ka current instance — jis object pe method call hua hai', 'Parent class', 'HTML document'], correct: 1, explanation: 'this = current instance of the class. Jab new Student("Rahul") karte ho toh this = woh specific Rahul object. Arrow functions in this lexically bind hota is (enclosing scope ka this). Regular methods in this = calling object.',
 q_en: 'What does this refer to inside a JavaScript class?',
 options_en: ['The global window object', 'The current instance of the class — the object on which the method was called', 'The parent class', 'The HTML document'],
 explanation_en: 'this = the current instance of the class. When you do new Student("Rahul"), this = that specific Rahul object. In arrow functions, this is lexically bound (from the enclosing scope). In regular methods, this = the calling object.' },
      { q: 'extends and super what karte hain?', options: ['CSS properties hain', 'extends = ek class to doosri from inherit karo, super() = parent class constructor call karo', 'Loops hain', 'Array methods hain'], correct: 1, explanation: 'extends: class B extends A matlab B, A ki saari properties and methods inherit karta hai. super(): child constructor in parent constructor call karo — zaruri is jab child class in constructor define karo. super.method() from parent ke overridden methods call kar sakte ho.',
 q_en: 'What do extends and super do?',
 options_en: ['They are CSS properties', 'extends = inherit from another class, super() = call the parent constructor', 'They are loops', 'They are array methods'],
 explanation_en: 'extends: class B extends A means B inherits all of A\'s properties and methods. super(): call the parent constructor inside the child constructor — required when you define a constructor in a child class. super.method() calls overridden methods from the parent.' },
      { q: 'Destructuring ka main faida is?', options: ['Objects delete karta hai', 'Object or array from ek hi line in multiple variables extract kar sakte ho — clean and readable code', 'Sirf arrays for hai', 'Functions faster ho jaate hain'], correct: 1, explanation: 'Destructuring = clean code. const { name, age } = user ek hi line in dono variables extract karta hai. Bina destructuring: const name = user.name; const age = user.age; — zyada verbose. Default values, renaming, nested destructuring bhi possible hai.',
 q_en: 'What is the main benefit of destructuring?',
 options_en: ['It deletes objects', 'You can extract multiple variables from an object or array in one line — clean and readable code', 'It only works for arrays', 'Functions run faster'],
 explanation_en: 'Destructuring = clean code. const { name, age } = user extracts both variables in one line. Without destructuring: const name = user.name; const age = user.age; — much more verbose. Default values, renaming, and nested destructuring are also possible.' },
    ],
  },

  'html-w11-s2': {
    title_en: "JavaScript Modules and Code Organisation",
    content_en: `## JavaScript Modules — Organising Your Code!

### Why Modules?
Without modules, all your JS lives in one giant file. Modules let you split code into reusable files.

### Export and Import
\`\`\`javascript
// ── utils.js ──────────────────────────────────
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(date);
}

export const API_BASE = 'https://api.github.com';

export default class DataCache {
  // ...
}

// ── api.js ────────────────────────────────────
import { API_BASE, formatDate } from './utils.js';
import DataCache from './utils.js';

export async function fetchUser(username) {
  const res = await fetch(\`\${API_BASE}/users/\${username}\`);
  return res.json();
}

// ── main.js ───────────────────────────────────
import { fetchUser } from './api.js';
import { formatDate } from './utils.js';
\`\`\`

### Using Modules in HTML
\`\`\`html
<!-- Must use type="module" -->
<script type="module" src="main.js"></script>
\`\`\`

### Dynamic Import
\`\`\`javascript
// Load a module only when needed (lazy loading)
async function loadChart() {
  const { ChartModule } = await import('./chart.js');
  const chart = new ChartModule('#canvas');
  chart.render(data);
}

document.querySelector('#show-chart').addEventListener('click', loadChart);
\`\`\`

### File Structure
\`\`\`
project/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── main.js         ← entry point
    ├── api.js          ← all API calls
    ├── ui.js           ← DOM manipulation
    ├── utils.js        ← helper functions
    └── components/
        ├── navbar.js
        └── card.js
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Modules Demo</title>
  <style>
    :root { --bg: #0f172a; --bg2: #1e293b; --text: #e2e8f0; --muted: #64748b; --primary: #6366f1; --accent: #a78bfa; --green: #10b981; --red: #ef4444; --amber: #f59e0b; --border: rgba(255,255,255,0.08); }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: var(--bg); color: var(--text); padding: 24px; }
    h2 { color: var(--primary); margin: 24px 0 12px; font-size: 18px; }
    .card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    input { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 8px 12px; border-radius: 8px; font-size: 14px; outline: none; }
    input:focus { border-color: var(--primary); }
    button { background: var(--primary); color: white; border: none; padding: 9px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; margin: 4px; transition: all 0.2s; }
    button:hover { opacity: 0.85; }
    button.danger { background: var(--red); }
    .output { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 14px; font-family: monospace; font-size: 13px; margin-top: 12px; white-space: pre-wrap; max-height: 200px; overflow-y: auto; }
    .event-log { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 10px; max-height: 150px; overflow-y: auto; font-family: monospace; font-size: 12px; }
    .log-line { padding: 3px 0; border-bottom: 1px solid var(--border); color: var(--muted); }
    .log-line:last-child { border: none; color: var(--text); }
    .err { color: var(--red); } .ok { color: var(--green); } .info { color: var(--accent); }
  </style>
</head>
<body>
  <h1 style="font-size:24px; margin-bottom:4px;">📦 Modules & Patterns</h1>

  <!-- Module Pattern Demo -->
  <div class="card">
    <h2>📋 TodoModule (Module Pattern)</h2>
    <div style="display:flex; gap:8px; margin-bottom:8px;">
      <input type="text" id="todoTxt" placeholder="Task likho..." style="flex:1;" onkeydown="if(event.key==='Enter') moduleAdd()">
      <button onclick="moduleAdd()">Add</button>
      <button onclick="moduleShowAll()">Show All</button>
    </div>
    <p style="color:var(--muted); font-size:12px; margin-bottom:8px;">Todos bahar se directly access nahi kar sakte — private hai!</p>
    <div class="output" id="moduleOutput">// Todos yahan</div>
  </div>

  <!-- EventEmitter Demo -->
  <div class="card">
    <h2>📡 EventEmitter (Observer Pattern)</h2>
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
      <button onclick="emitLogin()">Emit: login</button>
      <button onclick="emitScore()">Emit: score_added</button>
      <button onclick="emitLogout()" class="danger">Emit: logout</button>
    </div>
    <p style="color:var(--muted); font-size:12px; margin-bottom:8px;">Events emit karo — saare listeners run honge!</p>
    <div class="event-log" id="eventLog"><div class="log-line info">// Events yahan dikhenge...</div></div>
  </div>

  <!-- Error Handling Demo -->
  <div class="card">
    <h2>⚠️ Error Handling</h2>
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
      <input type="number" id="errScore" placeholder="Score (0-100)" value="75" style="width:140px;">
      <button onclick="testValidation()">Validate Score</button>
      <button onclick="testFetch()">Test Fetch Error</button>
    </div>
    <div class="output" id="errorOutput">// try/catch result yahan</div>
  </div>

  <script>
    // ── TodoModule ────────────────────────────────────────
    const TodoModule = (() => {
      let todos = [];
      let nextId = 1;
      function validate(text) { return text && text.trim().length >= 2; }
      return {
        add(text) {
          if (!validate(text)) throw new Error('Text must be at least 2 characters');
          const t = { id: nextId++, text: text.trim(), done: false };
          todos.push(t);
          return t;
        },
        toggle(id) { const t = todos.find(t => t.id === id); if (t) t.done = !t.done; },
        getAll() { return [...todos]; },
        getCount() { return { total: todos.length, done: todos.filter(t => t.done).length }; },
      };
    })();

    function moduleAdd() {
      const inp = document.getElementById('todoTxt');
      try {
        const todo = TodoModule.add(inp.value);
        inp.value = '';
        moduleShowAll();
      } catch (e) {
        document.getElementById('moduleOutput').innerHTML = '<span class="err">Error: ' + e.message + '</span>';
      }
    }

    function moduleShowAll() {
      const todos = TodoModule.getAll();
      const { total, done } = TodoModule.getCount();
      document.getElementById('moduleOutput').textContent =
        'TodoModule.getAll():\\n' +
        JSON.stringify(todos, null, 2) +
        '\\n\\nCount: ' + JSON.stringify({ total, done });
    }

    // ── EventEmitter ───────────────────────────────────────
    class EventEmitter {
      constructor() { this.events = {}; }
      on(event, fn) { if (!this.events[event]) this.events[event] = []; this.events[event].push(fn); return this; }
      emit(event, data) { (this.events[event] || []).forEach(fn => fn(data)); }
    }

    const app = new EventEmitter();
    const log = document.getElementById('eventLog');
    function addLog(msg, cls = 'info') {
      const d = document.createElement('div');
      d.className = 'log-line ' + cls;
      d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
      log.prepend(d);
    }

    app.on('login',       u => addLog('User logged in: ' + u.name, 'ok'));
    app.on('login',       u => addLog('Analytics: login event fired for ' + u.email, 'info'));
    app.on('score_added', d => addLog('Score added: ' + d.score + ' pts (+' + d.xp + ' XP)', 'ok'));
    app.on('logout',      u => addLog('User logged out: ' + u.name, 'err'));

    function emitLogin()  { app.emit('login',       { name: 'Rahul',  email: 'r@e.com' }); }
    function emitScore()  { app.emit('score_added', { score: 85, xp: 30 }); }
    function emitLogout() { app.emit('logout',      { name: 'Rahul' }); }

    // ── Error Handling ─────────────────────────────────────
    class ValidationError extends Error {
      constructor(field, msg) { super(msg); this.name = 'ValidationError'; this.field = field; }
    }

    function testValidation() {
      const score = parseInt(document.getElementById('errScore').value);
      try {
        if (isNaN(score))         throw new ValidationError('score', 'Score must be a number');
        if (score < 0 || score > 100) throw new ValidationError('score', 'Score must be between 0 and 100');
        document.getElementById('errorOutput').innerHTML =
          '<span class="ok">✅ Valid score: ' + score + '\\n\\ntry { validateScore(' + score + '); }\\n// No error!</span>';
      } catch (e) {
        document.getElementById('errorOutput').innerHTML =
          '<span class="err">❌ ' + e.name + ' on field \\'' + e.field + '\\':\\n' + e.message + '\\n\\ntry { validateScore(' + score + '); }\\ncatch (e) {\\n  // e.name = "' + e.name + '"\\n  // e.field = "' + e.field + '"\\n  // e.message = "' + e.message + '"\\n}</span>';
      }
    }

    async function testFetch() {
      const out = document.getElementById('errorOutput');
      out.innerHTML = '<span class="info">Fetching bad URL...</span>';
      try {
        const res = await fetch('https://httpstat.us/404');
        if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
        out.textContent = 'Success (should not reach here)';
      } catch (e) {
        out.innerHTML =
          '<span class="err">❌ Error caught!\\n\\ntry {\\n  const res = await fetch(badUrl);\\n  if (!res.ok) throw new Error("HTTP " + res.status);\\n} catch (e) {\\n  // e.message = "' + e.message + '"\\n  console.error("Fetch failed:", e.message);\\n}</span>';
      }
    }
  </script>
</body>
</html>\`,
      codeExample_en: \`<!-- See above — English content is integrated -->`,
    task_en: {
      description: "Modules and patterns practice karo: (1) Ek CartModule banao (IIFE pattern) with: items array (private), addItem(), removeItem(), getTotal(), getItemCount(), clearCart() methods, (2) Ek EventEmitter use karke shopping cart events emit karo: item_added, item_removed, cart_cleared — multiple listeners attach karo, (3) Ek form validation system banao with custom errors: RequiredError, MinLengthError, EmailError — each has field property, (4) Ek singleton AppState class banao: current user, cart items, theme — ek hi instance poori app mein.',\n description_en: 'Practice modules and patterns: (1) Build a CartModule (IIFE pattern) with: items array (private), addItem(), removeItem(), getTotal(), getItemCount(), clearCart() methods, (2) Use an EventEmitter to emit shopping cart events: item_added, item_removed, cart_cleared — attach multiple listeners, (3) Build a form validation system with custom errors: RequiredError, MinLengthError, EmailError — each with a field property, (4) Build a singleton AppState class: current user, cart items, theme — only one instance across the whole app.",
      hint: "CartModule IIFE: const CartModule = (() => { let items = []; return { addItem(p) { items.push(p); }, getTotal() { return items.reduce((s,i) => s+i.price, 0); } }; })(). Custom error: class EmailError extends Error { constructor(field) { super(\"Invalid email\"); this.field = field; } }",
    },
    quiz_en: [
      { q: 'export default and named export in what fark hai?', options: ['Koi fark nahi', 'export default = ek file in sirf ek, import karte waqt koi bhi naam de sakte ho. Named export = multiple ho sakte hain, import in exact naam chahiye (curly braces)', 'default export faster hai', 'Named exports deprecated hain'], correct: 1, explanation: 'export default: import Storage from "./utils.js" — koi bhi naam de sakte ho. Named export: import { formatDate, API_URL } from "./utils.js" — exact naam chahiye (rename bhi kar sakte ho: import { formatDate as fd } from "./utils.js"). Ek file in ek default and multiple named exports ho sakte hain.',
 q_en: 'What is the difference between export default and named exports?',
 options_en: ['No difference', 'export default = only one per file, any name when importing. Named export = multiple allowed, exact name required with curly braces', 'Default exports are faster', 'Named exports are deprecated'],
 explanation_en: 'export default: import Storage from "./utils.js" — any name is fine. Named export: import { formatDate, API_URL } from "./utils.js" — exact name required (you can also rename: import { formatDate as fd } from "./utils.js"). A file can have one default and multiple named exports.' },
      { q: 'try/catch/finally in finally when run hota hai?', options: ['Sirf success pe', 'Sirf error pe', 'Hamesha — error aaye or nahi, even agar catch in return ho', 'Kabhi nahi'], correct: 2, explanation: 'finally hamesha run hota is — success ho or error. Even agar try or catch in return statement ho. Use case: cleanup code jo hamesha run hona chahiye — jaise loading spinner hide karna, database connection close karna, file handles release karna.',
 q_en: 'When does the finally block run in try/catch/finally?',
 options_en: ['Only on success', 'Only on error', 'Always — whether or not there is an error, even if there is a return in catch', 'Never'],
 explanation_en: 'finally always runs — success or error. Even if there is a return statement in try or catch. Use case: cleanup code that must always run — like hiding a loading spinner, closing a database connection, releasing file handles.' },
      { q: 'IIFE (Immediately Invoked Function Expression) why use karte hain?', options: ['Faster hai', 'Private scope create karne for — variables bahar from accessible not hote, global namespace pollute not hota', 'Sirf old JavaScript mein', 'Async functions ke liye'], correct: 1, explanation: 'IIFE: (() => { /* code */ })() — function immediately run hoti is and ek private scope create karti hai. Variables bahar leak not hote. Module pattern in private state and public API expose karne for use hota hai. Modern JS in ES Modules yahi kaam karte hain.',
 q_en: 'Why do we use an IIFE (Immediately Invoked Function Expression)?',
 options_en: ['It is faster', 'To create a private scope — variables are not accessible from outside, global namespace is not polluted', 'Only in old JavaScript', 'For async functions'],
 explanation_en: 'IIFE: (() => { /* code */ })() — the function runs immediately and creates a private scope. Variables do not leak outside. Used in the module pattern to have private state and expose a public API. In modern JS, ES Modules serve the same purpose.' },
    ],
  },

  'html-w11-s3': {
    title_en: "JavaScript Performance and Best Practices",
    content_en: `## JavaScript Performance and Best Practices!

### Avoid Layout Thrashing
\`\`\`javascript
// ❌ Slow — reads and writes alternate (triggers multiple reflows)
elements.forEach(el => {
  const height = el.offsetHeight;  // READ
  el.style.height = height + 10 + 'px';  // WRITE
});

// ✅ Fast — batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight);  // all READs
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px';  // all WRITEs
});
\`\`\`

### Debounce — Throttle Rapid Events
\`\`\`javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Search input — don't fetch on every keystroke
const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', debounce(async (e) => {
  const results = await searchAPI(e.target.value);
  displayResults(results);
}, 300));
\`\`\`

### Event Delegation — One Listener for Many Elements
\`\`\`javascript
// ❌ Attaches 100 listeners
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ One listener on the parent
document.querySelector('.list').addEventListener('click', (e) => {
  if (e.target.classList.contains('item')) {
    handleClick(e.target);
  }
});
\`\`\`

### Lazy Loading Images
\`\`\`javascript
// Native lazy loading (modern browsers)
// Add loading="lazy" to img tags in HTML

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
\`\`\`

### Clean Code Principles
\`\`\`javascript
// ✅ Meaningful names
const daysSinceLastLogin = 7;  // not: const d = 7;

// ✅ Single responsibility
function validateEmail(email) { /* only validation */ }
function saveUser(user) { /* only saving */ }

// ✅ Early return (less nesting)
function processUser(user) {
  if (!user) return null;
  if (!user.email) return null;
  // happy path
  return user.data;
}
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Performance Demo</title>
  <style>
    :root { --bg: #0f172a; --bg2: #1e293b; --text: #e2e8f0; --muted: #64748b; --primary: #6366f1; --green: #10b981; --red: #ef4444; --amber: #f59e0b; --border: rgba(255,255,255,0.08); }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: var(--bg); color: var(--text); padding: 24px; }
    h2 { color: var(--primary); margin: 20px 0 12px; font-size: 18px; }
    .card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    input { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 8px 12px; border-radius: 8px; font-size: 14px; outline: none; width: 100%; }
    input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
    button { background: var(--primary); color: white; border: none; padding: 9px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; margin: 4px 4px 4px 0; transition: all 0.2s; }
    button:hover { opacity: 0.85; }
    .result-card { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; margin: 6px 0; display: flex; align-items: center; gap: 10px; animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } }
    .timer { font-size: 11px; color: var(--amber); margin-left: auto; white-space: nowrap; }
    .output { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-family: monospace; font-size: 13px; color: var(--muted); margin-top: 8px; min-height: 40px; }
    .perf-bar { height: 6px; background: var(--border); border-radius: 99px; margin: 8px 0; }
    .perf-fill-slow { height: 100%; background: var(--red); border-radius: 99px; }
    .perf-fill-fast { height: 100%; background: var(--green); border-radius: 99px; }
  </style>
</head>
<body>
  <h1 style="font-size:24px; margin-bottom:4px;">⚡ JS Performance Patterns</h1>

  <!-- Debounce Demo -->
  <div class="card">
    <h2>🔍 Debounce — Search Input</h2>
    <p style="color:var(--muted); font-size:13px; margin-bottom:12px;">Type karo — 400ms baad API call hogi (immediate nahi)</p>
    <input type="text" id="searchInput" placeholder="Type to search... (watch the counter)" oninput="handleSearch(this.value)">
    <div style="display:flex; gap:16px; margin-top:12px; font-size:13px;">
      <span>Keystrokes: <b id="keystrokeCount" style="color:var(--amber);">0</b></span>
      <span>API calls: <b id="apiCallCount" style="color:var(--green);">0</b></span>
      <span style="color:var(--muted); font-size:12px;">(Calls << Keystrokes = Debounce working!)</span>
    </div>
    <div class="output" id="searchOutput">// Type something...</div>
  </div>

  <!-- DOM Performance -->
  <div class="card">
    <h2>🚀 DOM Batch Update</h2>
    <p style="color:var(--muted); font-size:13px; margin-bottom:12px;">100 items add karo — slow vs fast method compare karo</p>
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
      <button onclick="slowDOM()">❌ Slow (+=)</button>
      <button onclick="fastDOM()">✅ Fast (batch)</button>
    </div>
    <div style="font-size:13px; margin-bottom:8px;">
      Slow: <span id="slowTime" style="color:var(--red);">-</span> ms
      <div class="perf-bar"><div class="perf-fill-slow" id="slowBar" style="width:0%"></div></div>
      Fast: <span id="fastTime" style="color:var(--green);">-</span> ms
      <div class="perf-bar"><div class="perf-fill-fast" id="fastBar" style="width:0%"></div></div>
    </div>
    <div id="domList" style="max-height:120px; overflow-y:auto; font-size:12px; color:var(--muted);"></div>
  </div>

  <!-- Event Delegation -->
  <div class="card">
    <h2>📡 Event Delegation</h2>
    <p style="color:var(--muted); font-size:13px; margin-bottom:8px;">Sirf 1 listener hai list pe — naye items pe bhi kaam karta hai!</p>
    <div style="display:flex; gap:8px; margin-bottom:8px;">
      <input type="text" id="delegItem" placeholder="Item naam" style="flex:1;" onkeydown="if(event.key==='Enter') addDelegItem()">
      <button onclick="addDelegItem()">Add</button>
    </div>
    <ul id="delegList" style="list-style:none;"></ul>
    <div class="output" id="delegOutput">// Click any delete button...</div>
  </div>

  <script>
    // ── Debounce ──────────────────────────────────────────
    function debounce(fn, delay) {
      let timer;
      return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
    }

    let keyCount = 0, apiCount = 0;
    const simulateAPI = debounce((query) => {
      apiCount++;
      document.getElementById('apiCallCount').textContent = apiCount;
      document.getElementById('searchOutput').textContent =
        'API called with: "' + query + '"\\n' +
        'Simulating fetch /api/search?q=' + encodeURIComponent(query) + '\\n' +
        '→ ' + Math.floor(Math.random() * 5 + 1) + ' results found';
    }, 400);

    function handleSearch(val) {
      keyCount++;
      document.getElementById('keystrokeCount').textContent = keyCount;
      if (val.trim()) simulateAPI(val);
    }

    // ── DOM Performance ────────────────────────────────────
    const items = Array.from({ length: 100 }, (_, i) => 'Item #' + (i + 1));

    function slowDOM() {
      const list = document.getElementById('domList');
      list.innerHTML = '';
      const start = performance.now();
      items.forEach(item => { list.innerHTML += '<div style="padding:2px 0;">' + item + '</div>'; });
      const time = (performance.now() - start).toFixed(2);
      document.getElementById('slowTime').textContent = time;
      document.getElementById('slowBar').style.width = Math.min(100, time * 5) + '%';
    }

    function fastDOM() {
      const list = document.getElementById('domList');
      const start = performance.now();
      list.innerHTML = items.map(i => '<div style="padding:2px 0;">' + i + '</div>').join('');
      const time = (performance.now() - start).toFixed(2);
      document.getElementById('fastTime').textContent = time;
      document.getElementById('fastBar').style.width = Math.min(100, time * 5) + '%';
    }

    // ── Event Delegation ───────────────────────────────────
    let delegId = 1;
    const delegList = document.getElementById('delegList');

    // SIRF EK LISTENER — parent pe!
    delegList.addEventListener('click', (e) => {
      if (e.target.matches('.del-item')) {
        const id = e.target.dataset.id;
        e.target.closest('li').remove();
        document.getElementById('delegOutput').textContent =
          '// Event delegation!\\n' +
          '// Click detected on .del-item\\n' +
          '// Item #' + id + ' deleted\\n' +
          '// Only 1 listener on <ul> handles ALL buttons!';
      }
    });

    function addDelegItem() {
      const inp = document.getElementById('delegItem');
      const text = inp.value.trim() || 'Item';
      const li = document.createElement('li');
      li.style.cssText = 'display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid var(--border); font-size:14px;';
      li.innerHTML = '<span style="flex:1;">' + text + ' (#' + delegId + ')</span><button class="del-item" data-id="' + delegId + '" style="background:var(--red); padding:4px 8px; font-size:11px;">✕ Delete</button>';
      delegList.prepend(li);
      delegId++;
      inp.value = '';
    }

    // Add default items
    ['HTML Seekhna', 'CSS Master Karo', 'JavaScript Shuru Karo'].forEach(t => {
      document.getElementById('delegItem').value = t;
      addDelegItem();
    });
  </script>
</body>
</html>\`,
      codeExample_en: \`<!-- See above — English content is integrated -->`,
    task_en: {
      description: "Performance optimization practice karo: (1) Ek \"Infinite Scroll\" banao — 20 items initially dikhao, scroll pe 20 and load karo (IntersectionObserver use karo), (2) Search feature in debounce add karo (300ms delay), (3) Event delegation use karke ek expandable FAQ section banao — sirf parent pe ek listener, (4) Memoize ek fibonacci function — pehle call pe slow, baad in instant. Before/after timing dikhao.',\n description_en: 'Practise performance optimisation: (1) Build \"Infinite Scroll\" — show 20 items initially, load 20 more on scroll (use IntersectionObserver), (2) Add debounce to a search feature (300ms delay), (3) Use event delegation to build an expandable FAQ section — only one listener on the parent, (4) Memoize a fibonacci function — slow on the first call, instant afterwards. Show before/after timing.",
      hint: "IntersectionObserver: const obs = new IntersectionObserver(entries => { if(entries[0].isIntersecting) loadMore(); }); obs.observe(sentinel). Debounce: clearTimeout re-schedules timer. Memoize: Map ke saath cache — Map faster is object from large datasets pe.",
    },
    quiz_en: [
      { q: 'Debounce and Throttle in what fark hai?', options: ['Same hain', 'Debounce = last call ke baad delay karo (search input). Throttle = har N ms in max ek call (scroll events).', 'Throttle = search ke liye', 'Debounce faster hai'], correct: 1, explanation: 'Debounce: user type karna band kare, phir N ms baad call karo — agar phir type kiya toh timer reset. Use: search input, window resize handler. Throttle: har N ms in maximum ek call hogi — continuous execution allowed but rate limited. Use: scroll events, mousemove, game loop.',
 q_en: 'What is the difference between debounce and throttle?',
 options_en: ['They are the same', 'Debounce = delay after the last call (search input). Throttle = max one call every N ms (scroll events).', 'Throttle is for search', 'Debounce is faster'],
 explanation_en: 'Debounce: wait until the user stops typing, then call after N ms — if they type again, reset the timer. Use: search input, window resize handler. Throttle: maximum one call per N ms — continuous execution allowed but rate-limited. Use: scroll events, mousemove, game loops.' },
      { q: 'Event delegation why better is individual listeners se?', options: ['Nahi is better', 'Memory efficient — 100 items pe 100 listeners lagane ki jagah 1 parent listener. Dynamically added elements pe bhi kaam karta hai!', 'Faster DOM manipulation ke liye', 'CSS ke saath better kaam karta hai'], correct: 1, explanation: 'Event delegation: events bubble up karte are (child → parent). Parent pe ek listener lagao, e.target.matches() from specific child check karo. Benefits: (1) Less memory, (2) Dynamic elements pe bhi kaam karta is (bina re-attaching listeners), (3) Simpler code — ek jagah handle karo.',
 q_en: 'Why is event delegation better than individual listeners?',
 options_en: ['It is not better', 'Memory efficient — one parent listener instead of 100 listeners for 100 items. Also works on dynamically added elements!', 'For faster DOM manipulation', 'It works better with CSS'],
 explanation_en: 'Event delegation: events bubble up (child → parent). Attach one listener on the parent and check for specific children with e.target.matches(). Benefits: (1) Less memory, (2) Works on dynamically added elements (no re-attaching listeners), (3) Simpler code — handle everything in one place.' },
      { q: 'DOM in innerHTML += why slow hai?', options: ['No reason', 'Har += pe browser poori DOM serialize karta is string mein, parse karta hai, and re-render karta is — N items pe N baar ye kaam hota hai!', 'innerHTML deprecated hai', 'String concatenation slow hai'], correct: 1, explanation: 'innerHTML +=: browser existing HTML to string in convert karta is + naya HTML add karta is + poora DOM re-parse karta is + re-render karta hai. 100 items for yeh 100 baar hoga — O(n²) complexity! Better: sab HTML pehle string in banao (O(n)), phir ek baar innerHTML set karo.',
 q_en: 'Why is innerHTML += slow in the DOM?',
 options_en: ['No reason', 'Each += makes the browser serialise the entire DOM to a string, parse the new HTML, and re-render — this happens N times for N items, O(n²)!', 'innerHTML is deprecated', 'String concatenation is slow'],
 explanation_en: 'innerHTML +=: the browser converts existing HTML to a string + appends new HTML + re-parses the whole DOM + re-renders. For 100 items, this happens 100 times — O(n²) complexity! Better: build all HTML as a string first (O(n)), then set innerHTML once.' },
    ],
  },

  'html-w11-s4': {
    title_en: "Week 11 Project — Notes App with Cloud Sync",
    content_en: `## Week 11 Project — Notes App with Cloud Sync!

Build a fully featured notes app — local storage + optional API sync!

### Features:
\`\`\`
✅ Create, Read, Update, Delete notes
✅ Rich text (bold, italic, lists — use contenteditable)
✅ Tags/categories per note
✅ Search notes by title or content
✅ Star/favourite notes
✅ Sort: newest, oldest, alphabetical
✅ Auto-save (debounced)
✅ Export notes as JSON
✅ Dark/light mode (CSS variables)
✅ Keyboard shortcuts (Ctrl+N = new, Ctrl+S = save, Ctrl+F = search)
\`\`\`

### Data Structure:
\`\`\`javascript
const note = {
  id:        Date.now(),
  title:     'My Note',
  content:   'Note content here...',
  tags:      ['work', 'important'],
  starred:   false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
\`\`\`

### Auto-save:
\`\`\`javascript
const autoSave = debounce(() => {
  const content = editor.innerHTML;
  updateNote(currentNoteId, { content, updatedAt: new Date().toISOString() });
  showToast('Saved ✓');
}, 1000);

editor.addEventListener('input', autoSave);
\`\`\`

### Keyboard Shortcuts:
\`\`\`javascript
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'n': e.preventDefault(); createNewNote(); break;
      case 's': e.preventDefault(); saveCurrentNote(); break;
      case 'f': e.preventDefault(); focusSearch(); break;
    }
  }
});
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StudyEarn Notes</title>
  <style>
    :root { --bg: #0f172a; --bg2: #1e293b; --text: #e2e8f0; --muted: #64748b; --primary: #6366f1; --accent: #a78bfa; --green: #10b981; --red: #ef4444; --amber: #f59e0b; --border: rgba(255,255,255,0.08); --t: all 0.25s ease; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
    .app { max-width: 900px; margin: 0 auto; padding: 24px 16px; }
    h1 { font-size: 24px; font-weight: 800; }
    h1 span { color: var(--accent); }
    .topbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .search { flex: 1; min-width: 200px; background: var(--bg2); border: 1px solid var(--border); color: var(--text); padding: 10px 16px; border-radius: 10px; font-size: 14px; outline: none; }
    .search:focus { border-color: var(--primary); }
    button { background: var(--primary); color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: var(--t); }
    button:hover { opacity: 0.85; transform: translateY(-1px); }
    button.ghost { background: transparent; border: 1px solid var(--border); color: var(--muted); }
    button.ghost:hover { color: var(--text); border-color: var(--primary); background: transparent; }
    button.danger { background: var(--red); }
    /* Form */
    .note-form { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 24px; display: none; }
    .note-form.open { display: block; animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } }
    .form-row { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
    .form-input { flex: 1; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px 14px; border-radius: 8px; font-size: 14px; outline: none; min-width: 0; }
    .form-input:focus { border-color: var(--primary); }
    .form-textarea { width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px 14px; border-radius: 8px; font-size: 14px; outline: none; resize: vertical; min-height: 100px; font-family: inherit; margin-bottom: 12px; }
    .form-textarea:focus { border-color: var(--primary); }
    .color-row { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
    .color-swatch { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: var(--t); }
    .color-swatch.sel, .color-swatch:hover { transform: scale(1.2); border-color: white; }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; }
    /* Grid */
    .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
    .note-card { border-radius: 12px; padding: 16px; cursor: pointer; transition: var(--t); position: relative; border: 1px solid transparent; }
    .note-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.15); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
    .note-card .title { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
    .note-card .excerpt { font-size: 13px; opacity: 0.75; line-height: 1.5; margin-bottom: 10px; }
    .note-card .meta { display: flex; align-items: center; justify-content: space-between; font-size: 11px; opacity: 0.6; }
    .pin-btn, .del-card-btn { background: none; border: none; padding: 4px; border-radius: 4px; cursor: pointer; font-size: 14px; opacity: 0; transform: none; transition: opacity 0.2s; color: inherit; }
    .note-card:hover .pin-btn, .note-card:hover .del-card-btn { opacity: 1; }
    .tag { display: inline-block; background: rgba(255,255,255,0.12); padding: 1px 6px; border-radius: 99px; font-size: 10px; margin: 2px; }
    .pinned-badge { position: absolute; top: 10px; right: 10px; font-size: 12px; }
    .empty { text-align: center; padding: 60px 20px; color: var(--muted); font-size: 15px; grid-column: 1/-1; }
    .stats { font-size: 13px; color: var(--muted); margin-bottom: 12px; }
    .stats b { color: var(--primary); }
  </style>
</head>
<body>
  <div class="app">
    <div class="topbar">
      <h1>📝 Study<span>Notes</span></h1>
      <input class="search" id="searchInput" placeholder="🔍 Notes search karo..." oninput="handleSearch(this.value)">
      <button onclick="toggleForm()">+ New Note</button>
    </div>
    <p class="stats" id="statsBar">Loading...</p>

    <!-- Note Form -->
    <div class="note-form" id="noteForm">
      <div class="form-row">
        <input class="form-input" id="noteTitle" placeholder="Note title *" style="font-weight:600;">
        <input class="form-input" id="noteTags" placeholder="Tags (comma-separated)" style="max-width:220px;">
      </div>
      <textarea class="form-textarea" id="noteContent" placeholder="Note content likhho..."></textarea>
      <div class="color-row">
        <span style="font-size:12px; color:var(--muted);">Color:</span>
        <div class="color-swatch sel" data-color="#1e293b" style="background:#1e293b;" onclick="selectColor(this)"></div>
        <div class="color-swatch" data-color="#1e1b4b" style="background:#1e1b4b;" onclick="selectColor(this)"></div>
        <div class="color-swatch" data-color="#0f2d2b" style="background:#0f2d2b;" onclick="selectColor(this)"></div>
        <div class="color-swatch" data-color="#2d1515" style="background:#2d1515;" onclick="selectColor(this)"></div>
        <div class="color-swatch" data-color="#1f1a0e" style="background:#1f1a0e;" onclick="selectColor(this)"></div>
        <div class="color-swatch" data-color="#1a0e2d" style="background:#1a0e2d;" onclick="selectColor(this)"></div>
      </div>
      <div class="form-actions">
        <button class="ghost" onclick="toggleForm()">Cancel</button>
        <button onclick="saveNote()">Save Note ✓</button>
      </div>
    </div>

    <div class="notes-grid" id="notesGrid"></div>
  </div>

  <script>
    // ── Utilities ────────────────────────────────────────
    function debounce(fn, delay) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), delay); }; }

    class ValidationError extends Error {
      constructor(field, msg) { super(msg); this.name = 'ValidationError'; this.field = field; }
    }

    // ── Note Factory ──────────────────────────────────────
    const Note = {
      create({ title, content = '', tags = '', color = '#1e293b' }) {
        if (!title?.trim()) throw new ValidationError('title', 'Title is required!');
        return {
          id: Date.now().toString(),
          title: title.trim(),
          content: content.trim(),
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          color,
          pinned: false,
          createdAt: new Date().toISOString(),
        };
      },
      excerpt(note, max = 90) {
        return note.content.length > max ? note.content.slice(0, max) + '...' : note.content || '(No content)';
      },
    };

    // ── Store (Module Pattern) ────────────────────────────
    const Store = (() => {
      let notes = [], listeners = [];
      return {
        load() { try { notes = JSON.parse(localStorage.getItem('sn-notes') || '[]'); } catch { notes = []; } },
        save() { localStorage.setItem('sn-notes', JSON.stringify(notes)); },
        getAll() { return [...notes]; },
        search(q) { const s = q.toLowerCase(); return notes.filter(n => n.title.toLowerCase().includes(s) || n.content.toLowerCase().includes(s)); },
        add(data)   { const n = Note.create(data); notes.unshift(n); this._emit(); return n; },
        pin(id)     { notes = notes.map(n => n.id === id ? {...n, pinned: !n.pinned} : n); this._emit(); },
        delete(id)  { notes = notes.filter(n => n.id !== id); this._emit(); },
        subscribe(fn) { listeners.push(fn); },
        _emit() { this.save(); listeners.forEach(fn => fn(notes)); },
      };
    })();

    // ── UI ─────────────────────────────────────────────────
    let selectedColor = '#1e293b';
    let searchQuery   = '';

    function selectColor(el) {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('sel'));
      el.classList.add('sel');
      selectedColor = el.dataset.color;
    }

    function toggleForm() {
      const form = document.getElementById('noteForm');
      form.classList.toggle('open');
      if (form.classList.contains('open')) document.getElementById('noteTitle').focus();
      else { document.getElementById('noteTitle').value = ''; document.getElementById('noteContent').value = ''; document.getElementById('noteTags').value = ''; }
    }

    function saveNote() {
      try {
        Store.add({
          title:   document.getElementById('noteTitle').value,
          content: document.getElementById('noteContent').value,
          tags:    document.getElementById('noteTags').value,
          color:   selectedColor,
        });
        toggleForm();
      } catch (e) {
        if (e instanceof ValidationError) {
          alert('⚠️ ' + e.message);
          document.getElementById('note' + (e.field.charAt(0).toUpperCase() + e.field.slice(1))).focus();
        }
      }
    }

    function renderNotes(notes) {
      const grid = document.getElementById('notesGrid');
      const pinned   = notes.filter(n => n.pinned);
      const unpinned = notes.filter(n => !n.pinned);
      const sorted   = [...pinned, ...unpinned];

      if (!sorted.length) {
        grid.innerHTML = '<div class="empty">📝 Koi note nahi<br><span style="font-size:13px; display:block; margin-top:8px;">Upar "+ New Note" click karo</span></div>';
        return;
      }

      grid.innerHTML = sorted.map(n => {
        const date = new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        const tagsHtml = n.tags.map(t => '<span class="tag">' + t + '</span>').join('');
        return \\\`<div class="note-card" style="background:\\\${n.color};">
          \\\${n.pinned ? '<span class="pinned-badge">📌</span>' : ''}
          <div class="title">\\\${n.title}</div>
          <div class="excerpt">\\\${Note.excerpt(n)}</div>
          \\\${tagsHtml ? '<div style="margin-bottom:8px;">' + tagsHtml + '</div>' : ''}
          <div class="meta">
            <span>\\\${date}</span>
            <div>
              <button class="pin-btn" onclick="event.stopPropagation(); Store.pin('\\\${n.id}')" title="Pin">\\\${n.pinned ? '📌' : '📍'}</button>
              <button class="del-card-btn" onclick="event.stopPropagation(); if(confirm('Delete?')) Store.delete('\\\${n.id}')" title="Delete">🗑️</button>
            </div>
          </div>
        </div>\\\`;
      }).join('');
    }

    function updateStats(notes) {
      const pinned = notes.filter(n => n.pinned).length;
      document.getElementById('statsBar').innerHTML =
        '<b>' + notes.length + '</b> notes · <b>' + pinned + '</b> pinned · Data saved in localStorage';
    }

    const handleSearch = debounce((q) => {
      searchQuery = q;
      const results = q.trim() ? Store.search(q) : Store.getAll();
      renderNotes(results);
    }, 300);

    // ── Init ──────────────────────────────────────────────
    Store.load();
    if (Store.getAll().length === 0) {
      Store.add({ title: '🎓 JavaScript Seekha!', content: 'Week 9 mein variables, functions, DOM manipulation seekha. Week 10 mein Fetch API aur async/await.', tags: 'js,week9', color: '#1e1b4b' });
      Store.add({ title: '📝 Week 11 — OOP', content: 'Classes, inheritance, modules, IIFE pattern, debounce/throttle seekha.', tags: 'oop,week11', color: '#0f2d2b' });
      Store.add({ title: '⭐ Week 12 Preview', content: 'Final capstone project — complete portfolio with all JS concepts!', tags: 'preview', color: '#1f1a0e' });
      Store.getAll()[2].pinned = true;
      Store.save();
    }

    Store.subscribe(notes => { renderNotes(notes); updateStats(notes); });
    Store.subscribe = Store.subscribe;

    // Initial render
    const initial = Store.getAll();
    renderNotes(initial);
    updateStats(initial);

    // Enter key save
    document.getElementById('noteTitle').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('noteContent').focus(); });
  </script>
</body>
</html>\`,
      codeExample_en: \`<!-- See above — English content is integrated -->`,
    task_en: {
      description: "Notes App to and powerful banao: (1) Note edit functionality add karo — note click karne pe form in preload ho, save pe update ho, (2) Sort options: Newest, Oldest, Alphabetical (A-Z), Pinned First, (3) Tag filter — sidebar in sab tags dikho, click karne pe filter ho, (4) Export feature: \"Export All\" button from JSON file download ho (Blob API use karo), (5) Import feature: JSON file upload from notes restore ho, (6) Notes count by tag dikhao.',\n description_en: 'Make the Notes App more powerful: (1) Add note editing — click a note to preload the form, save to update it, (2) Sort options: Newest, Oldest, Alphabetical (A-Z), Pinned First, (3) Tag filter — show all tags in a sidebar, click to filter by tag, (4) Export: \"Export All\" button downloads a JSON file (use the Blob API), (5) Import: upload a JSON file to restore notes, (6) Show note counts by tag.",
      hint: "Edit: Store.update(id, changes) method banao. Sort: [...notes].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)). Export: const blob = new Blob([JSON.stringify(notes)], {type:\"application/json\"}); const url = URL.createObjectURL(blob); link.click(). Import: FileReader API use karo.",
    },
    quiz_en: [
      { q: 'Module pattern (IIFE) in private state why useful hai?', options: ['Faster hai', 'Bahar from accidentally modify not ho sakta — encapsulation ensures data integrity and predictable behavior', 'Memory save hoti hai', 'CSS from better integrate hota hai'], correct: 1, explanation: 'Private state = encapsulation. Agar notes array directly accessible hoti toh koi bhi notes.push({}) kar sakta tha bina observers notify kiye, bina localStorage save kiye. Module pattern ensure karta is ki sirf defined methods from data change ho — jaise getters/setters in OOP.',
 q_en: 'Why is private state useful in the module pattern (IIFE)?',
 options_en: ['It is faster', 'It cannot be accidentally modified from outside — encapsulation ensures data integrity and predictable behaviour', 'It saves memory', 'It integrates better with CSS'],
 explanation_en: 'Private state = encapsulation. If the notes array were directly accessible, anyone could do notes.push({}) without notifying observers or saving to localStorage. The module pattern ensures data only changes through defined methods — just like getters/setters in OOP.' },
      { q: 'Observer pattern (subscribe/notify) JavaScript in why popular hai?', options: ['Code short hota hai', 'Loose coupling — producer (Store) and consumer (UI) ek doosre to not jaante. Nayi features add karna easy is bina existing code change kiye.', 'Faster hai', 'Only for games'], correct: 1, explanation: 'Observer = pub/sub pattern. Store sirf notify() call karta is — koi bhi subscriber alag alag react kar sakta is (UI update, analytics log, localStorage save). Nayi feature add karni ho (e.g. sync to server) toh sirf ek and subscriber add karo — baaki code unchanged.',
 q_en: 'Why is the observer pattern (subscribe/notify) popular in JavaScript?',
 options_en: ['It makes code shorter', 'Loose coupling — the producer (Store) and consumer (UI) do not know about each other. Easy to add new features without changing existing code.', 'It is faster', 'Only for games'],
 explanation_en: 'Observer = pub/sub pattern. The Store only calls notify() — each subscriber can react differently (update UI, log analytics, save to localStorage). To add a new feature (e.g. sync to server), just add another subscriber — all other code stays unchanged.' },
      { q: 'Custom Error classes why banate hain?', options: ['Default errors kaam not karte', 'Extra information attach kar sakte are (field name, error code) and instanceof from specific errors catch kar sakte hain', 'Faster hain', 'Console in better dikhte hain'], correct: 1, explanation: 'Custom errors: class ValidationError extends Error { constructor(field, msg) { super(msg); this.field = field; } }. Benefits: (1) Extra context (kaunse field in error hai), (2) instanceof from differentiate kar sakte ho: catch(e) { if(e instanceof ValidationError) showFieldError(e.field); }, (3) Better debugging — error type clearly indicate hoti hai.',
 q_en: 'Why do we create custom Error classes?',
 options_en: ['Default errors do not work', 'You can attach extra information (field name, error code) and catch specific errors with instanceof', 'They are faster', 'They look better in the console'],
 explanation_en: 'Custom errors: class ValidationError extends Error { constructor(field, msg) { super(msg); this.field = field; } }. Benefits: (1) Extra context (which field has the error), (2) Differentiate with instanceof: catch(e) { if(e instanceof ValidationError) showFieldError(e.field); }, (3) Better debugging — the error type is clearly indicated.' },
    ],
  },

};

// ── WEEK 12 ──────────────────────────────────────────────────
const W12 = {
  'html-w12-s1': {
    title_en: "Month 3 Review — JavaScript Mastery",
    content_en: `## Month 3 Review — JavaScript Mastery! 🎉

### What You Learned in Month 3:

\`\`\`
Week 9: JavaScript + DOM
  ✅ Variables, functions, conditions, loops
  ✅ DOM selection and manipulation
  ✅ Event listeners (click, input, submit)
  ✅ localStorage and JSON persistence
  ✅ Interactive portfolio

Week 10: Async JavaScript
  ✅ Fetch API — calling real REST APIs
  ✅ Promises and async/await
  ✅ ES6+ features (arrow functions, destructuring,
       spread, map/filter/reduce)
  ✅ Error handling and debugging
  ✅ Weather App project

Week 11: Advanced JavaScript
  ✅ OOP with Classes and inheritance
  ✅ JavaScript Modules (import/export)
  ✅ Performance (debounce, event delegation)
  ✅ Intersection Observer (scroll animations)
  ✅ Notes App with localStorage
\`\`\`

### Full Course Summary — 3 Months of Web Dev:

\`\`\`
Month 1 — HTML:
  Semantic structure, forms, tables, multimedia,
  SEO, accessibility, HTML5 APIs

Month 2 — CSS:
  Box model, Flexbox, Grid, responsive design,
  animations, transitions, CSS variables

Month 3 — JavaScript:
  DOM manipulation, events, Fetch API,
  classes, modules, performance
\`\`\`

### You Can Now Build:
- ✅ Fully responsive multi-page websites
- ✅ Interactive apps that save data locally
- ✅ Apps that call real APIs (weather, news, GitHub)
- ✅ Accessible, SEO-optimised pages
- ✅ Smooth animated user interfaces`,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!-- See above — English content is integrated -->`,
    task_en: {
      description: "Review karo: (1) Ek JS cheatsheet page banao — variables, functions, array methods, DOM, async, classes sab ek page pe examples ke saath. (2) Apne Week 9/10/11 projects revisit karo and koi ek feature add karo har ek mein. (3) Console in sab key concepts test karo.',\n description_en: 'Review: (1) Build a JS cheatsheet page — variables, functions, array methods, DOM, async, classes all on one page with examples. (2) Revisit your Week 9/10/11 projects and add one new feature to each. (3) Test all key concepts in the console.",
      hint: "Cheatsheet: har concept for naam, 1-line explanation, and runnable example. Array methods: map, filter, reduce, find, every, some, sort. DOM: querySelector, classList, addEventListener, createElement.",
    },
    quiz_en: [
      { q: 'Teen mahine in kaunsi teen technologies seekhi?', options: ['HTML only', 'HTML + CSS', 'HTML + CSS + JavaScript', 'HTML + CSS + JS + React'], correct: 2, explanation: 'Month 1: HTML (structure). Month 2: CSS (style — Flexbox, Grid, animations, variables). Month 3: JavaScript (interactivity — DOM, Fetch API, OOP, async/await). Yeh web development ka solid foundation hai!',
 q_en: 'Which three technologies were learned over three months?',
 options_en: ['HTML only','HTML + CSS','HTML + CSS + JavaScript','HTML + CSS + JS + React'],
 explanation_en: 'Month 1: HTML (structure). Month 2: CSS (Flexbox, Grid, animations, variables). Month 3: JavaScript (DOM, Fetch API, OOP, async/await). This is the solid foundation of web development!' },
      { q: 'Course complete karne ke baad next logical step?', options: ['PHP seekhna', 'React.js or Vue.js — component-based frameworks', 'Database sirf', 'Mobile apps'], correct: 1, explanation: 'Web dev roadmap: HTML → CSS → JavaScript → React/Vue → Node.js → Database → Full-stack! React especially popular is — 80%+ companies use karti hain.',
 q_en: 'What is the next logical step after completing this course?',
 options_en: ['Learn PHP','React.js or Vue.js — component-based frameworks','Only databases','Mobile apps'],
 explanation_en: 'Web dev roadmap: HTML → CSS → JavaScript → React/Vue → Node.js → Database → Full-stack! React is especially popular — used by 80%+ of companies.' },
      { q: 'Portfolio in sabse important what hona chahiye?', options: ['Sirf naam and photo', 'About + Projects (live demo + GitHub) + Skills + Contact', 'Sirf skills list', 'Sirf social links'], correct: 1, explanation: 'Recruiter checklist: About, minimum 3 real projects (live demo + GitHub), skills list, contact info. Real projects > certificates. Always deploy and link!',
 q_en: 'What is the most important thing in a portfolio?',
 options_en: ['Only name and photo','About + Projects (live demo + GitHub) + Skills + Contact','Only a skills list','Only social links'],
 explanation_en: 'Recruiter checklist: About, minimum 3 real projects (live demo + GitHub), skills list, contact info. Real projects > certificates. Always deploy and share links!' },
    ],
  },

  'html-w12-s2': {
    title_en: "Capstone — Complete Portfolio Website",
    content_en: `## Capstone — Complete Portfolio Website!

Your final project — a professional portfolio that showcases all your skills!

### Requirements:

**Pages:**
- \`index.html\` — Landing page
- \`projects.html\` — Project showcase
- \`about.html\` — Your story
- \`contact.html\` — Get in touch

**Must Implement:**
\`\`\`
HTML:
  ✅ Semantic structure (header, main, section, footer)
  ✅ SEO meta tags and Open Graph
  ✅ All images have alt text
  ✅ Accessible forms (labels, aria attributes)
  ✅ Responsive viewport meta

CSS:
  ✅ CSS Variables design system (colours, spacing, radius)
  ✅ Mobile-first (works at 320px, 768px, 1024px, 1440px)
  ✅ CSS Grid for projects layout
  ✅ Flexbox for navbar and cards
  ✅ Smooth transitions on all interactions
  ✅ At least 2 CSS animations

JavaScript:
  ✅ Dark/light mode toggle
  ✅ Typing animation in hero
  ✅ Project filter (by technology)
  ✅ Contact form with validation + localStorage
  ✅ Intersection Observer scroll animations
  ✅ Fetch real data from an API (GitHub repos, etc.)
\`\`\`

### Deployment:
\`\`\`bash
# Vercel (free, recommended)
npm install -g vercel
vercel

# Netlify (free alternative)
# Drag and drop your folder at netlify.com/drop
\`\`\``,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!-- See above — English content is fully integrated -->`,
    task_en: {
      description: "Apna complete portfolio banao: (1) Sab 7 sections add karo, (2) Apne real projects add karo (To-Do, Weather, Notes App), (3) Smooth scroll + active nav + scroll animations lagao, (4) Skill bars animate karo IntersectionObserver se, (5) Typing effect add karo, (6) Contact form validate karo, (7) Dark/Light mode, (8) Netlify or GitHub Pages pe deploy karo, (9) GitHub pe push karo, (10) LinkedIn pe share karo!',\n description_en: 'Build your complete portfolio: (1) Add all 7 sections, (2) Add your real projects (To-Do, Weather, Notes), (3) Add smooth scroll + active nav + scroll animations, (4) Animate skill bars with IntersectionObserver, (5) Add a typing effect, (6) Validate the contact form, (7) Dark/Light mode, (8) Deploy on Netlify or GitHub Pages, (9) Push to GitHub, (10) Share on LinkedIn!",
      hint: "IntersectionObserver: new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add(\"visible\"); }), {threshold:0.1}). Typing: use setInterval or recursive setTimeout. Deploy: Netlify in GitHub repo connect karo — auto-deploy!",
    },
    quiz_en: [
      { q: 'IntersectionObserver why use karte are scroll animations ke liye?', options: ['Scroll event from better lagta hai', 'Performance: element viewport in aaye tabhi callback fire hoti is — not toh CPU waste not hota. Scroll event har scroll pe fire hoti is (throttle bhi karna padta hai).', 'Scroll events deprecated hain', 'CSS animations ke liye'], correct: 1, explanation: 'IntersectionObserver = browser ka built-in solution viewport visibility check karne ke liye. Scroll event listener from zyada efficient hai. Element visible hone pe ek baar callback → animation trigger → unobserve. Pure CSS transitions from bhi combine kar sakte ho.',
 q_en: 'Why use IntersectionObserver for scroll animations?',
 options_en: ['It looks better than scroll events','Performance: the callback only fires when the element enters the viewport — no CPU wasted otherwise. Scroll events fire on every scroll (and need throttling too).','Scroll events are deprecated','For CSS animations'],
 explanation_en: 'IntersectionObserver = browser\'s built-in solution for viewport visibility checks. More efficient than scroll event listeners. Callback fires once when element is visible → trigger animation → unobserve. Can be combined with pure CSS transitions too.' },
      { q: 'Portfolio deploy karne for best free option?', options: ['Sirf local machine pe rakho', 'Netlify or GitHub Pages — dono free hain, custom domain support karte hain, and GitHub from auto-deploy hota hai', 'Paid hosting zaruri hai', 'FTP from manually upload karo'], correct: 1, explanation: 'Netlify: drag-drop deploy or GitHub connect → push karo → auto-deploy. Free tier in custom domain, HTTPS, form handling, serverless functions bhi milte hain! GitHub Pages: repo from seedha deploy, perfect for static sites. Dono portfolio for ideal hain.',
 q_en: 'What is the best free option for deploying a portfolio?',
 options_en: ['Keep it only on local machine','Netlify or GitHub Pages — both free, support custom domains, and auto-deploy from GitHub','Paid hosting is required','Manually upload via FTP'],
 explanation_en: 'Netlify: drag-drop deploy or connect GitHub → push → auto-deploy. Free tier includes custom domain, HTTPS, form handling, and serverless functions! GitHub Pages: deploy directly from a repo, perfect for static sites. Both are ideal for portfolios.' },
      { q: 'Form validation JavaScript in why karni chahiye?', options: ['HTML validation sufficient hai', 'JavaScript validation = better UX (inline errors), custom messages, complex rules. HTML validation = basic fallback. Dono saath use karo.', 'Sirf backend pe karo', 'Forms validate not karne chahiye'], correct: 1, explanation: 'HTML validation (required, type="email") = browser-level, basic. JS validation = real-time feedback (type karte waqt), custom error messages, complex rules (password match, phone format). Backend validation bhi zaruri is (JS bypass ho sakta hai). Best: HTML + JS + Backend.',
 q_en: 'Why should you do form validation in JavaScript?',
 options_en: ['HTML validation is sufficient','JS validation = better UX (inline errors), custom messages, complex rules. HTML = basic fallback. Use both together.','Only do it on the backend','Forms should not be validated'],
 explanation_en: 'HTML validation (required, type="email") = browser-level, basic. JS validation = real-time feedback (while typing), custom error messages, complex rules (password match, phone format). Backend validation is also necessary (JS can be bypassed). Best practice: HTML + JS + Backend.' },
    ],
  },

  'html-w12-s3': {
    title_en: "Course Complete — Certificate Time! \ud83c\udf93",
    content_en: `## Course Complete — Certificate Time! 🎓

### What You Built in 3 Months:
\`\`\`
Month 1 Projects:
  ✅ Personal Resume Webpage (Week 2)
  ✅ Complete Portfolio — HTML only (Week 4)

Month 2 Projects:
  ✅ Styled Blog Page (Week 5)
  ✅ Responsive Portfolio with CSS (Week 6)
  ✅ Animated Landing Page (Week 7)
  ✅ Professional Agency Website — Capstone (Week 8)

Month 3 Projects:
  ✅ Interactive Portfolio with JS (Week 9)
  ✅ Weather App with real API (Week 10)
  ✅ Notes App with persistence (Week 11)
  ✅ Complete Professional Portfolio — Capstone (Week 12)
\`\`\`

### Earning Your Certificate:
To claim your Web Dev Bootcamp certificate, complete:
1. All 48 sections marked as Read
2. All 48 quizzes passed (score ≥ 70%)
3. Month 1, 2, and 3 capstone projects submitted

### Your Certificate Will Show:
\`\`\`
Certificate of Completion
Web Development Bootcamp
HTML • CSS • JavaScript

12 Weeks | 48 Sections | 3 Real Projects
Issued by: StudyEarn AI
\`\`\`

Congratulations — you are now a Junior Web Developer! 🚀`,
    codeExample_en: `<!DOCTYPE html>
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
</html>\`,
      codeExample_en: \`<!-- See above — English content is fully integrated -->`,
    task_en: {
      description: "Final tasks: (1) Apna portfolio Netlify pe deploy karo — free account banao, GitHub repo connect karo, (2) Portfolio ka link LinkedIn pe share karo with caption: \"I just completed 3 months of Web Development on StudyEarn AI! #WebDevelopment #HTML #CSS #JavaScript\", (3) GitHub pe saare 6 projects push karo with proper READMEs, (4) React.js official docs padho — react.dev — pehle \"Quick Start\" section, (5) Ek doosre student to StudyEarn AI recommend karo!',\n description_en: 'Final tasks: (1) Deploy your portfolio on Netlify — create a free account, connect your GitHub repo, (2) Share your portfolio link on LinkedIn: \"I just completed 3 months of Web Development on StudyEarn AI! #WebDevelopment #HTML #CSS #JavaScript\", (3) Push all 6 projects to GitHub with proper READMEs, (4) Read the React.js official docs at react.dev — start with the \"Quick Start\" section, (5) Recommend StudyEarn AI to another student!",
      hint: "Netlify deploy: netlify.com \u2192 \"Add new site\" \u2192 \"Import from Git\" \u2192 GitHub select \u2192 repo select \u2192 Deploy! Auto-deploy on every push. README: ## Project Name, ## Description, ## Tech Stack, ## Live Demo [link], ## How to Run.",
    },
    quiz_en: [
      { q: 'Course complete karne ke baad portfolio in what hona chahiye?', options: ['Sirf naam', 'About + 3+ real projects (live + GitHub) + Skills + Contact — deploye karo!', 'Sirf certificate upload karo', 'Sirf skills list'], correct: 1, explanation: 'Recruiter checklist: About (kaun ho), Projects (minimum 3 — live demo and GitHub link zaroori!), Skills (technology list), Contact (email/LinkedIn). Deploy karna mandatory is — local pe rakha project kisi to kaam not aata.',
 q_en: 'What should your portfolio contain after completing the course?',
 options_en: ['Only your name','About + 3+ real projects (live + GitHub) + Skills + Contact — deploy it!','Just upload your certificate','Only a skills list'],
 explanation_en: 'Recruiter checklist: About (who you are), Projects (minimum 3 — live demo and GitHub link required!), Skills (technology list), Contact (email/LinkedIn). Deploying is mandatory — a project sitting on your local machine is useless to anyone else.' },
      { q: 'React seekhne for best free resource?', options: ['Random YouTube videos', 'react.dev — official documentation. Best structured learning, interactive examples, and latest React 18+ features.', 'Paid courses sirf', 'Facebook groups'], correct: 1, explanation: 'react.dev = Meta ki official React documentation. 2023 in complete rewrite hua — ab modern React (hooks, functional components) first-class citizen hai. Quick Start from shuru karo, phir Learn React section. Free, accurate, and hamesha updated.',
 q_en: 'What is the best free resource for learning React?',
 options_en: ['Random YouTube videos','react.dev — official documentation. Best structured learning, interactive examples, and latest React 18+ features.','Only paid courses','Facebook groups'],
 explanation_en: 'react.dev = Meta\'s official React documentation. It was completely rewritten in 2023 — modern React (hooks, functional components) is now first-class. Start with Quick Start, then the Learn React section. Free, accurate, and always up to date.' },
      { q: 'GitHub pe portfolio push karna why important hai?', options: ['Zaruri not hai', 'Recruiters GitHub dekhte are — active profile = job opportunities. Code history, collaboration, open source contributions — sab yahan hai.', 'Sirf backup ke liye', 'Git sirf big companies ke liye'], correct: 1, explanation: 'GitHub = developer ka resume. Recruiters directly GitHub profile check karte hain. Green contribution graph, pinned repos, good READMEs — yeh sab impress karte hain. Open source contributions — bonus points. Private projects bhi commit history from activity dikhata hai.',
 q_en: 'Why is it important to push your portfolio to GitHub?',
 options_en: ['It is not necessary','Recruiters check GitHub — an active profile means job opportunities. Code history, collaboration, open source — all here.','Only for backup','Git is only for big companies'],
 explanation_en: 'GitHub = a developer\'s resume. Recruiters check GitHub profiles directly. A green contribution graph, pinned repos, and good READMEs all make an impression. Open source contributions = bonus points. Even private projects show activity through commit history.' },
    ],
  },

  'html-w12-s4': {
    title_en: "What's Next — Your Web Dev Journey",
    content_en: `## What is Next? Your Web Dev Journey!

### You Just Completed:
\`\`\`
✅ HTML5 — Structure
✅ CSS3 — Styling + Animations
✅ JavaScript (ES6+) — Interactivity
✅ Responsive Design — Mobile-first
✅ APIs — Real data integration
✅ Accessibility + SEO
\`\`\`

### Immediate Next Steps:

**1. Master React (most in-demand frontend framework)**
\`\`\`
Start with: react.dev (official tutorial)
Build: Todo app → Blog → Full app
Time: 4–6 weeks
\`\`\`

**2. Learn Git and GitHub (essential)**
\`\`\`bash
git init
git add .
git commit -m "first commit"
git push origin main
\`\`\`

**3. Deploy your projects**
\`\`\`
Vercel:   vercel.com — best for React/Next.js
Netlify:  netlify.com — great for static sites
GitHub Pages: free for open source
\`\`\`

**4. Build your GitHub profile**
- Upload all your projects
- Write clear README files
- Contribute to open source

### Learning Roadmap:
\`\`\`
Now:         HTML + CSS + JavaScript ✅
+1 month:    React.js
+2 months:   Next.js (full-stack React)
+3 months:   Backend (Node.js / Python FastAPI)
+6 months:   Full Stack Developer! 🚀
\`\`\`

### Resources:
- **MDN Web Docs** — Best reference: developer.mozilla.org
- **JavaScript.info** — Best JS tutorial: javascript.info
- **React Docs** — Official: react.dev
- **Frontend Mentor** — Real projects: frontendmentor.io
- **freeCodeCamp** — More practice: freecodecamp.org

You are ready. Go build something amazing! 🚀`,
    codeExample_en: `<!DOCTYPE html>
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
    const priceMatch = text.match(/₹([\\d,]+)/);
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
</html>\`,
      codeExample_en: \`<!-- See above — English content is fully integrated -->`,
    task_en: {
      description: "React for prepare karo: (1) react.dev kholo and \"Quick Start\" section padho — ek ghante in basics samajh aayenge. (2) Apne To-Do App ka React version plan karo — kaunse components honge? (TodoApp, TodoInput, TodoList, TodoItem), (3) CodeSandbox.io pe ek simple React counter banao bina koi setup ke, (4) Apne portfolio pe \"Learning React\" or \"React Enthusiast\" add karo skills mein, (5) Ek JavaScript concept likho jo React in bahut use hota is (hint: array methods, arrow functions, destructuring).',\n description_en: 'Prepare for React: (1) Open react.dev and read the \"Quick Start\" section — the basics will make sense in an hour. (2) Plan a React version of your To-Do App — which components would it have? (TodoApp, TodoInput, TodoList, TodoItem), (3) Build a simple React counter on CodeSandbox.io with no setup required, (4) Add \"Learning React\" or \"React Enthusiast\" to your portfolio skills, (5) Write down one JavaScript concept that is used heavily in React (hint: array methods, arrow functions, destructuring).",
      hint: "React concepts jo tumhe already pata hain: arrow functions, array.map() for rendering lists, destructuring for props, async/await for API calls, modules (import/export). React mostly JavaScript is — extra syntax thodi si sikhni hai!",
    },
    quiz_en: [
      { q: 'React in "state" is?', options: ['CSS variable', 'Component ka internal data jo change hone pe UI automatically re-render karta hai', 'HTML attribute', 'JavaScript object sirf'], correct: 1, explanation: 'State = component ka data jo time ke saath change ho sakta hai. State change → React virtual DOM compare karta is → sirf changed parts re-render karta hai. Vanilla JS in yeh manually karna padta tha. useState hook from state manage karte hain.',
 q_en: 'What is "state" in React?',
 options_en: ['A CSS variable','Internal component data that automatically re-renders the UI when it changes','An HTML attribute','Just a JavaScript object'],
 explanation_en: 'State = component data that can change over time. State changes → React compares the virtual DOM → only re-renders changed parts. In vanilla JS you had to do this manually. State is managed with the useState hook.' },
      { q: 'JSX is?', options: ['New programming language', 'JavaScript ka syntax extension — HTML jaisi syntax JS in likh sakte ho. Babel isko pure JavaScript in compile karta hai.', 'CSS framework', 'HTML replacement'], correct: 1, explanation: 'JSX = JavaScript XML. HTML-like syntax directly JS in likhne ki facility. <div className="card">{name}</div> → React.createElement("div",{className:"card"},name). Babel compile karta hai. {} in koi bhi JS expression likh sakte ho.',
 q_en: 'What is JSX?',
 options_en: ['A new programming language','A JavaScript syntax extension — lets you write HTML-like syntax in JS. Babel compiles it to pure JavaScript.','A CSS framework','A replacement for HTML'],
 explanation_en: 'JSX = JavaScript XML. It lets you write HTML-like syntax directly in JavaScript. <div className="card">{name}</div> → React.createElement("div",{className:"card"},name). Babel compiles it. You can write any JavaScript expression inside {}.' },
      { q: 'React vanilla JS from better why is large apps ke liye?', options: ['React faster hai', 'Component reusability + automatic state management + virtual DOM = less code, fewer bugs, easier to maintain. Large apps in vanilla JS unmanageable ho jaati hai.', 'React sirf Facebook for hai', 'CSS for better'], correct: 1, explanation: 'Vanilla JS large apps mein: manually DOM updates, state scattered everywhere, bugs easy to introduce. React: ek component banao, kahin bhi reuse karo. State change karo, React sab update karta hai. 100k lines code pe bhi manageable rehta hai.',
 q_en: 'Why is React better than vanilla JS for large apps?',
 options_en: ['React is faster','Component reusability + automatic state management + virtual DOM = less code, fewer bugs, easier to maintain. Vanilla JS becomes unmanageable in large apps.','React is only for Facebook','Better for CSS'],
 explanation_en: 'Vanilla JS in large apps: manual DOM updates, state scattered everywhere, bugs creep in easily. React: build one component, reuse it anywhere. Change state, React updates everything. Stays manageable even at 100k lines of code.' },
    ],
  },

};

// ── Merge all weeks ─────────────────────────────────────
export const HTML_ALL_EN = {
  ...W1,
  ...W2,
  ...W3,
  ...W4,
  ...W5,
  ...W6,
  ...W7,
  ...W8,
  ...W9,
  ...W10,
  ...W11,
  ...W12,
};

export function applyEnglishTranslations(courseWeeks, translationMap) {
  return courseWeeks.map(week => ({
    ...week,
    sections: week.sections.map(section => {
      const trans = translationMap[section.id];
      if (!trans) return section;

      let patchedQuiz = section.quiz;
      if (trans.quiz_en && Array.isArray(trans.quiz_en) && section.quiz) {
        patchedQuiz = section.quiz.map((q, i) => {
          const enQ = trans.quiz_en[i];
          if (!enQ) return q;
          return { ...q, q_en: enQ.q, options_en: enQ.options, explanation_en: enQ.explanation };
        });
      }

      let patchedTask = section.task;
      if (trans.task_en && section.task) {
        patchedTask = {
          ...section.task,
          description_en: trans.task_en.description,
          hint_en: trans.task_en.hint,
        };
      }

      const { quiz_en: _q, task_en: _t, ...restTrans } = trans;
      return { ...section, ...restTrans, quiz: patchedQuiz, task: patchedTask };
    }),
  }));
}