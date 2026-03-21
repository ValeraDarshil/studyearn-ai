// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Study Tools Routes
// POST /api/study/improve-notes
// POST /api/study/analyze-pdf
// ─────────────────────────────────────────────────────────────

import { Router } from 'express';
import multer from 'multer';
import { improveNotes, analyzePDF } from '../controllers/studyToolsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  },
});

// authenticate middleware — login required for all study tools
router.post('/improve-notes', authenticate, improveNotes);
router.post('/analyze-pdf',   authenticate, upload.single('file'), analyzePDF);

export default router;