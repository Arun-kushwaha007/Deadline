import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, editTask } from '../../redux/slices/tasksSlice';
import { v4 as uuidv4 } from 'uuid';

const NewTaskModal = ({ isOpen, onClose, taskToEdit }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('');

  // Pre-fill fields when editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate || '');
      setStatus(taskToEdit.status || 'todo');
      setPriority(taskToEdit.priority || '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('todo');
      setPriority('');
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      dispatch(
        editTask({
          id: taskToEdit.id,
          updatedTask: {
            title,
            description,
            priority,
            dueDate,
            status,
          },
        })
      );
    } else {
      dispatch(
        addTask({
          id: uuidv4(),
          title,
          description,
          priority,
          dueDate,
          status,
        })
      );
    }

    // Reset all fields
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('');
    setStatus('todo');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-lg font-bold mb-4 text-gray-100">
          {taskToEdit ? 'Edit Task' : 'Create New Task'}
        </h2>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
          rows={3}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-slate-700 text-white"
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        

        <select
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-accent rounded text-white"
          >
            {taskToEdit ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskModal;
