import express from 'express';
import Notification from '../models/Notification.js';
import Task from '../models/Task.js'; 
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Tasks for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate('assignedTo');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// GET: Tasks for a team
router.get('/team/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ teamId: req.user.teamId }).populate('assignedTo');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team tasks' });
  }
});

// POST: Create a task and notify user in real-time
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, assignedTo, deadline, priority } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      assignedTo,
      deadline,
      priority,
    });

    // Save notification
    const message = `You have been assigned a new task: ${title}`;
    const notification = await Notification.create({
      userId: assignedTo,
      message,
      taskId: task._id,
    });

    // Real-time notification
    const redisClient = req.app.get('redis');
    const targetSocketId = await redisClient.get(assignedTo);

    if (targetSocketId) {
      const io = req.app.get('io');
      io.to(targetSocketId).emit('taskAssigned', {
        message,
        task,
      });
    }

    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task or notification:', err);
    res.status(500).json({ message: 'Task creation failed' });
  }
});

export default router;
