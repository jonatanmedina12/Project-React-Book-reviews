import axios from 'axios';

// API base URL - replace with your actual API endpoint
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Interface for login response
 */
interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    profileImage?: string;
  };
}

/**
 * Login service function
 * 
 * @param email - User email
 * @param password - User password
 * @returns Promise with login response
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // For development without backend, uncomment this mock implementation
    // return mockLogin(email, password);
    
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register service function
 * 
 * @param username - Desired username
 * @param email - User email
 * @param password - User password
 * @returns Promise with registration response
 */
export const register = async (username: string, email: string, password: string): Promise<any> => {
  try {
    // For development without backend, uncomment this mock implementation
    // return mockRegister(username, email, password);
    
    const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

/**
 * Mock login function for development without backend
 * 
 * @param email - User email
 * @param password - User password
 * @returns Mock login response
 */
const mockLogin = (email: string, password: string): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // Simple validation
      if (email === 'user@example.com' && password === 'password') {
        resolve({
          token: 'mock-jwt-token',
          user: {
            id: '1',
            username: 'TestUser',
            email: 'user@example.com',
            profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
          },
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

/**
 * Mock register function for development without backend
 * 
 * @param username - Desired username
 * @param email - User email
 * @param password - User password
 * @returns Mock registration response
 */
const mockRegister = (username: string, email: string, password: string): Promise<any> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve({
        success: true,
        message: 'User registered successfully',
      });
    }, 800);
  });
};