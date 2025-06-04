import express from 'express';
import {
  createInvitation,
  getPendingInvitations,
  acceptInvitation,
  rejectInvitation,
} from '../controllers/invitationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file will be protected by authMiddleware
router.use(authMiddleware);

router.post('/send', createInvitation); // POST /api/invitations/send
router.get('/pending', getPendingInvitations); // GET /api/invitations/pending
router.post('/:invitationId/accept', acceptInvitation); // POST /api/invitations/:invitationId/accept
router.post('/:invitationId/reject', rejectInvitation); // POST /api/invitations/:invitationId/reject

export default router;
