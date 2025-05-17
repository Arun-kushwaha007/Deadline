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
  const [isDarkMode, setIsDarkMode] = useState(false); // State for theme toggle

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      console.log('Parsed User:', parsedUser); // Debug log
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
    setUser(updatedUser); // Update local state too
    alert('Profile updated successfully!');
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
    if (user && user.userId) {
      navigator.clipboard.writeText(user.userId);
      alert('User ID copied to clipboard!');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!user) return <div className="p-4">Please log in to view your profile.</div>;

  return (
    <DashboardLayout>
      <div
        className={`max-w-2xl mx-auto p-4 shadow-md rounded-md mt-10 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-medium">User ID</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={user.userId || 'N/A'}
              readOnly
              className={`w-full border p-2 rounded cursor-not-allowed ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'
              }`}
            />
            <button
              onClick={handleCopyUserId}
              className={`px-4 py-2 rounded ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium">Profile Picture</label>
          {preview && (
            <img
              src={preview}
              alt="Profile"
              className="h-24 w-24 rounded-full my-2"
            />
          )}
          <input
            type="file"
            onChange={handleImageUpload}
            className={`p-2 rounded ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'
            }`}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`w-full border p-2 rounded ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'
            }`}
            rows="3"
            placeholder="Write something about yourself..."
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">New Section</label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className={`w-full border p-2 rounded ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'
            }`}
            placeholder="E.g. Skills, Achievements"
          />
        </div>

        <button
          onClick={handleUpdate}
          className={`px-4 py-2 rounded ${
            isDarkMode
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-blue-500 text-white hover:bg-blue-400'
          }`}
        >
          Update Profile
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Profile;