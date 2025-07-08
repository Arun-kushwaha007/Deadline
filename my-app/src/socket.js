import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'|| 'https://deadline-pobb.onrender.com';

const socket = io(backendUrl, {
  transports: ['websocket'],         // Use WebSocket only for better performance
  withCredentials: true,             // Needed if you use cookies or auth headers
  reconnection: true,                // Enable auto-reconnect
  reconnectionAttempts: 5,          // Try reconnecting 5 times before giving up
  reconnectionDelay: 1000,          // Wait 1s between reconnection attempts
  timeout: 10000,                    // Connection timeout
});

export default socket;
