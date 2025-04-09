// pages/Dashboard.jsx
import DashboardLayout from '../components/organisms/DashboardLayout';
import KanbanBoard from '../components/organisms/KanbanBoard';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl mb-3 font-bold">Welcome to TaskFlow AI- Deadline</h1>
       <h2 className="text-2xl font-bold mb-6">📋 Kanban Board</h2>
            <KanbanBoard />
      <p className="text-zinc-400 mt-2">This is your control center.</p>
    </DashboardLayout>
  );
};

export default Dashboard;
