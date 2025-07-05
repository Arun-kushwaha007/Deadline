import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, UserPen, User, Settings, HelpCircle,Star ,Sparkles } from 'lucide-react';
import MenuItems from './MenuItems';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const quickActions = [
    {
      label: 'Profile',
      icon: <UserPen size={16} />,
      onClick: () => navigate('/profile'),
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Settings',
      icon: <Settings size={16} />,
      onClick: () => navigate('/settings'),
      color: 'text-gray-600 dark:text-gray-400'
    },
    {
      label: 'Help',
      icon: <HelpCircle size={16} />,
      onClick: () => navigate('/help'),
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
          label: 'Feedback',
          icon: <Star size={16} />,
          onClick: () => navigate('/feedback'),
          color: 'text-red-600 dark:text-red-400'
        }
  ];

  return (
    <aside className="hidden lg:flex w-64 h-screen bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 border-r border-gray-200 dark:border-gray-700 flex-col transition-colors duration-300 shadow-lg">
      {/* User Welcome Section - Compact */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-sm">
                {getUserInitials(user?.name)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm">👋</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Welcome!</span>
            </div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {user?.name || 'User'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Flexible */}
      <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
        <MenuItems />
      </div>

      {/* Quick Actions - Compact */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Quick Actions
          </span>
        </div>
        <div className="space-y-1">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
            >
              <span className={`${action.color} group-hover:scale-110 transition-transform`}>
                {action.icon}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Section - Compact */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full p-2.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          <LogOut size={16} />
          <span className="text-sm">Logout</span>
        </button>
      </div>

      {/* Version Info - Minimal */}
      <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          CollabNest v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;