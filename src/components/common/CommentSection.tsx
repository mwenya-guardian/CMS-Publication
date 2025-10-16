import React, { useState, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { ReactionResponse } from '../../types/Reaction';
import { userService } from '../../services/userService';

interface CommentSectionProps {
  className?: string;
  comments: ReactionResponse[];
  onAddComment: (comment: string) => void;
  isLoading?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  className,
  comments,
  onAddComment,
  isLoading = false,
}) => {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  // Fetch user names for comments
  useEffect(() => {
    const fetchUserNames = async () => {
      const uniqueUserIds = [...new Set(comments.map(comment => comment.userId))];
      const namePromises = uniqueUserIds.map(async (userId) => {
        try {
          const fullName = await userService.getFullName(userId);
          return { userId, fullName };
        } catch (error) {
          console.error(`Failed to fetch name for user ${userId}:`, error);
          return { userId, fullName: 'Unknown User' };
        }
      });

      const results = await Promise.all(namePromises);
      const nameMap = results.reduce((acc, { userId, fullName }) => {
        acc[userId] = fullName;
        return acc;
      }, {} as Record<string, string>);

      setUserNames(nameMap);
    };

    if (comments.length > 0) {
      fetchUserNames();
    }
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className={` grid grid-cols-1 border-t border-gray-200 pt-4 ${className}`}>
      {/* Comment toggle button */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
      >
        <MessageCircle className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </button>

      {/* Comments section */}
      {showComments && (
        <div className="mt-4 space-y-4 col-span-1">
          {/* Add comment form */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Comments list */}
          <div className="space-y-3 col-span-1 max-h-[300px] overflow-y-auto max-w-[500px] scrollbar-hide">
            {comments
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((comment) => {
              const displayName = userNames[comment.userId] || comment.userName || 'Loading...';
              const initials = displayName.split(' ').map(name => name.charAt(0)).join('').toUpperCase() || 'U';
              
              return (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {initials}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-sm font-medium text-gray-900">
                        {displayName}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
