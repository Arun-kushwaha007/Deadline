import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, ListTodo, Users, LogOut, UserPen, Group, CircleHelp, CirclePlus, LayoutList, Menu
} from 'lucide-react';
import { useEffect, useState } from 'react';
import logoDark from '../../assets/collabnest_logo_dark.png';
import logoLight from '../../assets/collabnest_logo_light.png';

const menu = [
  { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/tasks', label: 'Tasks', icon: <ListTodo size={20} /> },
  { to: '/team', label: 'Team', icon: <Users size={20} /> },
  { to: '/create_Organization', label: 'Create Organization', icon: <Group size={20} /> },
  { to: '/join_Organization', label: 'Join Organization', icon: <CirclePlus size={20} /> },
  { to: '/todo', label: 'To Do List', icon: <LayoutList size={20} /> },
  { to: '/help', label: 'Help', icon: <CircleHelp size={20} /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

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

    // Theme detection
    setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, [navigate]);

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    navigate('/login');
  };

  return (
    <>
      {/* Hamburger Menu (Mobile Only) */}
      <div className="lg:hidden p-4 bg-white dark:bg-zinc-950 flex justify-between items-center shadow">
        {/* <img
          src={isDark ? logoLight : logoDark}
          alt="CollabNest Logo"
          className="h-10"
        /> */}
        <button
          className="text-black dark:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile */}
      <div
        className={`
          fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-zinc-950 text-black dark:text-white p-5 flex flex-col gap-6 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:flex
        `}
      >
        {/* <img
          src={isDark ? logoLight : logoDark}
          alt="CollabNest"
          className="h-12 object-contain mb-2"
        /> */}

        {user && (
          <div className="text-sm opacity-80 mb-4">
            Welcome, <span className="font-semibold">{user.name}</span> 👋
          </div>
        )}

        <nav className="flex flex-col gap-3">
          {menu.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMobileMenuOpen(false)}
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

        <div className="mt-auto space-y-2">
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-3 p-2 rounded w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <UserPen size={20} /> Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 rounded w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black opacity-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
