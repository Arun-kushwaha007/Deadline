import admin from 'firebase-admin';

let firebaseAdminInitialized = false;

function cleanPrivateKey(key) {
  // Remove wrapping quotes if present
  if (key && key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, '\n');
}

if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_CLIENT_EMAIL

) {
  try {
    // Avoid initializing Firebase more than once (especially in dev with hot-reloading)
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: cleanPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
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
    '⚠️ Firebase Admin SDK not initialized. Missing environment variables.'
  );
}

export { admin, firebaseAdminInitialized };
