import User from '../models/User.js'; // Add .js for ES modules

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