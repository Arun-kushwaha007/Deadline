import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrganizations, selectOrganization } from '../../redux/organizationSlice';
import OrganizationCard from './OrganizationCard';
import CreateOrganizationModal from './CreateOrganizationModal';
import DashboardOverview from '../organisms/DashboardOverview';

const OrganizationDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organizations = useSelector((state) => state.organization.organizations);
  const loading = useSelector((state) => state.organization.loading);
  const selectedOrganization = useSelector((state) => state.organization.selectedOrganization);
  const currentUser = useSelector((state) => state.organization.currentUser);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  const handleSelectOrganization = (organization) => {
    dispatch(selectOrganization(organization));
  };

  const handleCreateOrganization = () => {
    navigate('/create_Organization');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            🏢 My Organizations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Select an organization to view its details and manage tasks
          </p>
        </div>

        {/* Action Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">📊</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Organization Dashboard
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {organizations.length} organization{organizations.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
          
          <button
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 font-medium shadow-lg flex items-center gap-2"
            onClick={handleCreateOrganization}
          >
            <span className="text-lg">➕</span>
            Create Organization
          </button>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                </div>
                <div className="mt-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))
          ) : organizations.length === 0 ? (
            // Empty state
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <span className="text-6xl">🏢</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                No Organizations Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md text-lg">
                You haven't joined any organizations yet. Create your first organization or ask an admin to invite you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCreateOrganization}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 font-medium shadow-lg flex items-center gap-2"
                >
                  <span className="text-lg">🚀</span>
                  Create Organization
                </button>
                <button
                  onClick={() => navigate('/join_organization')}
                  className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <span className="text-lg">🤝</span>
                  Join Organization
                </button>
              </div>
            </div>
          ) : (
            // Organizations list
            organizations.map((org) => (
              <div key={org._id} className="transform hover:scale-105 transition-transform duration-200">
                <OrganizationCard
                  organization={org}
                  currentUserId={currentUser?.userId}
                  onSelect={() => handleSelectOrganization(org)}
                />
              </div>
            ))
          )}
        </div>

        {/* Stats Section - Only show when there are organizations */}
        {organizations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                  🏢
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Organizations</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{organizations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                  ✅
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{organizations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                  👥
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Team Member</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">You</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Organization Overview */}
        {selectedOrganization && (
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white text-xl">
                  📋
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {selectedOrganization.name} Overview
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Detailed organization information and statistics
                  </p>
                </div>
              </div>
            </div>
            <DashboardOverview organization={selectedOrganization} />
          </div>
        )}

        {/* Helper Text */}
        {organizations.length > 0 && !selectedOrganization && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👆</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Select an Organization
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Click on any organization card above to view its detailed overview and manage tasks.
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && <CreateOrganizationModal closeModal={() => setShowModal(false)} />}
      </div>
    </div>
  );
};

export default OrganizationDashboard;