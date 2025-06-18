// components/organisms/Topbar.jsx

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Added Redux hooks
import { ThemeContext } from '../../utils/theme';
// import {
//   fetchNotifications,
//   markNotificationAsRead,
//   markAllAsRead,
//   // markNotificationAsUnread, // Available if needed later
// } from '../../redux/slices/NotificationsSlice'; // Added Redux actions/thunks
import { fetchNotifications,markAllAsRead,markNotificationAsRead } from '../../redux/slices/NotificationSlice';
import {
  Moon, Sun, LogIn, User, Bell, Menu, LogOut, UserPen,
  Home, ListTodo, Users, Group, CirclePlus, LayoutList, CircleHelp, CheckCheck
} from 'lucide-react'; // Added CheckCheck for Mark all as read
import logoDark from '../../assets/collabnest_logo_dark.png';
import logoLight from '../../assets/collabnest_logo_light.png';

// const testNotifications = [
//   { id: 1, message: "Assignment 1 deadline tomorrow!" },
//   { id: 2, message: "Project meeting at 3 PM." },
//   { id: 3, message: "New message from John." },
// ];

const Topbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: notifications, unreadCount } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

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
          {/* Mobile menu toggle (hidden on lg+) */}
         
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
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded shadow-lg z-50">
                <div className="flex justify-between items-center p-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="font-semibold">Notifications</span>
                  {notifications.length > 0 && unreadCount > 0 && (
                    <button
                      onClick={() => dispatch(markAllAsRead())}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  )}
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <li className="p-3 text-sm text-zinc-500 dark:text-zinc-400 text-center">No new notifications</li>
                  ) : (
                    notifications.map((notif) => (
                      <li 
                        key={notif._id || notif.id} 
                        className={`p-3 text-sm border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer ${!notif.isRead ? 'font-semibold bg-blue-50 dark:bg-blue-900/30' : 'text-zinc-600 dark:text-zinc-300'}`}
                        onClick={() => {
                          if (!notif.isRead) {
                            dispatch(markNotificationAsRead(notif._id || notif.id));
                          }
                          // Optional: navigate to related entity
                          // if (notif.relatedEntity && notif.entityModel) {
                          //   if (notif.entityModel === 'Task' && notif.relatedEntity) {
                          //     navigate(`/tasks/${notif.relatedEntity}`); // Adjust path as needed
                          //   } // Add other entity model navigations
                          //   setShowNotifications(false); // Close dropdown on click
                          // }
                        }}
                      >
                        <div className="flex items-start gap-2">
                          {!notif.isRead && (
                            <span className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          )}
                          <span className="flex-grow">{notif.message}</span>
                        </div>
                        <div className={`text-xs text-zinc-400 dark:text-zinc-500 mt-1 ${!notif.isRead ? 'pl-4' : ''}`}>
                          {new Date(notif.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {/* Display entity type if useful, e.g., Task, Invite */}
                          {/* {notif.type && <span className="ml-2 capitalize text-blue-500">{notif.type}</span>} */}
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
