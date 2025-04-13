// routes/taskRoutes.js
import express from 'express';
import Notification from '../models/Notification.js';
import Task from '../models/Task.js';  // Make sure Task model is imported
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

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

    // Save notification to DB
    const message = `You have been assigned a new task: ${title}`;
    const notification = await Notification.create({
      userId: assignedTo,
      message,
      taskId: task._id,
    });

    // Emit real-time notification
    const io = req.app.get('io');
    const targetSocket = Object.entries(io.sockets.sockets).find(
      ([id, socket]) => socket.userId === assignedTo
    );

    if (targetSocket) {
      io.to(targetSocket[0]).emit('taskAssigned', {
        message,
        task,
      });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Task creation failed' });
  }
});

export default router;  // Default export
