import { api } from './api';
import { ApiResponse } from '../types/Common';
import { ReactionCategory, ReactionType, ReactionResponse, ReactionRequest, UpdateReactionRequest, ReactionCounts } from '../types/Reaction';

export const reactionService = {
    
  // Reaction methods
  async createReaction(category: ReactionCategory, data: ReactionRequest): Promise<ReactionResponse> {
    const response = await api.post<ApiResponse<ReactionResponse>>(`/reactions/${category}`, data);
    return response.data.data;
  },

  async getAllReactionsByTarget(category: ReactionCategory, id: string): Promise<ReactionResponse[]> {
    const response = await api.get<ApiResponse<ReactionResponse[]>>(`/reactions/${category}/${id}`);
    return response.data.data;
  },
  async getReactionsByType(category: ReactionCategory, type: ReactionType, id: string): Promise<ReactionResponse[]> {
    const response = await api.get<ApiResponse<ReactionResponse[]>>(`/reactions/${category}/${type}/${id}`);
    return response.data.data;
  },
  async getReactionsByTypeForCurrentUser(category: ReactionCategory, type: ReactionType, id: string): Promise<ReactionResponse[]> {
    const response = await api.get<ApiResponse<ReactionResponse[]>>(`/reactions/${category}/${type}/${id}/me`);
    return response.data.data;
  },
  async getReactionCountByType(category: ReactionCategory, type: ReactionType, id: string): Promise<number> {
    const response = await api.get<ApiResponse<number>>(`/reactions/count/${category}/${type}/${id}`);
    return response.data.data;
  },
  async getAllReactionCountsByByTarget(category: ReactionCategory, id: string): Promise<ReactionCounts> {
    const response = await api.get<ApiResponse<ReactionCounts>>(`/reactions/count/${category}/${id}`);
    return response.data.data;
  },
  async updateReaction(category: ReactionCategory, id: string, data: UpdateReactionRequest): Promise<ReactionResponse> {
    const response = await api.put<ApiResponse<ReactionResponse>>(`/reactions/${category}/${id}`, data);
    return response.data.data;
  },

  async deleteReaction(category: ReactionCategory, id: string): Promise<void> {
    await api.delete(`/reactions/${category}/${id}`);
  },
  async deleteReactionByTargetAndUserAndType(category: ReactionCategory, targetId: string, type: ReactionType): Promise<void> {
    await api.delete(`/reactions/${category}/${type}/${targetId}/me`);
  },
}