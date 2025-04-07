import React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from './theme';
import './theme';

/**
 * Theme Toggle Component
 * 
 * A button that toggles between light and dark mode
 */
const ThemeToggle: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();
  
  return (
    <Tooltip 
      title={themeMode === 'light' ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      placement="bottom"
    >
      <Button
        type="text"
        className="theme-toggle-button"
        onClick={toggleTheme}
        icon={themeMode === 'light' ? <BulbOutlined /> : <BulbFilled />}
        aria-label="Cambiar tema"
      />
    </Tooltip>
  );
};

export default ThemeToggle;