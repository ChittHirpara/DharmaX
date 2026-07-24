import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
  isGenZMode: boolean;
  toggleGenZMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGenZMode, setIsGenZMode] = useState(() => {
    const saved = localStorage.getItem('genz-mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('genz-mode', isGenZMode.toString());
    
    // Add or remove a class to the body for global styling if needed
    if (isGenZMode) {
      document.body.classList.add('genz-mode');
    } else {
      document.body.classList.remove('genz-mode');
    }
  }, [isGenZMode]);

  const toggleGenZMode = () => setIsGenZMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isGenZMode, toggleGenZMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
