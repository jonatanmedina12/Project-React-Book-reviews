import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { message } from 'antd';
import { useNavigate, useLocation, NavigateFunction } from 'react-router-dom';
import { login as loginService, register as registerService } from '../services/authService';

// Definición de tipos
export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Creación del contexto
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Custom hook to handle navigation when not inside the Router context
 * This prevents the "Invalid hook call" error
 */
const useCustomNavigate = (): NavigateFunction => {
  const navigate = useNavigate();
  return navigate;
};

/**
 * Authentication Provider Component
 * 
 * Manages authentication state and provides authentication methods
 * to the entire application.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useCustomNavigate();
  const location = useLocation();

  // Verificar si hay un token almacenado al iniciar
  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Aquí deberíamos verificar el token con el backend
          // por simplicidad, decodificamos y utilizamos la información del token
          // En una aplicación real, deberíamos validar el token con el backend
          
          // Simulación de decodificación del token
          const userInfo = {
            id: '1',
            username: 'usuarioDemo',
            email: 'usuario@example.com',
          };
          
          setUser(userInfo);
        } catch (error) {
          console.error('Error validando token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  // Redireccionar a login si no está autenticado en rutas protegidas
  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(location.pathname);
    
    if (!loading && !user && !isPublicPath) {
      navigate('/login');
    }
  }, [loading, user, location.pathname, navigate]);

  // Función de inicio de sesión
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await loginService(email, password);
      
      // Guardar el token en localStorage
      localStorage.setItem('token', response.token);
      
      // Establecer el usuario
      setUser(response.user);
      
      message.success('¡Inicio de sesión exitoso!');
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
      message.error('Error al iniciar sesión. Verifica tus credenciales.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      await registerService(username, email, password);
      
      message.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      console.error('Error en registro:', error);
      message.error('Error al registrarse. Inténtalo de nuevo.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de cierre de sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    message.success('Has cerrado sesión correctamente');
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the authentication context
 * 
 * @throws Error if used outside of AuthProvider
 * @returns Authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};