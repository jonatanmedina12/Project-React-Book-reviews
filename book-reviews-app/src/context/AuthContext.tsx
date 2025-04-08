/**
 * @file AuthContext.tsx
 * @description Contexto de autenticación para la aplicación
 */
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { message } from 'antd';
import { useNavigate, useLocation, NavigateFunction } from 'react-router-dom';
import { 
  login as loginService, 
  register as registerService, 
  logout as logoutService,
  hasRememberedCredentials,
  getRememberedEmail,
  LoginRequest, 
  RegisterRequest 
} from '../services/authService';
import { isTokenValid } from '../services/api';

// Interfaz de usuario
export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  role: string;
}

// Tipo del contexto de autenticación
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  rememberedEmail: string;
  hasRememberedCredentials: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: (forgetCredentials?: boolean) => void;
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
  const [rememberedEmail, setRememberedEmail] = useState<string>(getRememberedEmail());
  const [hasRemembered, setHasRemembered] = useState<boolean>(hasRememberedCredentials());
  const navigate = useCustomNavigate();
  const location = useLocation();

  /**
   * Extraer información básica del usuario desde el token
   * @param token Token JWT
   */
  const createUserFromToken = (token: string) => {
    try {
      // Verificar primero si el token es válido
      if (!isTokenValid(token)) {
        console.log("Token expirado o inválido");
        logout();
        return;
      }
      
      // Extraer el payload del token (la parte central)
      const payload = token.split('.')[1];
      // Decodificar el payload (base64)
      const decodedPayload = atob(payload);
      // Parsear el JSON
      const tokenData = JSON.parse(decodedPayload);
      
      console.log("Datos extraídos del token:", tokenData);
      
      // Crear un objeto de usuario con los datos disponibles en el token
      const userInfo: User = {
        id: tokenData.nameid || '1',
        username: tokenData.unique_name || 'Usuario',
        email: tokenData.email || 'usuario@example.com',
        role: tokenData.role || 'User',
      };
      
      // Guardar en localStorage para futuros accesos
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      
      // Establecer el usuario en el estado
      setUser(userInfo);
      console.log("Usuario creado a partir del token:", userInfo);
    } catch (error) {
      console.error('Error al extraer datos del token:', error);
      // En caso de error, cerrar sesión
      logout();
    }
  };

  /**
   * Función para verificar la autenticación del usuario
   */
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    console.log("Token encontrado:", token ? "Sí" : "No");
    
    if (token) {
      // Verificar si el token es válido
      if (!isTokenValid(token)) {
        console.log("Token expirado o inválido");
        logout();
        return;
      }
      
      try {
        // Obtener el usuario del localStorage
        const userStr = localStorage.getItem('currentUser');
        console.log("String de usuario encontrado:", userStr ? "Sí" : "No");
        
        if (userStr) {
          // Solo intentar parsear si userStr no es null
          try {
            const userInfo = JSON.parse(userStr);
            console.log("Usuario parseado:", userInfo);
            setUser(userInfo);
          } catch (parseError) {
            console.error('Error al parsear datos de usuario:', parseError);
            // En caso de error de parseo, eliminamos el valor corrupto
            localStorage.removeItem('currentUser');
            
            // Usar información del token para el usuario
            createUserFromToken(token);
          }
        } else {
          // Si no hay usuario en localStorage pero sí hay token,
          // intentamos crear un usuario a partir del token
          createUserFromToken(token);
        }
      } catch (error) {
        console.error('Error validando token:', error);
        logout();
      }
    } else {
      console.log("No hay token, el usuario no está autenticado");
      setUser(null);
    }
    
    // Verificar si hay credenciales recordadas
    const remembered = hasRememberedCredentials();
    setHasRemembered(remembered);
    if (remembered) {
      setRememberedEmail(getRememberedEmail());
    }
    
    setLoading(false);
  };

  /**
   * Función de cierre de sesión
   * @param forgetCredentials Si es true, elimina las credenciales guardadas
   */
  const logout = (forgetCredentials: boolean = false) => {
    // Usar el servicio de logout que ahora soporta olvidar credenciales
    logoutService(forgetCredentials);
    setUser(null);
    
    // Actualizar el estado de credenciales recordadas si se olvidaron
    if (forgetCredentials) {
      setHasRemembered(false);
      setRememberedEmail('');
    }
    
    // Solo mostrar mensaje y redireccionar si fue un logout explícito (no por token expirado)
    if (user) {
      message.success('Has cerrado sesión correctamente');
      navigate('/login');
    }
  };

  // Verificar autenticación al iniciar
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Verificar periódicamente la validez del token (cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        if (!isTokenValid(token)) {
          console.log("Token expirado durante verificación periódica");
          message.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          logout();
        }
      }
    }, 300000); // 5 minutos en milisegundos
    
    return () => clearInterval(interval);
  }, []);

  // Redireccionar a login si no está autenticado en rutas protegidas
  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(location.pathname);
    
    if (!loading && !user && !isPublicPath) {
      message.warning('Debes iniciar sesión para acceder a esta página');
      navigate('/login');
    }
  }, [loading, user, location.pathname, navigate]);

  // Función de inicio de sesión
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);
      // Crear objeto con los datos de login según el tipo esperado por loginService
      const loginData: LoginRequest = {
        email,
        password,
        rememberMe
      };
      
      const response = await loginService(loginData);
      
      // Verificar token antes de guardarlo
      if (!isTokenValid(response.token)) {
        message.error('Token de autenticación inválido. Contacta al administrador.');
        throw new Error('Token inválido');
      }
      
      // Actualizar estado de credenciales recordadas
      setHasRemembered(rememberMe);
      if (rememberMe) {
        setRememberedEmail(email);
      }
      
      // Guardar información del usuario
      if (response.user) {
        setUser(response.user);
      } else {
        // Si no hay información de usuario en la respuesta, extraerla del token
        createUserFromToken(response.token);
      }
      
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
      // Crear objeto con los datos de registro según el tipo esperado por registerService
      const registerData: RegisterRequest = {
        username,
        email,
        password,
        confirmPassword: password  // Asumiendo que no necesitas confirmación diferente
      };
      
      await registerService(registerData);
      
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

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    rememberedEmail,
    hasRememberedCredentials: hasRemembered,
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