// ─────────────────────────────────────────────────────────────
// StudyEarn AI — PDF Service (FIXED + ULTRA FAST)
// ─────────────────────────────────────────────────────────────
// Changes:
//   1. sharp() ka mozjpeg REMOVED → Render pe crash fix
//   2. sharp() ke liye try/catch fallback → if sharp fails, raw buffer use karo
//   3. LibreOffice check improved → clear error message
//   4. imagesToPDF → parallel processing maintained
//   5. All pdf-lib operations: objectsPerTick: 50 (already fast)
// ─────────────────────────────────────────────────────────────

import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// A4 dimensions in points (72pt = 1 inch)
const A4_W = 595, A4_H = 842;

function fitToA4(w: number, h: number) {
  const r = Math.min(A4_W / w, A4_H / h);
  return { w: w * r, h: h * r };
}

// ─────────────────────────────────────────────────────────────
// HELPER: Safe sharp processing (Render pe native binary issue fix)
// ─────────────────────────────────────────────────────────────
async function safeProcessImage(file: Express.Multer.File): Promise<{
  buffer: Buffer;
  width: number;
  height: number;
  isJpeg: boolean;
}> {
  try {
    // mozjpeg: false → pure JS fallback, Render pe crash nahi karega
    const jpegBuf = await sharp(file.buffer)
      .rotate()                            // auto-orient from EXIF
      .jpeg({ quality: 92 })              // mozjpeg REMOVED — native crash fix
      .toBuffer();
    const meta = await sharp(jpegBuf).metadata();
    return { buffer: jpegBuf, width: meta.width!, height: meta.height!, isJpeg: true };
  } catch (sharpErr) {
    // sharp fail hua (e.g. Render native issue) → raw buffer fallback
    // Try to get dimensions from raw buffer using basic PNG/JPEG header parsing
    const buf = file.buffer;
    let width = 800, height = 600; // safe default

    // PNG: width at bytes 16-19, height at 20-23
    if (buf[0] === 0x89 && buf[1] === 0x50) {
      width  = buf.readUInt32BE(16);
      height = buf.readUInt32BE(20);
    }
    // JPEG: scan for SOF marker
    else if (buf[0] === 0xFF && buf[1] === 0xD8) {
      for (let i = 2; i < Math.min(buf.length - 8, 65536); i++) {
        if (buf[i] === 0xFF && (buf[i+1] === 0xC0 || buf[i+1] === 0xC2)) {
          height = buf.readUInt16BE(i + 5);
          width  = buf.readUInt16BE(i + 7);
          break;
        }
      }
    }

    // Detect if it's already JPEG
    const isJpeg = buf[0] === 0xFF && buf[1] === 0xD8;
    return { buffer: buf, width, height, isJpeg };
  }
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/** PDF buffer se text extract karo (pdf-parse use karta hai) */
export async function parsePDFText(buffer: Buffer): Promise<string> {
  const pdfParse: any = await import('pdf-parse');
  const data = await pdfParse(buffer);
  return (data.text || '').trim();
}

/** Images → ek PDF (ek page per image, A4 fitted) — ULTRA FAST */
export async function imagesToPDF(files: Express.Multer.File[]): Promise<Buffer> {
  // SPEED: saare images parallel process karo
  const processedImages = await Promise.all(
    files.map(safeProcessImage),
  );

  const pdfDoc = await PDFDocument.create();

  for (const { buffer, width, height, isJpeg } of processedImages) {
    const fitted = fitToA4(width, height);
    const page   = pdfDoc.addPage([A4_W, A4_H]);

    let image;
    if (isJpeg) {
      image = await pdfDoc.embedJpg(buffer);
    } else {
      // PNG ya other → embedPng try karo
      try {
        image = await pdfDoc.embedPng(buffer);
      } catch {
        // Last resort: jpeg embed karo (already converted buffer se)
        image = await pdfDoc.embedJpg(buffer);
      }
    }

    page.drawImage(image, {
      x:      (A4_W - fitted.w) / 2,
      y:      (A4_H - fitted.h) / 2,
      width:  fitted.w,
      height: fitted.h,
    });
  }

  // objectsPerTick=50 → much faster save for large PDFs
  return Buffer.from(await pdfDoc.save({ objectsPerTick: 50 }));
}

/** Multiple PDF buffers merge karke ek PDF banao */
export async function mergePDFs(files: Express.Multer.File[]): Promise<Buffer> {
  const merged = await PDFDocument.create();

  // SPEED: parallel load
  const loadedPDFs = await Promise.all(
    files.map(f => PDFDocument.load(f.buffer, { ignoreEncryption: true })),
  );

  for (const pdf of loadedPDFs) {
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }

  return Buffer.from(await merged.save({ objectsPerTick: 50 }));
}

/**
 * PDF se specific pages extract karo
 * pages format: "1,3,5-7" ya "all"
 */
export async function splitPDF(buffer: Buffer, pages: string): Promise<Buffer> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const total  = srcDoc.getPageCount();

  let pageIndices: number[] = [];
  if (!pages || pages === 'all') {
    pageIndices = Array.from({ length: total }, (_, i) => i);
  } else {
    for (const part of pages.split(',')) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [s, e] = trimmed.split('-').map((n: string) => parseInt(n.trim()) - 1);
        for (let i = s; i <= Math.min(e, total - 1); i++) pageIndices.push(i);
      } else {
        const idx = parseInt(trimmed) - 1;
        if (idx >= 0 && idx < total) pageIndices.push(idx);
      }
    }
  }

  if (!pageIndices.length) throw new Error('No valid pages selected');

  const newDoc = await PDFDocument.create();
  const copied = await newDoc.copyPages(srcDoc, pageIndices);
  copied.forEach(p => newDoc.addPage(p));

  return Buffer.from(await newDoc.save({ objectsPerTick: 50 }));
}

/** PDF compress karo (stream compression se) */
export async function compressPDF(buffer: Buffer): Promise<{
  pdfBuffer: Buffer;
  originalKB: number;
  compressedKB: number;
  savingsPercent: number;
}> {
  const srcDoc   = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pdfBytes = await srcDoc.save({ useObjectStreams: true, objectsPerTick: 50 });

  const originalKB     = Math.round(buffer.length / 1024);
  const compressedKB   = Math.round(pdfBytes.length / 1024);
  const savingsPercent = Math.max(0, Math.round((1 - compressedKB / originalKB) * 100));

  return { pdfBuffer: Buffer.from(pdfBytes), originalKB, compressedKB, savingsPercent };
}

/** Saare pages rotate karo (90, 180, 270 degrees) */
export async function rotatePDF(buffer: Buffer, deg: number): Promise<Buffer> {
  if (![90, 180, 270].includes(deg)) throw new Error('Degrees must be 90, 180, or 270');

  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  srcDoc.getPages().forEach(page => {
    const current = page.getRotation().angle;
    page.setRotation({ type: 0, angle: (current + deg) % 360 } as any);
  });

  return Buffer.from(await srcDoc.save({ objectsPerTick: 50 }));
}

/** Saare pages pe page numbers add karo */
export async function addPageNumbers(buffer: Buffer, position = 'bottom-center'): Promise<Buffer> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font   = await srcDoc.embedFont(StandardFonts.Helvetica);
  const pages  = srcDoc.getPages();
  const total  = pages.length;

  pages.forEach((page, i) => {
    const { width, height } = page.getSize();
    const text      = `${i + 1} / ${total}`;
    const fontSize  = 10;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    let x = (width - textWidth) / 2;
    if (position === 'bottom-right') x = width - textWidth - 30;

    page.drawText(text, { x, y: 20, size: fontSize, font, color: rgb(0.4, 0.4, 0.4), opacity: 0.8 });
  });

  return Buffer.from(await srcDoc.save({ objectsPerTick: 50 }));
}

/** Diagonal watermark text add karo saare pages pe */
export async function addWatermark(buffer: Buffer, text: string): Promise<Buffer> {
  const srcDoc    = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font      = await srcDoc.embedFont(StandardFonts.HelveticaBold);
  const cleanText = text.toUpperCase().slice(0, 30);

  srcDoc.getPages().forEach(page => {
    const { width, height } = page.getSize();
    const fontSize  = Math.min(width / cleanText.length * 1.5, 60);
    const textWidth = font.widthOfTextAtSize(cleanText, fontSize);

    page.drawText(cleanText, {
      x:       (width - textWidth) / 2,
      y:       (height - fontSize) / 2,
      size:    fontSize,
      font,
      color:   rgb(0.75, 0.75, 0.75),
      opacity: 0.25,
      rotate:  degrees(45),
    });
  });

  return Buffer.from(await srcDoc.save({ objectsPerTick: 50 }));
}

/** Word/PPT/Excel → PDF (LibreOffice se convert karo) */
export async function convertOfficeToPDF(inputBuffer: Buffer, originalName: string): Promise<Buffer> {
  // ── Sanitize filename ──
  const safeExt   = path.extname(originalName).toLowerCase();
  const safeName  = 'input' + safeExt;
  const tmpDir    = fs.mkdtempSync(path.join(os.tmpdir(), 'lo-'));
  const inputPath = path.join(tmpDir, safeName);
  const outPath   = path.join(tmpDir, 'input.pdf');

  try {
    fs.writeFileSync(inputPath, inputBuffer);

    // ── Find LibreOffice binary ──
    const loPaths = [
      'libreoffice',
      'soffice',
      '/usr/bin/libreoffice',
      '/usr/bin/soffice',
      '/usr/lib/libreoffice/program/soffice',
      '/Applications/LibreOffice.app/Contents/MacOS/soffice',
    ];

    let loCmd: string | null = null;
    for (const p of loPaths) {
      try {
        await execAsync(`"${p}" --version`, { timeout: 3000 });
        loCmd = p;
        break;
      } catch {}
    }

    // ── LibreOffice not found → clear user-friendly error ──
    if (!loCmd) {
      throw new Error(
        'Word/PPT/Excel → PDF conversion requires LibreOffice which is not installed on this server. ' +
        'Please ask the admin to install LibreOffice, or use an online converter like SmallPDF.',
      );
    }

    const cmd = `"${loCmd}" --headless --norestore --nofirststartwizard --nolockcheck --invisible --convert-to pdf --outdir "${tmpDir}" "${inputPath}"`;

    const { stderr } = await execAsync(cmd, {
      timeout: 60000,
      env: {
        ...process.env,
        HOME: tmpDir,
        UserInstallation: `file://${tmpDir}`,
      },
    });

    if (stderr && stderr.includes('Error')) {
      throw new Error(`LibreOffice error: ${stderr.substring(0, 200)}`);
    }

    if (!fs.existsSync(outPath)) {
      const altOut = path.join(tmpDir, safeName.replace(safeExt, '.pdf'));
      if (fs.existsSync(altOut)) return fs.readFileSync(altOut);
      throw new Error('LibreOffice conversion failed — output PDF not found. File might be password-protected or corrupted.');
    }

    const result = fs.readFileSync(outPath);
    if (result.length < 100) throw new Error('LibreOffice produced empty PDF — file may be corrupted.');
    return result;

  } finally {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
}