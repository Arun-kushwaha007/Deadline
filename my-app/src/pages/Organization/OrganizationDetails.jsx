import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrganizationDetails,
  clearSelectedOrganization,
} from '../../redux/organizationSlice';

import DashboardLayout from '../../components/organisms/DashboardLayout';
import KanbanBoard from '../../components/organisms/KanbanBoard';
import TaskReportDashboard from '../../components/organisms/TaskReportDashboard';

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
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await axios.put(
        `${backendUrl}/api/organizations/${orgId}`,
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
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await axios.delete(
        `${backendUrl}/api/organizations/${orgId}/members/${
          typeof member.userId === 'object'
            ? member.userId._id
            : member.userId
        }`
      );
      dispatch(fetchOrganizationDetails(orgId));
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  if (orgLoading || !selectedOrganization || selectedOrganization._id !== orgId) {
    return (
      <div className="p-6 text-lg text-center dark:text-white">
        {orgError
          ? `Error: ${orgError.message || orgError}`
          : 'Loading organization...'}
      </div>
    );
  }

  const membersToShow = selectedOrganization.members.slice(0, 4);
  const hasMoreMembers =
    selectedOrganization.members.length > 4;

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Org Header */}
        <div className="flex justify-between items-center mb-6">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleChange}
              className="text-4xl font-extrabold px-3 py-2 border dark:bg-gray-800 dark:border-gray-700 rounded-md"
            />
          ) : (
            <h1 className="text-4xl font-extrabold">
              {selectedOrganization.name}
            </h1>
          )}

          <div className="flex gap-3">
            {isPrivileged && (
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
              >
                Add Member
              </button>
            )}

            {isPrivileged &&
              (isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md shadow hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
                >
                  Edit
                </button>
              ))}
          </div>
        </div>

        {/* Tasks Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Tasks</h2>
          <KanbanBoard
            tasks={selectedOrganization.tasks || []}
            isPrivileged={isPrivileged}
          />
        </section>

        <section className="mt-[-200px]">
          <TaskReportDashboard
            tasks={selectedOrganization.tasks || []}
          />
        </section>

        {/* Members Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
            Members
          </h2>

          <ul className="space-y-2">
            {membersToShow.map((member) => (
              <li
                key={member.userId?._id || member._id}
                className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md shadow flex justify-between items-center"
              >
                <div>
                  <strong>
                    {member.userId?.name || 'Unknown'}
                  </strong>{' '}
                  &mdash;
                  <span className="italic"> {member.role}</span>
                </div>
                {isEditing && isPrivileged && (
                  <button
                    onClick={() => handleDeleteMember(member)}
                    className="ml-4 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>

          {hasMoreMembers && (
            <button
              onClick={() => setShowAllMembers(true)}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded shadow hover:bg-orange-600 transition"
            >
              View All Members
            </button>
          )}
        </section>

        {/* Modal for All Members */}
        {showAllMembers && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                All Members
              </h2>
              <ul className="space-y-2">
                {selectedOrganization.members.map((member) => (
                  <li
                    key={member.userId?._id || member._id}
                    className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <strong>
                        {member.userId?.name || 'Unknown'}
                      </strong>{' '}
                      &mdash;
                      <span className="italic">
                        {' '}
                        {member.role}
                      </span>
                    </div>
                    {isEditing && isPrivileged && (
                      <button
                        onClick={() => handleDeleteMember(member)}
                        className="ml-4 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowAllMembers(false)}
                className="mt-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizationDetails;
