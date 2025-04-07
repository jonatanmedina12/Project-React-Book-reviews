import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { App as AntApp } from 'antd';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './theme/theme';

/**
 * Main Application Component
 * 
 * Wraps the entire application with necessary providers:
 * - BrowserRouter for routing
 * - ThemeProvider for theme management (light/dark mode)
 * - AntApp for global message and notification handling
 * - AuthProvider for authentication state management
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AntApp>
          <AuthProvider>
            <div className="app-container">
              <AppRoutes />
            </div>
          </AuthProvider>
        </AntApp>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;