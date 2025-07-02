export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  category: Category;
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
  category: Category;
  featured?: boolean;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

export type Category = 'WEDDING' | 'CONFERENCE' | 'WORKSHOP' | 'SOCIAL' | 'OTHER' | 'FINERAL';
export const CategoryValues = {
  WEDDING: 'WEDDING',
  CONFERENCE: 'CONFERENCE',
  WORKSHOP: 'WORKSHOP',
  SOCIAL: 'SOCIAL',
  OTHER: 'OTHER',
  FINERAL: 'FINERAL',
}