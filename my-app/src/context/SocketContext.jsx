// src/context/SocketContext.js
import { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTask, updateTask, deleteTaskThunk } from '../redux/slices/tasksSlice';
import { addNotification } from '../redux/slices/notificationSlice';
import socket from '../socket';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

 useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user?.userId) {
      console.log(`[SocketContext] Attempting to register user with userId: ${user.userId}`); // Added log
      socket.emit('register', user.userId);
    } else {
      console.warn('[SocketContext] No user.userId found in localStorage for socket registration.'); // Added log
    }
    
      
   socket.on('connect', () => {
     console.log('✅ Socket connected:', socket.id);
   });
 
   socket.on('taskAssigned', (data) => {
     if (data?.task) dispatch(createTask(data.task));
   });
 
   socket.on('newNotification', (notification) => {
     if (notification) dispatch(addNotification(notification));
   });
 
   socket.on('taskUpdated', (updatedTask) => {
     if (updatedTask) dispatch(updateTask(updatedTask));
   });
 
   socket.on('taskDeleted', (data) => {
     if (data?.id) dispatch(deleteTaskThunk(data.id));
   });
 
   // ✅ Optional: disconnect only on page unload
   const handleBeforeUnload = () => {
     socket.disconnect();
   };
   window.addEventListener('beforeunload', handleBeforeUnload);
 
   return () => {
     socket.off('taskAssigned');
     socket.off('taskUpdated');
     socket.off('taskDeleted');
     socket.off('newNotification');
     window.removeEventListener('beforeunload', handleBeforeUnload);
     // ✅ DO NOT disconnect here — let it persist across route changes
   };
 }, [dispatch]);
 
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
