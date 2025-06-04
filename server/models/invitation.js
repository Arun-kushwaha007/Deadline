import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  inviter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your User model is named 'User'
    required: true,
  },
  inviteeEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  inviteeUser: { // To be populated if the invitee is an existing user or after they accept
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
    index: { expires: '1s' }, // Optional: MongoDB TTL index to auto-delete expired if not handled by app logic
                               // Note: TTL index deletes the whole document. If you want to keep it and just mark as expired,
                               // you might need a cron job or similar to update status.
                               // For now, just setting expiresAt. Status update to 'expired' can be manual or via cron.
  },
});

// Optional: Add an index for common queries
invitationSchema.index({ inviteeEmail: 1, status: 1 });
invitationSchema.index({ organization: 1, inviteeEmail: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } }); // Prevent duplicate pending invites to same org for same email

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
