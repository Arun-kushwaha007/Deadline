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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors">
            <div className="max-w-xl mx-auto py-10 px-4">
           
            <ToDoListLayout
                tasks={tasks}
                addTask={addTask}
                toggleComplete={toggleComplete}
                deleteTask={deleteTask}
            />
            </div>
            <KanbanBoard/>
        </div>
    </DashboardLayout>
  );
};

export default ToDoList;
