import { io } from 'socket.io-client';

const socket = io('http://localhost:5173'); // replace with backend URL

export default socket;
