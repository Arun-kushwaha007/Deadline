// src/components/Organization/OrganizationCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrganizationCard = ({ organization }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/organizations/${organization._id}`)}
    >
      <h2 className="text-xl font-semibold">{organization.name}</h2>
      <p className="text-sm text-gray-600">Members: {organization.members.length}</p>
    </div>
  );
};

export default OrganizationCard;
