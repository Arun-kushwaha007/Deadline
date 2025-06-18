import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'deadline', 'message', 'invite', 'reminder', 'taskAssigned', 'newComment'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'entityModel',
    },
    entityModel: {
      type: String,
      enum: ['Task', 'Organization', 'User', 'Comment', 'Invitation'], // Added Invitation
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // taskId is deprecated, replaced by relatedEntity and entityModel
    // taskId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Task',
    // },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
