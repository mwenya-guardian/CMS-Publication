import React, { useState, useEffect } from 'react';
import { User, ExternalLink, Calendar, MessageSquare, AlertTriangle } from 'lucide-react';
import { CommentAnalysis } from '../../types/Analysis';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { analysisService } from '../../services/analysisService';
import { userService } from '../../services/userService';
import { dateUtils } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

interface CommentDetailsModalProps {
  analysis: CommentAnalysis | null;
  isOpen: boolean;
  onClose: () => void;
}

interface CommentDetails {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  entity: {
    id: string;
    title: string;
    type: string;
    content?: string;
    author?: string;
  };
  comment: {
    content: string;
    createdAt: string;
  };
}

export const CommentDetailsModal: React.FC<CommentDetailsModalProps> = ({
  analysis,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const [details, setDetails] = useState<CommentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && analysis) {
      loadCommentDetails();
    }
  }, [isOpen, analysis]);

  const loadCommentDetails = async () => {
    if (!analysis) return;

    try {
      setIsLoading(true);
      setError('');

      // Get comment details from reaction service (assuming we can get user and comment info)
      const commentData = await getCommentData(analysis.commentId, analysis.entityType);
      const userData = await userService.getById(commentData.userId);
      const entityData = await getEntityData(analysis.entityType, analysis.entityId);

      setDetails({
        user: {
          id: userData.id || '',
          firstname: userData.firstname || '',
          lastname: userData.lastname || '',
          email: userData.email || ''
        },
        entity: {
          id: entityData.id,
          title: entityData.title,
          type: analysis.entityType,
          content: entityData.content,
          author: entityData.author
        },
        comment: {
          content: commentData.content,
          createdAt: commentData.createdAt
        }
      });
    } catch (err) {
      console.error('Failed to load comment details:', err);
      setError('Failed to load comment details');
    } finally {
      setIsLoading(false);
    }
  };

  const getCommentData = async (commentId: string, entityType: string) => {
    const commentDetails = await analysisService.getCommentDetails(commentId, entityType);
    return {
      userId: commentDetails.userId,
      content: commentDetails.content,
      createdAt: commentDetails.createdAt
    };
  };

  const getEntityData = async (entityType: string, entityId: string) => {
    switch (entityType) {
      case 'POST':
        // For now, we'll use a placeholder since getById method doesn't exist
        // You'll need to implement this method in postService or use an alternative
        return {
          id: entityId,
          title: 'Post Content',
          content: 'Post content will be displayed here once the proper API endpoint is implemented.',
          author: 'Post Author'
        };
      case 'EVENT':
        // For now, we'll use a placeholder since getEventById method doesn't exist
        // You'll need to implement this method in eventService or use an alternative
        return {
          id: entityId,
          title: 'Event Title',
          content: 'Event details will be displayed here once the proper API endpoint is implemented.',
          author: 'Event Organizer'
        };
      case 'QUOTE':
        // For now, we'll use a placeholder since getQuoteById method doesn't exist
        // You'll need to implement this method in quoteService or use an alternative
        return {
          id: entityId,
          title: 'Quote Title',
          content: 'Quote text will be displayed here once the proper API endpoint is implemented.',
          author: 'Quote Author'
        };
      case 'PUBLICATION':
        // For now, we'll use a placeholder since getPublicationById method doesn't exist
        // You'll need to implement this method in publicationService or use an alternative
        return {
          id: entityId,
          title: 'Publication Title',
          content: 'Publication content will be displayed here once the proper API endpoint is implemented.',
          author: 'Publication Author'
        };
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  };

  const handleViewUser = () => {
    if (details?.user.id) {
      // Navigate to user page with search parameter
      navigate(`/admin/users?search=${encodeURIComponent(details.user.email)}`);
      onClose();
    }
  };

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

  if (!analysis) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comment Analysis Details">
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <AlertTriangle className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Details</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : details ? (
          <>
            {/* Analysis Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Sentiment:</span>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(analysis.sentiment)}`}>
                      {analysis.sentiment} ({Math.round(analysis.sentimentScore * 100)}%)
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Analyzed:</span>
                  <p className="text-sm text-gray-900 mt-1">
                    {dateUtils.formatDate(analysis.analyzedAt)}
                  </p>
                </div>
              </div>

              {analysis.moderationFlagged && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className={`h-4 w-4 ${getSeverityColor(analysis.moderationCategories)}`} />
                    <span className="text-sm font-medium text-gray-900">Moderation Alert</span>
                    <span className="text-xs text-gray-500">
                      ({Math.round(analysis.moderationConfidence * 100)}% confidence)
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
            </div>

            {/* User Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Comment Author</h3>
                <Button
                  onClick={handleViewUser}
                  size="sm"
                  variant="outline"
                  icon={ExternalLink}
                >
                  View User
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {details.user.firstname} {details.user.lastname}
                  </p>
                  <p className="text-sm text-gray-600">{details.user.email}</p>
                </div>
              </div>
            </div>

            {/* Comment Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Comment</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {dateUtils.formatDate(details.comment.createdAt)}
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-gray-900">{details.comment.content}</p>
              </div>
            </div>

            {/* Related Content */}
            {/* <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Related {details.entity.type}
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{details.entity.title}</h4>
                  {details.entity.author && (
                    <p className="text-sm text-gray-600">by {details.entity.author}</p>
                  )}
                </div>
                {details.entity.content && (
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-gray-700 text-sm line-clamp-4">
                      {details.entity.content}
                    </p>
                  </div>
                )}
              </div>
            </div> */}

            {/* Technical Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Technical Details</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-600">Analysis ID:</span>
                  <p className="text-gray-900 font-mono">{analysis.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Comment ID:</span>
                  <p className="text-gray-900 font-mono">{analysis.commentId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Entity ID:</span>
                  <p className="text-gray-900 font-mono">{analysis.entityId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Model:</span>
                  <p className="text-gray-900">{analysis.modelName}</p>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
