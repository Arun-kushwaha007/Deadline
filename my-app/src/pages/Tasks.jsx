import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Calendar, LayoutDashboard, Filter, Search, Plus } from 'lucide-react';
import DashboardLayout from '../components/organisms/DashboardLayout';
import CalendarView from '../components/organisms/CalendarView';
import UserKanbanBoard from '../components/organisms/UserKanbanBoard';
import { fetchTasks, clearTasks } from '../redux/slices/tasksSlice';
import AIAssistantWrapper from '../components/organisms/AIAssistantWrapper';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const [view, setView] = useState('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchTasks());
    return () => {
      dispatch(clearTasks());
    };
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-card dark:via-zinc-900 dark:to-zinc-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Task Management
                  </h1>
                  <p className="text-muted-foreground">
                    Organize and track your work efficiently
                  </p>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 dark:border-border rounded-lg bg-white dark:bg-accent text-foreground placeholder-slate-500 dark:placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* View Controls */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground/80">View Mode:</span>
              </div>
              
              <div className="flex gap-2 p-1 bg-accent rounded-lg">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                    view === 'kanban'
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:bg-white dark:hover:bg-slate-600'
                  }`}
                  onClick={() => setView('kanban')}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Kanban Board
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                    view === 'calendar'
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:bg-white dark:hover:bg-slate-600'
                  }`}
                  onClick={() => setView('calendar')}
                >
                  <Calendar className="w-4 h-4" />
                  Calendar View
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📝</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">To Do</h4>
                    <p className="text-sm text-muted-foreground">Pending tasks</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">In Progress</h4>
                    <p className="text-sm text-muted-foreground">Active work</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">👀</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Review</h4>
                    <p className="text-sm text-muted-foreground">Under review</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✅</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Done</h4>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            {/* Content Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    {view === 'kanban' ? (
                      <>
                        <LayoutDashboard className="w-6 h-6" />
                        Kanban Board
                      </>
                    ) : (
                      <>
                        <Calendar className="w-6 h-6" />
                        Calendar View
                      </>
                    )}
                  </h2>
                  <p className="text-orange-100 mt-2">
                    {view === 'kanban' 
                      ? 'Drag and drop tasks between columns to update their status'
                      : 'View and manage your tasks in a calendar format'
                    }
                  </p>
                </div>
                
                {/* <button
                  onClick={() => navigate('/create-task')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all transform hover:scale-105 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Task
                </button> */}
              </div>
            </div>

            {/* View Content */}
            <div className="p-6">
              {view === 'kanban' && <UserKanbanBoard searchTerm={searchTerm} />}
              {view === 'calendar' && <CalendarView searchTerm={searchTerm} />}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span>💡</span>
              Productivity Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-lg">🎯</span>
                <div>
                  <h4 className="font-medium text-foreground">Stay Focused</h4>
                  <p className="text-muted-foreground">Break large tasks into smaller, manageable pieces</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">⏰</span>
                <div>
                  <h4 className="font-medium text-foreground">Set Deadlines</h4>
                  <p className="text-muted-foreground">Use the calendar view to track important due dates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🔄</span>
                <div>
                  <h4 className="font-medium text-foreground">Update Status</h4>
                  <p className="text-muted-foreground">Drag tasks between columns to show progress</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🤖</span>
                <div>
                  <h4 className="font-medium text-foreground">Get AI Help</h4>
                  <p className="text-muted-foreground">Use the AI assistant for task management tips</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AIAssistantWrapper />
    </DashboardLayout>
  );
};

export default Tasks;