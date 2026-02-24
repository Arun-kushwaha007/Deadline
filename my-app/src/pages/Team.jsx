import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/organisms/DashboardLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Rocket, User, RefreshCw, MessageSquare, BarChart3, Target, Bell, Calendar, Home, Building2, Sparkles, ClipboardList, CalendarDays } from 'lucide-react';

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
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-muted border border-border rounded-full flex items-center justify-center shadow-lg text-primary">
              <Users className="w-16 h-16" />
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center px-6 py-2 bg-primary/10 text-primary rounded-full text-xl font-medium mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            Coming Soon
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Team Management
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Powerful team collaboration tools are on the way!
          </p>

          {/* Features Preview Card */}
          <div className="bg-card rounded-2xl p-8 shadow-xl border border-border mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500">
                <Rocket className="w-8 h-8" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-4">
              What's Coming in Team Management?
            </h3>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              We're building comprehensive team management features to help you collaborate better than ever before.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><User className="w-4 h-4" /> Team Member Profiles</h4>
                <p className="text-sm text-muted-foreground">
                  Detailed profiles with roles, skills, and availability
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Role Management</h4>
                <p className="text-sm text-muted-foreground">
                  Assign roles and permissions for different team members
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Team Directory</h4>
              <p className="text-sm text-muted-foreground">
                Complete directory of all team members with contact info
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Team Chat</h4>
              <p className="text-sm text-muted-foreground">
                Real-time messaging and communication tools
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold mb-4 mx-auto">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Performance Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Track team productivity and performance metrics
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Goal Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Set and monitor team goals and objectives
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Smart Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Intelligent alerts for team activities and updates
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Team Calendar</h4>
              <p className="text-sm text-muted-foreground">
                Shared calendar for meetings and deadlines
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-[1.01] font-medium shadow-sm flex items-center gap-2 justify-center"
            >
              <Home className="w-5 h-5" /> Back to Dashboard
            </button>
            
            <button
              onClick={() => navigate('/create_Organization')}
              className="px-8 py-3 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg transition-colors font-medium flex items-center gap-2 justify-center"
            >
              <Building2 className="w-5 h-5" /> Manage Organizations
            </button>
          </div>

          {/* Current Capabilities */}
          <div className="bg-muted rounded-xl p-6 border border-border mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              What You Can Do Right Now
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Building2 className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Create Organizations</h4>
                  <p className="text-sm text-muted-foreground">Set up workspaces for your teams</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Invite Members</h4>
                  <p className="text-sm text-muted-foreground">Add team members to your organizations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClipboardList className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Assign Tasks</h4>
                  <p className="text-sm text-muted-foreground">Delegate work to team members</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground">Track Progress</h4>
                  <p className="text-sm text-muted-foreground">Monitor team performance in dashboard</p>
                </div>
              </div>
            </div>
          </div>

          {/* Development Timeline */}
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-8">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              <CalendarDays className="w-6 h-6 text-blue-500" />
              Development Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex flex-col items-center">
                <Target className="w-8 h-8 mb-3 text-green-500" />
                <h4 className="font-semibold text-foreground mb-1">Phase 1</h4>
                <p className="text-sm text-muted-foreground">Team Directory & Profiles</p>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">Next Month</span>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 flex flex-col items-center">
                <MessageSquare className="w-8 h-8 mb-3 text-blue-500" />
                <h4 className="font-semibold text-foreground mb-1">Phase 2</h4>
                <p className="text-sm text-muted-foreground">Real-time Chat & Notifications</p>
                <span className="text-xs text-primary font-medium mt-2">Q2 2025</span>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 flex flex-col items-center">
                <BarChart3 className="w-8 h-8 mb-3 text-purple-500" />
                <h4 className="font-semibold text-foreground mb-1">Phase 3</h4>
                <p className="text-sm text-muted-foreground">Advanced Analytics & Reports</p>
                <span className="text-xs text-primary font-medium mt-2">Q3 2025</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex gap-3 items-center">
            <Bell className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-800 dark:text-green-300 text-sm">
              <span className="font-semibold">Stay Tuned:</span> We'll notify you when new team features are released!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Team;