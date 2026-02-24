import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../components/organisms/DashboardLayout';
import KanbanBoard from '../components/organisms/KanbanBoard';
import OrganizationDashboard from '../components/Organization/OrganizationDashboard';
import AIAssistantWrapper from '../components/organisms/AIAssistantWrapper';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = useSelector((state) => state.auth?.user || JSON.parse(localStorage.getItem('loggedInUser') || '{}'));
  const organizations = useSelector((state) => state.organization?.organizations || []);
  const tasks = useSelector((state) => state.tasks?.tasks || []);

  // Compute quick stats from Redux task state
  const taskStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activeTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const dueToday = tasks.filter(t => {
      if (!t.deadline) return false;
      const deadline = new Date(t.deadline);
      return deadline >= today && deadline < tomorrow;
    }).length;

    return { activeTasks, completedTasks, dueToday };
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 18) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-muted transition-colors duration-300">
          <div className="bg-muted mb-8">
                  <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                      {/* Greeting and Time */}
                      <div className="mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary-foreground bg-clip-text text-transparent mb-2">
                          {getGreeting()}, {user.name || 'User'}!
                        </h1>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📅</span>
                            <span className="text-lg font-medium">{formatDate(currentTime)}</span>
                          </div>
                          <div className="hidden sm:block w-2 h-2 bg-slate-400 rounded-full"></div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">⏰</span>
                            <span className="text-lg font-mono">{formatTime(currentTime)}</span>
                          </div>
                        </div>
                      </div>
        
                      {/* Welcome Message */}
                      {/* <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-foreground mb-3">
                          🚀 Welcome to CollabNest - Deadline
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-md leading-relaxed">
                          Your productivity command center where teams collaborate, deadlines are met, and success is achieved together.
                        </p>
                      </div> */}
                    </div>
                  </div>
                </div>
        

        {/* Quick Stats */}
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br bg-secondary/50 rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">
                  🏢
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Organizations</p>
                  <p className="text-2xl font-bold text-foreground">{organizations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                  ✅
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Tasks</p>
                  <p className="text-2xl font-bold text-foreground">{taskStats.activeTasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br bg-secondary/50 rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary0 rounded-full flex items-center justify-center text-white text-xl">
                  ⏰
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due Today</p>
                  <p className="text-2xl font-bold text-foreground">{taskStats.dueToday}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary to-secondary/80 dark:from-violet-900/20 dark:to-violet-800/20 rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">
                  📈
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{taskStats.completedTasks}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Organizations Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span>🏢</span>
                Organizations
              </h3>
              <p className="text-primary-foreground/80 mt-2">
                Manage your workspaces and collaborate with your teams
              </p>
            </div>
            <div className="">
              <OrganizationDashboard />
            </div>
          </div>

          {/* Kanban Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span>📋</span>
                Task Board
              </h3>
              <p className="text-green-100 mt-2">
                Organize and track your tasks with our intuitive Kanban board
              </p>
            </div>
            <div className="p-6">
              <KanbanBoard />
            </div>
          </div>

          {/* AI Assistant Section */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r bg-primary p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span>🤖</span>
                AI Assistant
              </h3>
              <p className="text-primary-foreground/80 mt-2">
                Get help with your tasks and boost your productivity
              </p>
            </div>
            <div className="p-6">
            </div>
          </div> */}

              <AIAssistantWrapper />
          {/* Footer Message */}
          <div className="text-center py-8">
            <div className="bg-card rounded-xl p-6 border border-border dark:border-border">
              <p className="text-muted-foreground text-lg">
                🎯 This is your productivity control center. Let's achieve great things together!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;