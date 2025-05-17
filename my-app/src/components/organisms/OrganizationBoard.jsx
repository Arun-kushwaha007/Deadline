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
import { useState } from 'react';

import {
  updateTaskOrganization,
  reorderOrgTasks,  // ✅ make sure this is exported from tasksSlice.js
  deleteTask,
} from '../../redux/slices/tasksSlice';
import { Button } from '../atoms/Button';
import DroppableColumn from '../atoms/DroppableColumn';
import TaskDetailsModal from '../molecules/TaskDetailsModal';
import SortableTask from '../molecules/SortableTask';
import TaskCard from '../molecules/TaskCard';
import NewTaskModal from '../molecules/NewTaskModal';

const OrganizationBoard = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('');

  const sensors = useSensors(useSensor(PointerSensor));

  const organizations = ['Design', 'Development', 'Marketing'];
  const organizationTitles = {
    Design: '🎨 Design',
    Development: '💻 Development',
    Marketing: '📣 Marketing',
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTaskData = tasks.find((t) => t.id.toString() === active.id);
    if (!activeTaskData) return;

    const isOverOrg = organizations.includes(over.id);
    const overTaskData = tasks.find((t) => t.id.toString() === over.id);

    if (isOverOrg) {
      // Dragged directly into a column (not onto another task)
      if (activeTaskData.organization !== over.id) {
        dispatch(updateTaskOrganization({ id: activeTaskData.id, organization: over.id }));
      }
    } else if (overTaskData) {
      const activeOrg = activeTaskData.organization;
      const overOrg = overTaskData.organization;

      if (activeOrg === overOrg) {
        // Reorder within the same column
        const orgTasks = tasks
          .filter((t) => t.organization === activeOrg)
          .sort((a, b) => a.order - b.order);

        const oldIndex = orgTasks.findIndex((t) => t.id === activeTaskData.id);
        const newIndex = orgTasks.findIndex((t) => t.id === overTaskData.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(orgTasks, oldIndex, newIndex);
          dispatch(reorderOrgTasks({ organization: activeOrg, tasks: reordered }));
        }
      } else {
        // Move to another column (reassign org)
        dispatch(updateTaskOrganization({ id: activeTaskData.id, organization: overOrg }));
      }
    }

    setActiveTask(null);
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organization Board</h1>
        <Button onClick={() => setShowModal(true)}>+ New Task</Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm" htmlFor="priorityFilter">Filter by Priority:</label>
        <select
          id="priorityFilter"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-gray-200 text-black dark:bg-slate-700 dark:text-white p-2 rounded"
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
          setActiveTask(task || null);
        }}
      >
        <div className="flex gap-4">
          {organizations.map((org) => {
            const orgTasks = tasks.filter(
              (task) =>
                task.organization === org &&
                (!filterPriority || task.priority === filterPriority)
            );

            return (
              <DroppableColumn
                key={org}
                id={org}
                className="flex-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-4 min-h-[200px]"
              >
                <h2 className="text-xl font-bold mb-4">{organizationTitles[org]}</h2>
                <SortableContext
                  items={orgTasks.map((t) => t.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {orgTasks.map((task) => (
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

      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

export default OrganizationBoard;
