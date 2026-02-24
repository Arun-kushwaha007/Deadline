import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../components/organisms/DashboardLayout';
import CreateOrganizationModal from '../../components/Organization/CreateOrganizationModal';
import OrganizationCard from '../../components/Organization/OrganizationCard';
import { fetchOrganizations } from '../../redux/organizationSlice';
import AIAssistantWrapper from '../../components/organisms/AIAssistantWrapper';
import { Building2, BarChart3, Plus, Rocket, Users, TrendingUp, Zap, Settings } from 'lucide-react';

const CreateOrganization = () => {
  const dispatch = useDispatch();
  const organizations = useSelector((state) => state.organization.organizations);
  const loading = useSelector((state) => state.organization.loading);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-sm">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              My Organizations
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your organizations and create new ones
            </p>
          </div>

          {/* Action Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Organization Dashboard
                </h2>
                <p className="text-sm text-muted-foreground">
                  {organizations.length} organization{organizations.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            
            <button
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-[1.01] font-medium shadow-sm flex items-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-5 h-5" />
              Create Organization
            </button>
          </div>

          {/* Organizations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 shadow-lg border border-border ">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                      <div className="h-3 bg-slate-200 dark:bg-accent rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-accent rounded"></div>
                    <div className="h-3 bg-slate-200 dark:bg-accent rounded w-4/5"></div>
                  </div>
                </div>
              ))
            ) : organizations.length === 0 ? (
              // Empty state
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                  <Building2 className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  No Organizations Yet
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Get started by creating your first organization and invite team members to collaborate.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-[1.01] font-medium shadow-sm flex items-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Create Your First Organization
                </button>
              </div>
            ) : (
              // Organizations list
              organizations.map((org) => (
                <div key={org._id} className="hover:scale-[1.01] transition-transform duration-200">
                  <OrganizationCard organization={org} />
                </div>
              ))
            )}
          </div>

          {/* Stats Section */}
          {organizations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-500/5 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Organizations</p>
                    <p className="text-2xl font-bold text-foreground">{organizations.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/5 dark:bg-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Teams</p>
                    <p className="text-2xl font-bold text-foreground">{organizations.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/20 dark:border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth</p>
                    <p className="text-2xl font-bold text-foreground">+{organizations.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="p-4 bg-blue-500/5 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all text-left"
              >
                <Building2 className="w-6 h-6 mb-2 text-blue-500" />
                <div className="font-medium text-foreground">New Organization</div>
                <div className="text-sm text-muted-foreground">Create a new workspace</div>
              </button>

              <button className="p-4 bg-green-500/5 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all text-left">
                <Users className="w-6 h-6 mb-2 text-green-500" />
                <div className="font-medium text-foreground">Invite Members</div>
                <div className="text-sm text-muted-foreground">Add team members</div>
              </button>

              <button className="p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20 dark:border-primary/30 hover:shadow-md transition-all text-left">
                <BarChart3 className="w-6 h-6 mb-2 text-primary" />
                <div className="font-medium text-foreground">View Analytics</div>
                <div className="text-sm text-muted-foreground">Organization insights</div>
              </button>

              <button className="p-4 bg-orange-500/5 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800 hover:shadow-md transition-all text-left">
                <Settings className="w-6 h-6 mb-2 text-orange-500" />
                <div className="font-medium text-foreground">Settings</div>
                <div className="text-sm text-muted-foreground">Manage preferences</div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && <CreateOrganizationModal closeModal={() => setShowModal(false)} />}
          <AIAssistantWrapper />
      </div>
    </DashboardLayout>
  );
};

export default CreateOrganization;