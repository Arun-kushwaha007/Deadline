import React from 'react';
import { useSelector } from 'react-redux';

const TaskReportDashboard = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const users = useSelector((state) => state.organization.members || []); // adjust if your user list is elsewhere

  // Total tasks
  const totalTasks = tasks.length;

  // Tasks grouped by status
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { todo: 0, inprogress: 0, done: 0 }
  );

  // Tasks grouped by priority
  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  // Tasks grouped by user
  const tasksByUser = tasks.reduce((acc, task) => {
    const userId = task.assignedTo || 'unassigned';
    if (!acc[userId]) acc[userId] = [];
    acc[userId].push(task);
    return acc;
  }, {});

  return (
    <div className="p-6 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-orange-500 mb-8">📊 Task Report </h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Tasks</h2>
          <p className="text-3xl font-bold text-orange-400">{totalTasks}</p>
        </div>

        <div className="bg-zinc-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">By Status</h2>
          <ul className="text-sm space-y-1">
            <li>✅ Done: {statusCounts.done}</li>
            <li>🕒 In Progress: {statusCounts.inprogress}</li>
            <li>📋 To Do: {statusCounts.todo}</li>
          </ul>
        </div>

        <div className="bg-zinc-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">By Priority</h2>
          <ul className="text-sm space-y-1">
            <li className="text-green-400">Low: {priorityCounts.low}</li>
            <li className="text-orange-400">Medium: {priorityCounts.medium}</li>
            <li className="text-red-400">High: {priorityCounts.high}</li>
          </ul>
        </div>
      </div>

      {/* Tasks Per User */}
      <h2 className="text-2xl font-bold mb-4">Tasks by User</h2>
      <div className="space-y-6">
        {Object.entries(tasksByUser).map(([userId, userTasks]) => {
          const userInfo = users.find((u) => u._id === userId);
          const userName = userInfo ? userInfo.name : (userId === "unassigned" ? "Unassigned" : "Unknown User");

          return (
            <div key={userId} className="bg-zinc-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">
                {userName}
              </h3>
              <p className="text-sm mb-2">Total Tasks: {userTasks.length}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {userTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-zinc-700 p-3 rounded shadow hover:bg-zinc-600 transition"
                  >
                    <h4 className="font-bold">{task.title}</h4>
                    <p className="text-xs text-gray-300">
                      Priority:{" "}
                      <span
                        className={
                          task.priority === "high"
                            ? "text-red-400"
                            : task.priority === "medium"
                            ? "text-orange-400"
                            : "text-green-400"
                        }
                      >
                        {task.priority}
                      </span>
                    </p>
                    <p className="text-xs text-gray-300">Status: {task.status}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskReportDashboard;
