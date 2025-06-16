import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import DashboardLayout from '../components/organisms/DashboardLayout';
import ToDoListLayout from '../components/organisms/ToDoListLayout';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const ToDoList = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/todos`);
        setTasks(res.data);
      } catch (err) {
        console.error('❌ Failed to load tasks:', err);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!task.trim()) return;
    try {
      const response = await axios.post(`${backendUrl}/api/todos`, {
        text: task.trim(),
      });
      setTasks(prev => [response.data, ...prev]);
      setTask('');
    } catch (error) {
      console.error('Failed to add task:', error.response?.data || error.message);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await axios.put(`${backendUrl}/api/todos/${id}/toggle`);
      const updated = res.data;
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
    } catch (err) {
      console.error('❌ Failed to toggle task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/todos/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('❌ Failed to delete task:', err);
    }
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
            task={task}
            setTask={setTask}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ToDoList;
