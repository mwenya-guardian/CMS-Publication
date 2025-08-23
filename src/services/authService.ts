import api from './api';
import { LoginRequest, LoginResponse, User } from '../types/User';
import { ApiResponse } from '../types/Common';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log(api.getUri());
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    await api.post('/auth/logout');
  },

  isExpired(): boolean {
    const expiresAt = localStorage.getItem('expiresAt');
    if (!expiresAt) return true;
    return Date.now() > new Date(expiresAt).getTime();
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  getStoredUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },

  storeAuthData(loginResponse: LoginResponse): void {
    localStorage.setItem('authToken', loginResponse.token);
    localStorage.setItem('user', JSON.stringify(loginResponse.user));
    localStorage.setItem('expiresAt', loginResponse.expiresAt);
  },
};