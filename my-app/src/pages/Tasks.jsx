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
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-primary text-2xl">📋</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-[1.01] ${
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-[1.01] ${
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
              <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-border">
                    <span className="text-foreground text-sm font-bold">📝</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">To Do</h4>
                    <p className="text-sm text-muted-foreground">Pending tasks</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <span className="text-primary text-sm font-bold">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">In Progress</h4>
                    <p className="text-sm text-muted-foreground">Active work</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-border">
                    <span className="text-foreground text-sm font-bold">👀</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Review</h4>
                    <p className="text-sm text-muted-foreground">Under review</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                    <span className="text-green-600 dark:text-green-400 text-sm font-bold">✅</span>
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
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Content Header */}
            <div className="bg-muted border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
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
                  <p className="text-muted-foreground mt-2">
                    {view === 'kanban' 
                      ? 'Drag and drop tasks between columns to update their status'
                      : 'View and manage your tasks in a calendar format'
                    }
                  </p>
                </div>
                
                {/* <button
                  onClick={() => navigate('/create-task')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all hover:scale-[1.01] font-medium"
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
          <div className="mt-8 bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-primary">💡</span>
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