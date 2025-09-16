import { api } from './api';

export const mediaService = {
  // Get media stream URL for a post (for videos)
  getMediaStreamUrl: (postId: string): string => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    return `${baseUrl}/media/posts/${postId}/stream`;
  },

  // Get image URL for direct access (optimized for images)
  getImageUrl: (postId: string): string => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    return `${baseUrl}/media/images/${postId}`;
  },

  // Get media as blob with authentication (for videos)
  getMediaAsBlob: async (postId: string): Promise<Blob> => {
    try {
      const response = await api.get(`/media/posts/${postId}/stream`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch media blob:', error);
      throw error;
    }
  },

  // Get image as blob with authentication
  getImageAsBlob: async (postId: string): Promise<Blob> => {
    try {
      const response = await api.get(`/media/images/${postId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch image blob:', error);
      throw error;
    }
  },

  // Get media as blob URL with authentication (for videos)
  getMediaAsBlobUrl: async (postId: string): Promise<string> => {
    try {
      const blob = await mediaService.getMediaAsBlob(postId);
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Failed to create blob URL:', error);
      throw error;
    }
  },

  // Get image as blob URL with authentication
  getImageAsBlobUrl: async (postId: string): Promise<string> => {
    try {
      const blob = await mediaService.getImageAsBlob(postId);
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Failed to create image blob URL:', error);
      throw error;
    }
  },

  // Get media URL for direct access (for images that don't need streaming)
  getMediaUrl: (postId: string): string => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    return `${baseUrl}/media/posts/${postId}/stream`;
  },

  // Get private file URL (for direct file access)
  getPrivateFileUrl: (filePath: string): string => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    return `${baseUrl}/uploads/private${filePath}`;
  }
};
