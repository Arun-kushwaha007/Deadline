// src/hooks/useFCMToken.js
import { messaging, getToken } from '../firebase'; // messaging can be null if init fails
import { useEffect } from 'react';
import api from '../utils/api'; // Import your API utility

const useFCMToken = () => {
  useEffect(() => {
    if (!messaging) {
      console.log("Firebase Messaging not initialized. Skipping FCM token retrieval.");
      return;
    }

    const requestAndSendToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const currentToken = await getToken(messaging, { 
            vapidKey: import.meta.env.VITE_AI_FIREBASE_VAPID_KEY 
          }); 
          
          if (currentToken) {
            console.log('FCM Token obtained:', currentToken);
            try {
              await api.post('/notifications/token', { token: currentToken });
              console.log('FCM token sent to backend successfully.');
            } catch (error) {
              console.error('Error sending FCM token to backend:', error);
            }
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        } else {
          console.log('Notification permission not granted.');
        }
      } catch (err) {
        console.error('An error occurred while retrieving token or requesting permission: ', err);
      }
    };

    requestAndSendToken();
  }, []); // Empty dependency array means this runs once on mount

  // No return value needed, this hook is for side effects
};

export default useFCMToken;
