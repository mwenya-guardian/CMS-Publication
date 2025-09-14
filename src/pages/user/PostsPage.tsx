import React, { useState, useEffect } from 'react';
import { PostCard } from '../../components/posts/PostCard';
import { Pagination } from '../../components/common/Pagination';
import { Post } from '../../types/Post';
import { postService } from '../../services/postService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Plus, Filter } from 'lucide-react';

export const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos' | 'text'>('all');

  useEffect(() => {
    loadPosts();
  }, [page, filter]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const response = await postService.getPeginated(page, 10);
      const newPosts = response.data || [];
      
      setPosts(newPosts);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactionChange = () => {
    loadPosts(); // Reload to get updated reaction counts
  };

  const filteredPosts = posts.filter(post => {
    switch (filter) {
      case 'images':
        return post.mediaType === 'IMAGE';
      case 'videos':
        return post.mediaType === 'VIDEO';
      case 'text':
        return !post.mediaType;
      default:
        return true;
    }
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
      <div className="space-y-4">
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
