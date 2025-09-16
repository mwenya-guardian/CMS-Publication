export interface NewsletterSchedule {
  id: string;
  title: string;
  description?: string;
  cronExpression: string;
  zoneId: string;
  bulletinIds: string[];
  sendToAll: boolean;
  subscriberIds?: string[];
  enabled: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
}

export type NewsletterScheduleCreate = Omit<NewsletterSchedule, 'id' | 'lastRunAt' | 'nextRunAt'>;
export type NewsletterScheduleUpdate = Partial<Omit<NewsletterSchedule, 'id'>>;
