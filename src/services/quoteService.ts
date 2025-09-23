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