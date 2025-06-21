import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// ✅ Firebase config using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_AI_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AI_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_AI_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_AI_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_AI_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_AI_FIREBASE_APP_ID,
};

// ✅ Initialize Firebase app once
const firebaseApp = initializeApp(firebaseConfig);

/**
 * ✅ Returns a messaging instance if supported; otherwise, returns null.
 */
const getMessagingInstance = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('🚫 Firebase Messaging is not supported in this browser.');
      return null;
    }

    const messaging = getMessaging(firebaseApp);
    console.log('✅ Firebase Messaging initialized.');
    return messaging;
  } catch (err) {
    console.error('❌ Error initializing Firebase Messaging:', err);
    return null;
  }
};

// ✅ Export utility functions for usage in your hooks
export { getMessagingInstance, getToken, onMessage };
