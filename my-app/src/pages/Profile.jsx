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
  const [isDarkMode, setIsDarkMode] = useState(true); // Default: dark mode

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!user) return <div className="p-4 text-center text-lg">Please log in to view your profile.</div>;

  return (
    <DashboardLayout>
      <div
        className={`max-w-2xl mx-auto p-6 rounded-2xl mt-10 shadow-lg transition-all duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">Hello, {user.name} 👋</h1>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-black'
            }`}
          >
            {isDarkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* User ID */}
        <div className="mb-5">
          <label className="block mb-1 font-semibold">User ID</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={user.userId || 'N/A'}
              readOnly
              className={`w-full border px-3 py-2 rounded-md cursor-not-allowed ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
              }`}
            />
            <button
              onClick={handleCopyUserId}
              className={`px-3 py-2 rounded-md font-medium ${
                isDarkMode
                  ? 'bg-orange-600 hover:bg-orange-500 text-white'
                  : 'bg-orange-500 hover:bg-orange-400 text-white'
              }`}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="mb-5">
          <label className="block mb-1 font-semibold">Profile Picture</label>
          {preview && (
            <img
              src={preview}
              alt="Profile Preview"
              className="h-24 w-24 rounded-full my-2 border-2 border-orange-400"
            />
          )}
          <input
            type="file"
            onChange={handleImageUpload}
            className={`w-full px-3 py-2 rounded-md ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
            }`}
          />
        </div>

        {/* Bio */}
        <div className="mb-5">
          <label className="block mb-1 font-semibold">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="3"
            className={`w-full border px-3 py-2 rounded-md resize-none ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
            }`}
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Section */}
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Section (e.g., Skills, Achievements)</label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className={`w-full border px-3 py-2 rounded-md ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
            }`}
            placeholder="E.g. Full Stack Developer"
          />
        </div>

        {/* Update Button */}
        <div className="text-right">
          <button
            onClick={handleUpdate}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              isDarkMode
                ? 'bg-orange-600 hover:bg-orange-500 text-white'
                : 'bg-orange-500 hover:bg-orange-400 text-white'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
