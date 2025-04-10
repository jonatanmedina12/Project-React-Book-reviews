import api, { getImageUrl } from './api';

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
    // Si hay una imagen en base64, debemos extraerla del objeto antes de enviar
    const isBase64Image = profileData.profilePictureUrl && 
                          profileData.profilePictureUrl.startsWith('data:image');
    
    let profileToSend = { ...profileData };
    
    // Si hay una imagen en base64, la eliminamos del objeto a enviar
    if (isBase64Image) {
      // La imagen base64 se enviará por separado
      delete profileToSend.profilePictureUrl;
    }
    
    // Enviamos la actualización del perfil sin la imagen
    await api.put('/user/profile', profileToSend);
    
    // Si hay una imagen base64, la procesamos después de actualizar el perfil
    if (isBase64Image && profileData.profilePictureUrl) {
      // Convertimos la imagen base64 a un archivo
      const base64Data = profileData.profilePictureUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const file = new File([blob], 'profile-image.png', { type: 'image/png' });
      
      // Subimos la imagen de perfil
      const imageUrl = await uploadProfileImage(file);
      
      // Actualizamos el perfil con la URL de la imagen
      await api.put('/user/profile', {
        ...profileToSend,
        profilePictureUrl: imageUrl
      });
    }
    
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

/**
 * Convierte una imagen base64 en un File para subir
 * @param base64Image - Imagen en formato base64
 * @param fileName - Nombre del archivo a generar
 * @returns Objeto File listo para subir
 */
export const base64ToFile = (base64Image: string, fileName: string): File => {
  // Separar la parte de datos del formato base64
  const base64Data = base64Image.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });
  return new File([blob], fileName, { type: 'image/png' });
};