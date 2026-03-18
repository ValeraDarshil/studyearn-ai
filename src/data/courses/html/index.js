/**
 * StudyEarn AI — Web Development Bootcamp
 * src/data/courses/html/index.js
 *
 * Month 1 (W1-4):  HTML — Structure, Forms, Semantics
 * Month 2 (W5-8):  CSS — Flexbox, Grid, Animations, Variables
 * Month 3 (W9-12): JavaScript — DOM, APIs, OOP, Portfolio
 */

import { HTML_WEEK_1  } from './week1.js';
import { HTML_WEEK_2  } from './week2.js';
import { HTML_WEEK_3  } from './week3.js';
import { HTML_WEEK_4  } from './week4.js';
import { HTML_WEEK_5  } from './week5.js';
import { HTML_WEEK_6  } from './week6.js';
import { HTML_WEEK_7  } from './week7.js';
import { HTML_WEEK_8  } from './week8.js';
import { HTML_WEEK_9  } from './week9.js';
import { HTML_WEEK_10 } from './week10.js';
import { HTML_WEEK_11 } from './week11.js';
import { HTML_WEEK_12 } from './week12.js';
import { HTML_ALL_EN, applyEnglishTranslations } from './translations_en.js';

export const HTML_COURSE = {
  language: 'html',
  languageName: 'Web Dev Bootcamp',
  emoji: '🚀',
  tagline: 'HTML + CSS + JS — Zero se Frontend Developer in 3 Months!',
  totalWeeks: 12,
  difficulty: 'Absolute Beginner',
  description: 'Teen mahine mein poora web development seekho! Month 1: HTML structure, Month 2: CSS styling & animations, Month 3: JavaScript interactivity. Real projects + Certificate! 🎓',
  weeks: [],
};

HTML_COURSE.weeks = [
  HTML_WEEK_1,  HTML_WEEK_2,  HTML_WEEK_3,  HTML_WEEK_4,
  HTML_WEEK_5,  HTML_WEEK_6,  HTML_WEEK_7,  HTML_WEEK_8,
  HTML_WEEK_9,  HTML_WEEK_10, HTML_WEEK_11, HTML_WEEK_12,
];

// Apply English translations to Weeks 1-4
HTML_COURSE.weeks = applyEnglishTranslations(HTML_COURSE.weeks, HTML_ALL_EN);

export default HTML_COURSE;