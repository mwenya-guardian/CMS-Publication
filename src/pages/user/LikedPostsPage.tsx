import React, { useState, useEffect } from 'react';
import { PostCard } from '../../components/posts/PostCard';
import { Pagination } from '../../components/common/Pagination';
import { Post } from '../../types/Post';
import { postService } from '../../services/postService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Heart } from 'lucide-react';

export const LikedPostsPage: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadLikedPosts();
  }, [page]);

  const loadLikedPosts = async () => {
    setIsLoading(true);
    try {
      // For now, we'll get all posts and filter those with user reactions
      // In a real implementation, you'd have a specific endpoint for liked posts
      const response = await postService.getPosts(page, 10);
      const allPosts = response.data || [];
      
      // Filter posts that the user has reacted to
      const liked = allPosts.filter(post => post.userReaction);
      setLikedPosts(liked);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load liked posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleReactionChange = () => {
    loadLikedPosts(); // Reload to get updated list
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <Heart className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Liked Posts</h1>
            <p className="text-gray-600">
              Posts you've reacted to and want to revisit.
            </p>
          </div>
        </div>
      </div>

      {/* Liked Posts */}
      <div className="space-y-4">
        {likedPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No liked posts yet.</p>
            <p className="text-gray-400 mt-2">
              Start reacting to posts to see them here.
            </p>
          </div>
        ) : (
          likedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onReactionChange={handleReactionChange}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
