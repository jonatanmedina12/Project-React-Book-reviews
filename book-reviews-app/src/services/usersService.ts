import api from './api';

/**
 * Interface para el perfil de usuario
 */
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  registerDate: Date;
  role: string;
}

/**
 * Interface para actualizar el perfil
 */
export interface UpdateProfileRequest {
  username: string;
  email: string;
  profilePictureUrl?: string;
}

/**
 * Interface para cambiar la contraseña
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * Obtiene el perfil del usuario actual
 * @returns Promesa con la información del perfil del usuario
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get('/user/profile');
    
    // Convertir la fecha de registro de string a Date
    return {
      ...response.data,
      registerDate: new Date(response.data.registerDate)
    };
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    throw error;
  }
};

/**
 * Actualiza la información del perfil del usuario actual
 * @param profileData - Datos actualizados del perfil
 * @returns Promesa con el resultado de la operación
 */
export const updateUserProfile = async (profileData: UpdateProfileRequest): Promise<void> => {
  try {
    await api.put('/user/profile', profileData);
    
    // Actualizar el usuario en localStorage si existe
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const updatedUser = {
        ...user,
        username: profileData.username,
        email: profileData.email,
        profilePictureUrl: profileData.profilePictureUrl || user.profilePictureUrl
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.error('Error al actualizar perfil de usuario:', error);
    throw error;
  }
};

/**
 * Cambia la contraseña del usuario actual
 * @param passwordData - Datos de cambio de contraseña
 * @returns Promesa con el resultado de la operación
 */
export const changePassword = async (passwordData: ChangePasswordRequest): Promise<void> => {
  try {
    await api.put('/user/change-password', passwordData);
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    throw error;
  }
};

/**
 * Sube una imagen de perfil para el usuario
 * @param file - Archivo de imagen a subir
 * @returns Promesa con la URL de la imagen subida
 */
export const uploadProfileImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/user/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Actualizar el usuario en localStorage si existe
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      user.profilePictureUrl = response.data.imageUrl;
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error al subir imagen de perfil:', error);
    throw error;
  }
};