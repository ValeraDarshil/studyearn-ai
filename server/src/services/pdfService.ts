// ─────────────────────────────────────────────────────────────
// StudyEarn AI — PDF Service
// ─────────────────────────────────────────────────────────────
// Saare PDF operations yahan hote hain:
// img→pdf, merge, split, compress, rotate,
// page numbers, watermark, office→pdf (LibreOffice)
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
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/** PDF buffer se text extract karo (pdf-parse use karta hai) */
export async function parsePDFText(buffer: Buffer): Promise<string> {
  const pdfParse: any = await import('pdf-parse');
  const data = await pdfParse(buffer);
  return (data.text || '').trim();
}

/** Images → ek PDF (ek page per image, A4 fitted) */
export async function imagesToPDF(files: Express.Multer.File[]): Promise<Buffer> {
  // SPEED: saare images parallel process karo
  const processedImages = await Promise.all(
    files.map(async (file) => {
      // JPEG 3-5x faster than PNG for photos
      const jpegBuf = await sharp(file.buffer)
        .rotate()  // auto-orient from EXIF
        .jpeg({ quality: 92, mozjpeg: true })
        .toBuffer();
      const meta = await sharp(jpegBuf).metadata();
      return { buffer: jpegBuf, width: meta.width!, height: meta.height! };
    }),
  );

  const pdfDoc = await PDFDocument.create();
  for (const { buffer, width, height } of processedImages) {
    const image  = await pdfDoc.embedJpg(buffer);
    const fitted = fitToA4(width, height);
    const page   = pdfDoc.addPage([A4_W, A4_H]);
    page.drawImage(image, {
      x: (A4_W - fitted.w) / 2,
      y: (A4_H - fitted.h) / 2,
      width: fitted.w,
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

  const originalKB    = Math.round(buffer.length / 1024);
  const compressedKB  = Math.round(pdfBytes.length / 1024);
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
      x: (width - textWidth) / 2,
      y: (height - fontSize) / 2,
      size: fontSize,
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
  const tmpDir    = fs.mkdtempSync(path.join(os.tmpdir(), 'lo-'));
  const inputPath = path.join(tmpDir, originalName);
  const outName   = originalName.replace(/\.[^.]+$/, '.pdf');
  const outPath   = path.join(tmpDir, outName);

  try {
    fs.writeFileSync(inputPath, inputBuffer);
    await execAsync(
      `libreoffice --headless --convert-to pdf --outdir "${tmpDir}" "${inputPath}"`,
      { timeout: 30000 },
    );
    if (!fs.existsSync(outPath)) throw new Error('LibreOffice conversion failed — output not found');
    return fs.readFileSync(outPath);
  } finally {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
}