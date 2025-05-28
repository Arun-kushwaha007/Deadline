import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrganizations } from '../../redux/organizationSlice';
import OrganizationCard from './OrganizationCard';
import CreateOrganizationModal from './CreateOrganizationModal';

const OrganizationDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organizations = useSelector((state) => state.organization.organizations);
  const loading = useSelector((state) => state.organization.loading);

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
          onClick={() => navigate('/create_Organization')}
        >
          Create Organization
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center text-lg text-gray-500 py-10">Fetching data...</div>
        ) : organizations.length === 0 ? (
          <div className="col-span-3 text-center text-lg text-gray-500 py-10">No organizations found.</div>
        ) : (
          organizations.map((org) => (
            <OrganizationCard key={org._id} organization={org} />
          ))
        )}
      </div>
      {showModal && <CreateOrganizationModal closeModal={() => setShowModal(false)} />}
    </div>
  );
};

export default OrganizationDashboard;