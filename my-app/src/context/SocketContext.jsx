// src/context/SocketContext.js
import { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  createTask, 
  updateTask, 
  deleteTaskThunk, 
  applyTaskUpdateFromSocket,
  applyTaskCreationFromSocket 
} from '../redux/slices/tasksSlice';
import { addNotification } from '../redux/slices/notificationSlice';
import socket from '../socket';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

 useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user?.userId) {
      console.log(`[SocketContext] Attempting to register user with userId: ${user.userId}`); 
      socket.emit('register', user.userId);
    } else {
      console.warn('[SocketContext] No user.userId found in localStorage for socket registration.'); 
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
 
  
   const handleBeforeUnload = () => {
     socket.disconnect();
   };
   window.addEventListener('beforeunload', handleBeforeUnload);
 
   // Listener for the new event
   const handleTaskUpdatedInOrg = (updatedTaskData) => {
     console.log('[SocketContext] Received task_updated_in_organization:', updatedTaskData);
  
     dispatch(applyTaskUpdateFromSocket(updatedTaskData));
   };

   socket.on('task_updated_in_organization', handleTaskUpdatedInOrg);
 
    // Listener for new task creation event
    const handleTaskCreatedInOrg = (newTaskData) => {
      console.log('[SocketContext] Received task_created_in_organization:', newTaskData);
      dispatch(applyTaskCreationFromSocket(newTaskData));
    };

    socket.on('task_created_in_organization', handleTaskCreatedInOrg);

   return () => {
     socket.off('taskAssigned');
     
     socket.off('taskUpdated'); 
     socket.off('taskDeleted');
     socket.off('newNotification');
     socket.off('task_updated_in_organization', handleTaskUpdatedInOrg); // Clean up new listener
      socket.off('task_created_in_organization', handleTaskCreatedInOrg); // Clean up new listener
     window.removeEventListener('beforeunload', handleBeforeUnload);
  
   };
 }, [dispatch]);
 
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
