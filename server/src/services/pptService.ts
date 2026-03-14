// ─────────────────────────────────────────────────────────────
// StudyEarn AI — PPT Service v3 — "Surprise Every Time"
// ─────────────────────────────────────────────────────────────
// • 8 color palettes — picked via seeded random (topic + timestamp)
//   → same topic on different days = different look
// • 3 title slide variants, 6 content layouts — truly shuffled
// • Spotlight layout fixed — no more empty cards
// • Content prompt forces full sentences, not single words
// ─────────────────────────────────────────────────────────────

import PptxGenJS from 'pptxgenjs';

// ─────────────────────────────────────────────────────────────
// SEEDED RANDOM — deterministic per seed but varied across runs
// ─────────────────────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function buildSeed(topic: string): number {
  // Mix topic chars with current minute → different every generation
  const topicHash = topic.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const timeSeed = Math.floor(Date.now() / 60000); // changes every minute
  return topicHash * 31 + timeSeed;
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────────
// 8 DISTINCT COLOR PALETTES
// Each has its own personality — bg, accents, card colors
// ─────────────────────────────────────────────────────────────
const PALETTES = [
  {
    // 1. Deep Space — electric violet + cyan
    name: 'deep-space',
    bg: '08081A', bgAlt: '0E0E24',
    accent: '7C3AED', accentB: 'F97316', accentC: '06B6D4', accentD: 'EC4899',
    textPrimary: 'FFFFFF', textSecondary: 'C4B5FD', textMuted: '94A3B8',
    cardBg: '14143A', cardBorder: '2D2D6B',
    titleFont: 'Trebuchet MS', bodyFont: 'Calibri',
  },
  {
    // 2. Midnight Ember — deep navy + hot coral
    name: 'midnight-ember',
    bg: '0A0F1E', bgAlt: '0F1828',
    accent: 'F97316', accentB: '7C3AED', accentC: '06B6D4', accentD: 'FBBF24',
    textPrimary: 'FFFFFF', textSecondary: 'FED7AA', textMuted: '94A3B8',
    cardBg: '151F32', cardBorder: '2D3A52',
    titleFont: 'Arial Black', bodyFont: 'Calibri',
  },
  {
    // 3. Emerald Dark — deep green + gold
    name: 'emerald-dark',
    bg: '061A0F', bgAlt: '0A2215',
    accent: '10B981', accentB: 'FBBF24', accentC: '6366F1', accentD: '34D399',
    textPrimary: 'FFFFFF', textSecondary: 'A7F3D0', textMuted: '6EE7B7',
    cardBg: '0D2A1A', cardBorder: '1A4A30',
    titleFont: 'Cambria', bodyFont: 'Calibri',
  },
  {
    // 4. Cherry Noir — deep red + silver
    name: 'cherry-noir',
    bg: '120608', bgAlt: '1C080C',
    accent: 'E11D48', accentB: 'F472B6', accentC: 'FB923C', accentD: 'FCD34D',
    textPrimary: 'FFFFFF', textSecondary: 'FECDD3', textMuted: 'FDA4AF',
    cardBg: '200A10', cardBorder: '3F1520',
    titleFont: 'Georgia', bodyFont: 'Calibri',
  },
  {
    // 5. Ocean Abyss — deep teal + amber
    name: 'ocean-abyss',
    bg: '020F1A', bgAlt: '041624',
    accent: '0891B2', accentB: 'F59E0B', accentC: '8B5CF6', accentD: '22D3EE',
    textPrimary: 'FFFFFF', textSecondary: 'BAE6FD', textMuted: '7DD3FC',
    cardBg: '071E30', cardBorder: '0F3554',
    titleFont: 'Trebuchet MS', bodyFont: 'Calibri',
  },
  {
    // 6. Neon Slate — charcoal + electric lime + pink
    name: 'neon-slate',
    bg: '0F1117', bgAlt: '161820',
    accent: 'A3E635', accentB: 'F472B6', accentC: '38BDF8', accentD: 'FB923C',
    textPrimary: 'FFFFFF', textSecondary: 'D9F99D', textMuted: '94A3B8',
    cardBg: '1C1F2A', cardBorder: '2E3344',
    titleFont: 'Arial Black', bodyFont: 'Calibri',
  },
  {
    // 7. Royal Ink — true navy + gold + white
    name: 'royal-ink',
    bg: '06091F', bgAlt: '0B0F2E',
    accent: 'FBBF24', accentB: '818CF8', accentC: '34D399', accentD: 'F472B6',
    textPrimary: 'FFFFFF', textSecondary: 'FEF3C7', textMuted: 'C7D2FE',
    cardBg: '10163A', cardBorder: '1E2A5E',
    titleFont: 'Cambria', bodyFont: 'Calibri',
  },
  {
    // 8. Cyber Plum — dark purple + neon cyan
    name: 'cyber-plum',
    bg: '100A1E', bgAlt: '160E28',
    accent: '22D3EE', accentB: 'A855F7', accentC: 'F97316', accentD: '4ADE80',
    textPrimary: 'FFFFFF', textSecondary: 'A5F3FC', textMuted: 'C084FC',
    cardBg: '1C1030', cardBorder: '2F1A50',
    titleFont: 'Trebuchet MS', bodyFont: 'Calibri',
  },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function shadow() {
  return { type: 'outer' as const, blur: 14, offset: 4, angle: 135, color: '000000', opacity: 0.40 };
}
function shadowSm() {
  return { type: 'outer' as const, blur: 6, offset: 2, angle: 135, color: '000000', opacity: 0.28 };
}

function parseLines(content: string): string[] {
  return content.split('\n')
    .map((l: string) => l.replace(/^[-•*▸→]\s*/, '').trim())
    .filter((l: string) => l.length > 2);
}

function stripEmoji(text: string): string {
  return text.replace(/^[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}✅❌💡⚡🌟🎯🔥💫🔬🎨📊📚🤖📈📱🏥🚗🌍🏙️💼🌱🚀🔍🤔⭐🧠🔑🌐💻🧬🔮]+\s*/gu, '').trim();
}

function cleanTitle(title: string): string {
  return stripEmoji(title).replace(/^(🚀|💡|⚡|🎯|🌟|🔥|✨|🤖|📊|🌍|🔍|⭐|🎨|📐|🔭|🤔|🖼️)\s*/u, '').trim();
}

function accentAt(p: any, i: number): string {
  return [p.accent, p.accentB, p.accentC, p.accentD][i % 4];
}

// ─────────────────────────────────────────────────────────────
// TITLE SLIDE — VARIANT A: Diagonal split with large type
// ─────────────────────────────────────────────────────────────
function addTitleA(pptx: any, slide: any, p: any, topic: string, classLevel: string) {
  const s = pptx.addSlide();
  s.background = { color: p.bg };

  // Full left gradient panel
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.6, h: 5.625,
    fill: { type: 'gradient', gradType: 'linear',
      stops: [{ position: 0, color: p.accent }, { position: 100, color: p.accentD }], angle: 150 },
    line: { type: 'none' },
  });

  // Dot grid — right panel texture
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) {
    s.addShape(pptx.shapes.OVAL, {
      x: 4.0 + c * 1.0, y: 0.4 + r * 1.05, w: 0.06, h: 0.06,
      fill: { color: p.accent, transparency: 75 }, line: { type: 'none' },
    });
  }

  // Level badge on panel
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.25, y: 4.55, w: 3.1, h: 0.5,
    fill: { color: '000000', transparency: 40 }, line: { type: 'none' }, rectRadius: 0.12,
  });
  s.addText(classLevel, {
    x: 0.25, y: 4.55, w: 3.1, h: 0.5,
    fontSize: 13, bold: true, color: 'FFFFFF', fontFace: p.bodyFont,
    align: 'center', valign: 'middle',
  });

  // Main title right
  const title = cleanTitle(slide.title || topic);
  s.addText(title, {
    x: 3.9, y: 0.9, w: 5.85, h: 2.8,
    fontSize: 40, bold: true, color: p.textPrimary,
    fontFace: p.titleFont, align: 'left', valign: 'middle', charSpacing: -0.5,
  });

  // Subtitle
  const sub = parseLines(slide.subtitle || slide.content || '')[0] || 'A Comprehensive Presentation';
  s.addText(stripEmoji(sub), {
    x: 3.9, y: 3.8, w: 5.85, h: 0.7,
    fontSize: 15, color: p.textSecondary, fontFace: p.bodyFont, align: 'left',
  });

  // Bottom accent strip
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 3.6, y: 5.28, w: 6.4, h: 0.345,
    fill: { type: 'gradient', gradType: 'linear',
      stops: [{ position: 0, color: p.accentC }, { position: 100, color: p.bg }], angle: 0 },
    line: { type: 'none' },
  });
}

// ─────────────────────────────────────────────────────────────
// TITLE SLIDE — VARIANT B: Center stage with glowing rings
// ─────────────────────────────────────────────────────────────
function addTitleB(pptx: any, slide: any, p: any, topic: string, classLevel: string) {
  const s = pptx.addSlide();
  s.background = { color: p.bg };

  // Large bg circle rings — decorative
  s.addShape(pptx.shapes.OVAL, {
    x: 0.5, y: -1.2, w: 9, h: 9,
    fill: { color: p.accent, transparency: 93 }, line: { color: p.accent, transparency: 85, pt: 1 },
  });
  s.addShape(pptx.shapes.OVAL, {
    x: 1.8, y: -0.2, w: 6.4, h: 6.4,
    fill: { color: p.accentB, transparency: 95 }, line: { color: p.accentB, transparency: 88, pt: 1 },
  });

  // Top label
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.2, y: 0.45, w: 3.6, h: 0.48,
    fill: { color: p.accent, transparency: 25 }, line: { type: 'none' }, rectRadius: 0.24,
  });
  s.addText(classLevel.toUpperCase(), {
    x: 3.2, y: 0.45, w: 3.6, h: 0.48,
    fontSize: 11, bold: true, color: 'FFFFFF', fontFace: p.bodyFont,
    align: 'center', valign: 'middle', charSpacing: 2,
  });

  // Big centered title
  const title = cleanTitle(slide.title || topic);
  s.addText(title, {
    x: 0.5, y: 1.1, w: 9.0, h: 2.6,
    fontSize: 44, bold: true, color: p.textPrimary,
    fontFace: p.titleFont, align: 'center', valign: 'middle',
  });

  // Horizontal divider
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 2.0, y: 3.85, w: 6.0, h: 0.04,
    fill: { type: 'gradient', gradType: 'linear',
      stops: [{ position: 0, color: p.bg }, { position: 50, color: p.accent }, { position: 100, color: p.bg }], angle: 0 },
    line: { type: 'none' },
  });

  // Subtitle
  const sub = parseLines(slide.subtitle || slide.content || '')[0] || 'An In-Depth Exploration';
  s.addText(stripEmoji(sub), {
    x: 1.0, y: 4.05, w: 8.0, h: 0.7,
    fontSize: 16, color: p.textSecondary, fontFace: p.bodyFont, align: 'center',
  });

  // Bottom 3 accent dots
  ['accent', 'accentB', 'accentC'].forEach((k, i) => {
    s.addShape(pptx.shapes.OVAL, {
      x: 4.4 + i * 0.55, y: 5.0, w: 0.18, h: 0.18,
      fill: { color: (p as any)[k] }, line: { type: 'none' },
    });
  });
}

// ─────────────────────────────────────────────────────────────
// TITLE SLIDE — VARIANT C: Full-bleed gradient + big number
// ─────────────────────────────────────────────────────────────
function addTitleC(pptx: any, slide: any, p: any, topic: string, classLevel: string) {
  const s = pptx.addSlide();

  // Full gradient background
  s.background = { color: p.bg };
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { type: 'gradient', gradType: 'linear',
      stops: [{ position: 0, color: p.accent, transparency: 20 }, { position: 100, color: p.bg }], angle: 135 },
    line: { type: 'none' },
  });

  // Giant decorative text in background
  s.addText('01', {
    x: 5.5, y: -0.5, w: 5.0, h: 4.0,
    fontSize: 220, bold: true, color: 'FFFFFF', fontFace: p.titleFont,
    align: 'right', transparency: 92,
  });

  // Level pill top-left
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 0.5, w: 2.2, h: 0.45,
    fill: { color: p.accentB, transparency: 20 }, line: { type: 'none' }, rectRadius: 0.22,
  });
  s.addText(classLevel, {
    x: 0.5, y: 0.5, w: 2.2, h: 0.45,
    fontSize: 12, bold: true, color: 'FFFFFF', fontFace: p.bodyFont,
    align: 'center', valign: 'middle',
  });

  // Title
  const title = cleanTitle(slide.title || topic);
  s.addText(title, {
    x: 0.5, y: 1.2, w: 7.5, h: 2.8,
    fontSize: 46, bold: true, color: p.textPrimary,
    fontFace: p.titleFont, align: 'left', valign: 'middle',
  });

  // Bottom bar
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 5.18, w: 10, h: 0.445,
    fill: { type: 'gradient', gradType: 'linear',
      stops: [{ position: 0, color: p.accent }, { position: 50, color: p.accentC }, { position: 100, color: p.accentD }], angle: 0 },
    line: { type: 'none' },
  });
  s.addText('Generated by StudyEarn AI', {
    x: 0, y: 5.18, w: 10, h: 0.445,
    fontSize: 10, bold: true, color: 'FFFFFF', fontFace: p.bodyFont,
    align: 'center', valign: 'middle', charSpacing: 2,
  });
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 1 — NUMBERED CARDS 2×2
// ─────────────────────────────────────────────────────────────
function addNumberedCards(pptx: any, slideData: any, p: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: slideNum % 2 === 0 ? p.bg : p.bgAlt };

  // Header
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.05,
    fill: { type: 'gradient', gradType: 'linear',
      stops: [{ position: 0, color: p.accent }, { position: 100, color: p.accentC }], angle: 0 },
    line: { type: 'none' },
  });
  s.addText(cleanTitle(slideData.title), {
    x: 0.5, y: 0.05, w: 8.5, h: 0.95,
    fontSize: 26, bold: true, color: 'FFFFFF', fontFace: p.titleFont,
    align: 'left', valign: 'middle',
  });

  const lines = parseLines(slideData.content || '');
  const positions = [{ x: 0.35, y: 1.2 }, { x: 5.15, y: 1.2 }, { x: 0.35, y: 3.18 }, { x: 5.15, y: 3.18 }];
  const cardW = 4.5, cardH = 1.82;

  lines.slice(0, 4).forEach((text: string, i: number) => {
    const pos = positions[i];
    const color = accentAt(p, i);
    const clean = stripEmoji(text);

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: pos.x, y: pos.y, w: cardW, h: cardH,
      fill: { color: p.cardBg }, line: { color, pt: 1 },
      shadow: shadowSm(), rectRadius: 0.1,
    });
    // Left accent tab
    s.addShape(pptx.shapes.RECTANGLE, {
      x: pos.x, y: pos.y, w: 0.07, h: cardH,
      fill: { color }, line: { type: 'none' },
    });
    // Number circle
    s.addShape(pptx.shapes.OVAL, {
      x: pos.x + 0.2, y: pos.y + 0.18, w: 0.88, h: 0.88,
      fill: { color }, line: { type: 'none' },
    });
    s.addText(String(i + 1), {
      x: pos.x + 0.2, y: pos.y + 0.18, w: 0.88, h: 0.88,
      fontSize: 20, bold: true, color: 'FFFFFF', fontFace: p.bodyFont,
      align: 'center', valign: 'middle',
    });
    // Text
    s.addText(clean, {
      x: pos.x + 1.3, y: pos.y + 0.1, w: 3.05, h: cardH - 0.2,
      fontSize: 13, color: p.textSecondary, fontFace: p.bodyFont,
      align: 'left', valign: 'middle', wrap: true,
    });
  });
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 2 — DIAGONAL SPLIT (title left panel + bullets right)
// ─────────────────────────────────────────────────────────────
function addDiagonalSplit(pptx: any, slideData: any, p: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: p.bgAlt };

  // Colored left panel
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.5, h: 5.625,
    fill: { type: 'gradient', gradType: 'linear',
      stops: [{ position: 0, color: p.accent }, { position: 100, color: p.accentD }], angle: 160 },
    line: { type: 'none' },
  });

  // Slide num
  s.addText(String(slideNum).padStart(2, '0'), {
    x: 0.2, y: 0.2, w: 1.0, h: 0.8,
    fontSize: 34, bold: true, color: 'FFFFFF', fontFace: p.titleFont, align: 'left', transparency: 45,
  });

  // Title on panel
  s.addText(cleanTitle(slideData.title), {
    x: 0.2, y: 1.1, w: 3.1, h: 4.0,
    fontSize: 22, bold: true, color: 'FFFFFF', fontFace: p.titleFont,
    align: 'left', valign: 'middle', wrap: true,
  });

  // Right bullets
  const lines = parseLines(slideData.content || '');
  lines.slice(0, 5).forEach((text: string, i: number) => {
    const y = 0.6 + i * 0.93;
    const clean = stripEmoji(text);

    if (i > 0) {
      s.addShape(pptx.shapes.RECTANGLE, {
        x: 3.8, y: y - 0.08, w: 5.9, h: 0.01,
        fill: { color: p.cardBorder }, line: { type: 'none' },
      });
    }
    // Dot
    s.addShape(pptx.shapes.OVAL, {
      x: 3.75, y: y + 0.28, w: 0.32, h: 0.32,
      fill: { color: accentAt(p, i) }, line: { type: 'none' },
    });
    s.addText(clean, {
      x: 4.25, y, w: 5.5, h: 0.84,
      fontSize: 13.5, color: i === 0 ? p.textPrimary : p.textSecondary,
      fontFace: p.bodyFont, bold: i === 0, align: 'left', valign: 'middle', wrap: true,
    });
  });
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 3 — SPOTLIGHT: 3 full content cards (FIXED)
// Text top-aligned, card fills properly, no empty void
// ─────────────────────────────────────────────────────────────
function addSpotlight(pptx: any, slideData: any, p: any) {
  const s = pptx.addSlide();
  s.background = { color: p.bg };

  // Subtle bg glow
  s.addShape(pptx.shapes.OVAL, {
    x: 1.0, y: -0.8, w: 8, h: 5,
    fill: { color: p.accent, transparency: 91 }, line: { type: 'none' },
  });

  // Title pill
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 0.25, w: 9.0, h: 0.58,
    fill: { color: p.cardBg }, line: { color: p.accent, pt: 1 }, rectRadius: 0.29,
  });
  s.addText(cleanTitle(slideData.title).toUpperCase(), {
    x: 0.5, y: 0.25, w: 9.0, h: 0.58,
    fontSize: 12, bold: true, color: p.accentB, fontFace: p.bodyFont,
    align: 'center', valign: 'middle', charSpacing: 3,
  });

  const lines = parseLines(slideData.content || '');
  const facts = lines.slice(0, 3);
  const colors = [p.accent, p.accentB, p.accentC];
  const cardW = 2.9, gap = 0.15;

  facts.forEach((text: string, i: number) => {
    const x = 0.35 + i * (cardW + gap);
    const clean = stripEmoji(text);
    const color = colors[i];

    // Card
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.05, w: cardW, h: 4.3,
      fill: { color: p.cardBg }, line: { color, pt: 2 },
      shadow: shadow(), rectRadius: 0.14,
    });

    // Top colored header band
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.05, w: cardW, h: 0.62,
      fill: { color }, line: { type: 'none' }, rectRadius: 0.14,
    });
    // Square off bottom of header
    s.addShape(pptx.shapes.RECTANGLE, {
      x, y: 1.48, w: cardW, h: 0.2,
      fill: { color }, line: { type: 'none' },
    });

    // Number in header
    s.addText(String(i + 1), {
      x, y: 1.05, w: cardW, h: 0.62,
      fontSize: 16, bold: true, color: 'FFFFFF', fontFace: p.titleFont,
      align: 'center', valign: 'middle',
    });

    // FIXED: text top-aligned with padding, not centered (prevents empty void)
    s.addText(clean, {
      x: x + 0.18, y: 1.82, w: cardW - 0.36, h: 3.38,
      fontSize: 14, color: p.textSecondary, fontFace: p.bodyFont,
      align: 'left', valign: 'top', wrap: true, margin: 6,
    });
  });

  // 4th fact as footer if exists
  if (lines.length > 3) {
    const extra = stripEmoji(lines[3]);
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y: 5.3, w: 9.0, h: 0.2,
      fill: { color: p.cardBg }, line: { type: 'none' }, rectRadius: 0.1,
    });
    s.addText(`+ ${extra}`, {
      x: 0.5, y: 5.3, w: 9.0, h: 0.2,
      fontSize: 10, color: p.textMuted, fontFace: p.bodyFont, align: 'center',
    });
  }
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 4 — TIMELINE STEPS (horizontal)
// ─────────────────────────────────────────────────────────────
function addTimeline(pptx: any, slideData: any, p: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: p.bgAlt };

  // Header
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.08,
    fill: { color: p.bg }, line: { type: 'none' },
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 1.04, w: 10, h: 0.04,
    fill: { color: p.accent }, line: { type: 'none' },
  });
  s.addText(cleanTitle(slideData.title), {
    x: 0.5, y: 0.06, w: 8.5, h: 0.96,
    fontSize: 28, bold: true, color: p.textPrimary,
    fontFace: p.titleFont, align: 'left', valign: 'middle',
  });

  const lines = parseLines(slideData.content || '');
  const steps = lines.slice(0, 4);

  // Connecting base line
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 2.48, w: 8.4, h: 0.07,
    fill: { color: p.cardBorder }, line: { type: 'none' },
  });

  const stepW = 8.4 / steps.length;
  steps.forEach((text: string, i: number) => {
    const cx = 0.8 + i * stepW + stepW / 2;
    const color = accentAt(p, i);
    const clean = stripEmoji(text);

    // Colored segment of line
    if (i < steps.length - 1) {
      s.addShape(pptx.shapes.RECTANGLE, {
        x: cx + 0.44, y: 2.48, w: stepW - 0.88, h: 0.07,
        fill: { color: accentAt(p, i + 1), transparency: 45 }, line: { type: 'none' },
      });
    }

    // Circle
    s.addShape(pptx.shapes.OVAL, {
      x: cx - 0.44, y: 2.16, w: 0.88, h: 0.88,
      fill: { color }, line: { color: p.bgAlt, pt: 3 }, shadow: shadowSm(),
    });
    s.addText(String(i + 1), {
      x: cx - 0.44, y: 2.16, w: 0.88, h: 0.88,
      fontSize: 18, bold: true, color: 'FFFFFF', fontFace: p.titleFont,
      align: 'center', valign: 'middle',
    });

    // Card below
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cx - stepW / 2 + 0.12, y: 3.2, w: stepW - 0.24, h: 2.1,
      fill: { color: p.cardBg }, line: { color, pt: 1 },
      shadow: shadowSm(), rectRadius: 0.1,
    });
    s.addText(clean, {
      x: cx - stepW / 2 + 0.22, y: 3.28, w: stepW - 0.44, h: 1.94,
      fontSize: 12, color: p.textSecondary, fontFace: p.bodyFont,
      align: 'center', valign: 'top', wrap: true,
    });
  });
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 5 — MYTHS VS REALITY (auto-detected or manual)
// ─────────────────────────────────────────────────────────────
function addDuel(pptx: any, slideData: any, p: any) {
  const s = pptx.addSlide();
  s.background = { color: p.bg };

  // Header
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.05,
    fill: { type: 'gradient', gradType: 'linear',
      stops: [{ position: 0, color: p.accent }, { position: 100, color: p.bg }], angle: 0 },
    line: { type: 'none' },
  });
  s.addText(cleanTitle(slideData.title), {
    x: 0.5, y: 0.05, w: 9, h: 0.95,
    fontSize: 26, bold: true, color: 'FFFFFF', fontFace: p.titleFont,
    align: 'left', valign: 'middle',
  });

  // Column headers
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.15, w: 4.3, h: 0.62,
    fill: { color: 'B91C1C' }, line: { type: 'none' }, rectRadius: 0.08,
  });
  s.addText('❌  MYTH', {
    x: 0.4, y: 1.15, w: 4.3, h: 0.62,
    fontSize: 16, bold: true, color: 'FFFFFF', fontFace: p.titleFont,
    align: 'center', valign: 'middle',
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.3, y: 1.15, w: 4.3, h: 0.62,
    fill: { color: '15803D' }, line: { type: 'none' }, rectRadius: 0.08,
  });
  s.addText('✅  REALITY', {
    x: 5.3, y: 1.15, w: 4.3, h: 0.62,
    fontSize: 16, bold: true, color: 'FFFFFF', fontFace: p.titleFont,
    align: 'center', valign: 'middle',
  });

  const lines = parseLines(slideData.content || '');
  lines.slice(0, 3).forEach((line: string, i: number) => {
    const y = 1.92 + i * 1.1;
    const parts = line.split('→');
    const myth = stripEmoji(parts[0] || line).replace(/^❌\s*Myth:\s*/i, '').trim();
    const reality = stripEmoji(parts[1] || myth).replace(/^✅\s*(?:Reality|Truth):\s*/i, '').trim();

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.4, y, w: 4.3, h: rowH(lines.slice(0, 3)),
      fill: { color: '1C0505' }, line: { color: 'B91C1C', pt: 1 }, rectRadius: 0.07,
    });
    s.addText(myth, {
      x: 0.55, y: y + 0.06, w: 4.0, h: rowH(lines.slice(0, 3)) - 0.12,
      fontSize: 12.5, color: 'FCA5A5', fontFace: p.bodyFont,
      align: 'left', valign: 'middle', wrap: true,
    });
    s.addText('→', {
      x: 4.6, y, w: 0.8, h: rowH(lines.slice(0, 3)),
      fontSize: 20, bold: true, color: p.accentB, fontFace: p.bodyFont,
      align: 'center', valign: 'middle',
    });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 5.3, y, w: 4.3, h: rowH(lines.slice(0, 3)),
      fill: { color: '052015' }, line: { color: '15803D', pt: 1 }, rectRadius: 0.07,
    });
    s.addText(reality, {
      x: 5.45, y: y + 0.06, w: 4.0, h: rowH(lines.slice(0, 3)) - 0.12,
      fontSize: 12.5, color: '86EFAC', fontFace: p.bodyFont,
      align: 'left', valign: 'middle', wrap: true,
    });
  });
}

function rowH(lines: string[]): number {
  const n = Math.min(lines.length, 3);
  const available = 3.5;
  return available / n - 0.08;
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 6 — BIG QUOTE / STAT SLIDE
// One dominant bold statement + supporting points
// ─────────────────────────────────────────────────────────────
function addBigQuote(pptx: any, slideData: any, p: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: slideNum % 2 === 0 ? p.bg : p.bgAlt };

  // Giant accent quote mark
  s.addText('"', {
    x: 0.0, y: -0.5, w: 3.0, h: 3.0,
    fontSize: 200, bold: true, color: p.accent, fontFace: p.titleFont,
    align: 'left', transparency: 88,
  });

  // Title — small label
  s.addText(cleanTitle(slideData.title).toUpperCase(), {
    x: 0.5, y: 0.3, w: 9, h: 0.5,
    fontSize: 11, bold: true, color: p.accentB, fontFace: p.bodyFont,
    align: 'left', charSpacing: 3,
  });

  const lines = parseLines(slideData.content || '');

  // First line — big hero statement
  const hero = stripEmoji(lines[0] || '');
  s.addText(hero, {
    x: 0.5, y: 0.95, w: 9.0, h: 1.85,
    fontSize: 26, bold: true, color: p.textPrimary,
    fontFace: p.titleFont, align: 'left', valign: 'middle', wrap: true,
  });

  // Divider
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 2.9, w: 5.5, h: 0.04,
    fill: { color: p.accent }, line: { type: 'none' },
  });

  // Remaining lines — smaller supporting points
  lines.slice(1, 5).forEach((text: string, i: number) => {
    const y = 3.1 + i * 0.6;
    const clean = stripEmoji(text);

    s.addShape(pptx.shapes.OVAL, {
      x: 0.5, y: y + 0.14, w: 0.28, h: 0.28,
      fill: { color: accentAt(p, i + 1) }, line: { type: 'none' },
    });
    s.addText(clean, {
      x: 0.95, y, w: 8.7, h: 0.55,
      fontSize: 13, color: p.textSecondary, fontFace: p.bodyFont,
      align: 'left', valign: 'middle', wrap: true,
    });
  });
}

// ─────────────────────────────────────────────────────────────
// CONCLUSION — "Impact" style
// ─────────────────────────────────────────────────────────────
function addConclusion(pptx: any, slideData: any, p: any, topic: string) {
  const s = pptx.addSlide();
  s.background = { color: p.bg };

  // Decorative BG circles
  s.addShape(pptx.shapes.OVAL, {
    x: -2.0, y: -1.5, w: 7, h: 7,
    fill: { color: p.accent, transparency: 91 }, line: { type: 'none' },
  });
  s.addShape(pptx.shapes.OVAL, {
    x: 6.5, y: 2.0, w: 5, h: 5,
    fill: { color: p.accentB, transparency: 91 }, line: { type: 'none' },
  });

  // Label
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.5, y: 0.22, w: 3.0, h: 0.5,
    fill: { color: p.accent, transparency: 20 }, line: { type: 'none' }, rectRadius: 0.25,
  });
  s.addText('KEY TAKEAWAYS', {
    x: 3.5, y: 0.22, w: 3.0, h: 0.5,
    fontSize: 10, bold: true, color: 'FFFFFF', fontFace: p.bodyFont,
    align: 'center', valign: 'middle', charSpacing: 2,
  });

  // Topic
  s.addText(cleanTitle(topic), {
    x: 0.5, y: 0.82, w: 9.0, h: 1.05,
    fontSize: 40, bold: true, color: p.textPrimary,
    fontFace: p.titleFont, align: 'center', valign: 'middle',
  });

  // Accent rule
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 2.2, y: 1.97, w: 5.6, h: 0.04,
    fill: { type: 'gradient', gradType: 'linear',
      stops: [{ position: 0, color: p.bg }, { position: 50, color: p.accent }, { position: 100, color: p.bg }], angle: 0 },
    line: { type: 'none' },
  });

  // Takeaway pills
  const lines = parseLines(slideData.content || '');
  lines.slice(0, 4).forEach((text: string, i: number) => {
    const clean = stripEmoji(text);
    const color = accentAt(p, i);
    const y = 2.15 + i * 0.78;

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 9.0, h: 0.65,
      fill: { color: p.cardBg }, line: { color, pt: 1 }, rectRadius: 0.08,
    });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 0.18, h: 0.65,
      fill: { color }, line: { type: 'none' }, rectRadius: 0.08,
    });
    s.addText(clean, {
      x: 0.85, y, w: 8.5, h: 0.65,
      fontSize: 13.5, color: p.textSecondary, fontFace: p.bodyFont,
      align: 'left', valign: 'middle',
    });
  });

  // Bottom bar
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 5.25, w: 10, h: 0.375,
    fill: { type: 'gradient', gradType: 'linear',
      stops: [{ position: 0, color: p.accent }, { position: 50, color: p.accentC }, { position: 100, color: p.accentD }], angle: 0 },
    line: { type: 'none' },
  });
  s.addText('Generated by StudyEarn AI', {
    x: 0, y: 5.25, w: 10, h: 0.375,
    fontSize: 10, bold: true, color: 'FFFFFF', fontFace: p.bodyFont,
    align: 'center', valign: 'middle', charSpacing: 1.5,
  });
}

// ─────────────────────────────────────────────────────────────
// TABLE OF CONTENTS (detailed style)
// ─────────────────────────────────────────────────────────────
function addTOC(pptx: any, slides: any[], p: any) {
  const s = pptx.addSlide();
  s.background = { color: p.bgAlt };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.18,
    fill: { color: p.accent }, line: { type: 'none' },
  });
  s.addText('Contents', {
    x: 0.5, y: 0.05, w: 9, h: 1.08,
    fontSize: 32, bold: true, color: 'FFFFFF', fontFace: p.titleFont,
    align: 'left', valign: 'middle',
  });

  const entries = slides.slice(2, slides.length - 1);
  entries.forEach((sl: any, i: number) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.75, y = 1.42 + row * 0.8;
    const color = accentAt(p, i);

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 4.5, h: 0.65,
      fill: { color: p.cardBg }, line: { color, pt: 1 },
      rectRadius: 0.08, shadow: shadowSm(),
    });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 0.55, h: 0.65,
      fill: { color }, line: { type: 'none' }, rectRadius: 0.08,
    });
    s.addText(String(i + 1), {
      x, y, w: 0.55, h: 0.65,
      fontSize: 15, bold: true, color: 'FFFFFF', fontFace: p.bodyFont,
      align: 'center', valign: 'middle',
    });
    s.addText(cleanTitle(sl.title), {
      x: x + 0.65, y, w: 3.75, h: 0.65,
      fontSize: 13, color: p.textSecondary, fontFace: p.bodyFont,
      align: 'left', valign: 'middle',
    });
  });
}

// Simple content for simple/detailed fallback
function addSimpleContent(pptx: any, slideData: any, p: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: slideNum % 2 === 0 ? p.bg : p.bgAlt };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.95,
    fill: { color: p.accent, transparency: 82 }, line: { type: 'none' },
  });
  s.addText(cleanTitle(slideData.title), {
    x: 0.5, y: 0.05, w: 8.5, h: 0.85,
    fontSize: 26, bold: true, color: p.textPrimary, fontFace: p.titleFont,
    align: 'left', valign: 'middle',
  });

  const lines = parseLines(slideData.content || '');
  const bulletData = lines.map((text: string, i: number) => ({
    text: stripEmoji(text),
    options: {
      bullet: { type: 'bullet' as const },
      breakLine: i < lines.length - 1,
      fontSize: 14,
      color: i === 0 ? p.textPrimary : p.textSecondary,
      bold: i === 0,
      paraSpaceAfter: 10,
    },
  }));
  s.addText(bulletData.length ? bulletData : [{ text: slideData.content, options: { fontSize: 14, color: p.textSecondary } }], {
    x: 0.6, y: 1.15, w: 8.8, h: 4.25, valign: 'top',
  });
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API — buildPPTX
// ─────────────────────────────────────────────────────────────
export async function buildPPTX(slides: any[], style: string, topic: string, classLevel: string): Promise<Buffer> {
  const rng = seededRandom(buildSeed(topic));

  // Pick random palette
  const palette = PALETTES[Math.floor(rng() * PALETTES.length)];

  const pptx: any = new (PptxGenJS as any)();
  pptx.layout  = 'LAYOUT_16x9';
  pptx.author  = 'StudyEarn AI';
  pptx.title   = topic || 'Presentation';
  pptx.subject = `${style} presentation for ${classLevel}`;

  if (style === 'simple') {
    // Simple: pick one of 3 title variants + consistent content
    const titleVariant = Math.floor(rng() * 3);
    if (titleVariant === 0) addTitleA(pptx, slides[0], palette, topic, classLevel);
    else if (titleVariant === 1) addTitleB(pptx, slides[0], palette, topic, classLevel);
    else addTitleC(pptx, slides[0], palette, topic, classLevel);

    slides.slice(1, slides.length - 1).forEach((sl, i) => addSimpleContent(pptx, sl, palette, i + 2));
    addConclusion(pptx, slides[slides.length - 1], palette, topic);

  } else if (style === 'detailed') {
    // Detailed: random title + TOC + shuffled layouts
    const titleVariant = Math.floor(rng() * 3);
    if (titleVariant === 0) addTitleA(pptx, slides[0], palette, topic, classLevel);
    else if (titleVariant === 1) addTitleB(pptx, slides[0], palette, topic, classLevel);
    else addTitleC(pptx, slides[0], palette, topic, classLevel);

    addTOC(pptx, slides, palette);

    // Shuffle layout order for this generation
    const detailedLayouts = shuffle(['numbered', 'diagonal', 'timeline', 'quote'], rng);
    slides.slice(2, slides.length - 1).forEach((sl, i) => {
      const layout = detailedLayouts[i % detailedLayouts.length];
      if (layout === 'numbered') addNumberedCards(pptx, sl, palette, i + 3);
      else if (layout === 'diagonal') addDiagonalSplit(pptx, sl, palette, i + 3);
      else if (layout === 'timeline') addTimeline(pptx, sl, palette, i + 3);
      else addBigQuote(pptx, sl, palette, i + 3);
    });
    addConclusion(pptx, slides[slides.length - 1], palette, topic);

  } else {
    // CREATIVE: random title variant, truly shuffled layout order, myth auto-detect
    const titleVariant = Math.floor(rng() * 3);
    if (titleVariant === 0) addTitleA(pptx, slides[0], palette, topic, classLevel);
    else if (titleVariant === 1) addTitleB(pptx, slides[0], palette, topic, classLevel);
    else addTitleC(pptx, slides[0], palette, topic, classLevel);

    const contentSlides = slides.slice(1, slides.length - 1);

    // Build shuffled layout sequence — guaranteed no two same adjacent
    const layoutPool = shuffle(
      ['spotlight', 'diagonal', 'numbered', 'timeline', 'quote',
       'spotlight', 'diagonal', 'numbered', 'timeline', 'quote'],
      rng
    );

    let layoutIdx = 0;
    contentSlides.forEach((sl) => {
      const titleLower = (sl.title || '').toLowerCase();
      const isMythSlide = titleLower.includes('myth') || titleLower.includes('misconception') || titleLower.includes('vs reality') || titleLower.includes('debunk');

      if (isMythSlide) {
        addDuel(pptx, sl, palette);
      } else {
        const layout = layoutPool[layoutIdx++ % layoutPool.length];
        if (layout === 'spotlight') addSpotlight(pptx, sl, palette);
        else if (layout === 'diagonal') addDiagonalSplit(pptx, sl, palette, layoutIdx + 1);
        else if (layout === 'numbered') addNumberedCards(pptx, sl, palette, layoutIdx + 1);
        else if (layout === 'timeline') addTimeline(pptx, sl, palette, layoutIdx + 1);
        else addBigQuote(pptx, sl, palette, layoutIdx + 1);
      }
    });

    addConclusion(pptx, slides[slides.length - 1], palette, topic);
  }

  return pptx.write('nodebuffer');
}

// ─────────────────────────────────────────────────────────────
// PROMPT BUILDER — v3
// Forces full sentences, richer content, no single-word bullets
// ─────────────────────────────────────────────────────────────
export function buildPPTPrompt(topic: string, classLevel: string, style: string): { system: string; user: string } {
  const levelMap: Record<string, string> = {
    '8':             'Class 8 (simple language, relatable examples, 1-2 sentence bullets)',
    '9':             'Class 9 (clear explanations, 2 sentence bullets)',
    '10':            'Class 10 (CBSE/ICSE level, exam-focused, precise 2-sentence bullets)',
    '11':            'Class 11 (advanced concepts, full technical sentences)',
    '12':            'Class 12 (board level, technical definitions and formulas in bullets)',
    'Undergraduate': 'Undergraduate (university depth, academic 2-3 sentence bullets)',
    'Postgraduate':  'Postgraduate (research level, peer-reviewed depth, 2-3 sentence bullets with specific facts or data)',
  };
  const level = levelMap[classLevel] || classLevel;
  const system = `You output ONLY valid JSON arrays. No explanation. No markdown. No text before or after. Start with [ and end with ].

CRITICAL RULE: Every bullet point MUST be a complete sentence of at least 10 words. NEVER write single words or short phrases like "NLP", "Computer Vision", "Supervised Learning" alone — always write a full descriptive sentence like "Natural Language Processing enables machines to understand and generate human language using statistical models."`;

  let slideList = '', rules = '', count = 6;

  if (style === 'simple') {
    count = 6;
    slideList = `Slide 1: Title with a catchy hook subtitle\nSlide 2: Introduction — what is ${topic} and why does it matter\nSlide 3: Key Concept 1 — explain the first major idea\nSlide 4: Key Concept 2 — explain the second major idea\nSlide 5: Key Takeaways — most important things to remember\nSlide 6: Conclusion — closing thoughts`;
    rules = `3-4 bullets per slide. Each bullet = 1 complete sentence, 10-15 words. Simple clear language for ${level}. No single-word bullets.`;

  } else if (style === 'detailed') {
    count = 10;
    slideList = `Slide 1: Title\nSlide 2: Overview and historical background of ${topic}\nSlide 3: Core concept A — the foundational principle\nSlide 4: Core concept B — the mechanism or process\nSlide 5: Core concept C — advanced aspects\nSlide 6: Key definitions and technical terminology\nSlide 7: Real-world applications and industry use\nSlide 8: Important data, facts, and statistics\nSlide 9: A detailed case study or real example\nSlide 10: Summary and future directions`;
    rules = `5-6 bullets per slide. Each bullet = 1-2 complete sentences, minimum 12 words each. Include specific facts, numbers, or examples wherever possible. Technical depth for ${level}.`;

  } else {
    count = 10;
    slideList = `Slide 1: Title with exciting hook subtitle about ${topic}\nSlide 2: Surprising Facts — 3 genuinely surprising standalone facts about ${topic}, each as a full sentence with specific data or numbers\nSlide 3: The Big Picture — explain why ${topic} matters globally in 4-5 full sentences\nSlide 4: Deep Dive Part 1 — the core mechanism or science behind ${topic} in 4 full sentences\nSlide 5: Deep Dive Part 2 — key methods, types, or components of ${topic} in 4 full sentences\nSlide 6: Deep Dive Part 3 — tools, techniques, or applications of ${topic} in 4 full sentences\nSlide 7: Step-by-Step Process — 4 sequential steps or stages in ${topic}, each explained in a sentence\nSlide 8: Real World Impact — 4 concrete real-world examples of ${topic} with specific outcomes\nSlide 9: Myths vs Reality — exactly 3 lines, each formatted as: "❌ Common myth about ${topic} → ✅ What research actually shows", each side minimum 8 words\nSlide 10: Key Takeaways — 4 powerful closing insights about ${topic}, each a memorable sentence`;
    rules = `MANDATORY: Every single bullet = minimum 10 words, complete sentence. Emojis allowed at start. No topic-name-only bullets. Specific facts, numbers, researcher names, years welcome. For slide 9, strictly follow the ❌ myth → ✅ reality format. Level: ${level}.`;
  }

  const user = `Create a ${count}-slide PowerPoint about "${topic}" for ${level}.

Slides:
${slideList}

Rules: ${rules}

Output this exact JSON structure (${count} objects):
[{"title":"...","content":"bullet1\\nbullet2\\nbullet3"}]`;

  return { system, user };
}

// ─────────────────────────────────────────────────────────────
// JSON EXTRACTOR
// ─────────────────────────────────────────────────────────────
export function extractJSONArray(text: string): any[] | null {
  if (!text) return null;
  const clean = (s: string) => s.replace(/```json/gi, '').replace(/```/g, '').replace(/[""]/g, '"').replace(/['']/g, "'").trim();
  const tryParse = (s: string) => { try { const p = JSON.parse(s); return Array.isArray(p) && p.length > 0 ? p : null; } catch { return null; } };

  let r = tryParse(clean(text));
  if (r) return r;

  const s = text.indexOf('['), e = text.lastIndexOf(']');
  if (s !== -1 && e > s) { r = tryParse(clean(text.slice(s, e + 1))); if (r) return r; }

  const fixed = clean(text).replace(/,\s*]/g, ']').replace(/,\s*}/g, '}');
  const s2 = fixed.indexOf('['), e2 = fixed.lastIndexOf(']');
  if (s2 !== -1 && e2 > s2) { r = tryParse(fixed.slice(s2, e2 + 1)); if (r) return r; }

  try {
    const objects: any[] = [];
    const re = /\{[^{}]*"title"[^{}]*"content"[^{}]*\}/gs;
    for (const m of text.matchAll(re)) { try { const o = JSON.parse(m[0]); if (o.title && o.content) objects.push(o); } catch {} }
    if (objects.length >= 3) return objects;
  } catch {}
  return null;
}