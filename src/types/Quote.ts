export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category?: string;
  imageUrl?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuoteRequest {
  text: string;
  author: string;
  source?: string;
  category?: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface UpdateQuoteRequest extends Partial<CreateQuoteRequest> {
  id: string;
}