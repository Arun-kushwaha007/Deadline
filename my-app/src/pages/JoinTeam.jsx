import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinTeam = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [teamCode, setTeamCode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    if (loggedInUserEmail) {
      const storedData = localStorage.getItem(loggedInUserEmail);
      if (storedData) {
        const parsedUser = JSON.parse(storedData);
        setUser(parsedUser);
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!teamCode.trim()) {
      setMessage('Please enter a valid team code or name.');
      return;
    }

    // Here you can add your logic to check/join the team, e.g., API call

    setMessage(`You have requested to join team: ${teamCode}`);
    setTeamCode('');
  };

  if (!user) {
    return null; // or a loading spinner if you prefer
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Join a Team</h2>
      <p className="mb-4">Welcome, <strong>{user.name}</strong>. Enter your team code or name below to join a team.</p>

      <form onSubmit={handleJoin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Team code or name"
          value={teamCode}
          onChange={(e) => setTeamCode(e.target.value)}
          className="border border-gray-300 rounded p-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Join Team
        </button>
      </form>

      {message && (
        <p className="mt-4 text-green-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default JoinTeam;
