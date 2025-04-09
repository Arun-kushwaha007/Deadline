// components/molecules/TaskCard.jsx
export default function TaskCard({ title, description }) {
  return (
    <div className="bg-zinc-800 p-4 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-gray-400 text-sm mt-1">{description}</p>
    </div>
  );
}
