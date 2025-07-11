// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store'; 
import App from './App';
import './index.css';
import { ThemeProvider } from './utils/theme';
import { GoogleOAuthProvider } from '@react-oauth/google';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./firebase-messaging-sw.js')
    .then((registration) => {
      console.log('🔥 Service Worker registered:', registration);
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
}



<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"></GoogleOAuthProvider>

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="105129946434-uh1ior3cai9gao46r0cnjqkebjj4kl71.apps.googleusercontent.com">
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
</GoogleOAuthProvider>
  </React.StrictMode>
);
