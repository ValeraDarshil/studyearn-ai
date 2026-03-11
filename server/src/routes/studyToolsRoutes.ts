// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Study Tools Routes
// POST /api/study/improve-notes
// POST /api/study/analyze-pdf
// ─────────────────────────────────────────────────────────────

import { Router } from 'express';
import multer from 'multer';
import { improveNotes, analyzePDF } from '../controllers/studyToolsController.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  },
});

router.post('/improve-notes', improveNotes);
router.post('/analyze-pdf',   upload.single('file'), analyzePDF);

export default router;