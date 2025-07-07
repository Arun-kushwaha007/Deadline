import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api'; 
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrganizationDetails,
  clearSelectedOrganization,
} from '../../redux/organizationSlice';

import DashboardLayout from '../../components/organisms/DashboardLayout';
import KanbanBoard from '../../components/organisms/KanbanBoard';
import TaskReportDashboard from '../../components/organisms/TaskReportDashboard';
import OrgCalendarView from '../../components/organisms/OrgCalendarView';


import {
  UserPlusIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  UsersIcon,
  ChartBarIcon,
  CalendarIcon,
  ViewColumnsIcon,
  TrashIcon,
  EyeIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const OrganizationDetails = () => {
  const { id: orgId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedOrganization,
    loading: orgLoading,
    error: orgError,
  } = useSelector((state) => state.organization);

  const [darkMode, setDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '' });
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [activeView, setActiveView] = useState('kanban');

  const currentUserId = JSON.parse(localStorage.getItem('loggedInUser'))?.userId;

  const myMembership = selectedOrganization?.members.find((member) => {
    const memberId =
      typeof member.userId === 'object' ? member.userId.userId : member.userId;
    return String(memberId) === String(currentUserId);
  });

  const myRole = myMembership?.role ?? 'member';
  const isPrivileged = myRole === 'admin' || myRole === 'coordinator';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (orgId) {
      dispatch(fetchOrganizationDetails(orgId));
    }
    return () => {
      dispatch(clearSelectedOrganization());
    };
  }, [dispatch, orgId]);

  useEffect(() => {
    if (selectedOrganization?._id === orgId) {
      setEditData({ name: selectedOrganization.name });
    }
  }, [selectedOrganization, orgId]);

  const handleAddMember = (e) => {
    e.stopPropagation();
    navigate(`/organizations/${orgId}/add-member`);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
    
      await api.put(
        `/organizations/${orgId}`,
        editData
      );
      dispatch(fetchOrganizationDetails(orgId));
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update organization:', err);

    }
  };

  const handleDeleteMember = async (member) => {
    try {
      const memberId = typeof member.userId === 'object' 
        ? member.userId.userId 
        : member.userId;


      await api.delete(
        `/organizations/${orgId}/members/${memberId}`
      );
      dispatch(fetchOrganizationDetails(orgId));
    } catch (err) {
      console.error('Failed to delete member:', err);
 
    }
  };

  if (orgLoading || !selectedOrganization || selectedOrganization._id !== orgId) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <BuildingOfficeIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {orgError ? 'Error Loading Organization' : 'Loading Organization...'}
            </h2>
            <p className="text-gray-400">
              {orgError 
                ? `${orgError.message || orgError}`
                : 'Please wait while we fetch the details'
              }
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const membersToShow = selectedOrganization.members.slice(0, 4);
  const hasMoreMembers = selectedOrganization.members.length > 4;

  const getRoleConfig = (role) => {
    const configs = {
      admin: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: '👑' },
      coordinator: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: '⭐' },
      member: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: '👤' }
    };
    return configs[role] || configs.member;
  };

  return (
    <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-gray-800 to-zinc-900 text-white">
          
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-500/10 to-red-600/10 rounded-full blur-3xl"></div>
            </div>

        <div className="relative p-6">
          {/* Project Disclaimer */}
          {/* <div className="mb-8">
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">⚠️</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-amber-300 font-semibold text-lg">Project Disclaimer</h3>
                  <p className="text-amber-200 text-sm leading-relaxed">
                    <strong>Note:</strong> This is a project by{' '}
                    <a 
                      href="https://github.com/Arun-kushwaha007" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-100 font-medium hover:text-amber-50 underline decoration-amber-300 hover:decoration-amber-200 transition-all duration-200"
                    >
                      Arun Kushwaha
                    </a>
                    . This is not an official or registered organization management service.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-amber-400 text-xs">📚 Educational Project</span>
                    <span className="text-amber-500">•</span>
                    <span className="text-amber-400 text-xs">🚧 Demo Purposes</span>
                    <span className="text-amber-500">•</span>
                    <span className="text-amber-400 text-xs">👨‍💻 Portfolio Work</span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Organization Header */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BuildingOfficeIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      className="text-4xl font-bold bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Organization name..."
                    />
                  ) : (
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {selectedOrganization.name}
                    </h1>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">
                      {selectedOrganization.members.length} members
                    </span>
                    {/* <span className="text-gray-600">•</span>
                    <span className="text-gray-400 text-sm">
                      {selectedOrganization.tasks?.length || 0} tasks
                    </span> */}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isPrivileged && (
                  <button
                    onClick={handleAddMember}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <UserPlusIcon className="w-4 h-4" />
                    Add Member
                  </button>
                )}

                {isPrivileged && (
                  isEditing ? (
                    <div className="flex gap-2">
                      {/* <button
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Save
                      </button> */}
                      <button
                        onClick={handleEditToggle}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                  )
                )}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveView('kanban')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  activeView === 'kanban'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                <ViewColumnsIcon className="w-4 h-4" />
                Kanban View
              </button>
              <button
                onClick={() => setActiveView('calendar')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  activeView === 'calendar'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                Calendar View
              </button>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
              {activeView === 'kanban' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <ViewColumnsIcon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Tasks - Kanban Board</h2>
                  </div>
                  <KanbanBoard
                    tasks={selectedOrganization.tasks || []}
                    isPrivileged={isPrivileged}
                  />
                </>
              )}

              {activeView === 'calendar' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Tasks - Calendar View</h2>
                  </div>
                  <OrgCalendarView />
                </>
              )}
            </div>
          </div>

          {/* Task Report Dashboard */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                {/* <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2> */}
              </div>
              <TaskReportDashboard
                tasks={selectedOrganization.tasks || []}
              />
            </div>
          </div>

          {/* Members Section */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <UserGroupIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Team Members</h2>
              </div>
              
              {myRole && (
                <>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRoleConfig(myRole).bg} ${getRoleConfig(myRole).border}`}>
                  <span className="text-sm">{getRoleConfig(myRole).icon}</span>
                  <span className={`text-sm font-medium ${getRoleConfig(myRole).color}`}>
                    Your role: {myRole}
                  </span>
                  
                </div>
                <div className="flex items-center gap-3">
                                {isPrivileged && (
                                  <></>
                                  // <button
                                  //   onClick={handleAddMember}
                                  //   className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                  // >
                                  //   <UserPlusIcon className="w-4 h-4" />
                                  //   Add Member
                                  // </button>
                                )}
                
                                {isPrivileged && (
                                  isEditing ? (
                                    <div className="flex gap-2">
                                      {/* <button
                                        onClick={handleSave}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                      >
                                        <CheckIcon className="w-4 h-4" />
                                        Save
                                      </button> */}
                                      <button
                                        onClick={handleEditToggle}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                      >
                                        <XMarkIcon className="w-4 h-4" />
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={handleEditToggle}
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                      Edit
                                    </button>
                                  )
                                )}
                              </div>
                </>
                
              )}
              
            </div>

            <div className="grid gap-4 mb-6">
              {membersToShow.map((member) => {
                const roleConfig = getRoleConfig(member.role);
                return (
                  <div
                    key={member.userId?._id || member._id}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-lg">{roleConfig.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {member.userId?.name || 'Unknown'}
                          </h3>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${roleConfig.bg} ${roleConfig.border} ${roleConfig.color}`}>
                            <ShieldCheckIcon className="w-3 h-3" />
                            {member.role}
                          </div>
                        </div>
                      </div>
                      
                      {isEditing && isPrivileged && (
                        <button
                          onClick={() => handleDeleteMember(member)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          <TrashIcon className="w-3 h-3" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMoreMembers && (
              <button
                onClick={() => setShowAllMembers(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <EyeIcon className="w-4 h-4" />
                View All Members ({selectedOrganization.members.length})
              </button>
            )}
          </div>
        </div>

        {/* Members Modal */}
        {showAllMembers && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">All Team Members</h2>
                </div>
                <button
                  onClick={() => setShowAllMembers(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="grid gap-3">
                {selectedOrganization.members.map((member) => {
                  const roleConfig = getRoleConfig(member.role);
                  return (
                    <div
                      key={member.userId?._id || member._id}
                      className="bg-gray-700/50 border border-gray-600/50 rounded-lg p-4 hover:border-gray-500/50 transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-sm">{roleConfig.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">
                              {member.userId?.name || 'Unknown'}
                            </h3>
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${roleConfig.bg} ${roleConfig.border} ${roleConfig.color}`}>
                              {member.role}
                            </div>
                          </div>
                        </div>
                        
                        {isEditing && isPrivileged && (
                          <button
                            onClick={() => handleDeleteMember(member)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors duration-200"
                          >
                            <TrashIcon className="w-3 h-3" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowAllMembers(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizationDetails;