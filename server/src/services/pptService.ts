// ─────────────────────────────────────────────────────────────
// StudyEarn AI — PPT Service v2 (COMPLETE REWRITE)
// ─────────────────────────────────────────────────────────────
// 7 visually distinct slide layouts — no two slides look the same
// Creative theme is actually creative now
// ─────────────────────────────────────────────────────────────

import PptxGenJS from 'pptxgenjs';

// ─────────────────────────────────────────────────────────────
// THEMES
// ─────────────────────────────────────────────────────────────
const THEMES = {
  simple: {
    bg: '0F1B35', bgAlt: '0D1829',
    accent: '4A90E2', accentB: '7BB3F0', accentC: '06B6D4',
    textPrimary: 'FFFFFF', textSecondary: 'B8C8E0', textMuted: '6B8AB0',
    cardBg: '1C2A48', cardBorder: '2D3F60',
    titleFont: 'Calibri', bodyFont: 'Calibri',
  },
  detailed: {
    bg: '1A1A2E', bgAlt: '16213E',
    accent: '7C3AED', accentB: 'A78BFA', accentC: '3B82F6',
    textPrimary: 'FFFFFF', textSecondary: 'C4B5FD', textMuted: '7B7FA8',
    cardBg: '252545', cardBorder: '3D3D6B',
    titleFont: 'Cambria', bodyFont: 'Calibri',
  },
  creative: {
    // Deep navy + electric violet + hot coral — premium feel
    bg: '0D0D1A', bgAlt: '12122A',
    accent: '7C3AED',    // electric violet — primary
    accentB: 'F97316',   // hot coral — secondary
    accentC: '06B6D4',   // cyan — tertiary
    accentD: 'EC4899',   // pink — fourth
    textPrimary: 'FFFFFF', textSecondary: 'C4B5FD', textMuted: '94A3B8',
    cardBg: '1A1A3A', cardBorder: '3D3D6B',
    titleFont: 'Trebuchet MS', bodyFont: 'Calibri',
  },
};
type ThemeKey = keyof typeof THEMES;

function shadow() {
  return { type: 'outer' as const, blur: 12, offset: 4, angle: 135, color: '000000', opacity: 0.35 };
}
function shadowSm() {
  return { type: 'outer' as const, blur: 6, offset: 2, angle: 135, color: '000000', opacity: 0.25 };
}

function parseLines(content: string): string[] {
  return content.split('\n')
    .map((l: string) => l.replace(/^[-•*▸→]\\s*/, '').trim())
    .filter((l: string) => l.length > 0);
}

// Strip leading emoji from a line (keep for display-only purposes)
function stripEmoji(text: string): string {
  return text.replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}✅❌💡⚡🌟🎯🔥💫🔬🎨📊📚🤖📈📱🏥🚗🌍🏙️💼🌱🚀🔍🤔]+\s*/gu, '').trim();
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 1 — CINEMATIC TITLE
// Full-bleed gradient left panel + clean right with big type
// ─────────────────────────────────────────────────────────────
function addTitleSlide(pptx: any, slide: any, theme: any, topic: string, classLevel: string, tk: ThemeKey) {
  const s = pptx.addSlide();
  s.background = { color: theme.bg };

  // Left panel — full-height gradient bar (40% width)
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.8, h: 5.625,
    fill: { type: 'gradient', gradType: 'linear', stops: [
      { position: 0, color: theme.accent },
      { position: 100, color: tk === 'creative' ? theme.accentD : theme.accentB },
    ], angle: 135 },
    line: { type: 'none' },
  });

  // Right side — subtle grid dots texture via small shapes
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      s.addShape(pptx.shapes.OVAL, {
        x: 4.4 + col * 1.1, y: 0.5 + row * 1.2, w: 0.08, h: 0.08,
        fill: { color: theme.accent }, line: { type: 'none' },
        transparency: 80,
      });
    }
  }

  // Slide number / level pill on left panel
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.35, y: 4.5, w: 3.1, h: 0.55,
    fill: { color: '000000', transparency: 35 },
    line: { type: 'none' }, rectRadius: 0.12,
  });
  s.addText(classLevel, {
    x: 0.35, y: 4.5, w: 3.1, h: 0.55,
    fontSize: 13, bold: true, color: 'FFFFFF', fontFace: theme.bodyFont,
    align: 'center', valign: 'middle',
  });

  // Main title — right side, big
  const title = (slide.title || topic).replace(/^[🚀💡⚡🎯🌟🔥✨🤖📊]\s*/u, '');
  s.addText(title, {
    x: 4.2, y: 1.0, w: 5.5, h: 2.6,
    fontSize: 40, bold: true, color: theme.textPrimary,
    fontFace: theme.titleFont, align: 'left', valign: 'middle',
    charSpacing: -0.5,
  });

  // Subtitle
  const subtitle = slide.subtitle || slide.content || `A Comprehensive Presentation`;
  const subText = parseLines(subtitle)[0] || subtitle;
  s.addText(subText, {
    x: 4.2, y: 3.7, w: 5.5, h: 0.7,
    fontSize: 16, color: theme.textSecondary, fontFace: theme.bodyFont, align: 'left',
  });

  // Bottom accent strip
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 3.8, y: 5.25, w: 6.2, h: 0.375,
    fill: { type: 'gradient', gradType: 'linear', stops: [
      { position: 0, color: theme.accentC },
      { position: 100, color: theme.bg },
    ], angle: 0 },
    line: { type: 'none' },
  });
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 2 — NUMBERED ICON CARDS
// 2×2 grid of numbered cards, big number + text — no more empty boxes
// ─────────────────────────────────────────────────────────────
function addNumberedCardsSlide(pptx: any, slideData: any, theme: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: theme.bg };

  // Header bar with gradient
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { type: 'gradient', gradType: 'linear', stops: [
      { position: 0, color: theme.accent },
      { position: 100, color: theme.accentC || theme.accent },
    ], angle: 0 },
    line: { type: 'none' },
  });

  s.addText(slideData.title.replace(/^[🚀💡⚡🎯🌟🔥✨🤖📊🌍🔍⭐🎨📐🔭🤔🖼️]\s*/u, ''), {
    x: 0.5, y: 0.05, w: 8.5, h: 1.0,
    fontSize: 28, bold: true, color: 'FFFFFF',
    fontFace: theme.titleFont, align: 'left', valign: 'middle',
  });

  const lines = parseLines(slideData.content || '');
  const cards = lines.slice(0, 4);
  const accentColors = [theme.accent, theme.accentB, theme.accentC || theme.accent, theme.accentD || theme.accentB];

  const positions = [
    { x: 0.4, y: 1.3 },
    { x: 5.2, y: 1.3 },
    { x: 0.4, y: 3.35 },
    { x: 5.2, y: 3.35 },
  ];
  const cardW = 4.5, cardH = 1.85;

  cards.forEach((text: string, i: number) => {
    const pos = positions[i];
    const color = accentColors[i];
    const cleanText = stripEmoji(text);

    // Card bg
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: pos.x, y: pos.y, w: cardW, h: cardH,
      fill: { color: theme.cardBg }, line: { color: theme.cardBorder, pt: 1 },
      shadow: shadowSm(), rectRadius: 0.1,
    });

    // Big number circle
    s.addShape(pptx.shapes.OVAL, {
      x: pos.x + 0.2, y: pos.y + 0.2, w: 0.9, h: 0.9,
      fill: { color }, line: { type: 'none' },
    });
    s.addText(String(i + 1), {
      x: pos.x + 0.2, y: pos.y + 0.2, w: 0.9, h: 0.9,
      fontSize: 20, bold: true, color: 'FFFFFF',
      fontFace: theme.bodyFont, align: 'center', valign: 'middle',
    });

    // Card text
    s.addText(cleanText, {
      x: pos.x + 1.3, y: pos.y + 0.15, w: 3.0, h: cardH - 0.3,
      fontSize: 13, color: theme.textSecondary, fontFace: theme.bodyFont,
      align: 'left', valign: 'middle', wrap: true,
    });

    // Left accent strip
    s.addShape(pptx.shapes.RECTANGLE, {
      x: pos.x, y: pos.y, w: 0.06, h: cardH,
      fill: { color }, line: { type: 'none' },
    });
  });
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 3 — DIAGONAL SPLIT (content-heavy, visually bold)
// Left: bold colored panel with big topic label
// Right: clean list with icon bullets
// ─────────────────────────────────────────────────────────────
function addDiagonalSplitSlide(pptx: any, slideData: any, theme: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: theme.bgAlt };

  // Left colored panel
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.6, h: 5.625,
    fill: { type: 'gradient', gradType: 'linear', stops: [
      { position: 0, color: theme.accent },
      { position: 100, color: theme.accentD || theme.accentB },
    ], angle: 160 },
    line: { type: 'none' },
  });

  // Diagonal wedge overlay
  s.addShape(pptx.shapes.RIGHT_TRIANGLE, {
    x: 2.8, y: 0, w: 1.0, h: 5.625,
    fill: { color: theme.bgAlt }, line: { type: 'none' },
    flipH: false,
  });

  // Slide number on left panel
  s.addText(String(slideNum).padStart(2, '0'), {
    x: 0.2, y: 0.2, w: 1.0, h: 0.8,
    fontSize: 36, bold: true, color: 'FFFFFF', fontFace: theme.titleFont,
    align: 'left', transparency: 40,
  });

  // Title vertical on left panel
  const title = slideData.title.replace(/^[🚀💡⚡🎯🌟🔥✨🤖📊🌍🔍⭐🎨📐🔭🤔🖼️]\s*/u, '');
  s.addText(title, {
    x: 0.15, y: 1.1, w: 3.2, h: 4.0,
    fontSize: 22, bold: true, color: 'FFFFFF',
    fontFace: theme.titleFont, align: 'left', valign: 'middle', wrap: true,
  });

  // Right side — bulleted list with row separators
  const lines = parseLines(slideData.content || '');
  lines.slice(0, 5).forEach((text: string, i: number) => {
    const y = 0.65 + i * 0.92;
    const cleanText = stripEmoji(text);

    // Row separator (except first)
    if (i > 0) {
      s.addShape(pptx.shapes.RECTANGLE, {
        x: 4.0, y: y - 0.1, w: 5.7, h: 0.01,
        fill: { color: theme.cardBorder }, line: { type: 'none' },
      });
    }

    // Bullet circle
    s.addShape(pptx.shapes.OVAL, {
      x: 3.95, y: y + 0.25, w: 0.3, h: 0.3,
      fill: { color: i % 2 === 0 ? theme.accent : theme.accentB },
      line: { type: 'none' },
    });

    // Text
    s.addText(cleanText, {
      x: 4.45, y, w: 5.3, h: 0.82,
      fontSize: 14, color: i === 0 ? theme.textPrimary : theme.textSecondary,
      fontFace: theme.bodyFont, bold: i === 0, align: 'left', valign: 'middle', wrap: true,
    });
  });
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 4 — STAT / QUOTE SPOTLIGHT
// For "Did You Know" / surprising facts — big bold callouts
// ─────────────────────────────────────────────────────────────
function addSpotlightSlide(pptx: any, slideData: any, theme: any) {
  const s = pptx.addSlide();
  s.background = { color: theme.bg };

  // Radial glow behind center — simulated with large transparent oval
  s.addShape(pptx.shapes.OVAL, {
    x: 1.5, y: -0.5, w: 7, h: 4.5,
    fill: { color: theme.accent, transparency: 88 }, line: { type: 'none' },
  });

  // Title — top, small label style
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 0.35, w: 9.0, h: 0.55,
    fill: { color: theme.cardBg }, line: { color: theme.cardBorder, pt: 1 },
    rectRadius: 0.27,
  });
  s.addText(slideData.title.replace(/^[🚀💡⚡🎯🌟🔥✨🤖📊🌍🔍⭐🎨📐🔭🤔🖼️]\s*/u, '').toUpperCase(), {
    x: 0.5, y: 0.35, w: 9.0, h: 0.55,
    fontSize: 12, bold: true, color: theme.accentB, fontFace: theme.bodyFont,
    align: 'center', valign: 'middle', charSpacing: 3,
  });

  // 3 big fact cards in a row
  const lines = parseLines(slideData.content || '');
  const facts = lines.slice(0, 3);
  const colors = [theme.accent, theme.accentB, theme.accentC || theme.accent];
  const cardW = 2.9;
  const gap = 0.15;

  facts.forEach((text: string, i: number) => {
    const x = 0.35 + i * (cardW + gap);
    const cleanText = stripEmoji(text);

    // Card
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.15, w: cardW, h: 3.9,
      fill: { color: theme.cardBg }, line: { color: colors[i], pt: 2 },
      shadow: shadow(), rectRadius: 0.15,
    });

    // Top colored accent strip
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.15, w: cardW, h: 0.55,
      fill: { color: colors[i] }, line: { type: 'none' },
      rectRadius: 0.15,
    });
    // Cover bottom corners of top strip
    s.addShape(pptx.shapes.RECTANGLE, {
      x, y: 1.5, w: cardW, h: 0.2,
      fill: { color: colors[i] }, line: { type: 'none' },
    });

    // Number label
    s.addText(String(i + 1), {
      x, y: 1.15, w: cardW, h: 0.55,
      fontSize: 14, bold: true, color: 'FFFFFF',
      fontFace: theme.titleFont, align: 'center', valign: 'middle',
    });

    // Fact text
    s.addText(cleanText, {
      x: x + 0.2, y: 1.85, w: cardW - 0.4, h: 2.9,
      fontSize: 14, color: theme.textSecondary, fontFace: theme.bodyFont,
      align: 'center', valign: 'middle', wrap: true,
    });
  });

  // Remaining facts below if any
  if (lines.length > 3) {
    const extra = stripEmoji(lines[3]);
    s.addText(`+ ${extra}`, {
      x: 0.5, y: 5.1, w: 9, h: 0.45,
      fontSize: 12, color: theme.textMuted, fontFace: theme.bodyFont, align: 'center',
    });
  }
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 5 — TIMELINE / STEPS
// Horizontal numbered steps with connecting line
// ─────────────────────────────────────────────────────────────
function addTimelineSlide(pptx: any, slideData: any, theme: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: theme.bgAlt };

  // Header
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: theme.bg }, line: { type: 'none' },
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 1.06, w: 10, h: 0.04,
    fill: { color: theme.accent }, line: { type: 'none' },
  });
  s.addText(slideData.title.replace(/^[🚀💡⚡🎯🌟🔥✨🤖📊🌍🔍⭐🎨📐🔭🤔🖼️]\s*/u, ''), {
    x: 0.5, y: 0.05, w: 8.5, h: 1.0,
    fontSize: 28, bold: true, color: theme.textPrimary,
    fontFace: theme.titleFont, align: 'left', valign: 'middle',
  });

  const lines = parseLines(slideData.content || '');
  const steps = lines.slice(0, 4);
  const accentColors = [theme.accent, theme.accentB, theme.accentC || theme.accent, theme.accentD || theme.accentB];

  // Horizontal connecting line
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 2.45, w: 8.4, h: 0.06,
    fill: { color: theme.cardBorder }, line: { type: 'none' },
  });

  const stepW = 8.4 / steps.length;
  steps.forEach((text: string, i: number) => {
    const cx = 0.8 + i * stepW + stepW / 2;
    const color = accentColors[i];
    const cleanText = stripEmoji(text);

    // Circle on timeline
    s.addShape(pptx.shapes.OVAL, {
      x: cx - 0.42, y: 2.14, w: 0.84, h: 0.84,
      fill: { color }, line: { color: theme.bg, pt: 3 }, shadow: shadowSm(),
    });
    s.addText(String(i + 1), {
      x: cx - 0.42, y: 2.14, w: 0.84, h: 0.84,
      fontSize: 18, bold: true, color: 'FFFFFF',
      fontFace: theme.titleFont, align: 'center', valign: 'middle',
    });

    // Content card BELOW timeline
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cx - stepW / 2 + 0.12, y: 3.15, w: stepW - 0.24, h: 2.15,
      fill: { color: theme.cardBg }, line: { color, pt: 1 },
      shadow: shadowSm(), rectRadius: 0.1,
    });
    s.addText(cleanText, {
      x: cx - stepW / 2 + 0.22, y: 3.2, w: stepW - 0.44, h: 2.0,
      fontSize: 12, color: theme.textSecondary, fontFace: theme.bodyFont,
      align: 'center', valign: 'middle', wrap: true,
    });

    // Connecting line segment (colored)
    if (i < steps.length - 1) {
      s.addShape(pptx.shapes.RECTANGLE, {
        x: cx + 0.42, y: 2.45, w: stepW - 0.84, h: 0.06,
        fill: { color: accentColors[i + 1] || theme.accent }, line: { type: 'none' },
        transparency: 40,
      });
    }
  });
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 6 — MYTHS VS REALITY (special layout for slide 9 type)
// Two-column clash: ❌ column vs ✅ column
// ─────────────────────────────────────────────────────────────
function addDuelSlide(pptx: any, slideData: any, theme: any) {
  const s = pptx.addSlide();
  s.background = { color: theme.bg };

  // Title banner
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.05,
    fill: { type: 'gradient', gradType: 'linear', stops: [
      { position: 0, color: theme.accent },
      { position: 100, color: theme.bg },
    ], angle: 0 },
    line: { type: 'none' },
  });
  s.addText(slideData.title.replace(/^[🚀💡⚡🎯🌟🔥✨🤖📊🌍🔍⭐🎨📐🔭🤔🖼️]\s*/u, ''), {
    x: 0.5, y: 0.05, w: 9, h: 0.95,
    fontSize: 26, bold: true, color: 'FFFFFF',
    fontFace: theme.titleFont, align: 'left', valign: 'middle',
  });

  // Left header — MYTH
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.15, w: 4.3, h: 0.6,
    fill: { color: 'C0392B' }, line: { type: 'none' }, rectRadius: 0.08,
  });
  s.addText('❌  MYTH', {
    x: 0.4, y: 1.15, w: 4.3, h: 0.6,
    fontSize: 16, bold: true, color: 'FFFFFF', fontFace: theme.titleFont,
    align: 'center', valign: 'middle',
  });

  // Right header — REALITY
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.3, y: 1.15, w: 4.3, h: 0.6,
    fill: { color: '27AE60' }, line: { type: 'none' }, rectRadius: 0.08,
  });
  s.addText('✅  REALITY', {
    x: 5.3, y: 1.15, w: 4.3, h: 0.6,
    fontSize: 16, bold: true, color: 'FFFFFF', fontFace: theme.titleFont,
    align: 'center', valign: 'middle',
  });

  // Parse lines — expect "❌ myth → ✅ truth" pairs
  const lines = parseLines(slideData.content || '');
  const maxRows = 3;
  const rowH = 1.1;

  lines.slice(0, maxRows).forEach((line: string, i: number) => {
    const y = 1.9 + i * rowH;
    // Try to split on →
    const parts = line.split('→');
    let myth = stripEmoji(parts[0] || line).replace(/^❌\s*/u, '').trim();
    let reality = stripEmoji(parts[1] || '').replace(/^✅\s*/u, '').trim();
    if (!reality) reality = myth; // fallback

    // Myth card
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.4, y, w: 4.3, h: rowH - 0.1,
      fill: { color: '1C0A0A' }, line: { color: 'C0392B', pt: 1 },
      rectRadius: 0.07,
    });
    s.addText(myth, {
      x: 0.55, y: y + 0.05, w: 4.0, h: rowH - 0.2,
      fontSize: 12, color: 'FF9999', fontFace: theme.bodyFont,
      align: 'left', valign: 'middle', wrap: true,
    });

    // Arrow divider
    s.addText('→', {
      x: 4.6, y, w: 0.8, h: rowH - 0.1,
      fontSize: 18, bold: true, color: theme.accentB,
      fontFace: theme.bodyFont, align: 'center', valign: 'middle',
    });

    // Reality card
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 5.3, y, w: 4.3, h: rowH - 0.1,
      fill: { color: '0A1C0A' }, line: { color: '27AE60', pt: 1 },
      rectRadius: 0.07,
    });
    s.addText(reality, {
      x: 5.45, y: y + 0.05, w: 4.0, h: rowH - 0.2,
      fontSize: 12, color: '99FF99', fontFace: theme.bodyFont,
      align: 'left', valign: 'middle', wrap: true,
    });
  });

  // Extra lines as a footer note
  if (lines.length > maxRows) {
    const extra = lines.slice(maxRows).map((l: string) => stripEmoji(l)).join('  •  ');
    s.addText(extra, {
      x: 0.5, y: 5.1, w: 9, h: 0.4,
      fontSize: 11, color: theme.textMuted, fontFace: theme.bodyFont, align: 'center',
    });
  }
}

// ─────────────────────────────────────────────────────────────
// LAYOUT 7 — CINEMATIC CONCLUSION
// Full-bleed with big centered text + glowing quote style
// ─────────────────────────────────────────────────────────────
function addConclusionSlide(pptx: any, slideData: any, theme: any, topic: string) {
  const s = pptx.addSlide();
  s.background = { color: theme.bg };

  // Background geometric — large decorative circles
  s.addShape(pptx.shapes.OVAL, {
    x: -1.5, y: -1.0, w: 6, h: 6,
    fill: { color: theme.accent, transparency: 90 }, line: { type: 'none' },
  });
  s.addShape(pptx.shapes.OVAL, {
    x: 7.0, y: 2.5, w: 4.5, h: 4.5,
    fill: { color: theme.accentB, transparency: 90 }, line: { type: 'none' },
  });

  // "KEY TAKEAWAYS" label
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.5, y: 0.25, w: 3.0, h: 0.5,
    fill: { color: theme.accent, transparency: 20 }, line: { type: 'none' },
    rectRadius: 0.25,
  });
  s.addText('KEY TAKEAWAYS', {
    x: 3.5, y: 0.25, w: 3.0, h: 0.5,
    fontSize: 10, bold: true, color: 'FFFFFF', fontFace: theme.bodyFont,
    align: 'center', valign: 'middle', charSpacing: 2,
  });

  // Main topic title
  s.addText(topic, {
    x: 0.6, y: 0.85, w: 8.8, h: 1.0,
    fontSize: 38, bold: true, color: theme.textPrimary,
    fontFace: theme.titleFont, align: 'center', valign: 'middle',
  });

  // Horizontal accent rule
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 2.5, y: 1.95, w: 5.0, h: 0.04,
    fill: { type: 'gradient', gradType: 'linear', stops: [
      { position: 0, color: theme.bg },
      { position: 50, color: theme.accent },
      { position: 100, color: theme.bg },
    ], angle: 0 },
    line: { type: 'none' },
  });

  // Takeaway points — centered pills
  const lines = parseLines(slideData.content || '');
  lines.slice(0, 4).forEach((text: string, i: number) => {
    const cleanText = stripEmoji(text);
    const color = [theme.accent, theme.accentB, theme.accentC || theme.accent, theme.accentD || theme.accentB][i];
    const y = 2.15 + i * 0.77;

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 9.0, h: 0.65,
      fill: { color: theme.cardBg }, line: { color, pt: 1 },
      rectRadius: 0.08,
    });
    // Color accent left tab
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 0.18, h: 0.65,
      fill: { color }, line: { type: 'none' }, rectRadius: 0.08,
    });
    s.addText(cleanText, {
      x: 0.85, y, w: 8.5, h: 0.65,
      fontSize: 14, color: theme.textSecondary, fontFace: theme.bodyFont,
      align: 'left', valign: 'middle',
    });
  });

  // Bottom row — StudyEarn branding
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 5.25, w: 10, h: 0.375,
    fill: { type: 'gradient', gradType: 'linear', stops: [
      { position: 0, color: theme.accent },
      { position: 50, color: theme.accentB },
      { position: 100, color: theme.accentC || theme.accent },
    ], angle: 0 },
    line: { type: 'none' },
  });
  s.addText('Generated by StudyEarn AI', {
    x: 0, y: 5.25, w: 10, h: 0.375,
    fontSize: 10, bold: true, color: 'FFFFFF', fontFace: theme.bodyFont,
    align: 'center', valign: 'middle', charSpacing: 1.5,
  });
}

// ─────────────────────────────────────────────────────────────
// TABLE OF CONTENTS (detailed only)
// ─────────────────────────────────────────────────────────────
function addTOCSlide(pptx: any, slides: any[], theme: any) {
  const s = pptx.addSlide();
  s.background = { color: theme.bgAlt };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.15,
    fill: { color: theme.accent }, line: { type: 'none' },
  });
  s.addText('Contents', {
    x: 0.5, y: 0.05, w: 9, h: 1.05,
    fontSize: 32, bold: true, color: 'FFFFFF', fontFace: theme.titleFont,
    align: 'left', valign: 'middle',
  });

  const entries = slides.slice(2, slides.length - 1);
  entries.forEach((sl: any, i: number) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.75;
    const y = 1.4 + row * 0.79;
    const color = [theme.accent, theme.accentB, theme.accentC || theme.accent, theme.accentD || theme.accent][i % 4];

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 4.5, h: 0.65,
      fill: { color: theme.cardBg }, line: { color, pt: 1 },
      rectRadius: 0.08, shadow: shadowSm(),
    });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 0.55, h: 0.65,
      fill: { color }, line: { type: 'none' }, rectRadius: 0.08,
    });
    s.addText(String(i + 1), {
      x, y, w: 0.55, h: 0.65,
      fontSize: 15, bold: true, color: 'FFFFFF',
      fontFace: theme.bodyFont, align: 'center', valign: 'middle',
    });
    s.addText(sl.title.replace(/^[🚀💡⚡🎯🌟🔥✨🤖📊🌍🔍⭐🎨📐🔭🤔🖼️]\s*/u, ''), {
      x: x + 0.65, y, w: 3.75, h: 0.65,
      fontSize: 13, color: theme.textSecondary,
      fontFace: theme.bodyFont, align: 'left', valign: 'middle',
    });
  });
}

// ─────────────────────────────────────────────────────────────
// LAYOUT — SIMPLE: clean single-column content slide
// ─────────────────────────────────────────────────────────────
function addSimpleContentSlide(pptx: any, slideData: any, theme: any, slideNum: number) {
  const s = pptx.addSlide();
  s.background = { color: slideNum % 2 === 0 ? theme.bg : theme.bgAlt };

  // Top colored band
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.95,
    fill: { color: theme.accent, transparency: 85 }, line: { type: 'none' },
  });
  s.addText(slideData.title, {
    x: 0.5, y: 0.05, w: 8.5, h: 0.85,
    fontSize: 26, bold: true, color: theme.textPrimary,
    fontFace: theme.titleFont, align: 'left', valign: 'middle',
  });

  const lines = parseLines(slideData.content || '');
  const bulletData = lines.map((text: string, i: number) => ({
    text,
    options: {
      bullet: { type: 'bullet' as const },
      breakLine: i < lines.length - 1,
      fontSize: 15,
      color: i === 0 ? theme.textPrimary : theme.textSecondary,
      bold: i === 0,
      paraSpaceAfter: 10,
    },
  }));
  s.addText(bulletData.length > 0 ? bulletData : [{ text: slideData.content, options: { fontSize: 15, color: theme.textSecondary } }], {
    x: 0.6, y: 1.15, w: 8.8, h: 4.25, valign: 'top',
  });
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────
export async function buildPPTX(slides: any[], style: string, topic: string, classLevel: string): Promise<Buffer> {
  const themeKey = (style as ThemeKey) in THEMES ? (style as ThemeKey) : 'simple';
  const theme = THEMES[themeKey] as any;
  const pptx: any = new (PptxGenJS as any)();

  pptx.layout  = 'LAYOUT_16x9';
  pptx.author  = 'StudyEarn AI';
  pptx.title   = topic || 'Presentation';
  pptx.subject = `${style} presentation for ${classLevel}`;

  if (themeKey === 'simple') {
    // Simple: consistent clean layout throughout
    addTitleSlide(pptx, slides[0], theme, topic, classLevel, 'simple');
    slides.slice(1, slides.length - 1).forEach((sl, i) => addSimpleContentSlide(pptx, sl, theme, i + 2));
    addConclusionSlide(pptx, slides[slides.length - 1], theme, topic);

  } else if (themeKey === 'detailed') {
    // Detailed: TOC + rotating layouts
    addTitleSlide(pptx, slides[0], theme, topic, classLevel, 'detailed');
    addTOCSlide(pptx, slides, theme);
    slides.slice(2, slides.length - 1).forEach((sl, i) => {
      if (i % 4 === 0) addNumberedCardsSlide(pptx, sl, theme, i + 3);
      else if (i % 4 === 1) addDiagonalSplitSlide(pptx, sl, theme, i + 3);
      else if (i % 4 === 2) addTimelineSlide(pptx, sl, theme, i + 3);
      else addSimpleContentSlide(pptx, sl, theme, i + 3);
    });
    addConclusionSlide(pptx, slides[slides.length - 1], theme, topic);

  } else {
    // CREATIVE: every slide uses a completely different layout
    // Slide 1: Cinematic title
    addTitleSlide(pptx, slides[0], theme, topic, classLevel, 'creative');

    const contentSlides = slides.slice(1, slides.length - 1);
    contentSlides.forEach((sl, i) => {
      // Rotate through 5 distinct layouts — no two adjacent slides the same
      const titleLower = (sl.title || '').toLowerCase();
      const isMythSlide = titleLower.includes('myth') || titleLower.includes('misconception') || titleLower.includes('vs');

      if (isMythSlide) {
        addDuelSlide(pptx, sl, theme);
      } else {
        const layout = i % 5;
        if (layout === 0) addSpotlightSlide(pptx, sl, theme);
        else if (layout === 1) addDiagonalSplitSlide(pptx, sl, theme, i + 2);
        else if (layout === 2) addNumberedCardsSlide(pptx, sl, theme, i + 2);
        else if (layout === 3) addTimelineSlide(pptx, sl, theme, i + 2);
        else addSpotlightSlide(pptx, sl, theme); // fallback to spotlight again
      }
    });

    // Last slide: Cinematic conclusion
    addConclusionSlide(pptx, slides[slides.length - 1], theme, topic);
  }

  return pptx.write('nodebuffer');
}

/** AI ke liye PPT prompt build karo */
export function buildPPTPrompt(topic: string, classLevel: string, style: string): { system: string; user: string } {
  const levelMap: Record<string, string> = {
    '8':             'Class 8 (age 13-14, simple language, basic concepts)',
    '9':             'Class 9 (age 14-15, clear explanations, standard terms)',
    '10':            'Class 10 (CBSE/ICSE board level, exam-focused)',
    '11':            'Class 11 (advanced concepts, technical terms)',
    '12':            'Class 12 (full board level, technical definitions, formulas)',
    'Undergraduate': 'Undergraduate (university depth, academic language)',
    'Postgraduate':  'Postgraduate (advanced theories, research level, peer-reviewed depth)',
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
    // Creative — specific structure so layouts look good
    count = 10;
    slideList = `Slide 1: Title (exciting hook subtitle)\nSlide 2: Did You Know? (3 surprising standalone facts about ${topic})\nSlide 3: The Big Picture (5 key aspects, each a full sentence)\nSlide 4: Deep Dive Part 1 (4 detailed points with technical depth)\nSlide 5: Deep Dive Part 2 (4 detailed points, different angle)\nSlide 6: Deep Dive Part 3 (4 detailed points, applications/tools)\nSlide 7: Step-by-Step Process (4 sequential steps or stages)\nSlide 8: Real World Impact (4 concrete real-world examples)\nSlide 9: Myths vs Reality (3 lines each as: "❌ Common myth about ${topic} → ✅ What research actually shows")\nSlide 10: Key Takeaways (4 memorable closing insights)`;
    rules = `Start each bullet with a relevant emoji. Use vivid, graduate-level language. 3-5 bullets per slide. Slide 9 MUST use format: "❌ myth → ✅ reality".`;
  }

  const user = `Create a ${count}-slide PowerPoint about "${topic}" for ${level}.\n\nSlides:\n${slideList}\n\nRules: ${rules}\n\nOutput this exact JSON structure (${count} objects):\n[{"title":"...","content":"bullet1\\nbullet2\\nbullet3"}]`;
  return { system, user };
}

/** AI response se JSON array extract karo (messy response handle) */
export function extractJSONArray(text: string): any[] | null {
  if (!text) return null;
  try {
    const clean  = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  try {
    const start = text.indexOf('[');
    const end   = text.lastIndexOf(']');
    if (start !== -1 && end > start) {
      const parsed = JSON.parse(text.slice(start, end + 1));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
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