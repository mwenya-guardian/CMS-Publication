import api from './api';
import { Quote, CreateQuoteRequest, UpdateQuoteRequest } from '../types/Quote';
import { ApiResponse, PaginatedResponse, FilterOptions, ExportOptions } from '../types/Common';

export const quoteService = {
  async getAll(filters?: FilterOptions): Promise<Quote[]> {
    const response = await api.get<ApiResponse<Quote[]>>('/quotes', { params: filters });
    return response.data.data;
  },

  async getPaginated(page: number = 1, limit: number = 10, filters?: FilterOptions): Promise<PaginatedResponse<Quote>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Quote>>>('/quotes/paginated', {
      params: { page, limit, ...filters }
    });
    return response.data.data;
  },

  // Get all liked quotes for current user
  async getAllLikedPaginated(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Quote>> {
    try {
      // Get all liked quotes (we'll handle pagination on frontend)
      const reactionResponse = await api.get<ApiResponse<any[]>>(`/reactions/QUOTE/LIKE/me`);
      const reactions = reactionResponse.data.data || [];
      
      if (reactions.length === 0) {
        return { 
          data: [], 
          pagination: { page: 1, limit, total: 0, totalPages: 0 }
        };
      }
      
      // Get individual quotes by their IDs
      const quotePromises = reactions.map(async (reaction: any) => {
        try {
          const quoteResponse = await api.get<ApiResponse<Quote>>(`/quotes/${reaction.targetId}`);
          return quoteResponse.data.data;
        } catch (error) {
          console.error(`Failed to get quote ${reaction.targetId}:`, error);
          return null;
        }
      });
      
      const quotes = (await Promise.all(quotePromises)).filter(Boolean) as Quote[];
      
      // Simple pagination on the frontend
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedQuotes = quotes.slice(startIndex, endIndex);
      
      return {
        data: paginatedQuotes,
        pagination: {
          page,
          limit,
          total: quotes.length,
          totalPages: Math.ceil(quotes.length / limit)
        }
      };
    } catch (error) {
      console.error('Failed to get liked quotes:', error);
      return { 
        data: [], 
        pagination: { page: 1, limit, total: 0, totalPages: 0 }
      };
    }
  },

  async getById(id: string): Promise<Quote> {
    const response = await api.get<ApiResponse<Quote>>(`/quotes/${id}`);
    return response.data.data;
  },

  async create(quote: CreateQuoteRequest): Promise<Quote> {
    console.log("Qoute", quote);
    const response = await api.post<ApiResponse<Quote>>('/quotes', quote);
    console.log("Q, Response: ", response.data);
    return response.data.data;
  },

  async update(quote: UpdateQuoteRequest): Promise<Quote> {
    const response = await api.put<ApiResponse<Quote>>(`/quotes/${quote.id}`, quote);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/quotes/${id}`);
  },

  async exportToPdf(options: ExportOptions): Promise<Blob> {
    const response = await api.post('/quotes/export/pdf', options, {
      responseType: 'blob'
    });
    return response.data;
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post<ApiResponse<{ url: string }>>('/quotes/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data.url;
  },

  // Count methods for dashboard
  async getTotalCount(): Promise<number> {
    const response = await api.get<ApiResponse<number>>('/quotes/count');
    return response.data.data;
  },

  async getCountByYear(year: number): Promise<number> {
    const response = await api.get<ApiResponse<number>>(`/quotes/count/year/${year}`);
    return response.data.data;
  },

  async getFeaturedCount(): Promise<number> {
    const response = await api.get<ApiResponse<number>>('/quotes/count/featured');
    return response.data.data;
  },
};