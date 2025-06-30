import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectOrganization } from '../../redux/organizationSlice';

const OrganizationCard = ({ organization, currentUserId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Find the current user's membership using userId.userId (UUID)
  const myMembership = organization.members.find((member) => {
    const memberId =
      typeof member.userId === 'object'
        ? member.userId.userId
        : member.userId;

    return String(memberId) === String(currentUserId);
  });

  const myRole = myMembership?.role ?? 'member';
  const myName =
    typeof myMembership?.userId === 'object'
      ? myMembership.userId.name
      : 'You';

  const handleSelect = (e) => {
    e.stopPropagation();
    dispatch(selectOrganization(organization));
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/organizations/${organization._id}`);
  };

  const handleAddMember = (e) => {
    e.stopPropagation();
    navigate(`/organizations/${organization._id}/add-member`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/organizations/${organization._id}/edit`);
  };

  return (
    <div
      className="bg-slate-800 text-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition relative"
      onClick={handleSelect}
      onDoubleClick={handleViewDetails}
    >
      <h2 className="text-xl font-semibold">{organization.name}</h2>
      <p className="text-sm text-gray-400">
        Members: {organization.members.length}
      </p>

      <p className="text-sm text-yellow-400 mt-1">
        Your role: <strong className="capitalize">{myRole}</strong>
        {myName && <span className="text-gray-300"> ({myName})</span>}
      </p>

      <div className="flex gap-2 mt-4 flex-wrap">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          onClick={handleSelect}
        >
          Select
        </button>

        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          onClick={handleViewDetails}
        >
          View Details
        </button>

        {(myRole === 'admin' || myRole === 'coordinator') && (
          <>
            <button
              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
              onClick={handleAddMember}
            >
              Add Member
            </button>
            {/* Uncomment below if you want Edit:
            <button
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              onClick={handleEdit}
            >
              Edit
            </button>
            */}
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizationCard;
