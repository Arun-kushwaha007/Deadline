import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../redux/slices/tasksSlice';
import { v4 as uuidv4 } from 'uuid';

const NewTaskModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('todo');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(
      addTask({
        id: uuidv4(),
        title,
        description,
        dueDate,
        status,
      })
    );

    // Reset all fields
    setTitle('');
    setDescription('');
    setDueDate('');
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
        <h2 className="text-lg font-bold mb-4 text-gray-100">Create New Task</h2>

        <input
          type="text"
          placeholder="Task title"
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

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
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskModal;
