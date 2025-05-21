import { useDroppable } from '@dnd-kit/core';

export default function DroppableColumn({ id, children, className }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      className={`${className} transition-shadow ${isOver ? 'shadow-lg ring-2 ring-blue-500' : ''}`}
      role="region"
      aria-labelledby={`column-${id}`}
    >
      {children}
    </section>
  );
}
