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
  const users = useSelector((state) => state.tasks.users || []);
  const usersStatus = useSelector((state) => state.tasks.usersStatus);

  const organizations = useSelector(
    (state) => state.organization.organizations || []
  );

  const {
    selectedOrganization,
    organizationMembers,
    detailsLoading,
  } = useSelector((state) => state.organization);

  const members = useSelector((state) => state.tasks.users || []);

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Filters
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');

  // Fetch users if not already loaded
  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, usersStatus]);

  // Fetch organization details and members when selectedOrg changes
  useEffect(() => {
    if (selectedOrg) {
      const hasOrgDetails =
        selectedOrganization && selectedOrganization._id === selectedOrg;
      const hasMembersCache =
        organizationMembers[selectedOrg]?.status === 'succeeded';

      if (!hasOrgDetails) {
        dispatch(fetchOrganizationDetails(selectedOrg));
      }

      if (!hasMembersCache) {
        dispatch(fetchOrganizationMembers(selectedOrg));
      }
    }
  }, [
    selectedOrg,
    dispatch,
    selectedOrganization,
    organizationMembers,
  ]);

  // Reset filters when user selection changes
  useEffect(() => {
    if (selectedUser !== 'all') {
      setSelectedPriority('');
      setSelectedStatus('');
    }
  }, [selectedUser]);

  // Reset selectedUserId when organization changes
  useEffect(() => {
    if (selectedOrg) {
      setSelectedUserId('');
    }
  }, [selectedOrg]);

  // Get users only from selected org
  const orgMembers = useMemo(() => {
    if (!selectedOrg) return members;

    let organizationMembersList = [];
    const cachedMembers = organizationMembers[selectedOrg];

    if (cachedMembers?.status === 'succeeded') {
      organizationMembersList = cachedMembers.members
        .map((member) => member.userId)
        .filter((user) => user && user._id);
    } else if (
      selectedOrganization &&
      selectedOrganization._id === selectedOrg
    ) {
      organizationMembersList = selectedOrganization.members
        .map((member) => member.userId)
        .filter((user) => user && user._id);
    }

    return organizationMembersList;
  }, [members, selectedOrg, selectedOrganization, organizationMembers]);

  // ---- CHANGES HERE ----

  // This drives global charts (NOT filtered by org)
  const globalFilteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const priorityMatch = selectedPriority
        ? task.priority === selectedPriority
        : true;
      const statusMatch = selectedStatus
        ? task.status === selectedStatus
        : true;
      const userMatch = selectedUserId
        ? task.assignedTo === selectedUserId
        : true;
      return priorityMatch && statusMatch && userMatch;
    });
  }, [tasks, selectedPriority, selectedStatus, selectedUserId]);

  // This drives User Analysis (filtered by org)
  const orgFilteredTasks = useMemo(() => {
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
      const userMatch = selectedUserId
        ? task.assignedTo === selectedUserId
        : true;
      return orgMatch && priorityMatch && statusMatch && userMatch;
    });
  }, [tasks, selectedOrg, selectedPriority, selectedStatus, selectedUserId]);

  // Global filtered tasks for charts
  const filteredUserTasks = useMemo(() => {
    if (selectedUser === 'all') return globalFilteredTasks;
    return globalFilteredTasks.filter(
      (task) => task.assignedTo === selectedUser
    );
  }, [globalFilteredTasks, selectedUser]);

  // Charts Data
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
      value: filteredUserTasks.filter(
        (t) => t.status === 'todo'
      ).length,
    },
    {
      name: 'In Progress',
      value: filteredUserTasks.filter(
        (t) => t.status === 'inprogress'
      ).length,
    },
    {
      name: 'Done',
      value: filteredUserTasks.filter(
        (t) => t.status === 'done'
      ).length,
    },
  ];

  const COLORS = ['#10b981', '#f97316', '#ef4444'];

  const priorityData = [
    {
      name: 'Low',
      value: filteredUserTasks.filter(
        (t) => t.priority === 'low'
      ).length,
    },
    {
      name: 'Medium',
      value: filteredUserTasks.filter(
        (t) => t.priority === 'medium'
      ).length,
    },
    {
      name: 'High',
      value: filteredUserTasks.filter(
        (t) => t.priority === 'high'
      ).length,
    },
  ];

  // User Analysis from orgFilteredTasks
  const tasksByUserAnalysis = orgFilteredTasks.reduce(
    (acc, task) => {
      const userId = task.assignedTo || 'Unassigned';
      if (!acc[userId]) {
        acc[userId] = [];
      }
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
        (userId === 'Unassigned' ? 'Unassigned' : 'Unknown User');

      const statusBreakdown = [
        {
          name: 'To Do',
          value: userTasks.filter(
            (t) => t.status === 'todo'
          ).length,
        },
        {
          name: 'In Progress',
          value: userTasks.filter(
            (t) => t.status === 'inprogress'
          ).length,
        },
        {
          name: 'Done',
          value: userTasks.filter(
            (t) => t.status === 'done'
          ).length,
        },
      ];

      const priorityBreakdown = [
        {
          name: 'Low',
          value: userTasks.filter(
            (t) => t.priority === 'low'
          ).length,
        },
        {
          name: 'Medium',
          value: userTasks.filter(
            (t) => t.priority === 'medium'
          ).length,
        },
        {
          name: 'High',
          value: userTasks.filter(
            (t) => t.priority === 'high'
          ).length,
        },
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

  const displayTasks =
    selectedUser === 'all'
      ? globalFilteredTasks.filter(
          (t) => t.assignedTo === loggedInUser?.userId
        )
      : filteredUserTasks;

  const membersLoading =
    selectedOrg &&
    (organizationMembers[selectedOrg]?.status === 'loading' ||
      (detailsLoading &&
        (!selectedOrganization ||
          selectedOrganization._id !== selectedOrg)));

  return (
    <div className="p-6 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-orange-500 mb-8">
        🏠 Dashboard Overview
      </h1>

      {/* Filters */}
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
          <h2 className="text-xl font-bold mb-4">
            {selectedUser === 'all'
              ? 'All Tasks by Status'
              : `${orgMembers.find((u) => u._id === selectedUser)?.name || 'Selected User'
                }'s Tasks by Status`}
          </h2>
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">
            {selectedUser === 'all'
              ? 'All Tasks by Priority'
              : `${orgMembers.find((u) => u._id === selectedUser)?.name || 'Selected User'
                }'s Tasks by Priority`}
          </h2>
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
      <div className="mb-6">
        <select
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white p-2 mr-2 rounded-md"
        >
          <option value="">All Organizations</option>
          {organizations.map((org) => (
            <option key={org._id} value={org._id}>
              {org.name}
            </option>
          ))}
        </select>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md"
          disabled={!selectedOrg || membersLoading}
        >
          <option value="">
            {!selectedOrg
              ? 'All Users (Select organization to filter)'
              : membersLoading
                ? 'Loading members...'
                : `All Users (${orgMembers.length} members)`
            }
          </option>
          {selectedOrg &&
            !membersLoading &&
            orgMembers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          {!selectedOrg &&
            users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          <option value="Unassigned">Unassigned</option>
        </select>
        {selectedOrg && membersLoading && (
          <p className="text-blue-400 text-sm mt-1">
            Loading organization members...
          </p>
        )}
        {selectedOrg &&
          !membersLoading &&
          orgMembers.length === 0 && (
            <p className="text-yellow-400 text-sm mt-1">
              No members found in this organization.
            </p>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {userAnalysis
          .filter((user) => {
            if (!selectedUserId) return true;
            return user.userId === selectedUserId;
          })
          .map((user) => (
            <div
              key={user.userId}
              className="bg-zinc-800 p-4 rounded-lg shadow"
            >
              <h3 className="text-lg font-bold mb-2">{user.name}</h3>
              <p className="mb-2 text-gray-300">
                Total Tasks: {user.totalTasks}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    By Status
                  </h4>
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
                  <h4 className="text-sm font-semibold mb-2">
                    By Priority
                  </h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={user.priorityBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                      <XAxis
                        dataKey="name"
                        stroke="#fff"
                        fontSize={10}
                      />
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

      {/* Task Report */}
      <div className="bg-zinc-800 p-4 rounded-lg shadow mt-10">
        <h2 className="text-xl font-bold mb-4 text-orange-400">
          📝{' '}
          {selectedUser === 'all'
            ? 'Your Report'
            : `${orgMembers.find((u) => u._id === selectedUser)?.name || 'Selected User'
              }'s Tasks`}
        </h2>
        {displayTasks.length > 0 ? (
          <ul className="space-y-2">
            {displayTasks.map((task) => (
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
          <p className="text-gray-400">
            {selectedUser === 'all'
              ? 'No tasks assigned to you.'
              : `No tasks assigned to ${orgMembers.find((u) => u._id === selectedUser)?.name || 'this user'
              }.`}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
