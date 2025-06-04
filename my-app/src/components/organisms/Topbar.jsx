// components/organisms/Topbar.jsx

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../utils/theme';
import {
  Moon, Sun, LogIn, User, Bell, Menu, LogOut, UserPen,
  Home, ListTodo, Users, Group, CirclePlus, LayoutList, CircleHelp
} from 'lucide-react';
import logoDark from '../../assets/collabnest_logo_dark.png';
import logoLight from '../../assets/collabnest_logo_light.png';

const testNotifications = [
  { id: 1, message: "Assignment 1 deadline tomorrow!" },
  { id: 2, message: "Project meeting at 3 PM." },
  { id: 3, message: "New message from John." },
];

const Topbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();

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
              {testNotifications.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {testNotifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded shadow-lg z-50">
                <div className="p-2 border-b border-zinc-200 dark:border-zinc-700 font-semibold">
                  Notifications
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {testNotifications.length === 0 ? (
                    <li className="p-2 text-sm text-zinc-500">No notifications</li>
                  ) : (
                    testNotifications.map((notif) => (
                      <li key={notif.id} className="p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                        {notif.message}
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
