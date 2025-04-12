import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { updateTaskStatus, reorderTasks, deleteTask } from '../../redux/slices/tasksSlice';
import NewTaskModal from '../molecules/NewTaskModal';
import { Button } from '../atoms/Button';
import DroppableColumn from '../atoms/DroppableColumn';
import TaskDetailsModal from '../molecules/TaskDetailsModal';
import SortableTask from '../molecules/SortableTask';
import TaskCard from '../molecules/TaskCard';

const KanbanBoard = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
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
        const columnTasks = tasks.filter((t) => t.status === activeStatus);
        const oldIndex = columnTasks.findIndex((t) => t.id === activeTaskData.id);
        const newIndex = columnTasks.findIndex((t) => t.id === overTaskData.id);

        const reordered = arrayMove(columnTasks, oldIndex, newIndex);
        dispatch(reorderTasks({ status: activeStatus, tasks: reordered }));
      } else {
        dispatch(updateTaskStatus({ id: activeTaskData.id, status: overStatus }));
      }
    }

    setActiveTask(null);
  };

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
          const task = tasks.find((t) => t.id.toString() === active.id);
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
                  items={columnTasks.map((t) => t.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        onView={() => setSelectedTask(task)}
                        onEdit={() => {
                          setEditTask(task);
                          setShowModal(true);
                        }}
                        onDelete={() => dispatch(deleteTask(task.id))}
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

      <NewTaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditTask(null);
        }}
        taskToEdit={editTask}
      />

      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};

export default KanbanBoard;
