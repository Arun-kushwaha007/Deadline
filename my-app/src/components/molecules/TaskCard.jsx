// components/molecules/TaskCard.jsx
export default function TaskCard({ title, description, dueDate, priority, onView, onEdit, onDelete }) {
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

      {dueDate && (
        <p className="text-xs text-gray-500 mt-2">Due: {new Date(dueDate).toLocaleDateString()}</p>
      )}

      <div className="flex justify-end gap-3 mt-4 text-sm">
        <button
          className="text-blue-400 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onView?.();
          }}
        >
          View
        </button>
        <button
          className="text-yellow-400 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        >
          Edit
        </button>
        <button
          className="text-red-400 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
