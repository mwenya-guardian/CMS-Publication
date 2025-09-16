import React, { useState, useEffect } from 'react';
import { PostCard } from '../../components/posts/PostCard';
import { Post } from '../../types/Post';
import { postService } from '../../services/postService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Heart, RefreshCw } from 'lucide-react';

export const LikedPostsPage: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  // Buffer management states
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    if (page === 1) {
      loadLikedPosts();
    } else {
      loadMoreLikedPosts();
    }
  }, [page]);

  const loadLikedPosts = async () => {
    setIsLoading(true);
    try {
      const response = await postService.getAllLikedPeginated(page, 5);
      const allLikedPosts = response.data || [];
      
      setLikedPosts(allLikedPosts);
      setHasMoreData(allLikedPosts.length === 5);
    } catch (error) {
      console.error('Failed to load liked posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreLikedPosts = async () => {
    setIsLoadingMore(true);
    try {
      const response = await postService.getAllLikedPeginated(page, 5);
      const allLikedPosts = response.data || [];
      
      setLikedPosts(prevLikedPosts => {
        const combined = [...prevLikedPosts, ...allLikedPosts];
        // Keep only the last 15 items if we exceed the buffer
        return combined.length > 15 ? combined.slice(-15) : combined;
      });
      
      setHasMoreData(allLikedPosts.length === 5);
    } catch (error) {
      console.error('Failed to load more liked posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };


  const handleReactionChange = () => {
    loadLikedPosts(); // Reload to get updated list
  };

  const loadMoreData = () => {
    if (isLoadingMore || !hasMoreData) return;
    setPage(prev => prev + 1);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    
    if (isNearBottom && hasMoreData && !isLoadingMore) {
      loadMoreData();
    }
  };

  const handleRefresh = () => {
    // Reset page to 1 and clear existing liked posts
    setPage(1);
    setLikedPosts([]);
    setHasMoreData(true);
    
    // Reload data
    loadLikedPosts();
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
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex flex-row items-center">
               Liked Posts
              <Heart className="h-6 w-6 text-red-400 ml-2" />
            </h1>
            <p className="text-gray-600">
              Posts you've reacted to and want to revisit.
            </p>
          </div>
        </div>
      </div>

      {/* Liked Posts */}
      <div 
        className="space-y-4 max-h-[600px] overflow-y-auto"
        onScroll={handleScroll}
      >
        {likedPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No liked posts yet.</p>
            <p className="text-gray-400 mt-2">
              Start reacting to posts to see them here.
            </p>
          </div>
        ) : (
          <>
            {likedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onReactionChange={handleReactionChange}
              />
            ))}
            
            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="flex justify-center items-center py-4">
                <LoadingSpinner />
                <span className="ml-2 text-gray-500">Loading more...</span>
              </div>
            )}

            {/* No more data indicator */}
            {!hasMoreData && (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">No more liked posts available</p>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
