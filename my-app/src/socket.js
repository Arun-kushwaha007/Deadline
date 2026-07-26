import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const socket = io(backendUrl, {
  transports: ['websocket'],         // Use WebSocket for real-time performance
  withCredentials: true,             // Needed for CORS and cookie/auth header propagation
  reconnection: true,                // Enable auto-reconnect
  reconnectionAttempts: 5,           // Retry connection 5 times before giving up
  reconnectionDelay: 1000,           // Wait 1s between reconnection attempts
  timeout: 10000,                    // Connection timeout
});

export default socket;
