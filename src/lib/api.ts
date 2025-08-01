import axios from 'axios';

// Environment-based API Base URLs
const getApiBaseUrls = () => {
  // More robust production detection
  const isProduction = window.location.hostname === 'www.synchubb.in' || 
                      window.location.hostname === 'synchubb.in' ||
                      window.location.protocol === 'https:' ||
                      import.meta.env.PROD;
  
  console.log('Environment detection:', {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    isProduction,
    env: import.meta.env.MODE
  });
  
  if (isProduction) {
    const productionUrls = {
      auth: import.meta.env.VITE_AUTH_SERVICE_URL || 'https://api.synchubb.in',
      media: import.meta.env.VITE_MEDIA_API_URL || 'https://media.synchubb.in',
      websocket: import.meta.env.VITE_WEBSOCKET_URL || 'wss://ws.synchubb.in',
      shared: import.meta.env.VITE_SHARED_UTILS_URL || 'https://utils.synchubb.in'
    };
    
    console.log('Using production URLs:', productionUrls);
    return productionUrls;
  } else {
    const developmentUrls = {
      auth: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8000',
      media: import.meta.env.VITE_MEDIA_API_URL || 'http://localhost:3001',
      websocket: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3002',
      shared: import.meta.env.VITE_SHARED_UTILS_URL || 'http://localhost:3004'
    };
    
    console.log('Using development URLs:', developmentUrls);
    return developmentUrls;
  }
};

const API_BASE_URLS = getApiBaseUrls();

// Create axios instances for each service with CORS headers
const createApiInstance = (baseURL: string, timeout: number = 10000) => {
  console.log('Creating API instance with baseURL:', baseURL);
  
  const instance = axios.create({
    baseURL,
    timeout,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // CORS headers for cross-origin requests
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    }
  });
  
  return instance;
};

const authApi = createApiInstance(API_BASE_URLS.auth, 10000);
const mediaApi = createApiInstance(API_BASE_URLS.media, 30000);

// Request interceptors to add auth token and handle CORS
const addAuthToken = (config: any) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add CORS headers for cross-origin requests
  if (window.location.origin !== new URL(config.baseURL || API_BASE_URLS.auth).origin) {
    config.headers['Access-Control-Allow-Origin'] = window.location.origin;
    config.headers['Access-Control-Allow-Credentials'] = 'true';
  }
  
  console.log('Making API request to:', config.url, 'with baseURL:', config.baseURL);
  return config;
};

authApi.interceptors.request.use(addAuthToken);
mediaApi.interceptors.request.use(addAuthToken);

// Response interceptors for error handling with CORS error handling
const handleResponseError = (error: any) => {
  console.error('API Error:', error);
  console.error('Error config:', error.config);
  
  // Handle CORS errors specifically
  if (error.message?.includes('CORS') || error.code === 'ERR_NETWORK') {
    console.error('CORS Error detected. Please check server configuration.');
    console.error('Request URL:', error.config?.url);
    console.error('Request baseURL:', error.config?.baseURL);
    // You can show a user-friendly error message here
    return Promise.reject(new Error('Network error: Unable to connect to server. Please check your connection.'));
  }
  
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    // Don't redirect in embedded mode
    if (!import.meta.env.VITE_EMBEDDED_MODE) {
      window.location.href = '/login';
    }
  }
  
  return Promise.reject(error);
};

authApi.interceptors.response.use(response => response, handleResponseError);
mediaApi.interceptors.response.use(response => response, handleResponseError);

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

// Team Service API (using WebSocket service)
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
    // In embedded mode, users are already authenticated by main app
    // No need to check for token since authentication is handled externally
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTeam = {
          id: `team_${Date.now()}`,
          ...teamData,
          createdAt: new Date().toISOString(),
          members: teamData.members || [],
          admins: [],
          isArchived: false,
          isMuted: false
        };
        
        // Store the new team in localStorage
        const existingTeams = JSON.parse(localStorage.getItem('maitri_teams') || '[]');
        existingTeams.push(mockTeam);
        localStorage.setItem('maitri_teams', JSON.stringify(existingTeams));
        
        resolve({ data: mockTeam });
      }, 1000);
    });
  },

  // Search for users to invite
  searchUsers: async (query: string) => {
    // Mock implementation - in real app, this would call the auth service
    return new Promise((resolve) => {
      setTimeout(() => {
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
        
        resolve({ data: filtered });
      }, 500);
    });
  },

  // Send email invitations
  sendEmailInvitations: async (emails: string[], teamId: string, teamName: string) => {
    // Mock implementation - in real app, this would call the email service
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending invitations to: ${emails.join(', ')} for team: ${teamName}`);
        
        // In a real implementation, this would:
        // 1. Call the email service (nodemailer)
        // 2. Send invitation emails with team join links
        // 3. Track invitation status
        
        resolve({ 
          data: { 
            success: true, 
            message: `Invitations sent to ${emails.length} email(s)`,
            sentEmails: emails 
          } 
        });
      }, 2000);
    });
  },

  // Get all teams
  getTeams: async () => {
    // In embedded mode, users are already authenticated by main app
    // No need to check for token since authentication is handled externally
    
    // Mock implementation with localStorage persistence
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get teams from localStorage
        const storedTeams = JSON.parse(localStorage.getItem('maitri_teams') || '[]');
        
        // If no stored teams, use default mock teams
        if (storedTeams.length === 0) {
          const defaultTeams = [
            {
              id: 'team_1',
              name: 'Web Development Team',
              description: 'Building amazing web applications',
              category: 'Web Development',
              visibility: 'public',
              maxMembers: 5,
              location: 'Remote',
              skills: ['React', 'Node.js', 'TypeScript'],
              members: [
                { id: 'user_1', name: 'Alex', email: 'alex@example.com' },
                { id: 'user_2', name: 'Sarah', email: 'sarah@example.com' },
                { id: 'user_3', name: 'Mike', email: 'mike@example.com' }
              ],
              admins: [],
              createdAt: new Date().toISOString()
            },
            {
              id: 'team_2',
              name: 'AI/ML Research',
              description: 'Exploring the future of artificial intelligence',
              category: 'AI/ML',
              visibility: 'private',
              maxMembers: 8,
              location: 'San Francisco, CA',
              skills: ['Python', 'TensorFlow', 'PyTorch'],
              members: [
                { id: 'user_4', name: 'Emma', email: 'emma@example.com' },
                { id: 'user_5', name: 'David', email: 'david@example.com' }
              ],
              admins: [],
              createdAt: new Date().toISOString()
            },
            {
              id: 'team_3',
              name: 'Mobile App Development',
              description: 'Creating innovative mobile experiences',
              category: 'Mobile Apps',
              visibility: 'public',
              maxMembers: 6,
              location: 'New York, NY',
              skills: ['React Native', 'Flutter', 'iOS'],
              members: [],
              admins: [],
              createdAt: new Date().toISOString()
            },
            {
              id: 'team_4',
              name: 'Ai Interns',
              description: 'kjndjrfnljernfkrlemf;rlefn3kfer',
              category: 'AI/ML',
              visibility: 'public',
              maxMembers: 10,
              location: 'Remote',
              skills: ['Machine Learning', 'Python', 'Data Analysis'],
              members: [
                { id: 'user_6', name: 'User 1', email: 'user1@example.com' },
                { id: 'user_7', name: 'User 2', email: 'user2@example.com' },
                { id: 'user_8', name: 'User 3', email: 'user3@example.com' },
                { id: 'user_9', name: 'User 4', email: 'user4@example.com' },
                { id: 'user_10', name: 'User 5', email: 'user5@example.com' }
              ],
              admins: [],
              createdAt: new Date().toISOString()
            }
          ];
          
          // Store default teams in localStorage
          localStorage.setItem('maitri_teams', JSON.stringify(defaultTeams));
          resolve({ data: defaultTeams });
        } else {
          resolve({ data: storedTeams });
        }
      }, 500);
    });
  },

  // Get team by ID
  getTeam: async (id: string) => {
    // In embedded mode, users are already authenticated by main app
    // No need to check for token since authentication is handled externally
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTeam = {
          id,
          name: 'Sample Team',
          description: 'A sample team for testing',
          category: 'Web Development',
          visibility: 'public',
          maxMembers: 5,
          location: 'Remote',
          skills: ['React', 'Node.js'],
          members: [],
          admins: [],
          createdAt: new Date().toISOString()
        };
        resolve({ data: mockTeam });
      }, 300);
    });
  },

  // Update team
  updateTeam: async (id: string, data: any) => {
    // In embedded mode, users are already authenticated by main app
    // No need to check for token since authentication is handled externally
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { id, ...data, updatedAt: new Date().toISOString() } });
      }, 500);
    });
  },

  // Delete team
  deleteTeam: async (id: string) => {
    // In embedded mode, users are already authenticated by main app
    // No need to check for token since authentication is handled externally
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true } });
      }, 300);
    });
  },

  // Join team
  joinTeam: async (teamId: string) => {
    // In embedded mode, users are already authenticated by main app
    // No need to check for token since authentication is handled externally
    
    // Mock implementation with localStorage persistence
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update team in localStorage
        const storedTeams = JSON.parse(localStorage.getItem('maitri_teams') || '[]');
        const teamIndex = storedTeams.findIndex((team: any) => team.id === teamId);
        
        if (teamIndex !== -1) {
          // Add current user to team members (mock user)
          const mockUser = {
            id: 'user_' + Date.now(),
            name: 'Current User',
            email: 'user@example.com'
          };
          
          if (!storedTeams[teamIndex].members) {
            storedTeams[teamIndex].members = [];
          }
          
          // Check if user is already a member
          const isAlreadyMember = storedTeams[teamIndex].members.some((member: any) => member.id === mockUser.id);
          
          if (!isAlreadyMember) {
            storedTeams[teamIndex].members.push(mockUser);
            localStorage.setItem('maitri_teams', JSON.stringify(storedTeams));
          }
        }
        
        resolve({ data: { success: true, message: 'Joined team successfully' } });
      }, 300);
    });
  },

  // Leave team
  leaveTeam: async (teamId: string) => {
    // In embedded mode, users are already authenticated by main app
    // No need to check for token since authentication is handled externally
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, message: 'Left team successfully' } });
      }, 300);
    });
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