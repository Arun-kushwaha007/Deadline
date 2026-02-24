import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/organisms/DashboardLayout';

const Help = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const helpContent = (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-card dark:to-card flex items-center justify-center px-4 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <span className="text-6xl">❓</span>
          </div>
        </div>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r bg-primary text-white rounded-full text-xl font-medium mb-6 shadow-lg">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
          Coming Soon
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r bg-primary bg-clip-text text-transparent mb-6 animate-fade-in">
          Help & Support
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
          We're building something amazing for you!
        </p>

        {/* Current Help Card */}
        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <span className="text-3xl">💡</span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Need Help Right Now?
          </h3>
          
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            While we're working on our comprehensive help center, here are some quick ways to get assistance:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-foreground mb-2">📧 Email Support</h4>
              <p className="text-sm text-muted-foreground">
                Contact the Developer at{' '}
                <span className="font-medium text-primary">arunsk1310@gmail.com</span>
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-foreground mb-2">💬 Live Chat (Coming Soon)</h4>
              <p className="text-sm text-muted-foreground">
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
            <h4 className="font-bold text-foreground mb-2">Knowledge Base</h4>
            <p className="text-sm text-muted-foreground">
              Comprehensive guides and tutorials
            </p>
          </div>

          <div className="bg-gradient-to-br bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
              🎥
            </div>
            <h4 className="font-bold text-foreground mb-2">Video Tutorials</h4>
            <p className="text-sm text-muted-foreground">
              Step-by-step video guides
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
              ❓
            </div>
            <h4 className="font-bold text-foreground mb-2">FAQ Section</h4>
            <p className="text-sm text-muted-foreground">
              Answers to common questions
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r bg-primary text-white rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              🏠 Back to Dashboard
            </button>
          ) : (
            <Link
              to="/login"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 font-medium shadow-lg text-center"
            >
              🚀 Sign In to Get Started
            </Link>
          )}
          
          <button
            onClick={() => window.open('mailto:arunsk1310@gmail.com', '_blank')}
            className="px-8 py-3 bg-muted0 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
          >
            📧 Contact Support
          </button>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-border">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            <span>🚀</span>
            Quick Tips While You Wait
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div>
                <h4 className="font-medium text-foreground">Explore the Dashboard</h4>
                <p className="text-sm text-muted-foreground">Familiarize yourself with the main navigation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">📋</span>
              <div>
                <h4 className="font-medium text-foreground">Create Your First Task</h4>
                <p className="text-sm text-muted-foreground">Start organizing your work with the Kanban board</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🏢</span>
              <div>
                <h4 className="font-medium text-foreground">Join Organizations</h4>
                <p className="text-sm text-muted-foreground">Collaborate with your team members</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🤖</span>
              <div>
                <h4 className="font-medium text-foreground">Try AI Assistant</h4>
                <p className="text-sm text-muted-foreground">Get help with task management and productivity</p>
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
  );

  // Logged-in users get DashboardLayout wrapper; visitors see standalone Help
  if (isLoggedIn) {
    return <DashboardLayout>{helpContent}</DashboardLayout>;
  }

  return (
    <div className="dark:bg-card">
      {/* Simple header for non-authenticated visitors */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/login" className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            CollabNest
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:from-orange-600 hover:to-red-700 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </header>
      {helpContent}
    </div>
  );
};

export default Help;