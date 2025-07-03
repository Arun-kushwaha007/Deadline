import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DashboardLayout from '../components/organisms/DashboardLayout';
import CalendarView from '../components/organisms/CalendarView';
import UserKanbanBoard from '../components/organisms/UserKanbanBoard';
import { fetchTasks, clearTasks } from '../redux/slices/tasksSlice';

const Tasks = () => {
  const [view, setView] = useState('kanban');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
    return () => {
      dispatch(clearTasks());
    };
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            view === 'kanban'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setView('kanban')}
        >
          Kanban View
        </button>
        <button
          className={`px-4 py-2 rounded ${
            view === 'calendar'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setView('calendar')}
        >
          Calendar View
        </button>
      </div>

      {view === 'kanban' && <UserKanbanBoard />}
      {view === 'calendar' && <CalendarView />}
    </DashboardLayout>
  );
};

export default Tasks;
