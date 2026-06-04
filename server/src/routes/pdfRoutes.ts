// ─────────────────────────────────────────────────────────────
// StudyEarn AI — PDF Routes (PUBLIC — No Login Required)
// ─────────────────────────────────────────────────────────────
// PATH: server/src/routes/pdfRoutes.ts
//
// ✅ ONLY CHANGE: authenticate → authenticateOptional
//    Baki sab exactly same hai.
// ─────────────────────────────────────────────────────────────

import { Router } from 'express';
import multer from 'multer';
import {
  imgToPDF, mergePDF, splitPDFHandler, compressPDFHandler,
  rotatePDFHandler, pageNumbersHandler, watermarkHandler, officeToPDFHandler,
} from '../controllers/pdfController.js';
import { fileToolsLimiter } from '../middleware/rateLimiter.js';
import { authenticateOptional } from '../middleware/authMiddleware.js'; // ✅ CHANGED

const router      = Router();
const uploadMulti  = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
const uploadSingle = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// POST /api/img-to-pdf
router.post('/img-to-pdf',       authenticateOptional, fileToolsLimiter, uploadMulti.array('files', 20),  imgToPDF);

// POST /api/merge-pdf
router.post('/merge-pdf',        authenticateOptional, fileToolsLimiter, uploadMulti.array('files', 20),  mergePDF);

// POST /api/split-pdf
router.post('/split-pdf',        authenticateOptional, fileToolsLimiter, uploadSingle.single('file'),     splitPDFHandler);

// POST /api/compress-pdf
router.post('/compress-pdf',     authenticateOptional, fileToolsLimiter, uploadSingle.single('file'),     compressPDFHandler);

// POST /api/rotate-pdf
router.post('/rotate-pdf',       authenticateOptional, fileToolsLimiter, uploadSingle.single('file'),     rotatePDFHandler);

// POST /api/pdf-page-numbers
router.post('/pdf-page-numbers', authenticateOptional, fileToolsLimiter, uploadSingle.single('file'),     pageNumbersHandler);

// POST /api/pdf-watermark
router.post('/pdf-watermark',    authenticateOptional, fileToolsLimiter, uploadSingle.single('file'),     watermarkHandler);

// POST /api/word-to-pdf
router.post('/word-to-pdf',      authenticateOptional, fileToolsLimiter, uploadSingle.single('file'),     officeToPDFHandler);

// POST /api/ppt-to-pdf
router.post('/ppt-to-pdf',       authenticateOptional, fileToolsLimiter, uploadSingle.single('file'),     officeToPDFHandler);

// POST /api/excel-to-pdf
router.post('/excel-to-pdf',     authenticateOptional, fileToolsLimiter, uploadSingle.single('file'),     officeToPDFHandler);

export default router;