import { ReactionType } from "./Reaction";

export interface Post {
  id: string;
  caption: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  isPublic: boolean;
  authorId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  userReaction?: ReactionType;
}

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
