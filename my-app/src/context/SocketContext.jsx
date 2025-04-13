import { createContext, useContext, useEffect } from 'react';
import socket from '../socket';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('Profile'));
    if (user?.result?._id) {
      socket.emit('register', user.result._id);
    }

    socket.on('taskAssigned', (data) => {
      alert(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
