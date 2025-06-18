import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js'; // Added import for User model
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user's notifications with filtering
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, isRead } = req.query;
    const query = { userId: req.user._id };

    if (type) {
      query.type = type;
    }

    if (isRead !== undefined) {
      query.isRead = isRead === 'true'; // Convert string to boolean
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, // Ensure user owns the notification
      { isRead: true },
      { new: true } // Return the updated document
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or user unauthorized' });
    }
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: 'Update failed' });
  }
});

// Mark as unread
router.put('/:id/unread', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, // Ensure user owns the notification
      { isRead: false },
      { new: true } // Return the updated document
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or user unauthorized' });
    }
    res.status(200).json({ message: 'Notification marked as unread', notification });
  } catch (err) {
    console.error('Error marking notification as unread:', err);
    res.status(500).json({ message: 'Update failed' });
  }
});

// POST /api/notifications/token - Save FCM token for push notifications
router.post('/token', authMiddleware, async (req, res) => {
  const { token } = req.body;
  const userId = req.user.id; // Assuming req.user.id is available from authMiddleware

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fcmToken = token;
    await user.save();

    res.status(200).json({ message: 'Token saved successfully' });
  } catch (err) {
    console.error('Error saving FCM token:', err);
    res.status(500).json({ message: 'Error saving token' });
  }
});

export default router;
