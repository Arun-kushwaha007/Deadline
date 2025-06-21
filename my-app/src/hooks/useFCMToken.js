import { useEffect, useState } from 'react';
import { getMessagingInstance, getToken } from '../firebase';
// import api from '../utils/api';

const useFCMToken = () => {
  const [tokenStatus, setTokenStatus] = useState({
    token: null,
    sent: false,
    error: null
  });

  useEffect(() => {
    const fetchAndSendToken = async () => {
      try {
        const messaging = await getMessagingInstance();
        if (!messaging) {
          console.warn('❌ Firebase Messaging not available.');
          setTokenStatus(prev => ({ ...prev, error: 'Firebase Messaging not available' }));
          return;
        }

        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('🔒 Notification permission not granted.');
          setTokenStatus(prev => ({ ...prev, error: 'Notification permission not granted' }));
          return;
        }

        const vapidKey = import.meta.env.VITE_AI_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
          console.error('❌ VAPID key is missing.');
          setTokenStatus(prev => ({ ...prev, error: 'VAPID key is missing' }));
          return;
        }

        // Get FCM token
        const token = await getToken(messaging, { vapidKey });
        if (token) {
          console.log('✅ FCM token received:', token);
          setTokenStatus(prev => ({ ...prev, token }));
          
          // Check if token has changed or if we need to send it
          const storedToken = localStorage.getItem('fcmToken');
          const tokenSentFlag = localStorage.getItem('fcmTokenSent');
          
          console.log('🔍 Stored token:', storedToken);
          console.log('🔍 Token sent flag:', tokenSentFlag);
          console.log('🔍 Current token:', token);
          
          // Send token if:
          // 1. No stored token exists (first time)
          // 2. Token has changed
          // 3. Token was never successfully sent to backend
          const shouldSendToken = !storedToken || 
                                 storedToken !== token || 
                                 tokenSentFlag !== 'true';
          
          if (shouldSendToken) {
            console.log('🔄 Sending token to backend...');
            
            // Send token to backend using fetch directly
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const authToken = localStorage.getItem('token');
            
            console.log('🌐 Backend URL:', backendUrl);
            console.log('🔑 Auth token exists:', !!authToken);
            
            const response = await fetch(`${backendUrl}/api/notifications/token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(authToken && { Authorization: `Bearer ${authToken}` }),
              },
              body: JSON.stringify({ token }),
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            if (response.ok) {
              // Store new token and mark as sent
              localStorage.setItem('fcmToken', token);
              localStorage.setItem('fcmTokenSent', 'true');
              setTokenStatus(prev => ({ ...prev, sent: true }));
              console.log('📬 FCM token sent to backend and stored locally.');
            } else {
              const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
              console.error('❌ Failed to send FCM token to backend:', errorData);
              localStorage.setItem('fcmTokenSent', 'false');
              setTokenStatus(prev => ({ ...prev, error: `Failed to send token: ${errorData.message}` }));
            }
          } else {
            console.log('ℹ️ FCM token unchanged and already sent, skipping backend update.');
            setTokenStatus(prev => ({ ...prev, sent: true }));
          }
        } else {
          console.warn('⚠️ No FCM token available. Registration may have failed.');
          setTokenStatus(prev => ({ ...prev, error: 'No FCM token available' }));
        }
      } catch (err) {
        console.error('❌ Failed to get/send FCM token:', err);
        setTokenStatus(prev => ({ ...prev, error: err.message }));
        
        // Clear stored token if there's an error
        if (err.code === 'messaging/registration-token-not-registered' || 
            err.code === 'messaging/invalid-registration-token') {
          localStorage.removeItem('fcmToken');
          localStorage.removeItem('fcmTokenSent');
          console.log('🗑️ Cleared invalid FCM token from storage.');
        }
      }
    };

    fetchAndSendToken();
  }, []);

  // Optional: Return status for debugging or UI feedback
  return tokenStatus;
};

export default useFCMToken;