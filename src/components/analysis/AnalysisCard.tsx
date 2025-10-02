import React from 'react';
import { CommentAnalysis } from '../../types/Analysis';
import { AlertTriangle, MessageCircle, Calendar, User } from 'lucide-react';
import { dateUtils } from '../../utils/dateUtils';

interface AnalysisCardProps {
  analysis: CommentAnalysis;
  onViewDetails?: () => void;
  showEntityInfo?: boolean;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ 
  analysis, 
  onViewDetails, 
  showEntityInfo = true 
}) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (categories: string[]) => {
    if (!categories || categories.length === 0) return 'text-gray-500';
    
    const severeCats = ['hate', 'violence', 'bullying', 'harassment'];
    const hasSevere = categories.some(cat => 
      severeCats.some(severe => cat.toLowerCase().includes(severe))
    );
    
    return hasSevere ? 'text-red-600' : 'text-orange-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Comment Analysis</span>
          {analysis.moderationFlagged && (
            <AlertTriangle className={`h-4 w-4 ${getSeverityColor(analysis.moderationCategories)}`} />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(analysis.sentiment)}`}>
            {analysis.sentiment}
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(analysis.sentimentScore * 100)}%
          </span>
        </div>
      </div>

      {/* Entity Info */}
      {showEntityInfo && (
        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
          <span className="font-medium">{analysis.entityType}</span>
          <span>ID: {analysis.entityId.substring(0, 8)}...</span>
        </div>
      )}

      {/* Moderation Info */}
      {analysis.moderationFlagged && (
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <AlertTriangle className={`h-4 w-4 ${getSeverityColor(analysis.moderationCategories)}`} />
            <span className="text-sm font-medium text-gray-900">Moderation Alert</span>
            <span className="text-xs text-gray-500">
              {Math.round(analysis.moderationConfidence * 100)}% confidence
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {analysis.moderationCategories.map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{dateUtils.formatDate(analysis.analyzedAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>{analysis.modelName}</span>
          </div>
        </div>
        
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};
