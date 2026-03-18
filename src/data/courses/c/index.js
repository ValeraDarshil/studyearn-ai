/**
 * StudyEarn AI — C Programming Course
 * src/data/courses/c/index.js
 *
 * Month 1 (W1-4):  C Basics — Syntax, Variables, Control Flow, Functions
 * Month 2 (W5-8):  Arrays, Strings, Pointers, Memory
 * Month 3 (W9-12): Structures, File I/O, Data Structures, Final Project
 */

import { C_WEEK_1 } from './week1.js';
import { C_WEEK_2 } from './week2.js';

export const C_COURSE = {
  language: 'c',
  languageName: 'C Programming',
  emoji: '⚙️',
  tagline: 'Computer Science ka Foundation — Memory se Master Bano!',
  totalWeeks: 12,
  difficulty: 'Intermediate',
  description: 'C programming seekho — har language ki maa! Pointers, memory management, data structures — sab kuch. Operating systems aur embedded systems banane ka foundation. 🏗️',
  weeks: [],
};

C_COURSE.weeks = [
  C_WEEK_1,
  C_WEEK_2,
  // Weeks 3-12 coming soon
];

export default C_COURSE;