// components/organisms/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { Home, ListTodo, Users, LogOut } from 'lucide-react';

const menu = [
  { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/tasks', label: 'Tasks', icon: <ListTodo size={20} /> },
  { to: '/team', label: 'Team', icon: <Users size={20} /> },
];

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-zinc-900 text-white p-5 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">TaskFlow AI</h1>
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
        <button className="flex items-center gap-3 p-2 rounded hover:bg-zinc-700 w-full">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
