import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

// GET: All tasks (for admin or for filtering, or for user if getAllTasks handles filtering)
router.get('/', authMiddleware, getAllTasks);

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