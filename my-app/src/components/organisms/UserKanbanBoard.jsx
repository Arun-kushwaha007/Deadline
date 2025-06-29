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
  clearTasks,
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchTasks());
    return () => {
      dispatch(clearTasks());
    };
  }, [dispatch]);

  const sensors = useSensors(useSensor(PointerSensor));

  const columns = ['todo', 'inprogress', 'done'];
  const columnTitles = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done',
  };

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // ✅ Filter only tasks assigned to the logged-in user
  const userTasks = tasks.filter(
    (t) => t.assignedTo === loggedInUser?.userId
  );

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
      if (activeTaskData.status !== over.id) {
        dispatch(
          updateTaskStatus({
            id: activeTaskData.id,
            status: over.id,
          })
        );
      }
    } else if (overTaskData) {
      const activeStatus = activeTaskData.status;
      const overStatus = overTaskData.status;

      if (activeStatus === overStatus) {
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

  return (
    <div className="p-6 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          👤 My Task Board
        </h1>
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
                    className="mt-3 text-sm text-blue-400 hover:underline"
                    onClick={() =>
                      setExpandedColumns((prev) => ({
                        ...prev,
                        [status]: !prev[status],
                      }))
                    }
                  >
                    {isExpanded ? 'Show Less' : 'View All Tasks'}
                  </button>
                )}
              </DroppableColumn>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              title={activeTask.title}
              description={activeTask.description}
              priority={activeTask.priority}
            />
          )}
        </DragOverlay>
      </DndContext>

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
