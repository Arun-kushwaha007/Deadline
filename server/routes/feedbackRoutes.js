import express from 'express';
import mongoose from 'mongoose';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// ------------------------------
// Middleware
// ------------------------------

const authenticateUser = (req, res, next) => {
  const userId = req.headers['user-id'] || req.body.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  req.userId = userId;
  next();
};

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

router.post(
  '/',
  authenticateUser,
  validateFeedbackInput,
  async (req, res) => {
    try {
      const {
        userName,
        userEmail,
        userAvatar,
        rating,
        title,
        message,
        category = 'general',
        isPublic = false,
        tags = []
      } = req.body;

      const newFeedback = new Feedback({
        userId: req.userId,
        userName: userName || 'Anonymous User',
        userEmail: userEmail || '',
        userAvatar: userAvatar || null,
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

router.get(
  '/user/:userId',
  authenticateUser,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      if (req.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only view your own feedback'
        });
      }

      const feedback = await Feedback.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalFeedback = await Feedback.countDocuments({ userId });
      const totalPages = Math.ceil(totalFeedback / limit);

      res.json({
        success: true,
        data: feedback,
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
        message: 'Server error while fetching feedback',
        error: error.message
      });
    }
  }
);

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
        isApproved: true,
        rating: { $gte: minRating }
      };

      if (category) {
        query.category = category;
      }

      const sortObj = {};
      sortObj[sort] = order;

      const feedback = await Feedback.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select('-userEmail');

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
        data: feedback,
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

router.get(
  '/:feedbackId',
  authenticateUser,
  async (req, res) => {
    try {
      const { feedbackId } = req.params;

      const feedback = await Feedback.findById(feedbackId);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      if (feedback.userId !== req.userId && !feedback.isPublic) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      res.json({
        success: true,
        data: feedback
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching feedback',
        error: error.message
      });
    }
  }
);

router.put(
  '/:feedbackId',
  authenticateUser,
  validateFeedbackInput,
  async (req, res) => {
    try {
      const { feedbackId } = req.params;
      const {
        rating,
        title,
        message,
        category,
        isPublic,
        tags
      } = req.body;

      const feedback = await Feedback.findById(feedbackId);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      if (feedback.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only update your own feedback'
        });
      }

      const updatedFeedback = await Feedback.findByIdAndUpdate(
        feedbackId,
        {
          rating: parseInt(rating),
          title: title.trim(),
          message: message.trim(),
          category,
          isPublic: Boolean(isPublic),
          tags: Array.isArray(tags) ? tags.filter(tag => tag.trim().length > 0) : [],
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Feedback updated successfully',
        data: updatedFeedback
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

router.delete(
  '/:feedbackId',
  authenticateUser,
  async (req, res) => {
    try {
      const { feedbackId } = req.params;

      const feedback = await Feedback.findById(feedbackId);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      if (feedback.userId !== req.userId) {
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

router.post(
  '/:feedbackId/helpful',
  async (req, res) => {
    try {
      const { feedbackId } = req.params;

      const feedback = await Feedback.findById(feedbackId);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      if (!feedback.isPublic) {
        return res.status(403).json({
          success: false,
          message: 'Cannot mark private feedback as helpful'
        });
      }

      feedback.helpfulCount += 1;
      await feedback.save();

      res.json({
        success: true,
        message: 'Feedback marked as helpful',
        data: {
          feedbackId,
          helpfulCount: feedback.helpfulCount
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

router.get(
  '/stats/summary',
  authenticateUser,
  async (req, res) => {
    try {
      const stats = await Feedback.aggregate([
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

      const categoryStats = await Feedback.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            averageRating: { $avg: '$rating' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const ratingStats = await Feedback.aggregate([
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

      const recentTrends = await Feedback.aggregate([
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
          overall: stats[0] || {
            totalFeedback: 0,
            averageRating: 0,
            totalPublic: 0,
            totalApproved: 0
          },
          byCategory: categoryStats,
          byRating: ratingStats,
          recentTrends
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
