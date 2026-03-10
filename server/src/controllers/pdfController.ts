// ─────────────────────────────────────────────────────────────
// StudyEarn AI — PDF Controller
// ─────────────────────────────────────────────────────────────
// Saare PDF tool endpoints handle karta hai
// Heavy lifting → pdfService mein hai
// ─────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import path from 'path';
import {
  imagesToPDF, mergePDFs, splitPDF, compressPDF,
  rotatePDF, addPageNumbers, addWatermark, convertOfficeToPDF,
} from '../services/pdfService.js';
import { getUserIdFromToken } from '../middleware/authMiddleware.js';
import { User } from '../models/User.model.js';
import { Activity } from '../models/Activity.model.js';
import { logger } from '../utils/logger.js';

// ─────────────────────────────────────────────────────────────
// PRIVATE HELPER — PDF action pe points award karo
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// POINTS CONSTANTS
// ─────────────────────────────────────────────────────────────
const BASE_PDF_POINTS    = 10;
const PREMIUM_MULTIPLIER = 2;

function isPremiumValid(user: any): boolean {
  if (!user.isPremium) return false;
  if (!user.premiumExpiresAt) return false;
  if (new Date(user.premiumExpiresAt) < new Date()) {
    user.isPremium = false;
    user.premiumExpiresAt = null;
    return false;
  }
  return true;
}

async function handlePDFAction(req: Request, actionLabel: string): Promise<void> {
  const userId = getUserIdFromToken(req);
  if (!userId) return;
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const premium = isPremiumValid(user);
    const pts     = premium ? BASE_PDF_POINTS * PREMIUM_MULTIPLIER : BASE_PDF_POINTS;
    // free=10, premium=20

    user.points                     += pts;
    (user as any).totalXP            = ((user as any).totalXP || 0) + pts;
    (user as any).totalPDFsConverted = ((user as any).totalPDFsConverted || 0) + 1;
    await user.save();
    await Activity.create({ userId, action: 'convert_pdf', details: actionLabel, pointsEarned: pts });
    logger.info(`PDF action (${actionLabel}): ${user.email} | premium=${premium} | +${pts}pts`);
  } catch (err: any) {
    logger.error('handlePDFAction error:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/img-to-pdf
// ─────────────────────────────────────────────────────────────
export async function imgToPDF(req: Request, res: Response) {
  const start = Date.now();
  try {
    const files: Express.Multer.File[] = (req as any).files || [];
    if (!files.length) return res.status(400).json({ success: false, message: 'No files uploaded' });

    const buffer = await imagesToPDF(files);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    res.send(buffer);

    logger.info(`IMG→PDF: ${files.length} files in ${Date.now() - start}ms`);
    handlePDFAction(req, 'Converted images to PDF').catch(logger.error);
  } catch (err: any) {
    logger.error('IMG→PDF ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/merge-pdf
// ─────────────────────────────────────────────────────────────
export async function mergePDF(req: Request, res: Response) {
  const start = Date.now();
  try {
    const files: Express.Multer.File[] = (req as any).files || [];
    if (!files || files.length < 2) {
      return res.status(400).json({ success: false, message: 'Upload at least 2 PDF files' });
    }

    const buffer = await mergePDFs(files);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.send(buffer);

    logger.info(`MERGE-PDF: ${files.length} files in ${Date.now() - start}ms`);
    handlePDFAction(req, 'Merged PDF files').catch(logger.error);
  } catch (err: any) {
    logger.error('MERGE PDF ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/split-pdf
// ─────────────────────────────────────────────────────────────
export async function splitPDFHandler(req: Request, res: Response) {
  const start = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const { pages } = req.body;
    const buffer    = await splitPDF(req.file.buffer, pages);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=split.pdf');
    res.send(buffer);

    logger.info(`SPLIT-PDF in ${Date.now() - start}ms`);
    handlePDFAction(req, 'Split PDF pages').catch(logger.error);
  } catch (err: any) {
    logger.error('SPLIT PDF ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/compress-pdf
// ─────────────────────────────────────────────────────────────
export async function compressPDFHandler(req: Request, res: Response) {
  const start = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const { pdfBuffer, originalKB, compressedKB, savingsPercent } = await compressPDF(req.file.buffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
    res.setHeader('X-Original-Size',   originalKB.toString());
    res.setHeader('X-Compressed-Size', compressedKB.toString());
    res.setHeader('X-Savings-Percent', savingsPercent.toString());
    res.send(pdfBuffer);

    logger.info(`COMPRESS-PDF: ${originalKB}KB → ${compressedKB}KB (${savingsPercent}% saved) in ${Date.now() - start}ms`);
    handlePDFAction(req, 'Compressed PDF').catch(logger.error);
  } catch (err: any) {
    logger.error('COMPRESS PDF ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/rotate-pdf
// ─────────────────────────────────────────────────────────────
export async function rotatePDFHandler(req: Request, res: Response) {
  const start = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const deg    = parseInt(req.body.degrees || '90');
    const buffer = await rotatePDF(req.file.buffer, deg);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rotated.pdf');
    res.send(buffer);

    logger.info(`ROTATE-PDF: ${deg}° in ${Date.now() - start}ms`);
    handlePDFAction(req, 'Rotated PDF').catch(logger.error);
  } catch (err: any) {
    logger.error('ROTATE PDF ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/pdf-page-numbers
// ─────────────────────────────────────────────────────────────
export async function pageNumbersHandler(req: Request, res: Response) {
  const start = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const position = req.body.position || 'bottom-center';
    const buffer   = await addPageNumbers(req.file.buffer, position);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=numbered.pdf');
    res.send(buffer);

    logger.info(`PAGE-NUMBERS in ${Date.now() - start}ms`);
    handlePDFAction(req, 'Added page numbers to PDF').catch(logger.error);
  } catch (err: any) {
    logger.error('PAGE NUMBERS ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/pdf-watermark
// ─────────────────────────────────────────────────────────────
export async function watermarkHandler(req: Request, res: Response) {
  const start = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const text   = req.body.text || 'CONFIDENTIAL';
    const buffer = await addWatermark(req.file.buffer, text);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=watermarked.pdf');
    res.send(buffer);

    logger.info(`WATERMARK: "${text}" in ${Date.now() - start}ms`);
    handlePDFAction(req, 'Added watermark to PDF').catch(logger.error);
  } catch (err: any) {
    logger.error('WATERMARK ERROR:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/word-to-pdf
// POST /api/ppt-to-pdf
// POST /api/excel-to-pdf
// (teeno same controller use karte hain)
// ─────────────────────────────────────────────────────────────
export async function officeToPDFHandler(req: Request, res: Response) {
  const start = Date.now();
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const ext = path.extname(req.file.originalname).toLowerCase();
    const allowed = ['.docx', '.doc', '.odt', '.pptx', '.ppt', '.xlsx', '.xls', '.ods'];
    if (!allowed.includes(ext)) {
      return res.status(400).json({ success: false, message: `Unsupported file type: ${ext}. Allowed: ${allowed.join(', ')}` });
    }

    const pdfBuffer = await convertOfficeToPDF(req.file.buffer, req.file.originalname);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    res.send(pdfBuffer);

    logger.info(`OFFICE→PDF: ${req.file.originalname} in ${Date.now() - start}ms`);
    handlePDFAction(req, `Converted ${req.file.originalname} to PDF`).catch(logger.error);
  } catch (err: any) {
    logger.error('OFFICE→PDF ERROR:', err.message);
    const isLOError = err.message.includes('LibreOffice') || err.message.includes('soffice');
    res.status(500).json({
      success: false,
      message: isLOError
        ? 'Conversion failed. Make sure the file is not password-protected or corrupted. If the problem persists, try saving the file again before uploading.'
        : 'Conversion failed: ' + err.message,
    });
  }
}