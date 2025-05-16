import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, ListTodo, Users, LogOut, User, Group,
  CircleHelp, CirclePlus, UserPen
} from 'lucide-react';
import { useEffect, useState } from 'react';

const menu = [
  { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/tasks', label: 'Tasks', icon: <ListTodo size={20} /> },
  { to: '/team', label: 'Team', icon: <Users size={20} /> },
  { to: '/create_team', label: 'Create Team', icon: <Group size={20} /> },
  { to: '/join_team', label: 'Join Team', icon: <CirclePlus size={20} /> },
  { to: '/help', label: 'Help', icon: <CircleHelp size={20} /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
    } else {
      alert('Please log in to access the dashboard.');
      navigate('/login');
    }
  }, [navigate]);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-zinc-900 text-white p-5 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">TaskFlow AI</h1>
      
      {user && (
        <div className="text-sm text-gray-300 mb-4">
          Welcome, <span className="font-semibold">{user.name}</span>
        </div>
      )}

      <nav className="flex flex-col gap-3">
        {menu.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded hover:bg-zinc-700 transition ${
                isActive ? 'bg-zinc-800' : ''
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-3 p-2 rounded hover:bg-zinc-700 w-full"
        >
          <UserPen size={20} /> Profile
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 rounded hover:bg-zinc-700 w-full"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
