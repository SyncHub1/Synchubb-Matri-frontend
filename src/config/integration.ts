// Integration Configuration for SyncHubb Main Application

export interface IntegrationConfig {
  // Main SyncHubb application URL
  mainAppUrl: string;
  
  // Authentication settings
  auth: {
    // Whether to use external authentication from main app
    useExternalAuth: boolean;
    // Token sharing method
    tokenSharing: 'localStorage' | 'sessionStorage' | 'custom';
    // Token key name
    tokenKey: string;
  };
  
  // Routing settings
  routing: {
    // Base path for Maitri in main app
    basePath: string;
    // Whether to handle routing internally or delegate to main app
    internalRouting: boolean;
  };
  
  // API settings
  api: {
    // Whether to use shared API configuration
    useSharedConfig: boolean;
    // Custom API base URLs (if not using shared config)
    customUrls?: {
      auth?: string;
      media?: string;
      websocket?: string;
    };
  };
  
  // UI/UX settings
  ui: {
    // Whether to show full header/navigation
    showFullHeader: boolean;
    // Whether to embed in main app layout
    embedded: boolean;
    // Custom theme to match main app
    theme?: 'light' | 'dark' | 'system';
  };
}

// Default configuration
export const defaultConfig: IntegrationConfig = {
  mainAppUrl: 'https://www.synchubb.in',
  auth: {
    useExternalAuth: true,
    tokenSharing: 'localStorage',
    tokenKey: 'authToken'
  },
  routing: {
    basePath: '/dashboard/maitri',
    internalRouting: true
  },
  api: {
    useSharedConfig: true
  },
  ui: {
    showFullHeader: false,
    embedded: true,
    theme: 'system'
  }
};

// Environment-based configuration
export const getIntegrationConfig = (): IntegrationConfig => {
  const isEmbedded = import.meta.env.VITE_EMBEDDED_MODE === 'true';
  const useExternalAuth = import.meta.env.VITE_USE_EXTERNAL_AUTH === 'true';
  
  return {
    ...defaultConfig,
    auth: {
      ...defaultConfig.auth,
      useExternalAuth
    },
    ui: {
      ...defaultConfig.ui,
      embedded: isEmbedded,
      showFullHeader: !isEmbedded
    }
  };
};

// Utility functions for integration
export const integrationUtils = {
  // Get the full URL for a Maitri route
  getMaitriUrl: (path: string = ''): string => {
    const config = getIntegrationConfig();
    const baseUrl = config.mainAppUrl;
    const basePath = config.routing.basePath;
    return `${baseUrl}${basePath}${path}`;
  },
  
  // Check if running in embedded mode
  isEmbedded: (): boolean => {
    return getIntegrationConfig().ui.embedded;
  },
  
  // Get authentication token from main app
  getAuthToken: (): string | null => {
    const config = getIntegrationConfig();
    return localStorage.getItem(config.auth.tokenKey);
  },
  
  // Set authentication token for main app
  setAuthToken: (token: string): void => {
    const config = getIntegrationConfig();
    localStorage.setItem(config.auth.tokenKey, token);
  },
  
  // Clear authentication token
  clearAuthToken: (): void => {
    const config = getIntegrationConfig();
    localStorage.removeItem(config.auth.tokenKey);
  },
  
  // Navigate to main app route
  navigateToMainApp: (path: string): void => {
    const config = getIntegrationConfig();
    window.location.href = `${config.mainAppUrl}${path}`;
  },
  
  // Send message to parent window (if embedded)
  sendToParent: (message: any): void => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, '*');
    }
  },
  
  // Listen for messages from parent window
  listenToParent: (callback: (message: any) => void): (() => void) => {
    const handleMessage = (event: MessageEvent) => {
      callback(event.data);
    };
    
    window.addEventListener('message', handleMessage);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }
}; 