/*
  *HTML Course — Week 9: JavaScript Basics — Web ko Interactive Banao
 * Hinglish + English bilingual built-in
 */

export const HTML_WEEK_9 = {
  week: 9,
  title: 'JavaScript Basics — Web ko Interactive Banao',
  title_en: 'JavaScript Basics — Making the Web Interactive',
  description: 'HTML structure deta hai, CSS style deta hai, JavaScript life deta hai!',
  description_en: 'HTML gives structure, CSS gives style, JavaScript gives life!',
  xpReward: 240,
  sections: [
    {
      id: 'html-w9-s1',
      title: 'JavaScript Introduction — DOM Manipulation',
      title_en: 'JavaScript Introduction — DOM Manipulation',
      emoji: '⚡',
      content: `## JavaScript — Web ki Jaan!

HTML + CSS static hai. JavaScript se webpages **interactive** ban jaate hain!

### JS kaise Add Karte Hain HTML Mein

\`\`\`html
<!-- Method 1: Inline (avoid karo) -->
<button onclick="alert('Hello!')">Click</button>

<!-- Method 2: Internal — <script> tag -->
<script>
  console.log('Hello World!');
</script>

<!-- Method 3: External file (BEST PRACTICE) -->
<script src="script.js" defer></script>
<!-- defer = HTML load hone ke baad JS chale -->
\`\`\`

### DOM — Document Object Model

Browser HTML ko ek tree mein convert karta hai. JS se is tree ko manipulate karte hain!

\`\`\`js
// Element select karo
const heading = document.getElementById('main-title');
const btn     = document.querySelector('.my-btn');
const cards   = document.querySelectorAll('.card');

// Content change karo
heading.textContent = 'Naya Title!';
heading.innerHTML   = '<em>Italic</em> Title';

// Style change karo
heading.style.color     = '#6366f1';
heading.style.fontSize  = '32px';

// Classes add/remove karo
heading.classList.add('active');
heading.classList.remove('hidden');
heading.classList.toggle('dark');

// Attributes
btn.setAttribute('disabled', true);
btn.getAttribute('href');

// Naya element banao
const div = document.createElement('div');
div.textContent = 'Naya Div!';
div.className = 'card';
document.body.appendChild(div);
\`\`\`

### Events

\`\`\`js
const btn = document.querySelector('#myBtn');

// Event listener add karo
btn.addEventListener('click', function() {
  alert('Button clicked!');
});

// Arrow function
btn.addEventListener('click', () => {
  console.log('Clicked!');
});

// Common events
element.addEventListener('click',      handler);
element.addEventListener('mouseover',  handler);
element.addEventListener('keydown',    handler);
element.addEventListener('submit',     handler);
element.addEventListener('input',      handler);
element.addEventListener('change',     handler);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { submitForm(); }
});
\`\`\`

### Variables aur Data Types

\`\`\`js
// Variables
let   name  = 'Rahul';    // changeable
const age   = 21;         // fixed
var   old   = true;       // avoid (old way)

// Data types
let   str   = 'Hello';
let   num   = 42;
let   bool  = true;
let   arr   = [1, 2, 3];
let   obj   = { name: 'Rahul', age: 21 };
let   empty = null;
let   undef;              // undefined

// Template literals
const msg = \`Hello \${name}, tum \${age} saal ke ho!\`;

// Array methods
arr.push(4);              // add at end
arr.pop();                // remove from end
arr.map(x => x * 2);     // transform
arr.filter(x => x > 1);  // filter
arr.forEach(x => console.log(x));
\`\`\``,
      content_en: `## JavaScript — The Life of the Web!

HTML + CSS are static. JavaScript makes webpages **interactive**!

### How to Add JS to HTML

\`\`\`html
<!-- Internal — <script> tag -->
<script>
  console.log('Hello World!');
</script>

<!-- External file (BEST PRACTICE) -->
<script src="script.js" defer></script>
<!-- defer = JS runs after HTML has loaded -->
\`\`\`

### DOM — Document Object Model

The browser converts HTML into a tree. JS lets you manipulate that tree!

\`\`\`js
// Select elements
const heading = document.getElementById('main-title');
const btn     = document.querySelector('.my-btn');
const cards   = document.querySelectorAll('.card');

// Change content
heading.textContent = 'New Title!';
heading.innerHTML   = '<em>Italic</em> Title';

// Change styles
heading.style.color    = '#6366f1';
heading.style.fontSize = '32px';

// Add/remove classes
heading.classList.add('active');
heading.classList.remove('hidden');
heading.classList.toggle('dark');

// Create new elements
const div = document.createElement('div');
div.textContent = 'New Div!';
div.className = 'card';
document.body.appendChild(div);
\`\`\`

### Events

\`\`\`js
const btn = document.querySelector('#myBtn');

btn.addEventListener('click', () => {
  console.log('Clicked!');
});

// Common events
element.addEventListener('click',     handler);
element.addEventListener('mouseover', handler);
element.addEventListener('keydown',   handler);
element.addEventListener('submit',    handler);
element.addEventListener('input',     handler);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { submitForm(); }
});
\`\`\`

### Variables and Data Types

\`\`\`js
let   name = 'Rahul';    // changeable
const age  = 21;         // fixed

let str  = 'Hello';
let num  = 42;
let bool = true;
let arr  = [1, 2, 3];
let obj  = { name: 'Rahul', age: 21 };

// Template literals
const msg = \`Hello \${name}, you are \${age} years old!\`;

// Array methods
arr.push(4);
arr.filter(x => x > 1);
arr.map(x => x * 2);
\`\`\``,
      codeExample: `<!DOCTYPE html>
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
      greeting.textContent = name ? \`Namaste, \${name}! 👋 Welcome to StudyEarn!\` : 'Naam likho toh greeting milegi!';
    });

    // 4. Dynamic elements
    let itemCount = 0;
    function addItem() {
      itemCount++;
      const output = document.getElementById('output');
      if (itemCount === 1) output.innerHTML = '';
      const item = document.createElement('div');
      item.style.cssText = 'padding:8px 12px; margin:4px 0; background:rgba(99,102,241,0.1); border-radius:6px; border-left:3px solid #6366f1; display:flex; justify-content:space-between; align-items:center;';
      item.innerHTML = \`<span>Item #\${itemCount}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px;">✕</button>\`;
      output.appendChild(item);
    }
    function clearItems() {
      document.getElementById('output').innerHTML = 'Items yahan aayenge...';
      itemCount = 0;
    }
  </script>

</body>
</html>`,
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
      greeting.textContent = name ? \`Hello, \${name}! 👋 Welcome to StudyEarn!\` : 'Type a name to get a greeting!';
    });

    let itemCount = 0;
    function addItem() {
      itemCount++;
      const output = document.getElementById('output');
      if (itemCount === 1) output.innerHTML = '';
      const item = document.createElement('div');
      item.style.cssText = 'padding:8px 12px; margin:4px 0; background:rgba(99,102,241,0.1); border-radius:6px; border-left:3px solid #6366f1; display:flex; justify-content:space-between; align-items:center;';
      item.innerHTML = \`<span>Item #\${itemCount}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:16px;">✕</button>\`;
      output.appendChild(item);
    }
    function clearItems() {
      document.getElementById('output').innerHTML = 'Items will appear here...';
      itemCount = 0;
    }
  </script>
</body>
</html>`,
      task: {
        description: 'Apni portfolio website mein JS add karo. Requirements: (1) Smooth scroll — navbar links pe click karne pe smooth scroll ho section mein (scrollIntoView), (2) Dark/Light toggle — button se theme switch karo (CSS variables update karo via JS), (3) Skill bars — page load pe skill bars animate hokar fill hon (width 0 se actual value tak), (4) Form validation — contact form submit pe naam aur email validate karo, error message dikhao, (5) Active nav link — scroll karte waqt current section ka nav link highlight ho.',
        description_en: 'Add JS to your portfolio website. Requirements: (1) Smooth scroll — clicking navbar links smoothly scrolls to the section (scrollIntoView), (2) Dark/Light toggle — a button switches the theme (update CSS variables via JS), (3) Skill bars — on page load, skill bars animate from 0 to their actual value, (4) Form validation — validate name and email on contact form submit, show error messages, (5) Active nav link — highlight the current section\'s nav link as you scroll.',
        hint: 'scrollIntoView({behavior:"smooth"}). CSS variables: document.documentElement.style.setProperty("--bg","#fff"). Skill bars: setTimeout(() => bar.style.width = "80%", 200). Form: if(!email.includes("@")) error.textContent = "Valid email chahiye!"',
        hint_en: 'scrollIntoView({behavior:"smooth"}). CSS variables: document.documentElement.style.setProperty("--bg","#fff"). Skill bars: setTimeout(() => bar.style.width = "80%", 200). Form: if(!email.includes("@")) error.textContent = "Valid email required!"',
      },
      quiz: [
        {
          q: 'document.querySelector() aur document.getElementById() mein kya fark hai?',
          options: ['Koi fark nahi', 'querySelector kisi bhi CSS selector se kaam karta hai, getElementById sirf ID se', 'getElementById faster hai', 'querySelector sirf classes ke liye hai'],
          correct: 1,
          explanation: 'getElementById("name") sirf id="name" dhundta hai. querySelector(".card") koi bhi CSS selector (#id, .class, tag, [attr]) use kar sakta hai — zyada flexible!',
          q_en: 'What is the difference between document.querySelector() and document.getElementById()?',
          options_en: ['No difference', 'querySelector works with any CSS selector, getElementById only with IDs', 'getElementById is faster', 'querySelector is only for classes'],
          explanation_en: 'getElementById("name") only finds id="name". querySelector(".card") works with any CSS selector (#id, .class, tag, [attr]) — much more flexible!',
        },
        {
          q: '<script> tag mein defer attribute kya karta hai?',
          options: ['Script block karta hai', 'Script HTML load hone ke baad chalta hai — DOM ready hoti hai', 'Script cancel karta hai', 'Script async banata hai'],
          correct: 1,
          explanation: 'defer = HTML parse hone ke baad, DOM complete hone ke baad script run karo. Bina defer ke script HTML ke beech mein run karta hai — DOM elements nahi milte.',
          q_en: 'What does the defer attribute on a <script> tag do?',
          options_en: ['Blocks the script', 'Script runs after HTML has loaded — DOM is ready', 'Cancels the script', 'Makes the script async'],
          explanation_en: 'defer = run the script after HTML is parsed and the DOM is complete. Without defer, the script runs mid-HTML — and DOM elements are not yet available.',
        },
        {
          q: 'classList.toggle("active") kya karta hai?',
          options: ['Hamesha class add karta hai', 'Class hai toh remove, nahi hai toh add — toggle', 'Hamesha class remove karta hai', 'Class ka naam change karta hai'],
          correct: 1,
          explanation: 'toggle = agar class present hai toh remove karo, absent hai toh add karo. Dark mode, menu open/close, accordion expand/collapse ke liye perfect!',
          q_en: 'What does classList.toggle("active") do?',
          options_en: ['Always adds the class', 'If the class is present it removes it, if absent it adds it — a toggle', 'Always removes the class', 'Changes the class name'],
          explanation_en: 'toggle = if the class is present, remove it; if absent, add it. Perfect for dark mode, open/close menus, expand/collapse accordions!',
        },
      ],
    },

    {
      id: 'html-w9-s2',
      title: 'JavaScript Functions aur Conditions',
      title_en: 'JavaScript Functions and Conditions',
      emoji: '🧠',
      content: `## Functions aur Control Flow — JS ka Logic Engine!

### Functions

\`\`\`js
// Regular function
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Arrow function (modern)
const greet = (name) => \`Hello, \${name}!\`;
const double = x => x * 2;  // one param, no parens needed
const add    = (a, b) => a + b;

// Default parameters
function greet(name = 'Friend') {
  return \`Hello, \${name}!\`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10
\`\`\`

### Conditions

\`\`\`js
// if / else
const score = 85;
if (score >= 90)      { grade = 'A+'; }
else if (score >= 80) { grade = 'A';  }
else if (score >= 70) { grade = 'B';  }
else                  { grade = 'C';  }

// Ternary operator
const status = score >= 70 ? 'Pass' : 'Fail';
const label  = isLoggedIn ? 'Logout' : 'Login';

// Nullish coalescing
const name = user?.name ?? 'Guest';  // null/undefined toh 'Guest'

// Optional chaining
const city = user?.address?.city;    // error nahi aayega

// Switch
switch (day) {
  case 'Monday':   console.log('Week start!'); break;
  case 'Friday':   console.log('Weekend coming!'); break;
  case 'Saturday':
  case 'Sunday':   console.log('Weekend!'); break;
  default:         console.log('Midweek');
}
\`\`\`

### Loops

\`\`\`js
// for loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// for...of (arrays)
const fruits = ['apple', 'banana', 'mango'];
for (const fruit of fruits) {
  console.log(fruit);
}

// forEach
fruits.forEach((fruit, index) => {
  console.log(\`\${index}: \${fruit}\`);
});

// while
let count = 0;
while (count < 5) {
  count++;
}
\`\`\`

### Practical: Form Validation

\`\`\`js
function validateForm(formData) {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = 'Naam zaroori hai!';
  }

  if (!formData.email.includes('@')) {
    errors.email = 'Valid email chahiye!';
  }

  if (formData.password.length < 8) {
    errors.password = 'Password 8+ characters ka hona chahiye!';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Usage
const result = validateForm({ name: 'Rahul', email: 'rahul@gmail.com', password: 'abc' });
if (!result.isValid) {
  console.log(result.errors); // { password: 'Password 8+ characters...' }
}
\`\`\``,
      content_en: `## Functions and Control Flow — JS's Logic Engine!

### Functions

\`\`\`js
// Regular function
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Arrow function (modern)
const greet  = (name) => \`Hello, \${name}!\`;
const double = x => x * 2;
const add    = (a, b) => a + b;

// Default parameters
function greet(name = 'Friend') {
  return \`Hello, \${name}!\`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
\`\`\`

### Conditions

\`\`\`js
const score = 85;
if      (score >= 90) { grade = 'A+'; }
else if (score >= 80) { grade = 'A';  }
else if (score >= 70) { grade = 'B';  }
else                  { grade = 'C';  }

// Ternary
const status = score >= 70 ? 'Pass' : 'Fail';

// Nullish coalescing
const name = user?.name ?? 'Guest';

// Optional chaining
const city = user?.address?.city;
\`\`\`

### Loops

\`\`\`js
for (let i = 0; i < 5; i++) { console.log(i); }

const fruits = ['apple', 'banana', 'mango'];
for (const fruit of fruits) { console.log(fruit); }

fruits.forEach((fruit, index) => {
  console.log(\`\${index}: \${fruit}\`);
});
\`\`\`

### Practical: Form Validation

\`\`\`js
function validateForm(formData) {
  const errors = {};
  if (!formData.name.trim())           errors.name     = 'Name is required!';
  if (!formData.email.includes('@'))   errors.email    = 'Valid email required!';
  if (formData.password.length < 8)   errors.password = 'Password must be 8+ chars!';
  return { isValid: Object.keys(errors).length === 0, errors };
}
\`\`\``,
      codeExample: `<!DOCTYPE html>
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
      if (type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Valid email format chahiye!';
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
        \`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(99,102,241,0.1)">
          <span>📚 \${item.name}</span>
          <span>₹\${item.price} <button onclick="removeFromCart(\${i})" style="background:none;border:none;color:#ef4444;cursor:pointer;margin-left:8px">✕</button></span>
        </div>\`
      ).join('') + \`<div style="text-align:right;padding-top:8px;font-weight:700;color:#6366f1">Total: ₹\${total}</div>\`;
    }
  </script>

</body>
</html>`,
      codeExample_en: `<!-- Same structure in English — only text content differs. See Hinglish version above for the full interactive demo. -->`,
      task: {
        description: 'Ek complete "Student Grade Calculator" banao. Features: (1) Multiple subjects ke liye input fields (Math, Science, English, Hindi, Computer), (2) Har subject ka marks input (0-100), (3) Real-time total aur percentage calculate ho jaise marks type karo, (4) Grade calculate karo (A+/A/B/C/D/F) aur color se highlight karo, (5) "Best Subject" aur "Needs Improvement" subject show karo (Math.max / Math.min), (6) Result card generate karo — student ka naam aur result table — jise print bhi kar sakein (@media print).',
        description_en: 'Build a complete "Student Grade Calculator". Features: (1) Input fields for multiple subjects (Math, Science, English, Hindi, Computer), (2) Marks input per subject (0-100), (3) Total and percentage calculated in real time as marks are typed, (4) Calculate grade (A+/A/B/C/D/F) and colour-code it, (5) Show "Best Subject" and "Needs Improvement" subject (Math.max / Math.min), (6) Generate a result card — student name and result table — that can also be printed (@media print).',
        hint: 'Real-time: input pe addEventListener("input", calculate). Math.max(...scores) se highest nikalo. window.print() se print dialog khulta hai. @media print { .no-print { display: none; } }',
        hint_en: 'Real-time: addEventListener("input", calculate) on each input. Math.max(...scores) to find the highest. window.print() opens the print dialog. @media print { .no-print { display: none; } }',
      },
      quiz: [
        {
          q: 'Arrow function aur regular function mein main fark kya hai?',
          options: ['Koi fark nahi', 'Arrow functions concise hain aur apna "this" nahi rakhte — parent ka "this" use karte hain', 'Arrow functions faster hain', 'Arrow functions return nahi kar sakte'],
          correct: 1,
          explanation: 'Arrow functions: shorter syntax, "this" lexically scoped (parent ka this use karte hain). Regular functions: apna this context banate hain. Event handlers mein, class methods mein yeh difference important hai.',
          q_en: 'What is the main difference between an arrow function and a regular function?',
          options_en: ['No difference', 'Arrow functions are concise and do not have their own "this" — they use the parent\'s "this"', 'Arrow functions are faster', 'Arrow functions cannot return values'],
          explanation_en: 'Arrow functions: shorter syntax, "this" is lexically scoped (uses parent\'s this). Regular functions: create their own "this" context. This difference matters in event handlers and class methods.',
        },
        {
          q: 'Nullish coalescing operator (??) kab use karte hain?',
          options: ['Hamesha', 'Jab value null ya undefined ho toh fallback dene ke liye (0 aur "" ko false nahi maanta)', 'Boolean conditions ke liye', 'Math operations ke liye'],
          correct: 1,
          explanation: '?? sirf null aur undefined pe fallback deta hai. || operator 0, "", false pe bhi fallback deta hai. user?.name ?? "Guest" — agar name null/undefined ho toh "Guest", warna actual name.',
          q_en: 'When do you use the nullish coalescing operator (??)?',
          options_en: ['Always', 'To provide a fallback when a value is null or undefined (does not treat 0 and "" as false)', 'For boolean conditions', 'For math operations'],
          explanation_en: '?? only falls back for null and undefined. The || operator also falls back for 0, "", false. user?.name ?? "Guest" — shows "Guest" only if name is null/undefined, otherwise shows the actual name.',
        },
        {
          q: 'Array.reduce() kya karta hai?',
          options: ['Array ko chhota banata hai', 'Array ke saare elements ko ek single value mein combine karta hai', 'Array sort karta hai', 'Array copy karta hai'],
          correct: 1,
          explanation: 'reduce((accumulator, currentValue) => ..., initialValue) — sab elements loop karke ek result build karta hai. Sum: reduce((sum, n) => sum + n, 0). Shopping cart total ke liye perfect!',
          q_en: 'What does Array.reduce() do?',
          options_en: ['Makes the array smaller', 'Combines all elements into a single value', 'Sorts the array', 'Copies the array'],
          explanation_en: 'reduce((accumulator, currentValue) => ..., initialValue) — loops through all elements and builds a single result. Sum: reduce((sum, n) => sum + n, 0). Perfect for shopping cart totals!',
        },
      ],
    },

    {
      id: 'html-w9-s3',
      title: 'localStorage aur JSON — Data Save Karo',
      title_en: 'localStorage and JSON — Saving Data',
      emoji: '💾',
      content: `## localStorage — Browser mein Data Save Karo!

\`\`\`js
// Data save karo
localStorage.setItem('key', 'value');
localStorage.setItem('username', 'Rahul');

// Data retrieve karo
const name = localStorage.getItem('username');  // 'Rahul'

// Data delete karo
localStorage.removeItem('username');
localStorage.clear();  // sab kuch delete

// Check karo
if (localStorage.getItem('token')) {
  // User logged in hai
}
\`\`\`

### JSON — Objects/Arrays Save Karo

localStorage sirf strings store karta hai. JSON se objects/arrays save karo:

\`\`\`js
// Object save karo
const user = { name: 'Rahul', age: 21, courses: ['Python', 'HTML'] };
localStorage.setItem('user', JSON.stringify(user));  // object → string

// Object retrieve karo
const savedUser = JSON.parse(localStorage.getItem('user'));  // string → object
console.log(savedUser.name);   // 'Rahul'
console.log(savedUser.courses); // ['Python', 'HTML']

// Safe retrieve (agar key nahi hai)
const todos = JSON.parse(localStorage.getItem('todos') || '[]');
const settings = JSON.parse(localStorage.getItem('settings') || '{}');
\`\`\`

### Complete Todo App Pattern

\`\`\`js
// Load todos from localStorage
function loadTodos() {
  return JSON.parse(localStorage.getItem('todos') || '[]');
}

// Save todos to localStorage
function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Add todo
function addTodo(text) {
  const todos = loadTodos();
  todos.push({
    id: Date.now(),          // unique ID
    text,
    completed: false,
    createdAt: new Date().toISOString()
  });
  saveTodos(todos);
  renderTodos();
}

// Toggle complete
function toggleTodo(id) {
  const todos = loadTodos();
  const todo = todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
  saveTodos(todos);
  renderTodos();
}

// Delete todo
function deleteTodo(id) {
  const todos = loadTodos().filter(t => t.id !== id);
  saveTodos(todos);
  renderTodos();
}

// Render
function renderTodos() {
  const todos = loadTodos();
  const container = document.getElementById('todoList');
  container.innerHTML = todos.map(todo => \`
    <div class="todo \${todo.completed ? 'done' : ''}">
      <input type="checkbox" \${todo.completed ? 'checked' : ''}
        onchange="toggleTodo(\${todo.id})">
      <span>\${todo.text}</span>
      <button onclick="deleteTodo(\${todo.id})">✕</button>
    </div>
  \`).join('');
}
\`\`\`

### Theme Preference Save Karo

\`\`\`js
// Save on toggle
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Load on page start
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
\`\`\``,
      content_en: `## localStorage — Save Data in the Browser!

\`\`\`js
// Save data
localStorage.setItem('username', 'Rahul');

// Retrieve data
const name = localStorage.getItem('username');  // 'Rahul'

// Delete data
localStorage.removeItem('username');
localStorage.clear();  // delete everything
\`\`\`

### JSON — Save Objects/Arrays

localStorage only stores strings. Use JSON for objects/arrays:

\`\`\`js
// Save an object
const user = { name: 'Rahul', age: 21, courses: ['Python', 'HTML'] };
localStorage.setItem('user', JSON.stringify(user));  // object → string

// Retrieve object
const savedUser = JSON.parse(localStorage.getItem('user'));  // string → object
console.log(savedUser.name);   // 'Rahul'

// Safe retrieve (if key is missing)
const todos    = JSON.parse(localStorage.getItem('todos')    || '[]');
const settings = JSON.parse(localStorage.getItem('settings') || '{}');
\`\`\`

### Complete Todo App Pattern

\`\`\`js
function loadTodos() { return JSON.parse(localStorage.getItem('todos') || '[]'); }
function saveTodos(t) { localStorage.setItem('todos', JSON.stringify(t)); }

function addTodo(text) {
  const todos = loadTodos();
  todos.push({ id: Date.now(), text, completed: false });
  saveTodos(todos);
  renderTodos();
}

function toggleTodo(id) {
  const todos = loadTodos();
  const todo  = todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
  saveTodos(todos);
  renderTodos();
}

function deleteTodo(id) {
  saveTodos(loadTodos().filter(t => t.id !== id));
  renderTodos();
}
\`\`\``,
      codeExample: `<!DOCTYPE html>
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
        list.innerHTML = \`<div class="empty"><div>\${filter === 'done' ? '🎉' : '📝'}</div>\${filter === 'done' ? 'Koi completed task nahi!' : 'Koi task nahi! Add karo ☝️'}</div>\`;
        return;
      }
      list.innerHTML = shown.map(t => \`
        <div class="todo-item \${t.done ? 'done' : ''}" id="todo-\${t.id}">
          <div class="todo-check" onclick="toggle(\${t.id})">\${t.done ? '✓' : ''}</div>
          <span class="todo-text">\${t.text}</span>
          <span class="todo-date">\${t.date}</span>
          <button class="del-btn" onclick="remove(\${t.id})">✕</button>
        </div>
      \`).join('');
    }

    render();
  </script>

</body>
</html>`,
      codeExample_en: `<!-- Same app with English text — see Hinglish version above for the full working Todo App with localStorage + dark mode -->`,
      task: {
        description: 'Todo app ko upgrade karo: (1) Categories add karo — Work, Personal, Study (color-coded), (2) Priority levels — High/Medium/Low, (3) Due date input per task, (4) Overdue tasks ko red mein highlight karo, (5) Drag and drop to reorder (HTML5 draggable attribute), (6) Export all todos as JSON file (download), (7) Import todos from JSON file, (8) Stats: pie chart-like progress bar (% complete), (9) Search/filter by text, (10) Clear completed todos button.',
        description_en: 'Upgrade the Todo app: (1) Add categories — Work, Personal, Study (colour-coded), (2) Priority levels — High/Medium/Low, (3) Due date input per task, (4) Highlight overdue tasks in red, (5) Drag and drop to reorder (HTML5 draggable attribute), (6) Export all todos as a JSON file (download), (7) Import todos from a JSON file, (8) Stats: progress bar showing % complete, (9) Search/filter by text, (10) Clear completed todos button.',
        hint: 'Export: const blob = new Blob([JSON.stringify(todos)], {type:"application/json"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download="todos.json"; a.click(). Import: fileInput.files[0] ko FileReader se read karo.',
        hint_en: 'Export: const blob = new Blob([JSON.stringify(todos)], {type:"application/json"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download="todos.json"; a.click(). Import: read fileInput.files[0] with FileReader.',
      },
      quiz: [
        {
          q: 'JSON.stringify() aur JSON.parse() kab use karte hain?',
          options: ['Kabhi nahi', 'stringify: JS object/array → string (localStorage ke liye), parse: string → JS object/array', 'stringify sirf numbers ke liye', 'parse sirf strings ke liye'],
          correct: 1,
          explanation: 'localStorage sirf strings store karta hai. stringify se object ko string mein convert karo save karne ke liye. parse se wapis object mein convert karo use karne ke liye.',
          q_en: 'When do you use JSON.stringify() and JSON.parse()?',
          options_en: ['Never', 'stringify: JS object/array → string (for localStorage), parse: string → JS object/array', 'stringify is only for numbers', 'parse is only for strings'],
          explanation_en: 'localStorage only stores strings. Use stringify to convert an object to a string for saving. Use parse to convert it back to an object for use.',
        },
        {
          q: 'Date.now() kya return karta hai?',
          options: ['Current date string', 'Unix timestamp — 1970 se milliseconds mein — unique ID ke liye use hota hai', 'Current time string', 'Calendar object'],
          correct: 1,
          explanation: 'Date.now() = milliseconds since January 1, 1970. Iska use unique IDs banane ke liye hota hai (todo items mein) — same millisecond mein 2 items banana practically impossible hai.',
          q_en: 'What does Date.now() return?',
          options_en: ['Current date string', 'Unix timestamp — milliseconds since 1970 — used for unique IDs', 'Current time string', 'A calendar object'],
          explanation_en: 'Date.now() = milliseconds since January 1, 1970. Used to generate unique IDs (in todo items) — it is practically impossible to create 2 items within the same millisecond.',
        },
        {
          q: 'localStorage.getItem("key") jab key exist nahi karta toh kya return karta hai?',
          options: ['Empty string', 'null', 'undefined', 'Error throw karta hai'],
          correct: 1,
          explanation: 'localStorage.getItem() null return karta hai agar key exist nahi karta. Isliye safe pattern hai: JSON.parse(localStorage.getItem("todos") || "[]") — null toh "[]" use karo.',
          q_en: 'What does localStorage.getItem("key") return when the key does not exist?',
          options_en: ['Empty string', 'null', 'undefined', 'Throws an error'],
          explanation_en: 'localStorage.getItem() returns null if the key does not exist. That is why the safe pattern is: JSON.parse(localStorage.getItem("todos") || "[]") — if null, use "[]".',
        },
      ],
    },

    {
      id: 'html-w9-s4',
      title: 'Week 9 Project — Interactive Portfolio',
      title_en: 'Week 9 Project — Interactive Portfolio',
      emoji: '🚀',
      content: `## Week 9 Project — JavaScript se Portfolio ko Alive Banao!

Ab tak JS mein seekha:
- DOM manipulation (select, change, create)
- Events (click, input, keydown)
- Functions, conditions, loops
- localStorage aur JSON

In sab se apni portfolio website ko **fully interactive** banao!

### Required Features:

\`\`\`
1. Smooth Navigation
   ✅ Navbar links → smooth scroll to sections
   ✅ Active link highlight as you scroll (Intersection Observer)
   ✅ Sticky navbar with shadow on scroll

2. Dark/Light Mode
   ✅ Toggle button with animation
   ✅ localStorage mein save karo
   ✅ System preference detect karo (prefers-color-scheme)

3. Skill Bars Animation
   ✅ Page load pe animate hokar fill hon
   ✅ Scroll karke section visible ho toh animate ho

4. Contact Form
   ✅ Real-time validation
   ✅ Error messages
   ✅ Success animation
   ✅ Submit prevent default

5. Projects Filter
   ✅ Category buttons (All, HTML, CSS, JS, Python)
   ✅ Filter pe cards show/hide animate

6. Typing Animation
   ✅ Hero mein typing effect — subtitle ke liye
   ✅ Multiple strings cycle karo

7. Back to Top Button
   ✅ Scroll karne ke baad appear ho
   ✅ Click pe smooth scroll top

8. Mobile Hamburger Menu
   ✅ Toggle open/close with animation
   ✅ Close when link clicked
\`\`\`

### Typing Animation Code:

\`\`\`js
function typingAnimation(element, strings, speed = 80) {
  let stringIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = strings[stringIdx];

    if (!isDeleting) {
      element.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, 1500);  // pause before delete
        return;
      }
    } else {
      element.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        stringIdx = (stringIdx + 1) % strings.length;
      }
    }
    setTimeout(type, isDeleting ? speed / 2 : speed);
  }
  type();
}

// Usage
typingAnimation(document.querySelector('.typing'), [
  'Web Developer',
  'HTML Expert',
  'CSS Artist',
  'JS Enthusiast'
]);
\`\`\``,
      content_en: `## Week 9 Project — Bring Your Portfolio to Life with JavaScript!

JS learned so far:
- DOM manipulation (select, change, create)
- Events (click, input, keydown)
- Functions, conditions, loops
- localStorage and JSON

Use all of these to make your portfolio website **fully interactive**!

### Required Features:

\`\`\`
1. Smooth Navigation
   ✅ Navbar links → smooth scroll to sections
   ✅ Active link highlight on scroll (Intersection Observer)
   ✅ Sticky navbar with shadow on scroll

2. Dark/Light Mode
   ✅ Toggle button with animation
   ✅ Save to localStorage
   ✅ Detect system preference (prefers-color-scheme)

3. Skill Bars Animation
   ✅ Animate to fill on page load
   ✅ Animate when section scrolls into view

4. Contact Form
   ✅ Real-time validation
   ✅ Error messages
   ✅ Success animation
   ✅ Prevent default on submit

5. Projects Filter
   ✅ Category buttons (All, HTML, CSS, JS, Python)
   ✅ Cards show/hide with animation on filter

6. Typing Animation
   ✅ Typing effect in hero — for the subtitle
   ✅ Cycle through multiple strings

7. Back to Top Button
   ✅ Appears after scrolling
   ✅ Smooth scroll to top on click

8. Mobile Hamburger Menu
   ✅ Toggle open/close with animation
   ✅ Closes when a link is clicked
\`\`\``,
      codeExample: `<!DOCTYPE html>
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
          const link = document.querySelector(\`.nav-links a[href="#\${e.target.id}"]\`);
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
</html>`,
      codeExample_en: `<!-- Same complete interactive portfolio — already fully in English in the code above. All JS features work the same way. -->`,
      task: {
        description: 'Apna complete interactive portfolio finalize karo. Sabhi JS features add karo: (1) Typing animation hero mein, (2) Smooth scroll + active nav, (3) Skill bars animation on scroll, (4) Dark/Light mode toggle + localStorage save, (5) Project category filter, (6) Contact form validation with error messages, (7) Back to top button, (8) Mobile hamburger menu, (9) Scroll progress bar at top of page, (10) visitor count using localStorage (page views).',
        description_en: 'Finalise your complete interactive portfolio. Add all JS features: (1) Typing animation in hero, (2) Smooth scroll + active nav, (3) Skill bars animation on scroll, (4) Dark/Light mode toggle + localStorage save, (5) Project category filter, (6) Contact form validation with error messages, (7) Back to top button, (8) Mobile hamburger menu, (9) Scroll progress bar at top of page, (10) Visitor count using localStorage (page views).',
        hint: 'Scroll progress: window.addEventListener("scroll", () => { const pct = scrollY / (document.body.scrollHeight - innerHeight) * 100; bar.style.width = pct + "%" }). Visitor count: let visits = parseInt(localStorage.getItem("visits")||0)+1; localStorage.setItem("visits",visits).',
        hint_en: 'Scroll progress: window.addEventListener("scroll", () => { const pct = scrollY / (document.body.scrollHeight - innerHeight) * 100; bar.style.width = pct + "%" }). Visitor count: let visits = parseInt(localStorage.getItem("visits")||0)+1; localStorage.setItem("visits",visits).',
      },
      quiz: [
        {
          q: 'Intersection Observer kab use karte hain?',
          options: ['Hamesha', 'Scroll-triggered animations ke liye — viewport mein element aane pe action lo', 'Click events ke liye', 'Form validation ke liye'],
          correct: 1,
          explanation: 'Intersection Observer batata hai kab koi element viewport mein enter/exit karta hai — scroll event se zyada efficient. Skill bar animations, lazy loading, active nav ke liye perfect!',
          q_en: 'When do you use Intersection Observer?',
          options_en: ['Always', 'For scroll-triggered animations — take action when an element enters the viewport', 'For click events', 'For form validation'],
          explanation_en: 'Intersection Observer tells you when an element enters or exits the viewport — more efficient than the scroll event. Perfect for skill bar animations, lazy loading, and active nav!',
        },
        {
          q: 'matchMedia("(prefers-color-scheme: dark)").matches kya detect karta hai?',
          options: ['Browser dark theme', 'OS/system dark mode preference — user ke system setting ke hisaab se', 'Website color', 'Screen brightness'],
          correct: 1,
          explanation: 'matchMedia system-level dark/light mode preference detect karta hai. Agar user ke OS mein dark mode hai toh automatically website bhi dark mode mein load ho — better UX!',
          q_en: 'What does matchMedia("(prefers-color-scheme: dark)").matches detect?',
          options_en: ['Browser dark theme', 'OS/system dark mode preference — based on the user\'s system settings', 'Website colour', 'Screen brightness'],
          explanation_en: 'matchMedia detects the system-level dark/light mode preference. If the user has dark mode on their OS, the website can automatically load in dark mode — better UX!',
        },
        {
          q: 'event.preventDefault() form submit mein kyun use karte hain?',
          options: ['Form submit block karne ke liye permanently', 'Default browser form submission (page reload) rokne ke liye — taaki JS se handle kar sakein', 'Form reset karne ke liye', 'Validation disable karne ke liye'],
          correct: 1,
          explanation: 'Default form submit page reload karta hai data loss ke saath. preventDefault() se page reload rokto, phir JS se validation karo, AJAX se data bhejo, ya custom success message dikhao.',
          q_en: 'Why do you use event.preventDefault() on form submit?',
          options_en: ['To block form submission permanently', 'To prevent the default browser form submission (page reload) — so JS can handle it', 'To reset the form', 'To disable validation'],
          explanation_en: 'The default form submission reloads the page and loses data. preventDefault() stops the reload, so you can validate with JS, send data with AJAX, or show a custom success message.',
        },
      ],
    },
  ],
};