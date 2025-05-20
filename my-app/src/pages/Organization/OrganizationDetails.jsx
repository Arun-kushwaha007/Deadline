import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/organisms/DashboardLayout';

const OrganizationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/organizations/${id}`);
        setOrganization(res.data);
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

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/organizations/${id}/edit`);
  };

  if (loading)
    return <div className="p-6 text-lg text-center dark:text-white">Loading...</div>;
  if (!organization)
    return <div className="p-6 text-lg text-center dark:text-white">Organization not found</div>;

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold">{organization.name}</h1>
          <div className="flex gap-3">
            <button
              onClick={handleAddMember}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
            >
              Add Member
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
            >
              Edit
            </button>
           
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Members</h2>
          <ul className="space-y-2">
            {organization.members.map((member) => (
              <li
                key={member.userId._id}
                className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md shadow"
              >
                <strong>{member.userId.name}</strong> &mdash; <span className="italic">{member.role}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Tasks</h2>
          <ul className="space-y-2">
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
      </div>
    </DashboardLayout>
  );
};

export default OrganizationDetails;
