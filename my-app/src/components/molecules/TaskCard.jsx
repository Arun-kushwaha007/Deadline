// components/molecules/TaskCard.jsx
export default function TaskCard({
  title,
  description,
  dueDate,
  priority,
  labels = [],
  subtasks = [],
  onView,
  onEdit,
  onDelete
}) {
  const priorityColors = {
    low: 'bg-green-600',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  return (
    <div className="bg-zinc-800 p-4 rounded-xl shadow hover:shadow-lg transition text-white">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{title}</h3>
        {priority && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${priorityColors[priority] || 'bg-gray-500'}`}
          >
            {priority.toUpperCase()}
          </span>
        )}
      </div>

      <p className="text-gray-400 text-sm mt-2">{description}</p>

      {labels.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {labels.map((label, idx) => (
            <span key={idx} className="bg-indigo-600 px-2 py-1 rounded text-xs">{label}</span>
          ))}
        </div>
      )}

      {dueDate && (
        <p className="text-xs text-yellow-300 mt-2">📅 Due: {new Date(dueDate).toLocaleDateString()}</p>
      )}

      {subtasks.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-300 mb-1">Subtasks:</p>
          <ul className="list-disc list-inside space-y-1">
            {subtasks.map((subtask, idx) => (
              <li key={idx} className={`${subtask.done ? 'line-through text-gray-400' : ''}`}>
                <input
                  type="checkbox"
                  checked={subtask.done}
                  readOnly
                  className="mr-2 accent-green-500"
                />
                {subtask.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-4 text-sm">
        <button className="text-blue-400 hover:underline" onClick={(e) => { e.stopPropagation(); onView?.(); }}>View</button>
        <button className="text-yellow-400 hover:underline" onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>Edit</button>
        <button className="text-red-400 hover:underline" onClick={(e) => { e.stopPropagation(); onDelete?.(); }}>Delete</button>
      </div>
    </div>
  );
}
