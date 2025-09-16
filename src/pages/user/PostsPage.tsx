import React, { useState, useEffect } from 'react';
import { PostCard } from '../../components/posts/PostCard';
import { Post } from '../../types/Post';
import { postService } from '../../services/postService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Filter, RefreshCw } from 'lucide-react';

export const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos' | 'text'>('all');
  
  // Buffer management states
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    if (page === 1) {
      loadPosts();
    } else {
      loadMorePosts();
    }
  }, [page, filter]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const response = await postService.getPeginated(page, 5);
      const newPosts = response.data || [];
      
      setPosts(newPosts);
      setHasMoreData(newPosts.length === 5);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    setIsLoadingMore(true);
    try {
      const response = await postService.getPeginated(page, 5);
      const newPosts = response.data || [];
      
      setPosts(prevPosts => {
        const combined = [...prevPosts, ...newPosts];
        // Keep only the last 15 items if we exceed the buffer
        return combined.length > 15 ? combined.slice(-15) : combined;
      });
      
      setHasMoreData(newPosts.length === 5);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleReactionChange = () => {
    loadPosts(); // Reload to get updated reaction counts
  };

  const filteredPosts = posts.filter(post => {
    switch (filter) {
      case 'images':
        return post.type === 'IMAGE';
      case 'videos':
        return post.type === 'VIDEO';
      case 'text':
        return !post.type;
      default:
        return true;
    }
  });


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
    // Reset page to 1 and clear existing posts
    setPage(1);
    setPosts([]);
    setHasMoreData(true);
    
    // Reload data
    loadPosts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Media Posts</h1>
            <p className="text-gray-600">
              Discover and interact with posts from your community.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All Posts' },
              { id: 'images', label: 'Images' },
              { id: 'videos', label: 'Videos' },
              { id: 'text', label: 'Text Only' },
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => {
                  setFilter(filterOption.id as any);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filter === filterOption.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div 
        className="space-y-4 max-h-96 overflow-y-auto"
        onScroll={handleScroll}
      >
        {isLoading && posts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-lg">No posts found.</p>
            <p className="text-gray-400 mt-2">
              {filter === 'all' 
                ? 'No posts have been shared yet.' 
                : `No ${filter} posts found.`
              }
            </p>
          </div>
        ) : (
          <>
            {filteredPosts.map((post) => (
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
                <p className="text-gray-500 mb-3">No more posts available</p>
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
