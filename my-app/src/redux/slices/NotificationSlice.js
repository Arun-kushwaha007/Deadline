import axios from 'axios';

export const sendPushNotification = async (fcmToken, title, body) => {
  try {
    await axios.post(
      'https://fcm.googleapis.com/fcm/send',
      {
        to: fcmToken,
        notification: {
          title,
          body,
        },
      },
      {
        headers: {
          Authorization: `key=YOUR_SERVER_KEY`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending push notification:', error.message);
  }
};
