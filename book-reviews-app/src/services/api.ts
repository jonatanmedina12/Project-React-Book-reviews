/**
 * @file api.ts
 * @description Configuración y utilidades para la comunicación con la API
 */
import axios from 'axios';

/**
 * Verifica si el token JWT ha expirado
 * @param token JWT token
 * @returns true si el token es válido, false si ha expirado
 */
export const isTokenValid = (token: string): boolean => {
  try {
    // Extraer el payload del token
    const payload = token.split('.')[1];
    // Decodificar el payload
    const decodedPayload = atob(payload);
    // Parsear el JSON
    const tokenData = JSON.parse(decodedPayload);
    
    // Verificar si el token tiene una fecha de expiración
    if (!tokenData.exp) {
      return false;
    }
    
    // Convertir la fecha de expiración a milisegundos y comparar con la fecha actual
    const expirationTime = tokenData.exp * 1000;
    const currentTime = Date.now();
    
    return expirationTime > currentTime;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return false;
  }
};

/**
 * Función para limpiar la sesión cuando el token es inválido
 */
export const clearSession = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  // Si estamos en una página que no sea login o register, redirigir a login
  const publicPaths = ['/login', '/register'];
  if (!publicPaths.includes(window.location.pathname)) {
    window.location.href = '/login';
  }
};

/**
 * Configuración base de axios
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://localhost:7088/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para añadir el token de autenticación a las peticiones
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Si hay un token, verificar su validez antes de añadirlo a la petición
    if (token) {
      if (isTokenValid(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Si el token no es válido, limpiar la sesión
        clearSession();
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para manejar errores de respuesta
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores 401 (no autorizado) o 403 (prohibido) redirigiendo al login
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      clearSession();
    }
    return Promise.reject(error);
  }
);

/**
 * Construye una URL completa para un recurso en la API
 * @param path Ruta relativa del recurso
 * @returns URL completa
 */
export const getApiUrl = (path: string): string => {
  // Si la ruta ya es una URL completa, devolverla como está
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Asegurarse de que la ruta no comience con / si la URL base termina con /
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Construir y devolver la URL completa
  return `${api.defaults.baseURL}/${normalizedPath}`;
};

// URL base para imágenes de placeholder (usando una alternativa a via.placeholder.com)
const PLACEHOLDER_BASE = 'https://placehold.co';

/**
 * Construye una URL para una imagen almacenada en el servidor
 * @param imagePath Ruta de la imagen
 * @returns URL completa de la imagen
 */
export const getImageUrl = (imagePath: string | undefined | null): string => {
  // Si no hay ruta de imagen, devolver una imagen predeterminada
  if (!imagePath) {
    return `${PLACEHOLDER_BASE}/300x450/e0e0e0/999999?text=No+Image`;
  }
  
  // Si la URL ya es absoluta, devolverla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Asegurarse de que no haya doble barra
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Construir y devolver la URL completa
  return `https://localhost:7088/${normalizedPath}`;
};

export default api;