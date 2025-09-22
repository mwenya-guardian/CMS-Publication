import { mediaService } from '../services/mediaService';

export interface MediaLoadOptions {
  useBlob?: boolean;
  cacheTime?: number;
}

export class MediaUtils {
  private static blobCache = new Map<string, { url: string; timestamp: number }>();
  private static readonly DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

  /**
   * Get optimized media URL based on media type
   */
  static getMediaUrl(postId: string, mediaType: 'IMAGE' | 'VIDEO' | 'TEXT', options: MediaLoadOptions = {}): string {
    if (mediaType === 'IMAGE') {
      return mediaService.getImageUrl(postId);
    } else if (mediaType === 'VIDEO') {
      return mediaService.getMediaStreamUrl(postId);
    }
    return '';
  }

  /**
   * Get media as blob URL with caching
   */
  static async getMediaBlobUrl(postId: string, mediaType: 'IMAGE' | 'VIDEO', options: MediaLoadOptions = {}): Promise<string> {
    const cacheKey = `${postId}-${mediaType}`;
    const cacheTime = options.cacheTime || this.DEFAULT_CACHE_TIME;
    
    // Check cache first
    const cached = this.blobCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.url;
    }

    try {
      let blobUrl: string;
      if (mediaType === 'IMAGE') {
        blobUrl = await mediaService.getImageAsBlobUrl(postId);
      } else {
        blobUrl = await mediaService.getMediaAsBlobUrl(postId);
      }

      // Cache the result
      this.blobCache.set(cacheKey, {
        url: blobUrl,
        timestamp: Date.now()
      });

      return blobUrl;
    } catch (error) {
      console.error(`Failed to load ${mediaType} blob for post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Get private file URL
   */
  static getPrivateFileUrl(filePath: string): string {
    return mediaService.getPrivateFileUrl(filePath);
  }

  /**
   * Clear blob cache for a specific post or all posts
   */
  static clearBlobCache(postId?: string): void {
    if (postId) {
      // Clear specific post cache
      for (const [key, value] of this.blobCache.entries()) {
        if (key.startsWith(postId)) {
          URL.revokeObjectURL(value.url);
          this.blobCache.delete(key);
        }
      }
    } else {
      // Clear all cache
      for (const [key, value] of this.blobCache.entries()) {
        URL.revokeObjectURL(value.url);
      }
      this.blobCache.clear();
    }
  }

  /**
   * Clean up expired cache entries
   */
  static cleanupExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.blobCache.entries()) {
      if (now - value.timestamp > this.DEFAULT_CACHE_TIME) {
        URL.revokeObjectURL(value.url);
        this.blobCache.delete(key);
      }
    }
  }

  /**
   * Preload media for better performance
   */
  static async preloadMedia(postId: string, mediaType: 'IMAGE' | 'VIDEO'): Promise<void> {
    try {
      await this.getMediaBlobUrl(postId, mediaType);
    } catch (error) {
      console.warn(`Failed to preload ${mediaType} for post ${postId}:`, error);
    }
  }
}

// Cleanup expired cache every 10 minutes
setInterval(() => {
  MediaUtils.cleanupExpiredCache();
}, 10 * 60 * 1000);
