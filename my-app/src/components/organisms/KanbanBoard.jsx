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

const KanbanBoard = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

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
            <div
              key={status}
              id={status}
              className="flex-1 bg-slate-800 rounded-lg p-4 min-h-[200px]"
            >
              <h2 className="text-xl font-bold mb-4">{columnTitles[status]}</h2>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div
                      key={task.id}
                      id={task.id}
                      className="bg-slate-700 p-3 rounded shadow-md cursor-move"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', task.id);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const taskId = e.dataTransfer.getData('text/plain');
                        dispatch(updateTaskStatus({ id: taskId, status }));
                      }}
                    >
                      {task.title}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </DndContext>

      <NewTaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default KanbanBoard;
