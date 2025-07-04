import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  CalendarIcon,
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  FlagIcon,
  XMarkIcon,
  CalendarDaysIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import './css/CalendarView.css';

const CalendarView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('dayGridMonth');

  const tasks = useSelector((state) => state.tasks.tasks);
  const organizations = useSelector((state) => state.organization.organizations || []);

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const currentUserId = loggedInUser?.userId;

  // Configuration objects
  const statusConfig = {
    todo: {
      icon: ClockIcon,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
      label: 'To Do'
    },
    inprogress: {
      icon: PlayIcon,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      label: 'In Progress'
    },
    done: {
      icon: CheckCircleIcon,
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      label: 'Completed'
    }
  };

  const priorityConfig = {
    low: { 
      color: '#10b981', 
      textColor: 'text-green-400',
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      emoji: '🟢'
    },
    medium: { 
      color: '#f97316', 
      textColor: 'text-orange-400',
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/30',
      emoji: '🟡'
    },
    high: { 
      color: '#ef4444', 
      textColor: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      emoji: '🔴'
    }
  };

  // Filter tasks for the calendar
  const calendarTasks = tasks.filter(task => {
    if (task.assignedTo === 'everyone' || task.assignedTo === null || task.assignedTo === undefined) {
      return true;
    }
    if (task.assignedTo && typeof task.assignedTo === 'object' && task.assignedTo.userId) {
      return String(task.assignedTo.userId) === String(currentUserId);
    }
    if (typeof task.assignedTo === 'string') {
      return String(task.assignedTo) === String(currentUserId);
    }
    return false;
  });

  // Helper function to get organization name
  const getOrganizationName = (task) => {
    if (!task.organization) return 'Personal';
    
    const orgId = typeof task.organization === 'string' 
      ? task.organization 
      : task.organization._id;
    
    const org = organizations.find(o => o._id === orgId);
    return org ? org.name : (task.organization.name || 'Unknown Organization');
  };

  const events = useMemo(() => {
    return calendarTasks.reduce((acc, task) => {
      if (!task.title) return acc;

      let startDate = null;
      let endDate = null;

      if (task.createdAt) {
        const parsedCreatedAt = new Date(task.createdAt);
        if (!isNaN(parsedCreatedAt)) {
          startDate = parsedCreatedAt;
        }
      }

      if (task.dueDate) {
        const parsedDueDate = new Date(task.dueDate);
        if (!isNaN(parsedDueDate)) {
          parsedDueDate.setDate(parsedDueDate.getDate() + 1);
          endDate = parsedDueDate;
        }
      }

      if (!endDate && startDate) {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      }

      if (startDate) {
        const priorityConf = priorityConfig[task.priority] || priorityConfig.low;
        
        acc.push({
          id: task._id,
          title: `${priorityConf.emoji} ${task.title}`,
          start: startDate.toISOString(),
          end: endDate ? endDate.toISOString() : null,
          allDay: true,
          backgroundColor: priorityConf.color,
          borderColor: priorityConf.color,
          textColor: '#ffffff',
          classNames: ['custom-event'],
          extendedProps: {
            description: task.description,
            priority: task.priority,
            status: task.status,
            labels: task.labels,
            assignedTo: task.assignedTo,
            assignedBy: task.assignedBy,
            organization: task.organization,
            createdAt: task.createdAt,
            dueDate: task.dueDate,
            taskId: task.id || task._id
          },
        });
      }

      return acc;
    }, []);
  }, [calendarTasks]);

  const handleEventClick = (info) => {
    setSelectedTask({
      title: info.event.title.replace(/^[🟢🟡🔴]\s/, ''), // Remove emoji from title
      priority: info.event.extendedProps.priority,
      status: info.event.extendedProps.status,
      description: info.event.extendedProps.description,
      labels: info.event.extendedProps.labels,
      assignedTo: info.event.extendedProps.assignedTo,
      assignedBy: info.event.extendedProps.assignedBy,
      organization: info.event.extendedProps.organization,
      createdAt: info.event.extendedProps.createdAt,
      dueDate: info.event.extendedProps.dueDate,
      taskId: info.event.extendedProps.taskId
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const getTaskStats = () => {
    const stats = {
      total: calendarTasks.length,
      todo: calendarTasks.filter(t => t.status === 'todo').length,
      inprogress: calendarTasks.filter(t => t.status === 'inprogress').length,
      done: calendarTasks.filter(t => t.status === 'done').length,
      overdue: calendarTasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
      ).length
    };
    return stats;
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CalendarIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Task Calendar
                </h1>
                <p className="text-gray-400 text-lg mt-1">
                  Visualize your tasks and deadlines across time
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <SparklesIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">
                    Personal calendar for {loggedInUser?.name || 'User'}
                  </span>
                </div>
              </div>
            </div>

            {/* View Mode Selector */}
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('dayGridMonth')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'dayGridMonth'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('timeGridWeek')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'timeGridWeek'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('timeGridDay')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'timeGridDay'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Day
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-blue-400 text-sm">Total Tasks</div>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.todo}</div>
              <div className="text-gray-300 text-sm">To Do</div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.inprogress}</div>
              <div className="text-gray-300 text-sm">In Progress</div>
            </div>
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.done}</div>
              <div className="text-gray-300 text-sm">Completed</div>
            </div>
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.overdue}</div>
              <div className="text-gray-300 text-sm">Overdue</div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <CalendarDaysIcon className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Calendar View</h2>
            </div>

            {/* Priority Legend */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="text-gray-300 text-sm font-medium">Priority Legend:</span>
              {Object.entries(priorityConfig).map(([priority, config]) => (
                <div key={priority} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: config.color }}
                  ></div>
                  <span className="text-gray-300 text-sm capitalize">
                    {config.emoji} {priority}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Container */}
             <div className="calendar-container bg-white rounded-lg">
                         <FullCalendar
                           key={viewMode}  // Force re-render when viewMode changes
                           plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                           initialView={viewMode}  // Use initialView, not view
                           headerToolbar={{
                             start: 'prev,next today',
                             center: 'title',
                             end: '',
                           }}
                           height="auto"
                           events={events}
                           eventDisplay="block"
                           eventClick={handleEventClick}
                           themeSystem="standard"
                           dayMaxEvents={3}
                           moreLinkClick="popover"
                           eventDidMount={(info) => {
                             info.el.style.cursor = 'pointer';
                             info.el.style.borderRadius = '6px';
                             info.el.style.fontWeight = '500';
                           }}
                         />
                       </div>
          </div>
        </div>

        {/* Enhanced Modal */}
        {modalOpen && selectedTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <FlagIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedTask.title}</h2>
                      <p className="text-purple-100 text-sm">Task Details</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`${priorityConfig[selectedTask.priority]?.bg} border ${priorityConfig[selectedTask.priority]?.border} rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FlagIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm font-medium">Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{priorityConfig[selectedTask.priority]?.emoji}</span>
                      <span className={`font-semibold capitalize ${priorityConfig[selectedTask.priority]?.textColor}`}>
                        {selectedTask.priority} Priority
                      </span>
                    </div>
                  </div>

                  <div className={`${statusConfig[selectedTask.status]?.bg} border ${statusConfig[selectedTask.status]?.border} rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      {React.createElement(statusConfig[selectedTask.status]?.icon, {
                        className: "w-4 h-4 text-gray-400"
                      })}
                      <span className="text-gray-300 text-sm font-medium">Status</span>
                    </div>
                    <span className={`font-semibold ${statusConfig[selectedTask.status]?.color}`}>
                      {statusConfig[selectedTask.status]?.label}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm font-medium">Description</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedTask.description || "No description provided."}
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm font-medium">Created</span>
                    </div>
                    <p className="text-white">
                      {selectedTask.createdAt ? 
                        new Date(selectedTask.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 
                        'Unknown'
                      }
                    </p>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm font-medium">Due Date</span>
                    </div>
                    <p className={`font-medium ${
                      selectedTask.dueDate && new Date(selectedTask.dueDate) < new Date() && selectedTask.status !== 'done'
                        ? 'text-red-400' 
                        : 'text-white'
                    }`}>
                      {selectedTask.dueDate ? 
                        new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 
                        'No due date'
                      }
                    </p>
                  </div>
                </div>

                {/* Organization */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm font-medium">Organization</span>
                  </div>
                  <p className="text-white">{getOrganizationName(selectedTask)}</p>
                </div>

                {/* Assignment */}
                {(selectedTask.assignedTo || selectedTask.assignedBy) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTask.assignedTo && (
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm font-medium">Assigned To</span>
                        </div>
                        <p className="text-white">
                          {typeof selectedTask.assignedTo === 'object' 
                            ? selectedTask.assignedTo.name || 'Unknown User'
                            : selectedTask.assignedTo === 'everyone' 
                              ? 'Everyone' 
                              : selectedTask.assignedTo
                          }
                        </p>
                      </div>
                    )}

                    {selectedTask.assignedBy && (
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm font-medium">Assigned By</span>
                        </div>
                        <p className="text-white">{selectedTask.assignedBy}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Labels */}
                {selectedTask.labels && selectedTask.labels.length > 0 && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TagIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm font-medium">Labels</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.labels.map((label, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-3 py-1 rounded-full text-sm text-purple-300"
                        >
                          #{label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;