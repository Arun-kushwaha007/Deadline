// src/components/Organization/CreateOrganizationModal.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createOrganization } from '../../redux/organizationSlice';

const CreateOrganizationModal = ({ closeModal }) => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleCreate = () => {
    dispatch(createOrganization({ name }));
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-40">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md text-black">
        <h2 className="text-xl font-bold mb-4">Create New Organization</h2>
        <input
          type="text"
          placeholder="Organization Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={closeModal}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;
