import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { admin, firebaseAdminInitialized } from '../config/firebaseAdmin.js';

// Title helper for various notification types
const getNotificationTitle = (type) => {
  switch (type) {
    case 'taskAssigned': return 'New Task Assigned';
    case 'invite': return 'New Invitation';
    case 'deadline': return 'Approaching Deadline';
    case 'newComment': return 'New Comment';
    case 'info': return 'Information';
    case 'warning': return 'Warning';
    case 'message': return 'New Message';
    case 'reminder': return 'Reminder';
    default: return 'New Notification';
  }
};

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
    // 1. Save notification in MongoDB
    const notification = new Notification({
      userId,
      type,
      message,
      relatedEntity: entityId,
      entityModel,
      isRead: false,
    });

    const savedNotification = await notification.save();
    console.log(`✅ Notification created: ${savedNotification._id} for user ${userId}`);

    // 2. Emit via Socket.IO if socket ID is available in Redis
    if (redisClient?.get) {
      const socketId = await redisClient.get(`socket:${userId}`);
      if (socketId) {
        io.to(socketId).emit('newNotification', savedNotification);
        console.log(`📡 Notification emitted to socket ${socketId}`);
      } else {
        console.log(`ℹ️ No socket ID for user ${userId}, skipping real-time emit.`);
      }
    } else {
      console.warn('⚠️ Redis client not available or misconfigured.');
    }

    // 3. Send push notification via FCM if initialized
    if (firebaseAdminInitialized) {
      const user = await User.findById(userId).select('fcmToken');
      if (user?.fcmToken) {
        const fcmMessage = {
          notification: {
            title: getNotificationTitle(savedNotification.type),
            body: savedNotification.message,
          },
          token: user.fcmToken,
          data: {
            notificationId: savedNotification._id.toString(),
            type: savedNotification.type,
            relatedEntity: savedNotification.relatedEntity?.toString() || '',
            entityModel: savedNotification.entityModel || '',
            createdAt: savedNotification.createdAt.toISOString(),
          },
        };

        try {
          const fcmResponse = await admin.messaging().send(fcmMessage);
          console.log(`📲 FCM message sent to user ${userId}:`, fcmResponse);
        } catch (fcmError) {
          console.error(`🔥 Error sending FCM to ${userId}:`, fcmError);
          if (fcmError.code === 'messaging/registration-token-not-registered') {
            console.warn(`⚠️ Invalid FCM token for ${userId}. Consider removing it.`);
            // Optionally clean up:
            // await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
          }
        }
      } else {
        console.log(`ℹ️ User ${userId} has no FCM token.`);
      }
    } else {
      console.warn('⚠️ Firebase Admin SDK not initialized. Skipping FCM.');
    }

    return savedNotification;
  } catch (error) {
    console.error('❌ Error in sendNotification:', error);
    return null;
  }
};
