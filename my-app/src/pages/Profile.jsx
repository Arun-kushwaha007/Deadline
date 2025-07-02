import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/organisms/DashboardLayout';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [section, setSection] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [preview, setPreview] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Default avatar component
  const DefaultAvatar = ({ size = 32 }) => (
    <div 
      className={`w-${size} h-${size} bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    >
      <svg
        className="w-1/2 h-1/2"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
  );

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      if (!parsedUser.userId) {
        alert('User ID is missing. Please log in again.');
        navigate('/login');
        return;
      }
      setUser(parsedUser);
      setBio(parsedUser.bio || '');
      setSection(parsedUser.section || '');
      setProfilePic(parsedUser.profilePic || '');
      setPreview(parsedUser.profilePic || '');
    } else {
      alert('Please log in to view your profile.');
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdate = () => {
    const updatedUser = {
      ...user,
      bio,
      section,
      profilePic: preview,
    };
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setShowEditModal(false);
    alert('✅ Profile updated successfully!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCopyUserId = () => {
    if (user?.userId) {
      navigator.clipboard.writeText(user.userId);
      alert('🔗 User ID copied to clipboard!');
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please log in to view your profile.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const dashboardStats = [
    {
      label: 'Organizations Joined',
      value: 3,
      icon: '🏢',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Tasks Assigned',
      value: 24,
      icon: '📋',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Tasks Pending',
      value: 7,
      icon: '⏰',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      label: 'My Skills',
      value: section || 'N/A',
      icon: '🎯',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-4">
              👤 My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Manage your personal information and track your progress
            </p>
          </div>

          {/* User ID Section */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🔑</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Your Unique ID
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Share this ID with organizations to join their workspace
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={user.userId || 'N/A'}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm cursor-not-allowed"
                />
                <button
                  onClick={handleCopyUserId}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 font-medium shadow-lg"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 shadow-lg"
                      />
                    ) : (
                      <DefaultAvatar size={32} />
                    )}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {user.name}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    📧 {user.email || 'user@example.com'}
                  </p>

                  {bio && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{bio}"
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setShowEditModal(true)}
                    className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 font-medium shadow-lg"
                  >
                    ✏️ Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {dashboardStats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`${stat.bgColor} border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
                        {stat.icon}
                      </div>
                      <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                      {stat.label}
                    </h3>
                    
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  ✏️ Edit Profile
                </h2>
              </div>

              <div className="p-6">
                {/* Profile Picture Section */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    📸 Profile Picture
                  </label>
                  
                  <div className="flex justify-center mb-4">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full border-4 border-orange-400 object-cover shadow-lg"
                      />
                    ) : (
                      <DefaultAvatar size={24} />
                    )}
                  </div>
                  
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                </div>

                {/* Bio Section */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    📝 Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Skills Section */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    🎯 Skills & Expertise
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="E.g. Full Stack Developer, UI/UX Designer"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg transition-all font-medium shadow-lg"
                  >
                    💾 Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;