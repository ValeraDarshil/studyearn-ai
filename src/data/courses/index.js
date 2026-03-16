/**
 * StudyEarn AI — CodeLearn Course Registry
 * src/data/courses/index.js
 *
 * Course structure:
 *   src/data/courses/
 *   ├── index.js          ← this file (registry + loader)
 *   ├── python/
 *   │   ├── index.js      ← PYTHON_COURSE (all weeks merged)
 *   │   ├── week1_4.js    ← Weeks 1-4
 *   │   ├── week5.js … week12.js
 *   │   └── translations_en.js
 *   ├── html/
 *   │   ├── index.js      ← HTML_COURSE
 *   │   ├── week1.js … week4.js
 *   ├── css/
 *   │   └── index.js      ← CSS_COURSE (coming soon)
 *   ├── javascript/
 *   │   └── index.js      ← JS_COURSE (coming soon)
 *   └── c/
 *       └── index.js      ← C_COURSE (coming soon)
 */

// ── Course Registry — metadata for all 5 languages ────────────
export const COURSE_REGISTRY = [
  {
    id: 'python',
    name: 'Python',
    emoji: '🐍',
    tagline: 'AI, Web, Data Science — everything',
    difficulty: 'Beginner Friendly',
    color: 'from-yellow-500 to-green-500',
    bgClass: 'bg-yellow-500/10 border-yellow-500/30',
    textClass: 'text-yellow-400',
    badgeClass: 'bg-yellow-500/20 text-yellow-300',
    topics: [
      'Variables & Data Types', 'Loops & Functions', 'OOP',
      'File Handling', 'APIs & Web Scraping', 'Data Analysis',
      'Django Web Framework', 'ML Basics',
    ],
    totalWeeks: 12,
    totalSections: 48,
    jobRoles: ['Python Developer', 'Data Scientist', 'AI Engineer', 'Backend Developer'],
    status: 'available',
  },
  {
    id: 'html',
    name: 'HTML',
    emoji: '🌐',
    tagline: 'Web ka skeleton — Zero se webpage banao!',
    difficulty: 'Absolute Beginner',
    color: 'from-orange-500 to-red-500',
    bgClass: 'bg-orange-500/10 border-orange-500/30',
    textClass: 'text-orange-400',
    badgeClass: 'bg-orange-500/20 text-orange-300',
    topics: [
      'Tags & Elements', 'Forms', 'Tables', 'Semantic HTML',
      'Accessibility', 'SEO Basics', 'HTML5 APIs', 'Multimedia',
    ],
    totalWeeks: 12,
    totalSections: 48,
    jobRoles: ['Web Developer', 'Frontend Developer', 'UI Developer'],
    status: 'available',
  },
  {
    id: 'css',
    name: 'CSS',
    emoji: '🎨',
    tagline: 'Web ko beautiful banao',
    difficulty: 'Beginner',
    color: 'from-purple-500 to-pink-500',
    bgClass: 'bg-purple-500/10 border-purple-500/30',
    textClass: 'text-purple-400',
    badgeClass: 'bg-purple-500/20 text-purple-300',
    topics: [
      'Selectors', 'Box Model', 'Flexbox', 'Grid',
      'Animations', 'Responsive Design', 'CSS Variables', 'Tailwind',
    ],
    totalWeeks: 12,
    totalSections: 48,
    jobRoles: ['Frontend Developer', 'UI Designer', 'CSS Specialist'],
    status: 'coming_soon',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    emoji: '⚡',
    tagline: 'Web ko alive banao',
    difficulty: 'Beginner → Advanced',
    color: 'from-yellow-400 to-orange-400',
    bgClass: 'bg-yellow-400/10 border-yellow-400/30',
    textClass: 'text-yellow-300',
    badgeClass: 'bg-yellow-400/20 text-yellow-200',
    topics: [
      'DOM Manipulation', 'Events', 'Async/Await', 'APIs',
      'ES6+', 'React Basics', 'Node.js Intro',
    ],
    totalWeeks: 12,
    totalSections: 48,
    jobRoles: ['Frontend Developer', 'Full Stack Developer', 'React Developer'],
    status: 'coming_soon',
  },
  {
    id: 'c',
    name: 'C Programming',
    emoji: '⚙️',
    tagline: 'Foundation of all languages',
    difficulty: 'Intermediate',
    color: 'from-blue-600 to-cyan-500',
    bgClass: 'bg-blue-500/10 border-blue-500/30',
    textClass: 'text-blue-400',
    badgeClass: 'bg-blue-500/20 text-blue-300',
    topics: [
      'Pointers', 'Memory Management', 'Structs',
      'File I/O', 'Data Structures', 'Algorithms', 'System Programming',
    ],
    totalWeeks: 12,
    totalSections: 48,
    jobRoles: ['System Programmer', 'Embedded Developer', 'Game Developer'],
    status: 'coming_soon',
  },
];

// ── Course Loader — lazy loads from lang subfolder ─────────────
export async function loadCourse(languageId) {
  const loaders = {
    python:     () => import('./python/index.js').then(m => m.PYTHON_COURSE),
    html:       () => import('./html/index.js').then(m => m.HTML_COURSE),
    css:        () => import('./css/index.js').then(m => m.CSS_COURSE),
    javascript: () => import('./javascript/index.js').then(m => m.JS_COURSE),
    c:          () => import('./c/index.js').then(m => m.C_COURSE),
  };

  const loader = loaders[languageId];
  if (!loader) throw new Error(`Course not found: ${languageId}`);
  return loader();
}