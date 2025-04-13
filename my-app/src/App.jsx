// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'react-hot-toast';

import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import { SocketProvider } from './context/SocketContext';

const socket = io('http://localhost:5000'); // your backend URL

function App() {
  useEffect(() => {
    console.log('Connecting to socket...');

    const user = JSON.parse(localStorage.getItem('Profile'));

    if (user?.result?._id) {
      console.log('Registering user:', user.result._id);
      socket.emit('register', user.result._id);
    }

    socket.on('taskAssigned', (data) => {
      console.log('Received taskAssigned:', data);
      toast.success(data.message); // Use toast for notification
    });

    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    };
  }, []);

  return (
    <SocketProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;
