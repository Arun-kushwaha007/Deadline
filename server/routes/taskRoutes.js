import express from 'express';
import Notification from '../models/Notification.js';
import Task from '../models/Task.js'; 
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Tasks for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate('assignedTo', 'name'); // Populate with name
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// GET: Tasks for a team
router.get('/team/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ teamId: req.user.teamId }).populate('assignedTo', 'name'); // Populate with name
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team tasks' });
  }
});

// POST: Create a task and notify user in real-time
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, assignedTo, deadline, priority, tags } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || [], // Handle no assignees
      deadline,
      priority,
      tags: tags || [], // Handle no tags
    });

    // Send notifications to all assigned users
    if (assignedTo && assignedTo.length > 0) {
      const message = `You have been assigned a new task: ${title}`;
      for (const userId of assignedTo) {
        const notification = await Notification.create({
          userId,
          message,
          taskId: task._id,
        });

        // Real-time notification (if applicable)
        const redisClient = req.app.get('redis');
        const targetSocketId = await redisClient.get(userId);

        if (targetSocketId) {
          const io = req.app.get('io');
          io.to(targetSocketId).emit('taskAssigned', {
            message,
            task,
          });
        }
      }
    }

    res.status(201).json(await task.populate('assignedTo', 'name')); // Populate before sending
  } catch (err) {
    console.error('Error creating task or notification:', err);
    res.status(500).json({ message: 'Task creation failed' });
  }
});

// PUT: Update a task
router.put('/:taskId', authMiddleware, async (req, res) => {
  const { title, description, assignedTo, deadline, priority, status, tags } = req.body;
  const { taskId } = req.params;

  try {
    let task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.deadline = deadline || task.deadline;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.tags = tags || task.tags;

    await task.save();

    // Send notifications to all assigned users
    if (assignedTo && assignedTo.length > 0) {
      const message = `The task "${title}" has been updated.`;
      for (const userId of assignedTo) {
        // Save notification
        await Notification.create({ userId, message, taskId: task._id });

        // Real-time notification (if applicable)
        const redisClient = req.app.get('redis');
        const targetSocketId = await redisClient.get(userId);
        if (targetSocketId) {
          req.app.get('io').to(targetSocketId).emit('taskUpdated', { message, task });
        }
      }
    }
    res.status(200).json(await task.populate('assignedTo', 'name')); // Populate before sending
  } catch (err) {
    console.error('Error updating task or notification:', err);
    res.status(500).json({ message: 'Task update failed' });
  }
});

export default router;

export default router;
