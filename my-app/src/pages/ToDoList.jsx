import React, { useState, useEffect } from 'react';
import { Sun, Moon, Plus, CheckCircle, Trash2, Calendar, Filter } from 'lucide-react';
import DashboardLayout from '../components/organisms/DashboardLayout';
import ToDoListLayout from '../components/organisms/ToDoListLayout';

import api from '../utils/api';
import { useNavigate } from 'react-router';
import AIAssistantWrapper from '../components/organisms/AIAssistantWrapper';


const ToDoList = () => {
  const navigate = useNavigate();
      
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const [darkMode, setDarkMode] = useState(false);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await api.get('/todos');
        setTasks(fetchedTasks); 
      } catch (err) {
        console.error('❌ Failed to load tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!task.trim()) return;
    try {
      const newTask = await api.post('/todos', { 
        text: task.trim(),
      });
      setTasks(prev => [newTask, ...prev]);
      setTask('');
    } catch (error) {

      console.error('Failed to add task:', error.message || error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const updatedTask = await api.put(`/todos/${id}/toggle`);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updatedTask : t)) 
      );
    } catch (err) {
      console.error('❌ Failed to toggle task:', err.message || err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('❌ Failed to delete task:', err.message || err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-900 text-gray-800 dark:text-white transition-colors duration-300">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    My To-Do Board
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Stay organized and get things done
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle Theme"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button> */}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress: {completedCount} of {totalCount} tasks completed
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Add Task Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Task
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={addTask}
                disabled={!task.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-medium shadow-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>

          {/* Filter and Stats Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Filter:</span>
                <div className="flex gap-2">
                  {['all', 'active', 'completed'].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filter === filterType
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-800 dark:text-blue-300 font-medium">
                    {tasks.filter(t => !t.completed).length} Active
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-300 font-medium">
                    {completedCount} Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span>📋</span>
                Your Tasks ({filteredTasks.length})
              </h2>
              <p className="text-blue-100 mt-2">
                {filter === 'all' ? 'All your tasks' : 
                 filter === 'active' ? 'Tasks pending completion' : 
                 'Completed tasks'}
              </p>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="flex-1 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">
                      {filter === 'completed' ? '✅' : '📝'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {filter === 'completed' ? 'No completed tasks yet' : 
                     filter === 'active' ? 'No active tasks' : 
                     'No tasks yet'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filter === 'completed' ? 'Complete some tasks to see them here!' : 
                     filter === 'active' ? 'All tasks are completed! 🎉' : 
                     'Add your first task to get started!'}
                  </p>
                </div>
              ) : (
                <ToDoListLayout
                  tasks={filteredTasks}
                  addTask={addTask}
                  toggleComplete={toggleComplete}
                  deleteTask={deleteTask}
                  task={task}
                  setTask={setTask}
                />
              )}
            </div>
          </div>

          {/* Summary Card */}
          {totalCount > 0 && (
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    🎯 Today's Progress
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Keep up the great work! You're making excellent progress.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Completed
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <AIAssistantWrapper />
    </DashboardLayout>
  );
};

export default ToDoList;