export interface Publication {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
  layoutType: 'grid' | 'list' | 'masonry';
  author?: string;
  tags?: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePublicationRequest {
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
  layoutType: 'grid' | 'list' | 'masonry';
  author?: string;
  tags?: string[];
  featured?: boolean;
}

export interface UpdatePublicationRequest extends Partial<CreatePublicationRequest> {
  id: string;
}