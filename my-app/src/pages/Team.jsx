import { useState, useEffect } from 'react';
import DashboardLayout from '../components/organisms/DashboardLayout';
import axios from 'axios';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamTasks = async () => {
      const token = localStorage.getItem('token'); // ✅ Get token from localStorage

      if (!token) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/team/tasks', {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token in headers
          },
        });

        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team tasks:', error);
        setError('Failed to fetch team tasks.');
        setLoading(false);
      }
    };

    fetchTeamTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Your Team</h1>
      <h2 className="text-2xl font-semibold">Tasks</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned to this team yet.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task._id} className="p-4 border rounded-lg shadow-sm">
              <h2 className="font-semibold text-lg">{task.title}</h2>
              <p>{task.description}</p>
              <p>Assigned to: {task.assignedTo?.name || 'Unknown'}</p>
              <p>Priority: {task.priority}</p>
              <p>Deadline: {task.deadline}</p>
              <a href={`/task/${task._id}`} className="text-blue-500 hover:underline">
                View Details
              </a>
            </li>
          ))}
        </ul>
      )}
    </DashboardLayout>
  );
};

export default Team;
