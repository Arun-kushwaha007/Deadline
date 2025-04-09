import { useSelector } from 'react-redux';

const KanbanBoard = () => {
  const tasks = useSelector((state) => state.tasks.tasks);

  const columns = ['todo', 'inprogress', 'done'];

  const columnTitles = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done',
  };

  return (
    <div className="flex gap-4 p-4 dark:bg-dark min-h-screen text-white">
      {columns.map((status) => (
        <div key={status} className="flex-1 bg-slate-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">{columnTitles[status]}</h2>
          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-700 p-3 rounded shadow-md"
                >
                  {task.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
