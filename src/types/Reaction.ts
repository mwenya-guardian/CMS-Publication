export interface Reaction {
    id: string;
    type: ReactionType;
    comment?: string;
    userId: string;
    userName?: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface ReactionCounts {
    LIKE: number;
    DISLIKE: number;
    COMMENT: number;
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