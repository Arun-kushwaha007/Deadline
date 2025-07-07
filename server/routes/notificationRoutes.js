import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user's notifications with filtering
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, isRead } = req.query;

    const query = { userId: req.user.userId };
    
    if (type) {
      query.type = type;
    }
    
    if (isRead !== undefined) {
      query.isRead = isRead === 'true'; // Convert string to boolean
    }
    
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    console.log(`[NotificationRoutes] Found ${notifications.length} notifications for user ${req.user.userId}`);
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
      { _id: req.params.id, userId: req.user.userId }, 
      { isRead: true },
      { new: true } 
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
      { _id: req.params.id, userId: req.user.userId },
      { isRead: false },
      { new: true } 
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
  
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }
  
  try {
    // Find user by their MongoDB _id (this is correct since we have the user object from auth middleware)
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if token has changed to avoid unnecessary updates
    if (user.fcmToken !== token) {
      user.fcmToken = token;
      await user.save();
      console.log(`[NotificationRoutes] ✅ FCM token updated for user ${user.userId}: ${token.slice(0, 20)}...`);
    } else {
      console.log(`[NotificationRoutes] ℹ️ FCM token unchanged for user ${user.userId}`);
    }
    
    res.status(200).json({ message: 'Token saved successfully' });
  } catch (err) {
    console.error('Error saving FCM token:', err);
    res.status(500).json({ message: 'Error saving token' });
  }
});

export default router;