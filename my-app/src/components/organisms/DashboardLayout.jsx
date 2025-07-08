// components/organisms/DashboardLayout.jsx
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-white text-black dark:bg-zinc-950 dark:text-white transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 p-6 md:overflow-auto bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
