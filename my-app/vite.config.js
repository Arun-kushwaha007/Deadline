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
};

