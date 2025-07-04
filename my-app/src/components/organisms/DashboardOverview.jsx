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

  // All available users from all org caches
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

  // Generate orgMembers list for dropdown
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

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];
  const PRIORITY_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

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
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            📊 Organization Analytics
          </h2>
          <p className="text-blue-100">
            Comprehensive insights into your organization's performance and productivity
          </p>
        </div>
      </div>

      {/* Global Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🔍</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Global Filters
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority Level
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Priorities</option>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Statuses</option>
              <option value="todo">📝 To Do</option>
              <option value="inprogress">⚡ In Progress</option>
              <option value="done">✅ Done</option>
            </select>
          </div>
        </div>
      </div>

      {/* Global Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">📈</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Tasks by Status
            </h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusData.map((s, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm font-medium">{s.name}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">({s.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Tasks by Priority
            </h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Analysis Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            User Performance Analysis
          </h3>
        </div>

        {/* User Analysis Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization
            </label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">🏢 All Organizations</option>
              {organizations.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={analysisPriority}
              onChange={(e) => setAnalysisPriority(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">All Priorities</option>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={analysisStatus}
              onChange={(e) => setAnalysisStatus(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">All Statuses</option>
              <option value="todo">📝 To Do</option>
              <option value="inprogress">⚡ In Progress</option>
              <option value="done">✅ Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team Member
            </label>
            <select
              value={analysisUserId}
              onChange={(e) => setAnalysisUserId(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
              disabled={!selectedOrg}
            >
              <option value="">👤 All Users</option>
              {orgMembers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
              <option value="Unassigned">❓ Unassigned</option>
            </select>
          </div>
        </div>

        {/* User Analysis Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {userAnalysis.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No Data Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Apply filters to see user performance analysis
              </p>
            </div>
          ) : (
            userAnalysis.map((user) => (
              <div key={user.userId} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white">{user.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📋 {user.totalTasks} total tasks
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Status Breakdown */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      📊 Status Distribution
                    </h5>
                    <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie
                          data={user.statusBreakdown}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={40}
                          label={false}
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

                  {/* Priority Breakdown */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      🎯 Priority Distribution
                    </h5>
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={user.priorityBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#6b7280" 
                          fontSize={10}
                          tick={{ fill: '#6b7280' }}
                        />
                        <YAxis stroke="#6b7280" fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;