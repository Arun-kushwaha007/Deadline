import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/organisms/DashboardLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Team = () => {
  const navigate = useNavigate();
    
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-900 flex items-center justify-center px-4 py-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-6xl">👥</span>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full text-xl font-medium mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Coming Soon
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-6 animate-fade-in">
            Team Management
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Powerful team collaboration tools are on the way!
          </p>

          {/* Features Preview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-3xl">🚀</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              What's Coming in Team Management?
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              We're building comprehensive team management features to help you collaborate better than ever before.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">👤 Team Member Profiles</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detailed profiles with roles, skills, and availability
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">🔄 Role Management</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assign roles and permissions for different team members
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                👥
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Team Directory</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete directory of all team members with contact info
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                💬
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Team Chat</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time messaging and communication tools
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                📊
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Performance Analytics</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track team productivity and performance metrics
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                🎯
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Goal Tracking</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set and monitor team goals and objectives
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                🔔
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Smart Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Intelligent alerts for team activities and updates
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-xl p-6 border border-teal-200 dark:border-teal-800">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                📅
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Team Calendar</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Shared calendar for meetings and deadlines
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              🏠 Back to Dashboard
            </button>
            
            <button
              onClick={() => navigate('/create_Organization')}
              className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              🏢 Manage Organizations
            </button>
          </div>

          {/* Current Capabilities */}
          <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800 mb-8">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-2">
              <span>✨</span>
              What You Can Do Right Now
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <span className="text-lg">🏢</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Create Organizations</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Set up workspaces for your teams</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">👤</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Invite Members</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add team members to your organizations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📋</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Assign Tasks</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Delegate work to team members</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📊</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Track Progress</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monitor team performance in dashboard</p>
                </div>
              </div>
            </div>
          </div>

          {/* Development Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-2">
              <span>🗓️</span>
              Development Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Phase 1</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Team Directory & Profiles</p>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Next Month</span>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-2xl mb-2">💬</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Phase 2</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time Chat & Notifications</p>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Q2 2025</span>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Phase 3</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Advanced Analytics & Reports</p>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Q3 2025</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-300 text-sm">
              <span className="font-semibold">🔔 Stay Tuned:</span> We'll notify you when new team features are released!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Team;