import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrganizationCard = ({ organization, currentUserId }) => {
  const navigate = useNavigate();

  const handleAddMember = (e) => {
    e.stopPropagation();
    navigate(`/organizations/${organization._id}/add-member`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/organizations/${organization._id}/edit`);
  };

  // Get current user's role in this organization
  const myMembership = organization.members.find(
    (member) => member.userId === currentUserId
  );

  const myRole = myMembership?.role || 'member';

  return (
    <div
      className="bg-slate-800 text-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition relative"
      onClick={() => navigate(`/organizations/${organization._id}`)}
    >
      <h2 className="text-xl font-semibold">{organization.name}</h2>
      <p className="text-sm text-gray-400">Members: {organization.members.length}</p>
      <p className="text-sm text-yellow-400 mt-1">You are a: <strong>{myRole}</strong></p>

      <div className="flex gap-2 mt-4">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          onClick={handleAddMember}
        >
          Add Member
        </button>
        {/* <button
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          onClick={handleEdit}
        >
          Edit
        </button> */}
      </div>
    </div>
  );
};

export default OrganizationCard;
