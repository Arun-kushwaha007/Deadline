import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Task from '../models/Task.js';


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


export const getUserProfile = async (req, res) => {
  try {
  
    const userFromAuth = req.user;
    if (!userFromAuth) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

  
    const user = await User.findById(userFromAuth._id).select('-password').lean(); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const organizationsJoined = await Organization.countDocuments({ 'members.userId': user.userId });

    const tasksCompleted = await Task.countDocuments({ assignedTo: user._id, status: 'done' });
    
 
    user.userProgress = user.userProgress || {};

    // Update the counts in the userProgress object
    user.userProgress.organizationsJoined = organizationsJoined;
    user.userProgress.tasksCompleted = tasksCompleted;
  
    // console.log(`[getUserProfile] User: ${user.userId}, Orgs: ${organizationsJoined}, Tasks Done: ${tasksCompleted}`);

    res.status(200).json(user);

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching user profile', error: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
  // console.log('[updateUserProfile] Received request body:', JSON.stringify(req.body, null, 2));
  // console.log('[updateUserProfile] User from token:', req.user ? req.user._id : 'No user in req');

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
    
  
    if (req.body.userSkills !== undefined) {
      user.userSkills = req.body.userSkills;
    }
    

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
        userProgress: updatedUser.userProgress,
        fcmToken: updatedUser.fcmToken,
      });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error while updating user profile' });
  }
};