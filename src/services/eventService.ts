import api from './api';
import { Event, CreateEventRequest, UpdateEventRequest } from '../types/Event';
import { ApiResponse, PaginatedResponse, FilterOptions, ExportOptions } from '../types/Common';

export const eventService = {
  async getAll(filters?: FilterOptions): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>('/events', { params: filters });
    return response.data.data;
  },

  async getPaginated(page: number = 1, limit: number = 10, filters?: FilterOptions): Promise<PaginatedResponse<Event>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Event>>>('/events/paginated', {
      params: { page, limit, ...filters }
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Event> {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data.data;
  },

  async create(event: CreateEventRequest): Promise<Event> {
    const response = await api.post<ApiResponse<Event>>('/events', event);
    return response.data.data;
  },

  async update(event: UpdateEventRequest): Promise<Event> {
    const response = await api.put<ApiResponse<Event>>(`/events/${event.id}`, event);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },

  async exportToPdf(options: ExportOptions): Promise<Blob> {
    const response = await api.post('/events/export/pdf', options, {
      responseType: 'blob'
    });
    return response.data;
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post<ApiResponse<{ url: string }>>('/events/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data.url;
  },
};