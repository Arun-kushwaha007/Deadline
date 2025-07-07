import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // <-- UUID string
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'info',
        'warning',
        'deadline',
        'message',
        'invite',
        'reminder',
        'taskAssigned',
        'newComment',
        'idleTask',
      ],
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'entityModel',
    },
    entityModel: {
      type: String,
      enum: ['Task', 'Organization', 'User', 'Comment', 'Invitation'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
