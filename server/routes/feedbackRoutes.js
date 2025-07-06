import express from 'express';
import mongoose from 'mongoose';
import Feedback from '../models/Feedback.js';

const router = express.Router();

import authMiddleware from '../middleware/authMiddleware.js';

// ------------------------------
// Middleware
// ------------------------------

// const authenticateUser = (req, res, next) => { // Custom auth removed
//   const userId = req.headers['user-id'] || req.body.userId;
//   if (!userId) {
//     return res.status(401).json({
//       success: false,
//       message: 'Authentication required'
//     });
//   }
//   req.userId = userId;
//   next();
// };

const validateFeedbackInput = (req, res, next) => {
  const { rating, title, message, category } = req.body;
  const errors = [];

  if (!rating || rating < 1 || rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  if (!message || message.trim().length === 0) {
    errors.push('Message is required');
  } else if (message.length > 1000) {
    errors.push('Message must be less than 1000 characters');
  }

  const validCategories = ['general', 'feature', 'bug', 'improvement', 'testimonial'];
  if (category && !validCategories.includes(category)) {
    errors.push('Invalid category');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// ------------------------------
// Routes
// ------------------------------

// POST /api/feedback - Create new feedback
router.post(
  '/',
  authMiddleware, // Use standard JWT auth middleware
  validateFeedbackInput,
  async (req, res) => {
    try {
      const {
        rating,
        title,
        message,
        category = 'general',
        isPublic = false,
        tags = []
      } = req.body;

      // User info from authMiddleware
      const { _id: userIdFromAuth, name: userNameFromAuth, email: userEmailFromAuth, profilePic: userAvatarFromAuth } = req.user;

      const newFeedback = new Feedback({
        userId: userIdFromAuth,
        userName: userNameFromAuth || 'Anonymous User',
        userEmail: userEmailFromAuth || '',
        userAvatar: userAvatarFromAuth || null,
        rating: parseInt(rating),
        title: title.trim(),
        message: message.trim(),
        category,
        isPublic: Boolean(isPublic),
        tags: Array.isArray(tags) ? tags.filter(tag => tag.trim().length > 0) : [],
        helpfulCount: 0
      });

      const savedFeedback = await newFeedback.save();

      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        data: savedFeedback
      });
    } catch (error) {
      console.error('Error creating feedback:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating feedback',
        error: error.message
      });
    }
  }
);

// GET /api/feedback/myfeedback - Get feedback for the authenticated user
router.get(
  '/myfeedback', 
  authMiddleware, 
  async (req, res) => {
    try {
      const userIdFromAuth = req.user._id; 
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const userFeedback = await Feedback.find({ userId: userIdFromAuth })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalFeedback = await Feedback.countDocuments({ userId: userIdFromAuth });
      const totalPages = Math.ceil(totalFeedback / limit);

      res.json({
        success: true,
        data: userFeedback, // Changed variable name for clarity
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalFeedback,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching user feedback', // Clarified error message
        error: error.message
      });
    }
  }
);

// GET /api/feedback/public - Get public and approved feedback (no auth needed)
router.get(
  '/public',
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const category = req.query.category;
      const minRating = parseInt(req.query.minRating) || 1;
      const sort = req.query.sort || 'createdAt';
      const order = req.query.order === 'asc' ? 1 : -1;

      const query = {
        isPublic: true,
        isApproved: true, // Assuming only approved public feedback should be shown
        rating: { $gte: minRating }
      };

      if (category) {
        query.category = category;
      }

      const sortObj = {};
      sortObj[sort] = order;

      const publicFeedback = await Feedback.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select('-userEmail'); // Do not send user emails for public listings

      const totalFeedback = await Feedback.countDocuments(query);
      const totalPages = Math.ceil(totalFeedback / limit);

      const avgRatingResult = await Feedback.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalCount: { $sum: 1 }
          }
        }
      ]);

      const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].averageRating : 0;

      res.json({
        success: true,
        data: publicFeedback, // Changed variable name
        stats: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalPublicFeedback: totalFeedback
        },
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalFeedback,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error('Error fetching public feedback:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching public feedback',
        error: error.message
      });
    }
  }
);

// GET /api/feedback/:feedbackId - Get a specific feedback item
// Auth is checked: if user is authenticated and it's their feedback, they can see it even if not public.
// Otherwise, feedback must be public and approved.
router.get(
  '/:feedbackId',
  authMiddleware, 
  async (req, res) => {
    try {
      const { feedbackId } = req.params;
      const userIdFromAuth = req.user ? req.user._id.toString() : null;

      const foundFeedback = await Feedback.findById(feedbackId);

      if (!foundFeedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      const isOwner = userIdFromAuth && foundFeedback.userId.toString() === userIdFromAuth;

      if (!((foundFeedback.isPublic && foundFeedback.isApproved) || isOwner)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const dataToSend = foundFeedback.toObject();
      if (!isOwner && !dataToSend.isPublic) { // Double check, should be caught by above
         delete dataToSend.userEmail; // Should not happen if logic above is correct
      } else if (!isOwner && dataToSend.isPublic) {
         delete dataToSend.userEmail; // Don't send email of other users even if public
      }


      res.json({
        success: true,
        data: dataToSend
      });
    } catch (error) {
      console.error('Error fetching feedback by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching feedback by ID',
        error: error.message
      });
    }
  }
);

// PUT /api/feedback/:feedbackId - Update a feedback item
router.put(
  '/:feedbackId',
  authMiddleware, 
  validateFeedbackInput,
  async (req, res) => {
    try {
      const { feedbackId } = req.params;
      const userIdFromAuth = req.user._id.toString();
      const {
        rating,
        title,
        message,
        category,
        isPublic,
        tags
      } = req.body;

      const feedbackToUpdate = await Feedback.findById(feedbackId);

      if (!feedbackToUpdate) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      if (feedbackToUpdate.userId.toString() !== userIdFromAuth) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only update your own feedback'
        });
      }

      feedbackToUpdate.rating = parseInt(rating);
      feedbackToUpdate.title = title.trim();
      feedbackToUpdate.message = message.trim();
      if (category) feedbackToUpdate.category = category;
      if (isPublic !== undefined) feedbackToUpdate.isPublic = Boolean(isPublic);
      if (tags) feedbackToUpdate.tags = Array.isArray(tags) ? tags.filter(tag => tag.trim().length > 0) : [];
      
      const updatedFeedbackItem = await feedbackToUpdate.save();

      res.json({
        success: true,
        message: 'Feedback updated successfully',
        data: updatedFeedbackItem
      });
    } catch (error) {
      console.error('Error updating feedback:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating feedback',
        error: error.message
      });
    }
  }
);

// DELETE /api/feedback/:feedbackId - Delete a feedback item
router.delete(
  '/:feedbackId',
  authMiddleware, 
  async (req, res) => {
    try {
      const { feedbackId } = req.params;
      const userIdFromAuth = req.user._id.toString();

      const feedbackToDelete = await Feedback.findById(feedbackId);

      if (!feedbackToDelete) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      if (feedbackToDelete.userId.toString() !== userIdFromAuth) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only delete your own feedback'
        });
      }

      await Feedback.findByIdAndDelete(feedbackId);

      res.json({
        success: true,
        message: 'Feedback deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while deleting feedback',
        error: error.message
      });
    }
  }
);

// POST /api/feedback/:feedbackId/helpful - Mark feedback as helpful (no auth needed for this action)
router.post(
  '/:feedbackId/helpful',
  async (req, res) => {
    try {
      const { feedbackId } = req.params;

      const feedbackItem = await Feedback.findById(feedbackId);

      if (!feedbackItem) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      if (!feedbackItem.isPublic) { // Only public feedback can be marked helpful by anyone
        return res.status(403).json({
          success: false,
          message: 'Cannot mark private feedback as helpful'
        });
      }

      feedbackItem.helpfulCount = (feedbackItem.helpfulCount || 0) + 1;
      await feedbackItem.save();

      res.json({
        success: true,
        message: 'Feedback marked as helpful',
        data: {
          feedbackId,
          helpfulCount: feedbackItem.helpfulCount
        }
      });
    } catch (error) {
      console.error('Error marking feedback as helpful:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating helpful count',
        error: error.message
      });
    }
  }
);

// GET /api/feedback/stats/summary - Get feedback statistics (requires auth, implies admin/privileged access)
router.get(
  '/stats/summary',
  authMiddleware,
  async (req, res) => {
    try {
      // Optional: Add role-based access control here if needed
      // e.g., if (!req.user.roles.includes('admin')) return res.status(403).json({ message: 'Forbidden' });

      const overallStatsData = await Feedback.aggregate([ // Renamed to avoid conflict
        {
          $group: {
            _id: null,
            totalFeedback: { $sum: 1 },
            averageRating: { $avg: '$rating' },
            totalPublic: {
              $sum: { $cond: [{ $eq: ['$isPublic', true] }, 1, 0] }
            },
            totalApproved: {
              $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
            }
          }
        }
      ]);

      const categoryStatsData = await Feedback.aggregate([ // Renamed
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            averageRating: { $avg: '$rating' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const ratingStatsData = await Feedback.aggregate([ // Renamed
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentTrendsData = await Feedback.aggregate([ // Renamed
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 },
            averageRating: { $avg: '$rating' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      res.json({
        success: true,
        data: {
          overall: overallStatsData[0] || { // Use renamed variable
            totalFeedback: 0,
            averageRating: 0,
            totalPublic: 0,
            totalApproved: 0
          },
          byCategory: categoryStatsData, // Use renamed variable
          byRating: ratingStatsData, // Use renamed variable
          recentTrends: recentTrendsData // Use renamed variable
        }
      });
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching stats',
        error: error.message
      });
    }
  }
);

router.get(
  '/search',
  async (req, res) => {
    try {
      const { q: searchQuery, category, minRating = 1 } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      if (!searchQuery || searchQuery.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search query must be at least 2 characters long'
        });
      }

      const query = {
        isPublic: true,
        isApproved: true,
        rating: { $gte: parseInt(minRating) },
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { message: { $regex: searchQuery, $options: 'i' } },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } }
        ]
      };

      if (category) {
        query.category = category;
      }

      const feedback = await Feedback.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-userEmail');

      const totalResults = await Feedback.countDocuments(query);
      const totalPages = Math.ceil(totalResults / limit);

      res.json({
        success: true,
        data: feedback,
        searchQuery,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalResults,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      console.error('Error searching feedback:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while searching feedback',
        error: error.message
      });
    }
  }
);

export default router;
