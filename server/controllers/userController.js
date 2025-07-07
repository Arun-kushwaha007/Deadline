import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Task from '../models/Task.js'; // Assuming Task.js is the correct model for user tasks

// @desc    Get all users (name and _id only)
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    // Select only 'name' and '_id' fields. '_id' is included by default.
    const users = await User.find({}, 'name'); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    // req.user is populated by authMiddleware and contains the user document (including _id and userId)
    const userFromAuth = req.user;
    if (!userFromAuth) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Fetch the latest user document to ensure data is fresh
    const user = await User.findById(userFromAuth._id).select('-password').lean(); // Use .lean() for a plain object

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate organizationsJoined
    // Assuming Organization.members.userId stores the String UUID (user.userId)
    const organizationsJoined = await Organization.countDocuments({ 'members.userId': user.userId });

    // Calculate tasksCompleted
    // Assuming Task.assignedTo stores the User's ObjectId (user._id) and status 'done' marks completion
    const tasksCompleted = await Task.countDocuments({ assignedTo: user._id, status: 'done' });
    
    // Ensure userProgress object exists
    user.userProgress = user.userProgress || {};

    // Update the counts in the userProgress object
    user.userProgress.organizationsJoined = organizationsJoined;
    user.userProgress.tasksCompleted = tasksCompleted;
    // Note: Other progress fields like loginStreak, activeDays etc., would be updated by other specific mechanisms (e.g., during login)

    console.log(`[getUserProfile] User: ${user.userId}, Orgs: ${organizationsJoined}, Tasks Done: ${tasksCompleted}`);

    res.status(200).json(user);

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching user profile', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  console.log('[updateUserProfile] Received request body:', JSON.stringify(req.body, null, 2));
  console.log('[updateUserProfile] User from token:', req.user ? req.user._id : 'No user in req');

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'User not authenticated for profile update.' });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      console.log('[updateUserProfile] User not found in DB with ID:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('[updateUserProfile] User found in DB (before update):', JSON.stringify(user, null, 2));

    // Update fields if they are provided in the request body
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.section !== undefined) user.section = req.body.section;
    if (req.body.profilePic !== undefined) user.profilePic = req.body.profilePic;
    
    // For userSkills, replace the whole array if provided
    if (req.body.userSkills !== undefined) {
      user.userSkills = req.body.userSkills;
    }
    
    // userProgress is generally not updated directly via this profile update route
    // It's usually modified by other specific application events.
    // If you need to update it here, ensure req.body.userProgress is structured correctly.
    // Example: if (req.body.userProgress) user.userProgress = { ...user.userProgress, ...req.body.userProgress };

    console.log('[updateUserProfile] User object before save:', JSON.stringify(user, null, 2));

    let updatedUser;
    try {
      updatedUser = await user.save();
      console.log('[updateUserProfile] User saved successfully:', JSON.stringify(updatedUser, null, 2));
    } catch (saveError) {
      console.error('[updateUserProfile] Error saving user:', saveError.message, saveError.stack);
      // Log validation errors if any
      if (saveError.errors) {
        console.error('[updateUserProfile] Validation errors:', JSON.stringify(saveError.errors, null, 2));
      }
      return res.status(500).json({ message: 'Error saving profile data', error: saveError.message });
    }
      
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        userId: updatedUser.userId,
        bio: updatedUser.bio,
        section: updatedUser.section,
        profilePic: updatedUser.profilePic,
        userSkills: updatedUser.userSkills,
        userProgress: updatedUser.userProgress, // Send back the progress as well
        fcmToken: updatedUser.fcmToken,
      });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error while updating user profile' });
  }
};