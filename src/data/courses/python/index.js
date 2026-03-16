/**
 * StudyEarn AI — Python Course
 * src/data/courses/python/index.js
 *
 * Exports: PYTHON_COURSE (all 12 weeks merged + EN translations applied)
 */

import { PYTHON_COURSE } from './week1_4.js';
import { PYTHON_WEEK_5  } from './week5.js';
import { PYTHON_WEEK_6  } from './week6.js';
import { PYTHON_WEEK_7  } from './week7.js';
import { PYTHON_WEEK_8  } from './week8.js';
import { PYTHON_WEEK_9  } from './week9.js';
import { PYTHON_WEEK_10 } from './week10.js';
import { PYTHON_WEEK_11 } from './week11.js';
import { PYTHON_WEEK_12 } from './week12.js';
import { PYTHON_ALL_EN, applyEnglishTranslations } from './translations_en.js';

// ── Merge all 12 weeks ────────────────────────────────────────
PYTHON_COURSE.weeks = [
  ...PYTHON_COURSE.weeks,   // Weeks 1-4 (already in week1_4.js)
  PYTHON_WEEK_5,
  PYTHON_WEEK_6,
  PYTHON_WEEK_7,
  PYTHON_WEEK_8,
  PYTHON_WEEK_9,
  PYTHON_WEEK_10,
  PYTHON_WEEK_11,
  PYTHON_WEEK_12,
];

// ── Apply English translations to all 48 sections ─────────────
PYTHON_COURSE.weeks = applyEnglishTranslations(
  PYTHON_COURSE.weeks,
  PYTHON_ALL_EN
);

export { PYTHON_COURSE };
export default PYTHON_COURSE;