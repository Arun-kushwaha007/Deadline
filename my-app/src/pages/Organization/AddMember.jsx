import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/organisms/DashboardLayout';

const AddMember = () => {
  const { id: orgId } = useParams(); // use org ID from the URL
  const [joiningUserId, setJoiningUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/organizations/${orgId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ joiningUserId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ User successfully added to the organization!');
      } else {
        setMessage(data.message || '❌ Failed to add user.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ An error occurred. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg bg-slate-800 text-white">
        <h2 className="text-xl font-bold mb-4">Add a User to Your Organization</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">User ID to Add</label>
            <input
              type="text"
              value={joiningUserId}
              onChange={(e) => setJoiningUserId(e.target.value)}
              placeholder="Enter User ID"
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Add to Organization
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-green-400 font-medium">
            {message}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AddMember;
