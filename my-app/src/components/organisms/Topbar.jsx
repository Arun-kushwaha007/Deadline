// components/organisms/Topbar.jsx
import { useContext } from 'react';
import { ThemeContext } from '../../utils/theme';
import { Moon, Sun } from 'lucide-react';

const Topbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div className="flex justify-between items-center h-16 px-6 bg-zinc-800 text-white">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="bg-zinc-700 p-2 rounded"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};

export default Topbar;
