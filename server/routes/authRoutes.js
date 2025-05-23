// routes/authRoutes.js
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// ✅ Register Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid password' });

    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get Profile by userId (not Mongo _id)
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId }).select('-password');
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
