import { useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Added import
import { Toaster, toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { onMessage } from 'firebase/messaging';
import { messaging } from './firebase'; // messaging can be null
import { SocketProvider } from './context/SocketContext';
import AllApiRoutes from './AllApiRoutes';
// import { addNotification } from './redux/slices/notificationsSlice'; // Added import
import { addNotification } from './redux/slices/NotificationSlice';
const socket = io('http://localhost:5000', {
  withCredentials: true,
});
 
function App() {
  const dispatch = useDispatch(); // Added dispatch

  useEffect(() => {
    let unsubscribeOnMessage = () => {}; // Initialize with a no-op function or undefined

    if (messaging) { // Check if messaging is initialized
      unsubscribeOnMessage = onMessage(messaging, (payload) => { // Assign the actual unsubscriber
        console.log('FCM Message received in foreground: ', payload);
        
        // Extract notification data from payload
        // Backend (server/utils/notificationUtils.js) sends:
        // payload.notification.title, payload.notification.body
        // payload.data: { notificationId, type, relatedEntity, entityModel, createdAt }
        const notificationData = {
          _id: payload.data?.notificationId || new Date().toISOString(), // Use ID from data or generate one
          message: payload.notification?.body || payload.data?.message || 'New notification',
          type: payload.data?.type || 'info',
          isRead: false, // New notifications are unread
          relatedEntity: payload.data?.relatedEntity,
          entityModel: payload.data?.entityModel,
          createdAt: payload.data?.createdAt || new Date().toISOString(),
          // title: payload.notification?.title, // Store if your Redux state supports it
        };
        
        dispatch(addNotification(notificationData));
        
        // Show a toast for the foreground notification
        if (payload.notification?.body) {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white dark:bg-zinc-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 dark:ring-zinc-700`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {payload.notification.title || 'New Notification'}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {payload.notification.body}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Close
                </button>
              </div>
            </div>
          ), { duration: 6000 });
        }
      });
      // Set up other event listeners like 'taskAssigned' from socket
      // This part of the useEffect should be merged carefully if it was separate
      // For now, assuming this onMessage is the primary focus for this part of useEffect
      // The original socket event listeners are outside this `if (messaging)` block.
      // It's better to return unsubscribeOnMessage from this specific effect block
      // or handle cleanup more granularly if mixing with other socket logic.
      // For now, let's assume it should be cleaned up.
      // The original return () => socket.disconnect() might be too broad if socket is used elsewhere.
      // Let's keep the original socket logic separate for clarity and only return unsubscribeOnMessage here.
      // This means we might have two useEffects or merge them carefully.
      // For this subtask, I'll focus on adding the onMessage listener and its cleanup.
      // The existing socket listeners will remain in their own effect or need to be merged.
      // The prompt implies adding to an existing useEffect.
      // The original useEffect has socket.on('taskAssigned', ...) which is fine.
      // The onMessage listener should be added alongside it.
      // Cleanup is handled in the main return statement of useEffect
    } else {
      console.log("Firebase Messaging not initialized. Foreground messages will not be handled by onMessage.");
    }

    // --- Existing socket logic from original useEffect ---
    console.log('📡 Connecting to socket...');
    const user = JSON.parse(localStorage.getItem('Profile'));

    if (user?.result?._id) {
      console.log('📨 Registering user:', user.result._id);
      socket.emit('register', user.result._id);
    }

    socket.on('taskAssigned', (data) => { // This is a custom socket event, not FCM
      console.log('🔔 Task Assigned (Socket Event):', data);
      // This toast is for the custom 'taskAssigned' socket event, not for general FCM.
      // Keep it if it's distinct from FCM notifications for tasks.
      // If FCM handles task assignment notifications, this might be redundant or for a different purpose.
      toast.success(data.message); 
    });

    // Cleanup function for the main useEffect
    return () => {
      // The onMessage unsubscribe is handled if messaging was initialized
      // This is tricky because unsubscribeOnMessage is in a conditional scope.
      // A better pattern might be to declare unsubscribeOnMessage outside the if,
      // assign it inside, and call it if it exists.
      // For now, let's assume the if (messaging) block handles its own cleanup if it runs.
      // The original code structure was:
      // useEffect(() => { onMessage(...); socket.on(...); return () => socket.disconnect(); });
      // This needs careful handling of multiple listener cleanups.
      
      unsubscribeOnMessage(); // Call the stored unsubscribe function
      socket.disconnect();
      console.log('🔌 Socket disconnected');
    };
  }, [dispatch]); // Added dispatch to dependency array

  return (
    <SocketProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AllApiRoutes />
    </SocketProvider>
  );
}

export default App;
