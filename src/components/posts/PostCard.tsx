import React, { useState, useEffect } from 'react';
import { ReactionWrapper } from '../common/ReactionWrapper';
import { Post } from '../../types/Post';
import { VideoPlayer } from 'react-video-audio-player';
import { mediaService } from '../../services/mediaService';

interface PostCardProps {
  post: Post;
  onReactionChange?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onReactionChange }) => {
  const [videoBlob, setVideoBlob] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Load video as blob for better performance
  useEffect(() => {
    if (post.type === 'VIDEO' && post.id && !videoBlob) {
      setIsLoadingVideo(true);
      mediaService.getMediaAsBlobUrl(post.id)
        .then(blobUrl => {
          setVideoBlob(blobUrl);
        })
        .catch(error => {
          console.error('Failed to load video:', error);
          setVideoBlob(null);
        })
        .finally(() => {
          setIsLoadingVideo(false);
        });
    }
  }, [post.type, post.id, videoBlob]);

  // Load image with authentication
  useEffect(() => {
    if (post.type === 'IMAGE' && post.id && !imageUrl) {
      setImageUrl(mediaService.getImageUrl(post.id));
    }
  }, [post.type, post.id, imageUrl]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (videoBlob && videoBlob.startsWith('blob:')) {
        URL.revokeObjectURL(videoBlob);
      }
    };
  }, [videoBlob]);

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
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items -center justify-center">
            <span className="text-white font-bold text-sm">
              {'P'}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {'SDA Church'}
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
              <div className="relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Post content"
                    className="w-full h-auto rounded-lg object-cover max-h-96"
                    onError={() => {
                      console.error('Failed to load image');
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500">Loading image...</div>
                  </div>
                )}
              </div>
            ) : post.type === 'VIDEO' ? (
              <div className="relative">
                {isLoadingVideo ? (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500">Loading video...</div>
                  </div>
                ) : videoBlob ? (
                  <VideoPlayer
                    src={videoBlob}
                    controls
                    className="w-full h-auto rounded-lg max-h-96 min-h-64"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500">Failed to load video</div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </ReactionWrapper>
  );
};
