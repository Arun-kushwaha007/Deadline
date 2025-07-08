import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  ChevronDownIcon,
  UsersIcon,
  IdentificationIcon,
  AtSymbolIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/organisms/DashboardLayout';

const AddMember = () => {
  const { id: orgId } = useParams();
  const [mode, setMode] = useState('userId');
  const [role, setRole] = useState('member');

  const [joiningUserId, setJoiningUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]); 
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'|| 'https://deadline-pobb.onrender.com';

  // Role configuration
  const roleConfig = {
    member: {
      icon: UserIcon,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
      label: 'Member',
      description: 'Standard access to organization tasks'
    },
    coordinator: {
      icon: ShieldCheckIcon,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/30',
      label: 'Coordinator',
      description: 'Enhanced permissions and task management'
    }
  };

  // Fetch all users on component mount
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/users/all`);
        const data = await response.json();
        if (response.ok) {
          setAllUsers(data.users || []);
        } else {
          console.error('Failed to fetch users:', data.message);
        }
      } catch (err) {
        console.error('Error fetching all users:', err);
      }
    };

    fetchAllUsers();
  }, [backendUrl]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  const handleInvite = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/organizations/${orgId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joiningUserId: selectedUser.userId, role }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({
          type: 'success',
          text: `${selectedUser.name} successfully added as ${roleConfig[role].label}`
        });
        setSearchQuery('');
        setSelectedUser(null);
        setShowDropdown(false);
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to add user to organization'
        });
      }
    } catch (error) {
      console.error('Invite error:', error);
      setMessage({
        type: 'error',
        text: 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.name);
    setShowDropdown(false);
  };

  const handleUserIdSubmit = async (e) => {
    e.preventDefault();
    if (!joiningUserId.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/organizations/${orgId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joiningUserId, role }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({
          type: 'success',
          text: `User successfully added as ${roleConfig[role].label}`
        });
        setJoiningUserId('');
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to add user to organization'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        type: 'error',
        text: 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-gray-800 to-zinc-900 text-white p-6">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UserPlusIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Add Team Member
                </h1>
                <p className="text-gray-400 text-lg mt-1">
                  Invite users to join your organization
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <UsersIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">
                    Expand your team collaboration
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1 mb-6">
              <button
                onClick={() => setMode('userId')}
                className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                  mode === 'userId'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <IdentificationIcon className="w-4 h-4" />
                Add by User ID
              </button>
              <button
                onClick={() => setMode('search')}
                className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                  mode === 'search'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
                Search & Invite
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
            {/* Add by User ID Mode */}
            {mode === 'userId' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <IdentificationIcon className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Add by User ID</h2>
                </div>

                <form onSubmit={handleUserIdSubmit} className="space-y-6">
                  {/* User ID Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      User ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={joiningUserId}
                        onChange={(e) => setJoiningUserId(e.target.value)}
                        placeholder="Enter User ID"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      Enter the exact User ID of the person you want to add
                    </p>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Select Role
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(roleConfig).map(([roleKey, config]) => (
                        <button
                          key={roleKey}
                          type="button"
                          onClick={() => setRole(roleKey)}
                          className={`p-4 rounded-lg border transition-all ${
                            role === roleKey
                              ? `${config.bg} ${config.border} ring-2 ring-blue-500/50`
                              : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-600/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <config.icon className={`w-5 h-5 ${role === roleKey ? config.color : 'text-gray-400'}`} />
                            <div className="text-left">
                              <div className={`font-medium ${role === roleKey ? 'text-white' : 'text-gray-300'}`}>
                                {config.label}
                              </div>
                              <div className="text-xs text-gray-400">
                                {config.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !joiningUserId.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Adding User...
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="w-4 h-4" />
                        Add to Organization
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Search and Invite Mode */}
            {mode === 'search' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <MagnifyingGlassIcon className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Search & Invite Users (Under Development - Use Id method for now)</h2>
                </div>

                <div className="relative space-y-4" ref={dropdownRef}>
                  {/* Search Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Search Users
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSelectedUser(null);
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Search through all registered users
                    </p>
                  </div>

                  {/* Users Dropdown */}
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <button
                            key={user._id}
                            onClick={() => handleSuggestionClick(user)}
                            className="w-full p-4 text-left hover:bg-gray-700/50 border-b border-gray-700/50 last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-white">{user.name}</div>
                                <div className="text-sm text-gray-400">{user.email}</div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-400">
                          No users found
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected User Section */}
                  {selectedUser && (
                    <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{selectedUser.name}</h3>
                          <p className="text-gray-400">{selectedUser.email}</p>
                        </div>
                      </div>

                      {/* Role Selection for Selected User */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">
                          Assign Role
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(roleConfig).map(([roleKey, config]) => (
                            <button
                              key={roleKey}
                              type="button"
                              onClick={() => setRole(roleKey)}
                              className={`p-4 rounded-lg border transition-all ${
                                role === roleKey
                                  ? `${config.bg} ${config.border} ring-2 ring-blue-500/50`
                                  : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-600/30'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <config.icon className={`w-5 h-5 ${role === roleKey ? config.color : 'text-gray-400'}`} />
                                <div className="text-left">
                                  <div className={`font-medium ${role === roleKey ? 'text-white' : 'text-gray-300'}`}>
                                    {config.label}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {config.description}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Confirm Button */}
                      <button
                        onClick={handleInvite}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Adding Member...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="w-4 h-4" />
                            Confirm & Add Member
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <div className={`mt-6 p-4 rounded-lg border flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-500/20 border-green-500/30 text-green-400'
                  : 'bg-red-500/20 border-red-500/30 text-red-400'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddMember;