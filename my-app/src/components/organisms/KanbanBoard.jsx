import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
} from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { updateTaskStatus, deleteTask } from '../../redux/slices/tasksSlice';
import NewTaskModal from '../molecules/NewTaskModal';
import { Button } from '../atoms/Button';
import DroppableColumn from '../atoms/DroppableColumn';
import TaskDetailsModal from '../molecules/TaskDetailsModal';
import TaskCard from '../molecules/TaskCard';

const DraggableTask = ({ task, onView, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id.toString(),
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-move"
    >
      <TaskCard
        title={task.title}
        description={task.description}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

const KanbanBoard = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
const [editTask, setEditTask] = useState(null);
const [filterPriority, setFilterPriority] = useState('');

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const columns = ['todo', 'inprogress', 'done'];
  const columnTitles = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done',
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          {columns.map((status) => (
            <DroppableColumn
              key={status}
              id={status}
              className="flex-1 bg-slate-800 rounded-lg p-4 min-h-[200px]"
            >
              <h2 className="text-xl font-bold mb-4">{columnTitles[status]}</h2>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === status && (!filterPriority || task.priority === filterPriority))
                  
                  .map((task) => (
                    <DraggableTask
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
            </DroppableColumn>
          ))}
        </div>
      </DndContext>

      <NewTaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditTask(null); // reset edit state
        }}
        taskToEdit={editTask}
      />
      
      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};

export default KanbanBoard;
