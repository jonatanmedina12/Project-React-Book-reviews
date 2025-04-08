/**
 * @file Book.ts
 * @description Interfaces para los diferentes tipos de datos relacionados con libros
 */
import { Review } from "./Review";

/**
 * Interfaz básica para un libro
 */
export interface Book {
  id: number; // ID del libro
  title: string; // Título del libro
  author: string; // Autor del libro
  summary?: string; // Resumen del libro
  categoryId: number; // ID de la categoría a la que pertenece el libro
  categoryName?: string; // Nombre de la categoría (útil para la visualización)
  averageRating: number; // Calificación promedio del libro
  reviewCount: number; // Número de reseñas del libro
  coverImageUrl?: string; // URL de la imagen de portada
}

/**
 * Interfaz extendida para detalles completos de un libro
 */
export interface BookDetails extends Book {
  publisher?: string; // Editorial
  publishedYear?: number; // Año de publicación
  isbn?: string; // ISBN del libro
  pages?: number; // Número de páginas
  language?: string; // Idioma del libro
  reviews?: Review[]; // Lista de reseñas del libro
  createdAt?: Date; // Fecha de creación
  updatedAt?: Date; // Fecha de última actualización
}

/**
 * Interfaz para la respuesta paginada de libros
 */
export interface PaginatedBooksResponse {
  books: Book[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Interfaz para crear un nuevo libro
 */
export interface CreateBookDto {
  title: string;
  author: string;
  summary?: string;
  categoryId: number;
  isbn?: string;
  publishedYear?: number;
  pages?: number;
  language?: string;
  publisher?: string;
  coverImageUrl?: string;
}

/**
 * Interfaz para actualizar un libro existente
 */
export interface UpdateBookDto extends Partial<CreateBookDto> {}