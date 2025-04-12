// components/molecules/TaskCard.jsx
export default function TaskCard({ title, description, onView, onEdit, onDelete }) {
  return (
    <div className="bg-zinc-800 p-4 rounded-xl shadow hover:shadow-lg transition text-white">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-400 text-sm mt-1">{description}</p>

      <div className="flex justify-end gap-3 mt-3 text-sm">
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
