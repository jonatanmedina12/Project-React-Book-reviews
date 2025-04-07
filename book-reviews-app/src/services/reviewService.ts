import api from './api';
import { Review, NewReview } from '../types/Review';

export const getBookReviews = async (bookId: string): Promise<Review[]> => {
  const response = await api.get(`/books/${bookId}/reviews`);
  return response.data;
};

export const createReview = async (bookId: string, review: NewReview): Promise<Review> => {
  const response = await api.post(`/books/${bookId}/reviews`, review);
  return response.data;
};

export const updateReview = async (reviewId: string, review: NewReview): Promise<Review> => {
  const response = await api.put(`/reviews/${reviewId}`, review);
  return response.data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await api.delete(`/reviews/${reviewId}`);
};

export const getUserReviews = async (): Promise<Review[]> => {
  const response = await api.get('/user/reviews');
  return response.data;
};