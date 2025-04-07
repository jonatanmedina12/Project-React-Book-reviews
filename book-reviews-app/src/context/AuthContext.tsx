import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
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
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Proveedor de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuthentication();
  }, []);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};