export interface Post {
  id: string;
  caption: string;
  resourceUrl?: string;
  type?: PostType;
  isPublic: boolean;
  authorId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}
export type PostType = 'IMAGE' | 'VIDEO' | 'TEXT';

export interface CreatePostRequest {
  caption: string;
  isPublic?: boolean;
}

export interface CreateImagePostRequest {
  caption: string;
  file: File;
  isPublic?: boolean;
}

export interface CreateVideoPostRequest {
  caption: string;
  file: File;
  isPublic?: boolean;
}

export interface UpdatePostRequest {
  caption: string;
}
