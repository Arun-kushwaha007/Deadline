// components/organisms/DashboardLayout.jsx
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-white text-black dark:bg-zinc-950 dark:text-white transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-0">
        <Topbar />
        <main className="p-3 sm:p-6 flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-zinc-900 transition-colors duration-300 
                       scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 
                       touch-pan-y overscroll-y-contain">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}