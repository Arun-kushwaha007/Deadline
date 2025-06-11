import express from 'express';
import Task from '../models/Task.js'; 
// Notification model is no longer needed here as it's handled in the controller.
import authMiddleware from '../middleware/authMiddleware.js';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js'; // Import controller functions

const router = express.Router();

// GET: Tasks for logged-in user - This seems specific, might need its own controller or be part of getAllTasks with query params
// For now, leaving as is, but ideally, this would also use a controller function.
router.get('/', authMiddleware, async (req, res) => {
  try {
    // This specific logic might be better in a controller, e.g., getMyTasks
    const tasks = await Task.find({ assignedTo: req.user._id }).populate('assignedTo');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// GET: Tasks for a team - Similar to above, this could be a controller function
router.get('/team/tasks', authMiddleware, async (req, res) => {
  try {
    // This specific logic might be better in a controller, e.g., getTeamTasks
    const tasks = await Task.find({ teamId: req.user.teamId }).populate('assignedTo');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team tasks' });
  }
});

// POST: Create a task - Now delegates to taskController.createTask
// The main app.js/server.js should wire up POST /api/tasks (or similar) to taskController.createTask.
// If this file (taskRoutes.js) is directly responsible for the '/api/tasks' base path,
// then it should use the imported controller function.
// router.post('/', authMiddleware, createTask); // Controller handles req, res

// To align with the subtask, I will remove the body of the POST '/' route.
// It's assumed that server.js or app.js now routes POST requests for the tasks endpoint
// directly to the createTask controller function.
// If this router file is still used under a base path (e.g., app.use('/api/tasks', taskRoutes)),
// then the following line is how you'd typically set it up:
// router.post('/', authMiddleware, createTask);
// For the purpose of this exercise, I will empty the route handler body as requested by the previous logic.
// However, the more standard way is to directly use the controller function like:
// router.post('/', authMiddleware, createTaskControllerFunction);
// I will remove the old content. The subtask implies cleaning this file.

router.post('/', authMiddleware, createTask);


// It's good practice to also route other HTTP methods to their respective controller functions.
// Example:
// router.get('/', authMiddleware, getAllTasks); // Assuming getAllTasks handles user-specific logic or it's a general admin endpoint
router.get('/:id', authMiddleware, getTaskById);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);
// The existing GET routes are specific and might need separate controller functions or adjustments in getAllTasks.

export default router;
