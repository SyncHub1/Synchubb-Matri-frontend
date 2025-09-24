import axios from 'axios';

// API Base URLs for different microservices
const API_BASE_URLS = {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8000',
  media: import.meta.env.VITE_MEDIA_API_URL || 'http://localhost:3001',
  websocket: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3002',
  shared: import.meta.env.VITE_SHARED_UTILS_URL || 'http://localhost:3004',
  matri: import.meta.env.VITE_MATRI_API_URL || 'http://localhost:3003',
  matriSocket: import.meta.env.VITE_MATRI_SOCKET_URL || 'http://localhost:3003'
};

// Create axios instances for each service
const authApi = axios.create({
  baseURL: API_BASE_URLS.auth,
  timeout: 10000,
  withCredentials: true
});

const mediaApi = axios.create({
  baseURL: API_BASE_URLS.media,
  timeout: 30000, // Longer timeout for media uploads
  withCredentials: true
});

const matriApi = axios.create({
  baseURL: API_BASE_URLS.matri,
  timeout: 15000,
  withCredentials: true
});

// Request interceptors to add auth token
const addAuthToken = (config: any) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(addAuthToken);
mediaApi.interceptors.request.use(addAuthToken);
matriApi.interceptors.request.use(addAuthToken);

// Response interceptors for error handling
const handleResponseError = (error: any) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

authApi.interceptors.response.use(response => response, handleResponseError);
mediaApi.interceptors.response.use(response => response, handleResponseError);
matriApi.interceptors.response.use(response => response, handleResponseError);

// Authentication Service API
export const authService = {
  // User authentication
  login: (credentials: { email: string; password: string }) =>
    authApi.post('/auth/login', credentials),
  
  register: (userData: { email: string; password: string; name: string }) =>
    authApi.post('/auth/register', userData),
  
  logout: () => authApi.post('/auth/logout'),
  
  refreshToken: () => authApi.post('/auth/refresh'),
  
  // User profile
  getProfile: () => authApi.get('/auth/profile'),
  updateProfile: (data: any) => authApi.put('/auth/profile', data),
  
  // Password management
  forgotPassword: (email: string) => authApi.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    authApi.post('/auth/reset-password', { token, password }),
  
  // Email verification
  verifyEmail: (token: string) => authApi.post('/auth/verify-email', { token }),
  resendVerification: (email: string) => authApi.post('/auth/resend-verification', { email })
};

// Media API Service
export const mediaService = {
  // Video management
  uploadVideo: (file: File, metadata?: any) => {
    const formData = new FormData();
    formData.append('video', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    return mediaApi.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  getVideos: (params?: any) => mediaApi.get('/videos', { params }),
  getVideo: (id: string) => mediaApi.get(`/videos/${id}`),
  deleteVideo: (id: string) => mediaApi.delete(`/videos/${id}`),
  
  // Posts
  createPost: (data: any) => mediaApi.post('/posts', data),
  getPosts: (params?: any) => mediaApi.get('/posts', { params }),
  getPost: (id: string) => mediaApi.get(`/posts/${id}`),
  updatePost: (id: string, data: any) => mediaApi.put(`/posts/${id}`, data),
  deletePost: (id: string) => mediaApi.delete(`/posts/${id}`),
  
  // Images
  uploadImage: (file: File, metadata?: any) => {
    const formData = new FormData();
    formData.append('image', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    return mediaApi.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  getImages: (params?: any) => mediaApi.get('/images', { params }),
  getImage: (id: string) => mediaApi.get(`/images/${id}`),
  deleteImage: (id: string) => mediaApi.delete(`/images/${id}`),
  
  // Audio
  uploadAudio: (file: File, metadata?: any) => {
    const formData = new FormData();
    formData.append('audio', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    return mediaApi.post('/audio/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  getAudio: (params?: any) => mediaApi.get('/audio', { params }),
  deleteAudio: (id: string) => mediaApi.delete(`/audio/${id}`),
  
  // File management
  uploadFile: (file: File, metadata?: any) => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    return mediaApi.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  getFiles: (params?: any) => mediaApi.get('/files', { params }),
  deleteFile: (id: string) => mediaApi.delete(`/files/${id}`)
};

// Team Service API (now using Matri backend service)
export const teamService = {
  // Create a new team/group
  createTeam: async (teamData: {
    name: string;
    description: string;
    category: string;
    visibility: 'public' | 'private';
    maxMembers: number;
    location: string;
    skills: string[];
    members?: any[];
    emailInvites?: string[];
  }) => {
    try {
      const response = await matriApi.post('/teams', {
        name: teamData.name,
        description: teamData.description,
        category: teamData.category,
        visibility: teamData.visibility,
        maxMembers: teamData.maxMembers,
        location: teamData.location,
        skills: teamData.skills,
        settings: {
          allowInvitations: true,
          requireApproval: teamData.visibility === 'private'
        }
      });
      
      // Send email invitations if provided
      if (teamData.emailInvites && teamData.emailInvites.length > 0) {
        await matriApi.post(`/invitations/${response.data.data._id}/invite`, {
          emails: teamData.emailInvites,
          message: `You've been invited to join ${teamData.name}!`
        });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to create team:', error);
      throw new Error(error.response?.data?.message || 'Failed to create team');
    }
  },

  // Search for users to invite
  searchUsers: async (query: string) => {
    try {
      const response = await matriApi.get('/invitations/users/search', {
        params: { query }
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to search users:', error);
      // Fallback to mock data if search fails
      const mockUsers = [
        { id: 'user_1', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'AJ' },
        { id: 'user_2', name: 'Sarah Chen', email: 'sarah@example.com', avatar: 'SC' },
        { id: 'user_3', name: 'Mike Rodriguez', email: 'mike@example.com', avatar: 'MR' },
        { id: 'user_4', name: 'Emma Wilson', email: 'emma@example.com', avatar: 'EW' },
        { id: 'user_5', name: 'David Kim', email: 'david@example.com', avatar: 'DK' },
        { id: 'user_6', name: 'Lisa Thompson', email: 'lisa@example.com', avatar: 'LT' },
      ];
      
      const filtered = mockUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      
      return { data: filtered };
    }
  },

  // Send email invitations
  sendEmailInvitations: async (emails: string[], teamId: string, teamName: string) => {
    try {
      const response = await matriApi.post(`/invitations/${teamId}/invite`, {
        emails,
        message: `You've been invited to join ${teamName}!`
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to send invitations:', error);
      throw new Error(error.response?.data?.message || 'Failed to send invitations');
    }
  },

  // Get all teams
  getTeams: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    visibility?: 'public' | 'private';
  }) => {
    try {
      const response = await matriApi.get('/teams', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch teams:', error);
      // Fallback to mock data if API fails
      const mockTeams = [
        {
          _id: 'team_1',
          name: 'Web Development Team',
          description: 'Building amazing web applications',
          category: 'Web Development',
          visibility: 'public',
          maxMembers: 5,
          location: 'Remote',
          skills: ['React', 'Node.js', 'TypeScript'],
          memberCount: 3,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'team_2',
          name: 'AI/ML Research',
          description: 'Exploring the future of artificial intelligence',
          category: 'AI/ML',
          visibility: 'private',
          maxMembers: 8,
          location: 'San Francisco, CA',
          skills: ['Python', 'TensorFlow', 'PyTorch'],
          memberCount: 2,
          createdAt: new Date().toISOString()
        }
      ];
      
      return { data: mockTeams, pagination: { total: mockTeams.length, page: 1, pages: 1 } };
    }
  },

  // Get team by ID
  getTeam: async (id: string) => {
    try {
      const response = await matriApi.get(`/teams/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch team:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch team');
    }
  },

  // Update team
  updateTeam: async (id: string, data: any) => {
    try {
      const response = await matriApi.put(`/teams/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update team:', error);
      throw new Error(error.response?.data?.message || 'Failed to update team');
    }
  },

  // Delete team
  deleteTeam: async (id: string) => {
    try {
      const response = await matriApi.delete(`/teams/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete team:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete team');
    }
  },

  // Join team
  joinTeam: async (teamId: string) => {
    try {
      const response = await matriApi.post(`/teams/${teamId}/join`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to join team:', error);
      throw new Error(error.response?.data?.message || 'Failed to join team');
    }
  },

  // Leave team
  leaveTeam: async (teamId: string) => {
    try {
      const response = await matriApi.post(`/teams/${teamId}/leave`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to leave team:', error);
      throw new Error(error.response?.data?.message || 'Failed to leave team');
    }
  }
};

// WebSocket Service
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();

  constructor(private url: string = API_BASE_URLS.websocket) {}

  connect(userId: string, token: string) {
    try {
      this.ws = new WebSocket(`${this.url}?userId=${userId}&token=${token}`);
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.reconnectAttempts = 0;
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit(data.type, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.emit('disconnected');
        this.attemptReconnect(userId, token);
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  private attemptReconnect(userId: string, token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(userId, token);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.emit('reconnect_failed');
    }
  }

  send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...data }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create a singleton WebSocket instance
export const wsService = new WebSocketService();

// Utility functions
export const apiUtils = {
  // File upload helper
  uploadFile: async (file: File, type: 'image' | 'video' | 'audio', metadata?: any) => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    
    return mediaApi.post(`/upload/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Error handler
  handleError: (error: any) => {
    if (error.response) {
      return error.response.data.message || 'An error occurred';
    }
    return error.message || 'Network error';
  },

  // Token management
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

export default {
  authService,
  mediaService,
  teamService,
  wsService,
  apiUtils
}; 