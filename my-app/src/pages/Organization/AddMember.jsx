import React, { useState, useEffect, useRef } from 'react';

import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/organisms/DashboardLayout';

const AddMember = () => {
  const { id: orgId } = useParams();
  const [mode, setMode] = useState('userId');

  const [joiningUserId, setJoiningUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const dropdownRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await fetch(`${backendUrl}/api/users/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        if (response.ok) {
          setSearchResults(data.users || []);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    const delayDebounce = setTimeout(fetchUsers, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleInvite = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`${backendUrl}/api/organizations/${orgId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser._id }),
      });
      const data = await response.json();
      setMessage(response.ok ? `✅ Invitation sent to ${selectedUser.name}` : `❌ ${data.message}`);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedUser(null);
    } catch (error) {
      console.error('Invite error:', error);
      setMessage('❌ Failed to send invite.');
    }
  };

  const handleSuggestionClick = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.name);
    setSearchResults([]);
  };

  // click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow-lg bg-slate-800 text-white">
        <h2 className="text-xl font-bold mb-4">Add a Member to Your Organization</h2>

        {/* Mode Toggle */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${mode === 'userId' ? 'bg-blue-600' : 'bg-gray-600'}`}
            onClick={() => setMode('userId')}
          >
            Add by User ID
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === 'search' ? 'bg-blue-600' : 'bg-gray-600'}`}
            onClick={() => setMode('search')}
          >
            Invite by Search
          </button>
        </div>

        {/* Add by ID Mode */}
        {mode === 'userId' && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const response = await fetch(`${backendUrl}/api/organizations/${orgId}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ joiningUserId }),
              });
              const data = await response.json();
              setMessage(response.ok ? '✅ User added to the organization!' : `❌ ${data.message}`);
            } catch (error) {
              console.error('Error:', error);
              setMessage('❌ An error occurred.');
            }
          }} className="space-y-4">
            <label className="block font-medium">User ID</label>
            <input
              type="text"
              value={joiningUserId}
              onChange={(e) => setJoiningUserId(e.target.value)}
              placeholder="Enter User ID"
              className="w-full p-2 border rounded text-black"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
              Add to Organization
            </button>
          </form>
        )}

        {/* Search and Invite Mode */}
        {mode === 'search' && (
          <div className="relative space-y-4" ref={dropdownRef}>
            <label className="block font-medium">Search Users</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedUser(null); // reset selection if user changes input
              }}
              placeholder="Enter user name or email"
              className="w-full p-2 border rounded text-black"
            />

            {searchResults.length > 0 && (
              <ul className="absolute z-10 bg-white text-black w-full mt-1 rounded shadow-md max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <li
                    key={user._id}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(user)}
                  >
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            )}

            {selectedUser && (
              <div className="mt-2">
                <p>
                  Invite <strong>{selectedUser.name}</strong> ({selectedUser.email})?
                </p>
                <button
                  onClick={handleInvite}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                >
                  Send Invite
                </button>
              </div>
            )}
          </div>
        )}

        {message && <div className="mt-4 text-sm text-center text-green-400">{message}</div>}
      </div>
    </DashboardLayout>
  );
};

export default AddMember;