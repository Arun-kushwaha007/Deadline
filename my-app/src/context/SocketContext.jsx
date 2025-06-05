import { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../redux/slices/tasksSlice'; // Import actions
import socket from '../socket';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch(); // Get dispatch function

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('Profile'));
    if (user?.result?._id) {
      socket.emit('register', user.result._id);
    }

    // Listener for taskAssigned event
    socket.on('taskAssigned', (data) => {
      if (data && data.task) {
        dispatch(addTask(data.task));
        console.log('Task assigned via socket:', data.task);
        // Optionally, add user feedback here (e.g., toast notification)
        // alert(data.message); // Keep or remove based on desired UX
      } else {
        console.warn('Received taskAssigned event with missing data:', data);
      }
    });

    // Listener for taskUpdated event
    socket.on('taskUpdated', (updatedTask) => {
      if (updatedTask) {
        dispatch(updateTask(updatedTask));
        console.log('Task updated via socket:', updatedTask);
        // Optionally, add user feedback here
      } else {
        console.warn('Received taskUpdated event with missing data:', updatedTask);
      }
    });

    // Listener for taskDeleted event
    socket.on('taskDeleted', (data) => {
      if (data && data.id) {
        dispatch(deleteTask({ id: data.id }));
        console.log('Task deleted via socket, ID:', data.id);
        // Optionally, add user feedback here
      } else {
        console.warn('Received taskDeleted event with missing data:', data);
      }
    });

    return () => {
      // Clean up listeners when the component unmounts or user changes
      socket.off('taskAssigned');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
      // Consider if socket.disconnect() is appropriate here or if socket instance is managed elsewhere
      // If the socket is global and meant to persist, don't disconnect on every provider unmount.
      // If this provider wraps the whole app and user logs out, then disconnect might be okay.
      // For now, assuming the original disconnect logic was intentional for this component's lifecycle.
      socket.disconnect(); 
    };
  }, [dispatch]); // Add dispatch to dependency array

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
