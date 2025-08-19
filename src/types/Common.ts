export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  // Date filters
  date?: string; // ISO date string for exact date
  startDate?: string; // ISO date string for date range start
  endDate?: string; // ISO date string for date range end
  
  // Legacy date filters (for backward compatibility)
  year?: number;
  month?: number;
  day?: number;
  
  // Other filters
  status?: string; // PublicationStatus
  authorId?: string;
  search?: string;
  category?: string;
  featured?: boolean;

  // member filters
  positionType?: string;
  position?: string;
}

export type LayoutType = 'grid' | 'list' | 'masonry';

export interface ExportOptions {
  format: 'pdf' | 'ppt';
  items: string[]; // IDs of items to export
  title?: string;
}