import api from './api';
import { Book, BookDetails } from '../types/Book';

export const getBooks = async (
  page = 1, 
  limit = 10, 
  search?: string, 
  category?: string
): Promise<{ books: Book[]; total: number }> => {
  const params = { page, limit, search, category };
  const response = await api.get('/books', { params });
  return response.data;
};

export const getBookById = async (id: string): Promise<BookDetails> => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await api.get('/categories');
  return response.data;
};