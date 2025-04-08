
import { Category } from '../types/Category';
import api from './api';

/**
 * Obtiene todas las categorías disponibles
 * @returns Promesa con la lista de categorías
 */
export const getCategories = async (): Promise<Category[]> => {
    try {
      const response = await api.get('/Category');
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  };
  
  /**
   * Obtiene una categoría por su ID
   * @param id ID de la categoría
   * @returns Detalles de la categoría
   */
  export const getCategoryById = async (id: number): Promise<Category> => {
    try {
      const response = await api.get(`/Category/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener categoría con ID ${id}:`, error);
      throw error;
    }
  };
  
  /**
   * Crea una nueva categoría
   * @param categoryData Datos de la categoría a crear
   * @returns Categoría creada
   */
  export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
    try {
      const response = await api.post('/Category', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  };
  
  /**
   * Actualiza una categoría existente
   * @param id ID de la categoría a actualizar
   * @param categoryData Datos actualizados de la categoría
   * @returns Categoría actualizada
   */
  export const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<Category> => {
    try {
      const response = await api.put(`/Category/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar categoría con ID ${id}:`, error);
      throw error;
    }
  };
  
  /**
   * Elimina una categoría
   * @param id ID de la categoría a eliminar
   * @returns Promesa que se resuelve cuando la categoría es eliminada
   */
  export const deleteCategory = async (id: number): Promise<void> => {
    try {
      await api.delete(`/Category/${id}`);
    } catch (error) {
      console.error(`Error al eliminar categoría con ID ${id}:`, error);
      throw error;
    }
}