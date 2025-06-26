export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  category: 'wedding' | 'conference' | 'workshop' | 'social' | 'other';
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  category: 'wedding' | 'conference' | 'workshop' | 'social' | 'other';
  featured?: boolean;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}