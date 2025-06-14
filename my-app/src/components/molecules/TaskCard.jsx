import { useState } from 'react';

export function ViewButton({ onClick }) {
  return (
    <button
      className="text-blue-400 hover:text-blue-500"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerDown={e => e.stopPropagation()}
      type="button"
      tabIndex={0}
    >
      View
    </button>
  );
}

export function EditButton({ onClick }) {
  return (
    <button
      className="text-yellow-400 hover:text-yellow-500"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerDown={e => e.stopPropagation()}
      type="button"
      tabIndex={0}
    >
      Edit
    </button>
  );
}

export function DeleteButton({ onClick }) {
  return (
    <button
      className="text-red-400 hover:text-red-500"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerDown={e => e.stopPropagation()}
      type="button"
      tabIndex={0}
    >
      Delete
    </button>
  );
}

export default function TaskCard({
  title,
  description,
  dueDate,
  priority,
  labels = [],
  subtasks = [],
  assignee,
  assignedBy,
  visibility = [],
  onView,
  onEdit,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    low: 'bg-green-600',
    medium: 'bg-yellow-500',
    high: 'bg-red-600',
  };

  return (
    <div
      className={`bg-zinc-800 rounded-xl shadow-lg transition-all text-white cursor-pointer overflow-hidden
        ${expanded ? 'p-5 space-y-3 scale-105 z-10' : 'p-2 space-y-1 hover:scale-105'}
      `}
      style={{ minHeight: expanded ? 0 : 56, minWidth: 180, maxWidth: 320 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={() => setExpanded((prev) => !prev)}
      tabIndex={0}
    >
      <div className="flex justify-between items-start">
        <h3 className={`font-bold ${expanded ? 'text-lg' : 'text-base'} truncate`}>{title}</h3>
        {priority && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityColors[priority] || 'bg-gray-500'}`}
          >
            {priority.toUpperCase()}
          </span>
        )}
      </div>

      {expanded && (
        <>
          {/* Description */}
          <p className="text-sm text-gray-300">{description}</p>

          {/* Labels */}
          {labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {labels.map((label, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-600 px-2 py-1 rounded-full text-xs font-medium"
                >
                  #{label}
                </span>
              ))}
            </div>
          )}

          {/* Due Date */}
          {dueDate && (
            <p className="text-xs text-yellow-300">📅 Due: {new Date(dueDate).toLocaleDateString()}</p>
          )}

          {/* Assignee + AssignedBy */}
          <div className="text-xs text-gray-400">
            {assignee?.name && <p>👤 Assigned to: <span className="text-white">{assignee.name}</span></p>}
            {assignedBy && <p>🧑‍💼 Assigned by: <span className="text-white">{assignedBy}</span></p>}
          </div>

          {/* Visibility */}
          <div className="text-xs">
            🔒 Visibility: <span className="text-white font-semibold capitalize">{visibility}</span>
          </div>

          {/* Subtasks */}
          {subtasks.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-300">Subtasks:</p>
              <ul className="list-none mt-1 space-y-1 text-sm">
                {subtasks.map((subtask, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center gap-2 ${subtask.done ? 'text-gray-500 line-through' : 'text-white'}`}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.done}
                      readOnly
                      className="accent-green-500"
                    />
                    {subtask.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-3 text-sm">
            <ViewButton onClick={onView} />
            <EditButton onClick={onEdit} />
            <DeleteButton onClick={onDelete} />
          </div>
        </>
      )}
    </div>
  );
}