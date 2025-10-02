// Analysis Types
export interface CommentAnalysis {
  id: string;
  commentId: string;
  entityType: 'POST' | 'EVENT' | 'QUOTE' | 'PUBLICATION';
  entityId: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // 0.0 - 1.0
  moderationFlagged: boolean;
  moderationCategories: string[];
  moderationConfidence: number;
  modelName: string;
  analyzedAt: string;
  rawResponse: string;
}

export interface AnalysisJob {
  id: string;
  entityType: 'POST' | 'EVENT' | 'QUOTE' | 'PUBLICATION';
  entityId: string;
  submittedAt: string;
  completedAt?: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  totalComments: number;
  processedComments: number;
  failureReason?: string;
  meta: Record<string, any>;
}

export interface AnalysisAlert {
  id: string;
  entityType: 'POST' | 'EVENT' | 'QUOTE' | 'PUBLICATION';
  entityId: string;
  metric: string;
  currentValue: number;
  baselineValue: number;
  windowStart: string;
  windowEnd: string;
  severity: 'WARNING' | 'CRITICAL';
  note: string;
  createdAt: string;
}

export interface BulkAnalysisRequest {
  entityType: 'POST' | 'EVENT' | 'QUOTE' | 'PUBLICATION';
  entityId: string;
  maxComments?: number;
  since?: string;
}

export interface BulkAnalysisResponse {
  jobId: string | null;
  chunksSubmitted: number;
}

export interface TrendData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export interface AnalysisStats {
  totalAnalyzed: number;
  flaggedComments: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentAlerts: AnalysisAlert[];
  trendData: TrendData[];
}
