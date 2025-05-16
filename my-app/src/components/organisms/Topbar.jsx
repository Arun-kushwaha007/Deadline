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
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);
  

  return (
    <div className="flex justify-between items-center h-16 px-6 bg-zinc-800 text-white">
      <div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn && user ? (
          // ✅ Show user name and icon
          <div className="flex items-center gap-2">
            <User size={20} />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        ) : (
          // ✅ Navigate to login if not logged in
          <button
            onClick={() => navigate('/login')}
            className="bg-zinc-700 p-2 rounded flex items-center gap-1"
          >
            <LogIn size={20} /> <span>Login</span>
          </button>
        )}

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="bg-zinc-700 p-2 rounded"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Topbar;
