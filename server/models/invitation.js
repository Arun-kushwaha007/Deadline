import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  inviter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  inviteeEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  inviteeUser: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired'],
    default: 'pending',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    // Example: default to 7 days from now
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
    index: { expires: '1s' }, 
  },
});


invitationSchema.index({ inviteeEmail: 1, status: 1 });
invitationSchema.index({ organization: 1, inviteeEmail: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } }); // Prevent duplicate pending invites to same org for same email

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
