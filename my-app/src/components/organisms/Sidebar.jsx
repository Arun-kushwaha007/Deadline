// Sidebar.jsx
import MenuItems from './MenuItems';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserPen } from 'lucide-react';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);

  return (
    <div className="hidden lg:flex w-64 h-screen p-5 flex-col gap-6 bg-white dark:bg-zinc-950 text-black dark:text-white">
      <div className="text-sm opacity-80 mb-4">
        Welcome, <span className="font-semibold">{user?.name}</span> 👋
      </div>
      <MenuItems />
      <div className="mt-auto space-y-2">
        <button onClick={() => navigate('/profile')} className="flex items-center gap-3 p-2 rounded w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <UserPen size={20} /> Profile
        </button>
        <button onClick={() => {
          localStorage.removeItem('loggedInUser');
          navigate('/login');
        }} className="flex items-center gap-3 p-2 rounded w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
