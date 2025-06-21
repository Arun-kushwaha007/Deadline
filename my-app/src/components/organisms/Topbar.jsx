// components/organisms/Topbar.jsx

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
  loadPersistedNotifications, // New action to load from localStorage
  persistNotifications, // New action to save to localStorage
} from '../../redux/slices/notificationSlice';
import {
  Moon, Sun, LogIn, User, Bell, Menu, LogOut, UserPen, AlarmClockCheck,
  Home, ListTodo, Users, Group, CirclePlus, LayoutList, CircleHelp, CheckCheck, Filter
} from 'lucide-react';
import logoDark from '../../assets/collabnest_logo_dark.png';
import logoLight from '../../assets/collabnest_logo_light.png';

const Topbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get notification data from Redux store
  const { unreadCount, currentFilterType, snoozedItems, notifications } = useSelector(state => state.notifications);
  const filteredNotifications = useSelector(selectFilteredNotifications);
  
  const activeSnoozeTimeoutsRef = useRef(new Map());

  const notificationFilterOptions = [
    { value: 'all', label: 'All' },
    { value: 'taskAssigned', label: 'Tasks' },
    { value: 'invite', label: 'Invitations' },
    { value: 'message', label: 'Messages' },
    { value: 'deadline', label: 'Deadlines' },
    { value: 'info', label: 'Info' },
    { value: 'newComment', label: 'Comments' },
  ];

  // Load persisted notifications on component mount
  useEffect(() => {
    // First load persisted notifications from localStorage
    dispatch(loadPersistedNotifications());
    
    // Then fetch new notifications from server
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Persist notifications whenever they change
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      dispatch(persistNotifications());
    }
  }, [notifications, dispatch]);

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
    // Optional: navigate to related entity
  };

  const handleSnoozeNotification = (e, notifId) => {
    e.stopPropagation(); 
    dispatch(snoozeNotification({ id: notifId, snoozeDuration: 10 * 60 * 1000 }));
  };

  const menuItems = [
    { to: '/', label: 'Dashboard', icon: <Home size={18} /> },
    { to: '/tasks', label: 'Tasks', icon: <ListTodo size={18} /> },
    { to: '/team', label: 'Team', icon: <Users size={18} /> },
    { to: '/create_Organization', label: 'Create Organization', icon: <Group size={18} /> },
    { to: '/join_Organization', label: 'Join Organization', icon: <CirclePlus size={18} /> },
    { to: '/todo', label: 'To Do List', icon: <LayoutList size={18} /> },
    { to: '/help', label: 'Help', icon: <CircleHelp size={18} /> },
  ];

  return (
    <>
      <header className="flex justify-between items-center h-16 px-6 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white transition-colors duration-300">
        <div className="flex items-center gap-3">
          <img
            src={theme === 'dark' ? logoLight : logoDark}
            alt="CollabNest"
            className="h-12 object-contain mb-2"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="p-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition relative"
              aria-label="Show notifications"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] h-[18px] flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg">Notifications</span>
                    {filteredNotifications.length > 0 && unreadCount > 0 && (
                      <button
                        onClick={() => dispatch(markAllAsRead())}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        title="Mark all notifications as read"
                      >
                        <CheckCheck size={14} /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center gap-2">
                     <Filter size={16} className="text-zinc-500 dark:text-zinc-400" />
                    <select
                      value={currentFilterType}
                      onChange={(e) => dispatch(setNotificationFilter(e.target.value))}
                      className="w-full p-1.5 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {notificationFilterOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <li className="p-4 text-sm text-zinc-500 dark:text-zinc-400 text-center">
                      {currentFilterType === 'all' ? 'No new notifications' : `No ${currentFilterType} notifications`}
                    </li>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <li
                        key={notif._id || notif.id}
                        className={`p-3 text-sm border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition cursor-pointer ${!notif.isRead ? 'font-semibold bg-blue-50 dark:bg-blue-900/40' : 'text-zinc-700 dark:text-zinc-300'}`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <div className="flex items-start gap-2">
                          {!notif.isRead && (
                            <span className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          )}
                          <span className="flex-grow">{notif.message}</span>
                        </div>
                        <div className={`text-xs text-zinc-500 dark:text-zinc-400 mt-1 ${!notif.isRead ? 'pl-4' : ''}`}>
                          {new Date(notif.createdAt || Date.now()).toLocaleString([], { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="mt-2 flex justify-start">
                          <button
                            onClick={(e) => handleSnoozeNotification(e, notif._id || notif.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 py-1 px-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                            title="Snooze for 10 minutes"
                          >
                            <AlarmClockCheck size={14} /> Snooze 10m
                          </button>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          {isLoggedIn && user ? (
            <div className="hidden sm:flex items-center gap-2">
              <User size={20} />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded flex items-center gap-1 transition"
              title="Login"
            >
              <LogIn size={20} /> <span>Login</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
         <button
            className={`lg:hidden ml-2 p-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-transform duration-300`}
            onClick={() => setShowMobileMenu((prev) => !prev)}
            title="Menu"
          >
            <Menu
              className={`transform transition-transform duration-300 ${
                showMobileMenu ? 'rotate-90 scale-110 text-blue-500' : 'rotate-0 scale-100'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white dark:bg-zinc-900 p-4 shadow-md z-50">
          <nav className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <button
                key={item.to}
                onClick={() => {
                  navigate(item.to);
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <hr className="my-2 border-zinc-300 dark:border-zinc-700" />
            {isLoggedIn && (
              <>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
                >
                  <UserPen size={18} /> Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('loggedInUser');
                    setIsLoggedIn(false);
                    setUser(null);
                    navigate('/login');
                  }}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Topbar;