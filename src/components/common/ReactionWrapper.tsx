import React, { useState, useEffect } from 'react';
import { ReactionButton } from './ReactionButton';
import { CommentSection } from './CommentSection';
import { ReactionType, ReactionResponse, ReactionCategory } from '../../types/Post';
import { postService } from '../../services/postService';

interface ReactionWrapperProps {
  targetId: string;
  targetType: ReactionCategory;
  initialLikes?: number;
  initialDislikes?: number;
  initialComments?: number;
  userReaction?: ReactionType;
  onReactionChange?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const ReactionWrapper: React.FC<ReactionWrapperProps> = ({
  targetId,
  targetType,
  initialLikes = 0,
  initialDislikes = 0,
  initialComments = 0,
  userReaction,
  onReactionChange,
  className = '',
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [comments, setComments] = useState<ReactionResponse[]>([]);
  const [currentUserReaction, setCurrentUserReaction] = useState<ReactionType | undefined>(userReaction);

  const handleReaction = async (type: ReactionType) => {
    if (isLoading) return;
    
    // setIsLoading(true);
    try {
      if (currentUserReaction === type) {
        // Remove reaction
        await postService.deleteReaction(targetType, targetId);
        setCurrentUserReaction(undefined);
        // Update counts
        if (type === 'LIKE') {
          setLikes(prev => Math.max(0, prev - 1));
        } else if (type === 'DISLIKE') {
          setDislikes(prev => Math.max(0, prev - 1));
        }
      } else {
        // Add or change reaction
        await postService.createReaction(targetType, {
          type,
          targetId,
        });
        
        // Update previous reaction count
        if (currentUserReaction === 'LIKE') {
          setLikes(prev => Math.max(0, prev - 1));
        } else if (currentUserReaction === 'DISLIKE') {
          setDislikes(prev => Math.max(0, prev - 1));
        }
        
        // Update new reaction count
        if (type === 'LIKE') {
          setLikes(prev => prev + 1);
        } else if (type === 'DISLIKE') {
          setDislikes(prev => prev + 1);
        }
        
        setCurrentUserReaction(type);
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
    
    // setIsLoading(true);
    try {
      await postService.createReaction(targetType, {
        type: 'COMMENT', // Comments are treated as LIKE reactions with comment text
        targetId,
        comment,
      });
      const reaction = await postService.getReactionByType(targetType, 'COMMENT', targetId);
      setComments(reaction);
      onReactionChange?.();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const fetchReactions = async () => {
    const [like, dislike, comment] = await Promise.all([
      postService.getReactionByType(targetType, 'LIKE', targetId),
      postService.getReactionByType(targetType, 'DISLIKE', targetId),
      postService.getReactionByType(targetType, 'COMMENT', targetId),
    ]);
      setLikes(like.length);
      console.log('like', like);
      setDislikes(dislike.length);
      console.log('dislike', dislike);
      setComments(comment || []);
      console.log('comment', comment);
    };
    fetchReactions();
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {children}
      
      {/* Reaction buttons */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <ReactionButton
            type="LIKE"
            count={likes}
            isActive={currentUserReaction === 'LIKE'}
            onClick={() => handleReaction('LIKE')}
            disabled={isLoading}
          />
          <ReactionButton
            type="DISLIKE"
            count={dislikes}
            isActive={currentUserReaction === 'DISLIKE'}
            onClick={() => handleReaction('DISLIKE')}
            disabled={isLoading}
          />
          {/* <ReactionButton
            type="LOVE"
            count={0} // You might want to track this separately
            isActive={currentUserReaction === 'LOVE'}
            onClick={() => handleReaction('LOVE')}
            disabled={isLoading}
          /> */}
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
