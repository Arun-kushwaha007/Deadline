import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectOrganization } from '../../redux/organizationSlice';
import {
  BuildingOfficeIcon,
  UsersIcon,
  EyeIcon,
  UserPlusIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

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


  const getRoleConfig = (role) => {
    const configs = {
      admin: { 
        color: 'text-red-400', 
        bg: 'bg-destructive/20', 
        border: 'border-red-500/30', 
        icon: ShieldCheckIcon,
        label: 'Administrator' 
      },
      coordinator: { 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-500/20', 
        border: 'border-yellow-500/30', 
        icon: StarIcon,
        label: 'Coordinator' 
      },
      member: { 
        color: 'text-primary', 
        bg: 'bg-primary/20', 
        border: 'border-blue-500/30', 
        icon: UserIcon,
        label: 'Member' 
      }
    };
    return configs[role] || configs.member;
  };

  const roleConfig = getRoleConfig(myRole);
  const RoleIcon = roleConfig.icon;

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

  const isPrivileged = myRole === 'admin' || myRole === 'coordinator';

  return (
    <div className="group relative">
      <div
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.01]"
        onClick={handleSelect}
        onDoubleClick={handleViewDetails}
      >
        {/* Header Section */}
        <div className="bg-muted p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center shadow-sm">
                <BuildingOfficeIcon className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground truncate max-w-[200px]">
                  {organization.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <UsersIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    {organization.members.length} member{organization.members.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Role Badge */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${roleConfig.bg} ${roleConfig.border}`}>
              <RoleIcon className={`w-4 h-4 ${roleConfig.color}`} />
              <span className={`text-xs font-medium ${roleConfig.color}`}>
                {roleConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* User Info */}
          <div className="mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${roleConfig.bg} ${roleConfig.border}`}>
              <RoleIcon className={`w-4 h-4 ${roleConfig.color}`} />
              <span className={`text-sm font-medium ${roleConfig.color}`}>
                Your role: {myRole}
              </span>
              {myName && myName !== 'You' && (
                <span className="text-muted-foreground text-sm">({myName})</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 hover:scale-[1.01] shadow-sm"
              onClick={handleSelect}
            >
              <CheckCircleIcon className="w-4 h-4" />
              Select
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border font-medium rounded-lg transition-all duration-200 hover:scale-[1.01] shadow-sm"
              onClick={handleViewDetails}
            >
              <EyeIcon className="w-4 h-4" />
              View Details
            </button>

            {isPrivileged && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 hover:scale-[1.01] shadow-sm"
                onClick={handleAddMember}
              >
                <UserPlusIcon className="w-4 h-4" />
                Add Member
              </button>
            )}
          </div>
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-2xl"></div>
      </div>
    </div>
  );
};

export default OrganizationCard;