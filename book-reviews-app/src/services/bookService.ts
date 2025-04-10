/**
 * @file bookService.ts
 * @description Servicio para interactuar con la API de libros
 */
import api, { getImageUrl } from './api';
import { Book, BookDetails, PaginatedBooksResponse } from '../types/Book';

/**
 * Obtiene todos los libros con filtros opcionales
 * @param page - Número de página para paginación
 * @param pageSize - Tamaño de página para paginación
 * @param searchTerm - Término de búsqueda para filtrar libros
 * @param categoryId - ID de categoría para filtrar libros
 * @returns Promesa con la lista de libros que coinciden con los criterios
 */
export const getBooks = async (
  page: number = 1,
  pageSize: number = 10,
  searchTerm?: string,
  categoryId?: number
): Promise<PaginatedBooksResponse> => {
  try {
    // Construir parámetros de consulta
    const params: any = {
      page,
      pageSize
    };
    
    if (searchTerm) {
      params.searchTerm = searchTerm;
    }
    
    if (categoryId) {
      params.categoryId = categoryId;
    }
    
    const response = await api.get('/book', { params });
    
    // Adaptar la respuesta al formato esperado por el frontend
    const books = Array.isArray(response.data) ? response.data : response.data.books || [];
    const total = response.headers['x-total-count'] 
      ? parseInt(response.headers['x-total-count']) 
      : (response.data.total || books.length);
    
    // Procesando cada libro para asegurarnos de que tenga el formato correcto
    const processedBooks = books.map((book: any) => ({
      ...book,
      coverImageUrl: book.coverImageUrl || book.coverImage || null,
      // Asegurarse de que averageRating siempre sea un número
      averageRating: book.averageRating || 0,
      // Asegurarse de que reviewCount siempre sea un número
      reviewCount: book.reviewCount || 0
    }));
    
    return {
      books: processedBooks,
      total,
      page,
      pageSize
    };
  } catch (error) {
    console.error('Error al obtener libros:', error);
    throw error;
  }
};

/**
 * Obtiene un libro por su ID
 * @param id - ID del libro a obtener
 * @returns Promesa con la información detallada del libro
 */
export const getBookById = async (id: string): Promise<BookDetails> => {
  try {
    const response = await api.get(`/book/${id}`);
    
    // Adaptar la respuesta al formato esperado por el frontend
    const bookData = response.data;
    
    // Asegurarse de que todos los campos necesarios existan
    return {
      ...bookData,
      id: bookData.id,
      title: bookData.title,
      author: bookData.author,
      summary: bookData.summary || '',
      isbn: bookData.isbn || '',
      categoryId: bookData.categoryId,
      categoryName: bookData.categoryName || '',
      language: bookData.language || '',
      pages: bookData.pages || 0,
      publishedYear: bookData.publishedYear || 0,
      publisher: bookData.publisher || '',
      coverImageUrl: bookData.coverImageUrl || bookData.coverImage || null,
      averageRating: bookData.averageRating || 0,
      reviewCount: bookData.reviewCount || 0,
      createdAt: new Date(bookData.createdAt || Date.now()),
      updatedAt: new Date(bookData.updatedAt || Date.now())
    };
  } catch (error) {
    console.error(`Error al obtener libro con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo libro en el sistema (solo para administradores)
 * @param bookData - Datos del libro a crear, incluyendo la imagen en base64 si existe
 * @returns Promesa con la información del libro creado
 */
export const createBook = async (bookData: Partial<Book>): Promise<Book> => {
  try {
    // Enviamos todos los datos, incluyendo la imagen en base64 si existe
    const response = await api.post('/book', bookData);
    return response.data;
  } catch (error) {
    console.error('Error al crear libro:', error);
    throw error;
  }
};

/**
 * Actualiza la información de un libro existente (solo para administradores)
 * @param id - ID del libro a actualizar
 * @param bookData - Datos actualizados del libro, incluyendo la imagen en base64 si existe
 * @returns Promesa con el resultado de la operación
 */
export const updateBook = async (id: string, bookData: Partial<Book>): Promise<void> => {
  try {
    // Enviamos todos los datos, incluyendo la imagen en base64 si existe
    await api.put(`/book/${id}`, bookData);
  } catch (error) {
    console.error(`Error al actualizar libro con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un libro del sistema (solo para administradores)
 * @param id - ID del libro a eliminar
 * @returns Promesa con el resultado de la operación
 */
export const deleteBook = async (id: string): Promise<void> => {
  try {
    await api.delete(`/book/${id}`);
  } catch (error) {
    console.error(`Error al eliminar libro con ID ${id}:`, error);
    throw error;
  }
};