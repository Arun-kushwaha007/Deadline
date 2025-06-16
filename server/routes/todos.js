// routes/todos.js
import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new todo
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const newTodo = new Todo({ text: text.trim() });
    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error saving todo:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle completed status
router.put('/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Not found' });

    todo.completed = !todo.completed;
    const updated = await todo.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

export default router;
