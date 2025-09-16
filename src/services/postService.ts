import { api } from './api';
import { Post, CreatePostRequest, CreateImagePostRequest, CreateVideoPostRequest, UpdatePostRequest, PostType} from '../types/Post';
import { ApiResponse, PaginatedResponse } from '../types/Common';


export const postService = {
  // Get all posts with pagination
  async getPeginated(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Post>>>(`/posts?page=${page}&limit=${limit}`);
    return response.data.data;
  },
  //Get image posts peginated
  async getMediadTyePeginated(page: number = 1, limit: number = 10, type: PostType): Promise<PaginatedResponse<Post>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Post>>>(`/posts/${type}?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Get post by ID
  async getPostById(id: string): Promise<Post> {
    const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data.data;
  },

  // Create text post
  async createTextPost(data: CreatePostRequest): Promise<Post> {
    const response = await api.post<ApiResponse<Post>>('/posts', data);
    return response.data.data;
  },

  // Create image post
  async createImagePost(data: CreateImagePostRequest): Promise<Post> {
    const formData = new FormData();
    formData.append('caption', data.caption);
    formData.append('file', data.file);
    formData.append('isPublic', data.isPublic?.toString() || 'false');

    const response = await api.post<ApiResponse<Post>>('/posts/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Create video post
  async createVideoPost(data: CreateVideoPostRequest): Promise<Post> {
    const formData = new FormData();
    formData.append('caption', data.caption);
    formData.append('file', data.file);
    formData.append('isPublic', data.isPublic?.toString() || 'false');

    const response = await api.post<ApiResponse<Post>>('/posts/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update post caption
  async updatePost(id: string, data: UpdatePostRequest): Promise<Post> {
    const response = await api.put<ApiResponse<Post>>(`/posts/${id}/caption`, data);
    return response.data.data;
  },

  // Delete post
  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

};
