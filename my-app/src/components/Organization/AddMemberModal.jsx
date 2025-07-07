// src/components/Organization/AddMemberModal.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMemberToOrganization } from '../../redux/organizationSlice';

const AddMemberModal = ({ orgId, closeModal }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member'); 
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addMemberToOrganization({ orgId, email, role }));
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Member by Email</h2>
        <input
          type="email"
          placeholder="Member Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="member">Member</option>
          <option value="coordinator">Coordinator</option>
        </select>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={closeModal}>Cancel</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
