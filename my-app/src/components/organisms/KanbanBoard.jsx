import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { updateTaskStatus } from '../../redux/slices/tasksSlice';
import NewTaskModal from '../molecules/NewTaskModal';
import { Button } from '../atoms/Button';
import DroppableColumn from '../atoms/DroppableColumn';
import { useDraggable } from '@dnd-kit/core';
// import TaskDetailsModal from '../molecules/TaskDetailsModal';
import TaskDetailsModal from '../molecules/TaskDetailsModal';


const DraggableTask = ({ task }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id.toString(),
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-slate-700 p-3 rounded shadow-md cursor-move"
    >
      {task.title}
    </div>
  );
};

const KanbanBoard = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  

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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          {columns.map((status) => (
            <DroppableColumn
              key={status}
              id={status}
              className="flex-1 bg-slate-800 rounded-lg p-4 min-h-[200px]"
              onClick={() => setSelectedTask(task)}
              
            >
              <h2 className="text-xl font-bold mb-4">{columnTitles[status]}</h2>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <DraggableTask key={task.id} task={task}
                    onClick={() => setSelectedTask(task)}
                    
                    />
                    
                  ))}
              </div>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>

      <NewTaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
        
    </div>
  );
};

export default KanbanBoard;
