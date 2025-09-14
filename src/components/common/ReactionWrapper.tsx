import React, { useState, useEffect } from 'react';
import { ReactionButton } from './ReactionButton';
import { CommentSection } from './CommentSection';
import { ReactionType, ReactionResponse, ReactionCategory } from '../../types/Reaction';
import { reactionService } from '../../services/reactionService';


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
  const [likes, setLikes] = useState<number>(initialLikes);
  const [dislikes, setDislikes] = useState<number>(initialDislikes);
  const [comments, setComments] = useState<ReactionResponse[]>([]);
  const [, setCommentCount] = useState<number>(initialComments);
  const [currentUserReaction, setCurrentUserReaction] = useState<ReactionType | undefined>(userReaction);

  const handleReaction = async (type: ReactionType) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (currentUserReaction === type) {
        // Remove reaction
        await reactionService.deleteReactionByTargetAndUserAndType(targetType, targetId, type);
        setCurrentUserReaction(undefined);
        // Optimistically update counts
        if (type === 'LIKE') {
          setLikes(prev => Math.max(0, prev - 1));
        } else if (type === 'DISLIKE') {
          setDislikes(prev => Math.max(0, prev - 1));
        }
      } else {
        // Remove existing reaction if any
        if (currentUserReaction) {
          await reactionService.deleteReactionByTargetAndUserAndType(targetType, targetId, currentUserReaction);
          // Optimistically update counts for removed reaction
          if (currentUserReaction === 'LIKE') {
            setLikes(prev => Math.max(0, prev - 1));
          } else if (currentUserReaction === 'DISLIKE') {
            setDislikes(prev => Math.max(0, prev - 1));
          }
        }
        
        // Add new reaction
        await reactionService.createReaction(targetType, {
          type,
          targetId,
        });
        setCurrentUserReaction(type);
        // Optimistically update counts for new reaction
        if (type === 'LIKE') {
          setLikes(prev => prev + 1);
        } else if (type === 'DISLIKE') {
          setDislikes(prev => prev + 1);
        }
      }
      
      // Refresh counts to ensure accuracy
      await fetchReactions();
      await getCurrentUserReaction();
      onReactionChange?.();
    } catch (error) {
      console.error('Failed to update reaction:', error);
      // Revert optimistic updates on error
      await fetchReactions();
      await getCurrentUserReaction();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (comment: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await reactionService.createReaction(targetType, {
        type: 'COMMENT',
        targetId,
        comment,
      });
      // Optimistically update comment count
      setCommentCount(prev => prev + 1);
      
      // Refresh comments and counts
      const commentReactions = await reactionService.getReactionsByType(targetType, 'COMMENT', targetId);
      setComments(commentReactions);
      
      // Refresh all counts to ensure accuracy
      await fetchReactions();
      onReactionChange?.();
    } catch (error) {
      console.error('Failed to add comment:', error);
      // Revert optimistic update on error
      setCommentCount(prev => Math.max(0, prev - 1));
      await fetchReactions();
    } finally {
      setIsLoading(false);
    }
  };
  const getCurrentUserReaction = async () =>{
    const [curentUserLike, currentUserDislike] = await Promise.all([
      reactionService.getReactionsByTypeForCurrentUser(targetType, "LIKE", targetId),
      reactionService.getReactionsByTypeForCurrentUser(targetType, "DISLIKE", targetId)
    ]); 

    let curentReaction;
    if(curentUserLike.length > 0){
      curentReaction = curentUserLike[0].type;
    } else if(currentUserDislike.length > 0){
      curentReaction = currentUserDislike[0].type;
    }
    setCurrentUserReaction(curentReaction);
    return curentReaction;
  };
  const fetchReactions = async () => {
    const [reactionCounts, comment] = await Promise.all([
      reactionService.getAllReactionCountsByByTarget(targetType, targetId),
      reactionService.getReactionsByType(targetType, 'COMMENT', targetId),
    ]);
      setLikes(reactionCounts.LIKE);
      console.log('like', reactionCounts.LIKE);
      setDislikes(reactionCounts.DISLIKE);
      console.log('dislike', reactionCounts.DISLIKE);
      setCommentCount(reactionCounts.COMMENT);
      setComments(comment || []);
      console.log('comment', comment);

    };
  useEffect(() => {
    fetchReactions();
    getCurrentUserReaction();
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
x
        {/* Comments section */}
        <CommentSection
          className="flex items-center space-x-6 px-2"
          comments={comments}
          onAddComment={handleAddComment}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
