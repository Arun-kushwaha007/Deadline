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

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
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
      profilePic: preview
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

  if (!user) return <div className="p-4">Please log in to view your profile.</div>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-4 bg-white text-black shadow-md rounded-md mt-10">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>

        <div className="mb-4">
          <label className="block font-medium">Profile Picture</label>
          {preview && (
            <img
              src={preview}
              alt="Profile"
              className="h-24 w-24 rounded-full my-2"
            />
          )}
          <input type="file" onChange={handleImageUpload} />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border p-2 rounded"
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
            className="w-full border p-2 rounded"
            placeholder="E.g. Skills, Achievements"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
