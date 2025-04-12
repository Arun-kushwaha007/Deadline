// components/atoms/DroppableColumn.jsx
import { useDroppable } from '@dnd-kit/core';

export default function DroppableColumn({ id, children, className }) {
  const { setNodeRef } = useDroppable({
    id, // allows dropping directly into column
  });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}
