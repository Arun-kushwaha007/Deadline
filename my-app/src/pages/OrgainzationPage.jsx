// src/components/Organization/OrganizationPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrganizationDetails } from '../../redux/organizationSlice';
import AddMemberModal from './AddMemberModal';
import AssignTaskModal from './AssignTaskModal';

const OrganizationPage = () => {
  const { orgId } = useParams();
  const dispatch = useDispatch();
  const organization = useSelector((state) => state.organization.selectedOrganization);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    dispatch(fetchOrganizationDetails(orgId));
  }, [dispatch, orgId]);

  if (!organization) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{organization.name}</h1>

      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => setShowMemberModal(true)}
        >
          + Add Member
        </button>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={() => setShowTaskModal(true)}
        >
          + Assign Task
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Members</h2>
        <ul className="list-disc pl-6 mt-2">
          {organization.members.map((member) => (
            <li key={member._id}>{member.name} ({member.email})</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Tasks</h2>
        <ul className="list-disc pl-6 mt-2">
          {organization.tasks.map((task) => (
            <li key={task._id}>{task.title} - Assigned to: {task.assignedTo?.name}</li>
          ))}
        </ul>
      </div>

      {showMemberModal && (
        <AddMemberModal orgId={orgId} closeModal={() => setShowMemberModal(false)} />
      )}
      {showTaskModal && (
        <AssignTaskModal orgId={orgId} closeModal={() => setShowTaskModal(false)} />
      )}
    </div>
  );
};

export default OrganizationPage;
