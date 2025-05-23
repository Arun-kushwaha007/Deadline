import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, ListTodo, Users, LogOut, UserPen, Group, CircleHelp, CirclePlus, LayoutList
} from 'lucide-react';
import { useEffect, useState } from 'react';
import logoDark from '../../assets/collabnest_logo_dark.png'; 
import logoLight from '../../assets/collabnest_logo_light.png'; // Adjust the path as necessary
const menu = [
  { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/tasks', label: 'Tasks', icon: <ListTodo size={20} /> },
  { to: '/team', label: 'Team', icon: <Users size={20} /> },
  { to: '/create_Organization', label: 'Create Organization', icon: <Group size={20} /> },
  { to: '/join_Organization', label: 'Join Organization', icon: <CirclePlus size={20} /> },
  { to: '/help', label: 'Help', icon: <CircleHelp size={20} /> },
  { to: '/todo', label: 'To Do List', icon: <LayoutList size={20} /> },
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
    <div className="w-64 h-screen p-5 flex flex-col gap-6" style={{
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      {/* <h1 className="text-2xl font-bold">TaskFlow AI</h1> */}
   
    <img
  src={logoDark}
  alt="CollabNest"
  className="h-22  w-42 mt-[-55px]  ml-8 object-contain bg-slate-600  rounded-4xl shadow-lg"
  style={{ objectPosition: 'bottom center' }}
/>
      {user && (
        <div className="text-sm opacity-80 mb-4">
          Welcome, <span className="font-semibold">{user.name}</span>
        </div>
      )}

      <nav className="flex flex-col gap-3">
        {menu.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded transition ${
                isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
            style={{ color: 'inherit' }}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-3 p-2 rounded w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          style={{ color: 'inherit' }}
        >
          <UserPen size={20} /> Profile
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 rounded w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          style={{ color: 'inherit' }}
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
