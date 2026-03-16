/**
 * StudyEarn AI — HTML Course (HTML + CSS)
 * src/data/courses/html/index.js
 *
 * Month 1 (W1-4):  Pure HTML — structure, forms, semantics, accessibility
 * Month 2 (W5-8):  CSS — styling, layout, animations, variables, dark mode
 * Month 3 (W9-12): JavaScript integration — (coming soon)
 *
 * Weeks 1-4: translations_en.js (separate EN file, applied below)
 * Weeks 5+:  EN content built directly into each week file
 */

import { HTML_WEEK_1 } from './week1.js';
import { HTML_WEEK_2 } from './week2.js';
import { HTML_WEEK_3 } from './week3.js';
import { HTML_WEEK_4 } from './week4.js';
import { HTML_WEEK_5 } from './week5.js';
import { HTML_WEEK_6 } from './week6.js';
import { HTML_WEEK_7 } from './week7.js';
import { HTML_WEEK_8 } from './week8.js';
import { HTML_ALL_EN, applyEnglishTranslations } from './translations_en.js';

export const HTML_COURSE = {
  language: 'html',
  languageName: 'HTML + CSS',
  emoji: '🌐',
  tagline: 'Web ka Skeleton aur Style — Zero se Professional Website',
  totalWeeks: 12,
  difficulty: 'Absolute Beginner',
  description: 'HTML structure deta hai, CSS beauty deta hai! Google, YouTube, Instagram — sab yahan se shuru hote hain. Zero se seekhkar professional, animated, responsive websites banao!',
  weeks: [],
};

// Merge all 8 available weeks (Month 1 + Month 2)
HTML_COURSE.weeks = [
  HTML_WEEK_1, HTML_WEEK_2, HTML_WEEK_3, HTML_WEEK_4,
  HTML_WEEK_5, HTML_WEEK_6, HTML_WEEK_7, HTML_WEEK_8,
  // Weeks 9-12 (JS integration) — coming soon
];

// Apply English translations to Weeks 1-4 (from translations_en.js)
// Weeks 5-8 already have EN content built into the week files
HTML_COURSE.weeks = applyEnglishTranslations(HTML_COURSE.weeks, HTML_ALL_EN);

export default HTML_COURSE;