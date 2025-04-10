import api from './api';
import { Review } from '../types/Review';

/**
 * Obtiene todas las reseñas de un libro específico
 * @param bookId - ID del libro para obtener sus reseñas
 * @returns Promesa con la lista de reseñas del libro
 */
export const getBookReviews = async (bookId: string): Promise<Review[]> => {
  try {
    const response = await api.get(`/Review/book/${bookId}`);
    
    // Convertir las fechas de string a Date
    return response.data.map((review: any) => ({
      ...review,
      createdAt: new Date(review.createdAt),
      updatedAt: review.updatedAt ? new Date(review.updatedAt) : undefined
    }));
  } catch (error) {
    console.error(`Error al obtener reseñas del libro con ID ${bookId}:`, error);
    throw error;
  }
};

/**
 * Obtiene una reseña por su ID
 * @param reviewId - ID de la reseña
 * @returns Promesa con la información de la reseña
 */
export const getReviewById = async (reviewId: string): Promise<Review> => {
  try {
    const response = await api.get(`/Review/${reviewId}`);
    
    // Convertir las fechas de string a Date
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
      updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined
    };
  } catch (error) {
    console.error(`Error al obtener reseña con ID ${reviewId}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva reseña para un libro
 * @param bookId - ID del libro
 * @param rating - Calificación de la reseña (debe estar entre 1 y 5)
 * @param comment - Comentario de la reseña
 * @returns Promesa con la información de la reseña creada
 */
export const createReview = async (bookId: string, rating: number, comment: string): Promise<Review> => {
  try {
    // Validar que el rating esté entre 1 y 5 y asegurarse de que sea un entero
    const validRating = Math.round(Math.max(1, Math.min(5, rating)));
    
    // Obtener el usuario actual del localStorage
    const userStr = localStorage.getItem('currentUser');
    let username = "";
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        username = user.username || "";
      } catch (parseError) {
        console.error('Error al parsear datos de usuario:', parseError);
      }
    }
    
    // Formato completo esperado por el API
    const reviewData = {
      id: 0, // El API ignorará este valor y asignará un ID automáticamente
      bookId: parseInt(bookId),
      userId: 0, // El API obtendrá este valor del token
      username: username, // Usar el nombre de usuario del localStorage
      rating: validRating, // Asegurar que el rating sea un entero válido
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Datos de reseña a enviar:', reviewData);
    
    const response = await api.post(`/Review`, reviewData);
    
    console.log('Respuesta del servidor:', response.data);
    
    // Convertir las fechas de string a Date
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
      updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined
    };
  } catch (error) {
    console.error(`Error al crear reseña para libro con ID ${bookId}:`, error);
    throw error;
  }
};

/**
 * Actualiza una reseña existente
 * @param reviewId - ID de la reseña a actualizar
 * @param rating - Nueva calificación (debe estar entre 1 y 5)
 * @param comment - Nuevo comentario
 * @param bookId - ID del libro asociado a la reseña
 * @returns Promesa con la información de la reseña actualizada
 */
export const updateReview = async (
  reviewId: string, 
  rating: number, 
  comment: string, 
  bookId?: string
): Promise<Review> => {
  try {
    // Validar que el rating esté entre 1 y 5 y asegurarse de que sea un entero
    const validRating = Math.round(Math.max(1, Math.min(5, rating)));
    
    let currentReview: Partial<Review> = {};
    
    // Obtener la información actual de la reseña para incluir los campos requeridos
    try {
      currentReview = await getReviewById(reviewId);
    } catch (error) {
      console.warn(`No se pudo obtener la reseña actual con ID ${reviewId}:`, error);
    }
    
    // Obtener el usuario actual del localStorage
    const userStr = localStorage.getItem('currentUser');
    let username = currentReview.username || "";
    
    if (userStr && !username) {
      try {
        const user = JSON.parse(userStr);
        username = user.username || "";
      } catch (parseError) {
        console.error('Error al parsear datos de usuario:', parseError);
      }
    }
    
    // Formato completo esperado por el API
    const reviewData = {
      id: parseInt(reviewId),
      bookId: currentReview.bookId || (bookId ? parseInt(bookId) : 0),
      userId: currentReview.userId || 0, // El API verificará este valor con el token
      username: username,
      rating: validRating, // Asegurar que el rating sea un entero válido
      comment,
      createdAt: currentReview.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Datos de actualización a enviar:', reviewData);
    
    const response = await api.put(`/Review/${reviewId}`, reviewData);
    
    console.log('Respuesta de actualización:', response.data);
    
    // Si el endpoint devuelve la reseña actualizada
    if (response.data && Object.keys(response.data).length > 0) {
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined
      };
    }
    
    // Si el servidor no devuelve datos (204 No Content), devolver la información que tenemos
    return {
      ...reviewData,
      createdAt: new Date(reviewData.createdAt),
      updatedAt: new Date(reviewData.updatedAt)
    };
  } catch (error) {
    console.error(`Error al actualizar reseña con ID ${reviewId}:`, error);
    throw error;
  }
};

/**
 * Elimina una reseña
 * @param reviewId - ID de la reseña a eliminar
 * @returns Promesa con el resultado de la operación
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await api.delete(`/Review/${reviewId}`);
  } catch (error) {
    console.error(`Error al eliminar reseña con ID ${reviewId}:`, error);
    throw error;
  }
};

/**
 * Obtiene todas las reseñas del usuario actual
 * @returns Promesa con la lista de reseñas del usuario
 */
export const getUserReviews = async (): Promise<Review[]> => {
  try {
    const response = await api.get(`/Review/user`);
    
    // Convertir las fechas de string a Date
    return response.data.map((review: any) => ({
      ...review,
      createdAt: new Date(review.createdAt),
      updatedAt: review.updatedAt ? new Date(review.updatedAt) : undefined
    }));
  } catch (error) {
    console.error('Error al obtener reseñas del usuario:', error);
    throw error;
  }
};