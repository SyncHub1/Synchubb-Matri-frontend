import axios from 'axios';
import { io, Socket } from 'socket.io-client';

// Matri API Configuration - Fixed for proper proxy usage
const isDevelopment = import.meta.env.DEV;
const MATRI_API_BASE = import.meta.env.VITE_MATRI_API_URL || 'http://localhost:3003';
const MATRI_SOCKET_URL = import.meta.env.VITE_MATRI_SOCKET_URL || 'http://localhost:3003';

// API Base URL Configuration
const API_BASE_URL = isDevelopment ? '/api/v1' : `${MATRI_API_BASE}/api/v1`;

console.log('🔧 Matri API Configuration:');
console.log('🌐 Environment:', isDevelopment ? 'Development (using Vite proxy)' : 'Production');
console.log('📡 API Base URL:', API_BASE_URL);
console.log('🔌 Socket URL:', MATRI_SOCKET_URL);
console.log('🔍 Target Backend:', isDevelopment ? 'http://localhost:3003 (via proxy)' : MATRI_API_BASE);

// Create axios instance for Matri API
const matriApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token
matriApi.interceptors.request.use(
  (config) => {
    const fullUrl = config.baseURL + config.url;
    console.log(`🚀 Making request to: ${fullUrl}`);
    console.log(`🔍 Request details:`, {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method?.toUpperCase(),
      isDev: isDevelopment,
      shouldProxy: isDevelopment && config.baseURL === '/api/v1'
    });
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
matriApi.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    // Handle specific error cases
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('🚫 Matri service is not running or unreachable');
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Team Management API
export const matriTeamService = {
  // Get all teams with filtering and pagination
  getTeams: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    visibility?: 'public' | 'private';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await matriApi.get('/teams', { params });
    return response.data;
  },

  // Get team by ID
  getTeam: async (teamId: string) => {
    const response = await matriApi.get(`/teams/${teamId}`);
    return response.data;
  },

  // Create new team
  createTeam: async (teamData: {
    name: string;
    description: string;
    category: string;
    visibility: 'public' | 'private';
    maxMembers: number;
    location?: string;
    skills?: string[];
    settings?: any;
  }) => {
    const response = await matriApi.post('/teams', teamData);
    return response.data;
  },

  // Update team
  updateTeam: async (teamId: string, updates: any) => {
    const response = await matriApi.put(`/teams/${teamId}`, updates);
    return response.data;
  },

  // Delete/Archive team
  deleteTeam: async (teamId: string) => {
    const response = await matriApi.delete(`/teams/${teamId}`);
    return response.data;
  },

  // Join team
  joinTeam: async (teamId: string) => {
    const response = await matriApi.post(`/teams/${teamId}/join`);
    return response.data;
  },

  // Leave team
  leaveTeam: async (teamId: string) => {
    const response = await matriApi.post(`/teams/${teamId}/leave`);
    return response.data;
  },

  // Get team members
  getTeamMembers: async (teamId: string) => {
    const response = await matriApi.get(`/teams/${teamId}/members`);
    return response.data;
  },

  // Update member role
  updateMemberRole: async (teamId: string, userId: string, role: string) => {
    const response = await matriApi.put(`/teams/${teamId}/members/${userId}`, { role });
    return response.data;
  },

  // Remove team member
  removeMember: async (teamId: string, userId: string) => {
    const response = await matriApi.delete(`/teams/${teamId}/members/${userId}`);
    return response.data;
  }
};

// Chat API
export const matriChatService = {
  // Get chat messages
  getMessages: async (teamId: string, params?: {
    page?: number;
    limit?: number;
    before?: string;
    after?: string;
    type?: string;
  }) => {
    const response = await matriApi.get(`/chat/${teamId}/messages`, { params });
    return response.data;
  },

  // Send message
  sendMessage: async (teamId: string, messageData: {
    message: string;
    type?: 'text' | 'image' | 'file' | 'code';
    attachments?: File[];
    replyTo?: string;
    mentions?: string[];
  }) => {
    const formData = new FormData();
    formData.append('message', messageData.message);
    formData.append('type', messageData.type || 'text');
    
    if (messageData.replyTo) {
      formData.append('replyTo', messageData.replyTo);
    }
    
    if (messageData.mentions) {
      formData.append('mentions', JSON.stringify(messageData.mentions));
    }
    
    if (messageData.attachments) {
      messageData.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }

    const response = await matriApi.post(`/chat/${teamId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Edit message
  editMessage: async (teamId: string, messageId: string, message: string) => {
    const response = await matriApi.put(`/chat/${teamId}/messages/${messageId}`, { message });
    return response.data;
  },

  // Delete message
  deleteMessage: async (teamId: string, messageId: string) => {
    const response = await matriApi.delete(`/chat/${teamId}/messages/${messageId}`);
    return response.data;
  },

  // Add reaction
  addReaction: async (teamId: string, messageId: string, emoji: string) => {
    const response = await matriApi.post(`/chat/${teamId}/messages/${messageId}/reactions`, { emoji });
    return response.data;
  },

  // Remove reaction
  removeReaction: async (teamId: string, messageId: string, emoji: string) => {
    const response = await matriApi.delete(`/chat/${teamId}/messages/${messageId}/reactions`, {
      data: { emoji }
    });
    return response.data;
  },

  // Pin message
  pinMessage: async (teamId: string, messageId: string) => {
    const response = await matriApi.post(`/chat/${teamId}/messages/${messageId}/pin`);
    return response.data;
  },

  // Unpin message
  unpinMessage: async (teamId: string, messageId: string) => {
    const response = await matriApi.delete(`/chat/${teamId}/messages/${messageId}/pin`);
    return response.data;
  }
};

// Task Management API
export const matriTaskService = {
  // Get tasks
  getTasks: async (teamId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    assignedTo?: string;
    sortBy?: string;
  }) => {
    const response = await matriApi.get(`/tasks/${teamId}`, { params });
    return response.data;
  },

  // Create task
  createTask: async (teamId: string, taskData: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status?: 'todo' | 'in_progress' | 'review' | 'done';
    assignedTo?: string[];
    dueDate?: string;
    tags?: string[];
    attachments?: File[];
  }) => {
    const formData = new FormData();
    formData.append('title', taskData.title);
    formData.append('priority', taskData.priority);
    
    if (taskData.description) formData.append('description', taskData.description);
    if (taskData.status) formData.append('status', taskData.status);
    if (taskData.dueDate) formData.append('dueDate', taskData.dueDate);
    if (taskData.assignedTo) formData.append('assignedTo', JSON.stringify(taskData.assignedTo));
    if (taskData.tags) formData.append('tags', JSON.stringify(taskData.tags));
    
    if (taskData.attachments) {
      taskData.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await matriApi.post(`/tasks/${teamId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update task
  updateTask: async (teamId: string, taskId: string, updates: any) => {
    const response = await matriApi.put(`/tasks/${teamId}/${taskId}`, updates);
    return response.data;
  },

  // Delete task
  deleteTask: async (teamId: string, taskId: string) => {
    const response = await matriApi.delete(`/tasks/${teamId}/${taskId}`);
    return response.data;
  },

  // Add comment
  addComment: async (teamId: string, taskId: string, comment: string, attachments?: File[]) => {
    const formData = new FormData();
    formData.append('comment', comment);
    
    if (attachments) {
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await matriApi.post(`/tasks/${teamId}/${taskId}/comments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Log time
  logTime: async (teamId: string, taskId: string, timeData: {
    hours: number;
    description?: string;
    date?: string;
  }) => {
    const response = await matriApi.post(`/tasks/${teamId}/${taskId}/time`, timeData);
    return response.data;
  },

  // Get task statistics
  getTaskStats: async (teamId: string) => {
    const response = await matriApi.get(`/tasks/${teamId}/stats`);
    return response.data;
  }
};

// Whiteboard API
export const matriWhiteboardService = {
  // Get whiteboards
  getWhiteboards: async (teamId: string) => {
    const response = await matriApi.get(`/whiteboard/${teamId}`);
    return response.data;
  },

  // Create whiteboard
  createWhiteboard: async (teamId: string, whiteboardData: {
    name: string;
    description?: string;
    settings?: any;
  }) => {
    const response = await matriApi.post(`/whiteboard/${teamId}`, whiteboardData);
    return response.data;
  },

  // Get whiteboard
  getWhiteboard: async (teamId: string, whiteboardId: string) => {
    const response = await matriApi.get(`/whiteboard/${teamId}/${whiteboardId}`);
    return response.data;
  },

  // Update whiteboard elements
  updateElements: async (teamId: string, whiteboardId: string, elements: any[]) => {
    const response = await matriApi.post(`/whiteboard/${teamId}/${whiteboardId}/elements`, {
      elements
    });
    return response.data;
  },

  // Update cursor position
  updateCursor: async (teamId: string, whiteboardId: string, position: { x: number; y: number }) => {
    const response = await matriApi.post(`/whiteboard/${teamId}/${whiteboardId}/cursor`, position);
    return response.data;
  },

  // Export whiteboard
  exportWhiteboard: async (teamId: string, whiteboardId: string, format: 'json' | 'svg' | 'png') => {
    const response = await matriApi.get(`/whiteboard/${teamId}/${whiteboardId}/export`, {
      params: { format }
    });
    return response.data;
  }
};

// IDE API
export const matriIdeService = {
  // Get IDE projects
  getProjects: async (teamId: string) => {
    const response = await matriApi.get(`/ide/${teamId}`);
    return response.data;
  },

  // Create IDE project
  createProject: async (teamId: string, projectData: {
    name: string;
    description?: string;
    language: string;
    template?: string;
  }) => {
    const response = await matriApi.post(`/ide/${teamId}`, projectData);
    return response.data;
  },

  // Get project
  getProject: async (teamId: string, projectId: string) => {
    const response = await matriApi.get(`/ide/${teamId}/${projectId}`);
    return response.data;
  },

  // Create/Update file
  updateFile: async (teamId: string, projectId: string, fileData: {
    name: string;
    path: string;
    content: string;
    language?: string;
  }) => {
    const response = await matriApi.post(`/ide/${teamId}/${projectId}/files`, fileData);
    return response.data;
  }
};

// Video Conferencing API
export const matriVideoService = {
  // Get video calls
  getCalls: async (teamId: string, params?: {
    status?: string;
    upcoming?: boolean;
  }) => {
    const response = await matriApi.get(`/video/${teamId}`, { params });
    return response.data;
  },

  // Create/Schedule video call
  createCall: async (teamId: string, callData: {
    title: string;
    description?: string;
    scheduledAt?: string;
    type?: string;
    settings?: any;
  }) => {
    const response = await matriApi.post(`/video/${teamId}`, callData);
    return response.data;
  },

  // Join video call
  joinCall: async (teamId: string, callId: string) => {
    const response = await matriApi.post(`/video/${teamId}/${callId}/join`);
    return response.data;
  },

  // Leave video call
  leaveCall: async (teamId: string, callId: string) => {
    const response = await matriApi.post(`/video/${teamId}/${callId}/leave`);
    return response.data;
  },

  // End video call
  endCall: async (teamId: string, callId: string) => {
    const response = await matriApi.post(`/video/${teamId}/${callId}/end`);
    return response.data;
  },

  // WebRTC signaling
  sendSignaling: async (teamId: string, callId: string, signalingData: {
    type: 'offer' | 'answer' | 'ice-candidate';
    payload: any;
    targetUserId?: string;
  }) => {
    const response = await matriApi.post(`/video/${teamId}/${callId}/signaling`, signalingData);
    return response.data;
  }
};

// Invitation API
export const matriInvitationService = {
  // Search users
  searchUsers: async (query: string) => {
    const response = await matriApi.get('/invitations/users/search', {
      params: { query }
    });
    return response.data;
  },

  // Send invitations
  sendInvitations: async (teamId: string, invitationData: {
    userIds?: string[];
    emails?: string[];
    message?: string;
  }) => {
    const response = await matriApi.post(`/invitations/${teamId}/invite`, invitationData);
    return response.data;
  },

  // Get team invitations
  getInvitations: async (teamId: string) => {
    const response = await matriApi.get(`/invitations/${teamId}`);
    return response.data;
  },

  // Accept invitation
  acceptInvitation: async (token: string) => {
    const response = await matriApi.post(`/invitations/accept/${token}`);
    return response.data;
  },

  // Decline invitation
  declineInvitation: async (token: string) => {
    const response = await matriApi.post(`/invitations/decline/${token}`);
    return response.data;
  }
};

// Analytics API
export const matriAnalyticsService = {
  // Get team overview
  getOverview: async (teamId: string, period?: string) => {
    const response = await matriApi.get(`/analytics/${teamId}/overview`, {
      params: { period }
    });
    return response.data;
  },

  // Get message analytics
  getMessageAnalytics: async (teamId: string, params?: {
    period?: string;
    groupBy?: string;
  }) => {
    const response = await matriApi.get(`/analytics/${teamId}/messages`, { params });
    return response.data;
  },

  // Get member analytics
  getMemberAnalytics: async (teamId: string) => {
    const response = await matriApi.get(`/analytics/${teamId}/members`);
    return response.data;
  },

  // Get engagement analytics
  getEngagementAnalytics: async (teamId: string, period?: string) => {
    const response = await matriApi.get(`/analytics/${teamId}/engagement`, {
      params: { period }
    });
    return response.data;
  }
};

// Socket.IO Client for Real-time Features
class MatriSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token?: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(MATRI_SOCKET_URL, {
      auth: {
        token: token || localStorage.getItem('authToken')
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Matri Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Matri Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Matri Socket connection error:', error);
      this.handleReconnect();
    });

    return this.socket;
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  // Join team room for real-time updates
  joinTeam(teamId: string) {
    if (this.socket) {
      this.socket.emit('join_team', { teamId });
    }
  }

  // Leave team room
  leaveTeam(teamId: string) {
    if (this.socket) {
      this.socket.emit('leave_team', { teamId });
    }
  }

  // Send typing indicator
  sendTyping(teamId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', { teamId, isTyping });
    }
  }

  // Listen for events
  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove event listener
  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Emit event
  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }
}

// Create singleton instance
export const matriSocket = new MatriSocketService();

// Health check
export const matriHealthService = {
  checkHealth: async () => {
    try {
      const healthUrl = isDevelopment ? '/health' : `${MATRI_API_BASE}/health`;
      const response = await axios.get(healthUrl, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Matri service is not available');
    }
  }
};

// Video Call API Service
export const matriVideoCallService = {
  getCall: async (teamId: string) => {
    const response = await matriApi.get(`/video-calls/${teamId}`);
    return response.data;
  },
  
  joinCall: async (teamId: string, callData: any) => {
    const response = await matriApi.post(`/video-calls/${teamId}/join`, callData);
    return response.data;
  },
  
  leaveCall: async (teamId: string) => {
    const response = await matriApi.post(`/video-calls/${teamId}/leave`);
    return response.data;
  }
};

// Messages API Service
export const matriMessagesService = {
  getMessages: async (teamId: string) => {
    const response = await matriApi.get(`/messages/${teamId}`);
    return response.data;
  },
  
  sendMessage: async (teamId: string, messageData: any) => {
    const response = await matriApi.post(`/messages/${teamId}`, messageData);
    return response.data;
  }
};

// Enhanced IDE Service
export const matriEnhancedIdeService = {
  ...matriIdeService,
  
  getSession: async (teamId: string) => {
    const response = await matriApi.get(`/ide/${teamId}/session`);
    return response.data;
  },
  
  saveFile: async (teamId: string, fileData: any) => {
    const response = await matriApi.post(`/ide/${teamId}/save`, fileData);
    return response.data;
  },
  
  runCode: async (teamId: string, codeData: any) => {
    const response = await matriApi.post(`/ide/${teamId}/run`, codeData);
    return response.data;
  }
};

// Enhanced Whiteboard Service
export const matriEnhancedWhiteboardService = {
  ...matriWhiteboardService,
  
  saveWhiteboard: async (teamId: string, whiteboardId: string, whiteboardData: any) => {
    const response = await matriApi.put(`/whiteboards/${teamId}/${whiteboardId}`, whiteboardData);
    return response.data;
  }
};

// Enhanced Analytics Service
export const matriEnhancedAnalyticsService = {
  ...matriAnalyticsService,
  
  getTeamAnalytics: async (teamId: string) => {
    const response = await matriApi.get(`/analytics/${teamId}/team`);
    return response.data;
  },
  
  getTeamStats: async (teamId: string) => {
    const response = await matriApi.get(`/analytics/${teamId}/stats`);
    return response.data;
  }
};

// Export all services - aligned with useMatriApi.ts hooks
export const matriServices = {
  teams: matriTeamService,
  chat: matriChatService,
  tasks: matriTaskService,
  whiteboard: matriEnhancedWhiteboardService,
  ide: matriEnhancedIdeService,
  video: matriVideoService,
  videoCall: matriVideoCallService,
  messages: matriChatService, // Use matriChatService for messages (same API)
  invitations: matriInvitationService,
  analytics: matriEnhancedAnalyticsService,
  socket: matriSocket,
  health: matriHealthService
};

export default matriServices;
