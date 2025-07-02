import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchUsers } from '../../redux/slices/tasksSlice';
import {
  fetchOrganizationDetails,
  fetchOrganizationMembers,
} from '../../redux/organizationSlice';

const DashboardOverview = () => {
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.tasks.tasks);
  const organizations = useSelector(
    (state) => state.organization.organizations || []
  );

  const {
    selectedOrganization,
    organizationMembers,
    detailsLoading,
  } = useSelector((state) => state.organization);

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Global Filters
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');

  // User Analysis Filters
  const [selectedOrg, setSelectedOrg] = useState('');
  const [analysisPriority, setAnalysisPriority] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [analysisUserId, setAnalysisUserId] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedOrg) {
      const hasOrgDetails =
        selectedOrganization && selectedOrganization._id === selectedOrg;
      const hasMembersCache =
        organizationMembers[selectedOrg]?.status === 'succeeded';
      if (!hasOrgDetails || !hasMembersCache) {
        dispatch(fetchOrganizationDetails(selectedOrg));
      }
    }
  }, [selectedOrg, dispatch, selectedOrganization, organizationMembers]);

  useEffect(() => {
    if (selectedUser !== 'all') {
      setSelectedPriority('');
      setSelectedStatus('');
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedOrg) {
      setAnalysisUserId('');
    }
  }, [selectedOrg]);

  // ✅ All available users from all org caches
  const allUsers = useMemo(() => {
    const allMembers = [];
    Object.values(organizationMembers).forEach((org) => {
      if (org?.members?.length) {
        org.members.forEach((m) => {
          if (m.userId && m.userId._id) {
            allMembers.push({
              _id: m.userId._id,
              name: m.userId.name,
              email: m.userId.email,
            });
          }
        });
      }
    });
    return allMembers;
  }, [organizationMembers]);

  const users = allUsers;
  const members = allUsers;

  // ✅ Generate orgMembers list for dropdown
  const orgMembers = useMemo(() => {
    if (!selectedOrg) return members;

    let organizationMembersList = [];
    const cachedMembers = organizationMembers[selectedOrg];

    if (cachedMembers?.status === 'succeeded') {
      organizationMembersList = cachedMembers.members
        .filter((m) => m.userId && m.userId._id)
        .map((m) => ({
          _id: m.userId._id,
          name: m.userId.name,
          email: m.userId.email,
        }));
    } else if (
      selectedOrganization &&
      selectedOrganization._id === selectedOrg
    ) {
      organizationMembersList = selectedOrganization.members
        .filter((m) => m.userId && m.userId._id)
        .map((m) => ({
          _id: m.userId._id,
          name: m.userId.name,
          email: m.userId.email,
        }));
    }
    return organizationMembersList;
  }, [members, selectedOrg, selectedOrganization, organizationMembers]);

  const globalFilteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const priorityMatch = selectedPriority
        ? task.priority === selectedPriority
        : true;
      const statusMatch = selectedStatus
        ? task.status === selectedStatus
        : true;
      const userMatch =
        selectedUser !== 'all' ? task.assignedTo === selectedUser : true;
      return priorityMatch && statusMatch && userMatch;
    });
  }, [tasks, selectedPriority, selectedStatus, selectedUser]);

  const orgFilteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const orgMatch = selectedOrg
        ? task.organization === selectedOrg
        : true;
      const priorityMatch = analysisPriority
        ? task.priority === analysisPriority
        : true;
      const statusMatch = analysisStatus
        ? task.status === analysisStatus
        : true;
      const userMatch = analysisUserId
        ? task.assignedTo === analysisUserId
        : true;
      return orgMatch && priorityMatch && statusMatch && userMatch;
    });
  }, [
    tasks,
    selectedOrg,
    analysisPriority,
    analysisStatus,
    analysisUserId,
  ]);

  const tasksByUser = useMemo(() => {
    const counts = {};
    globalFilteredTasks.forEach((task) => {
      const uid = task.assignedTo || 'Unassigned';
      counts[uid] = (counts[uid] || 0) + 1;
    });
    return Object.entries(counts).map(([uid, count]) => {
      const user = members.find((u) => u._id === uid);
      return {
        name:
          user?.name ||
          (uid === 'Unassigned' ? 'Unassigned' : 'Unknown'),
        tasks: count,
      };
    });
  }, [globalFilteredTasks, members]);

  const statusData = [
    {
      name: 'To Do',
      value: globalFilteredTasks.filter((t) => t.status === 'todo').length,
    },
    {
      name: 'In Progress',
      value: globalFilteredTasks.filter((t) => t.status === 'inprogress').length,
    },
    {
      name: 'Done',
      value: globalFilteredTasks.filter((t) => t.status === 'done').length,
    },
  ];

  const COLORS = ['#10b981', '#f97316', '#ef4444'];

  const priorityData = [
    {
      name: 'Low',
      value: globalFilteredTasks.filter((t) => t.priority === 'low').length,
    },
    {
      name: 'Medium',
      value: globalFilteredTasks.filter((t) => t.priority === 'medium').length,
    },
    {
      name: 'High',
      value: globalFilteredTasks.filter((t) => t.priority === 'high').length,
    },
  ];

  const tasksByUserAnalysis = orgFilteredTasks.reduce(
    (acc, task) => {
      const userId = task.assignedTo || 'Unassigned';
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push(task);
      return acc;
    },
    {}
  );

  const userAnalysis = Object.entries(tasksByUserAnalysis).map(
    ([userId, userTasks]) => {
      const userInfo = users.find((u) => u._id === userId);
      const name =
        userInfo?.name ||
        (userId === 'Unassigned' ? 'Unassigned' : 'All User');
      const statusBreakdown = [
        { name: 'To Do', value: userTasks.filter((t) => t.status === 'todo').length },
        { name: 'In Progress', value: userTasks.filter((t) => t.status === 'inprogress').length },
        { name: 'Done', value: userTasks.filter((t) => t.status === 'done').length },
      ];
      const priorityBreakdown = [
        { name: 'Low', value: userTasks.filter((t) => t.priority === 'low').length },
        { name: 'Medium', value: userTasks.filter((t) => t.priority === 'medium').length },
        { name: 'High', value: userTasks.filter((t) => t.priority === 'high').length },
      ];
      return {
        userId,
        name,
        totalTasks: userTasks.length,
        statusBreakdown,
        priorityBreakdown,
        userTasks,
      };
    }
  );

  return (
    <div className="p-6 min-h-screen text-white">
      <h2 className="text-2xl font-bold text-orange-400 mb-6">
        🏠 Organization Analysis
      </h2>

      {/* Global Filters */}
      <div className="flex flex-wrap gap-4 mb-10">
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

      {/* Global Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
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
          <div className="flex flex-wrap mt-4 gap-4">
            {statusData.map((s, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

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

      {/* User Analysis */}
      <h2 className="text-2xl font-bold text-orange-400 mb-6">
        👥 User Analysis
      </h2>

      {/* User Analysis Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
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
          value={analysisPriority}
          onChange={(e) => setAnalysisPriority(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={analysisStatus}
          onChange={(e) => setAnalysisStatus(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          value={analysisUserId}
          onChange={(e) => setAnalysisUserId(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md"
          disabled={!selectedOrg}
        >
          <option value="">All Users</option>
          {orgMembers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
          <option value="Unassigned">Unassigned</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-8">
        {userAnalysis.map((user) => (
          <div key={user.userId} className="bg-zinc-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">{user.name}</h3>
            <p className="mb-2 text-gray-300">Total Tasks: {user.totalTasks}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">By Status</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={user.statusBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      label
                    >
                      {user.statusBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-status-${index}`}
                          fill={COLORS[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">By Priority</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={user.priorityBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="name" stroke="#fff" fontSize={10} />
                    <YAxis stroke="#fff" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
