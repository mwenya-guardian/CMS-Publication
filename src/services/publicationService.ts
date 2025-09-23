import api from './api';
import { Publication, CreatePublicationRequest, UpdatePublicationRequest } from '../types/Publication';
import { ApiResponse, PaginatedResponse, FilterOptions, ExportOptions } from '../types/Common';

export const publicationService = {
  async getAll(filters?: FilterOptions): Promise<Publication[]> {
    const response = await api.get<ApiResponse<Publication[]>>('/publications', { params: filters });
    return response.data.data;
  },

  async getPaginated(page: number = 1, limit: number = 10, filters?: FilterOptions): Promise<PaginatedResponse<Publication>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Publication>>>('/publications/paginated', {
      params: { page, limit, ...filters }
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Publication> {
    const response = await api.get<ApiResponse<Publication>>(`/publications/${id}`);
    return response.data.data;
  },

  async getByYear(year: number): Promise<Publication[]> {
    const response = await api.get<ApiResponse<Publication[]>>(`/publications/year/${year}`);
    return response.data.data;
  },

  async create(publication: CreatePublicationRequest): Promise<Publication> {
    console.log("Publication: ", publication);
    const response = await api.post<ApiResponse<Publication>>('/publications', publication);
    console.log("P, Response: ", response.data);
    return response.data.data;
  },

  async update(publication: UpdatePublicationRequest): Promise<Publication> {
    const response = await api.put<ApiResponse<Publication>>(`/publications/${publication.id}`, publication);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/publications/${id}`);
  },

  async exportToPdf(options: ExportOptions): Promise<Blob> {
    const response = await api.post('/publications/export/pdf', options, {
      responseType: 'blob'
    });
    return response.data;
  },

  async exportToPpt(options: ExportOptions): Promise<Blob> {
    const response = await api.post('/publications/export/ppt', options, {
      responseType: 'blob'
    });
    return response.data;
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post<ApiResponse<{ url: string }>>('/publications/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data.url;
  },

  // Count methods for dashboard
  async getTotalCount(): Promise<number> {
    const response = await api.get<ApiResponse<number>>('/publications/count');
    return response.data.data;
  },

  async getCountByYear(year: number): Promise<number> {
    const response = await api.get<ApiResponse<number>>(`/publications/count/year/${year}`);
    return response.data.data;
  },

  async getFeaturedCount(): Promise<number> {
    const response = await api.get<ApiResponse<number>>('/publications/count/featured');
    return response.data.data;
  },
};