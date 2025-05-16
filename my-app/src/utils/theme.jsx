import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

 // src/utils/theme.jsx
 useEffect(() => {
   const root = window.document.documentElement;
   if (theme === 'dark') {
     root.classList.add('custom-dark');
     root.classList.remove('custom-light');
   } else {
     root.classList.add('custom-light');
     root.classList.remove('custom-dark');
   }
   localStorage.setItem('theme', theme);
 }, [theme]);
 

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
