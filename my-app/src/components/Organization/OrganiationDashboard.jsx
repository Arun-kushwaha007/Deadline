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
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  // Remove duplicates and ensure unique organizations
  const uniqueOrganizations = React.useMemo(() => {
    if (!organizations || !Array.isArray(organizations)) return [];
    
    const seen = new Set();
    const unique = organizations.filter(org => {
      if (!org || !org._id) return false;
      
      if (seen.has(org._id)) {
        console.warn(`Duplicate organization found with ID: ${org._id}`);
        return false;
      }
      
      seen.add(org._id);
      return true;
    });
    
    return unique;
  }, [organizations]);

  // Filter organizations based on search term
  const filteredOrganizations = uniqueOrganizations.filter(org =>
    org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOrganization = (organization) => {
    dispatch(selectOrganization(organization));
  };

  const handleCreateOrganization = () => {
    navigate('/create_Organization');
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div 
          key={`skeleton-${index}`} 
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse overflow-hidden relative"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-gray-700/60 to-transparent"></div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gray-300 dark:bg-gray-600 rounded-2xl"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-4/5"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/5"></div>
          </div>
          <div className="mt-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-24">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>
      
      <div className="relative z-10 text-center">
        {/* Animated icon */}
        <div className="w-40 h-40 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-8 mx-auto relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-spin-slow"></div>
          <span className="text-8xl relative z-10 animate-bounce">🏢</span>
        </div>
        
        <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-6">
          No Organizations Found
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-lg text-lg leading-relaxed">
          You haven't joined any organizations yet. Create your first organization or ask an admin to invite you to get started!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleCreateOrganization}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-semibold shadow-lg hover:shadow-2xl flex items-center gap-3"
          >
            <span className="text-xl group-hover:rotate-12 transition-transform duration-300">🚀</span>
            Create Organization
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button
            onClick={() => navigate('/join_organization')}
            className="group px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 flex items-center gap-3"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">🤝</span>
            Join Organization
          </button>
        </div>
      </div>
    </div>
  );

  const StatsCard = ({ icon, title, value, color, delay = 0 }) => (
    <div 
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 border border-opacity-20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-zinc-900 dark:via-gray-900 dark:to-indigo-950/30 transition-all duration-500">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/5 dark:bg-blue-600/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/5 dark:bg-purple-600/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-indigo-400/5 dark:bg-indigo-600/5 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Enhanced Header Section */}
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
              <span className="text-[20rem] font-bold">🏢</span>
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 animate-fade-in">
                My Organizations
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-xl max-w-4xl mx-auto leading-relaxed animate-fade-in-delayed">
                Manage and oversee all your organizational projects in one unified dashboard
              </p>
            </div>
          </div>

          {/* Enhanced Action Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">📊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Organization Dashboard
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredOrganizations.length} of {uniqueOrganizations.length} organization{uniqueOrganizations.length !== 1 ? 's' : ''} {searchTerm && 'found'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  ☰
                </button>
              </div>

              {/* Create Organization Button */}
              <button
                className="group px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 font-semibold shadow-lg hover:shadow-xl flex items-center gap-3"
                onClick={handleCreateOrganization}
              >
                <span className="text-lg group-hover:rotate-90 transition-transform duration-300">➕</span>
                Create Organization
              </button>
            </div>
          </div>

          {/* Organizations Grid/List */}
          <div className="mb-12">
            {loading ? (
              <LoadingSkeleton />
            ) : filteredOrganizations.length === 0 ? (
              searchTerm ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    No Results Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    No organizations match your search for "{searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <EmptyState />
              )
            ) : (
              <div className={`${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }`}>
                {filteredOrganizations.map((org, index) => {
                  const orgKey = org._id || org.id || `org-${index}-${org.name?.slice(0, 5) || 'unknown'}`;
                  
                  return (
                    <div 
                      key={orgKey} 
                      className={`animate-fade-in-up transform hover:scale-105 transition-all duration-300 ${
                        viewMode === 'list' ? 'hover:scale-100 hover:translate-x-2' : ''
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      data-org-id={org._id}
                    >
                      <OrganizationCard
                        organization={org}
                        currentUserId={currentUser?.userId}
                        onSelect={() => handleSelectOrganization(org)}
                        viewMode={viewMode}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Enhanced Stats Section */}
          {uniqueOrganizations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatsCard
                icon="🏢"
                title="Total Organizations"
                value={uniqueOrganizations.length}
                color="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800"
                delay={0}
              />
              <StatsCard
                icon="✅"
                title="Active Projects"
                value={uniqueOrganizations.reduce((acc, org) => acc + (org.projectCount || 0), 0) || uniqueOrganizations.length}
                color="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800"
                delay={100}
              />
              <StatsCard
                icon="👥"
                title="Team Members"
                value={uniqueOrganizations.reduce((acc, org) => acc + (org.memberCount || 1), 0) || "—"}
                color="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800"
                delay={200}
              />
              <StatsCard
                icon="📈"
                title="Completion Rate"
                value="85%"
                color="from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800"
                delay={300}
              />
            </div>
          )}

          {/* Enhanced Selected Organization Overview */}
          {selectedOrganization && (
            <div className="mt-12 animate-fade-in">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                    📋
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                      {selectedOrganization.name} Overview
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Comprehensive insights and detailed analytics
                    </p>
                  </div>
                </div>
              </div>
              <DashboardOverview organization={selectedOrganization} />
            </div>
          )}

          {/* Enhanced Helper Text */}
          {uniqueOrganizations.length > 0 && !selectedOrganization && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl animate-bounce">👆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                Select an Organization
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
                Click on any organization card above to explore its detailed overview and manage tasks efficiently.
              </p>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 animate-fade-in">
              <CreateOrganizationModal closeModal={() => setShowModal(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced CSS with new animations
const styles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(-180deg); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(90deg); }
  }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fade-in-delayed {
    0% { opacity: 0; transform: translateY(20px); }
    50% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
  .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
  .animate-fade-in { animation: fade-in 0.6s ease-out; }
  .animate-fade-in-delayed { animation: fade-in-delayed 1s ease-out; }
  .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  .animation-delay-1000 { animation-delay: 1000ms; }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default OrganizationDashboard;