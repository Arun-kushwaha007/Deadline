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

router.post('/send', createInvitation); 
router.get('/pending', getPendingInvitations); 
router.post('/:invitationId/accept', acceptInvitation); 
router.post('/:invitationId/reject', rejectInvitation);

export default router;
