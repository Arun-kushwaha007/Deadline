// routes/authRoutes.js
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import {Resend} from 'resend';


const router = express.Router();
// const resend = new Resend(process.env.RESEND_API_KEY);
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




router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const resend = req.app.get('resend'); // ✅ Pull resend instance globally

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpire = Date.now() + 1000 * 60 * 30;

    user.resetToken = resetToken;
    user.resetTokenExpire = tokenExpire;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const emailResponse = await resend.emails.send({
      from: 'YourApp <onboarding@resend.dev>',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 30 minutes.</p>`,
    });

    console.log('Resend response:', emailResponse);
    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ message: 'Server error while sending email.' });
  }
});



router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = password; // Will be hashed due to pre-save
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
