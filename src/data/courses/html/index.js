/**
 * StudyEarn AI — HTML Course
 * src/data/courses/html/index.js
 *
 * Month 1 (Weeks 1-4): Pure HTML — structure, forms, semantics
 * Month 2 (Weeks 5-8): CSS — styling, layout, responsive design
 * Month 3 (Weeks 9-12): Advanced — animations, projects (coming soon)
 *
 * Weeks 1-4 use translations_en.js (separate EN file)
 * Weeks 5+ have EN content built directly into week files
 */

import { HTML_WEEK_1 } from './week1.js';
import { HTML_WEEK_2 } from './week2.js';
import { HTML_WEEK_3 } from './week3.js';
import { HTML_WEEK_4 } from './week4.js';
import { HTML_WEEK_5 } from './week5.js';
import { HTML_WEEK_6 } from './week6.js';
import { HTML_ALL_EN, applyEnglishTranslations } from './translations_en.js';

export const HTML_COURSE = {
  language: 'html',
  languageName: 'HTML + CSS',
  emoji: '🌐',
  tagline: 'Web ka Skeleton — Zero se Beautiful Webpage',
  totalWeeks: 12,
  difficulty: 'Absolute Beginner',
  description: 'HTML structure deta hai, CSS beauty deta hai! Google, YouTube, Instagram — sab yahan se shuru hote hain.',
  weeks: [],
};

// Merge all available weeks
HTML_COURSE.weeks = [
  HTML_WEEK_1,
  HTML_WEEK_2,
  HTML_WEEK_3,
  HTML_WEEK_4,
  HTML_WEEK_5,
  HTML_WEEK_6,
  // Weeks 7-12 will be added as content is created
];

// Apply English translations to Weeks 1-4 (from translations_en.js)
// Weeks 5+ already have EN content built into the week files
HTML_COURSE.weeks = applyEnglishTranslations(HTML_COURSE.weeks, HTML_ALL_EN);

export default HTML_COURSE;