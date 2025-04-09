// pages/Dashboard.jsx
import DashboardLayout from '../components/organisms/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">Welcome to TaskFlow AI</h1>
      <p className="text-zinc-400 mt-2">This is your control center.</p>
    </DashboardLayout>
  );
};

export default Dashboard;
