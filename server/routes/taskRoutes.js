// routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create new task
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, assignedTo, deadline, priority } = req.body;

  try {
    const task = new Task({
      title,
      description,
      assignedTo,
      deadline,
      priority,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating task' });
  }
});

module.exports = router;
