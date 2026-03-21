// ─────────────────────────────────────────────────────────────
// StudyEarn AI — PDF Routes
// ─────────────────────────────────────────────────────────────

import { Router } from 'express';
import multer from 'multer';
import {
  imgToPDF, mergePDF, splitPDFHandler, compressPDFHandler,
  rotatePDFHandler, pageNumbersHandler, watermarkHandler, officeToPDFHandler,
} from '../controllers/pdfController.js';
import { fileToolsLimiter } from '../middleware/rateLimiter.js';

const router      = Router();
const uploadMulti  = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
const uploadSingle = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// POST /api/img-to-pdf
router.post('/img-to-pdf',       fileToolsLimiter, uploadMulti.array('files', 20),  imgToPDF);

// POST /api/merge-pdf
router.post('/merge-pdf',        fileToolsLimiter, uploadMulti.array('files', 20),  mergePDF);

// POST /api/split-pdf
router.post('/split-pdf',        fileToolsLimiter, uploadSingle.single('file'),      splitPDFHandler);

// POST /api/compress-pdf
router.post('/compress-pdf',     fileToolsLimiter, uploadSingle.single('file'),      compressPDFHandler);

// POST /api/rotate-pdf
router.post('/rotate-pdf',       fileToolsLimiter, uploadSingle.single('file'),      rotatePDFHandler);

// POST /api/pdf-page-numbers
router.post('/pdf-page-numbers', fileToolsLimiter, uploadSingle.single('file'),      pageNumbersHandler);

// POST /api/pdf-watermark
router.post('/pdf-watermark',    fileToolsLimiter, uploadSingle.single('file'),      watermarkHandler);

// POST /api/word-to-pdf
router.post('/word-to-pdf',      fileToolsLimiter, uploadSingle.single('file'),      officeToPDFHandler);

// POST /api/ppt-to-pdf
router.post('/ppt-to-pdf',       fileToolsLimiter, uploadSingle.single('file'),      officeToPDFHandler);

// POST /api/excel-to-pdf
router.post('/excel-to-pdf',     fileToolsLimiter, uploadSingle.single('file'),      officeToPDFHandler);

export default router;