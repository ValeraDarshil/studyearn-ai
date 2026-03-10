// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Chat Routes
// ─────────────────────────────────────────────────────────────

import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  getConversations,
  getConversation,
  createConversation,
  appendMessages,
  renameConversation,
  deleteConversation,
} from '../controllers/chatController.js';

const router = Router();

// All chat routes require authentication
router.use(authenticate);

router.get('/',              getConversations);   // GET  /api/chat
router.get('/:id',           getConversation);    // GET  /api/chat/:id
router.post('/',             createConversation); // POST /api/chat
router.post('/:id/messages', appendMessages);     // POST /api/chat/:id/messages
router.patch('/:id/title',   renameConversation); // PATCH /api/chat/:id/title
router.delete('/:id',        deleteConversation); // DELETE /api/chat/:id

export default router;