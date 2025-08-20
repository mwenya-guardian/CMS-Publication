// src/services/userService.ts
import api from './api';
import { User, UserRequest, UpdateUserRequest } from '../types/User';
import { ApiResponse, PaginatedResponse, FilterOptions } from '../types/Common';

export const userService = {
  async getAll(filters?: FilterOptions): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>('/users', { params: filters });
    return response.data.data;
  },

  async getPaginated(page: number = 1, size: number = 10, filters?: FilterOptions): Promise<PaginatedResponse<User>> {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>('/users/paginated', {
      params: { page, size, ...filters }
    });
    return response.data.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },


  async create(payload: UserRequest): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/users', payload);
    return response.data.data;
  },


  async update(payload: UpdateUserRequest): Promise<User> {
    const { id, ...rest } = payload;
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, rest);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};

export default userService;
