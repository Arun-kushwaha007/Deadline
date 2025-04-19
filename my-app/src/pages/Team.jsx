import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../components/organisms/DashboardLayout';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';

const Team = () => {
    const [team, setTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTeamName, setNewTeamName] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const { user } = useContext(SocketContext); // Assuming user info is in context

    const fetchTeamData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const teamResponse = await axios.get(`http://localhost:5000/api/users/${user._id}/team`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTeam(teamResponse.data);

            if (teamResponse.data) {
                const membersResponse = await axios.get(`http://localhost:5000/api/teams/${teamResponse.data._id}/members`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMembers(membersResponse.data);
            }
        } catch (err) {
            console.error('Error fetching team data:', err);
            setError('Failed to fetch team data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTeamData();
        }
    }, [user]);

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/teams', { name: newTeamName }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTeam(response.data);
            fetchTeamData(); // Refresh team data
        } catch (err) {
            console.error('Error creating team:', err);
            setError('Failed to create team.');
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/teams/${team._id}/members`, { email: newMemberEmail }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNewMemberEmail('');
            fetchTeamData(); // Refresh team data
        } catch (err) {
            console.error('Error adding member:', err);
            setError('Failed to add member.');
        }
    };

    if (loading) return <p>Loading team data...</p>;

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4">Your Team</h1>

            {error && <p className="text-red-500">{error}</p>}

            {!team ? (
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Create a Team</h2>
                    <form onSubmit={handleCreateTeam} className="mb-4">
                        <input
                            type="text"
                            placeholder="Team Name"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="border rounded-md px-3 py-2 mr-2"
                            required
                        />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            Create Team
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-semibold mb-2">{team.name}</h2>

                    <h3 className="text-lg font-semibold mt-4 mb-2">Team Members</h3>
                    <ul>
                        {members.map((member) => (
                            <li key={member._id} className="mb-1">
                                {member.name} ({member._id === team.leader ? 'Leader' : 'Member'})  {/* Assuming members have name and _id */}
                            </li>
                        ))}
                    </ul>

                    {user._id === team.leader && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Add Member</h3>
                            <form onSubmit={handleAddMember}>
                                <input
                                    type="email"  // Or change to text if using invite links
                                    placeholder="Member Email" // Or "Email/Invite Link"
                                    value={newMemberEmail}
                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                    className="border rounded-md px-3 py-2 mr-2"
                                    required
                                />
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                  Add Member
                                </button>
                            </form>
                        </div>
                    )}

                    {/*  You might want to display tasks here as well, or link to a team-specific task view  */}
                </div>
            )}
        </DashboardLayout>
    );
};

export default Team;
