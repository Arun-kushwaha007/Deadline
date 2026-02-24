import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Building2, CheckCircle, Clock, TrendingUp, LayoutGrid, Target, CalendarDays } from 'lucide-react';
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
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
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
          <div className="bg-muted ">
                  <div className="max-w-xl mx-auto px-2 sm:px-3 lg:px-4 py-2">
                    <div className="text-center">
                      {/* Greeting and Time */}
                      <div className="mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                          {getGreeting()}, {user.name || 'User'}!
                        </h1>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-5 h-5" />
                            <span className="text-lg font-medium">{formatDate(currentTime)}</span>
                          </div>
                          <div className="hidden sm:block w-1.5 h-1.5 bg-muted-foreground/40 rounded-full"></div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span className="text-lg font-mono">{formatTime(currentTime)}</span>
                          </div>
                        </div>
                      </div>
        
                      {/* Welcome Message */}
                      {/* <div className="bg-white dark:bg-muted rounded-2xl p-6 shadow-lg border border-border dark:border-border max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold text-foreground  mb-3">
                          🚀 Welcome to CollabNest - Deadline
                        </h2>
                        <p className="text-muted-foreground text-md leading-relaxed">
                          Your productivity command center where teams collaborate, deadlines are met, and success is achieved together.
                        </p>
                      </div> */}
                    </div>
                  </div>
                </div>
        

        {/* Quick Stats */}
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Organizations</p>
                  <p className="text-2xl font-bold text-foreground">{organizations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                  <p className="text-2xl font-bold text-foreground">{taskStats.activeTasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Today</p>
                  <p className="text-2xl font-bold text-foreground">{taskStats.dueToday}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
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
            <div className="bg-primary p-6">
              <h3 className="text-2xl font-bold text-primary-foreground flex items-center gap-3">
                <Building2 className="w-6 h-6" />
                Organizations
              </h3>
              <p className="text-primary-foreground/70 mt-2">
                Manage your workspaces and collaborate with your teams
              </p>
            </div>
            <div className="">
              <OrganizationDashboard />
            </div>
          </div>

          {/* Kanban Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="bg-primary p-6">
              <h3 className="text-2xl font-bold text-primary-foreground flex items-center gap-3">
                <LayoutGrid className="w-6 h-6" />
                Task Board
              </h3>
              <p className="text-primary-foreground/70 mt-2">
                Organize and track your tasks with our intuitive Kanban board
              </p>
            </div>
            <div className="p-6">
              <KanbanBoard />
            </div>
          </div>

          {/* AI Assistant Section */}
          {/* <div className="bg-white dark:bg-muted rounded-2xl shadow-lg border border-border dark:border-border overflow-hidden">
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
            <div className="bg-card rounded-xl p-6 border border-border">
              <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                This is your productivity control center. Let's achieve great things together!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;