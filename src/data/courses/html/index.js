/**
 * StudyEarn AI — HTML Course
 * src/data/courses/html/index.js
 *
 * Exports: HTML_COURSE (Month 1 = Weeks 1-4)
 * Weeks 5-12 (CSS integration, responsive, projects) — coming soon
 */

import { HTML_WEEK_1 } from './week1.js';
import { HTML_WEEK_2 } from './week2.js';
import { HTML_WEEK_3 } from './week3.js';
import { HTML_WEEK_4 } from './week4.js';

export const HTML_COURSE = {
  language: 'html',
  languageName: 'HTML Fundamentals',
  emoji: '🌐',
  tagline: 'Web ka Skeleton — Zero se Webpage Banao',
  totalWeeks: 12,
  difficulty: 'Absolute Beginner',
  description: 'HTML har website ka foundation hai. Google, YouTube, Instagram — sab HTML se bante hain. Zero se seekhkar professional webpages banao!',

  weeks: [
    HTML_WEEK_1,
    HTML_WEEK_2,
    HTML_WEEK_3,
    HTML_WEEK_4,
    // Weeks 5-12 will be added as CSS + Advanced HTML content is created
  ],
};

export default HTML_COURSE;