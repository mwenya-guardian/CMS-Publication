import api from './api';
import { AnalysisSchedule } from '../types/Analysis';

export const analysisScheduleService = {
  // Get all analysis schedules
  async getAll(): Promise<AnalysisSchedule[]> {
    const response = await api.get<AnalysisSchedule[]>('/analysis-schedules');
    return response.data;
  },

  // Get analysis schedule by ID
  async getById(id: string): Promise<AnalysisSchedule> {
    const response = await api.get<AnalysisSchedule>(`/analysis-schedules/${id}`);
    return response.data;
  },

  // Create new analysis schedule
  async create(schedule: Omit<AnalysisSchedule, 'id' | 'createdAt' | 'updatedAt' | 'lastRunAt'>): Promise<AnalysisSchedule> {
    const response = await api.post<AnalysisSchedule>('/analysis-schedules', schedule);
    return response.data;
  },

  // Update analysis schedule
  async update(id: string, schedule: Partial<AnalysisSchedule>): Promise<AnalysisSchedule> {
    const response = await api.put<AnalysisSchedule>(`/analysis-schedules/${id}`, schedule);
    return response.data;
  },

  // Delete analysis schedule
  async delete(id: string): Promise<void> {
    await api.delete(`/analysis-schedules/${id}`);
  },

  // Enable analysis schedule
  async enable(id: string): Promise<void> {
    await api.post(`/analysis-schedules/${id}/enable`);
  },

  // Disable analysis schedule
  async disable(id: string): Promise<void> {
    await api.post(`/analysis-schedules/${id}/disable`);
  },

  // Run schedule now
  async runNow(id: string): Promise<void> {
    await api.post(`/analysis-schedules/${id}/run-now`);
  },

  // Get schedules by model type
  async getByModelType(modelType: string): Promise<AnalysisSchedule[]> {
    const response = await api.get<AnalysisSchedule[]>(`/analysis-schedules/by-model-type/${modelType}`);
    return response.data;
  }
};

export default analysisScheduleService;
