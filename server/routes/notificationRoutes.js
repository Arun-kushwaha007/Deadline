import express from 'express';
import Notification from '../models/Notification.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user's notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

export default router;
