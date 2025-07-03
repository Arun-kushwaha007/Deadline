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
  const columnTitles = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done',
  };

  // Helper function to check if a task is assigned to the current user
  const isTaskAssignedToUser = (task) => {
    if (!currentUserId) return false;

    // Handle "everyone" assignments
    if (task.assignedTo === 'everyone' || task.assignedTo === null) {
      return true; // Show tasks assigned to everyone
    }

    // Handle different assignedTo data structures
    let taskAssigneeIdentifier;

    if (task.assignedTo && typeof task.assignedTo === 'object') {
      // If assignedTo is a populated object, use its userId (UUID)
      taskAssigneeIdentifier = task.assignedTo.userId;
    } else if (typeof task.assignedTo === 'string') {
      // If assignedTo is a string, it might be a direct ID (though less common for users now)
      // or a special string like 'everyone' (already handled).
      // This path is less likely for user assignment after backend changes.
      taskAssigneeIdentifier = task.assignedTo;
    }
    // If task.assignedTo is null or not an object/string, taskAssigneeIdentifier will be undefined.

    return String(taskAssigneeIdentifier) === String(currentUserId);
  };

  // Filter only tasks assigned to the logged-in user
  const userTasks = tasks.filter(isTaskAssignedToUser);

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
      <div className="p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-4">👤 My Task Board</h1>
        <p className="text-gray-400">Please log in to view your tasks.</p>
      </div>
    );
  }

  // Show loading state
  if (taskStatus === 'loading') {
    return (
      <div className="p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-4">👤 My Task Board</h1>
        <p className="text-gray-400">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            👤 My Task Board
          </h1>
          <p className="text-gray-400 mt-2">
            {userTasks.length} task{userTasks.length !== 1 ? 's' : ''} assigned to you across all organizations
          </p>
        </div>
        
        {/* Optional: Add new task button if users can create tasks for themselves */}
        {/* <Button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          + New Task
        </Button> */}
      </div>

      <div className="mb-6 flex items-center gap-4">
        <label
          className="text-sm font-medium"
          htmlFor="priorityFilter"
        >
          🎯 Filter by Priority:
        </label>
        <select
          id="priorityFilter"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
          disabled={editTask !== null}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {userTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {filterPriority 
              ? `No tasks found with ${filterPriority} priority.`
              : 'No tasks assigned to you yet.'
            }
          </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {columns.map((status) => {
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
                  className="bg-zinc-800 rounded-xl p-4 min-h-[300px] shadow-md hover:shadow-xl transition"
                >
                  <h2 className="text-xl font-bold mb-4 border-b border-zinc-700 pb-2">
                    {columnTitles[status]}
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      ({columnTasks.length})
                    </span>
                  </h2>
                  
                  <SortableContext
                    items={tasksToShow.map((t) => t.id.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {tasksToShow.map((task) => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          myRole="member" // Users can only view/edit their own tasks
                          organizationName={getOrganizationName(task)} // Pass organization name
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
                      ))}
                    </div>
                  </SortableContext>

                  {columnTasks.length > 4 && (
                    <button
                      className="mt-3 text-sm text-orange-400 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-800 rounded"
                      onClick={() =>
                        setExpandedColumns((prev) => ({
                          ...prev,
                          [status]: !prev[status],
                        }))
                      }
                    >
                      {isExpanded 
                        ? `Show Less (${columnTasks.length - 4} hidden)` 
                        : `View All Tasks (${columnTasks.length - 4} more)`
                      }
                    </button>
                  )}
                </DroppableColumn>
              );
            })}
          </div>

          <DragOverlay>
            {activeTask && (
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
            )}
          </DragOverlay>
        </DndContext>
      )}

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
  );
};

export default UserKanbanBoard;