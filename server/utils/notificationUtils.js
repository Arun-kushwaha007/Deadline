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
    case 'idleTask': return 'Idle Task Alert'; 
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
    console.log(`[NotificationUtils] 🚀 Starting notification process for user ${userId}`);
    
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
    console.log(`[NotificationUtils] ✅ Notification created: ${savedNotification._id} for user ${userId}`);

    // 2. Emit via Socket.IO
    if (redisClient?.get) {
      console.log(`[NotificationUtils] Attempting to get socketId for user ${userId} from Redis key: socket:${userId}`);
      try {
        const socketId = await redisClient.get(`socket:${userId}`);
        if (socketId) {
          console.log(`[NotificationUtils] ✅ Socket ID found: ${socketId} for user ${userId}. Emitting 'newNotification'.`);
          io.to(socketId).emit('newNotification', savedNotification);
          console.log(`[NotificationUtils] 📡 Notification emitted to socket ${socketId}`);
        } else {
          console.log(`[NotificationUtils] ℹ️ No socket ID for user ${userId}, skipping real-time emit.`);
        }
      } catch (redisError) {
        console.error(`[NotificationUtils] ❌ Redis error for user ${userId}:`, redisError);
      }
    } else {
      console.log(`[NotificationUtils] ⚠️ Redis client not available. Skipping socket emit.`);
    }

    // 3. Push via FCM
    if (firebaseAdminInitialized) {
      console.log(`[NotificationUtils] Attempting to find user ${userId} for FCM token.`);
      try {
        const user = await User.findOne({ userId }).select('fcmToken'); // Find by UUID userId
        if (user) {
          console.log(`[NotificationUtils] User ${userId} found. FCM Token: ${user.fcmToken ? `${user.fcmToken.slice(0, 20)}...` : 'null'}`);
          if (user.fcmToken) {
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
              console.log(`[NotificationUtils] 📲 FCM message sent to user ${userId}:`, fcmResponse);
            } catch (fcmError) {
              console.error(`[NotificationUtils] 🔥 FCM send error for user ${userId}:`, fcmError);
              
              // Handle invalid token errors
              if (fcmError.code === 'messaging/registration-token-not-registered' || 
                  fcmError.code === 'messaging/invalid-registration-token') {
                console.log(`[NotificationUtils] 🗑️ Clearing invalid FCM token for user ${userId}`);
                user.fcmToken = null;
                await user.save();
              }
            }
          } else {
            console.log(`[NotificationUtils] ℹ️ User ${userId} has no FCM token.`);
          }
        } else {
          console.log(`[NotificationUtils] ❌ User ${userId} not found in database.`);
        }
      } catch (userFindError) {
        console.error(`[NotificationUtils] ❌ Error finding user ${userId}:`, userFindError);
      }
    } else {
      console.log(`[NotificationUtils] ⚠️ Firebase Admin not initialized. Skipping FCM.`);
    }

    return savedNotification;
  } catch (error) {
    console.error('[NotificationUtils] ❌ Error in sendNotification:', error);
    return null;
  }
};