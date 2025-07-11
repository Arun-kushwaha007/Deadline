// utils/api.js
let API_BASE_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  API_BASE_URL = 'http://localhost:5000';
} else {
  API_BASE_URL = 'https://deadline-pobb.onrender.com';
}

// Fallback if VITE_BACKEND_URL is explicitly set for production/staging
if (import.meta.env.VITE_BACKEND_URL) {
  API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
}


const api = {
  // GET request
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    console.log(`[api.js] Token for GET ${endpoint}:`, token);
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
    console.log(`[api.js] Token for POST ${endpoint}:`, token); 
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
    console.log(`[api.js] Token for PUT ${endpoint}:`, token); 
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
    console.log(`[api.js] Token for DELETE ${endpoint}:`, token);
    // console.log('Token from localStorage in api.delete:', token); 
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    // console.log('Headers in api.delete:', headers); 
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'DELETE',
      headers: headers, 
    });
    return response.json();
  },
};

export default api;