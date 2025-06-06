import React, { useState, useEffect } from 'react';
import { Sun, Moon, Trash2 } from 'lucide-react';
import DashboardLayout from '../components/organisms/DashboardLayout';
import KanbanBoard from '../components/organisms/KanbanBoard';
import ToDoListLayout from '../components/organisms/ToDoListLayout';

const ToDoList = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now(), text: task, completed: false }]);
      setTask('');
    }
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto py-10 px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">📝 My To-Do Board</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <ToDoListLayout
            tasks={tasks}
            addTask={addTask}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
          />
        </div>

        <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6">
          <KanbanBoard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ToDoList;
