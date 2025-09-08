import React, { useState } from 'react';
import { ReactionButton } from '../common/ReactionButton';
import { CommentSection } from '../common/CommentSection';
import { Post, ReactionType, ReactionResponse } from '../../types/Post';
import { postService } from '../../services/postService';

interface PostCardProps {
  post: Post;
  onReactionChange?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onReactionChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<ReactionResponse[]>([]);
  const [showComments, setShowComments] = useState(false);

  const handleReaction = async (type: ReactionType) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (post.userReaction === type) {
        // Remove reaction
        await postService.deleteReaction('POST', post.id);
      } else {
        // Add or change reaction
        await postService.createReaction('POST', {
          type,
          targetId: post.id,
        });
      }
      onReactionChange?.();
    } catch (error) {
      console.error('Failed to update reaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (comment: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await postService.createReaction('POST', {
        type: 'LIKE', // Comments are treated as LIKE reactions with comment text
        targetId: post.id,
        comment,
      });
      onReactionChange?.();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Post header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {post.authorName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {post.authorName || 'Anonymous'}
            </h3>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Post content */}
      <div className="p-4">
        <p className="text-gray-900 mb-4">{post.caption}</p>
        
        {/* Media content */}
        {post.mediaUrl && (
          <div className="mb-4">
            {post.mediaType === 'IMAGE' ? (
              <img
                src={post.mediaUrl}
                alt="Post content"
                className="w-full h-auto rounded-lg object-cover max-h-96"
              />
            ) : post.mediaType === 'VIDEO' ? (
              <video
                src={post.mediaUrl}
                controls
                className="w-full h-auto rounded-lg max-h-96"
              >
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        )}
      </div>

      {/* Reactions and comments */}
      <div className="px-4 pb-4">
        {/* Reaction buttons */}
        <div className="flex items-center space-x-4 mb-4">
          <ReactionButton
            type="LIKE"
            count={post.likesCount}
            isActive={post.userReaction === 'LIKE'}
            onClick={() => handleReaction('LIKE')}
            disabled={isLoading}
          />
          <ReactionButton
            type="LOVE"
            count={0} // You might want to track this separately
            isActive={post.userReaction === 'LOVE'}
            onClick={() => handleReaction('LOVE')}
            disabled={isLoading}
          />
          <ReactionButton
            type="WOW"
            count={0} // You might want to track this separately
            isActive={post.userReaction === 'WOW'}
            onClick={() => handleReaction('WOW')}
            disabled={isLoading}
          />
        </div>

        {/* Comments section */}
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
