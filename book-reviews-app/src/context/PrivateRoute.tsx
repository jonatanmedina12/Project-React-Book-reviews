/**
 * @file PrivateRoute.tsx
 * @description Componente para proteger rutas que requieren autenticación
 */
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { message } from 'antd';
import { isTokenValid } from '../services/api';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[]; // Arreglo opcional de roles permitidos
}

/**
 * Componente que protege rutas que requieren autenticación
 * También verifica roles específicos si se proporcionan
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  roles 
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const [redirectPath, setRedirectPath] = useState<string>('/login');

  // Verificar la validez del token cuando se accede a la ruta protegida
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token && !isTokenValid(token)) {
      message.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      logout();
    }
    
    // Verificar autenticación y roles
    if (!isAuthenticated) {
      setShouldRedirect(true);
      setRedirectPath('/login');
      message.warning('Debes iniciar sesión para acceder a esta página');
    } else if (roles && roles.length > 0) {
      const hasRequiredRole = roles.includes(user?.role || '');
      if (!hasRequiredRole) {
        setShouldRedirect(true);
        setRedirectPath('/');
        message.error('No tienes permiso para acceder a esta página');
      } else {
        setShouldRedirect(false);
      }
    } else {
      setShouldRedirect(false);
    }
  }, [isAuthenticated, user, roles, location.pathname, logout]);

  // Si debe redirigir, hacerlo
  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace state={{ from: location.pathname }} />;
  }

  // Si todas las verificaciones pasan, renderizar los hijos
  return <>{children}</>;
};

export default PrivateRoute;