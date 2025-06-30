// pages/Dashboard.jsx
import DashboardLayout from '../components/organisms/DashboardLayout';
import KanbanBoard from '../components/organisms/KanbanBoard';
import AssistantPanel from '../components/organisms/AIAssistantPanel';
// import OrganizationBoard from '../components/organisms/OrganizationBoard';
import OrganizationDashboard from '../components/Organization/OrganiationDashboard';
import AIAssistantWrapper from '../components/organisms/AIAssistantWrapper';
import TaskReportDashboard from '../components/organisms/TaskReportDashboard';
const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="transition-colors duration-300">
        <h1 className="text-3xl mb-3 font-bold text-black dark:text-white">
          Welcome to CollabNest - Deadline
        </h1>
        {/* <OrganizationBoard /> */}
        <OrganizationDashboard />
        <KanbanBoard />
        {/* <AssistantPanel /> */}
        {/* <TaskReportDashboard /> */}
        <AIAssistantWrapper />
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          This is your control center.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
