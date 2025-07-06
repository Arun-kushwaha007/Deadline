import mongoose from 'mongoose';

// Subtask Schema
const SubtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Subtask title is required'],
    trim: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

// Task Schema
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    // ✅ Due date now supports full date & time — no changes needed here
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: ['todo', 'inprogress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: [true, 'Priority is required'],
    },
    labels: {
      type: [String],
      default: [],
    },
    subtasks: {
      type: [SubtaskSchema],
      default: [],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    // Stores timestamps of when deadline notifications were sent for different urgency windows
    // Keys could be like "7day", "3day", "1day_hr1", "1day_hr2", etc.
    // Values would be the timestamp of the notification.
    deadlineNotifiedAt: {
      type: Map,
      of: Date,
      default: () => new Map(),
    }
  },
  {
    // ✅ This automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Avoid model overwrite error in dev
export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
