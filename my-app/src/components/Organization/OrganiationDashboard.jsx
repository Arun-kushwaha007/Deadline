// src/components/Organization/OrganizationDashboard.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserOrganizations } from '../../redux/organizationSlice';
import { fetchOrganizations } from '../../redux/organizationSlice';
import OrganizationCard from './OrganizationCard';
import CreateOrganizationModal from './CreateOrganizationModal';

const OrganizationDashboard = () => {
  const dispatch = useDispatch();
  const organizations = useSelector((state) => state.organization.organizations);
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Organizations</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => setShowModal(true)}
        >
          + Create Organization
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {organizations.map((org) => (
          <OrganizationCard key={org._id} organization={org} />
        ))}
      </div>
      {showModal && <CreateOrganizationModal closeModal={() => setShowModal(false)} />}
    </div>
  );
};

export default OrganizationDashboard;
