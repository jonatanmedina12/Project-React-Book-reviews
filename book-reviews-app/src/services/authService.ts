import api from './api';

/**
 * Interface para la respuesta de login
 */
export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    email: string;
    profilePictureUrl?: string;
    role: string;
  };
}

/**
 * Interface para la solicitud de login
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean; // Añadido campo rememberMe
}

/**
 * Interface para la solicitud de registro
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

// Constantes para las claves de almacenamiento
export const STORAGE_KEYS = {
  TOKEN: 'token',
  CURRENT_USER: 'currentUser',
  REMEMBER_ME: 'rememberMe',
  REMEMBERED_EMAIL: 'rememberedEmail',
}

/**
 * Servicio de autenticación para iniciar sesión con las credenciales proporcionadas
 * @param loginDto - Credenciales de inicio de sesión
 * @returns Promesa con la respuesta de inicio de sesión
 */
export const login = async (loginDto: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/Auth/login', loginDto);
    
    // Guardar el token en localStorage
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    
    // Guardar el usuario
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(response.data.user));
    
    // Si rememberMe está activo, guardar credenciales
    if (loginDto.rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, loginDto.email);
    } else {
      // Si no está activo, eliminar cualquier datos guardados previamente
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

/**
 * Servicio para registrar un nuevo usuario en el sistema
 * @param registerDto - Datos de registro del usuario
 * @returns Promesa con la información del usuario registrado
 */
export const register = async (registerDto: RegisterRequest) => {
  try {
    // Si no se especifica un rol, añadir el rol de usuario por defecto
    const registerData = {
      ...registerDto,
      role: registerDto.role || 'User'
    };
    
    const response = await api.post('/Auth/register', registerData);
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

/**
 * Servicio para solicitar un restablecimiento de contraseña
 * @param email - Email del usuario
 * @returns Promesa con el resultado de la solicitud
 */
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/Auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error en solicitud de restablecimiento:', error);
    throw error;
  }
};

/**
 * Servicio para restablecer la contraseña de un usuario
 * @param email - Email del usuario
 * @param token - Token de restablecimiento
 * @param password - Nueva contraseña
 * @param confirmPassword - Confirmación de la nueva contraseña
 * @returns Promesa con el resultado de la operación
 */
export const resetPassword = async (
  email: string,
  token: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await api.post('/Auth/reset-password', {
      email,
      token,
      password,
      confirmPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error en restablecimiento de contraseña:', error);
    throw error;
  }
};

/**
 * Servicio para cerrar la sesión del usuario actual
 * @param forgetCredentials - Indica si se deben olvidar las credenciales recordadas
 */
export const logout = (forgetCredentials: boolean = false) => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  
  // Si se solicita olvidar las credenciales, eliminar la información
  if (forgetCredentials) {
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
  }
};

/**
 * Verifica si hay credenciales guardadas
 * @returns true si hay credenciales guardadas, false en caso contrario
 */
export const hasRememberedCredentials = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
};

/**
 * Obtiene el email guardado si existe
 * @returns El email guardado o una cadena vacía
 */
export const getRememberedEmail = (): string => {
  return localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL) || '';
};