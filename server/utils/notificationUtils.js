import Notification from '../models/Notification.js';
import User from '../models/User.js'; // Import User model
import { admin, firebaseAdminInitialized } from '../config/firebaseAdmin.js'; // Import Firebase admin instance

// Helper to generate a title based on notification type
const getNotificationTitle = (type) => {
  switch (type) {
    case 'taskAssigned':
      return 'New Task Assigned';
    case 'invite':
      return 'New Invitation';
    case 'deadline':
      return 'Approaching Deadline';
    case 'newComment':
      return 'New Comment';
    case 'info':
      return 'Information';
    case 'warning':
      return 'Warning';
    case 'message':
      return 'New Message';
    case 'reminder':
      return 'Reminder';
    default:
      return 'New Notification';
  }
};

/**
 * Creates and sends a notification via MongoDB, Socket.IO, and FCM.
 *
 * @param {object} params - The parameters for sending the notification.
 * @param {object} params.io - The Socket.IO instance.
 * @param {object} params.redisClient - The Redis client instance.
 * @param {string} params.userId - The ID of the user to notify.
 * @param {string} params.type - The type of notification (e.g., 'taskAssigned', 'newComment').
 * @param {string} params.message - The notification message.
 * @param {string} [params.entityId] - The ID of the related entity (e.g., task ID, comment ID).
 * @param {string} [params.entityModel] - The model of the related entity (e.g., 'Task', 'Comment').
 * @returns {Promise<object|null>} The saved notification object or null if an error occurred.
 */
export const sendNotification = async ({
  io,
  redisClient,
  userId,
  type,
  message,
  entityId,
  entityModel,
}) => {
  try {
    // 1. Create and save the notification to MongoDB
    const notification = new Notification({
      userId,
      type,
      message,
      relatedEntity: entityId,
      entityModel,
      isRead: false, // Default to unread
    });
    const savedNotification = await notification.save();

    console.log(`Notification created: ${savedNotification._id} for user ${userId}`);

    // 2. Retrieve the recipient's socket ID from Redis
    // Assuming socket IDs are stored in Redis with a key like "socket:<userId>"
    if (redisClient && typeof redisClient.get === 'function') {
      const socketIdKey = `socket:${userId}`;
      const socketId = await redisClient.get(socketIdKey);

      if (socketId) {
        // 3. Emit a 'newNotification' event to the specific user's socket
        io.to(socketId).emit('newNotification', savedNotification);
        console.log(`Notification event emitted to socket ${socketId} for user ${userId}`);
      } else {
        console.log(`Socket ID not found for user ${userId}. Notification saved but not sent in real-time.`);
      }
    } else {
      console.warn('Redis client not available or "get" method is missing. Skipping real-time notification.');
    }

    // 4. Send FCM Push Notification
    if (firebaseAdminInitialized) {
      try {
        const user = await User.findById(userId).select('fcmToken'); // Fetch user for FCM token
        if (user && user.fcmToken) {
          const messagePayload = {
            notification: {
              title: getNotificationTitle(savedNotification.type),
              body: savedNotification.message,
            },
            token: user.fcmToken,
            // Optional: Add data payload for custom handling in client
            data: {
              notificationId: savedNotification._id.toString(),
              type: savedNotification.type,
              relatedEntity: savedNotification.relatedEntity?.toString() || '',
              entityModel: savedNotification.entityModel || '',
              createdAt: savedNotification.createdAt.toISOString(),
            },
            // Optional: click_action to open a specific URL
            // webpush: {
            //   fcm_options: {
            //     link: `https://your-app.com/notifications/${savedNotification._id}` 
            //   }
            // }
          };

          const response = await admin.messaging().send(messagePayload);
          console.log(`Successfully sent FCM message to user ${userId}:`, response);

        } else if (user) {
          console.log(`User ${userId} found, but no FCM token available. Skipping FCM.`);
        } else {
          console.log(`User ${userId} not found. Skipping FCM.`);
        }
      } catch (fcmError) {
        console.error(`Error sending FCM message to user ${userId}:`, fcmError);
        if (fcmError.code === 'messaging/registration-token-not-registered') {
          console.log(`FCM token for user ${userId} is not registered. Consider removing it.`);
          // Optional: Remove invalid token
          // await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
        }
      }
    } else {
      console.warn('Firebase Admin SDK not initialized. Skipping FCM notification.');
    }

    return savedNotification;
  } catch (error) {
    console.error('Error in sendNotification:', error);
    return null;
  }
};
