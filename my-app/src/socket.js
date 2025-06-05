import { io } from 'socket.io-client';

// Use Vite's environment variable for the backend URL, with a fallback for development
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const socket = io(backendUrl);

export default socket;
