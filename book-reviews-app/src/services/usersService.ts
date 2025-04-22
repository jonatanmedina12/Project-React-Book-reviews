import api, { getImageUrl } from './api';

/**
 * Interface para el perfil de usuario
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  registerDate: Date;
  role: string;
}

/**
 * Interface para actualizar el perfil
 */
export interface UpdateProfileRequest {
  username: string;
  email: string;
  profileImage?: string;
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
 * Interface para la respuesta de subida de imagen
 */
export interface UploadImageResponse {
  imageUrl: string;
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
    // Verificar si la imagen base64 es demasiado grande
    if (profileData.profileImage && 
        profileData.profileImage.startsWith('data:image') && 
        profileData.profileImage.length > 1000000) {
      // Si es demasiado grande, redimensionarla antes de enviar
      profileData.profileImage = await resizeBase64Image(profileData.profileImage);
    }
    
    // Enviar datos al backend
    await api.put('/user/profile', {
      username: profileData.username,
      email: profileData.email,
      profilePictureUrl: profileData.profileImage
    });
    
    // Actualizar el usuario en localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const updatedUser = {
        ...user,
        username: profileData.username,
        email: profileData.email,
        profileImage: profileData.profileImage
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.error('Error al actualizar perfil de usuario:', error);
    throw error;
  }
};

/**
 * Redimensiona una imagen base64 para reducir su tamaño
 * @param base64 - Imagen en formato base64
 * @returns Imagen redimensionada en formato base64
 */
const resizeBase64Image = (base64: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    
    img.onload = () => {
      // Determinar nuevas dimensiones (reducir a un máximo de 500px)
      const MAX_WIDTH = 500;
      const MAX_HEIGHT = 500;
      
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round(width * (MAX_HEIGHT / height));
          height = MAX_HEIGHT;
        }
      }
      
      // Crear canvas para redimensionar
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // Dibujar imagen redimensionada
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto del canvas'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Obtener imagen redimensionada como base64 (con menor calidad)
      const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      resolve(resizedBase64);
    };
    
    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };
  });
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