// ─────────────────────────────────────────────────────────────
// StudyEarn AI — PPT Service
// ─────────────────────────────────────────────────────────────
// pptxgenjs se slide building ka saara kaam yahan hota hai
// Controller sirf buildPPTX() call karta hai aur buffer leta hai
// ─────────────────────────────────────────────────────────────

import PptxGenJS from 'pptxgenjs';

// ─────────────────────────────────────────────────────────────
// THEMES — exact same jo index.ts mein tha
// ─────────────────────────────────────────────────────────────
const THEMES = {
  simple: {
    bg: '0F1B35', bgLight: '162040', accent: '4A90E2', accentLight: '7BB3F0',
    textPrimary: 'FFFFFF', textSecondary: 'B8C8E0', textMuted: '6B8AB0',
    cardBg: '1C2A48', cardBorder: '2D3F60', titleFont: 'Calibri', bodyFont: 'Calibri',
  },
  detailed: {
    bg: '1A1A2E', bgLight: '16213E', accent: '7C3AED', accentLight: 'A78BFA',
    accentAlt: '3B82F6', textPrimary: 'FFFFFF', textSecondary: 'C4B5FD',
    textMuted: '7B7FA8', cardBg: '252545', cardBorder: '3D3D6B',
    titleFont: 'Cambria', bodyFont: 'Calibri',
  },
  creative: {
    bg: '1C1C2E', bgLight: '252538', accent: 'F97316', accentLight: 'FB923C',
    accentAlt: '8B5CF6', accentAlt2: '06B6D4', textPrimary: 'FFFFFF',
    textSecondary: 'FED7AA', textMuted: '94A3B8', cardBg: '2D2B42',
    cardBorder: '4C4870', titleFont: 'Trebuchet MS', bodyFont: 'Calibri',
  },
};
type ThemeKey = keyof typeof THEMES;

// ─────────────────────────────────────────────────────────────
// PRIVATE HELPERS
// ─────────────────────────────────────────────────────────────
function makeShadow() {
  return { type: 'outer' as const, blur: 8, offset: 3, angle: 135, color: '000000', opacity: 0.25 };
}

function parseLines(content: string): string[] {
  return content.split('\n')
    .map((l: string) => l.replace(/^[-•*▸→]\s*/, '').trim())
    .filter((l: string) => l.length > 0);
}

// ─────────────────────────────────────────────────────────────
// PRIVATE SLIDE BUILDERS
// ─────────────────────────────────────────────────────────────
function addTitleSlide(pptx: any, slide: any, theme: any, topic: string, classLevel: string, themeKey: ThemeKey) {
  const s = pptx.addSlide();
  s.background = { color: theme.bg };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 4.5, h: 5.625, fill: { color: theme.accent, transparency: 85 }, line: { color: theme.accent, transparency: 85 } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 5.1, w: 10, h: 0.525, fill: { color: theme.accent, transparency: 60 }, line: { color: theme.accent, transparency: 60 } });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.4, w: 0.12, h: 2.8, fill: { color: theme.accent }, line: { color: theme.accent } });
  s.addText(slide.title || topic, { x: 0.9, y: 1.5, w: 8.3, h: 1.8, fontSize: 44, bold: true, color: theme.textPrimary, fontFace: theme.titleFont, align: 'left', valign: 'middle', margin: 0 });
  const subtitle = slide.subtitle || `A Comprehensive ${themeKey === 'simple' ? 'Overview' : 'Presentation'}`;
  s.addText(subtitle, { x: 0.9, y: 3.35, w: 8.0, h: 0.6, fontSize: 18, color: theme.accentLight || theme.accent, fontFace: theme.bodyFont, align: 'left', margin: 0 });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.9, y: 4.2, w: 2.2, h: 0.45, fill: { color: theme.cardBg }, line: { color: theme.cardBorder }, shadow: makeShadow() });
  s.addText(classLevel, { x: 0.9, y: 4.2, w: 2.2, h: 0.45, fontSize: 13, color: theme.textSecondary, fontFace: theme.bodyFont, align: 'center', valign: 'middle', margin: 0 });
}

function addContentSlide(pptx: any, slideData: any, theme: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: slideNum % 2 === 0 ? theme.bg : theme.bgLight };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: theme.accent, transparency: 88 }, line: { color: theme.accent, transparency: 88 } });
  s.addShape(pptx.shapes.OVAL, { x: 9.1, y: 0.2, w: 0.6, h: 0.6, fill: { color: theme.accent }, line: { color: theme.accent } });
  s.addText(String(slideNum), { x: 9.1, y: 0.2, w: 0.6, h: 0.6, fontSize: 11, bold: true, color: 'FFFFFF', fontFace: theme.bodyFont, align: 'center', valign: 'middle', margin: 0 });
  s.addText(slideData.title, { x: 0.5, y: 0.1, w: 8.4, h: 0.8, fontSize: 26, bold: true, color: theme.textPrimary, fontFace: theme.titleFont, align: 'left', valign: 'middle', margin: 0 });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.2, w: 0.08, h: 4.1, fill: { color: theme.accent }, line: { color: theme.accent } });
  const lines   = parseLines(slideData.content || '');
  const bullets = lines.map((text: string, i: number) => ({
    text,
    options: { bullet: true, breakLine: i < lines.length - 1, fontSize: 15, color: i === 0 ? theme.textPrimary : theme.textSecondary, bold: i === 0, paraSpaceAfter: 8 },
  }));
  s.addText(
    bullets.length > 0 ? bullets : [{ text: slideData.content || '', options: { fontSize: 15, color: theme.textSecondary } }],
    { x: 0.65, y: 1.2, w: 8.9, h: 4.1, valign: 'top' },
  );
}

function addTwoColumnSlide(pptx: any, slideData: any, theme: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: slideNum % 2 === 0 ? theme.bg : theme.bgLight };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: theme.accent, transparency: 88 }, line: { color: theme.accent, transparency: 88 } });
  s.addText(slideData.title, { x: 0.5, y: 0.1, w: 9.0, h: 0.8, fontSize: 26, bold: true, color: theme.textPrimary, fontFace: theme.titleFont, align: 'left', valign: 'middle', margin: 0 });
  const lines      = parseLines(slideData.content || '');
  const mid        = Math.ceil(lines.length / 2);
  const leftLines  = lines.slice(0, mid);
  const rightLines = lines.slice(mid);
  // Left card
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.15, w: 4.3, h: 4.1, fill: { color: theme.cardBg }, line: { color: theme.cardBorder }, shadow: makeShadow() });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.15, w: 4.3, h: 0.08, fill: { color: theme.accent }, line: { color: theme.accent } });
  const leftBullets = leftLines.map((text: string, i: number) => ({ text, options: { bullet: true, breakLine: i < leftLines.length - 1, fontSize: 13, color: theme.textSecondary, paraSpaceAfter: 6 } }));
  s.addText(leftBullets.length > 0 ? leftBullets : [{ text: '', options: { fontSize: 13 } }], { x: 0.6, y: 1.35, w: 3.9, h: 3.75, valign: 'top' });
  // Right card
  s.addShape(pptx.shapes.RECTANGLE, { x: 5.3, y: 1.15, w: 4.3, h: 4.1, fill: { color: theme.cardBg }, line: { color: theme.cardBorder }, shadow: makeShadow() });
  s.addShape(pptx.shapes.RECTANGLE, { x: 5.3, y: 1.15, w: 4.3, h: 0.08, fill: { color: (theme as any).accentAlt || theme.accent }, line: { color: (theme as any).accentAlt || theme.accent } });
  const rightBullets = rightLines.map((text: string, i: number) => ({ text, options: { bullet: true, breakLine: i < rightLines.length - 1, fontSize: 13, color: theme.textSecondary, paraSpaceAfter: 6 } }));
  s.addText(rightBullets.length > 0 ? rightBullets : [{ text: '', options: { fontSize: 13 } }], { x: 5.5, y: 1.35, w: 3.9, h: 3.75, valign: 'top' });
}

function addHighlightSlide(pptx: any, slideData: any, theme: any) {
  const s = pptx.addSlide();
  s.background = { color: theme.bg };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.3, fill: { color: theme.accent }, line: { color: theme.accent } });
  s.addText(slideData.title, { x: 0.5, y: 0.05, w: 9.0, h: 1.2, fontSize: 30, bold: true, color: 'FFFFFF', fontFace: theme.titleFont, align: 'left', valign: 'middle', margin: 0 });
  const lines  = parseLines(slideData.content || '');
  const cards  = lines.slice(0, 6);
  const cols   = Math.min(3, cards.length);
  const cardW  = cols === 3 ? 2.9 : cols === 2 ? 4.0 : 8.0;
  const startX = cols === 3 ? 0.4 : 1.0;
  const gapX   = cols === 3 ? 0.45 : 1.0;
  const accentColors = [theme.accent, (theme as any).accentAlt || theme.accent, (theme as any).accentAlt2 || theme.accent];
  cards.forEach((text: string, i: number) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x   = startX + col * (cardW + gapX);
    const y   = 1.6 + row * 1.9;
    s.addShape(pptx.shapes.RECTANGLE, { x, y, w: cardW, h: 1.65, fill: { color: theme.cardBg }, line: { color: theme.cardBorder }, shadow: makeShadow() });
    s.addShape(pptx.shapes.RECTANGLE, { x, y, w: 0.1, h: 1.65, fill: { color: accentColors[i % 3] }, line: { color: accentColors[i % 3] } });
    s.addText(text, { x: x + 0.2, y, w: cardW - 0.2, h: 1.65, fontSize: 12, color: theme.textSecondary, fontFace: theme.bodyFont, align: 'left', valign: 'middle', wrap: true, margin: 8 });
  });
}

function addConclusionSlide(pptx: any, slideData: any, theme: any, topic: string) {
  const s = pptx.addSlide();
  s.background = { color: theme.bg };
  s.addShape(pptx.shapes.RECTANGLE, { x: 6.5, y: 0, w: 3.5, h: 5.625, fill: { color: theme.accent, transparency: 80 }, line: { color: theme.accent, transparency: 80 } });
  s.addText('SUMMARY', { x: 0.5, y: 0.4, w: 5.5, h: 0.4, fontSize: 11, bold: true, color: theme.accentLight || theme.accent, fontFace: theme.bodyFont, charSpacing: 6, margin: 0 });
  s.addText(topic, { x: 0.5, y: 0.85, w: 5.5, h: 0.9, fontSize: 32, bold: true, color: theme.textPrimary, fontFace: theme.titleFont, align: 'left', margin: 0 });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.8, w: 3.5, h: 0.05, fill: { color: theme.accent }, line: { color: theme.accent } });
  const lines   = parseLines(slideData.content || '');
  const bullets = lines.map((text: string, i: number) => ({ text, options: { bullet: true, breakLine: i < lines.length - 1, fontSize: 14, color: theme.textSecondary, paraSpaceAfter: 8 } }));
  s.addText(
    bullets.length > 0 ? bullets : [{ text: slideData.content || '', options: { fontSize: 14, color: theme.textSecondary } }],
    { x: 0.5, y: 2.0, w: 5.7, h: 3.3, valign: 'top' },
  );
  s.addText('Thank\nYou', { x: 6.6, y: 1.8, w: 3.0, h: 2.5, fontSize: 42, bold: true, color: 'FFFFFF', fontFace: theme.titleFont, align: 'center', valign: 'middle', margin: 0 });
  s.addText('Keep Learning! 🚀', { x: 6.6, y: 4.3, w: 3.0, h: 0.6, fontSize: 13, color: theme.textSecondary, fontFace: theme.bodyFont, align: 'center', margin: 0 });
}

function addTOCSlide(pptx: any, slides: any[], theme: any) {
  const s = pptx.addSlide();
  s.background = { color: theme.bgLight };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.1, fill: { color: theme.accent }, line: { color: theme.accent } });
  s.addText('Table of Contents', { x: 0.5, y: 0.05, w: 9, h: 1.0, fontSize: 30, bold: true, color: 'FFFFFF', fontFace: theme.titleFont, align: 'left', valign: 'middle', margin: 0 });
  const entries = slides.slice(2, slides.length - 1);
  entries.forEach((sl: any, i: number) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x   = 0.5 + col * 4.75;
    const y   = 1.35 + row * 0.75;
    s.addShape(pptx.shapes.RECTANGLE, { x, y, w: 4.5, h: 0.62, fill: { color: theme.cardBg }, line: { color: theme.cardBorder }, shadow: { type: 'outer' as const, blur: 4, offset: 2, angle: 135, color: '000000', opacity: 0.2 } });
    s.addShape(pptx.shapes.RECTANGLE, { x, y, w: 0.45, h: 0.62, fill: { color: theme.accent }, line: { color: theme.accent } });
    s.addText(String(i + 1), { x, y, w: 0.45, h: 0.62, fontSize: 14, bold: true, color: 'FFFFFF', fontFace: theme.bodyFont, align: 'center', valign: 'middle', margin: 0 });
    s.addText(sl.title || `Section ${i + 1}`, { x: x + 0.55, y, w: 3.85, h: 0.62, fontSize: 13, color: theme.textSecondary, fontFace: theme.bodyFont, align: 'left', valign: 'middle', margin: 0 });
  });
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/**
 * Complete PPTX Buffer build karo slides array se
 * Controller yeh call karta hai → Buffer milta hai → response mein bhejta hai
 */
export async function buildPPTX(slides: any[], style: string, topic: string, classLevel: string): Promise<Buffer> {
  const themeKey  = (style as ThemeKey) in THEMES ? (style as ThemeKey) : 'simple';
  const theme     = THEMES[themeKey] as any;
  const pptx: any = new (PptxGenJS as any)();

  pptx.layout  = 'LAYOUT_16x9';
  pptx.author  = 'StudyEarn AI';
  pptx.title   = topic || 'Presentation';
  pptx.subject = `${style} presentation for ${classLevel}`;

  if (themeKey === 'simple') {
    addTitleSlide(pptx, slides[0], theme, topic, classLevel, 'simple');
    slides.slice(1, slides.length - 1).forEach((sl, i) => addContentSlide(pptx, sl, theme, i + 2));
    addConclusionSlide(pptx, slides[slides.length - 1], theme, topic);

  } else if (themeKey === 'detailed') {
    addTitleSlide(pptx, slides[0], theme, topic, classLevel, 'detailed');
    addTOCSlide(pptx, slides, theme);
    slides.slice(2, slides.length - 1).forEach((sl, i) => {
      if (i % 3 === 1 && parseLines(sl.content || '').length >= 6) addTwoColumnSlide(pptx, sl, theme, i + 3);
      else if (i % 3 === 2) addHighlightSlide(pptx, sl, theme);
      else addContentSlide(pptx, sl, theme, i + 3);
    });
    addConclusionSlide(pptx, slides[slides.length - 1], theme, topic);

  } else {
    addTitleSlide(pptx, slides[0], theme, topic, classLevel, 'creative');
    slides.slice(1, slides.length - 1).forEach((sl, i) => {
      if (i % 3 === 0) addHighlightSlide(pptx, sl, theme);
      else if (i % 3 === 1) addTwoColumnSlide(pptx, sl, theme, i + 2);
      else addContentSlide(pptx, sl, theme, i + 2);
    });
    addConclusionSlide(pptx, slides[slides.length - 1], theme, topic);
  }

  return pptx.write('nodebuffer');
}

/** AI ke liye PPT prompt build karo */
export function buildPPTPrompt(topic: string, classLevel: string, style: string): { system: string; user: string } {
  const levelMap: Record<string, string> = {
    '8': 'Class 8 (age 13-14, simple language, basic concepts)',
    '9': 'Class 9 (age 14-15, clear explanations, standard terms)',
    '10': 'Class 10 (CBSE/ICSE board level, exam-focused)',
    '11': 'Class 11 (advanced concepts, technical terms)',
    '12': 'Class 12 (full board level, technical definitions, formulas)',
    'Undergraduate': 'Undergraduate (university depth, academic language)',
    'Postgraduate':  'Postgraduate (advanced theories, research level)',
  };
  const level  = levelMap[classLevel] || classLevel;
  const system = `You output ONLY valid JSON arrays. No explanation. No markdown. No text before or after. Start with [ and end with ].`;

  let slideList = '', rules = '', count = 6;

  if (style === 'simple') {
    count = 6;
    slideList = `Slide 1: Title slide\nSlide 2: Introduction\nSlide 3: Key Concept 1\nSlide 4: Key Concept 2\nSlide 5: Key Takeaways\nSlide 6: Conclusion`;
    rules = `Each slide: max 4 bullet points, max 12 words each. Simple language.`;
  } else if (style === 'detailed') {
    count = 10;
    slideList = `Slide 1: Title\nSlide 2: Overview & Background\nSlide 3: Core Concept A\nSlide 4: Core Concept B\nSlide 5: Core Concept C\nSlide 6: Key Definitions\nSlide 7: Real-World Applications\nSlide 8: Important Facts\nSlide 9: Case Study / Example\nSlide 10: Summary & Conclusion`;
    rules = `Each slide: 5-6 bullet points, 15-20 words each. Technical depth for ${level}.`;
  } else {
    count = 10;
    slideList = `Slide 1: Title (exciting hook)\nSlide 2: Did You Know? (surprising facts)\nSlide 3: The Big Picture\nSlide 4: Deep Dive Part 1\nSlide 5: Deep Dive Part 2\nSlide 6: Deep Dive Part 3\nSlide 7: Visual Concept\nSlide 8: Real World Impact\nSlide 9: Fun Facts & Myths vs Reality\nSlide 10: Key Takeaways`;
    rules = `Start each bullet with a relevant emoji. Use vivid engaging language. 4-5 bullets per slide.`;
  }

  const user = `Create a ${count}-slide PowerPoint about "${topic}" for ${level}.\n\nSlides:\n${slideList}\n\nRules: ${rules}\n\nOutput this exact JSON structure (${count} objects):\n[{"title":"...","content":"bullet1\\nbullet2\\nbullet3"}]`;
  return { system, user };
}

/** AI response se JSON array extract karo (messy response handle) */
export function extractJSONArray(text: string): any[] | null {
  if (!text) return null;
  // Strategy 1: direct parse
  try {
    const clean  = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  // Strategy 2: first [ to last ]
  try {
    const start = text.indexOf('[');
    const end   = text.lastIndexOf(']');
    if (start !== -1 && end > start) {
      const parsed = JSON.parse(text.slice(start, end + 1));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  // Strategy 3: fix common issues
  try {
    let fixed = text.replace(/```json/gi, '').replace(/```/g, '')
      .replace(/,\s*]/g, ']').replace(/,\s*}/g, '}')
      .replace(/[""]/g, '"').replace(/['']/g, "'").trim();
    const start = fixed.indexOf('[');
    const end   = fixed.lastIndexOf(']');
    if (start !== -1 && end > start) {
      const parsed = JSON.parse(fixed.slice(start, end + 1));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  // Strategy 4: regex extract objects
  try {
    const objects: any[] = [];
    const objRegex = /\{[^{}]*"title"[^{}]*"content"[^{}]*\}/gs;
    const matches  = text.matchAll(objRegex);
    for (const m of matches) {
      try {
        const obj = JSON.parse(m[0]);
        if (obj.title && obj.content) objects.push(obj);
      } catch {}
    }
    if (objects.length >= 3) return objects;
  } catch {}
  return null;
}