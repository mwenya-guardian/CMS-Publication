import api from './api';
import { Giving, GivingRequest, UpdateGivingRequest } from '../types/Giving';
import { ApiResponse, PaginatedResponse, FilterOptions } from '../types/Common';


export const givingService = {
  async getAll(filters?: FilterOptions): Promise<Giving[]> {
    const response = await api.get<ApiResponse<Giving[]>>('/giving', { params: filters });
    return response.data.data;
  },

  async getPaginated(page: number = 1, size: number = 10, filters?: FilterOptions): Promise<PaginatedResponse<Giving>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Giving>>>('/giving/paginated', {
      params: { page, size, ...filters }
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Giving> {
    const response = await api.get<ApiResponse<Giving>>(`/giving/${id}`);
    return response.data.data;
  },

  async create(payload: GivingRequest): Promise<Giving> {
    const response = await api.post<ApiResponse<Giving>>('/giving', payload);
    return response.data.data;
  },

  async update(payload: UpdateGivingRequest): Promise<Giving> {
    // send full payload in body (controller expects TitheAndOffering)
    const response = await api.put<ApiResponse<Giving>>(`/giving/${payload.id}`, payload);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/giving/${id}`);
  }
};

export default givingService;
