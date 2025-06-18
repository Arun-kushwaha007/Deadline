/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

self.addEventListener('install', () => {
  console.log('✅ Service worker installed');
});

async function initFirebaseMessaging() {
  const res = await fetch('/firebase-config.json');
  const firebaseConfig = await res.json();

  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

initFirebaseMessaging();
