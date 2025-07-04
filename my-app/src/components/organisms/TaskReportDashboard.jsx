import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  FlagIcon,
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ChartPieIcon,
  SparklesIcon,
  BoltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const TaskReportDashboard = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const users = useSelector((state) => state.organization.members || []);
  const selectedOrganization = useSelector(
    (state) => state.organization.selectedOrganization
  );

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [selectedUserTasks, setSelectedUserTasks] = useState(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  let myRole = 'member';

  if (loggedInUser && selectedOrganization) {
    const myMembership = selectedOrganization.members?.find((member) => {
      const memberId =
        typeof member.userId === 'object'
          ? member.userId.userId
          : member.userId;
      return String(memberId) === String(loggedInUser.userId);
    });

    myRole = myMembership?.role ?? 'member';
  }
  

  const totalTasks = tasks.length;

  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { todo: 0, inprogress: 0, done: 0 }
  );

  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  const completionRate = totalTasks > 0 ? ((statusCounts.done / totalTasks) * 100).toFixed(1) : 0;
  const inProgressRate = totalTasks > 0 ? ((statusCounts.inprogress / totalTasks) * 100).toFixed(1) : 0;

  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'done') return false;
    return new Date(task.dueDate) < new Date();
  });

  const tasksByUser = {};

  for (const task of tasks) {
    let userId = 'unassigned';
    let userName = 'Unassigned';

    if (task.assignedTo) {
      if (typeof task.assignedTo === 'object') {
        userId = task.assignedTo._id || 'unassigned';
        userName = task.assignedTo.name || 'Unknown User';
      } else {
        userId = task.assignedTo;

        const userInfo = users.find((u) => {
          const uId =
            typeof u.userId === 'object'
              ? u.userId._id || u.userId.userId
              : u._id || u.userId;
          return String(uId) === String(userId);
        });

        userName =
          userInfo?.userId?.name ||
          userInfo?.name ||
          'Unknown User';
      }
    }

    if (!tasksByUser[userId]) {
      tasksByUser[userId] = {
        userId,
        userName,
        tasks: [],
        completedTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
        overdueTasks: 0
      };
    }

    tasksByUser[userId].tasks.push(task);
    
    if (task.status === 'done') tasksByUser[userId].completedTasks++;
    else if (task.status === 'inprogress') tasksByUser[userId].inProgressTasks++;
    else if (task.status === 'todo') tasksByUser[userId].todoTasks++;

    if (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done') {
      tasksByUser[userId].overdueTasks++;
    }
  }

  const statusConfig = {
    todo: {
      icon: ClockIcon,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
      gradient: 'from-blue-500 to-indigo-600'
    },
    inprogress: {
      icon: PlayIcon,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      gradient: 'from-yellow-500 to-orange-600'
    },
    done: {
      icon: CheckCircleIcon,
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      gradient: 'from-green-500 to-emerald-600'
    }
  };

  const priorityConfig = {
    low: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
    high: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' }
  };

  // Get array of users for carousel navigation
  const userArray = Object.values(tasksByUser);
  const usersPerPage = 6; // Show more users per page
  const totalPages = Math.ceil(userArray.length / usersPerPage);

  const nextUsers = () => {
    setCurrentUserIndex((prev) => (prev + 1) % totalPages);
  };

  const prevUsers = () => {
    setCurrentUserIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentUsers = () => {
    const start = currentUserIndex * usersPerPage;
    return userArray.slice(start, start + usersPerPage);
  };

  // Task carousel navigation
  const nextTask = () => {
    if (selectedUserTasks) {
      setCurrentTaskIndex((prev) => (prev + 1) % selectedUserTasks.tasks.length);
    }
  };

  const prevTask = () => {
    if (selectedUserTasks) {
      setCurrentTaskIndex((prev) => (prev - 1 + selectedUserTasks.tasks.length) % selectedUserTasks.tasks.length);
    }
  };

  const openTaskCarousel = (userTasks) => {
    setSelectedUserTasks(userTasks);
    setCurrentTaskIndex(0);
  };

  const closeTaskCarousel = () => {
    setSelectedUserTasks(null);
    setCurrentTaskIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
          <ChartBarIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Analytics & Reports
          </h1>
          <p className="text-gray-400">Comprehensive task insights and team performance</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold text-white mt-1">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ChartPieIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Completion Rate</p>
              <p className="text-3xl font-bold text-green-400 mt-1">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-yellow-400 mt-1">{inProgressRate}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <BoltIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Overdue Tasks</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{overdueTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Status and Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Tasks by Status</h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              const percentage = totalTasks > 0 ? ((count / totalTasks) * 100).toFixed(1) : 0;
              
              return (
                <div key={status} className={`${config.bg} border ${config.border} rounded-lg p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <span className="text-white font-medium capitalize">
                        {status === 'inprogress' ? 'In Progress' : status === 'todo' ? 'To Do' : status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold text-lg">{count}</span>
                      <span className={`text-sm ml-2 ${config.color}`}>({percentage}%)</span>
                    </div>
                  </div>
                  <div className="mt-3 bg-gray-700/50 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${config.gradient} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <FlagIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Tasks by Priority</h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries(priorityCounts).map(([priority, count]) => {
              const config = priorityConfig[priority];
              const percentage = totalTasks > 0 ? ((count / totalTasks) * 100).toFixed(1) : 0;
              const icons = { low: '🟢', medium: '🟡', high: '🔴' };
              
              return (
                <div key={priority} className={`${config.bg} border ${config.border} rounded-lg p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{icons[priority]}</span>
                      <span className="text-white font-medium capitalize">{priority} Priority</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold text-lg">{count}</span>
                      <span className={`text-sm ml-2 ${config.color}`}>({percentage}%)</span>
                    </div>
                  </div>
                  <div className="mt-3 bg-gray-700/50 rounded-full h-2">
                    <div 
                      className={`${config.bg.replace('/20', '')} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Task Distribution with Carousel - Only for admins/coordinators */}
       {(myRole === 'admin' || myRole === 'coordinator') && userArray.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Team Performance Overview</h2>
                      <p className="text-gray-400 text-sm">
                        Showing {getCurrentUsers().length} of {userArray.length} team members
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced Carousel Navigation */}
                  <div className="flex items-center gap-4">
                    {/* Show All Users Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 text-sm">Users per page:</span>
                      <select
                        value={usersPerPage}
                        onChange={(e) => {
                          const newUsersPerPage = parseInt(e.target.value);
                          // You might want to add this as state if you want it to be dynamic
                        }}
                        className="bg-gray-700/50 border border-gray-600/50 text-white text-sm px-2 py-1 rounded"
                      >
                        <option value={3}>3</option>
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                        <option value={userArray.length}>All ({userArray.length})</option>
                      </select>
                    </div>
      
                    {/* Navigation Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={prevUsers}
                          disabled={currentUserIndex === 0}
                          className="p-2 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          <ChevronLeftIcon className="w-4 h-4 text-white" />
                        </button>
                        
                        {/* Page Indicators */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentUserIndex(i)}
                              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                                i === currentUserIndex
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={nextUsers}
                          disabled={currentUserIndex === totalPages - 1}
                          className="p-2 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          <ChevronRightIcon className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
      
                {/* Users Grid with Better Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentUsers().map(({ userId, userName, tasks, completedTasks, inProgressTasks, todoTasks, overdueTasks }) => {
                    const userCompletionRate = tasks.length > 0 ? ((completedTasks / tasks.length) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={userId} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:bg-gray-700/50 transition-all duration-200">
                        {/* User Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-white truncate">{userName}</h3>
                            <p className="text-gray-400 text-sm">{tasks.length} total tasks</p>
                          </div>
                          {/* Performance Indicator */}
                          <div className={`w-3 h-3 rounded-full ${
                            userCompletionRate >= 80 ? 'bg-green-400' :
                            userCompletionRate >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                          }`} title={`${userCompletionRate}% completion rate`}></div>
                        </div>
      
                        {/* User Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center">
                            <p className="text-green-400 font-bold text-lg">{completedTasks}</p>
                            <p className="text-gray-300 text-xs">Completed</p>
                          </div>
                          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-center">
                            <p className="text-yellow-400 font-bold text-lg">{inProgressTasks}</p>
                            <p className="text-gray-300 text-xs">In Progress</p>
                          </div>
                          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center">
                            <p className="text-blue-400 font-bold text-lg">{todoTasks}</p>
                            <p className="text-gray-300 text-xs">To Do</p>
                          </div>
                          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-center">
                            <p className="text-red-400 font-bold text-lg">{overdueTasks}</p>
                            <p className="text-gray-300 text-xs">Overdue</p>
                          </div>
                        </div>
      
                        {/* Completion Rate with Better Visual */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300 text-sm">Completion Rate</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${
                                userCompletionRate >= 80 ? 'text-green-400' :
                                userCompletionRate >= 50 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {userCompletionRate}%
                              </span>
                              {userCompletionRate >= 80 && <span className="text-green-400">🏆</span>}
                              {userCompletionRate >= 50 && userCompletionRate < 80 && <span className="text-yellow-400">⚡</span>}
                              {userCompletionRate < 50 && overdueTasks > 0 && <span className="text-red-400">⚠️</span>}
                            </div>
                          </div>
                          <div className="bg-gray-700/50 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${
                                userCompletionRate >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                userCompletionRate >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                                'bg-gradient-to-r from-red-500 to-red-600'
                              }`}
                              style={{ width: `${userCompletionRate}%` }}
                            ></div>
                          </div>
                        </div>
      
                        {/* View All Tasks Button */}
                        <button
                          onClick={() => openTaskCarousel({ userId, userName, tasks, completedTasks, inProgressTasks, todoTasks, overdueTasks })}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <EyeIcon className="w-4 h-4" />
                          View All Tasks ({tasks.length})
                        </button>
                      </div>
                    );
                  })}
                </div>
      
                {/* Summary Stats */}
                {totalPages > 1 && (
                  <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-white">{userArray.length}</p>
                        <p className="text-gray-400 text-sm">Total Users</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-400">
                          {userArray.filter(u => u.tasks.length > 0 ? ((u.completedTasks / u.tasks.length) * 100) >= 80 : false).length}
                        </p>
                        <p className="text-gray-400 text-sm">High Performers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-yellow-400">
                          {userArray.reduce((sum, u) => sum + u.inProgressTasks, 0)}
                        </p>
                        <p className="text-gray-400 text-sm">Tasks In Progress</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-400">
                          {userArray.reduce((sum, u) => sum + u.overdueTasks, 0)}
                        </p>
                        <p className="text-gray-400 text-sm">Total Overdue</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

      {/* Task Carousel Modal */}
      {selectedUserTasks && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedUserTasks.userName}'s Tasks
                    </h2>
                    <p className="text-indigo-100 text-sm">
                      {selectedUserTasks.tasks.length} total tasks
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeTaskCarousel}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <span className="text-white text-xl">×</span>
                </button>
              </div>
            </div>

            {/* Task Carousel */}
            <div className="p-6">
              {selectedUserTasks.tasks.length > 0 ? (
                <div className="space-y-4">
                  {/* Carousel Navigation */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Task {currentTaskIndex + 1} of {selectedUserTasks.tasks.length}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevTask}
                        className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                      >
                        <ChevronLeftIcon className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={nextTask}
                        className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                      >
                        <ChevronRightIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Current Task */}
                  {selectedUserTasks.tasks[currentTaskIndex] && (
                    <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-bold text-white">
                          {selectedUserTasks.tasks[currentTaskIndex].title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig[selectedUserTasks.tasks[currentTaskIndex].priority]?.bg} ${priorityConfig[selectedUserTasks.tasks[currentTaskIndex].priority]?.color}`}>
                            {selectedUserTasks.tasks[currentTaskIndex].priority} priority
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusConfig[selectedUserTasks.tasks[currentTaskIndex].status]?.bg} ${statusConfig[selectedUserTasks.tasks[currentTaskIndex].status]?.color}`}>
                            {selectedUserTasks.tasks[currentTaskIndex].status === 'inprogress' ? 'In Progress' : selectedUserTasks.tasks[currentTaskIndex].status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4">
                        {selectedUserTasks.tasks[currentTaskIndex].description || 'No description provided'}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            Due: {selectedUserTasks.tasks[currentTaskIndex].dueDate ? 
                              new Date(selectedUserTasks.tasks[currentTaskIndex].dueDate).toLocaleDateString() : 
                              'No due date'
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <SparklesIcon className="w-4 h-4" />
                          <span>
                            Created: {selectedUserTasks.tasks[currentTaskIndex].createdAt ? 
                              new Date(selectedUserTasks.tasks[currentTaskIndex].createdAt).toLocaleDateString() : 
                              'Unknown'
                            }
                          </span>
                        </div>
                      </div>

                      {/* Labels */}
                      {selectedUserTasks.tasks[currentTaskIndex].labels && selectedUserTasks.tasks[currentTaskIndex].labels.length > 0 && (
                        <div className="mt-4">
                          <p className="text-gray-400 text-sm mb-2">Labels:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedUserTasks.tasks[currentTaskIndex].labels.map((label, idx) => (
                              <span
                                key={idx}
                                className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 px-2 py-1 rounded-full text-xs text-indigo-300"
                              >
                                #{label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Task Grid Preview */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-white mb-3">All Tasks Overview</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-40 overflow-y-auto">
                      {selectedUserTasks.tasks.map((task, index) => (
                        <button
                          key={task.id}
                          onClick={() => setCurrentTaskIndex(index)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            index === currentTaskIndex
                              ? 'bg-indigo-500/20 border-indigo-500/50'
                              : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-600/30'
                          }`}
                        >
                          <h5 className="font-medium text-white text-sm truncate">
                            {task.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${
                              task.status === 'done' ? 'bg-green-400' :
                              task.status === 'inprogress' ? 'bg-yellow-400' : 'bg-blue-400'
                            }`}></span>
                            <span className="text-xs text-gray-400 capitalize">
                              {task.status === 'inprogress' ? 'In Progress' : task.status}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No tasks found for this user.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskReportDashboard;