import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { onMessage } from 'firebase/messaging';
import { messaging } from './firebase';
import { SocketProvider } from './context/SocketContext';
import AllApiRoutes from './AllApiRoutes';

const socket = io('http://localhost:5000', {
  withCredentials: true,
});
 
function App() {
  useEffect(() => {
    onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        // Show notification using toast/snackbar
      });
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
      <AllApiRoutes />
    </SocketProvider>
  );
}

export default App;
