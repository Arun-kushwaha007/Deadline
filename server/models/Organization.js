const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, default: 'member' },
    },
  ],
  tasks: [
    {
      title: String,
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, default: 'To Do' },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Organization', OrganizationSchema);
