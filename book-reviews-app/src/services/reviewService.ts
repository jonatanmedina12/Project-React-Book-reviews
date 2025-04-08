import api from './api';
import { Review } from '../types/Review';

/**
 * Interface para crear o actualizar una reseña
 */
export interface NewReview {
  rating: number;
  comment: string;
}

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
 * @param review - Datos de la reseña a crear
 * @returns Promesa con la información de la reseña creada
 */
export const createReview = async (bookId: string, review: NewReview): Promise<Review> => {
  try {
    const reviewData = {
      ...review,
      bookId: parseInt(bookId)
    };
    
    const response = await api.post(`/Review`, reviewData);
    
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
 * @param review - Nuevos datos de la reseña
 * @param bookId - ID del libro (opcional, se usará si el endpoint no devuelve la reseña completa)
 * @returns Promesa con la información de la reseña actualizada
 */
export const updateReview = async (reviewId: string, review: NewReview, bookId?: string): Promise<Review> => {
  try {
    // Si no tenemos el bookId, intentar obtener primero la reseña actual
    let currentBookId: number | undefined;
    
    if (!bookId) {
      try {
        const currentReview = await getReviewById(reviewId);
        currentBookId = currentReview.bookId;
      } catch (error) {
        console.warn(`No se pudo obtener la reseña actual con ID ${reviewId}:`, error);
        // Continuamos sin el bookId, pero podríamos fallar más tarde
      }
    } else {
      currentBookId = parseInt(bookId);
    }
    
    // Crear un objeto que incluya el ID de la reseña
    const reviewData = {
      ...review,
      id: parseInt(reviewId),
      bookId: currentBookId
    };
    
    const response = await api.put(`/review/${reviewId}`, reviewData);
    
    // Si el servidor no devuelve la reseña actualizada, crear un objeto con la información disponible
    if (!response.data || Object.keys(response.data).length === 0) {
      // El endpoint devuelve 204 No Content
      
      // Si tenemos el bookId en reviewData, usarlo. De lo contrario, intentar obtener la reseña
      if (reviewData.bookId) {
        return {
          ...reviewData,
          bookId: reviewData.bookId,
          userId: -1, // Valor temporal
          username: '', // Valor temporal
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      
      // Si no tenemos bookId y el servidor no devolvió datos, intentar obtener la reseña actualizada
      try {
        return await getReviewById(reviewId);
      } catch (secondError) {
        throw new Error('No se pudo actualizar la reseña: falta el ID del libro y no se pudo obtener la reseña actualizada');
      }
    }
    
    // Convertir las fechas de string a Date
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
      updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined
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
    await api.delete(`/review/${reviewId}`);
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
    const response = await api.get(`/review/user`);
    
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