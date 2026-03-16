/**
 * HTML Course — Week 2: Tables aur Forms
 */

export const HTML_WEEK_2 = {
  week: 2,
  title: 'Tables aur Forms — Data aur User Input',
  description: 'Data tables aur interactive forms banao — real websites ka core!',
  xpReward: 120,
  sections: [
    {
      id: 'html-w2-s1',
      title: 'Tables — Data Organized Rakho',
      emoji: '📊',
      content: `## HTML Tables — Data ko Rows aur Columns mein!

Tables structured data dikhane ke liye use hote hain — spreadsheets, schedules, comparisons, etc.

### Basic Table Structure

\`\`\`html
<table>
  <tr>
    <th>Naam</th>
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
| Tag | Kaam |
|-----|------|
| \`<table>\` | Table ka container |
| \`<tr>\` | Table Row |
| \`<th>\` | Table Header (bold + center by default) |
| \`<td>\` | Table Data (normal cell) |
| \`<thead>\` | Header rows ka group |
| \`<tbody>\` | Body rows ka group |
| \`<tfoot>\` | Footer rows ka group |

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
    <tr>
      <td>Tablet</td>
      <td>₹25,000</td>
      <td>8</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Total Items</td>
      <td>—</td>
      <td>65</td>
    </tr>
  </tfoot>
</table>
\`\`\`

### Cell Merging — colspan aur rowspan

\`\`\`html
<table border="1">
  <tr>
    <!-- colspan: 2 columns mein phaila hua -->
    <th colspan="2">Student Information</th>
  </tr>
  <tr>
    <td>Naam</td>
    <td>Rahul Kumar</td>
  </tr>
  <tr>
    <!-- rowspan: 2 rows mein phaila hua -->
    <td rowspan="2">Marks</td>
    <td>Math: 95</td>
  </tr>
  <tr>
    <td>Science: 88</td>
  </tr>
</table>
\`\`\`

### Time Table Example

\`\`\`html
<table border="1">
  <thead>
    <tr>
      <th>Time</th>
      <th>Monday</th>
      <th>Tuesday</th>
      <th>Wednesday</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>9:00 AM</td>
      <td>Math</td>
      <td>English</td>
      <td>Science</td>
    </tr>
    <tr>
      <td>10:00 AM</td>
      <td colspan="2">Sports</td>
      <td>History</td>
    </tr>
  </tbody>
</table>
\`\`\`

### Important Note ⚠️
Tables sirf **tabular data** ke liye use karo (data jo rows-columns mein fit ho). Page layout ke liye tables use karna — outdated practice hai! Layout ke liye CSS Flexbox/Grid use karo.`,

      codeExample: `<!DOCTYPE html>
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

      task: {
        description: 'Apne school/college ka Weekly Timetable banao HTML table mein. Ismein hona chahiye: (1) 5 days (Monday-Friday) columns mein, (2) 6 periods rows mein, (3) Lunch break ke liye colspan use karo (5 columns merge karo), (4) Proper <thead>, <tbody>, <tfoot> structure, (5) Footer mein total periods count.',
        hint: 'colspan="5" se Monday se Friday tak merge hoga. <thead> mein days, <tbody> mein periods, <tfoot> mein total. cellpadding="8" se cells spacious lagengi.',
      },
      quiz: [
        {
          q: '<th> aur <td> mein kya fark hai?',
          options: ['Koi fark nahi', '<th> header cell hai — bold aur centered by default, <td> regular data cell', '<th> sirf first row mein use hota hai', '<td> sirf numbers ke liye'],
          correct: 1,
          explanation: '<th> (Table Header) automatically bold aur center hota hai — column/row headers ke liye. <td> (Table Data) regular content ke liye.',
        },
        {
          q: 'colspan="3" kya karta hai?',
          options: ['Row ko 3 hissa karta hai', 'Cell ko 3 columns ki width deta hai', '3 rows merge karta hai', 'Cell mein 3 items add karta hai'],
          correct: 1,
          explanation: 'colspan="3" ek cell ko 3 columns ki width deta hai — horizontally merge karta hai. rowspan vertically merge karta hai.',
        },
        {
          q: 'Table layout ke liye <table> use karna sahi hai?',
          options: ['Haan, yeh best practice hai', 'Nahi, layout ke liye CSS Flexbox/Grid use karo', 'Sirf responsive design mein', 'Sirf large screens pe'],
          correct: 1,
          explanation: 'Tables sirf tabular data ke liye hain (rows/columns mein fit data). Page layout ke liye CSS Flexbox ya Grid use karo.',
        },
      ],
    },

    {
      id: 'html-w2-s2',
      title: 'Forms — User se Input Lo',
      emoji: '📝',
      content: `## HTML Forms — User Interaction!

Forms websites ka sabse important part hain — login, signup, search, checkout — sab forms hote hain!

### Basic Form Structure

\`\`\`html
<form action="/submit" method="POST">
  <label for="naam">Tumhara Naam:</label>
  <input type="text" id="naam" name="naam" placeholder="Naam likho...">

  <button type="submit">Submit Karo</button>
</form>
\`\`\`

### Form Attributes:
- **action**: Form data kahan jaayega (server URL)
- **method**: Kaise jaayega — GET (URL mein) ya POST (hidden, secure)

### Input Types — Sabse Important!

\`\`\`html
<!-- Text input -->
<input type="text" placeholder="Naam likho">

<!-- Password — characters hide hote hain -->
<input type="password" placeholder="Password">

<!-- Email — email format validate karta hai -->
<input type="email" placeholder="email@example.com">

<!-- Number -->
<input type="number" min="1" max="100" value="18">

<!-- Phone -->
<input type="tel" placeholder="+91 9876543210">

<!-- Date -->
<input type="date">

<!-- Color picker -->
<input type="color" value="#6366f1">

<!-- Range slider -->
<input type="range" min="0" max="100" value="50">

<!-- Checkbox -->
<input type="checkbox" id="agree" name="agree">
<label for="agree">Terms agree karta/karti hoon</label>

<!-- Radio buttons -->
<input type="radio" id="male" name="gender" value="male">
<label for="male">Male</label>
<input type="radio" id="female" name="gender" value="female">
<label for="female">Female</label>

<!-- File upload -->
<input type="file" accept=".jpg,.png,.pdf">

<!-- Hidden field -->
<input type="hidden" name="user_id" value="12345">

<!-- Submit button as input -->
<input type="submit" value="Submit Karo">

<!-- Reset button -->
<input type="reset" value="Clear Karo">
\`\`\`

### Textarea — Multiple Lines

\`\`\`html
<textarea
  name="message"
  rows="5"
  cols="40"
  placeholder="Apna message likho..."
></textarea>
\`\`\`

### Select Dropdown

\`\`\`html
<select name="city">
  <option value="">-- City chunno --</option>
  <option value="mumbai">Mumbai</option>
  <option value="delhi" selected>Delhi</option>
  <option value="bangalore">Bangalore</option>
</select>

<!-- Multiple selection -->
<select name="skills" multiple size="4">
  <option value="html">HTML</option>
  <option value="css">CSS</option>
  <option value="js">JavaScript</option>
  <option value="python">Python</option>
</select>
\`\`\`

### Label — Accessibility ke liye Zaruri!

\`\`\`html
<!-- Method 1: for-id connection -->
<label for="email">Email Address:</label>
<input type="email" id="email" name="email">

<!-- Method 2: wrap karo -->
<label>
  Phone Number:
  <input type="tel" name="phone">
</label>
\`\`\`

**label click karne pe input focus hota hai** — great for accessibility!

### Required aur Validation

\`\`\`html
<input type="text" name="naam" required>
<input type="email" name="email" required>
<input type="password" name="pass" minlength="8" required>
<input type="number" name="age" min="18" max="100" required>
\`\`\``,

      codeExample: `<!DOCTYPE html>
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

      task: {
        description: 'Ek complete "Job Application Form" banao. Ismein hona chahiye: Personal Info (naam, email, phone, date of birth), Professional Info (current job title, experience in years using range, skills using checkboxes — HTML/CSS/JS/Python/React mein se multiple), Upload section (resume file upload, profile photo), Salary expectation (number input with min/max), Cover letter (textarea), aur Submit/Reset buttons. Saare required fields mark karo.',
        hint: 'Checkboxes ke liye alag alag input type="checkbox" use karo har skill ke liye. Range ke liye min="0" max="20". File ke liye accept=".pdf,.doc" specify karo.',
      },
      quiz: [
        {
          q: 'Form mein method="POST" aur method="GET" mein kya fark hai?',
          options: ['Koi fark nahi', 'GET data URL mein show karta hai, POST data hidden bhejta hai', 'POST faster hai', 'GET sirf read ke liye'],
          correct: 1,
          explanation: 'GET: data URL mein dikhta hai (?name=Rahul) — search forms ke liye theek hai. POST: data hidden bhejta hai — login/signup ke liye zaroori (password URL mein nahi dikhna chahiye).',
        },
        {
          q: 'Radio buttons aur checkboxes mein kya fark hai?',
          options: ['Koi fark nahi', 'Radio buttons ek group mein sirf ek select hota hai, checkboxes multiple select kar sakte hain', 'Checkboxes required hote hain', 'Radio buttons multiple select kar sakte hain'],
          correct: 1,
          explanation: 'Radio buttons (same name attribute) — sirf ek select hota hai (like gender). Checkboxes — multiple select kar sakte hain (like skills).',
        },
        {
          q: '<label for="email"> mein "for" attribute kya karta hai?',
          options: ['Label ko form se connect karta hai', 'Input ka naam set karta hai', 'Label ko input se link karta hai — label click pe input focus hota hai', 'Styling ke liye'],
          correct: 2,
          explanation: 'for="email" label ko us input se link karta hai jiska id="email" ho. Label click karne pe input automatically focus ho jaata hai — great for accessibility!',
        },
      ],
    },

    {
      id: 'html-w2-s3',
      title: 'Semantic HTML — Meaningful Structure',
      emoji: '🏗️',
      content: `## Semantic HTML — Tags jo Meaning Rakhte Hain!

Semantic HTML matlab aise tags use karo jo **content ka meaning bataayein** — sirf appearance ke liye nahi, balki purpose ke liye bhi!

### Non-Semantic vs Semantic

\`\`\`html
<!-- ❌ Non-Semantic — sirf divs aur spans -->
<div id="header">
  <div id="nav">...</div>
</div>
<div id="main">
  <div class="article">...</div>
  <div id="sidebar">...</div>
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
<!-- Page ka top section — logo, navigation -->
<header>
  <h1>StudyEarn AI 🚀</h1>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/courses">Courses</a></li>
    </ul>
  </nav>
</header>

<!-- Main navigation -->
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

<!-- Page ka main content -->
<main>

  <!-- Self-contained content piece — blog post, news article, etc. -->
  <article>
    <h2>HTML Kaise Seekhein?</h2>
    <p>HTML seekhna bahut aasan hai...</p>
  </article>

  <!-- Related but secondary content — sidebar, ads, related links -->
  <aside>
    <h3>Related Articles</h3>
    <ul>
      <li><a href="#">CSS Basics</a></li>
    </ul>
  </aside>

  <!-- Content ka ek section/group -->
  <section>
    <h2>Featured Courses</h2>
    <article>
      <h3>Python Programming</h3>
    </article>
    <article>
      <h3>Web Development</h3>
    </article>
  </section>

</main>

<!-- Page ka bottom section -->
<footer>
  <p>&copy; 2024 StudyEarn AI. All rights reserved.</p>
  <nav>
    <a href="/privacy">Privacy Policy</a>
    <a href="/terms">Terms of Service</a>
  </nav>
</footer>
\`\`\`

### More Semantic Tags

\`\`\`html
<!-- Figure aur Caption -->
<figure>
  <img src="chart.png" alt="Sales Chart">
  <figcaption>Figure 1: Monthly Sales Data 2024</figcaption>
</figure>

<!-- Time -->
<p>Published on <time datetime="2024-03-15">March 15, 2024</time></p>

<!-- Address -->
<address>
  StudyEarn AI<br>
  Mumbai, Maharashtra<br>
  <a href="mailto:info@studyearnai.tech">info@studyearnai.tech</a>
</address>

<!-- Quote -->
<blockquote cite="https://source.com">
  <p>Education is the most powerful weapon you can use to change the world.</p>
</blockquote>

<!-- Abbreviation -->
<p><abbr title="HyperText Markup Language">HTML</abbr> is awesome!</p>

<!-- Code -->
<p>Use the <code>print()</code> function in Python.</p>

<pre><code>
function greet() {
  console.log("Hello World!");
}
</code></pre>
\`\`\`

### Semantic HTML ke Fayde:

1. **SEO** — Search engines better samjhte hain content structure
2. **Accessibility** — Screen readers navigate kar paate hain properly
3. **Maintainability** — Code samajhna aur maintain karna easy
4. **Team collaboration** — Doosre developers code jaldi samjhte hain`,

      codeExample: `<!DOCTYPE html>
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

      task: {
        description: 'Ek complete semantic HTML webpage banao — "Meri Personal Website". Structure: <header> mein naam + navigation (Home, About, Skills, Contact), <main> mein: ek <section> "About Me" ke liye (apne baare mein ek article with figure aur image), ek <section> "My Skills" ke liye (skills list), ek <section> "Projects" ke liye (2-3 project articles), <aside> mein favourite quotes ya links, <footer> mein copyright aur contact. Har jagah proper semantic tags use karo.',
        hint: 'lang="en" attribute <html> tag mein add karo. <article> self-contained content ke liye, <section> related items group karne ke liye. <figure> ke saath image aur <figcaption> use karo.',
      },
      quiz: [
        {
          q: '<article> aur <section> mein kya fark hai?',
          options: ['Koi fark nahi', '<article> self-contained independent content, <section> related content ka thematic group', '<section> sirf navigation ke liye', '<article> sirf text ke liye'],
          correct: 1,
          explanation: '<article> = independently meaningful content (blog post, news article, product card) — akele bhi sense banaata hai. <section> = related content ka group jiska ek theme ho.',
        },
        {
          q: 'Semantic HTML ka SEO benefit kya hai?',
          options: ['Page faster load hota hai', 'Search engines content structure better samjhte hain aur ranking improve hoti hai', 'Images optimize hoti hain', 'Code chhota hota hai'],
          correct: 1,
          explanation: 'Google aur other search engines semantic tags (header, nav, main, article) use karke content ka importance aur structure samjhte hain — isse ranking improve hoti hai.',
        },
        {
          q: '<figure> aur <figcaption> kab use karte hain?',
          options: ['Sirf photos ke liye', 'Images, diagrams, charts ke saath unki caption/description ke liye', 'Sirf large images ke liye', 'Background images ke liye'],
          correct: 1,
          explanation: '<figure> image/diagram/chart/code ko wrap karta hai. <figcaption> uski description deta hai — jaise textbooks mein "Figure 1:" captions hote hain.',
        },
      ],
    },

    {
      id: 'html-w2-s4',
      title: 'Week 2 Project — Personal Resume Webpage',
      emoji: '🏆',
      content: `## Week 2 Project — Professional Resume Webpage!

Ab tak seekha:
- Tables (data organize karna)
- Forms (user input lena)
- Semantic HTML (meaningful structure)

In sab ko combine karke ek **professional resume webpage** banao!

### Resume ka HTML Structure:

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
      building responsive websites and web applications...</p>
    </section>

    <section id="experience">
      <h2>Work Experience</h2>
      <article>
        <h3>Junior Web Developer</h3>
        <p><strong>Tech Corp India</strong> |
           <time datetime="2023-01">Jan 2023</time> —
           <time datetime="2024-03">Mar 2024</time>
        </p>
        <ul>
          <li>Built 10+ responsive websites</li>
          <li>Improved page load time by 40%</li>
        </ul>
      </article>
    </section>

    <section id="skills">
      <h2>Technical Skills</h2>
      <table>
        <tr>
          <th>Category</th>
          <th>Skills</th>
          <th>Level</th>
        </tr>
        <tr>
          <td>Frontend</td>
          <td>HTML, CSS, JavaScript</td>
          <td>Advanced</td>
        </tr>
        <tr>
          <td>Backend</td>
          <td>Python, Node.js</td>
          <td>Intermediate</td>
        </tr>
      </table>
    </section>

    <section id="education">
      <h2>Education</h2>
      <table>
        <thead>
          <tr>
            <th>Degree</th>
            <th>Institution</th>
            <th>Year</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>B.Tech Computer Science</td>
            <td>Mumbai University</td>
            <td>2022</td>
            <td>8.5 CGPA</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="contact">
      <h2>Contact Me</h2>
      <form action="#" method="POST">
        <label for="sender_name">Your Name:</label>
        <input type="text" id="sender_name" name="name" required>

        <label for="sender_email">Email:</label>
        <input type="email" id="sender_email" name="email" required>

        <label for="message">Message:</label>
        <textarea id="message" name="message" rows="4" required></textarea>

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

### Kya include karo:
1. ✅ Header — naam, title, contact links
2. ✅ About/Summary section
3. ✅ Skills table (category, skills, level)
4. ✅ Education table (degree, college, year, marks)
5. ✅ Projects section (article tags use karo)
6. ✅ Contact form (naam, email, message)
7. ✅ Footer
8. ✅ Semantic tags everywhere`,

      codeExample: `<!DOCTYPE html>
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

      task: {
        description: 'Apna khud ka professional resume webpage banao! Ismein real information use karo: (1) Header — apna naam, title (Student / Aspiring Developer), contact links, (2) About Me section — apne baare mein 2-3 sentences, (3) Skills table — categories (Programming/Tools/Languages), specific skills, aur level, (4) Education table — class/degree, school/college, year, percentage, (5) Hobbies/Interests section as article tags, (6) Contact form — naam, email, subject (dropdown), message. Proper semantic HTML use karo throughout.',
        hint: 'Real info use karo — yeh tumhara actual portfolio page ban sakta hai! lang="en" and meta charset="UTF-8" zaroor add karo. Har section ko proper id attribute do (id="skills" etc.) taaki navigation links kaam karein.',
      },
      quiz: [
        {
          q: 'Resume webpage mein experience dates ke liye best HTML tag kaunsa hai?',
          options: ['<date>', '<p>', '<time datetime="2024-01">', '<span>'],
          correct: 2,
          explanation: '<time datetime="2024-01"> semantic tag hai jo machine-readable date provide karta hai — SEO ke liye aur assistive technologies ke liye useful.',
        },
        {
          q: 'Contact form mein method="POST" kyun use karna chahiye?',
          options: ['POST faster hota hai', 'POST data URL mein show nahi hota — personal info secure rehti hai', 'POST required hota hai', 'GET kaam nahi karta forms mein'],
          correct: 1,
          explanation: 'GET method data URL mein show karta hai: ?name=Rahul&email=... — yeh private info ke liye galat hai. POST data server ko hidden bhejta hai.',
        },
        {
          q: 'Page navigation mein #id links use karne ka kya faida hai?',
          options: ['New page khulta hai', 'Same page ke kisi section pe scroll ho jaata hai', 'External website pe jaata hai', 'Form submit hota hai'],
          correct: 1,
          explanation: '<a href="#skills"> click karne pe page same page ke id="skills" element pe scroll ho jaata hai — single-page navigation ke liye useful!',
        },
      ],
    },
  ],
};