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
  year?: number;
  month?: number;
  day?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}

export type LayoutType = 'grid' | 'list' | 'masonry';

export interface ExportOptions {
  format: 'pdf' | 'ppt';
  items: string[]; // IDs of items to export
  title?: string;
}