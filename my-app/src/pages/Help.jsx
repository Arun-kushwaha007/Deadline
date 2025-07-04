import React from 'react';
import DashboardLayout from '../components/organisms/DashboardLayout';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Help = () => {
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
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-6xl">❓</span>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xl font-medium mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Coming Soon
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6 animate-fade-in">
            Help & Support
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            We're building something amazing for you!
          </p>

          {/* Current Help Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <span className="text-3xl">💡</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Need Help Right Now?
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              While we're working on our comprehensive help center, here are some quick ways to get assistance:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">📧 Email Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contact the Developer at{' '}
                  <span className="font-medium text-blue-600 dark:text-blue-400">arunsk1310@gmail.com</span>
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">💬 Live Chat (Coming Soon)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chat with our team using the support widget
                </p>
              </div>
            </div>
          </div>

          {/* Features Coming Soon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                📚
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Knowledge Base</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comprehensive guides and tutorials
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                🎥
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Video Tutorials</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step-by-step video guides
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                ❓
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">FAQ Section</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Answers to common questions
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              🏠 Back to Dashboard
            </button>
            
            <button
              onClick={() => window.open('mailto:support@deadline.com', '_blank')}
              className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              📧 Contact Support
            </button>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-2">
              <span>🚀</span>
              Quick Tips While You Wait
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Explore the Dashboard</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Familiarize yourself with the main navigation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📋</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Create Your First Task</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start organizing your work with the Kanban board</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🏢</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Join Organizations</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Collaborate with your team members</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🤖</span>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Try AI Assistant</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get help with task management and productivity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              <span className="font-semibold">🔔 Stay Updated:</span> We'll notify you when our comprehensive help center is ready!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help;