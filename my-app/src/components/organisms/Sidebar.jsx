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
      color: 'text-primary'
    },
    {
      label: 'Settings',
      icon: <Settings size={16} />,
      onClick: () => navigate('/settings'),
      color: 'text-muted-foreground'
    },
    {
      label: 'Help',
      icon: <HelpCircle size={16} />,
      onClick: () => navigate('/help'),
      color: 'text-primary'
    },
    {
          label: 'Feedback',
          icon: <Star size={16} />,
          onClick: () => navigate('/feedback'),
          color: 'text-destructive'
        }
  ];

  return (
    <aside
      className="hidden lg:flex w-64 h-screen bg-sidebar border-r border-sidebar-border flex-col transition-colors duration-300 shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* User Welcome Section - Compact */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            {user?.profilePic ? (
              <img 
                src={user.profilePic} 
                alt={user.name || 'User'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-sm">
                {getUserInitials(user?.name)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Welcome!</span>
            </div>
            <h3 className="font-semibold text-sm text-sidebar-foreground truncate">
              {user?.name || 'User'}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Flexible */}
      <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <MenuItems />
      </div>

      {/* Quick Actions - Compact */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </span>
        </div>
        <div className="space-y-1">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-all duration-200 group"
            >
              <span className={`${action.color} group-hover:scale-110 transition-transform`}>
                {action.icon}
              </span>
              <span className="text-sm font-medium text-sidebar-foreground">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Section - Compact */}
      <div className="p-3 bg-muted border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          aria-label="Log out"
          className="flex items-center gap-2 w-full p-2.5 rounded-lg text-destructive hover:bg-destructive/10 font-medium transition-all duration-200"
        >
          <LogOut size={16} />
          <span className="text-sm">Logout</span>
        </button>
      </div>

      {/* Version Info - Minimal */}
      <div className="p-2 text-center border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground">
          CollabNest v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;