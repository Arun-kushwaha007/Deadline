// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Replace with your actual Firebase project configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_AI_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AI_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_AI_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_AI_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_AI_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_AI_FIREBASE_APP_ID,
  // measurementId: import.meta.env.VITE_AI_FIREBASE_MEASUREMENT_ID, // Optional
};

let messagingInstance = null;
try {
  const app = initializeApp(firebaseConfig);
  messagingInstance = getMessaging(app);
} catch (error) {
  console.error("Error initializing Firebase app or messaging:", error);
  // Handle cases where Firebase config might be missing or invalid,
  // especially if env vars are not set.
}

// Export a potentially null messaging instance.
// The consuming code (useFCMToken, App.jsx) should check if messagingInstance is truthy.
export { messagingInstance as messaging, getToken, onMessage };
// Remove the redundant lines below, they were duplicated in the previous patch application.
// const messaging = getMessaging(app);
// export { messaging, getToken, onMessage };
