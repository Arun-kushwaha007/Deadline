import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import {
  fetchTasks,
  updateTaskStatus,
  reorderTasks,
  deleteTaskThunk,
} from '../../redux/slices/tasksSlice';

import NewTaskModal from '../molecules/NewTaskModal';
import { Button } from '../atoms/Button';
import DroppableColumn from '../atoms/DroppableColumn';
import SortableTask from '../molecules/SortableTask';
import TaskCard from '../molecules/TaskCard';

import {
  UserIcon,
  FunnelIcon,
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

const UserKanbanBoard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [expandedColumns, setExpandedColumns] = useState({});
  const [viewOnly, setViewOnly] = useState(false);

  const tasks = useSelector((state) => state.tasks.tasks);
  const taskStatus = useSelector((state) => state.tasks.status);
  const organizations = useSelector((state) => state.organization.organizations || []);

  // Get logged-in user info
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const currentUserId = loggedInUser?.userId;

  // Column configurations
  const columnConfig = {
    todo: {
      title: 'To Do',
      icon: ClockIcon,
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      count: 0
    },
    inprogress: {
      title: 'In Progress',
      icon: PlayIcon,
      gradient: 'from-yellow-500 to-orange-600',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      count: 0
    },
    done: {
      title: 'Done',
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      count: 0
    }
  };

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch all tasks across all organizations (without organizationId parameter)
  useEffect(() => {
    dispatch(fetchTasks()); // This will fetch all tasks since no organizationId is passed
  }, [dispatch]);

  const sensors = useSensors(useSensor(PointerSensor));

  const columns = ['todo', 'inprogress', 'done'];

  const isTaskAssignedToUser = (task) => {
    if (!currentUserId) return false;

    // Handle "everyone" assignments
    if (task.assignedTo === 'everyone' || task.assignedTo === null) {
      return true; // Show tasks assigned to everyone
    }

    // Handle different assignedTo data structures
    let taskAssigneeIdentifier;

    if (task.assignedTo && typeof task.assignedTo === 'object') {
  
      taskAssigneeIdentifier = task.assignedTo.userId;
    } else if (typeof task.assignedTo === 'string') {
      
      taskAssigneeIdentifier = task.assignedTo;
    }
    

    return String(taskAssigneeIdentifier) === String(currentUserId);
  };

  // Filter only tasks assigned to the logged-in user
  const userTasks = tasks.filter(isTaskAssignedToUser);

  // Update column counts
  columns.forEach(status => {
    columnConfig[status].count = userTasks.filter(t => 
      t.status === status && 
      (!filterPriority || t.priority === filterPriority)
    ).length;
  });

  // Helper function to get organization name for a task
  const getOrganizationName = (task) => {
    if (!task.organization) return 'Unknown Organization';
    
    // Handle both string ID and object formats
    const orgId = typeof task.organization === 'string' 
      ? task.organization 
      : task.organization._id;
    
    const org = organizations.find(o => o._id === orgId);
    return org ? org.name : (task.organization.name || 'Unknown Organization');
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTaskData = userTasks.find(
      (t) => t.id.toString() === active.id
    );
    if (!activeTaskData) return;

    const isOverColumn = columns.includes(over.id);
    const overTaskData = userTasks.find(
      (t) => t.id.toString() === over.id
    );

    if (isOverColumn) {
      // Moving to a different column
      if (activeTaskData.status !== over.id) {
        dispatch(
          updateTaskStatus({
            id: activeTaskData.id,
            status: over.id,
          })
        );
      }
    } else if (overTaskData) {
      // Moving within or between columns
      const activeStatus = activeTaskData.status;
      const overStatus = overTaskData.status;

      if (activeStatus === overStatus) {
        // Reordering within the same column
        const columnTasks = userTasks
          .filter((t) => t.status === activeStatus)
          .sort((a, b) => a.order - b.order);

        const oldIndex = columnTasks.findIndex(
          (t) => t.id === activeTaskData.id
        );
        const newIndex = columnTasks.findIndex(
          (t) => t.id === overTaskData.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(columnTasks, oldIndex, newIndex);
          dispatch(
            reorderTasks({
              status: activeStatus,
              tasks: reordered,
            })
          );
        }
      } else {
        // Moving to a different column
        dispatch(
          updateTaskStatus({
            id: activeTaskData.id,
            status: overStatus,
          })
        );
      }
    }

    setActiveTask(null);
  };

  // Show message if no user is logged in
  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to view your personal task board.</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (taskStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Your Tasks</h2>
          <p className="text-gray-400">Please wait while we fetch your personal assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  My Task Board
                </h1>
                <p className="text-gray-400 text-lg mt-1">
                  {userTasks.length} task{userTasks.length !== 1 ? 's' : ''} assigned to you across all organizations
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <SparklesIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">
                    Personal workspace for {loggedInUser?.name || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-300" htmlFor="priorityFilter">
                Filter by Priority:
              </label>
            </div>
            <select
              id="priorityFilter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-gray-800/50 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              disabled={editTask !== null}
            >
              <option value="">All Priorities</option>
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {columns.map((status) => {
              const config = columnConfig[status];
              const Icon = config.icon;
              return (
                <div
                  key={status}
                  className={`${config.bg} border ${config.border} rounded-lg p-3 text-center`}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-gray-300" />
                    <span className="text-sm font-medium text-gray-300">{config.title}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{config.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        {userTasks.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Tasks Found</h3>
              <p className="text-gray-400 text-lg">
                {filterPriority 
                  ? `No tasks found with ${filterPriority} priority.`
                  : 'No tasks are currently assigned to you.'
                }
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Tasks assigned to you from any organization will appear here.
              </p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={({ active }) => {
              const task = userTasks.find(
                (t) => t.id.toString() === active.id
              );
              setActiveTask(task || null);
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {columns.map((status) => {
                const config = columnConfig[status];
                const Icon = config.icon;
                const columnTasks = userTasks
                  .filter(
                    (task) =>
                      task.status === status &&
                      (!filterPriority ||
                        task.priority === filterPriority)
                  )
                  .sort((a, b) => a.order - b.order);

                const isExpanded = expandedColumns[status];
                const tasksToShow = isExpanded
                  ? columnTasks
                  : columnTasks.slice(0, 4);

                return (
                  <DroppableColumn
                    key={status}
                    id={status}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden"
                  >
                    {/* Column Header */}
                    <div className={`bg-gradient-to-r ${config.gradient} p-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-white" />
                          <h2 className="text-lg font-bold text-white">
                            {config.title}
                          </h2>
                        </div>
                        <div className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {columnTasks.length}
                        </div>
                      </div>
                    </div>

                    {/* Tasks Container */}
                    <div className="p-4 min-h-[400px]">
                      <SortableContext
                        items={tasksToShow.map((t) => t.id.toString())}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {tasksToShow.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Icon className="w-6 h-6 text-gray-400" />
                              </div>
                              <p className="text-gray-400 text-sm">No tasks in {config.title.toLowerCase()}</p>
                            </div>
                          ) : (
                            tasksToShow.map((task) => (
                              <div key={task.id} className="relative">
                                <SortableTask
                                  task={task}
                                  myRole="member" 
                                  organizationName={getOrganizationName(task)} 
                                  onView={() => {
                                    setEditTask(task);
                                    setShowModal(true);
                                    setViewOnly(true);
                                  }}
                                  onEdit={() => {
                                    setEditTask(task);
                                    setShowModal(true);
                                    setViewOnly(false);
                                  }}
                                  onDelete={() =>
                                    dispatch(deleteTaskThunk(task.id))
                                  }
                                />
                                {/* Organization Badge */}
                                <div className="absolute top-2 right-2 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-lg px-2 py-1">
                                  <div className="flex items-center gap-1">
                                    <BuildingOfficeIcon className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-300 truncate max-w-[100px]">
                                      {getOrganizationName(task)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </SortableContext>

                      {/* Show More/Less Button */}
                      {columnTasks.length > 4 && (
                        <button
                          className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition-all duration-200"
                          onClick={() =>
                            setExpandedColumns((prev) => ({
                              ...prev,
                              [status]: !prev[status],
                            }))
                          }
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUpIcon className="w-4 h-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDownIcon className="w-4 h-4" />
                              View All Tasks ({columnTasks.length - 4} more)
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </DroppableColumn>
                );
              })}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeTask && (
                <div className="transform rotate-3 scale-105">
                  <TaskCard
                    {...activeTask}
                    organizationName={getOrganizationName(activeTask)} // Pass organization name
                    onView={() => {
                      setEditTask(activeTask);
                      setShowModal(true);
                      setViewOnly(true);
                    }}
                    onEdit={() => {
                      setEditTask(activeTask);
                      setShowModal(true);
                      setViewOnly(false);
                    }}
                    onDelete={() => dispatch(deleteTaskThunk(activeTask.id))}
                  />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}

        {/* Task Modal */}
        <NewTaskModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditTask(null);
            setViewOnly(false);
          }}
          taskToEdit={editTask}
          viewOnly={viewOnly}
        />
      </div>
    </div>
  );
};

export default UserKanbanBoard;