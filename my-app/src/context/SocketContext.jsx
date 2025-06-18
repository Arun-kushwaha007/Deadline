import { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTask, updateTask, deleteTaskThunk } from '../redux/slices/tasksSlice'; // Use thunks, not old reducers
// import { addNotification } from '../redux/slices/notificationsSlice'; // Added import
import { addNotification } from '../redux/slices/NotificationSlice';
import socket from '../socket';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('Profile'));
    if (user?.result?._id) {
      socket.emit('register', user.result._id);
    }

    // Listener for taskAssigned event
    socket.on('taskAssigned', (data) => {
      if (data && data.task) {
        dispatch(createTask(data.task));
        console.log('Task assigned via socket:', data.task);
      } else {
        console.warn('Received taskAssigned event with missing data:', data);
      }
    });

    // Listener for newNotification event
    socket.on('newNotification', (notification) => {
      if (notification) {
        console.log('New notification received via socket:', notification);
        dispatch(addNotification(notification));
        // TODO: Optionally, trigger a toast notification here (e.g., using react-toastify or similar)
        // Example: toast.info(notification.message);
      } else {
        console.warn('Received newNotification event with missing data:', notification);
      }
    });

    // Listener for taskUpdated event
    socket.on('taskUpdated', (updatedTask) => {
      if (updatedTask) {
        dispatch(updateTask(updatedTask));
        console.log('Task updated via socket:', updatedTask);
      } else {
        console.warn('Received taskUpdated event with missing data:', updatedTask);
      }
    });

    // Listener for taskDeleted event
    socket.on('taskDeleted', (data) => {
      if (data && data.id) {
        dispatch(deleteTaskThunk(data.id));
        console.log('Task deleted via socket, ID:', data.id);
      } else {
        console.warn('Received taskDeleted event with missing data:', data);
      }
    });

    return () => {
      socket.off('taskAssigned');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
      socket.off('newNotification'); // Added cleanup for newNotification listener
      // Consider if socket.disconnect() is desired on every component unmount using this context,
      // or only when the app/user session ends. For now, it's here as per original structure.
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);