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

export interface Reaction {
  id: string;
  type: ReactionType;
  comment?: string;
  userId: string;
  userName?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReactionType = 'LIKE' | 'DISLIKE' | 'COMMENT';
export type ReactionCategory = 'POST' | 'PUBLICATION' | 'EVENT' | 'QUOTE';

export interface ReactionRequest {
  type: ReactionType;
  comment?: string;
  targetId: string;
}

export interface UpdateReactionRequest {
  type?: ReactionType;
  comment?: string;
}

export interface ReactionResponse {
  id: string;
  type: ReactionType;
  comment?: string;
  userId: string;
  userName?: string;
  targetId: string;
  createdAt: string;
  updatedAt: string;
}
