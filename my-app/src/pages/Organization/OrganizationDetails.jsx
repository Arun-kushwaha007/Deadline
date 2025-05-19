import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/organisms/DashboardLayout';


const OrganizationDetails = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-4">Loading...</div>;
  if (!organization) return <div className="p-4">Organization not found</div>;

  return (
    <DashboardLayout>
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{organization.name}</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Members</h2>
      <ul className="list-disc list-inside">
        {organization.members.map((member) => (
          <li key={member.userId._id}>
            {member.userId.name} ({member.role})
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Tasks</h2>
      <ul className="list-disc list-inside">
        {organization.tasks.map((task, index) => (
          <li key={index}>
            {task.title} - Assigned to: {task.assignedTo?.name || 'Unassigned'} - Status: {task.status}
          </li>
        ))}
      </ul>
    </div>
    </DashboardLayout>
  );
};

export default OrganizationDetails;
