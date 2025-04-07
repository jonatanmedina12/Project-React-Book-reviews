import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { theme, ConfigProvider } from 'antd';

// Define theme type for type safety
type ThemeMode = 'light' | 'dark';

// Interface for the theme context value
interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme configs
const lightThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    borderRadius: 6,
  },
  components: {
    Button: {
      controlHeight: 40,
      paddingContentHorizontal: 16,
    },
    Input: {
      controlHeight: 40,
    },
    Card: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
    },
  },
};

const darkThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    ...lightThemeConfig.token,
  },
  components: {
    ...lightThemeConfig.components,
  },
};

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme Provider Component
 * 
 * Provides theme context and Ant Design ConfigProvider for the entire application.
 * Manages switching between light and dark mode.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme || 'light';
  });

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // Update body class and localStorage when theme changes
  useEffect(() => {
    // Apply appropriate class to body element
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${themeMode}-mode`);
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  // Select the correct theme config
  const currentTheme = themeMode === 'light' ? lightThemeConfig : darkThemeConfig;

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, setThemeMode }}>
      <ConfigProvider theme={currentTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};