import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Ensure .env is loaded before reading env vars

let firebaseAdminInitialized = false;

function cleanPrivateKey(key) {
  if (!key) return '';
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, '\n');
}

const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;

// console.log('[DEBUG] ENV FIREBASE_PROJECT_ID:', FIREBASE_PROJECT_ID);
// console.log('[DEBUG] ENV FIREBASE_CLIENT_EMAIL:', FIREBASE_CLIENT_EMAIL);
// console.log('[DEBUG] ENV FIREBASE_PRIVATE_KEY (partial):', FIREBASE_PRIVATE_KEY?.slice(0, 30));

if (FIREBASE_PROJECT_ID && FIREBASE_PRIVATE_KEY && FIREBASE_CLIENT_EMAIL) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          privateKey: cleanPrivateKey(FIREBASE_PRIVATE_KEY),
          clientEmail: FIREBASE_CLIENT_EMAIL,
        }),
      });
      console.log('✅ Firebase Admin SDK initialized successfully.');
      firebaseAdminInitialized = true;
    } else {
      console.log('ℹ️ Firebase Admin SDK already initialized.');
      firebaseAdminInitialized = true;
    }
  } catch (error) {
    console.error('🔥 Firebase Admin SDK initialization failed:', error);
  }
} else {
  console.warn(
    '⚠️ Firebase Admin SDK not initialized. Missing environment variables: ' +
      [
        !FIREBASE_PROJECT_ID && 'FIREBASE_PROJECT_ID',
        !FIREBASE_PRIVATE_KEY && 'FIREBASE_PRIVATE_KEY',
        !FIREBASE_CLIENT_EMAIL && 'FIREBASE_CLIENT_EMAIL',
      ]
        .filter(Boolean)
        .join(', ')
  );
}

export { admin, firebaseAdminInitialized };
