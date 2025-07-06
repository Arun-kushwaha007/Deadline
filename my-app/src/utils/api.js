// utils/api.js
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = {
  // GET request
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    console.log(`[api.js] Token for GET ${endpoint}:`, token); // Debug log
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.json();
  },

  // POST request
  post: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    console.log(`[api.js] Token for POST ${endpoint}:`, token); // Debug log
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // PUT request
  put: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    console.log(`[api.js] Token for PUT ${endpoint}:`, token); // Debug log
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // DELETE request
  delete: async (endpoint) => {
    const token = localStorage.getItem('token');
    console.log(`[api.js] Token for DELETE ${endpoint}:`, token); // Debug log
    // console.log('Token from localStorage in api.delete:', token); // <-- ADDED THIS (original line, now replaced)
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    // console.log('Headers in api.delete:', headers); // <-- AND THIS (original line, now replaced)
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'DELETE',
      headers: headers, // Use the constructed headers
    });
    return response.json();
  },
};

export default api;