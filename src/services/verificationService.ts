import { api } from './api';
import { ApiResponse } from '../types/Common';


export interface VerificationRequest {
  email: string;
  code: string;
}

export interface NewsletterSubscriptionRequest {
  email: string;
}

export interface ResendCodeRequest {
  email: string;
  type: 'USER_REGISTRATION' | 'NEWSLETTER_SUBSCRIPTION';
}

export const verificationService = {
  // Verify user registration
  async verifyUser(token:string, email:string): Promise<ApiResponse<boolean>> {
    const response = await api.get<ApiResponse<boolean>>('/users/verify', {
      params: { token, email }
    });
    return response.data;
  },
  // Verify newsletter subscription
  async verifyNewsletter(data: VerificationRequest): Promise<ApiResponse<boolean>> {
    const response = await api.put<ApiResponse<boolean>>('/newsletter-subscribers/verify', data);
    return response.data;
  },

  // Resend verification code
  async resendCode(data: ResendCodeRequest): Promise<ApiResponse<string>> {
    const response = await api.post<ApiResponse<string>>('/verification/resend', data);
    return response.data;
  }
};
