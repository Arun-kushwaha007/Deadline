import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CogIcon, 
  UserIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  PaintBrushIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/organisms/DashboardLayout';

const Setting = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    taskReminders: true,
    teamUpdates: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'team',
    activityStatus: true,
    dataSharing: false
  });
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAppearanceChange = (key, value) => {
    setAppearance(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      window.location.href = '/login';
    }
    setShowDeleteConfirm(false);
  };

  return (
    <DashboardLayout> 
      {/* Removed the full-screen div that was blocking the layout */}
      <div className="relative min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-800 to-zinc-900 text-white">

        <div className="relative max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            {/* <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Dashboard
            </Link> */}
            
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CogIcon className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
              Settings
            </h1>
            <p className="text-muted-foreground text-lg">
              Customize your CollabNest experience (Under Development)
            </p>
          </div>

          {/* Project Disclaimer */}
          <div className="mb-8">
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">⚠️</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-amber-300 font-semibold text-lg">Project Disclaimer</h3>
                  <p className="text-amber-200 text-sm leading-relaxed">
                    <strong>Note:</strong> This is a project by{' '}
                    <a 
                      href="https://github.com/Arun-kushwaha007" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-100 font-medium hover:text-amber-50 underline decoration-amber-300 hover:decoration-amber-200 transition-all duration-200"
                    >
                      Arun Kushwaha
                    </a>
                    . This is not an official or registered website/service. These settings are for demonstration purposes.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-amber-400 text-xs">📚 Educational Project</span>
                    <span className="text-amber-500">•</span>
                    <span className="text-amber-400 text-xs">🚧 Demo Purposes</span>
                    <span className="text-amber-500">•</span>
                    <span className="text-amber-400 text-xs">👨‍💻 Portfolio Work</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="space-y-8">
            
            {/* Profile Settings */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
              </div>

              {user && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                      <input
                        type="text"
                        value={user.name}
                        readOnly
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-200 text-sm">
                      <strong>Note:</strong> Profile editing is currently disabled in this demo version. 
                      In a full implementation, you would be able to update your profile information here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Settings */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r bg-primary rounded-full flex items-center justify-center">
                  <BellIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Notification Preferences (Under Development)</h2>
              </div>

              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
                    <div>
                      <h4 className="text-white font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {key === 'email' && 'Receive notifications via email'}
                        {key === 'push' && 'Browser push notifications'}
                        {key === 'taskReminders' && 'Get reminded about upcoming deadlines'}
                        {key === 'teamUpdates' && 'Updates from your team members'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-orange-500' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r bg-primary rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Privacy & Security</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-3">Profile Visibility</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['public', 'team', 'private'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handlePrivacyChange('profileVisibility', option)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          privacy.profileVisibility === option
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-700 text-muted-foreground hover:bg-slate-600'
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-700">
                  <div>
                    <h4 className="text-white font-medium">Show Activity Status</h4>
                    <p className="text-muted-foreground text-sm">Let others see when you're online</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyChange('activityStatus', !privacy.activityStatus)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy.activityStatus ? 'bg-orange-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacy.activityStatus ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-white font-medium">Data Sharing</h4>
                    <p className="text-muted-foreground text-sm">Share usage data to improve the service</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyChange('dataSharing', !privacy.dataSharing)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy.dataSharing ? 'bg-orange-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacy.dataSharing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <PaintBrushIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Appearance & Display</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-3">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAppearanceChange('theme', 'dark')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        appearance.theme === 'dark'
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-700 text-muted-foreground hover:bg-slate-600'
                      }`}
                    >
                      <MoonIcon className="w-5 h-5" />
                      Dark Theme
                    </button>
                    <button
                      onClick={() => handleAppearanceChange('theme', 'light')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        appearance.theme === 'light'
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-700 text-muted-foreground hover:bg-slate-600'
                      }`}
                    >
                      <SunIcon className="w-5 h-5" />
                      Light Theme
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Language</label>
                    <select
                      value={appearance.language}
                      onChange={(e) => handleAppearanceChange('language', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-white focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Timezone</label>
                    <select
                      value={appearance.timezone}
                      onChange={(e) => handleAppearanceChange('timezone', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-white focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">Greenwich Mean Time</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <TrashIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Danger Zone</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-4">
                  <h4 className="text-red-300 font-semibold mb-2">Delete Account</h4>
                  <p className="text-red-200 text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="flex justify-center mt-8">
            <button className="bg-gradient-to-r from-primary to-primary/80 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
              Save Changes
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-muted rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Confirm Account Deletion</h3>
              <p className="text-muted-foreground mb-6">
                Are you absolutely sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Setting;