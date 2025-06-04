// components/organisms/Topbar.jsx

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../utils/theme';
import { Moon, Sun, LogIn, User,Bell } from 'lucide-react';
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
 const [isDark, setIsDark] = useState(false);


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

    // Optional: Update <html> class if you don't rely on context alone
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
     <header className="flex justify-between items-center h-16 px-6 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white transition-colors duration-300">
      {/* <h2 className="text-xl font-semibold">Dashboard</h2> */}
 <img
          src={isDark ? logoLight : logoDark}
          alt="CollabNest"
          className="h-12 object-contain mb-2"
        />
      <div className="flex items-center gap-4">
        {/* Notification Button */}
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
        {/* ...existing code... */}
        {isLoggedIn && user ? (
          <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
};

export default Topbar;
