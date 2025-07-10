import api from './api';
import { ChurchBulletin, BulletinTemplate } from '../types/ChurchBulletin';
import { ApiResponse, PaginatedResponse, FilterOptions } from '../types/Common';

export const bulletinService = {
  // CRUD Operations
  async getAll(filters?: FilterOptions): Promise<ChurchBulletin[]> {
    const response = await api.get<ApiResponse<ChurchBulletin[]>>('/bulletins', { params: filters });
    return response.data.data;
  },

  async getPaginated(page: number = 1, limit: number = 10, filters?: FilterOptions): Promise<PaginatedResponse<ChurchBulletin>> {
    const response = await api.get<ApiResponse<PaginatedResponse<ChurchBulletin>>>('/bulletins/paginated', {
      params: { page, limit, ...filters }
    });
    return response.data.data;
  },

  async getById(id: string): Promise<ChurchBulletin> {
    const response = await api.get<ApiResponse<ChurchBulletin>>(`/bulletins/${id}`);
    return response.data.data;
  },

  async getByDate(date: string): Promise<ChurchBulletin> {
    const response = await api.get<ApiResponse<ChurchBulletin>>(`/bulletins/date/${date}`);
    return response.data.data;
  },

  async create(bulletin: Partial<ChurchBulletin>): Promise<ChurchBulletin> {
    const response = await api.post<ApiResponse<ChurchBulletin>>('/bulletins', bulletin);
    return response.data.data;
  },

  async update(id: string, bulletin: Partial<ChurchBulletin>): Promise<ChurchBulletin> {
    const response = await api.put<ApiResponse<ChurchBulletin>>(`/bulletins/${id}`, bulletin);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/bulletins/${id}`);
  },

  // Template Operations
  async getTemplates(): Promise<BulletinTemplate[]> {
    const response = await api.get<ApiResponse<BulletinTemplate[]>>('/bulletins/templates');
    return response.data.data;
  },

  async createFromTemplate(templateId: string, bulletinDate: string): Promise<ChurchBulletin> {
    const response = await api.post<ApiResponse<ChurchBulletin>>('/bulletins/from-template', {
      templateId,
      bulletinDate
    });
    return response.data.data;
  },

  // Publishing Operations
  async publish(id: string): Promise<ChurchBulletin> {
    const response = await api.post<ApiResponse<ChurchBulletin>>(`/bulletins/${id}/publish`);
    return response.data.data;
  },

  async unpublish(id: string): Promise<ChurchBulletin> {
    const response = await api.post<ApiResponse<ChurchBulletin>>(`/bulletins/${id}/unpublish`);
    return response.data.data;
  },

  // Export Operations
  async exportToPdf(id: string): Promise<Blob> {
    const response = await api.get(`/bulletins/${id}/export/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async exportToWord(id: string): Promise<Blob> {
    const response = await api.get(`/bulletins/${id}/export/word`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Validation
  async validate(bulletin: Partial<ChurchBulletin>): Promise<{ isValid: boolean; errors: string[] }> {
    const response = await api.post<ApiResponse<{ isValid: boolean; errors: string[] }>>('/bulletins/validate', bulletin);
    return response.data.data;
  },

  // Bulk Operations
  async bulkUpdate(updates: { id: string; data: Partial<ChurchBulletin> }[]): Promise<ChurchBulletin[]> {
    const response = await api.post<ApiResponse<ChurchBulletin[]>>('/bulletins/bulk-update', { updates });
    return response.data.data;
  },

  // Schedule Management
  async getScheduleConflicts(bulletinDate: string): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>(`/bulletins/schedule-conflicts/${bulletinDate}`);
    return response.data.data;
  },

  // Archive Operations
  async archive(id: string): Promise<void> {
    await api.post(`/bulletins/${id}/archive`);
  },

  async getArchived(year?: number): Promise<ChurchBulletin[]> {
    const response = await api.get<ApiResponse<ChurchBulletin[]>>('/bulletins/archived', {
      params: { year }
    });
    return response.data.data;
  }
};