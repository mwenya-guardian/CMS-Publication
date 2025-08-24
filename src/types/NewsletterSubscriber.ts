export interface NewsletterSubscriberResponse {
  id: string;
  email: string;
  active: boolean;
  verified: boolean;
  verificationToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubscriberRequest {
  email: string;
}

export interface UpdateSubscriberRequest {
  id: string;
  email?: string;
  active?: boolean;
  verified?: boolean;
}