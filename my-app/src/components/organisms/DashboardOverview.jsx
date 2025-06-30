import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DashboardOverview = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const organizations = useSelector((state) => state.organization.organizations || []);
  const members = useSelector((state) => state.organization.members || []);

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Filter state
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const orgMatch = selectedOrg
        ? task.organization === selectedOrg
        : true;
      const priorityMatch = selectedPriority
        ? task.priority === selectedPriority
        : true;
      const statusMatch = selectedStatus
        ? task.status === selectedStatus
        : true;

      return orgMatch && priorityMatch && statusMatch;
    });
  }, [tasks, selectedOrg, selectedPriority, selectedStatus]);

  // Pie chart data for status
  const statusData = [
    { name: 'To Do', value: filteredTasks.filter((t) => t.status === 'todo').length },
    { name: 'In Progress', value: filteredTasks.filter((t) => t.status === 'inprogress').length },
    { name: 'Done', value: filteredTasks.filter((t) => t.status === 'done').length },
  ];

  const COLORS = ['#10b981', '#f97316', '#ef4444'];

  // Priority distribution
  const priorityData = [
    { name: 'Low', value: filteredTasks.filter((t) => t.priority === 'low').length },
    { name: 'Medium', value: filteredTasks.filter((t) => t.priority === 'medium').length },
    { name: 'High', value: filteredTasks.filter((t) => t.priority === 'high').length },
  ];

  // Tasks by user
  const tasksByUser = filteredTasks.reduce((acc, task) => {
    const userId = task.assignedTo || 'Unassigned';
    acc[userId] = (acc[userId] || 0) + 1;
    return acc;
  }, {});

  const userData = Object.entries(tasksByUser).map(([userId, count]) => {
    const user = members.find((u) => u._id === userId);
    return {
      name:
        user?.name ||
        (userId === 'Unassigned' ? 'Unassigned' : 'Unknown User'),
      tasks: count,
    };
  });

  // Current user’s own tasks
  const myTasks = filteredTasks.filter(
    (t) => t.assignedTo === loggedInUser?.userId
  );

  return (
    <div className="p-6 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-orange-500 mb-8">
        🏠 Dashboard Overview
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-10">
        <select
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md"
        >
          <option value="">All Organizations</option>
          {organizations.map((org) => (
            <option key={org._id} value={org._id}>
              {org.name}
            </option>
          ))}
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        {/* Pie chart */}
        <div className="bg-zinc-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Tasks by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="bg-zinc-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Tasks by Priority</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tasks by user */}
      <div className="bg-zinc-800 p-4 rounded-lg shadow mb-10">
        <h2 className="text-xl font-bold mb-4">Tasks by User</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Current user’s tasks */}
      <div className="bg-zinc-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Your Tasks</h2>
        {myTasks.length > 0 ? (
          <ul className="space-y-2">
            {myTasks.map((task) => (
              <li
                key={task.id}
                className="bg-zinc-700 p-3 rounded hover:bg-zinc-600 transition"
              >
                <span className="font-bold">{task.title}</span>{' '}
                <span className="text-gray-400 text-sm">
                  ({task.status}) -{' '}
                  <span
                    className={
                      task.priority === 'high'
                        ? 'text-red-400'
                        : task.priority === 'medium'
                        ? 'text-orange-400'
                        : 'text-green-400'
                    }
                  >
                    {task.priority}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No tasks assigned to you.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
