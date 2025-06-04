import Invitation from '../models/Invitation.js';
import Organization from '../models/Organization.js';
import User from '../models/User.js'; // Assuming User model is for user details

// Create an invitation
// POST /api/invitations/send
export const createInvitation = async (req, res) => {
  try {
    const { organizationId, inviteeEmail } = req.body;
    const inviterId = req.user.id; // From authMiddleware (this is the MongoDB _id)

    if (!organizationId || !inviteeEmail) {
      return res.status(400).json({ message: 'Organization ID and invitee email are required.' });
    }

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }

    // req.user is the full User document from authMiddleware.
    // req.user.userId is the string UUID.
    // Organization.members stores userId as string UUID.
    const isInviterMember = organization.members.some(member => member.userId === req.user.userId);
    if (!isInviterMember) {
      return res.status(403).json({ message: 'You do not have permission to invite users to this organization.' });
    }

    // Check if invitee is already a member
    const inviteeUserDoc = await User.findOne({ email: inviteeEmail.toLowerCase() });
    if (inviteeUserDoc) {
      const isInviteeAlreadyMember = organization.members.some(member => member.userId === inviteeUserDoc.userId);
      if (isInviteeAlreadyMember) {
        return res.status(409).json({ message: 'User is already a member of this organization.' });
      }
    }

    // Check for existing pending invitation (using organizationId which is ObjectId)
    const existingPendingInvitation = await Invitation.findOne({
      organization: organizationId, // This is mongoose.Schema.Types.ObjectId
      inviteeEmail: inviteeEmail.toLowerCase(),
      status: 'pending',
    });
    if (existingPendingInvitation) {
      return res.status(409).json({ message: 'An invitation for this email to this organization is already pending.' });
    }

    const invitation = new Invitation({
      organization: organizationId, // ObjectId
      inviter: inviterId, // ObjectId (req.user.id)
      inviteeEmail: inviteeEmail.toLowerCase(),
    });
    await invitation.save();

    // Populate organization and inviter details for the response
    const populatedInvitation = await Invitation.findById(invitation.id)
        .populate('organization', 'name')
        .populate('inviter', 'name email userId'); // Added userId to inviter population

    res.status(201).json(populatedInvitation);
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ message: 'Failed to create invitation.', error: error.message });
  }
};

// GET /api/invitations/pending (for the logged-in user)
export const getPendingInvitations = async (req, res) => {
  try {
    const loggedInUserEmail = req.user.email; // from authMiddleware
    const invitations = await Invitation.find({
      inviteeEmail: loggedInUserEmail.toLowerCase(),
      status: 'pending',
    }).populate('organization', 'name id')
      .populate('inviter', 'name email userId'); // Added userId to inviter population
    res.status(200).json(invitations);
  } catch (error) {
    console.error('Error fetching pending invitations:', error);
    res.status(500).json({ message: 'Failed to fetch pending invitations.', error: error.message });
  }
};

// POST /api/invitations/:invitationId/accept
export const acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const inviteeUser = req.user; // User document from authMiddleware (req.user.id is ObjectId, req.user.userId is String UUID)

    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found.' });
    }
    if (invitation.inviteeEmail.toLowerCase() !== inviteeUser.email.toLowerCase()) {
      return res.status(403).json({ message: 'This invitation is not for you.' });
    }
    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: `This invitation is already ${invitation.status}.` });
    }
    if (invitation.expiresAt < new Date()) {
        // Attempt to update status to 'expired' if not already handled by TTL
        const updatedInvite = await Invitation.findByIdAndUpdate(invitationId, { status: 'expired' }, { new: true });
        // If TTL deleted it, findByIdAndUpdate might not find it, or it might.
        // If found and updated, status is now 'expired'. If not found (due to TTL), it's effectively expired.
        return res.status(400).json({ message: 'This invitation has expired.' });
    }

    const organization = await Organization.findById(invitation.organization);
    if (!organization) {
      // This case might happen if the organization is deleted after invitation was sent
      invitation.status = 'expired'; // Or some other status like 'invalid'
      await invitation.save();
      return res.status(404).json({ message: 'Organization associated with this invitation not found.' });
    }

    // Check if user already a member (e.g. added manually after invite sent)
    const isAlreadyMember = organization.members.some(member => member.userId === inviteeUser.userId);
    if (isAlreadyMember) {
        invitation.status = 'accepted';
        invitation.inviteeUser = inviteeUser.id; // Store ObjectId of user who accepted
        await invitation.save();
        // Populate organization details for the response
        const populatedOrganization = await Organization.findById(organization.id); // Re-fetch or use existing if details suffice
        return res.status(200).json({ message: 'Already a member. Invitation marked as accepted.', organization: populatedOrganization });
    }

    organization.members.push({ userId: inviteeUser.userId, role: 'member' }); // Add string UUID to members array
    await organization.save();

    invitation.status = 'accepted';
    invitation.inviteeUser = inviteeUser.id; // Store ObjectId of user who accepted
    await invitation.save();
    
    // Populate organization details for the response
    const populatedOrganization = await Organization.findById(organization.id); // Re-fetch or use existing if details suffice
    res.status(200).json({ message: 'Invitation accepted successfully.', organization: populatedOrganization });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(500).json({ message: 'Failed to accept invitation.', error: error.message });
  }
};

// POST /api/invitations/:invitationId/reject
export const rejectInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const inviteeUser = req.user; // User document from authMiddleware

    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found.' });
    }
    if (invitation.inviteeEmail.toLowerCase() !== inviteeUser.email.toLowerCase()) {
      return res.status(403).json({ message: 'This invitation is not for you.' });
    }
    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: `This invitation is already ${invitation.status}.` });
    }
     if (invitation.expiresAt < new Date()) {
        // Attempt to update status to 'expired'
        await Invitation.findByIdAndUpdate(invitationId, { status: 'expired' }, { new: true });
        return res.status(400).json({ message: 'This invitation has expired.' });
    }

    invitation.status = 'rejected';
    invitation.inviteeUser = inviteeUser.id; // Store ObjectId of user who rejected
    await invitation.save();

    res.status(200).json({ message: 'Invitation rejected.' });
  } catch (error) {
    console.error('Error rejecting invitation:', error);
    res.status(500).json({ message: 'Failed to reject invitation.', error: error.message });
  }
};
