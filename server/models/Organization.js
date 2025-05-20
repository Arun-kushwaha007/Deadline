import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [
    {
      userId: { type: String, ref: 'User' },  // changed from ObjectId to String
      role: { type: String, default: 'member' },
    },
  ],
  tasks: [
    {
      title: { type: String, required: true },
      assignedTo: { type: String, ref: 'User' },  // changed from ObjectId to String
      status: { type: String, default: 'To Do' },
    },
  ],
}, { timestamps: true });

export default mongoose.model('Organization', OrganizationSchema);
