import api from './api';
import { ChurchBulletin, BulletinTemplate, PublicationStatus } from '../types/ChurchBulletin';
import { ApiResponse, PaginatedResponse, FilterOptions } from '../types/Common';

export const bulletinService = {
  // CRUD Operations - Updated to match backend controller
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

  async getByDate(date: string): Promise<ChurchBulletin[]> {
    const response = await api.get<ApiResponse<ChurchBulletin[]>>('/bulletins', {
      params: { date }
    });
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

  // Bulk Operations - Updated to match backend controller
  async getBulletinsByIds(ids: string[]): Promise<ChurchBulletin[]> {
    const response = await api.post<ApiResponse<ChurchBulletin[]>>('/bulletins/bulk', ids);
    return response.data.data;
  },

  // Filter by status
  async getByStatus(status: PublicationStatus): Promise<ChurchBulletin[]> {
    const response = await api.get<ApiResponse<ChurchBulletin[]>>('/bulletins', {
      params: { status }
    });
    return response.data.data;
  },

  // Filter by author
  async getByAuthor(authorId: string): Promise<ChurchBulletin[]> {
    const response = await api.get<ApiResponse<ChurchBulletin[]>>('/bulletins', {
      params: { authorId }
    });
    return response.data.data;
  },

  // Search bulletins
  async search(searchTerm: string): Promise<ChurchBulletin[]> {
    const response = await api.get<ApiResponse<ChurchBulletin[]>>('/bulletins', {
      params: { search: searchTerm }
    });
    return response.data.data;
  },

  // Template Operations (placeholder - implement when backend supports)
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

  // Publishing Operations (placeholder - implement when backend supports)
  async publish(id: string): Promise<ChurchBulletin> {
    const response = await api.put<ApiResponse<ChurchBulletin>>(`/bulletins/${id}/publish`);
    return response.data.data;
  },

  async unpublish(id: string): Promise<ChurchBulletin> {
    const response = await api.put<ApiResponse<ChurchBulletin>>(`/bulletins/${id}/unpublish`);
    return response.data.data;
  },

  // Export Operations (placeholder - implement when backend supports)
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

  // Validation (placeholder - implement when backend supports)
  async validate(bulletin: Partial<ChurchBulletin>): Promise<{ isValid: boolean; errors: string[] }> {
    const response = await api.post<ApiResponse<{ isValid: boolean; errors: string[] }>>('/bulletins/validate', bulletin);
    return response.data.data;
  },

  // Bulk Update (placeholder - implement when backend supports)
  async bulkUpdate(updates: { id: string; data: Partial<ChurchBulletin> }[]): Promise<ChurchBulletin[]> {
    const response = await api.post<ApiResponse<ChurchBulletin[]>>('/bulletins/bulk-update', { updates });
    return response.data.data;
  },

  // Schedule Management (placeholder - implement when backend supports)
  async getScheduleConflicts(bulletinDate: string): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>(`/bulletins/schedule-conflicts/${bulletinDate}`);
    return response.data.data;
  },

  // Archive Operations (placeholder - implement when backend supports)
  async archive(id: string): Promise<void> {
    await api.post(`/bulletins/${id}/archive`);
  },

  async getArchived(year?: number): Promise<ChurchBulletin[]> {
    const response = await api.get<ApiResponse<ChurchBulletin[]>>('/bulletins/archived', {
      params: { year }
    });
    return response.data.data;
  },

  // Get published bulletin summaries (ID and title only)
  async getPublishedSummaries(): Promise<{ id: string; title: string }[]> {
    const response = await api.get<ApiResponse<{ id: string; title: string }[]>>('/bulletins/published-summaries');
    return response.data.data;
  },

  // Count methods for dashboard
  async getTotalCount(): Promise<number> {
    const response = await api.get<ApiResponse<number>>('/bulletins/count');
    return response.data.data;
  },

  async getCountByYear(year: number): Promise<number> {
    const response = await api.get<ApiResponse<number>>(`/bulletins/count/year/${year}`);
    return response.data.data;
  },

  async getPublishedCount(): Promise<number> {
    const response = await api.get<ApiResponse<number>>('/bulletins/count/published');
    return response.data.data;
  }
};