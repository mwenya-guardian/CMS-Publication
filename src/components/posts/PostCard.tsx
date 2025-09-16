import React from 'react';
import { ReactionWrapper } from '../common/ReactionWrapper';
import { Post } from '../../types/Post';

interface PostCardProps {
  post: Post;
  onReactionChange?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onReactionChange }) => {
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
    <ReactionWrapper
      targetId={post.id}
      targetType="POST"
      // initialLikes={post.likesCount || 0}
      // initialDislikes={post.dislikesCount || 0}
      // initialComments={post.commentsCount || 0}
      // userReaction={post.userReaction || undefined}
      onReactionChange={onReactionChange}
      className=""
    >
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
        {post.resourceUrl && (
          <div className="mb-4">
            {post.type === 'IMAGE' ? (
              <img
                src={post.resourceUrl}
                alt="Post content"
                className="w-full h-auto rounded-lg object-cover max-h-96"
              />
            ) : post.type === 'VIDEO' ? (
              <video
                src={post.resourceUrl}
                controls
                className="w-full h-auto rounded-lg max-h-96"
              >
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        )}
      </div>
    </ReactionWrapper>
  );
};
