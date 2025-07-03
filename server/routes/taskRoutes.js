import express from 'express';
import Task from '../models/Task.js';
import Organization from '../models/Organization.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { createTask, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

/**
 * GET /api/tasks
 * Fetch all tasks assigned to the logged-in user, or filter by organizationId if provided.
 * Pass organizationId as a query param: /api/tasks?organizationId=ORG_ID
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // MongoDB _id of the user
    const organizationId = req.query.organizationId;

    let orgFilter = {};
    if (organizationId) {
      // Check if user is a member of this organization
      const org = await Organization.findOne({ _id: organizationId, 'members.userId': req.user.userId });
      if (!org) {
        return res.status(403).json({ message: 'Not a member of this organization' });
      }
      orgFilter.organization = organizationId;
    } else {
      // Get all orgs the user is a member of
      const userOrganizations = await Organization.find({ 'members.userId': req.user.userId }).select('_id');
      const organizationIds = userOrganizations.map(org => org._id);
      if (organizationIds.length === 0) {
        return res.status(200).json([]);
      }
      orgFilter.organization = { $in: organizationIds };
    }

    // Define queryConditions based on the presence of organizationId
    let queryConditions = { ...orgFilter };

    if (organizationId) {
      // If organizationId is specified, fetch all tasks for that org.
      // User membership check is already done.
      // No filter by assignedTo: userId here.
    } else {
      // If no specific organization, fetch tasks assigned to the user across their orgs
      queryConditions.assignedTo = userId;
    }

    const tasks = await Task.find(queryConditions)
      .populate('assignedTo', 'name email userId') // Populate specific fields
      .populate('organization', 'name'); // Populate specific fields

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks for user:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// GET: Tasks for a team (optional, if you want to keep this route)
router.get('/team/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ teamId: req.user.teamId }).populate('assignedTo');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team tasks' });
  }
});

// POST: Create a task
router.post('/', authMiddleware, createTask);

// GET: Get a single task by ID
router.get('/:id', authMiddleware, getTaskById);

// PUT: Update a task by ID
router.put('/:id', authMiddleware, updateTask);

// DELETE: Delete a task by ID
router.delete('/:id', authMiddleware, deleteTask);

export default router;