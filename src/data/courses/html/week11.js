/**
 * HTML Course — Week 11: JavaScript Advanced — OOP, Modules, Project Patterns
 * Month 3, Week 3
 */

export const HTML_WEEK_11 = {
  week: 11,
  title: 'JavaScript Advanced — OOP aur Real Patterns',
  title_en: 'Advanced JavaScript — OOP and Real-World Patterns',
  description: 'Classes, modules, design patterns — professional JavaScript likhna seekho!',
  description_en: 'Classes, modules, design patterns — learn to write professional JavaScript!',
  xpReward: 280,
  sections: [
    {
      id: 'html-w11-s1',
      title: 'Objects aur Classes — OOP in JavaScript',
      title_en: 'Objects and Classes — OOP in JavaScript',
      emoji: '🏛️',
      content: `## Object-Oriented Programming — Real World ko Code mein Model Karo!

### Objects — Key-Value Pairs

\`\`\`javascript
// Object literal
const student = {
  name:    'Rahul Sharma',
  age:     21,
  city:    'Mumbai',
  isPremium: false,
  scores:  [85, 92, 78],

  // Method — object ke andar function
  greet() {
    return \`Hi, I'm \${this.name} from \${this.city}!\`;
  },

  getAvg() {
    const sum = this.scores.reduce((a, b) => a + b, 0);
    return (sum / this.scores.length).toFixed(1);
  },
};

console.log(student.greet());   // "Hi, I'm Rahul Sharma from Mumbai!"
console.log(student.getAvg());  // "85.0"
console.log(student.name);      // "Rahul Sharma"
student.age = 22;               // Update
student.email = 'r@e.com';      // Add new property
delete student.city;            // Remove property
\`\`\`

### Destructuring — Clean Code ka Secret

\`\`\`javascript
// Object destructuring
const { name, age, city = 'Unknown' } = student;
console.log(name, age, city);  // "Rahul Sharma" 21 "Unknown"

// Rename while destructuring
const { name: studentName, isPremium: premium } = student;

// Nested destructuring
const user = { address: { city: 'Delhi', pin: '110001' } };
const { address: { city, pin } } = user;

// Array destructuring
const [first, second, ...rest] = [10, 20, 30, 40, 50];
console.log(first);  // 10
console.log(rest);   // [30, 40, 50]

// Function parameters mein
function displayUser({ name, age, city = 'Unknown' }) {
  return \`\${name}, \${age}, \${city}\`;
}
displayUser(student);  // "Rahul Sharma, 21, Unknown"
\`\`\`

### Classes — OOP Blueprint

\`\`\`javascript
class Student {
  // Constructor — naya object banate waqt call hota hai
  constructor(name, age, course) {
    this.name   = name;
    this.age    = age;
    this.course = course;
    this.scores = [];
    this.xp     = 0;
  }

  // Methods
  addScore(score) {
    this.scores.push(score);
    this.xp += score >= 70 ? 30 : 10;
    return this;  // Method chaining ke liye
  }

  getAverage() {
    if (this.scores.length === 0) return 0;
    return this.scores.reduce((a, b) => a + b, 0) / this.scores.length;
  }

  getGrade() {
    const avg = this.getAverage();
    if (avg >= 90) return { grade: 'A', emoji: '🌟' };
    if (avg >= 75) return { grade: 'B', emoji: '😊' };
    if (avg >= 60) return { grade: 'C', emoji: '😐' };
    return { grade: 'F', emoji: '😢' };
  }

  // Static method — instance ke bina call kar sakte ho
  static createFromData(data) {
    return new Student(data.name, data.age, data.course);
  }

  // Getter — computed property
  get summary() {
    const { grade, emoji } = this.getGrade();
    return \`\${this.name} | \${this.course} | Grade: \${grade} \${emoji} | XP: \${this.xp}\`;
  }

  toString() {
    return this.summary;
  }
}

// Use karo
const s1 = new Student('Priya', 20, 'HTML');
s1.addScore(85).addScore(92).addScore(78);  // Method chaining!
console.log(s1.summary);
console.log(s1.getAverage());  // 85

// Static method
const s2 = Student.createFromData({ name: 'Aryan', age: 22, course: 'CSS' });
\`\`\`

### Inheritance — Extend karo!

\`\`\`javascript
// Base class
class User {
  constructor(name, email) {
    this.name  = name;
    this.email = email;
    this.createdAt = new Date().toISOString();
  }

  greet() { return \`Hello, \${this.name}!\`; }
  toString() { return \`[\${this.name} — \${this.email}]\`; }
}

// Extend karo
class PremiumStudent extends User {
  constructor(name, email, plan) {
    super(name, email);  // Parent constructor call
    this.plan     = plan;
    this.isPremium = true;
    this.xpMultiplier = 2;
  }

  // Override parent method
  greet() {
    return \`\${super.greet()} ⭐ Premium member!\`;
  }

  getPlanDetails() {
    return \`Plan: \${this.plan} | 2× XP | Unlimited AI\`;
  }
}

const premiumUser = new PremiumStudent('Sneha', 's@e.com', 'Pro');
console.log(premiumUser.greet());          // "Hello, Sneha! ⭐ Premium member!"
console.log(premiumUser.getPlanDetails()); // "Plan: Pro | 2× XP | Unlimited AI"
console.log(premiumUser instanceof User);  // true
\`\`\``,
      content_en: `## Object-Oriented Programming — Model the Real World in Code!

### Objects

\`\`\`javascript
const student = {
  name: 'Rahul',
  age:  21,
  scores: [85, 92, 78],

  greet() { return \`Hi, I'm \${this.name}!\`; },
  getAvg() { return this.scores.reduce((a,b) => a+b, 0) / this.scores.length; },
};
\`\`\`

### Destructuring

\`\`\`javascript
const { name, age, city = 'Unknown' } = student;
const [first, second, ...rest] = [10, 20, 30, 40, 50];

function displayUser({ name, age }) { return \`\${name}, \${age}\`; }
\`\`\`

### Classes

\`\`\`javascript
class Student {
  constructor(name, age) {
    this.name   = name;
    this.age    = age;
    this.scores = [];
  }

  addScore(score) { this.scores.push(score); return this; }
  getAverage()    { return this.scores.reduce((a,b) => a+b, 0) / this.scores.length; }

  static createFromData(data) { return new Student(data.name, data.age); }

  get summary() { return \`\${this.name} | Avg: \${this.getAverage().toFixed(1)}\`; }
}

const s = new Student('Priya', 20);
s.addScore(85).addScore(92);
console.log(s.summary);
\`\`\`

### Inheritance

\`\`\`javascript
class User {
  constructor(name, email) { this.name = name; this.email = email; }
  greet() { return \`Hello, \${this.name}!\`; }
}

class PremiumStudent extends User {
  constructor(name, email, plan) {
    super(name, email);  // call parent constructor
    this.plan = plan;
  }
  greet() { return \`\${super.greet()} ⭐ Premium!\`; }
}
\`\`\``,
      codeExample: `<!DOCTYPE html>
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

      get summary() { return \`\${this.name} | \${this.course} | Avg: \${this.getAverage().toFixed(1)}\`; }
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
          ? tempScores.map(s => \`<span class="chip">\${s}</span>\`).join('')
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
        return \`
          <div class="student-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <div class="student-name">\${s.name} \${s.isPremium ? '<span class="premium-badge">⭐ Premium</span>' : ''}</div>
                <div class="student-meta">Age: \${s.age} | Course: \${s.course} | XP: \${s.xp}</div>
              </div>
              <span class="grade-badge grade-\${grade}">\${emoji} \${grade} — \${label}</span>
            </div>
            \${s.scores.length ? \`
              <div class="score-chips">\${s.scores.map(sc => \`<span class="chip">\${sc}</span>\`).join('')}</div>
              <div style="font-size:12px; color:var(--muted); margin-top:4px;">Average: \${avg.toFixed(1)}</div>
            \` : '<div style="font-size:12px; color:var(--muted); margin-top:4px;">No scores yet</div>'}
            <div class="xp-bar"><div class="xp-fill" style="width:\${xpPct}%"></div></div>
          </div>
        \`;
      }).join('');
    }

    function updateStats() {
      if (!students.length) return;
      const avgs   = students.map(s => s.getAverage()).filter(a => a > 0);
      const classAvg = avgs.length ? (avgs.reduce((a,b) => a+b, 0) / avgs.length).toFixed(1) : 'N/A';
      const premium  = students.filter(s => s.isPremium).length;
      const topStudent = students.reduce((best, s) => s.getAverage() > best.getAverage() ? s : best, students[0]);

      document.getElementById('classStats').innerHTML = \`
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px;">
          <div style="background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:12px; text-align:center;">
            <div style="font-size:28px; font-weight:800; color:var(--primary);">\${students.length}</div>
            <div style="font-size:11px; color:var(--muted);">Total Students</div>
          </div>
          <div style="background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:12px; text-align:center;">
            <div style="font-size:28px; font-weight:800; color:var(--green);">\${classAvg}</div>
            <div style="font-size:11px; color:var(--muted);">Class Average</div>
          </div>
          <div style="background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:12px; text-align:center;">
            <div style="font-size:28px; font-weight:800; color:var(--amber);">\${premium}</div>
            <div style="font-size:11px; color:var(--muted);">Premium Students</div>
          </div>
          <div style="background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:12px; text-align:center;">
            <div style="font-size:16px; font-weight:800; color:var(--accent);">\${topStudent.name}</div>
            <div style="font-size:11px; color:var(--muted);">Top Student 🏆</div>
          </div>
        </div>
      \`;
    }
  </script>
</body>
</html>`,
      codeExample_en: `<!-- See above — English content is integrated -->`,
      task: {
        description: 'OOP practice karo: (1) Ek BankAccount class banao with: balance, owner, transactions array. Methods: deposit(amount), withdraw(amount) — balance check karo, getStatement() — sari transactions show karo, (2) PremiumAccount extend karo BankAccount se — higher withdrawal limit, cashback feature, (3) Ek ProductManager class banao: products array, addProduct(), removeProduct(), searchProduct(query), getByCategory(), getTotalValue(), (4) Destructuring practice: ek nested API response object banao aur usme se data destructure karo (name, address.city, scores[0]).',
        description_en: 'Practice OOP: (1) Build a BankAccount class with: balance, owner, transactions array. Methods: deposit(amount), withdraw(amount) (check balance), getStatement() (show all transactions), (2) Extend BankAccount with a PremiumAccount — higher withdrawal limit, cashback feature, (3) Build a ProductManager class: products array, addProduct(), removeProduct(), searchProduct(query), getByCategory(), getTotalValue(), (4) Destructuring practice: create a nested API response object and destructure data from it (name, address.city, scores[0]).',
        hint: 'BankAccount: constructor mein this.balance=0, this.transactions=[]. deposit: balance badhaao, transaction push karo. withdraw: if(amount > this.balance) throw error. Inheritance: class Premium extends BankAccount { constructor(owner) { super(owner); this.cashbackRate = 0.02; } }',
        hint_en: 'BankAccount: set this.balance=0, this.transactions=[] in constructor. deposit: increase balance, push transaction. withdraw: if(amount > this.balance) throw error. Inheritance: class Premium extends BankAccount { constructor(owner) { super(owner); this.cashbackRate = 0.02; } }',
      },
      quiz: [
        {
          q: 'JavaScript class mein this kya refer karta hai?',
          options: ['Global window object', 'Class ka current instance — jis object pe method call hua hai', 'Parent class', 'HTML document'],
          correct: 1,
          explanation: 'this = current instance of the class. Jab new Student("Rahul") karte ho toh this = woh specific Rahul object. Arrow functions mein this lexically bind hota hai (enclosing scope ka this). Regular methods mein this = calling object.',
          q_en: 'What does this refer to inside a JavaScript class?',
          options_en: ['The global window object', 'The current instance of the class — the object on which the method was called', 'The parent class', 'The HTML document'],
          explanation_en: 'this = the current instance of the class. When you do new Student("Rahul"), this = that specific Rahul object. In arrow functions, this is lexically bound (from the enclosing scope). In regular methods, this = the calling object.',
        },
        {
          q: 'extends aur super kya karte hain?',
          options: ['CSS properties hain', 'extends = ek class ko doosri se inherit karo, super() = parent class constructor call karo', 'Loops hain', 'Array methods hain'],
          correct: 1,
          explanation: 'extends: class B extends A matlab B, A ki saari properties aur methods inherit karta hai. super(): child constructor mein parent constructor call karo — zaruri hai jab child class mein constructor define karo. super.method() se parent ke overridden methods call kar sakte ho.',
          q_en: 'What do extends and super do?',
          options_en: ['They are CSS properties', 'extends = inherit from another class, super() = call the parent constructor', 'They are loops', 'They are array methods'],
          explanation_en: 'extends: class B extends A means B inherits all of A\'s properties and methods. super(): call the parent constructor inside the child constructor — required when you define a constructor in a child class. super.method() calls overridden methods from the parent.',
        },
        {
          q: 'Destructuring ka main faida kya hai?',
          options: ['Objects delete karta hai', 'Object ya array se ek hi line mein multiple variables extract kar sakte ho — clean aur readable code', 'Sirf arrays ke liye hai', 'Functions faster ho jaate hain'],
          correct: 1,
          explanation: 'Destructuring = clean code. const { name, age } = user ek hi line mein dono variables extract karta hai. Bina destructuring: const name = user.name; const age = user.age; — zyada verbose. Default values, renaming, nested destructuring bhi possible hai.',
          q_en: 'What is the main benefit of destructuring?',
          options_en: ['It deletes objects', 'You can extract multiple variables from an object or array in one line — clean and readable code', 'It only works for arrays', 'Functions run faster'],
          explanation_en: 'Destructuring = clean code. const { name, age } = user extracts both variables in one line. Without destructuring: const name = user.name; const age = user.age; — much more verbose. Default values, renaming, and nested destructuring are also possible.',
        },
      ],
    },

    {
      id: 'html-w11-s2',
      title: 'JavaScript Modules aur Code Organization',
      title_en: 'JavaScript Modules and Code Organization',
      emoji: '📦',
      content: `## Modules — Code Ko Organize Karo!

### ES Modules — import / export

\`\`\`javascript
// ── utils.js ─────────────────────────────────────────
// Named exports
export const API_URL = 'https://api.studyearn.com';

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatNumber(n) {
  return new Intl.NumberFormat('en-IN').format(n);
}

export const gradeEmoji = { A: '🌟', B: '😊', C: '😐', F: '😢' };

// Default export — ek file mein sirf ek
export default class Storage {
  static set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  static get(key, def = null) {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : def;
  }
  static remove(key) { localStorage.removeItem(key); }
}

// ── main.js ──────────────────────────────────────────
// Named imports
import { API_URL, formatDate, formatNumber } from './utils.js';

// Default import
import Storage from './utils.js';

// Import all
import * as Utils from './utils.js';

// Use karo
console.log(formatDate('2024-01-15'));  // "15 Jan 2024"
Storage.set('user', { name: 'Rahul' });
const user = Storage.get('user');
\`\`\`

### Module Pattern — Private aur Public

\`\`\`javascript
// IIFE — Immediately Invoked Function Expression
const TodoModule = (() => {
  // Private — bahar se access nahi
  let todos = [];
  let nextId = 1;

  function validate(text) {
    return text && text.trim().length >= 2;
  }

  // Public API — return karke expose karo
  return {
    add(text) {
      if (!validate(text)) throw new Error('Invalid todo text');
      const todo = { id: nextId++, text: text.trim(), done: false };
      todos.push(todo);
      return todo;
    },
    toggle(id) {
      const todo = todos.find(t => t.id === id);
      if (todo) todo.done = !todo.done;
    },
    getAll() { return [...todos]; },  // Copy return karo
    getActive() { return todos.filter(t => !t.done); },
    getCount() { return { total: todos.length, done: todos.filter(t => t.done).length }; },
  };
})();

TodoModule.add('HTML seekhna');
TodoModule.add('CSS master karo');
TodoModule.toggle(1);
console.log(TodoModule.getCount());  // { total: 2, done: 1 }
\`\`\`

### Useful Patterns

\`\`\`javascript
// Observer Pattern — Event System
class EventEmitter {
  constructor() { this.events = {}; }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return this;
  }

  emit(event, data) {
    (this.events[event] || []).forEach(fn => fn(data));
  }

  off(event, listener) {
    this.events[event] = (this.events[event] || []).filter(fn => fn !== listener);
  }
}

const app = new EventEmitter();
app.on('login',  user => console.log(\`\${user.name} logged in\`));
app.on('login',  user => { /* update UI */ });
app.emit('login', { name: 'Rahul', id: 1 });

// Factory Pattern
function createUser(type, data) {
  const base = { ...data, createdAt: new Date().toISOString() };
  if (type === 'premium') return { ...base, plan: 'pro', xpMultiplier: 2 };
  if (type === 'admin')   return { ...base, permissions: ['all'] };
  return { ...base, plan: 'free', xpMultiplier: 1 };
}

// Singleton — ek hi instance
class AppConfig {
  static instance = null;
  constructor() {
    if (AppConfig.instance) return AppConfig.instance;
    this.theme = 'dark';
    this.lang  = 'en';
    AppConfig.instance = this;
  }
}
const config1 = new AppConfig();
const config2 = new AppConfig();
console.log(config1 === config2);  // true — same instance!
\`\`\`

### Error Handling — Robust Code

\`\`\`javascript
// try/catch/finally
async function fetchUserData(userId) {
  try {
    const res = await fetch(\`/api/users/\${userId}\`);

    if (!res.ok) {
      throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Network error — check connection');
    } else {
      console.error('API error:', error.message);
    }
    throw error;  // Re-throw agar caller bhi handle kare

  } finally {
    // Hamesha run hoga — cleanup
    hideLoadingSpinner();
  }
}

// Custom errors
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name  = 'ValidationError';
    this.field = field;
  }
}

function validateScore(score) {
  if (typeof score !== 'number') throw new ValidationError('score', 'Score must be a number');
  if (score < 0 || score > 100)  throw new ValidationError('score', 'Score must be 0-100');
  return true;
}

try {
  validateScore(150);
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(\`Field '\${e.field}': \${e.message}\`);
  }
}
\`\`\``,
      content_en: `## Modules — Organise Your Code!

### ES Modules

\`\`\`javascript
// utils.js — named exports
export const API_URL = 'https://api.studyearn.com';
export function formatDate(d) { return new Date(d).toLocaleDateString(); }
export default class Storage {
  static set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  static get(k, def = null) { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; }
}

// main.js — imports
import { API_URL, formatDate } from './utils.js';
import Storage from './utils.js';
import * as Utils from './utils.js';
\`\`\`

### Module Pattern (IIFE)

\`\`\`javascript
const TodoModule = (() => {
  let todos = [];  // private

  return {  // public API
    add(text)    { todos.push({ id: Date.now(), text, done: false }); },
    toggle(id)   { const t = todos.find(t => t.id === id); if(t) t.done = !t.done; },
    getAll()     { return [...todos]; },
  };
})();
\`\`\`

### Error Handling

\`\`\`javascript
async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error('Fetch failed:', err.message);
    throw err;
  } finally {
    hideSpinner();  // always runs
  }
}

class ValidationError extends Error {
  constructor(field, msg) { super(msg); this.name = 'ValidationError'; this.field = field; }
}
\`\`\``,
      codeExample: `<!DOCTYPE html>
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
        'TodoModule.getAll():\n' +
        JSON.stringify(todos, null, 2) +
        '\n\nCount: ' + JSON.stringify({ total, done });
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
          '<span class="ok">✅ Valid score: ' + score + '\n\ntry { validateScore(' + score + '); }\n// No error!</span>';
      } catch (e) {
        document.getElementById('errorOutput').innerHTML =
          '<span class="err">❌ ' + e.name + ' on field \'' + e.field + '\':\n' + e.message + '\n\ntry { validateScore(' + score + '); }\ncatch (e) {\n  // e.name = "' + e.name + '"\n  // e.field = "' + e.field + '"\n  // e.message = "' + e.message + '"\n}</span>';
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
          '<span class="err">❌ Error caught!\n\ntry {\n  const res = await fetch(badUrl);\n  if (!res.ok) throw new Error("HTTP " + res.status);\n} catch (e) {\n  // e.message = "' + e.message + '"\n  console.error("Fetch failed:", e.message);\n}</span>';
      }
    }
  </script>
</body>
</html>`,
      codeExample_en: `<!-- See above — English content is integrated -->`,
      task: {
        description: 'Modules aur patterns practice karo: (1) Ek CartModule banao (IIFE pattern) with: items array (private), addItem(), removeItem(), getTotal(), getItemCount(), clearCart() methods, (2) Ek EventEmitter use karke shopping cart events emit karo: item_added, item_removed, cart_cleared — multiple listeners attach karo, (3) Ek form validation system banao with custom errors: RequiredError, MinLengthError, EmailError — each has field property, (4) Ek singleton AppState class banao: current user, cart items, theme — ek hi instance poori app mein.',
        description_en: 'Practice modules and patterns: (1) Build a CartModule (IIFE pattern) with: items array (private), addItem(), removeItem(), getTotal(), getItemCount(), clearCart() methods, (2) Use an EventEmitter to emit shopping cart events: item_added, item_removed, cart_cleared — attach multiple listeners, (3) Build a form validation system with custom errors: RequiredError, MinLengthError, EmailError — each with a field property, (4) Build a singleton AppState class: current user, cart items, theme — only one instance across the whole app.',
        hint: 'CartModule IIFE: const CartModule = (() => { let items = []; return { addItem(p) { items.push(p); }, getTotal() { return items.reduce((s,i) => s+i.price, 0); } }; })(). Custom error: class EmailError extends Error { constructor(field) { super("Invalid email"); this.field = field; } }',
        hint_en: 'CartModule IIFE: const CartModule = (() => { let items = []; return { addItem(p) { items.push(p); }, getTotal() { return items.reduce((s,i) => s+i.price, 0); } }; })(). Custom error: class EmailError extends Error { constructor(field) { super("Invalid email"); this.field = field; } }',
      },
      quiz: [
        {
          q: 'export default aur named export mein kya fark hai?',
          options: ['Koi fark nahi', 'export default = ek file mein sirf ek, import karte waqt koi bhi naam de sakte ho. Named export = multiple ho sakte hain, import mein exact naam chahiye (curly braces)', 'default export faster hai', 'Named exports deprecated hain'],
          correct: 1,
          explanation: 'export default: import Storage from "./utils.js" — koi bhi naam de sakte ho. Named export: import { formatDate, API_URL } from "./utils.js" — exact naam chahiye (rename bhi kar sakte ho: import { formatDate as fd } from "./utils.js"). Ek file mein ek default aur multiple named exports ho sakte hain.',
          q_en: 'What is the difference between export default and named exports?',
          options_en: ['No difference', 'export default = only one per file, any name when importing. Named export = multiple allowed, exact name required with curly braces', 'Default exports are faster', 'Named exports are deprecated'],
          explanation_en: 'export default: import Storage from "./utils.js" — any name is fine. Named export: import { formatDate, API_URL } from "./utils.js" — exact name required (you can also rename: import { formatDate as fd } from "./utils.js"). A file can have one default and multiple named exports.',
        },
        {
          q: 'try/catch/finally mein finally kab run hota hai?',
          options: ['Sirf success pe', 'Sirf error pe', 'Hamesha — error aaye ya nahi, even agar catch mein return ho', 'Kabhi nahi'],
          correct: 2,
          explanation: 'finally hamesha run hota hai — success ho ya error. Even agar try ya catch mein return statement ho. Use case: cleanup code jo hamesha run hona chahiye — jaise loading spinner hide karna, database connection close karna, file handles release karna.',
          q_en: 'When does the finally block run in try/catch/finally?',
          options_en: ['Only on success', 'Only on error', 'Always — whether or not there is an error, even if there is a return in catch', 'Never'],
          explanation_en: 'finally always runs — success or error. Even if there is a return statement in try or catch. Use case: cleanup code that must always run — like hiding a loading spinner, closing a database connection, releasing file handles.',
        },
        {
          q: 'IIFE (Immediately Invoked Function Expression) kyun use karte hain?',
          options: ['Faster hai', 'Private scope create karne ke liye — variables bahar se accessible nahi hote, global namespace pollute nahi hota', 'Sirf old JavaScript mein', 'Async functions ke liye'],
          correct: 1,
          explanation: 'IIFE: (() => { /* code */ })() — function immediately run hoti hai aur ek private scope create karti hai. Variables bahar leak nahi hote. Module pattern mein private state aur public API expose karne ke liye use hota hai. Modern JS mein ES Modules yahi kaam karte hain.',
          q_en: 'Why do we use an IIFE (Immediately Invoked Function Expression)?',
          options_en: ['It is faster', 'To create a private scope — variables are not accessible from outside, global namespace is not polluted', 'Only in old JavaScript', 'For async functions'],
          explanation_en: 'IIFE: (() => { /* code */ })() — the function runs immediately and creates a private scope. Variables do not leak outside. Used in the module pattern to have private state and expose a public API. In modern JS, ES Modules serve the same purpose.',
        },
      ],
    },

    {
      id: 'html-w11-s3',
      title: 'JavaScript Performance aur Best Practices',
      title_en: 'JavaScript Performance and Best Practices',
      emoji: '⚡',
      content: `## Fast aur Clean JavaScript!

### Performance Tips

\`\`\`javascript
// ── 1. DOM Batch Updates ─────────────────────────────────
// ❌ Bad — har iteration mein DOM reflow
items.forEach(item => {
  document.querySelector('#list').innerHTML += \`<li>\${item}</li>\`;
});

// ✅ Good — ek baar DOM update karo
const html = items.map(item => \`<li>\${item}</li>\`).join('');
document.querySelector('#list').innerHTML = html;

// ✅ Even better — DocumentFragment
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item;
  fragment.appendChild(li);
});
document.querySelector('#list').appendChild(fragment);

// ── 2. Event Delegation ──────────────────────────────────
// ❌ Bad — 100 buttons pe 100 listeners
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', deleteItem);
});

// ✅ Good — ek listener parent pe
document.querySelector('#list').addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    deleteItem(e.target.dataset.id);
  }
});

// ── 3. Debounce — Search Input ───────────────────────────
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Har keystroke pe API call mat karo!
const searchAPI = debounce(async (query) => {
  const data = await fetch(\`/api/search?q=\${query}\`).then(r => r.json());
  renderResults(data);
}, 300);  // 300ms baad call

input.addEventListener('input', e => searchAPI(e.target.value));

// ── 4. Throttle — Scroll Events ──────────────────────────
function throttle(fn, limit) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) { lastCall = now; fn(...args); }
  };
}

window.addEventListener('scroll', throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100));  // Max har 100ms

// ── 5. Memoization — Cache Results ───────────────────────
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalc = memoize((n) => {
  console.log('Calculating...');
  return n * n * n;
});

expensiveCalc(5);  // "Calculating..." → 125
expensiveCalc(5);  // Cache hit! → 125 (no calculation)
\`\`\`

### Clean Code Principles

\`\`\`javascript
// ── Meaningful Names ──────────────────────────────────────
// ❌ Bad
const d = new Date();
const x = users.filter(u => u.a > 18);
function fn(a, b) { return a + b; }

// ✅ Good
const currentDate = new Date();
const adultUsers  = users.filter(user => user.age > 18);
function addNumbers(first, second) { return first + second; }

// ── Single Responsibility ─────────────────────────────────
// ❌ Bad — ek function sab kuch karta hai
function processUser(user) {
  // Validate
  if (!user.email.includes('@')) throw new Error('Bad email');
  // Save to DB
  db.save(user);
  // Send email
  emailService.send(user.email, 'Welcome!');
  // Log
  console.log('User created:', user.name);
}

// ✅ Good — har function ek kaam
function validateUser(user)     { if (!user.email.includes('@')) throw new Error('Bad email'); }
function saveUser(user)         { return db.save(user); }
function sendWelcomeEmail(user) { return emailService.send(user.email, 'Welcome!'); }

async function createUser(data) {
  validateUser(data);
  const user = await saveUser(data);
  await sendWelcomeEmail(user);
  return user;
}

// ── Guard Clauses — Nesting Kam Karo ─────────────────────
// ❌ Bad — deep nesting
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.total > 0) {
        // actual logic
        return processPayment(order);
      }
    }
  }
}

// ✅ Good — early returns
function processOrder(order) {
  if (!order)                   return null;
  if (order.items.length === 0) return { error: 'Empty cart' };
  if (order.total <= 0)         return { error: 'Invalid total' };
  return processPayment(order);
}
\`\`\``,
      content_en: `## Fast and Clean JavaScript!

### Performance

\`\`\`javascript
// Batch DOM updates — always build HTML string first, then set once
const html = items.map(item => \`<li>\${item}</li>\`).join('');
document.querySelector('#list').innerHTML = html;

// Event delegation — one listener instead of many
document.querySelector('#list').addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) deleteItem(e.target.dataset.id);
});

// Debounce — for search inputs
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}
const search = debounce(query => fetchResults(query), 300);

// Throttle — for scroll events
function throttle(fn, limit) {
  let last = 0;
  return (...args) => { const now = Date.now(); if (now - last >= limit) { last = now; fn(...args); } };
}

// Memoize — cache expensive results
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const r = fn(...args); cache.set(key, r); return r;
  };
}
\`\`\`

### Clean Code

\`\`\`javascript
// Meaningful names
const adultUsers = users.filter(user => user.age > 18);

// Single responsibility — one function, one job
function validateUser(user)    { /* only validation */ }
function saveUser(user)        { /* only saving */ }
function sendWelcomeEmail(user){ /* only email */ }

// Guard clauses — reduce nesting
function processOrder(order) {
  if (!order)              return null;
  if (!order.items.length) return { error: 'Empty cart' };
  return processPayment(order);
}
\`\`\``,
      codeExample: `<!DOCTYPE html>
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
        'API called with: "' + query + '"\n' +
        'Simulating fetch /api/search?q=' + encodeURIComponent(query) + '\n' +
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
          '// Event delegation!\n' +
          '// Click detected on .del-item\n' +
          '// Item #' + id + ' deleted\n' +
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
</html>`,
      codeExample_en: `<!-- See above — English content is integrated -->`,
      task: {
        description: 'Performance optimization practice karo: (1) Ek "Infinite Scroll" banao — 20 items initially dikhao, scroll pe 20 aur load karo (IntersectionObserver use karo), (2) Search feature mein debounce add karo (300ms delay), (3) Event delegation use karke ek expandable FAQ section banao — sirf parent pe ek listener, (4) Memoize ek fibonacci function — pehle call pe slow, baad mein instant. Before/after timing dikhao.',
        description_en: 'Practise performance optimisation: (1) Build "Infinite Scroll" — show 20 items initially, load 20 more on scroll (use IntersectionObserver), (2) Add debounce to a search feature (300ms delay), (3) Use event delegation to build an expandable FAQ section — only one listener on the parent, (4) Memoize a fibonacci function — slow on the first call, instant afterwards. Show before/after timing.',
        hint: 'IntersectionObserver: const obs = new IntersectionObserver(entries => { if(entries[0].isIntersecting) loadMore(); }); obs.observe(sentinel). Debounce: clearTimeout re-schedules timer. Memoize: Map ke saath cache — Map faster hai object se large datasets pe.',
        hint_en: 'IntersectionObserver: const obs = new IntersectionObserver(entries => { if(entries[0].isIntersecting) loadMore(); }); obs.observe(sentinel). Debounce: clearTimeout re-schedules the timer. Memoize: cache with a Map — Map is faster than an object for large datasets.',
      },
      quiz: [
        {
          q: 'Debounce aur Throttle mein kya fark hai?',
          options: ['Same hain', 'Debounce = last call ke baad delay karo (search input). Throttle = har N ms mein max ek call (scroll events).', 'Throttle = search ke liye', 'Debounce faster hai'],
          correct: 1,
          explanation: 'Debounce: user type karna band kare, phir N ms baad call karo — agar phir type kiya toh timer reset. Use: search input, window resize handler. Throttle: har N ms mein maximum ek call hogi — continuous execution allowed but rate limited. Use: scroll events, mousemove, game loop.',
          q_en: 'What is the difference between debounce and throttle?',
          options_en: ['They are the same', 'Debounce = delay after the last call (search input). Throttle = max one call every N ms (scroll events).', 'Throttle is for search', 'Debounce is faster'],
          explanation_en: 'Debounce: wait until the user stops typing, then call after N ms — if they type again, reset the timer. Use: search input, window resize handler. Throttle: maximum one call per N ms — continuous execution allowed but rate-limited. Use: scroll events, mousemove, game loops.',
        },
        {
          q: 'Event delegation kyun better hai individual listeners se?',
          options: ['Nahi hai better', 'Memory efficient — 100 items pe 100 listeners lagane ki jagah 1 parent listener. Dynamically added elements pe bhi kaam karta hai!', 'Faster DOM manipulation ke liye', 'CSS ke saath better kaam karta hai'],
          correct: 1,
          explanation: 'Event delegation: events bubble up karte hain (child → parent). Parent pe ek listener lagao, e.target.matches() se specific child check karo. Benefits: (1) Less memory, (2) Dynamic elements pe bhi kaam karta hai (bina re-attaching listeners), (3) Simpler code — ek jagah handle karo.',
          q_en: 'Why is event delegation better than individual listeners?',
          options_en: ['It is not better', 'Memory efficient — one parent listener instead of 100 listeners for 100 items. Also works on dynamically added elements!', 'For faster DOM manipulation', 'It works better with CSS'],
          explanation_en: 'Event delegation: events bubble up (child → parent). Attach one listener on the parent and check for specific children with e.target.matches(). Benefits: (1) Less memory, (2) Works on dynamically added elements (no re-attaching listeners), (3) Simpler code — handle everything in one place.',
        },
        {
          q: 'DOM mein innerHTML += kyun slow hai?',
          options: ['No reason', 'Har += pe browser poori DOM serialize karta hai string mein, parse karta hai, aur re-render karta hai — N items pe N baar ye kaam hota hai!', 'innerHTML deprecated hai', 'String concatenation slow hai'],
          correct: 1,
          explanation: 'innerHTML +=: browser existing HTML ko string mein convert karta hai + naya HTML add karta hai + poora DOM re-parse karta hai + re-render karta hai. 100 items ke liye yeh 100 baar hoga — O(n²) complexity! Better: sab HTML pehle string mein banao (O(n)), phir ek baar innerHTML set karo.',
          q_en: 'Why is innerHTML += slow in the DOM?',
          options_en: ['No reason', 'Each += makes the browser serialise the entire DOM to a string, parse the new HTML, and re-render — this happens N times for N items, O(n²)!', 'innerHTML is deprecated', 'String concatenation is slow'],
          explanation_en: 'innerHTML +=: the browser converts existing HTML to a string + appends new HTML + re-parses the whole DOM + re-renders. For 100 items, this happens 100 times — O(n²) complexity! Better: build all HTML as a string first (O(n)), then set innerHTML once.',
        },
      ],
    },

    {
      id: 'html-w11-s4',
      title: 'Week 11 Project — Notes App with Cloud Sync',
      title_en: 'Week 11 Project — Notes App with Cloud Sync',
      emoji: '📝',
      content: `## Week 11 Project — Professional Notes App!

Is hafte seekha:
- OOP — Classes, inheritance, destructuring
- Modules — import/export, IIFE, patterns
- Error handling — try/catch, custom errors
- Performance — debounce, throttle, batch DOM

Ab ek **full-featured Notes App** banao!

### App Architecture:

\`\`\`javascript
// ── State (Module Pattern) ────────────────────────────────
const NotesStore = (() => {
  let notes     = [];
  let listeners = [];

  return {
    // Get
    getAll()            { return [...notes]; },
    getById(id)         { return notes.find(n => n.id === id); },
    search(q)           { return notes.filter(n => n.title.includes(q) || n.content.includes(q)); },
    getByTag(tag)       { return notes.filter(n => n.tags.includes(tag)); },

    // Mutate
    add(data)           { const n = Note.create(data); notes.unshift(n); this.notify(); return n; },
    update(id, changes) { notes = notes.map(n => n.id===id ? {...n,...changes, updatedAt: new Date()} : n); this.notify(); },
    delete(id)          { notes = notes.filter(n => n.id !== id); this.notify(); },

    // Persistence
    save()              { localStorage.setItem('notes', JSON.stringify(notes)); },
    load()              { notes = JSON.parse(localStorage.getItem('notes') || '[]'); },

    // Observer
    subscribe(fn)       { listeners.push(fn); return () => listeners = listeners.filter(l => l !== fn); },
    notify()            { this.save(); listeners.forEach(fn => fn(notes)); },
  };
})();

// ── Note Class ────────────────────────────────────────────
class Note {
  static create({ title, content, tags = [], color = '#6366f1' }) {
    if (!title?.trim()) throw new ValidationError('title', 'Title is required');
    return {
      id:        Date.now().toString(),
      title:     title.trim(),
      content:   content?.trim() || '',
      tags:      Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean),
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned:    false,
    };
  }

  static getExcerpt(note, maxLen = 100) {
    const text = note.content.replace(/<[^>]+>/g, '');
    return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
  }
}

// ── UI Controller ─────────────────────────────────────────
const UI = {
  renderNotes(notes) {
    const pinned   = notes.filter(n => n.pinned);
    const unpinned = notes.filter(n => !n.pinned);
    const sorted   = [...pinned, ...unpinned];

    if (sorted.length === 0) {
      grid.innerHTML = '<div class="empty">📝 Koi note nahi — banao pehla note!</div>';
      return;
    }

    grid.innerHTML = sorted.map(n => NoteCard.render(n)).join('');
  },
};
\`\`\`

### Features Banao:

\`\`\`
✅ Notes add/edit/delete
✅ Rich text area
✅ Color coding (6 colors)
✅ Tags system
✅ Pin important notes
✅ Search (debounced, 300ms)
✅ localStorage sync
✅ Empty state
✅ Note count
\`\`\``,
      content_en: `## Week 11 Project — Professional Notes App!

This week covered:
- OOP — Classes, inheritance, destructuring
- Modules — import/export, IIFE, patterns
- Error handling — try/catch, custom errors
- Performance — debounce, throttle, batch DOM

Now build a **full-featured Notes App**!

### Architecture:

\`\`\`javascript
const NotesStore = (() => {
  let notes = [], listeners = [];
  return {
    getAll()     { return [...notes]; },
    search(q)    { return notes.filter(n => n.title.includes(q)); },
    add(data)    { notes.unshift(Note.create(data)); this.notify(); },
    update(id,c) { notes = notes.map(n => n.id===id ? {...n,...c} : n); this.notify(); },
    delete(id)   { notes = notes.filter(n => n.id !== id); this.notify(); },
    save()       { localStorage.setItem('notes', JSON.stringify(notes)); },
    load()       { notes = JSON.parse(localStorage.getItem('notes') || '[]'); },
    subscribe(fn){ listeners.push(fn); },
    notify()     { this.save(); listeners.forEach(fn => fn(notes)); },
  };
})();
\`\`\``,
      codeExample: `<!DOCTYPE html>
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
        return \`<div class="note-card" style="background:\${n.color};">
          \${n.pinned ? '<span class="pinned-badge">📌</span>' : ''}
          <div class="title">\${n.title}</div>
          <div class="excerpt">\${Note.excerpt(n)}</div>
          \${tagsHtml ? '<div style="margin-bottom:8px;">' + tagsHtml + '</div>' : ''}
          <div class="meta">
            <span>\${date}</span>
            <div>
              <button class="pin-btn" onclick="event.stopPropagation(); Store.pin('\${n.id}')" title="Pin">\${n.pinned ? '📌' : '📍'}</button>
              <button class="del-card-btn" onclick="event.stopPropagation(); if(confirm('Delete?')) Store.delete('\${n.id}')" title="Delete">🗑️</button>
            </div>
          </div>
        </div>\`;
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
</html>`,
      codeExample_en: `<!-- See above — English content is integrated -->`,
      task: {
        description: 'Notes App ko aur powerful banao: (1) Note edit functionality add karo — note click karne pe form mein preload ho, save pe update ho, (2) Sort options: Newest, Oldest, Alphabetical (A-Z), Pinned First, (3) Tag filter — sidebar mein sab tags dikho, click karne pe filter ho, (4) Export feature: "Export All" button se JSON file download ho (Blob API use karo), (5) Import feature: JSON file upload se notes restore ho, (6) Notes count by tag dikhao.',
        description_en: 'Make the Notes App more powerful: (1) Add note editing — click a note to preload the form, save to update it, (2) Sort options: Newest, Oldest, Alphabetical (A-Z), Pinned First, (3) Tag filter — show all tags in a sidebar, click to filter by tag, (4) Export: "Export All" button downloads a JSON file (use the Blob API), (5) Import: upload a JSON file to restore notes, (6) Show note counts by tag.',
        hint: 'Edit: Store.update(id, changes) method banao. Sort: [...notes].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)). Export: const blob = new Blob([JSON.stringify(notes)], {type:"application/json"}); const url = URL.createObjectURL(blob); link.click(). Import: FileReader API use karo.',
        hint_en: 'Edit: create a Store.update(id, changes) method. Sort: [...notes].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)). Export: const blob = new Blob([JSON.stringify(notes)], {type:"application/json"}); const url = URL.createObjectURL(blob); link.click(). Import: use the FileReader API.',
      },
      quiz: [
        {
          q: 'Module pattern (IIFE) mein private state kyun useful hai?',
          options: ['Faster hai', 'Bahar se accidentally modify nahi ho sakta — encapsulation ensures data integrity aur predictable behavior', 'Memory save hoti hai', 'CSS se better integrate hota hai'],
          correct: 1,
          explanation: 'Private state = encapsulation. Agar notes array directly accessible hoti toh koi bhi notes.push({}) kar sakta tha bina observers notify kiye, bina localStorage save kiye. Module pattern ensure karta hai ki sirf defined methods se data change ho — jaise getters/setters in OOP.',
          q_en: 'Why is private state useful in the module pattern (IIFE)?',
          options_en: ['It is faster', 'It cannot be accidentally modified from outside — encapsulation ensures data integrity and predictable behaviour', 'It saves memory', 'It integrates better with CSS'],
          explanation_en: 'Private state = encapsulation. If the notes array were directly accessible, anyone could do notes.push({}) without notifying observers or saving to localStorage. The module pattern ensures data only changes through defined methods — just like getters/setters in OOP.',
        },
        {
          q: 'Observer pattern (subscribe/notify) JavaScript mein kyun popular hai?',
          options: ['Code short hota hai', 'Loose coupling — producer (Store) aur consumer (UI) ek doosre ko nahi jaante. Nayi features add karna easy hai bina existing code change kiye.', 'Faster hai', 'Only for games'],
          correct: 1,
          explanation: 'Observer = pub/sub pattern. Store sirf notify() call karta hai — koi bhi subscriber alag alag react kar sakta hai (UI update, analytics log, localStorage save). Nayi feature add karni ho (e.g. sync to server) toh sirf ek aur subscriber add karo — baaki code unchanged.',
          q_en: 'Why is the observer pattern (subscribe/notify) popular in JavaScript?',
          options_en: ['It makes code shorter', 'Loose coupling — the producer (Store) and consumer (UI) do not know about each other. Easy to add new features without changing existing code.', 'It is faster', 'Only for games'],
          explanation_en: 'Observer = pub/sub pattern. The Store only calls notify() — each subscriber can react differently (update UI, log analytics, save to localStorage). To add a new feature (e.g. sync to server), just add another subscriber — all other code stays unchanged.',
        },
        {
          q: 'Custom Error classes kyun banate hain?',
          options: ['Default errors kaam nahi karte', 'Extra information attach kar sakte hain (field name, error code) aur instanceof se specific errors catch kar sakte hain', 'Faster hain', 'Console mein better dikhte hain'],
          correct: 1,
          explanation: 'Custom errors: class ValidationError extends Error { constructor(field, msg) { super(msg); this.field = field; } }. Benefits: (1) Extra context (kaunse field mein error hai), (2) instanceof se differentiate kar sakte ho: catch(e) { if(e instanceof ValidationError) showFieldError(e.field); }, (3) Better debugging — error type clearly indicate hoti hai.',
          q_en: 'Why do we create custom Error classes?',
          options_en: ['Default errors do not work', 'You can attach extra information (field name, error code) and catch specific errors with instanceof', 'They are faster', 'They look better in the console'],
          explanation_en: 'Custom errors: class ValidationError extends Error { constructor(field, msg) { super(msg); this.field = field; } }. Benefits: (1) Extra context (which field has the error), (2) Differentiate with instanceof: catch(e) { if(e instanceof ValidationError) showFieldError(e.field); }, (3) Better debugging — the error type is clearly indicated.',
        },
      ],
    },
  ],
};