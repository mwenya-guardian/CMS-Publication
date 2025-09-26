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

  // Get all liked events for current user
  async getAllLikedPaginated(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Event>> {
    try {
      // Get all liked events (we'll handle pagination on frontend)
      const reactionResponse = await api.get<ApiResponse<any[]>>(`/reactions/EVENT/LIKE/me`);
      const reactions = reactionResponse.data.data || [];
      
      if (reactions.length === 0) {
        return { 
          data: [], 
          pagination: { page: 1, limit, total: 0, totalPages: 0 }
        };
      }
      
      // Get individual events by their IDs
      const eventPromises = reactions.map(async (reaction: any) => {
        try {
          const eventResponse = await api.get<ApiResponse<Event>>(`/events/${reaction.targetId}`);
          return eventResponse.data.data;
        } catch (error) {
          console.error(`Failed to get event ${reaction.targetId}:`, error);
          return null;
        }
      });
      
      const events = (await Promise.all(eventPromises)).filter(Boolean) as Event[];
      
      // Simple pagination on the frontend
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedEvents = events.slice(startIndex, endIndex);
      
      return {
        data: paginatedEvents,
        pagination: {
          page,
          limit,
          total: events.length,
          totalPages: Math.ceil(events.length / limit)
        }
      };
    } catch (error) {
      console.error('Failed to get liked events:', error);
      return { 
        data: [], 
        pagination: { page: 1, limit, total: 0, totalPages: 0 }
      };
    }
  },

  async getById(id: string): Promise<Event> {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data.data;
  },

  async create(event: CreateEventRequest): Promise<Event> {
    console.log("Event to be created: ", event);
    const response = await api.post<ApiResponse<Event>>('/events', event);
    console.log("E, Response: ", response.data);
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

  // Count methods for dashboard
  async getTotalCount(): Promise<number> {
    const response = await api.get<ApiResponse<number>>('/events/count');
    return response.data.data;
  },

  async getCountByYear(year: number): Promise<number> {
    const response = await api.get<ApiResponse<number>>(`/events/count/year/${year}`);
    return response.data.data;
  },

  async getFeaturedCount(): Promise<number> {
    const response = await api.get<ApiResponse<number>>('/events/count/featured');
    return response.data.data;
  },

  async getUpcomingCount(): Promise<number> {
    const response = await api.get<ApiResponse<number>>('/events/count/upcoming');
    return response.data.data;
  },
};