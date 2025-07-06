// components/molecules/KanbanColumn.jsx
import TaskCard from './TaskCard';

export default function KanbanColumn({ title, tasks = [] }) {
  return (
    <div className="w-full max-w-sm bg-zinc-900 p-4 rounded-xl flex flex-col gap-4">
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <div className="flex flex-col gap-4">
        {tasks.map((task, index) => (
          <TaskCard key={index} title={task.title} description={task.description} createdAt={task.createdAt} 
            priority={task.priority}/>
        ))}
      </div>
    </div>
  );
}
