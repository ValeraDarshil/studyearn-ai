/**
 * StudyEarn AI — C Programming Course
 * COMPLETE — 12 Weeks, Noob to Pro
 *
 * Month 1 (W1-4):  C Foundation
 * Month 2 (W5-8):  Data Structures + Systems
 * Month 3 (W9-12): Advanced Algorithms + Capstone
 */

import { C_WEEK_1  } from './week1.js';
import { C_WEEK_2  } from './week2.js';
import { C_WEEK_3  } from './week3.js';
import { C_WEEK_4  } from './week4.js';
import { C_WEEK_5  } from './week5.js';
import { C_WEEK_6  } from './week6.js';
import { C_WEEK_7  } from './week7.js';
import { C_WEEK_8  } from './week8.js';
import { C_WEEK_9  } from './week9.js';
import { C_WEEK_10 } from './week10.js';
import { C_WEEK_11 } from './week11.js';
import { C_WEEK_12 } from './week12.js';

export const C_COURSE = {
  language: 'c',
  languageName: 'C Programming',
  emoji: '⚙️',
  tagline: 'Computer Science ka Foundation — Noob se Pro!',
  totalWeeks: 12,
  difficulty: 'Beginner → Advanced',
  description: 'C programming — har language ki maa! 12 hafte mein variables se graphs tak, pointers se systems programming tak. Absolute beginner se professional C developer bano. 🏗️',
  weeks: [],
};

C_COURSE.weeks = [
  C_WEEK_1,  C_WEEK_2,  C_WEEK_3,  C_WEEK_4,
  C_WEEK_5,  C_WEEK_6,  C_WEEK_7,  C_WEEK_8,
  C_WEEK_9,  C_WEEK_10, C_WEEK_11, C_WEEK_12,
];

export default C_COURSE;