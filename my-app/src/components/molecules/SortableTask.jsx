import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

export default function SortableTask({ task, onView, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-label={`Task: ${task.title}`}
      role="listitem"
    >
      <TaskCard
        id={task.id}
        title={task.title}
        description={task.description}
        priority={task.priority}
        status={task.status}
        assignee={task.assignedTo}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      
    </div>
  );
}
