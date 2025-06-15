// components/organisms/MenuItems.jsx
import { NavLink } from 'react-router-dom';
import {
  Home, ListTodo, Users, Group, CirclePlus, LayoutList, CircleHelp
} from 'lucide-react';

const menu = [
  { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/tasks', label: 'Tasks', icon: <ListTodo size={20} /> },
  { to: '/create_Organization', label: 'Create Organization', icon: <Group size={20} /> },
  { to: '/join_Organization', label: 'Join Organization', icon: <CirclePlus size={20} /> },
  { to: '/todo', label: 'To Do List', icon: <LayoutList size={20} /> },
  { to: '/team', label: 'Team', icon: <Users size={20} /> },
  { to: '/help', label: 'Help', icon: <CircleHelp size={20} /> },
];

const MenuItems = ({ onClick }) => (
  <nav className="flex flex-col gap-3">
    {menu.map(({ to, label, icon }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-2 rounded transition ${
            isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`
        }
      >
        {icon}
        {label}
      </NavLink>
    ))}
  </nav>
);

export default MenuItems;
