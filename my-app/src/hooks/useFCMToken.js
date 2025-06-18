import { useEffect } from 'react';
import { messaging } from '../firebase'; // messaging should be initialized in firebase.js
import { getToken } from 'firebase/messaging';
import api from '../utils/api';

const useFCMToken = () => {
  useEffect(() => {
    const requestAndSendToken = async () => {
      if (!messaging) {
        console.warn("🚫 Firebase Messaging not initialized. Skipping FCM token retrieval.");
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('🔒 Notification permission not granted.');
          return;
        }

        const vapidKey = import.meta.env.VITE_AI_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
          console.error('❌ Missing VAPID key in environment variables.');
          return;
        }

        const currentToken = await getToken(messaging, { vapidKey });

        if (currentToken) {
          console.log('✅ FCM Token obtained:', currentToken);

          try {
            await api.post('/notifications/token', { token: currentToken });
            console.log('📬 FCM token sent to backend successfully.');
          } catch (err) {
            console.error('❌ Failed to send FCM token to backend:', err);
          }
        } else {
          console.log('⚠️ No registration token available.');
        }
      } catch (err) {
        console.error('❌ Error retrieving token or requesting permission:', err);
      }
    };

    requestAndSendToken();
  }, []);
};

export default useFCMToken;
