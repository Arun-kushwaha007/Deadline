// src/hooks/useFCMToken.js
import { messaging, getToken } from '../firebase';
import { useEffect } from 'react';

const useFCMToken = () => {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' }) // From Firebase Cloud Messaging settings
          .then((currentToken) => {
            if (currentToken) {
              console.log('FCM Token:', currentToken);
              // TODO: Send this token to your backend and store it for the user
            }
          })
          .catch((err) => {
            console.error('An error occurred while retrieving token. ', err);
          });
      }
    });
  }, []);
};

export default useFCMToken;
