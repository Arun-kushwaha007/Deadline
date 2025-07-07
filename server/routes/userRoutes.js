import express from 'express';
import { getAllUsers, getUserProfile, updateUserProfile } from '../controllers/userController.js'; // Add .js for ES modules
import authMiddleware from '../middleware/authMiddleware.js'; // Add .js for ES modules

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (name and _id)
// @access  Private
router.get('/', authMiddleware, getAllUsers);

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', authMiddleware, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
router.put('/profile', authMiddleware, updateUserProfile);

export default router;