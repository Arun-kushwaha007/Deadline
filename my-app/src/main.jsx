// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // 👈 import the store
import App from './App';
import './index.css';
import { ThemeProvider } from './utils/theme';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
