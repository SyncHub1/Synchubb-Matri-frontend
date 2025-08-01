import { useState, useCallback } from 'react';
import { mediaService, apiUtils } from '@/lib/api';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  size: number;
  format: string;
  uploadedBy: string;
  uploadedAt: string;
  views: number;
  likes: number;
  isPublic: boolean;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  tags: string[];
}

interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  members: string[];
  admins: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const useMedia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  // Video operations
  const uploadVideo = useCallback(async (file: File, metadata?: any) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const response = await mediaService.uploadVideo(file, metadata);
      setUploadProgress(null);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      setUploadProgress(null);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getVideos = useCallback(async (params?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaService.getVideos(params);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getVideo = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaService.getVideo(id);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteVideo = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await mediaService.deleteVideo(id);
      return { success: true };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Post operations
  const createPost = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaService.createPost(data);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPosts = useCallback(async (params?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaService.getPosts(params);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPost = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaService.getPost(id);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id: string, data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaService.updatePost(id, data);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await mediaService.deletePost(id);
      return { success: true };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Comment operations
  const addComment = useCallback(async (postId: string, content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaService.addComment(postId, { content });
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getComments = useCallback(async (postId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaService.getComments(postId);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (commentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await mediaService.deleteComment(commentId);
      return { success: true };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Like operations
  const likePost = useCallback(async (postId: string) => {
    try {
      await mediaService.likePost(postId);
      return { success: true };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      return { success: false, error: errorMessage };
    }
  }, []);

  const unlikePost = useCallback(async (postId: string) => {
    try {
      await mediaService.unlikePost(postId);
      return { success: true };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Group operations
  const createGroup = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaService.createGroup(data);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGroups = useCallback(async (params?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaService.getGroups(params);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getGroup = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaService.getGroup(id);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinGroup = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await mediaService.joinGroup(id);
      return { success: true };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const leaveGroup = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await mediaService.leaveGroup(id);
      return { success: true };
    } catch (err: any) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearUploadProgress = useCallback(() => {
    setUploadProgress(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    uploadProgress,

    // Video operations
    uploadVideo,
    getVideos,
    getVideo,
    deleteVideo,

    // Post operations
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,

    // Comment operations
    addComment,
    getComments,
    deleteComment,

    // Like operations
    likePost,
    unlikePost,

    // Group operations
    createGroup,
    getGroups,
    getGroup,
    joinGroup,
    leaveGroup,

    // Utility functions
    clearError,
    clearUploadProgress
  };
}; 