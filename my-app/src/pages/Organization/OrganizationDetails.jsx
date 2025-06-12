import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/organisms/DashboardLayout';
import KanbanBoard from '../../components/organisms/KanbanBoard'; // Assuming you have a KanbanBoard component

const OrganizationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '' });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await axios.get(`${backendUrl}/api/organizations/${id}`);
        setOrganization(res.data);
        setEditData({ name: res.data.name });
      } catch (err) {
        console.error('Failed to fetch organization:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  const handleAddMember = (e) => {
    e.stopPropagation();
    navigate(`/organizations/${id}/add-member`);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await axios.put(`${backendUrl}/api/organizations/${id}`, editData);
      setOrganization(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update organization:', err);
    }
  };

  if (loading)
    return <div className="p-6 text-lg text-center dark:text-white">Loading...</div>;
  if (!organization)
    return <div className="p-6 text-lg text-center dark:text-white">Organization not found</div>;

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleChange}
              className="text-4xl font-extrabold px-3 py-2 border dark:bg-gray-800 dark:border-gray-700 rounded-md"
            />
          ) : (
            <h1 className="text-4xl font-extrabold">{organization.name}</h1>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleAddMember}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
            >
              Add Member
            </button>

            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md shadow hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>



        <section>
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Tasks</h2>
          <ul className="space-y-2">
            <KanbanBoard tasks={organization.tasks} /> {/* Assuming KanbanBoard accepts tasks as a prop */}
            {organization.tasks.map((task, index) => (
              <li
                key={index}
                className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-md shadow"
              >
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Assigned to: <span className="font-semibold">{task.assignedTo?.name || 'Unassigned'}</span> <br />
                  Status: <span className="capitalize">{task.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>


      <section className="mb-8">
  <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Members</h2>
  <ul className="space-y-2">
    {organization.members.map((member) => (
      <li
        key={member.userId._id}
        className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md shadow flex justify-between items-center"
      >
        <div>
          <strong>{member.userId.name}</strong> &mdash; 
          <span className="italic"> {member.role}</span>
        </div>
        {isEditing && (
          <button
            onClick={async () => {
              try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
                await axios.delete(`${backendUrl}/api/organizations/${id}/members/${member.userId._id}`);
                setOrganization((prev) => ({
                  ...prev,
                  members: prev.members.filter((m) => m.userId._id !== member.userId._id)
                }));
              } catch (err) {
                console.error('Failed to delete member:', err);
              }
            }}
            className="ml-4 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </li>
    ))}
  </ul>
</section>

      </div>
    </DashboardLayout>
  );
};

export default OrganizationDetails;
