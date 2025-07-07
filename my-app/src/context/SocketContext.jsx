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
 
   // Listener for the new event
   const handleTaskUpdatedInOrg = (updatedTaskData) => {
     console.log('[SocketContext] Received task_updated_in_organization:', updatedTaskData);
     // The backend now sends the full task object with 'id'
     // The optimistic update on the sender's side handles their UI.
     // This event is for other users.
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
     // We can potentially remove the generic 'taskUpdated' listener if
     // 'task_updated_in_organization' covers all necessary cases for real-time updates,
     // and 'taskAssigned' handles new assignments.
     // For now, let's keep it to avoid breaking other existing functionality if any.
     socket.off('taskUpdated'); 
     socket.off('taskDeleted');
     socket.off('newNotification');
     socket.off('task_updated_in_organization', handleTaskUpdatedInOrg); // Clean up new listener
      socket.off('task_created_in_organization', handleTaskCreatedInOrg); // Clean up new listener
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
