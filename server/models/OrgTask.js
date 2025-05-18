// models/OrgTask.js
import mongoose from 'mongoose';

const orgTaskSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  dueDate: Date,
}, { timestamps: true });

export default mongoose.model('OrgTask', orgTaskSchema);
