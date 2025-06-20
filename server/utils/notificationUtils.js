import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { admin, firebaseAdminInitialized } from '../config/firebaseAdmin.js';

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
  userId, // UUID string
  type,
  message,
  entityId,
  entityModel,
}) => {
  try {
    // 1. Save notification in MongoDB
    const notification = new Notification({
      userId, // string UUID
      type,
      message,
      relatedEntity: entityId,
      entityModel,
      isRead: false,
    });

    const savedNotification = await notification.save();
    console.log(`✅ Notification created: ${savedNotification._id} for user ${userId}`);

    // 2. Emit via Socket.IO
    if (redisClient?.get) {
      const socketId = await redisClient.get(`socket:${userId}`);
      if (socketId) {
        io.to(socketId).emit('newNotification', savedNotification);
        console.log(`📡 Notification emitted to socket ${socketId}`);
      } else {
        console.log(`ℹ️ No socket ID for user ${userId}, skipping real-time emit.`);
      }
    }

    // 3. Push via FCM
    if (firebaseAdminInitialized) {
      const user = await User.findOne({ userId }).select('fcmToken');
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
            console.warn(`⚠️ Invalid FCM token for ${userId}.`);
          }
        }
      } else {
        console.log(`ℹ️ User ${userId} has no FCM token.`);
      }
    }

    return savedNotification;
  } catch (error) {
    console.error('❌ Error in sendNotification:', error);
    return null;
  }
};
