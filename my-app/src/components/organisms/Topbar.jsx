// components/organisms/Topbar.jsx

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../utils/theme';
import { Moon, Sun, LogIn, User } from 'lucide-react';

const Topbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
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
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
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
