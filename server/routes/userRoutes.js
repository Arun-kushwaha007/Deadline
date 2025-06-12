import express from 'express';
import { getAllUsers } from '../controllers/userController.js'; // Add .js for ES modules
import authMiddleware from '../middleware/authMiddleware.js'; // Add .js for ES modules

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (name and _id)
// @access  Private
router.get('/', authMiddleware, getAllUsers);

export default router;