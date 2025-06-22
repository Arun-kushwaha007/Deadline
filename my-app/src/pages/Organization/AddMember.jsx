import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/organisms/DashboardLayout';

const AddMember = () => {
  const { id: orgId } = useParams();
  const [mode, setMode] = useState('userId');
  const [role, setRole] = useState('member');

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

    const delayDebounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleInvite = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`${backendUrl}/api/organizations/${orgId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joiningUserId: selectedUser.userId, role }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ ${selectedUser.name} added as ${role}`);
        setSearchQuery('');
        setSelectedUser(null);
        setSearchResults([]);
      } else {
        setMessage(`❌ ${data.message || 'Failed to invite user.'}`);
      }
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
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch(`${backendUrl}/api/organizations/${orgId}/members`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ joiningUserId, role }),
                });
                const data = await response.json();
                if (response.ok) {
                  setMessage('✅ User added to the organization!');
                  setJoiningUserId('');
                } else {
                  setMessage(`❌ ${data.message || 'Failed to add user.'}`);
                }
              } catch (error) {
                console.error('Error:', error);
                setMessage('❌ An error occurred.');
              }
            }}
            className="space-y-4"
          >
            <label className="block font-medium">User ID</label>
            <input
              type="text"
              value={joiningUserId}
              onChange={(e) => setJoiningUserId(e.target.value)}
              placeholder="Enter User ID"
              className="w-full p-2 border rounded text-white"
              required
            />

            <label className="block font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded mb-4 text-white"
            >
              <option value="member">Member</option>
              <option value="coordinator">Coordinator</option>
            </select>

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
                setSelectedUser(null);
              }}
              placeholder="Enter user name or email"
              className="w-full p-2 border rounded text-white"
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
                  Add <strong>{selectedUser.name}</strong> ({selectedUser.email}) as:
                </p>

                <label className="block font-medium mt-4">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 border rounded text-black"
                >
                  <option value="member">Member</option>
                  <option value="coordinator">Coordinator</option>
                </select>

                <button
                  onClick={handleInvite}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                >
                  Confirm Add
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
