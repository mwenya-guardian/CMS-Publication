import api from './api';
import { ApiResponse, PaginatedResponse, FilterOptions } from '../types/Common';
import { NewsletterSubscriberResponse, CreateSubscriberRequest, UpdateSubscriberRequest } from '../types/NewsletterSubscriber';

/**
 * Types returned by your backend controller (NewsletterSubscriberResponse)
 * Matches:
 * public class NewsletterSubscriberResponse {
 *   private String id;
 *   private String email;
 *   private Boolean active;
 *   private Boolean verified;
 * }
 */


const BASE = '/newsletter-subscribers';

export const newsletterService = {
  /**
   * GET /newsletter-subscribers
   */
  async getAll(filters?: FilterOptions): Promise<NewsletterSubscriberResponse[]> {
    const response = await api.get<ApiResponse<NewsletterSubscriberResponse[]>>(BASE, { params: filters });
    return response.data.data;
  },

  /**
   * GET /newsletter-subscribers/paginated?page=...&size=...
   */
  async getPaginated(
    page: number = 1,
    size: number = 10,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<NewsletterSubscriberResponse>> {
    const response = await api.get<ApiResponse<PaginatedResponse<NewsletterSubscriberResponse>>>(
      `${BASE}/paginated`,
      { params: { page, size, ...filters } }
    );
    return response.data.data;
  },

  /**
   * GET /newsletter-subscribers/active?sortBy=createdAt&direction=desc
   */
  async getActive(sortBy: string = 'createdAt', direction: 'asc' | 'desc' = 'desc'): Promise<NewsletterSubscriberResponse[]> {
    const response = await api.get<ApiResponse<NewsletterSubscriberResponse[]>>(`${BASE}/active`, {
      params: { sortBy, direction }
    });
    return response.data.data;
  },

  /**
   * GET /newsletter-subscribers/{id}
   */
  async getById(id: string): Promise<NewsletterSubscriberResponse> {
    const response = await api.get<ApiResponse<NewsletterSubscriberResponse>>(`${BASE}/${encodeURIComponent(id)}`);
    return response.data.data;
  },

  /**
   * GET /newsletter-subscribers/email/{email}
   */
  async getByEmail(email: string): Promise<NewsletterSubscriberResponse> {
    const response = await api.get<ApiResponse<NewsletterSubscriberResponse>>(
      `${BASE}/email/${encodeURIComponent(email)}`
    );
    return response.data.data;
  },

  /**
   * GET /newsletter-subscribers/reactive/{email}
   * (controller calls this 'resubscribe' and may send a verification email)
   */
  async resubscribe(email: string): Promise<NewsletterSubscriberResponse> {
    const response = await api.get<ApiResponse<NewsletterSubscriberResponse>>(
      `${BASE}/reactive/${encodeURIComponent(email)}`
    );
    return response.data.data;
  },

  /**
   * POST /newsletter-subscribers/subscribe
   */
  async subscribe(payload: CreateSubscriberRequest): Promise<NewsletterSubscriberResponse> {
    const response = await api.post<ApiResponse<NewsletterSubscriberResponse>>(`${BASE}/subscribe`, payload);
    return response.data.data;
  },

  /**
   * GET /newsletter-subscribers/verify?token=...&email=...
   * Returns boolean wrapped in ApiResponse
   */
  async verify(token: string, email: string): Promise<boolean> {
    const response = await api.get<ApiResponse<boolean>>(`${BASE}/verify`, {
      params: { token, email }
    });
    return response.data.data;
  },

  /**
   * DELETE /newsletter-subscribers/{email}
   * Note: controller mapping uses {email} (though parameter name mismatch existed server-side),
   * so we encode the email and call delete on that path.
   */
  async deleteByEmail(email: string): Promise<void> {
    await api.delete(`${BASE}/${encodeURIComponent(email)}`);
  },

  /**
   * Admin update (not present in controller but useful if added later)
   */
  async update(subscriber: UpdateSubscriberRequest): Promise<NewsletterSubscriberResponse> {
    const response = await api.put<ApiResponse<NewsletterSubscriberResponse>>(
      `${BASE}/${encodeURIComponent(subscriber.id)}`,
      subscriber
    );
    return response.data.data;
  }
};

