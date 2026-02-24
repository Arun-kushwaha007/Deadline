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


  const statusConfig = {
    todo: {
      icon: ClockIcon,
      color: 'text-primary',
      bg: 'bg-primary/20',
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
      bg: 'bg-destructive/20',
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
      title: info.event.title.replace(/^[🟢🟡🔴]\s/, ''), 
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

      <div className="relative p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center shadow-sm">
                <CalendarIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Task Calendar
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Visualize your tasks and deadlines across time
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <SparklesIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    Personal calendar for {loggedInUser?.name || 'User'}
                  </span>
                </div>
              </div>
            </div>

            {/* View Mode Selector */}
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode('dayGridMonth')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'dayGridMonth'
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-muted-foreground hover:bg-slate-700/50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('timeGridWeek')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'timeGridWeek'
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-muted-foreground hover:bg-slate-700/50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('timeGridDay')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'timeGridDay'
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-muted-foreground hover:bg-slate-700/50'
                }`}
              >
                Day
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-muted border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-muted-foreground text-sm">Total Tasks</div>
            </div>
            <div className="bg-muted border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.todo}</div>
              <div className="text-muted-foreground text-sm">To Do</div>
            </div>
            <div className="bg-muted border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.inprogress}</div>
              <div className="text-muted-foreground text-sm">In Progress</div>
            </div>
            <div className="bg-muted border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.done}</div>
              <div className="text-muted-foreground text-sm">Completed</div>
            </div>
            <div className="bg-muted border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
              <div className="text-muted-foreground text-sm">Overdue</div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <CalendarDaysIcon className="w-4 h-4 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Calendar View</h2>
            </div>

            {/* Priority Legend */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="text-muted-foreground text-sm font-medium">Priority Legend:</span>
              {Object.entries(priorityConfig).map(([priority, config]) => (
                <div key={priority} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: config.color }}
                  ></div>
                  <span className="text-muted-foreground text-sm capitalize">
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

   
        {modalOpen && selectedTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div className="bg-muted border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="bg-muted border-b border-border p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center">
                      <FlagIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{selectedTask.title}</h2>
                      <p className="text-muted-foreground text-sm">Task Details</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`${priorityConfig[selectedTask.priority]?.bg} border ${priorityConfig[selectedTask.priority]?.border} rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FlagIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm font-medium">Priority</span>
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
                        className: "w-4 h-4 text-muted-foreground"
                      })}
                      <span className="text-muted-foreground text-sm font-medium">Status</span>
                    </div>
                    <span className={`font-semibold ${statusConfig[selectedTask.status]?.color}`}>
                      {statusConfig[selectedTask.status]?.label}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm font-medium">Description</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedTask.description || "No description provided."}
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm font-medium">Created</span>
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

                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ClockIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm font-medium">Due Date</span>
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
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm font-medium">Organization</span>
                  </div>
                  <p className="text-white">{getOrganizationName(selectedTask)}</p>
                </div>

                {/* Assignment */}
                {(selectedTask.assignedTo || selectedTask.assignedBy) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTask.assignedTo && (
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm font-medium">Assigned To</span>
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
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm font-medium">Assigned By</span>
                        </div>
                        <p className="text-white">{selectedTask.assignedBy}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Labels */}
                {selectedTask.labels && selectedTask.labels.length > 0 && (
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TagIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm font-medium">Labels</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.labels.map((label, idx) => (
                        <span
                          key={idx}
                          className="bg-muted text-foreground border border-border px-3 py-1 rounded-full text-sm font-medium"
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
                    className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm"
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