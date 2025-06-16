import React from 'react';
import { Trash2 } from 'lucide-react';

const ToDoListLayout = ({
  tasks,
  task,
  setTask,
  addTask,
  toggleComplete,
  deleteTask,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors">
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">To-Do List</h1>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 outline-none"
            placeholder="Add a new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            Add
          </button>
        </div>

        <ul className="space-y-3">
          {tasks.map((t) => (
            <li
              key={t._id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded shadow transition"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(t._id)}
                  className="form-checkbox text-blue-600"
                />
                <span className={`text-lg ${t.completed ? 'line-through text-gray-400' : ''}`}>
                  {t.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(t._id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ToDoListLayout;
