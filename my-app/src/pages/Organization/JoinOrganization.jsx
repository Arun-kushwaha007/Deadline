import React from 'react'
import DashboardLayout from "../../components/organisms/DashboardLayout"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinOrganization = () => {
  const navigate = useNavigate();
      
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center px-4 py-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-6xl">🚀</span>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-medium mb-6 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Coming Soon
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-6 animate-fade-in">
            Join Organizations
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            We're working on something amazing!
          </p>

          {/* Current Process Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-3xl">💡</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Current Process
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              For now, you can join organizations by sharing your{' '}
              <span className="font-semibold text-orange-500">Profile ID</span>{' '}
              with the Organization Admin or Coordinator.
            </p>
          </div>

          {/* Steps Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                1
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Get Your ID</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Copy your Profile ID from your profile page
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                2
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Share with Admin</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send your ID to the organization admin
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                3
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Get Added</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Wait for the admin to add you to the team
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/profile')}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              📋 View My Profile ID
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              🏠 Back to Dashboard
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-12 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              <span className="font-semibold">💡 Tip:</span> Stay tuned for our upcoming self-service join feature!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default JoinOrganization;