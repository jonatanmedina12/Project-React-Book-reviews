// src/services/authService.ts - Servicios de autenticación
import api from '../services/api';

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    profileImage?: string;
  };
  token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (username: string, email: string, password: string): Promise<void> => {
  await api.post('/auth/register', { username, email, password });
};