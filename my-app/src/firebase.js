import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Firebase config using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_AI_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AI_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_AI_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_AI_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_AI_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_AI_FIREBASE_APP_ID,
};

let messagingInstance = null;

try {
  const app = initializeApp(firebaseConfig);

  // Check if the browser supports Firebase messaging
  isSupported().then((supported) => {
    if (supported) {
      messagingInstance = getMessaging(app);
      console.log('✅ Firebase Messaging initialized.');
    } else {
      console.warn('🚫 Firebase Messaging is not supported in this browser.');
    }
  }).catch((err) => {
    console.error('❌ Error checking Firebase messaging support:', err);
  });

} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  // This typically happens if env vars are missing or misconfigured
}

// Export messagingInstance (may be null until support is confirmed)
export { messagingInstance as messaging, getToken, onMessage };
