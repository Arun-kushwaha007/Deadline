import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [
    {
      userId: { type: String, ref: 'User' },  
      role: { 
        type: String, 
        enum: ['admin', 'coordinator', 'member'], 
        default: 'member' 
      },
      
    },
  ],
  tasks: [
    {
      title: { type: String, required: true },
      assignedTo: { type: String, ref: 'User' },  
      status: { type: String, default: 'To Do' },
    }, 
  ],
}, { timestamps: true });

export default mongoose.model('Organization', OrganizationSchema);
 