import { api } from './api';
import { NewsletterSchedule, NewsletterScheduleCreate, NewsletterScheduleUpdate } from '../types/NewsletterSchedule';

const BASE = '/newsletter-schedules';

export const newsletterScheduleService = {
  async getAll(): Promise<NewsletterSchedule[]> {
    const res = await api.get<NewsletterSchedule[]>(BASE);
    return res.data;
  },

  async create(data: NewsletterScheduleCreate): Promise<NewsletterSchedule> {
    const res = await api.post<NewsletterSchedule>(BASE, data);
    return res.data;
  },

  async update(id: string, data: NewsletterScheduleUpdate): Promise<NewsletterSchedule> {
    const res = await api.put<NewsletterSchedule>(`${BASE}/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },

  async runNow(id: string): Promise<void> {
    await api.post(`${BASE}/${id}/run`);
  },
};

export default newsletterScheduleService;
