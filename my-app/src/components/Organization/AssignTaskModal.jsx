// src/components/Organization/AssignTaskModal.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignTaskToMember } from '../../redux/organizationSlice';

const AssignTaskModal = ({ orgId, closeModal }) => {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const dispatch = useDispatch();
  const members = useSelector((state) => state.organization.selectedOrganization?.members || []);

  const handleAssign = () => {
    dispatch(assignTaskToMember({ orgId, title, assignedTo }));
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <select
          className="w-full p-2 border rounded mb-4"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={closeModal}>Cancel</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleAssign}>Assign</button>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskModal;
