import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'react-hot-toast';

import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Login from './pages/Login';
// import CreateTeam from './pages/CreateOrganization';
// import JoinTeam from './pages/JoinOrganization';
import ToDoList from './pages/ToDoList';
import Help from './pages/Help';
import Register from './pages/Register';
import { SocketProvider } from './context/SocketContext';
import Profile from './pages/Profile';
import OrganizationDashboard from './components/Organization/OrganiationDashboard';
import JoinOrganization from './pages/JoinOrganization';
import CreateOrganization from './pages/CreateOrganization';

const socket = io('http://localhost:5000', {
  withCredentials: true,
});

function App() {
  useEffect(() => {
    console.log('📡 Connecting to socket...');
    const user = JSON.parse(localStorage.getItem('Profile'));

    if (user?.result?._id) {
      console.log('📨 Registering user:', user.result._id);
      socket.emit('register', user.result._id);
    }

    socket.on('taskAssigned', (data) => {
      console.log('🔔 Task Assigned:', data);
      toast.success(data.message);
    });

    return () => {
      socket.disconnect();
      console.log('🔌 Socket disconnected');
    };
  }, []);

  return (
    <SocketProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/team" element={<Team />} />
        {/* <Route path="/task/:id" element={<TaskDetails />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create_Organization" element={<CreateOrganization />} />
        <Route path="/join_Organization" element={<JoinOrganization />} />
        <Route path="/help" element={<Help />} />
        <Route path="/todo" element={<ToDoList />} />
        {/* <Route path="/profile/:id" element={<Profile />} /> */}
        {/* <Route path="/profile/:id/edit" element={<EditProfile />} /> */}
        <Route path="/organizations" element={<OrganizationDashboard />} />

        

       <Route path="/profile" element={<Profile />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;
