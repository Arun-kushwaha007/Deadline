// components/organisms/DashboardLayout.jsx
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import SkipNavLink from '../common/SkipNavLink';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <SkipNavLink />
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main
          id="main-content"
          className="flex-1 p-1 md:overflow-auto bg-muted transition-colors duration-300"
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
