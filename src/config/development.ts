// Development configuration for Matri frontend
export const developmentConfig = {
  // API Configuration
  api: {
    matriService: {
      baseUrl: import.meta.env.VITE_MATRI_API_URL || 'http://localhost:3003',
      useProxy: import.meta.env.DEV, // Use proxy in development
      timeout: 15000
    },
    authService: {
      baseUrl: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8000',
      timeout: 10000
    },
    mediaService: {
      baseUrl: import.meta.env.VITE_MEDIA_API_URL || 'http://localhost:3001',
      timeout: 20000
    }
  },

  // Authentication Configuration
  auth: {
    useMockAuth: import.meta.env.VITE_USE_MOCK_AUTH === 'true' || import.meta.env.DEV,
    mockUser: {
      id: 'dev-user-123',
      username: 'developer',
      email: 'dev@synchubb.local',
      avatar: 'https://via.placeholder.com/40/007bff/ffffff?text=DEV'
    },
    tokenKey: 'authToken',
    userKey: 'user'
  },

  // Socket Configuration
  socket: {
    url: import.meta.env.VITE_MATRI_SOCKET_URL || 'http://localhost:3003',
    options: {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    }
  },

  // Feature Flags
  features: {
    enableRealTimeFeatures: true,
    enableVideoChat: true,
    enableWhiteboard: true,
    enableAnalytics: true,
    enableMockData: import.meta.env.DEV,
    debugMode: import.meta.env.DEV
  },

  // Development Tools
  debug: {
    logApiCalls: import.meta.env.DEV,
    logSocketEvents: import.meta.env.DEV,
    showDevTools: import.meta.env.DEV,
    enableTestEndpoints: import.meta.env.DEV
  }
};

export default developmentConfig;
