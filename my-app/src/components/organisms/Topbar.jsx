import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../../utils/theme';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllAsRead,
  setNotificationFilter,
  selectFilteredNotifications,
  snoozeNotification,
  unSnoozeNotification,
  loadPersistedNotifications,
  persistNotifications,
} from '../../redux/slices/notificationSlice';
import {
  Moon, Sun, LogIn, User, Bell, Menu, LogOut, UserPen, AlarmClockCheck,
  Home, ListTodo, Users, Building2, CirclePlus, LayoutList, CircleHelp, 
  CheckCheck, Filter, Calendar, BarChart3, Settings, X
} from 'lucide-react';
import logoDark from '../../assets/collabnest_logo_dark.png';
import logoLight from '../../assets/collabnest_logo_light.png';

const Topbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // New states for toast notifications
  const [toastNotifications, setToastNotifications] = useState([]);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get notification data from Redux store
  const { unreadCount, currentFilterType, snoozedItems, notifications } = useSelector(state => state.notifications);
  const filteredNotifications = useSelector(selectFilteredNotifications);
  
  const activeSnoozeTimeoutsRef = useRef(new Map());

  const notificationFilterOptions = [
    { value: 'all', label: 'All', icon: '📄' },
    { value: 'taskAssigned', label: 'Tasks', icon: '📋' },
    { value: 'invite', label: 'Invitations', icon: '📨' },
    { value: 'message', label: 'Messages', icon: '💬' },
    { value: 'deadline', label: 'Deadlines', icon: '⏰' },
    { value: 'info', label: 'Info', icon: 'ℹ️' },
    { value: 'newComment', label: 'Comments', icon: '💭' },
  ];

  // Load persisted notifications on component mount
  useEffect(() => {
    dispatch(loadPersistedNotifications());
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Persist notifications whenever they change
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      dispatch(persistNotifications());
    }
  }, [notifications, dispatch]);

  // Watch for new notifications and show toast
  useEffect(() => {
    if (notifications.length > lastNotificationCount && lastNotificationCount > 0) {
      // Get the newest notifications
      const newNotifications = notifications.slice(0, notifications.length - lastNotificationCount);
      
      newNotifications.forEach((notification, index) => {
        setTimeout(() => {
          showToastNotification(notification);
        }, index * 500); // Stagger multiple notifications
      });
    }
    setLastNotificationCount(notifications.length);
  }, [notifications.length, lastNotificationCount]);

  // Show toast notification
  const showToastNotification = (notification) => {
    const toastId = `toast-${Date.now()}-${Math.random()}`;
    const newToast = {
      id: toastId,
      notification,
      timestamp: Date.now()
    };

    setToastNotifications(prev => [...prev, newToast]);

    // Auto remove after 10 seconds
    setTimeout(() => {
      removeToastNotification(toastId);
    }, 10000);
  };

  // Remove toast notification
  const removeToastNotification = (toastId) => {
    setToastNotifications(prev => prev.filter(toast => toast.id !== toastId));
  };

  // Handle toast notification click
  const handleToastClick = (toast) => {
    const notification = toast.notification;
    
    // Mark as read if not already
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id || notification.id));
    }
    
    // Remove the toast
    removeToastNotification(toast.id);
    
    // Optional: Navigate to related page based on notification type
    switch (notification.type) {
      case 'taskAssigned':
        navigate('/tasks');
        break;
      case 'invite':
        navigate('/join_Organization');
        break;
      case 'deadline':
        navigate('/tasks');
        break;
      default:
        // Open the notification panel
        setShowNotifications(true);
        break;
    }
  };

  // Get notification styling based on type
  const getNotificationStyle = (type) => {
    const styles = {
      taskAssigned: {
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
        border: 'border-blue-400',
        icon: '📋',
        color: 'text-blue-50'
      },
      invite: {
        bg: 'bg-gradient-to-r from-green-500 to-green-600',
        border: 'border-green-400',
        icon: '📨',
        color: 'text-green-50'
      },
      message: {
        bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
        border: 'border-purple-400',
        icon: '💬',
        color: 'text-purple-50'
      },
      deadline: {
        bg: 'bg-gradient-to-r from-red-500 to-red-600',
        border: 'border-red-400',
        icon: '⏰',
        color: 'text-red-50'
      },
      info: {
        bg: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
        border: 'border-cyan-400',
        icon: 'ℹ️',
        color: 'text-cyan-50'
      },
      newComment: {
        bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
        border: 'border-orange-400',
        icon: '💭',
        color: 'text-orange-50'
      },
      default: {
        bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
        border: 'border-gray-400',
        icon: '🔔',
        color: 'text-gray-50'
      }
    };
    return styles[type] || styles.default;
  };

  // Effect to manage timeouts for snoozed notifications
  useEffect(() => {
    const timeoutsMap = activeSnoozeTimeoutsRef.current;

    snoozedItems.forEach(snoozedItem => {
      const notificationId = snoozedItem.notification._id || snoozedItem.notification.id;
      
      if (timeoutsMap.has(notificationId)) {
        clearTimeout(timeoutsMap.get(notificationId));
      }

      const delay = snoozedItem.reShowAt - Date.now();
      if (delay > 0) {
        const timeoutId = setTimeout(() => {
          dispatch(unSnoozeNotification({ notification: snoozedItem.notification }));
          timeoutsMap.delete(notificationId); 
        }, delay);
        timeoutsMap.set(notificationId, timeoutId);
      } else {
        dispatch(unSnoozeNotification({ notification: snoozedItem.notification }));
        if (timeoutsMap.has(notificationId)) {
            clearTimeout(timeoutsMap.get(notificationId));
            timeoutsMap.delete(notificationId);
        }
      }
    });

    Array.from(timeoutsMap.keys()).forEach(notificationId => {
      if (!snoozedItems.some(item => (item.notification._id || item.notification.id) === notificationId)) {
        clearTimeout(timeoutsMap.get(notificationId));
        timeoutsMap.delete(notificationId);
      }
    });

    return () => {
      Array.from(timeoutsMap.values()).forEach(clearTimeout);
    };
  }, [snoozedItems, dispatch]);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsLoggedIn(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      dispatch(markNotificationAsRead(notif._id || notif.id));
    }
  
  };

  const handleSnoozeNotification = (e, notifId) => {
    e.stopPropagation(); 
    dispatch(snoozeNotification({ id: notifId, snoozeDuration: 10 * 60 * 1000 }));
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setShowUserMenu(false);
    navigate('/login');
  };

  const menuItems = [
    { to: '/', label: 'Dashboard', icon: <Home size={18} />, badge: null },
    { to: '/tasks', label: 'Tasks', icon: <ListTodo size={18} />, badge: null },
    { to: '/team', label: 'Team', icon: <Users size={18} />, badge: 'Soon' },
    { to: '/create_Organization', label: 'Organizations', icon: <Building2 size={18} />, badge: null },
    { to: '/join_Organization', label: 'Join Organization', icon: <CirclePlus size={18} />, badge: null },
    { to: '/todo', label: 'To Do List', icon: <LayoutList size={18} />, badge: null },
    { to: '/help', label: 'Help', icon: <CircleHelp size={18} />, badge: null },
  ];

  const getNotificationIcon = (type) => {
    const iconMap = {
      taskAssigned: '📋',
      invite: '📨',
      message: '💬',
      deadline: '⏰',
      info: 'ℹ️',
      newComment: '💭',
      default: '🔔'
    };
    return iconMap[type] || iconMap.default;
  };

  return (
    <>
      <header className="flex justify-between items-center h-16 px-6 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm">
        <div className="flex items-center gap-3">
          <a 
            href="https://collab-nest-home.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform duration-200 hover:scale-105"
          >
            <img
              src={theme === 'dark' ? logoLight : logoDark}
              alt="CollabNest"
              className="h-10 object-contain cursor-pointer"
            />
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Show notifications"
              title="Notifications"
            >
              <Bell size={20} className="text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] h-[20px] flex items-center justify-center font-medium shadow-lg animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Bell size={20} />
                      Notifications
                    </h3>
                    {filteredNotifications.length > 0 && unreadCount > 0 && (
                      <button
                        onClick={() => dispatch(markAllAsRead())}
                        className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full flex items-center gap-1 transition-all"
                        title="Mark all notifications as read"
                      >
                        <CheckCheck size={12} /> Mark all read
                      </button>
                    )}
                  </div>
                  
                  {/* Filter */}
                  <div className="relative flex items-center gap-2">
                    <Filter size={16} className="text-blue-100" />
                    <select
                      value={currentFilterType}
                      onChange={(e) => dispatch(setNotificationFilter(e.target.value))}
                      className="w-full p-2 text-sm border-0 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-blue-100 focus:ring-2 focus:ring-white/30 outline-none"
                    >
                      {notificationFilterOptions.map(opt => (
                        <option key={opt.value} value={opt.value} className="text-gray-900">
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentFilterType === 'all' ? 'No new notifications' : `No ${currentFilterType} notifications`}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <div
                        key={notif._id || notif.id}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer ${
                          !notif.isRead ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-sm">{getNotificationIcon(notif.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(notif.createdAt || Date.now()).toLocaleString([], { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            <button
                              onClick={(e) => handleSnoozeNotification(e, notif._id || notif.id)}
                              className="mt-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 py-1 px-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                              title="Snooze for 10 minutes"
                            >
                              <AlarmClockCheck size={12} /> Snooze 
                            </button>
                          </div>
                          {!notif.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hidden sm:flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-white" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-blue-100">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <UserPen size={16} /> Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Settings size={16} /> Settings
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all transform hover:scale-105 shadow-lg"
              title="Login"
            >
              <LogIn size={18} /> Login
            </button>
          )}

          {/* Theme Toggle */}
          {/* <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? 
              <Sun size={20} className="text-yellow-500" /> : 
              <Moon size={20} className="text-gray-600" />
            }
          </button> */}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            onClick={() => setShowMobileMenu((prev) => !prev)}
            title="Menu"
          >
            <Menu
              className={`transform transition-all duration-300 ${
                showMobileMenu ? 'rotate-90 scale-110 text-blue-500' : 'rotate-0 scale-100 text-gray-600 dark:text-gray-300'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40">
          <div className="p-4">
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.to}
                  onClick={() => {
                    navigate(item.to);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 dark:text-gray-300">{item.icon}</span>
                    <span className="font-medium text-gray-800 dark:text-white">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
              
              {isLoggedIn && (
                <>
                  <hr className="my-3 border-gray-200 dark:border-gray-700" />
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-all"
                  >
                    <UserPen size={18} className="text-gray-600 dark:text-gray-300" />
                    <span className="font-medium text-gray-800 dark:text-white">Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm transition-all"
                  >
                    <LogOut size={18} className="text-red-600 dark:text-red-400" />
                    <span className="font-medium text-red-600 dark:text-red-400">Logout</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Toast Notifications Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
        {toastNotifications.map((toast, index) => {
          const style = getNotificationStyle(toast.notification.type);
          const timeSinceShown = Date.now() - toast.timestamp;
          const remainingTime = Math.max(0, 10000 - timeSinceShown);
          const progressPercent = (remainingTime / 10000) * 100;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto relative w-80 max-w-sm ${style.bg} ${style.border} border-2 rounded-2xl shadow-2xl backdrop-blur-lg animate-slide-in-right cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden`}
              style={{
                animationDelay: `${index * 100}ms`,
                transform: `translateY(${index * 4}px)`,
              }}
              onClick={() => handleToastClick(toast)}
            >
              {/* Progress bar */}
              <div className="absolute top-0 left-0 h-1 bg-white/30 transition-all duration-1000 ease-linear"
                   style={{ width: `${progressPercent}%` }}></div>
              
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-lg">{style.icon}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-bold text-sm ${style.color} leading-tight`}>
                        New {toast.notification.type.charAt(0).toUpperCase() + toast.notification.type.slice(1).replace(/([A-Z])/g, ' $1')}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeToastNotification(toast.id);
                        }}
                        className="flex-shrink-0 text-white/70 hover:text-white p-1 hover:bg-white/20 rounded-full transition-all duration-200 ml-2"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    
                    <p className={`text-sm ${style.color} leading-relaxed line-clamp-2`}>
                      {toast.notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-white/70">
                        {new Date(toast.notification.createdAt || Date.now()).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/90 font-medium">
                        Click to view
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%) translateY(0px);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(0px);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Topbar;