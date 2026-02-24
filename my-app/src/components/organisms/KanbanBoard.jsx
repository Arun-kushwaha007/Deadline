import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router';

import {
  fetchTasks,
  updateTaskStatus,
  reorderTasks,
  deleteTaskThunk,
  clearTasks,
} from '../../redux/slices/tasksSlice';
import NewTaskModal from '../molecules/NewTaskModal';
import { Button } from '../atoms/Button';
import DroppableColumn from '../atoms/DroppableColumn';
import TaskDetailsModal from '../molecules/TaskDetailsModal';
import SortableTask from '../molecules/SortableTask';
import TaskCard from '../molecules/TaskCard';

import {
  PlusIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const KanbanBoard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const [expandedColumns, setExpandedColumns] = useState({});
  
  const tasks = useSelector((state) => state.tasks.tasks);
  const taskStatus = useSelector((state) => state.tasks.status);
  const error = useSelector((state) => state.tasks.error);
  const selectedOrganization = useSelector((state) => state.organization.selectedOrganization);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);
  
  const currentUserId = JSON.parse(localStorage.getItem('loggedInUser'))?.userId;

  const myMembership = selectedOrganization?.members?.find((member) => {
    const memberId = typeof member.userId === 'object' ? member.userId.userId : member.userId;
    return String(memberId) === String(currentUserId);
  });

  const myRole = myMembership?.role ?? 'member';
  const isPrivileged = myRole === 'admin' || myRole === 'coordinator';

  useEffect(() => {
    const organizationId = selectedOrganization?._id;
    if (organizationId) {
      dispatch(fetchTasks(organizationId));
    } else {
      dispatch(clearTasks());
    }
  }, [dispatch, selectedOrganization]);

  const sensors = useSensors(useSensor(PointerSensor));

  const columns = ['todo', 'inprogress', 'done'];
  
  const columnConfig = {
    todo: {
      title: 'To Do',
      icon: ClockIcon,
      headerBg: 'bg-muted/80',
      bg: 'bg-muted/30',
      border: 'border-border',
      count: tasks.filter(t => t.status === 'todo').length
    },
    inprogress: {
      title: 'In Progress',
      icon: PlayIcon,
      headerBg: 'bg-primary/10',
      bg: 'bg-primary/5',
      border: 'border-primary/20',
      count: tasks.filter(t => t.status === 'inprogress').length
    },
    done: {
      title: 'Done',
      icon: CheckCircleIcon,
      headerBg: 'bg-green-500/10 dark:bg-green-500/20',
      bg: 'bg-green-50 dark:bg-green-900/10',
      border: 'border-green-200 dark:border-green-800',
      count: tasks.filter(t => t.status === 'done').length
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTaskData = tasks.find((t) => t.id.toString() === active.id);
    if (!activeTaskData) return;

    const isOverColumn = columns.includes(over.id);
    const overTaskData = tasks.find((t) => t.id.toString() === over.id);

    if (isOverColumn) {
      if (activeTaskData.status !== over.id) {
        dispatch(updateTaskStatus({ id: activeTaskData.id, status: over.id }));
      }
    } else if (overTaskData) {
      const activeStatus = activeTaskData.status;
      const overStatus = overTaskData.status;

      if (activeStatus === overStatus) {
        const columnTasks = tasks
          .filter((t) => t.status === activeStatus)
          .sort((a, b) => a.order - b.order);

        const oldIndex = columnTasks.findIndex((t) => t.id === activeTaskData.id);
        const newIndex = columnTasks.findIndex((t) => t.id === overTaskData.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(columnTasks, oldIndex, newIndex);
          dispatch(reorderTasks({ status: activeStatus, tasks: reordered }));
        }
      } else {
        dispatch(updateTaskStatus({ id: activeTaskData.id, status: overStatus }));
      }
    }

    setActiveTask(null);
  };

  if (!selectedOrganization) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted border border-border rounded-full flex items-center justify-center mx-auto mb-4">
            <ViewColumnsIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Organization Selected</h3>
          <p className="text-muted-foreground">Please select an organization to view its Kanban board.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            {/* <div className="w-12 h-12 bg-card border border-border shadow-sm rounded-xl flex items-center justify-center">
              <ViewColumnsIcon className="w-6 h-6 text-primary" />
            </div> */}
            <div>
              {/* <h1 className="text-xl font-semibold text-foreground">
                Kanban Board
              </h1> */}
              <p className="text-muted-foreground text-sm">
                Drag and drop tasks to update their status
              </p>
            </div>
          </div>

          {isPrivileged && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all shadow-md"
            >
              <PlusIcon className="w-4 h-4" />
              New Task
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-muted-foreground" htmlFor="priorityFilter">
              Filter by Priority:
            </label>
          </div>
          <select
            id="priorityFilter"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-muted border border-border text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className={`${config.bg} border ${config.border} rounded-xl p-4 text-center shadow-sm`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-foreground" />
                  <span className="text-sm font-semibold text-foreground">{config.title}</span>
                </div>
                <div className="text-3xl font-bold text-foreground">{config.count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => {
          const task = tasks.find((t) => t.id.toString() === active.id);
          setActiveTask(task || null);
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((status) => {
            const config = columnConfig[status];
            const Icon = config.icon;
            const columnTasks = tasks
              .filter(
                (task) =>
                  task.status === status &&
                  (!filterPriority || task.priority === filterPriority)
              )
              .sort((a, b) => a.order - b.order);
          
            const isExpanded = expandedColumns[status];
            const tasksToShow = isExpanded ? columnTasks : columnTasks.slice(0, 4);
          
            return (
              <DroppableColumn
                key={status}
                id={status}
                className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col"
              >
                {/* Column Header */}
                <div className={`${config.headerBg} border-b border-border p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Icon className="w-5 h-5 text-foreground" />
                      <h2 className="text-lg font-bold text-foreground hover:text-primary transition-colors cursor-default">
                        {config.title}
                      </h2>
                    </div>
                    <div className="bg-background border border-border text-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
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
                          <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground text-sm">No tasks in {config.title.toLowerCase()}</p>
                        </div>
                      ) : (
                        tasksToShow.map((task) => (
                          <SortableTask
                            key={task.id}
                            task={task}
                            myRole={myRole}
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
                            onDelete={() => dispatch(deleteTaskThunk(task.id))}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
          
                  {/* Show More/Less Button */}
                  {columnTasks.length > 4 && (
                    <button
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-blue-300 hover:bg-primary/10 rounded-lg transition-all duration-200"
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
                onDelete={isPrivileged ? () => dispatch(deleteTaskThunk(activeTask.id)) : undefined}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Loading/Error States */}
      {taskStatus === 'loading' && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-300">
          <p className="font-semibold">Error loading tasks:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Modals */}
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

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => {
            setSelectedTask(null);
            setViewOnly(false);
          }}
          viewOnly={viewOnly}
        />
      )}
    </div>
  );
};

export default KanbanBoard;