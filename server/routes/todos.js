// routes/todos.js
import express from 'express';
import Todo from '../models/Todo.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all todo routes
router.use(authMiddleware);

// Get all todos for the authenticated user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Server error while fetching todos' });
  }
});

// Create a new todo for the authenticated user
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const newTodo = new Todo({
      text: text.trim(),
      userId: req.user._id, // Associate with the logged-in user
    });
    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error saving todo:', err);
    res.status(500).json({ error: 'Server error while creating todo' });
  }
});

// Toggle completed status for a user's todo
router.put('/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found or you do not have permission to modify it.' });
    }

    todo.completed = !todo.completed;
    const updated = await todo.save();
    res.json(updated);
  } catch (err) {
    console.error('Error toggling todo:', err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: 'Server error while toggling todo' });
  }
});

// Delete a user's todo
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found or you do not have permission to delete it.' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: 'Server error while deleting todo' });
  }
});

export default router;
