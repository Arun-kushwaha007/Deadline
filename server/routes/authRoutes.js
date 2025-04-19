import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Team from '../models/Team.js';

import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details for multiple users by IDs
router.get('/users/bulk', authMiddleware, async (req, res) => {
  try {
    const ids = req.query.ids;
    if (!ids) {
      return res.status(400).json({ message: 'User IDs are required' });
    }

    const userIds = ids.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
    if (userIds.length === 0) {
      return res.status(200).json([]); // Return empty array if no valid IDs
    }

    const users = await User.find({ _id: { $in: userIds } }).select('name'); // Only fetch name and _id
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});


// Get team information for a user
router.get('/users/:userId/team', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.teamId) {
      return res.status(200).json(null); // User has no team
    }

    const team = await Team.findById(user.teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch team information' });
  }
});

// Get members of a team
router.get('/teams/:teamId/members', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId).populate('members');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json(team.members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch team members' });
  }
});


// Create a team
router.post('/teams', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Team name is required' });
  }

  try {
    const team = new Team({
      name,
      leader: req.user._id,
      members: [req.user._id], // Add the leader as the first member
    });

    await team.save();

    // Update the user's teamId
    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });

    res.status(201).json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create team' });
  }
});

// Add a member to a team
router.post('/teams/:teamId/members', authMiddleware, async (req, res) => {
  const { memberId } = req.body;
  const { teamId } = req.params;

  if (!memberId) {
    return res.status(400).json({ message: 'Member ID is required' });
  }

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the team leader can add members' });
    }

    const userToAdd = await User.findById(memberId);
    if (!userToAdd) {
      return res.status(404).json({ message: 'User to add not found' });
    }

    team.members.push(memberId);
    await team.save();
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add member to team' });
  }
});
export default router;  // Use ES6 export
