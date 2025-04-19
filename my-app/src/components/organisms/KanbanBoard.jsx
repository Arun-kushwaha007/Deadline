import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import { createTask, updateTask, deleteTask, fetchTasks, reorderTasks } from '../../redux/slices/tasksSlice';
import NewTaskModal from '../molecules/NewTaskModal';
import { Button } from '../atoms/Button';
import DroppableColumn from '../atoms/DroppableColumn';
import TaskDetailsModal from '../molecules/TaskDetailsModal';
import SortableTask from '../molecules/SortableTask';
import TaskCard from '../molecules/TaskCard';

const KanbanBoard = () => {
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  console.log(tasks)
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('');
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const columns = ['todo', 'inprogress', 'done'];
  const columnTitles = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done',
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeTaskData = tasks.find((t) => t._id === activeId);    if (!activeTaskData) return;

    const isOverColumn = columns.includes(overId);
    const overTaskData = tasks.find((t) => t._id === overId);

    if (isOverColumn && activeTaskData.status !== overId) {
      await dispatch(updateTask({ id: activeTaskData._id, status: overId }));
    } else if (overTaskData && activeTaskData.status === overTaskData.status) {
      const columnTasks = tasks.filter((t) => t.status === activeTaskData.status);
      const oldIndex = columnTasks.findIndex((t) => t._id === activeTaskData._id);
      const newIndex = columnTasks.findIndex((t) => t._id === overTaskData._id);

      const reorderedTasksArray = [...columnTasks];
      reorderedTasksArray.splice(oldIndex, 1);
      reorderedTasksArray.splice(newIndex, 0, activeTaskData);

      const newOrder = reorderedTasksArray.map(task => task._id);
      await dispatch(updateTask({ id: activeTaskData._id, order: newOrder, status: activeTaskData.status }));
    }
    setActiveTask(null);
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error}</p>;
    return (
    <div className="p-6 dark:bg-dark min-h-screen text-white">
    }
    setActiveTask(null);
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error}</p>;


  return (
    <div className="p-6 dark:bg-dark min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Board</h1>
        <Button onClick={() => setShowModal(true)}>+ New Task</Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm">Filter by Priority:</label>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-slate-700 p-2 rounded text-white"
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
          const task = tasks.find((t) => t._id === active.id.toString());
          setActiveTask(task);
        }}
      >
        <div className="flex gap-4">
        {columns.map((status) => {
          const columnTasks = tasks.filter(
            (task) => task.status === status && (!filterPriority || task.priority === filterPriority)
          );

          return (
            <DroppableColumn
              key={status}
              id={status}
              className="flex-1 bg-slate-800 rounded-lg p-4 min-h-[200px]"
            >
              <h2 className="text-xl font-bold mb-4">{columnTitles[status]}</h2>
              <SortableContext
                items={columnTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <SortableTask
                      key={task._id}
                      task={task}
                      onView={() => setSelectedTask(task)}
                      onEdit={() => {
                        setEditTask(task);
                        setShowModal(true);
                      }}
                      onDelete={() => dispatch(deleteTask(task._id))}
                    />
                  ))}
                </div>
              </SortableContext>
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

    {showModal && (
      <NewTaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditTask(null);
        }}
        taskToEdit={editTask}
      />
    )}

    <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
  </div>
);
};

export default KanbanBoard;
