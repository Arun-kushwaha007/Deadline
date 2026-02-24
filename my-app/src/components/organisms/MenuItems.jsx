// components/organisms/MenuItems.jsx
import { NavLink } from 'react-router-dom';
import {
  Home, ListTodo, Users, Group, CirclePlus, LayoutList, CircleHelp
} from 'lucide-react';

const menu = [
  { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/tasks', label: 'All Tasks', icon: <ListTodo size={20} /> },
  { to: '/create_Organization', label: 'Your Organization', icon: <Group size={20} /> },
  { to: '/join_Organization', label: 'Join Organization', icon: <CirclePlus size={20} /> },
  { to: '/todo', label: 'To Do List', icon: <LayoutList size={20} /> },
  { to: '/team', label: 'Team', icon: <Users size={20} /> },
  { to: '/help', label: 'Help', icon: <CircleHelp size={20} /> },
];

const MenuItems = ({ onClick }) => (
  <nav className="flex flex-col gap-1" aria-label="Main menu">
    {menu.map(({ to, label, icon }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 ${
            isActive
              ? 'bg-secondary text-secondary-foreground font-semibold shadow-sm'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
