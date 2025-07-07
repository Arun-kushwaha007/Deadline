// src/App.js
import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { onMessage } from 'firebase/messaging';
import { getMessagingInstance } from './firebase'; 
import { useDispatch } from 'react-redux';
import { addNotification } from './redux/slices/notificationSlice';
import useFCMToken from './hooks/useFCMToken';
import { SocketProvider } from './context/SocketContext';
import AllApiRoutes from './AllApiRoutes';

function App() {
  const dispatch = useDispatch();
   useFCMToken(); 
  useEffect(() => {
    let unsubscribeOnMessage = () => {};

    const setupOnMessage = async () => {
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      unsubscribeOnMessage = onMessage(messaging, (payload) => {
        console.log('📩 FCM foreground message:', payload);

        const notificationData = {
          _id: payload.data?.notificationId || new Date().toISOString(),
          message: payload.notification?.body || payload.data?.message || 'New notification',
          type: payload.data?.type || 'info',
          isRead: false,
          relatedEntity: payload.data?.relatedEntity,
          entityModel: payload.data?.entityModel,
          createdAt: payload.data?.createdAt || new Date().toISOString(),
        };

        dispatch(addNotification(notificationData));

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
    };

    setupOnMessage();

    return () => {
      unsubscribeOnMessage();
    };
  }, [dispatch]);

  return (
    <SocketProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AllApiRoutes />
    </SocketProvider>
  );
}

export default App;
