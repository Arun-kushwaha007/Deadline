// Placeholder API utility
// In a real application, this would handle base URLs, authentication tokens, etc.

const getToken = () => {
  const profile = localStorage.getItem('Profile');
  if (profile) {
    const { token } = JSON.parse(profile);
    return token;
  }
  return null;
};

const api = {
  get: async (url) => {
    const token = getToken();
    const response = await fetch(`/api${url}`, { // Assuming backend is served under /api prefix
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'API GET request failed');
    }
    return response.json();
  },

  put: async (url, body) => {
    const token = getToken();
    const response = await fetch(`/api${url}`, { // Assuming backend is served under /api prefix
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'API PUT request failed');
    }
    return response.json();
  },
  
  // Add other methods like post, delete as needed
};

export default api;
