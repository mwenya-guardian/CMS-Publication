import api from './api';
import { 
  CommentAnalysis, 
  AnalysisJob, 
  AnalysisAlert,
  BulkAnalysisRequest, 
  BulkAnalysisResponse,
  AnalysisStats,
  TrendData 
} from '../types/Analysis';
import { ApiResponse, PaginatedResponse, FilterOptions } from '../types/Common';

export const analysisService = {
  // AI Analysis Operations
  async chat(text: string): Promise<string> {
    const response = await api.get<string>('/ai/chat', { params: { text } });
    return response.data;
  },

  async submitBulkAnalysis(request: BulkAnalysisRequest): Promise<BulkAnalysisResponse> {
    const response = await api.post<BulkAnalysisResponse>('/ai/analyze/bulk', request);
    return response.data;
  },

  async getJob(jobId: string): Promise<AnalysisJob> {
    const response = await api.get<AnalysisJob>(`/ai/jobs/${jobId}`);
    return response.data;
  },

  async getAllJobs(): Promise<AnalysisJob[]> {
    const response = await api.get<AnalysisJob[]>('/ai/jobs');
    return response.data;
  },

  // Comment Analysis Operations
  async getAnalysisByEntity(
    entityType: string, 
    entityId: string, 
    page: number = 1, 
    size: number = 10,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<CommentAnalysis>> {
    const response = await api.get<ApiResponse<PaginatedResponse<CommentAnalysis>>>(
      `/analysis/comments`, 
      { 
        params: { 
          entityType, 
          entityId, 
          page, 
          size, 
          ...filters 
        } 
      }
    );
    return response.data.data;
  },

  async getFlaggedComments(
    page: number = 1, 
    size: number = 10,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<CommentAnalysis>> {
    const response = await api.get<ApiResponse<PaginatedResponse<CommentAnalysis>>>(
      `/analysis/comments/flagged`, 
      { 
        params: { 
          page, 
          size, 
          ...filters 
        } 
      }
    );
    return response.data.data;
  },

  async getAnalysisById(id: string): Promise<CommentAnalysis> {
    const response = await api.get<ApiResponse<CommentAnalysis>>(`/analysis/comments/${id}`);
    return response.data.data;
  },

  // Alerts Operations
  async getAlerts(
    page: number = 1, 
    size: number = 10,
    filters?: FilterOptions
  ): Promise<PaginatedResponse<AnalysisAlert>> {
    const response = await api.get<ApiResponse<PaginatedResponse<AnalysisAlert>>>(
      `/analysis/alerts`, 
      { 
        params: { 
          page, 
          size, 
          ...filters 
        } 
      }
    );
    return response.data.data;
  },

  async getAlertsByEntity(
    entityType: string, 
    entityId: string,
    page: number = 1, 
    size: number = 10
  ): Promise<PaginatedResponse<AnalysisAlert>> {
    const response = await api.get<ApiResponse<PaginatedResponse<AnalysisAlert>>>(
      `/analysis/alerts/entity`, 
      { 
        params: { 
          entityType, 
          entityId, 
          page, 
          size 
        } 
      }
    );
    return response.data.data;
  },

  // Stats and Trends
  async getAnalysisStats(): Promise<AnalysisStats> {
    const response = await api.get<ApiResponse<AnalysisStats>>('/analysis/stats');
    return response.data.data;
  },

  async getTrendData(
    entityType?: string, 
    entityId?: string, 
    days: number = 30
  ): Promise<TrendData[]> {
    const response = await api.get<ApiResponse<TrendData[]>>('/analysis/trends', {
      params: { entityType, entityId, days }
    });
    return response.data.data;
  },

  // Utility methods
  async getEntityTitle(entityType: string, entityId: string): Promise<string> {
    const response = await api.get<ApiResponse<string>>(`/analysis/entity-title`, {
      params: { entityType, entityId }
    });
    return response.data.data;
  },

  async getCommentDetails(commentId: string, entityType: string): Promise<any> {
    const response = await api.get<ApiResponse<any>>(`/analysis/comment-details/${commentId}`, {
      params: { entityType }
    });
    return response.data.data;
  }
};

export default analysisService;
