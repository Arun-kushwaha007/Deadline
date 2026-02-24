import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrganizations, selectOrganization } from '../../redux/organizationSlice';
import OrganizationCard from './OrganizationCard';
import CreateOrganizationModal from './CreateOrganizationModal';
import DashboardOverview from '../organisms/DashboardOverview';
import { Rocket, Handshake, BarChart3, Search, Plus, Building2, CheckCircle, Users, TrendingUp, ClipboardList, MousePointerClick } from 'lucide-react';

const OrganizationDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organizations = useSelector((state) => state.organization.organizations);
  const loading = useSelector((state) => state.organization.loading);
  const selectedOrganization = useSelector((state) => state.organization.selectedOrganization);
  const currentUser = useSelector((state) => state.organization.currentUser);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); 

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);


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
          className="bg-white dark:bg-muted rounded-3xl p-6 shadow-lg border border-border dark:border-border  overflow-hidden relative"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-muted/50"></div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gray-300 dark:bg-gray-600 rounded-2xl"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded-lg mb-2"></div>
              <div className="h-4 bg-accent dark:bg-accent rounded-lg w-2/3"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-accent dark:bg-accent rounded-lg"></div>
            <div className="h-3 bg-accent dark:bg-accent rounded-lg w-4/5"></div>
            <div className="h-3 bg-accent dark:bg-accent rounded-lg w-3/5"></div>
          </div>
          <div className="mt-6">
            <div className="h-10 bg-accent dark:bg-accent rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-24">
      <div className="relative z-10 text-center">
        {/* Animated icon */}
        {/* <div className="w-40 h-40 bg-muted rounded-full flex items-center justify-center mb-8 mx-auto relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-spin-slow"></div>
          <span className="text-8xl relative z-10 ">🏢</span>
        </div> */}
        
        <h3 className="text-4xl font-bold text-foreground mb-6">
          No Organizations Found
        </h3>
        
        <p className="text-muted-foreground text-center mb-10 max-w-lg text-lg leading-relaxed">
          You haven't joined any organizations yet. Create your first organization or ask an admin to invite you to get started!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleCreateOrganization}
            className="group px-8 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 font-semibold shadow-lg hover:shadow-2xl flex items-center gap-3"
          >
            <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            Create Organization
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button
            onClick={() => navigate('/join_organization')}
            className="group px-8 py-4 bg-muted hover:bg-gray-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] hover:-translate-y-1 flex items-center gap-3"
          >
            <Handshake className="w-6 h-6 group-hover:scale-[1.01] transition-transform duration-300" />
            Join Organization
          </button>
        </div>
      </div>
    </div>
  );

  const StatsCard = ({ icon, title, value, color, delay = 0 }) => (
    <div 
      className={`bg-card rounded-2xl p-6 border ${color} shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center text-foreground text-2xl shadow-sm border border-border`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground/80 dark:text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground ">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background transition-all duration-500">

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Enhanced Header Section */}
          <div className="text-center mb-16 relative">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 animate-fade-in">
                My Organizations
              </h1>
              <p className="text-muted-foreground text-xl max-w-4xl mx-auto leading-relaxed animate-fade-in-delayed">
                Manage and oversee all your organizational projects in one unified dashboard
              </p>
            </div>
          </div>

          {/* Enhanced Action Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-white/50 dark:bg-muted/50 backdrop-blur-sm rounded-3xl p-6 border border-border/50 dark:border-border/50 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-card border border-border rounded-2xl flex items-center justify-center shadow-sm text-primary">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground ">
                  Organization Dashboard
                </h2>
                <p className="text-muted-foreground">
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
                  className="pl-10 pr-4 py-3 bg-white dark:bg-accent border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Search className="w-5 h-5" />
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-accent dark:bg-accent rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-primary'
                      : 'text-muted-foreground hover:text-foreground dark:hover:text-gray-200'
                  }`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-primary'
                      : 'text-muted-foreground hover:text-foreground dark:hover:text-gray-200'
                  }`}
                >
                  ☰
                </button>
              </div>

              {/* Create Organization Button */}
              <button
                className="group px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 font-semibold shadow-md hover:shadow-lg flex items-center gap-3"
                onClick={handleCreateOrganization}
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
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
                  <div className="w-24 h-24 bg-muted border border-border rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground  mb-4">
                    No Results Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    No organizations match your search for "{searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-3 bg-primary hover:bg-primary text-white rounded-xl transition-colors"
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
                      className={`animate-fade-in-up hover:scale-[1.01] transition-all duration-300 ${
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
                icon={<Building2 className="w-7 h-7 text-primary" />}
                title="Total Organizations"
                value={uniqueOrganizations.length}
                color="border-border"
                delay={0}
              />
              <StatsCard
                icon={<CheckCircle className="w-7 h-7 text-green-500" />}
                title="Active Projects"
                value={uniqueOrganizations.reduce((acc, org) => acc + (org.projectCount || 0), 0) || uniqueOrganizations.length}
                color="border-border"
                delay={100}
              />
              <StatsCard
                icon={<Users className="w-7 h-7 text-blue-500" />}
                title="Team Members"
                value={uniqueOrganizations.reduce((acc, org) => acc + (org.memberCount || 1), 0) || "—"}
                color="border-border"
                delay={200}
              />
              <StatsCard
                icon={<TrendingUp className="w-7 h-7 text-amber-500" />}
                title="Completion Rate"
                value="85%"
                color="border-border"
                delay={300}
              />
            </div>
          )}

          {/* Enhanced Selected Organization Overview */}
          {selectedOrganization && (
            <div className="mt-12 animate-fade-in">
              <div className="bg-card rounded-3xl p-8 shadow-sm border border-border mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-muted border border-border rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <ClipboardList className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-foreground">
                      {selectedOrganization.name} Overview
                    </h3>
                    <p className="text-muted-foreground text-lg">
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
              <div className="w-20 h-20 bg-muted border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-primary">
                <MousePointerClick className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground  mb-3">
                Select an Organization
              </h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
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

export default OrganizationDashboard;