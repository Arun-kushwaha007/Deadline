import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../components/organisms/DashboardLayout';
import KanbanBoard from '../components/organisms/KanbanBoard';
import OrganizationDashboard from '../components/Organization/OrganiationDashboard';
import AIAssistantWrapper from '../components/organisms/AIAssistantWrapper';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = useSelector((state) => state.auth?.user || JSON.parse(localStorage.getItem('loggedInUser') || '{}'));
  const organizations = useSelector((state) => state.organization?.organizations || []);

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
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
          <div className="bg-gradient-to-b from-blue-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 mb-8">
                  <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                      {/* Greeting and Time */}
                      <div className="mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent mb-2">
                          {getGreeting()}, {user.name || 'User'}!
                        </h1>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📅</span>
                            <span className="text-lg font-medium">{formatDate(currentTime)}</span>
                          </div>
                          <div className="hidden sm:block w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">⏰</span>
                            <span className="text-lg font-mono">{formatTime(currentTime)}</span>
                          </div>
                        </div>
                      </div>
        
                      {/* Welcome Message */}
                      {/* <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
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
        {/* <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                  🏢
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Organizations</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{organizations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                  ✅
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Tasks</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">12</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                  ⏰
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due Today</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">3</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                  📈
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">28</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Organizations Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span>🏢</span>
                Organizations
              </h3>
              <p className="text-blue-100 mt-2">
                Manage your workspaces and collaborate with your teams
              </p>
            </div>
            <div className="">
              <OrganizationDashboard />
            </div>
          </div>

          {/* Kanban Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
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
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span>🤖</span>
                AI Assistant
              </h3>
              <p className="text-purple-100 mt-2">
                Get help with your tasks and boost your productivity
              </p>
            </div>
            <div className="p-6">
            </div>
          </div> */}

              <AIAssistantWrapper />
          {/* Footer Message */}
          <div className="text-center py-8">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
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