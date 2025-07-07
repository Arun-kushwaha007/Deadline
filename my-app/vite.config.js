import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0f172a',
        accent: '#7c3aed',
        primary: '#3b82f6'
      }
    },
  },
  plugins: [react(),tailwindcss()],
  server: {
    // port: 3000, // Optional: specify frontend dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Assuming backend runs on port 5000
        changeOrigin: true,
        secure: false, // Set to true if your backend server is HTTPS with a valid certificate
        // Optional: rewrite path if your backend API routes don't start with /api
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
};

