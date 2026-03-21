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
import { authenticate } from '../middleware/authMiddleware.js';

const router      = Router();
const uploadMulti  = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
const uploadSingle = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// Note: authenticate before multer — multer reads body after auth check
// POST /api/img-to-pdf
router.post('/img-to-pdf',       authenticate, fileToolsLimiter, uploadMulti.array('files', 20),  imgToPDF);

// POST /api/merge-pdf
router.post('/merge-pdf',        authenticate, fileToolsLimiter, uploadMulti.array('files', 20),  mergePDF);

// POST /api/split-pdf
router.post('/split-pdf',        authenticate, fileToolsLimiter, uploadSingle.single('file'),      splitPDFHandler);

// POST /api/compress-pdf
router.post('/compress-pdf',     authenticate, fileToolsLimiter, uploadSingle.single('file'),      compressPDFHandler);

// POST /api/rotate-pdf
router.post('/rotate-pdf',       authenticate, fileToolsLimiter, uploadSingle.single('file'),      rotatePDFHandler);

// POST /api/pdf-page-numbers
router.post('/pdf-page-numbers', authenticate, fileToolsLimiter, uploadSingle.single('file'),      pageNumbersHandler);

// POST /api/pdf-watermark
router.post('/pdf-watermark',    authenticate, fileToolsLimiter, uploadSingle.single('file'),      watermarkHandler);

// POST /api/word-to-pdf
router.post('/word-to-pdf',      authenticate, fileToolsLimiter, uploadSingle.single('file'),      officeToPDFHandler);

// POST /api/ppt-to-pdf
router.post('/ppt-to-pdf',       authenticate, fileToolsLimiter, uploadSingle.single('file'),      officeToPDFHandler);

// POST /api/excel-to-pdf
router.post('/excel-to-pdf',     authenticate, fileToolsLimiter, uploadSingle.single('file'),      officeToPDFHandler);

export default router;